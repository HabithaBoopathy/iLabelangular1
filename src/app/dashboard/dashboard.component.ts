import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { MultiDataSet } from 'ng2-charts';
import { SingleDataSet } from 'ng2-charts';
import { EverythingService } from '../services/orderForms/everything.service';
import { Everything } from '../models/orderForms/Everything';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Userprofile } from '../models/userprofile';
import { UserService } from '../services/user.service';
import { Logs } from '../models/log';
import { LogService } from '../services/log.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Mexecutive } from './../models/mexecutive';
import { MexecutiveService } from './../services/mexecutive.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit{

  mexecutives: Observable<Mexecutive[]>;
  mexecutive: Mexecutive = new Mexecutive();

  id2: string;

  trimTypeBarChart: string;
  trimTypePolarChart: string;
  trimTypeDoughChart: string;

  // Home Page Chart View
  public barchart:boolean = true
  public doughchart:boolean = false
  public polarchart:boolean = false

  // Bar Chart Views
  public showNormalBarChart:boolean = true
  public showPrintedBarChart:boolean = false
  public showTagBarChart:boolean = false
  public showStickerBarChart:boolean = false
  public showWovenBarChart:boolean = false

  // Polar Chart Views
  public showNormalPolarChart:boolean = true
  public showPrintedPolarChart:boolean = false
  public showTagPolarChart:boolean = false
  public showStickerPolarChart:boolean = false
  public showWovenPolarChart:boolean = false

  // Polar Chart Views
  public showNormalDoughChart:boolean = true
  public showPrintedDoughChart:boolean = false
  public showTagDoughChart:boolean = false
  public showStickerDoughChart:boolean = false
  public showWovenDoughChart:boolean = false

  logNum: number = 0;

  logMax: number = 0;

  Logs: Observable<Logs[]>;

  log: Logs = new Logs();

  //User Profile Variables
  Users: Observable<Userprofile[]>;
  user: Userprofile = new Userprofile();

  togglebarchart(){
    this.barchart = true;
    this.doughchart = false;
    this.polarchart = false;
    this.trimTypeBarChart = "overall";
    this.toggleOverall();
  }

  toggledoughchart(){
    this.doughchart = true;
    this.barchart = false;
    this.polarchart = false;
    this.trimTypeDoughChart = "overall";
    this.toggleDoughOverall();
  }

  togglepolarchart(){
    this.polarchart = true;
    this.barchart = false;
    this.doughchart = false;
    this.trimTypePolarChart = "overall";
    this.togglePolarOverall();
  }


  // Bar Charts
  toggleOverall(){
    this.showNormalBarChart = true;
    this.showTagBarChart = false;
    this.showPrintedBarChart = false;
    this.showStickerBarChart = false;
    this.showWovenBarChart = false;
  }

  toggleBarPrinted(){
    this.showPrintedBarChart = true;
    this.showNormalBarChart = false;
    this.showTagBarChart = false;
    this.showStickerBarChart = false;
    this.showWovenBarChart = false;
    this.barChartPrintedSampleCount();
    this.barChartPrintedTransactionStatus();
  }

  toggleBarTag(){
    this.showTagBarChart = true;
    this.showNormalBarChart = false;
    this.showPrintedBarChart = false;
    this.showStickerBarChart = false;
    this.showWovenBarChart = false;
    this.barChartTagSampleCount();
    this.barChartTagTransactionStatus();
  }

  toggleBarSticker(){
    this.showStickerBarChart = true;
    this.showNormalBarChart = false;
    this.showPrintedBarChart = false;
    this.showTagBarChart = false;
    this.showWovenBarChart = false;
    this.barChartStickerSampleCount();
    this.barChartStickerTransactionStatus();
  }

  toggleBarWoven(){
    this.showWovenBarChart = true;
    this.showStickerBarChart = false;
    this.showNormalBarChart = false;
    this.showPrintedBarChart = false;
    this.showTagBarChart = false;
    this.barChartWovenSampleCount();
    this.barChartWovenTransactionStatus();
  }


  // Polar Charts
  togglePolarOverall(){
    this.showNormalPolarChart = true;
    this.showPrintedPolarChart = false;
    this.showTagPolarChart = false;
    this.showStickerPolarChart = false;
    this.showWovenPolarChart = false;
  }

  togglePolarPrinted(){
    this.showPrintedPolarChart = true;
    this.showNormalPolarChart = false;
    this.showTagPolarChart = false;
    this.showStickerPolarChart = false;
    this.showWovenPolarChart = false;
    this.polarChartPrintedSampleCount();
    this.polarChartPrintedTransactionStatus();
  }

  togglePolarTag(){
    this.showTagPolarChart = true;
    this.showPrintedPolarChart = false;
    this.showStickerPolarChart = false;
    this.showWovenPolarChart = false;
    this.showNormalPolarChart = false;
    this.polarChartTagSampleCount();
    this.polarChartTagTransactionStatus();
  }

  togglePolarSticker(){
    this.showStickerPolarChart = true;
    this.showTagPolarChart = false;
    this.showWovenPolarChart = false;
    this.showPrintedPolarChart = false;
    this.showNormalPolarChart = false;
    this.polarChartStickerSampleCount();
    this.polarChartStickerTransactionStatus();
  }

  togglePolarWoven(){
    this.showWovenPolarChart = true;
    this.showStickerPolarChart = false;
    this.showTagPolarChart = false;
    this.showPrintedPolarChart = false;
    this.showNormalPolarChart = false;
    this.polarChartWovenSampleCount();
    this.polarChartWovenTransactionStatus();
  }


// Dough Charts
  toggleDoughOverall(){
    this.showNormalDoughChart = true;
    this.showPrintedDoughChart = false;
    this.showTagDoughChart = false;
    this.showStickerDoughChart = false;
    this.showWovenDoughChart = false;
  }

  toggleDoughPrinted(){
    this.showNormalDoughChart = false;
    this.showPrintedDoughChart = true;
    this.showTagDoughChart = false;
    this.showStickerDoughChart = false;
    this.showWovenDoughChart = false;
    this.doughChartPrintedSampleCount();
    this.doughChartPrintedTransactionStatus();
  }

  toggleDoughTag(){
    this.showNormalDoughChart = false;
    this.showPrintedDoughChart = false;
    this.showTagDoughChart = true;
    this.showStickerDoughChart = false;
    this.showWovenDoughChart = false;
    this.doughChartTagSampleCount();
    this.doughChartTagTransactionStatus();
  }

  toggleDoughSticker(){
    this.showNormalDoughChart = false;
    this.showPrintedDoughChart = false;
    this.showTagDoughChart = false;
    this.showStickerDoughChart = true;
    this.showWovenDoughChart = false;
    this.doughChartStickerSampleCount();
    this.doughChartStickerTransactionStatus();
  }

  toggleDoughWoven(){
    this.showNormalDoughChart = false;
    this.showPrintedDoughChart = false;
    this.showTagDoughChart = false;
    this.showStickerDoughChart = false;
    this.showWovenDoughChart = true;
    this.doughChartWovenSampleCount();
    this.doughChartWovenTransactionStatus();
  }

  id: number;
  everythingObs: Observable<Everything[]>;
  everything: Everything = new Everything();
  submitted: boolean;

  // Bar
  printedNumbar : number = 0
  tagNumbar : number = 0
  stickerNumbar : number = 0
  wovenNumbar : number = 0

  sampleRequestInitiatedbar : number = 0;
  customerExecutiveApprovalbar : number = 0;
  sampleInitiatedbar : number = 0;
  rejectionbar : number = 0;
  productionbar : number = 0;
  quotationDispatchbar : number = 0;
  sampleApprovedbar : number = 0;
  sampleRejectedbar : number = 0;

  printedAlone: number = 0;
  tagAlone: number = 0;
  stickerAlone: number = 0;
  wovenAlone: number = 0;

  printedSampleRequestInitiatedbar : number = 0;
  printedCustomerExecutiveApprovalbar : number = 0;
  printedSampleInitiatedbar : number = 0;
  printedRejectionbar : number = 0;
  printedProductionbar : number = 0;
  printedQuotationDispatchbar : number = 0;
  printedSampleApprovedbar : number = 0;
  printedSampleRejectedbar : number = 0;

  tagSampleRequestInitiatedbar : number = 0;
  tagCustomerExecutiveApprovalbar : number = 0;
  tagSampleInitiatedbar : number = 0;
  tagRejectionbar : number = 0;
  tagProductionbar : number = 0;
  tagQuotationDispatchbar : number = 0;
  tagSampleApprovedbar : number = 0;
  tagSampleRejectedbar : number = 0;

  stickerSampleRequestInitiatedbar : number = 0;
  stickerCustomerExecutiveApprovalbar : number = 0;
  stickerSampleInitiatedbar : number = 0;
  stickerRejectionbar : number = 0;
  stickerProductionbar : number = 0;
  stickerQuotationDispatchbar : number = 0;
  stickerSampleApprovedbar : number = 0;
  stickerSampleRejectedbar : number = 0;

  wovenSampleRequestInitiatedbar : number = 0;
  wovenCustomerExecutiveApprovalbar : number = 0;
  wovenSampleInitiatedbar : number = 0;
  wovenRejectionbar : number = 0;
  wovenProductionbar : number = 0;
  wovenQuotationDispatchbar : number = 0;
  wovenSampleApprovedbar : number = 0;
  wovenSampleRejectedbar : number = 0;




  // Polar
  printedNumpolar : number = 0
  tagNumpolar : number = 0
  stickerNumpolar : number = 0
  wovenNumpolar : number = 0

  printedNumpolarAlone : number = 0
  tagNumpolarAlone : number = 0
  stickerNumpolarAlone : number = 0
  wovenNumpolarAlone : number = 0

  sampleRequestInitiatedPolar : number = 0;
  customerExecutiveApprovalPolar : number = 0;
  sampleInitiatedPolar : number = 0;
  rejectionPolar : number = 0;
  productionPolar : number = 0;
  quotationDispatchPolar : number = 0;
  sampleApprovedPolar : number = 0;
  sampleRejectedPolar : number = 0;

  wovenSampleRequestInitiatedPolar : number = 0;
  wovenCustomerExecutiveApprovalPolar : number = 0;
  wovenSampleInitiatedPolar : number = 0;
  wovenRejectionPolar : number = 0;
  wovenProductionPolar : number = 0;
  wovenQuotationDispatchPolar : number = 0;
  wovenSampleApprovedPolar : number = 0;
  wovenSampleRejectedPolar : number = 0;

  tagSampleRequestInitiatedPolar : number = 0;
  tagCustomerExecutiveApprovalPolar : number = 0;
  tagSampleInitiatedPolar : number = 0;
  tagRejectionPolar : number = 0;
  tagProductionPolar : number = 0;
  tagQuotationDispatchPolar : number = 0;
  tagSampleApprovedPolar : number = 0;
  tagSampleRejectedPolar : number = 0;

  stickerSampleRequestInitiatedPolar : number = 0;
  stickerCustomerExecutiveApprovalPolar : number = 0;
  stickerSampleInitiatedPolar : number = 0;
  stickerRejectionPolar : number = 0;
  stickerProductionPolar : number = 0;
  stickerQuotationDispatchPolar : number = 0;
  stickerSampleApprovedPolar : number = 0;
  stickerSampleRejectedPolar : number = 0;

  printedSampleRequestInitiatedPolar : number = 0;
  printedCustomerExecutiveApprovalPolar : number = 0;
  printedSampleInitiatedPolar : number = 0;
  printedRejectionPolar : number = 0;
  printedProductionPolar : number = 0;
  printedQuotationDispatchPolar : number = 0;
  printedSampleApprovedPolar : number = 0;
  printedSampleRejectedPolar : number = 0;

  // Dough
  printedNumdough : number = 0
  tagNumdough : number = 0
  stickerNumdough : number = 0
  wovenNumdough: number = 0

  printedNumdoughAlone : number = 0
  tagNumdoughAlone : number = 0
  stickerNumdoughAlone : number = 0
  wovenNumdoughAlone : number = 0

  sampleRequestInitiatedDough : number = 0;
  customerExecutiveApprovalDough : number = 0;
  sampleInitiatedDough : number = 0;
  rejectionDough : number = 0;
  productionDough : number = 0;
  quotationDispatchDough : number = 0;
  sampleApprovedDough : number = 0;
  sampleRejectedDough : number = 0;

  wovenSampleRequestInitiatedDough : number = 0;
  wovenCustomerExecutiveApprovalDough : number = 0;
  wovenSampleInitiatedDough : number = 0;
  wovenRejectionDough : number = 0;
  wovenProductionDough : number = 0;
  wovenQuotationDispatchDough : number = 0;
  wovenSampleApprovedDough : number = 0;
  wovenSampleRejectedDough : number = 0;

  tagSampleRequestInitiatedDough : number = 0;
  tagCustomerExecutiveApprovalDough : number = 0;
  tagSampleInitiatedDough : number = 0;
  tagRejectionDough : number = 0;
  tagProductionDough : number = 0;
  tagQuotationDispatchDough : number = 0;
  tagSampleApprovedDough : number = 0;
  tagSampleRejectedDough : number = 0;

  stickerSampleRequestInitiatedDough : number = 0;
  stickerCustomerExecutiveApprovalDough : number = 0;
  stickerSampleInitiatedDough : number = 0;
  stickerRejectionDough : number = 0;
  stickerProductionDough : number = 0;
  stickerQuotationDispatchDough : number = 0;
  stickerSampleApprovedDough : number = 0;
  stickerSampleRejectedDough : number = 0;

  printedSampleRequestInitiatedDough : number = 0;
  printedCustomerExecutiveApprovalDough : number = 0;
  printedSampleInitiatedDough : number = 0;
  printedRejectionDough : number = 0;
  printedProductionDough : number = 0;
  printedQuotationDispatchDough : number = 0;
  printedSampleApprovedDough : number = 0;
  printedSampleRejectedDough : number = 0;


  allEmail = [];

  constructor (
    private logService: LogService,
    private http:HttpClient,
    private everythingService: EverythingService,
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private mexecutiveService: MexecutiveService,
    ) {}

    useExecutiveCode : string


  // Bar Chart Functions for Sample Count (Main View)

  barchartsamplecount()
  {
      // Customer View
      if(localStorage.getItem('token') === "Customer"){

        this.everythingService.getByCustomerTrimTypeCount(localStorage.getItem('emailToken')).subscribe(data => {
          this.num = data;

            this.barChartData = [
              { data: [this.num[0],this.num[1],this.num[2],this.num[3]], label: 'Trim Types'},
            ];
        });

      }

      // Sales View
      else if(localStorage.getItem('token') === "Sales Team"){
        this.mexecutiveService.getByExecutiveEmail(localStorage.getItem('emailToken')).subscribe(data => {
          this.everything = data;

          this.useExecutiveCode = data.code

          this.everythingService.getByExecutiveTrimTypeCount(this.useExecutiveCode).subscribe(data => {
            this.num = data;

              this.barChartData = [
                { data: [this.num[0], this.num[1], this.num[2], this.num[3]], label: 'Trim Types'},
              ];
          });
        });
      }


      // Administrator and Sample Head View
      else if(localStorage.getItem('token') === "Administrator" || localStorage.getItem('token') === "Sample Head"){
        this.everythingService.getTrimTypeCount().subscribe(data => {
         this.num = data;

          this.barChartData = [
            { data: [this.num[0],this.num[1],this.num[2],this.num[3]], label: 'Trim Types'},
          ];
      })

    }
  }

  wovenTestBar: number = 0;
  num = [];

    // Bar Chart for Sample Count (Main View)
    barChartOptions: ChartOptions = {
      responsive: true,
      onClick: this.show,
      scales: {
        yAxes: [{
          gridLines: {
            zeroLineWidth: 1,
          },
          ticks: {
            beginAtZero: true
          }
        }],

      },
      legend: {
        onClick: null,
        position: "top",
        align: "center",
        labels: {
          fontSize: 14,
        },

      }
    };
    barChartLabels: Label[] = ['Woven', 'Sticker', 'Tag', 'Printed'];

    barChartType: ChartType = 'bar';
    barChartLegend = true;
    barChartPlugins = [];

    // barChartsClick = this.show();

    show() {
      window.open('/home/orders', '_self');
    }

    barChartColors: Color[] = [
      { backgroundColor: ['rgb(68, 193, 214, 0.6)', 'rgb(54,162,235,0.6)', 'rgb(218, 74, 32, 0.6)', 'rgb(191, 130, 169, 0.6)']},
    ]
    barChartData: ChartDataSets[] = [
      { data:
        [this.wovenNumbar,this.stickerNumbar,this.tagNumbar,this.printedNumbar], label: 'Trim Types', },
    ];



// Bar Chart Functions for Transaction Status (Main View)

barcharttransaction()
{
      // Customer View
      if(localStorage.getItem('token') === "Customer"){

        this.everythingService.getByCustomerTransactionCount(localStorage.getItem('emailToken')).subscribe(data => {
          this.num = data;

            this.barChartData1 = [
              { data: [this.num[0], this.num[1], this.num[2], this.num[3], this.num[4], this.num[5], this.num[6], this.num[7]], label: 'Trim Types'},
            ];
        });

      }


      // Sales View
      else if(localStorage.getItem('token') === "Sales Team"){
        this.mexecutiveService.getByExecutiveEmail(localStorage.getItem('emailToken')).subscribe(data => {
          this.everything = data;

          this.useExecutiveCode = data.code

          this.everythingService.getByExecutiveTransactionCount(this.useExecutiveCode).subscribe(data => {
            this.num = data;

            this.barChartData1 = [
              { data: [this.num[0], this.num[1], this.num[2], this.num[3], this.num[4], this.num[5], this.num[6], this.num[7]], label: 'Trim Types'},
            ];
          });

        });
      }


        // Administrator and Sample Head View
        else if(localStorage.getItem('token') === "Administrator" || localStorage.getItem('token') === "Sample Head"){

          this.everythingService.getByAdminTransactionstatus().subscribe(data => {
            this.num = data;

              this.barChartData1 = [
                { data: [this.num[0], this.num[1], this.num[2], this.num[3], this.num[4], this.num[5], this.num[6], this.num[7]], label: 'Trim Types'},
              ];
          });

        }

}

// Bar Chart for Transaction Status (Main View)

barChartOptions1: ChartOptions = {
  responsive: true,
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true
      }
    }]
  }
};
barChartLabels1: Label[] = ['Sample Request Initiated', 'Customer / Executive Approval', 'Sample Initiated', 'Rejection (Production)', 'Production', 'Quotation / Dispatch', 'Sample Approved','Sample Rejected'];

barChartType1: ChartType = 'bar';
barChartLegend1 = true;
barChartPlugins1 = [];

barChartColors1: Color[] = [
  { backgroundColor: ['rgb(191, 130, 169, 0.6)', 'rgb(218, 74, 32, 0.6)', 'rgb(54,162,235,0.6)', 'rgb(28, 153, 194, 0.6)', 'rgb(58, 103, 124, 0.6)', 'rgb(68, 193, 214, 0.6)', 'rgb(72, 63, 191, 0.6)', 'rgb(172, 83, 121, 0.6)']},
]
barChartData1: ChartDataSets[] = [
  { data: [this.sampleRequestInitiatedbar, this.customerExecutiveApprovalbar, this.sampleInitiatedbar, this.rejectionbar, this.productionbar, this.quotationDispatchbar, this.sampleApprovedbar, this.sampleRejectedbar], label: 'Trim Types'},

];

// Bar Charts For Individual Trim Types Starts

// Bar Chart Function For Printed (Based on Sample Count)

barChartPrintedSampleCount(){

   // Customer View
   if(localStorage.getItem('token') === "Customer"){
    this.everythingService.getByCustomerTrimTypeCount(localStorage.getItem('emailToken')).subscribe(data => {
      this.num = data;

        this.barChartDataPrinted = [
          { data: [0, 0, 0, this.num[3]], label: 'Trim Types'},
        ];
    });
  }

   // Sales View
    else if(localStorage.getItem('token') === "Sales Team"){
      this.mexecutiveService.getByExecutiveEmail(localStorage.getItem('emailToken')).subscribe(data => {
        this.everything = data;
        this.useExecutiveCode = data.code

        this.everythingService.getByExecutiveTrimTypeCount(this.useExecutiveCode).subscribe(data => {
          this.num = data;

            this.barChartDataPrinted = [
              { data: [0, 0, 0, this.num[3]], label: 'Trim Types'},
            ];
        });
      });
    }

     // Administrator and Sample Head View
     else if(localStorage.getItem('token') === "Administrator" || localStorage.getItem('token') === "Sample Head"){
      this.everythingService.getTrimTypeCount().subscribe(data => {
        this.num = data;

          this.barChartDataPrinted = [
            { data: [0, 0, 0, this.num[3]], label: 'Trim Types'},
          ];
      });
    }
}


// Bar Chart Function For Tag (Based on Sample Count)

barChartTagSampleCount(){
 // Customer View
 if(localStorage.getItem('token') === "Customer"){

    this.everythingService.getByCustomerTrimTypeCount(localStorage.getItem('emailToken')).subscribe(data => {
      this.num = data;

        this.barChartDataTag = [
          { data: [0, 0, this.num[2], 0], label: 'Trim Types'},
        ];
    });
  }

 // Sales View
  else if(localStorage.getItem('token') === "Sales Team"){
    this.mexecutiveService.getByExecutiveEmail(localStorage.getItem('emailToken')).subscribe(data => {
      this.everything = data;
      this.useExecutiveCode = data.code

      this.everythingService.getByExecutiveTrimTypeCount(this.useExecutiveCode).subscribe(data => {
        this.num = data;

          this.barChartDataTag = [
            { data: [0, 0, this.num[2], 0], label: 'Trim Types'},
          ];
      });
    });
  }

   // Administrator and Sample Head View
   else if(localStorage.getItem('token') === "Administrator" || localStorage.getItem('token') === "Sample Head"){

    this.everythingService.getTrimTypeCount().subscribe(data => {
      this.num = data;

        this.barChartDataTag = [
          { data: [0, 0, this.num[2], 0], label: 'Trim Types'},
        ];
    });
   }
  }


  // Bar Chart Function For Sticker (Based on Sample Count)

  barChartStickerSampleCount(){

  // Customer View
  if(localStorage.getItem('token') === "Customer"){

    this.everythingService.getByCustomerTrimTypeCount(localStorage.getItem('emailToken')).subscribe(data => {
      this.num = data;

        this.barChartDataSticker = [
          { data: [0, this.num[1], 0, 0], label: 'Trim Types'},
        ];
    });
  }

  // Sales View
    else if(localStorage.getItem('token') === "Sales Team"){
      this.mexecutiveService.getByExecutiveEmail(localStorage.getItem('emailToken')).subscribe(data => {
        this.everything = data;
        this.useExecutiveCode = data.code

        this.everythingService.getByExecutiveTrimTypeCount(this.useExecutiveCode).subscribe(data => {
          this.num = data;

            this.barChartDataSticker = [
              { data: [0, this.num[1], 0, 0], label: 'Trim Types'},
            ];
        });
      });
    }

    // Administrator and Sample Head View
    else if(localStorage.getItem('token') === "Administrator" || localStorage.getItem('token') === "Sample Head"){

      this.everythingService.getTrimTypeCount().subscribe(data => {
        this.num = data;

          this.barChartDataSticker = [
            { data: [0, this.num[1], 0, 0], label: 'Trim Types'},
          ];
      });
    }
  }


  // Bar Chart Function For Woven (Based on Sample Count)

  barChartWovenSampleCount(){

  // Customer View
  if(localStorage.getItem('token') === "Customer"){

    this.everythingService.getByCustomerTrimTypeCount(localStorage.getItem('emailToken')).subscribe(data => {
      this.num = data;

        this.barChartDataWoven = [
          { data: [this.num[0]], label: 'Trim Types'},
        ];
    });
  }

  // Sales View
    else if(localStorage.getItem('token') === "Sales Team"){
      this.mexecutiveService.getByExecutiveEmail(localStorage.getItem('emailToken')).subscribe(data => {
        this.everything = data;
        this.useExecutiveCode = data.code

        this.everythingService.getByExecutiveTrimTypeCount(this.useExecutiveCode).subscribe(data => {
          this.num = data;

            this.barChartDataWoven = [
              { data: [this.num[0]], label: 'Trim Types'},
            ];
        });
      });
    }

    // Administrator and Sample Head View
    else if(localStorage.getItem('token') === "Administrator" || localStorage.getItem('token') === "Sample Head"){
      this.everythingService.getTrimTypeCount().subscribe(data => {
        this.num = data;

          this.barChartDataWoven = [
            { data: [this.num[0]], label: 'Trim Types'},
          ];
      });
    }
  }

// Bar Charts For Individual Trim Types Ends


  // Bar Chart for Printed Trim Type Sample Count

barChartOptionsPrinted: ChartOptions = {
  responsive: true,
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true
      }
    }]
  }
};
barChartLabelsPrinted: Label[] = ['Woven', 'Sticker', 'Tag', 'Printed'];

barChartTypePrinted: ChartType = 'bar';
barChartLegendPrinted = true;
barChartPluginsPrinted = [];

barChartColorsPrinted: Color[] = [
  { backgroundColor: ['rgb(68, 193, 214, 0.6)', 'rgb(54,162,235,0.6)', 'rgb(218, 74, 32, 0.6)', 'rgb(191, 130, 169, 0.6)']},
]
barChartDataPrinted: ChartDataSets[] = [
  { data: [0, 0, 0, this.printedAlone], label: 'Trim Types'},

];


  // Bar Chart for Tag Trim Type Sample Count

  barChartOptionsTag: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };
  barChartLabelsTag: Label[] = ['Woven', 'Sticker', 'Tag', 'Printed'];

  barChartTypeTag: ChartType = 'bar';
  barChartLegendTag = true;
  barChartPluginsTag = [];

  barChartColorsTag: Color[] = [
    { backgroundColor: ['rgb(68, 193, 214, 0.6)', 'rgb(54,162,235,0.6)', 'rgb(218, 74, 32, 0.6)', 'rgb(191, 130, 169, 0.6)']},
  ]
  barChartDataTag: ChartDataSets[] = [
    { data: [0, 0, this.tagAlone, 0], label: 'Trim Types'},

  ];


  // Bar Chart for Sticker Trim Type Sample Count

  barChartOptionsSticker: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };
  barChartLabelsSticker: Label[] = ['Woven', 'Sticker', 'Tag', 'Printed'];

  barChartTypeSticker: ChartType = 'bar';
  barChartLegendSticker = true;
  barChartPluginsSticker = [];

  barChartColorsSticker: Color[] = [
    { backgroundColor: ['rgb(68, 193, 214, 0.6)', 'rgb(54,162,235,0.6)', 'rgb(218, 74, 32, 0.6)', 'rgb(191, 130, 169, 0.6)']},
  ]
  barChartDataSticker: ChartDataSets[] = [
    { data: [0, this.stickerAlone, 0, 0], label: 'Trim Types'},

  ];


  // Bar Chart for Woven Trim Type Sample Count

  barChartOptionsWoven: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };
  barChartLabelsWoven: Label[] = ['Woven', 'Sticker', 'Tag', 'Printed'];

  barChartTypeWoven: ChartType = 'bar';
  barChartLegendWoven = true;
  barChartPluginsWoven = [];

  barChartColorsWoven: Color[] = [
    { backgroundColor: ['rgb(68, 193, 214, 0.6)', 'rgb(54,162,235,0.6)', 'rgb(218, 74, 32, 0.6)', 'rgb(191, 130, 169, 0.6)']},
  ]
  barChartDataWoven: ChartDataSets[] = [
    { data: [this.wovenAlone, 0, 0, 0], label: 'Trim Types'},
  ];


// Bar Chart Functions based on Transaction Status and Sample Name Starts


// Bar Chart Function For Woven (Based on Transaction Status and Sample Name)

  barChartWovenTransactionStatus(){

    if(localStorage.getItem('token') === "Customer"){

    // Customer View
    this.everythingService.getByCustomerAllDetails(localStorage.getItem('emailToken')).subscribe(data => {
      this.num = data;

        this.barChartDataWovenTransaction = [
          { data: [this.num[0], this.num[1], this.num[2], this.num[3], this.num[4], this.num[5], this.num[6], this.num[7]], label: 'Trim Types'},
        ];
    });

    }


    // Sales View
   else if(localStorage.getItem('token') === "Sales Team"){
    this.mexecutiveService.getByExecutiveEmail(localStorage.getItem('emailToken')).subscribe(data => {
      this.everything = data;
      this.useExecutiveCode = data.code

    this.everythingService.getByExecutiveAllDetails(this.useExecutiveCode).subscribe(data => {
      this.num = data;

      this.barChartDataWovenTransaction = [
        { data: [this.num[0], this.num[1], this.num[2], this.num[3], this.num[4], this.num[5], this.num[6], this.num[7]], label: 'Trim Types'},
      ];
      });

    });
  }


  else if(localStorage.getItem('token') === "Administrator" || localStorage.getItem('token') === "Sample Head"){

    this.everythingService.getByAdminAllDetails().subscribe(data => {
      this.num = data;

        this.barChartDataWovenTransaction = [
          { data: [this.num[0], this.num[1], this.num[2], this.num[3], this.num[4], this.num[5], this.num[6], this.num[7]], label: 'Trim Types'},
        ];
      });

    }
  }


  // Bar Chart Function For Tag (Based on Transaction Status and Sample Name)

  barChartTagTransactionStatus(){

    if(localStorage.getItem('token') === "Customer"){

    // Customer View
     this.everythingService.getByCustomerAllDetails(localStorage.getItem('emailToken')).subscribe(data => {
      this.num = data;

        this.barChartDataTagTransaction = [
          { data: [this.num[16], this.num[17], this.num[18], this.num[19], this.num[20], this.num[21], this.num[22], this.num[23]], label: 'Trim Types'},
        ];
    });

  }

  // Sales View
   else if(localStorage.getItem('token') === "Sales Team"){
    this.mexecutiveService.getByExecutiveEmail(localStorage.getItem('emailToken')).subscribe(data => {
      this.everything = data;
      this.useExecutiveCode = data.code

      this.everythingService.getByExecutiveAllDetails(this.useExecutiveCode).subscribe(data => {
        this.num = data;

        this.barChartDataTagTransaction = [
          { data: [this.num[16], this.num[17], this.num[18], this.num[19], this.num[20], this.num[21], this.num[22], this.num[23]], label: 'Trim Types'},
        ];
      });

    });
   }

  //  Admin View
   else if(localStorage.getItem('token') === "Administrator" || localStorage.getItem('token') === "Sample Head"){

    this.everythingService.getByAdminAllDetails().subscribe(data => {
      this.num = data;

        this.barChartDataTagTransaction = [
          { data: [this.num[16], this.num[17], this.num[18], this.num[19], this.num[20], this.num[21], this.num[22], this.num[23]], label: 'Trim Types'},
        ];
      });
   }
  }


  // Bar Chart Function For Printed (Based on Transaction Status and Sample Name)

  barChartPrintedTransactionStatus(){

    if(localStorage.getItem('token') === "Customer"){

      this.everythingService.getByCustomerAllDetails(localStorage.getItem('emailToken')).subscribe(data => {
      this.num = data;

        this.barChartDataPrintedTransaction = [
          { data: [this.num[24], this.num[25], this.num[26], this.num[27], this.num[28], this.num[29], this.num[30], this.num[31]], label: 'Trim Types'},
        ];
      });

    }

     // Sales View
   else if(localStorage.getItem('token') === "Sales Team"){
    this.mexecutiveService.getByExecutiveEmail(localStorage.getItem('emailToken')).subscribe(data => {
      this.everything = data;
      this.useExecutiveCode = data.code

      this.everythingService.getByExecutiveAllDetails(this.useExecutiveCode).subscribe(data => {
        this.num = data;

        this.barChartDataPrintedTransaction = [
          { data: [this.num[24], this.num[25], this.num[26], this.num[27], this.num[28], this.num[29], this.num[30], this.num[31]], label: 'Trim Types'},
        ];
      });
    });
   }

  //  Admin View
   else if(localStorage.getItem('token') === "Administrator" || localStorage.getItem('token') === "Sample Head"){

    this.everythingService.getByAdminAllDetails().subscribe(data => {
      this.num = data;

        this.barChartDataPrintedTransaction = [
          { data: [this.num[24], this.num[25], this.num[26], this.num[27], this.num[28], this.num[29], this.num[30], this.num[31]], label: 'Trim Types'},
        ];
    });

   }
  }


  // Bar Chart Function For Sticker (Based on Transaction Status and Sample Name)

   barChartStickerTransactionStatus(){

    if(localStorage.getItem('token') === "Customer"){

      // Customer View
      this.everythingService.getByCustomerAllDetails(localStorage.getItem('emailToken')).subscribe(data => {
        this.num = data;

          this.barChartDataStickerTransaction = [
            { data: [this.num[8], this.num[9], this.num[10], this.num[11], this.num[12], this.num[13], this.num[14], this.num[15]], label: 'Trim Types'},
          ];
      });
    }

     // Sales View
     else if(localStorage.getItem('token') === "Sales Team"){
      this.mexecutiveService.getByExecutiveEmail(localStorage.getItem('emailToken')).subscribe(data => {
        this.everything = data;

        this.useExecutiveCode = data.code

      this.everythingService.getByExecutiveAllDetails(this.useExecutiveCode).subscribe(data => {
        this.num = data;

        this.barChartDataStickerTransaction = [
          { data: [this.num[8], this.num[9], this.num[10], this.num[11], this.num[12], this.num[13], this.num[14], this.num[15]], label: 'Trim Types'},
        ];
      });

    });
  }


    // Admin View
    else if(localStorage.getItem('token') === "Administrator" || localStorage.getItem('token') === "Sample Head"){

      this.everythingService.getByAdminAllDetails().subscribe(data => {
        this.num = data;

          this.barChartDataStickerTransaction = [
            { data: [this.num[8], this.num[9], this.num[10], this.num[11], this.num[12], this.num[13], this.num[14], this.num[15]], label: 'Trim Types'},
          ];
      });

    }
   }


// Bar Chart for Printed Transaction Status

barChartOptionsPrintedTransaction: ChartOptions = {
  responsive: true,
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true
      }
    }]
  }
};
barChartLabelsPrintedTransaction: Label[] = ['Sample Request Initiated', 'Customer / Executive Approval', 'Sample Initiated', 'Rejection (Production)', 'Production', 'Quotation / Dispatch', 'Sample Approved','Sample Rejected'];
barChartTypePrintedTransaction: ChartType = 'bar';
barChartLegendPrintedTransaction = true;
barChartPluginsPrintedTransaction = [];

barChartColorsPrintedTransaction: Color[] = [
  { backgroundColor: ['rgb(191, 130, 169, 0.6)', 'rgb(218, 74, 32, 0.6)', 'rgb(54,162,235,0.6)', 'rgb(28, 153, 194, 0.6)', 'rgb(58, 103, 124, 0.6)', 'rgb(68, 193, 214, 0.6)', 'rgb(72, 63, 191, 0.6)', 'rgb(172, 83, 121, 0.6)']},
]
barChartDataPrintedTransaction: ChartDataSets[] = [
  { data: [this.printedSampleRequestInitiatedbar, this.printedCustomerExecutiveApprovalbar, this.printedSampleInitiatedbar, this.printedRejectionbar, this.printedProductionbar, this.printedQuotationDispatchbar, this.printedSampleApprovedbar, this.printedSampleRejectedbar], label: 'Trim Types'},

];


// Bar Chart for Tag Transaction Status

barChartOptionsTagTransaction: ChartOptions = {
  responsive: true,
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true
      }
    }]
  }
};
barChartLabelsTagTransaction: Label[] = ['Sample Request Initiated', 'Customer / Executive Approval', 'Sample Initiated', 'Rejection (Production)', 'Production', 'Quotation / Dispatch', 'Sample Approved','Sample Rejected'];

barChartTypeTagTransaction: ChartType = 'bar';
barChartLegendTagTransaction = true;
barChartPluginsTagTransaction = [];

barChartColorsTagTransaction: Color[] = [
  { backgroundColor: ['rgb(191, 130, 169, 0.6)', 'rgb(218, 74, 32, 0.6)', 'rgb(54,162,235,0.6)', 'rgb(28, 153, 194, 0.6)', 'rgb(58, 103, 124, 0.6)', 'rgb(68, 193, 214, 0.6)', 'rgb(72, 63, 191, 0.6)']},
]
barChartDataTagTransaction: ChartDataSets[] = [
  { data: [this.tagSampleRequestInitiatedbar, this.tagCustomerExecutiveApprovalbar, this.tagSampleInitiatedbar, this.tagRejectionbar, this.tagProductionbar, this.tagQuotationDispatchbar, this.tagSampleApprovedbar, this.tagSampleRejectedbar], label: 'Trim Types'},

];



// Bar Chart for Sticker Transaction Status

barChartOptionsStickerTransaction: ChartOptions = {
  responsive: true,
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true
      }
    }]
  }
};
barChartLabelsStickerTransaction: Label[] = ['Sample Request Initiated', 'Customer / Executive Approval', 'Sample Initiated', 'Rejection (Production)', 'Production', 'Quotation / Dispatch', 'Sample Approved','Sample Rejected'];

barChartTypeStickerTransaction: ChartType = 'bar';
barChartLegendStickerTransaction = true;
barChartPluginsStickerTransaction = [];

barChartColorsStickerTransaction: Color[] = [
  { backgroundColor: ['rgb(191, 130, 169, 0.6)', 'rgb(218, 74, 32, 0.6)', 'rgb(54,162,235,0.6)', 'rgb(28, 153, 194, 0.6)', 'rgb(58, 103, 124, 0.6)', 'rgb(68, 193, 214, 0.6)', 'rgb(72, 63, 191, 0.6)']},
]
barChartDataStickerTransaction: ChartDataSets[] = [
  { data: [this.stickerSampleRequestInitiatedbar, this.stickerCustomerExecutiveApprovalbar, this.stickerSampleInitiatedbar, this.stickerRejectionbar, this.stickerProductionbar, this.stickerQuotationDispatchbar, this.stickerSampleApprovedbar, this.stickerSampleRejectedbar], label: 'Trim Types'},

];


// Bar Chart for Woven Transaction Status

barChartOptionsWovenTransaction: ChartOptions = {
  responsive: true,
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true
      }
    }]
  }
};
barChartLabelsWovenTransaction: Label[] = ['Sample Request Initiated', 'Customer / Executive Approval', 'Sample Initiated', 'Rejection (Production)', 'Production', 'Quotation / Dispatch', 'Sample Approved','Sample Rejected'];

barChartTypeWovenTransaction: ChartType = 'bar';
barChartLegendWovenTransaction = true;
barChartPluginsWovenTransaction = [];

barChartColorsWovenTransaction: Color[] = [
  { backgroundColor: ['rgb(191, 130, 169, 0.6)', 'rgb(218, 74, 32, 0.6)', 'rgb(54,162,235,0.6)', 'rgb(28, 153, 194, 0.6)', 'rgb(58, 103, 124, 0.6)', 'rgb(68, 193, 214, 0.6)', 'rgb(72, 63, 191, 0.6)']},
]
barChartDataWovenTransaction: ChartDataSets[] = [
  { data: [this.wovenSampleRequestInitiatedbar, this.wovenCustomerExecutiveApprovalbar, this.wovenSampleInitiatedbar, this.wovenRejectionbar, this.wovenProductionbar, this.wovenQuotationDispatchbar, this.wovenSampleApprovedbar, this.wovenSampleRejectedbar], label: 'Trim Types'},

];



  // Polar Chart Functions for Sample Count (Main View)

  polarchartsamplecount()
  {
   // Customer View
   if(localStorage.getItem('token') === "Customer"){

    this.everythingService.getByCustomerTrimTypeCount(localStorage.getItem('emailToken')).subscribe(data => {
      this.num = data;

        this.polarAreaChartData = [this.num[0], this.num[1], this.num[2], this.num[3]];
      });

  }

  // Sales View
  else if(localStorage.getItem('token') === "Sales Team"){
    this.mexecutiveService.getByExecutiveEmail(localStorage.getItem('emailToken')).subscribe(data => {
      this.everything = data;

      this.useExecutiveCode = data.code

      this.everythingService.getByExecutiveTrimTypeCount(this.useExecutiveCode).subscribe(data => {
        this.num = data;

          this.polarAreaChartData = [this.num[0], this.num[1], this.num[2], this.num[3]];
        });
    });
  }


  // Administrator and Sample Head View
  else if(localStorage.getItem('token') === "Administrator" || localStorage.getItem('token') === "Sample Head"){
    this.everythingService.getTrimTypeCount().subscribe(data => {
      this.num = data;

        this.polarAreaChartData =  [this.num[0], this.num[1], this.num[2], this.num[3]];
      });

    }
  }

  // Polar Chart for Sample Count (Main)
  polarAreaChartLabels: Label[] = ['Woven', 'Sticker', 'Tag', 'Printed'];
  polarAreaChartData: SingleDataSet =  [this.wovenNumpolar, this.stickerNumpolar, this.tagNumpolar, this.printedNumpolar];
  polarAreaLegend = true;

  polarAreaChartType: ChartType = 'polarArea';

  polarAreaChartColors: Color[] = [
    { backgroundColor: ['rgb(68, 193, 214, 0.6)', 'rgb(54,162,235,0.6)', 'rgb(218, 74, 32, 0.6)', 'rgb(191, 130, 169, 0.6)']}
  ]



    // Polar Charts For Individual Trim Types Starts

    // Polar Chart Function For Printed (Based on Sample Count)

    polarChartPrintedSampleCount(){

      // Customer View
      if(localStorage.getItem('token') === "Customer"){
      this.everythingService.getByCustomerTrimTypeCount(localStorage.getItem('emailToken')).subscribe(data => {
        this.num = data;

        this.polarAreaChartDataPrinted =  [this.num[3]];
      });
    }

      // Sales View
      else if(localStorage.getItem('token') === "Sales Team"){
        this.mexecutiveService.getByExecutiveEmail(localStorage.getItem('emailToken')).subscribe(data => {
          this.everything = data;
          this.useExecutiveCode = data.code

          this.everythingService.getByExecutiveTrimTypeCount(this.useExecutiveCode).subscribe(data => {
            this.num = data;

            this.polarAreaChartDataPrinted =  [this.num[3]];
          });
        });
      }

      // Administrator and Sample Head View
      else if(localStorage.getItem('token') === "Administrator" || localStorage.getItem('token') === "Sample Head"){
      this.everythingService.getTrimTypeCount().subscribe(data => {
        this.num = data;

        this.polarAreaChartDataPrinted =  [this.num[3]];
      });
    }
  }


  // Polar Chart Function For Tag (Based on Sample Count)

  polarChartTagSampleCount(){

    // Customer View
    if(localStorage.getItem('token') === "Customer"){
    this.everythingService.getByCustomerTrimTypeCount(localStorage.getItem('emailToken')).subscribe(data => {
      this.num = data;

      this.polarAreaChartDataTag =  [this.num[2]];
    });
  }

    // Sales View
    else if(localStorage.getItem('token') === "Sales Team"){
      this.mexecutiveService.getByExecutiveEmail(localStorage.getItem('emailToken')).subscribe(data => {
        this.everything = data;
        this.useExecutiveCode = data.code

        this.everythingService.getByExecutiveTrimTypeCount(this.useExecutiveCode).subscribe(data => {
          this.num = data;

          this.polarAreaChartDataTag =  [this.num[2]];
        });
      });
    }

    // Administrator and Sample Head View
    else if(localStorage.getItem('token') === "Administrator" || localStorage.getItem('token') === "Sample Head"){
    this.everythingService.getTrimTypeCount().subscribe(data => {
      this.num = data;

      this.polarAreaChartDataTag =  [this.num[2]];
    });
   }
  }


// Polar Chart Function For Sticker (Based on Sample Count)

  polarChartStickerSampleCount(){

      // Customer View
      if(localStorage.getItem('token') === "Customer"){
      this.everythingService.getByCustomerTrimTypeCount(localStorage.getItem('emailToken')).subscribe(data => {
        this.num = data;

        this.polarAreaChartDataSticker =  [this.num[1]];
      });
    }

      // Sales View
      else if(localStorage.getItem('token') === "Sales Team"){
        this.mexecutiveService.getByExecutiveEmail(localStorage.getItem('emailToken')).subscribe(data => {
          this.everything = data;
          this.useExecutiveCode = data.code

          this.everythingService.getByExecutiveTrimTypeCount(this.useExecutiveCode).subscribe(data => {
            this.num = data;

            this.polarAreaChartDataSticker =  [this.num[1]];
          });
        });
      }

      // Administrator and Sample Head View
      else if(localStorage.getItem('token') === "Administrator" || localStorage.getItem('token') === "Sample Head"){
      this.everythingService.getTrimTypeCount().subscribe(data => {
        this.num = data;

        this.polarAreaChartDataSticker =  [this.num[1]];
      });
    }
  }


  // Polar Chart Function For Woven (Based on Sample Count)

  polarChartWovenSampleCount(){

    // Customer View
    if(localStorage.getItem('token') === "Customer"){
    this.everythingService.getByCustomerTrimTypeCount(localStorage.getItem('emailToken')).subscribe(data => {
      this.num = data;

      this.polarAreaChartDataWoven =  [this.num[0]];
    });
  }

    // Sales View
    else if(localStorage.getItem('token') === "Sales Team"){
      this.mexecutiveService.getByExecutiveEmail(localStorage.getItem('emailToken')).subscribe(data => {
        this.everything = data;
        this.useExecutiveCode = data.code

        this.everythingService.getByExecutiveTrimTypeCount(this.useExecutiveCode).subscribe(data => {
          this.num = data;

          this.polarAreaChartDataWoven =  [this.num[0]];
        });
      });
    }

    // Administrator and Sample Head View
    else if(localStorage.getItem('token') === "Administrator" || localStorage.getItem('token') === "Sample Head"){
    this.everythingService.getTrimTypeCount().subscribe(data => {
      this.num = data;

      this.polarAreaChartDataWoven =  [this.num[0]];
    });
  }
}

  // Polar Charts For Individual Trim Types Ends

  // Polar Chart for Printed Sample Count
  polarAreaChartLabelsPrinted: Label[] = ['Printed'];
  polarAreaChartDataPrinted: SingleDataSet =  [this.printedNumpolarAlone];
  polarAreaLegendPrinted = true;

  polarAreaChartTypePrinted: ChartType = 'polarArea';

  polarAreaChartColorsPrinted: Color[] = [
    { backgroundColor:  ['rgb(191, 130, 169, 0.6)']}
  ]

  // Polar Chart for Tag Sample Count
  polarAreaChartLabelsTag: Label[] = ['Tag'];
  polarAreaChartDataTag: SingleDataSet =  [this.tagNumpolarAlone];
  polarAreaLegendTag = true;

  polarAreaChartTypeTag: ChartType = 'polarArea';

  polarAreaChartColorsTag: Color[] = [
    { backgroundColor: ['rgb(218, 74, 32, 0.6)']}
  ]

  // Polar Chart for Sticker Sample Count
  polarAreaChartLabelsSticker: Label[] = ['Sticker'];
  polarAreaChartDataSticker: SingleDataSet =  [this.stickerNumpolarAlone];
  polarAreaLegendSticker = true;

  polarAreaChartTypeSticker: ChartType = 'polarArea';

  polarAreaChartColorsSticker: Color[] = [
    { backgroundColor: ['rgb(54,162,235,0.6)']}
  ]

  // Polar Chart for Woven Sample Count
  polarAreaChartLabelsWoven: Label[] = ['Woven'];
  polarAreaChartDataWoven: SingleDataSet =  [this.wovenNumpolarAlone];
  polarAreaLegendWoven = true;

  polarAreaChartTypeWoven: ChartType = 'polarArea';

  polarAreaChartColorsWoven: Color[] = [
    { backgroundColor: ['rgb(68, 193, 214, 0.6)']}
  ]


  // Polar Chart Functions for Transaction Status (Main View)

polarChartTransaction()
{
    // Customer View
    if(localStorage.getItem('token') === "Customer"){

      this.everythingService.getByCustomerTransactionCount(localStorage.getItem('emailToken')).subscribe(data => {
        this.num = data;

          this.polarAreaChartData1 =  [this.num[0], this.num[1], this.num[2], this.num[3], this.num[4], this.num[5], this.num[6], this.num[7]];
      });

    }


    // Sales View
    else if(localStorage.getItem('token') === "Sales Team"){
      this.mexecutiveService.getByExecutiveEmail(localStorage.getItem('emailToken')).subscribe(data => {
        this.everything = data;

        this.useExecutiveCode = data.code

        this.everythingService.getByExecutiveTransactionCount(this.useExecutiveCode).subscribe(data => {
          this.num = data;

          this.polarAreaChartData1 =  [this.num[0], this.num[1], this.num[2], this.num[3], this.num[4], this.num[5], this.num[6], this.num[7]];
        });

      });
    }


      // Administrator and Sample Head View
      else if(localStorage.getItem('token') === "Administrator" || localStorage.getItem('token') === "Sample Head"){

         this.everythingService.getByAdminTransactionstatus().subscribe(data => {
          this.num = data;

            this.polarAreaChartData1 =  [this.num[0], this.num[1], this.num[2], this.num[3], this.num[4], this.num[5], this.num[6], this.num[7]];
          });
      }
  }



    // Polar Chart for Transaction Status (Main)
    polarAreaChartLabels1: Label[] = ['Sample Request Initiated', 'Customer / Executive Approval', 'Sample Initiated', 'Rejection (Production)', 'Production', 'Quotation / Dispatch', 'Sample Approved','Sample Rejected'];
    polarAreaChartData1: SingleDataSet =  [this.sampleRequestInitiatedPolar, this.customerExecutiveApprovalPolar, this.sampleInitiatedPolar, this.rejectionPolar, this.productionPolar, this.quotationDispatchPolar, this.sampleApprovedPolar, this.sampleRejectedPolar];
    polarAreaLegend1 = true;

    polarAreaChartType1: ChartType = 'polarArea';

    polarAreaChartColors1: Color[] = [
        { backgroundColor: ['rgb(191, 130, 169, 0.6)', 'rgb(218, 74, 32, 0.6)', 'rgb(54,162,235,0.6)', 'rgb(28, 153, 194, 0.6)', 'rgb(58, 103, 124, 0.6)', 'rgb(68, 193, 214, 0.6)', 'rgb(72, 63, 191, 0.6)', 'rgb(172, 83, 121, 0.6)']}
      ]



  // Polar Chart Functions based on Transaction Status and Sample Name Starts


  // Polar Chart Function For Woven (Based on Transaction Status and Sample Name)


  polarChartWovenTransactionStatus(){

    if(localStorage.getItem('token') === "Customer"){

      // Customer View
      this.everythingService.getByCustomerAllDetails(localStorage.getItem('emailToken')).subscribe(data => {
        this.num = data;

          this.polarAreaChartDataWovenTransaction = [this.num[0], this.num[1], this.num[2], this.num[3], this.num[4], this.num[5], this.num[6], this.num[7]];
      });
    }


      // Sales View
     else if(localStorage.getItem('token') === "Sales Team"){
      this.mexecutiveService.getByExecutiveEmail(localStorage.getItem('emailToken')).subscribe(data => {
        this.everything = data;
        this.useExecutiveCode = data.code

      this.everythingService.getByExecutiveAllDetails(this.useExecutiveCode).subscribe(data => {
        this.num = data;

        this.polarAreaChartDataWovenTransaction = [this.num[0], this.num[1], this.num[2], this.num[3], this.num[4], this.num[5], this.num[6], this.num[7]];
        });

      });
    }


    else if(localStorage.getItem('token') === "Administrator" || localStorage.getItem('token') === "Sample Head"){

        this.everythingService.getByAdminAllDetails().subscribe(data => {
          this.num = data;

          this.polarAreaChartDataWovenTransaction = [this.num[0], this.num[1], this.num[2], this.num[3], this.num[4], this.num[5], this.num[6], this.num[7]];
        });
      }

  }


  // Polar Chart Function For Tag (Based on Transaction Status and Sample Name)


  polarChartTagTransactionStatus(){

    if(localStorage.getItem('token') === "Customer"){

      // Customer View
      this.everythingService.getByCustomerAllDetails(localStorage.getItem('emailToken')).subscribe(data => {
        this.num = data;

          this.polarAreaChartDataTagTransaction = [this.num[16], this.num[17], this.num[18], this.num[19], this.num[20], this.num[21], this.num[22], this.num[23]];
      });
    }


      // Sales View
     else if(localStorage.getItem('token') === "Sales Team"){
      this.mexecutiveService.getByExecutiveEmail(localStorage.getItem('emailToken')).subscribe(data => {
        this.everything = data;
        this.useExecutiveCode = data.code

      this.everythingService.getByExecutiveAllDetails(this.useExecutiveCode).subscribe(data => {
        this.num = data;

        this.polarAreaChartDataTagTransaction = [this.num[16], this.num[17], this.num[18], this.num[19], this.num[20], this.num[21], this.num[22], this.num[23]];
        });

      });
    }


    else if(localStorage.getItem('token') === "Administrator" || localStorage.getItem('token') === "Sample Head"){
      this.everythingService.getByAdminAllDetails().subscribe(data => {
        this.num = data;

        this.polarAreaChartDataTagTransaction = [this.num[16], this.num[17], this.num[18], this.num[19], this.num[20], this.num[21], this.num[22], this.num[23]];
      });
    }

  }


   // Polar Chart Function For Sticker (Based on Transaction Status and Sample Name)


   polarChartStickerTransactionStatus(){

    if(localStorage.getItem('token') === "Customer"){

      // Customer View
      this.everythingService.getByCustomerAllDetails(localStorage.getItem('emailToken')).subscribe(data => {
        this.num = data;

          this.polarAreaChartDataStickerTransaction = [this.num[8], this.num[9], this.num[10], this.num[11], this.num[12], this.num[13], this.num[14], this.num[15]];
      });
    }


      // Sales View
     else if(localStorage.getItem('token') === "Sales Team"){
      this.mexecutiveService.getByExecutiveEmail(localStorage.getItem('emailToken')).subscribe(data => {
        this.everything = data;
        this.useExecutiveCode = data.code

      this.everythingService.getByExecutiveAllDetails(this.useExecutiveCode).subscribe(data => {
        this.num = data;

        this.polarAreaChartDataStickerTransaction =  [this.num[8], this.num[9], this.num[10], this.num[11], this.num[12], this.num[13], this.num[14], this.num[15]];
        });

      });
    }


    else if(localStorage.getItem('token') === "Administrator" || localStorage.getItem('token') === "Sample Head"){

      this.everythingService.getByAdminAllDetails().subscribe(data => {
        this.num = data;

        this.polarAreaChartDataStickerTransaction =  [this.num[8], this.num[9], this.num[10], this.num[11], this.num[12], this.num[13], this.num[14], this.num[15]];
      });
    }

  }


  // Polar Chart Function For Printed (Based on Transaction Status and Sample Name)


  polarChartPrintedTransactionStatus(){

    if(localStorage.getItem('token') === "Customer"){

      // Customer View
      this.everythingService.getByCustomerAllDetails(localStorage.getItem('emailToken')).subscribe(data => {
        this.num = data;

          this.polarAreaChartDataPrintedTransaction = [this.num[24], this.num[25], this.num[26], this.num[27], this.num[28], this.num[29], this.num[30], this.num[31]];
      });
    }


      // Sales View
     else if(localStorage.getItem('token') === "Sales Team"){
      this.mexecutiveService.getByExecutiveEmail(localStorage.getItem('emailToken')).subscribe(data => {
        this.everything = data;
        this.useExecutiveCode = data.code

      this.everythingService.getByExecutiveAllDetails(this.useExecutiveCode).subscribe(data => {
        this.num = data;

        this.polarAreaChartDataPrintedTransaction = [this.num[24], this.num[25], this.num[26], this.num[27], this.num[28], this.num[29], this.num[30], this.num[31]];
        });

      });
    }


    else if(localStorage.getItem('token') === "Administrator" || localStorage.getItem('token') === "Sample Head"){

      this.everythingService.getByAdminAllDetails().subscribe(data => {
        this.num = data;

        this.polarAreaChartDataPrintedTransaction = [this.num[24], this.num[25], this.num[26], this.num[27], this.num[28], this.num[29], this.num[30], this.num[31]];
      });
    }

  }


   // Polar Chart Functions based on Transaction Status and Sample Name Ends

  // Polar Chart for Printed Transaction Count
  polarAreaChartLabelsPrintedTransaction: Label[] = ['Sample Request Initiated', 'Customer / Executive Approval', 'Sample Initiated', 'Rejection (Production)', 'Production', 'Quotation / Dispatch', 'Sample Approved','Sample Rejected'];
  polarAreaChartDataPrintedTransaction: SingleDataSet =  [this.printedSampleRequestInitiatedPolar, this.printedCustomerExecutiveApprovalPolar, this.printedSampleInitiatedPolar, this.printedRejectionPolar, this.printedProductionPolar, this.printedQuotationDispatchPolar, this.printedSampleApprovedPolar, this.printedSampleRejectedPolar];
  polarAreaLegendPrintedTransaction = true;

  polarAreaChartTypePrintedTransaction: ChartType = 'polarArea';

  polarAreaChartColorsPrintedTransaction: Color[] = [
    { backgroundColor:  ['rgb(191, 130, 169, 0.6)', 'rgb(218, 74, 32, 0.6)', 'rgb(54,162,235,0.6)', 'rgb(28, 153, 194, 0.6)', 'rgb(58, 103, 124, 0.6)', 'rgb(68, 193, 214, 0.6)', 'rgb(72, 63, 191, 0.6)', 'rgb(172, 83, 121, 0.6)']}
  ]

  // Polar Chart for Tag Transaction Count
  polarAreaChartLabelsTagTransaction: Label[] = ['Sample Request Initiated', 'Customer / Executive Approval', 'Sample Initiated', 'Rejection (Production)', 'Production', 'Quotation / Dispatch', 'Sample Approved','Sample Rejected'];
  polarAreaChartDataTagTransaction: SingleDataSet =  [this.tagSampleRequestInitiatedPolar, this.tagCustomerExecutiveApprovalPolar, this.tagSampleInitiatedPolar, this.tagRejectionPolar, this.tagProductionPolar, this.tagQuotationDispatchPolar, this.tagSampleApprovedPolar, this.tagSampleRejectedPolar];
  polarAreaLegendTagTransaction = true;

  polarAreaChartTypeTagTransaction: ChartType = 'polarArea';

  polarAreaChartColorsTagTransaction: Color[] = [
    { backgroundColor: ['rgb(191, 130, 169, 0.6)', 'rgb(218, 74, 32, 0.6)', 'rgb(54,162,235,0.6)', 'rgb(28, 153, 194, 0.6)', 'rgb(58, 103, 124, 0.6)', 'rgb(68, 193, 214, 0.6)', 'rgb(72, 63, 191, 0.6)']}
  ]

  // Polar Chart for Sticker Transaction Count
  polarAreaChartLabelsStickerTransaction: Label[] = ['Sample Request Initiated', 'Customer / Executive Approval', 'Sample Initiated', 'Rejection (Production)', 'Production', 'Quotation / Dispatch', 'Sample Approved','Sample Rejected'];
  polarAreaChartDataStickerTransaction: SingleDataSet =  [this.stickerSampleRequestInitiatedPolar, this.stickerCustomerExecutiveApprovalPolar, this.stickerSampleInitiatedPolar, this.stickerRejectionPolar, this.stickerProductionPolar, this.stickerQuotationDispatchPolar, this.stickerSampleApprovedPolar, this.stickerSampleRejectedPolar];
  polarAreaLegendStickerTransaction = true;

  polarAreaChartTypeStickerTransaction: ChartType = 'polarArea';

  polarAreaChartColorsStickerTransaction: Color[] = [
    { backgroundColor: ['rgb(191, 130, 169, 0.6)', 'rgb(218, 74, 32, 0.6)', 'rgb(54,162,235,0.6)', 'rgb(28, 153, 194, 0.6)', 'rgb(58, 103, 124, 0.6)', 'rgb(68, 193, 214, 0.6)', 'rgb(72, 63, 191, 0.6)']}
  ]

  // Polar Chart for Woven Transaction Count
  polarAreaChartLabelsWovenTransaction: Label[] = ['Sample Request Initiated', 'Customer / Executive Approval', 'Sample Initiated', 'Rejection (Production)', 'Production', 'Quotation / Dispatch', 'Sample Approved','Sample Rejected'];
  polarAreaChartDataWovenTransaction: SingleDataSet =  [this.wovenSampleRequestInitiatedPolar, this.wovenCustomerExecutiveApprovalPolar, this.wovenSampleInitiatedPolar, this.wovenRejectionPolar, this.wovenProductionPolar, this.wovenQuotationDispatchPolar, this.wovenSampleApprovedPolar, this.wovenSampleRejectedPolar];
  polarAreaLegendWovenTransaction = true;

  polarAreaChartTypeWovenTransaction: ChartType = 'polarArea';

  polarAreaChartColorsWovenTransaction: Color[] = [
    { backgroundColor: ['rgb(191, 130, 169, 0.6)', 'rgb(218, 74, 32, 0.6)', 'rgb(54,162,235,0.6)', 'rgb(28, 153, 194, 0.6)', 'rgb(58, 103, 124, 0.6)', 'rgb(68, 193, 214, 0.6)', 'rgb(72, 63, 191, 0.6)']}
  ]


 // Dough Chart Functions for Sample Count (Main View)
  doughchartsamplecount()
  {
     // Customer View
     if(localStorage.getItem('token') === "Customer"){

      this.everythingService.getByCustomerTrimTypeCount(localStorage.getItem('emailToken')).subscribe(data => {
        this.num = data;

          this.doughnutChartData = [[this.num[0], this.num[1], this.num[2], this.num[3]]];
        });

    }

    // Sales View
    else if(localStorage.getItem('token') === "Sales Team"){
      this.mexecutiveService.getByExecutiveEmail(localStorage.getItem('emailToken')).subscribe(data => {
        this.everything = data;

        this.useExecutiveCode = data.code

        this.everythingService.getByExecutiveTrimTypeCount(this.useExecutiveCode).subscribe(data => {
          this.num = data;

          this.doughnutChartData = [[this.num[0], this.num[1], this.num[2], this.num[3]]];
        });
      });
    }


    // Administrator and Sample Head View
    else if(localStorage.getItem('token') === "Administrator" || localStorage.getItem('token') === "Sample Head"){
      this.everythingService.getTrimTypeCount().subscribe(data => {
        this.num = data;

        this.doughnutChartData = [[this.num[0], this.num[1], this.num[2], this.num[3]]];
       });
    }

  }


  // Dough Chart for Sample Count (Main)
  doughnutChartLabels: Label[] = ['Woven', 'Sticker', 'Tag', 'Printed'];
  doughnutChartData: MultiDataSet = [
    [this.wovenNumdough,this.stickerNumdough,this.tagNumdough,this.printedNumdough]
  ];
  doughnutChartColors: Color[] = [
    { backgroundColor: ['rgb(68, 193, 214, 0.6)', 'rgb(54,162,235,0.6)', 'rgb(218, 74, 32, 0.6)', 'rgb(191, 130, 169, 0.6)']}
  ]
  doughnutChartType: ChartType = 'doughnut';



  // Dough Charts For Individual Trim Types Starts

  // Dough Chart Function For Printed (Based on Sample Count)

    doughChartPrintedSampleCount(){

      // Customer View
      if(localStorage.getItem('token') === "Customer"){
      this.everythingService.getByCustomerTrimTypeCount(localStorage.getItem('emailToken')).subscribe(data => {
        this.num = data;

        this.doughnutChartDataPrinted =  [[this.num[3]]];
      });
    }

      // Sales View
      else if(localStorage.getItem('token') === "Sales Team"){
        this.mexecutiveService.getByExecutiveEmail(localStorage.getItem('emailToken')).subscribe(data => {
          this.everything = data;
          this.useExecutiveCode = data.code

          this.everythingService.getByExecutiveTrimTypeCount(this.useExecutiveCode).subscribe(data => {
            this.num = data;

            this.doughnutChartDataPrinted =  [[this.num[3]]];
          });
        });
      }

      // Administrator and Sample Head View
      else if(localStorage.getItem('token') === "Administrator" || localStorage.getItem('token') === "Sample Head"){
      this.everythingService.getTrimTypeCount().subscribe(data => {
        this.num = data;

        this.doughnutChartDataPrinted = [[this.num[3]]];
        });
    }
  }


   // Dough Chart Function For Tag (Based on Sample Count)

   doughChartTagSampleCount(){

    // Customer View
    if(localStorage.getItem('token') === "Customer"){
    this.everythingService.getByCustomerTrimTypeCount(localStorage.getItem('emailToken')).subscribe(data => {
      this.num = data;

      this.doughnutChartDataTag =  [[this.num[2]]];
    });
  }

    // Sales View
    else if(localStorage.getItem('token') === "Sales Team"){
      this.mexecutiveService.getByExecutiveEmail(localStorage.getItem('emailToken')).subscribe(data => {
        this.everything = data;
        this.useExecutiveCode = data.code

        this.everythingService.getByExecutiveTrimTypeCount(this.useExecutiveCode).subscribe(data => {
          this.num = data;

          this.doughnutChartDataTag =  [[this.num[2]]];
        });
      });
    }

    // Administrator and Sample Head View
    else if(localStorage.getItem('token') === "Administrator" || localStorage.getItem('token') === "Sample Head"){
      this.everythingService.getTrimTypeCount().subscribe(data => {
      this.num = data;

      this.doughnutChartDataTag = [[this.num[2]]];
      });
  }
}


  // Dough Chart Function For Sticker (Based on Sample Count)

  doughChartStickerSampleCount(){

    // Customer View
    if(localStorage.getItem('token') === "Customer"){
      this.everythingService.getByCustomerTrimTypeCount(localStorage.getItem('emailToken')).subscribe(data => {
        this.num = data;

        this.doughnutChartDataSticker =  [[this.num[1]]];
      });
    }

    // Sales View
    else if(localStorage.getItem('token') === "Sales Team"){
      this.mexecutiveService.getByExecutiveEmail(localStorage.getItem('emailToken')).subscribe(data => {
        this.everything = data;
        this.useExecutiveCode = data.code

        this.everythingService.getByExecutiveTrimTypeCount(this.useExecutiveCode).subscribe(data => {
          this.num = data;

          this.doughnutChartDataSticker =  [[this.num[1]]];
        });
      });
    }

    // Administrator and Sample Head View
    else if(localStorage.getItem('token') === "Administrator" || localStorage.getItem('token') === "Sample Head"){
      this.everythingService.getTrimTypeCount().subscribe(data => {
        this.num = data;

        this.doughnutChartDataSticker = [[this.num[1]]];
        });
    }
  }


  // Dough Chart Function For Woven (Based on Sample Count)

  doughChartWovenSampleCount(){

    // Customer View
    if(localStorage.getItem('token') === "Customer"){
      this.everythingService.getByCustomerTrimTypeCount(localStorage.getItem('emailToken')).subscribe(data => {
        this.num = data;

        this.doughnutChartDataWoven = [[this.num[0]]];
      });
    }

    // Sales View
    else if(localStorage.getItem('token') === "Sales Team"){
      this.mexecutiveService.getByExecutiveEmail(localStorage.getItem('emailToken')).subscribe(data => {
        this.everything = data;
        this.useExecutiveCode = data.code

        this.everythingService.getByExecutiveTrimTypeCount(this.useExecutiveCode).subscribe(data => {
          this.num = data;

          this.doughnutChartDataWoven = [[this.num[0]]];
        });
      });
    }

    // Administrator and Sample Head View
    else if(localStorage.getItem('token') === "Administrator" || localStorage.getItem('token') === "Sample Head"){
      this.everythingService.getTrimTypeCount().subscribe(data => {
        this.num = data;

        this.doughnutChartDataWoven = [[this.num[0]]];
        });
    }
  }


 // Dough Charts For Individual Trim Types Ends


 // Dough Chart for Printed Sample Count
 doughnutChartLabelsPrinted: Label[] = ['Printed'];
 doughnutChartDataPrinted: MultiDataSet = [
   [this.printedNumdoughAlone]
 ];
 doughnutChartColorsPrinted: Color[] = [
   { backgroundColor: ['rgb(191, 130, 169, 0.6)']}
 ]
 doughnutChartTypePrinted: ChartType = 'doughnut'


 // Dough Chart for Tag Sample Count
 doughnutChartLabelsTag: Label[] = ['Tag'];
 doughnutChartDataTag: MultiDataSet = [
   [this.tagNumdoughAlone]
 ];
 doughnutChartColorsTag: Color[] = [
   { backgroundColor: ['rgb(218, 74, 32, 0.6)']}
 ]
 doughnutChartTypeTag: ChartType = 'doughnut'


  // Dough Chart for Sticker Sample Count
  doughnutChartLabelsSticker: Label[] = ['Sticker'];
  doughnutChartDataSticker: MultiDataSet = [
    [this.stickerNumdoughAlone]
  ];
  doughnutChartColorsSticker: Color[] = [
    { backgroundColor: ['rgb(54,162,235,0.6)']}
  ]
  doughnutChartTypeSticker: ChartType = 'doughnut'


  // Dough Chart for Woven Sample Count
  doughnutChartLabelsWoven: Label[] = ['Woven'];
  doughnutChartDataWoven: MultiDataSet = [
    [this.wovenNumdoughAlone]
  ];
  doughnutChartColorsWoven: Color[] = [
    { backgroundColor: ['rgb(68, 193, 214, 0.6)']}
  ]
  doughnutChartTypeWoven: ChartType = 'doughnut'




    // Dough Chart Functions for Transaction Status (Main View)

    doughChartTransaction(){

        // Customer View
    if(localStorage.getItem('token') === "Customer"){

      this.everythingService.getByCustomerTransactionCount(localStorage.getItem('emailToken')).subscribe(data => {
        this.num = data;

          this.doughnutChartData1 = [[this.num[0], this.num[1], this.num[2], this.num[3], this.num[4], this.num[5], this.num[6], this.num[7]]]
        });

    }


    // Sales View
    else if(localStorage.getItem('token') === "Sales Team"){
      this.mexecutiveService.getByExecutiveEmail(localStorage.getItem('emailToken')).subscribe(data => {
        this.everything = data;

        this.useExecutiveCode = data.code

        this.everythingService.getByExecutiveTransactionCount(this.useExecutiveCode).subscribe(data => {
          this.num = data;

            this.doughnutChartData1 = [[this.num[0], this.num[1], this.num[2], this.num[3], this.num[4], this.num[5], this.num[6], this.num[7]]]
          });

      });
    }


      // Administrator and Sample Head View
      else if(localStorage.getItem('token') === "Administrator" || localStorage.getItem('token') === "Sample Head"){

        this.everythingService.getByAdminTransactionstatus().subscribe(data => {
          this.num = data;

          this.doughnutChartData1 = [[this.num[0], this.num[1], this.num[2], this.num[3], this.num[4], this.num[5], this.num[6], this.num[7]]]
        });


      }

    }


    // Dough Chart Functions based on Transaction Status and Sample Name Starts


    // Dough Chart Function For Woven (Based on Transaction Status and Sample Name)

  doughChartWovenTransactionStatus(){

    if(localStorage.getItem('token') === "Customer"){

      // Customer View
      this.everythingService.getByCustomerAllDetails(localStorage.getItem('emailToken')).subscribe(data => {
        this.num = data;

        this.doughnutChartDataWovenTransaction = [[this.num[0], this.num[1], this.num[2], this.num[3], this.num[4], this.num[5], this.num[6], this.num[7]]];
      });
   }


      // Sales View
      else if(localStorage.getItem('token') === "Sales Team"){
      this.mexecutiveService.getByExecutiveEmail(localStorage.getItem('emailToken')).subscribe(data => {
        this.everything = data;
        this.useExecutiveCode = data.code

        this.everythingService.getByExecutiveAllDetails(this.useExecutiveCode).subscribe(data => {
        this.num = data;

          this.doughnutChartDataWovenTransaction = [[this.num[0], this.num[1], this.num[2], this.num[3], this.num[4], this.num[5], this.num[6], this.num[7]]];
        });

      });
    }


    else if(localStorage.getItem('token') === "Administrator" || localStorage.getItem('token') === "Sample Head"){

        this.everythingService.getByAdminAllDetails().subscribe(data => {
        this.num = data;

          this.doughnutChartDataWovenTransaction = [[this.num[0], this.num[1], this.num[2], this.num[3], this.num[4], this.num[5], this.num[6], this.num[7]]];
        });
      }

  }


   // Dough Chart Function For Tag (Based on Transaction Status and Sample Name)

   doughChartTagTransactionStatus(){

    if(localStorage.getItem('token') === "Customer"){

      // Customer View
      this.everythingService.getByCustomerAllDetails(localStorage.getItem('emailToken')).subscribe(data => {
        this.num = data;

        this.doughnutChartDataTagTransaction = [[this.num[16], this.num[17], this.num[18], this.num[19], this.num[20], this.num[21], this.num[22], this.num[23]]];
      });
    }


      // Sales View
      else if(localStorage.getItem('token') === "Sales Team"){
      this.mexecutiveService.getByExecutiveEmail(localStorage.getItem('emailToken')).subscribe(data => {
        this.everything = data;
        this.useExecutiveCode = data.code

        this.everythingService.getByExecutiveAllDetails(this.useExecutiveCode).subscribe(data => {
        this.num = data;

          this.doughnutChartDataTagTransaction = [[this.num[16], this.num[17], this.num[18], this.num[19], this.num[20], this.num[21], this.num[22], this.num[23]]];
        });

      });
    }


    else if(localStorage.getItem('token') === "Administrator" || localStorage.getItem('token') === "Sample Head"){

      this.everythingService.getByAdminAllDetails().subscribe(data => {
        this.num = data;

          this.doughnutChartDataTagTransaction = [[this.num[16], this.num[17], this.num[18], this.num[19], this.num[20], this.num[21], this.num[22], this.num[23]]];
        });
      }

  }


  // Dough Chart Function For Sticker (Based on Transaction Status and Sample Name)

  doughChartStickerTransactionStatus(){

    if(localStorage.getItem('token') === "Customer"){

      // Customer View
      this.everythingService.getByCustomerAllDetails(localStorage.getItem('emailToken')).subscribe(data => {
        this.num = data;

        this.doughnutChartDataStickerTransaction = [[this.num[8], this.num[9], this.num[10], this.num[11], this.num[12], this.num[13], this.num[14], this.num[15]]];
      });
   }


      // Sales View
      else if(localStorage.getItem('token') === "Sales Team"){
      this.mexecutiveService.getByExecutiveEmail(localStorage.getItem('emailToken')).subscribe(data => {
        this.everything = data;
        this.useExecutiveCode = data.code

        this.everythingService.getByExecutiveAllDetails(this.useExecutiveCode).subscribe(data => {
        this.num = data;

          this.doughnutChartDataStickerTransaction = [[this.num[8], this.num[9], this.num[10], this.num[11], this.num[12], this.num[13], this.num[14], this.num[15]]];
        });

      });
    }


    else if(localStorage.getItem('token') === "Administrator" || localStorage.getItem('token') === "Sample Head"){

      this.everythingService.getByAdminAllDetails().subscribe(data => {
        this.num = data;

          this.doughnutChartDataStickerTransaction = [[this.num[8], this.num[9], this.num[10], this.num[11], this.num[12], this.num[13], this.num[14], this.num[15]]];
        });
      }

  }


    // Dough Chart Function For Printed (Based on Transaction Status and Sample Name)

    doughChartPrintedTransactionStatus(){

      if(localStorage.getItem('token') === "Customer"){

      // Customer View
      this.everythingService.getByCustomerAllDetails(localStorage.getItem('emailToken')).subscribe(data => {
        this.num = data;

        this.doughnutChartDataPrintedTransaction = [[this.num[24], this.num[25], this.num[26], this.num[27], this.num[28], this.num[29], this.num[30], this.num[31]]];
      });
    }


      // Sales View
      else if(localStorage.getItem('token') === "Sales Team"){
      this.mexecutiveService.getByExecutiveEmail(localStorage.getItem('emailToken')).subscribe(data => {
        this.everything = data;
        this.useExecutiveCode = data.code

        this.everythingService.getByExecutiveAllDetails(this.useExecutiveCode).subscribe(data => {
        this.num = data;

          this.doughnutChartDataPrintedTransaction = [[this.num[24], this.num[25], this.num[26], this.num[27], this.num[28], this.num[29], this.num[30], this.num[31]]];
        });

      });
    }


    else if(localStorage.getItem('token') === "Administrator" || localStorage.getItem('token') === "Sample Head"){

      this.everythingService.getByAdminAllDetails().subscribe(data => {
        this.num = data;

          this.doughnutChartDataPrintedTransaction = [[this.num[24], this.num[25], this.num[26], this.num[27], this.num[28], this.num[29], this.num[30], this.num[31]]];
        });
      }

    }


    // Dough Chart for Transaction Status (Main)
    doughnutChartLabels1: Label[] = ['Sample Request Initiated', 'Customer / Executive Approval', 'Sample Initiated', 'Rejection (Production)', 'Production', 'Quotation / Dispatch', 'Sample Approved','Sample Rejected'];
    doughnutChartData1: MultiDataSet = [
      [this.sampleRequestInitiatedDough, this.customerExecutiveApprovalDough, this.sampleInitiatedDough, this.rejectionDough, this.productionDough, this.quotationDispatchDough, this.sampleApprovedDough, this.sampleRejectedDough]
    ];
    doughnutChartColors1: Color[] = [
      { backgroundColor:  ['rgb(191, 130, 169, 0.6)', 'rgb(218, 74, 32, 0.6)', 'rgb(54,162,235,0.6)', 'rgb(28, 153, 194, 0.6)', 'rgb(58, 103, 124, 0.6)', 'rgb(68, 193, 214, 0.6)', 'rgb(72, 63, 191, 0.6)', 'rgb(172, 83, 121, 0.6)']},
    ]
    doughnutChartType1: ChartType = 'doughnut';



  // Dough Chart for Printed Transaction Status
  doughnutChartLabelsPrintedTransaction: Label[] = ['Sample Request Initiated', 'Customer / Executive Approval', 'Sample Initiated', 'Rejection (Production)', 'Production', 'Quotation / Dispatch', 'Sample Approved','Sample Rejected'];
  doughnutChartDataPrintedTransaction: MultiDataSet = [
    [this.printedSampleRequestInitiatedDough, this.printedCustomerExecutiveApprovalDough, this.printedSampleInitiatedDough, this.printedRejectionDough, this.printedProductionDough, this.printedQuotationDispatchDough, this.printedSampleApprovedDough, this.printedSampleRejectedDough]
  ];
  doughnutChartColorsPrintedTransaction: Color[] = [
    { backgroundColor: ['rgb(191, 130, 169, 0.6)', 'rgb(218, 74, 32, 0.6)', 'rgb(54,162,235,0.6)', 'rgb(28, 153, 194, 0.6)', 'rgb(58, 103, 124, 0.6)', 'rgb(68, 193, 214, 0.6)', 'rgb(72, 63, 191, 0.6)']}
  ]
  doughnutChartTypePrintedTransaction: ChartType = 'doughnut';


  // Dough Chart for Tag Transaction Status
  doughnutChartLabelsTagTransaction: Label[] = ['Sample Request Initiated', 'Customer / Executive Approval', 'Sample Initiated', 'Rejection (Production)', 'Production', 'Quotation / Dispatch', 'Sample Approved','Sample Rejected'];
  doughnutChartDataTagTransaction: MultiDataSet = [
    [this.tagSampleRequestInitiatedDough, this.tagCustomerExecutiveApprovalDough, this.tagSampleInitiatedDough, this.tagRejectionDough, this.tagProductionDough, this.tagQuotationDispatchDough, this.tagSampleApprovedDough, this.tagSampleRejectedDough]
  ];
  doughnutChartColorsTagTransaction: Color[] = [
    { backgroundColor: ['rgb(191, 130, 169, 0.6)', 'rgb(218, 74, 32, 0.6)', 'rgb(54,162,235,0.6)', 'rgb(28, 153, 194, 0.6)', 'rgb(58, 103, 124, 0.6)', 'rgb(68, 193, 214, 0.6)', 'rgb(72, 63, 191, 0.6)']}
  ]
  doughnutChartTypeTagTransaction: ChartType = 'doughnut';


  // Dough Chart for Sticker Transaction Status
  doughnutChartLabelsStickerTransaction: Label[] = ['Sample Request Initiated', 'Customer / Executive Approval', 'Sample Initiated', 'Rejection (Production)', 'Production', 'Quotation / Dispatch', 'Sample Approved','Sample Rejected'];
  doughnutChartDataStickerTransaction: MultiDataSet = [
    [this.stickerSampleRequestInitiatedDough, this.stickerCustomerExecutiveApprovalDough, this.stickerSampleInitiatedDough, this.stickerRejectionDough, this.stickerProductionDough, this.stickerQuotationDispatchDough, this.stickerSampleApprovedDough, this.stickerSampleRejectedDough]
  ];
  doughnutChartColorsStickerTransaction: Color[] = [
    { backgroundColor: ['rgb(191, 130, 169, 0.6)', 'rgb(218, 74, 32, 0.6)', 'rgb(54,162,235,0.6)', 'rgb(28, 153, 194, 0.6)', 'rgb(58, 103, 124, 0.6)', 'rgb(68, 193, 214, 0.6)', 'rgb(72, 63, 191, 0.6)']}
  ]
  doughnutChartTypeStickerTransaction: ChartType = 'doughnut';


  // Dough Chart for Woven Transaction Status
  doughnutChartLabelsWovenTransaction: Label[] = ['Sample Request Initiated', 'Customer / Executive Approval', 'Sample Initiated', 'Rejection (Production)', 'Production', 'Quotation / Dispatch', 'Sample Approved','Sample Rejected'];
  doughnutChartDataWovenTransaction: MultiDataSet = [
    [this.wovenSampleRequestInitiatedDough, this.wovenCustomerExecutiveApprovalDough, this.wovenSampleInitiatedDough, this.wovenRejectionDough, this.wovenProductionDough, this.wovenQuotationDispatchDough, this.wovenSampleApprovedDough, this.wovenSampleRejectedDough]
  ];
  doughnutChartColorsWovenTransaction: Color[] = [
    { backgroundColor: ['rgb(191, 130, 169, 0.6)', 'rgb(218, 74, 32, 0.6)', 'rgb(54,162,235,0.6)', 'rgb(28, 153, 194, 0.6)', 'rgb(58, 103, 124, 0.6)', 'rgb(68, 193, 214, 0.6)', 'rgb(72, 63, 191, 0.6)']}
  ]
  doughnutChartTypeWovenTransaction: ChartType = 'doughnut';

  logout() {
    console.log('logout');
    this.authService.logout();
    this.router.navigate(['/header/login']);
  }



  ngOnInit(){

    this.barchartsamplecount();
    this.barcharttransaction();
    this.polarchartsamplecount();
    this.polarChartTransaction();
    this.doughchartsamplecount();
    this.doughChartTransaction();

  }

}
