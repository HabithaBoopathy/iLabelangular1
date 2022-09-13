export class substrateCostingDimensions {
  productSizeInMMWidth: number;
  productSizeInMMLength: number;
  bleedFront: number;
  bleedRear: number;
  productSizeInInchesWithBleedWidth: number;
  productSizeInInchesWithBleedLength: number;
  paperQuality: string;
  gsm: number;
  fullSheetSizeInchWidth: number;
  fullSheetSizeInchLength: number;
  fullSheetSizeMMWidth: number;
  fullSheetSizeMMLength: number;
  fullSheetPriceUnit: string;
  fullSheetPrice: number;
  sheetPrice: number;
  cutPlanWidth: number;
  cutPlanLength: number;
  impSheetSizeInInchWidth: number;
  impSheetSizeInInchLength: number;
  impSheetSizeInMMWidth: number;
  impSheetSizeInMMLength: number;
  impSheetPrice: number;
  upsWidth: number;
  upsLength: number;
  upsPerImpSheet: number;
  outsPerFullSheet: number;
  offCutSizeWidth: number;
  offCutSizeLength: number;

  constructor() {
    this.productSizeInMMWidth = null;
    this.productSizeInMMLength = null;
    this.bleedFront = null;
    this.bleedRear = null;
    this.productSizeInInchesWithBleedWidth = null;
    this.productSizeInInchesWithBleedLength = null;
    this.paperQuality = '';
    this.gsm = null;
    this.fullSheetSizeInchWidth = null;
    this.fullSheetSizeInchLength = null;
    this.fullSheetSizeMMWidth = null;
    this.fullSheetSizeMMLength = null;
    this.fullSheetPriceUnit = '';
    this.fullSheetPrice = null;
    this.sheetPrice = null;

    this.cutPlanWidth = null;
    this.cutPlanLength = null;
    this.impSheetSizeInInchWidth = null;
    this.impSheetSizeInInchLength = null;
    this.impSheetSizeInMMWidth = null;
    this.impSheetSizeInMMLength = null;
    this.impSheetPrice = null;
    this.upsWidth = null;
    this.upsLength = null;
    this.upsPerImpSheet = null;
    this.outsPerFullSheet = null;
    this.offCutSizeWidth = null;
    this.offCutSizeLength = null;
  }
}
