import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrintedCosting } from 'src/app/v2/components/costingNew/model/printed-costing';
import { DateFormatter } from '../../../../utility-classes/date-formatter';
import { Validator } from '../../../../utility-classes/validator';
import { SnackBarService } from 'src/app/services/snackBar.service';
import { CostingService } from '../services/costing.service';
import { CommonDetailsCosting } from '../model/common-details-costing';
import { VariableCostsPrinted } from '../model/variable-costs-printed';
import { SlabRates } from '../model/slab-rates';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Employee } from 'src/app/models/employee';
import { EmployeeService } from '../../../../services/employee.service';
import { MexecutiveService } from '../../../../services/mexecutive.service';
import { UserService } from '../../../../services/user.service';
import { MTape } from '../../../../models/mTape';
import { MTapeService } from '../../../../services/mTape.service';
import { MotherdetailsService } from '../../../../services/motherdetails.service';
import { MotherDetails } from 'src/app/models/motherdetails';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CostingApprovalDetails } from '../model/costing-approval-details';
import { Configuration } from '../../../../configuration';
import { TimeService } from '../../../../services/time.service';

@Component({
  selector: 'app-printed-costing',
  templateUrl: './printed-costing.component.html',
  styleUrls: ['./printed-costing.component.css'],
})
export class PrintedCostingComponent implements OnInit {
  //flag to render the page for creation / updation
  isNew: boolean = true;

  costing: PrintedCosting;

  commonDetailsCosting: CommonDetailsCosting;

  displayDate: string;

  customers: Employee[];

  validator: Validator;

  slabRates: SlabRates;

  accessType: string;
  isSuperUser: boolean = false;

  attachmentSrc = '';
  attachment: File;
  imageUpdateFlag: boolean = false;

  tape: MTape;
  tapes: MTape[];

  public generalDetailsReadOnly: boolean = true;

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
    private tapeService: MTapeService,
    private mOtherdetailsService: MotherdetailsService,
    private mExecutiveService: MexecutiveService,
    private mUserService: UserService,
    private timeService: TimeService
  ) {
    this.costing = new PrintedCosting();
    this.commonDetailsCosting = new CommonDetailsCosting();
    this.validator = new Validator();
    this.slabRates = new SlabRates();
    this.tape = new MTape();
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
    this.fetchTapes();
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
  }

  fetchExecutiveId() {
    //this id will be used to set the executiveId field of printedCosting model while saving for the first time
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
        console.log(data);
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
      .getOtherDetailsPrinted('Additional Work', 'true')
      .subscribe(
        (data) => {
          this.mOtherDetails = data;
        },
        (err) => console.log('Error while fetching other details')
      );
  }

  fetchExistingCosting() {
    this.costingService
      .getPrintedByid(this.route.snapshot.params['id'])
      .subscribe(
        (data) => {
          this.costing = data;
          this.displayDate = this.dateFormatter.convertDateToDDMMYYYY(
            data.entryDate
          );

          //In here we get the status
          this.userAccessControl();

          if (this.costing.attachmentExtension != 'pdf') {
            this.costingService
              .getPrintedAttachmentImage(
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
              .getPrintedAttachmentPdf(
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

  roundDown(num): number {
    return Math.floor(num);
  }

  onTapeNameChange() {
    let index = this.tapes.findIndex((obj) => obj.id == this.costing.tapeId);
    this.costing.tapeName = this.tapes[index].name;
    this.costing.tapeWidthMM = this.tapes[index].width;
    this.costing.tapeCostPerMeter = this.tapes[index].costPerMeter;
    this.calcTapeCostPerLabel();
  }

  OnLabelLengthChange() {
    this.costing.noOfLabelsPerMeter = this.roundDown(
      1000 / (this.costing.labelLength * 10)
    );
    this.calcTapeCostPerLabel();
  }

  calcTapeCostPerLabel() {
    if (this.costing.tapeCostPerMeter && this.costing.noOfLabelsPerMeter) {
      this.costing.tapeCostPerLabel = this.roundToFour(
        this.costing.tapeCostPerMeter / this.costing.noOfLabelsPerMeter
      );
      this.calcEstimateCost();
    }
  }

  calcPlateCost() {
    this.costing.plateCost = this.roundToFour(
      this.costing.variableCosts.plateCost / this.costing.estimatedQuantity
    );
    this.calcEstimateCost();
  }

  calcEstimateCost() {
    this.costing.estimateCost = this.roundToFour(
      this.costing.tapeCostPerLabel +
        this.costing.plateCost +
        this.costing.inkCost +
        this.costing.cuttingCost +
        this.costing.productionCost +
        this.costing.qcAndPackingCost +
        this.costing.adminCost +
        this.costing.deliveryCost +
        this.costing.margin
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
      this.costing.financialCharge = this.costing.estimateCost
        ? this.roundToFour(
            (((this.costing.estimateCost *
              this.costing.estimatedQuantity *
              0.12) /
              365) *
              numOfDays) /
              this.costing.estimatedQuantity
          )
        : null;
    } else {
      this.costing.financialCharge = null;
    }
    this.calcTotalEstimateCost();
  }

  calcTotalEstimateCost() {
    if (this.costing.estimateCost) {
      this.costing.totalEstimateCost = this.roundToFour(
        this.costing.estimateCost +
          (this.costing.financialCharge ? this.costing.financialCharge : 0)
      );
    }
  }

  convertVariableCost() {
    this.costing.plateCost = this.costing.variableCosts.plateCost
      ? this.roundToFour(
          this.costing.variableCosts.plateCost / this.costing.estimatedQuantity
        )
      : null;
    this.costing.inkCost = this.costing.variableCosts.inkCost
      ? this.roundToFour(
          this.costing.variableCosts.inkCost * this.costing.tapeCostPerLabel
        )
      : null;
    this.costing.cuttingCost = this.costing.variableCosts.cuttingCost
      ? this.roundToFour(
          this.costing.variableCosts.cuttingCost * this.costing.tapeCostPerLabel
        )
      : null;
    this.costing.productionCost = this.costing.variableCosts.productionCost
      ? this.roundToFour(
          this.costing.variableCosts.productionCost *
            this.costing.tapeCostPerLabel
        )
      : null;
    this.costing.qcAndPackingCost = this.costing.variableCosts.qcAndPackingCost
      ? this.roundToFour(
          this.costing.variableCosts.qcAndPackingCost *
            this.costing.tapeCostPerLabel
        )
      : null;
    this.costing.adminCost = this.costing.variableCosts.adminCost
      ? this.roundToFour(
          this.costing.variableCosts.adminCost * this.costing.tapeCostPerLabel
        )
      : null;
    this.costing.margin = this.costing.variableCosts.margin
      ? this.roundToFour(
          this.costing.variableCosts.margin * this.costing.tapeCostPerLabel
        )
      : null;
    this.calcEstimateCost();
  }

  convertBackToVariableCost() {
    this.costing.variableCosts.plateCost = this.roundToFour(
      this.costing.plateCost * this.costing.estimatedQuantity
    );
    this.costing.variableCosts.inkCost = this.roundToFour(
      this.costing.inkCost / this.costing.tapeCostPerLabel
    );
    this.costing.variableCosts.cuttingCost = this.roundToFour(
      this.costing.cuttingCost / this.costing.tapeCostPerLabel
    );
    this.costing.variableCosts.productionCost = this.roundToFour(
      this.costing.productionCost / this.costing.tapeCostPerLabel
    );
    this.costing.variableCosts.qcAndPackingCost = this.roundToFour(
      this.costing.qcAndPackingCost / this.costing.tapeCostPerLabel
    );
    this.costing.variableCosts.adminCost = this.roundToFour(
      this.costing.adminCost / this.costing.tapeCostPerLabel
    );
    this.costing.variableCosts.margin = this.roundToFour(
      this.costing.margin / this.costing.tapeCostPerLabel
    );
  }

  addLineItem() {
    if (this.validator.isEmptyString(this.slabRates.quantitySlab)) {
      this.snackBarService.showWarningSnack('Please select the Quantity Slab');
    } else if (this.validator.isNotANumber(this.slabRates.price)) {
      this.snackBarService.showWarningSnack('Please select the Quantity Slab');
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
      .uploadPrintedAttachment(
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
                  : 'saved successfully with Refernce No : ' + refNo
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
    } else if (this.validator.isEmptyString(this.costing.tapeName)) {
      this.snackBarService.showWarningSnack('Please enter the Tape Name');
    } else if (this.validator.isNotANumber(this.costing.tapeWidthMM)) {
      this.snackBarService.showWarningSnack('Please enter the Tape Width');
    } else if (this.validator.isNotANumber(this.costing.tapeCostPerMeter)) {
      this.snackBarService.showWarningSnack(
        'Autofetching error - Tape cost per meter'
      );
    } else if (this.validator.isNotANumber(this.costing.labelWidth)) {
      this.snackBarService.showWarningSnack('Please enter the Label Width');
    } else if (this.validator.isNotANumber(this.costing.labelLength)) {
      this.snackBarService.showWarningSnack('Please enter the Label Length');
    } else if (this.validator.isNotANumber(this.costing.noOfLabelsPerMeter)) {
      this.snackBarService.showWarningSnack(
        'Autocalculation error - No of Labels / Meter'
      );
    } else if (this.validator.isNotANumber(this.costing.noOfColors)) {
      this.snackBarService.showWarningSnack('Please enter the No of Colors');
    } else if (this.validator.isEmptyString(this.costing.paymentTerms)) {
      this.snackBarService.showWarningSnack('Please select the Payment Terms');
    } else if (this.validator.isNotANumber(this.costing.tapeCostPerLabel)) {
      this.snackBarService.showWarningSnack(
        'Autocalculation error - Tape cost / label'
      );
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
      this.costingService.createPrinted(this.costing).subscribe(
        (data) => {
          if (data) {
            this.uploadImage(data.refNo);
          } else {
            // we received null - indicating recursion failure
            alert(
              'R - Error while saving - Printed costing sheet. Please contact the administrator.'
            );
            console.log(
              'Recursion failure - Indicating Mismatch in Reference Number sequence'
            );
            this.disableSaveBtn = false;
          }
        },
        (err) => {
          alert(
            'Error while saving - Printed costing sheet. Please contact the administrator'
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
      this.costingService.updatePrinted(this.costing).subscribe(
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
    } else if (this.validator.isNotANumber(this.costing.plateCost)) {
      this.snackBarService.showWarningSnack('Please enter the Plate Cost');
    } else if (this.validator.isNotANumber(this.costing.inkCost)) {
      this.snackBarService.showWarningSnack('Please enter the Ink Cost');
    } else if (this.validator.isNotANumber(this.costing.cuttingCost)) {
      this.snackBarService.showWarningSnack('Please enter the Cutting Cost');
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
    } else if (this.validator.isNotANumber(this.costing.margin)) {
      this.snackBarService.showWarningSnack('Please enter the Margin');
    } else if (this.validator.isNotANumber(this.costing.estimateCost)) {
      this.snackBarService.showWarningSnack(
        'Error while calculating Total Estimate Cost. Please Try Again'
      );
    } else {
      flag = true;
    }
    return flag;
  }

  updateCostingInputBySampleHead(approvalReq?: boolean) {
    if (this.validateSampleHeadInput()) {
      this.costingService.updatePrinted(this.costing).subscribe(
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
    this.costingApprovalDetails.productName = this.costing.tapeName;
    this.costingApprovalDetails.customerName = this.costing.customerName;
    this.costingApprovalDetails.trimType = 'Printed';
    this.costingApprovalDetails.productLength = String(
      this.costing.labelLength + ' CM'
    );
    this.costingApprovalDetails.productWidth = String(
      this.costing.labelWidth + ' CM'
    );
    this.costingApprovalDetails.paymentTerms = this.costing.paymentTerms;
    this.costingApprovalDetails.slabRates = this.costing.slabRates;
    if (!forCustomer) {
      this.costingApprovalDetails.approvalLink = `${Configuration.domainURL}header/login/costingApproval/Printed--${this.costing.id}`;
    } else {
      this.costingApprovalDetails.approvalLink = `${Configuration.domainURL}header/login/costingApprovalForCustomer/Printed--${this.costing.id}`;
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
      this.costingService.updatePrinted(this.costing).subscribe(
        (data) => {
          this.snackBarService.showSuccessSnack(
            'Costing sheet rejected successfully'
          );
        },
        (err) => console.log('Error while rejecting costing sheet')
      );
    } else {
      if (this.validateAdministratorInput()) {
        this.costingService.updatePrinted(this.costing).subscribe(
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

    const costingModal = document.getElementById('pdf-container-printed');
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

            //update the costing status on MPrintedCosting and MCommonDetailsCosting
            this.costingService.updatePrinted(this.costing).subscribe(
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
        let res = await this.costingService.approvePrintedByCustomer(
          this.costing.id
        );
        if (res) {
          this.snackBarService.showSuccessSnack(
            'Costing has been approved successfully'
          );
          this.costing.status = 5;
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
        let res = await this.costingService.rejectPrintedByCustomer(
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

    // let flag = window.confirm('Proceed to reject costing?');
    // if (flag) {
    //   try {
    //     let res = await this.costingService.rejectPrintedByCustomer(
    //       this.costing.id
    //     );
    //     if (res) {
    //       this.snackBarService.showSuccessSnack(
    //         'Costing has been rejected successfully'
    //       );
    //       this.costing.status = 6;
    //     }
    //   } catch (err) {
    //     this.snackBarService.showWarningSnack(
    //       'Error while rejecting costing. Please contact the administrator'
    //     );
    //     console.log(err);
    //   }
    // }
  };

  createDraftOrder() {
    this.disableDraftOrderBtn = true;
    if (this.costingService.createDraftOrderPrinted(this.costing.id)) {
      this.snackBarService.showSuccessSnack('Draft order created successfully');
      this.back();
    } else {
      this.snackBarService.showSuccessSnack('Error while creating draft order');
      this.disableDraftOrderBtn = false;
    }
  }
}
