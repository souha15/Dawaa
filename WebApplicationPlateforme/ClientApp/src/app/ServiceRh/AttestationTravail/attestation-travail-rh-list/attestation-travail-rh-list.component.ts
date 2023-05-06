import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserServiceService } from '../../../shared/Services/User/user-service.service';
import { DemandeAttestationTravailService } from '../../../shared/Services/ServiceRh/demande-attestation-travail.service';
import { ToastrService } from 'ngx-toastr';
import { DemandeAttestationTravail } from '../../../shared/Models/ServiceRh/demande-attestation-travail.model';
import { NgForm } from '@angular/forms';
import { ProgressStatus } from '../../../shared/Interfaces/progress-status';
import { UploadDownloadService } from '../../../shared/Services/Taches/upload-download.service';
import { FileServiceService } from '../../../shared/Services/ServiceRh/file-service.service';
import { HttpEventType } from '@angular/common/http';
import { ProgressStatusEnum } from '../../../shared/Enum/progress-status-enum.enum';
import { FileService } from '../../../shared/Models/ServiceRh/file-service.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SignalRService, connection, AutomaticNotification } from '../../../shared/Services/signalR/signal-r.service';

@Component({
  selector: 'app-attestation-travail-rh-list',
  templateUrl: './attestation-travail-rh-list.component.html',
  styleUrls: ['./attestation-travail-rh-list.component.css']
})
export class AttestationTravailRhListComponent implements OnInit {
  @Output() public downloadStatus: EventEmitter<ProgressStatus>;
  private routeSub: Subscription;
  constructor(private UserService: UserServiceService,
    private toastr: ToastrService,
    private atService: DemandeAttestationTravailService,
    public filesService: FileServiceService,
    public serviceupload: UploadDownloadService,
    private signalService: SignalRService,
    private route: ActivatedRoute,) { this.downloadStatus = new EventEmitter<ProgressStatus>(); }



  ngOnInit(): void {
    this.getUserConnected();
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


users: connection[] = [];
dirId: string;
dirName: string;
autoNotif: AutomaticNotification = new AutomaticNotification();

// Hub Configuration

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
    console.log(this.users)
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

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  UserIdConnected: string;
  UserNameConnected: string;

  getUserConnected() {

    this.UserService.getUserProfileObservable().subscribe(res => {
      this.UserIdConnected = res.id;
      this.UserNameConnected = res.fullName;

    })

  }

  factList: DemandeAttestationTravail[] = [];
  GfactList: DemandeAttestationTravail[] = [];
  Id: number = 0;
  showrow: boolean = false;
  getCreance() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.Id = params['id'];
        this.showrow = true;
        this.atService.GetRhList(this.Id).subscribe(res => {
          this.factList = res;
        }, err => {
          this.getData()
        })
      } else {

        this.atService.GetRhListGeneral().subscribe(res1 => {
          this.factList = res1;
        }, err => {
          this.getData();
        })
      }
    });

  }


  getData() {
    this.atService.GetRhListGeneral().subscribe(res1 => {
      this.factList = res1;
      this.showrow = false;
    })
  }


  //Populate Form 
  factId: number
  fact: DemandeAttestationTravail = new DemandeAttestationTravail();
  populateForm(facture: DemandeAttestationTravail) {
    this.atService.formData = Object.assign({}, facture)
    this.factId = facture.id;
    this.fact = Object.assign({}, facture);
    this.filesService.GetAttestationTravailFiles(this.fact.id).subscribe(res => {
      this.filesList = res;
    })
  }
  reason: string;
  getRefuseRaison(event) {
    this.reason = event.target.value;
  }
  date = new Date().toLocaleDateString();
  accept() {
    this.fact.etat = "موافقة"
    this.fact.daterh = this.date;
    this.fact.etatrh ="موافقة"
    this.fact.idrh = this.UserIdConnected;
    this.fact.nomrh = this.UserNameConnected;
    this.atService.PutObservableE(this.fact).subscribe(res => {
      this.getCreance();
      this.showrow = false;
      this.autoNotif.serviceId = this.fact.id;
      this.autoNotif.pageUrl = "attestation-travail-lis"
      this.autoNotif.userType = "3";
      this.autoNotif.reponse = "Demander";
      this.text = "لقد تمت معالجة طلب  شهادة عمل";
      this.signalService.GetConnectionByIdUser(this.fact.idUserCreator).subscribe(res1 => {
        this.userOnline = res1;
        this.signalService.hubConnection.invoke("sendMsg", this.userOnline.signalrId, this.text, this.autoNotif)
          .catch(err => console.error(err));
      }, err => {
        this.autoNotif.receiverName = this.fact.userNameCreator;
          this.autoNotif.receiverId = this.fact.idUserCreator;
        this.autoNotif.transmitterId = this.UserIdConnected;
        this.autoNotif.transmitterName = this.UserNameConnected;
          this.text = "لقد تمت معالجة طلب  شهادة عمل"
        this.autoNotif.vu = "0";


        this.signalService.CreateNotif(this.autoNotif).subscribe(res => {

        })
      })
      this.toastr.success("تم  قبول الطلب بنجاح", "نجاح");
    },
      err => {
        this.toastr.warning('لم يتم  قبول الطلب', ' فشل');
      })

  }
  refuse() {
    this.fact.etat = "رفض"
    this.fact.daterh = this.date;
    this.fact.etatrh = "رفض"
    this.fact.idrh = this.UserIdConnected;
    this.fact.nomrh = this.UserNameConnected;
    this.fact.attribut6 = this.reason

    this.atService.PutObservableE(this.fact).subscribe(res => {
      this.getCreance();
      this.showrow = false;
      this.autoNotif.serviceId = this.fact.id;
      this.autoNotif.pageUrl = "attestation-travail-lis"
      this.autoNotif.userType = "3";
      this.autoNotif.reponse = "Demander";
      this.text = "لقد تمت معالجة طلب  شهادة عمل";
      this.signalService.GetConnectionByIdUser(this.fact.idUserCreator).subscribe(res1 => {
        this.userOnline = res1;
        this.signalService.hubConnection.invoke("sendMsg", this.userOnline.signalrId, this.text, this.autoNotif)
          .catch(err => console.error(err));
      }, err => {
        this.autoNotif.receiverName = this.fact.userNameCreator;
        this.autoNotif.receiverId = this.fact.idUserCreator;
        this.autoNotif.transmitterId = this.UserIdConnected;
        this.autoNotif.transmitterName = this.UserNameConnected;
        this.text = "لقد تمت معالجة طلب  شهادة عمل"
        this.autoNotif.vu = "0";


        this.signalService.CreateNotif(this.autoNotif).subscribe(res => {

        })
      })
        this.toastr.success("تم  رفض الطلب بنجاح", "نجاح");
      },
        err => {
          this.toastr.warning('لم يتم رفض الطلب ', ' فشل');
        })
    }
  p: Number = 1;

  count: Number = 5;
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
