import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DemandeSuppHeure } from '../../../shared/Models/ServiceRh/demande-supp-heure.model';
import { ToastrService } from 'ngx-toastr';
import { UserServiceService } from '../../../shared/Services/User/user-service.service';
import { DemandeSuppHeureService } from '../../../shared/Services/ServiceRh/demande-supp-heure.service';
import { NgForm } from '@angular/forms';
import { FileServiceService } from '../../../shared/Services/ServiceRh/file-service.service';
import { UploadDownloadService } from '../../../shared/Services/Taches/upload-download.service';
import { ProgressStatus } from '../../../shared/Interfaces/progress-status';
import { HttpEventType } from '@angular/common/http';
import { ProgressStatusEnum } from '../../../shared/Enum/progress-status-enum.enum';
import { FileService } from '../../../shared/Models/ServiceRh/file-service.model';

@Component({
  selector: 'app-demande-supp-heure-list',
  templateUrl: './demande-supp-heure-list.component.html',
  styleUrls: ['./demande-supp-heure-list.component.css']
})
export class DemandeSuppHeureListComponent implements OnInit {
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
    this.resetForm();
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


  //editing Facture
  isValidFormSubmitted = false;
  date = new Date().toLocaleDateString();
  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.isValidFormSubmitted = false;

    }
    else {

      this.isValidFormSubmitted = true
      this.updateRecord(form)
    }
  }
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

      this.factList = this.GfactList.filter(item => item.idUserCreator == this.UserIdConnected)
      this.factList.forEach(item => {
        if (item.transferera != null) {

          if (item.transferera == "1") {

            item.attribut3 = item.etatetab

          } else if (item.transferera == "2") {
            item.attribut3 = item.etatrh
          } else {
            if (item.etatrh == "موافقة" && item.etatetab == "موافقة") {
              item.attribut3 = "موافقة"
            } else if (item.etatrh == "رفض" || item.etatetab == "رفض") {
              item.attribut3 = "رفض"
            } else if (item.etatrh == "في الإنتظار" || item.etatetab == null) {
              item.attribut3 = "في الإنتظار"
            }
          }
        }

      })

    })

  }


  updateRecord(form: NgForm) {

    if (this.suppheureService.formData.etatdir == "في الإنتظار") {
      this.suppheureService.Edit().subscribe(res => {
        this.toastr.success('تم التحديث بنجاح', 'نجاح')
        this.resetForm();
        this.getCreance();
      },
        err => {
          this.toastr.error(' لم يتم التحديث  ', ' فشل');
        }


      )
  }else{
      this.toastr.error(' الطلب تحت الإجراء ', ' فشل');
}
  }

  //Delete Dotation
  onDelete(Id) {

    if (this.suppheureService.formData.etatdir == "في الإنتظار") {
      if (confirm('Are you sure to delete this record ?')) {
        this.suppheureService.Delete(Id)
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
  }
  resetForm(form?: NgForm) {

    if (form != null)
      form.resetForm();
    this.suppheureService.formData = {
      id: null,
      transferera: '',
      transfertetab: '',
      transfertrh: '',
      transfertdeux: '',
      datetransfert: '',
      idtrh: '',
      idtetab: '',
      nomtrh: '',
      nomtetab: '',
      etatrh: '',
      etatetab: '',
      daterh: '',
      dateetab: '',
      tran1: '',
      tran2: '',
      tran3: '',
      tran4: '',
      tran5: '',
      tran6: '',
      date: '',
      detail: '',
      nbheure: '',
      username: '',
      idusername: '',
      etat: '',
      etatdir: '',
      datedir: '',
      nomdir: '',
      iddir: '',
      attribut1: null,
      attribut2: '',
      attribut3: '',
      attribut4: '',
      attribut5: '',
      attribut6: '',
      dateenreg: '',
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
