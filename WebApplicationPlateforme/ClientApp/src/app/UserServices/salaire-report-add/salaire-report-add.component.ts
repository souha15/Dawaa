import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserServiceService } from '../../shared/Services/User/user-service.service';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-salaire-report-add',
  templateUrl: './salaire-report-add.component.html',
  styleUrls: ['./salaire-report-add.component.css']
})
export class SalaireReportAddComponent implements OnInit {

  constructor(
    private UserService: UserServiceService) { }

  ngOnInit(): void {
    this.getUserConnected();
  }

  //Get UserConnected

  UserIdConnected: string;
  UserNameConnected: string;
  emploi: string;
  cin: string;
  nat: string;
  salaire: string;
  iond: number;
  aiond: number;
  totin: number;
  getUserConnected() {

    this.UserService.getUserProfileObservable().subscribe(res => {
      this.UserIdConnected = res.id;
      this.UserNameConnected = res.fullName;
      this.emploi = res.emploi;
      this.cin = res.registreCivil;
      this.nat = res.nationalite;
      this.salaire = res.salaire;
      this.iond = +res.indemnite;
      this.aiond = +res.autreIndemnite + this.iond;
      this.totin = +this.salaire + this.aiond
    })

  }


  //impression tr
  path: string;
  public print() {

    var data = document.getElementById('htmlData');

    html2canvas(data).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF

      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      this.path = "Experience" + this.UserNameConnected + ".pdf"
      pdf.save(this.path); // Generated PDF

    }

    );

  }
}
