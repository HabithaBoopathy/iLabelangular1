import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WovenCosting } from '../model/woven-costing';
import { PrintedCosting } from '../model/printed-costing';
import { CommonDetailsCosting } from '../model/common-details-costing';
import { CostingApprovalDetails } from '../model/costing-approval-details';
import { Configuration } from '../../../../configuration';
import { TagCosting } from '../model/tag-costing';
import { StickerFlexoCosting } from '../model/sticker-flexo-costing';
import { StickerOffsetCosting } from '../model/sticker-offset-costing';
import { Everything } from 'src/app/models/orderForms/Everything';
import { TimeService } from 'src/app/services/time.service';
import { DateFormatter } from 'src/app/utility-classes/date-formatter';
import { Employee } from 'src/app/models/employee';
import { EmployeeService } from 'src/app/services/employee.service';
import { ProductReferenceService } from 'src/app/services/product-reference.service';
import { EverythingService } from 'src/app/services/orderForms/everything.service';

@Injectable({
  providedIn: 'root',
})
export class CostingService {
  baseUrl: string = `${Configuration.apiURL}api/master/costing`;

  constructor(
    private http: HttpClient,
    private timeService: TimeService,
    private customerService: EmployeeService,
    private productService: ProductReferenceService,
    private everythingService: EverythingService
  ) {}

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

  uploadWovenAttachment(
    file: File,
    extension: string,
    date: string,
    refNo: string
  ): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file, refNo + '.' + extension);

    let url: string = `${this.baseUrl}/woven/attachment/${date}/${refNo}/`;

    let req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.http.request(req);
  }

  getWovenAttachmentImage(filename: string): Observable<Blob> {
    return this.http.get<Blob>(
      this.baseUrl + '/woven/getAttachmentImage/' + filename,
      { observe: 'body', responseType: 'blob' as 'json' }
    );
  }

  getWovenAttachmentPdf(filename: string): Observable<Blob> {
    return this.http.get<Blob>(
      this.baseUrl + '/woven/getAttachmentPdf/' + filename,
      { observe: 'body', responseType: 'blob' as 'json' }
    );
  }

  approveWovenByCustomer(costingId: string): Promise<Boolean> {
    return this.http
      .get<Boolean>(`${this.baseUrl}/woven/approveByCustomer/${costingId}`)
      .toPromise();
  }

  rejectWovenByCustomer(costingId: string, reason: string): Promise<Boolean> {
    return this.http
      .put<Boolean>(`${this.baseUrl}/woven/rejectByCustomer/${costingId}`, {
        reason: reason,
      })
      .toPromise();
  }

  createPrinted(printedCosting: PrintedCosting): Observable<PrintedCosting> {
    return this.http.post<PrintedCosting>(
      `${this.baseUrl}/printed/create`,
      printedCosting
    );
  }

  updatePrinted(printedCosting: PrintedCosting): Observable<PrintedCosting> {
    return this.http.put<PrintedCosting>(
      `${this.baseUrl}/printed/update`,
      printedCosting
    );
  }

  getPrintedByid(id: string): Observable<PrintedCosting> {
    return this.http.get<PrintedCosting>(`${this.baseUrl}/printed/id/${id}`);
  }

  uploadPrintedAttachment(
    file: File,
    extension: string,
    date: string,
    refNo: string
  ): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file, refNo + '.' + extension);

    let url: string = `${this.baseUrl}/printed/attachment/${date}/${refNo}/`;

    let req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.http.request(req);
  }

  getPrintedAttachmentImage(filename: string): Observable<Blob> {
    return this.http.get<Blob>(
      this.baseUrl + '/printed/getAttachmentImage/' + filename,
      { observe: 'body', responseType: 'blob' as 'json' }
    );
  }

  getPrintedAttachmentPdf(filename: string): Observable<Blob> {
    return this.http.get<Blob>(
      this.baseUrl + '/printed/getAttachmentPdf/' + filename,
      { observe: 'body', responseType: 'blob' as 'json' }
    );
  }

  approvePrintedByCustomer(costingId: string): Promise<Boolean> {
    return this.http
      .get<Boolean>(`${this.baseUrl}/printed/approveByCustomer/${costingId}`)
      .toPromise();
  }

  rejectPrintedByCustomer(costingId: string, reason: string): Promise<Boolean> {
    return this.http
      .put<Boolean>(`${this.baseUrl}/printed/rejectByCustomer/${costingId}`, {
        reason: reason,
      })
      .toPromise();
  }

  createTag(tagCosting: TagCosting): Observable<TagCosting> {
    return this.http.post<TagCosting>(`${this.baseUrl}/tag/create`, tagCosting);
  }

  updateTag(tagCosting: TagCosting): Observable<TagCosting> {
    return this.http.put<TagCosting>(`${this.baseUrl}/tag/update`, tagCosting);
  }

  getTagByid(id: string): Observable<TagCosting> {
    return this.http.get<TagCosting>(`${this.baseUrl}/tag/id/${id}`);
  }

  uploadTagAttachment(
    file: File,
    extension: string,
    date: string,
    refNo: string
  ): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file, refNo + '.' + extension);

    let url: string = `${this.baseUrl}/tag/attachment/${date}/${refNo}/`;

    let req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.http.request(req);
  }

  getTagAttachmentImage(filename: string): Observable<Blob> {
    return this.http.get<Blob>(
      this.baseUrl + '/tag/getAttachmentImage/' + filename,
      { observe: 'body', responseType: 'blob' as 'json' }
    );
  }

  getTagAttachmentPdf(filename: string): Observable<Blob> {
    return this.http.get<Blob>(
      this.baseUrl + '/tag/getAttachmentPdf/' + filename,
      { observe: 'body', responseType: 'blob' as 'json' }
    );
  }

  approveTagByCustomer(costingId: string): Promise<Boolean> {
    return this.http
      .get<Boolean>(`${this.baseUrl}/tag/approveByCustomer/${costingId}`)
      .toPromise();
  }

  rejectTagByCustomer(costingId: string, reason: string): Promise<Boolean> {
    return this.http
      .put<Boolean>(`${this.baseUrl}/tag/rejectByCustomer/${costingId}`, {
        reason: reason,
      })
      .toPromise();
  }

  createStickerFlexo(
    stickerFlexoCosting: StickerFlexoCosting
  ): Observable<StickerFlexoCosting> {
    return this.http.post<StickerFlexoCosting>(
      `${this.baseUrl}/stickerFlexo/create`,
      stickerFlexoCosting
    );
  }

  updateStickerFlexo(
    stickerFlexoCosting: StickerFlexoCosting
  ): Observable<StickerFlexoCosting> {
    return this.http.put<StickerFlexoCosting>(
      `${this.baseUrl}/stickerFlexo/update`,
      stickerFlexoCosting
    );
  }

  getStickerFlexoByid(id: string): Observable<StickerFlexoCosting> {
    return this.http.get<StickerFlexoCosting>(
      `${this.baseUrl}/stickerFlexo/id/${id}`
    );
  }

  uploadStickerFlexoAttachment(
    file: File,
    extension: string,
    date: string,
    refNo: string
  ): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file, refNo + '.' + extension);

    let url: string = `${this.baseUrl}/stickerFlexo/attachment/${date}/${refNo}/`;

    let req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.http.request(req);
  }

  getStickerFlexoAttachmentImage(filename: string): Observable<Blob> {
    return this.http.get<Blob>(
      this.baseUrl + '/stickerFlexo/getAttachmentImage/' + filename,
      { observe: 'body', responseType: 'blob' as 'json' }
    );
  }

  getStickerFlexoAttachmentPdf(filename: string): Observable<Blob> {
    return this.http.get<Blob>(
      this.baseUrl + '/stickerFlexo/getAttachmentPdf/' + filename,
      { observe: 'body', responseType: 'blob' as 'json' }
    );
  }

  approveStickerFlexoByCustomer(costingId: string): Promise<Boolean> {
    return this.http
      .get<Boolean>(
        `${this.baseUrl}/stickerFlexo/approveByCustomer/${costingId}`
      )
      .toPromise();
  }

  rejectStickerFlexoByCustomer(
    costingId: string,
    reason: string
  ): Promise<Boolean> {
    return this.http
      .put<Boolean>(
        `${this.baseUrl}/stickerFlexo/rejectByCustomer/${costingId}`,
        {
          reason: reason,
        }
      )
      .toPromise();
  }

  createStickerOffset(
    stickerOffsetCosting: StickerOffsetCosting
  ): Observable<StickerOffsetCosting> {
    return this.http.post<StickerOffsetCosting>(
      `${this.baseUrl}/stickerOffset/create`,
      stickerOffsetCosting
    );
  }

  updateStickerOffset(
    stickerOffsetCosting: StickerOffsetCosting
  ): Observable<StickerOffsetCosting> {
    return this.http.put<StickerOffsetCosting>(
      `${this.baseUrl}/stickerOffset/update`,
      stickerOffsetCosting
    );
  }

  getStickerOffsetByid(id: string): Observable<StickerOffsetCosting> {
    return this.http.get<StickerOffsetCosting>(
      `${this.baseUrl}/stickerOffset/id/${id}`
    );
  }

  uploadStickerOffsetAttachment(
    file: File,
    extension: string,
    date: string,
    refNo: string
  ): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file, refNo + '.' + extension);

    let url: string = `${this.baseUrl}/stickerOffset/attachment/${date}/${refNo}/`;

    let req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.http.request(req);
  }

  getStickerOffsetAttachmentImage(filename: string): Observable<Blob> {
    return this.http.get<Blob>(
      this.baseUrl + '/stickerOffset/getAttachmentImage/' + filename,
      { observe: 'body', responseType: 'blob' as 'json' }
    );
  }

  getStickerOffsetAttachmentPdf(filename: string): Observable<Blob> {
    return this.http.get<Blob>(
      this.baseUrl + '/stickerOffset/getAttachmentPdf/' + filename,
      { observe: 'body', responseType: 'blob' as 'json' }
    );
  }

  approveStickerOffsetByCustomer(costingId: string): Promise<Boolean> {
    return this.http
      .get<Boolean>(
        `${this.baseUrl}/stickerOffset/approveByCustomer/${costingId}`
      )
      .toPromise();
  }

  rejectStickerOffsetByCustomer(
    costingId: string,
    reason: string
  ): Promise<Boolean> {
    return this.http
      .put<Boolean>(
        `${this.baseUrl}/stickerOffset/rejectByCustomer/${costingId}`,
        { reason: reason }
      )
      .toPromise();
  }

  createCommonDetails(
    commonDetailsCosting: CommonDetailsCosting
  ): Observable<CommonDetailsCosting> {
    return this.http.post<CommonDetailsCosting>(
      `${this.baseUrl}/commonDetails/create`,
      commonDetailsCosting
    );
  }

  updateCommonDetails(
    commonDetailsCosting: CommonDetailsCosting
  ): Observable<CommonDetailsCosting> {
    return this.http.put<CommonDetailsCosting>(
      `${this.baseUrl}/commonDetails/update`,
      commonDetailsCosting
    );
  }

  getCommonDetailsByTotalDetailsId(
    costingId
  ): Observable<CommonDetailsCosting> {
    return this.http.get<CommonDetailsCosting>(
      `${this.baseUrl}/commonDetails/totalDetails/${costingId}`
    );
  }

  getAllCommonDetails(): Observable<CommonDetailsCosting[]> {
    return this.http.get<CommonDetailsCosting[]>(
      `${this.baseUrl}/commonDetails/all`
    );
  }

  getArchivedCommonDetails(): Observable<CommonDetailsCosting[]> {
    return this.http.get<CommonDetailsCosting[]>(
      `${this.baseUrl}/commonDetails/archived`
    );
  }

  getAllCommonDetailsForTManager(
    userId: string
  ): Observable<CommonDetailsCosting[]> {
    return this.http.get<CommonDetailsCosting[]>(
      `${this.baseUrl}/commonDetails/TManager/${userId}`
    );
  }

  getAllCommonDetailsForSampleHead(
    trimTypes: string[]
  ): Observable<CommonDetailsCosting[]> {
    return this.http.post<CommonDetailsCosting[]>(
      `${this.baseUrl}/commonDetails/sampleHead`,
      trimTypes
    );
  }

  getAllCommonDetailsForExecutive(
    executiveId: string
  ): Observable<CommonDetailsCosting[]> {
    return this.http.get<CommonDetailsCosting[]>(
      `${this.baseUrl}/commonDetails/executive/${executiveId}`
    );
  }

  getAllCommonDetailsForCustomer(
    customerId: string
  ): Observable<CommonDetailsCosting[]> {
    return this.http.get<CommonDetailsCosting[]>(
      `${this.baseUrl}/commonDetails/customer/${customerId}`
    );
  }

  getCommonDetailsWaitingForApproval(): Observable<CommonDetailsCosting[]> {
    return this.http.get<CommonDetailsCosting[]>(
      `${this.baseUrl}/commonDetails/waitingForApproval`
    );
  }

  getCommonDetailsRejectedByCustomer(): Observable<CommonDetailsCosting[]> {
    return this.http.get<CommonDetailsCosting[]>(
      `${this.baseUrl}/commonDetails/rejectedByCustomer`
    );
  }

  archiveToggleCommonDetails(
    commonDetailsCosting: CommonDetailsCosting
  ): Observable<CommonDetailsCosting> {
    return this.http.put<CommonDetailsCosting>(
      `${this.baseUrl}/commonDetails/archive`,
      commonDetailsCosting
    );
  }

  sendCostingApprovalEmail(costingApprovalDetails: CostingApprovalDetails) {
    return this.http.post(
      `${Configuration.apiURL}ilabel/costingApproval`,
      costingApprovalDetails
    );
  }

  sendCostingApprovalEmailForCustomer(
    costingApprovalDetails: CostingApprovalDetails,
    emailId: string
  ) {
    return this.http.post(
      `${Configuration.apiURL}ilabel/costingApprovalForCustomer/${emailId}`,
      costingApprovalDetails
    );
  }

  sendCostingApprovedorRejectedMail(
    costingApprovalDetails: CostingApprovalDetails,
    emailId: string,
    approveFlag: boolean
  ) {
    return this.http
      .post(
        `${Configuration.apiURL}ilabel/costingApprovedMail/${emailId}/${approveFlag}/`,
        costingApprovalDetails
      )
      .toPromise();
  }

  copyAttachment(date: string, fileName1: string, fileName2: string) {
    return this.http.get(
      `${Configuration.apiURL}api/master/costing/commonDetails/copyAttachment/${date}/${fileName1}/${fileName2}`
    );
  }

  async createDraftOrderWoven(costingId: string) {
    try {
      let iso = await this.timeService.getCurrentDateTimeISO_UTC().toPromise();
      let serverDate = new Date(iso);
      let res = await this.http
        .post(
          `${
            this.baseUrl
          }/woven/createDraftOrder/${costingId}/${DateFormatter.getDate_ddMMyyyy(
            serverDate
          )}/`,
          {   
            wovencolorname: '',
            wovenreferencenumber: '',
            wovenNum: null,
            wovennext: null,
          }
        )
        .toPromise();
      if (res) {
        return 1;
      } else {
        console.log(res);
        return 0;
      }
    } catch (e) {
      console.log(e);
      return e;
    }
  }
  async createDraftCostingWoven(orderId: string) {
    try {
      let iso = await this.timeService.getCurrentDateTimeISO_UTC().toPromise();
      let serverDate = new Date(iso);
      let res = await this.http
        .post(
          `${
            this.baseUrl
          }/woven/createDraftCosting/${orderId}/${DateFormatter.getDate_ddMMyyyy(
            serverDate
          )}/`,
          {   
            wovencolorname: '',
            wovenreferencenumber: '',
            wovenNum: null,
            wovennext: null,
          }
        )
        .toPromise();
      if (res) {
        return 1;
      } else {
        console.log(res);
        return 0;
      }
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async createDraftOrderPrinted(costingId: string) {
    try {
      let iso = await this.timeService.getCurrentDateTimeISO_UTC().toPromise();
      let serverDate = new Date(iso);
      let res = await this.http
        .post(
          `${
            this.baseUrl
          }/printed/createDraftOrder/${costingId}/${DateFormatter.getDate_ddMMyyyy(
            serverDate
          )}/`,
          {
            printcolorname: '',
            printreferencenumber: '',
            printNum: null,
            printnext: null,
          }
        )
        .toPromise();
      if (res) {
        return 1;
      } else {
        console.log(res);
        return 0;
      }
    } catch (e) {
      console.log(e);
      return e;
    }
  }
  
  async createDraftOrderTag(costingId: string) {
    try {
      let iso = await this.timeService.getCurrentDateTimeISO_UTC().toPromise();
      let serverDate = new Date(iso);
      let res = await this.http
        .post(
          `${
            this.baseUrl
          }/tag/createDraftOrder/${costingId}/${DateFormatter.getDate_ddMMyyyy(
            serverDate
          )}/`,
          {
            tagcolorname: '',
            tagreferencenumber: '',
            tagNum: null,
            tagnext: null,
          }
        )
        .toPromise();
      if (res) {
        return 1;
      } else {
        console.log(res);
        return 0;
      }
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async createDraftOrderStickerFlexo(costingId: string) {
    try {
      let iso = await this.timeService.getCurrentDateTimeISO_UTC().toPromise();
      let serverDate = new Date(iso);
      let res = await this.http
        .post(
          `${
            this.baseUrl
          }/stickerFlexo/createDraftOrder/${costingId}/${DateFormatter.getDate_ddMMyyyy(
            serverDate
          )}/`,
          {
            stickercolorname: '',
            stickerreferencenumber: '',
            stickerNum: null,
            stickernext: null,
          }
        )
        .toPromise();
      if (res) {
        return 1;
      } else {
        console.log(res);
        return 0;
      }
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async createDraftOrderStickerOffset(costingId: string) {
    try {
      let iso = await this.timeService.getCurrentDateTimeISO_UTC().toPromise();
      let serverDate = new Date(iso);
      let res = await this.http
        .post(
          `${
            this.baseUrl
          }/stickerOffset/createDraftOrder/${costingId}/${DateFormatter.getDate_ddMMyyyy(
            serverDate
          )}/`,
          {
            stickercolorname: '',
            stickerreferencenumber: '',
            stickerNum: null,
            stickernext: null,
          }
        )
        .toPromise();
      if (res) {
        return 1;
      } else {
        console.log(res);
        return 0;
      }
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}
