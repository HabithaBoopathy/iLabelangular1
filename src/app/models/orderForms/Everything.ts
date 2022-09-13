import { OrderDetailsLineItem } from '../orderDetailsLineItem';
import { QuotationFormBatch } from '../QuotationFormBatch';

export class Everything {
  //Order Created By
  orderCreatedBy: string;
 

  // Send For Customer Acceptance Check
  sendForCustomerAcceptanceClicked: string;

  //Order Confirmation Date

  orderConfirmationDate: String;

  // Transaction Status
  statusNum: number;
  transactionStatus: string;
  placeOfSupply: string;

  // Customer Details
  customerStreet1: string;
  customerStreet2: string;
  customerCity: string;
  customerState: string;
  customerGst: string;
  customerEmailRequired: boolean;

  //new field
  territoryId: string;

  costingId: string;
  costingRefNo: string;
  costingDate: string;
  costingAttachmentUsed: boolean;

  // Line Item
  // lineitem: Batch[] = [
  //   {quotationId:0, description: '', hsn:'',quantity: '',rate: '', termsAndConditions: ''},
  //   {quotationId:0, description: '', hsn:'',quantity: '',rate: '', termsAndConditions: ''},
  //   {quotationId:0, description: '', hsn:'',quantity: '',rate: '', termsAndConditions: ''},
  //   {quotationId:0, description: '', hsn:'',quantity: '',rate: '', termsAndConditions: ''},
  //   {quotationId:0, description: '', hsn:'',quantity: '',rate: '', termsAndConditions: ''},
  //   {quotationId:0, description: '', hsn:'',quantity: '',rate: '', termsAndConditions: ''},
  //   {quotationId:0, description: '', hsn:'',quantity: '',rate: '', termsAndConditions: ''},
  //   {quotationId:0, description: '', hsn:'',quantity: '',rate: '', termsAndConditions: ''},
  //   {quotationId:0, description: '', hsn:'',quantity: '',rate: '', termsAndConditions: ''},
  // ];

  lineitem: QuotationFormBatch[] = [];

  orderLineItem: OrderDetailsLineItem[] = [];

  id: string;
  //Reference Number
  printreferencenumber: String;
  tagreferencenumber: String;
  stickerreferencenumber: String;
  wovenreferencenumber: String;

  //Reference Numbers
  printRefNum: Number;
  wovenRefNum: Number;
  stickerRefNum: Number;
  tagRefNum: Number;

  // Common
  date: string;
  oldRefNo: String;
  //name stores the customerName from customer master
  //since customerName(in master) contains the companyName (bug)
  name: string;
  //customerName stores the companyName from customer master
  //since companyName(in master) contains the customerName (bug)
  customerName: string;
  customerId:string;
  customerReferenceNumber: string;
  //fetch the value from company master using companyId in customer master
  merchandiser: string;
  contactPerson: String;
  phone: String;
  email: string;
  refNo: string;
  anotherRefNo: String;
  refNoCheck: number;
  execName: string;
  check: String;
  sampName: string;
  sampType: String;

  // Upload
  uploadName: string;
  secondUploadName: string;
  thirdUploadName: string;
  fourthUploadName: string;
  fifthUploadName: string;
  sixthUploadName: string;

  // Printed
  unitPrinted: String;
  unitHeightPrinted: String;
  unitWidthPrinted: String;
  expectedQuantityPrinted: String;
  expectedDatePrinted: String;
  foldingPrinted: String;
  specialInstructionPrinted: String;
  remarksPrinted: String;
  colorPrinted: String;
  orderTypePrinted: String;
  colorInformation: String;
  statusPrinted: String;
  finishingPrinted: String;
  labelTypePrinted: String;
  approvalTypePrinted: String;
  incomingPrinted: String;
  samplePDatePrinted: String;
  executiveCodePrinted: String;
  managerPrinted: String;
  dateTimePrinted: String;
  dispatchPrinted: String;
  sampleReceived: String;
  pm: String;
  sampleNamePrinted: String;
  systemPrinted: String;
  samplingDatePrinted: String;
  crlimitStatus: String;
  designFileNamePrinted: String;
  machinePrinted: String;
  qualityPrinted: String;
  lengthPrinted: String;
  radio: String;
  singlePrinting: String;
  doublePrinting: String;
  colorOptionToBeUsedPrinted: String;
  noOfcolors: String;
  additionalWorkPrinted: String;
  colorOptionFront: String;
  colorOptionBack: String;

  sampleBlock: String;
  noOfRepeatsPrinted: String;
  widthPrinted: String;

  rejectedReason: String;

  // Quotation Form
  sampleCode: String;
  estimateDate: String;
  billCustomerName: String;
  billCustomerStreet: String;
  billCustomerCity: String;
  billCustomerPincode: String;
  billCustomerState: String;
  billCustomerCountry: String;
  billCustomerGst: String;
  shipCustomerName: String;
  shipCustomerStreet: String;
  shipCustomerCity: String;
  shipCustomerPincode: String;
  shipCustomerState: String;
  shipCustomerCountry: String;
  shipCustomerGst: String;
  itemDescription: string;
  hsn: string;
  quantityRange: string;
  rate: string;
  termsAndConditions: string;

  // Tag
  unitTag: string;
  unitHeightTag: String;
  unitWidthTag: String;
  tagDevType: String;
  documentTypeTag: String;
  colorInfoTag: String;
  runningBoardSize: String;
  nameOfTheBoard: String;
  boardSpecification: String;
  qualityTag: String;
  boardGSM: String;
  fsc: String;
  printTypeTag: String;
  colorTag: String;
  orderTypeTag: String;
  expectedQuantityTag: String;
  statusTag: String;
  finishingTag: String;
  expectedDateTag: String;
  foldingTag: String;
  approval: String;
  commentsTag: String;
  noOfPlates: String;
  negativePositive: String;
  foilEmbossScreen: String;
  dieTag: String;
  printColorMatching: String;
  foilFace: String;
  foilReverse: String;
  foilColor: String;
  uvFace: String;
  uvReverse: String;
  uvNoOfScreens: String;
  vMatt: String;
  vGloss: String;
  vFace: String;
  vReverse: String;
  vOthers: String;
  lMatt: String;
  lGloss: String;
  lFace: String;
  lReverse: String;
  lOthers: String;
  straightCut: String;
  holeSize: String;
  perforation: String;
  creasing: String;
  designCut: String;
  string: String;
  eyeletColorAndLength: String;
  ifOthers: String;
  hookColorAndLength: String;
  boardCost: String;
  boardWastage: String;
  designFileName: String;
  digitalPrintTag: String;
  offsetPrintTag: String;
  foilTag: String;
  uv: String;
  emboss: String;
  varnish: String;
  lamination: String;
  pasting: String;
  die2: String;
  platesize: String;
  noofups: String;

  // Sticker
  unitSticker: string;
  unitHeightSticker: String;
  unitWidthSticker: String;
  diameter: String;
  documentType: String;
  colorInfoSticker: String;
  stickerType: String;
  rollColor: String;
  rollSpecification: String;
  rollSize: String;
  sampleCharge: String;
  sampleChargecollected: String;
  printType: String;
  comments: String;
  orderTypeSticker: String;
  expectedQuantitySticker: String;
  sampleRequest: String;
  flex: String;
  offset: String;
  incomingSticker: String;
  samplePDateSticker: String;
  executiveCodeSticker: String;
  managerSticker: String;
  dateTimeSticker: String;
  dispatch: String;
  rollCost: String;
  rollWastage: String;
  stickerPrint: String;
  digitalPrint: String;
  foil: String;
  die: String;
  fwdandPacking: String;
  total: String;
  margin: String;
  finalCost: String;
  trimPiece: String;
  inkNameTable = [];
  platesizeSticker: String;

  // Woven

  unit: String;
  unitHeight: String;
  unitWidth: String;
  expectedQuantity: String;
  expectedDate: String;
  folding: String;
  specialInstruction: String;
  remarks: String;
  color: String;
  orderType: String;
  colorInfo: String;
  status: String;
  finishing: String;
  labelType: String;
  approvalType: String;
  incoming: String;
  samplePDate: String;
  executiveCode: string;
  manager: String;
  dateTime: String;
  dispatchDateTime: String;
  sampleRecDateTime: String;
  pcm: String;
  sampleName: string;
  system: String;
  tp: String;
  samplingDate: String;
  crLimitStatus: String;
  designer: String;
  machine: String;
  width: String;
  quality: String;
  length: String;
  x: String;
  colorOptionToBeUsed: String;
  y: String;
  noOfRepeats: String;
  additionalWork: String;
  wastage: String;
  colorMatching: String;
  warpTension: String;
  colorOptionTable = [];
  doctype: String;
  colorpicks: String;
  totalpicks: string;
}

// Line Item Interface
export interface Batch {
  quotationId: number;
  description: string;
  hsn: string;
  quantity: string;
  rate: string;
  termsAndConditions: string;
}
