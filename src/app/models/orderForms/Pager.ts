export class Pager{
  activePage: number;
  totalPages: number;
  totalResults: number;
  pagesToDisplay: number[];
  startPage: number;
  endPage: number;

  constructor(){
    this.activePage = null;
    this.totalPages = null;
    this.totalResults = null;
    this.pagesToDisplay = [];
    this.startPage = null;
    this.endPage = null;

  }
}
