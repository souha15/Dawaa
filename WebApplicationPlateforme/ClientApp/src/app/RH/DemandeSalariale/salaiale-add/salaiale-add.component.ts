import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { DemandeTicket } from '../../../shared/Models/RH/demande-ticket.model';
import { UserServiceService } from '../../../shared/Services/User/user-service.service';
import { ToastrService } from 'ngx-toastr';
import { DemandeSalariale } from '../../../shared/Models/RH/demande-salariale.model';
import { NgForm } from '@angular/forms';
import { DemandeSalarialeService } from '../../../shared/Services/Rh/demande-salariale.service';
import { DatePipe } from '@angular/common';
import { ProgressStatus } from '../../../shared/Interfaces/progress-status';
import { FileServiceService } from '../../../shared/Services/ServiceRh/file-service.service';
import { UploadDownloadService } from '../../../shared/Services/Taches/upload-download.service';
import { FileService } from '../../../shared/Models/ServiceRh/file-service.model';
import { ProgressStatusEnum } from '../../../shared/Enum/progress-status-enum.enum';
import { HttpEventType } from '@angular/common/http';
@Component({
  selector: 'app-salaiale-add',
  templateUrl: './salaiale-add.component.html',
  styleUrls: ['./salaiale-add.component.css']
})
export class SalaialeAddComponent implements OnInit {
  @Input() public disabled: boolean;
  @Output() public uploadStatuss: EventEmitter<ProgressStatus>;
  @ViewChild('inputFile') inputFile: ElementRef;
  constructor(private congeService: DemandeSalarialeService,
    private UserService: UserServiceService,
    private toastr: ToastrService, private filesService: FileServiceService,
    public serviceupload: UploadDownloadService, ) { this.uploadStatuss = new EventEmitter<ProgressStatus>(); }


  ngOnInit(): void {
    this.getUserConnected();
    const datePipe = new DatePipe('en-Us');
    this.today = datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.getFiles();
  }
  today;

  // Get User Connected

  UserIdConnected: string;
  UserNameConnected: string;
  adminisgtrationName: any;
  soldeconge: string;

  getUserConnected() {

    this.UserService.getUserProfileObservable().subscribe(res => {
      
      this.UserIdConnected = res.id;
      this.UserNameConnected = res.fullName;
      this.conge.dirnom = res.directeur;
      this.conge.dirid = res.attribut1;
      this.conge.userNameCreator = res.fullName;
      this.conge.idUserCreator = res.id;
      this.conge.dateenreg ='شهر واحد من تاريخة'

    })

  }






  //Conge Submit
  conge: DemandeSalariale = new DemandeSalariale();
  isValidFormSubmitted = false;
  date = new Date().toLocaleDateString();
  onSubmit(form: NgForm) {
    this.conge.dateenreg = this.date;
    this.conge.etat ="في الانتظار"
    if (form.invalid) {
      this.isValidFormSubmitted = false;

    }
    else {

      this.isValidFormSubmitted = true

  

      this.congeService.Add(this.conge).subscribe(
        res => {

          this.pj.serviceId = res.id;
          this.pj.serviceName = "Salariale";
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
            this.toastr.error("  يجب أن يبدأ التاريخ من هذا اليوم", "لم يتم تقديم الطلب ")
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

