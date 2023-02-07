import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { DemissionService } from '../../../shared/Services/User Services/demission.service';
import { Demissioon } from '../../../shared/Models/User Services/demissioon.model';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { switchAll } from 'rxjs/operators';
import { HttpEventType } from '@angular/common/http';
import { ProgressStatus } from '../../../shared/Interfaces/progress-status';
import { UploadDownloadService } from '../../../shared/Services/Taches/upload-download.service';
import { FileServiceService } from '../../../shared/Services/ServiceRh/file-service.service';
import { FileService } from '../../../shared/Models/ServiceRh/file-service.model';
import { ProgressStatusEnum } from '../../../shared/Enum/progress-status-enum.enum';

@Component({
  selector: 'app-histo-demission',
  templateUrl: './histo-demission.component.html',
  styleUrls: ['./histo-demission.component.css']
})
export class HistoDemissionComponent implements OnInit {
  @Output() public downloadStatus: EventEmitter<ProgressStatus>;

  constructor(private demService: DemissionService,
    private toastr: ToastrService,
    public filesService: FileServiceService,
    public serviceupload: UploadDownloadService, ) { this.downloadStatus = new EventEmitter<ProgressStatus>(); }



  ngOnInit(): void {
    this.CongeList();
    this.getFiles();
  }

  //Get Conge Demand Lis

  congeList: Demissioon[] = [];
  dem: Demissioon = new Demissioon();
  filtredCongeList: Demissioon[] = [];
  CongeList() {
    this.demService.Get().subscribe(res => {
      this.filtredCongeList = res
    })
  }
  val: string;
  test0: boolean = false;
  test50: boolean = false;
  test100: boolean = false;
  per: Demissioon = new Demissioon();
  populateForm(conge: Demissioon) {
    this.demService.formData = Object.assign({}, conge);
    this.per = Object.assign({}, conge);
    this.filesService.GetDemissionFiles(this.per.id).subscribe(res => {
      this.filesList = res;
    })
    if (this.per.etatrh == 'موافق' && this.per.etatdir == "موافق") {
      this.val = "100%"
      this.test100 = true;
      this.test50 = false;
      this.test0 = false;

    } else if (this.per.etat == "موافق") {
      this.val = "100%"
      this.test100 = true;
      this.test50 = false;
      this.test0 = false;
    }
    else if (this.per.etatdir == 'في الانتظار' && this.per.etatrh == "في الانتظار" && this.per.etat =="في الانتظار") {
      this.val = "0%"
      this.test100 = false;
      this.test50 = false;
      this.test0 = true;
    }

    else if (this.per.etatdir == "موافق" && this.per.etatrh == "في الانتظار" && this.per.etat == "في الانتظار") {
      this.val = "50%"
      console.log("3" + this.val)
      this.test100 = false;
      this.test50 = true;
      this.test0 = false;
    }

  }
  p: Number = 1;
  count: Number = 5;

  etat: string;
  etattest(event) {
    this.etat = event.target.value;
  }
  updateRecord(form: NgForm) {

    this.per.etat = this.etat;
    this.demService.PutObservableE(this.per).subscribe(res => {
        this.toastr.success('تم التحديث بنجاح', 'نجاح')
        this.CongeList();
        form.resetForm();
    },
      err => {
        this.toastr.error('لم يتم التحديث  ', ' فشل');
      })

  }

  onSubmit(form: NgForm) {

    this.updateRecord(form)
  }


  onDelete(id: number) {


    if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      this.demService.Delete(id)
        .subscribe(res => {
          this.CongeList();
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
