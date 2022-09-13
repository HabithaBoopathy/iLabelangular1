export class Merchandiser {
  id: string;
  name: string;
  email: string;
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

  //default territory and executive Id from company master is fetched for these fields
  //In here, they are editable for every merchandiser
  territoryId: string;
  executiveId: string;

  //email subscription flag
  customerEmail: boolean;

  //email verification
  verificationStatus: string;

  //relationship vars
  companyId: string;

  constructor() {
    this.id = '';
    this.name = '';
    this.email = '';
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
    this.customerEmail = true;
    this.verificationStatus = '';
    this.companyId = '';
  }
}
