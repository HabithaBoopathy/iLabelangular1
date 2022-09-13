import { Component, OnInit } from '@angular/core';
import { MPaper } from '../models/mPaper';
import { MPaperService } from '../services/mPaper.service';
import { SnackBarService } from '../services/snackBar.service';
import { Validator } from '../utility-classes/validator';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mpaper',
  templateUrl: './mpaper.component.html',
  styleUrls: ['./mpaper.component.css'],
})
export class MpaperComponent implements OnInit {
  // Search Text
  searchText: string;

  //object declarations
  paper: MPaper;
  papers: MPaper[];
  validator: Validator;

  //modal vars
  modalReference: any;

  //update functionality reference vars
  updateIndex: number;
  updateFlag: boolean = false;

  constructor(
    private paperService: MPaperService,
    private snackBarService: SnackBarService,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.paper = new MPaper();
    this.validator = new Validator();
  }

  ngOnInit(): void {
    this.fetchPapers();
  }

  fetchPapers() {
    this.paperService.getAllPapers().subscribe(
      (data) => {
        this.papers = data;
      },
      (err) => {
        alert(
          'Error while fetching Papers List. Please contact the administrator'
        );
        console.log(err);
      }
    );
  }

  resetPaper() {
    this.paper = new MPaper();
  }

  initializeCreate() {
    this.resetPaper();
    this.updateFlag = false;
  }

  roundToFour(num): number {
    return +(Math.round(Number(num + 'e+4')) + 'e-4');
  }

  calcRatePerBoard() {
    if (
      this.paper.gsm &&
      this.paper.productLength &&
      this.paper.productWidth &&
      this.paper.rate
    ) {
      this.paper.ratePerBoard = this.roundToFour(
        ((this.paper.productLength * this.paper.productWidth * this.paper.gsm) /
          1550000) *
          this.paper.rate
      );
    } else {
      this.paper.ratePerBoard = null;
    }
  }

  onCreate() {
    if (this.validatePaperInput()) {
      this.paperService.createMPaper(this.paper).subscribe(
        (data) => {
          this.snackBarService.showSuccessSnack('Paper created successfully');
          document.getElementById('modalCloseBtn').click();
          this.fetchPapers();
        },
        (err) => {
          this.snackBarService.showWarningSnack(
            'Error while creating paper. Please contact the Administrator'
          );
          console.log(err);
        }
      );
    }
  }

  validatePaperInput(forUpdate?: boolean, updateIndex?: number) {
    let flag = false;
    if (this.validator.isEmptyString(this.paper.name)) {
      this.snackBarService.showWarningSnack('Please enter the Paper Name ');
    } else if (this.validator.isNotAPostiveNumber(this.paper.gsm)) {
      this.snackBarService.showWarningSnack('Please enter a valid GSM');
    } else if (this.validator.isNotAPostiveNumber(this.paper.productLength)) {
      this.snackBarService.showWarningSnack('Please enter a valid length');
    } else if (this.validator.isNotAPostiveNumber(this.paper.productWidth)) {
      this.snackBarService.showWarningSnack('Please enter a valid width');
    } else if (this.validator.isNotAPostiveNumber(this.paper.rate)) {
      this.snackBarService.showWarningSnack('Rate value - Invalid');
    } else if (this.validator.isNotAPostiveNumber(this.paper.ratePerBoard)) {
      this.snackBarService.showWarningSnack(
        'Rate per Board - Autocalculation Error. Please contact the administrator'
      );
    } else if (this.checkExistingPaperName(forUpdate, updateIndex)) {
      this.snackBarService.showWarningSnack(
        'Paper Name already exists. Please try again with a different Tape Name'
      );
    } else {
      flag = true;
    }
    return flag;
  }

  checkExistingPaperName(forUpdate?: boolean, updateIndex?: number) {
    if (!forUpdate) {
      /*validation while saving
        No duplicate Paper Name should be there
        using Array.prototype.some() to avoid loops*/
      if (
        this.papers.some(
          (obj) => obj.name.toLowerCase() == this.paper.name.toLowerCase()
        )
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      /**
       * validation while updating
       * The user should not use an already existing Paper Name
       * But, the user can use the existing Paper Name at that particular index
       * Ex: while we are trying to edit a Paper having Paper Name Leetag, we can use Leetag as Paper Name but not any other existing Paper Name (since they are in different index)
       * using Array.prototype.filter()
       */
      if (
        this.papers.filter(
          (obj, i) =>
            obj.name.toLowerCase() == this.paper.name.toLowerCase() &&
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
    let index = this.papers.findIndex((obj) => obj.id == id);
    this.paper = { ...this.papers[index] };
    this.updateIndex = index;
    this.updateFlag = true;
  }

  onUpdate() {
    if (this.validatePaperInput(true, this.updateIndex)) {
      this.paperService.updateMPaper(this.paper).subscribe(
        (data) => {
          this.snackBarService.showSuccessSnack('Paper updated successfully');
          document.getElementById('modalCloseBtn').click();
          this.fetchPapers();
        },
        (err) => {
          this.snackBarService.showWarningSnack(
            'Error while updating paper. Please contact the Administrator'
          );
          console.log(err);
        }
      );
    }
  }

  open(content) {
    this.modalReference = this.modalService.open(content, {
      backdrop: 'static',
      size: 'lg',
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
