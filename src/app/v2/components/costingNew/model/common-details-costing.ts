export class CommonDetailsCosting {
  id: string;
  totalDetailsId: string;
  refNo: string;
  entryDate: string;
  productName: string;
  customerId: string;
  customerName: string;
  trimType: string;
  orderQuantity: number;
  status: number;
  archived: boolean;
  executiveId: string;

  constructor() {
    this.id = null;
    this.totalDetailsId = '';
    this.refNo = '';
    this.entryDate = '';
    this.productName = '';
    this.customerId = '';
    this.customerName = '';
    this.trimType = 'Woven';
    this.orderQuantity = 0;
    this.status = 0;
    this.archived = false;
    this.executiveId = '';
  }
}
