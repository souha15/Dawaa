import { Component, OnInit } from '@angular/core';
import { SignalRService, AutomaticNotification } from '../../../shared/Services/signalR/signal-r.service';
import { UserServiceService } from '../../../shared/Services/User/user-service.service';
import { Router } from '@angular/router';
import { UserDetail } from '../../../shared/Models/User/user-detail.model';
@Component({
  selector: 'app-montage-employee-recep',
  templateUrl: './montage-employee-recep.component.html',
  styleUrls: ['./montage-employee-recep.component.css']
})
export class MontageEmployeeRecepComponent implements OnInit {

  constructor(private notifService: SignalRService,
    private UserService: UserServiceService,
    private router: Router,) { }

  ngOnInit(): void {
    this.getUserConnected();
  }

  UserIdConnected: string;
  UserNameConnected: string;
  ListUnread: AutomaticNotification[] = [];

  user: UserDetail = new UserDetail();
  async getUserConnected(): Promise<any> {
    this.user = await this.UserService.getUserConnected();

    this.UserIdConnected = this.user.id;
    this.UserNameConnected = this.user.fullName;
    this.notifService.GetUnreadNotificationForDemander(this.UserIdConnected).subscribe(res => {
      this.ListUnread = res;

    })
  }

  notif: AutomaticNotification = new AutomaticNotification();
  id: number;
  updateNotif(item: AutomaticNotification) {
    this.notif = Object.assign({}, item);
    this.notif.vu = "1"
    this.notifService.UpdateNotif(this.notif).subscribe(res => {


    })
  }

}
