import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserServiceService } from '../../../shared/Services/User/user-service.service';
import { ToastrService } from 'ngx-toastr';
import { CreationTravailDemandeService } from '../../../shared/Services/ServiceRh/creation-travail-demande.service';
import { CrationTravailDemande } from '../../../shared/Models/ServiceRh/cration-travail-demande.model';
import { NgForm } from '@angular/forms';
import { ProgressStatus } from '../../../shared/Interfaces/progress-status';
import { FileServiceService } from '../../../shared/Services/ServiceRh/file-service.service';
import { UploadDownloadService } from '../../../shared/Services/Taches/upload-download.service';
import { FileService } from '../../../shared/Models/ServiceRh/file-service.model';
import { HttpEventType } from '@angular/common/http';
import { ProgressStatusEnum } from '../../../shared/Enum/progress-status-enum.enum';
@Component({
  selector: 'app-creation-list',
  templateUrl: './creation-list.component.html',
  styleUrls: ['./creation-list.component.css']
})
export class CreationListComponent implements OnInit {

  @Output() public downloadStatus: EventEmitter<ProgressStatus>;

  constructor(private UserService: UserServiceService,
    private toastr: ToastrService,
    private ctService: CreationTravailDemandeService,
    public filesService: FileServiceService,
    public serviceupload: UploadDownloadService, ) { this.downloadStatus = new EventEmitter<ProgressStatus>(); }


  ngOnInit(): void {
    this.getUserConnected();
    this.getCreance();
    this.getFiles();
    this.resetForm();
  }

  UserIdConnected: string;
  UserNameConnected: string;
  position:string
  getUserConnected() {

    this.UserService.getUserProfileObservable().subscribe(res => {
      this.UserIdConnected = res.id;
      this.UserNameConnected = res.fullName;
      this.position = res.position;
    })

  }


  factList: CrationTravailDemande[] = [];
  GfactList: CrationTravailDemande[] = [];

  getCreance() {
    this.ctService.Get().subscribe(res => {
      this.GfactList = res;

      this.factList = this.GfactList.filter(item => item.idUserCreator == this.UserIdConnected)

    })

  }

  updateRecord(form: NgForm) {

    if (this.ctService.formData.etat == "في الإنتظار") {
      this.ctService.Edit().subscribe(res => {
        this.toastr.success('تم التحديث بنجاح', 'نجاح')
        this.resetForm();
        this.getCreance();
      },
        err => {
          this.toastr.error(' لم يتم التحديث  ', ' فشل');
        }


      )
    } else {
      this.toastr.error(' لم يتم التحديث الطلب تحت الإجرء   ', ' فشل');
    }
  }

  factId: number
  fact: CrationTravailDemande = new CrationTravailDemande();
  populateForm(facture: CrationTravailDemande) {
    this.ctService.formData = Object.assign({}, facture)
    this.factId = facture.id;
    this.fact = Object.assign({}, facture);
    this.filesService.GetCreationFiles(this.fact.id).subscribe(res => {
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
  resetForm(form?: NgForm) {

    if (form != null)
      form.resetForm();
    this.ctService.formData = {
      id: null,
      transferera:  '',
      transfertetab:  '',
      transfertrh:  '',
      transfertdeux:  '',
      datetransfert:  '',
      idtrh:  '',
      idtetab:  '',
      nomtrh:  '',
      nomtetab:  '',
      etattrh:  '',
      etatetab:  '',
      datetrh:  '',
      dateetab:  '',
      tran1:  '',
      tran2:  '',
      tran3:  '',
      tran4:  '',
      tran5:  '',
      tran6:  '',
      username: '',
      titreposte: '',
      selection: '',
      tacheTravail: '',
      competence: '',
      diplome: '',
      datedebut: '',
      iddir: '',
      nomdir: '',
      datedir: '',
      etatdir: '',
      etat: '',
      idrh: '',
      etatrh: '',
      nomrh: '',
      daterh: '',
      datedg: '',
      etatdg: '',
      iddg: '',
      nomdg: '',
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
      this.ctService.Delete(Id)
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
