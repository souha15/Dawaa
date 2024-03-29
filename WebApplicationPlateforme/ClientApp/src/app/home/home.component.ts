import { Component, OnInit } from '@angular/core';
import { PrivilegesService } from '../shared/Services/User/privileges.service';
import { UserServiceService } from '../shared/Services/User/user-service.service';
import { TacheNotifService } from '../shared/Services/Taches/tache-notif.service';
import { TacheService } from '../shared/Services/Taches/tache.service';
import { TacheNotif } from '../shared/Models/Taches/tache-notif.model';
import { TransactionService } from '../shared/Services/AdministrativeCommunication/transaction.service';
import { AffectationService } from '../shared/Services/AdministrativeCommunication/affectation.service';
import { Transaction } from '../shared/Models/AdministrativeCommunication/transaction.model';
import { Affectation } from '../shared/Models/AdministrativeCommunication/affectation.model';
import { NotifMsgInterneService } from '../shared/Services/Msg Interne/notif-msg-interne.service';
import { NotifMsgInterne } from '../shared/Models/Msg Interne/notif-msg-interne.model';
import { Ticket2Service } from '../shared/Services/Ticket2/ticket2.service';
import { Ticket2 } from '../shared/Models/Ticket2/ticket2.model';
import { PointageService } from '../shared/Services/Pointage/pointage.service'; 
import { Pointage } from '../shared/Models/Pointage/pointage.model';
import { Tache } from '../shared/Models/Taches/tache.model';
import { NotifService } from '../shared/Services/NotifSystem/notif.service';
import { UserDetail } from '../shared/Models/User/user-detail.model';
import { DecisionTwoService } from '../shared/Services/ServiceRh/decision-two.service';
import { DecisionTwo } from '../shared/Models/ServiceRh/decision-two.model';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  constructor(
    private UserService: UserServiceService,
    private router: Router,
    private notiftaskService: TacheNotifService,
    private TacheService: TacheService,
    private transactionService: TransactionService,
    private affectationService: AffectationService,
    private notifmsgService: NotifMsgInterneService,
    private TicketService: Ticket2Service,
    private pointageService: PointageService,
    private notifService: NotifService,
    private trinService: DecisionTwoService) {
    }

  ngOnInit(): void {

    this.getUserConnected();
  
  }

  // Decision Banner

  ListDecision: DecisionTwo[]=[];

  // Get User Connected
  notifnb: number = 0;
  testnotifnb: boolean = false;
  notifMsgList: NotifMsgInterne[] = [];
  notifMsgList2: NotifMsgInterne[] = [];
  UserIdConnected: string;
  UserNameConnected: string;
  task: Tache[] = [];
  task2: Tache[] = [];
  nb: number;
  roleslist: any = [];
  testrole: boolean = false;
  shownb: boolean = false;
  idadmin: number;
  idetab: number;
  admin: boolean;
  mediadir: boolean = false;
  notif: number = 0;
  testNotif: boolean = false;
  user: UserDetail = new UserDetail();
  showdec: boolean = false;
  today;
  async getUserConnected(): Promise<any> {
    this.user = await this.UserService.getUserConnected();
    this.UserIdConnected = this.user.id;
    if (this.UserIdConnected != null) {
      this.trinService.GetDecisionToUser(this.UserIdConnected).subscribe(resultat => {
        if (resultat != null) { 
        this.today = new Date()
        let str1 = resultat.attribut6;
        let d1 = new Date(str1);
        var diff = Math.abs(this.today.getTime() - d1.getTime());
        var diffDays = Math.ceil(diff / (1000 * 3600 * 24));

        if ((diffDays <= 4) && (diffDays >= 1)) {
          this.showdec = true;
        } else {
          this.showdec = false;
        }
      }
      })
    }
    this.UserNameConnected = this.user.fullName;
    if (this.user.idAdministration != null) {
      this.idadmin = this.user.idAdministration;
      this.idetab = this.user.idDepartement;

      this.trinService.GetDecisionToAdmin(this.idadmin).subscribe(resultat => {
        if (resultat != null) {
          this.today = new Date()
          let str1 = resultat.attribut6;
          let d1 = new Date(str1);
          var diff = Math.abs(this.today.getTime() - d1.getTime());
          var diffDays = Math.ceil(diff / (1000 * 3600 * 24));

          if ((diffDays <= 4) && (diffDays >= 1)) {
            this.showdec = true;
          } else {
            this.showdec = false;
          }
        }
      })
    }
   
    this.trinService.GetDecisionAllAdmin().subscribe(resultat => {
      if (resultat != null) {
        this.today = new Date()
        let str1 = resultat.attribut6;
        let d1 = new Date(str1);
        var diff = Math.abs(this.today.getTime() - d1.getTime());
        var diffDays = Math.ceil(diff / (1000 * 3600 * 24));

        if ((diffDays <= 4) && (diffDays >= 1)) {
          this.showdec = true;
        } else {
          this.showdec = false;
        }
      }
    })
    //   
    //this.trinService.TestDecision(this.UserIdConnected, this.idadmin).subscribe(resultat => {
    //  if (resultat.length!=0) {
    //    this.showdec = true;
    //  } else {
    //    this.showdec = false;
    //  } 
    //})



      this.TacheService.ListTache().subscribe(res => {
        this.task = res
        this.task2 = this.task.filter(item => item.affectedName == this.UserIdConnected && item.etat == "في الإنتظار");
        this.nb = this.task2.length;
        if (this.nb != 0) {
          this.shownb = true
        } else {
          this.shownb = false

        }
      })
      this.notifService.GetByUserUnRead(this.UserIdConnected).subscribe(res => {
        this.notif = res.length;
        if (this.notif) {
          this.testNotif = true;
        } else {
          this.testNotif = false;
        }
      })

      this.notifmsgService.ListNotifMsgInterne().subscribe(res => {
        this.notifMsgList2 = res;
        this.notifMsgList = this.notifMsgList2.filter(item => item.userIdReceiver == this.UserIdConnected && item.seen == 0)
        this.notifnb = this.notifMsgList.length;
        if (this.notifnb != 0) {
          this.testnotifnb = true;
        } else {
          this.testnotifnb = false;
        }
      })
 
  }

}

