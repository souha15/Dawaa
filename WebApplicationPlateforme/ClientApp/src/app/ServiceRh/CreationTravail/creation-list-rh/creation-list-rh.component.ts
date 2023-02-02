import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../../shared/Services/User/user-service.service';
import { ToastrService } from 'ngx-toastr';
import { CreationTravailDemandeService } from '../../../shared/Services/ServiceRh/creation-travail-demande.service';
import { CrationTravailDemande } from '../../../shared/Models/ServiceRh/cration-travail-demande.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-creation-list-rh',
  templateUrl: './creation-list-rh.component.html',
  styleUrls: ['./creation-list-rh.component.css']
})
export class CreationListRhComponent implements OnInit {
  constructor(private UserService: UserServiceService,
    private toastr: ToastrService,
    private ctService: CreationTravailDemandeService
  ) { }

  ngOnInit(): void {
    this.getUserConnected();
    this.getCreance();

  }

  UserIdConnected: string;
  UserNameConnected: string;
  position: string
  getUserConnected() {

    this.UserService.getUserProfileObservable().subscribe(res => {
      this.UserIdConnected = res.id;
      this.UserNameConnected = res.fullName;
      this.position = res.position;
    })

  }


  factList: CrationTravailDemande[] = [];
  GfactList: CrationTravailDemande[] = [];

  getCreance() {
    this.ctService.Get().subscribe(res => {
      this.GfactList = res;

      this.factList = this.GfactList.filter(item => item.etatdir == "موافقة" && item.etatrh == "في الإنتظار")

    })

  }

  date = new Date().toLocaleDateString();
  accept() {
    this.fact.etat = "موافقة"
    this.fact.daterh = this.date;
    this.fact.etatrh = "موافقة"
    this.fact.idrh = this.UserIdConnected;
    this.fact.nomrh = this.UserNameConnected;
    this.ctService.PutObservableE(this.fact).subscribe(res => {
      this.getCreance();
      this.toastr.success("تم  قبول الطلب بنجاح", "نجاح");
    },
      err => {
        this.toastr.warning('لم يتم  قبول الطلب', ' فشل');
      })

  }


  factId: number
  fact: CrationTravailDemande = new CrationTravailDemande();
  populateForm(facture: CrationTravailDemande) {
    this.ctService.formData = Object.assign({}, facture)
    this.factId = facture.id;
    this.fact = Object.assign({}, facture);
  }


  refuse() {
    this.fact.etat = "رفض"
    this.fact.daterh = this.date;
    this.fact.etatrh = "رفض"
    this.fact.idrh = this.UserIdConnected;
    this.fact.nomrh = this.UserNameConnected;

    this.ctService.PutObservableE(this.fact).subscribe(res => {
      this.getCreance();
      this.toastr.success("تم  رفض الطلب بنجاح", "نجاح");
    },
      err => {
        this.toastr.warning('لم يتم رفض الطلب ', ' فشل');
      })

  }

}
