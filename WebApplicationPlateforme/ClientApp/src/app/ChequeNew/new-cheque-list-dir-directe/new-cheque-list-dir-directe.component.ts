import { Component, OnInit, ViewChild, EventEmitter, ElementRef, Output, Input } from '@angular/core';
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
import { SignalRService, connection, AutomaticNotification } from '../../shared/Services/signalR/signal-r.service';
import { UserDetail } from '../../shared/Models/User/user-detail.model';
import { FilesPayChequeService } from '../../shared/Services/Cheques/files-pay-cheque.service';
import { UploadDownloadService } from '../../shared/Services/Taches/upload-download.service';
import { ProgressStatus } from '../../shared/Interfaces/progress-status';
import { ProgressStatusEnum } from '../../shared/Enum/progress-status-enum.enum';
import { HttpEventType } from '@angular/common/http';
import { FilesPayChequesC } from '../../shared/Models/Cheques/files-pay-cheques-c.model';

@Component({
  selector: 'app-new-cheque-list-dir-directe',
  templateUrl: './new-cheque-list-dir-directe.component.html',
  styleUrls: ['./new-cheque-list-dir-directe.component.css']
})
export class NewChequeListDirDirecteComponent implements OnInit {
  userDetails;
  @Input() public disabled: boolean;
  @ViewChild('inputFile') inputFile: ElementRef;
  @Output() public downloadStatus: EventEmitter<ProgressStatus>;
  constructor(private demandeService: DemPayChequeService,
    private articleService: ArticlePayChequeService,
    private tbLService: TbListeningService,
    private tbLProjetService: ListeningProjetService,
    private UserService: UserServiceService,
    private router: Router,
    private toastr: ToastrService,
    private notifService: NotifService,
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

  // Get Etab Fin List Comptable
  ComptaList: UserDetail[] = [];
  dirId: string;
  dirName: string;
  GetEtabFinList() {
    this.UserService.GetEtabFinList().subscribe(res => {
      this.ComptaList = res;
    })
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



  // Get User Connected
  sexe: string;
  notif: Notif = new Notif();
  dateTime = new Date();
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
      this.dem6 = this.dem5.filter(item => item.etatdirecteur == "في الإنتظار" && item.iddir == this.UserIdConnected)
      this.prix = null;
      this.numDem = null;
    })
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
  //PopulateForm
  per: DemPayCheque = new DemPayCheque();
  per1: DemPayCheque = new DemPayCheque();
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
  autoNotif: AutomaticNotification = new AutomaticNotification();
  accept() {
    if (this.etat == "مرفوضة") {
      this.per.etatgeneral = this.etat
      this.per.datedir = this.date;
      this.per.etatdirecteur = this.etat
      this.per.nomdir = this.UserNameConnected;
      this.per.attribut5 = this.raisonRefus;

      this.demandeService.PutObservableE(this.per).subscribe(res => {
        this.autoNotif.serviceId = this.per.id;
        this.autoNotif.pageUrl = "pay-chequec-lis"
        this.autoNotif.userType = "0";
        this.autoNotif.reponse = "0";
        this.text = " لقد تم رفض طلب الشيك من قبل " + this.UserNameConnected;
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
          this.autoNotif.vu = "0";


          this.signalService.CreateNotif(this.autoNotif).subscribe(res => {

          })
        })
        this.toastr.success('تم التحديث بنجاح', 'نجاح');
        this.getDemPayList();
       
      })
    }
    else {
      this.per.datedir = this.date;
      this.per.etatdirecteur = this.etat
      this.per.nomdir = this.UserNameConnected;
      // this.per.iddir = this.UserIdConnected;
      this.demandeService.PutObservableE(this.per).subscribe(res => {

        this.UserService.GetEtabFinList().subscribe(res => {
          this.ComptaList = res
          let rand = Math.floor(Math.random() * (1 - 0 + 1) + 0);
          this.dirId = this.ComptaList[rand].id
          this.dirName = this.ComptaList[rand].fullName
          //Send Notification
          this.text = "طلب صرف شيك"
          this.autoNotif.serviceId = this.per.id;
          this.autoNotif.pageUrl = "new-cheque-list-etab-fin"
          this.autoNotif.userType = "5";
          this.autoNotif.reponse = "9";
          this.signalService.GetConnectionByIdUser(this.dirId).subscribe(res1 => {
            this.userOnline = res1;
            this.signalService.hubConnection.invoke("sendMsg", this.userOnline.signalrId, this.text, this.autoNotif)
              .catch(err => console.error(err));
          }, err => {
            this.autoNotif.receiverName = this.dirName;
            this.autoNotif.receiverId = this.dirId;
            this.autoNotif.transmitterId = this.UserIdConnected;
            this.autoNotif.transmitterName = this.UserNameConnected;
              this.autoNotif.text = "طلب صرف شيك"
            this.autoNotif.vu = "0";


            this.signalService.CreateNotif(this.autoNotif).subscribe(res => {

            })
          })
        })


        this.toastr.success('تم التحديث بنجاح', 'نجاح');
        this.getDemPayList();
      
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
