import { Component, OnInit } from '@angular/core';
import { RecrutementService } from '../../../shared/Services/Rh/recrutement.service';
import { ToastrService } from 'ngx-toastr';
import { UserServiceService } from '../../../shared/Services/User/user-service.service';
import { NgForm } from '@angular/forms';
import { UserDetail } from '../../../shared/Models/User/user-detail.model';
import { Recrutement } from '../../../shared/Models/RH/recrutement.model';
import { SignalRService, connection, AutomaticNotification } from '../../../shared/Services/signalR/signal-r.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recrutmenet-dir-list',
  templateUrl: './recrutmenet-dir-list.component.html',
  styleUrls: ['./recrutmenet-dir-list.component.css']
})
export class RecrutmenetDirListComponent implements OnInit {
  private routeSub: Subscription;
  constructor(private congeService: RecrutementService,
    private toastr: ToastrService,
    private UserService: UserServiceService,
    private signalService: SignalRService,
    private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.getUserConnected();
    this.getRhDir();
    this.CongeList();
    this.resetForm();
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

  p: Number = 1;
  count: Number = 5;
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
  GetRhDir() {
    this.UserService.GetRhDepartement().subscribe(res => {
      this.dirId = res.id;
      this.dirName = res.fullName;
    })
  }

  //Get UserConnected

  UserIdConnected: string;
  UserNameConnected: string;
  adminisgtrationName: any;
  userc: UserDetail = new UserDetail();

  getUserConnected() {

    this.UserService.getUserProfileObservable().subscribe(res => {
      this.userc = res
      this.UserIdConnected = res.id;
      this.UserNameConnected = res.fullName;

    })

  }

  congeList: Recrutement[] = [];
  filtredCongeList: Recrutement[] = [];
  Id: number = 0;
  showrow: boolean = false;
  CongeList() {
    this.UserService.getUserProfileObservable().subscribe(res => {
      this.userc = res
      this.routeSub = this.route.params.subscribe(params => {
        if (params['id'] != undefined) {
          this.Id = params['id'];
          this.showrow = true;
          this.congeService.GetDirList(this.Id, this.userc.id).subscribe(res1 => {
            this.filtredCongeList = res1;
          }, err => { this.getData() })
        } else {
          this.congeService.GetDirListGeneral(this.userc.id).subscribe(res1 => {
            this.filtredCongeList = res1;
          }, err => { this.getData() })
        }
      });
    });
  }

  getData() {
    this.congeService.GetDirListGeneral(this.UserIdConnected).subscribe(res => {
      this.filtredCongeList = res;
      this.showrow = false;
    })
  }
  per: Recrutement = new Recrutement();

  populateForm(conge: Recrutement) {
    this.per = Object.assign({}, conge)
    this.congeService.formData = Object.assign({}, conge)
  }



  perc: string;
 
  percentageetat(event) {
    this.perc = event.target.value;
    if (this.perc == "موافق") {
      this.congeService.formData.attribut3 ="50%"
    }
  }

  getRhDir() {
    this.UserService.GetRhDepartement().subscribe(res => {
      this.dirId = res.id;
      this.dirName = res.fullName;

    })
  }
  date = new Date().toLocaleDateString();
  conge: Recrutement = new Recrutement();
  autoNotif: AutomaticNotification = new AutomaticNotification();
  updateRecord(form: NgForm) {

    this.conge = Object.assign(this.conge, form.value);
    this.congeService.formData.dated = this.date;
    this.congeService.formData.etatdir = this.perc;
    this.congeService.Edit().subscribe(res => {
      this.autoNotif.serviceId = this.per.id;
      this.autoNotif.pageUrl = "rh-recrutment-list"
      this.autoNotif.userType = "3";
      this.autoNotif.reponse = "2";
      this.text = " طلب انتداب ";
      this.autoNotif.text = " طلب انتداب ";
      this.signalService.GetConnectionByIdUser(this.dirId).subscribe(res1 => {
        this.userOnline = res1;
        this.signalService.hubConnection.invoke("sendMsg", this.userOnline.signalrId, this.text, this.autoNotif)
          .catch(err => console.error(err));
      }, err => {
        this.autoNotif.receiverName = this.dirName;
        this.autoNotif.receiverId = this.dirId;
        this.autoNotif.transmitterId = this.UserIdConnected;
        this.autoNotif.transmitterName = this.UserNameConnected;
          this.autoNotif.text = " طلب انتداب ";
        this.autoNotif.vu = "0";


        this.signalService.CreateNotif(this.autoNotif).subscribe(res => {

        })
      })
      this.toastr.success('تم التحديث بنجاح', 'نجاح')
      this.resetForm();
      this.CongeList();
    },
      err => {
        this.toastr.error('لم يتم التحديث  ', ' فشل');
      }


    )

  }

  onSubmit(form: NgForm) {

    this.updateRecord(form)
  }
  resetForm(form?: NgForm) {

    if (form != null)
      form.resetForm();
    this.congeService.formData = {
      id: null,
      type: '',
      datedebut: '',
      datefin: '',
      dure: '',
      organisme: '',
      idremplacant: '',
      nomremplacant: '',
      tache: '',
      etatdir: '',
      etatrh: '',
      iddir: '',
      idrh: '',
      nomrh: '',
      nomdir: '',
      dated: '',
      daterh: '',
      attribut1: null,
      attribut2: '',
      attribut3: '',
      attribut4: '',
      attribut5: '',
      attribut6: '',
      dateenreg: '',
      userNameCreator: '',
      idUserCreator: '',

    }
  }

}
