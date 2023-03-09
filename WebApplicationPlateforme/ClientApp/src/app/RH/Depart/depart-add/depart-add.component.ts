import { Component, OnInit } from '@angular/core';
import { DepartService } from '../../../shared/Services/Rh/depart.service';
import { ToastrService } from 'ngx-toastr';
import { UserServiceService } from '../../../shared/Services/User/user-service.service';
import { UserDetail } from '../../../shared/Models/User/user-detail.model';
import { Depart } from '../../../shared/Models/RH/depart.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-depart-add',
  templateUrl: './depart-add.component.html',
  styleUrls: ['./depart-add.component.css']
})
export class DepartAddComponent implements OnInit {

  constructor(private departService: DepartService,
    private toastr: ToastrService,
    private UserService: UserServiceService,) { }

  ngOnInit(): void {
    this.getUserConnected();
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
      this.dep.userNameCreator = this.UserNameConnected;
      this.dep.idUserCreator = this.UserIdConnected;
      this.departService.Add(this.dep).subscribe(res => {
        form.resetForm();
        this.toastr.success("تم تسجيل  تسجيل الخروج النهائي بنجاح", " تسجيل ");
        this.usernum =""
      },
        err => {
          this.toastr.error("فشل تسجيل  الخروج النهائي", " تسجيل ")
        }
      )
    }
  }
}
