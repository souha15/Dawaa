import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DemandeAttestationTravailService } from '../../../shared/Services/ServiceRh/demande-attestation-travail.service';
import { DemandeAttestationTravail } from '../../../shared/Models/ServiceRh/demande-attestation-travail.model';
import { ToastrService } from 'ngx-toastr';
import { ProgressStatus } from '../../../shared/Interfaces/progress-status';
import { FileServiceService } from '../../../shared/Services/ServiceRh/file-service.service';
import { UploadDownloadService } from '../../../shared/Services/Taches/upload-download.service';
import { FileService } from '../../../shared/Models/ServiceRh/file-service.model';
import { ProgressStatusEnum } from '../../../shared/Enum/progress-status-enum.enum';
import { HttpEventType } from '@angular/common/http';


@Component({
  selector: 'app-histo-attestation',
  templateUrl: './histo-attestation.component.html',
  styleUrls: ['./histo-attestation.component.css']
})
export class HistoAttestationComponent implements OnInit {
  filter;
  @Output() public downloadStatus: EventEmitter<ProgressStatus>;

  constructor(private atService: DemandeAttestationTravailService,
    private toastr: ToastrService,
    public filesService: FileServiceService,
    public serviceupload: UploadDownloadService, ) { this.downloadStatus = new EventEmitter<ProgressStatus>(); }



  ngOnInit(): void {
    this.getCreance();
    this.getFiles();
  }

  p: Number = 1;
  count: Number = 5;

  factList: DemandeAttestationTravail[] = [];
  GfactList: DemandeAttestationTravail[] = [];

  getCreance() {
    this.atService.Get().subscribe(res => {
      this.factList = res;
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
    this.fact.attribut6 = this.reason

    this.atService.PutObservableE(this.fact).subscribe(res => {
      this.getCreance();
      this.toastr.success("تم  رفض الطلب بنجاح", "نجاح");
    },
      err => {
        this.toastr.warning('لم يتم رفض الطلب ', ' فشل');
      })
  }


  onDelete(id: number) {


    if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      this.atService.Delete(id)
        .subscribe(res => {
          this.getCreance();
          this.toastr.success("تم الحذف  بنجاح", "نجاح");
        },

          err => {
            console.log(err);
            this.toastr.warning('لم يتم الحذف  ', ' فشل');
          }
        )

    }

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
