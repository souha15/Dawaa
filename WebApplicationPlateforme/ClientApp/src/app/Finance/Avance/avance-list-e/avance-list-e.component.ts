import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserServiceService } from '../../../shared/Services/User/user-service.service';
import { ToastrService } from 'ngx-toastr';
import { AvanceService } from '../../../shared/Services/Finance/avance.service';
import { Avance } from '../../../shared/Models/Finance/avance.model';
import { NgForm } from '@angular/forms';
import { FileService } from '../../../shared/Models/ServiceRh/file-service.model';
import { UploadDownloadService } from '../../../shared/Services/Taches/upload-download.service';
import { FileServiceService } from '../../../shared/Services/ServiceRh/file-service.service';
import { ProgressStatus } from '../../../shared/Interfaces/progress-status';
import { HttpEventType } from '@angular/common/http';
import { ProgressStatusEnum } from '../../../shared/Enum/progress-status-enum.enum';

@Component({
  selector: 'app-avance-list-e',
  templateUrl: './avance-list-e.component.html',
  styleUrls: ['./avance-list-e.component.css']
})
export class AvanceListEComponent implements OnInit {
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
    this.resetForm();
  }

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
      this.factList = this.GfactList.filter(item => item.idUserCreator == this.UserIdConnected)
      this.factList.forEach(item => {
        if (item.transferera != null) {

          if (item.transferera == "1") {

            item.attribut2 = item.etatetab

          } else if (item.transferera == "2") {
            item.attribut2 = item.etattrh
          } else {
            if (item.etattrh == "موافقة" && item.etatetab == "موافقة") {
              item.attribut2 = "موافقة"
            } else if (item.etattrh == "رفض" || item.etatetab == "رفض") {
              item.attribut2 = "رفض"
            } else if (item.etattrh == "في الإنتظار" || item.etatetab == null) {
              item.attribut2 = "في الإنتظار"
            }
          }
        }

        if (item.etatC == "في الإنتظار") {
          this.etatok = true;
        } else this.etatok = false;
      })
    })
  }


 
  factId: number
  fact: Avance = new Avance();
  etatok: boolean;
  refuse: boolean;
  populateForm(facture: Avance) {
    this.avanceService.formData = Object.assign({}, facture)
    this.factId = facture.id;
    this.fact = Object.assign({}, facture);
    this.filesService.GetAvanceFiles(this.fact.id).subscribe(res => {
      this.filesList = res;
    })
  }

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

  factur: Avance = new Avance();

  updateRecord(form: NgForm) {

    this.factur = Object.assign(this.factur, form.value);
    this.factId = this.factur.id;
    if (this.avanceService.formData.etatC == "في الإنتظار") {
      this.avanceService.Edit().subscribe(res => {

        this.toastr.success('تم التحديث بنجاح', 'نجاح')

        this.resetForm();
        this.getDep();
      },
        err => {
          this.toastr.error(' لم يتم التحديث  ', ' فشل');
        }


      )
    } else {
      this.toastr.error(' السلفة  تحت الإجراء  ', ' فشل');
    }
  }

  resetForm(form?: NgForm) {

    if (form != null)
      form.resetForm();
    this.avanceService.formData = {
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
      etattrh: '',
      etatetab: '',
      datetrh: '',
      dateetab: '',
      tran1: '',
      tran2: '',
      tran3: '',
      tran4: '',
      tran5: '',
      tran6: '',
      prix: '',
      etatAvance: '',
      detail: '',
      nbMoisDeduire: '',
      mois: '',
      annee: '',
      dateDeduire: '',
      etatC: '',
      idC: '',
      nomC: '',
      dateC: '',
      raisonRefusC: '',
      idD: '',
      etatD: '',
      nomD: '',
      dateD: '',
      raisonRefusD: '',
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

  onDelete(Id) {
    if (confirm('Are you sure to delete this record ?')) {
      this.avanceService.Delete(Id)
        .subscribe(res => {
          this.getDep()
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
