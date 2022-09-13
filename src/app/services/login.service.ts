import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from '../models/login';
import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  movies: Login[];
  movie: Login;

  private baseUrl = `${Configuration.apiURL}api/users`;

  private checkLogin = `${Configuration.apiURL}api/users/checklogin`;

  private checkAccess = `${Configuration.apiURL}api/users/checkaccess`;

  constructor(private http: HttpClient) {}

  getLogin(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createLogin(login: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, login);
  }

  updateLogin(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, value);
  }

  deleteLogin(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  checkLoginDetails(loginID: string, password: string): Observable<any> {
    return this.http.get(`${this.checkLogin}/${loginID}/${password}`);
  }

  checkAccessDetails(accessRights: string): Observable<any> {
    return this.http.get(`${this.checkAccess}/${accessRights}`);
  }

  getLoginList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
}
