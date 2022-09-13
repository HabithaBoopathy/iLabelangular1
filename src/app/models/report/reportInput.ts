export class ReportInput{

  startDate: string;
  endDate: string;
  trimType: String[];
  transactionStatus: String[];
  territory: String[];
  sort: number

  constructor(){
    this.startDate = ""
    this.endDate = ""
    this.trimType = [];
    this.transactionStatus = [];
    this.territory = [];
    this.sort = 1
  }
}
