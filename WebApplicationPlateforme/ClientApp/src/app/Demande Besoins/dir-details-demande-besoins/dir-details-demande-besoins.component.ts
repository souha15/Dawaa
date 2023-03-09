import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { ProgressStatus } from '../../shared/Interfaces/progress-status';
import { BesoinService } from '../../shared/Services/Demande Besoins/besoin.service';
import { ToastrService } from 'ngx-toastr';
import { UserServiceService } from '../../shared/Services/User/user-service.service';
import { DemandeBesoinService } from '../../shared/Services/Demande Besoins/demande-besoin.service';
import { FileServiceService } from '../../shared/Services/ServiceRh/file-service.service';
import { UploadDownloadService } from '../../shared/Services/Taches/upload-download.service';
import { FileService } from '../../shared/Models/ServiceRh/file-service.model';
import { ProgressStatusEnum } from '../../shared/Enum/progress-status-enum.enum';
import { HttpEventType } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DemandeBesoin } from '../../shared/Models/Demande Besoins/demande-besoin.model';

@Component({
  selector: 'app-dir-details-demande-besoins',
  templateUrl: './dir-details-demande-besoins.component.html',
  styleUrls: ['./dir-details-demande-besoins.component.css']
})
export class DirDetailsDemandeBesoinsComponent implements OnInit {


  @Input() public disabled: boolean;
  @Output() public uploadStatuss: EventEmitter<ProgressStatus>;
  @ViewChild('inputFile') inputFile: ElementRef;
  @Output() public downloadStatus: EventEmitter<ProgressStatus>;
  private routeSub: Subscription;
  constructor(private besoinsService: BesoinService,
    private toastr: ToastrService,
    private UserService: UserServiceService,
    private demandeBesoinsService: DemandeBesoinService,
    private filesService: FileServiceService,
    private route: ActivatedRoute,
    public serviceupload: UploadDownloadService,) { this.downloadStatus = new EventEmitter<ProgressStatus>(); }

  ngOnInit(): void {
    this.getUserConnected();
    this.getIdUrl();
    this.updateEtat = true;
  }

  UserIdConnected: string;
  UserNameConnected: string;
  getUserConnected() {

    this.UserService.getUserProfileObservable().subscribe(res => {
      this.UserIdConnected = res.id;
      this.UserNameConnected = res.fullName;
    
    })

  }
  besoin: DemandeBesoin = new DemandeBesoin();
  Id: number;
  filesList: FileService[] = [];
  etat: string;
  redorgreen: boolean = false;
  getIdUrl() {
    this.routeSub = this.route.params.subscribe(params => {
      this.Id = params['id'];

      //Get Deamnd Besoins Data

      this.demandeBesoinsService.GetById(this.Id).subscribe(res => {
        this.besoin = res;
        if (this.besoin.etatFin == "في الإنتظار") {
          this.redorgreen = true;
          this.etat = this.besoin.etatFin;
        }
        else if (this.besoin.etatFin == "موافقة" && this.besoin.etatRh == "في الإنتظار") {
          this.redorgreen = true;
          this.etat = this.besoin.etatRh 
        }

        else if (this.besoin.etat == "موافقة") {
          this.redorgreen = false;
          this.etat = this.besoin.etat;
          
        } else {
          this.redorgreen = true;
          this.etat = this.etat;
        }
      })

      // Get Files List

      this.filesService.GetBesoinsFiles(this.Id).subscribe(res => {
        this.filesList = res;
      });

    })
  }

  UpdateDataEtat() {
    if (this.besoin.etatFin == "موافقة") {
      this.redorgreen = false;
      this.etat = this.etatdata;
    } else if (this.besoin.etatFin == "رفض") {
      this.redorgreen = true;
      this.etat = this.etatdata;
    }
    else if (this.besoin.etatRh == "موافقة") {
      this.redorgreen = false;
      this.etat = this.besoin.etatRh
    } else if (this.besoin.etatRh == "رفض") {
      this.redorgreen = true;
      this.etat = this.etatdata;
    }    
  }
  // Get Data
  etatdata: string;
  dec: boolean = false;

  getetatdata(event) {
    this.etatdata = event.target.value;
    if (this.etatdata == "رفض") {
      this.dec = true;
    } else {
      this.dec = false;
    }
  }
  rasionRefus: string;
  getnotfinished(event) {
    this.rasionRefus = event.target.value;
  }
  updateEtat: boolean = true;
  acceptorrefuse() {
    if (this.besoin.etatFin == "في الإنتظار") {
      this.besoin.etatFin = this.etatdata;
      this.besoin.raisonRefus = this.rasionRefus;

    } else if (this.besoin.etatFin == "موافقة" && this.besoin.etatRh == "في الإنتظار") {
      this.besoin.etatRh = this.etatdata;
      this.besoin.etat = this.etatdata;
      this.besoin.raisonRefus = this.rasionRefus;

    }
    this.demandeBesoinsService.PutObservableE(this.besoin).subscribe(res => {
      this.toastr.success("تم تعديل حالة الطلب بنجاح", "نجاح");
      this.UpdateDataEtat();
      this.updateEtat = false;
    }, err => {
        this.toastr.error("لم يتم  تعديل حالة الطلب", "فشل ");
        this.updateEtat = true;
    })
  }
  //Files
  files1: File[] = [];
  onSelect(event) {
    //console.log(event);
    this.files1.push(...event.addedFiles);
  }

  onRemove(event) {
    this.files1.splice(this.files1.indexOf(event), 1);
  }


  public response: { 'dbpathsasstring': '' };
  public isCreate: boolean;
  public pj: FileService = new FileService();
  public files: string[];

  //get List of Files

  private getFiles() {
    this.serviceupload.getFiles().subscribe(
      data => {
        this.files = data

      }
    );

  }

  //Get file name for Database

  GetFileName() {
    let sa: string;
    let s: any;
    let finalres: any;
    let i: number = 0;
    let tlistnew: any[] = [];
    for (var k = 0; k < this.files.length; k++) {
      sa = <string>this.files[k]
      s = sa.toString().split('uploads\\,', sa.length - 1);
      finalres = s.toString().split('uploads\\', sa.length - 1);

      tlistnew[i] = finalres[1]
      i++;

    }


  }

  //Upload

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
