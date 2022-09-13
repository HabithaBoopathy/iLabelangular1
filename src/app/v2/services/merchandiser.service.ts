import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Merchandiser } from '../models/merchandiser';
import { Configuration } from 'src/app/configuration';

@Injectable({
  providedIn: 'root',
})
export class MerchandiserService {
  baseUrl: string = `${Configuration.apiURL}api/master/merchandiser`;

  constructor(private http: HttpClient) {}

  getAllMerchandisers(): Observable<Merchandiser[]> {
    return this.http.get<Merchandiser[]>(`${this.baseUrl}/all`);
  }

  createMerchandiser(merchandiser: Merchandiser): Observable<Merchandiser> {
    return this.http.post<Merchandiser>(`${this.baseUrl}/create`, merchandiser);
  }

  updateMerchandiser(merchandiser: Merchandiser): Observable<Merchandiser> {
    return this.http.put<Merchandiser>(`${this.baseUrl}/update`, merchandiser);
  }

  getById(id: string): Observable<Merchandiser> {
    return this.http.get<Merchandiser>(`${this.baseUrl}/id/${id}`);
  }

  getByCompanyId(id: string): Observable<Merchandiser[]> {
    return this.http.get<Merchandiser[]>(`${this.baseUrl}/companyId/${id}`);
  }

  //Variable to pass companyId from company master
  companyId: string = null;
}
