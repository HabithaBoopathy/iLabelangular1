import { Component, OnInit } from '@angular/core';
import { MTapeMachine } from '../models/mTapeMachine';
import { MTapeMachineService } from '../services/mTapeMachine.service';
import { SnackBarService } from '../services/snackBar.service';
import { Validator } from '../utility-classes/validator';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-m-tape-machine',
  templateUrl: './m-tape-machine.component.html',
  styleUrls: ['./m-tape-machine.component.css'],
})
export class MTapeMachineComponent implements OnInit {
  // Search Text
  searchText: string;

  //object declarations
  machine: MTapeMachine;
  machines: MTapeMachine[];
  validator: Validator;

  //modal vars
  modalReference: any;

  //update functionality reference vars
  updateIndex: number;
  updateFlag: boolean = false;

  constructor(
    private mTapeMachineService: MTapeMachineService,
    private snackBarService: SnackBarService,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.machine = new MTapeMachine();
    this.validator = new Validator();
  }

  ngOnInit(): void {
    this.fetchMachines();
  }

  fetchMachines() {
    this.mTapeMachineService.getAllMachines().subscribe(
      (data) => {
        this.machines = data;
      },
      (err) => {
        alert(
          'Error while fetching Machines List. Please contact the administrator'
        );
        console.log(err);
      }
    );
  }

  resetMachine() {
    this.machine = new MTapeMachine();
  }

  initializeCreate() {
    this.resetMachine();
    this.updateFlag = false;
  }

  onCreate() {
    if (this.validateMachineInput()) {
      this.mTapeMachineService.createMachine(this.machine).subscribe(
        (data) => {
          this.snackBarService.showSuccessSnack('Machine created successfully');
          document.getElementById('modalCloseBtn').click();
          this.fetchMachines();
        },
        (err) => {
          this.snackBarService.showWarningSnack(
            'Error while creating machine. Please contact the Administrator'
          );
          console.log(err);
        }
      );
    }
  }

  validateMachineInput(forUpdate?: boolean, updateIndex?: number) {
    let flag = false;
    if (this.validator.isEmptyString(this.machine.name)) {
      this.snackBarService.showWarningSnack('Please enter the Machine Name ');
    } else if (this.validator.isNotAPostiveNumber(this.machine.rate)) {
      this.snackBarService.showWarningSnack('Please enter the Machine Rate');
    } else if (this.validator.isEmptyString(this.machine.type)) {
      this.snackBarService.showWarningSnack('Please select the machine type');
    } else if (this.checkExistingMachineName(forUpdate, updateIndex)) {
      this.snackBarService.showWarningSnack(
        'Machine Name already exists. Please try again with a different machine Name'
      );
    } else {
      flag = true;
    }
    return flag;
  }

  checkExistingMachineName(forUpdate?: boolean, updateIndex?: number) {
    if (!forUpdate) {
      /*validation while saving
        No duplicate Machine Name should be there
        using Array.prototype.some() to avoid loops*/
      if (
        this.machines.some(
          (obj) => obj.name.toLowerCase() == this.machine.name.toLowerCase()
        )
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      /**
       * validation while updating
       * The user should not use an already existing Machine Name
       * But, the user can use the existing Machine Name at that particular index
       * Ex: while we are trying to edit a Machine having Machine Name Leetag, we can use Leetag as Machine Name but not any other existing Machine Name (since they are in different index)
       * using Array.prototype.filter()
       */
      if (
        this.machines.filter(
          (obj, i) =>
            obj.name.toLowerCase() == this.machine.name.toLowerCase() &&
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
    let index = this.machines.findIndex((obj) => obj.id == id);
    this.machine = { ...this.machines[index] };
    this.updateIndex = index;
    this.updateFlag = true;
  }

  onUpdate() {
    if (this.validateMachineInput(true, this.updateIndex)) {
      this.mTapeMachineService.updateMachine(this.machine).subscribe(
        (data) => {
          this.snackBarService.showSuccessSnack('Machine updated successfully');
          document.getElementById('modalCloseBtn').click();
          this.fetchMachines();
        },
        (err) => {
          this.snackBarService.showWarningSnack(
            'Error while updating Machine. Please contact the Administrator'
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
