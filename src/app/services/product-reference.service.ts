import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root',
})
export class ProductReferenceService {
  private baseUrl = `${Configuration.apiURL}api/master/productreference`;

  private printMaxNumber = `${Configuration.apiURL}api/master/productreference/printmax`;

  private wovenMaxNumber = `${Configuration.apiURL}api/master/productreference/wovenmax`;

  private tagMaxNumber = `${Configuration.apiURL}api/master/productreference/tagmax`;

  private stickerMaxNumber = `${Configuration.apiURL}api/master/productreference/stickermax`;

  constructor(private http: HttpClient) {}

  getProductReference(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createProductReference(productReference: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, productReference);
  }

  updateProductReference(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, value);
  }

  deleteProductReference(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getProductReferenceList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getByPrintedMaximumNumber(): Observable<any> {
    return this.http.get(`${this.printMaxNumber}`);
  }

  getByWovenMaximumNumber(): Observable<any> {
    return this.http.get(`${this.wovenMaxNumber}`);
  }

  getByTagMaximumNumber(): Observable<any> {
    return this.http.get(`${this.tagMaxNumber}`);
  }

  getByStickerMaximumNumber(): Observable<any> {
    return this.http.get(`${this.stickerMaxNumber}`);
  }

  private handleError(error: any): Promise<any> {
    console.error('Some error occured', error);
    return Promise.reject(error.message || error);
  }
}
