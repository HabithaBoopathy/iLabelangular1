import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  private baseUrl = `${Configuration.apiURL}api/time/`;

  constructor(private http: HttpClient) {}

  getCurrentDateTimeISO_UTC(): Observable<string> {
    return this.http.get(`${this.baseUrl}UTCDateTime`, {
      responseType: 'text',
    });
  }
}
