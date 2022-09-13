import { Component, OnInit } from '@angular/core';
import { Userprofile } from '../models/userprofile';
import { LoginService } from '../services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../models/employee';
import { EmployeeService } from '../services/employee.service';
import { Validator } from '../utility-classes/validator';
import { SnackBarService } from '../services/snackBar.service';
import { CostingService } from '../v2/components/costingNew/services/costing.service';
import { CommonDetailsCosting } from '../v2/components/costingNew/model/common-details-costing';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  customers: Employee[];
  costingTrimType: string;
  costingId: string;

  loginId: string;
  password: string;

  validator: Validator;

  constructor(
    private customerService: EmployeeService,
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBarService: SnackBarService,
    private costingService: CostingService
  ) {
    //Check if costingApproval link is used to login
    //If yes, store the trimtype and costing id
    if (this.route.snapshot.params['id']) {
      let paramsArray = this.route.snapshot.params['id'].split('--');
      this.costingTrimType = paramsArray[0];
      this.costingId = paramsArray[1];
    }
  }

  ngOnInit(): void {
    this.validator = new Validator();
  }

  handleLogin() {
    if (this.validator.isEmptyString(this.loginId)) {
      this.snackBarService.showWarningSnack('Please Enter the LoginID!');
    } else if (this.validator.isEmptyString(this.password)) {
      this.snackBarService.showWarningSnack('Please Enter the Password!');
    } else {
      this.loginService
        .checkLoginDetails(this.loginId, this.password)
        .subscribe(
          (user: Userprofile) => {
            // if user exits, then proceed
            if (user) {
              this.initializeLocalStorageProps(user);
              this.userAccessControl(user);
            } else {
              this.snackBarService.showWarningSnack(
                'Invalid LoginID / Password'
              );
            }
          },
          (err) => {
            this.snackBarService.showWarningSnack('Invalid LoginID / Password');
            console.log(err);
          }
        );
    }
  }

  initializeLocalStorageProps(user: Userprofile) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('token', user.accessRights);
    localStorage.setItem('id', String(user.id));
    localStorage.setItem('userToken', user.username);
    localStorage.setItem('emailToken', user.loginId);
    // setItem doesn't accept arrays so joining it to a comma seperated string
    localStorage.setItem('trimToken', user.trimTypes.join());
    localStorage.setItem('nameToken', user.customerName);

    if (user.accessRights == 'Administrator' && user.superUser) {
      localStorage.setItem('superUser', 'true');
    } else {
      localStorage.setItem('superUser', 'false');
    }
  }

  userAccessControl(user: Userprofile) {
    if (user.accessRights == 'Customer') {
      // check the verification status of the customer
      //getCustomerEmail() is for retrieving customer details using their e-mail
      this.customerService.getCustomerEmail(user.loginId).subscribe(
        (customer: Employee) => {
          if (user.status == 'deactivated') {
            this.snackBarService.showWarningSnack(
              'Your user account has been deactivated. Please contact the administrator to activate the account'
            );
          } else if (customer.verificationStatus == 'Not Verified') {
            this.snackBarService.showWarningSnack(
              'Customer profile not verified. Please contact the administrator'
            );
          } else if (customer.verificationStatus === 'WCustomer') {
            this.snackBarService.showWarningSnack(
              'User profile waiting for Customer Verification'
            );
          } else {
            if (customer.verificationStatus == 'Verified') {
              if (
                !this.validator.isEmptyString(this.costingId) &&
                !this.validator.isEmptyString(this.costingTrimType)
              ) {
                //check whether the costing is mapped to the current customer
                this.costingService
                  .getCommonDetailsByTotalDetailsId(this.costingId)
                  .subscribe((data: CommonDetailsCosting) => {
                    if (data.customerId == String(customer.id)) {
                      //redirect to costing
                      this.redirectToCosting();
                    } else {
                      this.snackBarService.showWarningSnack(
                        'Customer details mismatch. Please contact the Administrator'
                      );
                    }
                  });
              } else {
                //redirect to dashboard
                this.redirectToDashboard();
              }
            }
          }
        },
        (err) => {
          this.snackBarService.showWarningSnack(
            'Error while retrieving customer details. Please try again'
          );
          console.log(err);
        }
      );
    } else if (
      ['Administrator', 'Sample Head', 'Sales Team', 'TManager'].includes(
        user.accessRights
      )
    ) {
      if (user.status == 'deactivated') {
        this.snackBarService.showWarningSnack(
          'Your user account has been deactivated. Please contact the administrator to activate the account'
        );
      } else {
        if (
          !this.validator.isEmptyString(this.costingId) &&
          !this.validator.isEmptyString(this.costingTrimType) &&
          user.superUser &&
          user.accessRights == 'Administrator'
        ) {
          console.log(this.costingId, this.costingTrimType);
          //redirect to costing
          this.redirectToCosting();
        } else {
          //redirect to dashboard
          this.redirectToDashboard();
        }
      }
    }
  }

  redirectToCosting() {
    switch (this.costingTrimType) {
      case 'Woven':
        this.router.navigate([
          '/home/wovenCosting',
          this.costingId,
          { previousPage: 'login' },
        ]);
        break;
      case 'Printed':
        this.router.navigate([
          '/home/printedCosting',
          this.costingId,
          { previousPage: 'login' },
        ]);
        break;
      case 'Tag':
        this.router.navigate([
          '/home/tagCosting',
          this.costingId,
          { previousPage: 'login' },
        ]);
        break;
      case 'Sticker-Flexo':
        this.router.navigate([
          '/home/stickerFlexoCosting',
          this.costingId,
          { previousPage: 'login' },
        ]);
        break;
      case 'Sticker-Offset':
        this.router.navigate([
          '/home/stickerOffsetCosting',
          this.costingId,
          { previousPage: 'login' },
        ]);
        break;
      default:
        this.snackBarService.showWarningSnack(
          'Malformed URL. Please Contact the Administrator'
        );
        console.warn(
          'Invalid Trim Type parsed from URL',
          this.costingId,
          this.costingTrimType
        );
    }
  }

  redirectToDashboard() {
    this.router.navigate(['/home/dashboard']);
  }
}
