import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee';
import { EmployeeService } from '../services/employee.service';
import { Router } from '@angular/router';
import { Configuration } from '../configuration';

@Component({
  selector: 'app-customer-verification',
  templateUrl: './customer-verification.component.html',
  styleUrls: ['./customer-verification.component.css'],
})
export class CustomerVerificationComponent implements OnInit {
  employees: Observable<Employee[]>;
  employee: Employee = new Employee();

  constructor(
    private employeeService: EmployeeService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  id: string;
  verificationStatus: string;
  customerDocumentID: string;

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    this.customerNumber = this.id.replace('A0492317AR87K6', '');

    this.getCustomerDocumentID();
  }

  changedCustomerNum: string;

  customerNumber: string;

  getCustomerDocumentID() {
    this.http
      .get(
        `${Configuration.apiURL}api/v1/employees/customernumber/${this.customerNumber}`,
        {}
      )
      .toPromise()
      .then((data: any) => {
        this.customerDocumentID = data.id;
        if (data['verificationStatus'] != 'Verified') {
          this.changeVerificationStatusToVerified();
        }

        //we ll change the status to Verified when admin approves .. not here
        // if (data['verificationStatus'] != 'Verified') {
        //   this.changeVerificationStatusToCVerified();
        // }
      });
  }

  changeVerificationStatusToVerified() {
    this.verificationStatus = 'Verified';

    this.http
      .put(
        `${Configuration.apiURL}api/v1/customerverification/${this.customerDocumentID}`,
        {
          verificationStatus: this.verificationStatus,
        }
      )
      .toPromise()
      .then((data: any) => {});
  }

  onLogin() {
    this.router.navigate(['/header/login']);
  }

  changeVerificationStatusToCVerified() {
    this.verificationStatus = 'CVerified';
    this.http
      .put(
        `${Configuration.apiURL}api/v1/customerverification/${this.customerDocumentID}`,
        {
          verificationStatus: this.verificationStatus,
        }
      )
      .toPromise()
      .then((data: any) => {});
  }
}
