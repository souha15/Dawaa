import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ProgressStatus } from '../../shared/Interfaces/progress-status';
import { UserServiceService } from '../../shared/Services/User/user-service.service';
import { UploadDownloadService } from '../../shared/Services/Taches/upload-download.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { PathSharedService } from '../../shared/path-shared.service';
import { ToastrService } from 'ngx-toastr';
import { PlaintService } from '../../shared/Services/User Services/plaint.service';
import { FilesPlaintFilesService } from '../../shared/Services/User Services/plaint-files.service';
import { FilesPlaint } from '../../shared/Models/User Services/files-plaint.model';
import { ProgressStatusEnum } from '../../shared/Enum/progress-status-enum.enum';
import { Plaint } from '../../shared/Models/User Services/plaint.model';
import { NgForm } from '@angular/forms';
import { UserDetail } from '../../shared/Models/User/user-detail.model';
import { AutomaticNotification, SignalRService, connection } from '../../shared/Services/signalR/signal-r.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-plaint-listdir',
  templateUrl: './plaint-listdir.component.html',
  styleUrls: ['./plaint-listdir.component.css']
})
export class PlaintListdirComponent implements OnInit {
  private routeSub: Subscription;
  constructor(private plaintService: PlaintService,
    private FilesService: FilesPlaintFilesService,
    private UserService: UserServiceService,
    public serviceupload: UploadDownloadService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private signalService: SignalRService,) { }

  ngOnInit(): void {
    this.getUserConnected()
    this.CongeList();
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


  //Get UserConnected
  dirId: string;
  dirName: string;
  UserIdConnected: string;
  UserNameConnected: string;


  getUserConnected() {

    this.UserService.getUserProfileObservable().subscribe(res => {
      this.UserIdConnected = res.id;
      this.UserNameConnected = res.fullName;
    })

  }

  //Get Conge Demand Lis

  congeList: Plaint[] = [];
  dem: Plaint = new Plaint();
  filtredCongeList: Plaint[] = [];
  Id: number = 0;
  showrow: boolean = false;
  userc: UserDetail = new UserDetail();
  CongeList() {
    this.UserService.getUserProfileObservable().subscribe(res => {
      this.userc = res
      this.routeSub = this.route.params.subscribe(params => {
        if (params['id'] != undefined) {
          this.Id = params['id'];
          this.showrow = true;
          this.plaintService.GetDirList(this.Id, this.userc.id).subscribe(res1 => {
            this.filtredCongeList = res1;
          }, err => { this.getData() })
        } else {
          this.plaintService.GetDirListGeneral(this.userc.id).subscribe(res1 => {
            this.filtredCongeList = res1;
          }, err => { this.getData() })
        }
      });
    });
  }
  autoNotif: AutomaticNotification = new AutomaticNotification();
  getData() {
    this.plaintService.GetDirListGeneral(this.UserIdConnected).subscribe(res => {
      this.filtredCongeList = res;
      this.showrow = false;
    })
  }
  p: Number = 1;
  count: Number = 5;

  populateForm(conge: Plaint) {
    this.plaintService.formData = Object.assign({}, conge)
    this.dem = Object.assign({}, conge)
    this.dirId = this.dem.iddir;
    this.dirName = this.dem.nomdir;

  }

  isValidFormSubmitted = false;
  path: string;
  date = new Date().toLocaleDateString();
  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.isValidFormSubmitted = false;
    }
    else {
      this.isValidFormSubmitted = true
      this.dem.datedir = this.date;
      this.dem.iddir = this.UserIdConnected;
      this.dem.nomdir = this.UserNameConnected

      this.plaintService.PutObservableE(this.dem).subscribe(res => {
        this.toastr.success("تمت الإضافة بنجاح", "نجاح");
        this.CongeList();
        form.resetForm();
        this.showrow = false;
        this.autoNotif.serviceId = this.dem.id;
        this.autoNotif.pageUrl = "plaint-list"
        this.autoNotif.userType = "3";
        this.autoNotif.reponse = "Demander";
        this.text = "لقد تمت معالجة طلب شكوى";
        this.signalService.GetConnectionByIdUser(this.dem.idUserCreator).subscribe(res1 => {
          this.userOnline = res1;
          this.signalService.hubConnection.invoke("sendMsg", this.userOnline.signalrId, this.text, this.autoNotif)
            .catch(err => console.error(err));
        }, err => {
          this.autoNotif.receiverName = this.dem.creatorName;
          this.autoNotif.receiverId = this.dem.idUserCreator;
          this.autoNotif.transmitterId = this.UserIdConnected;
          this.autoNotif.transmitterName = this.UserNameConnected;
            this.autoNotif.text = "لقد تمت معالجة طلب شكوى"
          this.autoNotif.vu = "0";


          this.signalService.CreateNotif(this.autoNotif).subscribe(res => {

          })
        })
      },
        err => {
          this.toastr.error("لم يتم التسجيل", "فشل في التسجيل");
        })
    }
  }

}
