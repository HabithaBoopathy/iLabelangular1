import { Component, OnInit } from '@angular/core';
import { StickerFlexoCosting } from '../model/sticker-flexo-costing';
import { ActivatedRoute, Router } from '@Angular/router';
import { MexecutiveService } from '../../../../services/mexecutive.service';
import { CostingService } from '../services/costing.service';
import { DateFormatter } from 'src/app/utility-classes/date-formatter';
import { SnackBarService } from 'src/app/services/snackBar.service';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { TimeService } from '../../../../services/time.service';
import { Employee } from 'src/app/models/employee';
import { EmployeeService } from 'src/app/services/employee.service';
import { UserService } from '../../../../services/user.service';
import { MPaperService } from '../../../../services/mPaper.service';
import { MPaper } from 'src/app/models/mPaper';
import { Validator } from 'src/app/utility-classes/validator';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { SlabRates } from '../model/slab-rates';
import { CostingApprovalDetails } from '../model/costing-approval-details';
import { Configuration } from 'src/app/configuration';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-sticker-flexo-costing',
  templateUrl: './sticker-flexo-costing.component.html',
  styleUrls: ['./sticker-flexo-costing.component.css'],
})
export class StickerFlexoCostingComponent implements OnInit {
  //flag to render the page for creation / updation
  isNew: boolean = true;

  costing: StickerFlexoCosting;

  accessType: string;
  isSuperUser: boolean = false;
  previousPage: string;

  executiveId: string;
  executiveEmail: string;

  dateFormatter: DateFormatter;
  displayDate: string;

  attachmentSrc = '';
  attachment: File;
  imageUpdateFlag: boolean = false;

  customers: Employee[];

  papers: MPaper[];
  slabRates: SlabRates;

  validator: Validator;

  disableSaveBtn: boolean = false;
  disableSendForCustomerApprovalBtn: boolean = false;
  disableDraftOrderBtn: boolean = false;
  disableAdminApprovalBtn: boolean = false;

  costingApprovalDetails: CostingApprovalDetails;
  statusReference: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private mExecutiveService: MexecutiveService,
    private costingService: CostingService,
    private snackBarService: SnackBarService,
    private location: Location,
    public _d: DomSanitizer,
    private timeService: TimeService,
    private employeeService: EmployeeService,
    private mPaperService: MPaperService,
    private mUserService: UserService
  ) {
    this.costing = new StickerFlexoCosting();
    if (localStorage.getItem('superUser') == 'true') {
      this.isSuperUser = true;
    }
    this.previousPage = this.route.snapshot.paramMap.get('previousPage');
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
    this.dateFormatter = new DateFormatter();
    this.slabRates = new SlabRates();
    this.validator = new Validator();
    this.costingApprovalDetails = new CostingApprovalDetails();
  }

  ngOnInit(): void {
    if (!this.isNew) {
      this.fetchExistingCosting();
    }
    this.fetchCustomers();
    this.fetchPapers();
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
      ((this.accessType == 'Sales Team' || this.accessType == 'TManager') &&
        this.costing.status < 1) ||
      (this.accessType == 'Administrator' && this.isSuperUser)
    ) {
      // this.generalDetailsReadOnly = false;
    } else {
      // this.generalDetailsReadOnly = true;
    }
    // dont use else if here
    if (
      this.accessType == 'Sample Head' ||
      (this.accessType == 'Administrator' && this.isSuperUser)
    ) {
      // this.totalPicksAndNosRepeatsReadOnly = false;
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

  fetchExistingCosting() {
    this.costingService
      .getStickerFlexoByid(this.route.snapshot.params['id'])
      .subscribe(
        (data) => {
          this.costing = data;
          this.displayDate = this.dateFormatter.convertDateToDDMMYYYY(
            data.entryDate
          );
          this.setSlabRateQuantity();
          this.setSlabRatePrice();

          //In here we get the status
          this.userAccessControl();

          //fetch the attachment based on the extension
          if (this.costing.attachmentExtension != 'pdf') {
            this.costingService
              .getStickerFlexoAttachmentImage(
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
              .getStickerFlexoAttachmentPdf(
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

  fetchPapers() {
    this.mPaperService.getAllPapers().subscribe(
      (data) => {
        this.papers = data;
      },
      (err) => {
        alert('Error while fetching papers');
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

  roundToFour(num): number {
    return +(Math.round(Number(num + 'e+4')) + 'e-4');
  }

  onAcrossUpsChange() {
    this.calcTotalPCSPerRepeat();
  }

  onAroundUpsChange() {
    this.calcTotalPCSPerRepeat();
  }

  calcTotalPCSPerRepeat() {
    if (this.costing.acrossUps && this.costing.aroundUps) {
      this.costing.totalPCSPerRepeat = this.roundToFour(
        this.costing.acrossUps * this.costing.aroundUps
      );
    } else {
      this.costing.totalPCSPerRepeat = 0;
    }
    this.calcRequiredMeter();
  }

  onPrintingQuantityChange() {
    this.calcRequiredMeter();
    this.calcDieCuttingDescription();
    this.setSlabRateQuantity();
  }

  onMaterialPriceChange() {
    this.calcRequiredSquareMeter1UnitRate();
    this.calcRequiredSquareMeter2UnitRate();
    this.calcRollChangeWasteUnitRate();
  }

  onRepeatLengthChange() {
    this.calcRequiredMeter();
    this.calcPlateDescription();
  }

  calcRequiredMeter() {
    if (
      this.costing.printingQuantity &&
      this.costing.repeatLength &&
      this.costing.totalPCSPerRepeat
    ) {
      this.costing.requiredMeter = this.roundToFour(
        // this.costing.printingQuantity /
        //   (this.costing.totalPCSPerRepeat * this.costing.repeatLength)
        (this.costing.printingQuantity / this.costing.totalPCSPerRepeat) *
          this.costing.repeatLength
      );
    } else {
      this.costing.requiredMeter = 0;
    }
    this.calcRequiredSquareMeter();
    this.calcPrintingMachineHoursDescription();
  }

  onReelWidthChange() {
    this.calcRequiredSquareMeter();
    this.calcPlateDescription();
    this.calcRequiredSquareMeter2Description();
  }

  calcRequiredSquareMeter() {
    if (this.costing.requiredMeter && this.costing.reelWidth) {
      this.costing.requiredSquareMeter = this.roundToFour(
        this.costing.requiredMeter * this.costing.reelWidth
      );
    } else {
      this.costing.requiredSquareMeter = 0;
    }
    this.calcRequiredSquareMeter1Description();
    this.calcRollChangeWasteDescription();
    this.calcInkDescription();
  }

  onArtWorkHrsCostChange() {
    this.calcArtWorkHrsTotalRate();
  }

  calcArtWorkHrsTotalRate() {
    if (this.costing.artWorkHrs.cost) {
      this.costing.artWorkHrs.totalRate = this.roundToFour(
        this.costing.artWorkHrs.cost
      );
    } else {
      this.costing.artWorkHrs.totalRate = 0;
    }
    this.calcCost();
  }

  onProofReadingHrsCostChange() {
    this.calcProofReadingHrsTotalRate();
  }

  calcProofReadingHrsTotalRate() {
    if (this.costing.proofReadingHrs.cost) {
      this.costing.proofReadingHrs.totalRate = this.roundToFour(
        this.costing.proofReadingHrs.cost
      );
    } else {
      this.costing.proofReadingHrs.totalRate = 0;
    }
    this.calcCost();
  }

  onDieCostChange() {
    this.calcDieTotalRate();
  }

  calcDieTotalRate() {
    if (this.costing.die.cost) {
      this.costing.die.totalRate = this.roundToFour(this.costing.die.cost);
    } else {
      this.costing.die.totalRate = 0;
    }
    this.calcCost();
  }

  onPlateCostChange() {
    this.calcPlateTotalRate();
  }

  calcPlateDescription() {
    if (this.costing.reelWidth && this.costing.repeatLength) {
      this.costing.plate.description = this.roundToFour(
        this.costing.reelWidth * this.costing.repeatLength * 16000
      );
    } else {
      this.costing.plate.description = 0;
    }
    this.calcPlateTotalRate();
  }

  calcPlateTotalRate() {
    if (this.costing.plate.cost && this.costing.plate.description) {
      this.costing.plate.totalRate = this.roundToFour(
        this.costing.plate.cost * this.costing.plate.description
      );
    } else {
      this.costing.plate.totalRate = 0;
    }
    this.calcCost();
  }

  calcRequiredSquareMeter1Description() {
    if (this.costing.requiredSquareMeter) {
      this.costing.requiredSquareMeter1.description = this.roundToFour(
        this.costing.requiredSquareMeter
      );
    } else {
      this.costing.requiredSquareMeter1.description = 0;
    }
    this.calcRequiredSquareMeter1TotalRate();
    this.calcFoilDescription();
    this.calcLaminationAdhesiveDescription();
    this.calcLaminationDescription();
  }

  calcRequiredSquareMeter1UnitRate() {
    if (this.costing.materialPrice) {
      this.costing.requiredSquareMeter1.unitRate = this.roundToFour(
        this.costing.materialPrice
      );
    } else {
      this.costing.requiredSquareMeter1.unitRate = 0;
    }
    this.calcRequiredSquareMeter1TotalRate();
  }

  calcRequiredSquareMeter1TotalRate() {
    if (
      this.costing.requiredSquareMeter1.description &&
      this.costing.requiredSquareMeter1.unitRate
    ) {
      this.costing.requiredSquareMeter1.totalRate = this.roundToFour(
        this.costing.requiredSquareMeter1.description *
          this.costing.requiredSquareMeter1.unitRate
      );
    } else {
      this.costing.requiredSquareMeter1.totalRate = 0;
    }
    this.calcCost();
  }

  onRequiredSquareMeter2CostChange() {
    this.calcRequiredSquareMeter2TotalRate();
  }

  calcRequiredSquareMeter2Description() {
    if (this.costing.reelWidth) {
      this.costing.requiredSquareMeter2.description = this.roundToFour(
        this.costing.reelWidth
      );
    } else {
      this.costing.requiredSquareMeter2.description = 0;
    }
    this.calcRequiredSquareMeter2TotalRate();
    this.calcFoilDescription();
    this.calcLaminationAdhesiveDescription();
    this.calcLaminationDescription();
  }

  calcRequiredSquareMeter2UnitRate() {
    if (this.costing.materialPrice) {
      this.costing.requiredSquareMeter2.unitRate = this.roundToFour(
        this.costing.materialPrice
      );
    } else {
      this.costing.requiredSquareMeter2.unitRate = 0;
    }
    this.calcRequiredSquareMeter2TotalRate();
  }

  calcRequiredSquareMeter2TotalRate() {
    if (
      this.costing.requiredSquareMeter2.cost &&
      this.costing.requiredSquareMeter2.description &&
      this.costing.requiredSquareMeter2.unitRate
    ) {
      this.costing.requiredSquareMeter2.totalRate = this.roundToFour(
        this.costing.requiredSquareMeter2.cost *
          this.costing.requiredSquareMeter2.description *
          this.costing.requiredSquareMeter2.unitRate
      );
    } else {
      this.costing.requiredSquareMeter2.totalRate = 0;
    }
    this.calcCost();
  }

  calcRollChangeWasteDescription() {
    if (this.costing.requiredSquareMeter) {
      this.costing.rollChangeWaste.description = this.roundToFour(
        (this.costing.requiredSquareMeter / 2000) * 60
      );
    } else {
      this.costing.rollChangeWaste.description = 0;
    }
    this.calcRollChangeWasteTotalRate();
    this.calcFoilDescription();
    this.calcLaminationAdhesiveDescription();
    this.calcLaminationDescription();
  }

  calcRollChangeWasteUnitRate() {
    if (this.costing.materialPrice) {
      this.costing.rollChangeWaste.unitRate = this.roundToFour(
        this.costing.materialPrice
      );
    } else {
      this.costing.rollChangeWaste.unitRate = 0;
    }
    this.calcRollChangeWasteTotalRate();
  }

  calcRollChangeWasteTotalRate() {
    if (
      this.costing.rollChangeWaste.description &&
      this.costing.rollChangeWaste.unitRate
    ) {
      this.costing.rollChangeWaste.totalRate = this.roundToFour(
        this.costing.rollChangeWaste.description *
          this.costing.rollChangeWaste.unitRate
      );
    } else {
      this.costing.rollChangeWaste.totalRate = 0;
    }
    this.calcCost();
  }

  onInkCostChange() {
    this.calcInkDescription();
  }

  calcInkDescription() {
    if (this.costing.requiredSquareMeter && this.costing.ink.cost) {
      this.costing.ink.description = this.roundToFour(
        this.costing.ink.cost * this.costing.requiredSquareMeter
      );
    } else {
      this.costing.ink.description = 0;
    }
    this.calcInkTotalRate();
  }

  onInkUnitRateChange() {
    this.calcInkTotalRate();
  }

  calcInkTotalRate() {
    if (this.costing.ink.description && this.costing.ink.unitRate) {
      this.costing.ink.totalRate = this.roundToFour(
        this.costing.ink.description * this.costing.ink.unitRate
      );
    } else {
      this.costing.ink.totalRate = 0;
    }
    this.calcCost();
  }

  calcPrintingMachineHoursDescription() {
    if (this.costing.requiredMeter) {
      this.costing.printingMachineHours.description = this.roundToFour(
        this.costing.requiredMeter / 2000 + 1
      );
    } else {
      this.costing.printingMachineHours.description = 0;
    }
    this.calcPrintingMachineHoursTotalRate();
    this.calcRhyguanSlittingDescription();
    this.calcPackingDescription();
    this.calcAdminDescription();
  }

  onPrintingMachineHoursUnitRateChange() {
    this.calcPrintingMachineHoursTotalRate();
  }

  calcPrintingMachineHoursTotalRate() {
    if (
      this.costing.printingMachineHours.description &&
      this.costing.printingMachineHours.unitRate
    ) {
      this.costing.printingMachineHours.totalRate = this.roundToFour(
        this.costing.printingMachineHours.description *
          this.costing.printingMachineHours.unitRate
      );
    } else {
      this.costing.printingMachineHours.totalRate = 0;
    }
    this.calcCost();
  }

  onRhyguanSlittingCostChange() {
    this.calcRhyguanSlittingTotalRate();
  }

  calcRhyguanSlittingDescription() {
    if (this.costing.printingMachineHours.description) {
      this.costing.rhyguanSlitting.description = this.roundToFour(
        this.costing.printingMachineHours.description
      );
    } else {
      this.costing.rhyguanSlitting.description = 0;
    }
    this.calcRhyguanSlittingTotalRate();
    this.calcPackingDescription();
    this.calcAdminDescription();
  }

  calcRhyguanSlittingTotalRate() {
    if (
      this.costing.rhyguanSlitting.cost &&
      this.costing.rhyguanSlitting.description
    ) {
      this.costing.rhyguanSlitting.totalRate = this.roundToFour(
        this.costing.rhyguanSlitting.cost *
          this.costing.rhyguanSlitting.description
      );
    } else {
      this.costing.rhyguanSlitting.totalRate = 0;
    }
    this.calcCost();
  }

  onFoilCostChange() {
    this.calcFoilTotalRate();
  }

  calcFoilDescription() {
    if (
      this.costing.requiredSquareMeter1.description &&
      this.costing.requiredSquareMeter2.description &&
      this.costing.rollChangeWaste.description
    ) {
      this.costing.foil.description = this.roundToFour(
        this.costing.requiredSquareMeter1.description +
          this.costing.requiredSquareMeter2.description +
          this.costing.rollChangeWaste.description
      );
    } else {
      this.costing.foil.description = 0;
    }
    this.calcFoilTotalRate();
  }

  calcFoilTotalRate() {
    if (this.costing.foil.cost && this.costing.foil.description) {
      this.costing.foil.totalRate = this.roundToFour(
        this.costing.foil.cost * this.costing.foil.description
      );
    } else {
      this.costing.foil.totalRate = 0;
    }
    this.calcCost();
  }

  onLaminationAdhesiveCostChange() {
    this.calcLaminationAdhesiveTotalRate();
  }

  calcLaminationAdhesiveDescription() {
    if (
      this.costing.requiredSquareMeter1.description &&
      this.costing.requiredSquareMeter2.description &&
      this.costing.rollChangeWaste.description
    ) {
      this.costing.laminationAdhesive.description = this.roundToFour(
        (6 *
          (this.costing.requiredSquareMeter1.description +
            this.costing.requiredSquareMeter2.description +
            this.costing.rollChangeWaste.description)) /
          1000
      );
    } else {
      this.costing.laminationAdhesive.description = 0;
    }
    this.calcLaminationAdhesiveTotalRate();
  }

  onLaminationAdhesiveUnitRateChange() {
    this.calcLaminationAdhesiveTotalRate();
  }

  calcLaminationAdhesiveTotalRate() {
    if (
      this.costing.laminationAdhesive.cost &&
      this.costing.laminationAdhesive.description
    ) {
      this.costing.laminationAdhesive.totalRate = this.roundToFour(
        this.costing.laminationAdhesive.cost *
          this.costing.laminationAdhesive.description
      );
    } else {
      this.costing.laminationAdhesive.totalRate = 0;
    }
    this.calcCost();
  }

  onLaminationCostChange() {
    this.calcLaminationTotalRate();
  }

  calcLaminationDescription() {
    if (
      this.costing.requiredSquareMeter1.description &&
      this.costing.requiredSquareMeter2.description &&
      this.costing.rollChangeWaste.description
    ) {
      this.costing.lamination.description = this.roundToFour(
        (this.costing.requiredSquareMeter1.description +
          this.costing.requiredSquareMeter2.description +
          this.costing.rollChangeWaste.description +
          20) *
          0.017
      );
    } else {
      this.costing.lamination.description = 0;
    }
    this.calcLaminationTotalRate();
  }

  calcLaminationTotalRate() {
    if (this.costing.lamination.cost && this.costing.lamination.description) {
      this.costing.lamination.totalRate = this.roundToFour(
        this.costing.lamination.cost * this.costing.lamination.description
      );
    } else {
      this.costing.lamination.totalRate = 0;
    }
    this.calcCost();
  }

  onDieCuttingCostChange() {
    this.calcDieCuttingDescription();
  }

  calcDieCuttingDescription() {
    if (this.costing.printingQuantity && this.costing.dieCutting.cost) {
      this.costing.dieCutting.description = this.roundToFour(
        this.costing.printingQuantity / this.costing.dieCutting.cost
      );
    } else {
      this.costing.dieCutting.description = 0;
    }
    this.calcDieCuttingTotalRate();
  }

  onDieCuttingUnitRateChange() {
    this.calcDieCuttingTotalRate();
  }

  calcDieCuttingTotalRate() {
    if (
      this.costing.dieCutting.unitRate &&
      this.costing.dieCutting.description
    ) {
      this.costing.dieCutting.totalRate = this.roundToFour(
        this.costing.dieCutting.unitRate * this.costing.dieCutting.description
      );
    } else {
      this.costing.dieCutting.totalRate = 0;
    }
    this.calcCost();
  }

  calcPackingDescription() {
    if (
      this.costing.printingMachineHours.description &&
      this.costing.rhyguanSlitting.description
    ) {
      this.costing.packing.description = this.roundToFour(
        this.costing.printingMachineHours.description +
          this.costing.rhyguanSlitting.description
      );
    } else {
      this.costing.packing.description = 0;
    }
    this.calcPackingTotalRate();
  }

  onPackingUnitRateChange() {
    this.calcPackingTotalRate();
  }

  calcPackingTotalRate() {
    if (this.costing.packing.unitRate && this.costing.packing.description) {
      this.costing.packing.totalRate = this.roundToFour(
        this.costing.packing.unitRate * this.costing.packing.description
      );
    } else {
      this.costing.packing.totalRate = 0;
    }
    this.calcCost();
  }

  onAdminCostChange() {
    this.calcAdminTotalRate();
  }

  calcAdminDescription() {
    if (
      this.costing.printingMachineHours.description &&
      this.costing.rhyguanSlitting.description
    ) {
      this.costing.admin.description = this.roundToFour(
        this.costing.printingMachineHours.description +
          this.costing.rhyguanSlitting.description
      );
    } else {
      this.costing.admin.description = 0;
    }
    this.calcAdminTotalRate();
  }

  calcAdminTotalRate() {
    if (this.costing.admin.cost && this.costing.admin.description) {
      this.costing.admin.totalRate = this.roundToFour(
        this.costing.admin.cost * this.costing.admin.description
      );
    } else {
      this.costing.admin.totalRate = 0;
    }
    this.calcCost();
  }

  calcCost() {
    this.costing.cost = this.roundToFour(
      this.costing.artWorkHrs.totalRate +
        this.costing.proofReadingHrs.totalRate +
        this.costing.die.totalRate +
        this.costing.plate.totalRate +
        this.costing.requiredSquareMeter1.totalRate +
        this.costing.requiredSquareMeter2.totalRate +
        this.costing.rollChangeWaste.totalRate +
        this.costing.ink.totalRate +
        this.costing.printingMachineHours.totalRate +
        this.costing.rhyguanSlitting.totalRate +
        this.costing.foil.totalRate +
        this.costing.laminationAdhesive.totalRate +
        this.costing.lamination.totalRate +
        this.costing.dieCutting.totalRate +
        this.costing.packing.totalRate +
        this.costing.admin.totalRate
    );
    this.calcTotalCost();
    if (this.costing.profitPercentage) {
      this.calcProfit();
    }
  }

  onProfitPercentChange() {
    this.calcProfit();
  }

  calcProfit() {
    if (this.costing.profitPercentage) {
      this.costing.profit = this.roundToFour(
        (this.costing.profitPercentage * this.costing.cost) / 100
      );
    } else {
      this.costing.profit = 0;
    }
    this.calcTotalCost();
  }

  onDeliveryCostChange() {
    this.calcTotalCost();
  }

  calcTotalCost() {
    if (this.costing.profit && this.costing.cost) {
      this.costing.totalCost = this.roundToFour(
        this.costing.profit + this.costing.cost + this.costing.deliveryCost
      );
    } else {
      this.costing.totalCost = 0;
    }
    this.calcRatePerPcs();
  }

  calcRatePerPcs() {
    if (this.costing.totalCost && this.costing.printingQuantity) {
      this.costing.ratePerPcs = this.roundToFour(
        this.costing.totalCost / this.costing.printingQuantity
      );
    } else {
      this.costing.ratePerPcs = 0;
    }
    this.setSlabRatePrice();
  }

  setSlabRateQuantity() {
    this.slabRates.quantitySlab = String(this.costing.printingQuantity);
  }

  setSlabRatePrice() {
    this.slabRates.price = this.costing.ratePerPcs;
  }

  addLineItem() {
    if (
      this.validator.isEmptyString(this.slabRates.quantitySlab) ||
      this.slabRates.quantitySlab == 'null'
    ) {
      this.snackBarService.showWarningSnack('Please enter the Quantity Slab');
    } else if (
      this.validator.isNotANumber(this.slabRates.price) ||
      isNaN(this.slabRates.price)
    ) {
      this.snackBarService.showWarningSnack('Please enter the Slab Rate / Pcs');
    } else {
      this.costing.slabRates.push(this.slabRates);
      this.snackBarService.showSuccessSnack('Line Item added successfully');
      this.slabRates = new SlabRates();
      this.setSlabRateQuantity();
      this.setSlabRatePrice();
    }
  }

  deleteLineItem(index: number) {
    this.costing.slabRates.splice(index, 1);
  }

  uploadImage(refNo?: string, update?: boolean) {
    this.costingService
      .uploadStickerFlexoAttachment(
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
                update ? 'updated' : 'created'
              } successfully with Reference No : ` + refNo
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
    let flag: boolean = false;

    if (this.validator.isEmptyString(this.costing.entryDate)) {
      this.snackBarService.showWarningSnack(
        'System Date Error. Please contact the Administrator'
      );
    } else if (this.validator.isEmptyString(this.costing.customerId)) {
      this.snackBarService.showWarningSnack('Please Select the Customer');
    } else if (this.validator.isEmptyString(this.costing.customerName)) {
      this.snackBarService.showWarningSnack(
        'Customer name not fetched - Please refresh the page and try again'
      );
    } else if (this.validator.isEmptyString(this.costing.stickerName)) {
      this.snackBarService.showWarningSnack('Please enter the Sticker Name');
    } else if (this.validator.isEmptyString(this.costing.jobNo)) {
      this.snackBarService.showWarningSnack('Please enter the Job No');
    } else if (
      this.validator.isEmptyString(this.costing.executiveId) &&
      this.validator.isEmptyString(this.costing.tManagerEmail)
    ) {
      this.snackBarService.showWarningSnack(
        this.accessType == 'TManager'
          ? 'Territory Manager - email Not found'
          : 'Executive - UserID Not found'
      );
    } else if (
      this.validator.isNotAPostiveNumber(this.costing.printingQuantity)
    ) {
      this.snackBarService.showWarningSnack(
        'Please enter the Printing Quantity'
      );
    } else if (this.validator.isNotAPostiveNumber(this.costing.stickerLength)) {
      this.snackBarService.showWarningSnack('Please enter the Sticker Length');
    } else if (this.validator.isNotAPostiveNumber(this.costing.stickerWidth)) {
      this.snackBarService.showWarningSnack('Please enter the Sticker Width');
    } else if (this.validator.isEmptyString(this.costing.stickerShape)) {
      this.snackBarService.showWarningSnack('Please enter the Sticker Shape');
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
    }
    // NOTE: this validation must come at the end, since it has nested validations
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
      this.costingService.createStickerFlexo(this.costing).subscribe(
        (data) => {
          if (data) {
            this.uploadImage(data.refNo);
          } else {
            // we received null - indicating recursion failure
            alert(
              'R - Error while saving - Sticker costing sheet. Please contact the administrator.'
            );
            console.log(
              'Recursion failure - Indicating Mismatch in Reference Number sequence'
            );
            this.disableSaveBtn = false;
          }
        },
        (err) => {
          alert(
            'Error while saving - Sticker costing sheet. Please contact the administrator'
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
      this.costingService.updateStickerFlexo(this.costing).subscribe(
        (data) => {
          if (data) {
            if (this.imageUpdateFlag) {
              this.uploadImage(data.refNo, true);
            } else {
              this.snackBarService.showSuccessSnack(
                'Costing sheet updated successfully'
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
    if (this.validateExecutiveInput()) {
      let flag = false;

      if (this.validator.isNotAPostiveNumber(this.costing.noOfColors)) {
        this.snackBarService.showWarningSnack('Please enter the No of Colors');
      } else if (this.validator.isEmptyString(this.costing.materialId)) {
        this.snackBarService.showWarningSnack('Please select the Material');
      } else if (
        this.validator.isNotAPostiveNumber(this.costing.materialPrice)
      ) {
        this.snackBarService.showWarningSnack(
          'Please enter the Material Price'
        );
      } else if (this.validator.isNotAPostiveNumber(this.costing.reelWidth)) {
        this.snackBarService.showWarningSnack('Please enter the Reel Width');
      } else if (this.validator.isNotAPostiveNumber(this.costing.acrossUps)) {
        this.snackBarService.showWarningSnack('Please enter the Across Ups');
      } else if (
        this.validator.isNotAPostiveNumber(this.costing.repeatLength)
      ) {
        this.snackBarService.showWarningSnack(
          'Please enter the Repeat Length (MM)'
        );
      } else if (this.validator.isNotAPostiveNumber(this.costing.aroundUps)) {
        this.snackBarService.showWarningSnack('Please enter the Around Ups');
      } else if (
        this.validator.isNotAPostiveNumber(this.costing.totalPCSPerRepeat)
      ) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error : Total PCS per repeat'
        );
      } else if (
        this.validator.isNotAPostiveNumber(this.costing.requiredMeter)
      ) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error : Required Meter'
        );
      } else if (
        this.validator.isNotAPostiveNumber(this.costing.requiredSquareMeter)
      ) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error : Required Square Meter'
        );
      } else if (this.validator.isNotANumber(this.costing.artWorkHrs.cost)) {
        this.snackBarService.showWarningSnack(
          'Please enter the Art Work HRS - Cost'
        );
      } else if (
        this.validator.isNotANumber(this.costing.artWorkHrs.totalRate)
      ) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error : Art Work HRS - Total Rate'
        );
      } else if (
        this.validator.isNotANumber(this.costing.proofReadingHrs.cost)
      ) {
        this.snackBarService.showWarningSnack(
          'Please enter the Proof Reading HRS - Cost'
        );
      } else if (
        this.validator.isNotANumber(this.costing.proofReadingHrs.totalRate)
      ) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error : Proof Reading HRS - Total Rate'
        );
      } else if (this.validator.isNotANumber(this.costing.die.cost)) {
        this.snackBarService.showWarningSnack('Please enter the Die - Cost');
      } else if (this.validator.isNotANumber(this.costing.die.totalRate)) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error : Die - Total Rate'
        );
      } else if (this.validator.isNotANumber(this.costing.plate.cost)) {
        this.snackBarService.showWarningSnack('Please enter the Plate - Cost');
      } else if (this.validator.isNotANumber(this.costing.plate.description)) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error : Plate - Description'
        );
      } else if (this.validator.isNotANumber(this.costing.plate.totalRate)) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error : Plate - Total Rate'
        );
      } else if (
        this.validator.isNotANumber(
          this.costing.requiredSquareMeter1.description
        )
      ) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error : Required Square Meter - Description'
        );
      } else if (
        this.validator.isNotANumber(this.costing.requiredSquareMeter1.unitRate)
      ) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error : Required Square Meter - Unit Rate'
        );
      } else if (
        this.validator.isNotANumber(this.costing.requiredSquareMeter1.totalRate)
      ) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error : Required Square Meter - Total Rate'
        );
      } else if (
        this.validator.isNotANumber(this.costing.requiredSquareMeter2.cost)
      ) {
        this.snackBarService.showWarningSnack(
          'Please enter the cost - Required Square Meter - Row 2'
        );
      } else if (
        this.validator.isNotANumber(
          this.costing.requiredSquareMeter2.description
        )
      ) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error : Required Square Meter - Description - Row 2'
        );
      } else if (
        this.validator.isNotANumber(this.costing.requiredSquareMeter2.unitRate)
      ) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error : Required Square Meter - Unit Rate - Row 2'
        );
      } else if (
        this.validator.isNotANumber(this.costing.requiredSquareMeter2.totalRate)
      ) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error : Required Square Meter - Total Rate - Row 2'
        );
      } else if (
        this.validator.isNotANumber(this.costing.rollChangeWaste.description)
      ) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error : Roll Change Waste - Description'
        );
      } else if (
        this.validator.isNotANumber(this.costing.rollChangeWaste.unitRate)
      ) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error : Roll Change Waste - Unit Rate'
        );
      } else if (
        this.validator.isNotANumber(this.costing.rollChangeWaste.totalRate)
      ) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error : Roll Change Waste - Total Rate'
        );
      } else if (this.validator.isNotANumber(this.costing.ink.cost)) {
        this.snackBarService.showWarningSnack('Please enter the Ink - Cost');
      } else if (this.validator.isNotANumber(this.costing.ink.description)) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error : Ink - Description'
        );
      } else if (this.validator.isNotANumber(this.costing.ink.unitRate)) {
        this.snackBarService.showWarningSnack(
          'Please enter the Ink - Unit Rate'
        );
      } else if (this.validator.isNotANumber(this.costing.ink.totalRate)) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error : Ink - Total Rate'
        );
      } else if (
        this.validator.isNotANumber(
          this.costing.printingMachineHours.description
        )
      ) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error : Printing Machine Hours - Description'
        );
      } else if (
        this.validator.isNotANumber(this.costing.printingMachineHours.unitRate)
      ) {
        this.snackBarService.showWarningSnack(
          'Please enter the Printing Machine Hours - Unit Rate'
        );
      } else if (
        this.validator.isNotANumber(this.costing.printingMachineHours.totalRate)
      ) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error : Printing Machine Hours - Total Rate'
        );
      } else if (
        this.validator.isNotANumber(this.costing.rhyguanSlitting.cost)
      ) {
        this.snackBarService.showWarningSnack(
          'Please enter the Rhyguan Slitting - Cost'
        );
      } else if (
        this.validator.isNotANumber(this.costing.rhyguanSlitting.description)
      ) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error :  Rhyguan Slitting - Description'
        );
      } else if (
        this.validator.isNotANumber(this.costing.rhyguanSlitting.totalRate)
      ) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error :  Rhyguan Slitting - Total Rate'
        );
      } else if (this.validator.isNotANumber(this.costing.foil.cost)) {
        this.snackBarService.showWarningSnack('Please enter the Foil - Cost');
      } else if (this.validator.isNotANumber(this.costing.foil.description)) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error :  Foil - Description'
        );
      } else if (this.validator.isNotANumber(this.costing.foil.totalRate)) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error :  Foil - Total Rate'
        );
      } else if (
        this.validator.isNotANumber(this.costing.laminationAdhesive.cost)
      ) {
        this.snackBarService.showWarningSnack(
          'Please enter the Lamination Adhesive - Cost'
        );
      } else if (
        this.validator.isNotANumber(this.costing.laminationAdhesive.description)
      ) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error :  Lamination Adhesive - Description'
        );
      } else if (
        this.validator.isNotANumber(this.costing.laminationAdhesive.totalRate)
      ) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error :  Lamination Adhesive - Total Rate'
        );
      } else if (this.validator.isNotANumber(this.costing.lamination.cost)) {
        this.snackBarService.showWarningSnack(
          'Please enter the Lamination - Cost'
        );
      } else if (
        this.validator.isNotANumber(this.costing.lamination.description)
      ) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error :  Lamination - Description'
        );
      } else if (
        this.validator.isNotANumber(this.costing.lamination.totalRate)
      ) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error :  Lamination - Total Rate'
        );
      } else if (this.validator.isNotANumber(this.costing.dieCutting.cost)) {
        this.snackBarService.showWarningSnack(
          'Please enter the Offline Die Cutting - Cost'
        );
      } else if (
        this.validator.isNotANumber(this.costing.dieCutting.description)
      ) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error : Offline Die Cutting - Description'
        );
      } else if (
        this.validator.isNotANumber(this.costing.dieCutting.unitRate)
      ) {
        this.snackBarService.showWarningSnack(
          'Please enter the Offline Die Cutting - Unit Rate'
        );
      } else if (
        this.validator.isNotANumber(this.costing.dieCutting.totalRate)
      ) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error : Offline Die Cutting - Total Rate'
        );
      } else if (
        this.validator.isNotANumber(this.costing.packing.description)
      ) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error :  Packing - Description'
        );
      } else if (this.validator.isNotANumber(this.costing.packing.unitRate)) {
        this.snackBarService.showWarningSnack(
          'Please enter the Packing - Unit Rate'
        );
      } else if (this.validator.isNotANumber(this.costing.packing.totalRate)) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error :  Packing - Total Rate'
        );
      } else if (this.validator.isNotANumber(this.costing.admin.cost)) {
        this.snackBarService.showWarningSnack('Please enter the Admin - Cost');
      } else if (this.validator.isNotANumber(this.costing.admin.description)) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error :  Admin - Description'
        );
      } else if (this.validator.isNotANumber(this.costing.admin.totalRate)) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error :  Admin - Total Rate'
        );
      } else if (this.validator.isNotAPostiveNumber(this.costing.cost)) {
        this.snackBarService.showWarningSnack('Autocalculation Error :  Cost');
      } else if (
        this.validator.isNotAPostiveNumber(this.costing.profitPercentage)
      ) {
        this.snackBarService.showWarningSnack(
          'Please enter the Profit Percentage'
        );
      } else if (this.validator.isNotAPostiveNumber(this.costing.profit)) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error :  Profit'
        );
      } else if (this.validator.isNotANumber(this.costing.deliveryCost)) {
        this.snackBarService.showWarningSnack('Please enter the Delivery Cost');
      } else if (this.validator.isNotAPostiveNumber(this.costing.totalCost)) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error :  Total Cost'
        );
      } else if (this.validator.isNotANumber(this.costing.ratePerPcs)) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error :  Rate / Pcs'
        );
      } else {
        flag = true;
      }

      return flag;
    } else {
      return false;
    }
  }

  updateCostingInputBySampleHead(approvalReq?: boolean) {
    if (this.validateSampleHeadInput()) {
      this.costingService.updateStickerFlexo(this.costing).subscribe(
        (data) => {
          if (data) {
            if (this.imageUpdateFlag) {
              this.uploadImage(data.refNo, true);
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
    this.costingApprovalDetails.productName = this.costing.stickerName;
    this.costingApprovalDetails.customerName = this.costing.customerName;
    this.costingApprovalDetails.trimType = 'Sticker';
    this.costingApprovalDetails.productLength = String(
      this.costing.stickerLength + ' CM'
    );
    this.costingApprovalDetails.productWidth = String(
      this.costing.stickerWidth + ' CM'
    );
    // this.costingApprovalDetails.paymentTerms = this.costing.paymentTerms;
    this.costingApprovalDetails.slabRates = this.costing.slabRates;
    if (!forCustomer) {
      this.costingApprovalDetails.approvalLink = `${Configuration.domainURL}header/login/costingApproval/Sticker-Flexo--${this.costing.id}`;
    } else {
      this.costingApprovalDetails.approvalLink = `${Configuration.domainURL}header/login/costingApprovalForCustomer/Sticker-Flexo--${this.costing.id}`;
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
      this.costingService.updateStickerFlexo(this.costing).subscribe(
        (data) => {
          this.snackBarService.showSuccessSnack(
            'Costing sheet rejected successfully'
          );
        },
        (err) => console.log('Error while rejecting costing sheet')
      );
    } else {
      if (this.validateAdministratorInput()) {
        this.costingService.updateStickerFlexo(this.costing).subscribe(
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

    const costingModal = document.getElementById('pdf-container-sticker-flexo');
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

            //update the costing status on MStickerFlexoCosting and MCommonDetailsCosting
            this.costingService.updateStickerFlexo(this.costing).subscribe(
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
        let res = await this.costingService.approveStickerFlexoByCustomer(
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
        let res = await this.costingService.rejectStickerFlexoByCustomer(
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
    //     let res = await this.costingService.rejectStickerFlexoByCustomer(
    //       this.costing.id
    //     );
    //     if (res) {
    //       this.snackBarService.showSuccessSnack(
    //         'Costing has been rejected successfully'
    //       );
    //       this.costing.status = 6;
    //       this.initializeCostingApprovalDetails();
    //       //to the executive / tmanager
    //       await this.costingService.sendCostingApprovedorRejectedMail(
    //         this.costingApprovalDetails,
    //         this.costing.tManagerEmail
    //           ? this.costing.tManagerEmail
    //           : this.executiveEmail,
    //         false
    //       );
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
    if (this.costingService.createDraftOrderStickerFlexo(this.costing.id)) {
      this.snackBarService.showSuccessSnack('Draft order created successfully');
      this.back();
    } else {
      this.snackBarService.showSuccessSnack('Error while creating draft order');
      this.disableDraftOrderBtn = false;
    }
  }
}
