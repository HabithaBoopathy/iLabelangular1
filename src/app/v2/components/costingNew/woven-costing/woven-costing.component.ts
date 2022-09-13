import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WovenCosting } from 'src/app/v2/components/costingNew/model/woven-costing';
import { DateFormatter } from '../../../../utility-classes/date-formatter';
import { Validator } from '../../../../utility-classes/validator';
import { SnackBarService } from 'src/app/services/snackBar.service';
import { CostingService } from '../services/costing.service';
import { CommonDetailsCosting } from '../model/common-details-costing';
import { VariableCostsWoven } from '../model/variable-costs-woven';
import { SlabRates } from '../model/slab-rates';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Employee } from 'src/app/models/employee';
import { EmployeeService } from '../../../../services/employee.service';
import { MexecutiveService } from '../../../../services/mexecutive.service';
import { UserService } from '../../../../services/user.service';
import { MotherdetailsService } from '../../../../services/motherdetails.service';
import { MotherDetails } from 'src/app/models/motherdetails';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CostingApprovalDetails } from '../model/costing-approval-details';
import { Configuration } from '../../../../configuration';
import { TimeService } from '../../../../services/time.service';
import { Everything } from 'src/app/models/orderForms/Everything';

@Component({
  selector: 'app-woven-costing',
  templateUrl: './woven-costing.component.html',
  styleUrls: ['./woven-costing.component.css'],
})
export class WovenCostingComponent implements OnInit {
  [x: string]: any;
  //flag to render the page for creation / updation
  isNew: boolean = true;

  costing: WovenCosting;

  commonDetailsCosting: CommonDetailsCosting;

  displayDate: string;

  customers: Employee[];

  validator: Validator;

  variableCosts: VariableCostsWoven;

  slabRates: SlabRates;

  accessType: string;
  isSuperUser: boolean = false;

  attachmentSrc = '';
  attachment: File;
  imageUpdateFlag: boolean = false;

  public generalDetailsReadOnly: boolean = true;
  public totalPicksAndNosRepeatsReadOnly: boolean = true;

  public mOtherDetails: MotherDetails[];

  costingApprovalDetails: CostingApprovalDetails;

  executiveId: string;
  executiveEmail: string;

  previousPage: string;

  statusReference: number;

  dateFormatter: DateFormatter;

  disableSaveBtn: boolean = false;
  disableSendForCustomerApprovalBtn: boolean = false;
  disableDraftOrderBtn: boolean = false;
  disableAdminApprovalBtn: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBarService: SnackBarService,
    private costingService: CostingService,
    private location: Location,
    public _d: DomSanitizer,
    private employeeService: EmployeeService,
    private mOtherdetailsService: MotherdetailsService,
    private mExecutiveService: MexecutiveService,
    private mUserService: UserService,
    private timeService: TimeService
  ) {
    this.costing = new WovenCosting();
    this.commonDetailsCosting = new CommonDetailsCosting();
    this.validator = new Validator();
    this.variableCosts = new VariableCostsWoven();
    this.slabRates = new SlabRates();
    this.costingApprovalDetails = new CostingApprovalDetails();
    this.dateFormatter = new DateFormatter();

    this.accessType = localStorage.getItem('token');

    if (this.route.snapshot.params['id'] == 'new') {
      this.isNew = true;
      this.fetchServerDate();
      if (this.accessType == 'Sales Team') {
        this.fetchExecutiveId();
      } else if (this.accessType == 'TManager') {
        this.costing.tManagerEmail = localStorage.getItem('emailToken');
      }
    } else {
      this.isNew = false;
    }

    this.previousPage = this.route.snapshot.paramMap.get('previousPage');

    if (localStorage.getItem('superUser') == 'true') {
      this.isSuperUser = true;
    }

    if (
      this.accessType != 'Administrator' &&
      this.accessType != 'Sample Head' &&
      this.accessType != 'Sales Team' &&
      this.accessType != 'TManager' &&
      this.accessType != 'Customer'
    ) {
      this.router.navigate(['/home/dashboard']);
    }
    this.userAccessControl();
  }

  ngOnInit(): void {
    if (!this.isNew) {
      this.fetchExistingCosting();
    }
    this.fetchCustomers();
    this.fetchAdditionalWorkDetails();
    this.fetchOrder();
  }

  ngAfterViewInit() {
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }
  
  fetchServerDate() {
    this.timeService.getCurrentDateTimeISO_UTC().subscribe(
      (data) => {
        //data is the UTC date string received in ISO format
        let serverDate = new Date(data);
        this.costing.entryDate = DateFormatter.getDate_yyyyMMdd(serverDate);
        this.displayDate = DateFormatter.getDate_ddMMyyyy(serverDate);
      },
      (err) => {
        console.log(err);
        alert(
          'Error while fetching server date. Please check your network connection / Contact the administrator'
        );
      }
    );
  }

  userAccessControl() {
    if (
      (this.accessType == 'Sales Team' && this.costing.status < 1) ||
      (this.accessType == 'TManager' && this.costing.status < 1) ||
      (this.accessType == 'Administrator' && this.isSuperUser)
    ) {
      this.generalDetailsReadOnly = false;
    } else {
      this.generalDetailsReadOnly = true;
    }
    // dont use else if here
    if (
      this.accessType == 'Sample Head' ||
      (this.accessType == 'Administrator' && this.isSuperUser)
    ) {
      this.totalPicksAndNosRepeatsReadOnly = false;
    }
  }

  fetchExecutiveId() {
    //this id will be used to set the executiveId field of wovenCosting model while saving for the first time
    this.mExecutiveService
      .getByExecutiveEmail(localStorage.getItem('emailToken'))
      .subscribe(
        (data) => {
          this.executiveId = data['id'];
          this.costing.executiveId = this.executiveId;
          this.executiveEmail = data['emailId'];
        },
        (err) => {
          alert(
            'Unable to fetch Executive Id - Please refresh the page and try again'
          );
          console.log(err);
        }
      );
  }

  fetchExecutiveEmail() {
    this.mExecutiveService.getMexecutive(this.costing.executiveId).subscribe(
      (data) => {
        this.executiveEmail = data['emailId'];
      },
      (err) => console.log(err)
    );
  }

  fetchExecutiveIdUsingExecCode(executiveCode: string) {
    this.mExecutiveService.getByExecutiveCode(executiveCode).subscribe(
      (data) => {
        this.costing.executiveId = data.id;
      },
      (err) => {
        console.log("Couldn't fetch Executive Id using Exec Code");
      }
    );
  }

  fetchAdditionalWorkDetails() {
    this.mOtherdetailsService
      .getOtherDetailsWoven('Additional Work', 'true')
      .subscribe(
        (data) => {
          this.mOtherDetails = data;
        },
        (err) => console.log('Error while fetching other details')
      );
  }

  fetchExistingCosting() {
    this.costingService
      .getWovenByid(this.route.snapshot.params['id'])
      .subscribe(
        (data) => {
          this.costing = data;
          this.displayDate = this.dateFormatter.convertDateToDDMMYYYY(
            data.entryDate
          );
          this.convertBackToVariableCost();

          //In here we get the status
          this.userAccessControl();

          //fetch the attachment based on the extension
          if (this.costing.attachmentExtension != 'pdf') {
            this.costingService
              .getWovenAttachmentImage(
                this.costing.entryDate +
                  '-costing-' +
                  this.costing.refNo +
                  '.' +
                  this.costing.attachmentExtension
              )
              .subscribe(
                (data) => {
                  this.attachmentSrc = window.URL.createObjectURL(data);
                },
                (err) => {
                  console.log(err);
                }
              );
          } else {
            this.costingService
              .getWovenAttachmentPdf(
                this.costing.entryDate +
                  '-costing-' +
                  this.costing.refNo +
                  '.' +
                  this.costing.attachmentExtension
              )
              .subscribe(
                (data) => {
                  this.attachmentSrc = window.URL.createObjectURL(data);
                },
                (err) => {
                  console.log(err);
                }
              );
          }
          //fetchCreaterEmail using ID
          this.fetchExecutiveEmail();
        },
        (err) => {
          this.snackBarService.showWarningSnack('Costing sheet not found');
          console.log(err);
        }
      );
  }

  fetchCustomers() {
    this.employeeService.getActiveCustomers().subscribe(
      (data) => {
        this.customers = data;

        //apply filter for exectuive
        if (this.accessType == 'Sales Team') {
          this.mExecutiveService
            .getByExecutiveEmail(localStorage.getItem('emailToken'))
            .subscribe(
              (data) => {
                this.customers = this.customers.filter(
                  (obj) => obj.executiveCode == data['code']
                );
              },
              (err) => console.log(err)
            );
        }

        //apply filter for TManager
        else if (this.accessType == 'TManager') {
          this.mUserService.getById(localStorage.getItem('id')).subscribe(
            (data) => {
              let territoryIds: string[] = data.territoryId;
              this.customers = this.customers.filter((obj) =>
                territoryIds.includes(obj.territory)
              );
              if (this.customers.length < 1) {
                alert(
                  'No customers found under the territories mapped for the current user'
                );
              }
            },
            (err) => {
              console.log(err);
            }
          );
        }
      },
      (err) => console.log(err)
    );
  }

  fetchCustomerName() {
    let index = this.customers.findIndex(
      (obj) => String(obj.id) == this.costing.customerId
    );
    this.costing.customerName = this.customers[index].companyname;
    if (this.costing.tManagerEmail != '') {
      //Costing is being created by tManager, so set the execId
      this.fetchExecutiveIdUsingExecCode(this.customers[index].executiveCode);
    }
  }

  back() {
    if (this.isSuperUser) {
      if (this.previousPage == 'costingApproval') {
        this.router.navigate(['/home/costingApproval']);
      } else if (this.previousPage == 'costingRejected') {
        this.router.navigate(['/home/costingRejected']);
      } else if (this.previousPage == 'costingList') {
        this.router.navigate(['/home/costingList']);
      } else if (this.previousPage == 'login') {
        this.router.navigate(['/home/costingApproval']);
      }
    } else {
      //Get back to costing list tab
      this.router.navigate(['/home/costingList']);
    }
  }

  roundToTwo(num): number {
    return +(Math.round(Number(num + 'e+2')) + 'e-2');
  }

  roundToFour(num): number {
    return +(Math.round(Number(num + 'e+4')) + 'e-4');
  }

  calcLabelCost() {
    this.costing.hrRaiper = this.roundToFour(
      (this.costing.rpmRaiper / this.costing.totalPicks) *
        this.costing.noOfRepeats *
        60
    );
    this.costing.hrAirjet = this.roundToFour(
      (this.costing.rpmAirjet / this.costing.totalPicks) *
        this.costing.noOfRepeats *
        60
    );
    this.costing.labelCostRaiper = this.roundToFour(
      (this.costing.entryDate <= '2022-02-17' ? 1350 : 1500) /
        this.costing.hrRaiper
    );
    this.costing.labelCostAirjet = this.roundToFour(
      (this.costing.entryDate <= '2022-02-17' ? 1900 : 2050) /
        this.costing.hrAirjet
    );
    this.calcEstimateCost();
  }

  calcEstimateCost() {
    this.costing.estimateCostRaiper = this.roundToFour(
      this.costing.labelCostRaiper +
        this.roundToFour(
          this.costing.additionalWork * this.costing.labelCostRaiper
        ) +
        this.roundToFour(
          this.costing.productionCost * this.costing.labelCostRaiper
        ) +
        this.roundToFour(
          this.costing.qcAndPackingCost * this.costing.labelCostRaiper
        ) +
        this.roundToFour(
          this.costing.adminCost * this.costing.labelCostRaiper
        ) +
        this.roundToFour(
          this.costing.deliveryCost * this.costing.labelCostRaiper
        ) +
        this.roundToFour(this.costing.profit * this.costing.labelCostRaiper)
    );

    this.costing.estimateCostAirjet = this.roundToFour(
      this.costing.labelCostAirjet +
        this.roundToFour(
          this.costing.additionalWork * this.costing.labelCostAirjet
        ) +
        this.roundToFour(
          this.costing.productionCost * this.costing.labelCostAirjet
        ) +
        this.roundToFour(
          this.costing.qcAndPackingCost * this.costing.labelCostAirjet
        ) +
        this.roundToFour(
          this.costing.adminCost * this.costing.labelCostAirjet
        ) +
        this.roundToFour(
          this.costing.deliveryCost * this.costing.labelCostAirjet
        ) +
        this.roundToFour(this.costing.profit * this.costing.labelCostAirjet)
    );

    this.calcFinancialCharge();
  }

  calcFinancialCharge() {
    if (
      this.costing.paymentTerms == '45 Days' ||
      this.costing.paymentTerms == '60 Days' ||
      this.costing.paymentTerms == '90 Days'
    ) {
      let numOfDays: number = 0;
      switch (this.costing.paymentTerms) {
        case '45 Days':
          numOfDays = 15;
          break;
        case '60 Days':
          numOfDays = 30;
          break;
        case '90 Days':
          numOfDays = 60;
          break;
        default:
          console.log('Error while calculating financial charge');
      }
      this.costing.financialChargeRaiper = this.costing.estimateCostRaiper
        ? this.roundToFour(
            (((this.costing.estimateCostRaiper *
              this.costing.estimatedQuantity *
              0.12) /
              365) *
              numOfDays) /
              this.costing.estimatedQuantity
          )
        : null;
      this.costing.financialChargeAirjet = this.costing.estimateCostAirjet
        ? this.roundToFour(
            (((this.costing.estimateCostAirjet *
              this.costing.estimatedQuantity *
              0.12) /
              365) *
              numOfDays) /
              this.costing.estimatedQuantity
          )
        : null;
    } else {
      this.costing.financialChargeRaiper = null;
      this.costing.financialChargeAirjet = null;
    }

    this.calcTotalEstimateCost();
  }

  calcTotalEstimateCost() {
    if (this.costing.estimateCostRaiper) {
      this.costing.totalEstimateCostRaiper = this.roundToFour(
        this.costing.estimateCostRaiper +
          (this.costing.financialChargeRaiper
            ? this.costing.financialChargeRaiper
            : 0)
      );
    }
    if (this.costing.estimateCostAirjet) {
      this.costing.totalEstimateCostAirjet = this.roundToFour(
        this.costing.estimateCostAirjet +
          (this.costing.financialChargeAirjet
            ? this.costing.financialChargeAirjet
            : 0)
      );
    }
  }

  convertVariableCost() {
    this.costing.additionalWork = this.variableCosts.additionalWork
      ? this.roundToFour(this.variableCosts.additionalWork / 100)
      : null;
    this.costing.productionCost = this.variableCosts.productionCost
      ? this.roundToFour(this.variableCosts.productionCost / 100)
      : null;
    this.costing.qcAndPackingCost = this.variableCosts.qcAndPackingCost
      ? this.roundToFour(this.variableCosts.qcAndPackingCost / 100)
      : null;
    this.costing.adminCost = this.variableCosts.adminCost
      ? this.roundToFour(this.variableCosts.adminCost / 100)
      : null;
    this.costing.deliveryCost = this.variableCosts.deliveryCost
      ? this.roundToFour(this.variableCosts.deliveryCost / 100)
      : null;
    this.costing.profit = this.variableCosts.profitMargin
      ? this.roundToFour(this.variableCosts.profitMargin / 100)
      : null;
    this.calcEstimateCost();
  }

  convertBackToVariableCost() {
    this.variableCosts.additionalWork = this.roundToFour(
      this.costing.additionalWork * 100
    );
    this.variableCosts.productionCost = this.roundToFour(
      this.costing.productionCost * 100
    );
    this.variableCosts.qcAndPackingCost = this.roundToFour(
      this.costing.qcAndPackingCost * 100
    );
    this.variableCosts.adminCost = this.roundToFour(
      this.costing.adminCost * 100
    );
    if (this.costing.deliveryCost) {
      this.variableCosts.deliveryCost = this.roundToFour(
        this.costing.deliveryCost * 100
      );
    } else {
      this.variableCosts.deliveryCost = 0;
      this.costing.deliveryCost = 0;
    }

    this.variableCosts.profitMargin = this.roundToFour(
      this.costing.profit * 100
    );
  }

  addLineItem() {
    if (this.validator.isEmptyString(this.slabRates.quantitySlab)) {
      this.snackBarService.showWarningSnack('Please select the Quantity Slab');
    } else if (this.validator.isNotANumber(this.slabRates.price)) {
      this.snackBarService.showWarningSnack('Please enter the price');
    } else {
      this.costing.slabRates.push(this.slabRates);
      this.snackBarService.showSuccessSnack('Line Item added successfully');
      this.slabRates = new SlabRates();
    }
  }

  deleteLineItem(index: number) {
    this.costing.slabRates.splice(index, 1);
  }

  getAttachmentExtension(): string {
    let name = this.attachment.name;
    return name.substr(name.lastIndexOf('.') + 1);
  }

  onFileChange(e) {
    this.imageUpdateFlag = true;
    const file = e.srcElement.files[0];
    if (file) {
      this.attachment = file;
      this.attachmentSrc = window.URL.createObjectURL(file);
      this.costing.attachmentExtension =
        this.getAttachmentExtension().toLowerCase();
    } else {
      this.attachment = null;
      this.costing.attachmentExtension = '';
      this.attachmentSrc = '';
    }
  }

  openImage() {
    // let fileURL = window.URL.createObjectURL(this.attachment);
    window.open().location.href = this.attachmentSrc;
  }

  uploadImage(refNo?: string, update?: boolean, approvalReq?: boolean) {
    this.costingService
      .uploadWovenAttachment(
        this.attachment,
        this.costing.attachmentExtension,
        this.costing.entryDate,
        refNo
      )
      .subscribe(
        (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            // this.progress = Math.round((100 * event.loaded) / event.total);
          } else if (event instanceof HttpResponse) {
            console.log('Data received : ');
            console.log(event.body.message);

            this.snackBarService.showSuccessSnack(
              `Costing sheet ${
                approvalReq
                  ? 'approval request sent successfully'
                  : update
                  ? 'updated successfully'
                  : 'saved successfully with Reference No: ' + refNo
              }`
            );

            this.back();
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  validateExecutiveInput(): boolean {
    let flag = false;
    if (this.validator.isEmptyString(this.costing.entryDate)) {
      this.snackBarService.showWarningSnack(
        'System Date Error. Please contact the Administrator'
      );
    } else if (this.validator.isEmptyString(this.costing.customerId)) {
      this.snackBarService.showWarningSnack('Please Select the Customer');
    } else if (this.validator.isNotANumber(this.costing.estimatedQuantity)) {
      this.snackBarService.showWarningSnack(
        'Please enter the Estimated Quantity'
      );
    } else if (this.validator.isEmptyString(this.costing.labelName)) {
      this.snackBarService.showWarningSnack('Please enter the Label Name');
    } else if (this.validator.isNotANumber(this.costing.labelWidth)) {
      this.snackBarService.showWarningSnack('Please enter the Label Width');
    } else if (this.validator.isNotANumber(this.costing.labelLength)) {
      this.snackBarService.showWarningSnack('Please enter the Label Length');
    } else if (this.validator.isNotANumber(this.costing.noOfColors)) {
      this.snackBarService.showWarningSnack('Please enter the No of Colors');
    } else if (this.validator.isEmptyString(this.costing.paymentTerms)) {
      this.snackBarService.showWarningSnack('Please select the payment terms');
    } else if (this.validator.isEmptyString(this.costing.attachmentExtension)) {
      this.snackBarService.showWarningSnack(
        'Please add the Artwork / label attachment'
      );
    } else if (
      this.costing.attachmentExtension.toLowerCase() != 'jpg' &&
      this.costing.attachmentExtension.toLowerCase() != 'png' &&
      this.costing.attachmentExtension.toLowerCase() != 'jpeg' &&
      this.costing.attachmentExtension.toLowerCase() != 'pdf'
    ) {
      this.snackBarService.showWarningSnack(
        'Please select only jpg / jpeg / png / pdf files for Artwork / label attachment'
      );
    } else if (
      this.validator.isEmptyString(this.costing.executiveId) &&
      this.validator.isEmptyString(this.costing.tManagerEmail)
    ) {
      this.snackBarService.showWarningSnack(
        this.accessType == 'TManager'
          ? 'Territory Manager - email Not found'
          : 'Executive - UserID Not found'
      );
    } // NOTE: this validation must come at the end, since it has nested validations
    else if (this.imageUpdateFlag) {
      if (this.attachment) {
        if (this.attachment.size > 2000000) {
          this.snackBarService.showWarningSnack('Attached file exceeds 2MB');
        } else {
          flag = true;
        }
      } else {
        this.snackBarService.showWarningSnack(
          'File Attachment error. Please try again'
        );
      }
    } else {
      flag = true;
    }
    return flag;
  }

  saveCostingInputByExecutive() {
    this.disableSaveBtn = true;
    if (this.validateExecutiveInput()) {
      this.costingService.createWoven(this.costing).subscribe(
        (data) => {
          if (data) {
            this.uploadImage(data.refNo);
          } else {
            // we received null - indicating recursion failure
            alert(
              'R - Error while saving - Woven costing sheet. Please contact the administrator.'
            );
            console.log(
              'Recursion failure - Indicating Mismatch in Reference Number sequence'
            );
            this.disableSaveBtn = false;
          }
        },
        (err) => {
          alert(
            'Error while saving - Woven costing sheet. Please contact the administrator'
          );
          console.log(err);
          this.disableSaveBtn = false;
        }
      );
    } else {
      this.disableSaveBtn = false;
    }
  }

  updateCostingInputByExecutive() {
    if (this.validateExecutiveInput()) {
      this.costingService.updateWoven(this.costing).subscribe(
        (data) => {
          if (data) {
            if (this.imageUpdateFlag) {
              this.uploadImage(this.costing.refNo, true);
            } else {
              this.snackBarService.showSuccessSnack(
                `Costing sheet updated successfully`
              );
              this.back();
            }
          } else {
            alert('Error while updating costing sheet. Please try again');
            console.log('Common details updation failure');
          }
        },
        (err) => {
          alert('Error while updating costing sheet. Please try again');
          console.log(err);
        }
      );
    }
  }

  validateSampleHeadInput(): boolean {
    let flag: boolean = false;
    if (!this.validateExecutiveInput()) {
      flag = false;
    } else if (this.validator.isNotANumber(this.costing.totalPicks)) {
      this.snackBarService.showWarningSnack('Please enter the Total Picks');
    } else if (this.validator.isNotANumber(this.costing.noOfRepeats)) {
      this.snackBarService.showWarningSnack('Please enter the No of Repeats');
    } else if (
      this.validator.isNotANumber(this.costing.rpmRaiper) ||
      this.costing.rpmRaiper != 450
    ) {
      this.snackBarService.showWarningSnack(
        'Machine / RPM / Raiper value has been altered manually. Please refresh the page and try again'
      );
    } else if (
      this.validator.isNotANumber(this.costing.rpmAirjet) ||
      this.costing.rpmAirjet != 700
    ) {
      this.snackBarService.showWarningSnack(
        'Machine / RPM / Airjet value has been altered manually. Please refresh the page and try again'
      );
    } else if (this.validator.isNotANumber(this.costing.additionalWork)) {
      this.snackBarService.showWarningSnack('Please enter the Additional Work');
    } else if (this.validator.isNotANumber(this.costing.productionCost)) {
      this.snackBarService.showWarningSnack('Please enter the Production Cost');
    } else if (this.validator.isNotANumber(this.costing.qcAndPackingCost)) {
      this.snackBarService.showWarningSnack(
        'Please enter the QC & Packaging Cost'
      );
    } else if (this.validator.isNotANumber(this.costing.adminCost)) {
      this.snackBarService.showWarningSnack('Please enter the Admin Cost');
    } else if (this.validator.isNotANumber(this.costing.deliveryCost)) {
      this.snackBarService.showWarningSnack('Please enter the Delivery Cost');
    } else if (this.validator.isNotANumber(this.costing.profit)) {
      this.snackBarService.showWarningSnack('Please enter the Profit');
    } else if (this.validator.isNotANumber(this.costing.estimateCostRaiper)) {
      this.snackBarService.showWarningSnack(
        'Error while calculating Estimate Cost Raiper. Please Try Again'
      );
    } else if (this.validator.isNotANumber(this.costing.estimateCostAirjet)) {
      this.snackBarService.showWarningSnack(
        'Error while calculating Estimate Cost Airjet. Please Try Again'
      );
    } else {
      flag = true;
    }
    return flag;
  }

  updateCostingInputBySampleHead(approvalReq?: boolean) {
    if (this.validateSampleHeadInput()) {
      this.costingService.updateWoven(this.costing).subscribe(
        (data) => {
          if (data) {
            if (this.imageUpdateFlag) {
              this.uploadImage(this.costing.refNo, true);
            } else {
              this.snackBarService.showSuccessSnack(
                `Costing sheet ${
                  approvalReq ? 'approval request sent' : 'updated'
                } successfully`
              );
              this.back();
            }
          } else {
            alert('Error while updating costing sheet. Please try again');
            console.log('Common details updation failure');
          }
        },
        (err) => {
          alert('Error while updating costing sheet. Please try again');
          console.log(err);
        }
      );
    }
  }

  sendForApprovalBySampleHead() {
    if (this.validateSampleHeadInput()) {
      //updating the status
      this.costing.status = 1;

      this.updateCostingInputBySampleHead(true);

      this.sendCostingApprovalEmail();
    }
  }

  initializeCostingApprovalDetails(forCustomer?: boolean) {
    this.costingApprovalDetails.entryDate = this.costing.entryDate;
    this.costingApprovalDetails.refNo = this.costing.refNo;
    this.costingApprovalDetails.productName = this.costing.labelName;
    this.costingApprovalDetails.customerName = this.costing.customerName;
    this.costingApprovalDetails.trimType = 'Woven';
    this.costingApprovalDetails.productLength = String(
      this.costing.labelLength + ' CM'
    );
    this.costingApprovalDetails.productWidth = String(
      this.costing.labelWidth + ' CM'
    );
    this.costingApprovalDetails.paymentTerms = this.costing.paymentTerms;
    this.costingApprovalDetails.slabRates = this.costing.slabRates;
    if (!forCustomer) {
      this.costingApprovalDetails.approvalLink = `${Configuration.domainURL}header/login/costingApproval/Woven--${this.costing.id}`;
    } else {
      this.costingApprovalDetails.approvalLink = `${Configuration.domainURL}header/login/costingApprovalForCustomer/Woven--${this.costing.id}`;
    }
  }

  resetCostingApprovalDetails() {
    this.costingApprovalDetails = new CostingApprovalDetails();
  }

  sendCostingApprovalEmail() {
    this.initializeCostingApprovalDetails();
    this.costingService
      .sendCostingApprovalEmail(this.costingApprovalDetails)
      .subscribe(
        (data) => {
          if (data) {
            this.snackBarService.showSuccessSnack('Email Sent Successfully');
          } else {
            console.log('Error while sending email');
          }
        },
        (err) => console.log(err)
      );
  }

  validateAdministratorInput(): boolean {
    if (this.validateSampleHeadInput()) {
      if (this.costing.slabRates.length < 1) {
        this.snackBarService.showWarningSnack(
          'Please add atleast one slab rate'
        );
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  updateCostingInputByAdministrator(reject?: boolean) {
    if (reject) {
      this.costingService.updateWoven(this.costing).subscribe(
        (data) => {
          this.snackBarService.showSuccessSnack(
            'Costing sheet rejected successfully'
          );
        },
        (err) => console.log('Error while rejecting costing sheet')
      );
    } else {
      if (this.validateAdministratorInput()) {
        this.costingService.updateWoven(this.costing).subscribe(
          (data) => {
            if (data) {
              this.snackBarService.showSuccessSnack(
                `Costing sheet approved successfully`
              );
              this.back();
            } else {
              alert('Error while updating costing sheet. Please try again');
              console.log('Common details updation failure');
            }
          },
          (err) => {
            alert('Error while updating costing sheet. Please try again');
            console.log(err);
          }
        );
      } else {
        // to prevent UI changes
        this.costing.status = this.statusReference;
      }
    }
  }

  approve() {
    this.statusReference = this.costing.status;
    // this.costing.status = 2;
    this.costing.approverId = localStorage.getItem('emailToken');
    // this.updateCostingInputByAdministrator();
    this.sendForCustomerApproval();
  }

  reject() {
    this.costing.status = 3;
    this.costing.approverId = localStorage.getItem('emailToken');
    this.updateCostingInputByAdministrator(true);
  }

  //costing PDF
  downloadPdf() {
    //create first image

    const costingModal = document.getElementById('pdf-container-woven');
    const options = {
      background: 'white',
      scale: 2,
      useCORS: true,
    };
    // costingModal.style.margin = '28px';

    html2canvas(costingModal, options)
      .then((canvas) => {
        var img = canvas.toDataURL('image/PNG');
        var doc = new jsPDF('portrait', 'mm', 'a4', true);
        //can use [297, 210] instead of a4 as well
        // Add image Canvas to PDF
        const bufferX = 5;
        const bufferY = 5;
        const imgProps = (<any>doc).getImageProperties(img);
        // const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        //Experimental
        var imgData = canvas.toDataURL('image/png');
        var imgWidth = 210;
        var pageHeight = 295;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        var heightLeft = imgHeight;
        // Commented for Size issues
        // var doc = new jsPDF('p', 'mm');
        var position = 0;

        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        //Experimental

        // doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 1);

        return doc;
      })

      .then((doc) => {
        doc.save(this.costing.refNo);
      });
  }

  fetchCustomerEmail(id) {
    return this.customers.find((obj) => obj.id == id).emailId;
  }

  sendForCustomerApproval() {
    //flag to disable sendForCustomerApproval Btn
    // this.disableSendForCustomerApprovalBtn = true;
    this.disableAdminApprovalBtn = true;

    //Initialize CostingApprovalDetails Object - It contains the details to be sent over in the mail
    this.initializeCostingApprovalDetails(true);

    //Sending Costing Approval Mail for Customer
    this.costingService
      .sendCostingApprovalEmailForCustomer(
        this.costingApprovalDetails,
        this.fetchCustomerEmail(this.costing.customerId)
      )
      .subscribe(
        (data) => {
          //If return response is not an error
          if (data) {
            //change the status to waiting for customer approval
            this.costing.status = 4;

            //update the costing status on MWovenCosting and MCommonDetailsCosting
            this.costingService.updateWoven(this.costing).subscribe(
              (data) => {
                if (data) {
                  this.snackBarService.showSuccessSnack(
                    'Costing approval request sent successfully'
                  );
                  this.back();
                } else {
                  this.costing.status = this.statusReference;
                  this.snackBarService.showWarningSnack(
                    'Error while updating costing status. Please try again'
                  );
                  // this.disableSendForCustomerApprovalBtn = false;
                  this.disableAdminApprovalBtn = false;
                }
              },
              (err) => {
                this.costing.status = this.statusReference;
                this.snackBarService.showWarningSnack(
                  'Error while updating costing status. Please try again'
                );
                console.log(err);
                // this.disableSendForCustomerApprovalBtn = false;
                this.disableAdminApprovalBtn = false;
              }
            );
          } else {
            this.snackBarService.showWarningSnack(
              'Error while sending costing approval email. Please try again'
            );
            // this.disableSendForCustomerApprovalBtn = false;
            this.disableAdminApprovalBtn = false;
          }
        },
        (err) => {
          this.snackBarService.showWarningSnack(
            "Error: Couldn't send costing approval email to customer"
          );
          console.log(err);
          // this.disableSendForCustomerApprovalBtn = false;
          this.disableAdminApprovalBtn = false;
        }
      );
  }

  approveByCustomer = async () => {
    let flag = window.confirm('Proceed to approve costing?');
    if (flag) {
      try {
        let res = await this.costingService.approveWovenByCustomer(
          this.costing.id
        );
        if (res) {
          this.snackBarService.showSuccessSnack(
            'Costing has been approved successfully'
          );
          this.costing.status = 5;
          this.initializeCostingApprovalDetails();
          //to the executive / tmanager
          await this.costingService.sendCostingApprovedorRejectedMail(
            this.costingApprovalDetails,
            this.costing.tManagerEmail
              ? this.costing.tManagerEmail
              : this.executiveEmail,
            true
          );
        }
      } catch (err) {
        this.snackBarService.showWarningSnack(
          'Error while approving costing. Please contact the administrator'
        );
        console.log(err);
      }
    }
  };

  rejectByCustomer = async () => {
    let reason = window.prompt(
      'Please specify the reason to reject costing?',
      ''
    );
    if (reason != '' && reason != null) {
      try {
        let res = await this.costingService.rejectWovenByCustomer(
          this.costing.id,
          reason
        );
        if (res) {
          this.snackBarService.showSuccessSnack(
            'Costing has been rejected successfully'
          );
          this.costing.status = 6;
          this.initializeCostingApprovalDetails();
          //to the executive / tmanager
          await this.costingService.sendCostingApprovedorRejectedMail(
            this.costingApprovalDetails,
            this.costing.tManagerEmail
              ? this.costing.tManagerEmail
              : this.executiveEmail,
            false
          );
        }
      } catch (err) {
        this.snackBarService.showWarningSnack(
          'Error while rejecting costing. Please contact the administrator'
        );
        console.log(err);
      }
    } else {
      this.snackBarService.showWarningSnack(
        'Invalid input for rejected reason. Please try again'
      );
    }
  };

  createDraftOrder() {
    this.disableDraftOrderBtn = true;
    if (this.costingService.createDraftOrderWoven(this.costing.id)) {
      this.snackBarService.showSuccessSnack('Draft order created successfully');
      this.back();
    } else {
      this.snackBarService.showSuccessSnack('Error while creating draft order');
      this.disableDraftOrderBtn = false;
    }
  }
  
}
