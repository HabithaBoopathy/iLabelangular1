import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root',
})
export class CustomerReferenceService {
  private baseUrl = `${Configuration.apiURL}api/master/customerreference`;

  constructor(private http: HttpClient) {}

  getCustomerReference(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createCustomerReference(customerReference: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, customerReference);
  }

  updateCustomerReference(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, value);
  }

  deleteCustomerReference(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getCustomerReferenceList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  private handleError(error: any): Promise<any> {
    console.error('Some error occured', error);
    return Promise.reject(error.message || error);
  }
}
