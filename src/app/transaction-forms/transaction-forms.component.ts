import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  enableProdMode,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Everything } from './../models/orderForms/Everything';
import { EverythingService } from '../services/orderForms/everything.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { productReferenceTS } from './../models/productReference';
import { ProductReferenceService } from '../services/product-reference.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Munit } from '../models/munit';
import { MunitService } from '../services/munit.service';
import { Mcolor } from '../models/mcolor';
import { McolorService } from '../services/mcolor.service';
import { Mlabeltype } from '../models/mlabeltype';
import { MlabeltypeService } from '../services/mlabeltype.service';
import { Mstatus } from '../models/mstatus';
import { MstatusService } from '../services/mstatus.service';
import { MotherdetailsService } from '../services/motherdetails.service';
import { MotherDetails } from '../models/motherdetails';
import { DatePipe } from '@angular/common';
import { Userprofile } from '../models/userprofile';
import { UserService } from '../services/user.service';
import { Location } from '@angular/common';
import { FormControl, Validators } from '@angular/forms';
import { MdocumenttypeService } from '../services/mdocumenttype.service';
import { Mdocumenttype } from '../models/mdocumenttype';
import { Employee } from './../models/employee';
import { EmployeeService } from './../services/employee.service';
import { TerritoryService } from './../services/territory.service';
import { map } from 'rxjs/operators';
import { UploadFileService } from '../services/upload-file.service';
import { Upload } from './../models/upload';
import { CustomerReferenceService } from '../services/customer-reference.service';
import { customerReferenceTS } from '../models/customerReference';
import { Mexecutive } from '../models/mexecutive';
import { MexecutiveService } from '../services/mexecutive.service';
import { OrderDetailsLineItem } from '../models/orderDetailsLineItem';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CompanyService } from '../services/company.service';
import { Company } from '../models/company';
import { Configuration } from '../configuration';

@Component({
  selector: 'app-transaction-forms',
  templateUrl: './transaction-forms.component.html',
  styleUrls: ['./transaction-forms.component.css'],
  providers: [DatePipe],
})
export class TransactionFormsComponent implements OnInit {
  dataset: Details = {
    executiveCode: '',
    customerName: '',
    sampleRequestNumber: '',
    pageURL: '',
    email: '',
    attachment1: '',
  };

  public showprint: boolean = false;
  public showwoven: boolean = false;
  public showtag: boolean = false;
  public showsticker: boolean = false;
  public showholes: boolean = false;
  public showothers1: boolean = false;
  public showothers2: boolean = false;
  public showstring: boolean = false;
  public showref: boolean = false;

  public showLoadingSpinner: boolean = false;

  //States Start
  public showSampleRequest: boolean = true;
  public showConfirmed: boolean = false;
  public showProduction: boolean = false;
  public showDispatch: boolean = false;
  public showCompleted: boolean = false;
  public showRejected: boolean = false;
  //States End

  //Show Access Rights Start
  public showAdminstrator: boolean = true;
  public showSampleHead: boolean = false;
  public showCustomerServiceTeam: boolean = false;
  public showSalesTeam: boolean = false;
  public showCustomer: boolean = false;
  //Show Access Rights End

  public showPrintAccess: boolean = false;
  public showWovenAccess: boolean = false;
  public showTagAccess: boolean = false;
  public showStickerAccess: boolean = false;
  public noShowSampleRequest: boolean = true;

  public showfsc1: boolean = false;

  public showsingleprint: boolean = false;
  public showdoubleprint: boolean = false;

  public showsamplecharge: boolean = false;

  orderConfirmationDate: String;
  orderConfirmed: boolean = false;

  // mtickets_lt : Observable<Mtickets[]>;
  employee_lt: Observable<Employee[]>;

  // mtickets1: Observable<Mtickets[]>;

  //exe name and code
  mexecutives1: Observable<Mexecutive[]>;
  mexecutive: Mexecutive = new Mexecutive();

  public print: boolean;
  public tag: boolean;
  public woven: boolean;
  public sticker: boolean;

  munits: Observable<Munit[]>;
  munitvalue: Observable<Munit[]>;
  munit: Munit = new Munit();

  mcolors: Observable<Mcolor[]>;
  mcolorValue: Observable<Mcolor[]>;
  mcolor: Mcolor = new Mcolor();

  users: Observable<Userprofile[]>;
  user: Userprofile = new Userprofile();

  employees: Observable<Employee[]>;
  employeesExecutiveName: Observable<Employee[]>;
  employeesListForExecutive: Employee[];
  employee: Employee = new Employee();

  filteredCustomerObservable: Observable<Employee[]>;

  customerDropDown: Observable<Employee[]>;

  mexecutives: Observable<Mexecutive[]>;
  // mexecutive: Mexecutive = new Mexecutive();

  customerName: String;
  customerId: string;
  customers: Employee[];
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
  printedqualityArray = [];
  wovenqualityArray = [];
  customerArray = [];

  executiveArray = [];

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

  // Only Integer 3
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
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat22() {
    return this.intplusFloatGroup22.get('intplusFloatControl22');
  }
  intplusFloatTitle22 = 'intplusFloat22';
  intplusFloatGroup22 = new FormGroup({
    intplusFloatControl22: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat23() {
    return this.intplusFloatGroup23.get('intplusFloatControl23');
  }
  intplusFloatTitle23 = 'intplusFloat23';
  intplusFloatGroup23 = new FormGroup({
    intplusFloatControl23: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat24() {
    return this.intplusFloatGroup24.get('intplusFloatControl24');
  }
  intplusFloatTitle24 = 'intplusFloat24';
  intplusFloatGroup24 = new FormGroup({
    intplusFloatControl24: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat25() {
    return this.intplusFloatGroup25.get('intplusFloatControl25');
  }
  intplusFloatTitle25 = 'intplusFloat25';
  intplusFloatGroup25 = new FormGroup({
    intplusFloatControl25: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat26() {
    return this.intplusFloatGroup26.get('intplusFloatControl26');
  }
  intplusFloatTitle26 = 'intplusFloat26';
  intplusFloatGroup26 = new FormGroup({
    intplusFloatControl26: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat27() {
    return this.intplusFloatGroup27.get('intplusFloatControl27');
  }
  intplusFloatTitle27 = 'intplusFloat27';
  intplusFloatGroup27 = new FormGroup({
    intplusFloatControl27: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
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

  get intPlusFloat51() {
    return this.intplusFloatGroup51.get('intplusFloatControl51');
  }
  intplusFloatTitle51 = 'intplusFloat51';
  intplusFloatGroup51 = new FormGroup({
    intplusFloatControl51: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat52() {
    return this.intplusFloatGroup52.get('intplusFloatControl52');
  }
  intplusFloatTitle52 = 'intplusFloat52';
  intplusFloatGroup52 = new FormGroup({
    intplusFloatControl52: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat53() {
    return this.intplusFloatGroup53.get('intplusFloatControl53');
  }
  intplusFloatTitle53 = 'intplusFloat53';
  intplusFloatGroup53 = new FormGroup({
    intplusFloatControl53: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat54() {
    return this.intplusFloatGroup54.get('intplusFloatControl54');
  }
  intplusFloatTitle54 = 'intplusFloat54';
  intplusFloatGroup54 = new FormGroup({
    intplusFloatControl54: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat55() {
    return this.intplusFloatGroup55.get('intplusFloatControl55');
  }
  intplusFloatTitle55 = 'intplusFloat55';
  intplusFloatGroup55 = new FormGroup({
    intplusFloatControl55: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat56() {
    return this.intplusFloatGroup56.get('intplusFloatControl56');
  }
  intplusFloatTitle56 = 'intplusFloat56';
  intplusFloatGroup56 = new FormGroup({
    intplusFloatControl56: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat57() {
    return this.intplusFloatGroup57.get('intplusFloatControl57');
  }
  intplusFloatTitle57 = 'intplusFloat57';
  intplusFloatGroup57 = new FormGroup({
    intplusFloatControl57: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat58() {
    return this.intplusFloatGroup58.get('intplusFloatControl58');
  }
  intplusFloatTitle58 = 'intplusFloat58';
  intplusFloatGroup58 = new FormGroup({
    intplusFloatControl58: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat59() {
    return this.intplusFloatGroup59.get('intplusFloatControl59');
  }
  intplusFloatTitle59 = 'intplusFloat59';
  intplusFloatGroup59 = new FormGroup({
    intplusFloatControl59: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat60() {
    return this.intplusFloatGroup60.get('intplusFloatControl60');
  }
  intplusFloatTitle60 = 'intplusFloat60';
  intplusFloatGroup60 = new FormGroup({
    intplusFloatControl60: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat61() {
    return this.intplusFloatGroup61.get('intplusFloatControl61');
  }
  intplusFloatTitle61 = 'intplusFloat61';
  intplusFloatGroup61 = new FormGroup({
    intplusFloatControl61: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat62() {
    return this.intplusFloatGroup62.get('intplusFloatControl62');
  }
  intplusFloatTitle62 = 'intplusFloat62';
  intplusFloatGroup62 = new FormGroup({
    intplusFloatControl62: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat63() {
    return this.intplusFloatGroup63.get('intplusFloatControl63');
  }
  intplusFloatTitle63 = 'intplusFloat63';
  intplusFloatGroup63 = new FormGroup({
    intplusFloatControl63: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat64() {
    return this.intplusFloatGroup64.get('intplusFloatControl64');
  }
  intplusFloatTitle64 = 'intplusFloat64';
  intplusFloatGroup64 = new FormGroup({
    intplusFloatControl64: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat65() {
    return this.intplusFloatGroup65.get('intplusFloatControl65');
  }
  intplusFloatTitle65 = 'intplusFloat65';
  intplusFloatGroup65 = new FormGroup({
    intplusFloatControl65: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat66() {
    return this.intplusFloatGroup66.get('intplusFloatControl66');
  }
  intplusFloatTitle66 = 'intplusFloat66';
  intplusFloatGroup66 = new FormGroup({
    intplusFloatControl66: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat67() {
    return this.intplusFloatGroup67.get('intplusFloatControl67');
  }
  intplusFloatTitle67 = 'intplusFloat67';
  intplusFloatGroup67 = new FormGroup({
    intplusFloatControl67: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat68() {
    return this.intplusFloatGroup68.get('intplusFloatControl68');
  }
  intplusFloatTitle68 = 'intplusFloat68';
  intplusFloatGroup68 = new FormGroup({
    intplusFloatControl68: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat69() {
    return this.intplusFloatGroup69.get('intplusFloatControl69');
  }
  intplusFloatTitle69 = 'intplusFloat69';
  intplusFloatGroup69 = new FormGroup({
    intplusFloatControl69: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat70() {
    return this.intplusFloatGroup70.get('intplusFloatControl70');
  }
  intplusFloatTitle70 = 'intplusFloat70';
  intplusFloatGroup70 = new FormGroup({
    intplusFloatControl70: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });

  get intPlusFloat71() {
    return this.intplusFloatGroup71.get('intplusFloatControl71');
  }
  intplusFloatTitle71 = 'intplusFloat71';
  intplusFloatGroup71 = new FormGroup({
    intplusFloatControl71: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat72() {
    return this.intplusFloatGroup72.get('intplusFloatControl72');
  }
  intplusFloatTitle72 = 'intplusFloat72';
  intplusFloatGroup72 = new FormGroup({
    intplusFloatControl72: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat73() {
    return this.intplusFloatGroup73.get('intplusFloatControl73');
  }
  intplusFloatTitle73 = 'intplusFloat73';
  intplusFloatGroup73 = new FormGroup({
    intplusFloatControl73: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat74() {
    return this.intplusFloatGroup74.get('intplusFloatControl74');
  }
  intplusFloatTitle74 = 'intPlusFloat74';
  intplusFloatGroup74 = new FormGroup({
    intplusFloatControl74: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat75() {
    return this.intplusFloatGroup75.get('intplusFloatControl75');
  }
  intplusFloatTitle75 = 'intPlusFloat75';
  intplusFloatGroup75 = new FormGroup({
    intplusFloatControl75: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat76() {
    return this.intplusFloatGroup76.get('intplusFloatControl76');
  }
  intplusFloatTitle76 = 'intPlusFloat76';
  intplusFloatGroup76 = new FormGroup({
    intplusFloatControl76: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat77() {
    return this.intplusFloatGroup77.get('intplusFloatControl77');
  }
  intplusFloatTitle77 = 'intPlusFloat77';
  intplusFloatGroup77 = new FormGroup({
    intplusFloatControl77: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat78() {
    return this.intplusFloatGroup78.get('intplusFloatControl78');
  }
  intplusFloatTitle78 = 'intPlusFloat78';
  intplusFloatGroup78 = new FormGroup({
    intplusFloatControl78: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat79() {
    return this.intplusFloatGroup79.get('intplusFloatControl79');
  }
  intplusFloatTitle79 = 'intPlusFloat79';
  intplusFloatGroup79 = new FormGroup({
    intplusFloatControl79: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat80() {
    return this.intplusFloatGroup80.get('intplusFloatControl80');
  }
  intplusFloatTitle80 = 'intPlusFloat80';
  intplusFloatGroup80 = new FormGroup({
    intplusFloatControl80: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat81() {
    return this.intplusFloatGroup81.get('intplusFloatControl81');
  }
  intplusFloatTitle81 = 'intPlusFloat81';
  intplusFloatGroup81 = new FormGroup({
    intplusFloatControl81: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });

  get intPlusFloat82() {
    return this.intplusFloatGroup82.get('intplusFloatControl82');
  }
  intplusFloatTitle82 = 'intPlusFloat82';
  intplusFloatGroup82 = new FormGroup({
    intplusFloatControl82: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat83() {
    return this.intplusFloatGroup83.get('intplusFloatControl83');
  }
  intplusFloatTitle83 = 'intPlusFloat83';
  intplusFloatGroup83 = new FormGroup({
    intplusFloatControl83: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat84() {
    return this.intplusFloatGroup84.get('intplusFloatControl84');
  }
  intplusFloatTitle84 = 'intPlusFloat84';
  intplusFloatGroup84 = new FormGroup({
    intplusFloatControl84: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat85() {
    return this.intplusFloatGroup85.get('intplusFloatControl85');
  }
  intplusFloatTitle85 = 'intPlusFloat85';
  intplusFloatGroup85 = new FormGroup({
    intplusFloatControl85: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat86() {
    return this.intplusFloatGroup86.get('intplusFloatControl86');
  }
  intplusFloatTitle86 = 'intPlusFloat86';
  intplusFloatGroup86 = new FormGroup({
    intplusFloatControl86: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });

  get intPlusFloat87() {
    return this.intplusFloatGroup87.get('intplusFloatControl87');
  }
  intplusFloatTitle87 = 'intplusFloat87';
  intplusFloatGroup87 = new FormGroup({
    intplusFloatControl87: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat88() {
    return this.intplusFloatGroup88.get('intplusFloatControl88');
  }
  intplusFloatTitle88 = 'intplusFloat88';
  intplusFloatGroup88 = new FormGroup({
    intplusFloatControl88: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat89() {
    return this.intplusFloatGroup89.get('intplusFloatControl89');
  }
  intplusFloatTitle89 = 'intplusFloat89';
  intplusFloatGroup89 = new FormGroup({
    intplusFloatControl89: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat90() {
    return this.intplusFloatGroup90.get('intplusFloatControl90');
  }
  intplusFloatTitle90 = 'intplusFloat90';
  intplusFloatGroup90 = new FormGroup({
    intplusFloatControl90: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat91() {
    return this.intplusFloatGroup91.get('intplusFloatControl91');
  }
  intplusFloatTitle91 = 'intplusFloat91';
  intplusFloatGroup91 = new FormGroup({
    intplusFloatControl91: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat92() {
    return this.intplusFloatGroup92.get('intplusFloatControl92');
  }
  intplusFloatTitle92 = 'intplusFloat92';
  intplusFloatGroup92 = new FormGroup({
    intplusFloatControl92: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat93() {
    return this.intplusFloatGroup93.get('intplusFloatControl93');
  }
  intplusFloatTitle93 = 'intplusFloat93';
  intplusFloatGroup93 = new FormGroup({
    intplusFloatControl93: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat94() {
    return this.intplusFloatGroup94.get('intplusFloatControl94');
  }
  intplusFloatTitle94 = 'intplusFloat94';
  intplusFloatGroup94 = new FormGroup({
    intplusFloatControl94: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat95() {
    return this.intplusFloatGroup95.get('intplusFloatControl95');
  }
  intplusFloatTitle95 = 'intplusFloat95';
  intplusFloatGroup95 = new FormGroup({
    intplusFloatControl95: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat96() {
    return this.intplusFloatGroup96.get('intplusFloatControl96');
  }
  intplusFloatTitle96 = 'intplusFloat96';
  intplusFloatGroup96 = new FormGroup({
    intplusFloatControl96: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat97() {
    return this.intplusFloatGroup97.get('intplusFloatControl97');
  }
  intplusFloatTitle97 = 'intplusFloat97';
  intplusFloatGroup97 = new FormGroup({
    intplusFloatControl97: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat98() {
    return this.intplusFloatGroup98.get('intplusFloatControl98');
  }
  intplusFloatTitle98 = 'intplusFloat98';
  intplusFloatGroup98 = new FormGroup({
    intplusFloatControl98: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat99() {
    return this.intplusFloatGroup99.get('intplusFloatControl99');
  }
  intplusFloatTitle99 = 'intplusFloat99';
  intplusFloatGroup99 = new FormGroup({
    intplusFloatControl99: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat100() {
    return this.intplusFloatGroup100.get('intplusFloatControl100');
  }
  intplusFloatTitle100 = 'intplusFloat100';
  intplusFloatGroup100 = new FormGroup({
    intplusFloatControl100: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });

  get intPlusFloat101() {
    return this.intplusFloatGroup101.get('intplusFloatControl101');
  }
  intplusFloatTitle101 = 'intplusFloat101';
  intplusFloatGroup101 = new FormGroup({
    intplusFloatControl101: new FormControl('', [
      Validators.required,
      Validators.pattern('[-+]?([0-9]*.[0-9]+|[0-9]+)'),
    ]),
  });
  get intPlusFloat102() {
    return this.intplusFloatGroup102.get('intplusFloatControl102');
  }
  intplusFloatTitle102 = 'intplusFloat102';
  intplusFloatGroup102 = new FormGroup({
    intplusFloatControl102: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat103() {
    return this.intplusFloatGroup103.get('intplusFloatControl103');
  }
  intplusFloatTitle103 = 'intplusFloat103';
  intplusFloatGroup103 = new FormGroup({
    intplusFloatControl103: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat104() {
    return this.intplusFloatGroup104.get('intplusFloatControl104');
  }
  intplusFloatTitle104 = 'intplusFloat104';
  intplusFloatGroup104 = new FormGroup({
    intplusFloatControl104: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat105() {
    return this.intplusFloatGroup105.get('intplusFloatControl105');
  }
  intplusFloatTitle105 = 'intplusFloat105';
  intplusFloatGroup105 = new FormGroup({
    intplusFloatControl105: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat106() {
    return this.intplusFloatGroup106.get('intplusFloatControl106');
  }
  intplusFloatTitle106 = 'intplusFloat106';
  intplusFloatGroup106 = new FormGroup({
    intplusFloatControl106: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat107() {
    return this.intplusFloatGroup107.get('intplusFloatControl107');
  }
  intplusFloatTitle107 = 'intplusFloat107';
  intplusFloatGroup107 = new FormGroup({
    intplusFloatControl107: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat108() {
    return this.intplusFloatGroup108.get('intplusFloatControl108');
  }
  intplusFloatTitle108 = 'intplusFloat108';
  intplusFloatGroup108 = new FormGroup({
    intplusFloatControl108: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat109() {
    return this.intplusFloatGroup109.get('intplusFloatControl109');
  }
  intplusFloatTitle109 = 'intplusFloat109';
  intplusFloatGroup109 = new FormGroup({
    intplusFloatControl109: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat110() {
    return this.intplusFloatGroup110.get('intplusFloatControl110');
  }
  intplusFloatTitle110 = 'intplusFloat110';
  intplusFloatGroup110 = new FormGroup({
    intplusFloatControl110: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat111() {
    return this.intplusFloatGroup111.get('intplusFloatControl111');
  }
  intplusFloatTitle111 = 'intplusFloat111';
  intplusFloatGroup111 = new FormGroup({
    intplusFloatControl111: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat112() {
    return this.intplusFloatGroup112.get('intplusFloatControl112');
  }
  intplusFloatTitle112 = 'intplusFloat112';
  intplusFloatGroup112 = new FormGroup({
    intplusFloatControl112: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat113() {
    return this.intplusFloatGroup113.get('intplusFloatControl113');
  }
  intplusFloatTitle113 = 'intplusFloat113';
  intplusFloatGroup113 = new FormGroup({
    intplusFloatControl113: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat114() {
    return this.intplusFloatGroup114.get('intplusFloatControl114');
  }
  intplusFloatTitle114 = 'intplusFloat114';
  intplusFloatGroup114 = new FormGroup({
    intplusFloatControl1114: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat115() {
    return this.intplusFloatGroup115.get('intplusFloatControl115');
  }
  intplusFloatTitle115 = 'intplusFloat115';
  intplusFloatGroup115 = new FormGroup({
    intplusFloatControl1115: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });

  get intPlusFloat116() {
    return this.intplusFloatGroup116.get('intplusFloatControl116');
  }
  intplusFloatTitle116 = 'intPlusFloat116';
  intplusFloatGroup116 = new FormGroup({
    intplusFloatControl116: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  get intPlusFloat117() {
    return this.intplusFloatGroup117.get('intplusFloatControl117');
  }
  intplusFloatTitle117 = 'intPlusFloat117';
  intplusFloatGroup117 = new FormGroup({
    intplusFloatControl117: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });
  // get intPlusFloat104(){return this.intplusFloatGroup104.get('intplusFloatControl104')}intplusFloatTitle104 = 'intplusFloat104';intplusFloatGroup104 = new FormGroup({intplusFloatControl104: new FormControl('',[ Validators.required, Validators.pattern("[a-zA-Z ]*")])});
  // get intPlusFloat105(){return this.intplusFloatGroup105.get('intplusFloatControl105')}intplusFloatTitle105 = 'intplusFloat105';intplusFloatGroup105 = new FormGroup({intplusFloatControl105: new FormControl('',[ Validators.required, Validators.pattern("[a-zA-Z ]*")])});
  // get intPlusFloat106(){return this.intplusFloatGroup106.get('intplusFloatControl106')}intplusFloatTitle106 = 'intplusFloat106';intplusFloatGroup106 = new FormGroup({intplusFloatControl106: new FormControl('',[ Validators.required, Validators.pattern("[a-zA-Z ]*")])});
  // get intPlusFloat107(){return this.intplusFloatGroup107.get('intplusFloatControl107')}intplusFloatTitle107 = 'intplusFloat107';intplusFloatGroup107 = new FormGroup({intplusFloatControl107: new FormControl('',[ Validators.required, Validators.pattern("[a-zA-Z ]*")])});
  // get intPlusFloat108(){return this.intplusFloatGroup108.get('intplusFloatControl108')}intplusFloatTitle108 = 'intplusFloat108';intplusFloatGroup108 = new FormGroup({intplusFloatControl108: new FormControl('',[ Validators.required, Validators.pattern("[a-zA-Z ]*")])});
  // get intPlusFloat109(){return this.intplusFloatGroup109.get('intplusFloatControl109')}intplusFloatTitle109 = 'intplusFloat109';intplusFloatGroup109 = new FormGroup({intplusFloatControl109: new FormControl('',[ Validators.required, Validators.pattern("[a-zA-Z ]*")])});
  // get intPlusFloat110(){return this.intplusFloatGroup110.get('intplusFloatControl110')}intplusFloatTitle110 = 'intplusFloat110';intplusFloatGroup110 = new FormGroup({intplusFloatControl110: new FormControl('',[ Validators.required, Validators.pattern("[a-zA-Z ]*")])});
  // get intPlusFloat111(){return this.intplusFloatGroup111.get('intplusFloatControl111')}intplusFloatTitle111 = 'intplusFloat111';intplusFloatGroup111 = new FormGroup({intplusFloatControl111: new FormControl('',[ Validators.required, Validators.pattern("[a-zA-Z ]*")])});
  // get intPlusFloat112(){return this.intplusFloatGroup112.get('intplusFloatControl112')}intplusFloatTitle112 = 'intplusFloat112';intplusFloatGroup112 = new FormGroup({intplusFloatControl112: new FormControl('',[ Validators.required, Validators.pattern("[a-zA-Z ]*")])});
  // get intPlusFloat113(){return this.intplusFloatGroup113.get('intplusFloatControl113')}intplusFloatTitle113 = 'intplusFloat113';intplusFloatGroup113 = new FormGroup({intplusFloatControl113: new FormControl('',[ Validators.required, Validators.pattern("[a-zA-Z ]*")])});
  // get intPlusFloat114(){return this.intplusFloatGroup114.get('intplusFloatControl114')}intplusFloatTitle114 = 'intplusFloat114';intplusFloatGroup114 = new FormGroup({intplusFloatControl1114: new FormControl('',[ Validators.required, Validators.pattern("[a-zA-Z ]*")])});
  // get intPlusFloat115(){return this.intplusFloatGroup115.get('intplusFloatControl115')}intplusFloatTitle115 = 'intplusFloat115';intplusFloatGroup115 = new FormGroup({intplusFloatControl1115: new FormControl('',[ Validators.required, Validators.pattern("[a-zA-Z ]*")])});

  get intPlusFloat200() {
    return this.intplusFloatGroup200.get('intplusFloatControl200');
  }
  intplusFloatTitle200 = 'intplusFloat200';
  intplusFloatGroup200 = new FormGroup({
    intplusFloatControl200: new FormControl('', [
      Validators.required,
      Validators.pattern('[^A-Za-z0-9]'),
    ]),
  });

  //REGEX End

  // PRODUCT REFERNCE VARIABLES START
  // ................................
  // ................................
  // ................................
  // ................................
  // ................................
  // ................................

  createRoute() {
    // this.router.navigate(['/home/orders']);
    this._location.back();
  }

  id: number;

  statusNum: number = 1;
  transactionStatus: string = 'Sample Request Initiated';

  productReferenceObservable: Observable<productReferenceTS[]>;
  productReference: productReferenceTS = new productReferenceTS();

  form: FormGroup;

  submitted = false;

  printcolorname: string = 'Printed';
  tagcolorname: string = 'Tag';
  stickercolorname: string = 'Sticker';
  wovencolorname: string = 'Woven';

  // check: String = 'show';

  referencenumber: string;
  printreferencenumber: string;
  tagreferencenumber: string;
  stickerreferencenumber: string;
  wovenreferencenumber: string;

  printNum: number = 1;
  tagNum: number = 1;
  stickerNum: number = 1;
  wovenNum: number = 1;

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
  everything: Everything = new Everything();

  everythingChecker: Everything = new Everything();

  wovenFolding: String[];

  mlabeltypes: Observable<Mlabeltype[]>;
  mlabeltypeValue: Observable<Mlabeltype[]>;
  mlabeltype: Mlabeltype = new Mlabeltype();

  mstatuss: Observable<Mstatus[]>;
  mstatusvalue: Observable<Mstatus[]>;
  mstatus: Mstatus = new Mstatus();

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

  motherdetailsvalueSticker: Observable<MotherDetails[]>;
  motherdetailsvaluePrinted: Observable<MotherDetails[]>;
  otherdetails: MotherDetails = new MotherDetails();

  mdocumenttypes: Observable<Mdocumenttype[]>;
  mdocumenttypeValues: Observable<Mdocumenttype[]>;
  mdocumenttype: Mdocumenttype = new Mdocumenttype();

  customerReference: customerReferenceTS = new customerReferenceTS();
  customer: Observable<Employee[]>;

  myDate = new Date();

  currentDate: string;

  public showThis: boolean = false;

  territory: string = '';

  constructor(
    private mexecutiveService: MexecutiveService,
    private https: HttpClient,
    private motherDetailService: MotherdetailsService,
    private uploadService: UploadFileService,
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
    private datePipe: DatePipe,
    private userService: UserService,
    private _location: Location,
    private EmployeeService: EmployeeService,
    private territoryService: TerritoryService,
    private companyService: CompanyService
  ) {
    this.currentDate = this.datePipe.transform(this.myDate, 'dd-MM-yyyy');

    this.form = fb.group({
      term: null,
    });

    this.form.valueChanges.subscribe(console.log);
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

  checkAccess() {
    if (localStorage.getItem('token') === 'Administrator') {
      this.toggleAdmin();
      this.showAdmin = true;
      this.showCustomerDetails = false;
      this.showExecutiveDetails = false;
    } else if (localStorage.getItem('token') === 'Sample Head') {
      this.toggleSampleHead();
      this.showCustomerDetails = false;
      this.showExecutiveDetails = false;
      this.showAdmin = true;
    } else if (localStorage.getItem('token') === 'Customer Service Team') {
      this.toggleCST();
      this.showCustomerDetails = false;
      this.showExecutiveDetails = false;
      this.showAdmin = true;
    } else if (localStorage.getItem('token') === 'Sales Team') {
      this.toggleSalesTeam();
      this.showCustomerDetails = false;
      this.showExecutiveDetails = true;
      this.showAdmin = false;
    } else if (localStorage.getItem('token') === 'Customer') {
      this.toggleCustomer();
      this.showCustomerDetails = true;
      this.showExecutiveDetails = false;
      this.showAdmin = false;
    }
  }

  public showCustomerDetails: boolean = false;
  public showExecutiveDetails: boolean = false;
  public showAdmin: boolean = false;

  checkemexample() {
    //  Example Function
    if (localStorage.getItem('token') === 'Administrator' || 'Sample Head') {
      // Regex for All Fields
    } else if (localStorage.getItem('token') === 'Customer') {
      // Regex for Customer
    }
  }

  checkTrimType() {
    if (localStorage.getItem('trimToken') === 'Print') {
      this.print = true;
      this.tag = false;
      this.woven = false;
      this.sticker = false;
    }
    if (localStorage.getItem('trimToken') === 'Tag') {
      this.print = false;
      this.tag = true;
      this.woven = false;
      this.sticker = false;
    }
    if (localStorage.getItem('trimToken') === 'Woven') {
      this.print = false;
      this.tag = false;
      this.woven = true;
      this.sticker = false;
    }
    if (localStorage.getItem('trimToken') === 'Sticker') {
      this.print = false;
      this.tag = false;
      this.woven = false;
      this.sticker = true;
    }
    if (localStorage.getItem('trimToken') === 'Print,Tag') {
      this.print = true;
      this.tag = true;
      this.woven = false;
      this.sticker = false;
    }
    if (localStorage.getItem('trimToken') === 'Print,Woven') {
      this.print = true;
      this.tag = false;
      this.woven = true;
      this.sticker = false;
    }
    if (localStorage.getItem('trimToken') === 'Print,Sticker') {
      this.print = true;
      this.tag = false;
      this.woven = false;
      this.sticker = true;
    }
    if (localStorage.getItem('trimToken') === 'Tag,Woven') {
      this.print = false;
      this.tag = true;
      this.woven = true;
      this.sticker = false;
    }
    if (localStorage.getItem('trimToken') === 'Tag,Sticker') {
      this.print = false;
      this.tag = true;
      this.woven = false;
      this.sticker = true;
    }
    if (localStorage.getItem('trimToken') === 'Woven,Sticker') {
      this.print = false;
      this.tag = false;
      this.woven = true;
      this.sticker = true;
    }
    if (localStorage.getItem('trimToken') === 'Print,Tag,Woven') {
      this.print = true;
      this.tag = true;
      this.woven = true;
      this.sticker = false;
    }
    if (localStorage.getItem('trimToken') === 'Print,Tag,Sticker') {
      this.print = true;
      this.tag = true;
      this.woven = false;
      this.sticker = true;
    }
    if (localStorage.getItem('trimToken') === 'Print,Woven,Sticker') {
      this.print = true;
      this.tag = false;
      this.woven = true;
      this.sticker = true;
    }
    if (localStorage.getItem('trimToken') === 'Tag,Woven,Sticker') {
      this.print = false;
      this.tag = true;
      this.woven = true;
      this.sticker = true;
    }
    if (localStorage.getItem('trimToken') === 'Print,Tag,Woven,Sticker') {
      this.print = true;
      this.tag = true;
      this.woven = true;
      this.sticker = true;
    }
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

    this.samplename = 'Woven';

    // this.incrementRefrenceNumber();
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

    this.samplename = 'Printed';

    // this.incrementRefrenceNumber();
  }

  tagFunctions() {
    this.toggleTagUnitDropDown();
    this.toggleQualityDropDown();
    this.toggleDocumentTypeDropDown();
    this.toggleRef();
    this.toggletag();
    this.toggleTagColorDropDown();
    this.toggleTagStatusDropDown();
    this.toggleTagFinishingDropDown();
    this.toggleFoldingTagDropDown();

    this.samplename = 'Tag';

    // this.incrementRefrenceNumber();
  }

  stickerFunctions() {
    this.toggleStickerDocumentTypeDropDown();
    this.toggleStickerUnitDropDown();
    this.toggleRef();
    this.togglesticker();

    this.samplename = 'Sticker';

    // this.incrementRefrenceNumber();
  }

  //    mticketsChgFn(trvl: string){
  //     this.mtickets_lt = this.mtickets1.pipe(map((res : Mtickets[] ) => {
  //     return res.filter(mtickets => mtickets.modeoftravel == trvl);

  //     }));
  // }

  employeeChgFn(trvl: String) {
    alert(trvl);
    this.employee_lt = this.filteredCustomerObservable.pipe(
      map((res: Employee[]) => {
        return res.filter((employee) => employee.customername == trvl);
      })
    );
  }

  getExecutivesCustomerName() {
    console.log(localStorage);
    this.EmployeeService.getExecutiveName(
      localStorage.getItem('userToken')
    ).subscribe((data: Employee) => {
      this.employeesExecutiveName = this.EmployeeService.getExecutiveName(
        localStorage.getItem('userToken')
      );
    });
  }

  fetchEmployeesListForExecutive() {
    this.mexecutiveService
      .getByExecutiveEmail(localStorage.getItem('emailToken'))
      .subscribe(
        (data) => {
          this.EmployeeService.getEmployeesListForExecutive(
            data['code']
          ).subscribe(
            (data) => {
              this.employeesListForExecutive = data;
            },
            (err) => {
              alert('Error while fetching customers list');
              console.log(err);
            }
          );
        },
        (err) => {
          alert('Error while fetching customers list');
          console.log(err);
        }
      );
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

  toggleTagUnitDropDown() {
    this.munitService.getByUnitTag('true').subscribe((data: Munit) => {
      this.munitvalue = this.munitService.getByUnitTag('true');
    });
  }

  toggleStickerUnitDropDown() {
    this.munitService.getByUnitSticker('true').subscribe((data: Munit) => {
      this.munitvalue = this.munitService.getByUnitSticker('true');
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
          this.motherDetailService.getOtherDetailsWoven('Folding', 'true');
      });
  }

  toggleAccess() {
    if (this.print === true) {
      this.showPrintAccess = true;
    }

    if (this.woven === true) {
      this.showWovenAccess = true;
    }

    if (this.sticker === true) {
      this.showStickerAccess = true;
    }

    if (this.tag === true) {
      this.showTagAccess = true;
    }
  }

  toggleprint() {
    this.showprint = true;
    this.showsticker = false;
    this.showtag = false;
    this.showwoven = false;

    this.referencenumber = this.printreferencenumber;
  }

  toggleRef() {
    this.showref = true;
  }

  togglewoven() {
    this.showwoven = true;
    this.showsticker = false;
    this.showprint = false;
    this.showtag = false;

    this.referencenumber = this.wovenreferencenumber;
  }

  toggletag() {
    this.showtag = true;
    this.showsticker = false;
    this.showprint = false;
    this.showwoven = false;

    this.referencenumber = this.tagreferencenumber;
  }

  togglesticker() {
    this.showsticker = true;
    this.showprint = false;
    this.showwoven = false;
    this.showtag = false;

    this.referencenumber = this.stickerreferencenumber;
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

  togglefsc1() {
    this.showfsc1 = !this.showfsc1;
  }

  togglesingleprint() {
    this.showsingleprint = !this.showsingleprint;
  }

  toggledoubleprint() {
    this.showdoubleprint = !this.showdoubleprint;
  }

  togglesamplecharge() {
    this.showsamplecharge = !this.showsamplecharge;
  }

  closeResult = '';

  openSnackBar(message: string, action: string) {
    this._snackBar.open('Submitted Successfully!', '', {
      duration: 2000,
      panelClass: ['snackbar1'],
      verticalPosition: 'top',
    });
  }

  customerDetails() {
   
    this.EmployeeService.getCustomerReferenceNumber(
      this.everything.customerReferenceNumber
    ).subscribe((data: Employee) => {
      this.everything.email = data.emailId;
      this.everything.execName = data.executiveName;
      this.everything.executiveCode = data.executiveCode;
      this.everything.phone = data.phone;
      this.everything.customerStreet1 = data.street1;
      this.everything.customerStreet2 = data.street2;
      this.everything.customerCity = data.city;
      this.everything.customerState = data.state;
      this.everything.customerGst = data.gstin;
      this.everything.customerEmailRequired = data.customerEmail;
      this.everything.customerId=data.customerId;
      this.everything.territoryId = data.territory;
      this.fetchTerritoryName(this.everything.territoryId);

      this.everything.customerName = data.companyname;
      // this.companyService.getById(data.companyId).subscribe(
      //   (data: Company) => {
      //     this.everything.merchandiser = data.merchandiser;
      //   },
      //   (err) => console.log(err)
      // );

      this.companyName = data.customername;

      this.setCompanyName();
      this.getCustomerName();
    });
  }

  fetchTerritoryName(territoryId) {
    this.territoryService.getByTerritoryId(territoryId).subscribe((data) => {
      if (data != null) {
        this.territory = data['name'];
      }
    });
  }

  customerDetailsForCustomer() {
    this.EmployeeService.getCustomerEmail(
      localStorage.getItem('emailToken')
    ).subscribe((data: Employee) => {
      this.everything.email = data.emailId;
      this.everything.execName = data.executiveName;
      this.everything.executiveCode = data.executiveCode;
      this.everything.phone = data.phone;
      this.everything.customerStreet1 = data.street1;
      this.everything.customerStreet2 = data.street2;
      this.everything.customerCity = data.city;
      this.everything.customerState = data.state;
      this.everything.customerGst = data.gstin;
      this.companyName = data.customername;
      this.everything.customerReferenceNumber = data.customerreference;
      this.everything.customerId = data.customerId;
      this.everything.territoryId = data.territory;
      this.fetchTerritoryName(this.everything.territoryId);

      this.everything.customerName = data.companyname;
      // this.companyService.getById(data.companyId).subscribe(
      //   (data: Company) => {
      //     this.everything.merchandiser = data.merchandiser;
      //   },
      //   (err) => console.log(err)
      // );

      this.setCompanyName();
      this.getCustomerName();
    });
  }

  setCompanyName() {
    this.everything.name = this.companyName;
    this.tempCustomerName = this.companyName;
  }

  companyName: string;

  //Everything Create
  newEverything(): void {
    this.submitted = false;
    this.everything = new Everything();
  }

  orderConfirmation() {
    this.orderConfirmed = true;
  }

  modalReference: any;

  open(approval) {
    this.modalReference = this.modalService.open(approval, {
      backdrop: 'static',
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  transactionFormID: string;

  //Everything Save
  saveEverything() {
    this.everything.check = 'active';
    this.everything.placeOfSupply = 'Tamil Nadu';

    this.everything.length = this.everything.unitHeight;
    this.everything.width = this.everything.unitWidth;
    this.everything.widthPrinted = this.everything.unitWidthPrinted;
    this.everything.lengthPrinted = this.everything.unitHeightPrinted;

    this.everything.transactionStatus = this.transactionStatus;
    this.everything.statusNum = 1;
    this.everything.date = this.currentDate;
    this.everything.incoming = this.currentDate;
    this.everything.incomingSticker = this.currentDate;
    this.everything.incomingPrinted = this.currentDate;
    this.everythingService.createEverything(this.everything).subscribe(
      (data) => {
        // this.everything = new Everything();
        //move the artwork file
        this.uploadService.moveArtWorkFile(
          this.everything.date,
          this.everything.refNo,
          this.everything.uploadName
        );
        console.log(data);
      },
      (error) => console.log(error)
    );

    this.router.navigate(['/home/orders']);
  }

  saveEverythingUpdate() {
    this.everything.statusNum = 2;
    this.everything.transactionStatus = 'Customer / Executive Approval';
    this.transactionStatus = 'Customer / Executive Approval';

    if (this.orderConfirmed === true) {
      this.everything.orderConfirmationDate = this.currentDate;
    }

    this.everything.length = this.everything.unitHeight;
    this.everything.width = this.everything.unitWidth;
    this.everything.widthPrinted = this.everything.unitWidthPrinted;
    this.everything.lengthPrinted = this.everything.unitHeightPrinted;

    this.everything.check = 'active';
    this.everything.statusNum = 2;
    this.everything.date = this.currentDate;
    this.everything.incoming = this.currentDate;
    this.everything.incomingSticker = this.currentDate;
    this.everything.incomingPrinted = this.currentDate;
    this.everything.transactionStatus = this.transactionStatus;
    this.everythingService.createEverything(this.everything).subscribe(
      (data) => {
        var parsedinfo = JSON.parse(JSON.stringify(data));
        this.transactionFormID = parsedinfo.id;

        //move the artwork file
        this.uploadService.moveArtWorkFile(
          this.everything.date,
          this.everything.refNo,
          this.everything.uploadName
        );

        if (this.everything.customerEmailRequired == true) {
          console.log('Sending Email');
          this.getPageURL();
        } else if (
          localStorage.getItem('token') === 'Customer' &&
          this.everything.customerEmailRequired == false
        ) {
          console.log('Sending Email');
          this.getPageURL();
        } else {
          console.log('Email Not Sent');
          this.router.navigate(['/home/orders']);
        }

        // console.log(data);
      },
      (error) => console.log(error)
    );
  }

  //Everything Reload Data
  reloadData() {
    this.everythingObs = this.everythingService.getEverythingList();
    this.users = this.userService.getUsersList();
    this.productReferenceObservable =
      this.theProductService.getProductReferenceList();
    this.munits = this.munitService.getMunitsList();
    this.mcolors = this.mcolorService.getMcolorsList();
    this.mlabeltypes = this.mlabeltypeService.getMlabeltypesList();
    this.mstatuss = this.mstatusService.getMstatussList();
    this.motherdetailsObs = this.motherDetailService.getMotherDetailsList();
    this.mlabeltypes = this.mlabeltypeService.getMlabeltypesList();
    this.mdocumenttypes = this.mdocumenttypeService.getMdocumenttypesList();
    this.employees = this.EmployeeService.getEmployeesList();
    this.filteredCustomerObservable =
      this.EmployeeService.getVerifiedEmployeesList();
    this.mexecutives = this.mexecutiveService.getMexecutivesList();
    this.mexecutives1 = this.mexecutiveService.getMexecutivesList();
  }

  testData: string;

  getExactCustomerName() {
    this.EmployeeService.getCustomerEmail(
      localStorage.getItem('emailToken')
    ).subscribe((data: Employee) => {
      this.everything.name = data.customername;
      this.everything.email = data.emailId;
      this.everything.execName = data.executiveName;
      this.everything.executiveCode = data.executiveCode;
      this.everything.phone = data.phone;
    });
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
  }

  public sendEmailCheck: boolean = false;

  //On Submit Everything
  onSubmitEverything() {
    this.incrementRefrenceNumber();
  }

  //STATUS OF TRANSACTION FORMS STARTS

  updateStatus() {
    this.incrementRefrenceNumberUpdate();
  }

  //STATUS OF TRANSACTION FORMS ENDS

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

  //PRODUCT REFERENCE LOGIC START
  //.............................
  //.............................
  //.............................
  //.............................
  //.............................
  //.............................
  //.............................

  // refLogic(printNum : number, tagNum : number, stickerNum : number, wovenNum : number)
  // {

  //   if(this.samplename === "Printed")
  //   {
  //     printNum += 1;
  //     this.everything.printreferencenumber = "PFL00" + printNum;
  //     this.printpostData(printNum);
  //   }
  //   else if(this.samplename === "Tag")
  //   {
  //     tagNum += 1;
  //     this.everything.tagreferencenumber = "TAG00" + tagNum;
  //     this.tagpostData(tagNum);
  //   }
  //   else if ( this.samplename === "Sticker")
  //   {
  //     stickerNum += 1;
  //     this.everything.stickerreferencenumber = "ST00" + stickerNum;
  //     this.stickerpostData(stickerNum);
  //   }
  //   else if (this.samplename === "Woven")
  //   {
  //     wovenNum += 1;
  //     this.everything.wovenreferencenumber = "WOV00" + wovenNum;
  //     this.wovenpostData(wovenNum);
  //   }
  //   else
  //   {
  //     console.log ("Invalid Transaction Number");
  //   }

  // }

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

  incrementRefrenceNumberOld() {
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

      this.printNum = this.printmax;
      this.tagNum = this.tagmax;
      this.stickerNum = this.stickermax;
      this.wovenNum = this.wovenmax;

      // if(this.samplename === "Woven")
      // {
      //   this.everythingService.getByEverythingReferenceNumber("WOV00" + this.wovenNum).subscribe(data => {

      //     if(data === null || data === undefined)
      //     {
      //       this.refLogic(this.printNum, this.tagNum, this.stickerNum, this.wovenNum);
      //       this.saveEverything();
      //     }

      //     this.everythingChecker = data;

      //     if(this.everythingChecker.refNo != undefined)
      //     {
      //       alert("Sample Number Exists, Please Save Again")
      //     }

      //   });
      // }
      // else if(this.samplename === "Printed")
      // {
      //   this.everythingService.getByEverythingReferenceNumber("PFL00" + this.printNum).subscribe(data => {

      //     if(data === null || data === undefined)
      //     {
      //       this.refLogic(this.printNum, this.tagNum, this.stickerNum, this.wovenNum);
      //       this.saveEverything();
      //     }

      //     this.everythingChecker = data;

      //     if(this.everythingChecker.refNo != undefined)
      //     {
      //       alert("Sample Number Exists, Please Save Again")
      //     }

      //   });
      // }
      // else if(this.samplename === "Sticker")
      // {
      //   this.everythingService.getByEverythingReferenceNumber("ST00" + this.stickerNum).subscribe(data => {

      //     if(data === null || data === undefined)
      //     {
      //       this.refLogic(this.printNum, this.tagNum, this.stickerNum, this.wovenNum);
      //       this.saveEverything();
      //     }

      //     this.everythingChecker = data;

      //     if(this.everythingChecker.refNo != undefined)
      //     {
      //       alert("Sample Number Exists, Please Save Again")
      //     }

      //   });
      // }
      // else if(this.samplename === "Tag")
      // {
      //   this.everythingService.getByEverythingReferenceNumber("TAG00" + this.tagNum).subscribe(data => {

      //     if(data === null || data === undefined)
      //     {
      //       this.refLogic(this.printNum, this.tagNum, this.stickerNum, this.wovenNum);
      //       this.saveEverything();
      //     }

      //     this.everythingChecker = data;

      //     if(this.everythingChecker.refNo != undefined)
      //     {
      //       alert("Sample Number Exists, Please Save Again")
      //     }

      //   });
      // }
    });
  }

  printMaximumNumber: number;
  tagMaximumNumber: number;
  wovenMaximumNumber: number;
  stickerMaximumNumber: number;

  incrementRefrenceNumber() {
    if (this.samplename === 'Woven') {
      this.wovenIncrementRefrenceNumber();
    } else if (this.samplename === 'Tag') {
      this.tagIncrementRefrenceNumber();
    } else if (this.samplename === 'Sticker') {
      this.stickerIncrementRefrenceNumber();
    } else if (this.samplename === 'Printed') {
      this.printedIncrementRefrenceNumber();
    }
  }

  incrementRefrenceNumberUpdate() {
    if (this.samplename === 'Woven') {
      this.wovenIncrementRefrenceNumberUpdate();
    } else if (this.samplename === 'Tag') {
      this.tagIncrementRefrenceNumberUpdate();
    } else if (this.samplename === 'Sticker') {
      this.stickerIncrementRefrenceNumberUpdate();
    } else if (this.samplename === 'Printed') {
      this.printedIncrementRefrenceNumberUpdate();
    }
  }

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
    this.saveEverything();
  }

  duplicateCheckerPrinted(refNo: string, currentReferenceNumber: number) {
    this.everything.refNo = refNo;
    this.printpostData(
      currentReferenceNumber,
      this.samplename,
      this.everything.refNo
    );
    this.saveEverything();
  }

  duplicateCheckerTag(refNo: string, currentReferenceNumber: number) {
    this.everything.refNo = refNo;
    this.tagpostData(
      currentReferenceNumber,
      this.samplename,
      this.everything.refNo
    );
    this.saveEverything();
  }

  duplicateCheckerSticker(refNo: string, currentReferenceNumber: number) {
    this.everything.refNo = refNo;
    this.stickerpostData(
      currentReferenceNumber,
      this.samplename,
      this.everything.refNo
    );
    this.saveEverything();
  }

  duplicateCheckerWovenUpdate(refNo: string, currentReferenceNumber: number) {
    this.everything.refNo = refNo;
    this.wovenpostData(
      currentReferenceNumber,
      this.samplename,
      this.everything.refNo
    );
    this.saveEverythingUpdate();
  }

  duplicateCheckerPrintedUpdate(refNo: string, currentReferenceNumber: number) {
    this.everything.refNo = refNo;
    this.printpostData(
      currentReferenceNumber,
      this.samplename,
      this.everything.refNo
    );
    this.saveEverythingUpdate();
  }

  duplicateCheckerTagUpdate(refNo: string, currentReferenceNumber: number) {
    this.everything.refNo = refNo;
    this.tagpostData(
      currentReferenceNumber,
      this.samplename,
      this.everything.refNo
    );
    this.saveEverythingUpdate();
  }

  duplicateCheckerStickerUpdate(refNo: string, currentReferenceNumber: number) {
    this.everything.refNo = refNo;
    this.stickerpostData(
      currentReferenceNumber,
      this.samplename,
      this.everything.refNo
    );
    this.saveEverythingUpdate();
  }

  tagIncrementRefrenceNumber() {
    this.theProductService.getByTagMaximumNumber().subscribe((data) => {
      this.tagMaximumNumber = data;

      let currentReferenceNumber = this.tagMaximumNumber + 1;

      this.everything.refNo = 'TAG00' + currentReferenceNumber;
      this.everything.tagRefNum = currentReferenceNumber;

      this.duplicateCheckerTag(this.everything.refNo, currentReferenceNumber);
    });
  }

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

  printedIncrementRefrenceNumberUpdate() {
    this.theProductService.getByPrintedMaximumNumber().subscribe((data) => {
      this.printMaximumNumber = data;

      let currentReferenceNumber = this.printMaximumNumber + 1;

      this.everything.refNo = 'PFL00' + currentReferenceNumber;
      this.everything.printRefNum = currentReferenceNumber;

      this.duplicateCheckerPrintedUpdate(
        this.everything.refNo,
        currentReferenceNumber
      );
    });
  }

  wovenIncrementRefrenceNumberUpdate() {
    this.theProductService.getByWovenMaximumNumber().subscribe((data) => {
      this.wovenMaximumNumber = data;

      let currentReferenceNumber = this.wovenMaximumNumber + 1;

      this.everything.refNo = 'WOV00' + currentReferenceNumber;
      this.everything.wovenRefNum = currentReferenceNumber;

      this.duplicateCheckerWovenUpdate(
        this.everything.refNo,
        currentReferenceNumber
      );
    });
  }

  tagIncrementRefrenceNumberUpdate() {
    this.theProductService.getByTagMaximumNumber().subscribe((data) => {
      this.tagMaximumNumber = data;

      let currentReferenceNumber = this.tagMaximumNumber + 1;

      this.everything.refNo = 'TAG00' + currentReferenceNumber;
      this.everything.tagRefNum = currentReferenceNumber;

      this.duplicateCheckerTagUpdate(
        this.everything.refNo,
        currentReferenceNumber
      );
    });
  }

  stickerIncrementRefrenceNumberUpdate() {
    this.theProductService.getByStickerMaximumNumber().subscribe((data) => {
      this.stickerMaximumNumber = data;

      let currentReferenceNumber = this.stickerMaximumNumber + 1;

      this.everything.refNo = 'ST00' + currentReferenceNumber;
      this.everything.stickerRefNum = currentReferenceNumber;

      this.duplicateCheckerStickerUpdate(
        this.everything.refNo,
        currentReferenceNumber
      );
    });
  }

  checkWovenForm() {
    if (
      this.everything.sampName == undefined ||
      (this.intPlusFloat88.invalid && this.intPlusFloat88.touched)
    ) {
      this._snackBar.open('Please Fill Sample Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampType == undefined ||
      (this.intPlusFloat89.invalid && this.intPlusFloat89.touched)
    ) {
      this._snackBar.open('Please Fill Sample Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.name == undefined ||
      (this.intPlusFloat22.invalid && this.intPlusFloat22.touched)
    ) {
      this._snackBar.open('Please Fill Customer Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.contactPerson == undefined ||
      (this.intPlusFloat23.invalid && this.intPlusFloat23.touched)
    ) {
      this._snackBar.open('Please Fill Contact Person', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.phone == undefined ||
      (this.onlyInt3.invalid && this.onlyInt3.touched)
    ) {
      this._snackBar.open('Please Fill Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.email == undefined ||
      (this.primEmail.invalid && this.primEmail.touched)
    ) {
      this._snackBar.open('Please Fill valid EmailId', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.orderType == undefined ||
      (this.intPlusFloat90.invalid && this.intPlusFloat90.touched)
    ) {
      this._snackBar.open('Please Fill Order Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedDate == undefined ||
      (this.intPlusFloat92.invalid && this.intPlusFloat92.touched)
    ) {
      this._snackBar.open('Please Fill Expected Date', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.approvalType == undefined ||
      (this.intPlusFloat91.invalid && this.intPlusFloat91.touched)
    ) {
      this._snackBar.open('Please Fill Approval Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.labelType == undefined ||
      (this.intPlusFloat93.invalid && this.intPlusFloat93.touched)
    ) {
      this._snackBar.open('Please Fill Label Type for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unit == undefined ||
      (this.intPlusFloat94.invalid && this.intPlusFloat94.touched)
    ) {
      this._snackBar.open('Please Fill Unit  for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.everything.unitHeight == undefined) {
      this._snackBar.open('Please Fill Unit Height for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.everything.unitWidth == undefined) {
      this._snackBar.open('Please Fill Unit Width for woven ', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedQuantity == undefined ||
      (this.onlyInt.invalid && this.onlyInt.touched)
    ) {
      this._snackBar.open('Invalid Expected Quantity woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.color == undefined ||
      (this.intPlusFloat95.invalid && this.intPlusFloat95.touched)
    ) {
      this._snackBar.open('Please Fill Color for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.folding == undefined ||
      (this.intPlusFloat96.invalid && this.intPlusFloat96.touched)
    ) {
      this._snackBar.open('Please Fill Folding for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.finishing == undefined ||
      (this.intPlusFloat97.invalid && this.intPlusFloat97.touched)
    ) {
      this._snackBar.open('Please Fill Finishing for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else if(this.fileIsUploaded == false)
    // {
    //   this._snackBar.open("Please Upload an Attachment", "", {
    //     duration: 2000,
    //     panelClass: ['snackbar1'],
    //     verticalPosition: "top",
    //     horizontalPosition: "center"
    //   });
    // }
    else {
      this.onSubmitEverything();
      this._snackBar.open('Order Saved Successfully', '', {
        duration: 2000,
        panelClass: ['snackbar3'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
      // this.router.navigate(['/home/orders']);
    }
  }

  checkWovenFormUpdate() {
    if (
      this.everything.sampName == undefined ||
      (this.intPlusFloat88.invalid && this.intPlusFloat88.touched)
    ) {
      this._snackBar.open('Please Fill Sample Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampType == undefined ||
      (this.intPlusFloat89.invalid && this.intPlusFloat89.touched)
    ) {
      this._snackBar.open('Please Fill Sample Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.name == undefined ||
      (this.intPlusFloat22.invalid && this.intPlusFloat22.touched)
    ) {
      this._snackBar.open('Please Fill Customer Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.contactPerson == undefined ||
      (this.intPlusFloat23.invalid && this.intPlusFloat23.touched)
    ) {
      this._snackBar.open('Please Fill Contact Person', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.phone == undefined ||
      (this.onlyInt3.invalid && this.onlyInt3.touched)
    ) {
      this._snackBar.open('Please Fill Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.email == undefined ||
      (this.primEmail.invalid && this.primEmail.touched)
    ) {
      this._snackBar.open('Please Fill valid EmailId', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.orderType == undefined ||
      (this.intPlusFloat90.invalid && this.intPlusFloat90.touched)
    ) {
      this._snackBar.open('Please Fill Order Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedDate == undefined ||
      (this.intPlusFloat92.invalid && this.intPlusFloat92.touched)
    ) {
      this._snackBar.open('Please Fill Expected Date', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.approvalType == undefined ||
      (this.intPlusFloat91.invalid && this.intPlusFloat91.touched)
    ) {
      this._snackBar.open('Please Fill Approval Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.labelType == undefined ||
      (this.intPlusFloat93.invalid && this.intPlusFloat93.touched)
    ) {
      this._snackBar.open('Please Fill Label Type for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unit == undefined ||
      (this.intPlusFloat94.invalid && this.intPlusFloat94.touched)
    ) {
      this._snackBar.open('Please Fill Unit  for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.everything.unitHeight == undefined) {
      this._snackBar.open('Please Fill Unit Height for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.everything.unitWidth == undefined) {
      this._snackBar.open('Please Fill Unit Width for woven ', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedQuantity == undefined ||
      (this.onlyInt.invalid && this.onlyInt.touched)
    ) {
      this._snackBar.open('Invalid Expected Quantity woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.color == undefined ||
      (this.intPlusFloat95.invalid && this.intPlusFloat95.touched)
    ) {
      this._snackBar.open('Please Fill Color for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.folding == undefined ||
      (this.intPlusFloat96.invalid && this.intPlusFloat96.touched)
    ) {
      this._snackBar.open('Please Fill Folding for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.finishing == undefined ||
      (this.intPlusFloat97.invalid && this.intPlusFloat97.touched)
    ) {
      this._snackBar.open('Please Fill Finishing for woven', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else if(this.fileIsUploaded == false)
    // {
    //   this._snackBar.open("Please Upload an Attachment", "", {
    //     duration: 2000,
    //     panelClass: ['snackbar1'],
    //     verticalPosition: "top",
    //     horizontalPosition: "center"
    //   });
    // }
    else {
      this.updateStatus();
      this._snackBar.open('Order Saved Successfully', '', {
        duration: 2000,
        panelClass: ['snackbar3'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
      this.sendEmailCheck = true;
    }
  }

  checkTagForm() {
    if (
      this.everything.sampName == undefined ||
      (this.intPlusFloat88.invalid && this.intPlusFloat88.touched)
    ) {
      this._snackBar.open('Please Fill Sample Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampType == undefined ||
      (this.intPlusFloat89.invalid && this.intPlusFloat89.touched)
    ) {
      this._snackBar.open('Please Fill Sample Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.name == undefined ||
      (this.intPlusFloat22.invalid && this.intPlusFloat22.touched)
    ) {
      this._snackBar.open('Please Fill Customer Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.contactPerson == undefined ||
      (this.intPlusFloat23.invalid && this.intPlusFloat23.touched)
    ) {
      this._snackBar.open('Please Fill Contact Person', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.phone == undefined ||
      (this.onlyInt3.invalid && this.onlyInt3.touched)
    ) {
      this._snackBar.open('Please Fill Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.email == undefined ||
      (this.primEmail.invalid && this.primEmail.touched)
    ) {
      this._snackBar.open('Please Fill valid EmailId', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.orderType == undefined ||
      (this.intPlusFloat90.invalid && this.intPlusFloat90.touched)
    ) {
      this._snackBar.open('Please Fill Order Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedDate == undefined ||
      (this.intPlusFloat92.invalid && this.intPlusFloat92.touched)
    ) {
      this._snackBar.open('Please Fill Expected Date', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.approvalType == undefined ||
      (this.intPlusFloat91.invalid && this.intPlusFloat91.touched)
    ) {
      this._snackBar.open('Please Fill Approval Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.printTypeTag == undefined ||
      (this.intPlusFloat82.invalid && this.intPlusFloat82.touched)
    ) {
      this._snackBar.open('Please Fill Print Type for tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitHeightTag == undefined ||
      (this.intPlusFloat11.invalid && this.intPlusFloat11.touched)
    ) {
      this._snackBar.open('Please Fill unit Height for tag ', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitWidthTag == undefined ||
      (this.intPlusFloat12.invalid && this.intPlusFloat12.touched)
    ) {
      this._snackBar.open('Please Fill unit Width for tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.tagDevType == undefined ||
      (this.intPlusFloat56.invalid && this.intPlusFloat56.touched)
    ) {
      this._snackBar.open('Please Fill Tag Dev type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.nameOfTheBoard == undefined ||
      (this.intPlusFloat58.invalid && this.intPlusFloat58.touched)
    ) {
      this._snackBar.open('Please Fill Name Of The Board', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.boardSpecification == undefined ||
      (this.intPlusFloat59.invalid && this.intPlusFloat59.touched)
    ) {
      this._snackBar.open('Please Fill Board Specification', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.qualityTag == undefined ||
      (this.intPlusFloat104.invalid && this.intPlusFloat104.touched)
    ) {
      this._snackBar.open('Please Fill Quality for Tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.boardGSM == undefined ||
      (this.intPlusFloat14.invalid && this.intPlusFloat14.touched)
    ) {
      this._snackBar.open('Please Fill BoardGSM', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.colorTag == undefined ||
      (this.intPlusFloat105.invalid && this.intPlusFloat105.touched)
    ) {
      this._snackBar.open('Please Fill Color for Tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedQuantityTag == undefined ||
      (this.onlyInt2.invalid && this.onlyInt2.touched)
    ) {
      this._snackBar.open('Invalid Expected Quantity tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else if( this.everything.statusTag == undefined || this.intPlusFloat106.invalid && this.intPlusFloat106.touched )
    // {
    //     this._snackBar.open("Please Fill Status for Tag", "", {
    //       duration: 2000,
    //       panelClass: ['snackbar1'],
    //       verticalPosition: "top",
    //       horizontalPosition: "center"
    //     });
    // }

    // else if( this.everything.foldingTag == undefined || this.intPlusFloat107.invalid && this.intPlusFloat107.touched )
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
      (this.intPlusFloat108.invalid && this.intPlusFloat108.touched)
    ) {
      this._snackBar.open('Please Fill Finishing for Tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    //folding - 107

    //finishing - 108
    else if (
      this.everything.comments == undefined ||
      (this.intPlusFloat60.invalid && this.intPlusFloat60.touched)
    ) {
      this._snackBar.open('Please Fill Comments to follow', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else if(this.fileIsUploaded == false)
    // {
    //   this._snackBar.open("Please Upload an Attachment", "", {
    //     duration: 2000,
    //     panelClass: ['snackbar1'],
    //     verticalPosition: "top",
    //     horizontalPosition: "center"
    //   });
    // }
    else {
      this.onSubmitEverything();
      this._snackBar.open('Order Saved Successfully', '', {
        duration: 2000,
        panelClass: ['snackbar3'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
      // this.router.navigate(['/home/orders']);
    }
  }

  checkTagFormUpdate() {
    if (
      this.everything.sampName == undefined ||
      (this.intPlusFloat88.invalid && this.intPlusFloat88.touched)
    ) {
      this._snackBar.open('Please Fill Sample Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampType == undefined ||
      (this.intPlusFloat89.invalid && this.intPlusFloat89.touched)
    ) {
      this._snackBar.open('Please Fill Sample Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.name == undefined ||
      (this.intPlusFloat22.invalid && this.intPlusFloat22.touched)
    ) {
      this._snackBar.open('Please Fill Customer Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.contactPerson == undefined ||
      (this.intPlusFloat23.invalid && this.intPlusFloat23.touched)
    ) {
      this._snackBar.open('Please Fill Contact Person', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.phone == undefined ||
      (this.onlyInt3.invalid && this.onlyInt3.touched)
    ) {
      this._snackBar.open('Please Fill Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.email == undefined ||
      (this.primEmail.invalid && this.primEmail.touched)
    ) {
      this._snackBar.open('Please Fill valid EmailId', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.orderType == undefined ||
      (this.intPlusFloat90.invalid && this.intPlusFloat90.touched)
    ) {
      this._snackBar.open('Please Fill Order Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedDate == undefined ||
      (this.intPlusFloat92.invalid && this.intPlusFloat92.touched)
    ) {
      this._snackBar.open('Please Fill Expected Date', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.approvalType == undefined ||
      (this.intPlusFloat91.invalid && this.intPlusFloat91.touched)
    ) {
      this._snackBar.open('Please Fill Approval Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.printTypeTag == undefined ||
      (this.intPlusFloat82.invalid && this.intPlusFloat82.touched)
    ) {
      this._snackBar.open('Please Fill Print Type for tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitHeightTag == undefined ||
      (this.intPlusFloat11.invalid && this.intPlusFloat11.touched)
    ) {
      this._snackBar.open('Please Fill unit Height for tag ', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitWidthTag == undefined ||
      (this.intPlusFloat12.invalid && this.intPlusFloat12.touched)
    ) {
      this._snackBar.open('Please Fill unit Width for tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.tagDevType == undefined ||
      (this.intPlusFloat56.invalid && this.intPlusFloat56.touched)
    ) {
      this._snackBar.open('Please Fill Tag Dev type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.nameOfTheBoard == undefined ||
      (this.intPlusFloat58.invalid && this.intPlusFloat58.touched)
    ) {
      this._snackBar.open('Please Fill Name Of The Board', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.boardSpecification == undefined ||
      (this.intPlusFloat59.invalid && this.intPlusFloat59.touched)
    ) {
      this._snackBar.open('Please Fill Board Specification', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.qualityTag == undefined ||
      (this.intPlusFloat104.invalid && this.intPlusFloat104.touched)
    ) {
      this._snackBar.open('Please Fill Quality for Tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.boardGSM == undefined ||
      (this.intPlusFloat14.invalid && this.intPlusFloat14.touched)
    ) {
      this._snackBar.open('Please Fill BoardGSM', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.colorTag == undefined ||
      (this.intPlusFloat105.invalid && this.intPlusFloat105.touched)
    ) {
      this._snackBar.open('Please Fill Color for Tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedQuantityTag == undefined ||
      (this.onlyInt2.invalid && this.onlyInt2.touched)
    ) {
      this._snackBar.open('Invalid Expected Quantity tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else if( this.everything.statusTag == undefined || this.intPlusFloat106.invalid && this.intPlusFloat106.touched )
    // {
    //     this._snackBar.open("Please Fill Status for Tag", "", {
    //       duration: 2000,
    //       panelClass: ['snackbar1'],
    //       verticalPosition: "top",
    //       horizontalPosition: "center"
    //     });
    // }

    // else if( this.everything.foldingTag == undefined || this.intPlusFloat107.invalid && this.intPlusFloat107.touched )
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
      (this.intPlusFloat108.invalid && this.intPlusFloat108.touched)
    ) {
      this._snackBar.open('Please Fill Finishing for Tag', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    //folding - 107

    //finishing - 108
    else if (
      this.everything.comments == undefined ||
      (this.intPlusFloat60.invalid && this.intPlusFloat60.touched)
    ) {
      this._snackBar.open('Please Fill Comments to follow', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else if(this.fileIsUploaded == false)
    // {
    //   this._snackBar.open("Please Upload an Attachment", "", {
    //     duration: 2000,
    //     panelClass: ['snackbar1'],
    //     verticalPosition: "top",
    //     horizontalPosition: "center"
    //   });
    // }
    else {
      this.updateStatus();
      this._snackBar.open('Order Saved Successfully', '', {
        duration: 2000,
        panelClass: ['snackbar3'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
      this.sendEmailCheck = true;
    }
  }

  checkStickerForm() {
    if (
      this.everything.sampName == undefined ||
      (this.intPlusFloat88.invalid && this.intPlusFloat88.touched)
    ) {
      this._snackBar.open('Please Fill Sample Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampType == undefined ||
      (this.intPlusFloat89.invalid && this.intPlusFloat89.touched)
    ) {
      this._snackBar.open('Please Fill Sample Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.name == undefined ||
      (this.intPlusFloat22.invalid && this.intPlusFloat22.touched)
    ) {
      this._snackBar.open('Please Fill Customer Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.contactPerson == undefined ||
      (this.intPlusFloat23.invalid && this.intPlusFloat23.touched)
    ) {
      this._snackBar.open('Please Fill Contact Person', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.phone == undefined ||
      (this.onlyInt3.invalid && this.onlyInt3.touched)
    ) {
      this._snackBar.open('Please Fill Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.email == undefined ||
      (this.primEmail.invalid && this.primEmail.touched)
    ) {
      this._snackBar.open('Please Fill valid EmailId', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.orderType == undefined ||
      (this.intPlusFloat90.invalid && this.intPlusFloat90.touched)
    ) {
      this._snackBar.open('Please Fill Order Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedDate == undefined ||
      (this.intPlusFloat92.invalid && this.intPlusFloat92.touched)
    ) {
      this._snackBar.open('Please Fill Expected Date', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.approvalType == undefined ||
      (this.intPlusFloat91.invalid && this.intPlusFloat91.touched)
    ) {
      this._snackBar.open('Please Fill Approval Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.printType == undefined ||
      (this.intPlusFloat83.invalid && this.intPlusFloat83.touched)
    ) {
      this._snackBar.open('Please Fill Print Type in Sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitHeightSticker == undefined ||
      (this.intPlusFloat50.invalid && this.intPlusFloat50.touched)
    ) {
      this._snackBar.open('Invalid Unit Height in Sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitWidthSticker == undefined ||
      (this.intPlusFloat49.invalid && this.intPlusFloat49.touched)
    ) {
      this._snackBar.open('Please Fill unitwidth info for sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.diameter == undefined ||
      (this.intPlusFloat48.invalid && this.intPlusFloat48.touched)
    ) {
      this._snackBar.open('Please Fill Diameter', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.stickerType == undefined ||
      (this.intPlusFloat84.invalid && this.intPlusFloat84.touched)
    ) {
      this._snackBar.open('Please Fill Sticker Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.rollColor == undefined ||
      (this.intPlusFloat72.invalid && this.intPlusFloat72.touched)
    ) {
      this._snackBar.open('Please Fill Roll Color for Sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.rollSpecification == undefined ||
      (this.intPlusFloat73.invalid && this.intPlusFloat73.touched)
    ) {
      this._snackBar.open('Please Fill Roll Specification', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.rollSize == undefined ||
      (this.intPlusFloat47.invalid && this.intPlusFloat47.touched)
    ) {
      this._snackBar.open('Please Fill RollSize', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.comments == undefined ||
      (this.intPlusFloat74.invalid && this.intPlusFloat74.touched)
    ) {
      this._snackBar.open('Please Fill comments to follow', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedQuantitySticker == undefined ||
      (this.intPlusFloat46.invalid && this.intPlusFloat46.touched)
    ) {
      this._snackBar.open('Please Fill Exp Quantity sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampleRequest == undefined ||
      (this.intPlusFloat109.invalid && this.intPlusFloat109.touched)
    ) {
      this._snackBar.open('Please Fill Sample Request On', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else if(this.fileIsUploaded == false)
    // {
    //   this._snackBar.open("Please Upload an Attachment", "", {
    //     duration: 2000,
    //     panelClass: ['snackbar1'],
    //     verticalPosition: "top",
    //     horizontalPosition: "center"
    //   });
    // }
    else {
      this.onSubmitEverything();
      this._snackBar.open('Order Saved Successfully', '', {
        duration: 2000,
        panelClass: ['snackbar3'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
      // this.router.navigate(['/home/orders']);
    }
  }

  checkStickerFormUpdate() {
    if (
      this.everything.sampName == undefined ||
      (this.intPlusFloat88.invalid && this.intPlusFloat88.touched)
    ) {
      this._snackBar.open('Please Fill Sample Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampType == undefined ||
      (this.intPlusFloat89.invalid && this.intPlusFloat89.touched)
    ) {
      this._snackBar.open('Please Fill Sample Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.name == undefined ||
      (this.intPlusFloat22.invalid && this.intPlusFloat22.touched)
    ) {
      this._snackBar.open('Please Fill Customer Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.contactPerson == undefined ||
      (this.intPlusFloat23.invalid && this.intPlusFloat23.touched)
    ) {
      this._snackBar.open('Please Fill Contact Person', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.phone == undefined ||
      (this.onlyInt3.invalid && this.onlyInt3.touched)
    ) {
      this._snackBar.open('Please Fill Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.email == undefined ||
      (this.primEmail.invalid && this.primEmail.touched)
    ) {
      this._snackBar.open('Please Fill valid EmailId', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.orderType == undefined ||
      (this.intPlusFloat90.invalid && this.intPlusFloat90.touched)
    ) {
      this._snackBar.open('Please Fill Order Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedDate == undefined ||
      (this.intPlusFloat92.invalid && this.intPlusFloat92.touched)
    ) {
      this._snackBar.open('Please Fill Expected Date', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.approvalType == undefined ||
      (this.intPlusFloat91.invalid && this.intPlusFloat91.touched)
    ) {
      this._snackBar.open('Please Fill Approval Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.printType == undefined ||
      (this.intPlusFloat83.invalid && this.intPlusFloat83.touched)
    ) {
      this._snackBar.open('Please Fill Print Type in Sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitHeightSticker == undefined ||
      (this.intPlusFloat50.invalid && this.intPlusFloat50.touched)
    ) {
      this._snackBar.open('Invalid Unit Height in Sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitWidthSticker == undefined ||
      (this.intPlusFloat49.invalid && this.intPlusFloat49.touched)
    ) {
      this._snackBar.open('Please Fill unitwidth info for sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.diameter == undefined ||
      (this.intPlusFloat48.invalid && this.intPlusFloat48.touched)
    ) {
      this._snackBar.open('Please Fill Diameter', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.stickerType == undefined ||
      (this.intPlusFloat84.invalid && this.intPlusFloat84.touched)
    ) {
      this._snackBar.open('Please Fill Sticker Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.rollColor == undefined ||
      (this.intPlusFloat72.invalid && this.intPlusFloat72.touched)
    ) {
      this._snackBar.open('Please Fill Roll Color for Sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.rollSpecification == undefined ||
      (this.intPlusFloat73.invalid && this.intPlusFloat73.touched)
    ) {
      this._snackBar.open('Please Fill Roll Specification', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.rollSize == undefined ||
      (this.intPlusFloat47.invalid && this.intPlusFloat47.touched)
    ) {
      this._snackBar.open('Please Fill RollSize', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.comments == undefined ||
      (this.intPlusFloat74.invalid && this.intPlusFloat74.touched)
    ) {
      this._snackBar.open('Please Fill comments to follow', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedQuantitySticker == undefined ||
      (this.intPlusFloat46.invalid && this.intPlusFloat46.touched)
    ) {
      this._snackBar.open('Please Fill Exp Quantity sticker', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampleRequest == undefined ||
      (this.intPlusFloat109.invalid && this.intPlusFloat109.touched)
    ) {
      this._snackBar.open('Please Fill Sample Request On', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else if(this.fileIsUploaded == false)
    // {
    //   this._snackBar.open("Please Upload an Attachment", "", {
    //     duration: 2000,
    //     panelClass: ['snackbar1'],
    //     verticalPosition: "top",
    //     horizontalPosition: "center"
    //   });
    // }
    else {
      this.updateStatus();
      this._snackBar.open('Order Saved Successfully', '', {
        duration: 2000,
        panelClass: ['snackbar3'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
      this.sendEmailCheck = true;
    }
  }

  checkPrintedForm() {
    if (
      this.everything.sampName == undefined ||
      (this.intPlusFloat88.invalid && this.intPlusFloat88.touched)
    ) {
      this._snackBar.open('Please Fill Sample Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampType == undefined ||
      (this.intPlusFloat89.invalid && this.intPlusFloat89.touched)
    ) {
      this._snackBar.open('Please Fill Sample Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.name == undefined ||
      (this.intPlusFloat22.invalid && this.intPlusFloat22.touched)
    ) {
      this._snackBar.open('Please Fill Customer Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.contactPerson == undefined ||
      (this.intPlusFloat23.invalid && this.intPlusFloat23.touched)
    ) {
      this._snackBar.open('Please Fill Contact Person', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.phone == undefined ||
      (this.onlyInt3.invalid && this.onlyInt3.touched)
    ) {
      this._snackBar.open('Please Fill Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.email == undefined ||
      (this.primEmail.invalid && this.primEmail.touched)
    ) {
      this._snackBar.open('Please Fill valid EmailId', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.orderType == undefined ||
      (this.intPlusFloat90.invalid && this.intPlusFloat90.touched)
    ) {
      this._snackBar.open('Please Fill Order Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedDate == undefined ||
      (this.intPlusFloat92.invalid && this.intPlusFloat92.touched)
    ) {
      this._snackBar.open('Please Fill Expected Date', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.approvalType == undefined ||
      (this.intPlusFloat91.invalid && this.intPlusFloat91.touched)
    ) {
      this._snackBar.open('Please Fill Approval Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.everything.labelTypePrinted == undefined) {
      this._snackBar.open('Please Fill Label Type for printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.everything.unitPrinted == undefined) {
      this._snackBar.open('Please Fill Unit for printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitHeightPrinted == undefined ||
      (this.intPlusFloat41.invalid && this.intPlusFloat41.touched)
    ) {
      this._snackBar.open('Please Fill Unit Height in Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitWidthPrinted == undefined ||
      (this.intPlusFloat38.invalid && this.intPlusFloat38.touched)
    ) {
      this._snackBar.open('Please Fill Unit Width for printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedQuantityPrinted == undefined ||
      (this.intPlusFloat2.invalid && this.intPlusFloat2.touched)
    ) {
      this._snackBar.open('Please Fill Expected Quantity Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.everything.colorPrinted == undefined) {
      this._snackBar.open('Please Fill Color in Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.everything.foldingPrinted == undefined) {
      this._snackBar.open('Please Fill Folding in Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.everything.finishingPrinted == undefined) {
      this._snackBar.open('Please Fill Finishing in Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.everything.finishingPrinted == undefined) {
      this._snackBar.open('Please Fill Finishing in Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else if(this.fileIsUploaded == false)
    // {
    //   this._snackBar.open("Please Upload an Attachment", "", {
    //     duration: 2000,
    //     panelClass: ['snackbar1'],
    //     verticalPosition: "top",
    //     horizontalPosition: "center"
    //   });
    // }
    else {
      this.onSubmitEverything();
      this._snackBar.open('Order Saved Successfully', '', {
        duration: 2000,
        panelClass: ['snackbar3'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
      //this.router.navigate(['/home/orders']);
    }
  }

  checkPrintedFormUpdate() {
    if (
      this.everything.sampName == undefined ||
      (this.intPlusFloat88.invalid && this.intPlusFloat88.touched)
    ) {
      this._snackBar.open('Please Fill Sample Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.sampType == undefined ||
      (this.intPlusFloat89.invalid && this.intPlusFloat89.touched)
    ) {
      this._snackBar.open('Please Fill Sample Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.name == undefined ||
      (this.intPlusFloat22.invalid && this.intPlusFloat22.touched)
    ) {
      this._snackBar.open('Please Fill Customer Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.contactPerson == undefined ||
      (this.intPlusFloat23.invalid && this.intPlusFloat23.touched)
    ) {
      this._snackBar.open('Please Fill Contact Person', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.phone == undefined ||
      (this.onlyInt3.invalid && this.onlyInt3.touched)
    ) {
      this._snackBar.open('Please Fill Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.email == undefined ||
      (this.primEmail.invalid && this.primEmail.touched)
    ) {
      this._snackBar.open('Please Fill valid EmailId', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.orderType == undefined ||
      (this.intPlusFloat90.invalid && this.intPlusFloat90.touched)
    ) {
      this._snackBar.open('Please Fill Order Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedDate == undefined ||
      (this.intPlusFloat92.invalid && this.intPlusFloat92.touched)
    ) {
      this._snackBar.open('Please Fill Expected Date', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.approvalType == undefined ||
      (this.intPlusFloat91.invalid && this.intPlusFloat91.touched)
    ) {
      this._snackBar.open('Please Fill Approval Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.everything.labelTypePrinted == undefined) {
      this._snackBar.open('Please Fill Label Type for printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.everything.unitPrinted == undefined) {
      this._snackBar.open('Please Fill Unit for printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitHeightPrinted == undefined ||
      (this.intPlusFloat41.invalid && this.intPlusFloat41.touched)
    ) {
      this._snackBar.open('Please Fill Unit Height in Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.unitWidthPrinted == undefined ||
      (this.intPlusFloat38.invalid && this.intPlusFloat38.touched)
    ) {
      this._snackBar.open('Please Fill Unit Width for printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.everything.expectedQuantityPrinted == undefined ||
      (this.intPlusFloat2.invalid && this.intPlusFloat2.touched)
    ) {
      this._snackBar.open('Please Fill Expected Quantity Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.everything.colorPrinted == undefined) {
      this._snackBar.open('Please Fill Color in Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.everything.foldingPrinted == undefined) {
      this._snackBar.open('Please Fill Folding in Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.everything.finishingPrinted == undefined) {
      this._snackBar.open('Please Fill Finishing in Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.everything.finishingPrinted == undefined) {
      this._snackBar.open('Please Fill Finishing in Printed', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else if(this.fileIsUploaded == false)
    // {
    //   this._snackBar.open("Please Upload an Attachment", "", {
    //     duration: 2000,
    //     panelClass: ['snackbar1'],
    //     verticalPosition: "top",
    //     horizontalPosition: "center"
    //   });
    // }
    else {
      this.updateStatus();
      this._snackBar.open('Order Saved Successfully', '', {
        duration: 2000,
        panelClass: ['snackbar3'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
      this.sendEmailCheck = true;
    }
  }

  resetForm() {
    this.productReference = new productReferenceTS();
  }

  public salesTeamCheck: boolean = false;
  public customerCheck: boolean = false;
  public salesTeamCheckCompleted: boolean = false;
  public customerCheckCompleted: boolean = false;

  //   checkWoven(){
  //       if(this.saveOrderCheck === true)
  //       {
  //         this.onSubmitEverything();
  //         this._snackBar.open("Order Saved Successfully", "", {
  //           duration: 2000,
  //           panelClass: ['snackbar3'],
  //           verticalPosition: "top",
  //           horizontalPosition: "center"
  //         });
  //         this.router.navigate(['/home/orders']);
  //       }
  //       else if(this.confirmOrderCheck === true)
  //       {
  //         this.updateStatus();
  //         this._snackBar.open("Order Saved Successfully", "", {
  //           duration: 2000,
  //           panelClass: ['snackbar3'],
  //           verticalPosition: "top",
  //           horizontalPosition: "center"
  //         });
  //       }
  //       else
  //       {
  //         alert("Error From Regex Check")
  //       }
  //  }
  public confirmOrderCheck: boolean = false;
  public saveOrderCheck: boolean = false;

  testFunction() {
    this.updateStatus();
    this._snackBar.open('Order Saved Successfully', '', {
      duration: 2000,
      panelClass: ['snackbar3'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
    this.sendEmailCheck = true;
  }

  //   checkTag(){
  //       if(this.saveOrderCheck === true)
  //       {
  //         this.onSubmitEverything();
  //         this._snackBar.open("Order Saved Successfully", "", {
  //           duration: 2000,
  //           panelClass: ['snackbar3'],
  //           verticalPosition: "top",
  //           horizontalPosition: "center"
  //         });
  //         this.router.navigate(['/home/orders']);
  //       }
  //       else if(this.confirmOrderCheck === true)
  //       {
  //         this.updateStatus();
  //         this._snackBar.open("Order Saved Successfully", "", {
  //           duration: 2000,
  //           panelClass: ['snackbar3'],
  //           verticalPosition: "top",
  //           horizontalPosition: "center"
  //         });
  //         this.sendEmailCheck = true;
  //       }
  //       else
  //       {
  //         alert("Error From Regex Check")
  //       }
  //  }

  // checkSticker()
  // {
  //     if(this.saveOrderCheck === true)
  //     {
  //       this.onSubmitEverything();
  //       this._snackBar.open("Order Saved Successfully", "", {
  //         duration: 2000,
  //         panelClass: ['snackbar3'],
  //         verticalPosition: "top",
  //         horizontalPosition: "center"
  //       });
  //       this.router.navigate(['/home/orders']);
  //     }
  //     else if(this.confirmOrderCheck === true)
  //     {
  //       this.updateStatus();
  //       this._snackBar.open("Order Saved Successfully", "", {
  //         duration: 2000,
  //         panelClass: ['snackbar3'],
  //         verticalPosition: "top",
  //         horizontalPosition: "center"
  //       });
  //       this.sendEmailCheck = true;
  //     }
  //     else
  //     {
  //       alert("Error From Regex Check")
  //     }
  // }

  // checkPrinted()
  // {
  //   if(this.saveOrderCheck === true)
  //   {
  //     this.onSubmitEverything();
  //     this._snackBar.open("Order Saved Successfully", "", {
  //       duration: 2000,
  //       panelClass: ['snackbar3'],
  //       verticalPosition: "top",
  //       horizontalPosition: "center"
  //     });
  //     this.router.navigate(['/home/orders']);
  //   }
  //   else if(this.confirmOrderCheck === true)
  //   {
  //     this.updateStatus();
  //     this._snackBar.open("Order Saved Successfully", "", {
  //       duration: 2000,
  //       panelClass: ['snackbar3'],
  //       verticalPosition: "top",
  //       horizontalPosition: "center"
  //     });
  //     this.sendEmailCheck = true;
  //   }
  //   else
  //   {
  //     alert("Error From Regex Check")
  //   }
  // }

  accessChecker() {
    if (localStorage.getItem('token') === 'Sales Team') {
      this.salesTeamCheck = false;
      this.customerCheck = false;
    } else if (localStorage.getItem('token') === 'Customer') {
      this.salesTeamCheck = false;
      this.customerCheck = true;
    } else if (localStorage.getItem('token') === 'Administrator') {
      this.salesTeamCheck = true;
      this.customerCheck = true;
    }
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

  ngOnInit() {
    //TODO: this fn should be called only for customer accesstype
    this.getExactCustomerName();

    //TODO: This fn should be called only if the accesstype is executive (Sales Team)
    // this.getExecutivesCustomerName();
    this.fetchEmployeesListForExecutive();

    //TODO: many unnecessary larger api calls within a single function (remove it)
    this.reloadData();

    // console.log(this.filteredCustomerObservable);

    // TRANSACTION FORMS

    this.everything = new Everything();

    this.id = this.route.snapshot.params['id'];

    if (this.id == undefined || this.id == null) {
    } else {
      this.everythingService.getEverything(this.id).subscribe(
        (data) => {
          this.everything = data;
        },
        (error) => console.log(error)
      );
    }

    this.checkAccess();
    this.checkTrimType();

    this.toggleAccess();

    this.customerName = localStorage.getItem('nameToken');

    this.showButton();

    this.accessChecker();

    this.everything.orderCreatedBy = localStorage.getItem('token');

    if (localStorage.getItem('token') === 'Customer') {
      this.customerDetailsForCustomer();
    }
  }

  showButton() {
    if (this.transactionStatus === 'Sample Request') {
      this.showSampleRequest = true;
      this.noShowSampleRequest = false;
    }
  }

  //PRODUCT REFERENCE LOGIC END
  //.............................
  //.............................
  //.............................
  //.............................
  //.............................
  //.............................
  //.............................

  // Upload

  selectedFiles: FileList;
  currentFile: File;
  progress = 0;
  message = '';
  latestName = '';

  fileInfos: Observable<any>;

  uploadedFileNameObservable: Observable<Upload[]>;
  uploadedFileName: Upload = new Upload();

  public fileIsUploaded: boolean = false;

  selectFile(event) {
    this.selectedFiles = event.target.files;

    this.upload1();
  }

  uploadFileName: string;

  checkUploadRegex(event) {
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
      this.selectFile(event);
    }
  }

  @ViewChild('artworkAttachment') artworkAttachment: ElementRef;

  // Artwork Attachment Reset
  resetArtworkAttachment() {
    this.uploadService
      .deleteFiles(this.everything.uploadName, this.currentDate)
      .subscribe((data: any) => {});

    console.log(this.artworkAttachment.nativeElement.files);
    this.artworkAttachment.nativeElement.value = '';
    console.log(this.artworkAttachment.nativeElement.files);

    this.everything.uploadName = '';
    this.everything.uploadName = null;
    this.fileIsUploaded = false;

    this._snackBar.open('File Removed Successfully', '', {
      duration: 2000,
      panelClass: ['snackbar3'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });

    this.progress = 0;
  }

  // iValue: number = 0;
  // nameStorage = [];

  executiveCode: string;
  executiveEmail: string;
  employeeName: string;

  customerEmail: string;

  getCustomerEmailID() {
    this.customerEmail = this.everything.email;
  }

  public checkExecutiveIsFilled: boolean = false;

  applyThatExecutiveIsFilled() {
    this.checkExecutiveIsFilled = true;
  }

  getExecutiveEmailID() {
    this.mexecutiveService
      .getByExecutiveName(this.everything.execName)
      .subscribe((data) => {
        this.mexecutive = data;

        this.executiveCode = this.mexecutive.code;
        this.executiveEmail = this.mexecutive.emailId;

        this.getOtherEmailDetails();
      });
  }

  tempCustomerName: string;
  tempExecutiveCustomerName: string;

  getCustomerName() {
    this.tempCustomerName = this.everything.name;
  }

  getOtherEmailDetails() {
    this.dataset.email = this.executiveEmail;
    this.dataset.customerName = this.tempCustomerName;
    this.dataset.executiveCode = this.executiveCode;
    this.dataset.sampleRequestNumber = this.everything.refNo;

    this.sendEmail();
  }

  singleOrderLine: OrderDetailsLineItem = new OrderDetailsLineItem();

  addTable() {
    if (
      this.singleOrderLine.variantCode != '' ||
      this.singleOrderLine.noOfPieces != ''
    ) {
      this.everything.orderLineItem.push(this.singleOrderLine);
      this.singleOrderLine = new OrderDetailsLineItem();
    } else {
      alert('Please Enter a Value');
    }
  }

  deleteRow(x) {
    var delBtn = confirm('Are you sure you want to Delete this Line Item?');
    if (delBtn == true) {
      this.everything.orderLineItem.splice(x, 1);
    }
  }

  getPageURL() {
    this.dataset.pageURL = `${Configuration.domainURL}home/uforms/${this.transactionFormID}`;
    this.getExecutiveEmailID();
  }

  tempUploadName = [];

  sendEmail() {
    if (localStorage.getItem('token') === 'Administrator') {
      this.sendCustomerEmail();
      this.sendExecutiveEmail();
    } else if (localStorage.getItem('token') === 'Customer') {
      this.sendExecutiveEmail();
    } else if (localStorage.getItem('token') === 'Sales Team') {
      this.sendCustomerEmail();
    }
  }

  sendExecutiveEmail() {
    this.dataset.customerName = this.everything.name;

    //Executive E-mail
    this.https
      .post<Details>(`${Configuration.apiURL}ilabel/email`, this.dataset)
      .subscribe(
        (res) => {
          this.dataset = res;
          console.log(this.dataset);
          // this._snackBar.open("Email Sent successfully", "", {
          //   duration: 2000,
          //   panelClass: ['snackbar3'],
          //   verticalPosition: "top",
          //   horizontalPosition: "center"
          // });
          this.dataset.customerName = '';
          this.dataset.executiveCode = '';
          this.dataset.sampleRequestNumber = '';
          this.dataset.pageURL = '';
        },
        (error) =>
          alert(
            'Server Data Error From Executive E-mail Send:: ' +
              JSON.stringify(error.status)
          )
      );

    this._snackBar.open('Email Sent successfully', '', {
      duration: 2000,
      panelClass: ['snackbar3'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });

    setTimeout(() => {
      this.router.navigate(['/home/orders']);
    }, 1000);
  }

  sendCustomerEmail() {
    this.dataset.email = this.everything.email;

    //Customer E-mail
    this.https
      .post<Details>(`${Configuration.apiURL}ilabel/email`, this.dataset)
      .subscribe(
        (res) => {
          this.dataset = res;
          console.log(this.dataset);
          // this._snackBar.open("Email Sent successfully", "", {
          //   duration: 2000,
          //   panelClass: ['snackbar3'],
          //   verticalPosition: "top",
          //   horizontalPosition: "center"
          // });
          this.dataset.customerName = '';
          this.dataset.executiveCode = '';
          this.dataset.sampleRequestNumber = '';
          this.dataset.pageURL = '';
        },
        (error) =>
          alert(
            'Server Data Error from Customer E-mail :: ' +
              JSON.stringify(error.status)
          )
      );

    this._snackBar.open('Email Sent successfully', '', {
      duration: 2000,
      panelClass: ['snackbar3'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });

    setTimeout(() => {
      this.router.navigate(['/home/orders']);
    }, 1000);
  }

  sendTestEmail() {
    this.dataset.email = 'sriharish@indsys.holdings';

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
        },
        (error) =>
          alert(
            'Server Data Error from Customer E-mail :: ' +
              JSON.stringify(error.status)
          )
      );
  }

  upload1() {
    this.progress = 0;

    this.currentFile = this.selectedFiles.item(0);

    this.uploadService.upload(this.currentFile, this.currentDate).subscribe(
      (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round((100 * event.loaded) / event.total);
        } else if (event instanceof HttpResponse) {
          this.message = event.body.message;
          this.latestName = event.body.latestName;
          this.fileInfos = this.uploadService.getFiles();
          this.everything.uploadName = this.message;
          console.log('upload Name ' + this.everything.uploadName);
          this.fileIsUploaded = true;
          // this.uploadService.getFiles().subscribe((data) => {
          //   this.uploadedFileName = data;

          //   this.everything.uploadName = this.message;
          //   this.fileIsUploaded = true;
          // });
        }
      },
      (err) => {
        this.progress = 0;
        this.message = 'Could not upload the file!';
        this.currentFile = undefined;
        this.fileIsUploaded = false;
      }
    );

    this.selectedFiles = undefined;
  }
}

interface Details {
  executiveCode: string;
  customerName: string;
  sampleRequestNumber: string;
  pageURL: string;
  email: string;
  attachment1: string;
}
