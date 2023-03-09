import { Component, OnInit } from '@angular/core';
import { DepartService } from '../../../shared/Services/Rh/depart.service';
import { ToastrService } from 'ngx-toastr';
import { UserServiceService } from '../../../shared/Services/User/user-service.service';
import { UserDetail } from '../../../shared/Models/User/user-detail.model';
import { Depart } from '../../../shared/Models/RH/depart.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-depart-list',
  templateUrl: './depart-list.component.html',
  styleUrls: ['./depart-list.component.css']
})
export class DepartListComponent implements OnInit {

  constructor(private departService: DepartService,
    private toastr: ToastrService,
    private UserService: UserServiceService,) { }

  ngOnInit(): void {
    this.getUserConnected();
    this.GetDepartList();
    this.getUsersLis();
  }
  // Get User Connected


  UserIdConnected: string;
  UserNameConnected: string;

  getUserConnected() {

    this.UserService.getUserProfileObservable().subscribe(res => {
      this.UserIdConnected = res.id;
      this.UserNameConnected = res.fullName;
    })

  }

  // Users List

  UsersList: UserDetail[] = [];
  getUsersLis() {
    this.UserService.GetUsersList().subscribe(res => {
      this.UsersList = res;
    })
  }

  //Get Num  User
  usernum: string;
  getusernum(event) {
    this.UserService.GetUserById(event.target.value).subscribe(res => {
      this.usernum = res.num
      this.dep.employeeNum = this.usernum
      this.dep.employeeNom = res.fullName
    })
  }


  dep: Depart = new Depart();
  isValidFormSubmitted = false;
  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.isValidFormSubmitted = false;
    }
    else {
      this.isValidFormSubmitted = true;
      this.departService.PutObservableE(this.dep).subscribe(res => {
        form.resetForm();
        this.toastr.success("تم تسجيل  تعديل الخروج النهائي بنجاح", " تسجيل ");
        this.GetDepartList();
        this.usernum = ""
      },
        err => {
          this.toastr.error("فشل تعديل  الخروج النهائي", " تسجيل ")
        }
      )
    }
  }


  // Populate Form
  depId: number
  populateForm(depart: Depart) {
    this.departService.formData = Object.assign({}, depart)
    this.depId = depart.id;
    this.dep = Object.assign({}, depart);
  }

  // Get Depart List

  DepartList: Depart[] = [];
  GetDepartList() {
    this.departService.Get().subscribe(res => {
      this.DepartList = res;
    })

   }
  //Delete 
  onDelete(Id) {
    if (confirm('Are you sure to delete this record ?')) {
      this.departService.Delete(Id)
        .subscribe(res => {
          this.GetDepartList();
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
