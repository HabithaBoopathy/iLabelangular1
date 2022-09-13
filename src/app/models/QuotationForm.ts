export class QuotationForm {

    // Customer Details
    customerStreet1: string
    customerStreet2: string
    customerCity: string
    customerState: string
    customerGst: string
    customerEmail: string

    //Quotation Reference Number
    quotationReferenceNumber: string;

    // Quotation Upload
    quotationUpload: string;

    //Quotation Form Details
    id: string
    itemAndDescription: string
    hsn: string
    quantity: string
    rate: string
    termsAndConditions: string

    // Line Item
    lineitem: Batch[] = [
      {quotationId:0, itemAndDescription: '', hsn:'',quantity: '',rate: '', termsAndConditions: ''},
      {quotationId:0, itemAndDescription: '', hsn:'',quantity: '',rate: '', termsAndConditions: ''},
      {quotationId:0, itemAndDescription: '', hsn:'',quantity: '',rate: '', termsAndConditions: ''},
      {quotationId:0, itemAndDescription: '', hsn:'',quantity: '',rate: '', termsAndConditions: ''},
      {quotationId:0, itemAndDescription: '', hsn:'',quantity: '',rate: '', termsAndConditions: ''},
      {quotationId:0, itemAndDescription: '', hsn:'',quantity: '',rate: '', termsAndConditions: ''},
      {quotationId:0, itemAndDescription: '', hsn:'',quantity: '',rate: '', termsAndConditions: ''},
      {quotationId:0, itemAndDescription: '', hsn:'',quantity: '',rate: '', termsAndConditions: ''},
      {quotationId:0, itemAndDescription: '', hsn:'',quantity: '',rate: '', termsAndConditions: ''},
    ];

    // Common
    date: Date
    name: string

    //Trim Type
    trimType: string

}

// Line Item Interface
export interface Batch{​​​​​​​​
  quotationId: number;
  itemAndDescription:string;
  hsn:string;
  quantity:string;
  rate:string;
  termsAndConditions:string;
}​​​​​​​​
