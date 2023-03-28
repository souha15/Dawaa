import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../../shared/Services/User/user-service.service';
import { ToastrService } from 'ngx-toastr';
import { VisiteGeneralService } from '../../../shared/Services/MediaCenter/visite-general.service';
import { NgForm } from '@angular/forms';
import { VisiteGeneral } from '../../../shared/Models/MediaCenter/visite-general.model';
@Component({
  selector: 'app-visite-general-add',
  templateUrl: './visite-general-add.component.html',
  styleUrls: ['./visite-general-add.component.css']
})
export class VisiteGeneralAddComponent implements OnInit {

  constructor(private UserService: UserServiceService,
    private toastr: ToastrService,
    private visiteService: VisiteGeneralService,
  ) { }

  ngOnInit(): void {
    this.getUserConnected();
  }


/** GetUser Connected */
  UserId: string;
  UserName: string;
  getUserConnected() {
    this.UserService.getUserProfileObservable().subscribe(res => {
      this.UserId = res.id;
      this.UserName = res.fullName;
    })
  }

/** OnSubmit **/
  isValidFormSubmitted = false;
  visite: VisiteGeneral = new VisiteGeneral();
  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.isValidFormSubmitted = false;
    }
    else {

      this.isValidFormSubmitted = true;
      this.visite.idUserCreator = this.UserId;
      this.visite.userNameCreator = this.UserName;
      this.visiteService.Create(this.visite).subscribe(res => {

        this.toastr.success("تمت الإضافة بنجاح", "نجاح");
        form.resetForm();
    
      }, err => {
          this.toastr.error("لم يتم التسجيل", "فشل في التسجيل")
      });
    }
  }
}
