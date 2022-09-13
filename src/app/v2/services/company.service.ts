import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../models/company';
import { Configuration } from 'src/app/configuration';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  baseUrl: string = `${Configuration.apiURL}api/master/company/v2`;

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
}
