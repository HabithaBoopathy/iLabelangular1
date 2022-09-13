import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { productReferenceTS } from './../models/productReference';
import { ProductReferenceService } from '../services/product-reference.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { Configuration } from '../configuration';

@Component({
  selector: 'app-m-productreference',
  templateUrl: './m-productreference.component.html',
  styleUrls: ['./m-productreference.component.css'],
})
export class MProductreferenceComponent implements OnInit {
  createRoute() {
    this._location.back();
  }

  id: number;

  productReferenceObservable: Observable<productReferenceTS[]>;

  form: FormGroup;
  productReference: productReferenceTS = new productReferenceTS();
  submitted = false;

  printcolorname: string = 'Printed';
  tagcolorname: string = 'Tag';
  stickercolorname: string = 'Sticker';
  wovencolorname: string = 'Woven';

  printreferencenumber: string;
  tagreferencenumber: string;
  stickerreferencenumber: string;
  wovenreferencenumber: string;

  printNum: number = 0;
  tagNum: number = 0;
  stickerNum: number = 0;
  wovenNum: number = 0;

  samplename: string;

  printmax: number = 0;
  tagmax: number = 0;
  stickermax: number = 0;
  wovenmax: number = 0;

  printnext: number = 0;
  tagnext: number = 0;
  stickernext: number = 0;
  wovennext: number = 0;

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private theProductService: ProductReferenceService,
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location
  ) {}

  refLogic(
    printNum: number,
    tagNum: number,
    stickerNum: number,
    wovenNum: number
  ) {
    if (this.samplename === 'Printed') {
      printNum += 1;
      this.printreferencenumber = 'PFL00' + printNum;
      this.printpostData(printNum);
    } else if (this.samplename === 'Tag') {
      tagNum += 1;
      this.tagreferencenumber = 'TAG00' + tagNum;
      this.tagpostData(tagNum);
    } else if (this.samplename === 'Sticker') {
      stickerNum += 1;
      this.stickerreferencenumber = 'ST00' + stickerNum;
      this.stickerpostData(stickerNum);
    } else if (this.samplename === 'Woven') {
      wovenNum += 1;
      this.wovenreferencenumber = 'WOV00' + wovenNum;
      this.wovenpostData(wovenNum);
    } else {
      console.log('Invalid Transaction Number');
    }

    this.reloadData();
  }

  printpostData(printNum: number) {
    //PRINTED

    this.printnext = printNum + 1;

    this.http
      .post(`${Configuration.apiURL}api/master/productreference`, {
        printcolorname: this.printcolorname,

        printreferencenumber: this.printreferencenumber,

        printNum,

        printnext: this.printnext,
      })
      .toPromise()
      .then((data: any) => {
        this.reloadData();
      });
  }

  tagpostData(tagNum: number) {
    this.tagnext = tagNum + 1;

    this.http
      .post(`${Configuration.apiURL}api/master/productreference`, {
        tagcolorname: this.tagcolorname,

        tagreferencenumber: this.tagreferencenumber,

        tagNum,

        tagnext: this.tagnext,
      })
      .toPromise()
      .then((data: any) => {
        this.reloadData();
      });
  }

  stickerpostData(stickerNum: number) {
    this.stickernext = stickerNum + 1;

    this.http
      .post(`${Configuration.apiURL}api/master/productreference`, {
        stickercolorname: this.stickercolorname,

        stickerreferencenumber: this.stickerreferencenumber,

        stickerNum,

        stickernext: this.stickernext,
      })
      .toPromise()
      .then((data: any) => {
        this.reloadData();
      });
  }

  wovenpostData(wovenNum: number) {
    this.wovennext = wovenNum + 1;

    this.http
      .post(`${Configuration.apiURL}api/master/productreference`, {
        wovencolorname: this.wovencolorname,

        wovenreferencenumber: this.wovenreferencenumber,

        wovenNum,

        wovennext: this.wovennext,
      })
      .toPromise()
      .then((data: any) => {
        this.reloadData();
      });
  }

  postAgainData() {
    this.handleLogin();
  }

  handleLogin() {
    this.theProductService.getProductReferenceList().subscribe((data) => {
      this.productReference = data;
      var parsedinfo = JSON.parse(JSON.stringify(data));

      this.printmax = Math.max.apply(
        Math,
        parsedinfo.map(function (o) {
          return o.printNum;
        })
      );
      this.tagmax = Math.max.apply(
        Math,
        parsedinfo.map(function (o) {
          return o.tagNum;
        })
      );
      this.stickermax = Math.max.apply(
        Math,
        parsedinfo.map(function (o) {
          return o.stickerNum;
        })
      );
      this.wovenmax = Math.max.apply(
        Math,
        parsedinfo.map(function (o) {
          return o.wovenNum;
        })
      );

      if (
        this.printmax === -Infinity ||
        this.tagmax === -Infinity ||
        this.stickermax === -Infinity ||
        this.wovenmax === -Infinity
      ) {
        this.printmax = 0;
        this.tagmax = 0;
        this.stickermax = 0;
        this.wovenmax = 0;
      }

      this.printNum = this.printmax;
      this.tagNum = this.tagmax;
      this.stickerNum = this.stickermax;
      this.wovenNum = this.wovenmax;

      this.refLogic(this.printNum, this.tagNum, this.stickerNum, this.wovenNum);
    });
  }

  reloadData() {
    this.productReferenceObservable =
      this.theProductService.getProductReferenceList();
  }

  resetForm() {
    this.productReference = new productReferenceTS();
  }

  ngOnInit() {
    this.reloadData();

    this.theProductService.getProductReferenceList().subscribe((data) => {
      this.productReference = data;
      var parsedinfo = JSON.parse(JSON.stringify(data));

      this.printmax = Math.max.apply(
        Math,
        parsedinfo.map(function (o) {
          return o.printNum;
        })
      );
      this.tagmax = Math.max.apply(
        Math,
        parsedinfo.map(function (o) {
          return o.tagNum;
        })
      );
      this.stickermax = Math.max.apply(
        Math,
        parsedinfo.map(function (o) {
          return o.stickerNum;
        })
      );
      this.wovenmax = Math.max.apply(
        Math,
        parsedinfo.map(function (o) {
          return o.wovenNum;
        })
      );

      if (
        this.printmax === -Infinity ||
        this.tagmax === -Infinity ||
        this.stickermax === -Infinity ||
        this.wovenmax === -Infinity
      ) {
        this.printmax = 0;
        this.tagmax = 0;
        this.stickermax = 0;
        this.wovenmax = 0;
      }

      this.printreferencenumber = 'PFL00' + this.printmax;
      this.tagreferencenumber = 'TAG00' + this.tagmax;
      this.stickerreferencenumber = 'ST00' + this.stickermax;
      this.wovenreferencenumber = 'WOV00' + this.wovenmax;

      this.printnext = this.printmax + 1;
      this.tagnext = this.tagmax + 1;
      this.stickernext = this.stickermax + 1;
      this.wovennext = this.wovenmax + 1;

      if (
        this.printnext === -Infinity ||
        this.tagmax === -Infinity ||
        this.stickermax === -Infinity ||
        this.wovenmax === -Infinity
      ) {
        this.printnext = 1;
        this.tagnext = 1;
        this.stickernext = 1;
        this.wovennext = 1;
      }
    });
  }
}
