import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { ChangerRib } from '../../shared/Models/ChangeRib/changer-rib.model';
import { ChangerRibService } from '../../shared/Services/ChangeRib/changer-rib.service';
import { FilesChangerRibService } from '../../shared/Services/ChangeRib/files-changer-rib.service';
import { ToastrService } from 'ngx-toastr';
import { UserServiceService } from '../../shared/Services/User/user-service.service';
import { ServiceBanque } from '../../shared/Models/Comptes/service-banque.model';
import { ServiceBanqueLisComponent } from '../../Comptes/service-banque-lis/service-banque-lis.component';
import { ServiceBanqueService } from '../../shared/Services/Comptes/service-banque.service';
import { UploadDownloadService } from '../../shared/Services/Taches/upload-download.service';
import { ProgressStatus } from '../../shared/Interfaces/progress-status';
import { ProgressStatusEnum } from '../../shared/Enum/progress-status-enum.enum';
import { HttpEventType } from '@angular/common/http';
import { FilesChangerRib } from '../../shared/Models/ChangeRib/files-changer-rib.model';
import { NgForm } from '@angular/forms';
import { UserDetail } from '../../shared/Models/User/user-detail.model';
import { SignalRService, connection, AutomaticNotification } from '../../shared/Services/signalR/signal-r.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-change-rib-rh-list',
  templateUrl: './change-rib-rh-list.component.html',
  styleUrls: ['./change-rib-rh-list.component.css']
})
export class ChangeRibRhListComponent implements OnInit {
  @Input() public disabled: boolean;
  @Input() public fileName: string;
  @Output() public downloadStatus: EventEmitter<ProgressStatus>;
  @ViewChild('htmlData') htmlData: ElementRef;
  private routeSub: Subscription;
  constructor(private demService: ChangerRibService,
    private filesService: FilesChangerRibService,
    private toastr: ToastrService,
    private UserService: UserServiceService,
    public serviceupload: UploadDownloadService,
    private signalService: SignalRService,
    private route: ActivatedRoute,) {
    this.downloadStatus = new EventEmitter<ProgressStatus>();
  }

  ngOnInit(): void {
    this.getUserConnected();
    this.GetDemandList();
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
  p: Number = 1;

  count: Number = 5;
  //Get User Connected

  UserIdConnected: string;
  UserNameConnected: string;
  user: UserDetail = new UserDetail();
  getUserConnected() {
    this.UserService.getUserProfileObservable().subscribe(res => {
      this.UserIdConnected = res.id;
      this.UserNameConnected = res.fullName
      
    })
  }
  /* Demand List */

  DemandList: ChangerRib[] = [];
  Idd: number = 0;
  showrow: boolean = false;
  GetDemandList() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.Idd = params['id'];
        this.showrow = true;
        this.demService.GetRhList(this.Idd).subscribe(res => {
          this.DemandList = res;
        }, err => {
          this.getData()
        })
      } else {

        this.demService.GetRhListGeneral().subscribe(res1 => {
          this.DemandList = res1;
        }, err => {
          this.getData();
        })
      }
    });
  }

  getData() {
    this.demService.GetRhListGeneral().subscribe(res1 => {
      this.DemandList = res1;
      this.showrow = false;
    })
  }
  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
  /* Populate Form */

  dem: ChangerRib = new ChangerRib();
  oc: boolean = false;
  ho: boolean = false;
  Id: number;
  populateForm(dem: ChangerRib) {
    this.dem = Object.assign({}, dem);
    this.Id = this.dem.id;
    this.GetfilesList();
    this.UserService.GetUserById(this.dem.idUserCreator).subscribe(res => {
      this.user = res
    })
  }

  // Files List
  listfiles: FilesChangerRib[] = [];
  Listfiles: FilesChangerRib[] = [];
  TestListFiles: boolean = false;
  GetfilesList() {
    this.filesService.List().subscribe(res => {
      this.Listfiles = res;
      this.listfiles = this.Listfiles.filter(item => item.idDem == this.Id)
      if (this.listfiles.length != 0) {
        this.TestListFiles = true;
      } else {
        this.TestListFiles = false;
      }
    })
  }
  /*** Accepter *****/

  date = new Date().toLocaleDateString();
  accept() {
    this.dem.etatrh = "موافقة"
    this.dem.daterh = this.date
    this.dem.idrh = this.UserIdConnected;
    this.dem.nomrh = this.UserNameConnected;
    this.user.dateQualification = this.dem.rib
    this.user.faculteEcole = this.dem.nomBanque
    this.demService.PutObservableE(this.dem).subscribe(res => {
      this.GetDemandList();
      this.showrow = false;
      this.autoNotif.serviceId = this.dem.id;
      this.autoNotif.pageUrl = "change-rib-user-list"
      this.autoNotif.userType = "3";
      this.autoNotif.reponse = "Demander";
      this.text = "لقد تمت معالجة طلب تعديل حساب بنكي";
      this.signalService.GetConnectionByIdUser(this.dem.idUserCreator).subscribe(res1 => {
        this.userOnline = res1;
        this.signalService.hubConnection.invoke("sendMsg", this.userOnline.signalrId, this.text, this.autoNotif)
          .catch(err => console.error(err));
      }, err => {
        this.autoNotif.receiverName = this.dem.userNameCreator;
        this.autoNotif.receiverId = this.dem.idUserCreator;
        this.autoNotif.transmitterId = this.UserIdConnected;
        this.autoNotif.transmitterName = this.UserNameConnected;
          this.text = "لقد تمت معالجة طلب تعديل حساب بنكي"
        this.autoNotif.vu = "0";


        this.signalService.CreateNotif(this.autoNotif).subscribe(res => {

        })
      })
      this.UserService.PutObservable(this.user).subscribe(res => {
        
        this.toastr.success("تم  قبول الطلب بنجاح و تعديل بيانات الموظف", "نجاح");
      })

    },
      err => {
        this.toastr.warning('لم يتم  قبول الطلب', ' فشل');
      })

  }

  /**  Refuser **/

  refuse() {
    this.dem.etatrh = "رفض"
    this.dem.daterh = this.date
    this.dem.idrh = this.UserIdConnected;
    this.dem.nomrh = this.UserNameConnected;

    this.demService.PutObservableE(this.dem).subscribe(res => {

      this.GetDemandList();
      this.showrow = false;
      this.autoNotif.serviceId = this.dem.id;
      this.autoNotif.pageUrl = "change-rib-user-list"
      this.autoNotif.userType = "3";
      this.autoNotif.reponse = "Demander";
      this.text = "لقد تمت معالجة طلب تعديل حساب بنكي";
      this.signalService.GetConnectionByIdUser(this.dem.idUserCreator).subscribe(res1 => {
        this.userOnline = res1;
        this.signalService.hubConnection.invoke("sendMsg", this.userOnline.signalrId, this.text, this.autoNotif)
          .catch(err => console.error(err));
      }, err => {
        this.autoNotif.receiverName = this.dem.userNameCreator;
        this.autoNotif.receiverId = this.dem.idUserCreator;
        this.autoNotif.transmitterId = this.UserIdConnected;
        this.autoNotif.transmitterName = this.UserNameConnected;
        this.text = "لقد تمت معالجة طلب تعديل حساب بنكي"
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


  //Download

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
