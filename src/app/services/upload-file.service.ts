import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpHeaders,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root',
})
export class UploadFileService {
  private baseUrl = `${Configuration.apiURL}`;

  private deletefile = `${Configuration.apiURL}deletefile`;

  private moveFile = `${Configuration.apiURL}movefile`;

  constructor(private http: HttpClient) {}

  upload(
    file: File,
    date: string = ' ',
    refNo: string = ' '
  ): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    let url: string = `${this.baseUrl}upload/${date}/${refNo}/`;

    let req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.http.request(req);
  }

  moveArtWorkFile(
    date: string = ' ',
    refNo: string = ' ',
    fileName: string = ' '
  ) {
    this.http
      .get(`${this.moveFile}/${date}/${refNo}/${fileName}/`)
      .toPromise()
      .then(
        (data) => {},
        (err) => {
          console.log(err);
        }
      );
  }

  deleteFiles(
    fileName: string = ' ',
    date: string = ' ',
    refNo: string = ' '
  ): Observable<any> {
    return this.http.get(`${this.deletefile}/${date}/${refNo}/${fileName}/`, {
      responseType: 'text',
    });
  }

  // Quotation Form Upload
  uploadQuotation(
    file: File,
    fileName,
    date = ' ',
    refNo = ' '
  ): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file, fileName);

    const req = new HttpRequest(
      'POST',
      `${this.baseUrl}uploadquotation/${date}/${refNo}/`,
      formData,
      {
        reportProgress: true,
        responseType: 'json',
      }
    );

    return this.http.request(req);
  }

  // Quotation Form Upload for Send for Customer Acceptance
  uploadQuotationForCustomer(file: File, fileName): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file, fileName);

    const req = new HttpRequest('POST', `${this.baseUrl}upload`, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.http.request(req);
  }

  uploadDirectQuotation(
    file: File,
    date: string = ' ',
    fileName: string = ' '
  ): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file, fileName + '.pdf');

    let url: string = `${this.baseUrl}uploadDirectQuotation/${date}/${fileName}/`;

    let req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.http.request(req);
  }

  //  uploadTest(file: File, fileName, fileExtension): Observable<HttpEvent<any>> {

  //   const formData: FormData = new FormData();

  //   formData.append('file', file, fileName + '.' + fileExtension);

  //   const req = new HttpRequest('POST', `${this.baseUrl}upload`, formData, {
  //     reportProgress: true,
  //     responseType: 'json'
  //   });

  //   return this.http.request(req);
  // }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}files`);
  }
}
