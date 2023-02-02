import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserServiceService } from '../../shared/Services/User/user-service.service';
import { AllMaintenanceService } from '../../shared/Services/AllMaintenance/all-maintenance.service';
import { AllTypeMaintenance } from '../../shared/Models/AllMaintenance/all-type-maintenance.model';
import { AllMaintenance } from '../../shared/Models/AllMaintenance/all-maintenance.model';
import { AllTypeMaintenanceService } from '../../shared/Services/AllMaintenance/all-type-maintenance.service';
import { TbListening } from '../../shared/Models/Evenements/tb-listening.model';
import { NgForm } from '@angular/forms';
import { UserDetail } from '../../shared/Models/User/user-detail.model';
import { SignalRService, connection, AutomaticNotification } from '../../shared/Services/signalR/signal-r.service';

@Component({
  selector: 'app-all-maintenance-list-employee',
  templateUrl: './all-maintenance-list-employee.component.html',
  styleUrls: ['./all-maintenance-list-employee.component.css']
})
export class AllMaintenanceListEmployeeComponent implements OnInit {

  constructor(private demService: AllMaintenanceService,
    private typeService: AllTypeMaintenanceService,
    private toastr: ToastrService,
    private signalService: SignalRService,
    private UserService: UserServiceService) { }

  ngOnInit(): void {
    this.getTypeList();
    this.getUserConnected();
    this.userOnLis();
    this.userOffLis();
    this.logOutLis();
    this.getOnlineUsersLis();
    this.sendMsgLis();
    if (this.signalService.hubConnection.state == 1) this.getOnlineUsersInv();
    else {
      this.signalService.ssSubj.subscribe((obj: any) => {
        if (obj.type == "HubConnStarted") {
          this.getOnlineUsersInv();
        }
      });
    }
  }
  //Handle Notification
  // Hub Configuration
  users: connection[] = [];
  dirId: string;
  dirName: string;
  autoNotif: AutomaticNotification = new AutomaticNotification();
  userOnLis(): void {
    this.signalService.hubConnection.on("userOn", (newUser: connection) => {

      this.users.push(newUser);
    });
  }


  // Get Offline Users

  userOffLis(): void {
    this.signalService.hubConnection.on("userOff", (demsonId: string) => {
      this.users = this.users.filter(u => u.userId != demsonId);
    });
  }

  logOutLis(): void {
    this.signalService.hubConnection.on("logoutResponse", () => {
      localStorage.removeItem("userId");
      location.reload();
    });
  }

  //Get Online Users

  getOnlineUsersInv(): void {
    this.signalService.hubConnection.invoke("getOnlineUsers")
      .catch(err => console.error(err));
  }


  getOnlineUsersLis(): void {
    this.signalService.hubConnection.on("getOnlineUsersResponse", (onlineUsers: Array<connection>) => {
      this.users = [...onlineUsers];
    });
  }

  //Send Msg 
  text: string;
  sendMsgInv(): void {

    this.signalService.GetConnectionByIdUser(this.dirId).subscribe(res => {
      this.userOnline = res;
      this.signalService.hubConnection.invoke("sendMsg", this.userOnline.signalrId, this.text)
        .catch(err => console.error(err));
    })
  }


  private sendMsgLis(): void {
    this.signalService.hubConnection.on("sendMsgResponse", (connId: string, msg: string, userConSender: string, userConReceiver: string) => {
      let receiver = this.users.find(u => u.signalrId === connId);
    })
  }


  // Get Connected List Users
  getOnlineUsersList(UserIdConnected) {
    this.signalService.GetConnectionList(UserIdConnected).subscribe(res => {
      this.users = res;
    })
  }

  // Test If User Connected
  userOnline: connection = new connection();
  online: boolean;
  TestIfUserConnected(userId): boolean {
    this.signalService.TestIfUserConnected(userId).subscribe(res => {
      this.online = res

    })
    return this.online
  }


  //Dynamic Test of user connected
  userConnected: boolean = false;
  DynamicTestConnected() {
    if (this.users.filter(item => item.userId == this.dirId).length > 0) {
      this.userConnected = true
    }
  }

  UsersList1: UserDetail[] = []
  UsersList: UserDetail[] = []
  getUserList() {
    this.UserService.GetUsersList().subscribe(res => {
      this.UsersList1 = res
      this.UsersList = this.UsersList1.filter(item => item.idAdministration == 29);
    })
  }
  p: Number = 1;
  count: Number = 5;
  // Get Type Maintenance

  ListType: TbListening[] = [];
  getTypeList() {
    this.typeService.Get().subscribe(res => {
      this.ListType = res
    })
  }
  //Get Dem List 
  GetList() {
    this.demService.GetByEmployee(this.userId).subscribe(res => {
      this.demList =res
    })
  }
  // Get User Connected
  userName: string;
  userId: string;
  demList: AllMaintenance[] = [];
  getUserConnected() {

    this.UserService.getUserProfileObservable().subscribe(res => {
      this.userId = res.id;
      this.userName = res.fullName;
      this.demService.GetByEmployee(this.userId).subscribe(res => {
        this.demList = res
      })
    })

  }
  getEmployeeName(event) {
    this.UserService.GetUserById(event.target.value).subscribe(res => {
      this.dem.userNameCreator = res.fullName;
      this.dem.dateemployee = this.date;
    })
  }
  populateForm(dem: AllMaintenance) {
    this.demService.formData = Object.assign({}, dem)
    this.dem = Object.assign({}, dem);

  }
  dem: AllMaintenance = new AllMaintenance();
  isValidFormSubmitted = false;
  path: string;
  date = new Date().toLocaleDateString();
  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.isValidFormSubmitted = false;
    }
    else {
      this.isValidFormSubmitted = true
      this.dem.dateemployee = this.date;
      this.dem.attribut3 = this.dem.etatemployee
      if (this.dem.etatemployee == "رفض") {
        this.autoNotif.serviceId = this.dem.id;
        this.autoNotif.pageUrl = "all-maintenance-list-user"
        this.autoNotif.userType = "0";
        this.autoNotif.reponse = "0";
        this.text = " لقد تم رفض طلب الصيانة من قبل " + this.userName;
        this.signalService.GetConnectionByIdUser(this.dem.idUserCreator).subscribe(res1 => {
          this.userOnline = res1;
          this.signalService.hubConnection.invoke("sendMsg", this.userOnline.signalrId, this.text, this.autoNotif)
            .catch(err => console.error(err));
        }, err => {
          this.autoNotif.receiverName = this.dem.userNameCreator;
          this.autoNotif.receiverId = this.dem.idUserCreator;
          this.autoNotif.transmitterId = this.userId;
          this.autoNotif.transmitterName = this.userName;
            this.autoNotif.text = " لقد تم رفض طلب الصيانة من قبل " + this.userName;
          this.autoNotif.vu = "0";


          this.signalService.CreateNotif(this.autoNotif).subscribe(res => {

          })
        })
      } else {
        this.demService.PutObservableE(this.dem).subscribe(res => {
          this.autoNotif.serviceId = this.dem.id;
          this.autoNotif.pageUrl = "all-maintenance-list-user"
          this.autoNotif.userType = "0";
          this.autoNotif.reponse = "0";
          this.text = "لقد تمت الموافقة على طلب الصيانة"
          this.signalService.GetConnectionByIdUser(this.dem.idUserCreator).subscribe(res1 => {
            this.userOnline = res1;
            this.signalService.hubConnection.invoke("sendMsg", this.userOnline.signalrId, this.text, this.autoNotif)
              .catch(err => console.error(err));
          }, err => {
            this.autoNotif.receiverName = this.dem.userNameCreator;
            this.autoNotif.receiverId = this.dem.idUserCreator;
            this.autoNotif.transmitterId = this.userId;
            this.autoNotif.transmitterName = this.userName;
              this.autoNotif.text = "لقد تمت الموافقة على طلب الصيانة"
            this.autoNotif.vu = "0";


            this.signalService.CreateNotif(this.autoNotif).subscribe(res => {

            })
          })

          this.toastr.success("تمت الإضافة بنجاح", "نجاح");
          this.GetList();
          form.resetForm();
        },
          err => {
            this.toastr.error("لم يتم التسجيل", "فشل في التسجيل");
          })
      }
    
    }
  }

}
