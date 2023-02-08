import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DemandeVoitureService } from '../../../shared/Services/DemandeVoiture/demande-voiture.service';
import { DemandeVoiture } from '../../../shared/Models/DemandeVoiture/demande-voiture.model';
import { Voiture } from '../../../shared/Models/voiture/voiture.model';
import { ToastrService } from 'ngx-toastr';
import { UserServiceService } from '../../../shared/Services/User/user-service.service';
import { VoitureService } from '../../../shared/Services/voiture/voiture.service';
import { NgForm } from '@angular/forms';
import { ProgressStatus } from '../../../shared/Interfaces/progress-status';
import { FileServiceService } from '../../../shared/Services/ServiceRh/file-service.service';
import { UploadDownloadService } from '../../../shared/Services/Taches/upload-download.service';
import { FileService } from '../../../shared/Models/ServiceRh/file-service.model';
import { ProgressStatusEnum } from '../../../shared/Enum/progress-status-enum.enum';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-histo-voiture',
  templateUrl: './histo-voiture.component.html',
  styleUrls: ['./histo-voiture.component.css']
})
export class HistoVoitureComponent implements OnInit {
  @Output() public downloadStatus: EventEmitter<ProgressStatus>;

  constructor(private demService: DemandeVoitureService,
    private toastr: ToastrService,
    private UserService: UserServiceService,
    private voitureService: VoitureService,
    public filesService: FileServiceService,
    public serviceupload: UploadDownloadService, ) { this.downloadStatus = new EventEmitter<ProgressStatus>(); }


  ngOnInit(): void {
    this.getDemList();
    this.getFiles();
  }

  p: Number = 1;
  count: Number = 5;

  List: DemandeVoiture[] = []


  getDemList() {
    this.demService.Get().subscribe(res => {
      this.List = res
    })
  }
  dem: DemandeVoiture = new DemandeVoiture();
  populateForm(dem: DemandeVoiture) {
    this.demService.formData = Object.assign({}, dem)
    this.dem = Object.assign({}, dem);
    this.filesService.GetVoitureFiles(this.dem.id).subscribe(res => {
      this.filesList = res;
    })
  }
  //GetListVoiture
  carsList: Voiture[] = [];
  getListVoiture() {
    this.voitureService.Get().subscribe(res => {
      this.carsList = res;
    })
  }
  //Add demipement
  isValidFormSubmitted = false;
  date = new Date().toLocaleDateString();
  etat: string;
  etattest(event) {
    this.etat = event.target.value;
  }

  onSubmit(form: NgForm) {

    this.dem.datedot = this.date
    this.demService.PutObservableE(this.dem).subscribe(res => {
      this.getDemList();
      this.toastr.success("تم التحديث  بنجاح", "نجاح");
    },
      err => {
        this.toastr.error("فشل تحديث الطلب ", " تحديث الطلب")
      })
  }


  onDelete(id: number) {


    if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      this.demService.Delete(id)
        .subscribe(res => {
          this.getDemList();
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
