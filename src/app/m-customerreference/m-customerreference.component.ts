import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { customerReferenceTS} from './../models/customerReference';
import { CustomerReferenceService } from '../services/customer-reference.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Employee } from '../models/employee';
import { EmployeeService } from './../services/employee.service';
import {Location} from '@angular/common';


@Component({
  selector: 'app-m-customerreference',
  templateUrl: './m-customerreference.component.html',
  styleUrls: ['./m-customerreference.component.css']
})
export class MCustomerreferenceComponent implements OnInit {

  createRoute()
  {
    this._location.back();
  }

  id: number;

  customerReferenceObservable: Observable<customerReferenceTS[]>;

  employees: Observable<Employee[]>;
  employee: Employee = new Employee();

  searchText;

  form: FormGroup;
  customerReference: customerReferenceTS = new customerReferenceTS();
  submitted = false;

  constructor(private http:HttpClient, private modalService: NgbModal, private theCustomerService: CustomerReferenceService,
    private router: Router, private route: ActivatedRoute,  private _snackBar: MatSnackBar, private EmployeeService: EmployeeService, private _location: Location) {}

  closeResult = '';

  openSnackBar(message: string, action: string) {
    this._snackBar.open("Submitted Successfully!", "", {
      duration: 2000,
      panelClass: ['snackbar1'],
      verticalPosition: "top"
    });
  }


  open(content) {
    this.modalService.open(content, { size: 'md', centered: true, ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  bring(updateModal) {
    this.modalService.open(updateModal, { size: 'md', centered: true, ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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


  //Create
  newUser(): void {
    this.submitted = false;
    this.customerReference = new customerReferenceTS();
  }

  save() {
    this.theCustomerService
    .createCustomerReference(this.customerReference).subscribe(data => {
      console.log(data)
      this.customerReference = new customerReferenceTS();
      this.reloadData();

    },
    error => console.log(error));
  }


  reloadData() {
    this.customerReferenceObservable = this.theCustomerService.getCustomerReferenceList();
    this.employees = this.EmployeeService.getEmployeesList();
  }

  resetForm() {
    this.customerReference = new customerReferenceTS();
  }

  //Delete
  deleteCustomerReference(id: number) {
    this.theCustomerService.deleteCustomerReference(id)
      .subscribe(
        data => {
          console.log(data);
          this.reloadData();
        },
        error => console.log(error));
  }

  onSubmit() {
    this.save();
  }

  ngOnInit(){
    this.reloadData();
  }

  updateCustomerReference(id: number){
    this.id = id;

    this.customerReference = new customerReferenceTS();

    this.theCustomerService.getCustomerReference(this.id)
      .subscribe(data => {
        console.log(data)
        this.customerReference = data;
      }, error => console.log(error));
  }
}
