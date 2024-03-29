import { Component, OnInit, EventEmitter, ElementRef, Output, ViewChild, Input } from '@angular/core';
import { AvanceService } from '../../../shared/Services/Finance/avance.service';
import { ToastrService } from 'ngx-toastr';
import { UserServiceService } from '../../../shared/Services/User/user-service.service';
import { Avance } from '../../../shared/Models/Finance/avance.model';
import { NgForm } from '@angular/forms';
import { AdministrationService } from '../../../shared/Services/Administration/administration.service';
import { EtablissementService } from '../../../shared/Services/Etablissement/etablissement.service';
import { NotifService } from '../../../shared/Services/NotifSystem/notif.service';
import { Notif } from '../../../shared/Models/NotifSystem/notif.model';
import { DatePipe } from '@angular/common';
import { SignalRService, connection, AutomaticNotification } from '../../../shared/Services/signalR/signal-r.service';
import { FileService } from '../../../shared/Models/ServiceRh/file-service.model';
import { UploadDownloadService } from '../../../shared/Services/Taches/upload-download.service';
import { FileServiceService } from '../../../shared/Services/ServiceRh/file-service.service';
import { ProgressStatus } from '../../../shared/Interfaces/progress-status';
import { HttpEventType } from '@angular/common/http';
import { ProgressStatusEnum } from '../../../shared/Enum/progress-status-enum.enum';

@Component({
  selector: 'app-avance-add',
  templateUrl: './avance-add.component.html',
  styleUrls: ['./avance-add.component.css']
})
export class AvanceAddComponent implements OnInit {
  @Input() public disabled: boolean;
  @Output() public uploadStatuss: EventEmitter<ProgressStatus>;
  @ViewChild('inputFile') inputFile: ElementRef;
  constructor(private avanceService: AvanceService,
    private toastr: ToastrService,
    private UserService: UserServiceService,
    private adminService: AdministrationService,
    private depService: EtablissementService,
    private notifService: NotifService,
    private signalService: SignalRService,
    private filesService: FileServiceService,
    public serviceupload: UploadDownloadService, ) { this.uploadStatuss = new EventEmitter<ProgressStatus>(); }


  ngOnInit(): void {
    this.getUserConnected();
    const datePipe = new DatePipe('en-Us');
    this.today = datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.getFiles();
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
  autoNotif: AutomaticNotification = new AutomaticNotification();

  userOnLis(): void {
    this.signalService.hubConnection.on("userOn", (newUser: connection) => {

      this.users.push(newUser);
    });
  }


  // Get Offline Users

  userOffLis(): void {
    this.signalService.hubConnection.on("userOff", (personId: string) => {
      this.users = this.users.filter(u => u.userId != personId);
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
  dirId: string;
  dirName: string;
  getDirg() {
    this.UserService.GetAdminDirG().subscribe(res => {
      this.dirId = res.id;
      this.dirName = res.fullName;
    })
  }


  today;
  nom: string;     
  UserIdConnected: string;
  UserNameConnected: string;
  notif: Notif = new Notif();
  dirID: string;
  adminId: number = 28;
  getUserConnected() {
    this.UserService.getUserProfileObservable().subscribe(res => {
      this.av.idUserCreator = res.id;
      this.av.userNameCreator = res.fullName;
      this.UserIdConnected = res.id;
      this.UserNameConnected = res.fullName;
      this.notif.userTransmitterId = res.id;
      this.notif.userTransmitterName = res.fullName;
      this.nom = res.nomAdministration
      this.notif.dateTime = this.date;
      this.notif.date = this.dateTime.getDate().toString() + '-' + (this.dateTime.getMonth() + 1).toString() + '-' + this.dateTime.getFullYear().toString();
      this.notif.time = this.dateTime.getHours().toString() + ':' + this.dateTime.getMinutes().toString();
      this.notif.TextNotification = "طلب سلفة   من الموظف  " + res.fullName
      this.notif.serviceName = "طلب سلفة  "
      this.notif.readUnread = "0";
      this.notif.serviceId = 1;
      this.av.attribut3 = "32618446-df21-4ca1-b366-f639f41a7a7c";
      this.av.attribut4 = "د. محمد بن إبراهيم عوض الصواط ";
      this.notif.userReceiverId = "32618446-df21-4ca1-b366-f639f41a7a7c";
      this.notif.userReceiverName = "د. محمد بن إبراهيم عوض الصواط ";


    })
  }

  av: Avance = new Avance();
  idf: number;
  isValidFormSubmitted = false;
  date = new Date().toLocaleDateString();
  dateTime = new Date();
  onSubmit(form: NgForm) {
    this.av.dateenreg = this.date;
    this.av.attribut2 = "في الإنتظار";
    this.av.etatC = "في الإنتظار";
    this.av.etatD = "في الإنتظار"
    this.av.attribut5 = "في الإنتظار"
    this.av.etatetab = "في الإنتظار"
    if (form.invalid) {
      this.isValidFormSubmitted = false;

    }
    else {

      this.isValidFormSubmitted = true;
      this.avanceService.Add(this.av).subscribe(
        res => {

          this.pj.serviceId = res.id;
          this.pj.serviceName = "Avance";
          this.fileslist.forEach(item => {
            this.pj.path = item;
            this.filesService.Add(this.pj).subscribe(resfiles => {
              this.files1 = [];
            })
          });
          this.UserService.GetAdminDirG().subscribe(resDir => {
            this.dirId = resDir.id;
            this.dirName = resDir.fullName
            this.autoNotif.serviceId =res.id;
            this.autoNotif.pageUrl = "avance-list-d"
            this.autoNotif.userType = "6";
            this.autoNotif.reponse = "10";
            this.text = "طلب سلفة";
            this.autoNotif.receiverName = this.dirName;
            this.autoNotif.receiverId = this.dirId;
            this.signalService.GetConnectionByIdUser(this.dirId).subscribe(res1 => {
              this.userOnline = res1;
              this.signalService.hubConnection.invoke("sendMsg", this.userOnline.signalrId, this.text, this.autoNotif)
                .catch(err => console.error(err));
            }, err => {
              this.autoNotif.receiverName = this.dirName;
              this.autoNotif.receiverId = this.dirId;
              this.autoNotif.transmitterId = this.UserIdConnected;
              this.autoNotif.transmitterName = this.UserNameConnected;
                this.text = "طلب سلفة";
              this.autoNotif.vu = "0";
              this.signalService.CreateNotif(this.autoNotif).subscribe(res => {

              })
            })
          })
          this.notifService.Add(this.notif).subscribe(res => {
          
         
          })

          this.toastr.success("تمت الإضافة بنجاح", "نجاح");
          form.resetForm();
        },
        err => {
          this.toastr.error("لم يتم التسجيل", "فشل في التسجيل")
        }

      )
    }
  }
  //Files
  files1: File[] = [];
  onSelect(event) {
    //console.log(event);
    this.files1.push(...event.addedFiles);
  }

  onRemove(event) {
    this.files1.splice(this.files1.indexOf(event), 1);
    this.fileslist.splice(this.fileslist.indexOf(event), 1);
  }


  public response: { 'dbpathsasstring': '' };
  public isCreate: boolean;
  public pj: FileService = new FileService();
  public files: string[];

  //get List of Files

  private getFiles() {
    this.serviceupload.getFiles().subscribe(
      data => {
        this.files = data

      }
    );

  }

  //Get file name for Database

  GetFileName() {
    let sa: string;
    let s: any;
    let finalres: any;
    let i: number = 0;
    let tlistnew: any[] = [];
    for (var k = 0; k < this.files.length; k++) {
      sa = <string>this.files[k]
      s = sa.toString().split('uploads\\,', sa.length - 1);
      finalres = s.toString().split('uploads\\', sa.length - 1);

      tlistnew[i] = finalres[1]
      i++;

    }


  }

  //Upload

  //Save it ToDatabase
  Idtransaction: number;
  url: any;
  file: any;
  fileslist: string[] = [];
  public upload(event) {
    if (event.addedFiles && event.addedFiles.length > 0) {
      this.file = event.addedFiles[0];
      this.uploadStatuss.emit({ status: ProgressStatusEnum.START });
      this.serviceupload.uploadFile(this.file).subscribe(
        data => {
          if (data) {
            switch (data.type) {
              case HttpEventType.UploadProgress:
                this.uploadStatuss.emit({ status: ProgressStatusEnum.IN_PROGRESS, percentage: Math.round((data.loaded / data.total) * 100) });
                break;
              case HttpEventType.Response:
                // this.inputFile.nativeElement.value = '';
                this.uploadStatuss.emit({ status: ProgressStatusEnum.COMPLETE });
                break;
            }
            this.getFiles();
            this.GetFileName();



          }

        },

        error => {
          /// this.inputFile.nativeElement.value = '';
          this.uploadStatuss.emit({ status: ProgressStatusEnum.ERROR });
        }
      );
      this.fileslist.push(this.file.name);

    }
  }
}
