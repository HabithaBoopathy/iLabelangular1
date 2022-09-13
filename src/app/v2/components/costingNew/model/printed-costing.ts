import { SlabRates } from './slab-rates';
import { VariableCostsPrinted } from './variable-costs-printed';
export class PrintedCosting {
  id: string;
  refNo: string;
  entryDate: string;
  customerId: string;
  customerName: string;
  trimType: string;
  status: number;

  estimatedQuantity: number;
  tapeId: string;
  tapeName: string;
  tapeWidthMM: number;
  tapeCostPerMeter: number;
  labelWidth: number;
  labelLength: number;
  noOfLabelsPerMeter: number;

  tapeCostPerLabel: number;
  noOfColors: number;
  plateCost: number;
  inkCost: number;
  cuttingCost: number;
  productionCost: number;
  qcAndPackingCost: number;
  adminCost: number;
  deliveryCost: number;
  margin: number;

  estimateCost: number;
  financialCharge: number;
  totalEstimateCost: number;

  slabRates: SlabRates[];

  attachmentExtension: string;

  remarks: string;
  paymentTerms: string;

  additionalWorkDetails: string[];
  executiveId: string;
  approverId: string;
  tManagerEmail: string;

  variableCosts: VariableCostsPrinted;

  customerRejectedReason: string;

  constructor() {
    this.id = null;
    this.refNo = '';
    this.entryDate = '';
    this.customerId = '';
    this.customerName = '';
    this.trimType = 'Printed';
    this.status = 0;

    this.estimatedQuantity = null;
    this.tapeId = '';
    this.tapeName = '';
    this.tapeWidthMM = null;
    this.tapeCostPerMeter = null;
    this.labelWidth = null;
    this.labelLength = null;
    this.noOfLabelsPerMeter = null;

    this.tapeCostPerLabel = null;
    this.noOfColors = null;
    this.plateCost = null;
    this.inkCost = null;
    this.cuttingCost = null;
    this.productionCost = null;
    this.qcAndPackingCost = null;
    this.adminCost = null;
    this.deliveryCost = null;
    this.margin = null;

    this.estimateCost = null;
    this.financialCharge = null;
    this.totalEstimateCost = null;

    this.slabRates = [];
    this.attachmentExtension = '';

    this.remarks = '';
    this.paymentTerms = '';

    this.additionalWorkDetails = [];
    this.executiveId = '';
    this.approverId = '';
    this.tManagerEmail = '';

    this.variableCosts = new VariableCostsPrinted();
    this.customerRejectedReason = '';
  }
}
