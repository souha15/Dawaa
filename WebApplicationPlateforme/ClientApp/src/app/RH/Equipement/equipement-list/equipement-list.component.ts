import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { EquipementService } from '../../../shared/Services/Rh/equipement.service';
import { ToastrService } from 'ngx-toastr';
import { UserServiceService } from '../../../shared/Services/User/user-service.service';
import { TbListeningService } from '../../../shared/Services/Evenements/tb-listening.service';
import { TbListening } from '../../../shared/Models/Evenements/tb-listening.model';
import { UserDetail } from '../../../shared/Models/User/user-detail.model';
import { Equipement } from '../../../shared/Models/RH/equipement.model';
import { NgForm } from '@angular/forms';
import { ProgressStatus } from '../../../shared/Interfaces/progress-status';
import { FileServiceService } from '../../../shared/Services/ServiceRh/file-service.service';
import { UploadDownloadService } from '../../../shared/Services/Taches/upload-download.service';
import { ProgressStatusEnum } from '../../../shared/Enum/progress-status-enum.enum';
import { HttpEventType } from '@angular/common/http';
import { FileService } from '../../../shared/Models/ServiceRh/file-service.model';

@Component({
  selector: 'app-equipement-list',
  templateUrl: './equipement-list.component.html',
  styleUrls: ['./equipement-list.component.css']
})
export class EquipementListComponent implements OnInit {
  @Output() public downloadStatus: EventEmitter<ProgressStatus>;

  constructor(private congeService: EquipementService,
    private toastr: ToastrService,
    private UserService: UserServiceService,
    private tblService: TbListeningService,
    public filesService: FileServiceService,
    public serviceupload: UploadDownloadService, ) { this.downloadStatus = new EventEmitter<ProgressStatus>(); }

  ngOnInit(): void {
    this.getNomEquipementList();
    this.getTypeEquipementList();
    this.getUserConnected();
    this.resetForm();
    this.getFiles();
    this.UserList();
  }

  //Type Equipement

  typeEquipement: TbListening[] = [];
  getTypeEquipementList() {
    this.tblService.GetE().subscribe(res => {
      this.typeEquipement = res
    })
  }


  //Type Equipement

  nomEquipement: TbListening[] = [];
  getNomEquipementList() {
    this.tblService.GetN().subscribe(res => {
      this.nomEquipement = res
    })
  }

  //Get Users List
  user: UserDetail[] = [];
  UserList() {
    this.UserService.GetUsersList().subscribe(res => {
      this.user = res;
    })
  }

  //Get UserConnected

  UserIdConnected: string;
  UserNameConnected: string;
  adminisgtrationName: any;
  userc: UserDetail = new UserDetail();

  getUserConnected() {

    this.UserService.getUserProfileObservable().subscribe(res => {
      this.userc = res
      this.UserIdConnected = res.id;
      this.UserNameConnected = res.fullName;
      console.log()
      this.congeService.GetByUser(this.UserIdConnected).subscribe(res => {
        this.filtredCongeList = res
      })
    })

  }


  //Get Conge Demand Lis

  congeList: Equipement[] = [];
  filtredCongeList: Equipement[] = [];
  CongeList(id) {
    this.congeService.GetByUser(id).subscribe(res => {
      this.filtredCongeList =res
    })
  }


  delete(id: number) {


    if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      this.congeService.Delete(id)
        .subscribe(res => {
          this.CongeList(this.UserIdConnected);
          this.toastr.success("تم الحذف  بنجاح", "نجاح");
        },

          err => {
            console.log(err);
            this.toastr.warning('لم يتم الحذف  ', ' فشل');
          }
        )

    }

  }

  //Edit Administration
  congeId: number;
  onSubmit(form: NgForm) {
    this.updateRecord(form)
  }

  conge: Equipement = new Equipement();
  updateRecord(form: NgForm) {
    this.conge = Object.assign(this.conge, form.value);
    this.congeId = this.conge.id;
 
    if (this.conge.etatdir == "في الانتظار") {
      this.congeService.Edit().subscribe(res => {
        this.toastr.success('تم التحديث بنجاح', 'نجاح')
        this.resetForm();
        this.CongeList(this.UserIdConnected);
      },
        err => {
          this.toastr.error('لم يتم التحديث  ', ' فشل');
        }


      )
    } if (this.conge.etatdir == 'موافق') {
      this.toastr.error('لقد تمت الموافقة على طلب العهد', ' لم يتم التحديث');
    } if (this.conge.etatdir == 'رفض') {
      this.toastr.error('لقد تم رفض طلب العهد', ' لم يتم التحديث');
    }
  }


  populateForm(conge: Equipement) {
    this.congeService.formData = Object.assign({}, conge)
    this.congeId = conge.id
    this.filesService.GetEquipementFiles(this.congeId).subscribe(res => {
      this.filesList = res;
    })

  }

  resetForm(form?: NgForm) {

    if (form != null)
      form.resetForm();
    this.congeService.formData = {
      id: null,
      type: '',
      nom: '',
      email: '',
      tel: '',     
      transfert: '',      
      remarque: '',
      etatdir: '',      
      date: '',
      datedir: '',
      iddir: '',
      nomdir:'',
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
