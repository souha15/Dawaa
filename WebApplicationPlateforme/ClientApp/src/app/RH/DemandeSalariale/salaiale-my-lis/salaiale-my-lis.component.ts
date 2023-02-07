import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { DemandeSalarialeService } from '../../../shared/Services/Rh/demande-salariale.service';
import { ToastrService } from 'ngx-toastr';
import { UserServiceService } from '../../../shared/Services/User/user-service.service';
import { DemandeSalariale } from '../../../shared/Models/RH/demande-salariale.model';
import { NgForm } from '@angular/forms';
import { ProgressStatus } from '../../../shared/Interfaces/progress-status';
import { FileServiceService } from '../../../shared/Services/ServiceRh/file-service.service';
import { UploadDownloadService } from '../../../shared/Services/Taches/upload-download.service';
import { FileService } from '../../../shared/Models/ServiceRh/file-service.model';
import { ProgressStatusEnum } from '../../../shared/Enum/progress-status-enum.enum';
import { HttpEventType } from '@angular/common/http';
@Component({
  selector: 'app-salaiale-my-lis',
  templateUrl: './salaiale-my-lis.component.html',
  styleUrls: ['./salaiale-my-lis.component.css']
})
export class SalaialeMyLisComponent implements OnInit {

  @Output() public downloadStatus: EventEmitter<ProgressStatus>;

  constructor(private congeService: DemandeSalarialeService,
    private toastr: ToastrService,
    private UserService: UserServiceService,
    public filesService: FileServiceService,
    public serviceupload: UploadDownloadService, ) { this.downloadStatus = new EventEmitter<ProgressStatus>(); }



  ngOnInit(): void {
    this.getUserConnected();
    this.CongeList();
    this.resetForm();
    this.getFiles();
  }


  p: Number = 1;
  count: Number = 5;
  //Get UserConnected

  UserIdConnected: string;
  UserNameConnected: string;


  getUserConnected() {

    this.UserService.getUserProfileObservable().subscribe(res => {
      this.UserIdConnected = res.id;
      this.UserNameConnected = res.fullName;
    })

  }

  //Get Conge Demand Lis

  congeList: DemandeSalariale[] = [];
  filtredCongeList: DemandeSalariale[] = [];
  CongeList() {
    this.congeService.Get().subscribe(res => {
      this.congeList = res
      this.filtredCongeList = this.congeList.filter(item => item.idUserCreator == this.UserIdConnected)
    })
  }

  //Edit Administration
  congeId: number;
  onSubmit(form: NgForm) {

    this.updateRecord(form)
  }
  date = new Date().toLocaleDateString();
  conge: DemandeSalariale = new DemandeSalariale();
  updateRecord(form: NgForm) {
    
    this.conge = Object.assign(this.conge, form.value);
    console.log(this.conge);
    this.congeId = this.conge.id;
    this.congeService.formData.etatdate = this.date;
    if (this.conge.etat == "في الانتظار") {
      this.congeService.Edit().subscribe(res => {
        this.toastr.success('تم التحديث بنجاح', 'نجاح')
        this.resetForm();
        this.CongeList();
      },
        err => {
          this.toastr.error('لم يتم التحديث  ', ' فشل');
        }


      )
    } if (this.conge.etat == 'موافق') {
      this.toastr.error('لقد تمت الموافقة على طلب  مشهد براتب', ' لم يتم التحديث');
    } if (this.conge.etat == 'رفض') {
      this.toastr.error('لقد تم رفض طلب  مشهد براتب', ' لم يتم التحديث');
    }
  }

  fact: DemandeSalariale = new DemandeSalariale();
  populateForm(conge: DemandeSalariale) {
    this.congeService.formData = Object.assign({}, conge)
    this.congeId = conge.id
    this.fact = Object.assign({}, conge);
    this.filesService.GetSalarialeFiles(this.congeId).subscribe(res => {
      this.filesList = res;
    })
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
      userNameCreator: '',
      idUserCreator: '',
      dirnom: '',
      dirid: '',
      etat: '',
      etatdate: '',

    }
  }

  onDelete(Id) {
    if (confirm('Are you sure to delete this record ?')) {
      this.congeService.Delete(Id)
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

