import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InterviewService } from '../../../../shared/Services/MediaCenter/Interview/interview.service';
import { Interview } from '../../../../shared/Models/MediaCenter/Interview/interview.model';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-print-interview',
  templateUrl: './print-interview.component.html',
  styleUrls: ['./print-interview.component.css']
})
export class PrintInterviewComponent implements OnInit {
  private routeSub: Subscription;
  @ViewChild('htmlData') htmlData: ElementRef;
  constructor(private mediaService: InterviewService,
    private route: ActivatedRoute) {
}

  ngOnInit(): void {
   
    this.route.params.subscribe(p => {
      
      if (p.datedeb != null && p.datefin) {
        this.mediaService.List().subscribe(res => {
          this.AllmediaList = res;

          this.mediaList.forEach(item => {
            if (this.TestBetweenTwoDate(p.datedeb, p.datefin, item.dateenreg)) {
              this.mediaList.push(item);
            }
          })
        });
      } else if (p.id!=null) {
        this.mediaService.SearchByEmployee(p.id).subscribe(res => {
          this.mediaList = res;
        });
      } else {
        this.mediaService.List().subscribe(res => {
          this.mediaList = res;
        });
      }
    });   
  }

  mediaList: Interview[] = [];
  AllmediaList: Interview[] = [];

  TestBetweenTwoDate(DateDeb,DateFin,dateEnreg): boolean {
    if (DateDeb != null && DateFin != null) {
      var from = new Date(DateDeb);
      var to = new Date(DateFin);
      var date = new Date(dateEnreg);
      if (from <= date && to >= date) {
        return true
      } else {
        return false
      }
    } else {
      return false;
    }

  }
  p: Number = 1;
  count: Number = 5;


  path: string;
  public print() {
    var data = document.getElementById('htmlData');
    // data.style.display = "block";
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      // data.style.display = "none"
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      this.path = "InterviewReport" + ".pdf"
      pdf.save(this.path); // Generated PDF
    });
  }
}
