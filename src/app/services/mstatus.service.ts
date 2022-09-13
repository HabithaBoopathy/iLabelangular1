import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root',
})
export class MstatusService {
  private baseUrl = `${Configuration.apiURL}api/master/status`;

  private status = `${Configuration.apiURL}api/master/status/statusname`;

  private statuswoven = `${Configuration.apiURL}api/master/status/woven`;

  private statusprinted = `${Configuration.apiURL}api/master/status/printed`;

  private statustag = `${Configuration.apiURL}api/master/status/tag`;

  constructor(private http: HttpClient) {}

  getMstatus(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createMstatus(mstatus: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, mstatus);
  }

  updateMstatus(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, value);
  }

  deleteMstatus(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getMstatussList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getStatusName(productstatus: string): Observable<any> {
    return this.http.get(`${this.status}/${productstatus}`);
  }

  getByStatusWoven(woven: string): Observable<any> {
    return this.http.get(`${this.statuswoven}/${woven}`);
  }

  getByStatusPrinted(printed: string): Observable<any> {
    return this.http.get(`${this.statusprinted}/${printed}`);
  }

  getByStatusTag(tag: string): Observable<any> {
    return this.http.get(`${this.statustag}/${tag}`);
  }

  private handleError(error: any): Promise<any> {
    console.error('Some error occured', error);
    return Promise.reject(error.message || error);
  }
}
