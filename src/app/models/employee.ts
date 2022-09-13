export class Employee {
  id: number;
  customername: string;
  companyname: string;
  emailId: string;
  phone: string;
  website: string;
  radio: string;
  street1: string;
  street2: string;
  city: string;
  zipcode: string;
  state: string;
  country: string;
  active: boolean;
  customerreference: string;
  customernum: number;
  paymentTerms: string;
  shipmentTerms: string;
  gstin: string;
  alternateemailId: string;
  executiveName: string;
  executiveCode: string;
  verificationStatus: string;
  // merchandiser: string;
  territory: string;
  customerCategory:string;


  //validation
  isOk: boolean;
  customerEmail: boolean;
  companyId: string;
customerId: string;
  //activeStatus
  ////1 - considered as true, any other values are false
  isDisabled: number;

  constructor() {
    this.id = null;
    this.customername = '';
    this.companyname = '';
    this.emailId = '';
    this.phone = '';
    this.website = '';
    this.radio = '';
    this.street1 = '';
    this.street2 = '';
    this.city = '';
    this.zipcode = '';
    this.state = '';
    this.country = '';
    this.active = false;
    this.customerreference = '';
    this.customernum = null;
    this.paymentTerms = '';
    this.shipmentTerms = '';
    this.gstin = '';
    this.alternateemailId = '';
    this.executiveName = '';
    this.executiveCode = '';
    this.verificationStatus = '';
    this.customerCategory = '';
    // this.merchandiser = '';
    this.isOk = true;
    this.customerEmail = true;
    this.territory = '';
    this.companyId = '';
    //1 - considered as true, any other values are false
    this.isDisabled = null;
  }
}
