import { Component, OnInit, Input, EventEmitter, ViewChild, ElementRef, Output } from '@angular/core';
import { ServiceVenteervice } from '../../shared/Services/ServiceVente/service-vente.service';
import { TypeTypeServiceVenteservice } from '../../shared/Services/ServiceVente/type-service-vente.service';
import { ToastrService } from 'ngx-toastr';
import { ServiceVente } from '../../shared/Models/ServiceVente/service-vente.model';
import { NgForm } from '@angular/forms';
import { TbListening } from '../../shared/Models/Evenements/tb-listening.model';
import { UserServiceService } from '../../shared/Services/User/user-service.service';
import { ProgressStatus } from '../../shared/Interfaces/progress-status';
import { UploadDownloadService } from '../../shared/Services/Taches/upload-download.service';
import { FileServiceService } from '../../shared/Services/ServiceRh/file-service.service';
import { FileService } from '../../shared/Models/ServiceRh/file-service.model';
import { ProgressStatusEnum } from '../../shared/Enum/progress-status-enum.enum';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-service-vente-add',
  templateUrl: './service-vente-add.component.html',
  styleUrls: ['./service-vente-add.component.css']
})
export class ServiceVenteAddComponent implements OnInit {
  @Input() public disabled: boolean;
  @Output() public uploadStatuss: EventEmitter<ProgressStatus>;
  @ViewChild('inputFile') inputFile: ElementRef;
  constructor(private demService: ServiceVenteervice,
    private typeService: TypeTypeServiceVenteservice,
    private toastr: ToastrService,
    private UserService: UserServiceService,
    private filesService: FileServiceService,
    public serviceupload: UploadDownloadService, ) { this.uploadStatuss = new EventEmitter<ProgressStatus>(); }


  ngOnInit(): void {
    this.getUserConnected();
    this.getTypeService();
    this.getFiles();
  }

  //Get Type Data

  typeList: TbListening[] = [];
  getTypeService() {
    this.typeService.Get().subscribe(res => {
      this.typeList = res; 
    });
  }
  // Get User Connected

  adminId: number;
  admin: string;
  userName: string;
  userId: string;
  getUserConnected() {

    this.UserService.getUserProfileObservable().subscribe(res => {

      this.userId = res.id;
      this.userName = res.fullName;
      if (res.idAdministration != null) {
        this.adminId= res.idAdministration
        this.admin = res.nomAdministration
      }


    })

  }

  dem: ServiceVente = new ServiceVente();
  isValidFormSubmitted = false;
  path: string;
  date = new Date().toLocaleDateString();
  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.isValidFormSubmitted = false;

    }
    else {
      this.isValidFormSubmitted = true
      this.dem.etat = "في الإنتظار"
      this.dem.etatdot = "في الإنتظار"
      this.dem.etatfin = "في الإنتظار"
      this.dem.dateenreg = this.date

      this.dem.idUserCreator = this.userId;
      this.dem.userNameCreator = this.userName;
      if (this.adminId != null) {
        this.dem.adminId = this.adminId
        this.dem.admin = this.admin
      }
      this.demService.Add(this.dem).subscribe(
        res => {
          this.pj.serviceId = res.id;
          this.pj.serviceName = "Vente";
          this.fileslist.forEach(item => {
            this.pj.path = item;
            this.filesService.Add(this.pj).subscribe(resfiles => {
              this.files1 = [];
            })
          });
        this.toastr.success("تمت الإضافة بنجاح", "نجاح");
        form.resetForm();
      },
        err => {
         
          this.toastr.error("لا يمنك إضافة أكثر من طلبين شراء في الشهر الواحد", "فشل في التسجيل");
        })
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

