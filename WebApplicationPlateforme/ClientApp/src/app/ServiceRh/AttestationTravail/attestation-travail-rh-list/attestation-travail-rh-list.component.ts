import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserServiceService } from '../../../shared/Services/User/user-service.service';
import { DemandeAttestationTravailService } from '../../../shared/Services/ServiceRh/demande-attestation-travail.service';
import { ToastrService } from 'ngx-toastr';
import { DemandeAttestationTravail } from '../../../shared/Models/ServiceRh/demande-attestation-travail.model';
import { NgForm } from '@angular/forms';
import { ProgressStatus } from '../../../shared/Interfaces/progress-status';
import { UploadDownloadService } from '../../../shared/Services/Taches/upload-download.service';
import { FileServiceService } from '../../../shared/Services/ServiceRh/file-service.service';
import { HttpEventType } from '@angular/common/http';
import { ProgressStatusEnum } from '../../../shared/Enum/progress-status-enum.enum';
import { FileService } from '../../../shared/Models/ServiceRh/file-service.model';

@Component({
  selector: 'app-attestation-travail-rh-list',
  templateUrl: './attestation-travail-rh-list.component.html',
  styleUrls: ['./attestation-travail-rh-list.component.css']
})
export class AttestationTravailRhListComponent implements OnInit {
  @Output() public downloadStatus: EventEmitter<ProgressStatus>;

  constructor(private UserService: UserServiceService,
    private toastr: ToastrService,
    private atService: DemandeAttestationTravailService,
    public filesService: FileServiceService,
    public serviceupload: UploadDownloadService, ) { this.downloadStatus = new EventEmitter<ProgressStatus>(); }



  ngOnInit(): void {
    this.getUserConnected();
    this.getCreance();
    this.getFiles();
  }

  UserIdConnected: string;
  UserNameConnected: string;

  getUserConnected() {

    this.UserService.getUserProfileObservable().subscribe(res => {
      this.UserIdConnected = res.id;
      this.UserNameConnected = res.fullName;

    })

  }

  factList: DemandeAttestationTravail[] = [];
  GfactList: DemandeAttestationTravail[] = [];

  getCreance() {
    this.atService.Get().subscribe(res => {
      this.GfactList = res;
      this.factList = this.GfactList.filter(item => item.etat == "في الإنتظار")

    })

  }

  //Populate Form 
  factId: number
  fact: DemandeAttestationTravail = new DemandeAttestationTravail();
  populateForm(facture: DemandeAttestationTravail) {
    this.atService.formData = Object.assign({}, facture)
    this.factId = facture.id;
    this.fact = Object.assign({}, facture);
    this.filesService.GetAttestationTravailFiles(this.fact.id).subscribe(res => {
      this.filesList = res;
    })
  }
  reason: string;
  getRefuseRaison(event) {
    this.reason = event.target.value;
  }
  date = new Date().toLocaleDateString();
  accept() {
    this.fact.etat = "موافقة"
    this.fact.daterh = this.date;
    this.fact.etatrh ="موافقة"
    this.fact.idrh = this.UserIdConnected;
    this.fact.nomrh = this.UserNameConnected;
    this.atService.PutObservableE(this.fact).subscribe(res => {
      this.getCreance();
      this.toastr.success("تم  قبول الطلب بنجاح", "نجاح");
    },
      err => {
        this.toastr.warning('لم يتم  قبول الطلب', ' فشل');
      })

  }
  refuse() {
    this.fact.etat = "رفض"
    this.fact.daterh = this.date;
    this.fact.etatrh = "رفض"
    this.fact.idrh = this.UserIdConnected;
    this.fact.nomrh = this.UserNameConnected;
    this.fact.attribut6 = this.reason

    this.atService.PutObservableE(this.fact).subscribe(res => {
      this.getCreance();
        this.toastr.success("تم  رفض الطلب بنجاح", "نجاح");
      },
        err => {
          this.toastr.warning('لم يتم رفض الطلب ', ' فشل');
        })
    }
  p: Number = 1;

  count: Number = 5;
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
