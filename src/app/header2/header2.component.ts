import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Logs } from '../models/log';
import { LogService } from '../services/log.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header2',
  templateUrl: './header2.component.html',
  styleUrls: ['./header2.component.css'],
})
export class Header2Component implements OnInit {
  log: Logs = new Logs();

  Logs: Observable<Logs[]>;

  logMax: number;

  @ViewChild('drawer') drawer: any;

  username: String;

  public isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result: BreakpointState) => result.matches));

  public showmaster: boolean = false;
  public showAdmin: boolean = false;
  public showSalesTeam: boolean = false;
  public showQuotationForm: boolean = false;
  public showUserApproval: boolean = false;
  public showCosting: boolean = false;

  showCostingApproval: boolean = false;
  showCostingRejected: boolean = false;

  showMasterList: boolean = false;
  

  togglemaster() {
    this.showmaster = !this.showmaster;
  }

  toggleAdmin() {
    this.showAdmin = true;
  }

  toggleSampleHead() {
    this.showAdmin = false;
  }

  toggleCST() {
    this.showAdmin = false;
  }

  toggleSalesTeam() {
    this.showAdmin = false;
    this.showSalesTeam = true;
  }

  toggleCustomer() {
    this.showAdmin = false;
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private _location: Location,
    private breakpointObserver: BreakpointObserver,
    private logService: LogService
  ) {
    this.displayCosting();
  }

  logout() {
    console.log('logout');
    this.authService.logout();
    this.router.navigate(['/header/login']);
  }

  closeSideNav() {
    if (this.drawer._mode == 'over') {
      this.drawer.close();
    }
  }

  backClicked() {
    this._location.back();
  }

  public readOnlyMode: boolean = false;

  ngOnInit(): void {
    if (localStorage.getItem('isLoggedIn') != 'true') {
      this.readOnlyMode = true;
    }

    this.checkAccess();

    this.username = localStorage.getItem('userToken');
  }

  checkAccess() {
    if (localStorage.getItem('token') === 'Administrator') {
      this.toggleAdmin();
      this.showQuotationForm = true;
      this.showUserApproval = true;
      if (localStorage.getItem('superUser') == 'true') {
        this.showCostingApproval = true;
        this.showCostingRejected = true;
      }
    } else if (localStorage.getItem('token') === 'Sample Head') {
      this.toggleSampleHead();
      this.showQuotationForm = true;
    } else if (localStorage.getItem('token') === 'Customer Service Team') {
      this.toggleCST();
    } else if (localStorage.getItem('token') === 'Sales Team') {
      this.toggleSalesTeam();
    } else if (localStorage.getItem('token') === 'Customer') {
      this.toggleCustomer();
    }
  }

  displayCosting() {
    if (
      localStorage.getItem('token') === 'Administrator' ||
      localStorage.getItem('token') === 'Sample Head' ||
      localStorage.getItem('token') === 'Sales Team' ||
      localStorage.getItem('token') === 'TManager' ||
      localStorage.getItem('token') === 'Customer'
    ) {
      this.showCosting = true;
    }
  }
}
