import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DemandeSalarialeService } from '../../../shared/Services/Rh/demande-salariale.service';
import { DemandeSalariale } from '../../../shared/Models/RH/demande-salariale.model';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { ProgressStatus } from '../../../shared/Interfaces/progress-status';
import { FileServiceService } from '../../../shared/Services/ServiceRh/file-service.service';
import { UploadDownloadService } from '../../../shared/Services/Taches/upload-download.service';
import { FileService } from '../../../shared/Models/ServiceRh/file-service.model';
import { ProgressStatusEnum } from '../../../shared/Enum/progress-status-enum.enum';
import { HttpEventType } from '@angular/common/http';
@Component({
  selector: 'app-histo-slaire',
  templateUrl: './histo-slaire.component.html',
  styleUrls: ['./histo-slaire.component.css']
})
export class HistoSlaireComponent implements OnInit {
  @Output() public downloadStatus: EventEmitter<ProgressStatus>;

  constructor(private congeService: DemandeSalarialeService,
    private toastr: ToastrService,
    public filesService: FileServiceService,
    public serviceupload: UploadDownloadService, ) { this.downloadStatus = new EventEmitter<ProgressStatus>(); }


  ngOnInit(): void {
    this.CongeList();
    this.resetForm();
    this.getFiles();
  }
  p: Number = 1;
  count: Number = 5;

  congeList: DemandeSalariale[] = [];
  filtredCongeList: DemandeSalariale[] = [];
  CongeList() {
    this.congeService.Get().subscribe(res => {
      this.filtredCongeList = res
    })
  }

  per: DemandeSalariale = new DemandeSalariale();

  populateForm(conge: DemandeSalariale) {
    this.per = Object.assign({}, conge)
    this.congeService.formData = Object.assign({}, conge)

    this.filesService.GetSalarialeFiles(this.per.id).subscribe(res => {
      this.filesList = res;
    })
  }

  date = new Date().toLocaleDateString();
  conge: DemandeSalariale = new DemandeSalariale();

  updateRecord(form: NgForm) {

    this.conge = Object.assign(this.conge, form.value);
    this.congeService.Edit().subscribe(res => {
      this.toastr.success('تم التحديث بنجاح', 'نجاح')
      this.resetForm();
      this.CongeList();
    },
      err => {
        this.toastr.error('لم يتم التحديث  ', ' فشل');
      }


    )

  }


  onDelete(id: number) {


    if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      this.congeService.Delete(id)
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

  onSubmit(form: NgForm) {

    this.updateRecord(form)
  }

  resetForm(form?: NgForm) {

    if (form != null)
      form.resetForm();
    this.congeService.formData = {
      id: null,
      type: '',
      date: '',
      langue: '',
      organisme: '',
      attribut1: '',
      attribut2: '',
      dateenreg: '',
      dirnom: '',
      dirid: '',
      etatdate: '',
      etat: '',
      userNameCreator: '',
      idUserCreator: '',

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
