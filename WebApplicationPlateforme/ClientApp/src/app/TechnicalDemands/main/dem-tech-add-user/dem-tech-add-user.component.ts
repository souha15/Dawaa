import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { TechDemService } from '../../../shared/Services/TechnicalDemands/tech-dem.service';
import { TypeTechDemService } from '../../../shared/Services/TechnicalDemands/type-tech-dem.service';
import { UserServiceService } from '../../../shared/Services/User/user-service.service';
import { ToastrService } from 'ngx-toastr';
import { AdministrationService } from '../../../shared/Services/Administration/administration.service';
import { TechDem } from '../../../shared/Models/TechnicalDemands/tech-dem.model';
import { NgForm } from '@angular/forms';
import { Administration } from '../../../shared/Models/Administration/administration.model';
import { TbListening } from '../../../shared/Models/Evenements/tb-listening.model';
import { ProgressStatus } from '../../../shared/Interfaces/progress-status';
import { UploadDownloadService } from '../../../shared/Services/Taches/upload-download.service';
import { FileServiceService } from '../../../shared/Services/ServiceRh/file-service.service';
import { ProgressStatusEnum } from '../../../shared/Enum/progress-status-enum.enum';
import { HttpEventType } from '@angular/common/http';
import { FileService } from '../../../shared/Models/ServiceRh/file-service.model';

@Component({
  selector: 'app-dem-tech-add-user',
  templateUrl: './dem-tech-add-user.component.html',
  styleUrls: ['./dem-tech-add-user.component.css']
})
export class DemTechAddUserComponent implements OnInit {
  @Input() public disabled: boolean;
  @Output() public uploadStatuss: EventEmitter<ProgressStatus>;
  @ViewChild('inputFile') inputFile: ElementRef;
  constructor(private demTechService: TechDemService,
    private demTypeService: TypeTechDemService,
    private UserService: UserServiceService,
    private adminService: AdministrationService,
    private toastr: ToastrService,
    private filesService: FileServiceService,
    public serviceupload: UploadDownloadService, ) { this.uploadStatuss = new EventEmitter<ProgressStatus>(); }


  ngOnInit(): void {
    this.getUserConnected();
    this.getAdminList();
    this.getServices();
    this.getFiles();
  }

  getUserConnected() {

    this.UserService.getUserProfileObservable().subscribe(res => {
      this.dem.userNameCreator = res.fullName;
      this.dem.idUserCreator = res.id;

    })

  }

  adminList: Administration[] = [];
  getAdminList() {
    this.adminService.ListAdministration().subscribe(res => {
      this.adminList = res
    })
  }

  autre: boolean = false;
  video: boolean = false;
  prog: boolean = false;
  imprimante: boolean = false;
  getService(event) {
    if (event.target.value == "أخرى") {
      this.autre = true;
      this.video = false;
      this.prog = false;
      this.imprimante =false
    } else {
      this.autre = false;
    }
    if (event.target.value == "تشغيل جهاز الفيديو كونفرنس") {
      this.video = true;
      this.autre = false;
      this.prog = false;
      this.imprimante = false
    } else {
      this.video = false;
    }
    if (event.target.value == "تنصيب برنامج") {
      this.prog = true;
      this.autre = false;
      this.video = false;

      this.imprimante = false
    } else {
      this.prog = false;
    }
    if (event.target.value == "تعريف طابعة" || event.target.value == "تعريف آلة تصوير" || event.target.value == "تعريف ماسح ضوئي"
      || event.target.value == 'صيانة جهاز طابعة' || event.target.value == 'صيانة آلة تصوير') {
      this.imprimante = true;
      this.prog = false;
      this.autre = false;
      this.video = false;
    } else {

      this.imprimante = false
    }
  }
  typeList: TbListening[] = [];
  getServices() {
    this.demTypeService.List().subscribe(res => {
      this.typeList=res
    })
  }

  dem: TechDem = new TechDem();
  isValidFormSubmitted = false;
  date = new Date().toLocaleDateString();
  onSubmit(form: NgForm) {

    if (form.invalid) {

      this.isValidFormSubmitted = false;
    }
    else {
      this.isValidFormSubmitted = true;
      this.dem.etat = "في الإنتظار";
      this.dem.dateenreg = this.date;
      this.demTechService.Create(this.dem).subscribe(res =>{

        this.pj.serviceId = res.id;
        this.pj.serviceName = "DemTech";
        this.fileslist.forEach(item => {
          this.pj.path = item;
          this.filesService.Add(this.pj).subscribe(resfiles => {
            this.files1 = [];
          })
        });

        this.toastr.success("تم تسجيل الطلب   بنجاح", " تسجيل الطلب  ");
            form.resetForm();
      },
    err => {
      this.toastr.error("فشل تسجيل الطلب ", " تسجيل الطلب")
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
