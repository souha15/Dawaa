import { Component, OnInit, Input, EventEmitter, ElementRef, ViewChild, Output } from '@angular/core';
import { ProgressStatus } from '../../shared/Interfaces/progress-status';
import { ToastrService } from 'ngx-toastr';
import { UserServiceService } from '../../shared/Services/User/user-service.service';
import { NotifService } from '../../shared/Services/NotifSystem/notif.service';
import { SignalRService, connection, AutomaticNotification } from '../../shared/Services/signalR/signal-r.service';
import { FileServiceService } from '../../shared/Services/ServiceRh/file-service.service';
import { UploadDownloadService } from '../../shared/Services/Taches/upload-download.service';
import { BesoinService } from '../../shared/Services/Demande Besoins/besoin.service'
import { DemandeBesoinService } from '../../shared/Services/Demande Besoins/demande-besoin.service'
import { TbListening } from '../../shared/Models/Evenements/tb-listening.model';
import { DemandeBesoin } from '../../shared/Models/Demande Besoins/demande-besoin.model';
import { NgForm } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { ProgressStatusEnum } from '../../shared/Enum/progress-status-enum.enum';
import { FileService } from '../../shared/Models/ServiceRh/file-service.model';

@Component({
  selector: 'app-mylist-demande-besoins',
  templateUrl: './mylist-demande-besoins.component.html',
  styleUrls: ['./mylist-demande-besoins.component.css']
})
export class MylistDemandeBesoinsComponent implements OnInit {

  @Input() public disabled: boolean;
  @Output() public uploadStatuss: EventEmitter<ProgressStatus>;
  @ViewChild('inputFile') inputFile: ElementRef;
  @Output() public downloadStatus: EventEmitter<ProgressStatus>;

  constructor(private besoinsService: BesoinService,
    private toastr: ToastrService,
    private UserService: UserServiceService,
    private demandeBesoinsService: DemandeBesoinService,
    private filesService: FileServiceService,
    public serviceupload: UploadDownloadService, ) {
    this.uploadStatuss = new EventEmitter<ProgressStatus>();
    this.downloadStatus = new EventEmitter<ProgressStatus>(); }

  ngOnInit(): void {
    this.getUserConnected();
    this.getBesoinsList();
  
    this.getFiles();
  }
  p: Number = 1;
  count: Number = 5;
  // Get User Connected

  nom: string;
  UserIdConnected: string;
  UserNameConnected: string;
  getUserConnected() {

    this.UserService.getUserProfileObservable().subscribe(res => {
      this.UserIdConnected = res.id;
      this.UserNameConnected = res.fullName;
      this.GetdembesoinsList(this.UserIdConnected)
    })

  }
  besoinsList: TbListening[] = [];
  getBesoinsList() {
    this.besoinsService.Get().subscribe(res => {
      this.besoinsList = res
    })
  }
  demBesoinsList: DemandeBesoin[] = [];
  GetdembesoinsList(userId) {
    this.demandeBesoinsService.GetBesoinsForUserCreator(userId).subscribe(res => {
      this.demBesoinsList = res;
    })
  }
  etatok: boolean;
  filesList: FileService[] = [];
  populateForm(dem: DemandeBesoin) {
    this.besoin = Object.assign({}, dem);
    if (this.besoin.etat == "في الإنتظار") {
      this.etatok = false;
    } else {
      this.etatok = true;
    }
    this.filesService.GetBesoinsFiles(this.besoin.id).subscribe(res => {
      this.filesList = res;
      
    })
  }
  //Add Equipement
  isValidFormSubmitted = false;
  date = new Date().toLocaleDateString();
  besoin: DemandeBesoin = new DemandeBesoin();
  dateTime = new Date();
  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.isValidFormSubmitted = false;

    }
    else {

      this.isValidFormSubmitted = true;
      this.besoin.idUserCreator = this.UserIdConnected;
      this.besoin.userNameCreator = this.UserNameConnected;
      this.demandeBesoinsService.PutObservableE(this.besoin).subscribe(res => {

        this.pj.serviceId = this.besoin.id;
        this.pj.serviceName = "Besoin";
        this.fileslist.forEach(item => {
          this.pj.path = item;
          this.filesService.Add(this.pj).subscribe(resfiles => {
            this.files1 = [];
          })
        });
        this.GetdembesoinsList(this.UserIdConnected);
        this.toastr.success("تم تعديل الطلب بنجاح", "نجاح");
        form.resetForm();
      }, err => {
          this.toastr.error("لم يتم  تعديل الطلب","فشل ")
      }
      )
    }
  }


  onDelete(Id) {

    if (confirm('Are you sure to delete this record ?')) {
      this.demandeBesoinsService.Delete(Id)
        .subscribe(res => {
          this.GetdembesoinsList(this.UserIdConnected);
            this.toastr.success("تم الحذف  بنجاح", "نجاح");
          },

            err => {
              console.log(err);
              this.toastr.warning('لم يتم الحذف  ', ' فشل');

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
  public download(filepath) {
    this.downloadStatus.emit({ status: ProgressStatusEnum.START });
    this.serviceupload.downloadFile(filepath).subscribe(
      data => {
        switch (data.type) {
          case HttpEventType.DownloadProgress:
            this.downloadStatus.emit({ status: ProgressStatusEnum.IN_PROGRESS, percentage: Math.round((data.loaded / data.total) * 100) });
            break;
          case HttpEventType.Response:
            this.downloadStatus.emit({ status: ProgressStatusEnum.COMPLETE });
            const downloadedFile = new Blob([data.body], { type: data.body.type });
            const a = document.createElement('a');
            a.setAttribute('style', 'display:none;');
            document.body.appendChild(a);
            a.download = filepath;
            a.href = URL.createObjectURL(downloadedFile);
            a.target = '_blank';
            a.click();
            document.body.removeChild(a);
            break;
        }
      },
      error => {
        this.downloadStatus.emit({ status: ProgressStatusEnum.ERROR });
      }
    );
  }
}
