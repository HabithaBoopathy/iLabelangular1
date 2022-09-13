import { MPaper } from '../../../../models/mPaper';
import { SlabRates } from './slab-rates';

class BaseDetails {
  runBoardLength: number;
  runBoardWidth: number;
  gumArea1: number;
  gumArea2: number;
  pastingArea1: number;
  pastingArea2: number;

  constructor() {
    this.runBoardLength = 0;
    this.runBoardWidth = 0;
    this.gumArea1 = 0;
    this.gumArea2 = 0;
    this.pastingArea1 = 0;
    this.pastingArea2 = 0;
  }
}

class Type1 {
  value: number;
  rate: number;
  quantity: number;
  cost: number;

  constructor(value?: number, rate?: number) {
    this.value = value ? value : null;
    this.rate = rate ? rate : null;
    this.quantity = null;
    this.cost = null;
  }
}

class Type2 {
  //this class (obj) only 3 fields

  rate: number;
  quantity: number;
  cost: number;

  constructor(rate?: number) {
    this.rate = rate ? rate : null;
    this.quantity = null;
    this.cost = null;
  }
}

class CostingDetails {
  designAndProofCost: number;
  adminCharge: number;
  paper1Quantity: number;
  paper1Cost: number;
  paper2Quantity: number;
  paper2Cost: number;
  plate: Type2;
  plateMachineId: string;
  ink: Type1;
  inkCopies: number;
  screen: Type2;
  die: Type1;
  foilBlock: Type1;
  emboBlock: Type1;
  screenPrint: Type1;
  offsetPrint: Type2;
  offsetPrintMachineId: string;
  gumming: Type1;
  pasting: Type1;
  lamination: Type1;
  uv: Type1;
  foil: Type1;
  varnish: Type1;
  aquasCoating: Type1;
  embossOrDeboss: Type1;
  punching: Type1;
  cutting: Type1;
  pOrF: Type1;
  digital: Type1;
  stringOrJute: Type1;
  eyelet: Type1;
  knurling: Type1;
  film: Type1;
  scoring: Type1;
  rawMaterialCost: number;
  rawMaterialRatePerPiece: number;
  cost: number;
  profitPercentage: number;
  profit: number;
  deliveryCost: number;
  totalCost: number;
  ratePerPiece: number;

  constructor() {
    this.designAndProofCost = 250;
    this.adminCharge = 2000;
    this.paper1Quantity = null;
    this.paper1Cost = null;
    this.paper2Quantity = null;
    this.paper2Cost = null;
    // this.plate = new Type2(225);
    this.plate = new Type2();
    this.plateMachineId = '';
    this.ink = new Type1(500);
    this.inkCopies = 4000;
    this.screen = new Type2(500);
    // this.die = new Type1(20);
    this.die = new Type1();
    this.foilBlock = new Type1(13);
    this.emboBlock = new Type1(15.5);
    this.screenPrint = new Type1(0.0025);
    // this.offsetPrint = new Type2(400);
    this.offsetPrint = new Type2();
    this.offsetPrintMachineId = '';
    this.gumming = new Type1(0.015);
    this.pasting = new Type1(0.0035);
    this.lamination = new Type1(0.006);
    this.uv = new Type1(0.003);
    this.foil = new Type1(0.015);
    this.varnish = new Type1(0.001);
    this.aquasCoating = new Type1(0.006);
    this.embossOrDeboss = new Type1(240);
    this.punching = new Type1(240);
    this.cutting = new Type1(240);
    this.pOrF = new Type1(0.008);
    this.digital = new Type1(5);
    this.stringOrJute = new Type1(1);
    this.eyelet = new Type1(0.3);
    this.knurling = new Type1(2);
    this.film = new Type1(0.06);
    this.scoring = new Type1(0.05);
    this.rawMaterialCost = null;
    this.rawMaterialRatePerPiece = null;
    this.cost = null;
    this.profitPercentage = null;
    this.profit = null;
    this.deliveryCost = null;
    this.totalCost = null;
    this.ratePerPiece = null;
  }
}

export class TagCosting {
  id: string;
  refNo: string;
  entryDate: string;
  customerId: string;
  customerName: string;
  trimType: string;
  status: number;
  executiveId: string;
  approverId: string;
  tManagerEmail: string;
  productName: string;
  attachmentExtension: string;

  paper1: MPaper;
  paper2: MPaper;

  productLength: number;
  productWidth: number;
  orderQuantity: number;
  excessPercentage: number;
  excessValue: number;
  ups: number;
  runCopies: number;
  makeReady: number;
  remarks: string;
  shRemarks: string;

  paper1CutSize: number;
  paper2CutSize: number;
  paper1NoOfBoard: number;
  paper2NoOfBoard: number;
  paper1Rate: number;
  paper2Rate: number;

  baseDetails: BaseDetails;
  costingDetails: CostingDetails;
  slabRates: SlabRates[];
  customerRejectedReason: string;

  constructor() {
    this.id = null;
    this.refNo = '';
    this.entryDate = '';
    this.customerId = '';
    this.customerName = '';
    this.trimType = 'Tag';
    this.status = 0;
    this.executiveId = '';
    this.approverId = '';
    this.tManagerEmail = '';
    this.productName = '';
    this.attachmentExtension = '';

    this.paper1 = new MPaper();
    this.paper2 = new MPaper();

    this.productLength = null;
    this.productWidth = null;
    this.orderQuantity = null;
    this.excessPercentage = null;
    this.excessValue = null;
    this.ups = null;
    this.runCopies = null;
    this.makeReady = null;
    this.remarks = '';
    this.shRemarks = '';

    this.paper1CutSize = null;
    this.paper2CutSize = null;
    this.paper1NoOfBoard = null;
    this.paper2NoOfBoard = null;
    this.paper1Rate = null;
    this.paper2Rate = null;

    this.baseDetails = new BaseDetails();
    this.costingDetails = new CostingDetails();
    this.slabRates = [];
    this.customerRejectedReason = '';
  }
}
