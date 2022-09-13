import { QuotationFormBatch } from './QuotationFormBatch';

export class QuotationForm2 {
  //QuotationId - Auto generated Mongo ID
  id: string;

  //Quotation Reference Number - Manually generated ID
  quotationReferenceNumber: string;

  // date string in YYYY-MM-DD
  date: string;

  // Customer Details
  customerID: string;
  customerName: string;
  customerStreet1: string;
  customerStreet2: string;
  customerCity: string;
  customerState: string;
  customerGst: string;
  customerEmail: string;

  //Trim Type
  trimType: string;

  // Quotation Upload
  quotationUpload: string;

  // Line Item
  lineitem: QuotationFormBatch[];

  constructor() {
    this.id = null;
    this.quotationReferenceNumber = '';
    this.date = '';
    this.customerID = '';
    this.customerName = '';
    this.customerStreet1 = '';
    this.customerStreet2 = '';
    this.customerCity = '';
    this.customerState = '';
    this.customerGst = '';
    this.customerEmail = '';
    this.trimType = '';
    this.quotationUpload = '';
    this.lineitem = [];
  }
}
