import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Employee } from '../models/employee';
import { EmployeeService } from '../services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { customerReferenceTS } from './../models/customerReference';
import { CustomerReferenceService } from '../services/customer-reference.service';
import { Mexecutive } from './../models/mexecutive';
import { MexecutiveService } from './../services/mexecutive.service';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from './../services/user.service';
import { Userprofile } from './../models/userprofile';
import { map } from 'rxjs/operators';
import { Company } from '../v2/models/company';
import { Territory } from '../models/territory';
import { TerritoryService } from './../services/territory.service';
import { CompanyService } from '../v2/services/company.service';
import { SnackBarService } from '../services/snackBar.service';
import { Validator } from '../utility-classes/validator';
import { NgxPaginationModule } from 'ngx-pagination';
import { Configuration } from '../configuration';


@Component({
  selector: 'app-m-customer',
  templateUrl: './m-customer.component.html',
  styleUrls: ['./m-customer.component.css'],
})
export class MCustomerComponent implements OnInit {
  dataset: CustomerVerification = {
    executiveName: '',
    customerName: '',
    email: '',
    verificationLink: '',
  };

  dataset2: CustomerVerificationWithLoginDetails = {
    customerName: '',
    executiveName: '',
    loginId: '',
    password: '',
    verificationLink: '',
  };

  userset: CustomerUserProfileDetails = {
    executiveName: '',
    customerName: '',
    email: '',
    loginID: '',
    password: '',
  };
  fileReaded: any;
  employeeReferenceId: any;

  p: number = 1;

  
  createRoute() {
    this._location.back();
  }

  // @ViewChild('usercontent') usercontent: ModalDirective;
  // @ViewChild('content') content: ModalDirective;

  // @ViewChild('usercontent') usercontent;
  @ViewChild('userProfilePrompt') userProfilePrompt;

  modal: any;
  count: number = 0;
  counter: string[] = [];

  users: Observable<Userprofile[]>;
  user: Userprofile = new Userprofile();

  customerReferenceObservable: Observable<customerReferenceTS[]>;

  form: FormGroup;
  customerReference: customerReferenceTS = new customerReferenceTS();
  submitted = false;

  id: number;

  employees: Employee[];

  employeeDataArray: Employee[] = [];

  headers: any;

  searchText: string;

  employee: Employee = new Employee();
  territories: Territory[];

  mexecutives: Mexecutive[];
  //mexecutive: Mexecutive = new Mexecutive();

  // mcountry1: Observable<Mcountry[]>;
  // mcountry: Mcountry = new Mcountry();

  mexecutives1: Observable<Mexecutive[]>;
  mexecutive: Mexecutive = new Mexecutive();

  companies: Company[];

  executiveArray = [];
  executiveCodeArray = [];

  customermax: number = 0;
  customernum: number = 0;
  customerreference: string;

  //Validator Regex

  public company: boolean = false;
  public individual: boolean = false;
  public userprofile: boolean = false;

  public showBusinessUpdate: boolean = false;

  validator: Validator;
  updateIndex: number;
  updateFlag: boolean = false;
  userToken: string;

  constructor(
    private https: HttpClient,
    private userService: UserService,
    private http: HttpClient,
    private modalService: NgbModal,
    private EmployeeService: EmployeeService,
    private router: Router,
    fb: FormBuilder,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private _location: Location,
    private theCustomerService: CustomerReferenceService,
    private mexecutiveService: MexecutiveService,
    private territoryService: TerritoryService,
    private snackBarService: SnackBarService,
    private companyService: CompanyService
  ) {
    this.validator = new Validator();
    this.accessType = localStorage.getItem('token');
    this.userToken = localStorage.getItem('userToken');
    // if (localStorage.getItem('token') === 'Sales Team') {
    //   this.getExecutiveCode();
    // }
    this.fetchCompanies();
  }

  fetchCompanies() {
    this.companyService.getAllCompanies().subscribe(
      (data) => {
        this.companies = data;
      },
      (err) => {
        alert(
          'Error while fetching Companies List. Please contact the administrator'
        );
        console.log(err);
      }
    );
  }

  onCompanyChange() {
    this.companyService.getById(this.employee.companyId).subscribe(
      (data) => {
        this.assignCompanyDetailstoCustomer(data);
      },
      (err) => {
        alert(
          'Error while fetching company details. Please contact the administrator'
        );
        console.log(err);
      }
    );
  }

  assignCompanyDetailstoCustomer(company: Company) {
    this.employee.territory = company.territoryId;

    // this.employee.executiveCode = company.executiveId;
    //Ideally we should e using execId but execCode has been used in orders
    //we don't have executiveCode in company v2 so fetching it from
    //onTerritoryChange using execId

    if (this.accessType == 'Sales Team') {
      this.employee.executiveCode = this.executiveCode;
      this.checkEmployeeName();
    } else {
      this.onTerritoryChange(true, company.executiveId);
    }
    this.employee.gstin = company.gstin;
    this.employee.website = company.website;
    this.employee.street1 = company.street1;
    this.employee.street2 = company.street2;
    this.employee.city = company.city;
    this.employee.zipcode = company.zipCode;
    this.employee.state = company.state;
    this.employee.country = company.country;
    this.employee.paymentTerms = company.paymentTerms;
    this.employee.shipmentTerms = company.shipmentTerms;
    this.employee.customername = company.name;
  }

  closeResult = '';

  employee_lt: Observable<Employee[]>;

  toggleCustomer() {
    this.showCustomer = true;
  }

  toggleSampleHead() {
    this.user.trimTypes = [''];
  }

  public showCustomer: boolean = true;

  modalReference: any;
  modalReference1: any;

  deactivateCustomer(id) {
    //update customer master
    this.EmployeeService.deactivateCustomer(id).subscribe(
      (data) => {
        if (data) {
          this.userService.deactivateUser(data['id']).subscribe(
            (data) => {
              this.snackBarService.showSuccessSnack(
                'Customer deactivated successfully'
              );
              this.reloadData();
            },
            (err) => console.log(err)
          );
        } else {
          console.log('Error: No User id returned');
        }
      },
      (err) => {
        this.snackBarService.showWarningSnack(
          'Error while deactivating customer.Please try again'
        );
        console.log(err);
      }
    );
  }

  activateCustomer(id) {
    //update customer master
    this.EmployeeService.activateCustomer(id).subscribe(
      (data) => {
        if (data) {
          this.userService.activateUser(data['id']).subscribe(
            (data) => {
              this.snackBarService.showSuccessSnack(
                'Customer activated successfully'
              );
              this.reloadData();
            },
            (err) => console.log(err)
          );
        } else {
          console.log('Error: No User id returned');
        }
      },
      (err) => {
        this.snackBarService.showWarningSnack(
          'Error while activating customer.Please try again'
        );
        console.log(err);
      }
    );
  }

  // Modal
  open(content) {
    this.modalReference = this.modalService.open(content, {
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

  bring(updateModal) {
    this.modalReference = this.modalService.open(updateModal, {
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

  show(next) {
    this.modalService
      .open(next, {
        backdrop: 'static',
        size: 'sm',
        centered: true,
        ariaLabelledBy: 'modal-basic-title',
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(next)}`;
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

  bigOpen(modalRef) {
    this.modalReference = this.modalService.open(modalRef, {
      backdrop: 'static',
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

  tempCustomerName2: string;
  tempCustomerEmail: string;
  tempCustomerToggleName: string;

  smallOpen(modalRef) {
    this.tempCustomerName2 = this.employee.customername;
    this.tempCustomerEmail = this.employee.emailId;
    this.tempCustomerToggleName = this.employee.customername;

    this.modalService.open(modalRef, {
      backdrop: 'static',
      size: 'md',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    });
  }

  testFunction() {
    this.user.username = this.tempCustomerName2;
    this.user.loginId = this.tempCustomerEmail;
    this.user.customerName = this.tempCustomerToggleName;
  }

  untoggleCustomer() {
    this.showCustomer = false;
    
  }

  // employeeChgFn(trvl: String) {
  //   this.employee_lt = this.employees.pipe(
  //     map((res: Employee[]) => {
  //       return res.filter((employee) => employee.customername == trvl);
  //     })
  //   );
  // }

  tempCustomerName: String;

  getCustomerName() {
    this.tempCustomerName = this.user.customerName;
  }
  //REGEX Start

  // Username
  get intPlusFloat() {
    return this.intplusFloatGroup.get('intplusFloatControl');
  }

  intplusFloatTitle = 'intplusFloat';
  intplusFloatGroup = new FormGroup({
    intplusFloatControl: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });

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

  // Alternate E-Mail Id
  get primEmail1() {
    return this.userEmail1.get('primaryEmail1');
  }

  title1 = 'email-validation';
  userEmail1 = new FormGroup({
    primaryEmail1: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,8}$'),
    ]),
  });

  // Phone Number
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

  // Zip Code
  get onlyInt2() {
    return this.onlyIntGroup2.get('onlyIntControl2');
  }

  onlyIntTitle2 = 'onlyInt2';
  onlyIntGroup2 = new FormGroup({
    onlyIntControl2: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{6}$'),
    ]),
  });

  // GST Number
  get intPlusFloat1() {
    return this.intplusFloatGroup1.get('intplusFloatControl1');
  }

  intplusFloatTitle1 = 'intplusFloat1';
  intplusFloatGroup1 = new FormGroup({
    intplusFloatControl1: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$'
      ),
    ]),
  });

  // ''
  get intPlusFloat2() {
    return this.intplusFloatGroup2.get('intplusFloatControl2');
  }

  intplusFloatTitle2 = 'intplusFloat2';
  intplusFloatGroup2 = new FormGroup({
    intplusFloatControl2: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });

  public emailExists: boolean = false;

  getEmail: string;
  getCustomerType: string;
  getCustomerName2: string;
  getExecutiveName2: string;

  checkEmployeeName() {
    this.mexecutiveService
      .getByExecutiveCode(this.employee.executiveCode)
      .subscribe((data: Mexecutive) => {
        this.employee.executiveName = data.name;
      });
  }

  checkRegex() {
    if (this.employee.customername == '') {
      this._snackBar.open('Please Enter Company Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else if (this.employee.radio === "Business" && this.employee.companyname == '') {
    //   this._snackBar.open("Please Enter Company Name", "", {
    //     duration: 2000,
    //     panelClass: ['snackbar1'],
    //     verticalPosition: "top",
    //     horizontalPosition: "center"
    //   });
    // }
    else if (this.employee.emailId == '') {
      this._snackBar.open('Please Enter an E-Mail Id', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.customerEmail === 'true') {
      this._snackBar.open('E-Mail Id already exists', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.employee.phone == '') {
      this._snackBar.open('Please Enter Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.employee.street1 == '') {
      this._snackBar.open('Please Enter Street1', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.employee.street2 == '') {
      this._snackBar.open('Please Enter Street2', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.employee.city == '') {
      this._snackBar.open('Please Enter a City', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.employee.zipcode == '') {
      this._snackBar.open('Please Enter a Zip Code', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.employee.state == '') {
      this._snackBar.open('Please Enter a State', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.employee.country == '') {
      this._snackBar.open('Please Enter a Country', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.employee.executiveCode == '') {
      this._snackBar.open('Please Choose an Executive Code', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.employee.emailId === this.employee.alternateemailId) {
      this._snackBar.open('Please Enter a Different Alternate E-Mail Id', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.primEmail.invalid && this.primEmail.touched) {
      this._snackBar.open('Invalid E-Mail Id', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else if(this.primEmail1.invalid && this.employee.alternateemailId != '')
    // {
    //     this._snackBar.open("Invalid Alternate E-Mail Id", "", {
    //       duration: 2000,
    //       panelClass: ['snackbar1'],
    //       verticalPosition: "top",
    //       horizontalPosition: "center"
    //     });
    // }
    else if (this.onlyInt3.invalid && this.onlyInt3.touched) {
      this._snackBar.open('Invalid Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.onlyInt2.invalid && this.onlyInt2.touched) {
      this._snackBar.open('Invalid Zipcode', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else if (this.employee.gstin == '') {
    //   this._snackBar.open("Please fill GST Number", "", {
    //     duration: 2000,
    //     panelClass: ['snackbar1'],
    //     verticalPosition: "top",
    //     horizontalPosition: "center"
    //   });
    // }

    // else if (this.intPlusFloat1.invalid && this.intPlusFloat1.touched) {
    //   this._snackBar.open("Invalid GST Number", "", {
    //     duration: 2000,
    //     panelClass: ['snackbar1'],
    //     verticalPosition: "top",
    //     horizontalPosition: "center"
    //   });
    // }

    // else if (this.intPlusFloat2.invalid && this.intPlusFloat2.touched) {
    //   this._snackBar.open("Invalid Customer Name", "", {
    //     duration: 2000,
    //     panelClass: ['snackbar1'],
    //     verticalPosition: "top",
    //     horizontalPosition: "center"
    //   });
    // }
    else if (this.employee.paymentTerms == '') {
      this._snackBar.open('Please Choose a Payment Term', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.employee.shipmentTerms == '') {
      this._snackBar.open('Please Choose a Shipment Term', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else {
      this.employee.isOk = true;
      this.save();

      this.toggleuserprofile();

      if (localStorage.getItem('token') === 'Administrator') {
        this.smallOpen(this.userProfilePrompt);
      }
      this.modalReference.close();
    }
  }

  useNo() {
    window.open('/home/customer', '_self');
  }

  checkRegexUpdate() {
    if (this.employee.customername == '') {
      this._snackBar.open('Please Enter Company Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else if (this.employee.radio === "Business" && this.employee.companyname == '') {
    //   this._snackBar.open("Please Enter Company Name", "", {
    //     duration: 2000,
    //     panelClass: ['snackbar1'],
    //     verticalPosition: "top",
    //     horizontalPosition: "center"
    //   });
    // }
    else if (this.employee.emailId == '') {
      this._snackBar.open('Please Enter an E-Mail Id', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.employee.phone == '') {
      this._snackBar.open('Please Enter Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.employee.street1 == '') {
      this._snackBar.open('Please Enter Street1', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.employee.street2 == '') {
      this._snackBar.open('Please Enter Street2', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.employee.city == '') {
      this._snackBar.open('Please Enter a City', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.employee.zipcode == '') {
      this._snackBar.open('Please Enter a Zip Code', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.employee.state == '') {
      this._snackBar.open('Please Enter a State', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.employee.country == '') {
      this._snackBar.open('Please Enter a Country', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.employee.executiveName == '') {
      this._snackBar.open('Please Enter an Executive Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.employee.emailId === this.employee.alternateemailId) {
      this._snackBar.open('Please Enter a Different Alternate E-Mail Id', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.primEmail.invalid && this.primEmail.touched) {
      this._snackBar.open('Invalid E-Mail Id', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else if(this.primEmail1.invalid && this.primEmail1.touched){
    //   this._snackBar.open("Invalid Alternate E-Mail ID", "", {
    //     duration: 2000,
    //     panelClass: ['snackbar1'],
    //     verticalPosition: "top",
    //     horizontalPosition: "center"
    //   });
    // }
    else if (this.onlyInt3.invalid && this.onlyInt3.touched) {
      this._snackBar.open('Invalid Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else if (this.employee.gstin == '') {
    //   this._snackBar.open("Please fill GST Number", "", {
    //     duration: 2000,
    //     panelClass: ['snackbar1'],
    //     verticalPosition: "top",
    //     horizontalPosition: "center"
    //   });
    // }
    else if (this.onlyInt2.invalid && this.onlyInt2.touched) {
      this._snackBar.open('Invalid Zipcode', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else if (this.intPlusFloat2.invalid && this.intPlusFloat2.touched) {
    //   this._snackBar.open("Invalid Customer Name", "", {
    //     duration: 2000,
    //     panelClass: ['snackbar1'],
    //     verticalPosition: "top",
    //     horizontalPosition: "center"
    //   });
    // }
    else {
      this.save1();
      this._snackBar.open('Customer Updated Successfully', '', {
        duration: 2000,
        panelClass: ['snackbar3'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });

      this.modalReference.close();
    }
  }

  verified() {
    alert('This Customer is Verified');
  }

  averified() {
    alert('Approved by Admin. Waiting for User Profile Creation');
  }
  wverified() {
    alert('Waiting for Admin Approval');
  }
  wcverified() {
    alert('Approved by Admin. Waiting for Customer Verification');
  }

  rverified() {
    alert('Rejected By Admin');
  }

  notverified() {
    alert('Customer is not verified');
  }

  requestAgain() {
    this.changeVerificationStatusToWAdmin();
  }

  requestByNotVerified(loginId) {
    //**. */
    this.http
      .get(`${Configuration.apiURL}api/users/email/${loginId}`)
      .toPromise()
      .then((data) => {
        if (data) {
          this.userService.deleteUser(data['id']).subscribe(
            (data) => {
              this.changeVerificationStatusToWAdmin();
            },
            (error) => console.log(error)
          );
        } else {
          this.changeVerificationStatusToWAdmin();
        }
      });
  }

  changeVerificationStatusToWAdmin() {
    this.employee.verificationStatus = 'WAdmin';

    this.EmployeeService.updateEmployeeNew(this.employee).subscribe(
      (data) => {
        this.snackBarService.showSuccessSnack(
          'Admin approval Request has been sent successfully'
        );
        this.user = new Userprofile();
        this.reloadData();
        this.modalReference.close();
      },
      (error) => {}
    );
  }

  sendEmail() {
    this.dataset.email = this.employee.emailId;
    this.dataset.customerName = this.employee.customername;
    this.dataset.executiveName = this.employee.executiveName;
    this.dataset.verificationLink = `${Configuration.domainURL}customerverification/A0492317AR87K6${this.employee.customernum}`;

    //Customer E-mail
    this.https
      .post<CustomerVerification>(
        `${Configuration.apiURL}ilabel/customerverification`,
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
          this.dataset.executiveName = '';
          this.dataset.verificationLink = '';
        },
        (error) => alert('Server Data Error :: ' + JSON.stringify(error.status))
      );
  }

  sendCustomerLoginDetailsEmail() {
    this.userset.email = this.employee.emailId;
    this.userset.customerName = this.employee.customername;
    this.userset.executiveName = this.employee.executiveName;
    this.userset.loginID = this.user.loginId;
    this.userset.password = this.user.password;

    //Customer E-mail
    this.https
      .post<CustomerUserProfileDetails>(
        `${Configuration.apiURL}ilabel/customerlogindetails`,
        this.userset
      )
      .subscribe(
        (res) => {
          this.userset = res;
          console.log(this.userset);
          this._snackBar.open('Email Sent successfully', '', {
            duration: 2000,
            panelClass: ['snackbar3'],
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });

          this.userset.customerName = '';
          this.userset.executiveName = '';
        },
        (error) => alert('Server Data Error :: ' + JSON.stringify(error.status))
      );
  }

  //Create
  newUser(): void {
    this.submitted = false;
    this.user = new Userprofile();
  }

  userSave() {
    //change status to WCustomer
    let verificationStatus: string = 'WCustomer';
    if (localStorage.getItem('token') === 'Administrator') {
      verificationStatus = 'Verified';
    }

    this.employeeReferenceId = this.employeeReferenceId
      ? this.employeeReferenceId
      : this.employee.id;

    this.http
      .put(
        `${Configuration.apiURL}api/v1/customerverification/${this.employeeReferenceId}`,
        {
          verificationStatus: verificationStatus,
        }
      )
      .toPromise()
      .then((data: any) => {
        // this.user = new Userprofile();
        // console.log(data);
        // this.reloadData();
        // console.log(data);

        //Now create the user
        this.userService.createUser(this.user).subscribe(
          (data) => {
            this._snackBar.open('User Profile Successfully Saved', '', {
              duration: 2000,
              panelClass: ['snackbar3'],
              verticalPosition: 'top',
              horizontalPosition: 'center',
            });
            this.modalReference1.close();

            //send the customer verification link + login details
            this.dataset2.customerName = this.employee.customername;
            this.dataset2.executiveName = this.employee.executiveName;
            this.dataset2.loginId = this.employee.emailId;
            this.dataset2.password = data['password'];
            this.dataset2.verificationLink = `${Configuration.domainURL}customerverification/A0492317AR87K6${this.employee.customernum}`;

            //Customer E-mail
            this.https
              .post<CustomerVerificationWithLoginDetails>(
                `${Configuration.apiURL}ilabel/customerverificationnew`,
                this.dataset2
              )
              .subscribe(
                (res) => {
                  this.dataset2 = res;
                  console.log(this.dataset2);
                  this._snackBar.open('Email Sent successfully', '', {
                    duration: 2000,
                    panelClass: ['snackbar3'],
                    verticalPosition: 'top',
                    horizontalPosition: 'center',
                  });

                  this.dataset2.customerName = '';
                  this.dataset2.executiveName = '';
                  this.dataset2.loginId = '';
                  this.dataset2.password = '';
                  this.dataset2.verificationLink = '';
                  this.reloadData();
                },
                (error) =>
                  alert('Server Data Error :: ' + JSON.stringify(error.status))
              );

            // this.sendEmail();

            //Send the login details on SH approval
            // this.sendCustomerLoginDetailsEmail();

            //Now just change the verification status to SHVerify**
            // this.changeVerificationStatusToSHVerify();
          },
          (error) => console.log(error)
        );
      });
  }

  changeVerificationStatusToSHVerify() {
    let verificationStatus = 'SHVerify';

    this.employeeReferenceId = this.employeeReferenceId
      ? this.employeeReferenceId
      : this.employee.id;

    this.http
      .put(
        `${Configuration.apiURL}api/v1/customerverification/${this.employeeReferenceId}`,
        {
          verificationStatus: verificationStatus,
        }
      )
      .toPromise()
      .then((data: any) => {
        this.user = new Userprofile();
        console.log(data);
        this.reloadData();
        console.log(data);
        this._snackBar.open('User Profile Successfully Saved', '', {
          duration: 2000,
          panelClass: ['snackbar3'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
        this.modalReference1.close();
      });
  }

  //Delete
  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe(
      (data) => {
        this.reloadData();
        this._snackBar.open('Customer Deleted Successfully', '', {
          duration: 2000,
          panelClass: ['snackbar3'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
        console.log(data);
      },
      (error) => console.log(error)
    );
  }

  onUserSubmit() {
    this.checkUserRegex();
  }

  checkUserRegex() {
    if (this.user.username == '') {
      this._snackBar.open('Please Enter an Username', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.user.loginId == '') {
      this._snackBar.open('Please Enter a Login ID', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.user.password == '' || this.user.password == undefined) {
      this._snackBar.open('Please Enter a Password', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.user.accessRights == '' ||
      this.user.accessRights == undefined
    ) {
      this._snackBar.open('Please Choose an Access Right', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.user.trimTypes == undefined) {
      this._snackBar.open('Please Choose a Trim Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.primEmail.invalid && this.primEmail.touched) {
      this._snackBar.open('Invalid Login ID', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.intPlusFloat.invalid && this.intPlusFloat.touched) {
      this._snackBar.open('Invalid Username', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else {
      this.userSave();
    }
  }

  useAdmin() {
    this.modalReference.close();
  }

  toggleSelected() {
    this.user.trimTypes = ['Print', 'Tag', 'Woven', 'Sticker'];
  }

  toggleCompany() {
    this.company = true;
    this.individual = false;
  }

  toggleIndividual() {
    this.company = false;
    this.individual = true;
  }

  toggleuserprofile() {
    this.userprofile = true;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open('Submitted Successfully!', '', {
      duration: 2000,
      panelClass: ['snackbar1'],
      verticalPosition: 'top',
    });
  }

  checkEmail = [];
  checkName = [];

  // checkExistingData() {
  //   this.EmployeeService.getEmployeesList().subscribe(data => {
  //     this.employee = data;

  //     for (let i = 0; i < 100; i++) {
  //       this.checkEmail[i] = this.employee[i].emailId
  //       this.checkName[i] = this.employee[i].customername
  //     }
  //   });
  // }

  customerEmail: string = 'false';

  //Create
  newEmployee(): void {
    this.submitted = false;
    this.employee = new Employee();
  }

  postcustref(customernum: number, customerreference: string) {
    this.http
      .post(`${Configuration.apiURL}api/master/customerreference`, {
        customernum,
        customerreference,
      })
      .toPromise()
      .then((data: any) => {
        // this.reloadData();
      });
  }

  sendVerificationMail(email: string) {
    //get the pwd
    this.userService.getUsersEmail(this.employee.emailId).subscribe(
      (data) => {
        //send the customer verification link + login details
        this.dataset2.customerName = this.employee.customername;
        this.dataset2.executiveName = this.employee.executiveName;
        this.dataset2.loginId = this.employee.emailId;
        this.dataset2.password = data['password'];
        this.dataset2.verificationLink = `${Configuration.domainURL}customerverification/A0492317AR87K6${this.employee.customernum}`;

        this.https
          .post<CustomerVerificationWithLoginDetails>(
            `${Configuration.apiURL}ilabel/customerverificationnew`,
            this.dataset2
          )
          .subscribe(
            (res) => {
              this.dataset2 = res;
              console.log(this.dataset2);
              this._snackBar.open('Email Sent successfully', '', {
                duration: 2000,
                panelClass: ['snackbar3'],
                verticalPosition: 'top',
                horizontalPosition: 'center',
              });

              this.dataset2.customerName = '';
              this.dataset2.executiveName = '';
              this.dataset2.loginId = '';
              this.dataset2.password = '';
              this.dataset2.verificationLink = '';
              this.reloadData();
            },
            (error) =>
              alert('Server Data Error :: ' + JSON.stringify(error.status))
          );
      },
      (error) => {
        alert('Error while resending verification email');
        console.log(error);
      }
    );
  }

  save() {
    //add new customer to customer master collection
    this.incrementReferenceNumber();

    //Totally 5 States for verification status
    //1. WAdmin - Waiting for Admin approval
    //2. RAdmin - Rejected by Admin - To request for approval again click request     approval in customer master
    //3. AAdmin - Approved by Admin - Only now Create User Profile Button is enabled
    //4. WCustomer - User profile created but customer yet to click the link
    //5. Verified - Customer has clicked the link

    if (localStorage.getItem('token') === 'Administrator') {
      //Set the verification status to AAdmin directly
      //Create User profile Button is enabled
      this.employee.verificationStatus = 'AAdmin';
    } else {
      this.employee.verificationStatus = 'WAdmin';
    }

    // this.employee.verificationStatus = 'Not Verified';
    this.postcustref(this.customernum, this.customerreference);
    this.employee.customernum = this.customernum;
    this.employee.customerreference = this.customerreference;

    this.EmployeeService.createEmployee(this.employee).subscribe(
      (data) => {
        this.employeeReferenceId = data['id'];

        //don't send verification email now - send it after user profile creation
        //after user creation
        // this.sendEmail();
        this._snackBar.open('Customer Saved Successfully', '', {
          duration: 2000,
          panelClass: ['snackbar3'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });

        // this.employee = new Employee();
        console.log(data);
        // this.reloadData();
        this.ngOnInit();
      },

      (error) => console.log(error)
    );
  }

  getExecutiveCode() {
    this.mexecutiveService
      .getByExecutiveEmail(localStorage.getItem('emailToken'))
      .subscribe((data) => {
        this.mexecutive = data;

        //set the corresponding territory list
        this.territoryService.getByExecutiveId(this.mexecutive.id).subscribe(
          (data) => {
            this.territories = data;
          },
          (err) => {
            console.log(err);
          }
        );

        this.executiveCode = data['code'];
        this.employee.executiveCode = this.executiveCode;

        this.getExecutiveList();
      });
  }

  getExecutiveList() {
    if (localStorage.getItem('token') === 'Sales Team') {
      this.EmployeeService.getExecutiveCode(this.executiveCode).subscribe(
        (data) => {
          this.employees = data;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  executiveCode: string;

  reloadData() {
    if (localStorage.getItem('token') === 'Administrator') {
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
    } else {
      this.getExecutiveList();
    }
    this.customerReferenceObservable =
      this.theCustomerService.getCustomerReferenceList();
    this.users = this.userService.getUsersList();
    this.mexecutives1 = this.mexecutiveService.getMexecutivesList();
  }

  resetForm() {
    this.employee = new Employee();
    this.user = new Userprofile();
    this.userprofile = false;

    if (localStorage.getItem('token') === 'Sales Team') {
      this.employee.executiveCode = this.executiveCode;
      this.checkEmployeeName();
    }
  }

  onTerritoryChange(implicit?: boolean, executiveId?: string) {
    this.mexecutiveService.getByTerritoryId(this.employee.territory).subscribe(
      (data) => {
        this.mexecutives = data;
        if (executiveId) {
          let index = this.mexecutives.findIndex(
            (obj) => String(obj.id) == executiveId
          );
          this.employee.executiveCode = this.mexecutives[index].code;
          this.employee.executiveName = this.mexecutives[index].name;
          console.log(this.employee.executiveCode, this.employee.executiveName);
        }
      },
      (error) => {
        alert('Error while fetching executives list based on territory');
        console.log(
          'Error while fetching executives list based on territory ' + error
        );
      }
    );
    if (!implicit) {
      this.employee.executiveCode = '';
    }
  }

  //Delete
  deleteEmployee(id: number, email: string) {
    let flag = confirm('Are you sure to delete?');

    if (flag) {
      this.userService.deleteUserByEmailId(email).subscribe(
        (data) => {
          if (data) {
            //delete customer from master
            this.EmployeeService.deleteEmployee(id).subscribe(
              (data) => {
                console.log(data);
                this._snackBar.open('Customer deleted Successfully', '', {
                  duration: 2000,
                  panelClass: ['snackbar3'],
                  verticalPosition: 'top',
                  horizontalPosition: 'center',
                });

                this.reloadData();
              },
              (error) => console.log(error)
            );
          } else {
            // this._snackBar.open('No user profile exists for the given id', '', {
            //   duration: 2000,
            //   panelClass: ['snackbar3'],
            //   verticalPosition: 'top',
            //   horizontalPosition: 'center',
            // });

            this.EmployeeService.deleteEmployee(id).subscribe(
              (data) => {
                console.log(data);
                this._snackBar.open('Customer deleted Successfully', '', {
                  duration: 2000,
                  panelClass: ['snackbar3'],
                  verticalPosition: 'top',
                  horizontalPosition: 'center',
                });
                this.reloadData();
              },
              (error) => console.log(error)
            );
          }
        },
        (error) => {
          console.log(error);
          alert('Error while deleting Customer');
        }
      );
    }
  }

  save1() {
    this.employee.isOk = true;
    this.EmployeeService.createEmployee(this.employee).subscribe(
      (data) => {
        this.employee = new Employee();
        this.reloadData();
        this.ngOnInit();
      },
      (error) => console.log(error)
    );
  }

  onSubmit() {
    this.checkRegex();
  }

  post() {
    this.checkRegexUpdate();
  }

  accessType;

  ngOnInit() {
    if (this.accessType === 'Administrator') {
      this.territoryService.getAllTerritories().subscribe(
        (data) => {
          this.territories = data;
        },
        (err) => {
          alert(
            'Error while fetching territories. Please contact the administrator'
          );
          console.log(err);
        }
      );
    } else if (this.accessType === 'Sales Team') {
      this.getExecutiveCode();
    }

    this.companyService.getAllCompanies().subscribe(
      (data) => {
        this.companies = data;
      },
      (err) => {
        this.snackBarService.showWarningSnack(
          'Error while fetching territory. Please contact the administrator'
        );
        console.log(err);
      }
    );

    this.user.accessRights = 'Customer';

    this.theCustomerService.getCustomerReferenceList().subscribe((data) => {
      this.customerReference = data;

      this.incrementReferenceNumber();
    });
    this.reloadData();
  }

  incrementReferenceNumber() {
    this.theCustomerService.getCustomerReferenceList().subscribe((data) => {
      this.customerReference = data;

      var parsedinfo = JSON.parse(JSON.stringify(data));

      this.customermax = Math.max.apply(
        Math,
        parsedinfo.map(function (o) {
          return o.customernum;
        })
      );

      if (this.customermax === -Infinity) {
        this.customermax = 1;
        this.customerReference = new customerReferenceTS();
      } else {
        this.customermax += 1;
        this.customerReference = new customerReferenceTS();
      }

      this.customernum = this.customermax;
      this.customerreference = 'CUST' + this.customernum;
    });
  }

  updateEmployee(id: number) {
    this.id = id;
    console.log(this.id);

    this.employee = new Employee();

    this.EmployeeService.getEmployee(this.id).subscribe(
      (data) => {
        this.employee = data;

        if (this.employee.radio === 'Individual') {
          this.showBusinessUpdate = false;
        } else if (this.employee.radio === 'Business') {
          this.showBusinessUpdate = true;
        }
      },
      (error) => console.log(error)
    );
  }

  customerNumberImport: number;

  customerReferenceImport: string;

  importData(fileInput: any) {
    //read file from input
    const gstRegex =
      '^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$';
    const emailRegex = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,8}$';
    this.fileReaded = fileInput.target.files[0];

    let reader: FileReader = new FileReader();
    reader.readAsText(this.fileReaded);
    let nestedLines: Employee[] = [];
    reader.onload = (e) => {
      let csv: any = reader.result;
      //let allTextLines = csv.split(/\r|\n|\r/);
      let allTextLines = csv.split(/\r\n|\n/);
      this.headers = allTextLines[0].split(',');
      console.log(csv);
      for (let i = 1; i < allTextLines.length - 1; i++) {
        // split content based on comma
        let data = allTextLines[i].split(',');
        let tarr: Employee = new Employee();

        //Increment Ref No.
        this.customerNumberImport = this.customernum + i;
        // this.customerNumberImport++;

        tarr.id = data[0];
        tarr.companyname = data[1];
        tarr.customername = data[2];
        tarr.executiveName = data[3];
        tarr.executiveCode = data[4];
        tarr.gstin = data[5];
        tarr.emailId = data[6];
        tarr.alternateemailId = data[7];
        tarr.phone = data[8];
        tarr.website = data[9];
        tarr.street1 = data[10];
        tarr.street2 = data[11];
        tarr.city = data[12];
        tarr.zipcode = data[13];
        tarr.state = data[14];
        tarr.country = data[15];
        tarr.paymentTerms = data[16];
        tarr.shipmentTerms = data[17];
        tarr.verificationStatus = data[18];
        tarr.customerreference = 'CUST' + this.customerNumberImport;
        this.employeeDataArray.push({ ...tarr });
      }
      //validation
      for (let i = 0; i < this.employeeDataArray.length; i++) {
        if (this.employeeDataArray[i].executiveName == '') {
          this.employeeDataArray[i].isOk = false;
          this.count++;
          this.counter.push(this.customerReference.toString());
        } else if (this.employeeDataArray[i].gstin.match(gstRegex) == null) {
          this.employeeDataArray[i].isOk = false;
          this.count++;
          this.counter.push(this.customerReference.toString());
        } else if (
          this.employeeDataArray[i].emailId.match(emailRegex) == null
        ) {
          this.employeeDataArray[i].isOk = false;
          this.count++;
          this.counter.push(this.customerReference.toString());
        } else if (this.employeeDataArray[i].phone == '') {
          this.employeeDataArray[i].isOk = false;
          this.count++;
          this.counter.push(this.customerReference.toString());
        } else if (this.employeeDataArray[i].street1 == '') {
          this.employeeDataArray[i].isOk = false;
          this.count++;
          this.counter.push(this.customerReference.toString());
        } else if (this.employeeDataArray[i].street2 == '') {
          this.employeeDataArray[i].isOk = false;
          this.count++;
          this.counter.push(this.customerReference.toString());
        } else if (this.employeeDataArray[i].city == '') {
          this.employeeDataArray[i].isOk = false;
          this.count++;
          this.counter.push(this.customerReference.toString());
        } else if (this.employeeDataArray[i].zipcode == '') {
          this.employeeDataArray[i].isOk = false;
          this.count++;
          this.counter.push(this.customerReference.toString());
        } else if (this.employeeDataArray[i].state == '') {
          this.employeeDataArray[i].isOk = false;
          this.count++;
          this.counter.push(this.customerReference.toString());
        } else if (this.employeeDataArray[i].country == '') {
          this.employeeDataArray[i].isOk = false;
          this.count++;
          this.counter.push(this.customerReference.toString());
        } else if (this.employeeDataArray[i].paymentTerms == '') {
          this.employeeDataArray[i].isOk = false;
          this.count++;
          this.counter.push(this.customerReference.toString());
        } else if (this.employeeDataArray[i].shipmentTerms == '') {
          this.employeeDataArray[i].isOk = false;
          this.count++;
          this.counter.push(this.customerReference.toString());
        }
      }
      this._snackBar.open(`The Imported Data has ${this.count} errors`, '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
      // alert(`The Imported Data has ${this.count} errors at ${this.counter}`);
      //Post call

      this.http
        .post(
          `${Configuration.apiURL}api/v1/employees/all`,
          this.employeeDataArray
        )
        .subscribe(
          (response) => console.log('Success', response),
          (error) => console.log('Error', error)
        );

      if (!localStorage.getItem('foo')) {
        localStorage.setItem('foo', 'no reload');
        location.reload();
      } else {
        localStorage.removeItem('foo');
      }
      console.log(this.employeeDataArray);
    };
  }

  // export to csv and download function
  exportfun() {
    this.http
      .get(`${Configuration.apiURL}api/v1/employees`)
      .subscribe((data: Employee[]) => {
        this.employeeDataArray = data;
        console.log(this.employeeDataArray);
        this.downloadFile(this.employeeDataArray);
      });
  }

  downloadFile(data) {
    let arrHeader = [
      'id',
      'companyname',
      'customername',
      'executiveName',
      'executiveCode',
      'gstin',
      'emailId',
      'alternateemailId',
      'phone',
      'website',
      'street1',
      'street2',
      'city',
      'zipcode',
      'state',
      'country',
      'paymentTerms',
      'shipmentTerms',
    ];
    let csvData = this.ConvertToCSV(data, arrHeader);
    console.log(csvData);
    let blob = new Blob(['\ufeff' + csvData], {
      type: 'text/csv;charset=utf-8;',
    });
    let dwldLink = document.createElement('a');
    let url = URL.createObjectURL(blob);
    let isSafariBrowser =
      navigator.userAgent.indexOf('Safari') != -1 &&
      navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {
      //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute('target', '_blank');
    }
    dwldLink.setAttribute('href', url);
    dwldLink.setAttribute('download', 'iLabelDBCustomer.csv');
    dwldLink.style.visibility = 'hidden';
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  ConvertToCSV(objArray, headerList) {
    console.log(objArray);
    console.log(headerList);
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = '';
    //let row: string;

    let newHeaders = [
      'id',
      'Company Name',
      'Customer Name',
      'Executive Name',
      'Executive Code',
      'GST In',
      'Email Id',
      'Alternate EmailId',
      'Phone',
      'Website',
      'Street 1',
      'Street 2',
      'City',
      'Zipcode',
      'State',
      'Country',
      'PaymentTerms',
      'ShipmentTerms',
    ];

    for (let index in newHeaders) {
      row += newHeaders[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';

    for (let i = 0; i < array.length; i++) {
      // let line = (i + 1) + '';
      let line = '';
      for (let index in headerList) {
        let head = headerList[index];

        // line += ',' + this.strRep(array[i][head]);
        line += this.strRep(array[i][head]) + ',';
      }
      line = line.slice(0, -1);
      str += line + '\r\n';
    }
    return str;
  }

  strRep(data) {
    if (typeof data == 'string') {
      let newData = data.replace(/,/g, ' ');
      return newData;
    } else if (typeof data == 'undefined') {
      return '-';
    } else if (typeof data == 'number') {
      return data.toString();
    } else {
      return data;
    }
  }

  initializeCreate() {
    this.employee = new Employee();
    this.updateFlag = false;
  }

  checkExistingEmail(forUpdate?: boolean, updateIndex?: number) {
    // if (
    //   this.users.some(
    //     (obj) => obj.loginId.toLowerCase() == this.user.loginId.toLowerCase()
    //   )
    // ) {
    //   return true;
    // } else {
    //   return false;
    // }

    if (!forUpdate) {
      /*validation while saving
        No duplicate email-Id should be there
        using Array.prototype.some() to avoid loops*/
      if (
        this.employees.some(
          (obj) =>
            obj.emailId.toLowerCase() == this.employee.emailId.toLowerCase()
        )
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      /**
       * validation while updating
       * The user should not use an already existing emailId
       * But, the user can use the existing emailId at that particular index
       * Ex: while we are trying to edit user having emailId k@n.com company, we can use k@n.com as emailId but not any other existing emailIds
       * using Array.prototype.filter()
       */
      if (
        this.employees.filter(
          (obj, i) =>
            obj.emailId.toLowerCase() == this.employee.emailId.toLowerCase() &&
            i != updateIndex
        ).length > 0
      ) {
        return true;
      } else {
        return false;
      }
    }
  }

  // checkExistingEmail() {
  //   this.EmployeeService.getCustomerEmail(this.employee.emailId).subscribe(
  //     (data: Employee) => {
  //       if (data != null && data != undefined) {
  //         if (data.emailId === this.employee.emailId) {
  //           this._snackBar.open('Email-Id already exists', '', {
  //             duration: 2000,
  //             panelClass: ['snackbar1'],
  //             verticalPosition: 'top',
  //             horizontalPosition: 'center',
  //           });
  //           this.customerEmail = 'true';
  //         }
  //       } else {
  //         this.customerEmail = 'false';
  //       }
  //     }
  //   );
  // }

  validateCustomerInput(forUpdate?: boolean, updateIndex?: number) {
    let flag = false;
    if (this.validator.isEmptyString(this.employee.customername)) {
      this.snackBarService.showWarningSnack('Please select the Company Name ');
    } else if (this.validator.isEmptyString(this.employee.territory)) {
      this.snackBarService.showWarningSnack('Please select the Territory');
    } else if (this.validator.isEmptyString(this.employee.executiveCode)) {
      this.snackBarService.showWarningSnack('Please select the Executive');
    } else if (this.validator.isEmptyString(this.employee.companyname)) {
      this.snackBarService.showWarningSnack('Please enter the Customer Name');
    } else if (this.validator.isEmptyString(this.employee.emailId)) {
      this.snackBarService.showWarningSnack('Please enter the Email Id');
    } else if (this.validator.isEmptyString(this.employee.phone)) {
      this.snackBarService.showWarningSnack('Please enter the Phone Number');
    } else if (this.validator.isEmptyString(this.employee.street1)) {
      this.snackBarService.showWarningSnack('Please enter the Street 1');
    } else if (this.validator.isEmptyString(this.employee.street2)) {
      this.snackBarService.showWarningSnack('Please enter the Street 2');
    } else if (this.validator.isEmptyString(this.employee.city)) {
      this.snackBarService.showWarningSnack('Please enter the City');
    } else if (this.validator.isEmptyString(this.employee.zipcode)) {
      this.snackBarService.showWarningSnack('Please enter the Zip Code');
    } else if (this.validator.isEmptyString(this.employee.state)) {
      this.snackBarService.showWarningSnack('Please enter the State');
    } else if (this.validator.isEmptyString(this.employee.country)) {
      this.snackBarService.showWarningSnack('Please enter the Country');
    } else if (this.validator.isEmptyString(this.employee.paymentTerms)) {
      this.snackBarService.showWarningSnack('Please select the Payment Terms');
    } else if (this.validator.isEmptyString(this.employee.shipmentTerms)) {
      this.snackBarService.showWarningSnack('Please select the Shipment Terms');
    } else if (!this.validator.isValidEmail(this.employee.emailId)) {
      this.snackBarService.showWarningSnack('Please enter a valid Email Id');
    } else if (this.checkExistingEmail(forUpdate, updateIndex)) {
      this.snackBarService.showWarningSnack(
        'Email Id already exists. Please try again with a different Email'
      );
    } else if (this.employee.phone.length >  11) {
      this.snackBarService.showWarningSnack(
        'Please enter a valid Phone Number'
      );
    } else if (this.employee.zipcode.length > 6) {
      this.snackBarService.showWarningSnack('Please enter a valid Zip Code');
    } else if (
      !this.validator.isEmptyString(this.employee.gstin) &&
      this.employee.gstin.length != 15
    ) {
      this.snackBarService.showWarningSnack('Please enter a valid GST Numer');
    } else {
      flag = true;
    }
    return flag;
  }

  onSave() {
    if (this.validateCustomerInput()) {
      //Totally 5 States for verification status
      //1. WAdmin - Waiting for Admin approval
      //2. RAdmin - Rejected by Admin - To request for approval again click request     approval in customer master
      //3. AAdmin - Approved by Admin - Only now Create User Profile Button is enabled
      //4. WCustomer - User profile created but customer yet to click the link
      //5. Verified - Customer has clicked the link

      if (localStorage.getItem('token') === 'Administrator') {
        //Set the verification status to AAdmin directly
        //Create User profile Button is enabled
        this.employee.verificationStatus = 'AAdmin';
      } else {
        this.employee.verificationStatus = 'WAdmin';
      }

      //find the incremented reference number
      this.theCustomerService.getCustomerReferenceList().subscribe(
        (data: customerReferenceTS[]) => {
          let customerReference: customerReferenceTS[] = data;

          // var parsedinfo = JSON.parse(JSON.stringify(data));

          let customermax = Math.max.apply(
            Math,
            customerReference.map(function (o) {
              return o.customernum;
            })
          );

          if (customermax === -Infinity) {
            customermax = 1;
          } else {
            customermax += 1;
          }

          this.employee.customernum = customermax;
          this.employee.customerreference = 'CUST' + customermax;

          //post the incremented reference number
          this.postcustref(
            this.employee.customernum,
            this.employee.customerreference
          );

          //create customer
          this.EmployeeService.createEmployee(this.employee).subscribe(
            (data: Employee) => {
              this.employee = data;
              this.snackBarService.showSuccessSnack(
                'Customer created successfully'
              );
              document.getElementById('close-createCustomer').click();
              this.reloadData();

              if (localStorage.getItem('token') === 'Administrator') {
                this.smallOpen(this.userProfilePrompt);
              }
            },
            (error) => {
              this.snackBarService.showWarningSnack(
                'Error while creating customer. Please contact the Administrator'
              );
              console.log(error);
            }
          );

          //increment customer ref http call ends
        },
        (err) => {
          this.snackBarService.showWarningSnack(
            'Error in customer creation phase. Please contact the Administrator'
          );
          console.log(err);

          //increment customer ref http call error ends
        }
      );

      //validation success block ends
    }

    //onSave() ends
  }

  initializeEdit(id) {
    let index = this.employees.findIndex((obj) => obj.id == id);
    this.employee = { ...this.employees[index] };
    console.log(this.employee);
    this.updateIndex = index;
    this.updateFlag = true;
    this.onTerritoryChange(true);
  }

  onUpdate() {
    if (this.validateCustomerInput(true, this.updateIndex)) {
      this.EmployeeService.updateEmployeeNew(this.employee).subscribe(
        (data) => {
          this.snackBarService.showSuccessSnack(
            'Customer updated successfully'
          );
          document.getElementById('close-createCustomer').click();
          this.reloadData();
        },
        (error) => {
          this.snackBarService.showWarningSnack(
            'Error while creating customer. Please contact the Administrator'
          );
        }
      );
    }
  }

  initializeUserProfile() {
    this.user = new Userprofile();
    this.user.username = this.employee.companyname;
    this.user.loginId = this.employee.emailId;
    this.user.accessRights = 'Customer';
  }

  onCompanyNameChange(val) {
    // let company: Company = this.companies.filter((obj) => obj.id == val)[0];
    // this.employee.customername = company.companyName;
    // this.employee.merchandiser = company.merchandiser;
  }

  validateUserInput(): boolean {
    let flag = false;
    if (this.validator.isEmptyString(this.user.username)) {
      this.snackBarService.showWarningSnack('Please fill in the User Name');
    } else if (this.validator.isEmptyString(this.user.loginId)) {
      this.snackBarService.showWarningSnack('Please fill in the Login Id');
    } else if (!this.validator.isValidEmail(this.user.loginId)) {
      this.snackBarService.showWarningSnack(
        'Please use a valid Email-Id for the Login-Id field'
      );
    } else if (this.validator.isEmptyString(this.user.password)) {
      this.snackBarService.showWarningSnack('Please fill in the Password');
    } else if (this.validator.isEmptyString(this.user.accessRights)) {
      this.snackBarService.showWarningSnack('Please select the Access Rights');
    } else if (this.user.trimTypes.length < 1) {
      this.snackBarService.showWarningSnack(
        'Please select atleast one Trim Type'
      );
    } else {
      //all the validations are successful
      flag = true;
    }
    return flag;
  }

  onCreateUser() {
    if (this.validateUserInput()) {
      this.userService.createUser(this.user).subscribe(
        (userData) => {
          this.snackBarService.showSuccessSnack('User created successfully');
          document.getElementById('close-userProfile').click();
          //change status to WCustomer
          this.employee.verificationStatus = 'WCustomer';
          if (localStorage.getItem('token') === 'Administrator') {
            this.employee.verificationStatus = 'Verified';
          }

          //update the verification status
          this.EmployeeService.updateEmployeeNew(this.employee).subscribe(
            (data) => {
              console.log('Verification status updated successfully');
              this.reloadData();
            },
            (err) => console.log(err)
          );

          //send the email containing customer verification link + login details
          this.dataset2.customerName =
            this.employee.customername + ' - ' + this.employee.companyname;
          this.dataset2.executiveName = this.employee.executiveName;
          this.dataset2.loginId = this.employee.emailId;
          this.dataset2.password = this.user.password;
          this.dataset2.verificationLink = `${Configuration.domainURL}customerverification/A0492317AR87K6${this.employee.customernum}`;

          //Customer E-mail
          this.https
            .post<CustomerVerificationWithLoginDetails>(
              `${Configuration.apiURL}ilabel/customerverificationnew`,
              this.dataset2
            )
            .subscribe(
              (res) => {
                this.snackBarService.showSuccessSnack(
                  'Email Sent successfully'
                );

                //resetting the mailing details object
                this.dataset2.customerName = '';
                this.dataset2.executiveName = '';
                this.dataset2.loginId = '';
                this.dataset2.password = '';
                this.dataset2.verificationLink = '';
              },
              (error) => {
                alert('Error while send verification email');
                console.log(error);
              }
            );
        },
        (err) => {
          this.snackBarService.showWarningSnack(
            'Error while creating user. Please contact the administrator'
          );
          console.log(err);
        }
      );
    }
  }

  createUserProfile(usercontent, verificationStatus) {
    if (verificationStatus == 'Verified') {
      this.userService
        .getUsersEmail(this.employee.emailId)
        .subscribe((data: Userprofile) => {
          if (data != null && data != undefined) {
            if (data.loginId === this.employee.emailId) {
              this.snackBarService.showWarningSnack('Login-Id already exists');
            }
          } else {
            this.modalReference.close();
            this.bigOpen(usercontent);
          }
        });
    } else if (verificationStatus == 'AAdmin') {
      this.modalReference.close();
      this.bigOpen(usercontent);
    } else if (verificationStatus == 'WAdmin') {
      this.snackBarService.showWarningSnack('Waiting for Admin Approval');
    } else if (verificationStatus == 'RAdmin') {
      this.snackBarService.showWarningSnack(
        'Approval rejected by Admin. Please place the approval request again'
      );
    } else if (verificationStatus == 'WCustomer') {
      this.userService
        .getUsersEmail(this.employee.emailId)
        .subscribe((data: Userprofile) => {
          if (data != null && data != undefined) {
            if (data.loginId === this.employee.emailId) {
              this.snackBarService.showWarningSnack('Login-Id already exists');
            }
          } else {
            this.modalReference.close();
            this.bigOpen(usercontent);
          }
        });
    }
  }
}

interface CustomerVerification {
  executiveName: string;
  customerName: string;
  email: string;
  verificationLink: string;
}

interface CustomerVerificationWithLoginDetails {
  customerName: string;
  executiveName: string;
  loginId: string;
  password: string;
  verificationLink: string;
}

interface CustomerUserProfileDetails {
  executiveName: string;
  customerName: string;
  loginID: string;
  password: string;
  email: string;
}
