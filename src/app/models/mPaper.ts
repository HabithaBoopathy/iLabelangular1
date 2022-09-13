export class MPaper {
  id: string;
  name: string;
  gsm: number;
  productLength: number;
  productWidth: number;
  rate: number;
  ratePerBoard: number;

  constructor() {
    this.id = null;
    this.name = '';
    this.gsm = null;
    this.productLength = null;
    this.productWidth = null;
    this.rate = null;
    this.ratePerBoard = null;
  }
}
