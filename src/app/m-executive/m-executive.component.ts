import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Mexecutive } from './../models/mexecutive';
import { MexecutiveService } from './../services/mexecutive.service';
import { Location } from '@angular/common';
import { Userprofile } from '../models/userprofile';
import { UserService } from '../services/user.service';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-m-executive',
  templateUrl: './m-executive.component.html',
  styleUrls: ['./m-executive.component.css'],
})
export class MExecutiveComponent implements OnInit {
  selected: 'Sales Team';

  @ViewChild('test') test;

  testEmail: string;

  createRoute() {
    this._location.back();
  }

  id: number;

  modalReference: any;

  mexecutives: Observable<Mexecutive[]>;

  users: Observable<Userprofile[]>;
  user: Userprofile = new Userprofile();

  searchText;

  mexecutive: Mexecutive = new Mexecutive();
  form: FormGroup;

  submitted = false;

  public showCustomer: boolean = false;

  modalReference1: any;

  bigOpen(usercontent) {
    this.modalReference1 = this.modalService.open(usercontent, {
      backdrop: 'static',
      size: 'sm',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    });
    this.modalReference1.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  tempExecutiveName: string;
  tempExecutiveEmail: string;

  smallOpen(test) {
    this.tempExecutiveName = this.mexecutive.name;
    this.tempExecutiveEmail = this.mexecutive.emailId;

    this.modalService.open(test, {
      backdrop: 'static',
      size: 'sm',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    });
  }

  testFunction() {
    this.user.username = this.tempExecutiveName;
    this.user.loginId = this.tempExecutiveEmail;
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

  checkRegex() {
    if (this.mexecutive.name == undefined) {
      this._snackBar.open('Please Enter an Executive Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.mexecutive.emailId == undefined) {
      this._snackBar.open('Please Enter an E-Mail ID', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.mexecutive.code == undefined) {
      this._snackBar.open('Please Enter an Executive Code', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.mexecutive.phoneNumber == undefined) {
      this._snackBar.open('Please Enter an Executive Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.onlyInt3.invalid && this.onlyInt3.touched) {
      this._snackBar.open('Please Enter a Valid Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.intPlusFloat.invalid && this.intPlusFloat.touched) {
      this._snackBar.open('Please Enter a Valid Executive Name', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.primEmail.invalid && this.primEmail.touched) {
      this._snackBar.open('Invalid E-Mail ID', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else {
      this.save();
      this.smallOpen(this.test);
      this.modalReference.close();
    }
  }

  useAdmin() {
    this.modalReference.close();
    this.router.navigate(['home/admin']);
  }

  useNo() {
    window.open('/home/executive', '_self');
  }

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private modalService: NgbModal,
    private mexecutiveService: MexecutiveService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private _location: Location
  ) {}

  closeResult = '';

  openSnackBar(message: string, action: string) {
    this._snackBar.open('Submitted Successfully!', '', {
      duration: 2000,
      panelClass: ['snackbar1'],
      verticalPosition: 'top',
    });
  }

  open(content) {
    this.modalReference = this.modalService.open(content, {
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

  bring(updateModal) {
    this.modalReference = this.modalService.open(updateModal, {
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

  untoggleCustomer() {
    this.showCustomer = false;
  }

  toggleSelected() {
    this.user.trimTypes = ['Print', 'Tag', 'Woven', 'Sticker'];
  }

  toggleCustomer() {
    this.showCustomer = true;
  }

  toggleSampleHead() {
    this.user.trimTypes = [''];
  }

  //Create
  newUser(): void {
    this.submitted = false;
    this.mexecutive = new Mexecutive();
  }
  save() {
    this.mexecutiveService.createMexecutive(this.mexecutive).subscribe(
      (data) => {
        console.log(data);
        this.mexecutive = new Mexecutive();
        this.reloadData();
      },
      (error) => console.log(error)
    );
  }

  reloadData() {
    this.mexecutives = this.mexecutiveService.getMexecutivesList();
    this.users = this.userService.getUsersList();
  }

  resetForm() {
    this.mexecutive = new Mexecutive();
  }

  //Delete
  deleteMexecutive(id: number) {
    let flag = confirm('Are you sure to delete?');

    if (flag) {
      this.mexecutiveService.deleteMexecutive(id).subscribe(
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

  checkExecutiveUpdate() {
    if (
      this.mexecutive.name == undefined ||
      this.mexecutive.name == '' ||
      this.mexecutive.name == null
    ) {
      this._snackBar.open('Please Enter a Username', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.mexecutive.emailId == undefined) {
      this._snackBar.open('Please Enter an E-Mail ID', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.mexecutive.code == undefined ||
      this.mexecutive.code == '' ||
      this.mexecutive.code == null
    ) {
      this._snackBar.open('Please Enter a Code', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.mexecutive.phoneNumber == undefined ||
      this.mexecutive.phoneNumber == '' ||
      this.mexecutive.phoneNumber == null
    ) {
      this._snackBar.open('Please Enter a Phone Number', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.primEmail.invalid && this.primEmail.touched) {
      this._snackBar.open('Invalid E-Mail ID', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else {
      this.save();
      this._snackBar.open('Updated Successfully', '', {
        duration: 2000,
        panelClass: ['snackbar3'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
      this.modalReference.close();
    }
  }

  onUserSubmit() {
    this.checkUserRegex();
  }

  checkUserRegex() {
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
      this._snackBar.open('User Profile Successfully Saved', '', {
        duration: 2000,
        panelClass: ['snackbar3'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
      this.modalReference1.close();
    }
  }

  userSave() {
    this.userService.createUser(this.user).subscribe(
      (data) => {
        this.user = new Userprofile();
        this.reloadData();
        console.log(data);
      },
      (error) => console.log(error)
    );
  }

  ngOnInit() {
    this.user.accessRights = 'Sales Team';

    this.reloadData();
  }

  updateMexecutive(id: number) {
    this.id = id;

    this.mexecutive = new Mexecutive();

    this.mexecutiveService.getMexecutive(this.id).subscribe(
      (data) => {
        console.log(data);
        this.mexecutive = data;
      },
      (error) => console.log(error)
    );
  }
}
