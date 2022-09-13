import { Component, OnInit } from '@angular/core';
import { Company } from '../../models/company';
import { Territory } from '../../../models/territory';
import { TerritoryService } from '../../../services/territory.service';
import { Mexecutive } from '../../../models/mexecutive';
import { MexecutiveService } from '../../../services/mexecutive.service';
import { SnackBarService } from 'src/app/services/snackBar.service';
import { Validator } from '../../../utility-classes/validator';
import { CompanyService } from '../../services/company.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Merchandiser } from '../../models/merchandiser';
import { MerchandiserService } from '../../services/merchandiser.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css'],
})
export class CompanyComponent implements OnInit {
  // Search Text
  searchText: string;

  //object declarations
  company: Company;
  companies: Company[];
  territories: Territory[];
  executives: Mexecutive[];
  validator: Validator;

  //contains only the merchandiser having the correspoding companyId
  merchandisers: Merchandiser[];

  //modal vars
  modalReference: any;

  //update functionality reference vars
  updateIndex: number;
  updateFlag: boolean = false;

  constructor(
    private territoryService: TerritoryService,
    private mexecutiveService: MexecutiveService,
    private snackBarService: SnackBarService,
    private companyService: CompanyService,
    private modalService: NgbModal,
    private merchandiserService: MerchandiserService,
    private router: Router
  ) {
    this.company = new Company();
    this.validator = new Validator();
  }

  ngOnInit(): void {
    this.fetchCompanies();
    this.fetchTerritories();
  }

  fetchCompanies() {
    this.companyService.getAllCompanies().subscribe(
      (data) => {
        this.companies = data;
      },
      (err) => {
        alert(
          'Error while fetching Companies List. Please contact the administrator'
        );
        console.log(err);
      }
    );
  }

  resetCompany() {
    this.company = new Company();
  }

  initializeCreate() {
    this.resetCompany();
    this.updateFlag = false;
  }
  fetchTerritories() {
    this.territoryService.getAllTerritories().subscribe(
      (data) => {
        this.territories = data;
      },
      (err) => {
        alert(
          'Error while fetching territories. Please contact the administrator'
        );
        console.log(err);
      }
    );
  }

  onTerritoryChange(implicit?: boolean) {
    this.mexecutiveService.getByTerritoryId(this.company.territoryId).subscribe(
      (data) => {
        this.executives = data;
      },
      (error) => {
        alert('Error while fetching executives list based on territory');
        console.log(
          'Error while fetching executives list based on territory ' + error
        );
      }
    );
    if (!implicit) {
      this.company.executiveId = '';
    }
  }

  onCreate() {
    if (this.validateCompanyInput()) {
      this.companyService.createCompany(this.company).subscribe(
        (data) => {
          this.snackBarService.showSuccessSnack('Company created successfully');
          document.getElementById('modalCloseBtn').click();
          this.fetchCompanies();
        },
        (err) => {
          this.snackBarService.showWarningSnack(
            'Error while creating company. Please contact the Administrator'
          );
          console.log(err);
        }
      );
    }
  }

  validateCompanyInput(forUpdate?: boolean, updateIndex?: number) {
    let flag = false;
    if (this.validator.isEmptyString(this.company.name)) {
      this.snackBarService.showWarningSnack('Please enter the Company Name ');
    } else if (this.validator.isEmptyString(this.company.territoryId)) {
      this.snackBarService.showWarningSnack('Please select the Territory');
    } else if (this.validator.isEmptyString(this.company.executiveId)) {
      this.snackBarService.showWarningSnack('Please select the Executive');
    } else if (this.validator.isEmptyString(this.company.email)) {
      this.snackBarService.showWarningSnack('Please enter the Email Id');
    } else if (this.validator.isEmptyString(this.company.phone)) {
      this.snackBarService.showWarningSnack('Please enter the Phone Number');
    } else if (this.validator.isEmptyString(this.company.street1)) {
      this.snackBarService.showWarningSnack('Please enter the Street 1');
    } else if (this.validator.isEmptyString(this.company.street2)) {
      this.snackBarService.showWarningSnack('Please enter the Street 2');
    } else if (this.validator.isEmptyString(this.company.city)) {
      this.snackBarService.showWarningSnack('Please enter the City');
    } else if (this.validator.isEmptyString(this.company.zipCode)) {
      this.snackBarService.showWarningSnack('Please enter the Zip Code');
    } else if (this.validator.isEmptyString(this.company.state)) {
      this.snackBarService.showWarningSnack('Please enter the State');
    } else if (this.validator.isEmptyString(this.company.country)) {
      this.snackBarService.showWarningSnack('Please enter the Country');
    } else if (this.validator.isEmptyString(this.company.paymentTerms)) {
      this.snackBarService.showWarningSnack('Please select the Payment Terms');
    } else if (this.validator.isEmptyString(this.company.shipmentTerms)) {
      this.snackBarService.showWarningSnack('Please select the Shipment Terms');
    } else if (!this.validator.isValidEmail(this.company.email)) {
      this.snackBarService.showWarningSnack('Please enter a valid Email Id');
    } else if (this.checkExistingCompanyName(forUpdate, updateIndex)) {
      this.snackBarService.showWarningSnack(
        'Company Name already exists. Please try again with a different Company Name'
      );
    } else if (this.checkExistingEmail(forUpdate, updateIndex)) {
      this.snackBarService.showWarningSnack(
        'Email Id already exists. Please try again with a different Email'
      );
    } else if (this.company.phone.length > 11) {
      this.snackBarService.showWarningSnack(
        'Please enter a valid Phone Number'
      );
    } else if (this.company.zipCode.length > 6) {
      this.snackBarService.showWarningSnack('Please enter a valid Zip Code');
    } else if (
      !this.validator.isEmptyString(this.company.gstin) &&
      this.company.gstin.length != 15
    ) {
      this.snackBarService.showWarningSnack('Please enter a valid GST Numer');
    } else {
      flag = true;
    }
    return flag;
  }

  checkExistingEmail(forUpdate?: boolean, updateIndex?: number) {
    if (!forUpdate) {
      /*validation while saving
        No duplicate email-Id should be there
        using Array.prototype.some() to avoid loops*/
      if (
        this.companies.some(
          (obj) => obj.email.toLowerCase() == this.company.email.toLowerCase()
        )
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      /**
       * validation while updating
       * The user should not use an already existing emailId
       * But, the user can use the existing emailId at that particular index
       * Ex: while we are trying to edit user having emailId k@n.com company, we can use k@n.com as emailId but not any other existing emailIds
       * using Array.prototype.filter()
       */
      if (
        this.companies.filter(
          (obj, i) =>
            obj.email.toLowerCase() == this.company.email.toLowerCase() &&
            i != updateIndex
        ).length > 0
      ) {
        return true;
      } else {
        return false;
      }
    }
  }

  checkExistingCompanyName(forUpdate?: boolean, updateIndex?: number) {
    if (!forUpdate) {
      /*validation while saving
        No duplicate Company Name should be there
        using Array.prototype.some() to avoid loops*/
      if (
        this.companies.some(
          (obj) => obj.name.toLowerCase() == this.company.name.toLowerCase()
        )
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      /**
       * validation while updating
       * The user should not use an already existing Company Name
       * But, the user can use the existing Company Name at that particular index
       * Ex: while we are trying to edit user having Company Name Indsys, we can use Indsys as Company Name but not any other existing Company Name
       * using Array.prototype.filter()
       */
      if (
        this.companies.filter(
          (obj, i) =>
            obj.name.toLowerCase() == this.company.name.toLowerCase() &&
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
    let index = this.companies.findIndex((obj) => obj.id == id);
    this.company = { ...this.companies[index] };
    this.updateIndex = index;
    this.updateFlag = true;
    // fetching exectuives for the predefined territory
    this.onTerritoryChange(true);
    this.fetchMerchandisers();
  }

  fetchMerchandisers() {
    this.merchandiserService.getByCompanyId(this.company.id).subscribe(
      (data) => {
        console.log('Corresponding merchandisers fetched successfully');
        this.merchandisers = data;
      },
      (err) => {
        console.log('Error while fetching corresponding merchandisers');
        console.log(err);
      }
    );
  }

  onUpdate() {
    if (this.validateCompanyInput(true, this.updateIndex)) {
      this.companyService.updateCompany(this.company).subscribe(
        (data) => {
          this.snackBarService.showSuccessSnack('Company updated successfully');
          document.getElementById('modalCloseBtn').click();
          this.fetchCompanies();
        },
        (err) => {
          this.snackBarService.showWarningSnack(
            'Error while updating company. Please contact the Administrator'
          );
          console.log(err);
        }
      );
    }
  }

  open(content) {
    this.modalReference = this.modalService.open(content, {
      backdrop: 'static',
      size: 'xl',
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

  addNewMerchandiser() {
    this.merchandiserService.companyId = this.company.id;
    document.getElementById('modalCloseBtn').click();
    this.router.navigateByUrl('/home/merchandiser');
  }
}
