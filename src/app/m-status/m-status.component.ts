import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Mstatus } from './../models/mstatus';
import { MstatusService } from './../services/mstatus.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-m-status',
  templateUrl: './m-status.component.html',
  styleUrls: ['./m-status.component.css']
})



export class MStatusComponent implements OnInit {

  createRoute()
  {
    // this.router.navigate(['/home/orders']);
    this._location.back();
  }

  id: number;

  mstatuss: Observable<Mstatus[]>;

  searchText;

  form: FormGroup;
  mstatus: Mstatus = new Mstatus();
  submitted = false;

  modalReference: any;

  constructor(private http:HttpClient, private modalService: NgbModal, private mstatusService: MstatusService,
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
    this.mstatus = new Mstatus();
  }

  save() {
    this.mstatusService
    .createMstatus(this.mstatus).subscribe(data => {
      console.log(data)
      this.mstatus = new Mstatus();
      this.reloadData();
    },
    error => console.log(error));
    this.modalReference.close();
  }


  reloadData() {
    this.mstatuss = this.mstatusService.getMstatussList();
  }

  resetForm() {
    this.mstatus = new Mstatus();
  }

  //Delete
  deleteMstatus(id: number) {
    this.mstatusService.deleteMstatus(id)
      .subscribe(
        data => {
          console.log(data);
          this.reloadData();
        },
        error => console.log(error));
  }


  checkstatus(){
    if(this.mstatus.productstatus == undefined || this.mstatus.productstatus == '' || this.mstatus.productstatus == null)
    {
      this._snackBar.open("Please fill  Valid Details", "", {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: "top",
        horizontalPosition: "center"
      });

    }

    else if(this.mstatus.printed == undefined && this.mstatus.tag == undefined && this.mstatus.sticker == undefined && this.mstatus.woven == undefined)
    {
      this._snackBar.open("Please Choose a Trim Type", "", {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: "top",
        horizontalPosition: "center"
      });
    }

    else if(this.statusName === "true"){
      this._snackBar.open("Status Name already exists", "", {
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

  currentstatus: string;

  currentPrinted: string;
  currentSticker: string;
  currentTag: string;
  currentWoven: string;


  public doesMasterExist:boolean = false;


  checkStatusUpdate(){
    if(this.mstatus.productstatus == undefined || this.mstatus.productstatus == '' || this.mstatus.productstatus == null   )
    {
      this._snackBar.open("Please Enter a Status ", "", {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: "top",
        horizontalPosition: "center"
      });
    }

    else if(this.mstatus.printed == undefined && this.mstatus.tag == undefined && this.mstatus.sticker == undefined && this.mstatus.woven == undefined)
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


  statusName : string = "false";


  getCurrentStatus(){
    this.mstatusService.getStatusName(this.mstatus.productstatus).subscribe((data : Mstatus) => {

      if (data != null && data != undefined) {

        if (data.productstatus === this.mstatus.productstatus) {
          this._snackBar.open("Location already exists", "", {
            duration: 2000,
            panelClass: ['snackbar1'],
            verticalPosition: "top",
            horizontalPosition: "center"
          });
          this.statusName = "true";
        }
      }

      else {
        this.statusName = "false";
      }
      });
  }


  ngOnInit(){
    this.reloadData();
  }

  updateMstatus(id: number){
    this.id = id;

    this.mstatus = new Mstatus();

    this.mstatusService.getMstatus(this.id)
      .subscribe(data => {
        console.log(data)
        this.mstatus = data;
      }, error => console.log(error));
  }
}
