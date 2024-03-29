import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DemissionService } from '../../shared/Services/User Services/demission.service';
import { ToastrService } from 'ngx-toastr';
import { UserServiceService } from '../../shared/Services/User/user-service.service';
import { Demissioon } from '../../shared/Models/User Services/demissioon.model';
import { NgForm } from '@angular/forms';
import { Notif } from '../../shared/Models/NotifSystem/notif.model';
import { NotifService } from '../../shared/Services/NotifSystem/notif.service';
import { SignalRService, connection, AutomaticNotification } from '../../shared/Services/signalR/signal-r.service';
import { ProgressStatus } from '../../shared/Interfaces/progress-status';
import { FileServiceService } from '../../shared/Services/ServiceRh/file-service.service';
import { UploadDownloadService } from '../../shared/Services/Taches/upload-download.service';
import { HttpEventType } from '@angular/common/http';
import { ProgressStatusEnum } from '../../shared/Enum/progress-status-enum.enum';
import { FileService } from '../../shared/Models/ServiceRh/file-service.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UserDetail } from '../../shared/Models/User/user-detail.model';
@Component({
  selector: 'app-demissio-listdir',
  templateUrl: './demissio-listdir.component.html',
  styleUrls: ['./demissio-listdir.component.css']
})
export class DemissioListdirComponent implements OnInit {

  @Output() public downloadStatus: EventEmitter<ProgressStatus>;
  private routeSub: Subscription;
  constructor(private demService: DemissionService,
    private toastr: ToastrService,
    private UserService: UserServiceService,
    private notifService: NotifService,
    private signalService: SignalRService,
    public filesService: FileServiceService,
    public serviceupload: UploadDownloadService,
    private route: ActivatedRoute,) { this.downloadStatus = new EventEmitter<ProgressStatus>(); }



  ngOnInit(): void {
    this.getUserConnected();
    this.CongeList();

    this.getFiles();
    this.userOnLis();
    this.userOffLis();
    this.logOutLis();
    this.getOnlineUsersLis();
    this.sendMsgLis();
    if (this.signalService.hubConnection.state == 1) this.getOnlineUsersInv();
    else {
      this.signalService.ssSubj.subscribe((obj: any) => {
        if (obj.type == "HubConnStarted") {
          this.getOnlineUsersInv();
        }
      });
    }
  }
  //Handle Notification
  // Hub Configuration
  users: connection[] = [];
  dirId: string;
  dirName: string;
  autoNotif: AutomaticNotification = new AutomaticNotification();
  userOnLis(): void {
    this.signalService.hubConnection.on("userOn", (newUser: connection) => {

      this.users.push(newUser);
    });
  }


  // Get Offline Users

  userOffLis(): void {
    this.signalService.hubConnection.on("userOff", (personId: string) => {
      this.users = this.users.filter(u => u.userId != personId);
    });
  }

  logOutLis(): void {
    this.signalService.hubConnection.on("logoutResponse", () => {
      localStorage.removeItem("userId");
      location.reload();
    });
  }

  //Get Online Users

  getOnlineUsersInv(): void {
    this.signalService.hubConnection.invoke("getOnlineUsers")
      .catch(err => console.error(err));
  }


  getOnlineUsersLis(): void {
    this.signalService.hubConnection.on("getOnlineUsersResponse", (onlineUsers: Array<connection>) => {
      this.users = [...onlineUsers];
    });
  }

  //Send Msg 
  text: string;
  sendMsgInv(): void {

    this.signalService.GetConnectionByIdUser(this.dirId).subscribe(res => {
      this.userOnline = res;
      this.signalService.hubConnection.invoke("sendMsg", this.userOnline.signalrId, this.text)
        .catch(err => console.error(err));
    })
  }


  private sendMsgLis(): void {
    this.signalService.hubConnection.on("sendMsgResponse", (connId: string, msg: string, userConSender: string, userConReceiver: string) => {
      let receiver = this.users.find(u => u.signalrId === connId);
    })
  }


  // Get Connected List Users
  getOnlineUsersList(UserIdConnected) {
    this.signalService.GetConnectionList(UserIdConnected).subscribe(res => {
      this.users = res;
    })
  }

  // Test If User Connected
  userOnline: connection = new connection();
  online: boolean;
  TestIfUserConnected(userId): boolean {
    this.signalService.TestIfUserConnected(userId).subscribe(res => {
      this.online = res

    })
    return this.online
  }


  //Dynamic Test of user connected
  userConnected: boolean = false;
  DynamicTestConnected() {
    if (this.users.filter(item => item.userId == this.dirId).length > 0) {
      this.userConnected = true
    }
  }



  //Get UserConnected

  UserIdConnected: string;
  UserNameConnected: string;
  notif: Notif = new Notif();
  dateTime = new Date();


  getUserConnected() {

    this.UserService.getUserProfileObservable().subscribe(res => {
      this.UserIdConnected = res.id;
      this.UserNameConnected = res.fullName;
      this.notif.userTransmitterId = res.id;
      this.notif.userTransmitterName = res.fullName;
      this.notif.dateTime = this.date;
      this.notif.date = this.dateTime.getDate().toString() + '-' + (this.dateTime.getMonth() + 1).toString() + '-' + this.dateTime.getFullYear().toString();
      this.notif.time = this.dateTime.getHours().toString() + ':' + this.dateTime.getMinutes().toString();
      this.notif.TextNotification = " تمت الموافقة على طلب انهاء عقد  من قبل" + ' ' + res.fullName
      this.notif.serviceName = "طلب انهاء عقد"
      this.notif.readUnread = "0";
      this.notif.serviceId = 6;
      this.UserService.GetRhDepartement().subscribe(resDir => {
        this.notif.userReceiverId = resDir.id;
        this.notif.userReceiverName = resDir.fullName;
      })
    })

  }
  //Get Conge Demand Lis

  congeList: Demissioon[] = [];
  dem: Demissioon = new Demissioon();
  filtredCongeList: Demissioon[] = [];
  Id: number = 0;
  userc: UserDetail = new UserDetail();
  showrow: boolean = false;
  CongeList() {
    this.UserService.getUserProfileObservable().subscribe(res => {
      this.userc = res
      this.routeSub = this.route.params.subscribe(params => {
        if (params['id'] != undefined) {
          this.Id = params['id'];
          this.showrow = true;
          this.demService.GetDirList(this.Id, this.userc.id).subscribe(res1 => {
            this.filtredCongeList = res1;
          }, err => { this.getData() })
        } else {
          this.demService.GetDirListGeneral(this.userc.id).subscribe(res1 => {
            this.filtredCongeList = res1;
          }, err => { this.getData() })
        }
      });
    });
  }
  getData() {
    this.demService.GetDirListGeneral(this.userc.id).subscribe(res => {
      this.filtredCongeList = res;
      this.showrow = false;
    })
  }
  per: Demissioon = new Demissioon();
  populateForm(conge: Demissioon) {
    this.demService.formData = Object.assign({}, conge)
    this.per = Object.assign({}, conge)
    this.filesService.GetDemissionFiles(this.per.id).subscribe(res => {
      this.filesList = res;
    })
  }

  date = new Date().toLocaleDateString();

  etat: string;
  etattest(event) {
    this.etat = event.target.value;
  }
  updateRecord(form: NgForm) {
    this.per.datedir = this.date;
    this.per.iddir = this.UserIdConnected;
    this.per.nomdir = this.UserNameConnected;
    this.per.etatdir = this.etat;

    this.demService.PutObservableE(this.per).subscribe(res => {

      this.UserService.GetRhDepartement().subscribe(resDir => {
        this.dirId = resDir.id;
        this.dirName = resDir.fullName
        this.autoNotif.serviceId = this.per.id;
        this.autoNotif.pageUrl = "demission-edit"
        this.autoNotif.userType = "3";
        this.autoNotif.reponse = "11";
        this.autoNotif.vu = "0";
        this.autoNotif.text = "طلب إستقالة";
        this.autoNotif.receiverName = this.dirName;
        this.autoNotif.receiverId = this.dirId;
        this.signalService.GetConnectionByIdUser(this.dirId).subscribe(res1 => {
          this.userOnline = res1;
          this.signalService.hubConnection.invoke("sendMsg", this.userOnline.signalrId, this.text, this.autoNotif)
            .catch(err => console.error(err));
        }, err => {
          this.autoNotif.receiverName = this.dirName;
          this.autoNotif.receiverId = this.dirId;
          this.autoNotif.transmitterId = this.UserIdConnected;
          this.autoNotif.transmitterName = this.UserNameConnected;
            this.autoNotif.text = "طلب إستقالة";

          this.signalService.CreateNotif(this.autoNotif).subscribe(res => {

          })
        })
      })
      this.notifService.Add(this.notif).subscribe(res => {
     
      })

      this.toastr.success('تم التحديث بنجاح', 'نجاح')
      this.CongeList();
      form.resetForm();
 
    },
      err => {
        this.toastr.error('لم يتم التحديث  ', ' فشل');
      }


    )

  }

  onSubmit(form: NgForm) {

    this.updateRecord(form)
  }

  //Download
  filesList: FileService[] = [];
  public files: string[];
  private getFiles() {
    this.serviceupload.getFiles().subscribe(
      data => {
        this.files = data

      }
    );

  }

  public download(filepath) {
    this.downloadStatus.emit({ status: ProgressStatusEnum.START });
    this.serviceupload.downloadFile(filepath).subscribe(
      data => {
        switch (data.type) {
          case HttpEventType.DownloadProgress:
            this.downloadStatus.emit({ status: ProgressStatusEnum.IN_PROGRESS, percentage: Math.round((data.loaded / data.total) * 100) });
            break;
          case HttpEventType.Response:
            this.downloadStatus.emit({ status: ProgressStatusEnum.COMPLETE });
            const downloadedFile = new Blob([data.body], { type: data.body.type });
            const a = document.createElement('a');
            a.setAttribute('style', 'display:none;');
            document.body.appendChild(a);
            a.download = filepath;
            a.href = URL.createObjectURL(downloadedFile);
            a.target = '_blank';
            a.click();
            document.body.removeChild(a);
            break;
        }
      },
      error => {
        this.downloadStatus.emit({ status: ProgressStatusEnum.ERROR });
      }
    );
  }

  p: Number = 1;
  count: Number = 5;
}
