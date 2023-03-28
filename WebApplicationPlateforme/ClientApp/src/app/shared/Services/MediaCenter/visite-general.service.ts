import { Injectable } from '@angular/core';
import { PathSharedService } from '../../path-shared.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VisiteGeneral } from '../../Models/MediaCenter/visite-general.model';
@Injectable({
  providedIn: 'root'
})
export class VisiteGeneralService {


  constructor(private pathService: PathSharedService,
    private http: HttpClient) { }

  readonly rootURL = this.pathService.getPath();
  formData: VisiteGeneral;
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  }

  PutObservableE(visite: VisiteGeneral) {
    return this.http.put<VisiteGeneral>(this.rootURL + '/Visitegenerals/' + visite.id, visite, this.headers);

  }

  SearchByEmployee(Id) {
    return this.http.get<VisiteGeneral[]>(this.rootURL + '/Visitegenerals/SearchByEmployee/' + Id);
  }
  //Create VisiteGeneral

  Create(visite: VisiteGeneral) {
    return this.http.post<VisiteGeneral>(this.rootURL + '/Visitegenerals', visite, this.headers);
  }

  //Edit VisiteGeneral
  Edit() {
    return this.http.put(this.rootURL + '/Visitegenerals/' + this.formData.id, this.formData, this.headers);
  }

  // List VisiteGeneral

  List(): Observable<VisiteGeneral[]> {
    return this.http.get<VisiteGeneral[]>(this.rootURL + '/Visitegenerals');
  }

  //Delete VisiteGeneral

  Delete(id) {
    return this.http.delete(this.rootURL + '/Visitegenerals/' + id);
  }

  //Put VisiteGeneral


  Put(Id) {
    return this.http.put(this.rootURL + '/Visitegenerals/' + this.formData.id, this.formData, this.headers);
  }

  //Get VisiteGeneral By Id

  GetById(Id) {
    return this.http.get<VisiteGeneral>(this.rootURL + '/Visitegenerals/' + Id);
  }
}
