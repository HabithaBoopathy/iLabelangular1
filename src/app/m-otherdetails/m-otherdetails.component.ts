import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MotherDetails} from './../models/motherdetails';
import { MotherdetailsService } from '../services/motherdetails.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Location} from '@angular/common';

@Component({
  selector: 'app-m-otherdetails',
  templateUrl: './m-otherdetails.component.html',
  styleUrls: ['./m-otherdetails.component.css']
})

export class MOtherdetailsComponent implements OnInit {

  createRoute()
  {
    this._location.back();
  }

  id: number;

  modalReference: any;

  motherdetailsObs: Observable<MotherDetails[]>;

  searchText;

  form: FormGroup;
  otherdetails: MotherDetails = new MotherDetails();
  submitted = false;

  constructor(private http:HttpClient, private modalService: NgbModal, private motherDetailService: MotherdetailsService,
    private router: Router, private route: ActivatedRoute,  private _snackBar: MatSnackBar, private _location: Location) {}

  closeResult = '';

  openSnackBar(message: string, action: string) {
    this._snackBar.open("Submitted Successfully!", "", {
      duration: 2000,
      panelClass: ['snackbar1'],
      verticalPosition: "top"
    });
  }


  open(content) {
    this.modalReference = this.modalService.open(content, {backdrop: 'static', size: 'md', centered: true, ariaLabelledBy: 'modal-basic-title'});this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  bring(updateModal) {
    this.modalReference = this.modalService.open(updateModal, {backdrop: 'static', size: 'md', centered: true, ariaLabelledBy: 'modal-basic-title'});this.modalReference.result.then((result) => {
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
    this.otherdetails = new MotherDetails();
  }

  save() {
    this.motherDetailService
    .createMotherDetails(this.otherdetails).subscribe(data => {
      console.log(data)
      this.otherdetails = new MotherDetails();
      this.reloadData();

    },
    error => console.log(error));
  }


  reloadData() {
    this.motherdetailsObs = this.motherDetailService.getMotherDetailsList();
  }

  resetForm() {
    this.otherdetails = new MotherDetails();
  }

  //Delete
  deleteMotherdetails(id: number) {
    this.motherDetailService.deleteMotherDetails(id)
      .subscribe(
        data => {
          console.log(data);
          this.reloadData();
        },
        error => console.log(error));
  }

  checkOtherdetails(){
    if(this.otherdetails.otherdetails == undefined && this.otherdetails.woven == undefined && this.otherdetails.tag == undefined && this.otherdetails.sticker == undefined && this.otherdetails.printed == undefined)
    {
      this._snackBar.open("Please fill  Valid Details", "", {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: "top",
        horizontalPosition: "center"
      });

    }
    else
    {
      this.save();
      this.modalReference.close();
    }
}

checkOtherDetailsUpdate(){
  if(this.otherdetails.otherdetails == undefined )
  {
    this._snackBar.open("Please Enter a Label Type", "", {
      duration: 2000,
      panelClass: ['snackbar1'],
      verticalPosition: "top",
      horizontalPosition: "center"
    });
  }

else
  {
    this.save();
    this._snackBar.open("Updated Successfully", "", {
      duration: 2000,
      panelClass: ['snackbar3'],
      verticalPosition: "top",
      horizontalPosition: "center"
    });
    this.modalReference.close();
  }

}


  tempColorList = [];
  tempColorList2 = [];
  currentOtherDetails: string;

  getOtherDetails()
  {
    this.currentOtherDetails = this.otherdetails.name;
  }


  public doesMasterExist:boolean = false;


  ngOnInit(){
    this.reloadData();
  }

  updateMotherDetails(id: number){
    this.id = id;

    this.otherdetails = new MotherDetails();

    this.motherDetailService.getMotherDetails(this.id)
      .subscribe(data => {
        console.log(data)
        this.otherdetails = data;
      }, error => console.log(error));
  }
}

