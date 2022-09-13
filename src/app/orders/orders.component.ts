import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EverythingService } from '../services/orderForms/everything.service';
import { Everything } from '../models/orderForms/Everything';
import { ProductReferenceService } from '../services/product-reference.service';
import { productReferenceTS } from '../models/productReference';
import { KeyValue, Location } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Employee } from '../models/employee';
import { EmployeeService } from '../services/employee.service';
import * as moment from 'moment';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { Mexecutive } from '../models/mexecutive';
import { MexecutiveService } from '../services/mexecutive.service';
import { Userprofile } from '../models/userprofile';
import { DateFormatter } from '../utility-classes/date-formatter';
import { Configuration } from '../configuration';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  [x: string]: any;
  p: number = 1;

  filterargs = { name: 'Eagle' };

  mexecutives: Observable<Mexecutive[]>;
  mexecutive: Mexecutive = new Mexecutive();

  public showprint: boolean = false;
  public showwoven: boolean = false;
  public showtag: boolean = false;
  public showsticker: boolean = false;
  public showholes: boolean = false;
  public showothers1: boolean = false;
  public showothers2: boolean = false;
  public showstring: boolean = false;

  public showToHigherAccessOnly: boolean = true;

  sampleName: String;

  searchText: string;

  modalReference: any;

  order(duplicate) {
    this.modalReference = this.modalService.open(duplicate, {
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

  closeResult = '';

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  // itemAction: number;

  sno: number = 0;

  productReference: productReferenceTS = new productReferenceTS();

  parsedinfo: any;

  employees: Observable<Employee[]>;
  employee: Employee = new Employee();

  allEmail = [];
  allCustomerEmail = [];
  refNoStorage = [];

  allExecutiveName = [];
  execStorage = [];

  //Everything
  id: number;
  submitted: boolean;
  blank: number;

  //properties in order
  @ViewChild('loadingModalTemplate') loadingModalTemplate: TemplateRef<any>;
  progressValue: number = 0;

  public everything: Everything = new Everything();
  public everythingObs: Everything[];

  currentDate: string;
  accessType: string;
  executiveCode: string;
  public showCreateNewSampleButton: boolean = true;
  public showDeleteButton: boolean = true;
  sampleHeadTStatusFilter: string;
  public showTrimTypeFilter: boolean = true;
  sampleHeadTrimTypeFilter: string = '';
  searchTrimTypeFilter: string;
  displayActiveOrArchivedOrders: string = 'active';
  public archive: boolean = false;
  public default: boolean = true;
  trimTypesFilter: string;
  transactionStatusFilter: string;
  searchStateFilter: string;
  //sorting
  sortFilter1: string;
  key: string = 'everything.date'; //set default
  reverse: boolean = true;

  constructor(
    private http: HttpClient,
    private everythingService: EverythingService,
    private mexecutiveService: MexecutiveService,
    private modalService: NgbModal,
    private EmployeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private theProductService: ProductReferenceService,
    private _location: Location
  ) {
    this.currentDate = DateFormatter.getDate_ddMMyyyy();
    this.accessType = localStorage.getItem('token');
  }

  ngOnInit() {
    
    //Sales Team
    if (this.accessType === 'Sales Team') {
      //fetching executiveCode using the email from local storage and then
      //fetching everythingObs using that code
      this.salesView();
    }

    //Administrator or Sample head
    else if (
      this.accessType === 'Administrator' ||
      this.accessType === 'Sample Head'
    ) {
      //hiding sample creation button & fetching all the orders to everythingObs
      this.adminOrSampleHeadView();
    }

    //Customer
    else if (this.accessType === 'Customer') {
      //fetch orders based on customer email to the everythingObs
      this.customerView();
    } else {
      this.closeLoadingModalTemplate();
    }

    //sample head specific
    if (localStorage.getItem('token') === 'Sample Head') {
      this.sampleHeadTStatusFilter =
        'Sample Initiated|Rejection (Production)|Production|Quotation / Dispatch|Sample Approved|Sample Rejected';

      //hiding trimtype filter
      this.showTrimTypeFilter = false;

      //Note: unwanted code
      this.setSampleHeadTrimTypeFilter();
    }
  }

  ngAfterViewInit() {
    this.openLoadingModal();
  }

  closeLoadingModalTemplate() {
    document.getElementById('closeLoadingModal').click();
    console.log('loading modal closed');
    this.progressValue = 0;
  }

  openLoadingModal() {
    this.modalService
      .open(this.loadingModalTemplate, {
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
  
  // Sales View
  salesView() {
    //get the executive code using the local emailToken
    this.mexecutiveService
      .getByExecutiveEmail(localStorage.getItem('emailToken'))
      .subscribe(
        (data: Mexecutive) => {
          this.executiveCode = data.code;

          //get orders based on the fetched code
          this.everythingService
            .getByExecutiveCode(this.executiveCode)
            .subscribe((data: Everything[]) => {
              this.everythingObs = data;
              this.closeLoadingModalTemplate();
            });
        },
        (err) => {
          this.closeLoadingModalTemplate();
          alert('Error while fetching data for sales team');
        }
      );
  }

  //adminOrSampleHeadView
  adminOrSampleHeadView() {
    //hide the new sample creation button
    this.showCreateNewSampleButton = false;

    //fetch all the orders to the everythingObs
    this.everythingService.getEverythingList().subscribe(
      (data: Everything[]) => {
        this.everythingObs = data;
        this.closeLoadingModalTemplate();
      },
      (err) => {
        this.closeLoadingModalTemplate();
        alert('Error while fetching data for ' + this.accessType);
      }
    );
  }

  //CustomerView
  customerView() {
    //hide the delete button for customer
    this.showDeleteButton = false;

    //fetch orders based on customer email to the everythingObs
    this.everythingService
      .getByCustomerOrders(localStorage.getItem('emailToken'))
      .subscribe(
        (data: Everything[]) => {
          this.everythingObs = data;
          this.closeLoadingModalTemplate();
        },
        (err) => {
          this.closeLoadingModalTemplate();
          alert('Error while fetching data for ' + this.accessType);
        }
      );
  }

  setSampleHeadTrimTypeFilter() {
    //using the trim token from local storage to
    //display only the permitted trimtype orders using sampleHeadTrimTypeFilter

    let permittedTrimTypes: string[];
    let trimTokenLocal: string = localStorage.getItem('trimToken');

    if (
      trimTokenLocal !== '' ||
      trimTokenLocal !== null ||
      trimTokenLocal !== undefined
    ) {
      permittedTrimTypes = trimTokenLocal.split(',');

      for (let i = 0; i < permittedTrimTypes.length; i++) {
        if (i < permittedTrimTypes.length - 1) {
          this.sampleHeadTrimTypeFilter += permittedTrimTypes[i] + '|';
        } else {
          this.sampleHeadTrimTypeFilter += permittedTrimTypes[i];
        }
      }
    }
  }

  back() {
    this.router.navigate(['/home/dashboard']);
  }

  createRoute() {
    this.router.navigate(['/home/forms']);
  }

  toggleActiveAndArchivedOrders() {
    if (this.displayActiveOrArchivedOrders === 'active') {
      this.displayActiveOrArchivedOrders = 'disabled';
    } else {
      this.displayActiveOrArchivedOrders = 'active';
    }
  }

  updateEverythingRoute(id) {
    this.router.navigate(['/home/uforms', id]);
  }

  // Delete order
  deleteOrder(id: number) {
    this.everythingService.deleteEverything(id).subscribe(
      (data) => {
        console.log(data);
        this.reloadData();
      },
      (error) => console.log(error)
    );
  }

  //Updating Everything Modal for Retrieving or disabling the order
  fetchOrder(id: number) {
    this.id = id;

    this.everything = new Everything();
    this.everythingService.getEverything(this.id).subscribe(
      (data) => {
        console.log(data);
        this.everything = data;
      },
      (error) => console.log(error)
    );
  }

  //display activate modal
  show(active) {
    this.modalService
      .open(active, {
        size: 'md',
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

  // retrieve back the order
  retrieve() {
    this.everything.check = 'active';

    this.everythingService.createEverything(this.everything).subscribe(
      (data) => {
        console.log(data);
        this.everything = new Everything();
        this.reloadData();
      },
      (error) => console.log(error)
    );
  }

  //open disable order modal
  open(content) {
    this.modalService
      .open(content, {
        size: 'md',
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

  // Disabling the order
  disableOrder() {
    this.everything.check = 'disabled';

    this.everythingService.createEverything(this.everything).subscribe(
      (data) => {
        console.log(data);
        this.everything = new Everything();
        this.reloadData();
      },
      (error) => console.log(error)
    );
  }

  // Duplicate Order

  samplename: string;

  printnext: number = 0;
  tagnext: number = 0;
  stickernext: number = 0;
  wovennext: number = 0;

  // Common Details
  useSampleName: string;
  useCustomerName: string;
  useEmail: string;
  useExecName: string;
  useSampName: string;
  useExecutiveCode: string;
  usePhone: string;
  useSampleType: string;
  useContactPerson: string;
  useOldRefNo: string;
  useOrderType: string;
  useApprovalType: string;
  useCustomerStreet1: string;
  useCustomerStreet2: string;
  useCustomerCity: string;
  useCustomerState: string;
  useCustomerGst: string;

  // Woven Details
  useWovenUnitHeight: string;
  useWovenUnitWidth: string;
  useWovenLabelType: string;
  useWovenUnit: string;
  useWovenExpectedQuantity: string;
  useWovenColor: string;
  useWovenFolding: string;
  useWovenFinishing: string;

  // Tag Details
  useTagPrintType: string;
  useTagUnitHeight: string;
  useTagUnitWidth: string;
  useTagDevType: string;
  useTagDocType: string;
  useTagNameoftheBoard: string;
  useTagBoardSpecification: string;
  useTagQuality: string;
  useTagBoardGSM: string;
  useTagColor: string;
  useTagExpectedQuantity: string;
  useTagFinishing: string;
  useTagCommentsToFollow: string;

  // Sticker Details
  useStickerPrintType: string;
  useStickerUnitHeight: string;
  useStickerUnitWidth: string;
  useStickerDiameter: string;
  useStickertype: string;
  useStickerRollColor: string;
  useStickerRollSpecification: string;
  useStickerRollSize: string;
  useStickerCommentsToFollow: string;
  useStickerExpectedQuantity: string;

  // Printed Details
  usePrintedLabelType: string;
  usePrintedUnit: string;
  usePrintedUnitHeight: string;
  usePrintedUnitWidth: string;
  usePrintedExpctedQuantity: string;
  usePrintedColor: string;
  usePrintedFolding: string;
  usePrintedFinishing: string;

  useIdForDuplication: number;

  getDuplicateId(id) {
    this.id = id;

    this.everythingService.getEverything(this.id).subscribe(
      (data) => {
        // this.everything = data;
      },
      (error) => console.log(error)
    );

    this.useIdForDuplication = id;
  }

  saveDuplicate() {
    this.id = this.useIdForDuplication;

    this.everythingService.getEverything(this.id).subscribe(
      (data) => {
        // this.everything = data;

        if (data.sampleName === 'Woven') {
          this.wovenIncrementRefrenceNumber();
          this.useWovenUnitHeight = data.unitHeight;
          this.useWovenUnitWidth = data.unitWidth;
          this.useWovenLabelType = data.labelType;
          this.useWovenUnit = data.unit;
          this.useWovenExpectedQuantity = data.expectedQuantity;
          this.useWovenColor = data.color;
          this.useWovenFolding = data.folding;
          this.useWovenFinishing = data.finishing;
        } else if (data.sampleName === 'Tag') {
          this.tagIncrementRefrenceNumber();
          this.useTagPrintType = data.printTypeTag;
          this.useTagUnitHeight = data.unitHeightTag;
          this.useTagUnitWidth = data.unitWidthTag;
          this.useTagDevType = data.tagDevType;
          this.useTagDocType = data.documentTypeTag;
          this.useTagNameoftheBoard = data.nameOfTheBoard;
          this.useTagBoardSpecification = data.boardSpecification;
          this.useTagQuality = data.qualityTag;
          this.useTagBoardGSM = data.boardGSM;
          this.useTagColor = data.colorTag;
          this.useTagExpectedQuantity = data.expectedQuantityTag;
          this.useTagFinishing = data.finishingTag;
          this.useTagCommentsToFollow = data.comments;
        } else if (data.sampleName === 'Sticker') {
          this.stickerIncrementRefrenceNumber();
          this.useStickerPrintType = data.printType;
          this.useStickerUnitHeight = data.unitHeightSticker;
          this.useStickerUnitWidth = data.unitWidthSticker;
          this.useStickerDiameter = data.diameter;
          this.useStickertype = data.stickerType;
          this.useStickerRollColor = data.rollColor;
          this.useStickerRollSpecification = data.rollSpecification;
          this.useStickerRollSize = data.rollSize;
          this.useStickerCommentsToFollow = data.comments;
          this.useStickerExpectedQuantity = data.expectedQuantitySticker;
        } else if (data.sampleName === 'Printed') {
          this.printedIncrementRefrenceNumber();
          this.usePrintedLabelType = data.labelTypePrinted;
          this.usePrintedUnit = data.unitPrinted;
          this.usePrintedUnitHeight = data.unitHeightPrinted;
          this.usePrintedUnitWidth = data.unitWidthPrinted;
          this.usePrintedExpctedQuantity = data.expectedQuantityPrinted;
          this.usePrintedColor = data.colorPrinted;
          this.usePrintedFolding = data.foldingPrinted;
          this.usePrintedFinishing = data.finishingPrinted;
        }

        this.useSampleName = data.sampleName;
        this.useCustomerName = data.name;
        this.useEmail = data.email;
        this.useExecName = data.execName;
        this.useSampName = data.sampName;
        this.useExecutiveCode = data.executiveCode;
        this.usePhone = data.phone;
        this.useSampleType = data.sampType;
        this.useContactPerson = data.contactPerson;
        this.useOldRefNo = data.oldRefNo;
        this.useOrderType = data.orderType;
        this.useApprovalType = data.approvalType;
        this.useCustomerStreet1 = data.customerStreet1;
        this.useCustomerStreet2 = data.customerStreet2;
        this.useCustomerCity = data.customerCity;
        this.useCustomerState = data.customerState;
        this.useCustomerGst = data.customerGst;
      },
      (error) => console.log(error)
    );
  }

  saveEverythingWoven() {
    this.everything.transactionStatus = 'Sample Request Initiated';
    this.everything.name = this.useCustomerName;
    this.everything.sampleName = this.useSampleName;
    this.everything.statusNum = 1;
    this.everything.orderCreatedBy = 'Customer';
    this.everything.execName = this.useExecName;
    this.everything.email = this.useEmail;
    this.everything.sampName = this.useSampName;
    this.everything.executiveCode = this.useExecutiveCode;
    this.everything.check = 'active';
    this.everything.phone = this.usePhone;
    this.everything.placeOfSupply = 'Tamil Nadu';
    this.everything.unitHeight = this.useWovenUnitHeight;
    this.everything.unitWidth = this.useWovenUnitWidth;
    this.everything.length = this.useWovenUnitHeight;
    this.everything.width = this.useWovenUnitWidth;
    this.everything.date = this.currentDate;
    this.everything.sampType = this.useSampleType;
    this.everything.contactPerson = this.useContactPerson;
    this.everything.oldRefNo = this.useOldRefNo;
    this.everything.orderType = this.useOrderType;
    this.everything.approvalType = this.useApprovalType;
    this.everything.incoming = this.currentDate;
    this.everything.labelType = this.useWovenLabelType;
    this.everything.unit = this.useWovenUnit;
    this.everything.expectedQuantity = this.useWovenExpectedQuantity;
    this.everything.color = this.useWovenColor;
    this.everything.folding = this.useWovenFolding;
    this.everything.finishing = this.useWovenFinishing;
    this.everything.customerStreet1 = this.useCustomerStreet1;
    this.everything.customerStreet2 = this.useCustomerStreet2;
    this.everything.customerCity = this.useCustomerCity;
    this.everything.customerState = this.useCustomerState;
    this.everything.customerGst = this.useCustomerGst;
    this.everything.orderCreatedBy = localStorage.getItem('token');

    this.everythingService.createEverything(this.everything).subscribe(
      (data) => {
        this.everything = new Everything();
        console.log(data);
        this.reloadData();
        this._snackBar.open('Order Duplicated Successfully', '', {
          duration: 2000,
          panelClass: ['snackbar3'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
      },
      (error) => console.log(error)
    );
    this.modalReference.close();
  }

  saveEverythingTag() {
    this.everything.transactionStatus = 'Sample Request Initiated';
    this.everything.name = this.useCustomerName;
    this.everything.sampleName = this.useSampleName;
    this.everything.statusNum = 1;
    this.everything.orderCreatedBy = 'Customer';
    this.everything.execName = this.useExecName;
    this.everything.email = this.useEmail;
    this.everything.sampName = this.useSampName;
    this.everything.executiveCode = this.useExecutiveCode;
    this.everything.check = 'active';
    this.everything.date = this.currentDate;
    this.everything.phone = this.usePhone;
    this.everything.placeOfSupply = 'Tamil Nadu';
    this.everything.sampType = this.useSampleType;
    this.everything.contactPerson = this.useContactPerson;
    this.everything.oldRefNo = this.useOldRefNo;
    this.everything.orderType = this.useOrderType;
    this.everything.approvalType = this.useApprovalType;
    this.everything.printTypeTag = this.useTagPrintType;
    this.everything.unitHeightTag = this.useTagUnitHeight;
    this.everything.unitWidthTag = this.useTagUnitWidth;
    this.everything.tagDevType = this.useTagDevType;
    this.everything.documentTypeTag = this.useTagDocType;
    this.everything.nameOfTheBoard = this.useTagNameoftheBoard;
    this.everything.boardSpecification = this.useTagBoardSpecification;
    this.everything.qualityTag = this.useTagQuality;
    this.everything.boardGSM = this.useTagBoardGSM;
    this.everything.colorTag = this.useTagColor;
    this.everything.expectedQuantityTag = this.useTagExpectedQuantity;
    this.everything.finishingTag = this.useTagFinishing;
    this.everything.comments = this.useTagCommentsToFollow;
    this.everything.customerStreet1 = this.useCustomerStreet1;
    this.everything.customerStreet2 = this.useCustomerStreet2;
    this.everything.customerCity = this.useCustomerCity;
    this.everything.customerState = this.useCustomerState;
    this.everything.customerGst = this.useCustomerGst;
    this.everything.orderCreatedBy = localStorage.getItem('token');

    this.everythingService.createEverything(this.everything).subscribe(
      (data) => {
        this.everything = new Everything();
        console.log(data);
        this.reloadData();
        this._snackBar.open('Order Duplicated Successfully', '', {
          duration: 2000,
          panelClass: ['snackbar3'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
      },
      (error) => console.log(error)
    );
    this.modalReference.close();
  }

  saveEverythingSticker() {
    this.everything.transactionStatus = 'Sample Request Initiated';
    this.everything.name = this.useCustomerName;
    this.everything.sampleName = this.useSampleName;
    this.everything.statusNum = 1;
    this.everything.orderCreatedBy = 'Customer';
    this.everything.execName = this.useExecName;
    this.everything.email = this.useEmail;
    this.everything.sampName = this.useSampName;
    this.everything.executiveCode = this.useExecutiveCode;
    this.everything.check = 'active';
    this.everything.date = this.currentDate;
    this.everything.phone = this.usePhone;
    this.everything.placeOfSupply = 'Tamil Nadu';
    this.everything.sampType = this.useSampleType;
    this.everything.contactPerson = this.useContactPerson;
    this.everything.oldRefNo = this.useOldRefNo;
    this.everything.orderType = this.useOrderType;
    this.everything.approvalType = this.useApprovalType;
    this.everything.printType = this.useStickerPrintType;
    this.everything.unitHeightSticker = this.useStickerUnitHeight;
    this.everything.unitWidthSticker = this.useStickerUnitWidth;
    this.everything.diameter = this.useStickerDiameter;
    this.everything.stickerType = this.useStickertype;
    this.everything.rollColor = this.useStickerRollColor;
    this.everything.rollSpecification = this.useStickerRollSpecification;
    this.everything.rollSize = this.useStickerRollSize;
    this.everything.comments = this.useStickerCommentsToFollow;
    this.everything.expectedQuantitySticker = this.useStickerExpectedQuantity;
    this.everything.customerStreet1 = this.useCustomerStreet1;
    this.everything.customerStreet2 = this.useCustomerStreet2;
    this.everything.customerCity = this.useCustomerCity;
    this.everything.customerState = this.useCustomerState;
    this.everything.customerGst = this.useCustomerGst;
    this.everything.incomingSticker = this.currentDate;
    this.everything.orderCreatedBy = localStorage.getItem('token');

    this.everythingService.createEverything(this.everything).subscribe(
      (data) => {
        this.everything = new Everything();
        console.log(data);
        this.reloadData();
        this._snackBar.open('Order Duplicated Successfully', '', {
          duration: 2000,
          panelClass: ['snackbar3'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
      },
      (error) => console.log(error)
    );
    this.modalReference.close();
  }

  saveEverythingPrinted() {
    this.everything.transactionStatus = 'Sample Request Initiated';
    this.everything.name = this.useCustomerName;
    this.everything.sampleName = this.useSampleName;
    this.everything.statusNum = 1;
    this.everything.orderCreatedBy = 'Customer';
    this.everything.execName = this.useExecName;
    this.everything.email = this.useEmail;
    this.everything.sampName = this.useSampName;
    this.everything.executiveCode = this.useExecutiveCode;
    this.everything.check = 'active';
    this.everything.date = this.currentDate;
    this.everything.phone = this.usePhone;
    this.everything.placeOfSupply = 'Tamil Nadu';
    this.everything.sampType = this.useSampleType;
    this.everything.contactPerson = this.useContactPerson;
    this.everything.oldRefNo = this.useOldRefNo;
    this.everything.orderType = this.useOrderType;
    this.everything.approvalType = this.useApprovalType;
    this.everything.labelTypePrinted = this.usePrintedLabelType;
    this.everything.unitPrinted = this.usePrintedUnit;
    this.everything.unitHeightPrinted = this.usePrintedUnitHeight;
    this.everything.unitWidthPrinted = this.usePrintedUnitWidth;
    this.everything.expectedQuantityPrinted = this.usePrintedExpctedQuantity;
    this.everything.colorPrinted = this.usePrintedColor;
    this.everything.foldingPrinted = this.usePrintedFolding;
    this.everything.finishingPrinted = this.usePrintedFinishing;
    this.everything.customerStreet1 = this.useCustomerStreet1;
    this.everything.customerStreet2 = this.useCustomerStreet2;
    this.everything.customerCity = this.useCustomerCity;
    this.everything.customerState = this.useCustomerState;
    this.everything.customerGst = this.useCustomerGst;
    this.everything.incomingPrinted = this.currentDate;
    this.everything.orderCreatedBy = localStorage.getItem('token');

    this.everythingService.createEverything(this.everything).subscribe(
      (data) => {
        this.everything = new Everything();
        console.log(data);
        this.reloadData();
        this._snackBar.open('Order Duplicated Successfully', '', {
          duration: 2000,
          panelClass: ['snackbar3'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
      },
      (error) => console.log(error)
    );
    this.modalReference.close();
  }

  printMaximumNumber: number;
  tagMaximumNumber: number;
  wovenMaximumNumber: number;
  stickerMaximumNumber: number;

  // Woven Reference Number
  wovenIncrementRefrenceNumber() {
    this.theProductService.getByWovenMaximumNumber().subscribe((data) => {
      this.wovenMaximumNumber = data;

      let currentReferenceNumber = this.wovenMaximumNumber + 1;

      this.everything.refNo = 'WOV00' + currentReferenceNumber;
      this.everything.wovenRefNum = currentReferenceNumber;

      this.duplicateCheckerWoven(this.everything.refNo, currentReferenceNumber);
    });
  }

  duplicateCheckerWoven(refNo: string, currentReferenceNumber: number) {
    this.everything.refNo = refNo;
    this.wovenpostData(
      currentReferenceNumber,
      this.samplename,
      this.everything.refNo
    );
    this.saveEverythingWoven();
  }

  wovenpostData(
    currentReferenceNumber: number,
    wovencolorname: string,
    wovenreferencenumber: string
  ) {
    this.wovennext = currentReferenceNumber + 1;

    this.http
      .post(`${Configuration.apiURL}api/master/productreference`, {
        wovencolorname: wovencolorname,
        wovenreferencenumber: wovenreferencenumber,
        wovenNum: currentReferenceNumber,
        wovennext: this.wovennext,
      })
      .toPromise()
      .then((data: any) => {});
  }
  //

  // Tag Reference Number

  tagIncrementRefrenceNumber() {
    this.theProductService.getByTagMaximumNumber().subscribe((data) => {
      this.tagMaximumNumber = data;

      let currentReferenceNumber = this.tagMaximumNumber + 1;

      this.everything.refNo = 'TAG00' + currentReferenceNumber;
      this.everything.tagRefNum = currentReferenceNumber;

      this.duplicateCheckerTag(this.everything.refNo, currentReferenceNumber);
    });
  }

  duplicateCheckerTag(refNo: string, currentReferenceNumber: number) {
    this.everything.refNo = refNo;
    this.tagpostData(
      currentReferenceNumber,
      this.samplename,
      this.everything.refNo
    );
    this.saveEverythingTag();
  }

  tagpostData(
    currentReferenceNumber: number,
    tagcolorname: string,
    tagreferencenumber: string
  ) {
    this.tagnext = currentReferenceNumber + 1;

    this.http
      .post(`${Configuration.apiURL}api/master/productreference`, {
        tagcolorname: tagcolorname,
        tagreferencenumber: tagreferencenumber,
        tagNum: currentReferenceNumber,
        tagnext: this.tagnext,
      })
      .toPromise()
      .then((data: any) => {});
  }
  //

  // Sticker Reference Number

  stickerIncrementRefrenceNumber() {
    this.theProductService.getByStickerMaximumNumber().subscribe((data) => {
      this.stickerMaximumNumber = data;

      let currentReferenceNumber = this.stickerMaximumNumber + 1;

      this.everything.refNo = 'ST00' + currentReferenceNumber;
      this.everything.stickerRefNum = currentReferenceNumber;

      this.duplicateCheckerSticker(
        this.everything.refNo,
        currentReferenceNumber
      );
    });
  }

  duplicateCheckerSticker(refNo: string, currentReferenceNumber: number) {
    this.everything.refNo = refNo;
    this.stickerpostData(
      currentReferenceNumber,
      this.samplename,
      this.everything.refNo
    );
    this.saveEverythingSticker();
  }

  stickerpostData(
    currentReferenceNumber: number,
    stickercolorname: string,
    stickerreferencenumber: string
  ) {
    this.stickernext = currentReferenceNumber + 1;

    this.http
      .post(`${Configuration.apiURL}api/master/productreference`, {
        stickercolorname: stickercolorname,
        stickerreferencenumber: stickerreferencenumber,
        stickerNum: currentReferenceNumber,
        stickernext: this.stickernext,
      })
      .toPromise()
      .then((data: any) => {});
  }

  //

  // Printed Reference Number

  printedIncrementRefrenceNumber() {
    this.theProductService.getByPrintedMaximumNumber().subscribe((data) => {
      this.printMaximumNumber = data;

      let currentReferenceNumber = this.printMaximumNumber + 1;

      this.everything.refNo = 'PFL00' + currentReferenceNumber;
      this.everything.printRefNum = currentReferenceNumber;

      this.duplicateCheckerPrinted(
        this.everything.refNo,
        currentReferenceNumber
      );
    });
  }

  duplicateCheckerPrinted(refNo: string, currentReferenceNumber: number) {
    this.everything.refNo = refNo;
    this.printpostData(
      currentReferenceNumber,
      this.samplename,
      this.everything.refNo
    );
    this.saveEverythingPrinted();
  }

  printpostData(
    currentReferenceNumber: number,
    printcolorname: string,
    printreferencenumber: string
  ) {
    //PRINTED

    this.printnext = currentReferenceNumber + 1;

    this.http
      .post(`${Configuration.apiURL}api/master/productreference`, {
        printcolorname: printcolorname,
        printreferencenumber: printreferencenumber,
        printNum: currentReferenceNumber,
        printnext: this.printnext,
      })
      .toPromise()
      .then((data: any) => {});
  }

  //

  //

  valueAscOrder = (
    a: KeyValue<number, string>,
    b: KeyValue<number, string>
  ): number => {
    return a.value.localeCompare(b.value);
  };

  //Everything Reload Data
  reloadData() {
    if (this.accessType === 'Customer') {
      this.customerView();
    } else if (
      this.accessType === 'Administrator' ||
      this.accessType === 'Sample Head'
    ) {
      this.adminOrSampleHeadView();
    } else if (this.accessType === 'Sales Team') {
      this.salesView();
    }
  }
}
