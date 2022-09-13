export class QuotationFormBatch{
  public itemAndDescription: string;
  public hsn: string;
  public quantity: string;
  public rate: string;

  constructor(){
    this.itemAndDescription = "";
    this.hsn = "";
    this.quantity = "";
    this.rate = "";
  }
}
