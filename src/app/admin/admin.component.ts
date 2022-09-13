import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserService } from './../services/user.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Userprofile } from './../models/userprofile';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ModalDismissReasons,
  NgbModal,
  NgbRadioGroup,
} from '@ng-bootstrap/ng-bootstrap';
import { ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { Employee } from './../models/employee';
import { EmployeeService } from './../services/employee.service';
import { map } from 'rxjs/operators';
import { SnackBarService } from './../services/snackBar.service';
import { Validator } from '../utility-classes/validator';
import { TerritoryService } from '../services/territory.service';
import { Territory } from '../models/territory';
import { NgxPaginationModule } from 'ngx-pagination';
import { Configuration } from '../configuration';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  createRoute() {
    this._location.back();
  }

  p: number = 1;

  id: number;

  modalReference: any;

  public showCustomer: boolean = false;

  customerName: String;

  users: Userprofile[];

  employees: Observable<Employee[]>;
  employee: Employee = new Employee();

  searchText;

  form: FormGroup;
  user: Userprofile = new Userprofile();
  submitted = false;

  employee_lt: Observable<Employee[]>;

  //update mode toggler
  updateFlag = false;
  updateIndex: number;

  //territory
  territories: Territory[];
  territoryFlag = false;

  showPwd: boolean = false;
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

  checkRegex() {
    if (this.user.username == undefined) {
      this._snackBar.open('Please Enter an Username', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.user.loginId == undefined) {
      this._snackBar.open('Please Enter a Login ID', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.user.password == undefined) {
      this._snackBar.open('Please Enter a Password', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.user.accessRights == undefined) {
      this._snackBar.open('Please Choose an Access Right', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }

    // else if(this.user.trimTypes == undefined || this.user.trimTypes == null || this.user.trimTypes == ['']   ){
    //   this._snackBar.open("Please Choose a Trim Type", "", {
    //     duration: 2000,
    //     panelClass: ['snackbar1'],
    //     verticalPosition: "top",
    //     horizontalPosition: "center"
    //   });
    // }

    // else if(this.user.trimTypes !== ['Print'] || this.user.trimTypes !== ['Tag'] || this.user.trimTypes !== ['Sticker'] || this.user.trimTypes !== ['Woven']){
    //   this._snackBar.open("Please Choose a Trim Type", "", {
    //     duration: 2000,
    //     panelClass: ['snackbar1'],
    //     verticalPosition: "top",
    //     horizontalPosition: "center"
    //   });
    // }
    else if (this.emailExists === true) {
      this._snackBar.open('E-Mail Id already exists', '', {
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
      this.oldSave();
      this._snackBar.open('User Profile Successfully Saved', '', {
        duration: 2000,
        panelClass: ['snackbar3'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
      this.modalReference.close();
    }
  }

  check() {}

  checkUpdate() {
    if (this.user.username == undefined) {
      this._snackBar.open('Please Enter an Username', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.user.loginId == undefined) {
      this._snackBar.open('Please Enter a Login ID', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.user.password == undefined) {
      this._snackBar.open('Please Enter a Password', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.user.accessRights == undefined) {
      this._snackBar.open('Please Choose an Access Right', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }
    // else if(this.user.trimTypes == undefined || this.user.trimTypes == null || this.user.trimTypes == ['']   ){
    //   this._snackBar.open("Please Choose a Trim Type", "", {
    //     duration: 2000,
    //     panelClass: ['snackbar1'],
    //     verticalPosition: "top",
    //     horizontalPosition: "center"
    //   });
    // }
    else if (this.user.loginId != undefined && this.emailExists === true) {
      this._snackBar.open('E-Mail Id already exists', '', {
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
      this.save();
      this._snackBar.open('User Profile Successfully Saved', '', {
        duration: 2000,
        panelClass: ['snackbar3'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
      this.modalReference.close();
    }
  }

  validator: Validator;
  userToken: string;

  constructor(
    private https: HttpClient,
    private http: HttpClient,
    private modalService: NgbModal,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private _location: Location,
    private EmployeeService: EmployeeService,
    private snackBarService: SnackBarService,
    private territoryService: TerritoryService
  ) {
    this.validator = new Validator();
    this.userToken = localStorage.getItem('userToken');
  }

  closeResult = '';

  openSnackBar(message: string, action: string) {
    this._snackBar.open('Submitted Successfully!', '', {
      duration: 2000,
      panelClass: ['snackbar1'],
      verticalPosition: 'top',
    });
  }

  toggleCustomer() {
    this.showCustomer = true;
  }

  untoggleCustomer() {
    this.showCustomer = false;
  }

  open(modalRef) {
    this.modalReference = this.modalService.open(modalRef, {
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

  toggleSelected() {
    this.user.trimTypes = ['Print', 'Tag', 'Woven', 'Sticker'];
  }

  toggleSampleHead() {
    this.user.trimTypes = undefined;
  }

  bring(updateModal) {
    this.modalReference = this.modalService.open(updateModal, {
      backdrop: 'static',
      size: 'sm',
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

  employeeChgFn(trvl: String) {
    this.employee_lt = this.employees.pipe(
      map((res: Employee[]) => {
        return res.filter((employee) => employee.customername == trvl);
      })
    );
  }

  tempCustomerName: String;

  getCustomerName() {
    this.tempCustomerName = this.user.customerName;
  }

  public emailExists: boolean = false;

  emailCheck() {
    this.userService
      .getUsersEmail(this.user.loginId)
      .subscribe((data: Userprofile) => {
        if (data != null && data != undefined) {
          if (data.loginId === this.user.loginId) {
            this._snackBar.open('Login-Id already exists', '', {
              duration: 2000,
              panelClass: ['snackbar1'],
              verticalPosition: 'top',
              horizontalPosition: 'center',
            });
            this.emailExists = true;
          }
        } else {
          this.emailExists = false;
        }
      });
  }

  //Create
  newUser(): void {
    this.submitted = false;
    this.user = new Userprofile();
  }

  save() {
    this.userService.createUser(this.user).subscribe(
      (data) => {
        console.log(data);
        this.user = new Userprofile();
        this.reloadData();
      },
      (error) => console.log(error)
    );

    // setTimeout(location.reload.bind(location), 1000);
  }

  userset: CustomerUserProfileDetails = {
    name: '',
    customerType: '',
    email: '',
    loginID: '',
    password: '',
  };

  sendCustomerLoginDetailsEmail() {
    this.userset.name = this.user.username;
    this.userset.email = this.user.loginId;
    this.userset.loginID = this.user.loginId;
    this.userset.password = this.user.password;

    //Customer E-mail
    this.https
      .post<CustomerUserProfileDetails>(
        `${Configuration.apiURL}ilabel/sendlogindetails`,
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

          this.userset.name = '';
          this.userset.customerType = '';
          this.userset.loginID = '';
          this.userset.password = '';

          this.router.navigate(['/home/admin']);
        },
        (error) => alert('Server Data Error :: ' + JSON.stringify(error.status))
      );
  }

  oldSave() {
    this.sendCustomerLoginDetailsEmail();

    this.http
      .post(`${Configuration.apiURL}api/users`, {
        username: this.user.username,
        loginId: this.user.loginId,
        password: this.user.password,
        accessRights: this.user.accessRights,
        trimTypes: this.user.trimTypes,
      })
      .toPromise()
      .then((data: any) => {
        this.reloadData();
      });
  }

  reloadData() {
    this.userService.getUsersList().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        this.snackBarService.showWarningSnack(
          'Error while fetching users list'
        );
        console.log(error);
      }
    );
    this.territoryService.getAllTerritories().subscribe(
      (data) => {
        this.territories = data;
      },
      (err) => console.log(err)
    );
    this.employees = this.EmployeeService.getEmployeesList();
    this.territoryFlag = false;
  }

  initializeCreate() {
    this.user = new Userprofile();
    this.updateFlag = false;
    this.showPwd = false;
  }

  //Delete
  deleteUser(id: number) {
    let flag = confirm('Are you sure to delete?');

    if (flag) {
      this.userService.deleteUser(id).subscribe(
        (data) => {
          console.log(data);
          this.reloadData();
        },
        (error) => console.log(error)
      );
    }
  }

  onSubmit() {
    this.checkRegex();
  }

  ngOnInit() {
    this.reloadData();
  }

  updateUser(id: number) {
    this.id = id;

    this.user = new Userprofile();

    this.userService.getUser(this.id).subscribe(
      (data) => {
        console.log(data);
        this.user = data;
      },
      (error) => console.log(error)
    );
  }

  deactivateUser(id: number) {
    let flag = confirm('Are you sure to deactivate?');
    if (flag) {
      this.userService.deactivateUser(id).subscribe(
        (data) => {
          if (data) {
            this.snackBarService.showSuccessSnack(
              'User Deactivated Successfully'
            );
            this.reloadData();
          } else {
            this.snackBarService.showWarningSnack(
              'User Deactivation Failed. Please Contact the Administrator'
            );
            console.log(data);
          }
        },
        (err) => {
          this.snackBarService.showWarningSnack(
            'User Deactivation Failed. Please Contact the Administrator'
          );
          console.log(err);
        }
      );
    }
  }

  activateUser(id: number) {
    let flag = confirm('Are you sure to activate this user?');
    if (flag) {
      this.userService.activateUser(id).subscribe(
        (data) => {
          if (data) {
            this.snackBarService.showSuccessSnack(
              'User activated Successfully'
            );
            this.reloadData();
          } else {
            this.snackBarService.showWarningSnack(
              'User activation Failed. Please Contact the Administrator'
            );
            console.log(data);
          }
        },
        (err) => {
          this.snackBarService.showWarningSnack(
            'User activation Failed. Please Contact the Administrator'
          );
          console.log(err);
        }
      );
    }
  }

  onAccessRightsInput(accessRights) {
    //if input is admin then select all the trimtypes and disable it
    if (accessRights == 'Administrator') {
      this.user.trimTypes = ['Print', 'Tag', 'Woven', 'Sticker'];
      this.user.territoryId = [];
    } else if (accessRights == 'TManager') {
      this.user.trimTypes = ['Print', 'Tag', 'Woven', 'Sticker'];
    } else {
      this.user.trimTypes = [];
      this.user.territoryId = [];
    }
  }

  checkForExistingLoginId(forUpdate?: boolean, updateIndex?: number) {
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
        No duplicate login-Id should be there
        using Array.prototype.some() to avoid loops*/
      if (
        this.users.some(
          (obj) => obj.loginId.toLowerCase() == this.user.loginId.toLowerCase()
        )
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      /**
       * validation while updating
       * The user should not use an already existing loginId
       * But, the user can use the existing loginId at that particular index
       * Ex: while we are trying to edit user having loginId k@n.com company, we can use k@n.com as loginId but not any other existing loginIds
       * using Array.prototype.filter()
       */
      if (
        this.users.filter(
          (obj, i) =>
            obj.loginId.toLowerCase() == this.user.loginId.toLowerCase() &&
            i != updateIndex
        ).length > 0
      ) {
        return true;
      } else {
        return false;
      }
    }
  }

  validateUserInput(forUpdate?: boolean, updateIndex?: number): boolean {
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
    } else if (this.user.password.includes('#')) {
      this.snackBarService.showWarningSnack(
        "Don't use # character in the Password. Please remove it and try again"
      );
    } else if (this.validator.isEmptyString(this.user.accessRights)) {
      this.snackBarService.showWarningSnack('Please select the Access Rights');
    } else if (
      this.user.accessRights == 'TManager' &&
      this.user.territoryId.length < 1
    ) {
      this.snackBarService.showWarningSnack(
        'Please select atleast one territory'
      );
    } else if (this.user.trimTypes.length < 1) {
      this.snackBarService.showWarningSnack(
        'Please select atleast one Trim Type'
      );
    } else if (this.checkForExistingLoginId(forUpdate, updateIndex)) {
      this.snackBarService.showWarningSnack(
        'Login Id already exists. Please try again with a different Email ID'
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
        (data) => {
          this.snackBarService.showSuccessSnack('User created successfully');
          document.getElementById('close-userProfile').click();
          this.reloadData();
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

  initializeEdit(id) {
    let index = this.users.findIndex((obj) => obj.id == id);
    this.user = { ...this.users[index] };
    this.updateFlag = true;
    this.updateIndex = index;
    this.showPwd = false;
  }

  onUpdateUser() {
    if (this.validateUserInput(true, this.updateIndex)) {
      this.userService.createUser(this.user).subscribe(
        (data) => {
          this.snackBarService.showSuccessSnack('User updated successfully');
          document.getElementById('close-userProfile').click();
          this.reloadData();
        },
        (err) => {
          this.snackBarService.showWarningSnack(
            'Error while updating user. Please contact the administrator'
          );
          console.log(err);
        }
      );
    }
  }
}

interface CustomerUserProfileDetails {
  name: string;
  customerType: string;
  loginID: string;
  password: string;
  email: string;
}
