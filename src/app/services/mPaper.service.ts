import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MPaper } from '../models/mPaper';
import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root',
})
export class MPaperService {
  constructor(private http: HttpClient) {}

  getAllPapers(): Observable<MPaper[]> {
    return this.http.get<MPaper[]>(
      `${Configuration.apiURL}api/master/paper/all`
    );
  }

  createMPaper(MPaper: MPaper): Observable<MPaper> {
    return this.http.post<MPaper>(
      `${Configuration.apiURL}api/master/paper/create`,
      MPaper
    );
  }

  updateMPaper(MPaper: MPaper): Observable<MPaper> {
    return this.http.put<MPaper>(
      `${Configuration.apiURL}api/master/paper/update`,
      MPaper
    );
  }

  getPaperById(id: string): Observable<MPaper> {
    return this.http.get<MPaper>(
      `${Configuration.apiURL}api/master/paper/id/${id}`
    );
  }

  // private handleError(error: any): Promise<any> {
  //   console.error('Error while performing HTTP Call');
  //   console.log(error);
  //   return Promise.reject(error.message || error);
  // }
}
