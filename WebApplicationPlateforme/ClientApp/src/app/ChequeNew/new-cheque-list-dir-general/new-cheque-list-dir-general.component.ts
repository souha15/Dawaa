import { Component, OnInit, EventEmitter, ElementRef, Input, Output, ViewChild } from '@angular/core';
import { DemPayChequeService } from '../../shared/Services/Cheques/dem-pay-cheque.service';
import { ArticlePayChequeService } from '../../shared/Services/Cheques/article-pay-cheque.service';
import { TbListeningService } from '../../shared/Services/Evenements/tb-listening.service';
import { ListeningProjetService } from '../../shared/Services/Projets/listening-projet.service';
import { UserServiceService } from '../../shared/Services/User/user-service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DemPayCheque } from '../../shared/Models/Cheques/dem-pay-cheque.model';
import { ArticlePayCheque } from '../../shared/Models/Cheques/article-pay-cheque.model';
import { NotifService } from '../../shared/Services/NotifSystem/notif.service';
import { Notif } from '../../shared/Models/NotifSystem/notif.model';
import { UploadDownloadService } from '../../shared/Services/Taches/upload-download.service';
import { FilesPayChequeService } from '../../shared/Services/Cheques/files-pay-cheque.service';
import { ProgressStatus } from '../../shared/Interfaces/progress-status';
import { ProgressStatusEnum } from '../../shared/Enum/progress-status-enum.enum';
import { HttpEventType } from '@angular/common/http';
import { FilesPayChequesC } from '../../shared/Models/Cheques/files-pay-cheques-c.model';
import { SignalRService, connection, AutomaticNotification } from '../../shared/Services/signalR/signal-r.service';

@Component({
  selector: 'app-new-cheque-list-dir-general',
  templateUrl: './new-cheque-list-dir-general.component.html',
  styleUrls: ['./new-cheque-list-dir-general.component.css']
})
export class NewChequeListDirGeneralComponent implements OnInit {

  userDetails;
  @Input() public disabled: boolean;
  @ViewChild('inputFile') inputFile: ElementRef;
  @Output() public downloadStatus: EventEmitter<ProgressStatus>;
  constructor(private demandeService: DemPayChequeService,
    private articleService: ArticlePayChequeService,
    private UserService: UserServiceService,
    private router: Router,
    private toastr: ToastrService,
    private signalService: SignalRService,
    public filesService: FilesPayChequeService,
    public serviceupload: UploadDownloadService, ) { this.downloadStatus = new EventEmitter<ProgressStatus>(); }


  ngOnInit(): void {
    //this.getVoiture();
    this.getUserConnected();
    this.UserService.getUserProfile().subscribe(
      res => {
        this.userDetails = res;


      },
      err => {
        console.log(err);
      },
    );
    this.getUserConnected();
    this.getDemPayList();

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
  isExpanded = false;

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  onLogout() {
    localStorage.removeItem("token");
    this.router.navigateByUrl('/login-page');
  }


  // Get User Connected
  p: Number = 1;
  count: Number = 5;
  UserIdConnected: string;
  UserNameConnected: string;

  notif: Notif = new Notif();
  dateTime = new Date();


  // Get User Connected
  sexe: string;

  getUserConnected() {

    this.UserService.getUserProfileObservable().subscribe(res => {
      this.UserIdConnected = res.id;
      this.UserNameConnected = res.fullName;
      this.sexe = res.sexe;
    })
  }



  //Get Dem pay ListProject
  dem5: DemPayCheque[] = [];
  dem6: DemPayCheque[] = [];
  arlis: ArticlePayCheque[] = [];
  arlis2: ArticlePayCheque[] = [];
  getDemPayList() {
    this.demandeService.Get().subscribe(res => {
      this.dem5 = res
      this.dem6 = this.dem5.filter(item => item.etatadmin == "في الإنتظار" && item.etatparfinancier == "معتمدة")
      this.prix = null;
      this.numDem = null;
    })
  }


  //PopulateForm
  per: DemPayCheque = new DemPayCheque();
  filesListFiltred: FilesPayChequesC[] = [];
  filesList: FilesPayChequesC[] = [];

  populateForm(conge: DemPayCheque) {
    this.per = Object.assign({}, conge)
    this.filesService.Get().subscribe(res => {
      this.filesList = res
      this.filesListFiltred = this.filesList.filter(item => item.idDemCheque == this.per.id);
    })
    this.articleService.Get().subscribe(res => {
      this.arlis2 = res;
      this.arlis = this.arlis2.filter(item => item.idDem == this.per.id)

    })
  }

  etat: string;
  etattest(event) {
    this.etat = event.target.value;
    if (this.etat == "مرفوضة") {
      this.testRefus = true;
    } else {
      this.testRefus = false;
    }

  }
  testRefus: boolean = false;
  raisonRefus: string;
  TestraisonRefus(event) {
    this.raisonRefus = event.target.value;
  }


  date = new Date().toLocaleDateString();
  accept() {
    if (this.etat == "مرفوضة") {
      this.per.etatgeneral = "مرفوضة"
      this.per.attribut5 = this.raisonRefus;
      this.per.dateadmin = this.date;
      this.per.etatadmin = this.etat
      this.per.nomadmin = this.UserNameConnected;
      this.per.idadmin = this.UserIdConnected;
      this.demandeService.PutObservableE(this.per).subscribe(res => {
        this.text = " لقد تم رفض طلب الشيك من قبل " + this.UserNameConnected;
        this.autoNotif.serviceId = this.per.id;
        this.autoNotif.pageUrl = "pay-chequec-lis"
        this.autoNotif.userType = "2";
        this.autoNotif.reponse = "9";
        this.autoNotif.vu = "0";
        this.signalService.GetConnectionByIdUser(this.per.idUserCreator).subscribe(res1 => {
          this.userOnline = res1;
          this.signalService.hubConnection.invoke("sendMsg", this.userOnline.signalrId, this.text, this.autoNotif)
            .catch(err => console.error(err));
        }, err => {
            this.autoNotif.receiverName = this.per.idUserCreator;
            this.autoNotif.receiverId = this.per.creatorName;
          this.autoNotif.transmitterId = this.UserIdConnected;
          this.autoNotif.transmitterName = this.UserNameConnected;
            this.autoNotif.text = " لقد تم رفض طلب الشيك من قبل " + this.UserNameConnected;

          this.signalService.CreateNotif(this.autoNotif).subscribe(res => {

          })
        })
        this.toastr.success('تم التحديث بنجاح', 'نجاح');
        this.getUserConnected()
        this.getDemPayList();



      })
    } else {

      this.per.etatgeneral = this.etat
    this.per.dateadmin = this.date;
    this.per.etatadmin = this.etat
    this.per.nomadmin = this.UserNameConnected;
    this.per.idadmin = this.UserIdConnected;
    this.demandeService.PutObservableE(this.per).subscribe(res => {
      this.text = "لقد تمت الموافقة على طلب الشيك";
      this.autoNotif.serviceId =this.per.id;
      this.autoNotif.pageUrl = "pay-chequec-lis";
      this.autoNotif.userType = "2";
      this.autoNotif.reponse = "9";
      this.autoNotif.vu = "0";
      this.signalService.GetConnectionByIdUser(this.per.idUserCreator).subscribe(res1 => {
        this.userOnline = res1;
        this.signalService.hubConnection.invoke("sendMsg", this.userOnline.signalrId, this.text, this.autoNotif)
          .catch(err => console.error(err));
      }, err => {
          this.autoNotif.receiverName = this.per.idUserCreator;
          this.autoNotif.receiverId = this.per.creatorName;
        this.autoNotif.transmitterId = this.UserIdConnected;
        this.autoNotif.transmitterName = this.UserNameConnected;
          this.autoNotif.text = "لقد تمت الموافقة على طلب الشيك";

        this.signalService.CreateNotif(this.autoNotif).subscribe(res => {

        })
      })
        this.toastr.success('تم التحديث بنجاح', 'نجاح');
        this.getUserConnected()
        this.getDemPayList();
  


    })
    }

  }


  numDem: number = null;
  getnumDem(event) {
    this.numDem = event.target.value;
  }
  prix: string = null;
  getprix(event) {
    this.prix = event.target.value;
  }

  search() {
    if (this.prix != null && this.numDem == null) {
      this.demandeService.SearchByPrix(this.prix).subscribe(res => {
        this.dem6 = res;
      })
    } else if (this.prix == null && this.numDem != null) {
      this.demandeService.SearchByNumDem(this.numDem).subscribe(res => {
        this.dem6 = res;
      })
    } else if (this.prix != null && this.numDem != null) {
      this.demandeService.SearchByPrixNumDem(this.numDem, this.prix).subscribe(res => {
        this.dem6 = res;
      })
    }
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
