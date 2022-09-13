import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SnackBarService } from '../services/snackBar.service';
import { Validator } from '../utility-classes/validator';
import { Company } from './../models/company';
import { CompanyService } from '../services/company.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css'],
})
export class CompanyComponent implements OnInit {
  closeResult: string;

  company: Company;
  companies: Company[];

  id: string;
  companyName: string;
  regNumber: string;
  address: string;
  email: string;
  updateId: string;
  searchText;
  validator: Validator;
  updateIndex: number;

  constructor(
    private modalService: NgbModal,
    private snackBarService: SnackBarService,
    private companyService: CompanyService
  ) {
    this.company = new Company();
    this.validator = new Validator();
  }

  ngOnInit(): void {
    this.reloadData();
  }

  reloadData() {
    //fetch all the companies
    this.companyService.getAllCompanies().subscribe(
      (data) => {
        this.companies = data;
      },
      (err) => {
        this.snackBarService.showWarningSnack(
          'Error while fetching territory. Please contact the administrator'
        );
        console.log(err);
      }
    );
  }

  resetObj() {
    this.company = new Company();
  }

  checkForExistingCompanyName(
    forUpdate?: boolean,
    updateIndex?: number
  ): boolean {
    if (!forUpdate) {
      /*validation while saving
        No duplicate company name should be there
        using Array.prototype.some() to avoid loops*/
      if (
        this.companies.some(
          (obj) =>
            obj.companyName.toLowerCase() ==
            this.company.companyName.toLowerCase()
        )
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      /**
       * validation while updating
       * The user should not use an already existing company name
       * But, the user can use the existing company name at that particular index
       * Ex: while we are trying to edit indsys company, we can use indsys as name but not any other existing company names
       * using Array.prototype.filter()
       */
      if (
        this.companies.filter(
          (obj, i) =>
            obj.companyName.toLowerCase() ==
              this.company.companyName.toLowerCase() && i != updateIndex
        ).length > 0
      ) {
        return true;
      } else {
        return false;
      }
    }
  }

  validateCompanyInput(forUpdate?: boolean, updateIndex?: number): boolean {
    if (this.validator.isEmptyString(this.company.companyName)) {
      this.snackBarService.showWarningSnack('Please fill in the Company Name');
      return false;
    } else if (this.validator.isEmptyString(this.company.regNumber)) {
      this.snackBarService.showWarningSnack(
        'Please fill in the Register Number'
      );
      return false;
    } else if (this.validator.isEmptyString(this.company.address)) {
      this.snackBarService.showWarningSnack('Please fill in the Address');
      return false;
    } else if (this.validator.isEmptyString(this.company.email)) {
      this.snackBarService.showWarningSnack('Please fill in the E-Mail');
      return false;
    } else if (this.checkForExistingCompanyName(forUpdate, updateIndex)) {
      this.snackBarService.showWarningSnack(
        'Company Name Already Exists. Please try again with a different Company'
      );
      return false;
    } else {
      return true;
    }
  }

  onSave() {
    if (this.validateCompanyInput()) {
      this.companyService.createCompany(this.company).subscribe(
        (data) => {
          this.reloadData();
          this.snackBarService.showSuccessSnack('Company created successfully');
          document.getElementById('close-content').click();
        },
        (error) => {
          this.snackBarService.showWarningSnack(
            'Error while creating Company.Please contact the Administrator'
          );
          console.log(error);
        }
      );
    }
  }

  initializeEdit(id) {
    let i = this.companies.findIndex((obj) => obj.id == id);
    this.company = { ...this.companies[i] };
    this.updateIndex = i;
  }

  onUpdate() {
    if (this.validateCompanyInput(true, this.updateIndex)) {
      this.companyService.updateCompany(this.company).subscribe(
        (data) => {
          this.reloadData();
          this.snackBarService.showSuccessSnack('Company updated successfully');
          document.getElementById('close-update').click();
        },
        (error) => {
          this.snackBarService.showWarningSnack(
            'Error while updating Company.Please contact the Administrator'
          );
          console.log(error);
        }
      );
    }
  }

  open(modalRef) {
    this.modalService
      .open(modalRef, { ariaLabelledBy: 'modal-basic-title', centered: true })
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
    }
  }
}
