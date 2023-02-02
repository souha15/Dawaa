import { Component, OnInit } from '@angular/core';
import { CreationTravailDemandeService } from '../../../shared/Services/ServiceRh/creation-travail-demande.service';
import { UserServiceService } from '../../../shared/Services/User/user-service.service';
import { ToastrService } from 'ngx-toastr';
import { CrationTravailDemande } from '../../../shared/Models/ServiceRh/cration-travail-demande.model';
import { NgForm } from '@angular/forms';
import { AdministrationService } from '../../../shared/Services/Administration/administration.service';
import { Administration } from '../../../shared/Models/Administration/administration.model';
import { NotifService } from '../../../shared/Services/NotifSystem/notif.service';
import { Notif } from '../../../shared/Models/NotifSystem/notif.model';
import { DatePipe } from '@angular/common';
import { SignalRService, connection, AutomaticNotification } from '../../../shared/Services/signalR/signal-r.service';
@Component({
  selector: 'app-creation-add',
  templateUrl: './creation-add.component.html',
  styleUrls: ['./creation-add.component.css']
})
export class CreationAddComponent implements OnInit {

  constructor(
    private ctService: CreationTravailDemandeService,
    private UserService: UserServiceService,
    private toastr: ToastrService,
    private adminService: AdministrationService,
    private notifService: NotifService,
    private signalService: SignalRService,) { }

  ngOnInit(): void {
    this.getUserConnected();
    const datePipe = new DatePipe('en-Us');
    this.today = datePipe.transform(new Date(), 'yyyy-MM-dd');
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

  // Handle Notification
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

  //Get Dir Fin Etab
  dirId: string;
  dirName: string;
  today;

  // Get User Connected

  UserIdConnected: string;
  UserNameConnected: string;
  dir: string;
  dirid: string;
  position: string;
  admindir: string;
  nom: string;
  notif: Notif = new Notif();
  dateTime = new Date();
  getUserConnected() {

    this.UserService.getUserProfileObservable().subscribe(res => {
      this.UserIdConnected = res.id;
      this.UserNameConnected = res.fullName;
      this.position = res.position;
      this.nom = res.nomAdministration
      this.notif.userTransmitterId = res.id;
      this.notif.userTransmitterName = res.fullName;
      this.notif.dateTime = this.date;
      this.notif.date = this.dateTime.getDate().toString() + '-' + (this.dateTime.getMonth() + 1).toString() + '-' + this.dateTime.getFullYear().toString();
      this.notif.time = this.dateTime.getHours().toString() + ':' + this.dateTime.getMinutes().toString();
      this.notif.TextNotification = "طلب استحداث وظيفة من الموظف  " + res.fullName
      this.notif.serviceName = "طلب استحداث وظيفة"
      this.notif.readUnread = "0";
      this.notif.serviceId = 2;
      this.UserService.getAdminDir(res.id).subscribe(resDir => {
        if (resDir != null) {
          this.ct.iddir = resDir.id;
          this.ct.nomdir = resDir.fullName;
          this.notif.userReceiverId = resDir.attribut1;
          this.notif.userReceiverName = resDir.directeur;
          this.dirId =resDir.id;
          this.dirName = resDir.fullName;
        }


      })


    })
  }

  ct: CrationTravailDemande = new CrationTravailDemande();
  isValidFormSubmitted = false;
  date = new Date().toLocaleDateString();
  autoNotif: AutomaticNotification = new AutomaticNotification();
  onSubmit(form: NgForm) {
    if (form.invalid) {

      this.isValidFormSubmitted = false;
    }

    else {
      this.isValidFormSubmitted = true;
      this.ct.dateenreg = this.date;
      this.ct.etat = 'في الإنتظار';
      this.ct.etatdg = "في الإنتظار";
      this.ct.etatdir = "في الإنتظار";
      this.ct.etatrh = "في الإنتظار";
      this.ct.titreposte = this.position;
      this.ct.idUserCreator = this.UserIdConnected;
      this.ct.userNameCreator = this.UserNameConnected;

      this.ctService.Add(this.ct).subscribe(res => {
        this.autoNotif.serviceId = res.id;
        this.autoNotif.pageUrl = "creation-list-dir-g"
        this.autoNotif.userType = "7";
        this.autoNotif.reponse = "8";
        this.text = "طلب استحداث وظيفة";
        this.autoNotif.vu = "0";
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
            this.text = "طلب استحداث وظيفة";

          this.signalService.CreateNotif(this.autoNotif).subscribe(res => {

          })
        })
        this.notifService.Add(this.notif).subscribe(res => {
       
        form.resetForm();
          this.toastr.success("تم التسجيل  بنجاح", " تسجيل ");
        })
      },
        err => {
          this.toastr.error("  يجب أن يبدأ التاريخ من هذا اليوم", "لم يتم تقديم الطلب ")
        }
      )
    }
  }
}
