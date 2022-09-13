import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root',
})
export class QuotationReferenceNumberService {
  private baseUrl = `${Configuration.apiURL}api/quotationreference`;

  constructor(private http: HttpClient) {}

  getQuotationReference(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createQuotationReference(quotationReference: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, quotationReference);
  }

  updateQuotationReference(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, value);
  }

  deleteQuotationReference(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getQuotationReferenceList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  private handleError(error: any): Promise<any> {
    console.error('Some error occured', error);
    return Promise.reject(error.message || error);
  }
}
