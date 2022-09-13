export class WovenCosting {
  id: string;
  orderId: string;

  quotationNo: string;
  customerName: string;
  estimatedQuantity: number;
  labelName: string;
  labelWidth: number;
  labelLength: number;
  noOfColors: number;
  totalPicks: number;
  noOfRepeats: number;

  rpmRaiper: number;
  rpmAirjet: number;
  hrRaiper: number;
  hrAirjet: number;
  labelCostRaiper: number;
  labelCostAirjet: number;

  additionalWork: number;
  productionCost: number;
  qcAndPackingCost: number;
  adminCost: number;
  profit: number;

  estimateCostRaiper: number;
  estimateCostAirjet: number;

  constructor() {
    this.id = '';
    this.orderId = '';
    this.quotationNo = '';
    this.customerName = '';
    this.estimatedQuantity = null;
    this.labelName = '';
    this.labelWidth = null;
    this.labelLength = null;
    this.noOfColors = null;
    this.totalPicks = null;
    this.noOfRepeats = null;

    this.rpmRaiper = null;
    this.rpmAirjet = null;
    this.hrRaiper = null;
    this.hrAirjet = null;
    this.labelCostRaiper = null;
    this.labelCostAirjet = null;

    this.additionalWork = null;
    this.productionCost = null;
    this.qcAndPackingCost = null;
    this.adminCost = null;
    this.profit = null;

    this.estimateCostRaiper = null;
    this.estimateCostAirjet = null;
  }
}
