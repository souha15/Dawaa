import { Injectable } from '@angular/core';
import { DemandeBesoin } from '../../Models/Demande Besoins/demande-besoin.model';
import { Observable } from 'rxjs';
import { PathSharedService } from '../../path-shared.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DemandeBesoinService {


  constructor(private pathService: PathSharedService,
    private http: HttpClient) { }

  readonly rootURL = this.pathService.getPath();
  formData: DemandeBesoin;
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  }

  PutObservableE(demBesoin: DemandeBesoin) {
    return this.http.put<DemandeBesoin>(this.rootURL + '/DemandeBesoins/' + demBesoin.id, demBesoin, this.headers);

  }

  PutEtatDir(userId, Id,etat) {
    return this.http.put<DemandeBesoin>(this.rootURL + '/DemandeBesoins/PutEtatDir/' + userId +"/"+ Id +"/" +etat, this.headers);

  }
  //Create DemandeBesoins

  Create(tache: DemandeBesoin) {
    return this.http.post<DemandeBesoin>(this.rootURL + '/DemandeBesoins', tache, this.headers);
  }

  //Edit DemandeBesoins
  Edit() {
    return this.http.put(this.rootURL + '/DemandeBesoins/' + this.formData.id, this.formData, this.headers);
  }

  // List DemandeBesoins

  List(): Observable<DemandeBesoin[]> {
    return this.http.get<DemandeBesoin[]>(this.rootURL + '/DemandeBesoins');
  }

  //Delete DemandeBesoins

  Delete(id) {
    return this.http.delete(this.rootURL + '/DemandeBesoins/' + id);
  }

  //Put DemandeBesoins


  Put(Id) {
    return this.http.put(this.rootURL + '/DemandeBesoins/' + this.formData.id, this.formData, this.headers);
  }


  //Get DemandeBesoins By Id

  GetById(Id) {
    return this.http.get<DemandeBesoin>(this.rootURL + '/DemandeBesoins/' + Id);
  }


  GetBesoinsDir(userId) {
    return this.http.get<DemandeBesoin[]>(this.rootURL + '/DemandeBesoins/GetBesoinsDir/' + userId);
  }
  GetBesoinsForUserCreator(userId) {
    return this.http.get<DemandeBesoin[]>(this.rootURL + '/DemandeBesoins/GetBesoinsForUserCreator/' + userId);
  }
}
