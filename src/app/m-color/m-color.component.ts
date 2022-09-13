import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Mcolor } from './../models/mcolor';
import { McolorService } from '../services/mcolor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { Configuration } from '../configuration';

@Component({
  selector: 'app-m-color',
  templateUrl: './m-color.component.html',
  styleUrls: ['./m-color.component.css'],
})
export class MColorComponent implements OnInit {
  createRoute() {
    this._location.back();
  }

  id: number;

  mcolors: Observable<Mcolor[]>;

  modalReference: any;

  searchText;

  mcolor: Mcolor = new Mcolor();
  form: FormGroup;

  submitted = false;

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private mcolorService: McolorService,
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

  //Create
  newUser(): void {
    this.submitted = false;
    this.mcolor = new Mcolor();
  }

  save() {
    this.mcolorService.createMcolor(this.mcolor).subscribe(
      (data) => {
        console.log(data);
        this.mcolor = new Mcolor();
        this.reloadData();
      },
      (error) => console.log(error)
    );
    this.modalReference.close();
  }

  reloadData() {
    this.mcolors = this.mcolorService.getMcolorsList();
  }

  resetForm() {
    this.mcolor = new Mcolor();
  }

  //Delete
  deleteMcolor(id: number) {
    this.mcolorService.deleteMcolor(id).subscribe(
      (data) => {
        console.log(data);
        this.reloadData();
      },
      (error) => console.log(error)
    );
  }

  // Update Save
  checkColorName() {
    if (
      this.mcolor.colorname == undefined ||
      this.mcolor.colorname == '' ||
      this.mcolor.colorname == null
    ) {
      this._snackBar.open('Please fill  Valid Details', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.mcolor.printed == undefined &&
      this.mcolor.tag == undefined &&
      this.mcolor.sticker == undefined &&
      this.mcolor.woven == undefined
    ) {
      this._snackBar.open('Please Choose a Trim Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (this.colorName === 'true') {
      this._snackBar.open('Color Name already Exists', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else {
      this.save();
    }
  }

  tempColorList = [];
  tempColorList2 = [];
  currentColorName: string;
  currentPrinted: string;
  currentSticker: string;
  currentTag: string;
  currentWoven: string;

  colorName: string = 'false';

  getCurrentColorName() {
    this.mcolorService
      .getByColorName(this.mcolor.colorname)
      .subscribe((data: Mcolor) => {
        if (data != null && data != undefined) {
          if (data.colorname === this.mcolor.colorname) {
            this._snackBar.open('Color name already exists', '', {
              duration: 2000,
              panelClass: ['snackbar1'],
              verticalPosition: 'top',
              horizontalPosition: 'center',
            });
            this.colorName = 'true';
          }
        } else {
          this.colorName = 'false';
        }
      });
  }

  alternateSave() {
    this.http
      .post(`${Configuration.apiURL}api/master/color`, {
        colorname: this.currentColorName,
        printed: this.currentPrinted,
        tag: this.currentTag,
        sticker: this.currentSticker,
        woven: this.currentWoven,
      })
      .toPromise()
      .then((data: any) => {
        this.reloadData();
      });
  }

  checkColorNameUpdate() {
    if (
      this.mcolor.colorname == undefined ||
      this.mcolor.colorname == '' ||
      this.mcolor.colorname == null
    ) {
      this._snackBar.open('Please Enter a Label Type', '', {
        duration: 2000,
        panelClass: ['snackbar1'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else if (
      this.mcolor.printed == undefined &&
      this.mcolor.tag == undefined &&
      this.mcolor.sticker == undefined &&
      this.mcolor.woven == undefined
    ) {
      this._snackBar.open('Please Choose a Trim Type', '', {
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
    }
  }

  ngOnInit() {
    this.reloadData();
  }

  updateMcolor(id: number) {
    this.id = id;

    this.mcolor = new Mcolor();

    this.mcolorService.getMcolor(this.id).subscribe(
      (data) => {
        console.log(data);
        this.mcolor = data;
      },
      (error) => console.log(error)
    );
  }
}
