import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root',
})
export class MunitService {
  private baseUrl = `${Configuration.apiURL}api/master/unit`;

  private unitName = `${Configuration.apiURL}api/master/unit/unitname`;

  private unitNameWoven = `${Configuration.apiURL}api/master/unit/woven`;

  private unitNamePrinted = `${Configuration.apiURL}api/master/unit/printed`;

  private unitNameSticker = `${Configuration.apiURL}api/master/unit/sticker`;

  private unitNameTag = `${Configuration.apiURL}api/master/unit/tag`;

  constructor(private http: HttpClient) {}

  getMunit(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createMunit(munit: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, munit);
  }

  updateMunit(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, value);
  }

  deleteMunit(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getMunitsList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getByUnitName(productunit: string): Observable<any> {
    return this.http.get(`${this.unitName}/${productunit}`);
  }

  getByUnitWoven(woven: string): Observable<any> {
    return this.http.get(`${this.unitNameWoven}/${woven}`);
  }

  getByUnitPrinted(printed: string): Observable<any> {
    return this.http.get(`${this.unitNamePrinted}/${printed}`);
  }

  getByUnitSticker(sticker: string): Observable<any> {
    return this.http.get(`${this.unitNameSticker}/${sticker}`);
  }

  getByUnitTag(tag: string): Observable<any> {
    return this.http.get(`${this.unitNameTag}/${tag}`);
  }

  private handleError(error: any): Promise<any> {
    console.error('Some error occured', error);
    return Promise.reject(error.message || error);
  }
}
