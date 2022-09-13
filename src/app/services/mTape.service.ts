import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MTape } from '../models/mTape';
import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root',
})
export class MTapeService {
  constructor(private http: HttpClient) {}

  getAllTapes(): Observable<MTape[]> {
    return this.http.get<MTape[]>(`${Configuration.apiURL}api/master/tape/all`);
  }

  createMTape(MTape: MTape): Observable<MTape> {
    return this.http.post<MTape>(
      `${Configuration.apiURL}api/master/tape/create`,
      MTape
    );
  }

  updateMTape(MTape: MTape): Observable<MTape> {
    return this.http.put<MTape>(
      `${Configuration.apiURL}api/master/tape/update`,
      MTape
    );
  }

  getTapeById(id: string): Observable<MTape> {
    return this.http.get<MTape>(
      `${Configuration.apiURL}api/master/tape/id/${id}`
    );
  }

  // private handleError(error: any): Promise<any> {
  //   console.error('Error while performing HTTP Call');
  //   console.log(error);
  //   return Promise.reject(error.message || error);
  // }
}
