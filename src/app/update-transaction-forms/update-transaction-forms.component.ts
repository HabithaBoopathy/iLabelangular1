import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { Everything } from './../models/orderForms/Everything';
import { EverythingService } from '../services/orderForms/everything.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { productReferenceTS } from './../models/productReference';
import { ProductReferenceService } from '../services/product-reference.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Munit } from '../models/munit';
import { MunitService } from '../services/munit.service';
import { Mcolor } from '../models/mcolor';
import { McolorService } from '../services/mcolor.service';
import { Mlabeltype } from '../models/mlabeltype';
import { MlabeltypeService } from '../services/mlabeltype.service';
import { Location } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Mstatus } from '../models/mstatus';
import { MstatusService } from '../services/mstatus.service';
import { MotherdetailsService } from '../services/motherdetails.service';
import { MotherDetails } from '../models/motherdetails';
import { MdocumenttypeService } from '../services/mdocumenttype.service';
import { Mdocumenttype } from '../models/mdocumenttype';
import { Quotation } from '../models/orderForms/Quotation';
import { UserService } from '../services/user.service';
import { QuotationService } from '../services/orderForms/quotation.service';
import { LoginService } from '../services/login.service';
import { ViewChild, ElementRef } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MexecutiveService } from '../services/mexecutive.service';
import { Mexecutive } from '../models/mexecutive';
import { Upload } from '../models/upload';
import { UploadFileService } from '../services/upload-file.service';
import { Userprofile } from '../models/userprofile';
import { ScriptService } from './../services/script.service';
import { AuthService } from '../services/auth.service';
// import pdfMake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";
declare let pdfMake: any;
import { Employee } from '../models/employee';
import { EmployeeService } from '../services/employee.service';
import { OrderDetailsLineItem } from '../models/orderDetailsLineItem';
import { QuotationFormBatch } from '../models/QuotationFormBatch';
import { Costing } from '../models/orderForms/costing';
import { CostingSheetService } from '../services/orderForms/costing-sheet.service';
// import { CostingService } from '../services/costing.service';
import { SnackBarService } from '../services/snackBar.service';
import { TerritoryService } from './../services/territory.service';
import { Configuration } from '../configuration';
import { CostingService } from '../v2/components/costingNew/services/costing.service';
import { WovenCosting } from '../v2/components/costingNew/model/woven-costing';


// Quotation Form Lineitem
export interface Batch {
  quotationId: number;
  description: string;
  hsn: string;
  quantity: string;
  rate: string;
  termsAndConditions: string;
}

@Component({
  selector: 'app-update-transaction-forms',
  templateUrl: './update-transaction-forms.component.html',
  styleUrls: ['./update-transaction-forms.component.css'],
  providers: [DatePipe],
})
export class UpdateTransactionFormsComponent implements OnInit {
  // Bulk Changing of Read Only Based on States
  public stateBasedReadOnly: boolean = false;
  public everythingReadOnly: boolean = false;

  employees: Observable<Employee[]>;
  employee: Employee = new Employee();

  dataset: Details = {
    executiveCode: '',
    customerName: '',
    sampleRequestNumber: '',
    pageURL: '',
    email: '',
    attachment1: '',
    attachment2: '',
    attachment3: '',
  };

  costing: Costing;
  filePath: string;

  // LineItem Variable
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
  //   {quotationId:0, description: '', hsn:'',quantity: '',rate: '', termsAndConditions: ''},
  // ];

  territory: string = '';

  customerName: String;

  public showprint: boolean = false;
  public noShowSampleRequest: boolean = true;
  public showwoven: boolean = false;
  public showtag: boolean = false;
  public showAll: boolean = false;
  public showsticker: boolean = false;
  public showholes: boolean = false;
  public showothers1: boolean = false;
  public showothers2: boolean = false;
  public showstring: boolean = false;
  public showref: boolean = false;
  public showOrder: boolean = false;
  public showNext: boolean = true;
  public showOrderRejected: boolean = false;

  // Customer Email
  public showAcceptRejectForCustomerEmail: boolean = false;

  public dontShowQuotationPDF: boolean = false;

  public disableIfSendForCustomerAcceptanceButtonIsClicked: boolean = false;

  nextStatusButton: String;

  public showThis: boolean = false;

  public showQuotationFormList: boolean = false;

  public changeClass: boolean = true;

  public changeTheClass: boolean = true;

  //Show Access Rights Start
  public showAdminstrator: boolean = true;
  public showSampleHead: boolean = false;
  public showCustomerServiceTeam: boolean = false;
  public showSalesTeam: boolean = false;
  public showCustomer: boolean = false;
  //Show Access Rights End

  //States Start
  public showSampleRequestInitiated: boolean = false;
  public showCustomerExecutiveApproval: boolean = false;
  public showSampleInitiated: boolean = false;
  public showRejectionProduction: boolean = false;
  public showProduction: boolean = false;
  public showQuotationDispatch: boolean = false;
  public showSampleApproved: boolean = false;
  public showSampleRejected: boolean = false;
  //States End

  // Show Buttons Start
  public showRejectButton: boolean = false;
  public showConfirmButton: boolean = true;
  public showSaveButton: boolean = true;
  public showSaveWithoutRegexButton: boolean = false;
  public showDownloadAsPDFButton: boolean = false;
  public showSpecialButton: boolean = false;
  public showPlaceOrderButton: boolean = false;
  public showApproveButton: boolean = false;
  public showAcceptOrderButton: boolean = false;
  public showCompleteProductionButton: boolean = false;
  public showAcceptButton: boolean = false;
  public showRejectOrderButton: boolean = false;
  public showQuotationRejectButton: boolean = false;
  public showSendForCustomerAcceptanceButton: boolean = false;
  public showResubmitButton: boolean = false;
  // Show Buttons End

  // Show Features Start
  public showArtWorkFileName: boolean = true;
  // Show Features End

  public makeQuotationReadOnly: boolean = false;

  orderConfirmationDate: String;
  orderConfirmed: boolean = false;

  public checkMe: boolean;

  myDate = new Date();

  test: string;

  public showsingleprint: boolean = false;
  public showdoubleprint: boolean = false;
  disableSaveBtn: boolean = false;
  cost: WovenCosting;
  munitsArray = [];
  mprintedunitsArray = [];
  foldingArray = [];
  printedfoldingArray = [];
  foldingTagArray = [];
  finishingArray = [];
  printedfinishingArray = [];
  mStatusArray = [];
  mStatusPrintedArray = [];
  finishingTagArray = [];
  mStatusTagArray = [];
  mColorWovenArray = [];
  mColorTagArray = [];
  mColorPrintedArray = [];
  mLabelTypeArray = [];
  mPrintedLabelTypeArray = [];
  additionalWorkArray = [];
  printedadditionalWorkArray = [];
  documentTypeArray = [];
  stickerdocumentTypeArray = [];
  qualityArray = [];
  wovenqualityArray = [];
  printedqualityArray = [];

  mlabeltypes: Observable<Mlabeltype[]>;
  mlabeltypeValue: Observable<Mlabeltype[]>;
  mlabeltype: Mlabeltype = new Mlabeltype();

  mstatuss: Observable<Mstatus[]>;
  mstatusvalue: Observable<Mstatus[]>;
  mstatus: Mstatus = new Mstatus();

  mdocumenttypes: Observable<Mdocumenttype[]>;
  mdocumenttypeValues: Observable<Mdocumenttype[]>;
  mdocumenttype: Mdocumenttype = new Mdocumenttype();

  motherdetailsObs: Observable<MotherDetails[]>;

  motherdetailsvalueWovenAdditionalWork: Observable<MotherDetails[]>;
  motherdetailsvalueWovenFinishing: Observable<MotherDetails[]>;
  motherdetailsvalueWovenFolding: Observable<MotherDetails[]>;
  motherdetailsvalueWovenQuality: Observable<MotherDetails[]>;

  motherdetailsvaluePrintedFolding: Observable<MotherDetails[]>;
  motherdetailsvaluePrintedQuality: Observable<MotherDetails[]>;
  motherdetailsvaluePrintedFinishing: Observable<MotherDetails[]>;
  motherdetailsvaluePrintedAdditionalWork: Observable<MotherDetails[]>;

  motherdetailsvalueTagQuality: Observable<MotherDetails[]>;
  motherdetailsvalueTagFinishing: Observable<MotherDetails[]>;
  motherdetailsvalueTagFolding: Observable<MotherDetails[]>;
  motherdetailsvalueTag: Observable<MotherDetails[]>;

  otherdetails: MotherDetails = new MotherDetails();

  quotations: Observable<Quotation[]>;
  quotation: Quotation = new Quotation();

  statusNum: Number = 1;
  transactionStatus: String;

  munits: Observable<Munit[]>;
  munitvalue: Observable<Munit[]>;
  munit: Munit = new Munit();

  Users: Observable<Userprofile[]>;
  user: Userprofile = new Userprofile();

  quotationFormBatch: QuotationFormBatch = new QuotationFormBatch();
  costs: WovenCosting;
  ngAfterViewInit() {
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }
  
  // createDraftOrder() {
  //   this.disableDraftCostingBtn = true;
  //   if (this.everythingService.createDraftCostingWoven(this.everything.id)) {
  //     this.snackBarService.showSuccessSnack('Draft order created successfully');
  //     this.back();
  //   } else {
  //     this.snackBarService.showSuccessSnack('Error while creating draft order');
  //     this.disableDraftCostingBtn = false;
  //   }
  // }
  
  // back() {
  //   this.router.navigate(['/home/uforms', this.costing.orderId]);
  // }
  costingRedirect() {
    try {
      let trimType = '';
      let id = this.everything.costingId;
      if (this.everything.sampleName != 'Sticker') {
        trimType = this.everything.sampleName;
      } else {
        if (this.everything.costingRefNo.includes('SESFLEX')) {
          trimType = 'Sticker-Flexo';
        } else {
          trimType = 'Sticker-Offset';
        }
      }

      let url;
      switch (trimType) {
        case 'Woven':
          url = this.router.serializeUrl(
            this.router.createUrlTree([
              '/home/wovenCosting',
              id,
              { previousPage: 'costingList' },
            ])
          );

          window.open(url, '_blank');
          break;
        case 'Printed':
          url = this.router.serializeUrl(
            this.router.createUrlTree([
              '/home/printedCosting',
              id,
              { previousPage: 'costingList' },
            ])
          );

          window.open(url, '_blank');

        case 'Tag':
          url = this.router.serializeUrl(
            this.router.createUrlTree([
              '/home/tagCosting',
              id,
              { previousPage: 'costingList' },
            ])
          );

          window.open(url, '_blank');

          break;
        case 'Sticker-Flexo':
          url = this.router.serializeUrl(
            this.router.createUrlTree([
              '/home/stickerFlexoCosting',
              id,
              { previousPage: 'costingList' },
            ])
          );

          window.open(url, '_blank');

          break;
        case 'Sticker-Offset':
          url = this.router.serializeUrl(
            this.router.createUrlTree([
              '/home/stickerOffsetCosting',
              id,
              { previousPage: 'costingList' },
            ])
          );

          window.open(url, '_blank');

          break;
        default:
          console.warn('Invalid Trim Type Input', trimType);
          alert(
            'Costing sheet for trim type - Heat Transfer is under development'
          );
          break;
      }
    } catch (e) {
      console.log(e);
    }
  }
  createCosting() {
    this.disableDraftCostingBtn = true;
    if(this.everything.sampleName == "Woven"){
      let costingObj = new WovenCosting();
      this.employeeService.getCustomerEmail(this.everything.email).subscribe(
        (data)=>{
          costingObj.customerId = data.id
          costingObj.customerName = data.companyName
        }
      )
      let dateArr = this.everything.date.split("-")
      costingObj.entryDate = dateArr.reverse().join("-")
      costingObj.labelName = this.everything.sampName
      costingObj.trimType = "Woven"
      costingObj.estimatedQuantity = Number(this.everything.expectedQuantity)
      costingObj.status = 0
      // costingObj.executiveId = this.everything.executiveCode

      this.costingService.createWoven(costingObj).subscribe(
        (data)=>{
          alert('Costing created')
        }
      )
    }
    
    
    if (this.costingService.createWoven(this.cost)) {
      this.snackBarService.showSuccessSnack('Costing created successfully');
      
    } else {
      this.snackBarService.showSuccessSnack('Error while creating costing');
      this.disableDraftCostingBtn = false;
    }
  }
 
   
  //REGEX Start

  // Email
  get primEmail() {
    return this.userEmail.get('primaryEmail');
  }

  title = 'email-validation';
  userEmail = new FormGroup({
    primaryEmail: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,8}$'),
    ]),
  });

  // Only Integer
  get onlyInt() {
    return this.onlyIntGroup.get('onlyIntControl');
  }

  onlyIntTitle = 'onlyInt';
  onlyIntGroup = new FormGroup({
    onlyIntControl: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]),
  });

  // Only Integer 1
  get onlyInt1() {
    return this.onlyIntGroup1.get('onlyIntControl1');
  }

  onlyIntTitle1 = 'onlyInt1';
  onlyIntGroup1 = new FormGroup({
    onlyIntControl1: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]),
  });

  // Only Integer 2
  get onlyInt2() {
    return this.onlyIntGroup2.get('onlyIntControl2');
  }

  onlyIntTitle2 = 'onlyInt2';
  onlyIntGroup2 = new FormGroup({
    onlyIntControl2: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]),
  });

  // Integer 3
  get onlyInt3() {
    return this.onlyIntGroup3.get('onlyIntControl3');
  }

  onlyIntTitle3 = 'onlyInt3';
  onlyIntGroup3 = new FormGroup({
    onlyIntControl3: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{10}$'),
    ]),
  });

  // Int Plus Float
  get intPlusFloat() {
    return this.intplusFloatGroup.get('intplusFloatControl');
  }

  intplusFloatTitle = 'intplusFloat';
  intplusFloatGroup = new FormGroup({
    intplusFloatControl: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });

  // Int Plus Float 1
  get intPlusFloat1() {
    return this.intplusFloatGroup1.get('intplusFloatControl1');
  }

  intplusFloatTitle1 = 'intplusFloat1';
  intplusFloatGroup1 = new FormGroup({
    intplusFloatControl1: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });

  // Int Plus Float 2
  get intPlusFloat2() {
    return this.intplusFloatGroup2.get('intplusFloatControl2');
  }

  intplusFloatTitle2 = 'intplusFloat2';
  intplusFloatGroup2 = new FormGroup({
    intplusFloatControl2: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });

  // Int Plus Float 3
  get intPlusFloat3() {
    return this.intplusFloatGroup3.get('intplusFloatControl3');
  }

  intplusFloatTitle3 = 'intplusFloat3';
  intplusFloatGroup3 = new FormGroup({
    intplusFloatControl3: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });

  // Int Plus Float 4
  get intPlusFloat4() {
    return this.intplusFloatGroup4.get('intplusFloatControl4');
  }

  intplusFloatTitle4 = 'intplusFloat4';
  intplusFloatGroup4 = new FormGroup({
    intplusFloatControl4: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });

  // Int Plus Float 5
  get intPlusFloat5() {
    return this.intplusFloatGroup5.get('intplusFloatControl5');
  }

  intplusFloatTitle5 = 'intplusFloat5';
  intplusFloatGroup5 = new FormGroup({
    intplusFloatControl5: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });

  // Int Plus Float 6
  get intPlusFloat6() {
    return this.intplusFloatGroup6.get('intplusFloatControl6');
  }

  intplusFloatTitle6 = 'intplusFloat6';
  intplusFloatGroup6 = new FormGroup({
    intplusFloatControl6: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });

  // Int Plus Float 7
  get intPlusFloat7() {
    return this.intplusFloatGroup7.get('intplusFloatControl7');
  }

  intplusFloatTitle7 = 'intplusFloat7';
  intplusFloatGroup7 = new FormGroup({
    intplusFloatControl7: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });

  // Int Plus Float 8
  get intPlusFloat8() {
    return this.intplusFloatGroup8.get('intplusFloatControl8');
  }

  intplusFloatTitle8 = 'intplusFloat8';
  intplusFloatGroup8 = new FormGroup({
    intplusFloatControl8: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });

  // Int Plus Float 9
  get intPlusFloat9() {
    return this.intplusFloatGroup9.get('intplusFloatControl9');
  }

  intplusFloatTitle9 = 'intplusFloat9';
  intplusFloatGroup9 = new FormGroup({
    intplusFloatControl9: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });

  // Int Plus Float 10
  get intPlusFloat10() {
    return this.intplusFloatGroup10.get('intplusFloatControl10');
  }

  intplusFloatTitle10 = 'intplusFloat10';
  intplusFloatGroup10 = new FormGroup({
    intplusFloatControl10: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });

  get intPlusFloat11() {
    return this.intplusFloatGroup11.get('intplusFloatControl11');
  }
  intplusFloatTitle11 = 'intplusFloat11';
  intplusFloatGroup11 = new FormGroup({
    intplusFloatControl11: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat12() {
    return this.intplusFloatGroup12.get('intplusFloatControl12');
  }
  intplusFloatTitle12 = 'intplusFloat12';
  intplusFloatGroup12 = new FormGroup({
    intplusFloatControl12: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat13() {
    return this.intplusFloatGroup13.get('intplusFloatControl13');
  }
  intplusFloatTitle13 = 'intplusFloat13';
  intplusFloatGroup13 = new FormGroup({
    intplusFloatControl13: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat14() {
    return this.intplusFloatGroup14.get('intplusFloatControl14');
  }
  intplusFloatTitle14 = 'intplusFloat14';
  intplusFloatGroup14 = new FormGroup({
    intplusFloatControl14: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat15() {
    return this.intplusFloatGroup15.get('intplusFloatControl15');
  }
  intplusFloatTitle15 = 'intplusFloat15';
  intplusFloatGroup15 = new FormGroup({
    intplusFloatControl15: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat16() {
    return this.intplusFloatGroup16.get('intplusFloatControl16');
  }
  intplusFloatTitle16 = 'intplusFloat16';
  intplusFloatGroup16 = new FormGroup({
    intplusFloatControl16: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat17() {
    return this.intplusFloatGroup17.get('intplusFloatControl17');
  }
  intplusFloatTitle17 = 'intplusFloat17';
  intplusFloatGroup17 = new FormGroup({
    intplusFloatControl17: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat18() {
    return this.intplusFloatGroup18.get('intplusFloatControl18');
  }
  intplusFloatTitle18 = 'intplusFloat18';
  intplusFloatGroup18 = new FormGroup({
    intplusFloatControl18: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat19() {
    return this.intplusFloatGroup19.get('intplusFloatControl19');
  }
  intplusFloatTitle19 = 'intplusFloat19';
  intplusFloatGroup19 = new FormGroup({
    intplusFloatControl19: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat20() {
    return this.intplusFloatGroup20.get('intplusFloatControl20');
  }
  intplusFloatTitle20 = 'intplusFloat20';
  intplusFloatGroup20 = new FormGroup({
    intplusFloatControl20: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat21() {
    return this.intplusFloatGroup21.get('intplusFloatControl21');
  }
  intplusFloatTitle21 = 'intplusFloat21';
  intplusFloatGroup21 = new FormGroup({
    intplusFloatControl21: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat22() {
    return this.intplusFloatGroup22.get('intplusFloatControl22');
  }
  intplusFloatTitle22 = 'intplusFloat22';
  intplusFloatGroup22 = new FormGroup({
    intplusFloatControl22: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat23() {
    return this.intplusFloatGroup23.get('intplusFloatControl23');
  }
  intplusFloatTitle23 = 'intplusFloat23';
  intplusFloatGroup23 = new FormGroup({
    intplusFloatControl23: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat24() {
    return this.intplusFloatGroup24.get('intplusFloatControl24');
  }
  intplusFloatTitle24 = 'intplusFloat24';
  intplusFloatGroup24 = new FormGroup({
    intplusFloatControl24: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat25() {
    return this.intplusFloatGroup25.get('intplusFloatControl25');
  }
  intplusFloatTitle25 = 'intplusFloat25';
  intplusFloatGroup25 = new FormGroup({
    intplusFloatControl25: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat26() {
    return this.intplusFloatGroup26.get('intplusFloatControl26');
  }
  intplusFloatTitle26 = 'intplusFloat26';
  intplusFloatGroup26 = new FormGroup({
    intplusFloatControl26: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat27() {
    return this.intplusFloatGroup27.get('intplusFloatControl27');
  }
  intplusFloatTitle27 = 'intplusFloat27';
  intplusFloatGroup27 = new FormGroup({
    intplusFloatControl27: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat28() {
    return this.intplusFloatGroup28.get('intplusFloatControl28');
  }
  intplusFloatTitle28 = 'intplusFloat28';
  intplusFloatGroup28 = new FormGroup({
    intplusFloatControl28: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat29() {
    return this.intplusFloatGroup29.get('intplusFloatControl29');
  }
  intplusFloatTitle29 = 'intplusFloat29';
  intplusFloatGroup29 = new FormGroup({
    intplusFloatControl29: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat30() {
    return this.intplusFloatGroup30.get('intplusFloatControl30');
  }
  intplusFloatTitle30 = 'intplusFloat30';
  intplusFloatGroup30 = new FormGroup({
    intplusFloatControl30: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat31() {
    return this.intplusFloatGroup31.get('intplusFloatControl31');
  }
  intplusFloatTitle31 = 'intplusFloat31';
  intplusFloatGroup31 = new FormGroup({
    intplusFloatControl31: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat32() {
    return this.intplusFloatGroup32.get('intplusFloatControl32');
  }
  intplusFloatTitle32 = 'intplusFloat32';
  intplusFloatGroup32 = new FormGroup({
    intplusFloatControl32: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat33() {
    return this.intplusFloatGroup33.get('intplusFloatControl33');
  }
  intplusFloatTitle33 = 'intplusFloat33';
  intplusFloatGroup33 = new FormGroup({
    intplusFloatControl33: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat34() {
    return this.intplusFloatGroup34.get('intplusFloatControl34');
  }
  intplusFloatTitle34 = 'intplusFloat34';
  intplusFloatGroup34 = new FormGroup({
    intplusFloatControl34: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat35() {
    return this.intplusFloatGroup35.get('intplusFloatControl35');
  }
  intplusFloatTitle35 = 'intplusFloat35';
  intplusFloatGroup35 = new FormGroup({
    intplusFloatControl35: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat36() {
    return this.intplusFloatGroup36.get('intplusFloatControl36');
  }
  intplusFloatTitle36 = 'intplusFloat36';
  intplusFloatGroup36 = new FormGroup({
    intplusFloatControl36: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat37() {
    return this.intplusFloatGroup37.get('intplusFloatControl37');
  }
  intplusFloatTitle37 = 'intplusFloat37';
  intplusFloatGroup37 = new FormGroup({
    intplusFloatControl37: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat38() {
    return this.intplusFloatGroup38.get('intplusFloatControl38');
  }
  intplusFloatTitle38 = 'intplusFloat38';
  intplusFloatGroup38 = new FormGroup({
    intplusFloatControl38: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat39() {
    return this.intplusFloatGroup39.get('intplusFloatControl39');
  }
  intplusFloatTitle39 = 'intplusFloat39';
  intplusFloatGroup39 = new FormGroup({
    intplusFloatControl39: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat40() {
    return this.intplusFloatGroup40.get('intplusFloatControl40');
  }
  intplusFloatTitle40 = 'intplusFloat40';
  intplusFloatGroup40 = new FormGroup({
    intplusFloatControl40: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat41() {
    return this.intplusFloatGroup41.get('intplusFloatControl41');
  }
  intplusFloatTitle41 = 'intplusFloat41';
  intplusFloatGroup41 = new FormGroup({
    intplusFloatControl41: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat42() {
    return this.intplusFloatGroup42.get('intplusFloatControl42');
  }
  intplusFloatTitle42 = 'intplusFloat42';
  intplusFloatGroup42 = new FormGroup({
    intplusFloatControl42: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat43() {
    return this.intplusFloatGroup43.get('intplusFloatControl43');
  }
  intplusFloatTitle43 = 'intplusFloat43';
  intplusFloatGroup43 = new FormGroup({
    intplusFloatControl43: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat44() {
    return this.intplusFloatGroup44.get('intplusFloatControl44');
  }
  intplusFloatTitle44 = 'intplusFloat44';
  intplusFloatGroup44 = new FormGroup({
    intplusFloatControl44: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat45() {
    return this.intplusFloatGroup45.get('intplusFloatControl45');
  }
  intplusFloatTitle45 = 'intplusFloat45';
  intplusFloatGroup45 = new FormGroup({
    intplusFloatControl45: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat46() {
    return this.intplusFloatGroup46.get('intplusFloatControl46');
  }
  intplusFloatTitle46 = 'intplusFloat46';
  intplusFloatGroup46 = new FormGroup({
    intplusFloatControl46: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat47() {
    return this.intplusFloatGroup47.get('intplusFloatControl47');
  }
  intplusFloatTitle47 = 'intplusFloat47';
  intplusFloatGroup47 = new FormGroup({
    intplusFloatControl47: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat48() {
    return this.intplusFloatGroup48.get('intplusFloatControl48');
  }
  intplusFloatTitle48 = 'intplusFloat48';
  intplusFloatGroup48 = new FormGroup({
    intplusFloatControl48: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat49() {
    return this.intplusFloatGroup49.get('intplusFloatControl49');
  }
  intplusFloatTitle49 = 'intplusFloat49';
  intplusFloatGroup49 = new FormGroup({
    intplusFloatControl49: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat50() {
    return this.intplusFloatGroup50.get('intplusFloatControl50');
  }
  intplusFloatTitle50 = 'intplusFloat50';
  intplusFloatGroup50 = new FormGroup({
    intplusFloatControl50: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });

  // Line Item Update Modal
  lineitemupdate(content) {
    this.modalService
      .open(content, {
        backdrop: 'static',
        size: 'lg',
        centered: true,
        ariaLabelledBy: 'modal-basic-title',
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  calcTotalRawMaterialCost() {
    this.costing.boardCost = this.costing.boardRate / this.costing.upsBoard;
    this.costing.totalRawMaterialCost =
      this.costing.boardCost +
      this.costing.inks +
      this.costing.otherRawMaterialCost;

    this.calcfinalCost();
  }

  calcTotalWorkCenterCost() {
    this.costing.totalProcessingCost =
      this.costing.printing +
      this.costing.varnish +
      this.costing.lamination +
      this.costing.pasting +
      this.costing.dieCut +
      this.costing.packing +
      this.costing.boardCutting +
      this.costing.sidePasting;

    this.calcfinalCost();
  }

  calcfinalCost() {
    this.costing.sumOfCosts =
      this.costing.totalRawMaterialCost +
      this.costing.totalProcessingCost +
      this.costing.adminCharges +
      this.costing.courierDeliveryCharges;

    this.costing.marginAmount =
      (this.costing.margin / 100) * this.costing.sumOfCosts;

    this.costing.totalFinalCost =
      this.costing.sumOfCosts + this.costing.marginAmount;
  }

  tagSize(): String {
    if (this.everything.sampleName == 'Woven') {
      return `${this.everything.unitHeight} x ${this.everything.unitWidth}`;
    } else if (this.everything.sampleName == 'Tag') {
      return `${this.everything.unitHeightTag} x ${this.everything.unitWidthTag}`;
    } else if (this.everything.sampleName == 'Sticker') {
      return `${this.everything.unitHeightSticker} x ${this.everything.unitWidthSticker}`;
    } else if (this.everything.sampleName == 'Printed') {
      return `${this.everything.unitHeightPrinted} x ${this.everything.unitWidthPrinted}`;
    } else {
      return '';
    }
  }

  redirectToCosting() {
    //xxx this.id = this.route.snapshot.params['id'];
    switch (this.everything.sampleName) {
      case 'Woven':
        this.router.navigate(['/home/costingWoven', this.everything.id]);
        break;
      case 'Printed':
        this.router.navigate(['/home/costingPrinted', this.everything.id]);
        break;
      case 'Tag':
        this.router.navigate(['/home/test', this.everything.id]);
        break;
      default:
        alert(
          'Costing sheet for trim type - sticker is not availale. Please choose orders having any other trim types'
        );
    }
  }

  openCostingSheetModal(templateReference) {
    this.modalService
      .open(templateReference, {
        backdrop: 'static',
        size: 'xl',
        centered: true,
        ariaLabelledBy: 'modal-basic-title',
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );

    if (!this.isCostingPresent) {
      this.snackBarService.showWarningSnack(
        'No costing details found for this order'
      );
    }
  }

  design(checkpdf) {
    this.modalService
      .open(checkpdf, {
        backdrop: 'static',
        size: 'xl',
        centered: true,
        ariaLabelledBy: 'modal-basic-title',
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  // Line Item Function

  jValue: number = 0;

  tempQuotationID: number;

  // editLineItem(id: string)
  // {
  //   this.everything.itemDescription = this.lineitem[id].description;
  //   this.everything.hsn = this.lineitem[id].hsn;
  //   this.everything.quantityRange = this.lineitem[id].quantity;
  //   this.everything.rate = this.lineitem[id].rate;
  //   this.everything.termsAndConditions = this.lineitem[id].termsAndConditions;

  //   this.sendID(id)
  // }

  sendID(id: string) {
    this.anotherTempVariable = id;
  }

  anotherTempVariable: string;

  // updateLineItem(){

  //   this.everything.lineitem[this.anotherTempVariable].description = this.everything.itemDescription
  //   this.lineitem[this.anotherTempVariable].description = this.everything.itemDescription

  //   this.everything.lineitem[this.anotherTempVariable].hsn = this.everything.hsn
  //   this.lineitem[this.anotherTempVariable].hsn = this.everything.hsn

  //   this.everything.lineitem[this.anotherTempVariable].quantity = this.everything.quantityRange
  //   this.lineitem[this.anotherTempVariable].quantity = this.everything.quantityRange

  //   this.everything.lineitem[this.anotherTempVariable].rate = this.everything.rate
  //   this.lineitem[this.anotherTempVariable].rate = this.everything.rate

  //   this.everything.itemDescription = undefined;
  //   this.everything.hsn = undefined;
  //   this.everything.quantityRange = undefined;
  //   this.everything.rate = undefined;
  //   this.everything.termsAndConditions = undefined;
  // }

  deleteLineItem(i: number) {
    this.everything.lineitem.splice(i, 1);
  }

  description1: string;

  resetObjects() {
    Object.keys(this.quotationFormBatch).forEach(
      (k) => delete this.quotationFormBatch[k]
    );
    this.quotationFormBatch = new QuotationFormBatch();
    this.quotationFormBatch.hsn = this.everything.hsn;
    this.quotationFormBatch.itemAndDescription = this.everything.sampName;
  }

  isEmptyString(val: string): boolean {
    return val === '' || val === null || val === undefined;
  }

  isQuotationFormBatchEmpty(): boolean {
    return Object.values(this.quotationFormBatch).some((x) => {
      if (this.isEmptyString(x)) {
        return true;
      }
      return false;
    });
  }

  lineItem() {
    if (this.isQuotationFormBatchEmpty()) {
      alert('Please fill in the details before proceeding further');
    } else {
      this.everything.lineitem.push({ ...this.quotationFormBatch });
      console.log(this.quotationFormBatch);
      console.log(this.everything);
      this.resetObjects();
    }

    // this.tempQuotationID = this.jValue

    // this.everything.lineitem[this.jValue].quotationId = this.tempQuotationID
    // this.lineitem[this.jValue].quotationId = this.tempQuotationID

    // this.everything.lineitem[this.jValue].description = this.everything.itemDescription
    // this.lineitem[this.jValue].description = this.everything.itemDescription

    // this.description1 = this.everything.lineitem[this.jValue].description

    // this.everything.lineitem[this.jValue].hsn = this.everything.hsn
    // this.lineitem[this.jValue].hsn = this.everything.hsn

    // this.everything.lineitem[this.jValue].quantity = this.everything.quantityRange
    // this.lineitem[this.jValue].quantity = this.everything.quantityRange

    // this.everything.lineitem[this.jValue].rate = this.everything.rate
    // this.lineitem[this.jValue].rate = this.everything.rate

    // this.jValue++;

    // this.everything.quantityRange = undefined;
    // this.everything.rate = undefined;
  }

  // PRODUCT REFERNCE VARIABLES START
  // ................................
  // ................................
  // ................................
  // ................................
  // ................................
  // ................................

  createRoute() {
    this.router.navigate(['/home/orders']);
  }

  id: number;

  productReferenceObservable: Observable<productReferenceTS[]>;
  productReference: productReferenceTS = new productReferenceTS();

  form: FormGroup;

  submitted = false;

  printcolorname: string = 'Printed';
  tagcolorname: string = 'Tag';
  stickercolorname: string = 'Sticker';
  wovencolorname: string = 'Woven';

  referencenumber: string;
  printreferencenumber: string;
  tagreferencenumber: string;
  stickerreferencenumber: string;
  wovenreferencenumber: string;

  printNum: number = 0;
  tagNum: number = 0;
  stickerNum: number = 0;
  wovenNum: number = 0;

  samplename: string;

  selected = '';

  printmax: number = 0;
  tagmax: number = 0;
  stickermax: number = 0;
  wovenmax: number = 0;

  printnext: number = 0;
  tagnext: number = 0;
  stickernext: number = 0;
  wovennext: number = 0;

  // PRODUCT REFERNCE VARIABLES END
  // ................................
  // ................................
  // ................................
  // ................................
  // ................................
  // ................................
  // ................................

  //Everything
  everythingObs: Observable<Everything[]>;
  everythingNewObs: Observable<Everything[]>;

  everything: Everything = new Everything();
  everythingNew: Everything = new Everything();

  mexecutives: Observable<Mexecutive[]>;
  mexecutive: Mexecutive = new Mexecutive();

  mcolors: Observable<Mcolor[]>;
  mcolorValue: Observable<Mcolor[]>;
  mcolor: Mcolor = new Mcolor();

  accessType;
  disableDraftCostingBtn: boolean = false;
  constructor(
    private employeeService: EmployeeService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private scriptService: ScriptService,
    private LoginService: LoginService,
    private mexecutiveService: MexecutiveService,
    private quotationService: QuotationService,
    private uploadService: UploadFileService,
    private https: HttpClient,
    private datePipe: DatePipe,
    private motherDetailService: MotherdetailsService,
    private mdocumenttypeService: MdocumenttypeService,
    private mstatusService: MstatusService,
    private mlabeltypeService: MlabeltypeService,
    private mcolorService: McolorService,
    private munitService: MunitService,
    fb: FormBuilder,
    private http: HttpClient,
    private everythingService: EverythingService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private modalService: NgbModal,
    private theProductService: ProductReferenceService,
    private userService: UserService,
    private _location: Location,
    private costingSheetService: CostingSheetService,
    private costingService: CostingService,
    private snackBarService: SnackBarService,
    private territoryService: TerritoryService,
   
  ) {
    this.accessType = localStorage.getItem('token');
    // PDF
    this.scriptService.load('pdfMake', 'vfsFonts');
    // PDF

    // pdfMake.vfs = pdfFonts.pdfMake.vfs;

    this.test = this.datePipe.transform(this.myDate, 'dd-MM-yyyy');

    this.form = fb.group({
      term: null,
    });

    this.form.valueChanges.subscribe(console.log);
    this.costing = new Costing();
   
  }

  togglesingleprint() {
    this.showsingleprint = !this.showsingleprint;
  }

  toggledoubleprint() {
    this.showdoubleprint = !this.showdoubleprint;
  }

  toggleAdmin() {
    this.showAdminstrator = true;
    this.showSampleHead = true;
    this.showCustomerServiceTeam = true;
    this.showSalesTeam = true;
    this.showCustomer = true;
  }

  toggleSampleHead() {
    this.showAdminstrator = false;
    this.showSampleHead = true;
    this.showCustomerServiceTeam = true;
    this.showSalesTeam = true;
    this.showCustomer = true;
  }

  toggleCST() {
    this.showAdminstrator = false;
    this.showSampleHead = false;
    this.showCustomerServiceTeam = true;
    this.showSalesTeam = true;
    this.showCustomer = true;
  }

  toggleSalesTeam() {
    this.showAdminstrator = false;
    this.showSampleHead = false;
    this.showCustomerServiceTeam = false;
    this.showSalesTeam = false;
    this.showCustomer = true;
  }

  toggleCustomer() {
    this.showAdminstrator = false;
    this.showSampleHead = false;
    this.showCustomerServiceTeam = false;
    this.showSalesTeam = false;
    this.showCustomer = true;
  }

  public showCustomerAccess: boolean = false;
  public showCustomerNameAccess: boolean = false;

  orderConfirmation() {
    this.orderConfirmed = true;
  }

  checkAccess() {
    if (localStorage.getItem('token') === 'Administrator') {
      this.toggleAdmin();
    } else if (localStorage.getItem('token') === 'Sample Head') {
      this.toggleSampleHead();
    } else if (localStorage.getItem('token') === 'Customer Service Team') {
      this.toggleCST();
    } else if (localStorage.getItem('token') === 'Sales Team') {
      this.toggleSalesTeam();
    } else if (localStorage.getItem('token') === 'Customer') {
      this.toggleCustomer();
    }
  }

  toggleRef() {
    this.showref = true;
  }

  toggleprint() {
    this.showprint = true;
    this.showsticker = false;
    this.showtag = false;
    this.showwoven = false;
    this.showAll = true;
  }

  togglewoven() {
    this.showwoven = true;
    this.showsticker = false;
    this.showprint = false;
    this.showtag = false;
    this.showAll = true;
  }
  toggletag() {
    this.showtag = true;
    this.showsticker = false;
    this.showprint = false;
    this.showwoven = false;
  }

  togglesticker() {
    this.showsticker = true;
    this.showprint = false;
    this.showwoven = false;
    this.showtag = false;
    this.showAll = true;
  }

  toggleholes() {
    this.showholes = !this.showholes;
  }
  toggleothers1() {
    this.showothers1 = !this.showothers1;
  }
  toggleothers2() {
    this.showothers2 = !this.showothers2;
  }
  togglestring() {
    this.showstring = !this.showstring;
  }

  wovenFunctions() {
    this.toggleAdditionalWorkDropDown();
    this.toggleLabelTypeDropDown();
    this.toggleFinishingDropDown();
    this.toggleWovenColorDropDown();
    this.toggleStatusDropDown();
    this.toggleWovenUnitDropDown();
    this.toggleFoldingDropDown();
    this.toggleRef();
    this.togglewoven();
    this.toggleWovenQualityDropDown();
  }

  printedFunctions() {
    this.togglePrintedUnitDropDown();
    this.toggleRef();
    this.toggleprint();
    this.togglePrintedFoldingDropDown();
    this.togglePrintedQualityDropDown();
    this.togglePrintedColorDropDown();
    this.toggleStatusPrintedDropDown();
    this.togglePrintedFinishingDropDown();
    this.togglePrintedLabelTypeDropDown();
    this.togglePrintedAdditionalWorkDropDown();
  }

  tagFunctions() {
    this.toggleQualityDropDown();
    this.toggleDocumentTypeDropDown();
    this.toggleRef();
    this.toggletag();
    this.toggleTagColorDropDown();
    this.toggleTagStatusDropDown();
    this.toggleTagFinishingDropDown();
    this.toggleFoldingTagDropDown();
  }

  stickerFunctions() {
    this.toggleStickerDocumentTypeDropDown();
    this.toggleRef();
    this.togglesticker();
  }

  toggleStickerDocumentTypeDropDown() {
    this.mdocumenttypeService
      .getByDocumentTypeSticker('true')
      .subscribe((data: Mdocumenttype) => {
        this.mdocumenttypeValues =
          this.mdocumenttypeService.getByDocumentTypeSticker('true');
      });
  }

  togglePrintedUnitDropDown() {
    this.munitService.getByUnitPrinted('true').subscribe((data: Munit) => {
      this.munitvalue = this.munitService.getByUnitPrinted('true');
    });
  }

  togglePrintedFoldingDropDown() {
    this.motherDetailService
      .getOtherDetailsPrinted('Folding', 'true')
      .subscribe((data: MotherDetails) => {
        this.motherdetailsvaluePrintedFolding =
          this.motherDetailService.getOtherDetailsPrinted('Folding', 'true');
      });
  }

  togglePrintedQualityDropDown() {
    this.motherDetailService
      .getOtherDetailsPrinted('Quality', 'true')
      .subscribe((data: MotherDetails) => {
        this.motherdetailsvaluePrintedQuality =
          this.motherDetailService.getOtherDetailsPrinted('Quality', 'true');
      });
  }

  togglePrintedColorDropDown() {
    this.mcolorService.getByColorPrinted('true').subscribe((data: Mcolor) => {
      this.mcolorValue = this.mcolorService.getByColorPrinted('true');
    });
  }

  toggleStatusPrintedDropDown() {
    this.mstatusService
      .getByStatusPrinted('true')
      .subscribe((data: Mstatus) => {
        this.mstatusvalue = this.mstatusService.getByStatusPrinted('true');
      });
  }

  togglePrintedFinishingDropDown() {
    this.motherDetailService
      .getOtherDetailsPrinted('Finishing', 'true')
      .subscribe((data: MotherDetails) => {
        this.motherdetailsvaluePrintedFinishing =
          this.motherDetailService.getOtherDetailsPrinted('Finishing', 'true');
      });
  }

  togglePrintedLabelTypeDropDown() {
    this.mlabeltypeService
      .getByLabelTypePrinted('true')
      .subscribe((data: Mlabeltype) => {
        this.mlabeltypeValue =
          this.mlabeltypeService.getByLabelTypePrinted('true');
      });
  }

  togglePrintedAdditionalWorkDropDown() {
    this.motherDetailService
      .getOtherDetailsPrinted('Additional Work', 'true')
      .subscribe((data: MotherDetails) => {
        this.motherdetailsvaluePrintedAdditionalWork =
          this.motherDetailService.getOtherDetailsPrinted(
            'Additional Work',
            'true'
          );
      });
  }

  toggleWovenUnitDropDown() {
    this.munitService.getByUnitWoven('true').subscribe((data: Munit) => {
      this.munitvalue = this.munitService.getByUnitWoven('true');
    });
  }

  toggleFoldingDropDown() {
    this.motherDetailService
      .getOtherDetailsWoven('Folding', 'true')
      .subscribe((data: MotherDetails) => {
        this.motherdetailsvalueWovenFolding =
          this.motherDetailService.getOtherDetailsWoven('Folding', 'true');
      });
  }

  toggleFoldingTagDropDown() {
    this.motherDetailService
      .getOtherDetailsTag('Folding', 'true')
      .subscribe((data: MotherDetails) => {
        this.motherdetailsvalueTagFolding =
          this.motherDetailService.getOtherDetailsTag('Folding', 'true');
      });
  }

  toggleStatusDropDown() {
    this.mstatusService.getByStatusWoven('true').subscribe((data: Mstatus) => {
      this.mstatusvalue = this.mstatusService.getByStatusWoven('true');
    });
  }

  toggleTagStatusDropDown() {
    this.mstatusService.getByStatusTag('true').subscribe((data: Mstatus) => {
      this.mstatusvalue = this.mstatusService.getByStatusTag('true');
    });
  }

  toggleWovenColorDropDown() {
    this.mcolorService.getByColorWoven('true').subscribe((data: Mcolor) => {
      this.mcolorValue = this.mcolorService.getByColorWoven('true');
    });
  }

  toggleTagColorDropDown() {
    this.mcolorService.getByColorTag('true').subscribe((data: Mcolor) => {
      this.mcolorValue = this.mcolorService.getByColorTag('true');
    });
  }

  toggleFinishingDropDown() {
    this.motherDetailService
      .getOtherDetailsWoven('Finishing', 'true')
      .subscribe((data: MotherDetails) => {
        this.motherdetailsvalueWovenFinishing =
          this.motherDetailService.getOtherDetailsWoven('Finishing', 'true');
      });
  }

  toggleTagFinishingDropDown() {
    this.motherDetailService
      .getOtherDetailsTag('Finishing', 'true')
      .subscribe((data: MotherDetails) => {
        this.motherdetailsvalueTagFinishing =
          this.motherDetailService.getOtherDetailsTag('Finishing', 'true');
      });
  }

  toggleLabelTypeDropDown() {
    this.mlabeltypeService
      .getByLabelTypeWoven('true')
      .subscribe((data: Mlabeltype) => {
        this.mlabeltypeValue =
          this.mlabeltypeService.getByLabelTypeWoven('true');
      });
  }

  toggleAdditionalWorkDropDown() {
    this.motherDetailService
      .getOtherDetailsWoven('Additional Work', 'true')
      .subscribe((data: MotherDetails) => {
        this.motherdetailsvalueWovenAdditionalWork =
          this.motherDetailService.getOtherDetailsWoven(
            'Additional Work',
            'true'
          );
      });
  }

  toggleDocumentTypeDropDown() {
    this.mdocumenttypeService
      .getByDocumentTypeTag('true')
      .subscribe((data: Mdocumenttype) => {
        this.mdocumenttypeValues =
          this.mdocumenttypeService.getByDocumentTypeTag('true');
      });
  }

  toggleQualityDropDown() {
    this.motherDetailService
      .getOtherDetailsTag('Quality', 'true')
      .subscribe((data: MotherDetails) => {
        this.motherdetailsvalueTagQuality =
          this.motherDetailService.getOtherDetailsTag('Quality', 'true');
      });
  }

  toggleWovenQualityDropDown() {
    this.motherDetailService
      .getOtherDetailsWoven('Quality', 'true')
      .subscribe((data: MotherDetails) => {
        this.motherdetailsvalueWovenQuality =
          this.motherDetailService.getOtherDetailsWoven('Quality', 'true');
      });
  }

  public scannedSampleIsUploaded: boolean = false;
  public imageAttachmentIsUploaded: boolean = false;
  public optionalAttachmentIsUploaded: boolean = false;

  specialButtonName: string;
  specialRejectButtonName: string;

  checkLoginStatus: string;
  checkStatus() {
    this.checkLoginStatus = localStorage.getItem('isLoggedIn');

    if (this.checkLoginStatus != 'true') {
      //Make all fields Read Only
      this.stateBasedReadOnly = true;
      this.everythingReadOnly = true;

      this.showConfirmButton = false;
      this.showSaveButton = false;
      this.showArtWorkFileName = false;
      this.showAcceptOrderButton = false;
      this.showRejectOrderButton = false;
      this.showLoginModal();
    } else if (
      this.everything.transactionStatus === 'Sample Request Initiated'
    ) {
      this.showSampleRequestInitiated = true;
      this.showConfirmButton = false;
      this.showPlaceOrderButton = true;
      if (this.accessType == 'TManager') {
        this.stateBasedReadOnly = true;
        this.everythingReadOnly = true;
        this.showCustomer = true;
        this.showThis = false;
      }
    } else if (
      this.everything.transactionStatus === 'Customer / Executive Approval'
    ) {
      this.showCustomerExecutiveApproval = true;
      this.showSaveButton = false;
      this.showConfirmButton = false;

      if (
        this.everything.orderCreatedBy === 'Administrator' ||
        this.everything.orderCreatedBy === 'Sample Head' ||
        this.everything.orderCreatedBy === 'Customer Service Team'
      ) {
        this.showCustomerExecutiveApproval = false;

        //Make all fields Read Only
        this.stateBasedReadOnly = true;
        this.everythingReadOnly = true;

        this.showConfirmButton = false;
        this.showSaveButton = false;
        this.showArtWorkFileName = false;
        this.showAcceptOrderButton = false;
        this.showRejectOrderButton = false;
      } else if (
        this.everything.orderCreatedBy === 'Customer' &&
        localStorage.getItem('token') === 'Customer'
      ) {
        this.showApproveButton = false;
        this.showRejectButton = false;
      } else if (
        this.everything.orderCreatedBy === 'Sales Team' &&
        localStorage.getItem('token') === 'Sales Team'
      ) {
        this.showApproveButton = false;
        this.showRejectButton = false;
      } else if (
        this.everything.orderCreatedBy === 'Customer' &&
        localStorage.getItem('token') === 'Sales Team'
      ) {
        this.stateBasedReadOnly = true;
        this.everythingReadOnly = true;
        this.showApproveButton = true;
        this.showRejectButton = true;
      } else if (
        this.everything.orderCreatedBy === 'Sales Team' &&
        localStorage.getItem('token') === 'Customer'
      ) {
        this.showApproveButton = true;
        this.showRejectButton = true;
      } else if (
        this.everything.orderCreatedBy === 'Administrator' &&
        localStorage.getItem('token') === 'Administrator'
      ) {
        this.showApproveButton = true;
        this.showRejectButton = true;
      } else if (
        (this.everything.orderCreatedBy === 'Customer' ||
          this.everything.orderCreatedBy === 'Sales Team') &&
        localStorage.getItem('token') === 'Administrator'
      ) {
        this.showApproveButton = true;
        this.showRejectButton = true;
      } else if (this.accessType == 'TManager') {
        this.stateBasedReadOnly = true;
        this.everythingReadOnly = true;
        this.showCustomer = true;
        this.showThis = false;
      } else {
        alert('Error from Order Created By Status Check');
      }
    } else if (
      this.everything.transactionStatus === 'Sample Initiated' &&
      (localStorage.getItem('token') === 'Administrator' ||
        localStorage.getItem('token') === 'Sample Head' ||
        localStorage.getItem('token') === 'Customer Service Team')
    ) {
      //Make certain fields Read Only
      this.stateBasedReadOnly = true;
      this.showSaveButton = false;
      this.showSampleInitiated = true;
      this.showAcceptOrderButton = true;
      this.showRejectOrderButton = true;
      this.showConfirmButton = false;
      this.showDownloadAsPDFButton = true;
      this.showSaveWithoutRegexButton = true;
    } else if (
      (this.everything.transactionStatus === 'Production' ||
        this.everything.transactionStatus === 'Sample Initiated' ||
        this.everything.transactionStatus === 'Rejection (Production)') &&
      (localStorage.getItem('token') === 'Customer' ||
        localStorage.getItem('token') === 'Sales Team')
    ) {
      //Make all fields Read Only
      this.stateBasedReadOnly = true;
      this.everythingReadOnly = true;

      this.showConfirmButton = false;
      this.showSaveButton = false;
      this.showArtWorkFileName = false;
      this.showAcceptOrderButton = false;
      this.showRejectOrderButton = false;
    } else if (
      this.everything.transactionStatus === 'Rejection (Production)' &&
      (localStorage.getItem('token') === 'Sample Head' ||
        localStorage.getItem('token') === 'Customer Service Team' ||
        localStorage.getItem('token') === 'Administrator')
    ) {
      this.showRejectionProduction = true;
      this.showConfirmButton = false;
      this.showSaveButton = false;
      this.showResubmitButton = true;
      this.showArtWorkFileName = false;
    } else if (
      this.everything.transactionStatus === 'Production' &&
      (localStorage.getItem('token') === 'Sample Head' ||
        localStorage.getItem('token') === 'Customer Service Team' ||
        localStorage.getItem('token') === 'Administrator')
    ) {
      //Make certain fields Read Only
      this.stateBasedReadOnly = true;
      this.showProduction = true;
      this.showConfirmButton = false;
      this.showSaveButton = false;
      this.showSaveWithoutRegexButton = true;
      this.showCompleteProductionButton = true;
      this.showDownloadAsPDFButton = true;
      this.showRejectButton = false;

      //Show Hidden Fields
      this.showThis = true;
    } else if (
      this.everything.transactionStatus === 'Quotation / Dispatch' &&
      (localStorage.getItem('token') === 'Sample Head' ||
        localStorage.getItem('token') === 'Customer Service Team' ||
        localStorage.getItem('token') === 'Administrator')
    ) {
      //Make certain fields Read Only
      this.stateBasedReadOnly = true;
      this.everythingReadOnly = true;

      this.showSaveWithoutRegexButton = true;
      this.showQuotationDispatch = true;
      this.showDownloadAsPDFButton = true;
      this.showConfirmButton = false;
      this.showSaveButton = false;
      // this.showAcceptButton = false;
      // this.showRejectButton = false;
      // this.showQuotationRejectButton = false;
      this.showSendForCustomerAcceptanceButton = true;

      //Show Hidden Fields
      this.showThis = true;

      //Show Quotation Form List
      this.showQuotationFormList = true;

      this.employeeService
        .getCustomerEmail(this.everything.email)
        .subscribe((data: Employee) => {
          this.everything.customerEmailRequired = data.customerEmail;

          if (
            localStorage.getItem('token') === 'Administrator' &&
            this.everything.customerEmailRequired == false &&
            this.everything.transactionStatus === 'Quotation / Dispatch'
          ) {
            this.showAcceptRejectForCustomerEmail = true;
            this.showAcceptButton = true;
            this.showQuotationRejectButton = true;
          } else if (this.everything.customerEmailRequired == null) {
            this._snackBar.open(
              "Please enable or disable the 'Email Notification Subscription' for the Respective Customer in the Customer Master",
              '',
              {
                duration: 4000,
                panelClass: ['snackbar1'],
                verticalPosition: 'top',
                horizontalPosition: 'center',
              }
            );
          }
        });
    } else if (
      this.everything.transactionStatus === 'Quotation / Dispatch' &&
      localStorage.getItem('token') === 'Customer'
    ) {
      //Make all fields Read Only
      this.stateBasedReadOnly = true;
      this.everythingReadOnly = true;
      this.makeQuotationReadOnly = true;

      this.showQuotationDispatch = true;
      this.showQuotationRejectButton = true;
      this.showDownloadAsPDFButton = true;
      this.showConfirmButton = false;
      this.showSaveButton = false;
      this.showAcceptButton = true;
      this.showSendForCustomerAcceptanceButton = false;
      this.showArtWorkFileName = false;

      this.employeeService
        .getCustomerEmail(this.everything.email)
        .subscribe((data: Employee) => {
          this.everything.customerEmailRequired = data.customerEmail;

          if (
            localStorage.getItem('token') === 'Customer' &&
            this.everything.customerEmailRequired == true &&
            this.everything.transactionStatus === 'Quotation / Dispatch'
          ) {
            this.showAcceptRejectForCustomerEmail = true;
            this.showAcceptButton = true;
            this.showQuotationRejectButton = true;
          }
        });
    } else if (
      this.everything.transactionStatus === 'Quotation / Dispatch' &&
      localStorage.getItem('token') === 'Sales Team'
    ) {
      //Make all fields Read Only
      this.stateBasedReadOnly = true;
      this.everythingReadOnly = true;
      this.makeQuotationReadOnly = true;

      this.showConfirmButton = false;
      this.showSaveButton = false;
      this.showArtWorkFileName = false;
      this.showAcceptOrderButton = false;
      this.showRejectOrderButton = false;
      this.showArtWorkFileName = false;
    } else if (this.everything.transactionStatus === 'Sample Approved') {
      if (
        localStorage.getItem('token') === 'Administrator' ||
        localStorage.getItem('token') === 'Sample Head'
      ) {
        this.showThis = true;
        this.showArtWorkFileName = true;
      } else if (this.accessType == 'TManager') {
        this.stateBasedReadOnly = true;
        this.everythingReadOnly = true;
        this.showCustomer = true;
        this.showThis = false;
        this.showAdminstrator = false;
        this.showSampleApproved = true;
      } else {
        this.showArtWorkFileName = false;
      }

      //Make certain fields Read Only
      this.stateBasedReadOnly = true;
      this.everythingReadOnly = true;
      this.makeQuotationReadOnly = true;

      this.showSampleApproved = true;
      this.showConfirmButton = false;
      this.showSaveButton = false;
    } else if (this.everything.transactionStatus === 'Sample Rejected') {
      //Make certain fields Read Only
      this.stateBasedReadOnly = true;
      this.everythingReadOnly = true;
      this.makeQuotationReadOnly = true;

      this.showSampleRejected = true;
      this.showConfirmButton = false;
      this.showSaveButton = false;
      this.showArtWorkFileName = false;
      this.showArtWorkFileName = false;
    } else if (
      (this.everything.transactionStatus === 'Sample Initiated' ||
        this.everything.transactionStatus === 'Rejection (Production)' ||
        this.everything.transactionStatus === 'Production' ||
        this.everything.transactionStatus == 'Quotation / Dispatch') &&
      this.accessType == 'TManager'
    ) {
      this.stateBasedReadOnly = true;
      this.everythingReadOnly = true;
      this.showCustomer = true;
      this.showThis = false;
      this.showAdminstrator = false;
      switch (this.everything.transactionStatus) {
        case 'Sample Initiated':
          this.showSampleInitiated = true;
          break;
        case 'Rejection (Production)':
          this.showRejectionProduction = true;
          break;
        case 'Production':
          this.showProduction = true;
          break;
        case 'Quotation / Dispatch':
          this.showQuotationDispatch = true;
          break;
        default:
          console.log('Invalid transaction status');
      }
    } else {
      alert('Error from Status Check');
    }
  }

  closeResult = '';

  openSnackBar(message: string, action: string) {
    this._snackBar.open('Submitted Successfully!', '', {
      duration: 2000,
      panelClass: ['snackbar1'],
      verticalPosition: 'top',
    });
  }

  showLoginModal() {
    document.getElementById('loginModal').click();
  }

  sendForCustomerAcceptanceMasterFunction() {
    this.sendForCustomerAcceptance();
  }

  sendForCustomerAcceptance() {
    //create first image

    const quote = document.getElementById('quote');
    const options = {
      background: 'white',
      scale: 2,
    };

    html2canvas(quote, options)
      .then((canvas) => {
        var img = canvas.toDataURL('image/PNG');
        var doc = new jsPDF('portrait', 'mm', 'a4', true);

        // Add image Canvas to PDF
        const bufferX = 5;
        const bufferY = 5;
        const imgProps = (<any>doc).getImageProperties(img);
        // const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        //Experimental
        var imgData = canvas.toDataURL('image/png');
        var imgWidth = 210;
        var pageHeight = 295;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        var heightLeft = imgHeight;
        // Commented for Size issues
        // var doc = new jsPDF('p', 'mm');
        var position = 0;

        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        //Experimental

        // doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 1);

        return doc;
      })

      .then((doc) => {
        // doc.save(this.everything.refNo);

        var blobPDF = new Blob([doc.output('blob')], {
          type: 'application/pdf',
        });
        var blobUrl = URL.createObjectURL(blobPDF);
        // window.open(blobUrl);

        this.hideUpload(blobPDF);
      });

    //Angular Delay
    // setTimeout(() =>
    // {
    //   this.saveEverythingSendForCustomerAcceptance();
    // },
    // 3000);
  }

  //Everything Create
  newEverything(): void {
    this.submitted = false;
    this.everything = new Everything();
  }

  transactionFormID: string;

  getPageURL() {
    this.dataset.pageURL = `${Configuration.domainURL}home/uforms/${this.transactionFormID}`;
  }

  singleOrderLine: OrderDetailsLineItem = new OrderDetailsLineItem();

  addTable() {
    this.everything.orderLineItem.push(this.singleOrderLine);
    this.singleOrderLine = new OrderDetailsLineItem();
  }

  deleteRow(x) {
    var delBtn = confirm('Are you sure you want to Delete this Line Item?');
    if (delBtn == true) {
      this.everything.orderLineItem.splice(x, 1);
    }
  }

  //Everything Save
  saveEverything() {
    if (this.orderConfirmed === true) {
      this.everything.orderConfirmationDate = this.test;
    }

    this.everything.sampleRecDateTime = this.everything.orderConfirmationDate;

    this.everything.length = this.everything.unitHeight;
    this.everything.width = this.everything.unitWidth;
    this.everything.widthPrinted = this.everything.unitWidthPrinted;
    this.everything.lengthPrinted = this.everything.unitHeightPrinted;

    this.everything.refNo = this.referencenumber;
    this.everything.transactionStatus;
    this.everythingService.createEverything(this.everything).subscribe(
      (data) => {
        var parsedinfo = JSON.parse(JSON.stringify(data));
        this.transactionFormID = parsedinfo.id;
        this.tempURL = `${Configuration.domainURL}home/uforms/${this.transactionFormID}`;
        if (this.sendEmailCheck) {
          this.sendEmail();
        }
        console.log(data);
      },
      (error) => console.log(error)
    );

    this._snackBar.open('Order Updated Successfully', '', {
      duration: 2000,
      panelClass: ['snackbar3'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });

    if (this.sendEmailCheck == false) {
      this.router.navigate(['/home/orders']);
    }
  }

  saveEverythingSampleHeadEmail() {
    if (this.orderConfirmed === true) {
      this.everything.orderConfirmationDate = this.test;
    }

    this.everything.sampleRecDateTime = this.everything.orderConfirmationDate;

    this.everything.length = this.everything.unitHeight;
    this.everything.width = this.everything.unitWidth;
    this.everything.widthPrinted = this.everything.unitWidthPrinted;
    this.everything.lengthPrinted = this.everything.unitHeightPrinted;

    this.everything.refNo = this.referencenumber;
    this.everything.transactionStatus;
    this.everythingService.createEverything(this.everything).subscribe(
      (data) => {
        var parsedinfo = JSON.parse(JSON.stringify(data));
        this.transactionFormID = parsedinfo.id;
        this.tempURL = `${Configuration.domainURL}home/uforms/${this.transactionFormID}`;
        this.getSampleHeadEmail();
        console.log(data);
      },
      (error) => console.log(error)
    );

    this._snackBar.open('Order Updated Successfully', '', {
      duration: 2000,
      panelClass: ['snackbar3'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  //Everything Save
  saveEverythingRejected() {
    if (this.orderConfirmed === true) {
      this.everything.orderConfirmationDate = this.test;
    }

    this.everything.sampleRecDateTime = this.everything.orderConfirmationDate;

    this.everything.length = this.everything.unitHeight;
    this.everything.width = this.everything.unitWidth;
    this.everything.widthPrinted = this.everything.unitWidthPrinted;
    this.everything.lengthPrinted = this.everything.unitHeightPrinted;

    this.everything.refNo = this.referencenumber;
    this.everything.transactionStatus;
    this.everythingService.createEverything(this.everything).subscribe(
      (data) => {
        var parsedinfo = JSON.parse(JSON.stringify(data));
        this.transactionFormID = parsedinfo.id;
        this.tempURL = `${Configuration.domainURL}home/uforms/${this.transactionFormID}`;
        this.sendRejectedEmail();
        console.log(data);
      },
      (error) => console.log(error)
    );

    this._snackBar.open('Order Updated Successfully', '', {
      duration: 2000,
      panelClass: ['snackbar3'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  //Everything Save
  saveEverythingWithoutRegex() {
    if (this.orderConfirmed === true) {
      this.everything.orderConfirmationDate = this.test;
    }

    this.everything.sampleRecDateTime = this.everything.orderConfirmationDate;

    this.everything.length = this.everything.unitHeight;
    this.everything.width = this.everything.unitWidth;
    this.everything.widthPrinted = this.everything.unitWidthPrinted;
    this.everything.lengthPrinted = this.everything.unitHeightPrinted;

    this.everything.refNo = this.referencenumber;
    this.everything.transactionStatus;
    this.everythingService.createEverything(this.everything).subscribe(
      (data) => {
        var parsedinfo = JSON.parse(JSON.stringify(data));
        this.transactionFormID = parsedinfo.id;
        this.tempURL = `${Configuration.domainURL}home/uforms/${this.transactionFormID}`;
        console.log(data);

        this.saveCostingData(true);
      },
      (error) => console.log(error)
    );

    this._snackBar.open('Order Updated Successfully', '', {
      duration: 2000,
      panelClass: ['snackbar3'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  saveEverythingSendForCustomerAcceptance() {
    if (this.orderConfirmed === true) {
      this.everything.orderConfirmationDate = this.test;
    }

    this.everything.sampleRecDateTime = this.everything.orderConfirmationDate;

    this.everything.length = this.everything.unitHeight;
    this.everything.width = this.everything.unitWidth;
    this.everything.widthPrinted = this.everything.unitWidthPrinted;
    this.everything.lengthPrinted = this.everything.unitHeightPrinted;

    this.everything.refNo = this.referencenumber;
    this.everything.sendForCustomerAcceptanceClicked = 'true';
    this.everything.transactionStatus;
    this.everythingService.createEverything(this.everything).subscribe(
      (data) => {
        var parsedinfo = JSON.parse(JSON.stringify(data));
        this.transactionFormID = parsedinfo.id;
        this.tempURL = `${Configuration.domainURL}home/uforms/${this.transactionFormID}`;
        this.saveCostingData(true);
        this.sendCustomerEmailWithAttachment();

        console.log(data);
      },
      (error) => console.log(error)
    );

    this._snackBar.open('Order Updated Successfully', '', {
      duration: 2000,
      panelClass: ['snackbar3'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  tempURL: string;

  loginAuthenticationInitialisation() {
    //Login Authentication
    this.loginForm = this.formBuilder.group({
      userid: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.reloadData();
  }

  //Everything Reload Data
  reloadData() {
    this.everythingObs = this.everythingService.getEverythingList();
    this.everythingNewObs = this.everythingService.getEverythingSingleID(
      this.id
    );
    this.productReferenceObservable =
      this.theProductService.getProductReferenceList();
    this.munits = this.munitService.getMunitsList();
    this.mcolors = this.mcolorService.getMcolorsList();
    this.mlabeltypes = this.mlabeltypeService.getMlabeltypesList();
    this.Users = this.LoginService.getLoginList();
  }

  //Everything Reset Form
  resetFormEverything() {
    this.everything = new Everything();
  }

  //Everything Delete
  deleteEverything(id: number) {
    this.everythingService.deleteEverything(id).subscribe(
      (data) => {
        this.reloadData();
      },
      (error) => console.log(error)
    );

    this.router.navigate(['/home/orders']);
  }

  //On Submit Everything
  onSubmitEverything() {
    this.saveEverything();
  }

  //Everything Update
  updateEverything() {
    // this.id = id;

    this.everything = new Everything();

    this.everythingService.getEverything(this.id).subscribe(
      (data) => {
        this.everything = data;
      },
      (error) => console.log(error)
    );
  }

  checkUploadRegex1(event) {
    let regexpNumber = new RegExp('^[a-zA-Z0-9-_ ]+$');

    let regexTester;

    regexTester = event.target.files[0].name.split('.').slice(0, -1).join('.');

    if (regexpNumber.test(regexTester) == false) {
      this._snackBar.open(
        'Please Upload a File without any Special Characters',
        '',
        {
          duration: 2000,
          panelClass: ['snackbar1'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        }
      );
    } else {
      this.selectFile1(event);
    }
  }

  checkUploadRegex2(event) {
    let regexpNumber = new RegExp('^[a-zA-Z0-9-_ ]+$');

    let regexTester;

    regexTester = event.target.files[0].name.split('.').slice(0, -1).join('.');

    if (regexpNumber.test(regexTester) == false) {
      this._snackBar.open(
        'Please Upload a File without any Special Characters',
        '',
        {
          duration: 2000,
          panelClass: ['snackbar1'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        }
      );
    } else {
      this.selectFile2(event);
    }
  }

  checkUploadRegex3(event) {
    let regexpNumber = new RegExp('^[a-zA-Z0-9-_ ]+$');

    let regexTester;

    regexTester = event.target.files[0].name.split('.').slice(0, -1).join('.');

    if (regexpNumber.test(regexTester) == false) {
      this._snackBar.open(
        'Please Upload a File without any Special Characters',
        '',
        {
          duration: 2000,
          panelClass: ['snackbar1'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        }
      );
    } else {
      this.selectFile3(event);
    }
  }

  checkUploadRegex4(event) {
    let regexpNumber = new RegExp('^[a-zA-Z0-9-_ ]+$');

    let regexTester;

    regexTester = event.target.files[0].name.split('.').slice(0, -1).join('.');

    if (regexpNumber.test(regexTester) == false) {
      this._snackBar.open(
        'Please Upload a File without any Special Characters',
        '',
        {
          duration: 2000,
          panelClass: ['snackbar1'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        }
      );
    } else {
      this.selectFile4(event);
    }
  }

  //PRODUCT REFERENCE LOGIC START
  //.............................
  //.............................
  //.............................
  //.............................
  //.............................
  //.............................
  //.............................

  printpostData(printNum: number) {
    //PRINTED

    this.printnext = printNum + 1;

    this.http
      .post(`${Configuration.apiURL}api/master/productreference`, {
        printcolorname: this.printcolorname,
        printreferencenumber: this.printreferencenumber,
        printNum,
        printnext: this.printnext,
      })
      .toPromise()
      .then((data: any) => {});
  }

  tagpostData(tagNum: number) {
    this.tagnext = tagNum + 1;

    this.http
      .post(`${Configuration.apiURL}api/master/productreference`, {
        tagcolorname: this.tagcolorname,

        tagreferencenumber: this.tagreferencenumber,

        tagNum,

        tagnext: this.tagnext,
      })
      .toPromise()
      .then((data: any) => {});
  }

  stickerpostData(stickerNum: number) {
    this.stickernext = stickerNum + 1;

    this.http
      .post(`${Configuration.apiURL}api/master/productreference`, {
        stickercolorname: this.stickercolorname,

        stickerreferencenumber: this.stickerreferencenumber,

        stickerNum,

        stickernext: this.stickernext,
      })
      .toPromise()
      .then((data: any) => {});
  }

  wovenpostData(wovenNum: number) {
    this.wovennext = wovenNum + 1;

    this.http
      .post(`${Configuration.apiURL}api/master/productreference`, {
        wovencolorname: this.wovencolorname,

        wovenreferencenumber: this.wovenreferencenumber,

        wovenNum,

        wovennext: this.wovennext,
      })
      .toPromise()
      .then((data: any) => {});
  }

  resetForm() {
    this.productReference = new productReferenceTS();
    this.everything = new Everything();
  }

  tempUploadData = [];
  tempUploadData2 = [];
  tempUploadData3 = [];
  tempUploadData4 = [];
  tempUploadData5 = [];
  tempUploadData6 = [];
  public showEmptyMessage: boolean = false;

  //Normal Save with Rejex For ADMIN RIGHTS(Woven)

  checkAdminWoven() {
    if (
      this.everything.sampName == undefined ||
      this.everything.sampName == '' ||
      this.everything.sampName == null
    ) {
      this._snackBar.open('Please Fill Sample Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampType == undefined ||
      this.everything.sampType == '' ||
      this.everything.sampType == null
    ) {
      this._snackBar.open('Please Fill Sample Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.name == undefined ||
      this.everything.name == '' ||
      this.everything.name == null
    ) {
      this._snackBar.open('Please Fill Customer Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.contactPerson == undefined ||
      this.everything.contactPerson == '' ||
      this.everything.contactPerson == null
    ) {
      this._snackBar.open('Please Fill Contact Person', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.phone == undefined ||
      this.everything.phone == '' ||
      this.everything.phone == null
    ) {
      this._snackBar.open('Please Fill Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.email == undefined ||
      this.everything.email == '' ||
      this.everything.email == null
    ) {
      this._snackBar.open('Please Fill valid EmailId', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.orderType == undefined ||
      this.everything.orderType == '' ||
      this.everything.orderType == null
    ) {
      this._snackBar.open('Please Fill Order Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedDate == undefined ||
      this.everything.expectedDate == '' ||
      this.everything.expectedDate == null
    ) {
      this._snackBar.open('Please Fill Expected Date', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.approvalType == undefined ||
      this.everything.approvalType == '' ||
      this.everything.approvalType == null
    ) {
      this._snackBar.open('Please Fill Approval Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.labelType == undefined ||
      this.everything.labelType == '' ||
      this.everything.labelType == null
    ) {
      this._snackBar.open('Please Fill Label Type for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unit == undefined ||
      this.everything.unit == '' ||
      this.everything.unit == null
    ) {
      this._snackBar.open('Please Fill Unit  for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitHeight == undefined ||
      this.everything.unitHeight == '' ||
      this.everything.unitHeight == null
    ) {
      this._snackBar.open('Please Fill Unit Height for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitWidth == undefined ||
      this.everything.unitWidth == '' ||
      this.everything.unitWidth == null
    ) {
      this._snackBar.open('Please Fill Unit Width for woven ', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedQuantity == undefined ||
      this.everything.expectedQuantity == '' ||
      this.everything.expectedQuantity == null
    ) {
      this._snackBar.open('Invalid Expected Quantity woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.color == undefined ||
      this.everything.color == '' ||
      this.everything.color == null
    ) {
      this._snackBar.open('Please Fill Color for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.folding == undefined ||
      this.everything.folding == '' ||
      this.everything.folding == null
    ) {
      this._snackBar.open('Please Fill Folding for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.finishing == undefined ||
      this.everything.finishing == '' ||
      this.everything.finishing == null
    ) {
      this._snackBar.open('Please Fill Finishing for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampName == undefined ||
      this.everything.sampName == '' ||
      this.everything.sampName == null
    ) {
      this._snackBar.open('Please Fill Sample Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampType == undefined ||
      this.everything.sampType == '' ||
      this.everything.sampType == null
    ) {
      this._snackBar.open('Please Fill Sample Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.name == undefined ||
      this.everything.name == '' ||
      this.everything.name == null
    ) {
      this._snackBar.open('Please Fill Customer Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.contactPerson == undefined ||
      this.everything.contactPerson == '' ||
      this.everything.contactPerson == null
    ) {
      this._snackBar.open('Please Fill Contact Person', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.phone == undefined ||
      this.everything.phone == '' ||
      this.everything.phone == null
    ) {
      this._snackBar.open('Please Fill Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.email == undefined ||
      this.everything.email == '' ||
      this.everything.email == null
    ) {
      this._snackBar.open('Please Fill valid EmailId', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.orderType == undefined ||
      this.everything.orderType == '' ||
      this.everything.orderType == null
    ) {
      this._snackBar.open('Please Fill Order Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedDate == undefined ||
      this.everything.expectedDate == '' ||
      this.everything.expectedDate == null
    ) {
      this._snackBar.open('Please Fill Expected Date', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.approvalType == undefined ||
      this.everything.approvalType == '' ||
      this.everything.approvalType == null
    ) {
      this._snackBar.open('Please Fill Approval Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.labelType == undefined ||
      this.everything.labelType == '' ||
      this.everything.labelType == null
    ) {
      this._snackBar.open('Please Fill Label Type for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unit == undefined ||
      this.everything.unit == '' ||
      this.everything.unit == null
    ) {
      this._snackBar.open('Please Fill Unit  for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitHeight == undefined ||
      this.everything.unitHeight == '' ||
      this.everything.unitHeight == null
    ) {
      this._snackBar.open('Please Fill Unit Height for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitWidth == undefined ||
      this.everything.unitWidth == '' ||
      this.everything.unitWidth == null
    ) {
      this._snackBar.open('Please Fill Unit Width for woven ', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedQuantity == undefined ||
      this.everything.expectedQuantity == '' ||
      this.everything.expectedQuantity == null
    ) {
      this._snackBar.open('Invalid Expected Quantity woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.color == undefined ||
      this.everything.color == '' ||
      this.everything.color == null
    ) {
      this._snackBar.open('Please Fill Color for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.folding == undefined ||
      this.everything.folding == '' ||
      this.everything.folding == null
    ) {
      this._snackBar.open('Please Fill Folding for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.finishing == undefined ||
      this.everything.finishing == '' ||
      this.everything.finishing == null
    ) {
      this._snackBar.open('Please Fill Finishing for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    //Office Use and CAD Entry
    else if (
      this.everything.incoming == undefined ||
      this.everything.incoming == '' ||
      this.everything.incoming == null
    ) {
      this._snackBar.open('Please Fill Incoming Date for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.dispatchDateTime == undefined ||
      this.everything.dispatchDateTime == '' ||
      this.everything.dispatchDateTime == null
    ) {
      this._snackBar.open('Please Fill Dispatch Date/Time for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // pls dont remove the status
    // else if(this.everything.status == undefined || this.intPlusFloat98.invalid && this.intPlusFloat98.touched)
    // {
    //   this._snackBar.open("Please Fill Status for woven", "", {
    //     duration: 2000,
    //     panelClass: ['snackbar1'],
    //     verticalPosition: "top",
    //     horizontalPosition: "center"
    //   });
    // }
    else if (
      this.everything.pcm == undefined ||
      this.everything.pcm == '' ||
      this.everything.pcm == null
    ) {
      this._snackBar.open('Please Fill P/CM', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.noOfRepeats == undefined ||
      this.everything.noOfRepeats == '' ||
      this.everything.noOfRepeats == null
    ) {
      this._snackBar.open('Please Fill No Of Repeats', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.system == undefined ||
      this.everything.system == '' ||
      this.everything.system == null
    ) {
      this._snackBar.open('Please Fill System for Woven ', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.designer == undefined ||
      this.everything.designer == '' ||
      this.everything.designer == null
    ) {
      this._snackBar.open('Please Fill Designer', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.machine == undefined ||
      this.everything.machine == '' ||
      this.everything.machine == null
    ) {
      this._snackBar.open('Please Fill Machine', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.totalpicks == undefined ||
      this.everything.totalpicks == '' ||
      this.everything.totalpicks == null
    ) {
      this._snackBar.open('Please Fill the Total Picks', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else if( this.everything.width == undefined || this.everything.width == "" || this.everything.width== null)
    // {
    //   this._snackBar.open("Please Fill Width", "", {
    //     duration: 2000,
    //     panelClass: ['snackbar1'],
    //     verticalPosition: "top",
    //     horizontalPosition: "center"
    //   });
    // }

    // else if( this.everything.length == undefined || this.everything.length == "" || this.everything.length== null)
    // {
    //     this._snackBar.open("Please Fill Length", "", {
    //       duration: 2000,
    //       panelClass: ['snackbar1'],
    //       verticalPosition: "top",
    //       horizontalPosition: "center"
    //     });
    // }
    else if (
      this.everything.quality == undefined ||
      this.everything.quality == '' ||
      this.everything.quality == null
    ) {
      this._snackBar.open('Please Fill Quality', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.x == undefined ||
      this.everything.x == '' ||
      this.everything.x == null
    ) {
      this._snackBar.open('Please Fill X', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.colorOptionToBeUsed == undefined ||
      this.everything.colorOptionToBeUsed == '' ||
      this.everything.colorOptionToBeUsed == null
    ) {
      this._snackBar.open('Please Fill Color Option To be used', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.y == undefined ||
      this.everything.y == '' ||
      this.everything.y == null
    ) {
      this._snackBar.open('Please Fill Y', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.additionalWork == undefined ||
      this.everything.additionalWork == '' ||
      this.everything.additionalWork == null
    ) {
      this._snackBar.open('Please Fill Additional Work for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.wastage == undefined ||
      this.everything.wastage == '' ||
      this.everything.wastage == null
    ) {
      this._snackBar.open('Please Fill Wastage', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.colorMatching == undefined ||
      this.everything.colorMatching == '' ||
      this.everything.colorMatching == null
    ) {
      this._snackBar.open('Please Fill Color Matching', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.warpTension == undefined ||
      this.everything.warpTension == '' ||
      this.everything.warpTension == null
    ) {
      this._snackBar.open('Please Fill Warp Tension', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else {
      this.onSubmitEverything();
    }
  }

  //Normal Save with Rejex For CUSTOMER RIGHTS(Woven)

  checkCustomerWoven() {
    if (
      this.everything.sampName == undefined ||
      this.everything.sampName == '' ||
      this.everything.sampName == null
    ) {
      this._snackBar.open('Please Fill Sample Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampType == undefined ||
      this.everything.sampType == '' ||
      this.everything.sampType == null
    ) {
      this._snackBar.open('Please Fill Sample Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.name == undefined ||
      this.everything.name == '' ||
      this.everything.name == null
    ) {
      this._snackBar.open('Please Fill Customer Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.contactPerson == undefined ||
      this.everything.contactPerson == '' ||
      this.everything.contactPerson == null
    ) {
      this._snackBar.open('Please Fill Contact Person', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.phone == undefined ||
      this.everything.phone == '' ||
      this.everything.phone == null
    ) {
      this._snackBar.open('Please Fill Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.email == undefined ||
      this.everything.email == '' ||
      this.everything.email == null
    ) {
      this._snackBar.open('Please Fill valid EmailId', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.orderType == undefined ||
      this.everything.orderType == '' ||
      this.everything.orderType == null
    ) {
      this._snackBar.open('Please Fill Order Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedDate == undefined ||
      this.everything.expectedDate == '' ||
      this.everything.expectedDate == null
    ) {
      this._snackBar.open('Please Fill Expected Date', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.approvalType == undefined ||
      this.everything.approvalType == '' ||
      this.everything.approvalType == null
    ) {
      this._snackBar.open('Please Fill Approval Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.labelType == undefined ||
      this.everything.labelType == '' ||
      this.everything.labelType == null
    ) {
      this._snackBar.open('Please Fill Label Type for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unit == undefined ||
      this.everything.unit == '' ||
      this.everything.unit == null
    ) {
      this._snackBar.open('Please Fill Unit  for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitHeight == undefined ||
      this.everything.unitHeight == '' ||
      this.everything.unitHeight == null
    ) {
      this._snackBar.open('Please Fill Unit Height for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitWidth == undefined ||
      this.everything.unitWidth == '' ||
      this.everything.unitWidth == null
    ) {
      this._snackBar.open('Please Fill Unit Width for woven ', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedQuantity == undefined ||
      this.everything.expectedQuantity == '' ||
      this.everything.expectedQuantity == null
    ) {
      this._snackBar.open('Invalid Expected Quantity woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.color == undefined ||
      this.everything.color == '' ||
      this.everything.color == null
    ) {
      this._snackBar.open('Please Fill Color for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.finishing == undefined ||
      this.everything.finishing == '' ||
      this.everything.finishing == null
    ) {
      this._snackBar.open('Please Fill Finishing for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampName == undefined ||
      this.everything.sampName == '' ||
      this.everything.sampName == null
    ) {
      this._snackBar.open('Please Fill Sample Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampType == undefined ||
      this.everything.sampType == '' ||
      this.everything.sampType == null
    ) {
      this._snackBar.open('Please Fill Sample Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.name == undefined ||
      this.everything.name == '' ||
      this.everything.name == null
    ) {
      this._snackBar.open('Please Fill Customer Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.contactPerson == undefined ||
      this.everything.contactPerson == '' ||
      this.everything.contactPerson == null
    ) {
      this._snackBar.open('Please Fill Contact Person', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.phone == undefined ||
      this.everything.phone == '' ||
      this.everything.phone == null
    ) {
      this._snackBar.open('Please Fill Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.email == undefined ||
      this.everything.email == '' ||
      this.everything.email == null
    ) {
      this._snackBar.open('Please Fill valid EmailId', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.orderType == undefined ||
      this.everything.orderType == '' ||
      this.everything.orderType == null
    ) {
      this._snackBar.open('Please Fill Order Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedDate == undefined ||
      this.everything.expectedDate == '' ||
      this.everything.expectedDate == null
    ) {
      this._snackBar.open('Please Fill Expected Date', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.approvalType == undefined ||
      this.everything.approvalType == '' ||
      this.everything.approvalType == null
    ) {
      this._snackBar.open('Please Fill Approval Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.labelType == undefined ||
      this.everything.labelType == '' ||
      this.everything.labelType == null
    ) {
      this._snackBar.open('Please Fill Label Type for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unit == undefined ||
      this.everything.unit == '' ||
      this.everything.unit == null
    ) {
      this._snackBar.open('Please Fill Unit  for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitHeight == undefined ||
      this.everything.unitHeight == '' ||
      this.everything.unitHeight == null
    ) {
      this._snackBar.open('Please Fill Unit Height for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitWidth == undefined ||
      this.everything.unitWidth == '' ||
      this.everything.unitWidth == null
    ) {
      this._snackBar.open('Please Fill Unit Width for woven ', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedQuantity == undefined ||
      this.everything.expectedQuantity == '' ||
      this.everything.expectedQuantity == null
    ) {
      this._snackBar.open('Invalid Expected Quantity woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.color == undefined ||
      this.everything.color == '' ||
      this.everything.color == null
    ) {
      this._snackBar.open('Please Fill Color for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.folding == undefined ||
      this.everything.folding == '' ||
      this.everything.folding == null
    ) {
      this._snackBar.open('Please Fill Folding for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.finishing == undefined ||
      this.everything.finishing == '' ||
      this.everything.finishing == null
    ) {
      this._snackBar.open('Please Fill Finishing for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else {
      this.onSubmitEverything();
    }
  }

  //Woven - confirmation and special button (for admin)
  checkAdminWovenUpdate() {
    if (
      this.everything.sampName == undefined ||
      this.everything.sampName == '' ||
      this.everything.sampName == null
    ) {
      this._snackBar.open('Please Fill Sample Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampType == undefined ||
      this.everything.sampType == '' ||
      this.everything.sampType == null
    ) {
      this._snackBar.open('Please Fill Sample Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.name == undefined ||
      this.everything.name == '' ||
      this.everything.name == null
    ) {
      this._snackBar.open('Please Fill Customer Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.contactPerson == undefined ||
      this.everything.contactPerson == '' ||
      this.everything.contactPerson == null
    ) {
      this._snackBar.open('Please Fill Contact Person', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.phone == undefined ||
      this.everything.phone == '' ||
      this.everything.phone == null
    ) {
      this._snackBar.open('Please Fill Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.email == undefined ||
      this.everything.email == '' ||
      this.everything.email == null
    ) {
      this._snackBar.open('Please Fill valid EmailId', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.orderType == undefined ||
      this.everything.orderType == '' ||
      this.everything.orderType == null
    ) {
      this._snackBar.open('Please Fill Order Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedDate == undefined ||
      this.everything.expectedDate == '' ||
      this.everything.expectedDate == null
    ) {
      this._snackBar.open('Please Fill Expected Date', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.approvalType == undefined ||
      this.everything.approvalType == '' ||
      this.everything.approvalType == null
    ) {
      this._snackBar.open('Please Fill Approval Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.labelType == undefined ||
      this.everything.labelType == '' ||
      this.everything.labelType == null
    ) {
      this._snackBar.open('Please Fill Label Type for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unit == undefined ||
      this.everything.unit == '' ||
      this.everything.unit == null
    ) {
      this._snackBar.open('Please Fill Unit  for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitHeight == undefined ||
      this.everything.unitHeight == '' ||
      this.everything.unitHeight == null
    ) {
      this._snackBar.open('Please Fill Unit Height for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitWidth == undefined ||
      this.everything.unitWidth == '' ||
      this.everything.unitWidth == null
    ) {
      this._snackBar.open('Please Fill Unit Width for woven ', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedQuantity == undefined ||
      this.everything.expectedQuantity == '' ||
      this.everything.expectedQuantity == null
    ) {
      this._snackBar.open('Invalid Expected Quantity woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.color == undefined ||
      this.everything.color == '' ||
      this.everything.color == null
    ) {
      this._snackBar.open('Please Fill Color for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.folding == undefined ||
      this.everything.folding == '' ||
      this.everything.folding == null
    ) {
      this._snackBar.open('Please Fill Folding for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.finishing == undefined ||
      this.everything.finishing == '' ||
      this.everything.finishing == null
    ) {
      this._snackBar.open('Please Fill Finishing for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampName == undefined ||
      this.everything.sampName == '' ||
      this.everything.sampName == null
    ) {
      this._snackBar.open('Please Fill Sample Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampType == undefined ||
      this.everything.sampType == '' ||
      this.everything.sampType == null
    ) {
      this._snackBar.open('Please Fill Sample Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.name == undefined ||
      this.everything.name == '' ||
      this.everything.name == null
    ) {
      this._snackBar.open('Please Fill Customer Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.contactPerson == undefined ||
      this.everything.contactPerson == '' ||
      this.everything.contactPerson == null
    ) {
      this._snackBar.open('Please Fill Contact Person', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.phone == undefined ||
      this.everything.phone == '' ||
      this.everything.phone == null
    ) {
      this._snackBar.open('Please Fill Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.email == undefined ||
      this.everything.email == '' ||
      this.everything.email == null
    ) {
      this._snackBar.open('Please Fill valid EmailId', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.orderType == undefined ||
      this.everything.orderType == '' ||
      this.everything.orderType == null
    ) {
      this._snackBar.open('Please Fill Order Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedDate == undefined ||
      this.everything.expectedDate == '' ||
      this.everything.expectedDate == null
    ) {
      this._snackBar.open('Please Fill Expected Date', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.approvalType == undefined ||
      this.everything.approvalType == '' ||
      this.everything.approvalType == null
    ) {
      this._snackBar.open('Please Fill Approval Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.labelType == undefined ||
      this.everything.labelType == '' ||
      this.everything.labelType == null
    ) {
      this._snackBar.open('Please Fill Label Type for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unit == undefined ||
      this.everything.unit == '' ||
      this.everything.unit == null
    ) {
      this._snackBar.open('Please Fill Unit  for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitHeight == undefined ||
      this.everything.unitHeight == '' ||
      this.everything.unitHeight == null
    ) {
      this._snackBar.open('Please Fill Unit Height for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitWidth == undefined ||
      this.everything.unitWidth == '' ||
      this.everything.unitWidth == null
    ) {
      this._snackBar.open('Please Fill Unit Width for woven ', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedQuantity == undefined ||
      this.everything.expectedQuantity == '' ||
      this.everything.expectedQuantity == null
    ) {
      this._snackBar.open('Invalid Expected Quantity woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.color == undefined ||
      this.everything.color == '' ||
      this.everything.color == null
    ) {
      this._snackBar.open('Please Fill Color for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.folding == undefined ||
      this.everything.folding == '' ||
      this.everything.folding == null
    ) {
      this._snackBar.open('Please Fill Folding for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.finishing == undefined ||
      this.everything.finishing == '' ||
      this.everything.finishing == null
    ) {
      this._snackBar.open('Please Fill Finishing for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    //Office Use and CAD Entry
    else if (
      this.everything.incoming == undefined ||
      this.everything.incoming == '' ||
      this.everything.incoming == null
    ) {
      this._snackBar.open('Please Fill Incoming Date for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.dispatchDateTime == undefined ||
      this.everything.dispatchDateTime == '' ||
      this.everything.dispatchDateTime == null
    ) {
      this._snackBar.open('Please Fill Dispatch Date/Time for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // pls dont remove the status
    // else if(this.everything.status == undefined || this.intPlusFloat98.invalid && this.intPlusFloat98.touched)
    // {
    //   this._snackBar.open("Please Fill Status for woven", "", {
    //     duration: 2000,
    //     panelClass: ['snackbar1'],
    //     verticalPosition: "top",
    //     horizontalPosition: "center"
    //   });
    // }
    else if (
      this.everything.pcm == undefined ||
      this.everything.pcm == '' ||
      this.everything.pcm == null
    ) {
      this._snackBar.open('Please Fill P/CM', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.noOfRepeats == undefined ||
      this.everything.noOfRepeats == '' ||
      this.everything.noOfRepeats == null
    ) {
      this._snackBar.open('Please Fill No Of Repeats', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.system == undefined ||
      this.everything.system == '' ||
      this.everything.system == null
    ) {
      this._snackBar.open('Please Fill System for Woven ', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.designer == undefined ||
      this.everything.designer == '' ||
      this.everything.designer == null
    ) {
      this._snackBar.open('Please Fill Designer', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.machine == undefined ||
      this.everything.machine == '' ||
      this.everything.machine == null
    ) {
      this._snackBar.open('Please Fill Machine', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.totalpicks == undefined ||
      this.everything.totalpicks == '' ||
      this.everything.totalpicks == null
    ) {
      this._snackBar.open('Please Fill the Total Picks', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else if( this.everything.width == undefined || this.everything.width == "" || this.everything.width== null)
    // {
    // this._snackBar.open("Please Fill Width", "", {
    //   duration: 2000,
    //   panelClass: ['snackbar1'],
    //   verticalPosition: "top",
    //   horizontalPosition: "center"
    // });
    // }

    // else if( this.everything.length == undefined || this.everything.length == "" || this.everything.length== null)
    // {
    //     this._snackBar.open("Please Fill Length", "", {
    //       duration: 2000,
    //       panelClass: ['snackbar1'],
    //       verticalPosition: "top",
    //       horizontalPosition: "center"
    //     });
    // }
    else if (
      this.everything.quality == undefined ||
      this.everything.quality == '' ||
      this.everything.quality == null
    ) {
      this._snackBar.open('Please Fill Quality', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.x == undefined ||
      this.everything.x == '' ||
      this.everything.x == null
    ) {
      this._snackBar.open('Please Fill X', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.colorOptionToBeUsed == undefined ||
      this.everything.colorOptionToBeUsed == '' ||
      this.everything.colorOptionToBeUsed == null
    ) {
      this._snackBar.open('Please Fill Color Option To be used', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.y == undefined ||
      this.everything.y == '' ||
      this.everything.y == null
    ) {
      this._snackBar.open('Please Fill Y', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.additionalWork == undefined ||
      this.everything.additionalWork == '' ||
      this.everything.additionalWork == null
    ) {
      this._snackBar.open('Please Fill Additional Work for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.wastage == undefined ||
      this.everything.wastage == '' ||
      this.everything.wastage == null
    ) {
      this._snackBar.open('Please Fill Wastage', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.colorMatching == undefined ||
      this.everything.colorMatching == '' ||
      this.everything.colorMatching == null
    ) {
      this._snackBar.open('Please Fill Color Matching', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.warpTension == undefined ||
      this.everything.warpTension == '' ||
      this.everything.warpTension == null
    ) {
      this._snackBar.open('Please Fill Warp Tension', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.imageAttachmentIsUploaded == false) {
      this._snackBar.open('Please Upload the Image Attachment', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.scannedSampleIsUploaded == false) {
      this._snackBar.open('Please Upload the Scanned Sample', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else {
      this.updateStatus();
    }
  }

  //Woven - confirmation and special button (for Customer)
  checkCustomerWovenUpdate() {
    if (
      this.everything.sampName == undefined ||
      this.everything.sampName == '' ||
      this.everything.sampName == null
    ) {
      this._snackBar.open('Please Fill Sample Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampType == undefined ||
      this.everything.sampType == '' ||
      this.everything.sampType == null
    ) {
      this._snackBar.open('Please Fill Sample Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.name == undefined ||
      this.everything.name == '' ||
      this.everything.name == null
    ) {
      this._snackBar.open('Please Fill Customer Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.contactPerson == undefined ||
      this.everything.contactPerson == '' ||
      this.everything.contactPerson == null
    ) {
      this._snackBar.open('Please Fill Contact Person', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.phone == undefined ||
      this.everything.phone == '' ||
      this.everything.phone == null
    ) {
      this._snackBar.open('Please Fill Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.email == undefined ||
      this.everything.email == '' ||
      this.everything.email == null
    ) {
      this._snackBar.open('Please Fill valid EmailId', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.orderType == undefined ||
      this.everything.orderType == '' ||
      this.everything.orderType == null
    ) {
      this._snackBar.open('Please Fill Order Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedDate == undefined ||
      this.everything.expectedDate == '' ||
      this.everything.expectedDate == null
    ) {
      this._snackBar.open('Please Fill Expected Date', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.approvalType == undefined ||
      this.everything.approvalType == '' ||
      this.everything.approvalType == null
    ) {
      this._snackBar.open('Please Fill Approval Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.labelType == undefined ||
      this.everything.labelType == '' ||
      this.everything.labelType == null
    ) {
      this._snackBar.open('Please Fill Label Type for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unit == undefined ||
      this.everything.unit == '' ||
      this.everything.unit == null
    ) {
      this._snackBar.open('Please Fill Unit  for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitHeight == undefined ||
      this.everything.unitHeight == '' ||
      this.everything.unitHeight == null
    ) {
      this._snackBar.open('Please Fill Unit Height for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitWidth == undefined ||
      this.everything.unitWidth == '' ||
      this.everything.unitWidth == null
    ) {
      this._snackBar.open('Please Fill Unit Width for woven ', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedQuantity == undefined ||
      this.everything.expectedQuantity == '' ||
      this.everything.expectedQuantity == null
    ) {
      this._snackBar.open('Invalid Expected Quantity woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.color == undefined ||
      this.everything.color == '' ||
      this.everything.color == null
    ) {
      this._snackBar.open('Please Fill Color for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.folding == undefined ||
      this.everything.folding == '' ||
      this.everything.folding == null
    ) {
      this._snackBar.open('Please Fill Folding for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.finishing == undefined ||
      this.everything.finishing == '' ||
      this.everything.finishing == null
    ) {
      this._snackBar.open('Please Fill Finishing for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampName == undefined ||
      this.everything.sampName == '' ||
      this.everything.sampName == null
    ) {
      this._snackBar.open('Please Fill Sample Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampType == undefined ||
      this.everything.sampType == '' ||
      this.everything.sampType == null
    ) {
      this._snackBar.open('Please Fill Sample Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.name == undefined ||
      this.everything.name == '' ||
      this.everything.name == null
    ) {
      this._snackBar.open('Please Fill Customer Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.contactPerson == undefined ||
      this.everything.contactPerson == '' ||
      this.everything.contactPerson == null
    ) {
      this._snackBar.open('Please Fill Contact Person', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.phone == undefined ||
      this.everything.phone == '' ||
      this.everything.phone == null
    ) {
      this._snackBar.open('Please Fill Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.email == undefined ||
      this.everything.email == '' ||
      this.everything.email == null
    ) {
      this._snackBar.open('Please Fill valid EmailId', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.orderType == undefined ||
      this.everything.orderType == '' ||
      this.everything.orderType == null
    ) {
      this._snackBar.open('Please Fill Order Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedDate == undefined ||
      this.everything.expectedDate == '' ||
      this.everything.expectedDate == null
    ) {
      this._snackBar.open('Please Fill Expected Date', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.approvalType == undefined ||
      this.everything.approvalType == '' ||
      this.everything.approvalType == null
    ) {
      this._snackBar.open('Please Fill Approval Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.labelType == undefined ||
      this.everything.labelType == '' ||
      this.everything.labelType == null
    ) {
      this._snackBar.open('Please Fill Label Type for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unit == undefined ||
      this.everything.unit == '' ||
      this.everything.unit == null
    ) {
      this._snackBar.open('Please Fill Unit  for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitHeight == undefined ||
      this.everything.unitHeight == '' ||
      this.everything.unitHeight == null
    ) {
      this._snackBar.open('Please Fill Unit Height for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitWidth == undefined ||
      this.everything.unitWidth == '' ||
      this.everything.unitWidth == null
    ) {
      this._snackBar.open('Please Fill Unit Width for woven ', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedQuantity == undefined ||
      this.everything.expectedQuantity == '' ||
      this.everything.expectedQuantity == null
    ) {
      this._snackBar.open('Invalid Expected Quantity woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.color == undefined ||
      this.everything.color == '' ||
      this.everything.color == null
    ) {
      this._snackBar.open('Please Fill Color for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.folding == undefined ||
      this.everything.folding == '' ||
      this.everything.folding == null
    ) {
      this._snackBar.open('Please Fill Folding for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.finishing == undefined ||
      this.everything.finishing == '' ||
      this.everything.finishing == null
    ) {
      this._snackBar.open('Please Fill Finishing for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else {
      this.updateStatus();
    }
  }

  //Normal Save with Rejex For ADMIN RIGHTS(Tag)

  checkAdminTag() {
    if (
      this.everything.sampName == undefined ||
      this.everything.sampName == '' ||
      this.everything.sampName == null
    ) {
      this._snackBar.open('Please Fill Sample Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampType == undefined ||
      this.everything.sampType == '' ||
      this.everything.sampType == null
    ) {
      this._snackBar.open('Please Fill Sample Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.name == undefined ||
      this.everything.name == '' ||
      this.everything.name == null
    ) {
      this._snackBar.open('Please Fill Customer Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.contactPerson == undefined ||
      this.everything.contactPerson == '' ||
      this.everything.contactPerson == null
    ) {
      this._snackBar.open('Please Fill Contact Person', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.phone == undefined ||
      this.everything.phone == '' ||
      this.everything.phone == null
    ) {
      this._snackBar.open('Please Fill Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.email == undefined ||
      this.everything.email == '' ||
      this.everything.email == null
    ) {
      this._snackBar.open('Please Fill valid EmailId', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.orderType == undefined ||
      this.everything.orderType == '' ||
      this.everything.orderType == null
    ) {
      this._snackBar.open('Please Fill Order Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedDate == undefined ||
      this.everything.expectedDate == '' ||
      this.everything.expectedDate == null
    ) {
      this._snackBar.open('Please Fill Expected Date', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.approvalType == undefined ||
      this.everything.approvalType == '' ||
      this.everything.approvalType == null
    ) {
      this._snackBar.open('Please Fill Approval Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.printTypeTag == undefined ||
      this.everything.printTypeTag == '' ||
      this.everything.printTypeTag == null
    ) {
      this._snackBar.open('Please Fill Print Type for tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitHeightTag == undefined ||
      this.everything.unitHeightTag == '' ||
      this.everything.unitHeightTag == null
    ) {
      this._snackBar.open('Please Fill unit Height for tag ', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitWidthTag == undefined ||
      this.everything.unitWidthTag == '' ||
      this.everything.unitWidthTag == null
    ) {
      this._snackBar.open('Please Fill unit Width for tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.tagDevType == undefined ||
      this.everything.tagDevType == '' ||
      this.everything.tagDevType == null
    ) {
      this._snackBar.open('Please Fill Tag Dev type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.nameOfTheBoard == undefined ||
      this.everything.nameOfTheBoard == '' ||
      this.everything.nameOfTheBoard == null
    ) {
      this._snackBar.open('Please Fill Name Of The Board', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.boardSpecification == undefined ||
      this.everything.boardSpecification == '' ||
      this.everything.boardSpecification == null
    ) {
      this._snackBar.open('Please Fill Board Specification', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.qualityTag == undefined ||
      this.everything.qualityTag == '' ||
      this.everything.qualityTag == null
    ) {
      this._snackBar.open('Please Fill Quality for Tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.boardGSM == undefined ||
      this.everything.boardGSM == '' ||
      this.everything.boardGSM == null
    ) {
      this._snackBar.open('Please Fill BoardGSM', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.colorTag == undefined ||
      this.everything.colorTag == '' ||
      this.everything.colorTag == null
    ) {
      this._snackBar.open('Please Fill Color for Tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedQuantityTag == undefined ||
      this.everything.expectedQuantityTag == '' ||
      this.everything.expectedQuantityTag == null
    ) {
      this._snackBar.open('Invalid Expected Quantity tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else if( this.everything.statusTag == undefined || this.everything.statusTag == '' || this.everything.statusTag == null  )
    // {
    //     this._snackBar.open("Please Fill Status for Tag", "", {
    //       duration: 2000,
    //       panelClass: ['snackbar1'],
    //       verticalPosition: "top",
    //       horizontalPosition: "center"
    //     });
    // }

    // else if( this.everything.foldingTag == undefined  || this.everything.foldingTag == "" || this.everything.foldingTag == null )
    // {
    //     this._snackBar.open("Please Fill Folding for Tag", "", {
    //       duration: 2000,
    //       panelClass: ['snackbar1'],
    //       verticalPosition: "top",
    //       horizontalPosition: "center"
    //     });
    // }
    else if (
      this.everything.finishingTag == undefined ||
      this.everything.finishingTag == '' ||
      this.everything.finishingTag == null
    ) {
      this._snackBar.open('Please Fill Finishing for Tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.comments == undefined ||
      this.everything.comments == '' ||
      this.everything.comments == null
    ) {
      this._snackBar.open('Please Fill Comments to follow', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.noOfPlates == undefined ||
      this.everything.noOfPlates == '' ||
      this.everything.noOfPlates == null
    ) {
      this._snackBar.open('Please Fill No Of Plates', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.negativePositive == undefined ||
      this.everything.negativePositive == '' ||
      this.everything.negativePositive == null
    ) {
      this._snackBar.open('Please Fill NegativePositive', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.foilEmbossScreen == undefined ||
      this.everything.foilEmbossScreen == '' ||
      this.everything.foilEmbossScreen == null
    ) {
      this._snackBar.open('Please Fill Foil/Emboss Screen', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.die == undefined ||
      this.everything.die == '' ||
      this.everything.die == null
    ) {
      this._snackBar.open('Please Fill Die', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.platesize == undefined ||
      this.everything.platesize == '' ||
      this.everything.platesize == null
    ) {
      this._snackBar.open('Please Fill Platesize', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.printColorMatching == undefined ||
      this.everything.printColorMatching == '' ||
      this.everything.printColorMatching == null
    ) {
      this._snackBar.open('Please Fill Print Color Matching', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.boardCost == undefined ||
      this.everything.boardCost == '' ||
      this.everything.boardCost == null
    ) {
      this._snackBar.open('Please Fill Board Cost', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.designFileName == undefined ||
      this.everything.designFileName == '' ||
      this.everything.designFileName == null
    ) {
      this._snackBar.open('Please Fill Design File Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.runningBoardSize == undefined ||
      this.everything.runningBoardSize == '' ||
      this.everything.runningBoardSize == null
    ) {
      this._snackBar.open('Please Fill Running Board Size', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else {
      this.onSubmitEverything();
    }
  }

  //Normal Save with Rejex For Customer RIGHTS(Tag)

  checkCustomerTag() {
    if (
      this.everything.sampName == undefined ||
      this.everything.sampName == '' ||
      this.everything.sampName == null
    ) {
      this._snackBar.open('Please Fill Sample Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampType == undefined ||
      this.everything.sampType == '' ||
      this.everything.sampType == null
    ) {
      this._snackBar.open('Please Fill Sample Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.name == undefined ||
      this.everything.name == '' ||
      this.everything.name == null
    ) {
      this._snackBar.open('Please Fill Customer Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.contactPerson == undefined ||
      this.everything.contactPerson == '' ||
      this.everything.contactPerson == null
    ) {
      this._snackBar.open('Please Fill Contact Person', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.phone == undefined ||
      this.everything.phone == '' ||
      this.everything.phone == null
    ) {
      this._snackBar.open('Please Fill Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.email == undefined ||
      this.everything.email == '' ||
      this.everything.email == null
    ) {
      this._snackBar.open('Please Fill valid EmailId', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.orderType == undefined ||
      this.everything.orderType == '' ||
      this.everything.orderType == null
    ) {
      this._snackBar.open('Please Fill Order Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedDate == undefined ||
      this.everything.expectedDate == '' ||
      this.everything.expectedDate == null
    ) {
      this._snackBar.open('Please Fill Expected Date', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.approvalType == undefined ||
      this.everything.approvalType == '' ||
      this.everything.approvalType == null
    ) {
      this._snackBar.open('Please Fill Approval Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.printTypeTag == undefined ||
      this.everything.printTypeTag == '' ||
      this.everything.printTypeTag == null
    ) {
      this._snackBar.open('Please Fill Print Type for tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitHeightTag == undefined ||
      this.everything.unitHeightTag == '' ||
      this.everything.unitHeightTag == null
    ) {
      this._snackBar.open('Please Fill unit Height for tag ', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitWidthTag == undefined ||
      this.everything.unitWidthTag == '' ||
      this.everything.unitWidthTag == null
    ) {
      this._snackBar.open('Please Fill unit Width for tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.tagDevType == undefined ||
      this.everything.tagDevType == '' ||
      this.everything.tagDevType == null
    ) {
      this._snackBar.open('Please Fill Tag Dev type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.nameOfTheBoard == undefined ||
      this.everything.nameOfTheBoard == '' ||
      this.everything.nameOfTheBoard == null
    ) {
      this._snackBar.open('Please Fill Name Of The Board', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.boardSpecification == undefined ||
      this.everything.boardSpecification == '' ||
      this.everything.boardSpecification == null
    ) {
      this._snackBar.open('Please Fill Board Specification', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.qualityTag == undefined ||
      this.everything.qualityTag == '' ||
      this.everything.qualityTag == null
    ) {
      this._snackBar.open('Please Fill Quality for Tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.boardGSM == undefined ||
      this.everything.boardGSM == '' ||
      this.everything.boardGSM == null
    ) {
      this._snackBar.open('Please Fill BoardGSM', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.colorTag == undefined ||
      this.everything.colorTag == '' ||
      this.everything.colorTag == null
    ) {
      this._snackBar.open('Please Fill Color for Tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedQuantityTag == undefined ||
      this.everything.expectedQuantityTag == '' ||
      this.everything.expectedQuantityTag == null
    ) {
      this._snackBar.open('Invalid Expected Quantity tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else if( this.everything.statusTag == undefined || this.everything.statusTag == '' || this.everything.statusTag == null  )
    // {
    //     this._snackBar.open("Please Fill Status for Tag", "", {
    //       duration: 2000,
    //       panelClass: ['snackbar1'],
    //       verticalPosition: "top",
    //       horizontalPosition: "center"
    //     });
    // }

    // else if( this.everything.foldingTag == undefined  || this.everything.foldingTag == "" || this.everything.foldingTag == null )
    // {
    //     this._snackBar.open("Please Fill Folding for Tag", "", {
    //       duration: 2000,
    //       panelClass: ['snackbar1'],
    //       verticalPosition: "top",
    //       horizontalPosition: "center"
    //     });
    // }
    else if (
      this.everything.finishingTag == undefined ||
      this.everything.finishingTag == '' ||
      this.everything.finishingTag == null
    ) {
      this._snackBar.open('Please Fill Finishing for Tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.comments == undefined ||
      this.everything.comments == '' ||
      this.everything.comments == null
    ) {
      this._snackBar.open('Please Fill Comments to follow', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else {
      this.onSubmitEverything();
    }
  }

  //Tag - confirmation and special button (for admin)
  checkAdminTagUpdate() {
    if (
      this.everything.sampName == undefined ||
      this.everything.sampName == '' ||
      this.everything.sampName == null
    ) {
      this._snackBar.open('Please Fill Sample Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampType == undefined ||
      this.everything.sampType == '' ||
      this.everything.sampType == null
    ) {
      this._snackBar.open('Please Fill Sample Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.name == undefined ||
      this.everything.name == '' ||
      this.everything.name == null
    ) {
      this._snackBar.open('Please Fill Customer Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.contactPerson == undefined ||
      this.everything.contactPerson == '' ||
      this.everything.contactPerson == null
    ) {
      this._snackBar.open('Please Fill Contact Person', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.phone == undefined ||
      this.everything.phone == '' ||
      this.everything.phone == null
    ) {
      this._snackBar.open('Please Fill Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.email == undefined ||
      this.everything.email == '' ||
      this.everything.email == null
    ) {
      this._snackBar.open('Please Fill valid EmailId', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.orderType == undefined ||
      this.everything.orderType == '' ||
      this.everything.orderType == null
    ) {
      this._snackBar.open('Please Fill Order Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedDate == undefined ||
      this.everything.expectedDate == '' ||
      this.everything.expectedDate == null
    ) {
      this._snackBar.open('Please Fill Expected Date', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.approvalType == undefined ||
      this.everything.approvalType == '' ||
      this.everything.approvalType == null
    ) {
      this._snackBar.open('Please Fill Approval Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.printTypeTag == undefined ||
      this.everything.printTypeTag == '' ||
      this.everything.printTypeTag == null
    ) {
      this._snackBar.open('Please Fill Print Type for tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitHeightTag == undefined ||
      this.everything.unitHeightTag == '' ||
      this.everything.unitHeightTag == null
    ) {
      this._snackBar.open('Please Fill unit Height for tag ', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitWidthTag == undefined ||
      this.everything.unitWidthTag == '' ||
      this.everything.unitWidthTag == null
    ) {
      this._snackBar.open('Please Fill unit Width for tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.tagDevType == undefined ||
      this.everything.tagDevType == '' ||
      this.everything.tagDevType == null
    ) {
      this._snackBar.open('Please Fill Tag Dev type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.nameOfTheBoard == undefined ||
      this.everything.nameOfTheBoard == '' ||
      this.everything.nameOfTheBoard == null
    ) {
      this._snackBar.open('Please Fill Name Of The Board', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.boardSpecification == undefined ||
      this.everything.boardSpecification == '' ||
      this.everything.boardSpecification == null
    ) {
      this._snackBar.open('Please Fill Board Specification', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.qualityTag == undefined ||
      this.everything.qualityTag == '' ||
      this.everything.qualityTag == null
    ) {
      this._snackBar.open('Please Fill Quality for Tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.boardGSM == undefined ||
      this.everything.boardGSM == '' ||
      this.everything.boardGSM == null
    ) {
      this._snackBar.open('Please Fill BoardGSM', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.colorTag == undefined ||
      this.everything.colorTag == '' ||
      this.everything.colorTag == null
    ) {
      this._snackBar.open('Please Fill Color for Tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedQuantityTag == undefined ||
      this.everything.expectedQuantityTag == '' ||
      this.everything.expectedQuantityTag == null
    ) {
      this._snackBar.open('Invalid Expected Quantity tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else if( this.everything.statusTag == undefined || this.everything.statusTag == '' || this.everything.statusTag == null  )
    // {
    //     this._snackBar.open("Please Fill Status for Tag", "", {
    //       duration: 2000,
    //       panelClass: ['snackbar1'],
    //       verticalPosition: "top",
    //       horizontalPosition: "center"
    //     });
    // }

    // else if( this.everything.foldingTag == undefined  || this.everything.foldingTag == "" || this.everything.foldingTag == null )
    // {
    //     this._snackBar.open("Please Fill Folding for Tag", "", {
    //       duration: 2000,
    //       panelClass: ['snackbar1'],
    //       verticalPosition: "top",
    //       horizontalPosition: "center"
    //     });
    // }
    else if (
      this.everything.finishingTag == undefined ||
      this.everything.finishingTag == '' ||
      this.everything.finishingTag == null
    ) {
      this._snackBar.open('Please Fill Finishing for Tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.comments == undefined ||
      this.everything.comments == '' ||
      this.everything.comments == null
    ) {
      this._snackBar.open('Please Fill Comments to follow', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.noOfPlates == undefined ||
      this.everything.noOfPlates == '' ||
      this.everything.noOfPlates == null
    ) {
      this._snackBar.open('Please Fill No Of Plates', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.negativePositive == undefined ||
      this.everything.negativePositive == '' ||
      this.everything.negativePositive == null
    ) {
      this._snackBar.open('Please Fill NegativePositive', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.foilEmbossScreen == undefined ||
      this.everything.foilEmbossScreen == '' ||
      this.everything.foilEmbossScreen == null
    ) {
      this._snackBar.open('Please Fill Foil/Emboss Screen', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.die == undefined ||
      this.everything.die == '' ||
      this.everything.die == null
    ) {
      this._snackBar.open('Please Fill Die', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.platesize == undefined ||
      this.everything.platesize == '' ||
      this.everything.platesize == null
    ) {
      this._snackBar.open('Please Fill Platesize', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.printColorMatching == undefined ||
      this.everything.printColorMatching == '' ||
      this.everything.printColorMatching == null
    ) {
      this._snackBar.open('Please Fill Print Color Matching', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.boardCost == undefined ||
      this.everything.boardCost == '' ||
      this.everything.boardCost == null
    ) {
      this._snackBar.open('Please Fill Board Cost', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.designFileName == undefined ||
      this.everything.designFileName == '' ||
      this.everything.designFileName == null
    ) {
      this._snackBar.open('Please Fill Design File Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.runningBoardSize == undefined ||
      this.everything.runningBoardSize == '' ||
      this.everything.runningBoardSize == null
    ) {
      this._snackBar.open('Please Fill Running Board Size', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.imageAttachmentIsUploaded == false) {
      this._snackBar.open('Please Upload the Image Attachment', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.scannedSampleIsUploaded == false) {
      this._snackBar.open('Please Upload the Scanned Sample', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else {
      this.updateStatus();
    }
  }

  //Tag - confirmation and special button (for Customer)
  checkCustomerTagUpdate() {
    if (
      this.everything.sampName == undefined ||
      this.everything.sampName == '' ||
      this.everything.sampName == null
    ) {
      this._snackBar.open('Please Fill Sample Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampType == undefined ||
      this.everything.sampType == '' ||
      this.everything.sampType == null
    ) {
      this._snackBar.open('Please Fill Sample Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.name == undefined ||
      this.everything.name == '' ||
      this.everything.name == null
    ) {
      this._snackBar.open('Please Fill Customer Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.contactPerson == undefined ||
      this.everything.contactPerson == '' ||
      this.everything.contactPerson == null
    ) {
      this._snackBar.open('Please Fill Contact Person', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.phone == undefined ||
      this.everything.phone == '' ||
      this.everything.phone == null
    ) {
      this._snackBar.open('Please Fill Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.email == undefined ||
      this.everything.email == '' ||
      this.everything.email == null
    ) {
      this._snackBar.open('Please Fill valid EmailId', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.orderType == undefined ||
      this.everything.orderType == '' ||
      this.everything.orderType == null
    ) {
      this._snackBar.open('Please Fill Order Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedDate == undefined ||
      this.everything.expectedDate == '' ||
      this.everything.expectedDate == null
    ) {
      this._snackBar.open('Please Fill Expected Date', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.approvalType == undefined ||
      this.everything.approvalType == '' ||
      this.everything.approvalType == null
    ) {
      this._snackBar.open('Please Fill Approval Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.printTypeTag == undefined ||
      this.everything.printTypeTag == '' ||
      this.everything.printTypeTag == null
    ) {
      this._snackBar.open('Please Fill Print Type for tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitHeightTag == undefined ||
      this.everything.unitHeightTag == '' ||
      this.everything.unitHeightTag == null
    ) {
      this._snackBar.open('Please Fill unit Height for tag ', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitWidthTag == undefined ||
      this.everything.unitWidthTag == '' ||
      this.everything.unitWidthTag == null
    ) {
      this._snackBar.open('Please Fill unit Width for tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.tagDevType == undefined ||
      this.everything.tagDevType == '' ||
      this.everything.tagDevType == null
    ) {
      this._snackBar.open('Please Fill Tag Dev type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.nameOfTheBoard == undefined ||
      this.everything.nameOfTheBoard == '' ||
      this.everything.nameOfTheBoard == null
    ) {
      this._snackBar.open('Please Fill Name Of The Board', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.boardSpecification == undefined ||
      this.everything.boardSpecification == '' ||
      this.everything.boardSpecification == null
    ) {
      this._snackBar.open('Please Fill Board Specification', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.qualityTag == undefined ||
      this.everything.qualityTag == '' ||
      this.everything.qualityTag == null
    ) {
      this._snackBar.open('Please Fill Quality for Tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.boardGSM == undefined ||
      this.everything.boardGSM == '' ||
      this.everything.boardGSM == null
    ) {
      this._snackBar.open('Please Fill BoardGSM', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.colorTag == undefined ||
      this.everything.colorTag == '' ||
      this.everything.colorTag == null
    ) {
      this._snackBar.open('Please Fill Color for Tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedQuantityTag == undefined ||
      this.everything.expectedQuantityTag == '' ||
      this.everything.expectedQuantityTag == null
    ) {
      this._snackBar.open('Invalid Expected Quantity tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else if( this.everything.statusTag == undefined || this.everything.statusTag == '' || this.everything.statusTag == null  )
    // {
    //     this._snackBar.open("Please Fill Status for Tag", "", {
    //       duration: 2000,
    //       panelClass: ['snackbar1'],
    //       verticalPosition: "top",
    //       horizontalPosition: "center"
    //     });
    // }

    // else if( this.everything.foldingTag == undefined  || this.everything.foldingTag == "" || this.everything.foldingTag == null )
    // {
    //     this._snackBar.open("Please Fill Folding for Tag", "", {
    //       duration: 2000,
    //       panelClass: ['snackbar1'],
    //       verticalPosition: "top",
    //       horizontalPosition: "center"
    //     });
    // }
    else if (
      this.everything.finishingTag == undefined ||
      this.everything.finishingTag == '' ||
      this.everything.finishingTag == null
    ) {
      this._snackBar.open('Please Fill Finishing for Tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.comments == undefined ||
      this.everything.comments == '' ||
      this.everything.comments == null
    ) {
      this._snackBar.open('Please Fill Comments to follow', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else {
      this.updateStatus();
    }
  }

  //Normal Save with Rejex For ADMIN RIGHTS(Sticker)

  checkAdminSticker() {
    if (
      this.everything.sampName == undefined ||
      this.everything.sampName == '' ||
      this.everything.sampName == null
    ) {
      this._snackBar.open('Please Fill Sample Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampType == undefined ||
      this.everything.sampType == '' ||
      this.everything.sampType == null
    ) {
      this._snackBar.open('Please Fill Sample Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.name == undefined ||
      this.everything.name == '' ||
      this.everything.name == null
    ) {
      this._snackBar.open('Please Fill Customer Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.contactPerson == undefined ||
      this.everything.contactPerson == '' ||
      this.everything.contactPerson == null
    ) {
      this._snackBar.open('Please Fill Contact Person', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.phone == undefined ||
      this.everything.phone == '' ||
      this.everything.phone == null
    ) {
      this._snackBar.open('Please Fill Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.email == undefined ||
      this.everything.email == '' ||
      this.everything.email == null
    ) {
      this._snackBar.open('Please Fill valid EmailId', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.orderType == undefined ||
      this.everything.orderType == '' ||
      this.everything.orderType == null
    ) {
      this._snackBar.open('Please Fill Order Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedDate == undefined ||
      this.everything.expectedDate == '' ||
      this.everything.expectedDate == null
    ) {
      this._snackBar.open('Please Fill Expected Date', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.approvalType == undefined ||
      this.everything.approvalType == '' ||
      this.everything.approvalType == null
    ) {
      this._snackBar.open('Please Fill Approval Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.printType == undefined ||
      this.everything.printType == '' ||
      this.everything.printType == null
    ) {
      this._snackBar.open('Please Fill Print Type in Sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitHeightSticker == undefined ||
      this.everything.unitHeightSticker == '' ||
      this.everything.unitHeightSticker == null
    ) {
      this._snackBar.open('Invalid Unit Height in Sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitWidthSticker == undefined ||
      this.everything.unitWidthSticker == '' ||
      this.everything.unitWidthSticker == null
    ) {
      this._snackBar.open('Please Fill unitwidth info for sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.diameter == undefined ||
      this.everything.diameter == '' ||
      this.everything.diameter == null
    ) {
      this._snackBar.open('Please Fill Diameter', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.stickerType == undefined ||
      this.everything.stickerType == '' ||
      this.everything.stickerType == null
    ) {
      this._snackBar.open('Please Fill Sticker Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.rollColor == undefined ||
      this.everything.rollColor == '' ||
      this.everything.rollColor == null
    ) {
      this._snackBar.open('Please Fill Roll Color for Sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.rollSpecification == undefined ||
      this.everything.rollSpecification == '' ||
      this.everything.rollSpecification == null
    ) {
      this._snackBar.open('Please Fill Roll Specification', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.rollSize == undefined ||
      this.everything.rollSize == '' ||
      this.everything.rollSize == null
    ) {
      this._snackBar.open('Please Fill RollSize', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.comments == undefined ||
      this.everything.comments == '' ||
      this.everything.comments == null
    ) {
      this._snackBar.open('Please Fill comments to follow', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedQuantitySticker == undefined ||
      this.everything.expectedQuantitySticker == '' ||
      this.everything.expectedQuantitySticker == null
    ) {
      this._snackBar.open('Please Fill Exp Quantity sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampleRequest == undefined ||
      this.everything.sampleRequest == '' ||
      this.everything.sampleRequest == null
    ) {
      this._snackBar.open('Please Fill Sample Request On', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.incomingSticker == undefined ||
      this.everything.incomingSticker == '' ||
      this.everything.incomingSticker == null
    ) {
      this._snackBar.open('Please Fill Incoming Date for Sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.dispatch == undefined ||
      this.everything.dispatch == '' ||
      this.everything.dispatch == null
    ) {
      this._snackBar.open('Please Fill Dispatch Date/Time for Sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else  if( this.everything.rollCost == undefined || this.everything.rollCost == "" || this.everything.rollCost == null )
    // {
    //     this._snackBar.open("Please Fill Sticker Roll", "", {
    //       duration: 2000,
    //       panelClass: ['snackbar1'],
    //       verticalPosition: "top",
    //       horizontalPosition: "center"
    //     });
    // }
    else if (
      this.everything.stickerPrint == undefined ||
      this.everything.stickerPrint == '' ||
      this.everything.stickerPrint == null
    ) {
      this._snackBar.open('Please Fill StickerPrint', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.digitalPrint == undefined ||
      this.everything.digitalPrint == '' ||
      this.everything.digitalPrint == null
    ) {
      this._snackBar.open('Please Fill DigitalPrint', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.foil == undefined ||
      this.everything.foil == '' ||
      this.everything.foil == null
    ) {
      this._snackBar.open('Please Fill Foil', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.die == undefined ||
      this.everything.die == '' ||
      this.everything.die == null
    ) {
      this._snackBar.open('Please Fill Die', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.platesizeSticker == undefined ||
      this.everything.platesizeSticker == '' ||
      this.everything.platesizeSticker == null
    ) {
      this._snackBar.open('Please Fill Platesize', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else {
      this.onSubmitEverything();
    }
  }

  //Normal Save with Rejex For Customer RIGHTS(Sticker)

  checkCustomerSticker() {
    if (
      this.everything.sampName == undefined ||
      this.everything.sampName == '' ||
      this.everything.sampName == null
    ) {
      this._snackBar.open('Please Fill Sample Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampType == undefined ||
      this.everything.sampType == '' ||
      this.everything.sampType == null
    ) {
      this._snackBar.open('Please Fill Sample Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.name == undefined ||
      this.everything.name == '' ||
      this.everything.name == null
    ) {
      this._snackBar.open('Please Fill Customer Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.contactPerson == undefined ||
      this.everything.contactPerson == '' ||
      this.everything.contactPerson == null
    ) {
      this._snackBar.open('Please Fill Contact Person', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.phone == undefined ||
      this.everything.phone == '' ||
      this.everything.phone == null
    ) {
      this._snackBar.open('Please Fill Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.email == undefined ||
      this.everything.email == '' ||
      this.everything.email == null
    ) {
      this._snackBar.open('Please Fill valid EmailId', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.orderType == undefined ||
      this.everything.orderType == '' ||
      this.everything.orderType == null
    ) {
      this._snackBar.open('Please Fill Order Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedDate == undefined ||
      this.everything.expectedDate == '' ||
      this.everything.expectedDate == null
    ) {
      this._snackBar.open('Please Fill Expected Date', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.approvalType == undefined ||
      this.everything.approvalType == '' ||
      this.everything.approvalType == null
    ) {
      this._snackBar.open('Please Fill Approval Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.printType == undefined ||
      this.everything.printType == '' ||
      this.everything.printType == null
    ) {
      this._snackBar.open('Please Fill Print Type in Sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitHeightSticker == undefined ||
      this.everything.unitHeightSticker == '' ||
      this.everything.unitHeightSticker == null
    ) {
      this._snackBar.open('Invalid Unit Height in Sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitWidthSticker == undefined ||
      this.everything.unitWidthSticker == '' ||
      this.everything.unitWidthSticker == null
    ) {
      this._snackBar.open('Please Fill unitwidth info for sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.diameter == undefined ||
      this.everything.diameter == '' ||
      this.everything.diameter == null
    ) {
      this._snackBar.open('Please Fill Diameter', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.stickerType == undefined ||
      this.everything.stickerType == '' ||
      this.everything.stickerType == null
    ) {
      this._snackBar.open('Please Fill Sticker Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.rollColor == undefined ||
      this.everything.rollColor == '' ||
      this.everything.rollColor == null
    ) {
      this._snackBar.open('Please Fill Roll Color for Sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.rollSpecification == undefined ||
      this.everything.rollSpecification == '' ||
      this.everything.rollSpecification == null
    ) {
      this._snackBar.open('Please Fill Roll Specification', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.rollSize == undefined ||
      this.everything.rollSize == '' ||
      this.everything.rollSize == null
    ) {
      this._snackBar.open('Please Fill RollSize', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.comments == undefined ||
      this.everything.comments == '' ||
      this.everything.comments == null
    ) {
      this._snackBar.open('Please Fill comments to follow', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedQuantitySticker == undefined ||
      this.everything.expectedQuantitySticker == '' ||
      this.everything.expectedQuantitySticker == null
    ) {
      this._snackBar.open('Please Fill Exp Quantity sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampleRequest == undefined ||
      this.everything.sampleRequest == '' ||
      this.everything.sampleRequest == null
    ) {
      this._snackBar.open('Please Fill Sample Request On', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else {
      this.onSubmitEverything();
    }
  }

  //Sticker - confirmation and special button (for admin)

  checkAdminStickerUpdate() {
    if (
      this.everything.sampName == undefined ||
      this.everything.sampName == '' ||
      this.everything.sampName == null
    ) {
      this._snackBar.open('Please Fill Sample Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampType == undefined ||
      this.everything.sampType == '' ||
      this.everything.sampType == null
    ) {
      this._snackBar.open('Please Fill Sample Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.name == undefined ||
      this.everything.name == '' ||
      this.everything.name == null
    ) {
      this._snackBar.open('Please Fill Customer Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.contactPerson == undefined ||
      this.everything.contactPerson == '' ||
      this.everything.contactPerson == null
    ) {
      this._snackBar.open('Please Fill Contact Person', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.phone == undefined ||
      this.everything.phone == '' ||
      this.everything.phone == null
    ) {
      this._snackBar.open('Please Fill Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.email == undefined ||
      this.everything.email == '' ||
      this.everything.email == null
    ) {
      this._snackBar.open('Please Fill valid EmailId', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.orderType == undefined ||
      this.everything.orderType == '' ||
      this.everything.orderType == null
    ) {
      this._snackBar.open('Please Fill Order Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedDate == undefined ||
      this.everything.expectedDate == '' ||
      this.everything.expectedDate == null
    ) {
      this._snackBar.open('Please Fill Expected Date', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.approvalType == undefined ||
      this.everything.approvalType == '' ||
      this.everything.approvalType == null
    ) {
      this._snackBar.open('Please Fill Approval Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.printType == undefined ||
      this.everything.printType == '' ||
      this.everything.printType == null
    ) {
      this._snackBar.open('Please Fill Print Type in Sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitHeightSticker == undefined ||
      this.everything.unitHeightSticker == '' ||
      this.everything.unitHeightSticker == null
    ) {
      this._snackBar.open('Invalid Unit Height in Sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitWidthSticker == undefined ||
      this.everything.unitWidthSticker == '' ||
      this.everything.unitWidthSticker == null
    ) {
      this._snackBar.open('Please Fill unitwidth info for sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.diameter == undefined ||
      this.everything.diameter == '' ||
      this.everything.diameter == null
    ) {
      this._snackBar.open('Please Fill Diameter', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.stickerType == undefined ||
      this.everything.stickerType == '' ||
      this.everything.stickerType == null
    ) {
      this._snackBar.open('Please Fill Sticker Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.rollColor == undefined ||
      this.everything.rollColor == '' ||
      this.everything.rollColor == null
    ) {
      this._snackBar.open('Please Fill Roll Color for Sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.rollSpecification == undefined ||
      this.everything.rollSpecification == '' ||
      this.everything.rollSpecification == null
    ) {
      this._snackBar.open('Please Fill Roll Specification', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.rollSize == undefined ||
      this.everything.rollSize == '' ||
      this.everything.rollSize == null
    ) {
      this._snackBar.open('Please Fill RollSize', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.comments == undefined ||
      this.everything.comments == '' ||
      this.everything.comments == null
    ) {
      this._snackBar.open('Please Fill comments to follow', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedQuantitySticker == undefined ||
      this.everything.expectedQuantitySticker == '' ||
      this.everything.expectedQuantitySticker == null
    ) {
      this._snackBar.open('Please Fill Exp Quantity sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampleRequest == undefined ||
      this.everything.sampleRequest == '' ||
      this.everything.sampleRequest == null
    ) {
      this._snackBar.open('Please Fill Sample Request On', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.incomingSticker == undefined ||
      this.everything.incomingSticker == '' ||
      this.everything.incomingSticker == null
    ) {
      this._snackBar.open('Please Fill Incoming Date for Sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.dispatch == undefined ||
      this.everything.dispatch == '' ||
      this.everything.dispatch == null
    ) {
      this._snackBar.open('Please Fill Dispatch Date/Time for Sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else  if( this.everything.rollCost == undefined || this.everything.rollCost == "" || this.everything.rollCost == null )
    // {
    //     this._snackBar.open("Please Fill Sticker Roll", "", {
    //       duration: 2000,
    //       panelClass: ['snackbar1'],
    //       verticalPosition: "top",
    //       horizontalPosition: "center"
    //     });
    // }
    else if (
      this.everything.stickerPrint == undefined ||
      this.everything.stickerPrint == '' ||
      this.everything.stickerPrint == null
    ) {
      this._snackBar.open('Please Fill StickerPrint', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.digitalPrint == undefined ||
      this.everything.digitalPrint == '' ||
      this.everything.digitalPrint == null
    ) {
      this._snackBar.open('Please Fill DigitalPrint', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.foil == undefined ||
      this.everything.foil == '' ||
      this.everything.foil == null
    ) {
      this._snackBar.open('Please Fill Foil', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.die == undefined ||
      this.everything.die == '' ||
      this.everything.die == null
    ) {
      this._snackBar.open('Please Fill Die', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.platesizeSticker == undefined ||
      this.everything.platesizeSticker == '' ||
      this.everything.platesizeSticker == null
    ) {
      this._snackBar.open('Please Fill Platesize', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.imageAttachmentIsUploaded == false) {
      this._snackBar.open('Please Upload the Image Attachment', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.scannedSampleIsUploaded == false) {
      this._snackBar.open('Please Upload the Scanned Sample', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else {
      this.updateStatus();
    }
  }

  //Sticker - confirmation and special button (for Customer)

  checkCustomerStickerUpdate() {
    if (
      this.everything.sampName == undefined ||
      this.everything.sampName == '' ||
      this.everything.sampName == null
    ) {
      this._snackBar.open('Please Fill Sample Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampType == undefined ||
      this.everything.sampType == '' ||
      this.everything.sampType == null
    ) {
      this._snackBar.open('Please Fill Sample Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.name == undefined ||
      this.everything.name == '' ||
      this.everything.name == null
    ) {
      this._snackBar.open('Please Fill Customer Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.contactPerson == undefined ||
      this.everything.contactPerson == '' ||
      this.everything.contactPerson == null
    ) {
      this._snackBar.open('Please Fill Contact Person', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.phone == undefined ||
      this.everything.phone == '' ||
      this.everything.phone == null
    ) {
      this._snackBar.open('Please Fill Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.email == undefined ||
      this.everything.email == '' ||
      this.everything.email == null
    ) {
      this._snackBar.open('Please Fill valid EmailId', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.orderType == undefined ||
      this.everything.orderType == '' ||
      this.everything.orderType == null
    ) {
      this._snackBar.open('Please Fill Order Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedDate == undefined ||
      this.everything.expectedDate == '' ||
      this.everything.expectedDate == null
    ) {
      this._snackBar.open('Please Fill Expected Date', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.approvalType == undefined ||
      this.everything.approvalType == '' ||
      this.everything.approvalType == null
    ) {
      this._snackBar.open('Please Fill Approval Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.printType == undefined ||
      this.everything.printType == '' ||
      this.everything.printType == null
    ) {
      this._snackBar.open('Please Fill Print Type in Sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitHeightSticker == undefined ||
      this.everything.unitHeightSticker == '' ||
      this.everything.unitHeightSticker == null
    ) {
      this._snackBar.open('Invalid Unit Height in Sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitWidthSticker == undefined ||
      this.everything.unitWidthSticker == '' ||
      this.everything.unitWidthSticker == null
    ) {
      this._snackBar.open('Please Fill unitwidth info for sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.diameter == undefined ||
      this.everything.diameter == '' ||
      this.everything.diameter == null
    ) {
      this._snackBar.open('Please Fill Diameter', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.stickerType == undefined ||
      this.everything.stickerType == '' ||
      this.everything.stickerType == null
    ) {
      this._snackBar.open('Please Fill Sticker Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.rollColor == undefined ||
      this.everything.rollColor == '' ||
      this.everything.rollColor == null
    ) {
      this._snackBar.open('Please Fill Roll Color for Sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.rollSpecification == undefined ||
      this.everything.rollSpecification == '' ||
      this.everything.rollSpecification == null
    ) {
      this._snackBar.open('Please Fill Roll Specification', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.rollSize == undefined ||
      this.everything.rollSize == '' ||
      this.everything.rollSize == null
    ) {
      this._snackBar.open('Please Fill RollSize', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.comments == undefined ||
      this.everything.comments == '' ||
      this.everything.comments == null
    ) {
      this._snackBar.open('Please Fill comments to follow', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedQuantitySticker == undefined ||
      this.everything.expectedQuantitySticker == '' ||
      this.everything.expectedQuantitySticker == null
    ) {
      this._snackBar.open('Please Fill Exp Quantity sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampleRequest == undefined ||
      this.everything.sampleRequest == '' ||
      this.everything.sampleRequest == null
    ) {
      this._snackBar.open('Please Fill Sample Request On', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else {
      this.updateStatus();
    }
  }

  newAccessToken: string;

  //for Woven
  wovenCheck() {
    this.newAccessToken = localStorage.getItem('token');

    if (
      (this.newAccessToken === 'Administrator' ||
        this.newAccessToken === 'Sample Head' ||
        this.newAccessToken === 'Customer Service Team') &&
      (this.everything.transactionStatus === 'Production' ||
        this.everything.transactionStatus === 'Quotation / Dispatch')
    ) {
      this.checkAdminWoven();
    } else if (
      this.everything.transactionStatus === 'Sample Request Initiated' ||
      this.everything.transactionStatus === 'Customer / Executive Approval' ||
      this.everything.transactionStatus === 'Sample Initiated'
    ) {
      this.checkCustomerWoven();
    } else if (
      (this.newAccessToken === 'Customer' ||
        this.newAccessToken === 'Sales Team') &&
      (this.everything.transactionStatus === 'Production' ||
        this.everything.transactionStatus === 'Quotation / Dispatch')
    ) {
      this.checkCustomerWovenUpdate();
    } else {
      alert('Error from Woven Check');
    }
  }

  wovenUpdateCheck() {
    this.newAccessToken = localStorage.getItem('token');

    if (
      (this.newAccessToken === 'Administrator' ||
        this.newAccessToken === 'Sample Head' ||
        this.newAccessToken === 'Customer Service Team') &&
      (this.everything.transactionStatus === 'Production' ||
        this.everything.transactionStatus === 'Quotation / Dispatch')
    ) {
      this.checkAdminWovenUpdate();
    } else if (
      this.everything.transactionStatus === 'Sample Request Initiated' ||
      this.everything.transactionStatus === 'Customer / Executive Approval' ||
      this.everything.transactionStatus === 'Sample Initiated'
    ) {
      this.checkCustomerWovenUpdate();
    } else if (
      (this.newAccessToken === 'Customer' ||
        this.newAccessToken === 'Sales Team') &&
      (this.everything.transactionStatus === 'Production' ||
        this.everything.transactionStatus === 'Quotation / Dispatch')
    ) {
      this.checkCustomerWovenUpdate();
    } else {
      alert('Error from Woven Update Check');
    }
  }

  //for Tag
  tagCheck() {
    this.newAccessToken = localStorage.getItem('token');

    if (
      (this.newAccessToken === 'Administrator' ||
        this.newAccessToken === 'Sample Head' ||
        this.newAccessToken === 'Customer Service Team') &&
      (this.everything.transactionStatus === 'Production' ||
        this.everything.transactionStatus === 'Quotation / Dispatch')
    ) {
      this.checkAdminTag();
    } else if (
      this.everything.transactionStatus === 'Sample Request Initiated' ||
      this.everything.transactionStatus === 'Customer / Executive Approval' ||
      this.everything.transactionStatus === 'Sample Initiated'
    ) {
      this.checkCustomerTag();
    } else if (
      (this.newAccessToken === 'Customer' ||
        this.newAccessToken === 'Sales Team') &&
      (this.everything.transactionStatus === 'Production' ||
        this.everything.transactionStatus === 'Quotation / Dispatch')
    ) {
      this.checkCustomerTagUpdate();
    } else {
      alert('Error from Tag Check');
    }
  }

  tagUpdateCheck() {
    // this.newAccessToken = localStorage.getItem('token');

    if (
      (localStorage.getItem('token') === 'Administrator' ||
        localStorage.getItem('token') === 'Sample Head' ||
        localStorage.getItem('token') === 'Customer Service Team') &&
      (this.everything.transactionStatus === 'Production' ||
        this.everything.transactionStatus === 'Quotation / Dispatch')
    ) {
      this.checkAdminTagUpdate();
    } else if (
      this.everything.transactionStatus === 'Sample Request Initiated' ||
      this.everything.transactionStatus === 'Customer / Executive Approval' ||
      this.everything.transactionStatus === 'Sample Initiated'
    ) {
      this.checkCustomerTagUpdate();
    } else if (
      (localStorage.getItem('token') === 'Customer' ||
        localStorage.getItem('token') === 'Sales Team') &&
      (this.everything.transactionStatus === 'Production' ||
        this.everything.transactionStatus === 'Quotation / Dispatch')
    ) {
      this.checkCustomerTagUpdate();
    } else {
      alert('Error from Tag Update Check');
    }
  }

  //for Sticker
  stickerCheck() {
    this.newAccessToken = localStorage.getItem('token');

    if (
      (this.newAccessToken === 'Administrator' ||
        this.newAccessToken === 'Sample Head' ||
        this.newAccessToken === 'Customer Service Team') &&
      (this.everything.transactionStatus === 'Production' ||
        this.everything.transactionStatus === 'Quotation / Dispatch')
    ) {
      this.checkAdminSticker();
    } else if (
      this.everything.transactionStatus === 'Sample Request Initiated' ||
      this.everything.transactionStatus === 'Customer / Executive Approval' ||
      this.everything.transactionStatus === 'Sample Initiated'
    ) {
      this.checkCustomerSticker();
    } else if (
      (this.newAccessToken === 'Customer' ||
        this.newAccessToken === 'Sales Team') &&
      (this.everything.transactionStatus === 'Production' ||
        this.everything.transactionStatus === 'Quotation / Dispatch')
    ) {
      this.checkCustomerStickerUpdate();
    } else {
      alert('Error from Sticker Check');
    }
  }

  stickerUpdateCheck() {
    this.newAccessToken = localStorage.getItem('token');

    if (
      (this.newAccessToken === 'Administrator' ||
        this.newAccessToken === 'Sample Head' ||
        this.newAccessToken === 'Customer Service Team') &&
      (this.everything.transactionStatus === 'Production' ||
        this.everything.transactionStatus === 'Quotation / Dispatch')
    ) {
      this.checkAdminStickerUpdate();
    } else if (
      this.everything.transactionStatus === 'Sample Request Initiated' ||
      this.everything.transactionStatus === 'Customer / Executive Approval' ||
      this.everything.transactionStatus === 'Sample Initiated'
    ) {
      this.checkCustomerStickerUpdate();
    } else if (
      (this.newAccessToken === 'Customer' ||
        this.newAccessToken === 'Sales Team') &&
      (this.everything.transactionStatus === 'Production' ||
        this.everything.transactionStatus === 'Quotation / Dispatch')
    ) {
      this.checkCustomerStickerUpdate();
    } else {
      alert('Error from Sticker Update Check');
    }
  }

  //for Printed
  printedCheck() {
    this.newAccessToken = localStorage.getItem('token');

    if (
      (this.newAccessToken === 'Administrator' ||
        this.newAccessToken === 'Sample Head' ||
        this.newAccessToken === 'Customer Service Team') &&
      (this.everything.transactionStatus === 'Production' ||
        this.everything.transactionStatus === 'Quotation / Dispatch')
    ) {
      this.checkAdminPrinted();
    } else if (
      this.everything.transactionStatus === 'Sample Request Initiated' ||
      this.everything.transactionStatus === 'Customer / Executive Approval' ||
      this.everything.transactionStatus === 'Sample Initiated'
    ) {
      this.checkCustomerPrinted();
    } else if (
      (this.newAccessToken === 'Customer' ||
        this.newAccessToken === 'Sales Team') &&
      (this.everything.transactionStatus === 'Production' ||
        this.everything.transactionStatus === 'Quotation / Dispatch')
    ) {
      this.checkCustomerPrintedUpdate();
    } else {
      alert('Error from Printed Check');
    }
  }

  printedUpdateCheck() {
    this.newAccessToken = localStorage.getItem('token');

    if (
      (this.newAccessToken === 'Administrator' ||
        this.newAccessToken === 'Sample Head' ||
        this.newAccessToken === 'Customer Service Team') &&
      (this.everything.transactionStatus === 'Production' ||
        this.everything.transactionStatus === 'Quotation / Dispatch')
    ) {
      this.checkAdminPrintedUpdate();
    } else if (
      this.everything.transactionStatus === 'Sample Request Initiated' ||
      this.everything.transactionStatus === 'Customer / Executive Approval' ||
      this.everything.transactionStatus === 'Sample Initiated'
    ) {
      this.checkCustomerPrintedUpdate();
    } else if (
      (this.newAccessToken === 'Customer' ||
        this.newAccessToken === 'Sales Team') &&
      (this.everything.transactionStatus === 'Production' ||
        this.everything.transactionStatus === 'Quotation / Dispatch')
    ) {
      this.checkCustomerPrintedUpdate();
    } else {
      alert('Error from Printed Update Check');
    }
  }

  //Normal Save with Rejex For ADMIN RIGHTS(Printed)

  checkAdminPrinted() {
    if (
      this.everything.sampName == undefined ||
      this.everything.sampName == '' ||
      this.everything.sampName == null
    ) {
      this._snackBar.open('Please Fill Sample Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampType == undefined ||
      this.everything.sampType == '' ||
      this.everything.sampType == null
    ) {
      this._snackBar.open('Please Fill Sample Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.name == undefined ||
      this.everything.name == '' ||
      this.everything.name == null
    ) {
      this._snackBar.open('Please Fill Customer Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.contactPerson == undefined ||
      this.everything.contactPerson == '' ||
      this.everything.contactPerson == null
    ) {
      this._snackBar.open('Please Fill Contact Person', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.phone == undefined ||
      this.everything.phone == '' ||
      this.everything.phone == null
    ) {
      this._snackBar.open('Please Fill Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.email == undefined ||
      this.everything.email == '' ||
      this.everything.email == null
    ) {
      this._snackBar.open('Please Fill valid EmailId', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.orderType == undefined ||
      this.everything.orderType == '' ||
      this.everything.orderType == null
    ) {
      this._snackBar.open('Please Fill Order Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedDate == undefined ||
      this.everything.expectedDate == '' ||
      this.everything.expectedDate == null
    ) {
      this._snackBar.open('Please Fill Expected Date', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.approvalType == undefined ||
      this.everything.approvalType == '' ||
      this.everything.approvalType == null
    ) {
      this._snackBar.open('Please Fill Approval Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.labelTypePrinted == undefined ||
      this.everything.labelTypePrinted == '' ||
      this.everything.labelTypePrinted == null
    ) {
      this._snackBar.open('Please Fill Label Type for printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitPrinted == undefined ||
      this.everything.unitPrinted == '' ||
      this.everything.unitPrinted == null
    ) {
      this._snackBar.open('Please Fill Unit for printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitHeightPrinted == undefined ||
      this.everything.unitHeightPrinted == '' ||
      this.everything.unitHeightPrinted == null
    ) {
      this._snackBar.open('Please Fill Unit Height in Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else if( this.everything.unitWidthPrinted == undefined || this.everything.unitWidthPrinted == "" || this.everything.unitWidthPrinted == null )
    // {
    //     this._snackBar.open("Please Fill Unit Width for printed", "", {
    //       duration: 2000,
    //       panelClass: ['snackbar1'],
    //       verticalPosition: "top",
    //       horizontalPosition: "center"
    //     });
    // }
    else if (
      this.everything.expectedQuantityPrinted == undefined ||
      this.everything.expectedQuantityPrinted == '' ||
      this.everything.expectedQuantityPrinted == null
    ) {
      this._snackBar.open('Please Fill Expected Quantity Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.colorPrinted == undefined ||
      this.everything.colorPrinted == '' ||
      this.everything.colorPrinted == null
    ) {
      this._snackBar.open('Please Fill Color in Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.foldingPrinted == undefined ||
      this.everything.foldingPrinted == '' ||
      this.everything.foldingPrinted == null
    ) {
      this._snackBar.open('Please Fill Folding in Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else if( this.everything.platesizeSticker == undefined || this.everything.platesizeSticker == "" || this.everything.platesizeSticker == null)
    // {
    //     this._snackBar.open("Please Fill Plate Size Sticker", "", {
    //       duration: 2000,
    //       panelClass: ['snackbar1'],
    //       verticalPosition: "top",
    //       horizontalPosition: "center"
    //     });
    // }
    else if (
      this.everything.finishingPrinted == undefined ||
      this.everything.finishingPrinted == '' ||
      this.everything.finishingPrinted == null
    ) {
      this._snackBar.open('Please Fill Finishing in Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.incomingPrinted == undefined ||
      this.everything.incomingPrinted == '' ||
      this.everything.incomingPrinted == null
    ) {
      this._snackBar.open('Please Fill Incoming Date for printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.dispatchPrinted == undefined ||
      this.everything.dispatchPrinted == '' ||
      this.everything.dispatchPrinted == null
    ) {
      this._snackBar.open('Please Fill Dispatch Date/Time for Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    //dont delete status
    // else if( this.everything.statusPrinted == undefined)
    // {
    //     this._snackBar.open("Please Fill Status for Printed", "", {
    //       duration: 2000,
    //       panelClass: ['snackbar1'],
    //       verticalPosition: "top",
    //       horizontalPosition: "center"
    //     });
    // }
    else if (
      this.everything.pm == undefined ||
      this.everything.pm == '' ||
      this.everything.pm == null
    ) {
      this._snackBar.open('Please Fill Pieces/Meter', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.systemPrinted == undefined ||
      this.everything.systemPrinted == '' ||
      this.everything.systemPrinted == null
    ) {
      this._snackBar.open('Please Fill System for printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.designFileName == undefined ||
      this.everything.designFileName == '' ||
      this.everything.designFileName == null
    ) {
      this._snackBar.open('Please Fill Design File Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.machine == undefined ||
      this.everything.machine == '' ||
      this.everything.machine == null
    ) {
      this._snackBar.open('Please Fill Machine', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else if( this.everything.widthPrinted== undefined || this.everything.widthPrinted == "" || this.everything.widthPrinted == null)
    // {
    //     this._snackBar.open("Please Fill Width for Printed", "", {
    //       duration: 2000,
    //       panelClass: ['snackbar1'],
    //       verticalPosition: "top",
    //       horizontalPosition: "center"
    //     });
    // }

    // else if( this.everything.lengthPrinted == undefined || this.everything.lengthPrinted == "" || this.everything.lengthPrinted == null)
    // {
    //     this._snackBar.open("Please Fill length", "", {
    //       duration: 2000,
    //       panelClass: ['snackbar1'],
    //       verticalPosition: "top",
    //       horizontalPosition: "center"
    //     });
    // }
    else if (
      this.everything.qualityPrinted == undefined ||
      this.everything.qualityPrinted == '' ||
      this.everything.qualityPrinted == null
    ) {
      this._snackBar.open('Please Fill Quality in Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.colorOptionToBeUsedPrinted == undefined ||
      this.everything.colorOptionToBeUsedPrinted == '' ||
      this.everything.colorOptionToBeUsedPrinted == null
    ) {
      this._snackBar.open('Please Fill color Option To Be Used Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.noOfcolors == undefined ||
      this.everything.noOfcolors == '' ||
      this.everything.noOfcolors == null
    ) {
      this._snackBar.open('Please Fill No Of Colors', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.additionalWorkPrinted == undefined ||
      this.everything.additionalWorkPrinted == '' ||
      this.everything.additionalWorkPrinted == null
    ) {
      this._snackBar.open('Please Fill AdditionalWork in Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else {
      this.onSubmitEverything();
    }
  }

  //Normal Save with Rejex For Customer RIGHTS(Printed)

  checkCustomerPrinted() {
    if (
      this.everything.sampName == undefined ||
      this.everything.sampName == '' ||
      this.everything.sampName == null
    ) {
      this._snackBar.open('Please Fill Sample Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampType == undefined ||
      this.everything.sampType == '' ||
      this.everything.sampType == null
    ) {
      this._snackBar.open('Please Fill Sample Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.name == undefined ||
      this.everything.name == '' ||
      this.everything.name == null
    ) {
      this._snackBar.open('Please Fill Customer Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.contactPerson == undefined ||
      this.everything.contactPerson == '' ||
      this.everything.contactPerson == null
    ) {
      this._snackBar.open('Please Fill Contact Person', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.phone == undefined ||
      this.everything.phone == '' ||
      this.everything.phone == null
    ) {
      this._snackBar.open('Please Fill Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.email == undefined ||
      this.everything.email == '' ||
      this.everything.email == null
    ) {
      this._snackBar.open('Please Fill valid EmailId', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.orderType == undefined ||
      this.everything.orderType == '' ||
      this.everything.orderType == null
    ) {
      this._snackBar.open('Please Fill Order Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedDate == undefined ||
      this.everything.expectedDate == '' ||
      this.everything.expectedDate == null
    ) {
      this._snackBar.open('Please Fill Expected Date', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.approvalType == undefined ||
      this.everything.approvalType == '' ||
      this.everything.approvalType == null
    ) {
      this._snackBar.open('Please Fill Approval Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.labelTypePrinted == undefined ||
      this.everything.labelTypePrinted == '' ||
      this.everything.labelTypePrinted == null
    ) {
      this._snackBar.open('Please Fill Label Type for printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitPrinted == undefined ||
      this.everything.unitPrinted == '' ||
      this.everything.unitPrinted == null
    ) {
      this._snackBar.open('Please Fill Unit for printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitHeightPrinted == undefined ||
      this.everything.unitHeightPrinted == '' ||
      this.everything.unitHeightPrinted == null
    ) {
      this._snackBar.open('Please Fill Unit Height in Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else if( this.everything.unitWidthPrinted == undefined || this.everything.unitWidthPrinted == "" || this.everything.unitWidthPrinted == null )
    // {
    //     this._snackBar.open("Please Fill Unit Width for printed", "", {
    //       duration: 2000,
    //       panelClass: ['snackbar1'],
    //       verticalPosition: "top",
    //       horizontalPosition: "center"
    //     });
    // }
    else if (
      this.everything.expectedQuantityPrinted == undefined ||
      this.everything.expectedQuantityPrinted == '' ||
      this.everything.expectedQuantityPrinted == null
    ) {
      this._snackBar.open('Please Fill Expected Quantity Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.colorPrinted == undefined ||
      this.everything.colorPrinted == '' ||
      this.everything.colorPrinted == null
    ) {
      this._snackBar.open('Please Fill Color in Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.foldingPrinted == undefined ||
      this.everything.foldingPrinted == '' ||
      this.everything.foldingPrinted == null
    ) {
      this._snackBar.open('Please Fill Folding in Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else if( this.everything.platesizeSticker == undefined || this.everything.platesizeSticker == "" || this.everything.platesizeSticker == null)
    // {
    //     this._snackBar.open("Please Fill Plate Size Sticker", "", {
    //       duration: 2000,
    //       panelClass: ['snackbar1'],
    //       verticalPosition: "top",
    //       horizontalPosition: "center"
    //     });
    // }
    else if (
      this.everything.finishingPrinted == undefined ||
      this.everything.finishingPrinted == '' ||
      this.everything.finishingPrinted == null
    ) {
      this._snackBar.open('Please Fill Finishing in Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else {
      this.onSubmitEverything();
    }
  }

  //special button and confirmation (for admin)

  checkAdminPrintedUpdate() {
    if (
      this.everything.sampName == undefined ||
      this.everything.sampName == '' ||
      this.everything.sampName == null
    ) {
      this._snackBar.open('Please Fill Sample Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampType == undefined ||
      this.everything.sampType == '' ||
      this.everything.sampType == null
    ) {
      this._snackBar.open('Please Fill Sample Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.name == undefined ||
      this.everything.name == '' ||
      this.everything.name == null
    ) {
      this._snackBar.open('Please Fill Customer Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.contactPerson == undefined ||
      this.everything.contactPerson == '' ||
      this.everything.contactPerson == null
    ) {
      this._snackBar.open('Please Fill Contact Person', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.phone == undefined ||
      this.everything.phone == '' ||
      this.everything.phone == null
    ) {
      this._snackBar.open('Please Fill Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.email == undefined ||
      this.everything.email == '' ||
      this.everything.email == null
    ) {
      this._snackBar.open('Please Fill valid EmailId', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.orderType == undefined ||
      this.everything.orderType == '' ||
      this.everything.orderType == null
    ) {
      this._snackBar.open('Please Fill Order Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedDate == undefined ||
      this.everything.expectedDate == '' ||
      this.everything.expectedDate == null
    ) {
      this._snackBar.open('Please Fill Expected Date', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.approvalType == undefined ||
      this.everything.approvalType == '' ||
      this.everything.approvalType == null
    ) {
      this._snackBar.open('Please Fill Approval Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.labelTypePrinted == undefined ||
      this.everything.labelTypePrinted == '' ||
      this.everything.labelTypePrinted == null
    ) {
      this._snackBar.open('Please Fill Label Type for printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitPrinted == undefined ||
      this.everything.unitPrinted == '' ||
      this.everything.unitPrinted == null
    ) {
      this._snackBar.open('Please Fill Unit for printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitHeightPrinted == undefined ||
      this.everything.unitHeightPrinted == '' ||
      this.everything.unitHeightPrinted == null
    ) {
      this._snackBar.open('Please Fill Unit Height in Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitWidthPrinted == undefined ||
      this.everything.unitWidthPrinted == '' ||
      this.everything.unitWidthPrinted == null
    ) {
      this._snackBar.open('Please Fill Unit Width for printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedQuantityPrinted == undefined ||
      this.everything.expectedQuantityPrinted == '' ||
      this.everything.expectedQuantityPrinted == null
    ) {
      this._snackBar.open('Please Fill Expected Quantity Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.colorPrinted == undefined ||
      this.everything.colorPrinted == '' ||
      this.everything.colorPrinted == null
    ) {
      this._snackBar.open('Please Fill Color in Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.foldingPrinted == undefined ||
      this.everything.foldingPrinted == '' ||
      this.everything.foldingPrinted == null
    ) {
      this._snackBar.open('Please Fill Folding in Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else if( this.everything.platesizeSticker == undefined || this.everything.platesizeSticker == "" || this.everything.platesizeSticker == null)
    // {
    //     this._snackBar.open("Please Fill Plate Size Sticker", "", {
    //       duration: 2000,
    //       panelClass: ['snackbar1'],
    //       verticalPosition: "top",
    //       horizontalPosition: "center"
    //     });
    // }
    else if (
      this.everything.finishingPrinted == undefined ||
      this.everything.finishingPrinted == '' ||
      this.everything.finishingPrinted == null
    ) {
      this._snackBar.open('Please Fill Finishing in Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.incomingPrinted == undefined ||
      this.everything.incomingPrinted == '' ||
      this.everything.incomingPrinted == null
    ) {
      this._snackBar.open('Please Fill Incoming Date for printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    //dont delete status
    // else if( this.everything.statusPrinted == undefined)
    // {
    //     this._snackBar.open("Please Fill Status for Printed", "", {
    //       duration: 2000,
    //       panelClass: ['snackbar1'],
    //       verticalPosition: "top",
    //       horizontalPosition: "center"
    //     });
    // }
    else if (
      this.everything.pm == undefined ||
      this.everything.pm == '' ||
      this.everything.pm == null
    ) {
      this._snackBar.open('Please Fill Pieces/Meter', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.systemPrinted == undefined ||
      this.everything.systemPrinted == '' ||
      this.everything.systemPrinted == null
    ) {
      this._snackBar.open('Please Fill System for printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.designFileName == undefined ||
      this.everything.designFileName == '' ||
      this.everything.designFileName == null
    ) {
      this._snackBar.open('Please Fill Design File Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.machine == undefined ||
      this.everything.machine == '' ||
      this.everything.machine == null
    ) {
      this._snackBar.open('Please Fill Machine', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else if( this.everything.widthPrinted== undefined || this.everything.widthPrinted == "" || this.everything.widthPrinted == null)
    // {
    //     this._snackBar.open("Please Fill Width in Printed", "", {
    //       duration: 2000,
    //       panelClass: ['snackbar1'],
    //       verticalPosition: "top",
    //       horizontalPosition: "center"
    //     });
    // }

    // else if( this.everything.lengthPrinted == undefined || this.everything.lengthPrinted == "" || this.everything.lengthPrinted == null)
    // {
    //     this._snackBar.open("Please Fill length", "", {
    //       duration: 2000,
    //       panelClass: ['snackbar1'],
    //       verticalPosition: "top",
    //       horizontalPosition: "center"
    //     });
    // }
    else if (
      this.everything.qualityPrinted == undefined ||
      this.everything.qualityPrinted == '' ||
      this.everything.qualityPrinted == null
    ) {
      this._snackBar.open('Please Fill Quality in Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.colorOptionToBeUsedPrinted == undefined ||
      this.everything.colorOptionToBeUsedPrinted == '' ||
      this.everything.colorOptionToBeUsedPrinted == null
    ) {
      this._snackBar.open('Please Fill color Option To Be Used Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.noOfcolors == undefined ||
      this.everything.noOfcolors == '' ||
      this.everything.noOfcolors == null
    ) {
      this._snackBar.open('Please Fill No Of Colors', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.additionalWorkPrinted == undefined ||
      this.everything.additionalWorkPrinted == '' ||
      this.everything.additionalWorkPrinted == null
    ) {
      this._snackBar.open('Please Fill AdditionalWork in Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.imageAttachmentIsUploaded == false) {
      this._snackBar.open('Please Upload the Image Attachment', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.scannedSampleIsUploaded == false) {
      this._snackBar.open('Please Upload the Scanned Sample', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else {
      this.updateStatus();
    }
  }

  //special button and confirmation (for Customer)

  checkCustomerPrintedUpdate() {
    if (
      this.everything.sampName == undefined ||
      this.everything.sampName == '' ||
      this.everything.sampName == null
    ) {
      this._snackBar.open('Please Fill Sample Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampType == undefined ||
      this.everything.sampType == '' ||
      this.everything.sampType == null
    ) {
      this._snackBar.open('Please Fill Sample Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.name == undefined ||
      this.everything.name == '' ||
      this.everything.name == null
    ) {
      this._snackBar.open('Please Fill Customer Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.contactPerson == undefined ||
      this.everything.contactPerson == '' ||
      this.everything.contactPerson == null
    ) {
      this._snackBar.open('Please Fill Contact Person', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.phone == undefined ||
      this.everything.phone == '' ||
      this.everything.phone == null
    ) {
      this._snackBar.open('Please Fill Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.email == undefined ||
      this.everything.email == '' ||
      this.everything.email == null
    ) {
      this._snackBar.open('Please Fill valid EmailId', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.orderType == undefined ||
      this.everything.orderType == '' ||
      this.everything.orderType == null
    ) {
      this._snackBar.open('Please Fill Order Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedDate == undefined ||
      this.everything.expectedDate == '' ||
      this.everything.expectedDate == null
    ) {
      this._snackBar.open('Please Fill Expected Date', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.approvalType == undefined ||
      this.everything.approvalType == '' ||
      this.everything.approvalType == null
    ) {
      this._snackBar.open('Please Fill Approval Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.labelTypePrinted == undefined ||
      this.everything.labelTypePrinted == '' ||
      this.everything.labelTypePrinted == null
    ) {
      this._snackBar.open('Please Fill Label Type for printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitPrinted == undefined ||
      this.everything.unitPrinted == '' ||
      this.everything.unitPrinted == null
    ) {
      this._snackBar.open('Please Fill Unit for printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitHeightPrinted == undefined ||
      this.everything.unitHeightPrinted == '' ||
      this.everything.unitHeightPrinted == null
    ) {
      this._snackBar.open('Please Fill Unit Height in Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitWidthPrinted == undefined ||
      this.everything.unitWidthPrinted == '' ||
      this.everything.unitWidthPrinted == null
    ) {
      this._snackBar.open('Please Fill Unit Width for printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedQuantityPrinted == undefined ||
      this.everything.expectedQuantityPrinted == '' ||
      this.everything.expectedQuantityPrinted == null
    ) {
      this._snackBar.open('Please Fill Expected Quantity Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.colorPrinted == undefined ||
      this.everything.colorPrinted == '' ||
      this.everything.colorPrinted == null
    ) {
      this._snackBar.open('Please Fill Color in Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.foldingPrinted == undefined ||
      this.everything.foldingPrinted == '' ||
      this.everything.foldingPrinted == null
    ) {
      this._snackBar.open('Please Fill Folding in Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else if( this.everything.platesizeSticker == undefined || this.everything.platesizeSticker == "" || this.everything.platesizeSticker == null)
    // {
    //     this._snackBar.open("Please Fill Plate Size Sticker", "", {
    //       duration: 2000,
    //       panelClass: ['snackbar1'],
    //       verticalPosition: "top",
    //       horizontalPosition: "center"
    //     });
    // }
    else if (
      this.everything.finishingPrinted == undefined ||
      this.everything.finishingPrinted == '' ||
      this.everything.finishingPrinted == null
    ) {
      this._snackBar.open('Please Fill Finishing in Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else {
      this.updateStatus();
    }
  }

  terms: string;

  sampleCheck: string;

  newLogin(): void {
    this.user = new Userprofile();
  }

  refreshWithTimer() {
    setTimeout(location.reload.bind(location), 500);
  }

  convertArraytoAny: any;

  checkLoginNew() {
    if (this.loginForm.invalid) {
      this._snackBar.open('Username or Password cannot be blank', '', {
        duration: 2000,
        panelClass: ['login-snackbar'],
        verticalPosition: 'top',
      });
      return;
    } else {
      this.LoginService.checkLoginDetails(
        this.loginId,
        this.password
      ).subscribe((data) => {
        this.user = data;

        if (data === null || data === '') {
          this._snackBar.open('Wrong E-mail ID or Password!', '', {
            duration: 2000,
            panelClass: ['login-snackbar'],
            verticalPosition: 'top',
          });
        }

        console.log('Login Successful');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('token', this.user.accessRights);
        localStorage.setItem('userToken', this.user.username);
        localStorage.setItem('emailToken', this.user.loginId);

        //Converting String to Any so that it can be used to set the localStorage token
        this.convertArraytoAny = this.user.trimTypes;

        localStorage.setItem('trimToken', this.convertArraytoAny);
        localStorage.setItem('nameToken', this.user.customerName);

        this.employeeService
          .getCustomerEmail(this.user.loginId)
          .subscribe((data) => {
            this.employee = data;

            if (this.user.accessRights === 'Customer') {
              if (this.employee.verificationStatus === 'Verified') {
                this.modalReference.close();
                this.refreshWithTimer();
              } else {
                this._snackBar.open('Customer is Not Verified', '', {
                  duration: 2000,
                  panelClass: ['login-snackbar'],
                  verticalPosition: 'top',
                });
              }
            } else {
              this.modalReference.close();
              this.refreshWithTimer();
            }
          });
      });
    }
  }

  public disableDetails: boolean = false;

  controlDetails() {
    if (
      this.everything.orderCreatedBy === 'Customer' &&
      localStorage.getItem('token') === 'Sales Team'
    ) {
      this.disableDetails = true;
    }
  }

  refreshPage() {
    if (!localStorage.getItem('foo')) {
      localStorage.setItem('foo', 'no reload');
      location.reload();
    } else {
      localStorage.removeItem('foo');
    }
  }

  public addButtonIsClicked: boolean = false;

  showHiddenDiv() {
    this.changeClass = false;
    this.addButtonIsClicked = true;
  }

  ngOnInit() {
    this.loginAuthenticationInitialisation();

    this.getOtherEmailDetails();

    if (this.tempUploadData[0] == null) {
      this.showEmptyMessage = true;
    }

    // PRODUCT REFERENCE

    this.theProductService.getProductReferenceList().subscribe((data) => {
      this.productReference = data;
      var parsedinfo = JSON.parse(JSON.stringify(data));

      this.printmax = Math.max.apply(
        Math,
        parsedinfo.map(function (o) {
          return o.printNum;
        })
      );
      this.tagmax = Math.max.apply(
        Math,
        parsedinfo.map(function (o) {
          return o.tagNum;
        })
      );
      this.stickermax = Math.max.apply(
        Math,
        parsedinfo.map(function (o) {
          return o.stickerNum;
        })
      );
      this.wovenmax = Math.max.apply(
        Math,
        parsedinfo.map(function (o) {
          return o.wovenNum;
        })
      );

      if (
        this.printmax === -Infinity ||
        this.tagmax === -Infinity ||
        this.stickermax === -Infinity ||
        this.wovenmax === -Infinity
      ) {
        this.printmax = 0;
        this.tagmax = 0;
        this.stickermax = 0;
        this.wovenmax = 0;
      }

      this.printreferencenumber = 'PRINT' + this.printmax;
      this.tagreferencenumber = 'TAG' + this.tagmax;
      this.stickerreferencenumber = 'STICKER' + this.stickermax;
      this.wovenreferencenumber = 'WOVEN' + this.wovenmax;

      this.printnext = this.printmax + 1;
      this.tagnext = this.tagmax + 1;
      this.stickernext = this.stickermax + 1;
      this.wovennext = this.wovenmax + 1;

      if (
        this.printnext === -Infinity ||
        this.tagmax === -Infinity ||
        this.stickermax === -Infinity ||
        this.wovenmax === -Infinity
      ) {
        this.printnext = 1;
        this.tagnext = 1;
        this.stickernext = 1;
        this.wovennext = 1;
      }
    });

    this.everything.sampleRecDateTime = this.everything.orderConfirmationDate;

    // TRANSACTION FORMS

    this.everything = new Everything();

    this.id = this.route.snapshot.params['id'];

    this.everythingService.getEverything(this.id).subscribe(
      (data) => {
        this.everything = data;
        console.log(this.everything);

        this.fetchTerritoryName(this.everything.territoryId);

        //for dynamic folder paths

        if (this.everything.costingAttachmentUsed) {
          //order is an auto created draft order
          let dateArr = this.everything.costingDate.split('-');
          this.filePath = `${Configuration.apiURL}files/${dateArr[0]}---${dateArr[1]}---${dateArr[2]}---costing---`;
        } else {
          let dateArr = this.everything.date.split('-');
          this.filePath = `${Configuration.apiURL}files/${dateArr[2]}---${dateArr[1]}---${dateArr[0]}---${this.everything.refNo}---`;
        }

        //empty the array if it has previously hard coded objects
        if (this.everything.lineitem.length > 0) {
          if ('description' in this.everything.lineitem[0]) {
            this.everything.lineitem = [];
          }
        }

        this.getExecutiveEmailID();

        if (this.everything.secondUploadName != undefined) {
          this.scannedSampleIsUploaded = true;
        }
        if (this.everything.thirdUploadName != undefined) {
          this.imageAttachmentIsUploaded = true;
        }

        this.transactionStatus = this.everything.transactionStatus;
        this.sampleCheck = this.everything.sampleName;

        if (this.everything.sendForCustomerAcceptanceClicked === 'true') {
          this.disableIfSendForCustomerAcceptanceButtonIsClicked = true;
        }

        //Alerts after here.

        this.tempCustomerName = this.everything.name;
        this.customerEmail = this.everything.email;
        // this.lineitem = this.everything.lineitem

        if (localStorage.getItem('isLoggedIn') != 'true') {
          this.toggleAdmin();
        }

        localStorage.setItem(
          'transactionStatusToken',
          this.everything.transactionStatus
        );

        //setting item and desc using sample name
        this.quotationFormBatch.itemAndDescription = this.everything.sampName;

        if (this.everything.sampleName === 'Printed') {
          this.toggleprint();
          this.printedFunctions();
          this.samplename = this.everything.sampleName;
          this.referencenumber = this.everything.refNo;
          this.everything.hsn = '58071010';
          this.quotationFormBatch.hsn = '58071010';
        } else if (this.everything.sampleName === 'Sticker') {
          this.togglesticker();
          this.stickerFunctions();
          this.samplename = this.everything.sampleName;
          this.referencenumber = this.everything.refNo;
          this.everything.hsn = '48114100';
          this.quotationFormBatch.hsn = '48114100';
        } else if (this.everything.sampleName === 'Woven') {
          this.togglewoven();
          this.wovenFunctions();
          this.samplename = this.everything.sampleName;
          this.referencenumber = this.everything.refNo;
          this.everything.hsn = '58071010';
          this.quotationFormBatch.hsn = '58071010';
        } else if (this.everything.sampleName === 'Tag') {
          this.toggletag();
          this.tagFunctions();
          this.samplename = this.everything.sampleName;
          this.referencenumber = this.everything.refNo;
          this.everything.hsn = '48211010';
          this.quotationFormBatch.hsn = '48211010';
        }

        this.everything.itemDescription = this.everything.sampName;

        this.everything.termsAndConditions =
          '1. GOODS ONCE SOLD WILL NOT BE TAKEN BACK OR REFUNDED 2.IF PAYMENT NOT MADE WITHIN 15 DAYS INTEREST @24% P.A WILL BE CHARGED EXTRA 3. ALL DISPUTES ARE SUBJECTS TO TIRUPPUR JURISDICTATION';

        this.checkStatus();

        this.checkUserRights();

        this.controlDetails();

        this.fetchCostingData();
      },
      (error) => console.log(error)
    );

    this.toggleRef();

    this.checkAccess();

    this.customerName = localStorage.getItem('nameToken');

    this.getOtherEmailDetails();

    this.accessToken = localStorage.getItem('token');

    if (
      this.accessToken === 'Administrator' ||
      this.accessToken === 'Sample Head' ||
      this.accessToken === 'Customer Service Team' ||
      this.accessToken === 'Sales Team'
    ) {
      this.showHighAccess = true;
    } else {
      this.showHighAccess = false;
    }

    this.everythingNewObs = this.everythingService.getEverythingSingleID(
      this.id
    );
  }

  fetchTerritoryName(territoryId) {
    this.territoryService.getByTerritoryId(territoryId).subscribe((data) => {
      if (data != null) {
        this.territory = data['name'];
      }
    });
  }

  checkUserRights() {
    if (
      this.everything.transactionStatus === 'Sample Initiated' &&
      localStorage.getItem('token') === 'Customer'
    ) {
      this._snackBar.open('Not Allowed to Access this Page', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
      this.router.navigate(['/header/home']);
    } else {
      // this._snackBar.open("Logged in Successfully", "", {
      //   duration: 2000,
      //   panelClass: ['snackbar3'],
      //   verticalPosition: "top",
      //   horizontalPosition: "center"
      // })
    }
  }

  public showHighAccess: boolean = false;

  accessToken: string;

  modalReference: any;

  open(loginModal) {
    this.modalReference = this.modalService.open(loginModal, {
      keyboard: false,
      backdrop: 'static',
      size: 'xl',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    });
    this.modalReference.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  // Rejected Reason Modal

  openRejected(rejected) {
    this.modalReference = this.modalService.open(rejected, {
      size: 'md',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    });
    this.modalReference.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  loginForm: FormGroup;

  loginId: string;
  password: string;

  get f() {
    return this.loginForm.controls;
  }

  //Status Codes to check which button is being pressed.
  public placeOrderStatus: boolean = false;
  public approveStatus: boolean = false;
  public acceptOrderStatus: boolean = false;
  public completeProductionStatus: boolean = false;
  public acceptStatus: boolean = false;

  placeOrderStatusCode() {
    this.placeOrderStatus = true;
  }

  approveStatusCode() {
    this.approveStatus = true;
  }

  acceptOrderStatusCode() {
    this.acceptOrderStatus = true;
  }

  completeProductionStatusCode() {
    this.completeProductionStatus = true;
  }

  acceptStatusCode() {
    this.acceptStatus = true;
  }

  public sendEmailCheck: boolean = false;

  updateStatus() {
    if (this.placeOrderStatus) {
      this.everything.statusNum = 2;
      this.everything.transactionStatus = 'Customer / Executive Approval';
      this.transactionStatus = 'Customer / Executive Approval';

      // Open Modal to Send E-mail

      if (
        this.accessToken === 'Sales Team' ||
        this.accessToken === 'Administrator'
      ) {
        this.employeeService
          .getCustomerEmail(this.everything.email)
          .subscribe((data: Employee) => {
            this.everything.customerEmailRequired = data.customerEmail;

            if (this.everything.customerEmailRequired == false) {
              this.sendEmailCheck = false;
            } else if (this.everything.customerEmailRequired == true) {
              this.sendEmailCheck = true;
            }

            this.saveEverything();
          });
      } else if (this.accessToken === 'Customer') {
        this.sendEmailCheck = true;
        this.saveEverything();
      }
    } else if (this.approveStatus) {
      this.everything.statusNum = 3;
      this.everything.transactionStatus = 'Sample Initiated';
      this.transactionStatus = 'Sample Initiated';

      // Open Modal to Send E-mail
      this.sendEmailCheck = true;
      this.saveEverythingSampleHeadEmail();
    } else if (this.acceptOrderStatus) {
      this.everything.statusNum = 5;
      this.everything.transactionStatus = 'Production';
      this.transactionStatus = 'Production';

      this.saveEverything();
      this.router.navigate(['/home/orders']);
    } else if (this.completeProductionStatus) {
      this.everything.statusNum = 6;
      this.everything.transactionStatus = 'Quotation / Dispatch';
      this.transactionStatus = 'Quotation / Dispatch';

      this.employeeService
        .getCustomerEmail(this.everything.email)
        .subscribe((data: Employee) => {
          this.everything.customerEmailRequired = data.customerEmail;

          this.saveEverything();
        });

      this.router.navigate(['/home/orders']);
    } else if (this.acceptStatus) {
      this.everything.statusNum = 7;
      this.everything.transactionStatus = 'Sample Approved';
      this.transactionStatus = 'Sample Approved';

      this.saveEverything();
      this.router.navigate(['/home/orders']);
    } else {
      alert('Error From Update Transaction Status');
    }
  }

  sendRejectedEmail() {
    // this.sendCustomerRejectedEmail();
    this.sendExecutiveRejectedEmail();
  }

  updateRejected1() {
    this.everything.statusNum = 4;
    this.everything.transactionStatus = 'Rejection (Production)';
    this.transactionStatus = 'Rejection (Production)';

    this.saveEverythingRejected();
    // this.modalReference.close();

    // this.router.navigate(['/home/orders']);
  }

  updateRejected2() {
    this.everything.statusNum = 8;
    this.everything.transactionStatus = 'Sample Rejected';
    this.transactionStatus = 'Sample Rejected';

    this.saveEverythingRejected();
    this.modalReference.close();

    // this.router.navigate(['/home/orders']);

    // this.sendRejectedEmail();
  }

  reSubmitFunction() {
    this.theProductService.getProductReferenceList().subscribe((data) => {
      this.productReference = data;

      // this.everything.orderCreatedBy = localStorage.getItem('token');

      this.everything.statusNum = 1;
      this.everything.transactionStatus = 'Sample Request Initiated';
      this.transactionStatus = 'Sample Request Initiated';

      this.saveEverything();

      this.router.navigate(['/home/orders']);
    });
  }

  //PRODUCT REFERENCE LOGIC END
  //.............................
  //.............................
  //.............................
  //.............................
  //.............................
  //.............................
  //.............................

  //NEW SAVE AS PDF START

  @ViewChild('woven', { static: false }) content1: ElementRef;
  @ViewChild('tag', { static: false }) content2: ElementRef;
  @ViewChild('sticker', { static: false }) content3: ElementRef;
  @ViewChild('printed', { static: false }) content4: ElementRef;
  @ViewChild('quote', { static: false }) content5: ElementRef;

  //  getWovenPDF() {

  // //create first image

  //   const woven = document.getElementById('woven');
  //   const test = document.getElementById('test');
  //   const options =
  //   {
  //     background: 'white',
  //     scale: 2,
  //   };

  //   woven.style.margin = "28px";

  //   html2canvas(woven, options).then((canvas) => {

  //     var img = canvas.toDataURL("image/PNG");

  //     // Add image Canvas to PDF
  //     const bufferX = 5;
  //     const bufferY = 5;
  //     // const imgProps = (<any>doc).getImageProperties(img);
  //     // const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
  //     // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  //     //Experimental
  //     var imgData = canvas.toDataURL('image/png');
  //     console.log("canvas height : " + canvas.height);
  //     console.log("canvas width : " + canvas.width);

  //     var imgWidth = 210;
  //     var pageHeight = 297;
  //     var imgHeight = canvas.height * imgWidth / canvas.width;
  //     var heightLeft = imgHeight;
  //     console.log("img height : " + imgHeight);
  //     // Commented for Size issues // var doc = new jsPDF('p', 'mm');
  //     var position = 0;

  //     // var doc = new jsPDF('portrait', 'mm', [210, imgHeight], true);
  //     var doc = new jsPDF('portrait', 'mm', 'a4', true);

  //     //x horizantal - y vertical (applies only for top and bottom)
  //     doc.addImage(imgData, 'PNG', 0, 0, 210, imgHeight-10);
  //     heightLeft -= pageHeight;

  //     console.log("height Left : " + heightLeft);

  //     // while (heightLeft >= 0)
  //     // {
  //     //   position = heightLeft - imgHeight;
  //     //   doc.addPage();
  //     //   doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  //     //   heightLeft -= pageHeight;
  //     // }
  //     //Experimental

  //     // doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 1);

  //     return doc;
  //   })

  //   .then((doc) => {
  //     doc.save('Sample.pdf');
  //   });

  // }

  getWovenPDF() {
    //create first image

    const woven1 = document.getElementById('woven1');
    const woven2 = document.getElementById('woven2');
    const options = {
      background: 'white',
      scale: 2,
    };

    woven1.style.margin = '28px';
    woven2.style.margin = '28px';

    html2canvas(woven1, options).then((canvas) => {
      var img = canvas.toDataURL('image/PNG');

      // Add image Canvas to PDF
      const bufferX = 5;
      const bufferY = 5;
      // const imgProps = (<any>doc).getImageProperties(img);
      // const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      //Experimental
      var imgData = canvas.toDataURL('image/png');
      console.log('canvas height : ' + canvas.height);
      console.log('canvas width : ' + canvas.width);

      var imgWidth = 210;
      var pageHeight = 297;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;
      console.log('img height : ' + imgHeight);
      // Commented for Size issues // var doc = new jsPDF('p', 'mm');
      var position = 0;

      // var doc = new jsPDF('portrait', 'mm', [210, imgHeight], true);
      var doc = new jsPDF('portrait', 'mm', 'a4', true);

      //x horizantal - y vertical (applies only for top and bottom)
      doc.addImage(imgData, 'PNG', 0, 0, 210, imgHeight - 10);
      heightLeft -= pageHeight;

      console.log('height Left : ' + heightLeft);

      // while (heightLeft >= 0)
      // {
      //   position = heightLeft - imgHeight;
      //   doc.addPage();
      //   doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      //   heightLeft -= pageHeight;
      // }
      //Experimental

      // doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 1);

      html2canvas(woven2, options)
        .then((canvas2) => {
          var img2 = canvas2.toDataURL('image/PNG');

          //Experimental
          var imgData2 = canvas2.toDataURL('image/png');
          console.log('canvas2 height : ' + canvas2.height);
          console.log('canvas2 width : ' + canvas2.width);

          var imgWidth2 = 210;
          var pageHeight2 = 297;
          var imgHeight2 = (canvas2.height * imgWidth2) / canvas2.width;
          var heightLeft2 = imgHeight2;
          console.log('img height2 : ' + imgHeight2);

          doc.addPage('a4', 'p');
          doc.addImage(imgData2, 'PNG', 0, 10, imgWidth2, imgHeight2);
          // var doc2 = new jsPDF('portrait', 'mm', 'a4', true);

          //x horizantal - y vertical (applies only for top and bottom)
          // doc.addImage(imgData, 'PNG', 0, 0, 210, imgHeight-10);
          // heightLeft -= pageHeight;

          console.log('height Left2 : ' + heightLeft2);

          // while (heightLeft >= 0)
          // {
          //   position = heightLeft - imgHeight;
          //   doc.addPage();
          //   doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          //   heightLeft -= pageHeight;
          // }
          //Experimental

          // doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 1);

          return doc;
        })
        .then((doc) => {
          doc.save('Sample.pdf');
        });
    });
  }

  //costing PDF
  costingPdf() {
    //create first image

    const costingModal = document.getElementById('costinghidden');
    const options = {
      background: 'white',
      scale: 2,
    };
    // costingModal.style.margin = '28px';

    html2canvas(costingModal, options)
      .then((canvas) => {
        var img = canvas.toDataURL('image/PNG');
        var doc = new jsPDF('portrait', 'mm', 'a4', true);

        // Add image Canvas to PDF
        const bufferX = 5;
        const bufferY = 5;
        const imgProps = (<any>doc).getImageProperties(img);
        // const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        //Experimental
        var imgData = canvas.toDataURL('image/png');
        var imgWidth = 210;
        var pageHeight = 295;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        var heightLeft = imgHeight;
        // Commented for Size issues
        // var doc = new jsPDF('p', 'mm');
        var position = 0;

        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        //Experimental

        // doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 1);

        return doc;
      })

      .then((doc) => {
        doc.save(this.everything.refNo);
      });
  }

  public isCostingPresent: boolean = false;

  fetchCostingData() {
    this.costingSheetService
      .getCostingSheetByOrderId(this.everything.id)
      .subscribe(
        (data: Costing) => {
          console.log('oID: ' + this.everything.id);
          console.log(data);
          if (data != null) {
            this.costing = data;
            this.isCostingPresent = true;
          } else {
            this.isCostingPresent = false;
          }
        },
        (error) => {}
      );
  }

  saveCostingData(internalCall?: boolean) {
    //if its an internal call check if billing data exists
    if (
      typeof internalCall !== 'undefined' &&
      (this.costing.boardName == '' ||
        this.costing.totalRawMaterialCost == null)
    ) {
      //don't save costing data
    } else {
      this.costing.orderId = this.everything.id;
      this.costingSheetService.createCostingSheet(this.costing).subscribe(
        (data: Costing) => {
          if (typeof internalCall === 'undefined') {
            this.snackBarService.showSuccessSnack(
              'Costing Sheet Successfully Saved'
            );
            document.getElementById('costingSheetCloseBtn').click();
          }

          this.isCostingPresent = true;

          //to prevent multiple creations
          this.costing.id = data.id;
        },
        (error) => {
          console.log('Error while saving costing sheet' + error);
        }
      );
    }
  }

  // Quotation PDF

  quotationPDF() {
    //create first image

    const quoteModal = document.getElementById('quoteModal');
    const options = {
      background: 'white',
      scale: 2,
    };

    html2canvas(quoteModal, options)
      .then((canvas) => {
        var img = canvas.toDataURL('image/PNG');
        var doc = new jsPDF('portrait', 'mm', 'a4', true);

        // Add image Canvas to PDF
        const bufferX = 5;
        const bufferY = 5;
        const imgProps = (<any>doc).getImageProperties(img);
        // const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        //Experimental
        var imgData = canvas.toDataURL('image/png');
        var imgWidth = 210;
        var pageHeight = 295;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        var heightLeft = imgHeight;
        // Commented for Size issues
        // var doc = new jsPDF('p', 'mm');
        var position = 0;

        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        //Experimental

        // doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 1);

        return doc;
      })

      .then((doc) => {
        doc.save(this.everything.refNo);
      });
  }

  getTagPDF() {
    //create first image

    const tag1 = document.getElementById('tag1');
    const tag2 = document.getElementById('tag2');
    const options = {
      background: 'white',
      scale: 2,
    };

    html2canvas(tag1, options).then((canvas) => {
      var img = canvas.toDataURL('image/PNG');

      // Add image Canvas to PDF
      const bufferX = 5;
      const bufferY = 5;

      //Experimental
      var imgData = canvas.toDataURL('image/png');
      console.log('canvas height : ' + canvas.height);
      console.log('canvas width : ' + canvas.width);

      var imgWidth = 210;
      var pageHeight = 297;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;
      console.log('img height : ' + imgHeight);
      // Commented for Size issues // var doc = new jsPDF('p', 'mm');
      var position = 0;

      // var doc = new jsPDF('portrait', 'mm', [210, imgHeight], true);
      var doc = new jsPDF('portrait', 'mm', 'a4', true);

      //x horizantal - y vertical (applies only for top and bottom)
      doc.addImage(imgData, 'PNG', 0, 0, 210, imgHeight - 10);
      heightLeft -= pageHeight;

      console.log('height Left : ' + heightLeft);

      html2canvas(tag2, options)
        .then((canvas2) => {
          var img2 = canvas2.toDataURL('image/PNG');

          //Experimental
          var imgData2 = canvas2.toDataURL('image/png');
          console.log('canvas2 height : ' + canvas2.height);
          console.log('canvas2 width : ' + canvas2.width);

          var imgWidth2 = 210;
          var pageHeight2 = 297;
          var imgHeight2 = (canvas2.height * imgWidth2) / canvas2.width;
          var heightLeft2 = imgHeight2;
          console.log('img height2 : ' + imgHeight2);

          doc.addPage('a4', 'p');
          doc.addImage(imgData2, 'PNG', 0, 10, imgWidth2, imgHeight2);

          console.log('height Left2 : ' + heightLeft2);

          return doc;
        })
        .then((doc) => {
          doc.save('Sample.pdf');
        });
    });
  }

  getStickerPDF() {
    //create first image

    const sticker1 = document.getElementById('sticker1');
    const sticker2 = document.getElementById('sticker2');

    const options = {
      background: 'white',
      scale: 2,
    };

    sticker1.style.margin = '28px';
    sticker2.style.margin = '28px';

    html2canvas(sticker1, options).then((canvas) => {
      var img = canvas.toDataURL('image/PNG');

      // Add image Canvas to PDF
      const bufferX = 5;
      const bufferY = 5;

      //Experimental
      var imgData = canvas.toDataURL('image/png');
      console.log('canvas height : ' + canvas.height);
      console.log('canvas width : ' + canvas.width);

      var imgWidth = 210;
      var pageHeight = 297;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;
      console.log('img height : ' + imgHeight);
      // Commented for Size issues // var doc = new jsPDF('p', 'mm');
      var position = 0;

      // var doc = new jsPDF('portrait', 'mm', [210, imgHeight], true);
      var doc = new jsPDF('portrait', 'mm', 'a4', true);

      //x horizantal - y vertical (applies only for top and bottom)
      doc.addImage(imgData, 'PNG', 0, 0, 210, imgHeight - 10);
      heightLeft -= pageHeight;

      console.log('height Left : ' + heightLeft);

      html2canvas(sticker2, options)
        .then((canvas2) => {
          var img2 = canvas2.toDataURL('image/PNG');

          //Experimental
          var imgData2 = canvas2.toDataURL('image/png');
          console.log('canvas2 height : ' + canvas2.height);
          console.log('canvas2 width : ' + canvas2.width);

          var imgWidth2 = 210;
          var pageHeight2 = 297;
          var imgHeight2 = (canvas2.height * imgWidth2) / canvas2.width;
          var heightLeft2 = imgHeight2;
          console.log('img height2 : ' + imgHeight2);

          doc.addPage('a4', 'p');
          doc.addImage(imgData2, 'PNG', 0, 10, imgWidth2, imgHeight2);

          console.log('height Left2 : ' + heightLeft2);

          return doc;
        })
        .then((doc) => {
          doc.save('Sample.pdf');
        });
    });
  }

  executiveCode: string;
  executiveEmail: string;
  employeeName: string;
  tempCustomerName: string;

  getCustomerName() {
    this.tempCustomerName = this.everything.name;
  }

  getOtherEmailDetails() {
    this.dataset.email = this.executiveEmail;
    this.dataset.customerName = this.tempCustomerName;
    this.dataset.executiveCode = this.executiveCode;
    this.dataset.sampleRequestNumber = this.referencenumber;
  }

  getExecutiveEmailID() {
    this.mexecutiveService
      .getByExecutiveName(this.everything.execName)
      .subscribe((data: Mexecutive) => {
        this.executiveCode = data.code;
        this.executiveEmail = data.emailId;
      });
  }

  attachmentVar: number = 0;
  public attachCheck1: boolean = false;
  public attachCheck2: boolean = false;
  public attachCheck3: boolean = false;
  public attachCheck4: boolean = false;

  addAttachment() {
    ++this.attachmentVar;

    if (this.attachmentVar == 1) {
      this.attachCheck1 = true;
    } else if (this.attachmentVar == 2) {
      this.attachCheck2 = true;
    } else if (this.attachmentVar == 3) {
      this.attachCheck3 = true;
    } else if (this.attachmentVar == 4) {
      this.attachCheck4 = true;
    }
  }

  public blurBackground: boolean = true;

  sendEmail() {
    if (
      this.transactionStatus === 'Customer / Executive Approval' &&
      localStorage.getItem('token') === 'Sales Team'
    ) {
      this.sendCustomerEmail();
    } else if (
      this.transactionStatus === 'Customer / Executive Approval' &&
      localStorage.getItem('token') === 'Customer'
    ) {
      this.sendExecutiveEmail();
    } else if (
      this.transactionStatus === 'Customer / Executive Approval' &&
      localStorage.getItem('token') === 'Administrator'
    ) {
      this.sendExecutiveEmail();
      this.sendCustomerEmail();
    } else if (
      this.transactionStatus === 'Sample Approved' &&
      localStorage.getItem('token') === 'Administrator'
    ) {
      this.sendExecutiveEmail();
    } else if (this.transactionStatus === 'Quotation / Dispatch') {
      // this.sendCustomerEmailWithAttachment();
    } else {
      alert('Error, No Mail for this Type');
    }
  }

  sendCustomerEmailWithAttachment() {
    this.getPageURL();

    this.dataset.email = this.everything.email;
    this.dataset.customerName = this.tempCustomerName;
    this.dataset.executiveCode = this.everything.executiveCode;
    this.dataset.sampleRequestNumber = this.referencenumber;

    let dateArr = this.everything.date.split('-');
    let localPath: string = `${dateArr[2]}---${dateArr[1]}---${dateArr[0]}---${this.everything.refNo}---Quotation-${this.referencenumber}.pdf`;

    this.https
      .post<Details>(
        `${Configuration.apiURL}ilabel/quotationattachment/${localPath}/`,
        this.dataset
      )
      .subscribe(
        (res) => {
          this.dataset = res;
          console.log(this.dataset);
          this._snackBar.open('Email Sent successfully', '', {
            duration: 2000,
            panelClass: ['snackbar3'],
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });

          this.dataset.customerName = '';
          this.dataset.executiveCode = '';
          this.dataset.sampleRequestNumber = '';
          this.dataset.pageURL = '';
          this.dataset.attachment1 = '';

          this.router.navigate(['/home/orders']);
        },
        (error) =>
          alert(
            'Server Data Error from Send Customer E-mail With Attachment :: ' +
              JSON.stringify(error.status)
          )
      );

    this.disableIfSendForCustomerAcceptanceButtonIsClicked = true;
  }

  sendExecutiveEmail() {
    this.getPageURL();

    this.dataset.email = this.executiveEmail;
    this.dataset.customerName = this.tempCustomerName;
    this.dataset.executiveCode = this.executiveCode;
    this.dataset.sampleRequestNumber = this.referencenumber;

    this.https
      .post<Details>(`${Configuration.apiURL}ilabel/email`, this.dataset)
      .subscribe(
        (res) => {
          this.dataset = res;
          console.log(this.dataset);
          this._snackBar.open('Email Sent successfully', '', {
            duration: 2000,
            panelClass: ['snackbar3'],
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
          this.dataset.customerName = '';
          this.dataset.executiveCode = '';
          this.dataset.sampleRequestNumber = '';
          this.dataset.pageURL = '';

          this.router.navigate(['/home/orders']);
        },
        (error) =>
          alert(
            'Server Data Error from Executive E-mail :: ' +
              JSON.stringify(error.status)
          )
      );
  }

  sendExecutiveRejectedEmail() {
    this.getPageURL();

    this.dataset.email = this.executiveEmail;
    this.dataset.customerName = this.tempCustomerName;
    this.dataset.executiveCode = this.executiveCode;
    this.dataset.sampleRequestNumber = this.referencenumber;

    this.https
      .post<Details>(
        `${Configuration.apiURL}ilabel/rejectedemail`,
        this.dataset
      )
      .subscribe(
        (res) => {
          this.dataset = res;
          console.log(this.dataset);
          this._snackBar.open('Email Sent successfully', '', {
            duration: 2000,
            panelClass: ['snackbar3'],
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
          this.dataset.customerName = '';
          this.dataset.executiveCode = '';
          this.dataset.sampleRequestNumber = '';
          this.dataset.pageURL = '';

          this.router.navigate(['/home/orders']);
        },
        (error) =>
          alert(
            'Server Data Error from Executive Rejected E-mail :: ' +
              JSON.stringify(error.status)
          )
      );
  }

  // Test E-mail with Attachment
  sendEmailTest() {
    this.getPageURL();

    this.dataset.email = 'sriharish@indsys.holdings';
    this.dataset.customerName = 'Sriharish';
    this.dataset.executiveCode = '1111';
    this.dataset.sampleRequestNumber = 'WOVEN222';
    this.dataset.pageURL = 'https://www.google.com/';

    this.dataset.attachment1 = 'WOVEN1.pdf';

    this.https
      .post<Details>(
        `${Configuration.apiURL}ilabel/singleattachment`,
        this.dataset
      )
      .subscribe((res) => {
        this.dataset = res;
        console.log(this.dataset);
        this._snackBar.open('Email Sent successfully', '', {
          duration: 2000,
          panelClass: ['snackbar3'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
        this.dataset.customerName = '';
        this.dataset.executiveCode = '';
        this.dataset.sampleRequestNumber = '';
        this.dataset.pageURL = '';
      });
  }

  sendEmailWithSingleAttachment() {
    this.getPageURL();

    this.dataset.email = this.executiveEmail;
    this.dataset.customerName = this.tempCustomerName;
    this.dataset.executiveCode = this.executiveCode;
    this.dataset.sampleRequestNumber = this.referencenumber;

    this.dataset.attachment1 = this.everything.sixthUploadName;

    this.https
      .post<Details>(
        `${Configuration.apiURL}ilabel/singleattachment`,
        this.dataset
      )
      .subscribe(
        (res) => {
          this.dataset = res;
          console.log(this.dataset);
          this._snackBar.open('Email Sent successfully', '', {
            duration: 2000,
            panelClass: ['snackbar3'],
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
          this.dataset.customerName = '';
          this.dataset.executiveCode = '';
          this.dataset.sampleRequestNumber = '';
          this.dataset.pageURL = '';
        },
        (error) =>
          alert(
            'Server Data Error from Sending E-mail With Single Attachment :: ' +
              JSON.stringify(error.status)
          )
      );
  }

  customerEmail: string;

  sendCustomerEmail() {
    this.getPageURL();

    this.dataset.email = this.customerEmail;
    this.dataset.customerName = this.tempCustomerName;
    this.dataset.executiveCode = this.executiveCode;
    this.dataset.sampleRequestNumber = this.referencenumber;

    //Customer E-mail
    this.https
      .post<Details>(`${Configuration.apiURL}ilabel/email`, this.dataset)
      .subscribe(
        (res) => {
          this.dataset = res;
          console.log(this.dataset);
          this._snackBar.open('Email Sent successfully', '', {
            duration: 2000,
            panelClass: ['snackbar3'],
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });

          this.dataset.customerName = '';
          this.dataset.executiveCode = '';
          this.dataset.sampleRequestNumber = '';
          this.dataset.pageURL = '';

          this.router.navigate(['/home/orders']);
        },
        (error) =>
          alert(
            'Server Data Error from Customer E-mail :: ' +
              JSON.stringify(error.status)
          )
      );
  }

  sendCustomerRejectedEmail() {
    this.getPageURL();

    this.dataset.email = this.customerEmail;
    this.dataset.customerName = this.tempCustomerName;
    this.dataset.executiveCode = this.executiveCode;
    this.dataset.sampleRequestNumber = this.referencenumber;

    //Customer E-mail
    this.https
      .post<Details>(
        `${Configuration.apiURL}ilabel/rejectedemail`,
        this.dataset
      )
      .subscribe(
        (res) => {
          this.dataset = res;
          console.log(this.dataset);
          this._snackBar.open('Email Sent successfully', '', {
            duration: 2000,
            panelClass: ['snackbar3'],
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });

          this.dataset.customerName = '';
          this.dataset.executiveCode = '';
          this.dataset.sampleRequestNumber = '';
          this.dataset.pageURL = '';

          this.router.navigate(['/home/orders']);
        },
        (error) =>
          alert(
            'Server Data Error from Customer Rejected E-mail:: ' +
              JSON.stringify(error.status)
          )
      );
  }

  printSampleHeadEmail: string;
  wovenSampleHeadEmail: string;
  tagSampleHeadEmail: string;
  stickerSampleHeadEmail: string;

  printSampleHeadEmailArray: string;
  wovenSampleHeadEmailArray: string;
  tagSampleHeadEmailArray: string;
  stickerSampleHeadEmailArray: string;

  getSampleHeadEmail() {
    this.LoginService.checkAccessDetails('Sample Head').subscribe((data) => {
      this.user = data;

      for (let i = 0; i < data.length; i++) {
        if (
          (this.user[i].trimTypes[0] === 'Woven' ||
            this.user[i].trimTypes[1] === 'Woven' ||
            this.user[i].trimTypes[2] === 'Woven' ||
            this.user[i].trimTypes[3] === 'Woven') &&
          this.everything.sampleName === 'Woven'
        ) {
          this.wovenSampleHeadEmailArray = this.user[i].loginId;
          this.sendWovenSampleHeadEmail();
        } else if (
          (this.user[i].trimTypes[0] === 'Print' ||
            this.user[i].trimTypes[1] === 'Print' ||
            this.user[i].trimTypes[2] === 'Print' ||
            this.user[i].trimTypes[3] === 'Print') &&
          this.everything.sampleName === 'Printed'
        ) {
          this.printSampleHeadEmailArray = this.user[i].loginId;
          this.sendPrintedSampleHeadEmail();
        } else if (
          (this.user[i].trimTypes[0] === 'Tag' ||
            this.user[i].trimTypes[1] === 'Tag' ||
            this.user[i].trimTypes[2] === 'Tag' ||
            this.user[i].trimTypes[3] === 'Tag') &&
          this.everything.sampleName === 'Tag'
        ) {
          this.tagSampleHeadEmailArray = this.user[i].loginId;
          this.sendTagSampleHeadEmail();
        } else if (
          (this.user[i].trimTypes[0] === 'Sticker' ||
            this.user[i].trimTypes[1] === 'Sticker' ||
            this.user[i].trimTypes[2] === 'Sticker' ||
            this.user[i].trimTypes[3] === 'Sticker') &&
          this.everything.sampleName === 'Sticker'
        ) {
          this.stickerSampleHeadEmailArray = this.user[i].loginId;
          this.sendStickerSampleHeadEmail();
        }
      }
    });
  }

  sendWovenSampleHeadEmail() {
    this.getPageURL();

    this.dataset.email = this.wovenSampleHeadEmailArray;
    this.dataset.customerName = this.tempCustomerName;
    this.dataset.executiveCode = this.everything.executiveCode;
    this.dataset.sampleRequestNumber = this.referencenumber;

    this.https
      .post<Details>(`${Configuration.apiURL}ilabel/email`, this.dataset)
      .subscribe(
        (res) => {
          this.dataset = res;
          console.log(this.dataset);
          this._snackBar.open('Email Sent successfully', '', {
            duration: 2000,
            panelClass: ['snackbar3'],
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
          this.dataset.customerName = '';
          this.dataset.executiveCode = '';
          this.dataset.sampleRequestNumber = '';
          this.dataset.pageURL = '';

          this.router.navigate(['/home/orders']);
        },
        (error) =>
          alert(
            'Server Data Error from Woven Sample Head E-mail :: ' +
              JSON.stringify(error.status)
          )
      );
  }

  sendPrintedSampleHeadEmail() {
    this.getPageURL();

    this.dataset.email = this.printSampleHeadEmailArray;
    this.dataset.customerName = this.tempCustomerName;
    this.dataset.executiveCode = this.executiveCode;
    this.dataset.sampleRequestNumber = this.referencenumber;

    this.https
      .post<Details>(`${Configuration.apiURL}ilabel/email`, this.dataset)
      .subscribe(
        (res) => {
          this.dataset = res;
          console.log(this.dataset);
          this._snackBar.open('Email Sent successfully', '', {
            duration: 2000,
            panelClass: ['snackbar3'],
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
          this.dataset.customerName = '';
          this.dataset.executiveCode = '';
          this.dataset.sampleRequestNumber = '';
          this.dataset.pageURL = '';

          this.router.navigate(['/home/orders']);
        },
        (error) =>
          alert(
            'Server Data Error from Printed Sample Head E-mail :: ' +
              JSON.stringify(error.status)
          )
      );
  }

  sendTagSampleHeadEmail() {
    this.getPageURL();

    this.dataset.email = this.tagSampleHeadEmailArray;
    this.dataset.customerName = this.tempCustomerName;
    this.dataset.executiveCode = this.executiveCode;
    this.dataset.sampleRequestNumber = this.referencenumber;

    //Customer E-mail
    this.https
      .post<Details>(`${Configuration.apiURL}ilabel/email`, this.dataset)
      .subscribe(
        (res) => {
          this.dataset = res;
          console.log(this.dataset);
          this._snackBar.open('Email Sent successfully', '', {
            duration: 2000,
            panelClass: ['snackbar3'],
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
          this.dataset.customerName = '';
          this.dataset.executiveCode = '';
          this.dataset.sampleRequestNumber = '';
          this.dataset.pageURL = '';

          this.router.navigate(['/home/orders']);
        },
        (error) =>
          alert(
            'Server Data Error from Tag Sample Head E-mail :: ' +
              JSON.stringify(error.status)
          )
      );
  }

  //

  sendStickerSampleHeadEmail() {
    this.getPageURL();

    this.dataset.email = this.stickerSampleHeadEmailArray;
    this.dataset.customerName = this.tempCustomerName;
    this.dataset.executiveCode = this.executiveCode;
    this.dataset.sampleRequestNumber = this.referencenumber;

    //Customer E-mail
    this.https
      .post<Details>(`${Configuration.apiURL}ilabel/email`, this.dataset)
      .subscribe(
        (res) => {
          this.dataset = res;
          console.log(this.dataset);
          this._snackBar.open('Email Sent successfully', '', {
            duration: 2000,
            panelClass: ['snackbar3'],
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
          this.dataset.customerName = '';
          this.dataset.executiveCode = '';
          this.dataset.sampleRequestNumber = '';
          this.dataset.pageURL = '';

          this.router.navigate(['/home/orders']);
        },
        (error) =>
          alert(
            'Server Data Error from Sticker Sample Head E-mail :: ' +
              JSON.stringify(error.status)
          )
      );
  }

  getPrintedPDF() {
    //create first image

    const printed1 = document.getElementById('printed1');
    const printed2 = document.getElementById('printed2');
    const options = {
      background: 'white',
      scale: 2,
    };

    printed1.style.margin = '28px';
    printed2.style.margin = '28px';

    html2canvas(printed1, options).then((canvas) => {
      var img = canvas.toDataURL('image/PNG');

      // Add image Canvas to PDF
      const bufferX = 5;
      const bufferY = 5;

      //Experimental
      var imgData = canvas.toDataURL('image/png');
      console.log('canvas height : ' + canvas.height);
      console.log('canvas width : ' + canvas.width);

      var imgWidth = 210;
      var pageHeight = 297;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;
      console.log('img height : ' + imgHeight);
      // Commented for Size issues // var doc = new jsPDF('p', 'mm');
      var position = 0;

      // var doc = new jsPDF('portrait', 'mm', [210, imgHeight], true);
      var doc = new jsPDF('portrait', 'mm', 'a4', true);

      //x horizantal - y vertical (applies only for top and bottom)
      doc.addImage(imgData, 'PNG', 0, 0, 210, imgHeight - 10);
      heightLeft -= pageHeight;

      console.log('height Left : ' + heightLeft);

      html2canvas(printed2, options)
        .then((canvas2) => {
          var img2 = canvas2.toDataURL('image/PNG');

          //Experimental
          var imgData2 = canvas2.toDataURL('image/png');
          console.log('canvas2 height : ' + canvas2.height);
          console.log('canvas2 width : ' + canvas2.width);

          var imgWidth2 = 210;
          var pageHeight2 = 297;
          var imgHeight2 = (canvas2.height * imgWidth2) / canvas2.width;
          var heightLeft2 = imgHeight2;
          console.log('img height2 : ' + imgHeight2);

          doc.addPage('a4', 'p');
          doc.addImage(imgData2, 'PNG', 0, 10, imgWidth2, imgHeight2);

          console.log('height Left2 : ' + heightLeft2);

          return doc;
        })
        .then((doc) => {
          doc.save('Sample.pdf');
        });
    });
  }
  //NEW SAVE AS PDF END

  // Upload

  selectedFiles: FileList;
  currentFile1: File;
  currentFile2: File;
  currentFile3: File;
  currentFile4: File;
  quotationFile: File;
  progress = 0;
  artWorkProgress = 0;
  scannedProgress = 0;
  imageProgress = 0;
  optionalProgress = 0;
  message = '';
  latestName = '';

  fileInfos: Observable<any>;

  uploadedFileNameObservable: Observable<Upload[]>;
  uploadedFileName: Upload = new Upload();

  selectFile1(event) {
    this.selectedFiles = event.target.files;

    this.upload1();
  }

  selectFile2(event) {
    this.selectedFiles = event.target.files;

    this.upload2();
  }

  selectFile3(event) {
    this.selectedFiles = event.target.files;

    this.upload3();
  }

  selectFile4(event) {
    this.selectedFiles = event.target.files;

    this.upload4();
  }

  iValue: number = 0;
  nameStorage = [];

  @ViewChild('artworkAttachment') artworkAttachment: ElementRef;
  @ViewChild('scannedAttachment') scannedAttachment: ElementRef;
  @ViewChild('imageAttachment') imageAttachment: ElementRef;
  @ViewChild('optionalAttachment') optionalAttachment: ElementRef;

  // Artwork Attachment Reset
  resetArtworkAttachment() {
    this.uploadService
      .deleteFiles(
        this.everything.uploadName,
        this.everything.date,
        this.everything.refNo
      )
      .subscribe((data: any) => {});

    console.log(this.artworkAttachment.nativeElement.files);
    this.artworkAttachment.nativeElement.value = '';
    console.log(this.artworkAttachment.nativeElement.files);

    this.everything.uploadName = '';
    this.everything.uploadName = null;

    this._snackBar.open('File Removed Successfully', '', {
      duration: 2000,
      panelClass: ['snackbar3'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });

    this.artWorkProgress = 0;
  }

  // Scanned Attachment Reset
  resetScannedAttachment() {
    this.uploadService
      .deleteFiles(
        this.everything.secondUploadName,
        this.everything.date,
        this.everything.refNo
      )
      .subscribe((data: any) => {});

    console.log(this.scannedAttachment.nativeElement.files);
    this.scannedAttachment.nativeElement.value = '';
    console.log(this.scannedAttachment.nativeElement.files);

    this.everything.secondUploadName = '';
    this.everything.secondUploadName = null;

    this._snackBar.open('File Removed Successfully', '', {
      duration: 2000,
      panelClass: ['snackbar3'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });

    this.scannedProgress = 0;
  }

  // Image Attachment Reset
  resetImageAttachment() {
    this.uploadService
      .deleteFiles(
        this.everything.thirdUploadName,
        this.everything.date,
        this.everything.refNo
      )
      .subscribe((data: any) => {});

    console.log(this.imageAttachment.nativeElement.files);
    this.imageAttachment.nativeElement.value = '';
    console.log(this.imageAttachment.nativeElement.files);

    this.everything.thirdUploadName = '';
    this.everything.thirdUploadName = null;

    this._snackBar.open('File Removed Successfully', '', {
      duration: 2000,
      panelClass: ['snackbar3'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });

    this.imageProgress = 0;
  }

  // Image Attachment Reset
  resetOptionalAttachment() {
    this.uploadService
      .deleteFiles(
        this.everything.fourthUploadName,
        this.everything.date,
        this.everything.refNo
      )
      .subscribe((data: any) => {});

    console.log(this.optionalAttachment.nativeElement.files);
    this.optionalAttachment.nativeElement.value = '';
    console.log(this.optionalAttachment.nativeElement.files);

    this.everything.fourthUploadName = '';
    this.everything.fourthUploadName = null;

    this._snackBar.open('File Removed Successfully', '', {
      duration: 2000,
      panelClass: ['snackbar3'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });

    this.optionalProgress = 0;
  }

  transactionStatusToken: string;

  upload1() {
    this.artWorkProgress = 0;

    this.currentFile1 = this.selectedFiles.item(0);

    this.uploadService
      .upload(this.currentFile1, this.everything.date, this.everything.refNo)
      .subscribe(
        (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.artWorkProgress = Math.round(
              (100 * event.loaded) / event.total
            );
          } else if (event instanceof HttpResponse) {
            this.message = event.body.message;
            this.latestName = event.body.latestName;
            this.fileInfos = this.uploadService.getFiles();

            if (this.message == 'File upload error. Please try again') {
              // this.everything.uploadName = null;

              this._snackBar.open(
                'File Upload Error. Please try again with a different File Name',
                '',
                {
                  duration: 2000,
                  panelClass: ['snackbar2'],
                  verticalPosition: 'top',
                  horizontalPosition: 'center',
                }
              );

              this.artWorkProgress = 0;
            } else {
              this.everything.uploadName = this.message;
              //Note: write a cotroller in everything to update just the 1st upload name

              this._snackBar.open('File Uploaded Successfully', '', {
                duration: 2000,
                panelClass: ['snackbar3'],
                verticalPosition: 'top',
                horizontalPosition: 'center',
              });
            }

            // this.uploadService.getFiles().subscribe((data) => {
            //   this.uploadedFileName = data;

            // this.everything.uploadName = this.nameStorage
            // this.tempUploadName = this.nameStorage

            // ++this.iValue;
            // });
          }
        },
        (err) => {
          this.artWorkProgress = 0;
          this.message = 'Could not upload the file!';
          this.currentFile1 = undefined;
          this._snackBar.open(
            'Could Not Upload File! File Duplicate Found',
            '',
            {
              duration: 2000,
              panelClass: ['snackbar1'],
              verticalPosition: 'top',
              horizontalPosition: 'center',
            }
          );
        }
      );

    this.selectedFiles = undefined;
  }

  upload2() {
    this.scannedProgress = 0;

    this.currentFile2 = this.selectedFiles.item(0);

    this.uploadService
      .upload(this.currentFile2, this.everything.date, this.everything.refNo)
      .subscribe(
        (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.scannedProgress = Math.round(
              (100 * event.loaded) / event.total
            );
          } else if (event instanceof HttpResponse) {
            this.message = event.body.message;
            this.latestName = event.body.latestName;
            this.fileInfos = this.uploadService.getFiles();

            if (this.message == 'File upload error. Please try again') {
              this._snackBar.open(
                'File Upload Error. Please try again with a different File Name',
                '',
                {
                  duration: 2000,
                  panelClass: ['snackbar2'],
                  verticalPosition: 'top',
                  horizontalPosition: 'center',
                }
              );

              this.scannedProgress = 0;
            } else {
              this.everything.secondUploadName = this.message;

              this._snackBar.open('File Uploaded Successfully', '', {
                duration: 2000,
                panelClass: ['snackbar3'],
                verticalPosition: 'top',
                horizontalPosition: 'center',
              });
            }

            // this.uploadService.getFiles().subscribe((data) => {
            //   this.uploadedFileName = data;

            // });
          }
        },
        (err) => {
          this.scannedProgress = 0;
          this.message = 'Could not upload the file!';
          this.currentFile2 = undefined;
          this._snackBar.open(
            'Could Not Upload File! File Duplicate Found',
            '',
            {
              duration: 2000,
              panelClass: ['snackbar1'],
              verticalPosition: 'top',
              horizontalPosition: 'center',
            }
          );
        }
      );

    this.selectedFiles = undefined;

    this.scannedSampleIsUploaded = true;
  }

  upload3() {
    this.imageProgress = 0;

    this.currentFile3 = this.selectedFiles.item(0);

    this.uploadService
      .upload(this.currentFile3, this.everything.date, this.everything.refNo)
      .subscribe(
        (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.imageProgress = Math.round((100 * event.loaded) / event.total);
          } else if (event instanceof HttpResponse) {
            this.message = event.body.message;
            this.latestName = event.body.latestName;
            this.fileInfos = this.uploadService.getFiles();

            if (this.message == 'File upload error. Please try again') {
              this._snackBar.open(
                'File Upload Error. Please try again with a different File Name',
                '',
                {
                  duration: 2000,
                  panelClass: ['snackbar2'],
                  verticalPosition: 'top',
                  horizontalPosition: 'center',
                }
              );

              this.imageProgress = 0;
            } else {
              this.everything.thirdUploadName = this.message;

              this._snackBar.open('File Uploaded Successfully', '', {
                duration: 2000,
                panelClass: ['snackbar3'],
                verticalPosition: 'top',
                horizontalPosition: 'center',
              });
            }

            // this.uploadService.getFiles().subscribe((data) => {
            //   this.uploadedFileName = data;

            // });
          }
        },
        (err) => {
          this.imageProgress = 0;
          this.message = 'Could not upload the file!';
          this.currentFile3 = undefined;
          this._snackBar.open(
            'Could Not Upload File! File Duplicate Found',
            '',
            {
              duration: 2000,
              panelClass: ['snackbar1'],
              verticalPosition: 'top',
              horizontalPosition: 'center',
            }
          );
        }
      );

    this.selectedFiles = undefined;

    this.imageAttachmentIsUploaded = true;
  }

  upload4() {
    this.optionalProgress = 0;

    this.currentFile4 = this.selectedFiles.item(0);

    this.uploadService
      .upload(this.currentFile4, this.everything.date, this.everything.refNo)
      .subscribe(
        (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.optionalProgress = Math.round(
              (100 * event.loaded) / event.total
            );
          } else if (event instanceof HttpResponse) {
            this.message = event.body.message;
            this.latestName = event.body.latestName;
            this.fileInfos = this.uploadService.getFiles();

            if (this.message == 'File upload error. Please try again') {
              this._snackBar.open(
                'File Upload Error. Please try again with a different File Name',
                '',
                {
                  duration: 2000,
                  panelClass: ['snackbar2'],
                  verticalPosition: 'top',
                  horizontalPosition: 'center',
                }
              );

              this.optionalProgress = 0;
            } else {
              this.everything.fourthUploadName = this.message;

              this._snackBar.open('File Uploaded Successfully', '', {
                duration: 2000,
                panelClass: ['snackbar3'],
                verticalPosition: 'top',
                horizontalPosition: 'center',
              });
            }

            // this.uploadService.getFiles().subscribe((data) => {
            //   this.uploadedFileName = data;

            // });
          }
        },
        (err) => {
          this.optionalProgress = 0;
          this.message = 'Could not upload the file!';
          this.currentFile4 = undefined;
          this._snackBar.open(
            'Could Not Upload File! File Duplicate Found',
            '',
            {
              duration: 2000,
              panelClass: ['snackbar1'],
              verticalPosition: 'top',
              horizontalPosition: 'center',
            }
          );
        }
      );

    this.selectedFiles = undefined;

    this.optionalAttachmentIsUploaded = true;
  }

  fileName: string;
  fileExtension: string;

  hideUpload(blob: any) {
    this.progress = 0;

    this.currentFile4 = blob;

    this.fileName = 'Quotation-' + this.everything.refNo + '.pdf';

    this.uploadService
      .uploadQuotation(
        this.currentFile4,
        this.fileName,
        this.everything.date,
        this.everything.refNo
      )
      .subscribe(
        (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round((100 * event.loaded) / event.total);
          } else if (event instanceof HttpResponse) {
            this.message = event.body.message;
            if (this.message == 'File upload error. Please try again') {
              alert('File upload error. Please try again');
            } else {
              this.latestName = event.body.latestName;
              this.fileInfos = this.uploadService.getFiles();
              this.everything.sixthUploadName = this.message;
              this.saveEverythingSendForCustomerAcceptance();
            }

            // this.uploadService.getFiles().subscribe((data) => {
            //   this.uploadedFileName = data;

            //   // this.nameStorage[this.iValue] = this.message

            //   ++this.iValue;
            // });
          }
        },
        (err) => {
          this.progress = 0;
          this.message = 'Could not upload the file!';
          this.currentFile4 = undefined;
        }
      );

    this.selectedFiles = undefined;
  }
 
}

interface Details {
  executiveCode: string;
  customerName: string;
  sampleRequestNumber: String;
  pageURL: string;
  email: string;
  attachment1: string;
  attachment2: string;
  attachment3: string;
  // quotationAttachmentName:string;
}
