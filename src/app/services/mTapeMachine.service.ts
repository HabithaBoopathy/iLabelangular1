import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MTapeMachine } from '../models/mTapeMachine';
import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root',
})
export class MTapeMachineService {
  constructor(private http: HttpClient) {}

  getAllMachines(): Observable<MTapeMachine[]> {
    return this.http.get<MTapeMachine[]>(
      `${Configuration.apiURL}api/master/tapeMachine/all`
    );
  }

  createMachine(mTapeMachine: MTapeMachine): Observable<MTapeMachine> {
    return this.http.post<MTapeMachine>(
      `${Configuration.apiURL}api/master/tapeMachine/create`,
      mTapeMachine
    );
  }

  updateMachine(mTapeMachine: MTapeMachine): Observable<MTapeMachine> {
    return this.http.put<MTapeMachine>(
      `${Configuration.apiURL}api/master/tapeMachine/update`,
      mTapeMachine
    );
  }

  getMachineById(id: string): Observable<MTapeMachine> {
    return this.http.get<MTapeMachine>(
      `${Configuration.apiURL}api/master/tapeMachine/id/${id}`
    );
  }

  // private handleError(error: any): Promise<any> {
  //   console.error('Error while performing HTTP Call');
  //   console.log(error);
  //   return Promise.reject(error.message || error);
  // }
}
