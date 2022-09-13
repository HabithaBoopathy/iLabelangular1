import { Component, OnInit } from '@angular/core';
import { SubStrateCosting } from '../models/costing/substrateCosting';
import { Everything } from '../models/orderForms/Everything';
import { EverythingService } from '../services/orderForms/everything.service';
import { SnackBarService } from '../services/snackBar.service';

@Component({
  selector: 'app-testcomponent',
  templateUrl: './testcomponent.component.html',
  styleUrls: ['./testcomponent.component.css'],
})
export class TestcomponentComponent implements OnInit {
  //dataModel
  substrateCosting: SubStrateCosting;

  //orderId
  costingOrderId = '';

  //orderDetails
  order: Everything;

  constructor(
    private everythingService: EverythingService,
    private snackBarService: SnackBarService
  ) {
    this.substrateCosting = new SubStrateCosting();
    let id = prompt('Enter the Order No: ');
    if (id == '' || id == undefined || id == null) {
      // alert('Invalid Order No entered. Using the predefined demo order id');
      this.costingOrderId = '61a8a74d2b5d8e16adaa78d3';
    } else {
      this.costingOrderId = id;
    }
  }

  ngOnInit(): void {
    this.fetchOrderDetails();
  }

  fetchOrderDetails() {
    if (this.costingOrderId.length > 13) {
      this.everythingService.getById(this.costingOrderId).subscribe(
        (data) => {
          this.order = data;
          console.log('Order data fetched');

          this.mapOrderDetails();
        },
        (err) => {
          this.snackBarService.showWarningSnack(
            'Error while fetching order details'
          );
          console.log('Error while fetching order details');
          console.log(err);
        }
      );
    } else {
      this.everythingService
        .getByEverythingReferenceNumber(this.costingOrderId)
        .subscribe(
          (data) => {
            this.order = data;
            console.log('Order data fetched');

            this.mapOrderDetails();
          },
          (err) => {
            this.snackBarService.showWarningSnack(
              'Error while fetching order details'
            );
            console.log('Error while fetching order details');
            console.log(err);
          }
        );
    }
  }

  mapOrderDetails() {
    //mapping pre-stored values from everything master to substrateCosting
    this.setGeneralDetails();
    this.setDimensionDetails();
  }

  convertDate(date): string {
    let dateArr = date.split('-');
    return dateArr[2] + '-' + dateArr[1] + '-' + dateArr[0];
  }

  setGeneralDetails() {
    this.substrateCosting.date = this.convertDate(this.order.date);

    this.substrateCosting.jobNo = this.order.refNo;

    this.substrateCosting.description = this.order.sampName;

    this.substrateCosting.customer = this.order.name;
  }

  setDimensionDetails() {
    switch (this.order.sampleName) {
      case 'Printed':
        this.substrateCosting.dimensions.productSizeInMMWidth = Number(
          this.order.unitWidthPrinted
        );
        this.substrateCosting.dimensions.productSizeInMMLength = Number(
          this.order.unitHeightPrinted
        );
        break;

      case 'Tag':
        this.substrateCosting.dimensions.productSizeInMMWidth = Number(
          this.order.unitWidthTag
        );
        this.substrateCosting.dimensions.productSizeInMMLength = Number(
          this.order.unitHeightTag
        );
        break;

      case 'Sticker':
        this.substrateCosting.dimensions.productSizeInMMWidth = Number(
          this.order.unitWidthSticker
        );
        this.substrateCosting.dimensions.productSizeInMMLength = Number(
          this.order.unitHeightSticker
        );
        break;

      case 'Woven':
        this.substrateCosting.dimensions.productSizeInMMWidth = Number(
          this.order.unitWidth
        );
        this.substrateCosting.dimensions.productSizeInMMLength = Number(
          this.order.unitHeight
        );
        break;

      default:
        console.log(
          'No cases (trimType) matched to assign product dimensions from the correspoding order'
        );
        break;
    }
  }

  change() {
    this.calcProductSizeInInchesWithBleed();
    this.calcFullSheetSizeMM();
    this.calcSheetPrice();
    this.calcImpSheetSize();
    this.calcImpSheetPrice();
    this.calcUps();
    this.calcOutsPerFullSheet();
  }

  roundUpToTwo(num): number {
    return +(Math.ceil(Number(num + 'e+2')) + 'e-2');
  }

  roundDown(num): number {
    return Math.floor(num);
  }

  truncateToTwo(num): number {
    let trunc = Math.floor(num * 100) / 100;
    trunc = Number(trunc.toFixed(2));
    return trunc;
  }

  calcProductSizeInInchesWithBleed() {
    this.substrateCosting.dimensions.productSizeInInchesWithBleedWidth =
      this.substrateCosting.dimensions.productSizeInMMWidth &&
      this.substrateCosting.dimensions.bleedFront
        ? this.roundUpToTwo(
            ((this.substrateCosting.dimensions.productSizeInMMWidth | 0) +
              (this.substrateCosting.dimensions.bleedFront | 0)) /
              25.4
          )
        : 0;

    this.substrateCosting.dimensions.productSizeInInchesWithBleedLength =
      this.substrateCosting.dimensions.productSizeInMMLength &&
      this.substrateCosting.dimensions.bleedRear
        ? this.roundUpToTwo(
            ((this.substrateCosting.dimensions.productSizeInMMLength | 0) +
              (this.substrateCosting.dimensions.bleedRear | 0)) /
              25.4
          )
        : 0;
  }

  calcFullSheetSizeMM() {
    this.substrateCosting.dimensions.fullSheetSizeMMWidth = this
      .substrateCosting.dimensions.fullSheetSizeInchWidth
      ? this.truncateToTwo(
          this.substrateCosting.dimensions.fullSheetSizeInchWidth * 25.4
        )
      : 0;

    this.substrateCosting.dimensions.fullSheetSizeMMLength = this
      .substrateCosting.dimensions.fullSheetSizeInchLength
      ? this.truncateToTwo(
          this.substrateCosting.dimensions.fullSheetSizeInchLength * 25.4
        )
      : 0;
  }

  calcSheetPrice() {
    if (this.substrateCosting.dimensions.fullSheetPriceUnit) {
      if (this.substrateCosting.dimensions.fullSheetPriceUnit == 'KG') {
        this.substrateCosting.dimensions.sheetPrice =
          ((this.substrateCosting.dimensions.fullSheetSizeMMLength *
            this.substrateCosting.dimensions.fullSheetSizeMMWidth *
            this.substrateCosting.dimensions.gsm) /
            1000000000) *
          this.substrateCosting.dimensions.fullSheetPrice;

        //truncating
        this.substrateCosting.dimensions.sheetPrice = this.truncateToTwo(
          this.substrateCosting.dimensions.sheetPrice
        );
      } else if (
        this.substrateCosting.dimensions.fullSheetPriceUnit == 'SHEET'
      ) {
        this.substrateCosting.dimensions.sheetPrice =
          this.substrateCosting.dimensions.fullSheetPrice;
      }
    } else {
      this.substrateCosting.dimensions.sheetPrice = null;
    }
  }

  calcImpSheetSize() {
    this.substrateCosting.dimensions.impSheetSizeInInchWidth =
      this.substrateCosting.dimensions.fullSheetSizeInchWidth &&
      this.substrateCosting.dimensions.cutPlanWidth
        ? this.roundUpToTwo(
            this.substrateCosting.dimensions.fullSheetSizeInchWidth /
              this.substrateCosting.dimensions.cutPlanWidth
          )
        : 0;

    this.substrateCosting.dimensions.impSheetSizeInInchLength =
      this.substrateCosting.dimensions.fullSheetSizeInchLength &&
      this.substrateCosting.dimensions.cutPlanLength
        ? this.roundUpToTwo(
            this.substrateCosting.dimensions.fullSheetSizeInchLength /
              this.substrateCosting.dimensions.cutPlanLength
          )
        : 0;

    this.substrateCosting.dimensions.impSheetSizeInMMWidth = this
      .substrateCosting.dimensions.impSheetSizeInInchWidth
      ? this.truncateToTwo(
          this.substrateCosting.dimensions.impSheetSizeInInchWidth * 25.4
        )
      : 0;

    this.substrateCosting.dimensions.impSheetSizeInMMLength = this
      .substrateCosting.dimensions.impSheetSizeInInchLength
      ? this.truncateToTwo(
          this.substrateCosting.dimensions.impSheetSizeInInchLength * 25.4
        )
      : 0;
  }

  calcImpSheetPrice() {
    this.substrateCosting.dimensions.impSheetPrice =
      this.substrateCosting.dimensions.sheetPrice &&
      this.substrateCosting.dimensions.cutPlanWidth &&
      this.substrateCosting.dimensions.cutPlanLength
        ? this.truncateToTwo(
            this.substrateCosting.dimensions.sheetPrice /
              (this.substrateCosting.dimensions.cutPlanWidth *
                this.substrateCosting.dimensions.cutPlanLength)
          )
        : 0;
  }

  calcUps() {
    this.substrateCosting.dimensions.upsWidth =
      this.substrateCosting.dimensions.impSheetSizeInInchWidth &&
      this.substrateCosting.dimensions.productSizeInInchesWithBleedWidth
        ? this.roundDown(
            (this.substrateCosting.dimensions.impSheetSizeInInchWidth - 1) /
              this.substrateCosting.dimensions.productSizeInInchesWithBleedWidth
          )
        : 0;

    this.substrateCosting.dimensions.upsLength =
      this.substrateCosting.dimensions.impSheetSizeInInchLength &&
      this.substrateCosting.dimensions.productSizeInInchesWithBleedLength
        ? this.roundDown(
            (this.substrateCosting.dimensions.impSheetSizeInInchLength - 1) /
              this.substrateCosting.dimensions
                .productSizeInInchesWithBleedLength
          )
        : 0;
  }

  calcOutsPerFullSheet() {
    this.substrateCosting.dimensions.outsPerFullSheet =
      this.substrateCosting.dimensions.upsPerImpSheet &&
      this.substrateCosting.dimensions.cutPlanWidth &&
      this.substrateCosting.dimensions.cutPlanLength
        ? this.truncateToTwo(
            this.substrateCosting.dimensions.upsPerImpSheet *
              this.substrateCosting.dimensions.cutPlanWidth *
              this.substrateCosting.dimensions.cutPlanLength
          )
        : 0;
  }
}
