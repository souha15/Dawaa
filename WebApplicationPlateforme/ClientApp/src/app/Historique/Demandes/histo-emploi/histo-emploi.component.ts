import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CreationTravailDemandeService } from '../../../shared/Services/ServiceRh/creation-travail-demande.service';
import { CrationTravailDemande } from '../../../shared/Models/ServiceRh/cration-travail-demande.model';
import { ToastrService } from 'ngx-toastr';
import { ProgressStatus } from '../../../shared/Interfaces/progress-status';
import { FileServiceService } from '../../../shared/Services/ServiceRh/file-service.service';
import { UploadDownloadService } from '../../../shared/Services/Taches/upload-download.service';
import { FileService } from '../../../shared/Models/ServiceRh/file-service.model';
import { ProgressStatusEnum } from '../../../shared/Enum/progress-status-enum.enum';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-histo-emploi',
  templateUrl: './histo-emploi.component.html',
  styleUrls: ['./histo-emploi.component.css']
})
export class HistoEmploiComponent implements OnInit {

  @Output() public downloadStatus: EventEmitter<ProgressStatus>;

  constructor(private ctService: CreationTravailDemandeService,
    private toastr: ToastrService,
    public filesService: FileServiceService,
    public serviceupload: UploadDownloadService, ) { this.downloadStatus = new EventEmitter<ProgressStatus>(); }


  ngOnInit(): void {
    this.getCreance();
    this.getFiles();
  }
  factList: CrationTravailDemande[] = [];
  GfactList: CrationTravailDemande[] = [];

  getCreance() {
    this.ctService.Get().subscribe(res => {
      this.factList = res;

    })

  }

  factId: number
  fact: CrationTravailDemande = new CrationTravailDemande();
  test0: boolean = false;
  test50: boolean = false;
  test75: boolean = false;
  test100: boolean = false;
  val: string;
  populateForm(facture: CrationTravailDemande) {
    this.ctService.formData = Object.assign({}, facture)
    this.factId = facture.id;
    this.fact = Object.assign({}, facture);
    this.filesService.GetCreationFiles(this.fact.id).subscribe(res => {
      this.filesList = res;
    })
    if (this.fact.etatdg == "???? ????????????????" && this.fact.etatrh == "???? ????????????????" && this.fact.etatdir == "???? ????????????????") {
      this.test0 = true;
      this.test50 = false;
      this.test75 = false;
      this.test100 = false;
      this.val = '0%'
    }
    else if (this.fact.etatrh == "????????????" && this.fact.etatdg == "????????????" && this.fact.etatdir == "???? ????????????????") {
      this.test0 = false;
      this.test50 = false;
      this.test75 = true;
      this.test100 = false;
      this.val = '75%'
    }
    else if (this.fact.etatdg == "????????????" && this.fact.etatrh == "???? ????????????????" && this.fact.etatdir == "???? ????????????????") {
      this.test0 = false;
      this.test50 = true;
      this.test75 = false;
      this.test100 = false;
      this.val = '50%'
    }
    else if ((this.fact.etatdir == "????????????" && this.fact.etatdg == "????????????" && this.fact.etatrh == "????????????") || this.fact.etat =="????????????") {
      this.test0 = false;
      this.test50 = false;
      this.test75 = false;
      this.test100 = true;
      this.val = '100%'
    }
  }

  date = new Date().toLocaleDateString();
  accept() {
   this.fact.etat = "????????????"
    this.fact.datedir = this.date;

    this.ctService.PutObservableE(this.fact).subscribe(res => {
      this.getCreance();
      this.toastr.success("????  ???????? ?????????? ??????????", "????????");
    },
      err => {
        this.toastr.warning('???? ??????  ???????? ??????????', ' ??????');
      })

  }


  refuse() {
    this.fact.etat = "??????"
    this.ctService.PutObservableE(this.fact).subscribe(res => {
      this.getCreance();
      this.toastr.success("????  ?????? ?????????? ??????????", "????????");
    },
      err => {
        this.toastr.warning('???? ?????? ?????? ?????????? ', ' ??????');
      })

  }

  onDelete(id: number) {


    if (confirm('???? ?????? ?????????? ???? ?????? ?????? ????????????')) {
      this.ctService.Delete(id)
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
