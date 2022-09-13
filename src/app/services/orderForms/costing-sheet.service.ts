import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Configuration } from 'src/app/configuration';
import { Costing } from 'src/app/models/orderForms/costing';
@Injectable({
  providedIn: 'root',
})
export class CostingSheetService {
  private costingSheetBaseURL = `${Configuration.apiURL}api/costingSheet/`;

  constructor(private http: HttpClient) {}

  createCostingSheet(costingSheet: Costing): Observable<Costing> {
    return this.http.post<Costing>(
      `${this.costingSheetBaseURL}add`,
      costingSheet
    );
  }

  getCostingSheetByOrderId(orderId: String): Observable<Costing> {
    return this.http.get<Costing>(`${this.costingSheetBaseURL}get/${orderId}`);
  }
}
