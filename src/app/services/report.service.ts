import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Configuration } from '../configuration';
import { ReportInput } from '../models/report/reportInput';
import { ReportOutput } from '../models/report/reportOutput';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private reportUrl: string = `${Configuration.apiURL}api/report`;

  constructor(private http: HttpClient) {}

  getReport(reportInput: ReportInput): Observable<ReportOutput[]> {
    return this.http.post<ReportOutput[]>(this.reportUrl, reportInput);
  }
}
