import { Component, OnInit } from '@angular/core';
import { VisiteService } from '../../../shared/Services/MediaCenter/Visite/visite.service';
import { UserServiceService } from '../../../shared/Services/User/user-service.service';
import { ToastrService } from 'ngx-toastr';
import { UserDetail } from '../../../shared/Models/User/user-detail.model';
import { Visite } from '../../../shared/Models/MediaCenter/Visite/visite.model';

@Component({
  selector: 'app-rapport-viste',
  templateUrl: './rapport-viste.component.html',
  styleUrls: ['./rapport-viste.component.css']
})
export class RapportVisteComponent implements OnInit {


  constructor(private mediaService: VisiteService,
    private userService: UserServiceService,
    public toastr: ToastrService,
  ) { }

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
  allMedia: Visite[] = [];
  getAllMediaList() {
    this.mediaService.List().subscribe(res => {
      this.allMedia = res;
    })
  }


  mediaList: Visite[] = [];
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
        this.toastr.error("يرجى ملء تاريخ البدء وتاريخ الانتهاء", "فشل")
      }
    }

  }

  TestBetweenTwoDate(dateEnreg): boolean {
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
}
