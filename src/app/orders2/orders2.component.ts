import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Mexecutive } from '../models/mexecutive';
import { Everything } from '../models/orderForms/Everything';
import { MexecutiveService } from '../services/mexecutive.service';
import { EverythingService } from '../services/orderForms/everything.service';
import { ProductReferenceService } from '../services/product-reference.service';
import { DateFormatter } from '../utility-classes/date-formatter';
import { PaginationInput } from '../models/orderForms/PaginationInput';
import { Pager } from '../models/orderForms/Pager';
import { SnackBarService } from '../services/snackBar.service';
import { KeyValue } from '@angular/common';
import { GlobalSearchInput } from '../models/orderForms/GlobalSearchInput';
import { TerritoryService } from '../services/territory.service';
import { UserService } from '../services/user.service';
import { Userprofile } from '../models/userprofile';
import { Territory } from '../models/territory';
import { Configuration } from '../configuration';
import { Employee } from '../models/employee';
import { EmployeeService } from '../services/employee.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-orders2',
  templateUrl: './orders2.component.html',
  styleUrls: ['./orders2.component.css'],
})
export class Orders2Component implements OnInit {
  [x: string]: any;
  globalSearchPlaceHolder = 'Search';
  globalSearch = '';
  globalSearchCopy = '';
  globalSearchList = [
    'Reference Number',
    'Trim Type',
    'Sample Name',
    'Company Name',
    'Category',
    'Entry Date',
    'Transaction Status',
  ];

  //properties in order
  @ViewChild('loadingModalTemplate') loadingModalTemplate: TemplateRef<any>;
  progressValue: number = 0;
  closeResult = '';
  employees: Observable<Employee[]>;
  employee: Employee = new Employee();
  public everything: Everything = new Everything();
  public everythingObs: Everything[];
  trimTypeList: string[] = ['Woven', 'Sticker', 'Tag', 'Printed'];
  transactionStatusList: string[] = [
    'Sample Request Initiated',
    'Customer / Executive Approval',
    'Sample Initiated',
    'Rejection (Production)',
    'Production',
    'Quotation / Dispatch',
    'Sample Approved',
    'Sample Rejected',
  ];

  //specific for sample head - to avoid using paginationInput.transactionStatus
  //directly to its filter - It causes prob in use case - all options deselect
  transactionStatusSampleHead: string[] = [];

  //specific for TManager - to avoid using paginationInput.trimType
  //directly to its filter - It causes prob in use case - all options deselect
  trimTypeTManager: string[] = [];

  paginationInput: PaginationInput;
  pager: Pager;

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

  //filter vars
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
    private router: Router,
    private EmployeeService: EmployeeService,
    private theProductService: ProductReferenceService,
    private snackBService: SnackBarService,
    private territoryService: TerritoryService,
    private userService: UserService
  ) {
    this.currentDate = DateFormatter.getDate_ddMMyyyy();
    this.accessType = localStorage.getItem('token');
    this.paginationInput = new PaginationInput();
    this.pager = new Pager();
  }

  ngOnInit(): void {
   
    //Sales Team
    if (this.accessType === 'Sales Team') {
      //fetching executiveCode using the email from local storage and then
      //fetching everythingObs using that code
      this.salesView();
    }

    //Administrator
    else if (this.accessType === 'Administrator') {
      //hiding sample creation button & fetching all the orders to everythingObs
      this.administratorView();
    
    }

    //sample head
    else if (this.accessType === 'Sample Head') {
      this.sampleHeadView();
    }

    //TManager
    else if (this.accessType === 'TManager') {
      this.fetchTerritory();
      //TManagerView is called inside fetchTerritory since it is async
    }

    //Customer
    else if (this.accessType === 'Customer') {
      //fetch orders based on customer email to the everythingObs
      this.customerView();
      this.fetchCustomer();
    } else {
      // this.closeLoadingModalTemplate();
    }
  }

  ngAfterViewInit() {
    // this.openLoadingModal();
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

  closeLoadingModalTemplate() {
    document.getElementById('closeLoadingModal').click();
    console.log('loading modal closed');
    this.progressValue = 0;
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

  // Sales View
  salesView() {
    //get the executive code using the local emailToken
    this.mexecutiveService
      .getByExecutiveEmail(localStorage.getItem('emailToken'))
      .subscribe(
        (data: Mexecutive) => {
          this.paginationInput.executiveCode = data.code;

          //get orders based on the fetched code
          this.getPaginatedResults();
        },
        (err) => {
          // this.closeLoadingModalTemplate();
          alert('Error while fetching data for sales team');
        }
      );
  }

  //administratorView
  administratorView() {
    //hide the new sample creation button
    this.showCreateNewSampleButton = false;

    this.getPaginatedResults();
  }

  //CustomerView
  customerView() {
    //hide the delete button for customer
    this.showDeleteButton = false;

    //fetch orders based on customer email to the everythingObs
    this.paginationInput.customerEmail = localStorage.getItem('emailToken');

    this.getPaginatedResults();
  }

  //sample head view
  sampleHeadView() {
    //hide the new sample creation button
    this.showCreateNewSampleButton = false;

    //removing the first two options in the transactionStatusList for sample head
    this.transactionStatusList = [
      'Sample Initiated',
      'Rejection (Production)',
      'Production',
      'Quotation / Dispatch',
      'Sample Approved',
      'Sample Rejected',
    ];

    //hiding trimtype filter
    this.showTrimTypeFilter = false;

    //using the trim token from local storage to
    //display only the permitted trimtype orders using trimtypeList
    this.setSampleHeadPermittedTrimTypes();

    //fetch all the orders with permitted trimTypes & Transaction status to the everythingObs

    this.paginationInput.trimType = this.trimTypeList;
    this.paginationInput.transactionStatus = this.transactionStatusList;

    this.getPaginatedResults();
  }

  setSampleHeadPermittedTrimTypes() {
    let permittedTrimTypes: string[];
    let trimTokenLocal: string = localStorage.getItem('trimToken');

    if (
      trimTokenLocal !== '' ||
      trimTokenLocal !== null ||
      trimTokenLocal !== undefined
    ) {
      permittedTrimTypes = trimTokenLocal.split(',');

      //resetting trimtypeList
      this.trimTypeList = [];

      for (let i = 0; i < permittedTrimTypes.length; i++) {
        //displaying only the permitted options
        if (permittedTrimTypes[i] === 'Print') {
          this.trimTypeList.push('Printed');
        } else {
          this.trimTypeList.push(permittedTrimTypes[i]);
        }
      }
    }
  }
  fetchCustomer() {
    
      this.EmployeeService.getEmployeesList().subscribe(
        (data) => {
          this.employees = data;
        },
        (error) => {
          this.snackBarService.showWarningSnack(
            'Error while fetching customer details. Please contact the Administrator'
          );
          console.log(error);
        }
      );
    } 
    
    
  

  fetchTerritory() {
    this.userService.getById(localStorage.getItem('id')).subscribe(
      (data: Userprofile) => {
        this.paginationInput.territoryId = data.territoryId;
        this.TManagerView();
      },
      (err) => console.log(err)
    );
  }

  //TManager view
  TManagerView() {
    //hide the new sample creation button
    this.showCreateNewSampleButton = false;

    //removing the first two options in the transactionStatusList for sample head
    // this.transactionStatusList = [
    //   'Sample Initiated',
    //   'Rejection (Production)',
    //   'Production',
    //   'Quotation / Dispatch',
    //   'Sample Approved',
    //   'Sample Rejected',
    // ];

    //hiding trimtype filter
    // this.showTrimTypeFilter = false;

    //using the trim token from local storage to
    //display only the permitted trimtype orders using trimtypeList
    this.setTManagerPermittedTrimTypes();

    //fetch all the orders with permitted trimTypes & Transaction status to the everythingObs

    this.paginationInput.trimType = this.trimTypeList;
    // this.paginationInput.transactionStatus = this.transactionStatusList;

    this.getPaginatedResults();
  }

  setTManagerPermittedTrimTypes() {
    let permittedTrimTypes: string[];
    let trimTokenLocal: string = localStorage.getItem('trimToken');

    if (
      trimTokenLocal !== '' ||
      trimTokenLocal !== null ||
      trimTokenLocal !== undefined
    ) {
      permittedTrimTypes = trimTokenLocal.split(',');

      //resetting trimtypeList
      this.trimTypeList = [];

      for (let i = 0; i < permittedTrimTypes.length; i++) {
        //displaying only the permitted options
        if (permittedTrimTypes[i] === 'Print') {
          this.trimTypeList.push('Printed');
        } else {
          this.trimTypeList.push(permittedTrimTypes[i]);
        }
      }
    }
  }

  //on global search text input
  //to copy the value to use it in query and to display it in the placeholder
  copySearchString(val) {
    //this check helps us differentiate between on input vs on option click
    //it will be true for values came through on input but not for values that came from option click
    //since those value will be one of the value from the globalSearchList
    if (this.globalSearchList.indexOf(val) < 0) {
      //To get used in placeholder and query
      this.globalSearchCopy = val;
    }
  }

  //on global search dropdown option click
  globalSearchFn(val) {
    //emptying it to prevent displaying the selected option as a value in the input
    this.globalSearch = '';
    this.globalSearchPlaceHolder = `Showing results for ${this.globalSearchCopy} in ${val}`;

    //assiging exact field name as per it is in the data model based on the selected option
    switch (val) {
      case 'Reference Number':
        val = 'refNo';
        break;
      case 'Trim Type':
        val = 'sampleName';
        break; //In data model it is wrongly named
      case 'Sample Name':
        val = 'sampName';
        break; //In data model it is wrongly named
      case 'Company Name':
        val = 'name';
        break; //In data model it is wrongly named
      case 'Entry Date':
        val = 'date';
        break; //In data model it is wrongly named
      case 'Transaction Status':
        val = 'transactionStatus';
        break;
      default:
        console.log('Error while selecting option from global search');
        break;
    }

    //allow searching for permitted trimtype and transaction status only for sample head
    if (this.accessType === 'Sample Head') {
      //for trimtype field search
      //loop through the permitted trim type list
      //match every value with the input value
      // push only the matched values to paginationInput.trimType
      if (val == 'sampleName') {
        this.paginationInput.trimType = [];
        for (let i = 0; i < this.trimTypeList.length; i++) {
          if (
            this.trimTypeList[i]
              .toLowerCase()
              .includes(this.globalSearchCopy.toLowerCase())
          ) {
            this.paginationInput.trimType.push(this.trimTypeList[i]);
          }
        }

        //assign the array, only if there is atleast a single match
        if (this.paginationInput.trimType.length < 1) {
          //Obvious that the input is invalid one
          //No need to go for server as we no record ll match the condition
          this.everythingObs = [];
          this.pagerInitializer(0, 0);
        }
      } else if (val == 'transactionStatus') {
        //same concept as used for trimType case
        this.paginationInput.transactionStatus = [];
        for (let i = 0; i < this.transactionStatusList.length; i++) {
          if (
            this.transactionStatusList[i]
              .toLowerCase()
              .includes(this.globalSearchCopy.toLowerCase())
          ) {
            this.paginationInput.transactionStatus.push(
              this.transactionStatusList[i]
            );
          }
        }

        if (this.paginationInput.transactionStatus.length < 1) {
          //Obvious that the input is invalid one
          //No need to go for server as we no record ll match the condition
          this.everythingObs = [];
          this.pagerInitializer(0, 0);
        }
      } else {
        //for other fields we use the global search field - values
        this.paginationInput.globalSearchInput.field = val;
        this.paginationInput.globalSearchInput.value = this.globalSearchCopy;

        this.paginationInput.sort = 'desc';
        this.paginationInput.page = 0;
        this.paginationInput.size = 10;

        this.getPaginatedResults();
      }
    }
    //for other access types than sample head
    else {
      this.paginationInput.trimType = [];
      this.paginationInput.transactionStatus = [];

      this.paginationInput.sort = 'desc';
      this.paginationInput.page = 0;
      this.paginationInput.size = 10;

      this.paginationInput.globalSearchInput.field = val;
      this.paginationInput.globalSearchInput.value = this.globalSearchCopy;

      this.getPaginatedResults();
    }

    // status will use the current value in it to work on both active and archieved views
    // executive code / customer email will get used as it is.
  }

  onGlobalSearchSort() {
    if (this.paginationInput.sort === 'desc') {
      this.paginationInput.sort = 'asc';
    } else {
      this.paginationInput.sort = 'desc';
    }
    this.getPaginatedResults();
  }

  closeGlobalSearch() {
    //remove any text inside search box
    this.globalSearch = '';
    //reset the placeholder
    this.globalSearchPlaceHolder = 'Search';
    //resetting object
    this.paginationInput.globalSearchInput = new GlobalSearchInput();
    this.paginationInput.sort = 'desc';
    this.paginationInput.page = 0;
    this.paginationInput.size = 10;

    if (this.accessType === 'Sample Head') {
      this.paginationInput.trimType = this.trimTypeList;
      this.paginationInput.transactionStatus = this.transactionStatusList;
    }

    this.getPaginatedResults();
  }

  onFilterSearch() {
    //modify the paginated input accordingly then search
    if (this.accessType === 'Sample Head') {
      //if all options are unselected, implicitly we make all the options selected
      //leaving those which are not permitted

      if (this.transactionStatusSampleHead.length < 1) {
        this.paginationInput.transactionStatus = this.transactionStatusList;
      } else {
        this.paginationInput.transactionStatus =
          this.transactionStatusSampleHead;
      }
    }

    if (this.accessType === 'TManager') {
      //if all options are unselected, implicitly we make all the options selected
      //leaving those which are not permitted

      if (this.trimTypeTManager.length < 1) {
        this.paginationInput.trimType = this.trimTypeList;
      } else {
        this.paginationInput.trimType = this.trimTypeTManager;
      }
    }
    //setting page to 0
    this.paginationInput.page = 0;

    //globalSearchInput - reset
    this.paginationInput.globalSearchInput = new GlobalSearchInput();
    //To take care of styling and alignment
    this.globalSearchPlaceHolder = 'Search';

    // fetching results
    this.getPaginatedResults();
  }

  //paginated results fetcher
  getPaginatedResults(filterCall?: string) {
    console.log(this.paginationInput);
    //start search
    this.everythingService.getPaginatedOrders(this.paginationInput).subscribe(
      (data) => {
        this.everythingObs = data['content'];
        this.pagerInitializer(data['totalPages'], data['totalElements']);

        // this.closeLoadingModalTemplate()
      },
      (err) => {
        // this.closeLoadingModalTemplate();
        let errorMsg = filterCall
          ? 'Error while fetching data using the filters'
          : 'Error while fetching data for ' + this.accessType;
        alert(errorMsg);
      }
    );
  }

  //Initialize the pager obj whenever a filter search had run
  pagerInitializer(totalPages, totalElements) {
    this.pager.totalPages = totalPages;
    this.pager.totalResults = totalElements;
    //+1 since paginationInput.size will be reduced by 1 for querying purpose
    this.pager.activePage = Number(this.paginationInput.page) + 1;
    //initialize the pagesToDisplay[] in the pager object
    this.setPagesToDisplay();
  }

  // The page nos to be displayed in the bottom is initialized
  setPagesToDisplay() {
    //local variables has been used for easy usage in the validation part
    let totalPages = this.pager.totalPages;
    let activePage = this.pager.activePage;
    let startPage: number, endPage: number;

    //if total pages are less than 6
    //display 1 - totalPages (all 5 pages)
    if (totalPages < 6) {
      startPage = 1;
      endPage = totalPages;
    }
    //if total pages greater than 5
    else {
      //if active page is less than 4
      //display 1 - 5
      if (activePage <= 3) {
        startPage = 1;
        endPage = 5;
      }
      //if active page is the last page
      //display (total - 4) - total pages
      else if (activePage + 1 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        //if the active page has exactly 3 more
        //then displaying prior, current & last 3
        if (totalPages - (activePage - 2) == 5) {
          startPage = activePage - 1;
          endPage = activePage + 3;
        } else {
          //displaying prior 2, current and next 2
          startPage = activePage - 2;
          endPage = activePage + 2;
        }
      }
    }

    //initializing start and end page
    this.pager.startPage = startPage;
    this.pager.endPage = endPage;

    //emptying and reinitializing the pagesToDisplay array
    this.pager.pagesToDisplay = [];

    for (let i = startPage; i <= endPage; i++) {
      this.pager.pagesToDisplay.push(i);
    }
  }

  setPaginationInputSize(size) {
    this.paginationInput.size = Number(size);
    this.paginationInput.page = 0;
    this.getPaginatedResults();
  }

  setPage(page) {
    //change the page and start search
    this.paginationInput.page = page - 1;
    this.getPaginatedResults();
  }

  reloadData() {
    //will use the current values of paginationInput
    this.paginationInput.page = 0;
    this.getPaginatedResults();
  }

  back() {
    this.router.navigate(['/home/dashboard']);
  }

  toggleActiveAndArchivedOrders() {
    if (this.displayActiveOrArchivedOrders === 'active') {
      this.displayActiveOrArchivedOrders = 'disabled'; //UI purpose
      this.paginationInput.status = 'disabled'; //Backend criteria purpose
    } else {
      this.displayActiveOrArchivedOrders = 'active';
      this.paginationInput.status = 'active';
    }

    //start search
    this.reloadData();
  }

  createRoute() {
    this.router.navigate(['/home/forms']);
  }

  updateEverythingRoute(id) {
    this.router.navigate(['/home/uforms', id]);
  }

  //Updating Everything Modal for Retrieving or disabling the order
  fetchOrder(id: number) {
    this.everything = new Everything();
    this.everythingService.getEverything(id).subscribe(
      (data) => {
        console.log(data);
        this.everything = data;
      },
      (error) => console.log(error)
    );
  }

  //display activate modal (to confirm retrieval)
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

  // retrieve the order back
  retrieve() {
    this.everything.check = 'active';

    this.everythingService.createEverything(this.everything).subscribe(
      (data) => {
        console.log(data);
        this.everything = new Everything();

        //reload data
        this.reloadData();
        this.snackBService.showSuccessSnack('Order enabled successfully');
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
        this.snackBService.showSuccessSnack('Order archived successfully');
      },
      (error) => console.log(error)
    );
  }

  // // Delete order - permanent delete
  // deleteOrder(id: number) {
  //   this.everythingService.deleteEverything(id).subscribe(
  //     (data) => {
  //       console.log(data);
  //       //reload data
  //       this.reloadData();
  //       this.snackBService.showSuccessSnack("Order deleted successfully")
  //     },
  //     (error) => console.log(error)
  //   );
  // }

  // //permanent delete - display activate modal (to confirm retrieval)
  // permanentDelete_orderID: number;
  // confirmPermanentDelete(modalRef, id:number) {
  //   //use the id to send for deleteOrder() while clicking yes in UI
  //   this.permanentDelete_orderID = id;
  //   this.modalService
  //     .open(modalRef, {
  //       size: 'md',
  //       centered: true,
  //       ariaLabelledBy: 'modal-basic-title',
  //     })
  //     .result.then(
  //       (result) => {
  //         this.closeResult = `Closed with: ${result}`;
  //       },
  //       (reason) => {
  //         this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //       }
  //     );
  // }

  // Duplicate Order
  id: number;
  modalReference: any;

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
    this.everything.customerId = this.useCustomerId;
    this.everything.orderCreatedBy = localStorage.getItem('token');

    this.everythingService.createEverything(this.everything).subscribe(
      (data) => {
        this.everything = new Everything();
        console.log(data);
        this.reloadData();
        this.snackBService.showSuccessSnack('Order Duplicated Successfully');
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
    this.everything.customerId = this.useCustomerId;
    this.everything.orderCreatedBy = localStorage.getItem('token');

    this.everythingService.createEverything(this.everything).subscribe(
      (data) => {
        this.everything = new Everything();
        console.log(data);
        this.reloadData();
        this.snackBService.showSuccessSnack('Order Duplicated Successfully');
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
        this.snackBService.showSuccessSnack('Order Duplicated Successfully');
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
        this.snackBService.showSuccessSnack('Order Duplicated Successfully');
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

  valueAscOrder = (
    a: KeyValue<number, string>,
    b: KeyValue<number, string>
  ): number => {
    return a.value.localeCompare(b.value);
  };
}
