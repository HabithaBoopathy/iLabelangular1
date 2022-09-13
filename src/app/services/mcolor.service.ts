import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root',
})
export class McolorService {
  private baseUrl = `${Configuration.apiURL}api/master/color`;

  private usecolorname = `${Configuration.apiURL}api/master/color/colorname`;

  private usecolornamewoven = `${Configuration.apiURL}api/master/color/woven`;

  private usecolornameprinted = `${Configuration.apiURL}api/master/color/printed`;

  private usecolornametag = `${Configuration.apiURL}api/master/color/tag`;

  constructor(private http: HttpClient) {}

  getMcolor(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createMcolor(mcolor: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, mcolor);
  }

  updateMcolor(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, value);
  }

  deleteMcolor(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getMcolorsList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getByColorName(colorname: string): Observable<any> {
    return this.http.get(`${this.usecolorname}/${colorname}`);
  }

  getByColorWoven(woven: string): Observable<any> {
    return this.http.get(`${this.usecolornamewoven}/${woven}`);
  }

  getByColorPrinted(printed: string): Observable<any> {
    return this.http.get(`${this.usecolornameprinted}/${printed}`);
  }

  getByColorTag(tag: string): Observable<any> {
    return this.http.get(`${this.usecolornametag}/${tag}`);
  }

  private handleError(error: any): Promise<any> {
    console.error('Some error occured', error);
    return Promise.reject(error.message || error);
  }
}
