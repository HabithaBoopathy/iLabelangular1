import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Territory } from './../models/territory';
import { Mexecutive } from './../models/mexecutive';
import { MexecutiveService } from '../services/mexecutive.service';
import { Validator } from '../utility-classes/validator';
import { SnackBarService } from '../services/snackBar.service';
import { TerritoryService } from '../services/territory.service';

@Component({
  selector: 'app-territory',
  templateUrl: './territory.component.html',
  styleUrls: ['./territory.component.css'],
})
export class TerritoryComponent implements OnInit {
  closeResult: string;
  territoryname: string;
  territory: Territory;
  territories: Territory[];
  mExecutives: Mexecutive[];
  searchText;
  validator: Validator;
  updateIndex: number;

  constructor(
    private modalService: NgbModal,
    private mExecutiveService: MexecutiveService,
    private snackBarService: SnackBarService,
    private territoryService: TerritoryService
  ) {
    this.territory = new Territory();
    this.validator = new Validator();
  }

  ngOnInit(): void {
    this.reloadData();
    this.fetchExecutives();
  }

  reloadData() {
    //fetch all territories
    this.territoryService.getAllTerritories().subscribe(
      (data) => {
        this.territories = data;
      },
      (err) => {
        this.snackBarService.showWarningSnack(
          'Error while fetching territory. Please contact the administrator'
        );
        console.log(err);
      }
    );
  }

  fetchExecutives() {
    this.mExecutiveService.getMexecutivesList().subscribe(
      (data) => {
        this.mExecutives = data;
      },
      (err) => console.log(err)
    );
  }

  resetObj() {
    this.territory = new Territory();
  }

  checkForExistingTerritoryName(
    forUpdate?: boolean,
    updateIndex?: number
  ): boolean {
    if (!forUpdate) {
      /*validation while saving
        No duplicate territory name should be there
        using Array.prototype.some() to avoid loops*/
      if (
        this.territories.some(
          (obj) => obj.name.toLowerCase() == this.territory.name.toLowerCase()
        )
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      /**
       * validation while updating
       * The user should not use an already existing territory name
       * But, the user can use the existing territory name at that particular index
       * Ex: while we are trying to edit tiruppur territory, we can use tiruppur but not any other existing territory names
       * using Array.prototype.filter()
       */
      if (
        this.territories.filter(
          (obj, i) =>
            obj.name.toLowerCase() == this.territory.name.toLowerCase() &&
            i != updateIndex
        ).length > 0
      ) {
        return true;
      } else {
        return false;
      }
    }
  }

  validateTerritoryInput(forUpdate?: boolean, updateIndex?: number): boolean {
    if (this.validator.isEmptyString(this.territory.name)) {
      this.snackBarService.showWarningSnack(
        'Please fill in the territory name'
      );
      return false;
    } else if (this.territory.executiveIds.length < 1) {
      this.snackBarService.showWarningSnack(
        'Please select atleast one executive'
      );
      return false;
    } else if (this.checkForExistingTerritoryName(forUpdate, updateIndex)) {
      this.snackBarService.showWarningSnack(
        'Territory Name Already Exists. Please try again with a different name'
      );
      return false;
    } else {
      return true;
    }
  }

  onSave() {
    if (this.validateTerritoryInput()) {
      this.territoryService.createTerritory(this.territory).subscribe(
        (data) => {
          this.reloadData();
          this.snackBarService.showSuccessSnack(
            'Territory created successfully'
          );
          document.getElementById('close-content').click();
        },
        (error) => {
          this.snackBarService.showWarningSnack(
            'Error while creating territory.Please contact the Administrator'
          );
          console.log(error);
        }
      );
    }
  }

  initializeEdit(id) {
    let i = this.territories.findIndex((obj) => obj.id == id);
    this.territory = { ...this.territories[i] };
    //index to be used while validating duplicate input
    this.updateIndex = i;
  }

  onUpdate() {
    if (this.validateTerritoryInput(true, this.updateIndex)) {
      this.territoryService.updateTerritory(this.territory).subscribe(
        (data) => {
          this.reloadData();
          this.snackBarService.showSuccessSnack(
            'Territory updated successfully'
          );
          document.getElementById('close-update').click();
        },
        (error) => {
          this.snackBarService.showWarningSnack(
            'Error while updating the territory. Please contact the administrator'
          );
          console.log(error);
        }
      );
    }
  }

  updateActivationStatus(i) {
    let status = this.territory.isActive ? 'deactivate' : 'activate';
    let flag = confirm(`Are you sure to ${status} this territory?`);
    if (flag) {
      this.territory = { ...this.territories[i] };
      //toggle the active status
      this.territory.isActive = !this.territories[i].isActive;
      this.territoryService.updateTerritory(this.territory).subscribe(
        (data) => {
          this.snackBarService.showSuccessSnack(
            `Territory ${status}d successfully`
          );
          this.reloadData();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  open(modalRef) {
    this.modalService
      .open(modalRef, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
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
}
