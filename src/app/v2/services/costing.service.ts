import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WovenCosting } from '../models/wovenCosting';
import { Configuration } from 'src/app/configuration';

@Injectable({
  providedIn: 'root',
})
export class CostingService {
  
  baseUrl: string = `${Configuration.apiURL}api/master/costing/v2`;

  constructor(private http: HttpClient) {}

  createWoven(wovenCosting: WovenCosting): Observable<WovenCosting> {
    return this.http.post<WovenCosting>(
      `${this.baseUrl}/woven/create`,
      wovenCosting
    );
  }

  updateWoven(wovenCosting: WovenCosting): Observable<WovenCosting> {
    return this.http.put<WovenCosting>(
      `${this.baseUrl}/woven/update`,
      wovenCosting
    );
  }

  getWovenByid(id: string): Observable<WovenCosting> {
    return this.http.get<WovenCosting>(`${this.baseUrl}/woven/id/${id}`);
  }

  getWovenByOrderId(id: string): Observable<WovenCosting> {
    return this.http.get<WovenCosting>(`${this.baseUrl}/woven/orderId/${id}`);
  }
}
