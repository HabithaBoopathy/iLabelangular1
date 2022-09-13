import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { MdocumenttypeService } from './../services/mdocumenttype.service';
import { Mdocumenttype} from './../models/mdocumenttype';
import {Location} from '@angular/common';

@Component({
  selector: 'app-m-documenttype',
  templateUrl: './m-documenttype.component.html',
  styleUrls: ['./m-documenttype.component.css']
})
export class MdocumenttypeComponent implements OnInit {

  createRoute()
  {
    this._location.back();
  }

  id: number;

  mdocumenttypes: Observable<Mdocumenttype[]>;

  modalReference: any;

  searchText;

  form: FormGroup;
  mdocumenttype: Mdocumenttype = new Mdocumenttype();
  submitted = false;

  constructor(private http:HttpClient, private modalService: NgbModal, private mdocumenttypeService: MdocumenttypeService,
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
    this.modalReference = this.modalService.open(content, { backdrop: 'static',size: 'md', centered: true, ariaLabelledBy: 'modal-basic-title'});this.modalReference.result.then((result) => {
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
    this.mdocumenttype = new Mdocumenttype();
  }

  save() {
    this.mdocumenttypeService
    .createMdocumenttype(this.mdocumenttype).subscribe(data => {
      console.log(data)
      this.mdocumenttype = new Mdocumenttype();
      this.reloadData();

    },
    error => console.log(error));
    this.modalReference.close();
  }


  reloadData() {
    this.mdocumenttypes = this.mdocumenttypeService.getMdocumenttypesList();
  }

  resetForm() {
    this.mdocumenttype = new Mdocumenttype();
  }

  //Delete
  deleteMdocumenttype(id: number) {
    this.mdocumenttypeService.deleteMdocumenttype(id)
      .subscribe(
        data => {
          console.log(data);
          this.reloadData();
        },
        error => console.log(error));
  }


  documentName : string = "false";


  getCurrentDocumentType(){
    this.mdocumenttypeService.getByDocumentType(this.mdocumenttype.doctype).subscribe((data : Mdocumenttype) => {

      if (data != null && data != undefined) {

        if (data.doctype === this.mdocumenttype.doctype) {
          this._snackBar.open("Document type already exists", "", {
            duration: 2000,
            panelClass: ['snackbar1'],
            verticalPosition: "top",
            horizontalPosition: "center"
          });
          this.documentName = "true";
        }
      }
      else {
        this.documentName = "false";
      }
      });
  }


  checkDocument(){
    if(this.mdocumenttype.doctype == undefined || this.mdocumenttype.doctype == '' || this.mdocumenttype.doctype == null)
    {
      this._snackBar.open("Please fill  Valid Details", "", {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: "top",
        horizontalPosition: "center"
      });
    }

    else if(this.mdocumenttype.printed == undefined && this.mdocumenttype.tag == undefined && this.mdocumenttype.sticker == undefined && this.mdocumenttype.woven == undefined)
    {
      this._snackBar.open("Please Choose a Trim Type", "", {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: "top",
        horizontalPosition: "center"
      });
    }

    else if(this.documentName === "true"){
      this._snackBar.open("Document type already exists", "", {
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
  currentDocumentType: string;
  currentPrinted: string;
  currentSticker: string;
  currentTag: string;
  currentWoven: string;


  public doesMasterExist:boolean = false;


  checkDocumentUpdate(){
    if(this.mdocumenttype.doctype == undefined || this.mdocumenttype.doctype == '' || this.mdocumenttype.doctype == null   )
    {
      this._snackBar.open("Please Enter a Label Type", "", {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: "top",
        horizontalPosition: "center"
      });
    }
    else if(this.mdocumenttype.printed == undefined && this.mdocumenttype.tag == undefined && this.mdocumenttype.sticker == undefined && this.mdocumenttype.woven == undefined)
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

  updateMdocumenttype(id: number){
    this.id = id;

    this.mdocumenttype = new Mdocumenttype();

    this.mdocumenttypeService.getMdocumenttype(this.id)
      .subscribe(data => {
        console.log(data)
        this.mdocumenttype = data;
      }, error => console.log(error));
  }
}
