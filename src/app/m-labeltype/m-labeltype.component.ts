import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Mlabeltype } from './../models/mlabeltype';
import { MlabeltypeService} from './../services/mlabeltype.service';
import {Location} from '@angular/common';
import { isTemplateExpression } from 'typescript';

@Component({
  selector: 'app-m-labeltype',
  templateUrl: './m-labeltype.component.html',
  styleUrls: ['./m-labeltype.component.css']
})
export class MLabeltypeComponent implements OnInit {

  createRoute()
  {
    // this.router.navigate(['/home/orders']);
    this._location.back();
  }

  id: number;

  mlabeltypes: Observable<Mlabeltype[]>;

  searchText;

  form: FormGroup;
  mlabeltype: Mlabeltype = new Mlabeltype();
  submitted = false;

  modalReference: any;

  constructor(private http:HttpClient, private modalService: NgbModal, private mlabeltypeService: MlabeltypeService,
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
    this.mlabeltype = new Mlabeltype();
  }

  save() {

    this.mlabeltypeService
    .createMlabeltype(this.mlabeltype).subscribe(data => {
      console.log(data)
      this.mlabeltype = new Mlabeltype();
      this.reloadData();

    },
    error => console.log(error));
  }


  reloadData() {
    this.mlabeltypes = this.mlabeltypeService.getMlabeltypesList();
  }

  resetForm() {
    this.mlabeltype = new Mlabeltype();
  }

  //Delete
  deleteMlabeltype(id: number) {
    this.mlabeltypeService.deleteMlabeltype(id)
      .subscribe(
        data => {
          console.log(data);
          this.reloadData();
        },
        error => console.log(error));
  }


  labelName : string = "false";


  getCurrentLabelName(){
    this.mlabeltypeService.getByLabelType(this.mlabeltype.labelname).subscribe((data : Mlabeltype) => {

      if (data != null && data != undefined) {

        if (data.labelname === this.mlabeltype.labelname) {
          this._snackBar.open("Label type already exists", "", {
            duration: 2000,
            panelClass: ['snackbar1'],
            verticalPosition: "top",
            horizontalPosition: "center"
          });
          this.labelName = "true";
        }
      }
      else {
        this.labelName = "false";
      }
      });
  }


  checkLabelType(){
    if(this.mlabeltype.labelname == undefined || this.mlabeltype.labelname == '' || this.mlabeltype.labelname == null)
    {
      this._snackBar.open("Please fill  Valid Details", "", {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: "top",
        horizontalPosition: "center"
      });
    }

    else if(this.mlabeltype.printed == undefined && this.mlabeltype.tag == undefined && this.mlabeltype.sticker == undefined && this.mlabeltype.woven == undefined)
    {
      this._snackBar.open("Please Choose a Trim Type", "", {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: "top",
        horizontalPosition: "center"
      });
    }

    else if(this.labelName === "true"){
      this._snackBar.open("Label Name already exists", "", {
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
  currentLabelType: string;

  currentPrinted: string;
  currentSticker: string;
  currentTag: string;
  currentWoven: string;


  public doesMasterExist:boolean = false;


  checkLabelNameUpdate(){
    if(this.mlabeltype.labelname == undefined || this.mlabeltype.labelname == '' || this.mlabeltype.labelname == null   )
    {
      this._snackBar.open("Please Enter a Label Type", "", {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: "top",
        horizontalPosition: "center"
      });
    }
    else if(this.mlabeltype.printed == undefined && this.mlabeltype.tag == undefined && this.mlabeltype.sticker == undefined && this.mlabeltype.woven == undefined)
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

  updateMlabeltype(id: number){
    this.id = id;

    this.mlabeltype = new Mlabeltype();

    this.mlabeltypeService.getMlabeltype(this.id)
      .subscribe(data => {
        console.log(data)
        this.mlabeltype = data;
      }, error => console.log(error));
  }
}
