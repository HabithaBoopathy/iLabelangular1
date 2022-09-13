import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TagCosting } from 'src/app/v2/components/costingNew/model/tag-costing';
import { DateFormatter } from '../../../../utility-classes/date-formatter';
import { Validator } from '../../../../utility-classes/validator';
import { SnackBarService } from 'src/app/services/snackBar.service';
import { CostingService } from '../services/costing.service';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Employee } from 'src/app/models/employee';
import { EmployeeService } from '../../../../services/employee.service';
import { MexecutiveService } from '../../../../services/mexecutive.service';
import { UserService } from '../../../../services/user.service';
import { MPaperService } from '../../../../services/mPaper.service';
import { MPaper } from 'src/app/models/mPaper';
import { SlabRates } from '../model/slab-rates';
import { CostingApprovalDetails } from '../model/costing-approval-details';
import { Configuration } from 'src/app/configuration';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { MTapeMachine } from '../../../../models/mTapeMachine';
import { MTapeMachineService } from '../../../../services/mTapeMachine.service';
import { TimeService } from 'src/app/services/time.service';

@Component({
  selector: 'app-tag-costing',
  templateUrl: './tag-costing.component.html',
  styleUrls: ['./tag-costing.component.css'],
})
export class TagCostingComponent implements OnInit {
  //flag to render the page for creation / updation
  isNew: boolean = true;

  costing: TagCosting;

  displayDate: string;

  customers: Employee[];

  validator: Validator;
  slabRates: SlabRates;

  accessType: string;
  isSuperUser: boolean = false;

  attachmentSrc = '';
  attachment: File;
  imageUpdateFlag: boolean = false;

  executiveId: string;
  executiveEmail: string;

  previousPage: string;

  statusReference: number;

  papers: MPaper[];

  disableSaveBtn: boolean = false;
  disableSendForCustomerApprovalBtn: boolean = false;
  disableDraftOrderBtn: boolean = false;
  disableAdminApprovalBtn: boolean = false;

  dateFormatter: DateFormatter;

  costingApprovalDetails: CostingApprovalDetails;

  showInkCopies: boolean = false;

  mTapeMachines: MTapeMachine[];

  sampleDetailsReadOnly: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBarService: SnackBarService,
    private costingService: CostingService,
    private location: Location,
    public _d: DomSanitizer,
    private employeeService: EmployeeService,
    private mExecutiveService: MexecutiveService,
    private mUserService: UserService,
    private mPaperService: MPaperService,
    private mTapeMachineService: MTapeMachineService,
    private timeService: TimeService
  ) {
    this.costing = new TagCosting();
    this.validator = new Validator();
    this.accessType = localStorage.getItem('token');
    this.dateFormatter = new DateFormatter();
    this.slabRates = new SlabRates();
    this.costingApprovalDetails = new CostingApprovalDetails();
    // this.previousPage = this.route.snapshot.paramMap.get('previousPage');
    this.previousPage = 'costingList';

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
      localStorage.getItem('superUser') == 'true' &&
      this.accessType == 'Administrator'
    ) {
      this.isSuperUser = true;
    }
    this.userAccessControl();
  }

  ngOnInit(): void {
    if (!this.isNew) {
      this.fetchExistingCosting();
    }
    this.fetchCustomers();
    this.fetchPapers();
    this.fetchMTapeMachines();
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
      this.accessType != 'Administrator' &&
      this.accessType != 'Sample Head' &&
      this.accessType != 'Sales Team' &&
      this.accessType != 'TManager' &&
      this.accessType != 'Customer'
    ) {
      this.router.navigate(['/home/dashboard']);
    }

    if (
      (this.accessType == 'Sales Team' && this.costing.status < 1) ||
      (this.accessType == 'TManager' && this.costing.status < 1) ||
      (this.accessType == 'Sample Head' && this.costing.status < 1) ||
      (this.accessType == 'Administrator' && this.costing.status < 2)
    ) {
      this.sampleDetailsReadOnly = false;
    } else {
      this.sampleDetailsReadOnly = true;
    }
  }

  fetchExecutiveId() {
    //this id will be used to set the executiveId field of tagCosting model while saving for the first time
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

  fetchExistingCosting() {
    this.costingService.getTagByid(this.route.snapshot.params['id']).subscribe(
      (data) => {
        this.costing = data;
        this.displayDate = this.dateFormatter.convertDateToDDMMYYYY(
          data.entryDate
        );
        //set default input values for slab rate inputs based on pre-entered data
        this.setSlabRateQuantity();
        this.setSlabRatePrice();

        //In here we get the status
        this.userAccessControl();

        //fetch the attachment based on the extension
        if (this.costing.attachmentExtension != 'pdf') {
          this.costingService
            .getTagAttachmentImage(
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
            .getTagAttachmentPdf(
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

        //legacy tag orders doesn't have rawMaterialCost and rawMaterialPricePerPiece stored so calling the function to calculate them
        this.calcRawMaterialCost();
      },
      (err) => {
        this.snackBarService.showWarningSnack('Costing sheet not found');
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

  fetchPapers() {
    this.mPaperService.getAllPapers().subscribe(
      (data) => {
        this.papers = data;
        this.papers.sort(this.sortPapers);
      },
      (err) => {
        alert('Error while fetching papers');
        console.log(err);
      }
    );
  }

  sortPapers(a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }

  fetchMTapeMachines() {
    this.mTapeMachineService.getAllMachines().subscribe(
      (data) => {
        this.mTapeMachines = data;
      },
      (err) => {
        alert('Error while fetching machines');
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

  onOrderQuantityChange() {
    this.calcExcessValue();
    this.calcRunCopies();
    this.calcPorFRate2();
    this.calcStringOrJuteRate2();
    this.calcEyeletRate2();
    this.setSlabRateQuantity();
  }

  calcExcessValue() {
    if (this.costing.orderQuantity && this.costing.excessPercentage) {
      this.costing.excessValue = this.roundToFour(
        this.costing.orderQuantity * (this.costing.excessPercentage / 100)
      );
    } else {
      this.costing.excessValue = 0;
    }
    this.calcRunCopies();
    this.calcPorFRate2();
    this.calcStringOrJuteRate2();
    this.calcEyeletRate2();
  }

  calcRunCopies() {
    if (
      this.costing.orderQuantity &&
      this.costing.excessValue &&
      this.costing.ups
    ) {
      this.costing.runCopies = this.roundToFour(
        (this.costing.orderQuantity + this.costing.excessValue) /
          this.costing.ups
      );
    } else {
      this.costing.runCopies = 0;
    }
    this.calcNoOfBoard();
    this.calcInkRate2();
    this.calcScreenPrintRate2();
    this.calcGummingRate2();
    this.calcPastingRate2();
    this.calcLaminationRate2();
    this.calcUVRate2();
    this.calcFoilRate2();
    this.calcVarnishRate2();
    this.calcAquasCoatingRate2();
    this.calcEmbossOrDebossRate2();
    this.calcPunchingRate2();
    this.calcCuttingRate2();
    this.calcDigitalRate2();
    this.calcKnurlingRate2();
    this.calcScoringRate2();
  }

  onMakeReadyChange() {
    this.calcNoOfBoard();
  }

  calcNoOfBoard() {
    if (this.costing.runCopies && this.costing.makeReady) {
      //paper1
      if (this.costing.paper1CutSize) {
        this.costing.paper1NoOfBoard = this.roundToFour(
          (this.costing.runCopies + this.costing.makeReady) /
            this.costing.paper1CutSize
        );
      } else {
        this.costing.paper1NoOfBoard = 0;
      }

      //paper2
      if (this.costing.paper2CutSize) {
        this.costing.paper2NoOfBoard = this.roundToFour(
          (this.costing.runCopies + this.costing.makeReady) /
            this.costing.paper2CutSize
        );
      } else {
        this.costing.paper2NoOfBoard = 0;
      }
    } else {
      this.costing.paper1NoOfBoard = 0;
      this.costing.paper2NoOfBoard = 0;
    }
    this.calcPaperRate();
  }

  calcPaperRate() {
    if (this.costing.paper1NoOfBoard && this.costing.paper1.ratePerBoard) {
      this.costing.paper1Rate = this.roundToFour(
        this.costing.paper1NoOfBoard * this.costing.paper1.ratePerBoard
      );
    } else {
      this.costing.paper1Rate = 0;
    }

    if (this.costing.paper2NoOfBoard && this.costing.paper2.ratePerBoard) {
      this.costing.paper2Rate = this.roundToFour(
        this.costing.paper2NoOfBoard * this.costing.paper2.ratePerBoard
      );
    } else {
      this.costing.paper2Rate = 0;
    }

    this.calcPaper1Cost();
    this.calcPaper2Cost();
  }

  onPaperChange(paperNo: number) {
    let index;
    if (paperNo == 1) {
      index = this.papers.findIndex((obj) => obj.id == this.costing.paper1.id);
      this.costing.paper1 = { ...this.papers[index] };
    } else if (paperNo == 2) {
      index = this.papers.findIndex((obj) => obj.id == this.costing.paper2.id);
      this.costing.paper2 = { ...this.papers[index] };
    }
    this.calcPaperRate();
  }

  onRunBoardLengthChange() {
    this.calcFoilBlockRate2();
    this.calcEmboBlockRate2();
    this.calcScreenPrintRate2();
    this.calcLaminationRate2();
    this.calcUVRate2();
    this.calcFoilRate2();
    this.calcVarnishRate2();
    this.calcAquasCoatingRate2();
    this.calcFilmRate2();
  }

  onRunBoardWidthChange() {
    this.calcFoilBlockRate2();
    this.calcEmboBlockRate2();
    this.calcScreenPrintRate2();
    this.calcLaminationRate2();
    this.calcUVRate2();
    this.calcFoilRate2();
    this.calcVarnishRate2();
    this.calcAquasCoatingRate2();
    this.calcFilmRate2();
  }

  calcPaper1Cost() {
    if (
      this.validator.isNotNullAndUndefined(this.costing.paper1Rate) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.paper1Quantity
      )
    ) {
      this.costing.costingDetails.paper1Cost = this.roundToFour(
        this.costing.paper1Rate * this.costing.costingDetails.paper1Quantity
      );
    } else {
      this.costing.costingDetails.paper1Cost = 0;
    }
    this.calcCost();
    this.calcRawMaterialCost();
    this.autoCalcRates();
  }

  calcPaper2Cost() {
    if (
      this.validator.isNotNullAndUndefined(this.costing.paper2Rate) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.paper2Quantity
      )
    ) {
      this.costing.costingDetails.paper2Cost = this.roundToFour(
        this.costing.paper2Rate * this.costing.costingDetails.paper2Quantity
      );
    } else {
      this.costing.costingDetails.paper2Cost = 0;
    }
    this.calcCost();
    this.calcRawMaterialCost();
  }

  onPlateMachineChange() {
    let index = this.mTapeMachines.findIndex(
      (obj) => obj.id == this.costing.costingDetails.plateMachineId
    );
    this.costing.costingDetails.plate.rate = this.mTapeMachines[index].rate;
    this.calcPlateCost();
  }

  calcPlateCost() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.plate.rate
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.plate.quantity
      )
    ) {
      this.costing.costingDetails.plate.cost = this.roundToFour(
        this.costing.costingDetails.plate.rate *
          this.costing.costingDetails.plate.quantity
      );
    } else {
      this.costing.costingDetails.plate.cost = 0;
    }
    this.calcCost();
    this.calcRawMaterialCost();
  }

  onPlateQuantityChange() {
    this.calcPlateCost();
    this.calcInkRate2();
  }

  autoCalcRates() {
    this.calcInkRate2();
    this.calcDieRate2();
    this.calcFoilBlockRate2();
    this.calcEmboBlockRate2();
    this.calcScreenPrintRate2();
    this.calcGummingRate2();
    this.calcPastingRate2();
    this.calcLaminationRate2();
    this.calcUVRate2();
    this.calcFoilRate2();
    this.calcVarnishRate2();
    this.calcAquasCoatingRate2();
    this.calcEmbossOrDebossRate2();
    this.calcPunchingRate2();
    this.calcCuttingRate2();
    this.calcPorFRate2();
    this.calcDigitalRate2();
    this.calcStringOrJuteRate2();
    this.calcEyeletRate2();
    this.calcKnurlingRate2();
    this.calcFilmRate2();
    this.calcScoringRate2();
  }

  calcInkRate2() {
    //division error check
    if (
      this.validator.isNotAPostiveNumber(this.costing.costingDetails.inkCopies)
    ) {
      alert('Field: Ink copies should be greater than 0');
    } else {
      if (
        this.validator.isNotNullAndUndefined(
          this.costing.costingDetails.inkCopies
        ) &&
        this.validator.isNotNullAndUndefined(
          this.costing.costingDetails.ink.value
        ) &&
        this.validator.isNotNullAndUndefined(this.costing.runCopies) &&
        this.validator.isNotNullAndUndefined(this.costing.makeReady) &&
        this.validator.isNotNullAndUndefined(
          this.costing.costingDetails.plate.quantity
        ) &&
        this.validator.isNotNullAndUndefined(
          this.costing.costingDetails.screenPrint.quantity
        )
      ) {
        this.costing.costingDetails.ink.rate = this.roundToFour(
          this.costing.costingDetails.ink.value *
            ((this.costing.runCopies + this.costing.makeReady) /
              this.costing.costingDetails.inkCopies) *
            (this.costing.costingDetails.plate.quantity +
              this.costing.costingDetails.screenPrint.quantity)
        );
      } else {
        this.costing.costingDetails.ink.rate = 0;
      }
    }
    this.calcInkCost();
  }

  calcInkCost() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.ink.rate
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.ink.quantity
      )
    ) {
      this.costing.costingDetails.ink.cost = this.roundToFour(
        this.costing.costingDetails.ink.rate *
          this.costing.costingDetails.ink.quantity
      );
    } else {
      this.costing.costingDetails.ink.cost = 0;
    }
    this.calcCost();
    this.calcRawMaterialCost();
  }

  calcScreenCost() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.screen.rate
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.screen.quantity
      )
    ) {
      this.costing.costingDetails.screen.cost = this.roundToFour(
        this.costing.costingDetails.screen.rate *
          this.costing.costingDetails.screen.quantity
      );
    } else {
      this.costing.costingDetails.screen.cost = 0;
    }
    this.calcCost();
  }

  calcDieRate2() {
    // if (
    //   this.validator.isNotNullAndUndefined(
    //     this.costing.costingDetails.die.value
    //   )
    // ) {
    //   this.costing.costingDetails.die.rate =
    //     this.costing.costingDetails.die.value * 30 + 1500;
    // } else {
    //   this.costing.costingDetails.die.rate = 0;
    // }
    this.calcDieCost();
  }

  calcDieCost() {
    // if (
    //   this.validator.isNotNullAndUndefined(
    //     this.costing.costingDetails.die.rate
    //   ) &&
    //   this.validator.isNotNullAndUndefined(
    //     this.costing.costingDetails.die.quantity
    //   )
    // ) {
    //   this.costing.costingDetails.die.cost = this.roundToFour(
    //     this.costing.costingDetails.die.rate *
    //       this.costing.costingDetails.die.quantity
    //   );
    // } else {
    //   this.costing.costingDetails.die.cost = 0;
    // }

    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.die.value
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.die.rate
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.die.quantity
      )
    ) {
      this.costing.costingDetails.die.cost = this.roundToFour(
        (this.costing.costingDetails.die.value +
          this.costing.costingDetails.die.rate) *
          this.costing.costingDetails.die.quantity
      );
    } else {
      this.costing.costingDetails.die.cost = 0;
    }

    this.calcCost();
    this.calcRawMaterialCost();
  }

  calcFoilBlockRate2() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.baseDetails.runBoardLength
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.baseDetails.runBoardWidth
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.foilBlock.value
      )
    ) {
      this.costing.costingDetails.foilBlock.rate = this.roundToFour(
        this.costing.baseDetails.runBoardLength *
          this.costing.baseDetails.runBoardWidth *
          this.costing.costingDetails.foilBlock.value
      );
    } else {
      this.costing.costingDetails.foilBlock.rate = 0;
    }
    this.calcFoilBlockCost();
  }

  calcFoilBlockCost() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.foilBlock.rate
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.foilBlock.quantity
      )
    ) {
      this.costing.costingDetails.foilBlock.cost = this.roundToFour(
        this.costing.costingDetails.foilBlock.rate *
          this.costing.costingDetails.foilBlock.quantity
      );
    } else {
      this.costing.costingDetails.foilBlock.cost = 0;
    }
    this.calcCost();
    this.calcRawMaterialCost();
  }

  calcEmboBlockRate2() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.baseDetails.runBoardLength
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.baseDetails.runBoardWidth
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.emboBlock.value
      )
    ) {
      this.costing.costingDetails.emboBlock.rate = this.roundToFour(
        this.costing.baseDetails.runBoardLength *
          this.costing.baseDetails.runBoardWidth *
          this.costing.costingDetails.emboBlock.value
      );
    } else {
      this.costing.costingDetails.emboBlock.rate = 0;
    }
    this.calcEmboBlockCost();
  }

  calcEmboBlockCost() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.emboBlock.rate
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.emboBlock.quantity
      )
    ) {
      this.costing.costingDetails.emboBlock.cost = this.roundToFour(
        this.costing.costingDetails.emboBlock.rate *
          this.costing.costingDetails.emboBlock.quantity
      );
    } else {
      this.costing.costingDetails.emboBlock.cost = 0;
    }
    this.calcCost();
    this.calcRawMaterialCost();
  }

  calcScreenPrintRate2() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.baseDetails.runBoardLength
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.baseDetails.runBoardWidth
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.screenPrint.value
      ) &&
      this.validator.isNotNullAndUndefined(this.costing.runCopies) &&
      this.validator.isNotNullAndUndefined(this.costing.makeReady)
    ) {
      this.costing.costingDetails.screenPrint.rate = this.roundToFour(
        this.costing.baseDetails.runBoardLength *
          (this.costing.baseDetails.runBoardWidth *
            this.costing.costingDetails.screenPrint.value) *
          (this.costing.runCopies + this.costing.makeReady)
      );
    } else {
      this.costing.costingDetails.screenPrint.rate = 0;
    }
    this.calcScreenPrintCost();
  }

  calcScreenPrintCost() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.screenPrint.rate
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.screenPrint.quantity
      )
    ) {
      this.costing.costingDetails.screenPrint.cost = this.roundToFour(
        this.costing.costingDetails.screenPrint.rate *
          this.costing.costingDetails.screenPrint.quantity
      );
    } else {
      this.costing.costingDetails.screenPrint.cost = 0;
    }
    this.calcCost();
  }

  onScreenPrintQuantityChange() {
    this.calcScreenPrintCost();
    this.calcInkRate2();
  }

  onOffsetPrintMachineChange() {
    let index = this.mTapeMachines.findIndex(
      (obj) => obj.id == this.costing.costingDetails.offsetPrintMachineId
    );
    this.costing.costingDetails.offsetPrint.rate =
      this.mTapeMachines[index].rate;
    this.calcOffsetPrintCost();
  }

  calcOffsetPrintCost() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.offsetPrint.rate
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.offsetPrint.quantity
      )
    ) {
      this.costing.costingDetails.offsetPrint.cost = this.roundToFour(
        (this.costing.costingDetails.offsetPrint.rate + 0) *
          this.costing.costingDetails.offsetPrint.quantity
      );
      // 0 above might get modified in future to include big machine cost
    } else {
      this.costing.costingDetails.offsetPrint.cost = 0;
    }
    this.calcCost();
  }

  calcGummingRate2() {
    if (
      this.validator.isNotNullAndUndefined(this.costing.baseDetails.gumArea1) &&
      this.validator.isNotNullAndUndefined(this.costing.baseDetails.gumArea2) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.gumming.value
      ) &&
      this.validator.isNotNullAndUndefined(this.costing.runCopies) &&
      this.validator.isNotNullAndUndefined(this.costing.makeReady)
    ) {
      this.costing.costingDetails.gumming.rate = this.roundToFour(
        this.costing.baseDetails.gumArea1 *
          this.costing.baseDetails.gumArea2 *
          (this.costing.runCopies + this.costing.makeReady) *
          this.costing.costingDetails.gumming.value
      );
    } else {
      this.costing.costingDetails.gumming.rate = 0;
    }
    this.calcGummingCost();
  }

  calcGummingCost() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.gumming.rate
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.gumming.quantity
      )
    ) {
      this.costing.costingDetails.gumming.cost = this.roundToFour(
        this.costing.costingDetails.gumming.rate *
          this.costing.costingDetails.gumming.quantity
      );
    } else {
      this.costing.costingDetails.gumming.cost = 0;
    }
    this.calcCost();
    this.calcRawMaterialCost();
  }

  calcPastingRate2() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.baseDetails.pastingArea1
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.baseDetails.pastingArea2
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.pasting.value
      ) &&
      this.validator.isNotNullAndUndefined(this.costing.runCopies) &&
      this.validator.isNotNullAndUndefined(this.costing.makeReady)
    ) {
      this.costing.costingDetails.pasting.rate = this.roundToFour(
        this.costing.baseDetails.pastingArea1 *
          this.costing.baseDetails.pastingArea2 *
          this.costing.costingDetails.pasting.value *
          (this.costing.runCopies + this.costing.makeReady)
      );
    } else {
      this.costing.costingDetails.pasting.rate = 0;
    }
    this.calcPastingCost();
  }

  calcPastingCost() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.pasting.rate
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.pasting.quantity
      )
    ) {
      this.costing.costingDetails.pasting.cost = this.roundToFour(
        this.costing.costingDetails.pasting.rate *
          this.costing.costingDetails.pasting.quantity
      );
    } else {
      this.costing.costingDetails.pasting.cost = 0;
    }
    this.calcCost();
    this.calcRawMaterialCost();
  }

  calcLaminationRate2() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.baseDetails.runBoardLength
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.baseDetails.runBoardWidth
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.lamination.value
      ) &&
      this.validator.isNotNullAndUndefined(this.costing.runCopies) &&
      this.validator.isNotNullAndUndefined(this.costing.makeReady)
    ) {
      this.costing.costingDetails.lamination.rate = this.roundToFour(
        this.costing.baseDetails.runBoardLength *
          this.costing.baseDetails.runBoardWidth *
          this.costing.costingDetails.lamination.value *
          (this.costing.runCopies + this.costing.makeReady)
      );
    } else {
      this.costing.costingDetails.lamination.rate = 0;
    }
    this.calcLaminationCost();
  }

  calcLaminationCost() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.lamination.rate
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.lamination.quantity
      )
    ) {
      this.costing.costingDetails.lamination.cost = this.roundToFour(
        this.costing.costingDetails.lamination.rate *
          this.costing.costingDetails.lamination.quantity
      );
    } else {
      this.costing.costingDetails.lamination.cost = 0;
    }
    this.calcCost();
    this.calcRawMaterialCost();
  }

  calcUVRate2() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.baseDetails.runBoardLength
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.baseDetails.runBoardWidth
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.uv.value
      ) &&
      this.validator.isNotNullAndUndefined(this.costing.runCopies) &&
      this.validator.isNotNullAndUndefined(this.costing.makeReady)
    ) {
      this.costing.costingDetails.uv.rate = this.roundToFour(
        this.costing.baseDetails.runBoardLength *
          this.costing.baseDetails.runBoardWidth *
          this.costing.costingDetails.uv.value *
          (this.costing.runCopies + this.costing.makeReady)
      );
    } else {
      this.costing.costingDetails.uv.rate = 0;
    }
    this.calcUVCost();
  }

  calcUVCost() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.uv.rate
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.uv.quantity
      )
    ) {
      this.costing.costingDetails.uv.cost = this.roundToFour(
        this.costing.costingDetails.uv.rate *
          this.costing.costingDetails.uv.quantity
      );
    } else {
      this.costing.costingDetails.uv.cost = 0;
    }
    this.calcCost();
    this.calcRawMaterialCost();
  }

  calcFoilRate2() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.baseDetails.runBoardLength
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.baseDetails.runBoardWidth
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.foil.value
      ) &&
      this.validator.isNotNullAndUndefined(this.costing.runCopies) &&
      this.validator.isNotNullAndUndefined(this.costing.makeReady)
    ) {
      this.costing.costingDetails.foil.rate = this.roundToFour(
        this.costing.baseDetails.runBoardLength *
          this.costing.baseDetails.runBoardWidth *
          this.costing.costingDetails.foil.value *
          (this.costing.runCopies + this.costing.makeReady)
      );
    } else {
      this.costing.costingDetails.foil.rate = 0;
    }
    this.calcFoilCost();
  }

  calcFoilCost() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.foil.rate
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.foil.quantity
      )
    ) {
      this.costing.costingDetails.foil.cost = this.roundToFour(
        this.costing.costingDetails.foil.rate *
          this.costing.costingDetails.foil.quantity
      );
    } else {
      this.costing.costingDetails.foil.cost = 0;
    }
    this.calcCost();
    this.calcRawMaterialCost();
  }

  calcVarnishRate2() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.baseDetails.runBoardLength
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.baseDetails.runBoardWidth
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.varnish.value
      ) &&
      this.validator.isNotNullAndUndefined(this.costing.runCopies) &&
      this.validator.isNotNullAndUndefined(this.costing.makeReady)
    ) {
      this.costing.costingDetails.varnish.rate = this.roundToFour(
        this.costing.baseDetails.runBoardLength *
          this.costing.baseDetails.runBoardWidth *
          this.costing.costingDetails.varnish.value *
          (this.costing.runCopies + this.costing.makeReady)
      );
    } else {
      this.costing.costingDetails.varnish.rate = 0;
    }
    this.calcVarnishCost();
  }

  calcVarnishCost() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.varnish.rate
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.varnish.quantity
      )
    ) {
      this.costing.costingDetails.varnish.cost = this.roundToFour(
        this.costing.costingDetails.varnish.rate *
          this.costing.costingDetails.varnish.quantity
      );
    } else {
      this.costing.costingDetails.varnish.cost = 0;
    }
    this.calcCost();
  }

  calcAquasCoatingRate2() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.baseDetails.runBoardLength
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.baseDetails.runBoardWidth
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.aquasCoating.value
      ) &&
      this.validator.isNotNullAndUndefined(this.costing.runCopies) &&
      this.validator.isNotNullAndUndefined(this.costing.makeReady)
    ) {
      this.costing.costingDetails.aquasCoating.rate = this.roundToFour(
        this.costing.baseDetails.runBoardLength *
          this.costing.baseDetails.runBoardWidth *
          this.costing.costingDetails.aquasCoating.value *
          (this.costing.runCopies + this.costing.makeReady)
      );
    } else {
      this.costing.costingDetails.aquasCoating.rate = 0;
    }
    this.calcAquasCoatingCost();
  }

  calcAquasCoatingCost() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.aquasCoating.rate
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.aquasCoating.quantity
      )
    ) {
      this.costing.costingDetails.aquasCoating.cost = this.roundToFour(
        this.costing.costingDetails.aquasCoating.rate *
          this.costing.costingDetails.aquasCoating.quantity
      );
    } else {
      this.costing.costingDetails.aquasCoating.cost = 0;
    }
    this.calcCost();
  }

  calcEmbossOrDebossRate2() {
    if (
      this.validator.isNotNullAndUndefined(this.costing.runCopies) &&
      this.validator.isNotNullAndUndefined(this.costing.makeReady)
    ) {
      this.costing.costingDetails.embossOrDeboss.rate = this.roundToFour(
        (this.costing.runCopies + this.costing.makeReady) / 700
      );
    } else {
      this.costing.costingDetails.embossOrDeboss.rate = 0;
    }
  }

  calcEmbossOrDebossCost() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.embossOrDeboss.value
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.embossOrDeboss.quantity
      )
    ) {
      this.costing.costingDetails.embossOrDeboss.cost = this.roundToFour(
        this.costing.costingDetails.embossOrDeboss.value *
          this.costing.costingDetails.embossOrDeboss.quantity
      );
    } else {
      this.costing.costingDetails.embossOrDeboss.cost = 0;
    }
    this.calcEmbossOrDebossRate2();
    this.calcCost();
  }

  calcPunchingRate2() {
    if (
      this.validator.isNotNullAndUndefined(this.costing.runCopies) &&
      this.validator.isNotNullAndUndefined(this.costing.makeReady)
    ) {
      this.costing.costingDetails.punching.rate = this.roundToFour(
        (this.costing.runCopies + this.costing.makeReady) / 700
      );
    } else {
      this.costing.costingDetails.punching.rate = 0;
    }
  }

  calcPunchingCost() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.punching.value
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.punching.quantity
      )
    ) {
      this.costing.costingDetails.punching.cost = this.roundToFour(
        this.costing.costingDetails.punching.value *
          this.costing.costingDetails.punching.quantity
      );
    } else {
      this.costing.costingDetails.punching.cost = 0;
    }
    this.calcPunchingRate2();
    this.calcCost();
  }

  calcCuttingRate2() {
    if (
      this.validator.isNotNullAndUndefined(this.costing.runCopies) &&
      this.validator.isNotNullAndUndefined(this.costing.makeReady)
    ) {
      this.costing.costingDetails.cutting.rate = this.roundToFour(
        (this.costing.runCopies + this.costing.makeReady) / 5000
      );
    } else {
      this.costing.costingDetails.cutting.rate = 0;
    }
  }

  calcCuttingCost() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.cutting.value
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.cutting.quantity
      )
    ) {
      this.costing.costingDetails.cutting.cost = this.roundToFour(
        this.costing.costingDetails.cutting.value *
          this.costing.costingDetails.cutting.quantity
      );
    } else {
      this.costing.costingDetails.cutting.cost = 0;
    }
    this.calcCuttingRate2();
    this.calcCost();
  }

  calcPorFRate2() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.pOrF.value
      ) &&
      this.validator.isNotNullAndUndefined(this.costing.orderQuantity) &&
      this.validator.isNotNullAndUndefined(this.costing.excessValue)
    ) {
      this.costing.costingDetails.pOrF.rate = this.roundToFour(
        this.costing.costingDetails.pOrF.value *
          (this.costing.orderQuantity + this.costing.excessValue)
      );
    } else {
      this.costing.costingDetails.pOrF.rate = 0;
    }
    this.calcPorFCost();
  }

  calcPorFCost() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.pOrF.rate
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.pOrF.quantity
      )
    ) {
      this.costing.costingDetails.pOrF.cost = this.roundToFour(
        this.costing.costingDetails.pOrF.rate *
          this.costing.costingDetails.pOrF.quantity
      );
    } else {
      this.costing.costingDetails.pOrF.cost = 0;
    }
    this.calcCost();
  }

  calcDigitalRate2() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.digital.value
      ) &&
      this.validator.isNotNullAndUndefined(this.costing.runCopies) &&
      this.validator.isNotNullAndUndefined(this.costing.makeReady)
    ) {
      this.costing.costingDetails.digital.rate = this.roundToFour(
        this.costing.costingDetails.digital.value *
          (this.costing.runCopies + this.costing.makeReady)
      );
    } else {
      this.costing.costingDetails.digital.rate = 0;
    }
    this.calcDigitalCost();
  }

  calcDigitalCost() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.digital.rate
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.digital.quantity
      )
    ) {
      this.costing.costingDetails.digital.cost = this.roundToFour(
        this.costing.costingDetails.digital.rate *
          this.costing.costingDetails.digital.quantity
      );
    } else {
      this.costing.costingDetails.digital.cost = 0;
    }
    this.calcCost();
  }

  calcStringOrJuteRate2() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.stringOrJute.value
      ) &&
      this.validator.isNotNullAndUndefined(this.costing.orderQuantity) &&
      this.validator.isNotNullAndUndefined(this.costing.excessValue)
    ) {
      this.costing.costingDetails.stringOrJute.rate = this.roundToFour(
        this.costing.costingDetails.stringOrJute.value *
          (this.costing.orderQuantity + this.costing.excessValue)
      );
    } else {
      this.costing.costingDetails.stringOrJute.rate = 0;
    }
    this.calcStringOrJuteCost();
  }

  calcStringOrJuteCost() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.stringOrJute.rate
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.stringOrJute.quantity
      )
    ) {
      this.costing.costingDetails.stringOrJute.cost = this.roundToFour(
        this.costing.costingDetails.stringOrJute.rate *
          this.costing.costingDetails.stringOrJute.quantity
      );
    } else {
      this.costing.costingDetails.stringOrJute.cost = 0;
    }
    this.calcCost();
    this.calcRawMaterialCost();
  }

  calcEyeletRate2() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.eyelet.value
      ) &&
      this.validator.isNotNullAndUndefined(this.costing.orderQuantity) &&
      this.validator.isNotNullAndUndefined(this.costing.excessValue)
    ) {
      this.costing.costingDetails.eyelet.rate = this.roundToFour(
        this.costing.costingDetails.eyelet.value *
          (this.costing.orderQuantity + this.costing.excessValue)
      );
    } else {
      this.costing.costingDetails.eyelet.rate = 0;
    }
    this.calcEyeletCost();
  }

  calcEyeletCost() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.eyelet.rate
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.eyelet.quantity
      )
    ) {
      this.costing.costingDetails.eyelet.cost = this.roundToFour(
        this.costing.costingDetails.eyelet.rate *
          this.costing.costingDetails.eyelet.quantity
      );
    } else {
      this.costing.costingDetails.eyelet.cost = 0;
    }
    this.calcCost();
    this.calcRawMaterialCost();
  }

  calcKnurlingRate2() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.knurling.value
      ) &&
      this.validator.isNotNullAndUndefined(this.costing.runCopies) &&
      this.validator.isNotNullAndUndefined(this.costing.makeReady)
    ) {
      this.costing.costingDetails.knurling.rate = this.roundToFour(
        this.costing.costingDetails.knurling.value *
          (this.costing.runCopies + this.costing.makeReady)
      );
    } else {
      this.costing.costingDetails.knurling.rate = 0;
    }
    this.calcKnurlingCost();
  }

  calcKnurlingCost() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.knurling.rate
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.knurling.quantity
      )
    ) {
      this.costing.costingDetails.knurling.cost = this.roundToFour(
        this.costing.costingDetails.knurling.rate *
          this.costing.costingDetails.knurling.quantity
      );
    } else {
      this.costing.costingDetails.knurling.cost = 0;
    }
    this.calcCost();
    this.calcRawMaterialCost();
  }

  calcFilmRate2() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.film.value
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.baseDetails.runBoardLength
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.baseDetails.runBoardWidth
      )
    ) {
      this.costing.costingDetails.film.rate = this.roundToFour(
        this.costing.baseDetails.runBoardLength *
          2.54 *
          (this.costing.baseDetails.runBoardWidth * 2.54) *
          this.costing.costingDetails.film.value
      );
    } else {
      this.costing.costingDetails.film.rate = 0;
    }
    this.calcFilmCost();
  }

  calcFilmCost() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.film.rate
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.film.quantity
      )
    ) {
      this.costing.costingDetails.film.cost = this.roundToFour(
        this.costing.costingDetails.film.quantity *
          this.costing.costingDetails.film.rate
      );
    } else {
      this.costing.costingDetails.film.cost = 0;
    }
    this.calcCost();
    this.calcRawMaterialCost();
  }

  calcScoringRate2() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.scoring.value
      ) &&
      this.validator.isNotNullAndUndefined(this.costing.runCopies) &&
      this.validator.isNotNullAndUndefined(this.costing.makeReady)
    ) {
      this.costing.costingDetails.scoring.rate = this.roundToFour(
        (this.costing.runCopies + this.costing.makeReady) *
          this.costing.costingDetails.scoring.value
      );
    } else {
      this.costing.costingDetails.scoring.rate = 0;
    }
    this.calcScoringCost();
  }

  calcScoringCost() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.scoring.rate
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.scoring.quantity
      )
    ) {
      this.costing.costingDetails.scoring.cost = this.roundToFour(
        this.costing.costingDetails.scoring.quantity *
          this.costing.costingDetails.scoring.rate
      );
    } else {
      this.costing.costingDetails.scoring.cost = 0;
    }

    // if (
    //   this.validator.isNotNullAndUndefined(this.costing.runCopies) &&
    //   this.validator.isNotNullAndUndefined(this.costing.makeReady) &&
    //   this.validator.isNotNullAndUndefined(
    //     this.costing.costingDetails.scoring.value
    //   ) &&
    //   this.validator.isNotNullAndUndefined(
    //     this.costing.costingDetails.scoring.quantity
    //   )
    // ) {
    //   this.costing.costingDetails.scoring.cost = this.roundToFour(
    //     (this.costing.runCopies + this.costing.makeReady) *
    //       this.costing.costingDetails.scoring.quantity *
    //       this.costing.costingDetails.scoring.value
    //   );
    // } else {
    //   this.costing.costingDetails.scoring.cost = 0;
    // }

    this.calcCost();
  }

  calcRawMaterialCost() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.paper1Cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.paper2Cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.plate.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.ink.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.die.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.foilBlock.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.emboBlock.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.gumming.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.pasting.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.lamination.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.uv.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.foil.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.stringOrJute.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.eyelet.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.knurling.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.film.cost
      )
    ) {
      this.costing.costingDetails.rawMaterialCost = this.roundToFour(
        this.costing.costingDetails.paper1Cost +
          this.costing.costingDetails.paper2Cost +
          this.costing.costingDetails.plate.cost +
          this.costing.costingDetails.ink.cost +
          this.costing.costingDetails.die.cost +
          this.costing.costingDetails.foilBlock.cost +
          this.costing.costingDetails.emboBlock.cost +
          this.costing.costingDetails.gumming.cost +
          this.costing.costingDetails.pasting.cost +
          this.costing.costingDetails.lamination.cost +
          this.costing.costingDetails.uv.cost +
          this.costing.costingDetails.foil.cost +
          this.costing.costingDetails.stringOrJute.cost +
          this.costing.costingDetails.eyelet.cost +
          this.costing.costingDetails.knurling.cost +
          this.costing.costingDetails.film.cost
      );
    } else {
      this.costing.costingDetails.rawMaterialCost = 0;
    }
    this.calcRawMaterialRatePerPiece();
  }

  calcRawMaterialRatePerPiece() {
    if (
      this.validator.isNotNullAndUndefined(this.costing.orderQuantity) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.rawMaterialCost
      )
    ) {
      this.costing.costingDetails.rawMaterialRatePerPiece = this.roundToFour(
        this.costing.costingDetails.rawMaterialCost / this.costing.orderQuantity
      );
    } else {
      this.costing.costingDetails.rawMaterialRatePerPiece = 0;
    }
  }

  calcCost() {
    if (
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.designAndProofCost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.adminCharge
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.paper1Cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.paper2Cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.plate.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.ink.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.screen.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.die.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.foilBlock.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.emboBlock.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.screenPrint.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.offsetPrint.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.gumming.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.pasting.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.lamination.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.uv.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.foil.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.varnish.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.aquasCoating.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.embossOrDeboss.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.punching.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.cutting.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.pOrF.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.digital.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.stringOrJute.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.eyelet.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.knurling.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.film.cost
      ) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.scoring.cost
      )
    ) {
      this.costing.costingDetails.cost = this.roundToFour(
        this.costing.costingDetails.designAndProofCost +
          this.costing.costingDetails.adminCharge +
          this.costing.costingDetails.paper1Cost +
          this.costing.costingDetails.paper2Cost +
          this.costing.costingDetails.plate.cost +
          this.costing.costingDetails.ink.cost +
          this.costing.costingDetails.screen.cost +
          this.costing.costingDetails.die.cost +
          this.costing.costingDetails.foilBlock.cost +
          this.costing.costingDetails.emboBlock.cost +
          this.costing.costingDetails.screenPrint.cost +
          this.costing.costingDetails.offsetPrint.cost +
          this.costing.costingDetails.gumming.cost +
          this.costing.costingDetails.pasting.cost +
          this.costing.costingDetails.lamination.cost +
          this.costing.costingDetails.uv.cost +
          this.costing.costingDetails.foil.cost +
          this.costing.costingDetails.varnish.cost +
          this.costing.costingDetails.aquasCoating.cost +
          this.costing.costingDetails.embossOrDeboss.cost +
          this.costing.costingDetails.punching.cost +
          this.costing.costingDetails.cutting.cost +
          this.costing.costingDetails.pOrF.cost +
          this.costing.costingDetails.digital.cost +
          this.costing.costingDetails.stringOrJute.cost +
          this.costing.costingDetails.eyelet.cost +
          this.costing.costingDetails.knurling.cost +
          this.costing.costingDetails.film.cost +
          this.costing.costingDetails.scoring.cost
      );
    } else {
      this.costing.costingDetails.cost = 0;
    }
    this.calcTotalCost();
  }

  calcTotalCost() {
    if (
      this.validator.isNotNullAndUndefined(this.costing.costingDetails.cost) &&
      this.validator.isNotNullAndUndefined(
        this.costing.costingDetails.profitPercentage
      )
    ) {
      this.costing.costingDetails.profit = this.roundToFour(
        this.costing.costingDetails.cost *
          (this.costing.costingDetails.profitPercentage / 100)
      );

      this.costing.costingDetails.totalCost = this.roundToFour(
        this.costing.costingDetails.cost +
          this.costing.costingDetails.profit +
          (this.costing.costingDetails.deliveryCost
            ? this.costing.costingDetails.deliveryCost
            : 0)
      );

      this.costing.costingDetails.ratePerPiece = this.roundToFour(
        this.costing.costingDetails.totalCost / this.costing.orderQuantity
      );

      this.setSlabRatePrice();
    } else {
      this.costing.costingDetails.profit = 0;
      this.costing.costingDetails.totalCost = 0;
      this.costing.costingDetails.ratePerPiece = 0;
      this.setSlabRatePrice();
    }
  }

  setSlabRateQuantity() {
    this.slabRates.quantitySlab = String(this.costing.orderQuantity);
  }

  setSlabRatePrice() {
    this.slabRates.price = this.costing.costingDetails.ratePerPiece;
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
      .uploadTagAttachment(
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
    } else if (
      this.validator.isEmptyString(this.costing.executiveId) &&
      this.validator.isEmptyString(this.costing.tManagerEmail)
    ) {
      this.snackBarService.showWarningSnack(
        this.accessType == 'TManager'
          ? 'Territory Manager - email Not found'
          : 'Executive - UserID Not found'
      );
    } else if (this.validator.isEmptyString(this.costing.productName)) {
      this.snackBarService.showWarningSnack('Please enter the Product Name');
    } else if (this.validator.isNotAPostiveNumber(this.costing.productLength)) {
      this.snackBarService.showWarningSnack('Please enter the Product Length');
    } else if (this.validator.isNotAPostiveNumber(this.costing.productWidth)) {
      this.snackBarService.showWarningSnack('Please enter the Product Width');
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
    } else if (this.validator.isNotANumber(this.costing.orderQuantity)) {
      this.snackBarService.showWarningSnack('Please enter the Order Quantity');
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
      this.costingService.createTag(this.costing).subscribe(
        (data) => {
          if (data) {
            this.uploadImage(data.refNo);
          } else {
            // we received null - indicating recursion failure
            alert(
              'R - Error while saving - Tag costing sheet. Please contact the administrator.'
            );
            console.log(
              'Recursion failure - Indicating Mismatch in Reference Number sequence'
            );
            this.disableSaveBtn = false;
          }
        },
        (err) => {
          alert(
            'Error while saving - Tag costing sheet. Please contact the administrator'
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
      this.costingService.updateTag(this.costing).subscribe(
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
      if (this.validator.isEmptyString(this.costing.paper1.id)) {
        this.snackBarService.showWarningSnack('Please select the Paper 1');
      } else if (this.validator.isEmptyString(this.costing.paper2.id)) {
        this.snackBarService.showWarningSnack('Please select the Paper 2');
      } else if (this.validator.isNotANumber(this.costing.paper1CutSize)) {
        this.snackBarService.showWarningSnack(
          'Please enter the Paper 1 - Cut Size'
        );
      } else if (this.validator.isNotANumber(this.costing.paper2CutSize)) {
        this.snackBarService.showWarningSnack(
          'Please enter the Paper 2 - Cut Size'
        );
      } else if (this.validator.isNotANumber(this.costing.excessPercentage)) {
        this.snackBarService.showWarningSnack(
          'Please enter the Excess Percentage'
        );
      } else if (this.validator.isNotANumber(this.costing.excessValue)) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error : Excess Value'
        );
      } else if (this.validator.isNotANumber(this.costing.ups)) {
        this.snackBarService.showWarningSnack('Please enter the ups');
      } else if (this.validator.isNotANumber(this.costing.runCopies)) {
        this.snackBarService.showWarningSnack(
          'Autocalculation Error : Run Copies'
        );
      } else if (this.validator.isNotANumber(this.costing.makeReady)) {
        this.snackBarService.showWarningSnack('Please enter the Make Ready');
      } else if (this.validator.isNotANumber(this.costing.paper1NoOfBoard)) {
        this.snackBarService.showWarningSnack(
          'Autocalculation error: Paper 1 - No of Board'
        );
      } else if (this.validator.isNotANumber(this.costing.paper2NoOfBoard)) {
        this.snackBarService.showWarningSnack(
          'Autocalculation error: Paper 2 - No of Board'
        );
      } else if (this.validator.isNotANumber(this.costing.paper1Rate)) {
        this.snackBarService.showWarningSnack(
          'Autocalculation error: Paper 1 - Rate'
        );
      } else if (this.validator.isNotANumber(this.costing.paper2Rate)) {
        this.snackBarService.showWarningSnack(
          'Autocalculation error: Paper 2 - Rate'
        );
      } else if (
        this.validator.isNotANumber(this.costing.baseDetails.runBoardLength)
      ) {
        this.snackBarService.showWarningSnack(
          'Please enter the Run Board Length'
        );
      } else if (
        this.validator.isNotANumber(this.costing.baseDetails.runBoardWidth)
      ) {
        this.snackBarService.showWarningSnack(
          'Please enter the Run Board Width'
        );
      } else if (
        this.validator.isNotANumber(this.costing.baseDetails.gumArea1)
      ) {
        this.snackBarService.showWarningSnack('Please enter the Gum Area 1');
      } else if (
        this.validator.isNotANumber(this.costing.baseDetails.gumArea2)
      ) {
        this.snackBarService.showWarningSnack('Please enter the Gum Area 2');
      } else if (
        this.validator.isNotANumber(this.costing.baseDetails.pastingArea1)
      ) {
        this.snackBarService.showWarningSnack(
          'Please enter the Pasting Area 1'
        );
      } else if (
        this.validator.isNotANumber(this.costing.baseDetails.pastingArea2)
      ) {
        this.snackBarService.showWarningSnack(
          'Please enter the Pasting Area 2'
        );
      } else if (
        this.validator.isNotANumber(
          this.costing.costingDetails.designAndProofCost
        )
      ) {
        this.snackBarService.showWarningSnack(
          'Please enter the Design & Proof Cost'
        );
      } else if (
        this.validator.isNotANumber(
          this.costing.costingDetails.designAndProofCost
        )
      ) {
        this.snackBarService.showWarningSnack(
          'Please enter the Design & Proof Cost'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.adminCharge)
      ) {
        this.snackBarService.showWarningSnack('Please enter the Admin Charge');
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.paper1Quantity)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Please enter the Paper 1 Quantity'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.paper1Cost)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Autocalculation Error - Paper 1 Cost'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.paper2Quantity)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Please enter the Paper 2 Quantity'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.paper2Cost)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Autocalculation Error - Paper 2 Cost'
        );
      } else if (
        this.validator.isEmptyString(this.costing.costingDetails.plateMachineId)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Please select the Plate Machine'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.plate.rate)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table:Autocalculation Error - Plate Rate'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.plate.quantity)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Please enter the Plate Quantity'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.plate.cost)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Autocalculation Error - Plate Cost'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.inkCopies)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Please enter the Ink Copies'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.ink.quantity)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Please enter the Ink Quantity'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.ink.cost)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Autocalculation Error - Ink Cost'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.screen.quantity)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Please enter the Screen Quantity'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.screen.cost)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Autocalculation Error - Screen Cost'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.die.quantity)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Please enter the Die Quantity'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.die.cost)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Autocalculation Error - Die Cost'
        );
      } else if (
        this.validator.isNotANumber(
          this.costing.costingDetails.foilBlock.quantity
        )
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Please enter the Foil Block Quantity'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.foilBlock.cost)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Autocalculation Error - Foil Block Cost'
        );
      } else if (
        this.validator.isNotANumber(
          this.costing.costingDetails.emboBlock.quantity
        )
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Please enter the Embo Block Quantity'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.emboBlock.cost)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Autocalculation Error - Embo Block Cost'
        );
      } else if (
        this.validator.isNotANumber(
          this.costing.costingDetails.screenPrint.quantity
        )
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Please enter the Screen Print Quantity'
        );
      } else if (
        this.validator.isNotANumber(
          this.costing.costingDetails.screenPrint.cost
        )
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Autocalculation Error - Screen Print Cost'
        );
      } else if (
        this.validator.isEmptyString(
          this.costing.costingDetails.offsetPrintMachineId
        )
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Please select the Offset Print Machine'
        );
      } else if (
        this.validator.isNotANumber(
          this.costing.costingDetails.offsetPrint.rate
        )
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table:Autocalculation Error - Offset Print Rate'
        );
      } else if (
        this.validator.isNotANumber(
          this.costing.costingDetails.offsetPrint.quantity
        )
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Please enter the Offset Print Quantity'
        );
      } else if (
        this.validator.isNotANumber(
          this.costing.costingDetails.offsetPrint.cost
        )
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Autocalculation Error - Offset Print Cost'
        );
      } else if (
        this.validator.isNotANumber(
          this.costing.costingDetails.gumming.quantity
        )
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Please enter the Gumming Quantity'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.gumming.cost)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Autocalculation Error - Gumming Cost'
        );
      } else if (
        this.validator.isNotANumber(
          this.costing.costingDetails.pasting.quantity
        )
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Please enter the Pasting Quantity'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.pasting.cost)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Autocalculation Error - Pasting Cost'
        );
      } else if (
        this.validator.isNotANumber(
          this.costing.costingDetails.lamination.quantity
        )
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Please enter the Lamination Quantity'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.lamination.cost)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Autocalculation Error - Lamination Cost'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.uv.quantity)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Please enter the UV Quantity'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.uv.cost)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Autocalculation Error - UV Cost'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.foil.quantity)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Please enter the Foil Quantity'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.foil.cost)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Autocalculation Error - Foil Cost'
        );
      } else if (
        this.validator.isNotANumber(
          this.costing.costingDetails.varnish.quantity
        )
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Please enter the Varnish Quantity'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.varnish.cost)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Autocalculation Error - Varnish Cost'
        );
      } else if (
        this.validator.isNotANumber(
          this.costing.costingDetails.aquasCoating.quantity
        )
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Please enter the Aquas Coating Quantity'
        );
      } else if (
        this.validator.isNotANumber(
          this.costing.costingDetails.aquasCoating.cost
        )
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Autocalculation Error - Aquas Coating Cost'
        );
      } else if (
        this.validator.isNotANumber(
          this.costing.costingDetails.embossOrDeboss.quantity
        )
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Please enter the Emboss / Deboss Quantity'
        );
      } else if (
        this.validator.isNotANumber(
          this.costing.costingDetails.embossOrDeboss.cost
        )
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Autocalculation Error - Emboss / Deboss Cost'
        );
      } else if (
        this.validator.isNotANumber(
          this.costing.costingDetails.punching.quantity
        )
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Please enter the Punching Quantity'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.punching.cost)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Autocalculation Error - Punching Cost'
        );
      } else if (
        this.validator.isNotANumber(
          this.costing.costingDetails.cutting.quantity
        )
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Please enter the Cutting Quantity'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.cutting.cost)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Autocalculation Error - Cutting Cost'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.pOrF.quantity)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Please enter the P / F Quantity'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.pOrF.cost)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Autocalculation Error - P / F Cost'
        );
      } else if (
        this.validator.isNotANumber(
          this.costing.costingDetails.digital.quantity
        )
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Please enter the Digital Quantity'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.digital.cost)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Autocalculation Error - Digital Cost'
        );
      } else if (
        this.validator.isNotANumber(
          this.costing.costingDetails.stringOrJute.quantity
        )
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Please enter the String / Jute Quantity'
        );
      } else if (
        this.validator.isNotANumber(
          this.costing.costingDetails.stringOrJute.cost
        )
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Autocalculation Error - String / Jute Cost'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.eyelet.quantity)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Please enter the Eyelet Quantity'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.eyelet.cost)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Autocalculation Error - Eyelet Cost'
        );
      } else if (
        this.validator.isNotANumber(
          this.costing.costingDetails.knurling.quantity
        )
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Please enter the Knurling Quantity'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.knurling.cost)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Autocalculation Error - Knurling Cost'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.film.quantity)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Please enter the Film Quantity'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.film.cost)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Autocalculation Error - Film Cost'
        );
      } else if (
        this.validator.isNotANumber(
          this.costing.costingDetails.scoring.quantity
        )
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Please enter the Scoring Quantity'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.scoring.cost)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details Table: Autocalculation Error - Scoring Cost'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.cost)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details : Autocalculation Error - Cost'
        );
      } else if (
        this.validator.isNotANumber(
          this.costing.costingDetails.profitPercentage
        )
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details : Please enter the Profit %'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.profit)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details : Autocalculation Error - Profit'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.deliveryCost)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details : Please enter the Delivery Cost'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.totalCost)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details : Autocalculation Error - Total Cost'
        );
      } else if (
        this.validator.isNotANumber(this.costing.costingDetails.ratePerPiece)
      ) {
        this.snackBarService.showWarningSnack(
          'Costing details : Autocalculation Error - Rate / Pcs'
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
      this.costingService.updateTag(this.costing).subscribe(
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
    this.costingApprovalDetails.productName = this.costing.productName;
    this.costingApprovalDetails.customerName = this.costing.customerName;
    this.costingApprovalDetails.trimType = 'Tag';
    this.costingApprovalDetails.productLength = String(
      this.costing.productLength + ' CM'
    );
    this.costingApprovalDetails.productWidth = String(
      this.costing.productWidth + ' CM'
    );
    // this.costingApprovalDetails.paymentTerms = this.costing.paymentTerms;
    this.costingApprovalDetails.slabRates = this.costing.slabRates;
    if (!forCustomer) {
      this.costingApprovalDetails.approvalLink = `${Configuration.domainURL}header/login/costingApproval/Tag--${this.costing.id}`;
    } else {
      this.costingApprovalDetails.approvalLink = `${Configuration.domainURL}header/login/costingApprovalForCustomer/Tag--${this.costing.id}`;
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
      this.costingService.updateTag(this.costing).subscribe(
        (data) => {
          this.snackBarService.showSuccessSnack(
            'Costing sheet rejected successfully'
          );
        },
        (err) => console.log('Error while rejecting costing sheet')
      );
    } else {
      if (this.validateAdministratorInput()) {
        this.costingService.updateTag(this.costing).subscribe(
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

    const costingModal = document.getElementById('pdf-container-tag');
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

            //update the costing status on MTagCosting and MCommonDetailsCosting
            this.costingService.updateTag(this.costing).subscribe(
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
        let res = await this.costingService.approveTagByCustomer(
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
        let res = await this.costingService.rejectTagByCustomer(
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
    //     let res = await this.costingService.rejectTagByCustomer(
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
    if (this.costingService.createDraftOrderTag(this.costing.id)) {
      this.snackBarService.showSuccessSnack('Draft order created successfully');
      this.back();
    } else {
      this.snackBarService.showSuccessSnack('Error while creating draft order');
      this.disableDraftOrderBtn = false;
    }
  }
}
