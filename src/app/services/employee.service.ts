import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee';
import { Userprofile } from '../models/userprofile';
import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private baseUrl = `${Configuration.apiURL}api/v1/employees`;

  private baseUrl2 = `${Configuration.apiURL}api/v1/employees/verify/Verified`;

  private customerEmail = `${Configuration.apiURL}api/v1/employees/employeeemail`;

  private customerref = `${Configuration.apiURL}api/v1/employees/customerref`;

  private executiveName = `${Configuration.apiURL}api/v1/employees/executivename`;

  private executiveCode = `${Configuration.apiURL}api/v1/employees/executivecode`;

  private path_getCustomerReferenceAndNameByExecutiveCode = `${Configuration.apiURL}api/v1/employees/customerreferenceandname/executivename`;

  constructor(private http: HttpClient) {}

  getEmployee(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getCustomerById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/${id}`);
  }

  createEmployee(employee: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, employee);
  }

  updateEmployeeNew(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}/update`, employee);
  }

  updateEmployee(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, value);
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getEmployeesList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getActiveCustomers(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}/active`);
  }

  getCustomerEmail(emailId: string): Observable<any> {
    return this.http.get(`${this.customerEmail}/${emailId}`);
  }

  getCustomerReferenceNumber(customerReference: string): Observable<any> {
    return this.http.get(`${this.customerref}/${customerReference}`);
  }
  getExecutiveName(executiveName: string): Observable<any> {
    return this.http.get(`${this.executiveName}/${executiveName}`);
  }

  getCustomerReferenceAndNameByExecutiveCode(
    executiveName: string
  ): Observable<any> {
    return this.http.get(
      `${this.path_getCustomerReferenceAndNameByExecutiveCode}/${executiveName}`
    );
  }

  getExecutiveCode(executiveCode: string): Observable<any> {
    return this.http.get(`${this.executiveCode}/${executiveCode}`);
  }

  getVerifiedEmployeesList(): Observable<any> {
    return this.http.get(`${this.baseUrl2}`);
  }

  getByVerificationStatus(verificationStatus: String): Observable<any> {
    return this.http.get(
      `${Configuration.apiURL}api/v1/employees/verify/${verificationStatus}`
    );
  }

  deactivateCustomer(id): Observable<Userprofile> {
    return this.http.get<Userprofile>(`${this.baseUrl}/deactivate/${id}`);
  }

  activateCustomer(id): Observable<Userprofile> {
    return this.http.get<Userprofile>(`${this.baseUrl}/activate/${id}`);
  }

  getEmployeesListForExecutive(executiveCode): Observable<Employee[]> {
    return this.http.get<Employee[]>(
      `${this.baseUrl}/executiveCodeAndActive/${executiveCode}`
    );
  }
}
