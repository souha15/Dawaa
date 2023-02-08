import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Avance } from '../../../shared/Models/Finance/avance.model';
import { UserServiceService } from '../../../shared/Services/User/user-service.service';
import { ToastrService } from 'ngx-toastr';
import { AvanceService } from '../../../shared/Services/Finance/avance.service';
import { FileService } from '../../../shared/Models/ServiceRh/file-service.model';
import { UploadDownloadService } from '../../../shared/Services/Taches/upload-download.service';
import { FileServiceService } from '../../../shared/Services/ServiceRh/file-service.service';
import { ProgressStatus } from '../../../shared/Interfaces/progress-status';
import { HttpEventType } from '@angular/common/http';
import { ProgressStatusEnum } from '../../../shared/Enum/progress-status-enum.enum';
@Component({
  selector: 'app-main-ready-avance',
  templateUrl: './main-ready-avance.component.html',
  styleUrls: ['./main-ready-avance.component.css']
})
export class MainReadyAvanceComponent implements OnInit {
  @Output() public downloadStatus: EventEmitter<ProgressStatus>;

  constructor(private UserService: UserServiceService,
    private toastr: ToastrService,
    private avanceService: AvanceService,
    public filesService: FileServiceService,
    public serviceupload: UploadDownloadService, ) { this.downloadStatus = new EventEmitter<ProgressStatus>(); }



  ngOnInit(): void {
    this.getUserConnected();
    this.getDep();

    this.getFiles();


  }
  p: Number = 1;
  count: Number = 5;
  UserIdConnected: string;
  UserNameConnected: string;
  getUserConnected() {
    this.UserService.getUserProfileObservable().subscribe(res => {
      this.UserIdConnected = res.id;
      this.UserNameConnected = res.fullName;

    })
  }

  factList: Avance[] = [];
  GfactList: Avance[] = [];
  getDep() {
    this.avanceService.Get().subscribe(res => {
      this.GfactList = res;
      this.factList = this.GfactList.filter(item => item.etatetab == "في الإنتظار" && item.etatC == "موافقة")
    })
  }

  factId: number
  fact: Avance = new Avance();
  etatok: boolean;
  populateForm(facture: Avance) {
    this.avanceService.formData = Object.assign({}, facture)
    this.factId = facture.id;
    this.fact = Object.assign({}, facture);
    this.filesService.GetAvanceFiles(this.fact.id).subscribe(res => {
      this.filesList = res;
    })
  }

  raisonRefus: string;
  raison(event) {
    this.raisonRefus = event.target.value;
  }

  date = new Date().toLocaleDateString();
  accept() {
    this.fact.etatetab = "موافقة"
    this.fact.dateetab = this.date;

    this.fact.idtetab = this.UserIdConnected;
    this.fact.nomtetab = this.UserNameConnected;

    this.avanceService.PutObservableE(this.fact).subscribe(res => {
      this.getDep();
      this.toastr.success("تم  قبول الطلب بنجاح", "نجاح");
    },
      err => {
        this.toastr.warning('لم يتم  قبول الطلب', ' فشل');
      })

  }
  refuse() {


    if (this.raisonRefus != null) {
      this.fact.raisonRefusD = this.raisonRefus;
      this.fact.attribut2 = "رفض"
      this.fact.etatetab = "رفض"
      this.fact.dateetab = this.date;
      this.fact.idtetab = this.UserIdConnected
      this.fact.nomtetab = this.UserNameConnected;


      this.avanceService.PutObservableE(this.fact).subscribe(res => {
        this.getDep();
        this.toastr.success("تم  رفض الطلب بنجاح", "نجاح");
      },
        err => {
          this.toastr.warning('لم يتم رفض الطلب ', ' فشل');
        })
    } else {
      this.toastr.error('اكتب سبب الرفض ', ' فشل');
    }
  }

  transfererA: string;
  transfertData(event) {
    this.transfererA = event.target.value;
  }

  transferer() {
    this.fact.transferera = this.transfererA;
    this.avanceService.PutObservableE(this.fact).subscribe(res => {
      this.toastr.success("تم  تحويل  الطلب بنجاح", "نجاح");
      this.getDep();
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
