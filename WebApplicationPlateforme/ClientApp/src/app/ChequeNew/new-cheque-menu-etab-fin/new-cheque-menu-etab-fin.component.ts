import { Component, OnInit, EventEmitter, Output, ViewChild, Input, ElementRef } from '@angular/core';
import { ArticlePayChequeService } from '../../shared/Services/Cheques/article-pay-cheque.service';
import { TbListeningService } from '../../shared/Services/Evenements/tb-listening.service';
import { ListeningProjetService } from '../../shared/Services/Projets/listening-projet.service';
import { UserServiceService } from '../../shared/Services/User/user-service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DemPayCheque } from '../../shared/Models/Cheques/dem-pay-cheque.model';
import { ArticlePayCheque } from '../../shared/Models/Cheques/article-pay-cheque.model';
import { NotifService } from '../../shared/Services/NotifSystem/notif.service';
import { Notif } from '../../shared/Models/NotifSystem/notif.model';
import { SignalRService, connection, AutomaticNotification } from '../../shared/Services/signalR/signal-r.service';
import { FilesPayChequeService } from '../../shared/Services/Cheques/files-pay-cheque.service';
import { UploadDownloadService } from '../../shared/Services/Taches/upload-download.service';
import { ProgressStatus } from '../../shared/Interfaces/progress-status';
import { HttpEventType } from '@angular/common/http';
import { ProgressStatusEnum } from '../../shared/Enum/progress-status-enum.enum';
import { FilesPayChequesC } from '../../shared/Models/Cheques/files-pay-cheques-c.model';
import { DemPayChequeService } from '../../shared/Services/Cheques/dem-pay-cheque.service';

@Component({
  selector: 'app-new-cheque-menu-etab-fin',
  templateUrl: './new-cheque-menu-etab-fin.component.html',
  styleUrls: ['./new-cheque-menu-etab-fin.component.css']
})
export class NewChequeMenuEtabFinComponent implements OnInit {
  userDetails;
  @Input() public disabled: boolean;
  @Output() public uploadStatuss: EventEmitter<ProgressStatus>;
  @ViewChild('inputFile') inputFile: ElementRef;
  @Output() public downloadStatus: EventEmitter<ProgressStatus>;
  constructor(private demandeService: DemPayChequeService,
    private articleService: ArticlePayChequeService,
    private UserService: UserServiceService,
    private router: Router,
    private toastr: ToastrService,
    private notifService: NotifService,
    private signalService: SignalRService,
    public filesService: FilesPayChequeService,
    public serviceupload: UploadDownloadService, ) { this.downloadStatus = new EventEmitter<ProgressStatus>(); }

  ngOnInit(): void {
    this.getUserConnected();
    this.getDemPayList()
  }
  // Get User Connected
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

  //Get Dem pay ListProject
  dem5: DemPayCheque[] = [];
  dem6: DemPayCheque[] = [];
  arlis: ArticlePayCheque[] = [];
  arlis2: ArticlePayCheque[] = [];
  getDemPayList() {
    this.demandeService.Get().subscribe(res => {
      this.dem5 = res
      this.dem6 = this.dem5.filter(item => item.idUserCreator == this.UserIdConnected && item.etatgeneral == "معتمدة" && (item.demandeur == "شيك" || item.demandeur == "يحسم من الصندوق"))
      this.prix = null;
      this.numDem = null;
    })
  }
  numDem: number = null;
  getnumDem(event) {
    this.numDem = event.target.value;
  }
  prix: string = null;
  getprix(event) {
    this.prix = event.target.value;
  }

  search() {
    if (this.prix != null && this.numDem == null) {
      this.demandeService.SearchByPrix(this.prix).subscribe(res => {
        this.dem6 = res;
      })
    } else if (this.prix == null && this.numDem != null) {
      this.demandeService.SearchByNumDem(this.numDem).subscribe(res => {
        this.dem6 = res;
      })
    } else if (this.prix != null && this.numDem != null) {
      this.demandeService.SearchByPrixNumDem(this.numDem, this.prix).subscribe(res => {
        this.dem6 = res;
      })
    }
  }
  //PopulateForm
  per: DemPayCheque = new DemPayCheque();

  filesListFiltred: FilesPayChequesC[] = [];
  filesList: FilesPayChequesC[] = [];

  populateForm(conge: DemPayCheque) {
    this.per = Object.assign({}, conge)
    this.filesService.Get().subscribe(res => {
      this.filesList = res
      this.filesListFiltred = this.filesList.filter(item => item.idDemCheque == this.per.id);
    })
    this.articleService.Get().subscribe(res => {
      this.arlis2 = res;
      this.arlis = this.arlis2.filter(item => item.idDem == this.per.id)

    })
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
