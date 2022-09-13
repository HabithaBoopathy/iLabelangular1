import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { sample } from 'rxjs/operators';
import { Configuration } from 'src/app/configuration';
import { Everything } from 'src/app/models/orderForms/Everything';
import { PaginationInput } from 'src/app/models/orderForms/PaginationInput';

@Injectable({
  providedIn: 'root',
})
export class EverythingService {
  createDraftCostingWoven(id: string) {
    throw new Error('Method not implemented.');
  }
  private baseUrl = `${Configuration.apiURL}api/orders/everything`;

  private customerOrders = `${Configuration.apiURL}api/orders/everything/customeremail`;

  private referenceNumber = `${Configuration.apiURL}api/orders/everything/refno`;

  private printMaxNumber = `${Configuration.apiURL}api/orders/everything/printmax`;

  private wovenMaxNumber = `${Configuration.apiURL}api/orders/everything/wovenmax`;

  private tagMaxNumber = `${Configuration.apiURL}api/orders/everything/tagmax`;

  private stickerMaxNumber = `${Configuration.apiURL}api/orders/everything/stickermax`;

  private executiveOrders = `${Configuration.apiURL}api/orders/everything/executivecode`;

  // Admin Dashboard
  private admintrimtypecount = `${Configuration.apiURL}api/orders/everything/TrimTypesCount`;

  private admintransactionStatus = `${Configuration.apiURL}api/orders/everything/transactioncount`;

  private admindetails = `${Configuration.apiURL}api/orders/everything/admindetails`;

  // Customer Dashboard
  private customertrimtypecount = `${Configuration.apiURL}api/orders/everything/customer/trimtypecount`;

  private customertransactionCount = `${Configuration.apiURL}api/orders/everything/customer/transactionstatuscount`;

  private customerdetails = `${Configuration.apiURL}api/orders/everything/customerdetails`;

  // Executive Dashboard
  private executiveTrimTypeCount = `${Configuration.apiURL}api/orders/everything/executive/trimtypecount`;

  private executivetransactionCount = `${Configuration.apiURL}api/orders/everything/executive/transactionstatuscount`;

  private executivedetails = `${Configuration.apiURL}api/orders/everything/executivedetails`;

  constructor(private http: HttpClient) {}

  getEverything(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getById(id: string): Observable<Everything> {
    return this.http.get<Everything>(`${this.baseUrl}/${id}`);
  }

  createEverything(everything: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, everything);
  }

  updateEverything(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, value);
  }

  deleteEverything(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getEverythingList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getEverythingSingleID(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getByEverythingReferenceNumber(refNo: string): Observable<any> {
    return this.http.get(`${this.referenceNumber}/${refNo}`);
  }

  getByPrintedMaximumNumber(): Observable<any> {
    return this.http.get(`${this.printMaxNumber}`);
  }

  getByWovenMaximumNumber(): Observable<any> {
    return this.http.get(`${this.wovenMaxNumber}`);
  }

  getByTagMaximumNumber(): Observable<any> {
    return this.http.get(`${this.tagMaxNumber}`);
  }

  getByStickerMaximumNumber(): Observable<any> {
    return this.http.get(`${this.stickerMaxNumber}`);
  }

  getByCustomerOrders(email: string): Observable<any> {
    return this.http.get(`${this.customerOrders}/${email}`);
  }

  getByExecutiveCode(executiveCode: string): Observable<any> {
    return this.http.get(`${this.executiveOrders}/${executiveCode}`);
  }

  // Admin Dashboard
  getTrimTypeCount(): Observable<any> {
    return this.http.get(`${this.admintrimtypecount}`);
  }

  getByAdminTransactionstatus(): Observable<any> {
    return this.http.get(`${this.admintransactionStatus}`);
  }

  getByAdminAllDetails(): Observable<any> {
    return this.http.get(`${this.admindetails}`);
  }

  // Customer Dashboard
  getByCustomerTrimTypeCount(email: string): Observable<any> {
    return this.http.get(`${this.customertrimtypecount}/${email}`);
  }

  getByCustomerTransactionCount(email: string): Observable<any> {
    return this.http.get(`${this.customertransactionCount}/${email}`);
  }

  getByCustomerAllDetails(email: string): Observable<any> {
    return this.http.get(`${this.customerdetails}/${email}`);
  }

  // Executive Dashboard
  getByExecutiveTrimTypeCount(executiveCode: string): Observable<any> {
    return this.http.get(`${this.executiveTrimTypeCount}/${executiveCode}`);
  }

  getByExecutiveTransactionCount(executiveCode: string): Observable<any> {
    return this.http.get(`${this.executivetransactionCount}/${executiveCode}`);
  }

  getByExecutiveAllDetails(executiveCode: string): Observable<any> {
    return this.http.get(`${this.executivedetails}/${executiveCode}`);
  }

  private handleError(error: any): Promise<any> {
    console.error('Some error occured', error);
    return Promise.reject(error.message || error);
  }

  //orders component - pagination service
  private ordersPaginationUrl = `${Configuration.apiURL}api/orders/pagination`;

  getPaginatedOrders(paginationInput: PaginationInput): Observable<any> {
    return this.http.post<any[]>(this.ordersPaginationUrl, paginationInput);
  }
  getEverythingByCustomerID(_id): Observable<Everything> {
    return this.http.get<Everything>(
      `${this.baseUrl}/api/orders/everything/${_id}`
    );
  }
  getAllDetailsForCustomer(
    customerId: string
  ): Observable<Everything[]> {
    return this.http.get<Everything[]>(
      `${this.baseUrl}/api/orders/everything/${customerId}`
    );
  } 
}
