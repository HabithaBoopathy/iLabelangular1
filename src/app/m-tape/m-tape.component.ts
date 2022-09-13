import { Component, OnInit } from '@angular/core';
import { MTape } from '../models/mTape';
import { MTapeService } from '../services/mTape.service';
import { SnackBarService } from '../services/snackBar.service';
import { Validator } from '../utility-classes/validator';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-m-tape',
  templateUrl: './m-tape.component.html',
  styleUrls: ['./m-tape.component.css'],
})
export class MTapeComponent implements OnInit {
  // Search Text
  searchText: string;

  //object declarations
  tape: MTape;
  tapes: MTape[];
  validator: Validator;

  //modal vars
  modalReference: any;

  //update functionality reference vars
  updateIndex: number;
  updateFlag: boolean = false;

  constructor(
    private tapeService: MTapeService,
    private snackBarService: SnackBarService,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.tape = new MTape();
    this.validator = new Validator();
  }

  ngOnInit(): void {
    this.fetchTapes();
  }

  fetchTapes() {
    this.tapeService.getAllTapes().subscribe(
      (data) => {
        this.tapes = data;
      },
      (err) => {
        alert(
          'Error while fetching Tapes List. Please contact the administrator'
        );
        console.log(err);
      }
    );
  }

  resetTape() {
    this.tape = new MTape();
  }

  initializeCreate() {
    this.resetTape();
    this.updateFlag = false;
  }

  onCreate() {
    if (this.validateTapeInput()) {
      this.tapeService.createMTape(this.tape).subscribe(
        (data) => {
          this.snackBarService.showSuccessSnack('Tape created successfully');
          document.getElementById('modalCloseBtn').click();
          this.fetchTapes();
        },
        (err) => {
          this.snackBarService.showWarningSnack(
            'Error while creating tape. Please contact the Administrator'
          );
          console.log(err);
        }
      );
    }
  }

  validateTapeInput(forUpdate?: boolean, updateIndex?: number) {
    let flag = false;
    if (this.validator.isEmptyString(this.tape.name)) {
      this.snackBarService.showWarningSnack('Please enter the Tape Name ');
    } else if (this.validator.isNotAPostiveNumber(this.tape.width)) {
      this.snackBarService.showWarningSnack('Please enter the Tape Width');
    } else if (this.validator.isNotAPostiveNumber(this.tape.costPerMeter)) {
      this.snackBarService.showWarningSnack(
        'Please enter the Tape Cost Per Meter'
      );
    } else if (this.checkExistingTapeName(forUpdate, updateIndex)) {
      this.snackBarService.showWarningSnack(
        'Tape Name already exists. Please try again with a different Tape Name'
      );
    } else {
      flag = true;
    }
    return flag;
  }

  checkExistingTapeName(forUpdate?: boolean, updateIndex?: number) {
    if (!forUpdate) {
      /*validation while saving
        No duplicate Tape Name should be there
        using Array.prototype.some() to avoid loops*/
      if (
        this.tapes.some(
          (obj) => obj.name.toLowerCase() == this.tape.name.toLowerCase()
        )
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      /**
       * validation while updating
       * The user should not use an already existing Tape Name
       * But, the user can use the existing Tape Name at that particular index
       * Ex: while we are trying to edit a tape having Tape Name Leetag, we can use Leetag as Tape Name but not any other existing Tape Name (since they are in different index)
       * using Array.prototype.filter()
       */
      if (
        this.tapes.filter(
          (obj, i) =>
            obj.name.toLowerCase() == this.tape.name.toLowerCase() &&
            i != updateIndex
        ).length > 0
      ) {
        return true;
      } else {
        return false;
      }
    }
  }

  initializeEdit(id) {
    let index = this.tapes.findIndex((obj) => obj.id == id);
    this.tape = { ...this.tapes[index] };
    this.updateIndex = index;
    this.updateFlag = true;
  }

  onUpdate() {
    if (this.validateTapeInput(true, this.updateIndex)) {
      this.tapeService.updateMTape(this.tape).subscribe(
        (data) => {
          this.snackBarService.showSuccessSnack('Tape updated successfully');
          document.getElementById('modalCloseBtn').click();
          this.fetchTapes();
        },
        (err) => {
          this.snackBarService.showWarningSnack(
            'Error while updating tape. Please contact the Administrator'
          );
          console.log(err);
        }
      );
    }
  }

  open(content) {
    this.modalReference = this.modalService.open(content, {
      backdrop: 'static',
      size: 'sm',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    });
    this.modalReference.result.then(
      (result) => {
        // this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
}
