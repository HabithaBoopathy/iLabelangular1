export class Company {
  id: string;
  name: string;
  email: string;
  alternateEmail: string;
  phone: string;
  gstin: string;
  website: string;
  street1: string;
  street2: string;
  city: string;
  zipCode: string;
  state: string;
  country: string;
  paymentTerms: string;
  shipmentTerms: string;

  //default territory and executive for the company
  //editable for every merchandiser
  territoryId: string;
  executiveId: string;

  merchandiserIds: string[];

  constructor() {
    this.id = '';
    this.name = '';
    this.email = '';
    this.alternateEmail = '';
    this.phone = '';
    this.gstin = '';
    this.website = '';
    this.street1 = '';
    this.street2 = '';
    this.city = '';
    this.zipCode = '';
    this.state = '';
    this.country = '';
    this.paymentTerms = '';
    this.shipmentTerms = '';
    this.territoryId = '';
    this.executiveId = '';
    this.merchandiserIds = [];
  }
}
