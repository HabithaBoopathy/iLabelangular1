import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ContactComponent } from './contact/contact.component';
import { ForgotComponent } from './forgot/forgot.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Header1Component } from './header1/header1.component';
import { Header2Component } from './header2/header2.component';
import { CustomerdetailsComponent } from './customerdetails/customerdetails.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { OrdersComponent } from './orders/orders.component';
import { AdminComponent } from './admin/admin.component';
import { MColorComponent } from './m-color/m-color.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MLabeltypeComponent } from './m-labeltype/m-labeltype.component';
import { MdocumenttypeComponent } from './m-documenttype/m-documenttype.component';
import { MUnitComponent } from './m-unit/m-unit.component';
import { MStatusComponent } from './m-status/m-status.component';
import { MLocationComponent } from './m-location/m-location.component';
import { MProductreferenceComponent } from './m-productreference/m-productreference.component';
import { MCustomerreferenceComponent } from './m-customerreference/m-customerreference.component';
import { MOtherdetailsComponent } from './m-otherdetails/m-otherdetails.component';
import { MCustomerComponent } from './m-customer/m-customer.component';
import { MatDialogModule } from '@angular/material/dialog';
import { LayoutModule } from '@angular/cdk/layout';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { ChartsModule } from 'ng2-charts';
import { TransactionFormsComponent } from './transaction-forms/transaction-forms.component';
import { UpdateTransactionFormsComponent } from './update-transaction-forms/update-transaction-forms.component';
import { AuthGuard } from './guards/auth.guard';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MyFilterPipe } from './filters/MyFilterPiple';
import { MExecutiveComponent } from './m-executive/m-executive.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { CustomFilterPipe } from './filters/custom-filter.pipe';
import { ExecutiveFilterPipe } from './filters/executive-filter.pipe';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxPaginationModule } from 'ngx-pagination';
import { CustomerVerificationComponent } from './customer-verification/customer-verification.component';
import { QuotationComponent } from './quotation/quotation.component';
import { QuotationOrdersComponent } from './quotation-orders/quotation-orders.component';
import { CommonModule, DatePipe } from '@angular/common';
import { TestcomponentComponent } from './testcomponent/testcomponent.component';
import { RouterModule } from '@angular/router';
import { OrderModule } from 'ngx-order-pipe';
import { ReportsComponent } from './reports/reports.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerComponent } from './spinner/spinner.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatNativeDateModule } from '@angular/material/core';
import { Orders2Component } from './orders2/orders2.component';
import { UserApprovalComponent } from './user-approval/user-approval.component';
import { TerritoryComponent } from './territory/territory.component';
import { CompanyComponent } from './company/company.component';
import { CompanyComponent as CompanyComponentV2 } from './v2/components/company/company.component';
import { MerchandiserComponent } from './v2/components/merchandiser/merchandiser.component';
import { WovenComponent } from './v2/components/costing/woven/woven.component';
import { PrintedComponent } from './v2/components/costing/printed/printed.component';
import { CostingListComponent } from './v2/components/costingNew/costing-list/costing-list.component';
import { WovenCostingComponent } from './v2/components/costingNew/woven-costing/woven-costing.component';
import { PrintedCostingComponent } from './v2/components/costingNew/printed-costing/printed-costing.component';
import { CostingApprovalComponent } from './v2/components/costingNew/costing-approval/costing-approval.component';
import { MTapeComponent } from './m-tape/m-tape.component';
import { MpaperComponent } from './mpaper/mpaper.component';
import { TagCostingComponent } from './v2/components/costingNew/tag-costing/tag-costing.component';
import { MTapeMachineComponent } from './m-tape-machine/m-tape-machine.component';
import { StickerFlexoCostingComponent } from './v2/components/costingNew/sticker-flexo-costing/sticker-flexo-costing.component';
import { StickerOffsetCostingComponent } from './v2/components/costingNew/sticker-offset-costing/sticker-offset-costing.component';
import { CostingRejectedComponent } from './v2/components/costingNew/costing-rejected/costing-rejected.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LandingPageComponent,
    ContactComponent,
    ForgotComponent,
    DashboardComponent,
    Header1Component,
    Header2Component,
    CustomerdetailsComponent,
    OrdersComponent,
    AdminComponent,
    MColorComponent,
    MLabeltypeComponent,
    MdocumenttypeComponent,
    MUnitComponent,
    MStatusComponent,
    MLocationComponent,
    MProductreferenceComponent,
    MCustomerreferenceComponent,
    MOtherdetailsComponent,
    MCustomerComponent,
    TransactionFormsComponent,
    UpdateTransactionFormsComponent,
    MyFilterPipe,
    MExecutiveComponent,
    CustomFilterPipe,
    ExecutiveFilterPipe,
    CustomerVerificationComponent,
    QuotationComponent,
    QuotationOrdersComponent,
    TestcomponentComponent,
    SpinnerComponent,
    ReportsComponent,
    Orders2Component,
    UserApprovalComponent,
    TerritoryComponent,
    CompanyComponent,
    CompanyComponentV2,
    MerchandiserComponent,
    WovenComponent,
    PrintedComponent,
    CostingListComponent,
    WovenCostingComponent,
    PrintedCostingComponent,
    CostingApprovalComponent,
    MTapeComponent,
    MpaperComponent,
    TagCostingComponent,
    MTapeMachineComponent,
    StickerFlexoCostingComponent,
    StickerOffsetCostingComponent,
    CostingRejectedComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    NgbModule,
    MatDialogModule,
    MatAutocompleteModule,
    LayoutModule,
    MatCheckboxModule,
    MatRadioModule,
    ChartsModule,
    Ng2SearchPipeModule,
    HttpClientJsonpModule,
    MatDatepickerModule,
    MatTableModule,
    BsDatepickerModule,
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    NgxPaginationModule,
    CommonModule,
    OrderModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatNativeDateModule,
  ],
  bootstrap: [AppComponent],
  providers: [AuthGuard, DatePipe],
})
export class AppModule {}
