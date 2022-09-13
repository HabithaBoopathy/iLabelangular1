import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root',
})
export class QuotationformService {
  private baseUrl = `${Configuration.apiURL}api/master/quotationform`;

  constructor(private http: HttpClient) {}

  getQuotationForm(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createQuotationForm(quotationForm: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, quotationForm);
  }

  updateQuotationForm(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, value);
  }

  deleteQuotationForm(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getQuotationFormList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  private handleError(error: any): Promise<any> {
    console.error('Some error occured', error);
    return Promise.reject(error.message || error);
  }
}
