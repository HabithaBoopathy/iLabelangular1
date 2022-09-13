import { SlabRates } from './slab-rates';
export class WovenCosting {
  id: string;
  refNo: string;
  entryDate: string;
  customerId: string;
  customerName: string;
  trimType: string;
  status: number;

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
  deliveryCost: number;
  profit: number;

  estimateCostRaiper: number;
  estimateCostAirjet: number;

  slabRates: SlabRates[];

  attachmentExtension: string;

  remarks: string;
  paymentTerms: string;
  financialChargeRaiper: number;
  financialChargeAirjet: number;

  additionalWorkDetails: string[];

  totalEstimateCostRaiper: number;
  totalEstimateCostAirjet: number;
  executiveId: string;
  approverId: string;
  tManagerEmail: string;

  customerRejectedReason: string;

  constructor() {
    this.id = null;
    this.refNo = '';
    this.entryDate = '';
    this.customerId = '';
    this.customerName = '';
    this.trimType = 'Woven';
    this.status = 0;

    this.estimatedQuantity = null;
    this.labelName = '';
    this.labelWidth = null;
    this.labelLength = null;
    this.noOfColors = null;
    this.totalPicks = null;
    this.noOfRepeats = null;

    this.rpmRaiper = 450;
    this.rpmAirjet = 700;
    this.hrRaiper = null;
    this.hrAirjet = null;
    this.labelCostRaiper = null;
    this.labelCostAirjet = null;

    this.additionalWork = null;
    this.productionCost = null;
    this.qcAndPackingCost = null;
    this.adminCost = 0.02;
    this.deliveryCost = null;
    this.profit = 0.1;

    this.estimateCostRaiper = null;
    this.estimateCostAirjet = null;
    this.slabRates = [];

    this.attachmentExtension = '';
    this.remarks = '';
    this.paymentTerms = '';
    this.financialChargeRaiper = null;
    this.financialChargeAirjet = null;

    this.additionalWorkDetails = [];
    this.totalEstimateCostRaiper = null;
    this.totalEstimateCostAirjet = null;
    this.executiveId = '';
    this.approverId = '';
    this.tManagerEmail = '';
    this.customerRejectedReason = '';
  }
}
