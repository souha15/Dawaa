import { Component, OnInit, Output, Input, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { TicketService } from '../../shared/Services/Maintenance/ticket.service';
import { ToastrService } from 'ngx-toastr';
import { FilesFilesTicketService } from '../../shared/Services/Maintenance/files-ticket.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { PathSharedService } from '../../shared/path-shared.service';
import { UploadDownloadService } from '../../shared/Services/Taches/upload-download.service';
import { ProgressStatus } from '../../shared/Interfaces/progress-status';
import { Ticket } from '../../shared/Models/Maintenance/ticket.model';
import { NgForm } from '@angular/forms';
import { FilesTicket } from '../../shared/Models/Maintenance/files-ticket.model';
import { ProgressStatusEnum } from '../../shared/Enum/progress-status-enum.enum';

@Component({
  selector: 'app-ticket-list-agent',
  templateUrl: './ticket-list-agent.component.html',
  styleUrls: ['./ticket-list-agent.component.css']
})
export class TicketListAgentComponent implements OnInit {
  filter;
  @Input() public disabled: boolean;
  @Input() public fileName: string;
  @Output() public downloadStatus: EventEmitter<ProgressStatus>;
  constructor(private ticketService: TicketService,
    private toastr: ToastrService,
    private filesTicketService: FilesFilesTicketService,
    private http: HttpClient,
    private rootUrl: PathSharedService,
    public serviceupload: UploadDownloadService,) { }

  ngOnInit(): void {
    this.getTicketsList();
    this.withoutClosed = true;
    this.withClosed = false;


  }

  // This Get Tickets List
  p: Number = 1;
  count: Number = 6;
  ticketList: Ticket[] = [];
  ticketList2: Ticket[] = [];
  ticketListWithClosed: Ticket[] = [];
  enattente: number = 0;
  done: number = 0;
  encours: number = 0;
  closed: number = 0;
  suspendu: number = 0;
  enattenterep: number = 0;
  withoutClosed: boolean;
  getTicketsList() {
    this.ticketService.List().subscribe(res => {
      this.ticketList2 = res;
      this.ticketList = this.ticketList2.filter(item => item.etat != "مغلقة");
      this.done = this.ticketList2.filter(item => item.etat == "منجزة").length;
      this.encours = this.ticketList2.filter(item => item.etat == "تحت الإجراء").length;
      this.closed = this.ticketList2.filter(item => item.etat == "مغلقة").length;
      this.suspendu = this.ticketList2.filter(item => item.etat == "مؤجلة").length;
      this.enattente = this.ticketList2.filter(item => item.etat == "في الإنتظار").length;
      this.enattenterep = this.ticketList2.filter(item => item.etat == "بانتظار رد صاحب التذكرة").length;
    
    })
  }
  withClosed: boolean = false; 
  getWiThClosed() {
    if (!this.withClosed) {
      this.withClosed = true;
      this.withoutClosed = false;

      this.ticketListWithClosed = this.ticketList2.filter(item => item.etat == "مغلقة")
      
    }
    else {
        this.withClosed = false;
        this.withoutClosed = true;
        this.getTicketsList();
      }

  }
  //sorting
  key: string = 'name'; //set default
  reverse: boolean = false;
  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }

  ticket: Ticket = new Ticket();
  ticketfilesG: FilesTicket[] = []
  ticketfiles: FilesTicket[] = []
  id: number;
  populateForm(facture: Ticket) {
    this.ticketService.formData = Object.assign({}, facture)
    this.id = facture.id;
    this.ticket = Object.assign({}, facture);
    this.filesTicketService.List().subscribe(res => {
      this.ticketfilesG = res
      this.ticketfiles = this.ticketfilesG.filter(item => item.id == this.id)

    })
  }

  etat: string;
  getetatdata(event) {
    this.etat = event.target.value;
  }

  remarque: string;
  getremarquedata(event) {
    this.remarque = event.target.value;
  }
  date = new Date().toLocaleDateString();
  isValidFormSubmitted = false;
  onSubmit() {
    console.log(this.ticket);
    this.ticket.dateAgent = this.date;
    this.ticket.remarque = this.remarque;
    this.ticket.etat = this.etat;
    this.ticketService.PutObservable(this.ticket).subscribe(
        res => {
          this.getTicketsList();
          this.toastr.success("تم تحديث التذكرة  بنجاح", " تحديث التذكرة ");
         
      },
        err => {
          this.toastr.error("فشل تحديث التذكرة", " تحديث التذكرة")
        })

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
}
