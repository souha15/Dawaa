import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { OrdrePayStockageService } from '../../shared/Services/Gsetion Stock/ordre-pay-stockage.service';
import { ToastrService } from 'ngx-toastr';
import { OrdrePayStockage } from '../../shared/Models/Gestion Stock/ordre-pay-stockage.model';
import { UserServiceService } from '../../shared/Services/User/user-service.service';
import { NgForm } from '@angular/forms';
import { StockService } from '../../shared/Services/Gsetion Stock/stock.service';
import { Stock } from '../../shared/Models/Gestion Stock/stock.model';
import { TypeStockage } from '../../shared/Models/Gestion Stock/type-stockage.model';
import { TypeStockageService } from '../../shared/Services/Gsetion Stock/type-stockage.service';
import { GestBenService } from '../../shared/Services/GestBen/gest-ben.service';
import { GestBen } from '../../shared/Models/GestBen/gest-ben.model';
import { BenPayStockOrdreService } from '../../shared/Services/Gsetion Stock/ben-pay-stock-ordre.service';
import { BenPayStockOrdre } from '../../shared/Models/Gestion Stock/ben-pay-stock-ordre.model';
import { SettingsBenService } from '../../shared/Services/GestBen/settings-ben.service';
import { TbListening } from '../../shared/Models/Evenements/tb-listening.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProgressStatus } from '../../shared/Interfaces/progress-status';
import { FileServiceService } from '../../shared/Services/ServiceRh/file-service.service';
import { UploadDownloadService } from '../../shared/Services/Taches/upload-download.service';
import { HttpEventType } from '@angular/common/http';
import { ProgressStatusEnum } from '../../shared/Enum/progress-status-enum.enum';
import { FileService } from '../../shared/Models/ServiceRh/file-service.model';

@Component({
  selector: 'app-details-ordre-pay',
  templateUrl: './details-ordre-pay.component.html',
  styleUrls: ['./details-ordre-pay.component.css']
})
export class DetailsOrdrePayComponent implements OnInit {


  private routeSub: Subscription;

  @Output() public downloadStatus: EventEmitter<ProgressStatus>;

  constructor(private OrdrePayService: OrdrePayStockageService,
    private UserService: UserServiceService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private stockService: StockService,
    private benService: GestBenService,
    private TypeStockageService: TypeStockageService,
    private settingsService: SettingsBenService,
    private BenOrdreService: BenPayStockOrdreService,
    public filesService: FileServiceService,
    public serviceupload: UploadDownloadService, ) { this.downloadStatus = new EventEmitter<ProgressStatus>(); }


  ngOnInit(): void {
    this.getIdUrl();
    this.getFiles();

  }

  //get the id in Url

  Id: number;
  st: OrdrePayStockage = new OrdrePayStockage();
  odreListBen: BenPayStockOrdre[] = [];
  odreListBenF: BenPayStockOrdre[] = [];
  getIdUrl() {
    this.routeSub = this.route.params.subscribe(params => {
      this.Id = params['id']

      this.filesService.GetOrdrePayFiles(this.Id).subscribe(res => {
        this.filesList = res;
      })
      this.OrdrePayService.GetById(this.Id).subscribe(res => {
        this.st = res
        this.BenOrdreService.ListBenPayStockOrdre().subscribe(res => {
          this.odreListBenF = res
          this.odreListBen = this.odreListBenF.filter(item => item.idOrdrePayStockage == this.Id)
        })
      })
    })


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
