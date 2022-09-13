import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Territory } from '../models/territory';
import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root',
})
export class TerritoryService {
  private baseUrl = `${Configuration.apiURL}api/master/territory`;

  constructor(private http: HttpClient) {}

  getByTerritoryId(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/getByTerritoryId/${id}`);
  }

  getByExecutiveId(id: number): Observable<Territory[]> {
    return this.http.get<Territory[]>(`${this.baseUrl}/executiveId/${id}`);
  }

  getAllTerritories(): Observable<Territory[]> {
    return this.http.get<Territory[]>(`${this.baseUrl}/all`);
  }

  createTerritory(territory: Territory): Observable<Territory> {
    return this.http.post<Territory>(`${this.baseUrl}/create`, territory);
  }

  updateTerritory(territory: Territory): Observable<Territory> {
    return this.http.put<Territory>(`${this.baseUrl}/update`, territory);
  }

  private handleError(error: any): Promise<any> {
    console.error('Some error occured', error);
    return Promise.reject(error.message || error);
  }
}
