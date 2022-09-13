import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../models/company';
import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private baseUrl = `${Configuration.apiURL}api/master/company`;

  constructor(private http: HttpClient) {}

  getAllCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.baseUrl}/all`);
  }

  createCompany(company: Company): Observable<Company> {
    return this.http.post<Company>(`${this.baseUrl}/create`, company);
  }

  updateCompany(company: Company): Observable<Company> {
    return this.http.put<Company>(`${this.baseUrl}/update`, company);
  }

  getById(id: string): Observable<Company> {
    return this.http.get<Company>(`${this.baseUrl}/id/${id}`);
  }

  private handleError(error: any): Promise<any> {
    console.error('Some error occured', error);
    return Promise.reject(error.message || error);
  }
}
