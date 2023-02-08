import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TechDemService } from '../../../shared/Services/TechnicalDemands/tech-dem.service';
import { TechDem } from '../../../shared/Models/TechnicalDemands/tech-dem.model';
import { ToastrService } from 'ngx-toastr';
import { ProgressStatus } from '../../../shared/Interfaces/progress-status';
import { FileServiceService } from '../../../shared/Services/ServiceRh/file-service.service';
import { UploadDownloadService } from '../../../shared/Services/Taches/upload-download.service';
import { FileService } from '../../../shared/Models/ServiceRh/file-service.model';
import { ProgressStatusEnum } from '../../../shared/Enum/progress-status-enum.enum';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-histo-tech',
  templateUrl: './histo-tech.component.html',
  styleUrls: ['./histo-tech.component.css']
})
export class HistoTechComponent implements OnInit {
  @Output() public downloadStatus: EventEmitter<ProgressStatus>;

  constructor(private demTechService: TechDemService,
    private toastr: ToastrService,
    public filesService: FileServiceService,
    public serviceupload: UploadDownloadService, ) { this.downloadStatus = new EventEmitter<ProgressStatus>(); }


  ngOnInit(): void {
    this.getDemList();
    this.getFiles();
  }

  p: Number = 1;
  count: Number = 5;

  List2: TechDem[] = []
  List: TechDem[] = []


  getDemList() {
    this.demTechService.List().subscribe(res => {
      this.List = res
    })
  }
  dem: TechDem = new TechDem();
  autre: boolean = false;
  video: boolean = false;
  prog: boolean = false;
  imprimante: boolean = false;

  populateForm(dem: TechDem) {
    this.demTechService.formData = Object.assign({}, dem)
    this.dem = Object.assign({}, dem);
    this.filesService.GetDemTechFiles(this.dem.id).subscribe(res => {
      this.filesList = res;
    })
    if (this.dem.typedem == "أخرى") {
      this.autre = true;
      this.video = false;
      this.prog = false;
      this.imprimante = false
    } else {
      this.autre = false;
    }
    if (this.dem.typedem == "تشغيل جهاز الفيديو كونفرنس") {
      this.video = true;
      this.autre = false;
      this.prog = false;
      this.imprimante = false
    } else {
      this.video = false;
    }
    if (this.dem.typedem == "تنصيب برنامج") {
      this.prog = true;
      this.autre = false;
      this.video = false;

      this.imprimante = false
    } else {
      this.prog = false;
    }
    if (this.dem.typedem == "تعريف طابعة" || this.dem.typedem == "تعريف آلة تصوير" || this.dem.typedem == "تعريف ماسح ضوئي"
      || this.dem.typedem == 'صيانة جهاز طابعة' || this.dem.typedem == 'صيانة آلة تصوير') {
      this.imprimante = true;
      this.prog = false;
      this.autre = false;
      this.video = false;
    } else {

      this.imprimante = false
    }

  }


  onDelete(id: number) {


    if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      this.demTechService.Delete(id)
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
