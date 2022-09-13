import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  private baseUrl = `${Configuration.apiURL}api/logs`;

  constructor(private http: HttpClient) {}

  getLog(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createLog(log: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, log);
  }

  updateLog(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, value);
  }

  deleteLog(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getLogsList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  private handleError(error: any): Promise<any> {
    console.error('Some error occured', error);
    return Promise.reject(error.message || error);
  }
}
