import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root',
})
export class ProductLocationService {
  private baseUrl = `${Configuration.apiURL}api/master/productlocation`;

  private locationcheck = `${Configuration.apiURL}api/master/productlocation/locationname`;

  constructor(private http: HttpClient) {}

  getProductLocation(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createProductLocation(productLocation: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, productLocation);
  }

  updateProductLocation(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, value);
  }

  deleteProductLocation(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getProductLocationList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getByLocationName(location: string): Observable<any> {
    return this.http.get(`${this.locationcheck}/${location}`);
  }

  private handleError(error: any): Promise<any> {
    console.error('Some error occured', error);
    return Promise.reject(error.message || error);
  }
}
