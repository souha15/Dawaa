import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AllMaintenanceService } from '../../../shared/Services/AllMaintenance/all-maintenance.service';
import { AllMaintenance } from '../../../shared/Models/AllMaintenance/all-maintenance.model';
import { ToastrService } from 'ngx-toastr';

import { ProgressStatus } from '../../../shared/Interfaces/progress-status';
import { FileServiceService } from '../../../shared/Services/ServiceRh/file-service.service';
import { UploadDownloadService } from '../../../shared/Services/Taches/upload-download.service';
import { FileService } from '../../../shared/Models/ServiceRh/file-service.model';
import { ProgressStatusEnum } from '../../../shared/Enum/progress-status-enum.enum';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-histo-all-maintenance',
  templateUrl: './histo-all-maintenance.component.html',
  styleUrls: ['./histo-all-maintenance.component.css']
})
export class HistoAllMaintenanceComponent implements OnInit {
  @Output() public downloadStatus: EventEmitter<ProgressStatus>;

  constructor(private demService: AllMaintenanceService,
    private toastr: ToastrService,
    public filesService: FileServiceService,
    public serviceupload: UploadDownloadService, ) { this.downloadStatus = new EventEmitter<ProgressStatus>(); }



  ngOnInit(): void {
    this.GetList();
    this.getFiles();
  }

  p: Number = 1;
  count: Number = 5;
  //Get Dem List
  demList2: AllMaintenance[] = [];
  demList: AllMaintenance[] = [];
  GetList() {
    this.demService.Get().subscribe(res => {
      this.demList = res;
    })
  }
  dem: AllMaintenance = new AllMaintenance();
  populateForm(dem: AllMaintenance) {
    this.demService.formData = Object.assign({}, dem)
    this.dem = Object.assign({}, dem);

    this.filesService.GetMaintenanceFiles(this.dem.id).subscribe(res => {
      this.filesList = res;
    })

  }

  onDelete(id: number) {


    if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      this.demService.Delete(id)
        .subscribe(res => {
          this.GetList();
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
