import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root',
})
export class MlabeltypeService {
  private baseUrl = `${Configuration.apiURL}api/master/labeltype`;

  private useLabelType = `${Configuration.apiURL}api/master/labeltype/type`;

  private useLabelTypeWoven = `${Configuration.apiURL}api/master/labeltype/woven`;

  private useLabelTypePrinted = `${Configuration.apiURL}api/master/labeltype/printed`;

  constructor(private http: HttpClient) {}

  getMlabeltype(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createMlabeltype(mlabeltype: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, mlabeltype);
  }

  updateMlabeltype(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, value);
  }

  deleteMlabeltype(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getMlabeltypesList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getByLabelType(labelname: string): Observable<any> {
    return this.http.get(`${this.useLabelType}/${labelname}`);
  }

  getByLabelTypeWoven(woven: string): Observable<any> {
    return this.http.get(`${this.useLabelTypeWoven}/${woven}`);
  }

  getByLabelTypePrinted(printed: string): Observable<any> {
    return this.http.get(`${this.useLabelTypePrinted}/${printed}`);
  }

  private handleError(error: any): Promise<any> {
    console.error('Some error occured', error);
    return Promise.reject(error.message || error);
  }
}
