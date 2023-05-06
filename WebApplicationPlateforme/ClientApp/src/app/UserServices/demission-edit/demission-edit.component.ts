import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { DemissionService } from '../../shared/Services/User Services/demission.service';
import { ToastrService } from 'ngx-toastr';
import { UserServiceService } from '../../shared/Services/User/user-service.service';
import { Demissioon } from '../../shared/Models/User Services/demissioon.model';
import { NgForm } from '@angular/forms';
import { ReceptionEquipementService } from '../../shared/Services/ServiceRh/reception-equipement.service';
import { ReceptionEquipement } from '../../shared/Models/ServiceRh/reception-equipement.model';
import { ProgressStatus } from '../../shared/Interfaces/progress-status';
import { FileServiceService } from '../../shared/Services/ServiceRh/file-service.service';
import { UploadDownloadService } from '../../shared/Services/Taches/upload-download.service';
import { HttpEventType } from '@angular/common/http';
import { ProgressStatusEnum } from '../../shared/Enum/progress-status-enum.enum';
import { FileService } from '../../shared/Models/ServiceRh/file-service.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SignalRService, connection, AutomaticNotification } from '../../shared/Services/signalR/signal-r.service';
import { UserDetail } from '../../shared/Models/User/user-detail.model';
@Component({
  selector: 'app-demission-edit',
  templateUrl: './demission-edit.component.html',
  styleUrls: ['./demission-edit.component.css']
})
export class DemissionEditComponent implements OnInit {
  @Output() public downloadStatus: EventEmitter<ProgressStatus>;
  private routeSub: Subscription;
  constructor(private demService: DemissionService,
    private toastr: ToastrService,
    private UserService: UserServiceService,
    private trinService: ReceptionEquipementService,
    public filesService: FileServiceService,
    public serviceupload: UploadDownloadService,
    private route: ActivatedRoute,
    private signalService: SignalRService,) { this.downloadStatus = new EventEmitter<ProgressStatus>(); }



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
  Id: number = 0;
  showrow: boolean = false;
  dirId: string;
  dirName: string;
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

  recList: ReceptionEquipement[] = [];
  rec: ReceptionEquipement[] = [];
  getUserConnected() {

    this.UserService.getUserProfileObservable().subscribe(res => {
      this.UserIdConnected = res.id;
      this.UserNameConnected = res.fullName;

    })

  }
  //Get Conge Demand Lis

  congeList: Demissioon[] = [];
  dem: Demissioon = new Demissioon();
  filtredCongeList: Demissioon[] = [];
  userc: UserDetail = new UserDetail();
  CongeList() {
    this.UserService.getUserProfileObservable().subscribe(res => {
      this.userc = res
      this.routeSub = this.route.params.subscribe(params => {
        if (params['id'] != undefined) {
          this.Id = params['id'];
          this.showrow = true;
          this.demService.GetRhList(this.Id).subscribe(res1 => {
            this.filtredCongeList = res1;
          }, err => { this.getData() })
        } else {
          this.demService.GetRhListGeneral().subscribe(res1 => {
            this.filtredCongeList = res1;
          }, err => { this.getData() })
        }
      });
    });
  }

  getData() {
    this.demService.GetRhListGeneral().subscribe(res => {
      this.filtredCongeList = res;
      this.showrow = false;
    })
  }
  openInNewTab(url) {
    window.open(url, '_blank').focus();
  }

  per: Demissioon = new Demissioon();
  testEqui: boolean = false;
  populateForm(conge: Demissioon) {
    this.demService.formData = Object.assign({}, conge)
    this.per = Object.assign({}, conge)
    this.filesService.GetDemissionFiles(this.per.id).subscribe(res => {
      this.filesList = res
    })
    this.trinService.Get().subscribe(res => {
      this.recList = res
      this.rec = this.recList.filter(item => item.userId == this.per.idUserCreator && item.attribut2 == "1")
      if (this.rec.length == 0) {
        this.testEqui = true;
      } else {
        this.testEqui = false;
      }
    })

  }

  date = new Date().toLocaleDateString();

  etat: string;
  etattest(event) {
    this.etat = event.target.value;
  }

  autoNotif: AutomaticNotification = new AutomaticNotification();

  updateRecord(form: NgForm) {
    this.per.daterh = this.date;
    this.per.etatrh = this.etat;
    this.per.etat = this.etat;
    this.per.idrh = this.UserIdConnected;
    this.per.nomrh = this.UserNameConnected;
    this.demService.PutObservableE(this.per).subscribe(res => {

      this.showrow = false;
      this.autoNotif.serviceId = this.per.id;
      this.autoNotif.pageUrl = "demissio-list"
      this.autoNotif.userType = "3";
      this.autoNotif.reponse = "Demander";
      this.text = "لقد تمت معالجة طلب  إستقالة";
      this.signalService.GetConnectionByIdUser(this.per.idUserCreator).subscribe(res1 => {
        this.userOnline = res1;
        this.signalService.hubConnection.invoke("sendMsg", this.userOnline.signalrId, this.text, this.autoNotif)
          .catch(err => console.error(err));
      }, err => {
        this.autoNotif.receiverName = this.per.creatorName;
        this.autoNotif.receiverId = this.per.idUserCreator;
        this.autoNotif.transmitterId = this.UserIdConnected;
        this.autoNotif.transmitterName = this.UserNameConnected;
          this.autoNotif.text = "لقد تمت معالجة طلب إستقالة"
        this.autoNotif.vu = "0";


        this.signalService.CreateNotif(this.autoNotif).subscribe(res => {

        })
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
    if (this.testEqui) {
      this.updateRecord(form)
    } else {
      this.toastr.error('يجب اخلاء العهد  ', ' فشل');
    }
  
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
