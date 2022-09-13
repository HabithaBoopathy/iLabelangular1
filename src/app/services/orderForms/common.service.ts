import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Configuration } from '../../configuration';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private baseUrl = `${Configuration.apiURL}api/orders/common`;

  constructor(private http: HttpClient) {}

  getCommon(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createCommon(common: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, common);
  }

  updateCommon(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, value);
  }

  deleteCommon(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getCommonList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  private handleError(error: any): Promise<any> {
    console.error('Some error occured', error);
    return Promise.reject(error.message || error);
  }
}
