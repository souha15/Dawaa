import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../../shared/Services/User/user-service.service';
import { ToastrService } from 'ngx-toastr';
import { NewFormationService } from '../../../shared/Services/ServiceRh/new-formation.service';
import { NewFormation } from '../../../shared/Models/ServiceRh/new-formation.model';
import { NotifService } from '../../../shared/Services/NotifSystem/notif.service';
import { Notif } from '../../../shared/Models/NotifSystem/notif.model';

@Component({
  selector: 'app-demande-formation-listdir',
  templateUrl: './demande-formation-listdir.component.html',
  styleUrls: ['./demande-formation-listdir.component.css']
})
export class DemandeFormationListdirComponent implements OnInit {

  constructor(private UserService: UserServiceService,
    private toastr: ToastrService,
    private formationService: NewFormationService,
    private notifService: NotifService) { }

  ngOnInit(): void {
    this.getUserConnected();
    this.getCreance();
  }


  UserIdConnected: string;
  UserNameConnected: string;
  notif: Notif = new Notif();
  dateTime = new Date();
  getUserConnected() {

    this.UserService.getUserProfileObservable().subscribe(res => {
      this.UserIdConnected = res.id;
      this.UserNameConnected = res.fullName;
      this.notif.userTransmitterId = res.id;
      this.notif.userTransmitterName = res.fullName;
      this.notif.dateTime = this.date;
      this.notif.date = this.dateTime.getDate().toString() + '-' + (this.dateTime.getMonth() + 1).toString() + '-' + this.dateTime.getFullYear().toString();
      this.notif.time = this.dateTime.getHours().toString() + ':' + this.dateTime.getMinutes().toString();
      this.notif.TextNotification = " تمت الموافقة على طلب دورة تدريبية  من قبل" + ' ' + res.fullName
      this.notif.serviceName = "طلب دورة تدريبية"
      this.notif.readUnread = "0";
      this.notif.serviceId = 3;
      this.UserService.getAdminFinDir().subscribe(resDir => {
        this.notif.userReceiverId = resDir.id;
        this.notif.userReceiverName = resDir.fullName;
      })

    })

  }

  factList: NewFormation[] = [];
  GfactList: NewFormation[] = [];

  getCreance() {
    this.formationService.Get().subscribe(res => {
      this.GfactList = res;

      this.factList = this.GfactList.filter(item => item.etatdir == "في الإنتظار" && item.iddir == this.UserIdConnected)

    })

  }

  //Populate Form 
  factId: number
  fact: NewFormation = new NewFormation();
  populateForm(facture: NewFormation) {
    this.formationService.formData = Object.assign({}, facture)
    this.factId = facture.id;
    this.fact = Object.assign({}, facture);
  }

  date = new Date().toLocaleDateString();
  accept() {
   // this.fact.etat = "موافقة"
    this.fact.datedir = this.date;
    this.fact.etatdir = "موافقة"
    this.fact.iddir = this.UserIdConnected;
    this.fact.nomdir = this.UserNameConnected;
    this.formationService.PutObservableE(this.fact).subscribe(res => {
      this.notifService.Add(this.notif).subscribe(res => {
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
    },
      err => {
        this.toastr.warning('لم يتم رفض الطلب ', ' فشل');
      })
  }
}
