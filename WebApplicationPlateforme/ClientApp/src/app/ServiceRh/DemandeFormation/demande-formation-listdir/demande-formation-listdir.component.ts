import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserServiceService } from '../../../shared/Services/User/user-service.service';
import { ToastrService } from 'ngx-toastr';
import { NewFormationService } from '../../../shared/Services/ServiceRh/new-formation.service';
import { NewFormation } from '../../../shared/Models/ServiceRh/new-formation.model';
import { NotifService } from '../../../shared/Services/NotifSystem/notif.service';
import { Notif } from '../../../shared/Models/NotifSystem/notif.model';
import { ProgressStatus } from '../../../shared/Interfaces/progress-status';
import { FileServiceService } from '../../../shared/Services/ServiceRh/file-service.service';
import { UploadDownloadService } from '../../../shared/Services/Taches/upload-download.service';
import { FileService } from '../../../shared/Models/ServiceRh/file-service.model';
import { ProgressStatusEnum } from '../../../shared/Enum/progress-status-enum.enum';
import { HttpEventType } from '@angular/common/http';
import { SignalRService, connection, AutomaticNotification } from '../../../shared/Services/signalR/signal-r.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserDetail } from '../../../shared/Models/User/user-detail.model';

@Component({
  selector: 'app-demande-formation-listdir',
  templateUrl: './demande-formation-listdir.component.html',
  styleUrls: ['./demande-formation-listdir.component.css']
})
export class DemandeFormationListdirComponent implements OnInit {
  @Output() public downloadStatus: EventEmitter<ProgressStatus>;
  private routeSub: Subscription;
  constructor(private UserService: UserServiceService,
    private toastr: ToastrService,
    private formationService: NewFormationService,
    private notifService: NotifService,
    public filesService: FileServiceService,
    public serviceupload: UploadDownloadService,
    private route: ActivatedRoute,
    private signalService: SignalRService,) { this.downloadStatus = new EventEmitter<ProgressStatus>(); }


  ngOnInit(): void {
    this.getUserConnected();
    this.GetDotDir();
    this.getCreance();
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

  UserIdConnected: string;
  UserNameConnected: string;
  notif: Notif = new Notif();
  dateTime = new Date();
  getUserConnected() {

    this.UserService.getUserProfileObservable().subscribe(res => {
      this.UserIdConnected = res.id;
      this.UserNameConnected = res.fullName;


    })

  }
  dirId: string;
  dirName: string;

  GetDotDir() {

    this.UserService.GetDotDir().subscribe(resDir => {
      this.notif.userReceiverId = resDir.id;
      this.notif.userReceiverName = resDir.fullName;
      this.dirId = resDir.id;
      this.dirName = resDir.fullName;
    })
  }
  p: Number = 1;
  count: Number = 5;
  factList: NewFormation[] = [];
  userc: UserDetail = new UserDetail();
  Id: number = 0;
  showrow: boolean = false;
  getCreance() {
    this.UserService.getUserProfileObservable().subscribe(res => {
      this.userc = res
      this.routeSub = this.route.params.subscribe(params => {
        if (params['id'] != undefined) {
          this.Id = params['id'];
          this.showrow = true;
          this.formationService.GetDirList(this.Id, this.userc.id).subscribe(res1 => {
            this.factList = res1;
          }, err => { this.getData() })
        } else {
          this.formationService.GetDirListGeneral(this.userc.id).subscribe(res1 => {
            this.factList = res1;
          }, err => { this.getData() })
        }
      });
    });

  }


  getData() {
    this.formationService.GetDirListGeneral(this.UserIdConnected).subscribe(res => {
      this.factList = res;
      this.showrow = false;
    })
  }
  //Populate Form 
  factId: number
  fact: NewFormation = new NewFormation();
  populateForm(facture: NewFormation) {
    this.formationService.formData = Object.assign({}, facture)
    this.factId = facture.id;
    this.fact = Object.assign({}, facture);
    this.filesService.GetFormationFiles(this.fact.id).subscribe(res => {
      this.filesList = res;
    })
  }

  date = new Date().toLocaleDateString();
  autoNotif: AutomaticNotification = new AutomaticNotification();

  accept() {
   // this.fact.etat = "موافقة"
    this.fact.datedir = this.date;
    this.fact.etatdir = "موافقة"
    this.fact.iddir = this.UserIdConnected;
    this.fact.nomdir = this.UserNameConnected;
    this.formationService.PutObservableE(this.fact).subscribe(res => {
      this.notifService.Add(this.notif).subscribe(res => {
        this.autoNotif.serviceId = this.fact.id;
        this.autoNotif.pageUrl = "my-priv-list"
        this.autoNotif.userType = "3";
        this.autoNotif.reponse = "2";
        this.text = " طلب دورة تدريبية ";
        this.signalService.GetConnectionByIdUser(this.notif.userReceiverId).subscribe(res1 => {
          this.userOnline = res1;
          this.signalService.hubConnection.invoke("sendMsg", this.userOnline.signalrId, this.text, this.autoNotif)
            .catch(err => console.error(err));
        }, err => {
          this.autoNotif.receiverName = this.dirName;
          this.autoNotif.receiverId = this.dirId;
          this.autoNotif.transmitterId = this.UserIdConnected;
          this.autoNotif.transmitterName = this.UserNameConnected;
            this.autoNotif.text = " طلب دورة تدريبية ";
          this.autoNotif.vu = "0";


          this.signalService.CreateNotif(this.autoNotif).subscribe(res => {

          })
        })

        this.getCreance();
        this.toastr.success("تم  قبول الطلب بنجاح", "نجاح");
      })
    },
      err => {
        this.toastr.warning('لم يتم  قبول الطلب', ' فشل');
      })

  }
  refuse() {
    //this.fact.etat = "رفض"
    this.fact.datedir = this.date;
    this.fact.etatdir = "رفض"
    this.fact.iddir = this.UserIdConnected;
    this.fact.nomdir = this.UserNameConnected;

    this.formationService.PutObservableE(this.fact).subscribe(res => {

      this.getCreance();
      this.toastr.success("تم  رفض الطلب بنجاح", "نجاح");
      this.showrow = false;
      this.autoNotif.serviceId = this.fact.id;
      this.autoNotif.pageUrl = "new-formation-request-list"
      this.autoNotif.userType = "3";
      this.autoNotif.reponse = "Demander";
      this.text = "لقد تمت معالجة طلب دورة تدريبية";
      this.signalService.GetConnectionByIdUser(this.fact.idUserCreator).subscribe(res1 => {
        this.userOnline = res1;
        this.signalService.hubConnection.invoke("sendMsg", this.userOnline.signalrId, this.text, this.autoNotif)
          .catch(err => console.error(err));
      }, err => {
        this.autoNotif.receiverName = this.fact.userNameCreator;
        this.autoNotif.receiverId = this.fact.idUserCreator;
        this.autoNotif.transmitterId = this.UserIdConnected;
        this.autoNotif.transmitterName = this.UserNameConnected;
          this.autoNotif.text = "لقد تمت معالجة طلب دورة تدريبية"
        this.autoNotif.vu = "0";


        this.signalService.CreateNotif(this.autoNotif).subscribe(res => {

        })
      })

    },
      err => {
        this.toastr.warning('لم يتم رفض الطلب ', ' فشل');
      })
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
}
