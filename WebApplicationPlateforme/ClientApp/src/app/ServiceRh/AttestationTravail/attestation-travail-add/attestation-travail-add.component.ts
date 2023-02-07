import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { UserServiceService } from '../../../shared/Services/User/user-service.service';
import { DemandeAttestationTravailService } from '../../../shared/Services/ServiceRh/demande-attestation-travail.service';
import { ToastrService } from 'ngx-toastr';
import { DemandeAttestationTravail } from '../../../shared/Models/ServiceRh/demande-attestation-travail.model';
import { NgForm } from '@angular/forms';
import { ProgressStatus } from '../../../shared/Interfaces/progress-status';
import { UploadDownloadService } from '../../../shared/Services/Taches/upload-download.service';
import { FileServiceService } from '../../../shared/Services/ServiceRh/file-service.service';
import { HttpEventType } from '@angular/common/http';
import { ProgressStatusEnum } from '../../../shared/Enum/progress-status-enum.enum';
import { FileService } from '../../../shared/Models/ServiceRh/file-service.model';

@Component({
  selector: 'app-attestation-travail-add',
  templateUrl: './attestation-travail-add.component.html',
  styleUrls: ['./attestation-travail-add.component.css']
})
export class AttestationTravailAddComponent implements OnInit {
  @Input() public disabled: boolean;
  @Output() public uploadStatuss: EventEmitter<ProgressStatus>;
  @ViewChild('inputFile') inputFile: ElementRef;
  constructor(private UserService: UserServiceService,
    private toastr: ToastrService,
    private atService: DemandeAttestationTravailService,
    private filesService: FileServiceService,
    public serviceupload: UploadDownloadService, ) { this.uploadStatuss = new EventEmitter<ProgressStatus>(); }


  ngOnInit(): void {
    this.getUserConnected();
    this.getFiles();
  }


  UserIdConnected: string;
  UserNameConnected: string;

  getUserConnected() {

    this.UserService.getUserProfileObservable().subscribe(res => {
      this.UserIdConnected = res.id;
      this.UserNameConnected = res.fullName;
      this.at.idUserCreator = res.id;
      this.at.userNameCreator = res.fullName;

    })

  }


  at: DemandeAttestationTravail = new DemandeAttestationTravail();
  isValidFormSubmitted = false;
  date = new Date().toLocaleDateString();
  onSubmit(form: NgForm) {
    if (form.invalid) {

      this.isValidFormSubmitted = false;
    }

    else {
      this.isValidFormSubmitted = true;
      this.at.dateenreg = this.date;
      this.at.etat = "في الإنتظار"
      this.atService.Add(this.at).subscribe(res => {
        this.pj.serviceId = res.id;
        this.pj.serviceName = "AttestationTravail";
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
