import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserServiceService } from '../../../shared/Services/User/user-service.service';
import { ToastrService } from 'ngx-toastr';
import { CreationTravailDemandeService } from '../../../shared/Services/ServiceRh/creation-travail-demande.service';
import { CrationTravailDemande } from '../../../shared/Models/ServiceRh/cration-travail-demande.model';
import { NgForm } from '@angular/forms';
import { ProgressStatus } from '../../../shared/Interfaces/progress-status';
import { FileServiceService } from '../../../shared/Services/ServiceRh/file-service.service';
import { UploadDownloadService } from '../../../shared/Services/Taches/upload-download.service';
import { FileService } from '../../../shared/Models/ServiceRh/file-service.model';
import { HttpEventType } from '@angular/common/http';
import { ProgressStatusEnum } from '../../../shared/Enum/progress-status-enum.enum';
@Component({
  selector: 'app-creation-list-rh',
  templateUrl: './creation-list-rh.component.html',
  styleUrls: ['./creation-list-rh.component.css']
})
export class CreationListRhComponent implements OnInit {
  @Output() public downloadStatus: EventEmitter<ProgressStatus>;

  constructor(private UserService: UserServiceService,
    private toastr: ToastrService,
    private ctService: CreationTravailDemandeService,
    public filesService: FileServiceService,
    public serviceupload: UploadDownloadService, ) { this.downloadStatus = new EventEmitter<ProgressStatus>(); }


  ngOnInit(): void {
    this.getUserConnected();
    this.getCreance();
    this.getFiles();
  }

  UserIdConnected: string;
  UserNameConnected: string;
  position: string
  getUserConnected() {

    this.UserService.getUserProfileObservable().subscribe(res => {
      this.UserIdConnected = res.id;
      this.UserNameConnected = res.fullName;
      this.position = res.position;
    })

  }


  factList: CrationTravailDemande[] = [];
  GfactList: CrationTravailDemande[] = [];

  getCreance() {
    this.ctService.Get().subscribe(res => {
      this.GfactList = res;

      this.factList = this.GfactList.filter(item => item.etatdir == "موافقة" && item.etatrh == "في الإنتظار")

    })

  }

  date = new Date().toLocaleDateString();
  accept() {
    this.fact.etat = "موافقة"
    this.fact.daterh = this.date;
    this.fact.etatrh = "موافقة"
    this.fact.idrh = this.UserIdConnected;
    this.fact.nomrh = this.UserNameConnected;
    this.ctService.PutObservableE(this.fact).subscribe(res => {
      this.getCreance();
      this.toastr.success("تم  قبول الطلب بنجاح", "نجاح");
    },
      err => {
        this.toastr.warning('لم يتم  قبول الطلب', ' فشل');
      })

  }


  factId: number
  fact: CrationTravailDemande = new CrationTravailDemande();
  populateForm(facture: CrationTravailDemande) {
    this.ctService.formData = Object.assign({}, facture)
    this.factId = facture.id;
    this.fact = Object.assign({}, facture);
    this.filesService.GetCreationFiles(this.fact.id).subscribe(res => {
      this.filesList = res;
    })
  }


  refuse() {
    this.fact.etat = "رفض"
    this.fact.daterh = this.date;
    this.fact.etatrh = "رفض"
    this.fact.idrh = this.UserIdConnected;
    this.fact.nomrh = this.UserNameConnected;

    this.ctService.PutObservableE(this.fact).subscribe(res => {
      this.getCreance();
      this.toastr.success("تم  رفض الطلب بنجاح", "نجاح");
    },
      err => {
        this.toastr.warning('لم يتم رفض الطلب ', ' فشل');
      })

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
