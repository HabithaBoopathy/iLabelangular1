import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Munit } from './../models/munit';
import { MunitService} from './../services/munit.service';
import {Location} from '@angular/common';


@Component({
  selector: 'app-m-unit',
  templateUrl: './m-unit.component.html',
  styleUrls: ['./m-unit.component.css']
})
export class MUnitComponent implements OnInit {

  createRoute()
  {
    this._location.back();
  }

  id: number;

  modalReference: any;

  munits: Observable<Munit[]>;

  searchText;

  form: FormGroup;
  munit: Munit = new Munit();
  submitted = false;

  constructor(private http:HttpClient, private modalService: NgbModal, private munitService: MunitService,
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
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'md', centered: true, ariaLabelledBy: 'modal-basic-title'});this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  bring(updateModal) {
    this.modalReference = this.modalService.open(updateModal, { backdrop: 'static', size: 'md', centered: true, ariaLabelledBy: 'modal-basic-title'});this.modalReference.result.then((result) => {
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
    this.munit = new Munit();
  }

  save() {
    this.munitService
    .createMunit(this.munit).subscribe(data => {
      console.log(data)
      this.munit = new Munit();
      this.reloadData();
    },
    error => console.log(error));
  }


  reloadData() {
    this.munits = this.munitService.getMunitsList();
  }

  resetForm() {
    this.munit = new Munit();
  }

  //Delete
  deleteMunit(id: number) {
    this.munitService.deleteMunit(id)
      .subscribe(
        data => {
          console.log(data);
          this.reloadData();
        },
        error => console.log(error));
  }


  unitName : string = "false";


  getCurrentUnit(){
    this.munitService.getByUnitName(this.munit.productunit).subscribe((data : Munit) => {

      if (data != null && data != undefined) {

        if (data.productunit === this.munit.productunit) {
          this._snackBar.open("Unit already exists", "", {
            duration: 2000,
            panelClass: ['snackbar1'],
            verticalPosition: "top",
            horizontalPosition: "center"
          });
          this.unitName = "true";
        }
      }
      else {
        this.unitName = "false";
      }
      });
  }


  checkUnit(){
    if(this.munit.productunit == undefined)
    {
      this._snackBar.open("Please fill  Valid Details", "", {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: "top",
        horizontalPosition: "center"
      });
    }

    else if(this.munit.woven == undefined && this.munit.tag == undefined && this.munit.sticker == undefined && this.munit.printed == undefined){
      this._snackBar.open("Please Choose a Trim Type", "", {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: "top",
        horizontalPosition: "center"
      });
    }

    else if(this.unitName === "true"){
      this._snackBar.open("Unit Already Exists", "", {
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


  checkUnitUpdate(){
    if(this.munit.productunit == undefined )
    {
      this._snackBar.open("Please Enter a Product Unit", "", {
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
  currentUnit: string;

  public doesMasterExist:boolean = false;

  ngOnInit(){
    this.reloadData();
  }

  updateMunit(id: number){
    this.id = id;

    this.munit = new Munit();
    this.munitService.getMunit(this.id)
      .subscribe(data => {
        console.log(data)
        this.munit = data;
      }, error => console.log(error));
  }

}
