import { Component, OnInit } from '@angular/core';
import { Merchandiser } from '../../models/merchandiser';
import { Company } from '../../models/company';
import { Territory } from '../../../models/territory';
import { TerritoryService } from '../../../services/territory.service';
import { Mexecutive } from '../../../models/mexecutive';
import { MexecutiveService } from '../../../services/mexecutive.service';
import { SnackBarService } from 'src/app/services/snackBar.service';
import { Validator } from '../../../utility-classes/validator';
import { MerchandiserService } from '../../services/merchandiser.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompanyService } from '../../services/company.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-merchandiser',
  templateUrl: './merchandiser.component.html',
  styleUrls: ['./merchandiser.component.css'],
})
export class MerchandiserComponent implements OnInit {
  // Search Text
  searchText: string;

  //object declarations
  merchandiser: Merchandiser;
  merchandisers: Merchandiser[];
  companies: Company[];
  territories: Territory[];
  //contains only the executives corresponding to the selected territory
  executives: Mexecutive[];
  //contains all the executives
  executivesAll: Mexecutive[];
  validator: Validator;

  //modal vars
  modalReference: any;

  //update functionality reference vars
  updateIndex: number;
  updateFlag: boolean = false;

  //external call (ie., from company component reference)
  externalFlag: boolean = false;

  constructor(
    private territoryService: TerritoryService,
    private mexecutiveService: MexecutiveService,
    private snackBarService: SnackBarService,
    private merchandiserService: MerchandiserService,
    private modalService: NgbModal,
    private companyService: CompanyService,
    private router: Router
  ) {
    this.merchandiser = new Merchandiser();
    this.validator = new Validator();
    this.fetchCompanies();
    this.fetchExecutives();
    this.externalFlag = this.merchandiserService.companyId ? true : false;
  }

  ngOnInit(): void {
    this.fetchMerchandisers();
    this.fetchTerritories();

    if (this.externalFlag) {
      this.initializeExternalCall();
    }
  }

  initializeExternalCall() {
    document.getElementById('createNewBtn').click();
    this.merchandiser.companyId = this.merchandiserService.companyId;
    this.onCompanyChange();
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

  fetchExecutives() {
    this.mexecutiveService.getMexecutivesList().subscribe(
      (data) => {
        this.executivesAll = data;
      },
      (err) => {
        console.log('Error while fetching executive list');
        console.log(err);
        return '';
      }
    );
  }

  fetchMerchandisers() {
    this.merchandiserService.getAllMerchandisers().subscribe(
      (data) => {
        this.merchandisers = data;
      },
      (err) => {
        alert(
          'Error while fetching Merchandisers List. Please contact the administrator'
        );
        console.log(err);
      }
    );
  }

  findCompanyNameById(id: string): string {
    let index = this.companies.findIndex((obj) => obj.id == id);
    return this.companies[index].name;
  }

  findExecutiveNameById(id: string): string {
    let index = this.executivesAll.findIndex((obj) => String(obj.id) == id);
    return this.executivesAll[index].name;
  }

  resetMerchandiser() {
    this.merchandiser = new Merchandiser();
  }

  initializeCreate() {
    this.resetMerchandiser();
    this.updateFlag = false;
  }

  onCompanyChange() {
    this.companyService.getById(this.merchandiser.companyId).subscribe(
      (data) => {
        this.assignCompanyDetailstoMerchandiser(data);
      },
      (err) => {
        alert(
          'Error while fetching company details. Please contact the administrator'
        );
        console.log(err);
      }
    );
  }

  assignCompanyDetailstoMerchandiser(company: Company) {
    this.merchandiser.territoryId = company.territoryId;
    this.merchandiser.executiveId = company.executiveId;
    this.onTerritoryChange(true);
    this.merchandiser.gstin = company.gstin;
    this.merchandiser.website = company.website;
    this.merchandiser.street1 = company.street1;
    this.merchandiser.street2 = company.street2;
    this.merchandiser.city = company.city;
    this.merchandiser.zipCode = company.zipCode;
    this.merchandiser.state = company.state;
    this.merchandiser.country = company.country;
    this.merchandiser.paymentTerms = company.paymentTerms;
    this.merchandiser.shipmentTerms = company.shipmentTerms;
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
    this.mexecutiveService
      .getByTerritoryId(this.merchandiser.territoryId)
      .subscribe(
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
      this.merchandiser.executiveId = '';
    }
  }

  endExternalCall() {
    this.merchandiserService.companyId = null;
    this.router.navigateByUrl('/home/companyv2');
  }

  onCreate() {
    if (this.validateMerchandiserInput()) {
      this.merchandiserService.createMerchandiser(this.merchandiser).subscribe(
        (data) => {
          this.snackBarService.showSuccessSnack(
            'Merchandiser created successfully'
          );
          document.getElementById('modalCloseBtn').click();
          this.fetchMerchandisers();

          if (this.externalFlag) {
            this.endExternalCall();
          }

          //push the merchandiserId into merchandiserIds[] field of company master
          //finding the company
          let index = this.companies.findIndex(
            (obj) => obj.id == this.merchandiser.companyId
          );
          this.companies[index].merchandiserIds.push(data['id']);
          this.companyService.updateCompany(this.companies[index]).subscribe(
            (data) => {
              console.log(
                'Merchandiser listed under the company master successfully'
              );
            },
            (err) => {
              console.log(
                'Error while listing merchandiser id under company master'
              );
              console.log(err);
            }
          );
        },
        (err) => {
          this.snackBarService.showWarningSnack(
            'Error while creating Merchandiser. Please contact the Administrator'
          );
          console.log(err);
        }
      );
    }
  }

  validateMerchandiserInput(forUpdate?: boolean, updateIndex?: number) {
    let flag = false;
    if (this.validator.isEmptyString(this.merchandiser.name)) {
      this.snackBarService.showWarningSnack(
        'Please enter the Merchandiser Name '
      );
    } else if (this.validator.isEmptyString(this.merchandiser.territoryId)) {
      this.snackBarService.showWarningSnack('Please select the Territory');
    } else if (this.validator.isEmptyString(this.merchandiser.executiveId)) {
      this.snackBarService.showWarningSnack('Please select the Executive');
    } else if (this.validator.isEmptyString(this.merchandiser.email)) {
      this.snackBarService.showWarningSnack('Please enter the Email Id');
    } else if (this.validator.isEmptyString(this.merchandiser.phone)) {
      this.snackBarService.showWarningSnack('Please enter the Phone Number');
    } else if (this.validator.isEmptyString(this.merchandiser.street1)) {
      this.snackBarService.showWarningSnack('Please enter the Street 1');
    } else if (this.validator.isEmptyString(this.merchandiser.street2)) {
      this.snackBarService.showWarningSnack('Please enter the Street 2');
    } else if (this.validator.isEmptyString(this.merchandiser.city)) {
      this.snackBarService.showWarningSnack('Please enter the City');
    } else if (this.validator.isEmptyString(this.merchandiser.zipCode)) {
      this.snackBarService.showWarningSnack('Please enter the Zip Code');
    } else if (this.validator.isEmptyString(this.merchandiser.state)) {
      this.snackBarService.showWarningSnack('Please enter the State');
    } else if (this.validator.isEmptyString(this.merchandiser.country)) {
      this.snackBarService.showWarningSnack('Please enter the Country');
    } else if (this.validator.isEmptyString(this.merchandiser.paymentTerms)) {
      this.snackBarService.showWarningSnack('Please select the Payment Terms');
    } else if (this.validator.isEmptyString(this.merchandiser.shipmentTerms)) {
      this.snackBarService.showWarningSnack('Please select the Shipment Terms');
    } else if (!this.validator.isValidEmail(this.merchandiser.email)) {
      this.snackBarService.showWarningSnack('Please enter a valid Email Id');
    } else if (this.checkExistingEmail(forUpdate, updateIndex)) {
      this.snackBarService.showWarningSnack(
        'Email Id already exists. Please try again with a different Email'
      );
    } else if (this.merchandiser.phone.length > 11) {
      this.snackBarService.showWarningSnack(
        'Please enter a valid Phone Number'
      );
    } else if (this.merchandiser.zipCode.length > 6) {
      this.snackBarService.showWarningSnack('Please enter a valid Zip Code');
    } else if (
      !this.validator.isEmptyString(this.merchandiser.gstin) &&
      this.merchandiser.gstin.length != 15
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
        this.merchandisers.some(
          (obj) =>
            obj.email.toLowerCase() == this.merchandiser.email.toLowerCase()
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
        this.merchandisers.filter(
          (obj, i) =>
            obj.email.toLowerCase() == this.merchandiser.email.toLowerCase() &&
            i != updateIndex
        ).length > 0
      ) {
        return true;
      } else {
        return false;
      }
    }
  }

  // checkExistingMerchandiserName(forUpdate?: boolean, updateIndex?: number) {
  //   if (!forUpdate) {
  //     /*validation while saving
  //       No duplicate Merchandiser Name should be there
  //       using Array.prototype.some() to avoid loops*/
  //     if (
  //       this.merchandisers.some(
  //         (obj) =>
  //           obj.name.toLowerCase() == this.merchandiser.name.toLowerCase()
  //       )
  //     ) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   } else {
  //     /**
  //      * validation while updating
  //      * The user should not use an already existing Merchandiser Name
  //      * But, the user can use the existing Merchandiser Name at that particular index
  //      * Ex: while we are trying to edit user having Merchandiser Name Kannan, we can use Kannan as Merchandiser Name but not any other existing Merchandiser Name
  //      * using Array.prototype.filter()
  //      */
  //     if (
  //       this.merchandisers.filter(
  //         (obj, i) =>
  //           obj.name.toLowerCase() == this.merchandiser.name.toLowerCase() &&
  //           i != updateIndex
  //       ).length > 0
  //     ) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   }
  // }

  initializeEdit(id) {
    let index = this.merchandisers.findIndex((obj) => obj.id == id);
    this.merchandiser = { ...this.merchandisers[index] };
    this.updateIndex = index;
    this.updateFlag = true;
    // fetching exectuives for the predefined territory
    this.onTerritoryChange(true);
  }

  onUpdate() {
    if (this.validateMerchandiserInput(true, this.updateIndex)) {
      this.merchandiserService.updateMerchandiser(this.merchandiser).subscribe(
        (data) => {
          this.snackBarService.showSuccessSnack(
            'Merchandiser updated successfully'
          );
          document.getElementById('modalCloseBtn').click();
          this.fetchMerchandisers();
        },
        (err) => {
          this.snackBarService.showWarningSnack(
            'Error while updating Merchandiser. Please contact the Administrator'
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
        if (this.externalFlag) {
          this.endExternalCall();
        }
      },
      (reason) => {
        // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        if (this.externalFlag) {
          this.endExternalCall();
        }
      }
    );
  }
}
