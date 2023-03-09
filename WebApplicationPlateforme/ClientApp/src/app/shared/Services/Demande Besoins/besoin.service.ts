import { Injectable } from '@angular/core';
import { PathSharedService } from '../../path-shared.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TbListening } from '../../Models/Evenements/tb-listening.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BesoinService {

  constructor(private pathService: PathSharedService,
    private http: HttpClient) { }

  readonly rootURL = this.pathService.getPath();
  formData: TbListening;
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  }

  // 

  Add(TbListening: TbListening) {
    return this.http.post<TbListening>(this.rootURL + '/besoins', TbListening, this.headers);
  }

  PutObservableE(besoin: TbListening) {
    return this.http.put<TbListening>(this.rootURL + '/besoins/' + besoin.id, besoin, this.headers);

  }
  Post() {
    return this.http.post(this.rootURL + '/besoins', this.formData, this.headers);
  }


  Get(): Observable<TbListening[]> {
    return this.http.get<TbListening[]>(this.rootURL + '/besoins');
  }


  GetById(Id) {
    return this.http.get<TbListening>(this.rootURL + '/besoins/' + Id);
  }


  Edit() {
    return this.http.put(this.rootURL + '/besoins/' + this.formData.id, this.formData, this.headers);
  }

  Delete(id) {
    return this.http.delete(this.rootURL + '/besoins/' + id);
  }
}
