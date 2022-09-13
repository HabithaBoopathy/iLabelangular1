import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root',
})
export class MdocumenttypeService {
  private baseUrl = `${Configuration.apiURL}api/master/documenttype`;

  private documenttype = `${Configuration.apiURL}api/master/documenttype/type`;

  private documenttypesticker = `${Configuration.apiURL}api/master/documenttype/sticker`;

  private documenttypetag = `${Configuration.apiURL}api/master/documenttype/tag`;

  constructor(private http: HttpClient) {}

  getMdocumenttype(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createMdocumenttype(mdocumenttype: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, mdocumenttype);
  }

  updateMdocumenttype(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, value);
  }

  deleteMdocumenttype(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getMdocumenttypesList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getByDocumentType(doctype: string): Observable<any> {
    return this.http.get(`${this.documenttype}/${doctype}`);
  }

  getByDocumentTypeSticker(sticker: string): Observable<any> {
    return this.http.get(`${this.documenttypesticker}/${sticker}`);
  }

  getByDocumentTypeTag(tag: string): Observable<any> {
    return this.http.get(`${this.documenttypetag}/${tag}`);
  }

  private handleError(error: any): Promise<any> {
    console.error('Some error occured', error);
    return Promise.reject(error.message || error);
  }
}
