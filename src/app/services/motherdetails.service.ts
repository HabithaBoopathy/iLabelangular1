import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MotherDetails } from '../models/motherdetails';
import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root',
})
export class MotherdetailsService {
  private baseUrl = `${Configuration.apiURL}api/master/otherdetails`;

  private otherDetailsWoven = `${Configuration.apiURL}api/master/otherdetails/woven`;

  private otherDetailsPrinted = `${Configuration.apiURL}api/master/otherdetails/printed`;

  private otherDetailsTag = `${Configuration.apiURL}api/master/otherdetails/tag`;

  constructor(private http: HttpClient) {}

  getMotherDetails(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createMotherDetails(otherdetails: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, otherdetails);
  }

  updateMotherDetails(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, value);
  }

  deleteMotherDetails(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getMotherDetailsList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getOtherDetailsWoven(otherdetails: string, woven: string): Observable<any> {
    return this.http.get(`${this.otherDetailsWoven}/${otherdetails}/${woven}`);
  }

  getOtherDetailsPrinted(
    otherdetails: string,
    printed: string
  ): Observable<any> {
    return this.http.get(
      `${this.otherDetailsPrinted}/${otherdetails}/${printed}`
    );
  }

  getOtherDetailsTag(otherdetails: string, tag: string): Observable<any> {
    return this.http.get(`${this.otherDetailsTag}/${otherdetails}/${tag}`);
  }

  private handleError(error: any): Promise<any> {
    console.error('Some error occured', error);
    return Promise.reject(error.message || error);
  }
}
