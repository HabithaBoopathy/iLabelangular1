import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ReportInput } from '../models/report/reportInput';
import { DateFormatter } from '../utility-classes/date-formatter';
import { ReportService } from '../services/report.service';
import { ReportOutput } from '../models/report/reportOutput';
import { Validator } from '../utility-classes/validator';
import { SnackBarService } from '../services/snackBar.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Territory } from '../models/territory';
import { HttpClient } from '@angular/common/http';
import { TerritoryService } from '../services/territory.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  public reportInput = new ReportInput();
  validator = new Validator();
  @ViewChild('loadingModalTemplate') loadingModalTemplate: TemplateRef<any>;
  data: ReportOutput[];

  constructor(
    private reportService: ReportService,
    private snackBarService: SnackBarService,
    private modalService: NgbModal,
    private http: HttpClient,
    private territoryService: TerritoryService
  ) {}

  ngOnInit(): void {
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

  startDate: string;
  endDate: string;
  sort: string;
  escapeToken: string = '~~~';

  trimTypeList: string[] = ['Woven', 'Sticker', 'Tag', 'Printed'];
  transactionStatusList: string[] = [
    'Sample Request Initiated',
    'Customer / Executive Approval',
    'Sample Initiated',
    'Rejection (Production)',
    'Production',
    'Quotation / Dispatch',
    'Sample Approved',
    'Sample Rejected',
  ];
  territories: Territory[];
  territoryList: string[];

  openLoadingModal() {
    this.modalService
      .open(this.loadingModalTemplate, {
        backdrop: 'static',
        size: 'lg',
        centered: true,
        ariaLabelledBy: 'modal-basic-title',
      })
      .result.then(
        (result) => {
          console.log('loading modal closed');
        },
        (reason) => {
          console.log('loading modal closed');
        }
      );
  }

  closeLoadingModalTemplate() {
    document.getElementById('closeLoadingModal').click();
    console.log('loading modal closed');
  }

  onExport() {
    this.data = null;
    this.openLoadingModal();

    let flag = true;

    //validation
    if (this.validator.isEmptyString(this.endDate)) {
      this.snackBarService.showWarningSnack('Please select the end date');
      flag = false;
    } else {
      this.reportInput.endDate = DateFormatter.getDate_ddMMyyyy(
        new Date(this.endDate)
      );
    }

    if (this.validator.isEmptyString(this.startDate)) {
      this.snackBarService.showWarningSnack('Please select the start date');
      flag = false;
    } else {
      this.reportInput.startDate = DateFormatter.getDate_ddMMyyyy(
        new Date(this.startDate)
      );
    }

    //if empty setting it to 1 (for ascending sorting)
    this.reportInput.sort = Number(this.sort ? this.sort : 1);

    console.log(this.reportInput);

    if (flag) {
      this.reportService.getReport(this.reportInput).subscribe(
        (data: ReportOutput[]) => {
          console.log(data);
          if (data.length < 1) {
            this.closeLoadingModalTemplate();
            this.snackBarService.showWarningSnack(
              'No data found for the given data'
            );
          } else {
            this.data = data;
            this.csvdownload();
          }
        },
        (err) => {
          console.log(err);
          this.closeLoadingModalTemplate();
        }
      );
    } else {
      this.closeLoadingModalTemplate();
    }
  }

  csvdownload() {
    //escape commas in data
    this.escapeCommas();

    //getting all the object's values as arrays
    let csv = this.data.map((row) => Object.values(row));

    //inserting headings
    // csv.unshift(Object.keys(this.data[0]));
    csv.unshift([
      'Reference No',
      'Date',
      'Customer Name',
      'Sample Name',
      'Trim Type',
      'Transaction Status',
      'Expected Date',
    ]);

    //updating csv with quotes and commas
    let csvString = this.unescapeCommas(
      `"${csv.join('"\n"').replace(/,/g, '","')}"`
    );

    this.downloadFile(csvString);
  }

  escapeCommas() {
    for (let i = 0; i < this.data.length; i++) {
      let keys = Object.keys(this.data[i]);
      for (let j = 0; j < keys.length; j++) {
        this.data[i][keys[j]] = String(this.data[i][keys[j]]).replace(
          /,/g,
          this.escapeToken
        );
        if (this.data[i][keys[j]] == 'null') this.data[i][keys[j]] = '';
      }
    }
  }

  unescapeCommas(csvString) {
    return csvString.replace(new RegExp(`${this.escapeToken}`, 'g'), ',');
  }

  downloadFile(csvString) {
    let filename =
      'Report-' +
      DateFormatter.getDate_ddMMyyyy() +
      '-' +
      DateFormatter.getTime_HHMMSS();
    let blob = new Blob(['\ufeff' + csvString], {
      type: 'text/csv;charset=utf-8;',
    });
    let dwldLink = document.createElement('a');
    let url = URL.createObjectURL(blob);
    let isSafariBrowser =
      navigator.userAgent.indexOf('Safari') != -1 &&
      navigator.userAgent.indexOf('Chrome') == -1;

    //if Safari open in new window to save file with random filename.
    if (isSafariBrowser) {
      dwldLink.setAttribute('target', '_blank');
    }
    dwldLink.setAttribute('href', url);
    dwldLink.setAttribute('download', filename + '.csv');
    dwldLink.style.visibility = 'hidden';
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
    this.closeLoadingModalTemplate();
  }

  onView() {
    this.data = null;
    let flag = true;

    //validation
    if (this.validator.isEmptyString(this.endDate)) {
      this.snackBarService.showWarningSnack('Please select the end date');
      flag = false;
    } else {
      this.reportInput.endDate = DateFormatter.getDate_ddMMyyyy(
        new Date(this.endDate)
      );
    }

    if (this.validator.isEmptyString(this.startDate)) {
      this.snackBarService.showWarningSnack('Please select the start date');
      flag = false;
    } else {
      this.reportInput.startDate = DateFormatter.getDate_ddMMyyyy(
        new Date(this.startDate)
      );
    }

    //if empty setting it to 1 (for ascending sorting)
    this.reportInput.sort = Number(this.sort ? this.sort : 1);

    console.log(this.reportInput);

    if (flag) {
      this.reportService.getReport(this.reportInput).subscribe(
        (data: ReportOutput[]) => {
          console.log(data);
          if (data.length < 1) {
            this.snackBarService.showWarningSnack(
              'No data found for the given data'
            );
          } else {
            this.data = data;
          }
        },
        (err) => {
          console.log(err);
          this.closeLoadingModalTemplate();
        }
      );
    } else {
      this.closeLoadingModalTemplate();
    }
  }

  // onView() {
  //   this.reportService.getReport(this.reportInput).subscribe(
  //     (data: ReportOutput[]) => {
  //       console.log(data)
  //       if (data.length < 1) {
  //         this.snackBarService.showWarningSnack("No data found for the given data")
  //       }
  //       else {
  //         this.data = data;
  //       }
  //     })
  // }
}
