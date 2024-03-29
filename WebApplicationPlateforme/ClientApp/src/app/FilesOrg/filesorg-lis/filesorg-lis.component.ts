import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { FilesOrgService } from '../../shared/Services/ServiceRh/files-org.service';
import { ProgressStatus } from '../../shared/Interfaces/progress-status';
import { ToastrService } from 'ngx-toastr';
import { TbListeningService } from '../../shared/Services/Evenements/tb-listening.service';
import { UserServiceService } from '../../shared/Services/User/user-service.service';
import { UploadDownloadService } from '../../shared/Services/Taches/upload-download.service';
import { PrivilegesService } from '../../shared/Services/User/privileges.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { PathSharedService } from '../../shared/path-shared.service';
import { TbListening } from '../../shared/Models/Evenements/tb-listening.model';
import { FilesOrg } from '../../shared/Models/ServiceRh/files-org.model';
import { NgForm } from '@angular/forms';
import { ProgressStatusEnum } from '../../shared/Enum/progress-status-enum.enum';

@Component({
  selector: 'app-filesorg-lis',
  templateUrl: './filesorg-lis.component.html',
  styleUrls: ['./filesorg-lis.component.css']
})
export class FilesorgLisComponent implements OnInit {


  @Input() public disabled: boolean;
  @Output() public uploadStatuss: EventEmitter<ProgressStatus>;
  @ViewChild('inputFile') inputFile: ElementRef;
  @Input() public fileName: string;
  @Output() public downloadStatus: EventEmitter<ProgressStatus>;
  filter;
  constructor(private orgService: FilesOrgService,
    private toastr: ToastrService,
    private tblService: TbListeningService,
    private UserService: UserServiceService,
    public serviceupload: UploadDownloadService,
    private privilegesService: PrivilegesService,
    private http: HttpClient,
    private rootUrl: PathSharedService) {
    this.uploadStatuss = new EventEmitter<ProgressStatus>();
    this.downloadStatus = new EventEmitter<ProgressStatus>();
  }

  ngOnInit(): void {
    this.getUserConnected();
    this.getpannelist();
    this.getFiles();
    this.resetForm();
    this.getCreance();
  }


  // Get User Connected


  UserIdConnected: string;
  UserNameConnected: string;

  getUserConnected() {

    this.UserService.getUserProfileObservable().subscribe(res => {
      this.UserIdConnected = res.id;
      this.UserNameConnected = res.fullName;
    })

  }

  //Get Panne Lists

  panneList: TbListening[] = [];
  getpannelist() {
    this.tblService.GetNomFiles().subscribe(res => {
      this.panneList = res
    }
    )
  }

  //editing Facture
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
  //Populate Form 
  factId: number
  fact: FilesOrg = new FilesOrg();
  populateForm(facture: FilesOrg) {
    this.orgService.formData = Object.assign({}, facture)
    this.factId = facture.id;
    this.fact = Object.assign({}, facture);
  }

  factList: FilesOrg[] = [];
  GfactList: FilesOrg[] = [];
  getCreance() {
    this.orgService.Get().subscribe(res => {
      this.factList = res;

    })

  }

  updateRecord(form: NgForm) {


    this.fileslist.forEach(item => {
      this.orgService.formData.path = item;
    })
    this.orgService.formData.idUserCreator = this.UserIdConnected;
    this.orgService.formData.userNameCreator = this.UserNameConnected;
    this.orgService.formData.dateenreg = this.date;

    this.orgService.Edit().subscribe(res => {


      this.toastr.success('تم التحديث بنجاح', 'نجاح')
      this.serviceupload.refreshListf();
      this.files1 = [];
      this.resetForm();
      this.getCreance();
    },
      err => {
        this.toastr.error(' لم يتم التحديث  ', ' فشل');
      }


    )

  }

  resetForm(form?: NgForm) {

    if (form != null)
      form.resetForm();
    this.orgService.formData = {
      id: null,
      path: '',
      nomfile: '',
      dateExpiration: '',
      dateenreg: '',
      userNameCreator: '',
      idUserCreator: '',
    }
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

  //Save it ToDatabase
  Idtransaction: number;
  url: any;
  file: any;
  fileslist: string[] = [];
  public upload(event) {
    if (event.addedFiles && event.addedFiles.length > 0) {
      this.file = event.addedFiles[0];
      this.uploadStatuss.emit({ status: ProgressStatusEnum.START });
      this.serviceupload.uploadFile(this.file).subscribe(
        data => {
          if (data) {
            switch (data.type) {
              case HttpEventType.UploadProgress:
                this.uploadStatuss.emit({ status: ProgressStatusEnum.IN_PROGRESS, percentage: Math.round((data.loaded / data.total) * 100) });
                break;
              case HttpEventType.Response:
                // this.inputFile.nativeElement.value = '';
                this.uploadStatuss.emit({ status: ProgressStatusEnum.COMPLETE });
                break;
            }
            this.getFiles();
            this.GetFileName();



          }

        },

        error => {
          /// this.inputFile.nativeElement.value = '';
          this.uploadStatuss.emit({ status: ProgressStatusEnum.ERROR });
        }
      );
      this.fileslist.push(this.file.name);
      console.log(this.fileslist)
    }
  }

  //Download

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

  //Delete Dotation
  onDelete(Id) {
    if (confirm('Are you sure to delete this record ?')) {
      this.orgService.Delete(Id)
        .subscribe(res => {
          this.getCreance();
          this.toastr.success("تم الحذف  بنجاح", "نجاح");
        },

          err => {
            console.log(err);
            this.toastr.warning('لم يتم الحذف  ', ' فشل');

          }
        )

    }
  }
}

