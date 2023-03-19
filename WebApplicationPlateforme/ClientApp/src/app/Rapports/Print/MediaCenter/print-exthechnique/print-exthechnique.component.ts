import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ActivatedRoute } from '@angular/router';
import { ExthechniqueService } from '../../../../shared/Services/MediaCenter/ExtensionTechnique/exthechnique.service';
import { Exthechnique } from '../../../../shared/Models/MediaCenter/ExtensionTechnique/exthechnique.model';

@Component({
  selector: 'app-print-exthechnique',
  templateUrl: './print-exthechnique.component.html',
  styleUrls: ['./print-exthechnique.component.css']
})
export class PrintExthechniqueComponent implements OnInit {
  private routeSub: Subscription;
  @ViewChild('htmlData') htmlData: ElementRef;
  constructor(private mediaService: ExthechniqueService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.params.subscribe(p => {

      if (p.datedeb != null && p.datefin) {
        this.mediaService.ListExthechnique().subscribe(res => {
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
        this.mediaService.ListExthechnique().subscribe(res => {
          this.mediaList = res;
        });
      }
    });   
  }
  mediaList: Exthechnique[] = [];
  AllmediaList: Exthechnique[] = [];

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
      this.path = "ExthechniqueReport" + ".pdf"
      pdf.save(this.path); // Generated PDF
    });
  }
}
