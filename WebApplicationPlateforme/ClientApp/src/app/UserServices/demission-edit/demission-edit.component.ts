import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { DemissionService } from '../../shared/Services/User Services/demission.service';
import { ToastrService } from 'ngx-toastr';
import { UserServiceService } from '../../shared/Services/User/user-service.service';
import { Demissioon } from '../../shared/Models/User Services/demissioon.model';
import { NgForm } from '@angular/forms';
import { ReceptionEquipementService } from '../../shared/Services/ServiceRh/reception-equipement.service';
import { ReceptionEquipement } from '../../shared/Models/ServiceRh/reception-equipement.model';
import { ProgressStatus } from '../../shared/Interfaces/progress-status';
import { FileServiceService } from '../../shared/Services/ServiceRh/file-service.service';
import { UploadDownloadService } from '../../shared/Services/Taches/upload-download.service';
import { HttpEventType } from '@angular/common/http';
import { ProgressStatusEnum } from '../../shared/Enum/progress-status-enum.enum';
import { FileService } from '../../shared/Models/ServiceRh/file-service.model';
@Component({
  selector: 'app-demission-edit',
  templateUrl: './demission-edit.component.html',
  styleUrls: ['./demission-edit.component.css']
})
export class DemissionEditComponent implements OnInit {
  @Output() public downloadStatus: EventEmitter<ProgressStatus>;

  constructor(private demService: DemissionService,
    private toastr: ToastrService,
    private UserService: UserServiceService,
    private trinService: ReceptionEquipementService,
    public filesService: FileServiceService,
    public serviceupload: UploadDownloadService, ) { this.downloadStatus = new EventEmitter<ProgressStatus>(); }



  ngOnInit(): void {
    this.getUserConnected();
    this.CongeList();

    this.getFiles();
  }


  //Get UserConnected

  UserIdConnected: string;
  UserNameConnected: string;

  recList: ReceptionEquipement[] = [];
  rec: ReceptionEquipement[] = [];
  getUserConnected() {

    this.UserService.getUserProfileObservable().subscribe(res => {
      this.UserIdConnected = res.id;
      this.UserNameConnected = res.fullName;

    })

  }
  //Get Conge Demand Lis

  congeList: Demissioon[] = [];
  dem: Demissioon = new Demissioon();
  filtredCongeList: Demissioon[] = [];
  CongeList() {
    this.demService.Get().subscribe(res => {
      this.congeList = res
      this.filtredCongeList = this.congeList.filter(item => item.etatdir == 'موافق' && item.etatrh =="في الانتظار")
    })
  }

  openInNewTab(url) {
    window.open(url, '_blank').focus();
  }

  per: Demissioon = new Demissioon();
  testEqui: boolean = false;
  populateForm(conge: Demissioon) {
    this.demService.formData = Object.assign({}, conge)
    this.per = Object.assign({}, conge)
    this.filesService.GetDemissionFiles(this.per.id).subscribe(res => {
      this.filesList = res
    })
    this.trinService.Get().subscribe(res => {
      this.recList = res
      this.rec = this.recList.filter(item => item.userId == this.per.idUserCreator && item.attribut2 == "1")
      if (this.rec.length == 0) {
        this.testEqui = true;
      } else {
        this.testEqui = false;
      }
    })

  }

  date = new Date().toLocaleDateString();

  etat: string;
  etattest(event) {
    this.etat = event.target.value;
  }
  updateRecord(form: NgForm) {
    this.per.daterh = this.date;
    this.per.etatrh = this.etat;
    this.per.etat = this.etat;
    this.per.idrh = this.UserIdConnected;
    this.per.nomrh = this.UserNameConnected;
    this.demService.PutObservableE(this.per).subscribe(res => {
      this.toastr.success('تم التحديث بنجاح', 'نجاح')
      this.CongeList();
      form.resetForm();
    },
      err => {
        this.toastr.error('لم يتم التحديث  ', ' فشل');
      }


    )

  }

  onSubmit(form: NgForm) {
    if (this.testEqui) {
      this.updateRecord(form)
    } else {
      this.toastr.error('يجب اخلاء العهد  ', ' فشل');
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
  p: Number = 1;
  count: Number = 5;
}
