import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Configuration } from 'src/app/configuration';
import { QuotationForm2 } from 'src/app/models/QuotationForm2';

@Injectable({
  providedIn: 'root',
})
export class QuotationService {
  private baseUrl = `${Configuration.apiURL}api/master/quotations`;

  constructor(private http: HttpClient) {}

  getQuotation(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  addQuotation(quotation: QuotationForm2): Observable<QuotationForm2> {
    return this.http.post<QuotationForm2>(`${this.baseUrl}`, quotation);
  }

  createQuotation(quotation: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, quotation);
  }

  updateQuotation(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, value);
  }

  deleteQuotation(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getQuotationList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  private handleError(error: any): Promise<any> {
    console.error('Some error occured', error);
    return Promise.reject(error.message || error);
  }
}
