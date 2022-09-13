export class Costing {
  //ids
  id: string;
  orderId: string;

  //rawMaterialCost
  boardName: string;
  boardSize: string;
  gsm: number;
  boardRate: number;
  inks: number;
  otherRawMaterialCost: number;
  upsBoard: number;
  boardCost: number;
  totalRawMaterialCost: number;

  //wokCenterCost
  printing: number;
  varnish: number;
  lamination: number;
  pasting: number;
  dieCut: number;
  packing: number;
  boardCutting: number;
  sidePasting: number;
  totalProcessingCost: number;

  //finalCost
  adminCharges: number;
  courierDeliveryCharges: number;
  sumOfCosts: number;
  margin: number;
  marginAmount: number;
  totalFinalCost: number;

  constructor() {
    this.id = '';
    this.orderId = '';

    this.boardName = '';
    this.boardSize = '';
    this.gsm = null;
    this.boardRate = null;
    this.inks = null;
    this.otherRawMaterialCost = null;
    this.upsBoard = null;
    this.boardCost = null;
    this.totalRawMaterialCost = null;

    this.printing = null;
    this.varnish = null;
    this.lamination = null;
    this.pasting = null;
    this.dieCut = null;
    this.packing = null;
    this.boardCutting = null;
    this.sidePasting = null;
    this.totalProcessingCost = null;

    this.adminCharges = null;
    this.courierDeliveryCharges = null;
    this.sumOfCosts = null;
    this.margin = null;
    this.marginAmount = null;
    this.totalFinalCost = null;
  }
}
