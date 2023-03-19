import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Subscription } from 'rxjs';
import { SoireeOccasionService } from '../../../../shared/Services/MediaCenter/OccaSoiree/soiree-occasion.service';
import { ActivatedRoute } from '@angular/router';
import { OccasionSoiree } from '../../../../shared/Models/MediaCenter/OccaSoiree/occasion-soiree.model';
@Component({
  selector: 'app-print-occasion',
  templateUrl: './print-occasion.component.html',
  styleUrls: ['./print-occasion.component.css']
})
export class PrintOccasionComponent implements OnInit {

  private routeSub: Subscription;
  @ViewChild('htmlData') htmlData: ElementRef;
  constructor(private mediaService: SoireeOccasionService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.params.subscribe(p => {

      if (p.datedeb != null && p.datefin) {
        this.mediaService.List().subscribe(res => {
          this.AllmediaList = res;

          this.AllmediaList.forEach(item => {
            if (this.TestBetweenTwoDate(p.datedeb, p.datefin, item.dateTime)) {
              this.mediaList.push(item);
            }
          })
        });
      } else if (p.id != null) {
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
  mediaList: OccasionSoiree[] = [];
  AllmediaList: OccasionSoiree[] = [];

  TestBetweenTwoDate(DateDeb, DateFin, dateEnreg): boolean {
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
      this.path = "OccasionReport" + ".pdf"
      pdf.save(this.path); // Generated PDF
    });
  }
}
