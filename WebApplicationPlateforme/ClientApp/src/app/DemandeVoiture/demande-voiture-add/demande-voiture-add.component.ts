import { Component, OnInit, ElementRef, EventEmitter, Output, ViewChild, Input } from '@angular/core';
import { DemandeVoitureService } from '../../shared/Services/DemandeVoiture/demande-voiture.service';
import { ToastrService } from 'ngx-toastr';
import { UserServiceService } from '../../shared/Services/User/user-service.service';
import { VoitureService } from '../../shared/Services/voiture/voiture.service';
import { Voiture } from '../../shared/Models/voiture/voiture.model';
import { DemandeVoiture } from '../../shared/Models/DemandeVoiture/demande-voiture.model';
import { NgForm } from '@angular/forms';
import { FileService } from '../../shared/Models/ServiceRh/file-service.model';
import { UploadDownloadService } from '../../shared/Services/Taches/upload-download.service';
import { FileServiceService } from '../../shared/Services/ServiceRh/file-service.service';
import { ProgressStatus } from '../../shared/Interfaces/progress-status';
import { ProgressStatusEnum } from '../../shared/Enum/progress-status-enum.enum';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-demande-voiture-add',
  templateUrl: './demande-voiture-add.component.html',
  styleUrls: ['./demande-voiture-add.component.css']
})
export class DemandeVoitureAddComponent implements OnInit {
  @Input() public disabled: boolean;
  @Output() public uploadStatuss: EventEmitter<ProgressStatus>;
  @ViewChild('inputFile') inputFile: ElementRef;
  constructor(private demService: DemandeVoitureService,
    private toastr: ToastrService,
    private UserService: UserServiceService,
    private voitureService: VoitureService,
    private filesService: FileServiceService,
    public serviceupload: UploadDownloadService, ) { this.uploadStatuss = new EventEmitter<ProgressStatus>(); }


  ngOnInit(): void {
    this.getListVoiture();
    this.getUserConnected();
    this.getFiles();
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


  //GetListVoiture
  carsList : Voiture[] = [];
  getListVoiture() {
    this.voitureService.Get().subscribe(res => {
      this.carsList = res; 
    })
  }

  //Add demipement
  isValidFormSubmitted = false;
  date = new Date().toLocaleDateString();
  dem: DemandeVoiture = new DemandeVoiture();
  onSubmit(form: NgForm) {
    this.dem.etat = "في الانتظار";
    this.dem.userNameCreator = this.UserNameConnected;
    this.dem.idUserCreator = this.UserIdConnected;
    this.dem.dateenreg = this.date;
    this.dem.datedot = this.date;
    if (form.invalid) {
      this.isValidFormSubmitted = false;

    }
    else {

      this.isValidFormSubmitted = true

      this.demService.Add(this.dem).subscribe(
        res => {
          this.pj.serviceId = res.id;
          this.pj.serviceName = "Voiture";
          this.fileslist.forEach(item => {
            this.pj.path = item;
            this.filesService.Add(this.pj).subscribe(resfiles => {
              this.files1 = [];
            })
          });
          this.toastr.success("تمت الإضافة بنجاح", "نجاح");
          form.resetForm();
        },
        err => {
          this.toastr.error("لم يتم التسجيل", "فشل في التسجيل")
        })
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
