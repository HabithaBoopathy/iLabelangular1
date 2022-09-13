// class Type1{
//   unitRate: number;
//   totalRate: number;
//   constructor(unitRate?: number, totalRate?: number){
//     this.unitRate = unitRate? unitRate : null;
//     this.totalRate = totalRate? totalRate: null;
//   }
// }

import { SlabRates } from './slab-rates';

// class Type2{
//   cost: number;
//   totalRate: number;
//   constructor(cost?: number, totalRate?: number){
//     this.cost = cost? cost : null;
//     this.totalRate = totalRate? totalRate : null;
//   }
// }

// class Type3{
//   cost: number;
//   unitRate: number;
//   totalRate: number;
//   constructor(cost?: number, unitRate?: number, totalRate?: number){
//     this.cost = cost? cost : null;
//     this.unitRate = unitRate? unitRate : null;
//     this.totalRate = totalRate? totalRate : null;
//   }
// }

// class Type4{
//   description: number;
//   unitRate: number;
//   totalRate: number;
//   constructor(description?: number, unitRate?: number, totalRate?: number){
//     this.description = description? description : null;
//     this.unitRate = unitRate? unitRate : null;
//     this.totalRate = totalRate? totalRate : null;
//   }
// }

// class Type5{
//   cost: number;
//   description: number;
//   unitRate: number;
//   totalRate: number;
//   constructor(cost?: number, description?: number, unitRate?: number, totalRate?: number){
//     this.cost = cost? cost : null;
//     this.description = description? description : null;
//     this.unitRate = unitRate? unitRate : null;
//     this.totalRate = totalRate? totalRate : null;
//   }
// }

class Costing {
  cost: number;
  description: number;
  unitRate: number;
  totalRate: number;
  constructor(
    cost?: number,
    description?: number,
    unitRate?: number,
    totalRate?: number
  ) {
    this.cost = cost ? cost : null;
    this.description = description ? description : null;
    this.unitRate = unitRate ? unitRate : null;
    this.totalRate = totalRate ? totalRate : null;
  }
}

export class StickerFlexoCosting {
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
  stickerName: string;
  attachmentExtension: string;
  jobNo: string;
  printingQuantity: number;

  stickerLength: number;
  stickerWidth: number;
  stickerShape: string;
  noOfColors: number;
  materialId: string;
  materialPrice: number;

  reelWidth: number;
  acrossUps: number;
  repeatLength: number;
  aroundUps: number;
  totalPCSPerRepeat: number;
  requiredMeter: number;
  requiredSquareMeter: number;
  remarks: string;
  shRemarks: string;

  artWorkHrs: Costing;
  proofReadingHrs: Costing;
  die: Costing;
  plate: Costing;
  requiredSquareMeter1: Costing;
  requiredSquareMeter2: Costing;
  rollChangeWaste: Costing;
  ink: Costing;
  printingMachineHours: Costing;
  digital: Costing;
  rhyguanSlitting: Costing;
  foil: Costing;
  laminationAdhesive: Costing;
  lamination: Costing;
  dieCutting: Costing;
  packing: Costing;
  admin: Costing;

  cost: number;
  totalCost: number;
  profitPercentage: number;
  profit: number;
  ratePerPcs: number;

  slabRates: SlabRates[];
  deliveryCost: number;
  customerRejectedReason: string;

  constructor() {
    this.id = null;
    this.refNo = '';
    this.entryDate = '';
    this.customerId = '';
    this.customerName = '';
    this.trimType = 'Sticker-Flexo';
    this.status = 0;

    this.executiveId = '';
    this.approverId = '';
    this.tManagerEmail = '';
    this.stickerName = '';
    this.attachmentExtension = '';
    this.jobNo = '';
    this.printingQuantity = null;
    this.stickerLength = null;
    this.stickerWidth = null;
    this.stickerShape = '';
    this.noOfColors = null;
    this.materialId = '';
    this.materialPrice = null;

    this.reelWidth = null;
    this.acrossUps = null;
    this.repeatLength = null;
    this.aroundUps = null;
    this.totalPCSPerRepeat = null;
    this.requiredMeter = null;
    this.requiredSquareMeter = null;
    this.remarks = '';
    this.shRemarks = '';

    this.artWorkHrs = new Costing(150, null, null, 150);
    this.proofReadingHrs = new Costing(105, null, null, 105);
    this.die = new Costing(5000, null, null, 5000);
    this.plate = new Costing(13);
    this.requiredSquareMeter1 = new Costing();
    this.requiredSquareMeter2 = new Costing(700);
    this.rollChangeWaste = new Costing();
    this.ink = new Costing(0.002, null, 1500);
    this.printingMachineHours = new Costing(null, null, 2600);
    this.digital = new Costing();
    this.rhyguanSlitting = new Costing(0);
    this.foil = new Costing(0);
    this.laminationAdhesive = new Costing(900);
    this.lamination = new Costing(300);
    this.dieCutting = new Costing(2, null, 0.05);
    this.packing = new Costing(null, null, 50);
    this.admin = new Costing(500);

    this.cost = null;
    this.totalCost = null;
    this.profitPercentage = 30;
    this.profit = null;
    this.ratePerPcs = null;
    this.slabRates = [];
    this.deliveryCost = null;
    this.customerRejectedReason = '';
  }
}
