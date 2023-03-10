import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UserServiceService } from '../../../shared/Services/User/user-service.service';
import { ToastrService } from 'ngx-toastr';
import { NewFormationService } from '../../../shared/Services/ServiceRh/new-formation.service';
import { NewFormation } from '../../../shared/Models/ServiceRh/new-formation.model';
import { NgForm } from '@angular/forms';
import { TbListening } from '../../../shared/Models/Evenements/tb-listening.model';
import { TbListeningService } from '../../../shared/Services/Evenements/tb-listening.service';
import { DemandeFormationService } from '../../../shared/Services/ServiceRh/demande-formation.service';
import { DemandeFormation } from '../../../shared/Models/ServiceRh/demande-formation.model';
import { ProgressStatus } from '../../../shared/Interfaces/progress-status';
import { FileServiceService } from '../../../shared/Services/ServiceRh/file-service.service';
import { UploadDownloadService } from '../../../shared/Services/Taches/upload-download.service';
import { FileService } from '../../../shared/Models/ServiceRh/file-service.model';
import { ProgressStatusEnum } from '../../../shared/Enum/progress-status-enum.enum';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-new-formation-request-list',
  templateUrl: './new-formation-request-list.component.html',
  styleUrls: ['./new-formation-request-list.component.css']
})
export class NewFormationRequestListComponent implements OnInit {
  @Output() public downloadStatus: EventEmitter<ProgressStatus>;

  constructor(private UserService: UserServiceService,
    private toastr: ToastrService,
    private atService: NewFormationService,
    private specialiteService: TbListeningService,
    private atforService: DemandeFormationService,
    public filesService: FileServiceService,
    public serviceupload: UploadDownloadService, ) { this.downloadStatus = new EventEmitter<ProgressStatus>(); }


  ngOnInit(): void {
    this.getUserConnected();
    this.getCreance();
    this.resetForm();
    this.GetSpecList();
    this.resetForm1();

    this.getFiles();
  }
  p: Number = 1;
  count: Number = 5;

  // Get Specilite List

  SpecList: TbListening[] = [];

  GetSpecList() {
    this.specialiteService.Get().subscribe(res => {
      this.SpecList = res
    })
  }


  UserIdConnected: string;
  UserNameConnected: string;

  getUserConnected() {

    this.UserService.getUserProfileObservable().subscribe(res => {
      this.UserIdConnected = res.id;
      this.UserNameConnected = res.fullName;

    })

  }

  factList: NewFormation[] = [];
  GfactList: NewFormation[] = [];
  factList1: DemandeFormation[] = [];
  GfactList1: DemandeFormation[] = [];
 

  getCreance() {
    this.atService.Get().subscribe(res => {
      this.GfactList = res;

      this.factList = this.GfactList.filter(item => item.idUserCreator == this.UserIdConnected && item.attribut2 == "?????? ??????????")
      this.factList.forEach(item => {
        if (item.transferera != null) {

          if (item.transferera == "1") {

            item.etat = item.etatetab

          } else if (item.transferera == "2") {
            item.etat = item.etatrh
          } else {
            if (item.etatrh == "????????????" && item.etatetab == "????????????") {
              item.etat = "????????????"
            } else if (item.etatrh == "??????" || item.etatetab == "??????") {
              item.etat = "??????"
            } else if (item.etatrh == "???? ????????????????" || item.etatetab == null) {
              item.etat = "???? ????????????????"
            }
          }
        }

      })

    })

    this.atforService.Get().subscribe(res => {
      this.GfactList1 = res;

      this.factList1 = this.GfactList1.filter(item => item.idUserCreator == this.UserIdConnected && item.attribut2 == "?????? ??????????")
    })

  }

  //Populate Form 
  factId: number
  fact: NewFormation = new NewFormation();
  etatok: boolean;
  populateForm(facture: NewFormation) {
    this.atService.formData = Object.assign({}, facture)
    this.factId = facture.id;

    this.filesService.GetFormationFiles(this.factId).subscribe(res => {
      this.filesList = res;
    })
    this.fact = Object.assign({}, facture);
    if (this.fact.etat == "???? ????????????????") {
      this.etatok = false;
    } else
      this.etatok = true
  }

  fact1: DemandeFormation = new DemandeFormation();
  populateForm1(facture: DemandeFormation) {
    this.atforService.formData = Object.assign({}, facture)
    this.fact1 = Object.assign({}, facture);
    if (this.fact1.etat == "???? ????????????????") {
      this.etatok = false;
    } else
      this.etatok = true
  }

  done1() {
    if (this.fact1.etat == "????????????") {
      this.fact1.attribut2 = "??????????"

      this.atforService.PutObservableE(this.fact1).subscribe(res => {
        this.getCreance();
        this.toastr.success('???? ?????????????? ??????????', '????????')

      },
        err => {
          this.toastr.error(' ???? ?????? ??????????????  ', ' ??????');
        })
    } else {
      this.toastr.error('???? ?????? ???????????????? ?????? ?????????? ?????? ', ' ??????');
    }
  }

  done() {
    if (this.fact.etat == "????????????") {
    this.fact.attribut2 = "??????????"
    this.atService.PutObservableE(this.fact).subscribe(res => {
      this.getCreance();
      this.toastr.success('???? ?????????????? ??????????', '????????')

    },
      err => {
        this.toastr.error(' ???? ?????? ??????????????  ', ' ??????');
      })
    } else {
      this.toastr.error('???? ?????? ???????????????? ?????? ?????????? ?????? ', ' ??????');
    }
  }
  updateRecord(form: NgForm) {

    if (this.atService.formData.etat == "???? ????????????????") {
      this.atService.Edit().subscribe(res => {
        this.toastr.success('???? ?????????????? ??????????', '????????')
        this.resetForm();
        this.getCreance();
      },
        err => {
          this.toastr.error(' ???? ?????? ??????????????  ', ' ??????');
        }


      )
    } else {
      this.toastr.error(' ???? ?????? ?????????????? ?????????? ?????? ????????????   ', ' ??????');
    }
  }

  updateRecord1(formP: NgForm) {
    console.log(this.atforService.formData.etat)
    if (this.atforService.formData.etat == "???? ????????????????") {
      this.atforService.Edit().subscribe(res => {
        this.toastr.success('???? ?????????????? ??????????', '????????')
        this.resetForm1();
        this.getCreance();
      },
        err => {
          this.toastr.error(' ???? ?????? ??????????????  ', ' ??????');
        }


      )
    } else {
      this.toastr.error(' ???? ?????? ?????????????? ?????????? ?????? ????????????   ', ' ??????');
    }
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

  onSubmit1(formP: NgForm) {
    if (formP.invalid) {
      this.isValidFormSubmitted = false;

    }
    else {

      this.isValidFormSubmitted = true
      this.updateRecord1(formP)
    }
  }

  resetForm(form?: NgForm) {

    if (form != null)
      form.resetForm();
    this.atService.formData = {
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
      titre: '',
      specialite: '',
      autreSpec: '',
      org: '',
      duree: '',
      prix: '',
      lien: '',
      detail: '',
      etat: '',
      etatdir: '',
      iddir: '',
      nomdir: '',
      datedir: '',
      etatrh: '',
      idrh: '',
      nomrh: '',
      daterh: '',
      etatc: '',
      idc: '',
      nomc: '',
      datec: '',
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

  resetForm1(formP?: NgForm) {

    if (formP != null)
      formP.resetForm();
    this.atforService.formData = {
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
      titre: '',
      specialite: '',
      autreSpec: '',
      org: '',
      duree: '',
      prix: '',
      lien: '',
      detail: '',
      etat: '',
      etatdir: '',
      iddir: '',
      nomdir: '',
      datedir: '',
      etatrh: '',
      idrh: '',
      nomrh: '',
      daterh: '',
      etatc: '',
      idc: '',
      nomc: '',
      datec: '',
      idFormation: null,
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
    if (this.atService.formData.etat == "???? ????????????????") {
      if (confirm('Are you sure to delete this record ?')) {
        this.atService.Delete(Id)
          .subscribe(res => {
            this.getCreance();
            this.toastr.success("???? ??????????  ??????????", "????????");
          },

            err => {
              console.log(err);
              this.toastr.warning('???? ?????? ??????????  ', ' ??????');

            }
          )

      }
    }
    else {
      this.toastr.error(' ???? ?????? ?????????????? ?????????? ?????? ????????????   ', ' ??????');
    }
  }

  onDelete1(Id) {
    if (this.atforService.formData.etat == "???? ????????????????") {
    if (confirm('Are you sure to delete this record ?')) {
      this.atforService.Delete(Id)
        .subscribe(res => {
          this.getCreance();
          this.toastr.success("???? ??????????  ??????????", "????????");
        },

          err => {
            console.log(err);
            this.toastr.warning('???? ?????? ??????????  ', ' ??????');

          }
        )

    }
  }else {
  this.toastr.error(' ???? ?????? ?????????????? ?????????? ?????? ????????????   ', ' ??????');
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
