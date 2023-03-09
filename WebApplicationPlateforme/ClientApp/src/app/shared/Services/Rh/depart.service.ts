import { Injectable } from '@angular/core';
import { PathSharedService } from '../../path-shared.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Depart } from '../../Models/RH/depart.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DepartService {


  constructor(private pathService: PathSharedService,
    private http: HttpClient) { }

  readonly rootURL = this.pathService.getPath();
  formData: Depart;
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  }

  //Create

  Add(dep: Depart) {
    return this.http.post<Depart>(this.rootURL + '/Departs', dep, this.headers);
  }
  PutObservableE(dep: Depart) {
    return this.http.put<Depart>(this.rootURL + '/Departs/' + dep.id, dep, this.headers);

  }
  //Save 
  Post() {
    return this.http.post(this.rootURL + '/Departs', this.formData, this.headers);
  }

  //Get 

  GetDeparts(): Observable<Depart[]> {
    return this.http.get<Depart[]>(this.rootURL + '/Departs');
  }

  Get() {
    return this.http.get<Depart[]>(this.rootURL + '/Departs');
  }
  //Get 

  GetById(Id) {
    return this.http.get<Depart>(this.rootURL + '/Departs/' + Id);
  }

  //Edit 

  Edit() {
    return this.http.put(this.rootURL + '/Departs/' + this.formData.id, this.formData, this.headers);
  }


  //Delete 

  Delete(id) {
    return this.http.delete(this.rootURL + '/Departs/' + id);
  }
}
