import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Userprofile } from '../models/userprofile';
import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = `${Configuration.apiURL}api/users`;
  private emailDuplicateCheck = `${Configuration.apiURL}api/users/email`;

  constructor(private http: HttpClient) {}

  getUser(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createUser(userprofile: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, userprofile);
  }

  updateUser(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, value);
  }

  deactivateUser(id): Observable<any> {
    return this.http.get(`${this.baseUrl}/deactivate/${id}`);
  }

  activateUser(id): Observable<any> {
    return this.http.get(`${this.baseUrl}/activate/${id}`);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  deleteUserByEmailId(email: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/email/delete/${email}`);
  }

  getUsersList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getUsersEmail(loginId: string): Observable<any> {
    return this.http.get(`${this.emailDuplicateCheck}/${loginId}`);
  }

  getUserByLoginId(loginId: string): Observable<Userprofile> {
    return this.http.get<Userprofile>(`${this.baseUrl}/email/${loginId}`);
  }

  private handleError(error: any): Promise<any> {
    console.error('Some error occured', error);
    return Promise.reject(error.message || error);
  }
}
