import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mexecutive } from '../models/mexecutive';
import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root',
})
export class MexecutiveService {
  private baseUrl = `${Configuration.apiURL}api/master/executive`;

  private executiveEmail = `${Configuration.apiURL}api/master/executive/executiveemail`;

  private executiveName = `${Configuration.apiURL}api/master/executive/executivename`;

  private executiveCode = `${Configuration.apiURL}api/master/executive/executivecode`;

  constructor(private http: HttpClient) {}

  getMexecutive(id): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createMexecutive(mexecutive: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, mexecutive);
  }

  updateMexecutive(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, value);
  }

  deleteMexecutive(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getMexecutivesList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getByExecutiveEmail(emailId: string): Observable<any> {
    return this.http.get(`${this.executiveEmail}/${emailId}`);
  }

  getByExecutiveName(execname: string): Observable<any> {
    return this.http.get(`${this.executiveName}/${execname}`);
  }

  getByExecutiveCode(code: string): Observable<any> {
    return this.http.get(`${this.executiveCode}/${code}`);
  }

  getByTerritoryId(id: string): Observable<Mexecutive[]> {
    return this.http.get<Mexecutive[]>(`${this.baseUrl}/territoryId/${id}`);
  }

  private handleError(error: any): Promise<any> {
    console.error('Some error occured', error);
    return Promise.reject(error.message || error);
  }
}
