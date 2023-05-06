import { Component, OnInit } from '@angular/core';
import { RecrutementService } from '../../../shared/Services/Rh/recrutement.service';
import { ToastrService } from 'ngx-toastr';
import { UserServiceService } from '../../../shared/Services/User/user-service.service';
import { UserDetail } from '../../../shared/Models/User/user-detail.model';
import { Recrutement } from '../../../shared/Models/RH/recrutement.model';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SignalRService, connection, AutomaticNotification } from '../../../shared/Services/signalR/signal-r.service';

@Component({
  selector: 'app-rh-recrutment-list',
  templateUrl: './rh-recrutment-list.component.html',
  styleUrls: ['./rh-recrutment-list.component.css']
})
export class RhRecrutmentListComponent implements OnInit {
  private routeSub: Subscription;
  constructor(private congeService: RecrutementService,
    private toastr: ToastrService,
    private UserService: UserServiceService,
    private route: ActivatedRoute,
    private signalService: SignalRService,) { }

  ngOnInit(): void {
    this.getUserConnected();
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
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.Id = params['id'];
        this.showrow = true;
        this.congeService.GetRhList(this.Id).subscribe(res => {
          this.filtredCongeList = res;
        }, err => {
          this.getData()
        })
      } else {

        this.congeService.GetRhListGeneral().subscribe(res1 => {
          this.filtredCongeList = res1;
        }, err => {
          this.getData();
        })
      }
    });
  }

  getData() {
    this.congeService.GetRhListGeneral().subscribe(res1 => {
      this.filtredCongeList = res1;
      this.showrow = false;
    })
  }
  ngOnDestroy() {
    this.routeSub.unsubscribe();
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
      this.congeService.formData.attribut3 = "100%"
    }
  }
  date = new Date().toLocaleDateString();
  conge: Recrutement = new Recrutement();

  updateRecord(form: NgForm) {

    this.conge = Object.assign(this.conge, form.value);
    this.congeService.formData.daterh = this.date;
    this.congeService.formData.etatrh = this.perc;
    this.congeService.formData.attribut2 = this.perc;
    this.congeService.formData.idrh = this.UserIdConnected;
    this.congeService.formData.nomrh = this.UserNameConnected;
    this.congeService.Edit().subscribe(res => {
      this.toastr.success('تم التحديث بنجاح', 'نجاح')
      this.resetForm();
      this.CongeList();
      this.showrow = false;
      this.autoNotif.serviceId = this.per.id;
      this.autoNotif.pageUrl = "recrutement-list"
      this.autoNotif.userType = "3";
      this.autoNotif.reponse = "Demander";
      this.text = "لقد تمت معالجة طلب الإنتداب";
      this.signalService.GetConnectionByIdUser(this.per.idUserCreator).subscribe(res1 => {
        this.userOnline = res1;
        this.signalService.hubConnection.invoke("sendMsg", this.userOnline.signalrId, this.text, this.autoNotif)
          .catch(err => console.error(err));
      }, err => {
        this.autoNotif.receiverName = this.per.userNameCreator;
        this.autoNotif.receiverId = this.per.idUserCreator;
        this.autoNotif.transmitterId = this.UserIdConnected;
        this.autoNotif.transmitterName = this.UserNameConnected;
          this.autoNotif.text = "لقد تمت معالجة طلب الإنتداب"
        this.autoNotif.vu = "0";


        this.signalService.CreateNotif(this.autoNotif).subscribe(res => {

        })
      })
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
