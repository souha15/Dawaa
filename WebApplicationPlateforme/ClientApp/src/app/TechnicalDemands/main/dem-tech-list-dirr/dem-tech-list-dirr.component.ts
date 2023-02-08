import { Component, OnInit, EventEmitter, Output } from '@angular/core';
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
  selector: 'app-dem-tech-list-dirr',
  templateUrl: './dem-tech-list-dirr.component.html',
  styleUrls: ['./dem-tech-list-dirr.component.css']
})
export class DemTechListDirrComponent implements OnInit {


  @Output() public downloadStatus: EventEmitter<ProgressStatus>;

  constructor(private demTechService: TechDemService,
    private demTypeService: TypeTechDemService,
    private UserService: UserServiceService,
    private adminService: AdministrationService,
    private toastr: ToastrService,
    public filesService: FileServiceService,
    public serviceupload: UploadDownloadService, ) { this.downloadStatus = new EventEmitter<ProgressStatus>(); }


  ngOnInit(): void {
    this.getUserConnected();
    this.getDemList();
    this.getFiles();
    this.getAdminList();
    this.getServices()
  }
  p: Number = 1;
  count: Number = 5;

  List2: TechDem[] = []
  List: TechDem[] = []


  getDemList() {
    this.demTechService.List().subscribe(res => {
      this.List2 = res
      this.List = this.List2.filter(item => item.etat == "في الإنتظار")
    })
  }
  UserIdConnected: string;
  UserNameConnected: string;
  getUserConnected() {

    this.UserService.getUserProfileObservable().subscribe(res => {
      this.UserNameConnected = res.fullName;
      this.UserIdConnected = res.id;

    })

  }

  adminList: Administration[] = [];
  getAdminList() {
    this.adminService.ListAdministration().subscribe(res => {
      this.adminList = res
    })
  }
  populateForm(dem: TechDem) {
    this.demTechService.formData = Object.assign({}, dem)
    this.dem = Object.assign({}, dem);
    this.filesService.GetDemTechFiles(this.dem.id).subscribe(res => {
      this.filesList = res;
    })
    if (this.dem.typedem == "أخرى") {
      this.autre = true;
      this.video = false;
      this.prog = false;
      this.imprimante = false
    } else {
      this.autre = false;
    }
    if (this.dem.typedem == "تشغيل جهاز الفيديو كونفرنس") {
      this.video = true;
      this.autre = false;
      this.prog = false;
      this.imprimante = false
    } else {
      this.video = false;
    }
    if (this.dem.typedem == "تنصيب برنامج") {
      this.prog = true;
      this.autre = false;
      this.video = false;

      this.imprimante = false
    } else {
      this.prog = false;
    }
    if (this.dem.typedem == "تعريف طابعة" || this.dem.typedem == "تعريف آلة تصوير" || this.dem.typedem == "تعريف ماسح ضوئي"
      || this.dem.typedem == 'صيانة جهاز طابعة' || this.dem.typedem == 'صيانة آلة تصوير') {
      this.imprimante = true;
      this.prog = false;
      this.autre = false;
      this.video = false;
    } else {

      this.imprimante = false
    }

  }
  autre: boolean = false;
  video: boolean = false;
  prog: boolean = false;
  imprimante: boolean = false;
  typeList: TbListening[] = [];
  getServices() {
    this.demTypeService.List().subscribe(res => {
      this.typeList = res
    })
  }

  dem: TechDem = new TechDem();
  isValidFormSubmitted = false;
  date = new Date().toLocaleDateString();
    etat: string;
  etattest(event) {
    this.etat = event.target.value;
  }

  onSubmit(form: NgForm) {
    this.dem.techid = this.UserIdConnected;
    this.dem.technnom = this.UserNameConnected
    this.dem.etatdate = this.date
    this.demTechService.PutObservableE(this.dem).subscribe(res => {
      this.getDemList();
      this.toastr.success("تم الحذف  بنجاح", "نجاح");
    },
      err => {
        this.toastr.error("فشل تحديث الطلب ", " تحديث الطلب")})
  }
  //Download
  filesList: FileService[] = [];
  public files: string[];
  private getFiles() {
    this.serviceupload.getFiles().subscribe(
      data => {
        this.files = data

      }
    );

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
