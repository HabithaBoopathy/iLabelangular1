import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Employee } from './../models/employee';
import { Observable } from 'rxjs';
import { EmployeeService } from '../services/employee.service';
import { HttpClient } from '@angular/common/http';
import { SnackBarService } from '../services/snackBar.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../services/user.service';
import { Configuration } from '../configuration';

@Component({
  selector: 'app-user-approval',
  templateUrl: './user-approval.component.html',
  styleUrls: ['./user-approval.component.css'],
})
export class UserApprovalComponent implements OnInit {
  public searchText;
  memployees: Observable<Employee[]>;
  userset: CustomerUserProfileDetails = {
    executiveName: '',
    customerName: '',
    email: '',
    loginID: '',
    password: '',
  };

  constructor(
    private _location: Location,
    private memployeeService: EmployeeService,
    private http: HttpClient,
    private snackBarService: SnackBarService,
    private modalService: NgbModal,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.memployees = this.memployeeService.getByVerificationStatus('WAdmin');
  }

  reloadData() {
    this.memployees = this.memployeeService.getByVerificationStatus('WAdmin');
  }

  createRoute() {
    this._location.back();
  }

  onAccept(user) {
    this.openLoadingModal();
    // change the verification status and send mail
    this.changeVerificationStatusToAAdmin(user);
  }

  changeVerificationStatusToAAdmin(user) {
    let url = `${Configuration.apiURL}api/v1/customerverification/${user['id']}`;

    this.http
      .put(url, {
        verificationStatus: 'AAdmin',
      })
      .toPromise()
      .then(
        (data: any) => {
          // this.sendCustomerLoginDetailsEmail(user);
          this.closeLoadingModalTemplate();
          this.snackBarService.showSuccessSnack('User Approved Successfully');
          console.log(data);
          this.reloadData();
        },
        (err) => {
          this.closeLoadingModalTemplate();
        }
      );
  }

  sendCustomerLoginDetailsEmail(user) {
    this.userset.email = user['emailId'];
    this.userset.customerName = user['customername'];
    this.userset.executiveName = user['executiveName'];

    this.http
      .get(`${Configuration.apiURL}api/users/email/${user['emailId']}`)
      .toPromise()
      .then(
        (data) => {
          this.userset.loginID = data['loginId'];
          this.userset.password = data['password'];

          //Customer E-mail
          this.http
            .post<CustomerUserProfileDetails>(
              `${Configuration.apiURL}ilabel/customerlogindetails`,
              this.userset
            )
            .subscribe(
              (res) => {
                this.userset = res;
                console.log(this.userset);
                this.closeLoadingModalTemplate();
                this.snackBarService.showSuccessSnack(
                  'User Approved & Email Sent Successfully'
                );

                this.userset.customerName = '';
                this.userset.executiveName = '';
                this.reloadData();
              },
              (error) => {
                this.closeLoadingModalTemplate();
                alert('Server Data Error :: ' + JSON.stringify(error.status));
              }
            );
        },
        (err) => {
          this.closeLoadingModalTemplate();
        }
      );
  }

  onReject(id, loginId) {
    this.http
      .put(`${Configuration.apiURL}api/v1/customerverification/${id}`, {
        verificationStatus: 'RAdmin',
      })
      .toPromise()
      .then(
        (data: any) => {
          this.snackBarService.showSuccessSnack(
            'User profile rejected successfully'
          );
          this.reloadData();
        },
        (err) => {
          console.log(err);
        }
      );
  }

  //properties in order
  @ViewChild('loadingModalTemplate') loadingModalTemplate: TemplateRef<any>;
  progressValue: number = 0;

  closeLoadingModalTemplate() {
    document.getElementById('closeLoadingModal').click();
    console.log('loading modal closed');
    this.progressValue = 0;
  }
  closeResult = '';

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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}

interface CustomerUserProfileDetails {
  executiveName: string;
  customerName: string;
  loginID: string;
  password: string;
  email: string;
}
