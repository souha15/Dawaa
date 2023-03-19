import { Component, OnInit , ElementRef, ViewChild } from '@angular/core';
import { InterviewService } from '../../../shared/Services/MediaCenter/Interview/interview.service';
import { Interview } from '../../../shared/Models/MediaCenter/Interview/interview.model';
import { UserDetail } from '../../../shared/Models/User/user-detail.model';
import { UserServiceService } from '../../../shared/Services/User/user-service.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-rapport-interview',
  templateUrl: './rapport-interview.component.html',
  styleUrls: ['./rapport-interview.component.css']
})
export class RapportInterviewComponent implements OnInit {
  @ViewChild('htmlData') htmlData: ElementRef;
  constructor(private mediaService: InterviewService,
    private userService: UserServiceService,
    public toastr: ToastrService,
    private router: ActivatedRoute) { }

  ngOnInit(): void {
    this.getAllMediaList();
    this.GetUsersList();
  }

  p: Number = 1;
  count: Number = 5;


  //Radio Button 

  private selectedLink: string = "all";
  search: string;
  setradio(e: string): void {

    this.selectedLink = e;
    if (this.selectedLink == "employee") {
      this.search = "employee"
    }

    if (this.selectedLink == "all") {
      this.search = "all"
    }

    if (this.selectedLink == "date") {
      this.search = "date"
    }
  }


  isSelected(name: string): boolean {

    if (!this.selectedLink) { // if no radio button is selected, always return false so every nothing is shown  
      return false;
    }

    return (this.selectedLink === name); // if current radio button is selected, return true, else return false  
  }
  //Get Users List
  UsersList: UserDetail[] = [];
  GetUsersList() {
    this.userService.GetUsersList().subscribe(res => {
      this.UsersList = res;
    })
  }
  allMedia: Interview[] = [];
  getAllMediaList() {
    this.mediaService.List().subscribe(res => {
      this.allMedia = res;
    })
  }

  mediaList: Interview[] = [];
  GetMediaList() {
    this.mediaList = [];
    if (this.isSelected('all')) {
      this.mediaService.List().subscribe(res => {
        this.mediaList = res;
      })
    } else if (this.isSelected('employee') && this.employeeId != null) {
      this.mediaService.SearchByEmployee(this.employeeId).subscribe(res => {
        this.mediaList = res;
      })
    } else {
      if (this.DateDeb != null && this.DateFin != null) {

        this.allMedia.forEach(item => {
          if (this.TestBetweenTwoDate(item.dateenreg)) {
            this.mediaList.push(item);
          }
        })


      } else {
        this.toastr.error("يرجى ملء تاريخ البدء وتاريخ الانتهاء","فشل")
      }
    }

  }

  TestBetweenTwoDate(dateEnreg):boolean {
    if (this.DateDeb != null && this.DateFin != null) {
      var from = new Date(this.DateDeb);
      var to = new Date(this.DateFin);
      var date = new Date(dateEnreg);
      if (from <= date && to >= date) {
        return true
      } else {
       return false
      }
    } else {
      return false;
    }
 
  }
  employeeId: string;
  getEmployee(event) {
    this.employeeId = event.target.value;
    
  }

  DateDeb: string;
  getDateDeb(event) {
    this.DateDeb = event.target.value;
  }

  DateFin: string;
  getDateFin(event) {
    this.DateFin = event.target.value;
  }


  path: string;
  public print() {
    var data = document.getElementById('htmlData');
     data.style.display = "block";
    html2canvas(data).then(canvas => {
      // Few necessary setting options
       data.style.display = "none"
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      this.path = "RapportInterview" + ".pdf"
      pdf.save(this.path); // Generated PDF
    });
  }
}
