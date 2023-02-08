import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AvanceService } from '../../../shared/Services/Finance/avance.service';
import { Avance } from '../../../shared/Models/Finance/avance.model';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProgressStatus } from '../../../shared/Interfaces/progress-status';
import { FileServiceService } from '../../../shared/Services/ServiceRh/file-service.service';
import { UploadDownloadService } from '../../../shared/Services/Taches/upload-download.service';
import { FileService } from '../../../shared/Models/ServiceRh/file-service.model';
import { ProgressStatusEnum } from '../../../shared/Enum/progress-status-enum.enum';
import { HttpEventType } from '@angular/common/http';


@Component({
  selector: 'app-histo-avance',
  templateUrl: './histo-avance.component.html',
  styleUrls: ['./histo-avance.component.css']
})
export class HistoAvanceComponent implements OnInit {
  filter;
  @Output() public downloadStatus: EventEmitter<ProgressStatus>;

  constructor(private avanceService: AvanceService,
    private toastr: ToastrService,
    public filesService: FileServiceService,
    public serviceupload: UploadDownloadService, ) { this.downloadStatus = new EventEmitter<ProgressStatus>(); }



  ngOnInit(): void {
    this.getDep();
    this.getFiles();
  }

  p: Number = 1;
  count: Number = 5;

  factList: Avance[] = [];
  getDep() {
    this.avanceService.Get().subscribe(res => {
      this.factList = res;
    })
  }

  factId: number
  fact: Avance = new Avance();
  etatok: boolean;
  test0: boolean = false;
  test50: boolean = false;
  test75: boolean = false;
  test100: boolean = false;
  val: string;
  populateForm(facture: Avance) {
    this.avanceService.formData = Object.assign({}, facture)
    this.factId = facture.id;
    this.fact = Object.assign({}, facture);
    this.filesService.GetAvanceFiles(this.fact.id).subscribe(res => {
      this.filesList = res;
    })
    if (this.fact.etatD == "في الإنتظار" && this.fact.etatC == "في الإنتظار" && this.fact.etatetab == "في الانتظار") {
      this.test0 = true;
      this.test50= false;
      this.test75 = false;
      this.test100 = false;
      this.val="0%";
    }
 
    else if (this.fact.etatD == "موافقة" && this.fact.etatC == "في الإنتظار" && this.fact.etatetab == "في الإنتظار") {
      this.test0 = false;
      this.test50 = true;
      this.test75 = false;
      this.test100 = false;
      this.val = "50%";
    }
    else if (this.fact.etatetab == "موافقة" && this.fact.etatD == "موافقة" && this.fact.etatC == "في الإنتظار") {
      this.test0 = false;
      this.test50 = false;
      this.test75 = true;
      this.test100 = false;
      this.val = "75%";
    }
    else if ((this.fact.etatC == "موافقة" && this.fact.etatD == "موافقة" && this.fact.etatetab == "موافقة") || this.fact.attribut2 =="موافقة") {
      this.test0 = false;
      this.test50 = false;
      this.test75 = false;
      this.test100 = true;
      this.val = "100%";
    }



  }

  raisonRefus: string;
  raison(event) {
    this.raisonRefus = event.target.value;
  }

  date = new Date().toLocaleDateString();
  accept() {

    this.fact.attribut2 = "موافقة"
    this.fact.dateetab = this.date;
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
      this.fact.raisonRefusC = this.raisonRefus;
      this.fact.attribut2 = "رفض"
      this.fact.dateetab = this.date;
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


  onDelete(id: number) {


    if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      this.avanceService.Delete(id)
        .subscribe(res => {
          this.getDep();
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
