import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { productLocationTS } from './../models/productLocation';
import { ProductLocationService } from '../services/product-location.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Location} from '@angular/common';

@Component({
  selector: 'app-m-location',
  templateUrl: './m-location.component.html',
  styleUrls: ['./m-location.component.css']
})
export class MLocationComponent implements OnInit {

  createRoute()
  {
    this._location.back();
  }

  id: number;

  modalReference: any;

  productLocationObservable: Observable<productLocationTS[]>;

  searchText;

  form: FormGroup;
  productLocation: productLocationTS = new productLocationTS();
  submitted = false;

  constructor(private http:HttpClient, private modalService: NgbModal, private theProductService: ProductLocationService,
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
    this.productLocation = new productLocationTS();
  }

  save() {
    this.theProductService
    .createProductLocation(this.productLocation).subscribe(data => {
      console.log(data)
      this.productLocation = new productLocationTS();
      this.reloadData();
    },
    error => console.log(error));
    this.modalReference.close();
  }


  reloadData() {
    this.productLocationObservable = this.theProductService.getProductLocationList();
  }

  resetForm() {
    this.productLocation = new productLocationTS();
  }

  //Delete
  deleteProductLocation(id: number) {
    this.theProductService.deleteProductLocation(id)
      .subscribe(
        data => {
          console.log(data);
          this.reloadData();
        },
        error => console.log(error));
  }


  locationName : string = "false";


  getCurrentLocation(){
    this.theProductService.getByLocationName(this.productLocation.location).subscribe((data : productLocationTS) => {

      if (data != null && data != undefined) {

        if (data.location === this.productLocation.location) {
          this._snackBar.open("Location already exists", "", {
            duration: 2000,
            panelClass: ['snackbar1'],
            verticalPosition: "top",
            horizontalPosition: "center"
          });
          this.locationName = "true";
        }
      }
      else {
        this.locationName = "false";
      }
      });
  }


  checkRegex(){
    if(this.productLocation.location == undefined || this.productLocation.location == '' || this.productLocation.location == null)
    {
      this._snackBar.open("Please fill  Valid Details", "", {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: "top",
        horizontalPosition: "center"
      });

    }

    else if(this.productLocation.printed == undefined && this.productLocation.tag == undefined && this.productLocation.sticker == undefined && this.productLocation.woven == undefined)
    {
      this._snackBar.open("Please Choose a Trim Type", "", {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: "top",
        horizontalPosition: "center"
      });
    }

    else if(this.locationName === "true"){
      this._snackBar.open("Location Already Exists", "", {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: "top",
        horizontalPosition: "center"
      });
    }

    else
    {
      this.save();
    }
  }

  tempColorList = [];
  tempColorList2 = [];
  currentLocation: string;

  currentPrinted: string;
  currentSticker: string;
  currentTag: string;
  currentWoven: string;


  public doesMasterExist:boolean = false;


  checkLocationUpdate(){
    if(this.productLocation.location == undefined || this.productLocation.location == '' || this.productLocation.location == null   )
    {
      this._snackBar.open("Please Enter a Label Type", "", {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: "top",
        horizontalPosition: "center"
      });
    }
    else if(this.productLocation.printed == undefined && this.productLocation.tag == undefined && this.productLocation.sticker == undefined && this.productLocation.woven == undefined)
    {
      this._snackBar.open("Please Choose a Trim Type", "", {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: "top",
        horizontalPosition: "center"
      });
    }

  else
    {
      this.save()
      this._snackBar.open("Updated Successfully", "", {
        duration: 2000,
        panelClass: ['snackbar3'],
        verticalPosition: "top",
        horizontalPosition: "center"
      });
    }
  }


  ngOnInit(){
    this.reloadData();
  }

  updateProductLocation(id: number){
    this.id = id;

    this.productLocation = new productLocationTS();

    this.theProductService.getProductLocation(this.id)
      .subscribe(data => {
        console.log(data)
        this.productLocation = data;
      }, error => console.log(error));
  }
}
