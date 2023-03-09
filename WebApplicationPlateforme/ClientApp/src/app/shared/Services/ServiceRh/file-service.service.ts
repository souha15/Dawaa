import { Injectable } from '@angular/core';
import { PathSharedService } from '../../path-shared.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FileService } from '../../Models/ServiceRh/file-service.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileServiceService {

  constructor(private pathService: PathSharedService,
    private http: HttpClient) { }


  readonly rootURL = this.pathService.getPath();
  formData: FileService;
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  }

  //Create  

  Add(file: FileService) {
    return this.http.post<FileService>(this.rootURL + '/FileServices', file, this.headers);
  }

  //Get   List

  GetDotation(): Observable<FileService[]> {
    return this.http.get<FileService[]>(this.rootURL + '/FileServices');
  }

  Get() {
    return this.http.get<FileService[]>(this.rootURL + '/FileServices');
  }
  //Get   By Id

  GetById(Id) {
    return this.http.get<FileService>(this.rootURL + '/FileServices/' + Id);
  }

  //Edit  

  Edit() {
    return this.http.put(this.rootURL + '/FileServices/' + this.formData.id, this.formData, this.headers);
  }


  //Delete  

  Delete(id) {
    return this.http.delete(this.rootURL + '/FileServices/' + id);
  }

  //Get  By Services

  GetPermissionFiles(Id) {
    return this.http.get<FileService[]>(this.rootURL + '/FileServices/GetPermissionFiles/' + Id);
  }


  GetEquipementFiles(Id) {
    return this.http.get<FileService[]>(this.rootURL + '/FileServices/GetEquipementFiles/' + Id);
  }

  GetSalarialeFiles(Id) {
    return this.http.get<FileService[]>(this.rootURL + '/FileServices/GetSalarialeFiles/' + Id);
  }

  GetResidenceFiles(Id) {
    return this.http.get<FileService[]>(this.rootURL + '/FileServices/GetResidenceFiles/' + Id);
  }

  GetFormationFiles(Id) {
    return this.http.get<FileService[]>(this.rootURL + '/FileServices/GetFormationFiles/' + Id);
  }

  GetAssistanceFiles(Id) {
    return this.http.get<FileService[]>(this.rootURL + '/FileServices/GetAssistanceFiles/' + Id);
  }

  GetOrdrePayFiles(Id) {
    return this.http.get<FileService[]>(this.rootURL + '/FileServices/GetOrdrePayFiles/' + Id);
  }

  GetDemTechFiles(Id) {
    return this.http.get<FileService[]>(this.rootURL + '/FileServices/GetDemTechFiles/' + Id);
  }

  GetDemissionFiles(Id) {
    return this.http.get<FileService[]>(this.rootURL + '/FileServices/GetDemissionFiles/' + Id);
  }


  GetAvanceFiles(Id) {
    return this.http.get<FileService[]>(this.rootURL + '/FileServices/GetAvanceFiles/' + Id);
  }


  GetSuppHeureFiles(Id) {
    return this.http.get<FileService[]>(this.rootURL + '/FileServices/GetSuppHeureFiles/' + Id);
  }


  GetCreationFiles(Id) {
    return this.http.get<FileService[]>(this.rootURL + '/FileServices/GetCreationFiles/' + Id);
  }


  GetAttestationTravailFiles(Id) {
    return this.http.get<FileService[]>(this.rootURL + '/FileServices/GetAttestationTravailFiles/' + Id);
  }

  GetVoitureFiles(Id) {
    return this.http.get<FileService[]>(this.rootURL + '/FileServices/GetVoitureFiles/' + Id);
  }

  GetVenteFiles(Id) {
    return this.http.get<FileService[]>(this.rootURL + '/FileServices/GetVenteFiles/' + Id);
  }


  GetMaintenanceFiles(Id) {
    return this.http.get<FileService[]>(this.rootURL + '/FileServices/GetMaintenanceFiles/' + Id);
  } GetBesoinsFiles(Id) {
    return this.http.get<FileService[]>(this.rootURL + '/FileServices/GetBesoinsFiles/' + Id);
  }


}
