import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../../shared/Services/User/user-service.service';
import { ToastrService } from 'ngx-toastr';
import { VisiteGeneralService } from '../../../shared/Services/MediaCenter/visite-general.service';
import { VisiteGeneral } from '../../../shared/Models/MediaCenter/visite-general.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-visite-general-list',
  templateUrl: './visite-general-list.component.html',
  styleUrls: ['./visite-general-list.component.css']
})
export class VisiteGeneralListComponent implements OnInit {

  constructor(private UserService: UserServiceService,
    private toastr: ToastrService,
    private visiteService: VisiteGeneralService) { }

  ngOnInit(): void {
    this.getUserConnected();
 
  }

  UserId: string;
  UserName: string;
  p: Number = 1;
  count: Number = 5;
  getUserConnected() {

    this.UserService.getUserProfileObservable().subscribe(res => {
      this.UserId = res.id;
      this.UserName = res.fullName;
      this.getVisiteList(this.UserId);

    })

  }

  VisiteList: VisiteGeneral[] = [];
  getVisiteList(Id) {
    this.visiteService.SearchByEmployee(Id).subscribe(res => {
      this.VisiteList = res;
    })
  }

  visite: VisiteGeneral = new VisiteGeneral();
  Id: number;
  populateForm(visite: VisiteGeneral) {
    this.visite = Object.assign({}, visite);
    this.Id = this.visite.id;
  }

  isValidFormSubmitted = false;

  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.isValidFormSubmitted = false;
    }
    else {

      this.isValidFormSubmitted = true;

      this.visiteService.PutObservableE(this.visite).subscribe(res => {
 
        this.toastr.success("تمت التعديل بنجاح", "نجاح");
        form.resetForm();

        this.getVisiteList(this.UserId);
      },
        err => {
          this.toastr.error("لم يتم التعديل", "فشل في التسجيل")
        })
    }
  }

  /*Delete*/
  onDelete(Id) {
    if (confirm('Are you sure to delete this record ?')) {
      this.visiteService.Delete(Id)
        .subscribe(res => {
          this.getVisiteList(this.UserId);
          this.toastr.success("تم الحذف  بنجاح", "نجاح");
        },

          err => {
            console.log(err);
            this.toastr.warning('لم يتم الحذف  ', ' فشل');

          }
        )

    }

  }
}
