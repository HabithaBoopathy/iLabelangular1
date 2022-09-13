import { SlabRates } from './slab-rates';
export class CostingApprovalDetails {
  entryDate: string;
  trimType: string;
  refNo: string;
  productName: string;
  customerName: string;
  productLength: string;
  productWidth: string;
  paymentTerms: string;
  approvalLink: string;
  slabRates: SlabRates[];

  constructor() {
    this.entryDate = '';
    this.trimType = '';
    this.refNo = '';
    this.productName = '';
    this.customerName = '';
    this.productLength = '';
    this.productWidth = '';
    this.paymentTerms = '';
    this.approvalLink = '';
    this.slabRates = [];
  }
}
