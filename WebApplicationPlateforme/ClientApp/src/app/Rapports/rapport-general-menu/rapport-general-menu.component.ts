import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../shared/Services/User/user-service.service';
import { UserDetail } from '../../shared/Models/User/user-detail.model';

@Component({
  selector: 'app-rapport-general-menu',
  templateUrl: './rapport-general-menu.component.html',
  styleUrls: ['./rapport-general-menu.component.css']
})
export class RapportGeneralMenuComponent implements OnInit {

  constructor(private UserService: UserServiceService) { }

  ngOnInit(): void {
    this.getUserConnected()
  }

  roleslist: any = [];
  AllRolesList = ["ADMINISTRATEUR","DIRECTORGENERAL"];
  FinanceRoleList = ["FINPRIV", "COMPTAPRIV", "BOXPRIV", "EVFINPRIV", "RHPRIV"];
  DotationRoleList = ["DOTPRIV", "SERPRIV", "LOCPRIV", "TECHPRIV"];
  MediaCenterRoleList = ["MEDIAPRIV", "MEDIACENTERPRIV"];
  DawaaRoleList = ["DAWAAPRIV", "MUSPRIV"];
  AllRoles : boolean = false;
  FinanceRole: boolean = false;
  DotationRole: boolean = false;
  MediaCenterRole: boolean = false;
  DawaaRole: boolean = false;
  user: UserDetail = new UserDetail();
  UserIdConnected: string;
  async getUserConnected(): Promise<any> {
    this.user = await this.UserService.getUserConnected();
    this.UserIdConnected = this.user.id;
    this.UserService.getUserRoles(this.UserIdConnected).subscribe(res => {
      this.roleslist = res;
      if (this.checker(this.roleslist, this.AllRolesList)) {
        this.AllRoles = true;
      } else if (this.checker(this.roleslist, this.FinanceRole)) {
        this.FinanceRole = true;
      } else if (this.checker(this.roleslist, this.DotationRole)) {
        this.DotationRole = true;
      } else if (this.checker(this.roleslist, this.MediaCenterRole)) {
        this.MediaCenterRole = true;
      } else if (this.checker(this.roleslist, this.DawaaRole)) {
        this.DawaaRole = true;
      }
    });
  }

  checker(arr1, arr2) {
    return arr1.some(elem => arr2.includes(elem));
  }
}
