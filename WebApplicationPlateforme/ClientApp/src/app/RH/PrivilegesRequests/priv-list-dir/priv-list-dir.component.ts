import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { DemandeSuppHeure } from '../../../shared/Models/ServiceRh/demande-supp-heure.model';
import { DemandeSuppHeureService } from '../../../shared/Services/ServiceRh/demande-supp-heure.service';
import { ToastrService } from 'ngx-toastr';
import { UserServiceService } from '../../../shared/Services/User/user-service.service';
import { FileServiceService } from '../../../shared/Services/ServiceRh/file-service.service';
import { UploadDownloadService } from '../../../shared/Services/Taches/upload-download.service';
import { ProgressStatus } from '../../../shared/Interfaces/progress-status';
import { HttpEventType } from '@angular/common/http';
import { ProgressStatusEnum } from '../../../shared/Enum/progress-status-enum.enum';
import { FileService } from '../../../shared/Models/ServiceRh/file-service.model';

@Component({
  selector: 'app-priv-list-dir',
  templateUrl: './priv-list-dir.component.html',
  styleUrls: ['./priv-list-dir.component.css']
})
export class PrivListDirComponent implements OnInit {

  @Output() public downloadStatus: EventEmitter<ProgressStatus>;

  constructor(private suppheureService: DemandeSuppHeureService,
    private toastr: ToastrService,
    private UserService: UserServiceService,
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
  p: Number = 1;
  count: Number = 5;

  //Populate Form 
  factId: number
  fact: DemandeSuppHeure = new DemandeSuppHeure();
  populateForm(facture: DemandeSuppHeure) {
    this.suppheureService.formData = Object.assign({}, facture)
    this.factId = facture.id;
    this.fact = Object.assign({}, facture);

    this.filesService.GetSuppHeureFiles(this.fact.id).subscribe(res => {
      this.filesList = res;
    })
  }


  factList: DemandeSuppHeure[] = [];
  GfactList: DemandeSuppHeure[] = [];
  getCreance() {
    this.suppheureService.Get().subscribe(res => {
      this.GfactList = res;

      this.factList = this.GfactList.filter(item => item.attribut3 == "في الإنتظار" && item.etatdir == "موافقة" && item.transferera == null)

    })

  }

  date = new Date().toLocaleDateString();
  accept() {
    this.fact.attribut6 = this.date;
    this.fact.attribut3 = "موافقة"
    this.fact.attribut4 = this.UserIdConnected;
    this.fact.attribut5 = this.UserNameConnected;
    this.suppheureService.PutObservableE(this.fact).subscribe(res => {
      this.getCreance();
      this.toastr.success("تم  قبول الطلب بنجاح", "نجاح");
    },
      err => {
        this.toastr.warning('لم يتم  قبول الطلب', ' فشل');
      })

  }

  refuse() {
    this.fact.etat = "رفض"
    this.fact.attribut6 = this.date;
    this.fact.attribut3 = "رفض"
    this.fact.attribut4 = this.UserIdConnected;
    this.fact.attribut5 = this.UserNameConnected;

    this.suppheureService.PutObservableE(this.fact).subscribe(res => {
      this.getCreance();
      this.toastr.success("تم  رفض الطلب بنجاح", "نجاح");
    },
      err => {
        this.toastr.warning('لم يتم رفض الطلب ', ' فشل');
      })
  }


  transfererA: string;
  transfertData(event) {
    this.transfererA = event.target.value;
  }

  transferer() {
    this.fact.transferera = this.transfererA;
    this.suppheureService.PutObservableE(this.fact).subscribe(res => {
      this.toastr.success("تم  تحويل  الطلب بنجاح", "نجاح");
      this.getCreance();
    },
      err => {
        this.toastr.warning('لم يتم  تحويل  الطلب بنجاح', ' فشل');
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
