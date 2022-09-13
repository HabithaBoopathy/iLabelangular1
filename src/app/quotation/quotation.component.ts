import { DatePipe } from '@angular/common';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee';
import { QuotationForm2 } from '../models/QuotationForm2';
import { Upload } from '../models/upload';
import { QuotationService } from '../services/orderForms/quotation.service';
import { QuotationReferenceNumberService } from '../services/quotation-reference-number.service';
import { UploadFileService } from '../services/upload-file.service';
import { EmployeeService } from './../services/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuotationFormBatch } from '../models/QuotationFormBatch';
import { Configuration } from '../configuration';
import { DateFormatter } from '../utility-classes/date-formatter';

@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.css'],
})
export class QuotationComponent implements OnInit {
  //Quotation object
  quotation2: QuotationForm2;
  //Line item object
  quotationFormBatch: QuotationFormBatch;

  // Customers list
  customers: Employee[];

  dateFormatter: DateFormatter;

  dataset: Details = {
    quotationReferenceNumber: '',
    customerName: '',
    pageURL: '',
    email: '',
    quotationAttachmentName: '',
  };

  progressValue: number = 0;
  @ViewChild('loadingModalTemplate') loadingModalTemplate: TemplateRef<any>;

  public showBeforeSave: boolean = true;
  public showAfterSave: boolean = false;

  public hsn: string = '';
  public editIndex: number;

  constructor(
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private https: HttpClient,
    private uploadService: UploadFileService,
    private employeeService: EmployeeService,
    private http: HttpClient,
    private quotationService: QuotationService,
    private quotationReferenceService: QuotationReferenceNumberService,
    private modalService: NgbModal,
    private router: Router
  ) {
    //initializing objects
    this.quotation2 = new QuotationForm2();
    this.quotationFormBatch = new QuotationFormBatch();

    // this.quotation.date = this.myDate;
    this.quotation2.date = DateFormatter.getDate_yyyyMMdd();

    this.dateFormatter = new DateFormatter();
  }

  ngOnInit() {
    this.fetchCustomers();
    // this.showReferenceNumber();

    this.id = this.route.snapshot.params['id'];

    if (this.id != undefined) {
      // this.showQuotationFormDisplay = true;
      // this.checkTrimType();
      // this.makeFieldsReadOnly = true;

      // this.quotation2.itemAndDescription = undefined;

      this.quotationService.getQuotation(this.id).subscribe(
        (data: QuotationForm2) => {
          this.quotation2 = data;
          this.hsn = data.lineitem[0].hsn;
          // if(this.id != undefined)
          // {
          //   this.checkLastLineItem();
          // }
          // this.showBeforeSave = false;
          // this.showAfterSave = true;
        },
        (error) => console.log(error)
      );
    }
  }

  ngAfterViewInit() {
    // Scrolls to top of Page after page view initializion
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  fetchCustomers() {
    this.employeeService.getActiveCustomers().subscribe(
      (data) => {
        this.customers = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getCustomerDetails() {
    this.employeeService
      .getCustomerById(this.quotation2.customerID)
      .subscribe((data: Employee) => {
        this.quotation2.customerName = data.companyname;
        this.quotation2.customerStreet1 = data.street1;
        this.quotation2.customerStreet2 = data.street2;
        this.quotation2.customerCity = data.city;
        this.quotation2.customerState = data.state;
        this.quotation2.customerGst = data.gstin;
        this.quotation2.customerEmail = data.emailId;
      });
  }

  setRefNoAndHsn() {
    //the final seq no will be set in spring boot
    this.quotation2.quotationReferenceNumber = `DQ${this.quotation2.trimType}`;
    if (this.quotation2.trimType === 'WOVEN') {
      this.hsn = '58071010';
    } else if (this.quotation2.trimType === 'TAG') {
      this.hsn = '48211010';
    } else if (this.quotation2.trimType === 'STICKER') {
      this.hsn = '48114100';
    } else if (this.quotation2.trimType === 'PRINTED') {
      this.hsn = '58071010';
    }
  }

  isQuotationFormBatchEmpty(): boolean {
    return Object.values(this.quotationFormBatch).some((x) => {
      if (this.isEmptyString(x)) {
        return true;
      }
      return false;
    });
  }

  addLineItem() {
    if (this.isEmptyString(this.quotation2.customerID)) {
      this.showSnackMessage('Please select the customer');
    } else if (this.isEmptyString(this.hsn)) {
      this.showSnackMessage('Please select the trim type');
    } else {
      this.quotationFormBatch.hsn = this.hsn;
      if (this.isQuotationFormBatchEmpty()) {
        this.showSnackMessage(
          'Please fill all the line item details before proceeding further'
        );
      } else {
        this.quotation2.lineitem.push({ ...this.quotationFormBatch });
        this.quotationFormBatch = new QuotationFormBatch();
      }
    }
  }

  openPdfPreview(pdfModal) {
    this.modalService
      .open(pdfModal, {
        backdrop: 'static',
        size: 'xl',
        centered: true,
        ariaLabelledBy: 'modal-basic-title',
      })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  editLineItem(i: number, modalReference) {
    this.editIndex = i;
    this.quotationFormBatch = { ...this.quotation2.lineitem[i] };
    this.openlineItemUpdateModal(modalReference);
  }

  // Line Item Update Modal
  openlineItemUpdateModal(modalReference) {
    this.modalService
      .open(modalReference, {
        backdrop: 'static',
        size: 'sm',
        centered: true,
        ariaLabelledBy: 'modal-basic-title',
      })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  updateLineItem() {
    if (this.isQuotationFormBatchEmpty()) {
      this.showSnackMessage(
        'Please fill all the details before proceeding further'
      );
    } else {
      this.quotation2.lineitem[this.editIndex] = { ...this.quotationFormBatch };
      this.quotationFormBatch = new QuotationFormBatch();
    }
  }

  deleteLineItem(i: number) {
    this.quotation2.lineitem.splice(i, 1);
  }

  isEmptyString(val: string): boolean {
    return val == '' || val == null || val == undefined;
  }

  validateQuotation(): boolean {
    let flag = false;
    if (this.isEmptyString(this.quotation2.customerID)) {
      this.showSnackMessage('Please select the customer');
    } else if (
      this.isEmptyString(this.quotation2.trimType) ||
      this.isEmptyString(this.quotation2.quotationReferenceNumber)
    ) {
      //on selecting trimtype we are initializing refNo and HSN
      this.showSnackMessage('Please select the trim type');
    } else if (this.quotation2.lineitem.length < 1) {
      this.showSnackMessage('Please add atleast one line item');
    } else {
      flag = true;
    }
    return flag;
  }

  save() {
    this.quotationService.addQuotation(this.quotation2).subscribe(
      (data: QuotationForm2) => {
        console.log('Saved Successfully');
        console.log(data);
        this.showSnackSuccess('Order Saved Successfully');
        this.quotation2 = new QuotationForm2();
        this.quotationFormBatch = new QuotationFormBatch();
        this.router.navigate(['/home/quotationorders']);
      },
      (error) => console.log(error)
    );
  }

  // Save
  onSubmitEverything() {
    if (this.validateQuotation()) {
      this.save();
    }
  }

  saveSendForCustomerAcceptanceMasterFunction() {
    // this.showSpinner()
    this.openLoadingModal();
    if (this.validateQuotation()) {
      this.sendForCustomerAcceptancePDFDownload();
    } else {
      this.closeLoadingModalTemplate();
    }
  }

  sendForCustomerAcceptancePDFDownload() {
    // increase progress
    this.progressValue = 10;

    //create first image
    const quote = document.getElementById('quote');
    const options = {
      background: 'white',
      scale: 2,
    };

    html2canvas(quote, options)
      .then((canvas) => {
        var img = canvas.toDataURL('image/PNG');
        var doc = new jsPDF('portrait', 'mm', 'a4', true);

        // Add image Canvas to PDF
        const bufferX = 5;
        const bufferY = 5;
        const imgProps = (<any>doc).getImageProperties(img);
        // const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        //Experimental
        var imgData = canvas.toDataURL('image/png');
        var imgWidth = 210;
        var pageHeight = 295;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        var heightLeft = imgHeight;
        // Commented for Size issues
        // var doc = new jsPDF('p', 'mm');
        var position = 0;

        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        //Experimental
        // doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 1);

        return doc;
      })

      .then((doc) => {
        // doc.save("Quotation.pdf");

        var blobPDF = new Blob([doc.output('blob')], {
          type: 'application/pdf',
        });
        var blobUrl = URL.createObjectURL(blobPDF);
        // window.open(blobUrl);

        this.hideUpload(blobPDF);
      });
  }

  hideUpload(blob: any) {
    // increase progress
    this.progressValue = 20;
    this.progress = 0;

    this.currentFile1 = blob;

    //insert the quotation form first, then upload the pdf file, attach and send mail
    this.quotationService.addQuotation(this.quotation2).subscribe(
      (data: QuotationForm2) => {
        // increase progress
        this.progressValue = 50;

        this.quotationFormID = data.id;
        this.tempURL = `${Configuration.domainURL}home/uforms/${data.id}`;

        //upload pdf file
        //name for server upload purpose
        this.fileName = data.quotationReferenceNumber + '.pdf';
        //inserted reference number is fetched
        this.quotation2.quotationReferenceNumber =
          data.quotationReferenceNumber;

        this.uploadService
          .uploadDirectQuotation(
            this.currentFile1,
            this.dateFormatter.convertDateToDDMMYYYY(this.quotation2.date),
            this.quotation2.quotationReferenceNumber
          )
          .subscribe(
            (event) => {
              if (event.type === HttpEventType.UploadProgress) {
                this.progress = Math.round((100 * event.loaded) / event.total);
              } else if (event instanceof HttpResponse) {
                // increase progress
                this.progressValue = 70;

                this.message = event.body.message;
                this.latestName = event.body.latestName;
                this.fileInfos = this.uploadService.getFiles();

                this.sendCustomerEmailWithAttachment();
              }
            },
            (err) => {
              this.closeLoadingModalTemplate();
              this.progress = 0;
              this.message = 'Could not upload the file!';
              this.currentFile1 = undefined;
              this.showSnackMessage('Upload failed. Please try again');
            }
          );
      },
      (error) => {
        console.log(error);
        this.closeLoadingModalTemplate();
        this.showSnackMessage('Insert failed. Please try again');
      }
    );

    this.selectedFiles = undefined;
  }

  sendCustomerEmailWithAttachment() {
    // this.getPageURL();

    this.dataset.email = this.quotation2.customerEmail;
    this.dataset.customerName = this.quotation2.customerName;
    this.dataset.quotationReferenceNumber =
      this.quotation2.quotationReferenceNumber;

    console.log('sending mail');
    console.log(this.dataset);

    let dateArr = this.quotation2.date.split('-');
    let localPath =
      dateArr[0] +
      '---' +
      dateArr[1] +
      '---' +
      dateArr[2] +
      '---DirectQuotation---' +
      this.quotation2.quotationReferenceNumber +
      '---' +
      this.quotation2.quotationReferenceNumber +
      '.pdf';

    this.https
      .post<Details>(
        `${Configuration.apiURL}ilabel/quotationformattachment/${localPath}/`,
        this.dataset
      )
      .subscribe(
        (res) => {
          // increase progress
          this.progressValue = 100;
          this.closeLoadingModalTemplate();
          this.dataset = res;
          console.log(this.dataset);
          this.showSnackSuccess('Order Updated Successfully');
          setTimeout(() => {
            this.showSnackSuccess('Email Sent successfully');
          }, 1000);

          this.reloadData();

          this.dataset.customerName = '';
          this.dataset.quotationReferenceNumber = '';
          this.dataset.email = '';
          this.dataset.pageURL = '';
          this.dataset.quotationAttachmentName = '';

          this.router.navigate(['/home/quotationorders']);
        },
        (error) => {
          this.closeLoadingModalTemplate();
          alert(
            'Server Data Error from Send Customer E-mail With Attachment :: ' +
              JSON.stringify(error.status)
          );
        }
      );
  }

  spinnerDisplay = 'none';
  contentDisplay = 'inline';

  showSpinner() {
    this.spinnerDisplay = 'inline';
    this.contentDisplay = 'none';
  }
  hideSpinner() {
    this.spinnerDisplay = 'none';
    this.contentDisplay = 'inline';
  }

  closeLoadingModalTemplate() {
    document.getElementById('closeLoadingModal').click();
    console.log('loading modal closed');
    this.progressValue = 0;
  }

  openLoadingModal() {
    this.modalService
      .open(this.loadingModalTemplate, {
        backdrop: 'static',
        size: 'lg',
        centered: true,
        ariaLabelledBy: 'modal-basic-title',
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  back() {
    this.router.navigate(['/home/quotationorders']);
  }

  jValue: number = 0;
  tempQuotationID: number;
  description1: string;

  closeResult = '';

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  trimType: string;
  quotationReferenceNumber: string;
  refNumber: number;
  nextRefNumber: number;

  saveQuotationReferenceNumber() {
    this.http
      .post(`${Configuration.apiURL}api/quotationreference`, {
        trimType: this.trimType,
        quotationReferenceNumber: this.quotationReferenceNumber,
        refNumber: this.refNumber,
        nextRefNumber: this.nextRefNumber,
      })
      .toPromise()
      .then(() => {});
  }

  showSnackMessage(message: string) {
    this._snackBar.open(message, '', {
      duration: 2000,
      panelClass: ['snackbar1'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  showSnackSuccess(message: string) {
    this._snackBar.open(message, '', {
      duration: 2000,
      panelClass: ['snackbar3'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  printMax: number;
  wovenMax: number;
  stickerMax: number;
  tagMax: number;

  printNum: number = 0;
  tagNum: number = 0;
  stickerNum: number = 0;
  wovenNum: number = 0;

  public wovenTrimType: boolean = false;
  public tagTrimType: boolean = false;
  public stickerTrimType: boolean = false;
  public printedTrimType: boolean = false;

  reloadData() {}

  resetForm() {
    this.quotation2 = new QuotationForm2();
  }

  //Delete
  deleteMcolor(id: number) {
    this.quotationService.deleteQuotation(id).subscribe(
      (data) => {
        console.log(data);
        this.reloadData();
      },
      (error) => console.log(error)
    );
  }

  public setToReadOnly: boolean = false;

  // Quotation PDF
  quotationPDF() {
    //create first image

    const quoteModal = document.getElementById('quoteModal');
    const options = {
      background: 'white',
      scale: 2,
    };

    html2canvas(quoteModal, options)
      .then((canvas) => {
        var img = canvas.toDataURL('image/PNG');
        var doc = new jsPDF('portrait', 'mm', 'a4', true);

        // Add image Canvas to PDF
        const bufferX = 5;
        const bufferY = 5;
        const imgProps = (<any>doc).getImageProperties(img);
        // const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        //Experimental
        var imgData = canvas.toDataURL('image/png');
        var imgWidth = 210;
        var pageHeight = 295;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        var heightLeft = imgHeight;
        // Commented for Size issues
        // var doc = new jsPDF('p', 'mm');
        var position = 0;

        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        //Experimental

        // doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 1);

        return doc;
      })

      .then((doc) => {
        doc.save(this.quotation2.quotationReferenceNumber);
      });
  }

  anotherTempVariable: string;

  sendID(id: string) {
    this.anotherTempVariable = id;
  }

  public showQuotationFormDisplay: boolean = false;
  public makeFieldsReadOnly: boolean = false;
  id: number;

  companyName: string;

  companyNameGetter: string;

  quotationCustomerEmail: string;

  showReferenceNumber() {
    this.quotationReferenceService
      .getQuotationReferenceList()
      .subscribe((data) => {
        // this.quotationRefrence = data;
        var parsedinfo = JSON.parse(JSON.stringify(data));

        this.printMax = Math.max.apply(
          Math,
          parsedinfo.map(function (o) {
            return o.refNumber;
          })
        );
        this.tagMax = Math.max.apply(
          Math,
          parsedinfo.map(function (o) {
            return o.refNumber;
          })
        );
        this.stickerMax = Math.max.apply(
          Math,
          parsedinfo.map(function (o) {
            return o.refNumber;
          })
        );
        this.wovenMax = Math.max.apply(
          Math,
          parsedinfo.map(function (o) {
            return o.refNumber;
          })
        );

        if (this.wovenMax == -Infinity) {
          this.wovenMax = 0;
        }
        if (this.tagMax == -Infinity) {
          this.tagMax = 0;
        }
        if (this.printMax == -Infinity) {
          this.printMax = 0;
        }
        if (this.stickerMax == -Infinity) {
          this.stickerMax = 0;
        }
      });
  }

  // Download as PDF

  // Upload PDF
  fileName: string;
  fileExtension: string;

  progress = 0;
  message = '';
  latestName = '';

  selectedFiles: FileList;
  currentFile1: File;

  uploadedFileNameObservable: Observable<Upload[]>;
  uploadedFileName: Upload = new Upload();

  fileInfos: Observable<any>;

  iValue: number = 0;
  nameStorage = [];

  quotationFormID;
  tempURL;

  getPageURL() {
    this.dataset.pageURL = `${Configuration.domainURL}home/uforms/${this.quotationFormID}`;
  }
}

interface Details {
  quotationReferenceNumber: string;
  customerName: string;
  pageURL: string;
  email: string;
  quotationAttachmentName: string;
}
