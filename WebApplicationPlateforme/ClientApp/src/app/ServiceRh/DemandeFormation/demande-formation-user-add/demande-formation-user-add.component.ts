import { Component, OnInit, EventEmitter, ElementRef, ViewChild, Output, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormationService } from '../../../shared/Services/ServiceRh/formation.service';
import { UserServiceService } from '../../../shared/Services/User/user-service.service';
import { ToastrService } from 'ngx-toastr';
import { DemandeFormation } from '../../../shared/Models/ServiceRh/demande-formation.model';
import { Formation } from '../../../shared/Models/ServiceRh/formation.model';
import { DemandeFormationService } from '../../../shared/Services/ServiceRh/demande-formation.service';
import { NgForm } from '@angular/forms';
import { NewFormationService } from '../../../shared/Services/ServiceRh/new-formation.service';
import { TbListeningService } from '../../../shared/Services/Evenements/tb-listening.service';
import { TbListening } from '../../../shared/Models/Evenements/tb-listening.model';
import { FileServiceService } from '../../../shared/Services/ServiceRh/file-service.service';
import { UploadDownloadService } from '../../../shared/Services/Taches/upload-download.service';
import { ProgressStatus } from '../../../shared/Interfaces/progress-status';
import { FileService } from '../../../shared/Models/ServiceRh/file-service.model';
import { ProgressStatusEnum } from '../../../shared/Enum/progress-status-enum.enum';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-demande-formation-user-add',
  templateUrl: './demande-formation-user-add.component.html',
  styleUrls: ['./demande-formation-user-add.component.css']
})
export class DemandeFormationUserAddComponent implements OnInit {
  @Input() public disabled: boolean;
  @Output() public uploadStatuss: EventEmitter<ProgressStatus>;
  @ViewChild('inputFile') inputFile: ElementRef;
  constructor(private formationService: NewFormationService,
    private UserService: UserServiceService,
    private toastr: ToastrService,
    private specialiteService: TbListeningService,
    private filesService: FileServiceService,
    public serviceupload: UploadDownloadService, ) { this.uploadStatuss = new EventEmitter<ProgressStatus>(); }


  ngOnInit(): void {
    this.getUserConnected();
    this.GetSpecList();
    this.getFiles();
  }


  // Get Specilite List

  SpecList: TbListening[] = [];

  GetSpecList() {
    this.specialiteService.Get().subscribe(res => {
      this.SpecList = res
    })
  }


  UserIdConnected: string;
  UserNameConnected: string;
  dir: string;
  dirid: string;
  getUserConnected() {

    this.UserService.getUserProfileObservable().subscribe(res => {
      this.UserIdConnected = res.id;
      this.UserNameConnected = res.fullName;
      this.dir = res.directeur;
      this.dirid = res.attribut1
    })
  }


  fm: DemandeFormation = new DemandeFormation();
  isValidFormSubmitted = false;
  date = new Date().toLocaleDateString();
  onSubmit(form: NgForm) {
    if (form.invalid) {

      this.isValidFormSubmitted = false;
    }

    else {
      this.isValidFormSubmitted = true;
      this.fm.dateenreg = this.date;
      this.fm.etat = 'في الإنتظار';
      this.fm.etatc = "في الإنتظار";
      this.fm.etatdir = "في الإنتظار";
      this.fm.etatrh = "في الإنتظار";
      this.fm.attribut2 = "غير منجزة"
      this.fm.iddir = this.dirid;
      this.fm.nomdir = this.dir;
      this.fm.idUserCreator = this.UserIdConnected;
      this.fm.userNameCreator = this.UserNameConnected;
      this.formationService.Add(this.fm).subscribe(res => {

        this.pj.serviceId = res.id;
        this.pj.serviceName = "Formation";
        this.fileslist.forEach(item => {
          this.pj.path = item;
          this.filesService.Add(this.pj).subscribe(resfiles => {
            this.files1 = [];
          })
        });
        form.resetForm();
        this.toastr.success("تم التسجيل  بنجاح", " تسجيل ");
      },
        err => {
          this.toastr.error("فشل التسجيل  الطلب", " تسجيل ")
        }
      )
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
    this.fileslist.splice(this.fileslist.indexOf(event), 1);
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

    }
  }
}
