import { GlobalSearchInput } from './GlobalSearchInput';
export class PaginationInput {
  trimType: String[];
  transactionStatus: String[];
  territoryId: String[];
  sort: String;
  page: Number;
  size: Number;
  executiveCode: String;
  customerEmail: String;
  status: String;
  globalSearchInput: GlobalSearchInput;

  constructor() {
    this.trimType = [];
    this.transactionStatus = [];
    this.territoryId = [];
    this.sort = 'desc';
    this.page = 0;
    this.size = 10;
    this.executiveCode = '';
    this.customerEmail = '';
    this.status = 'active';
    this.globalSearchInput = new GlobalSearchInput();
  }
}
