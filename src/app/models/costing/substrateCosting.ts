import { substrateCostingDimensions } from './substrateCostingDimensions';
export class SubStrateCosting {
  date: string;
  jobNo: string;
  description: string;
  customer: string;
  retailerProgram: string;
  overSeasRebatePercent: number;
  retailerRebatePercent: number;
  rebateValue: number;
  dimensions: substrateCostingDimensions;

  constructor() {
    this.date = '';
    this.jobNo = '';
    this.description = '';
    this.customer = '';
    this.retailerProgram = '';
    this.overSeasRebatePercent = null;
    this.retailerRebatePercent = null;
    this.rebateValue = null;
    this.dimensions = new substrateCostingDimensions();
  }
}
