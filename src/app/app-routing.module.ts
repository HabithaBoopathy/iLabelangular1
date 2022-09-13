import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ContactComponent } from './contact/contact.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Header1Component } from './header1/header1.component';
import { Header2Component } from './header2/header2.component';
import { CustomerdetailsComponent } from './customerdetails/customerdetails.component';
import { OrdersComponent } from './orders/orders.component';
import { Orders2Component } from './orders2/orders2.component';
import { AdminComponent } from './admin/admin.component';
import { MColorComponent } from './m-color/m-color.component';
import { MLabeltypeComponent } from './m-labeltype/m-labeltype.component';
import { MdocumenttypeComponent } from './m-documenttype/m-documenttype.component';
import { MUnitComponent } from './m-unit/m-unit.component';
import { MStatusComponent } from './m-status/m-status.component';
import { MLocationComponent } from './m-location/m-location.component';
import { MProductreferenceComponent } from './m-productreference/m-productreference.component';
import { MCustomerreferenceComponent } from './m-customerreference/m-customerreference.component';
import { MOtherdetailsComponent } from './m-otherdetails/m-otherdetails.component';
import { MCustomerComponent } from './m-customer/m-customer.component';
import { TransactionFormsComponent } from './transaction-forms/transaction-forms.component';
import { UpdateTransactionFormsComponent } from './update-transaction-forms/update-transaction-forms.component';
import { AuthGuard } from './guards/auth.guard';
import { MExecutiveComponent } from './m-executive/m-executive.component';
import { CustomerVerificationComponent } from './customer-verification/customer-verification.component';
import { Quotation } from './models/orderForms/Quotation';
import { QuotationComponent } from './quotation/quotation.component';
import { QuotationOrdersComponent } from './quotation-orders/quotation-orders.component';
import { TestcomponentComponent } from './testcomponent/testcomponent.component';
import { ReportsComponent } from './reports/reports.component';
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


const routes: Routes = [
  { path: '', redirectTo: '/header/home', pathMatch: 'full' },

  {
    path: 'customerverification/:id',
    component: CustomerVerificationComponent,
  },

  {
    path: 'header',
    component: Header1Component,
    children: [
      { path: 'contact', component: ContactComponent },
      { path: 'home', component: LandingPageComponent },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'login/costingApproval/:id',
        component: LoginComponent,
      },
      {
        path: 'login/costingApprovalForCustomer/:id',
        component: LoginComponent,
      },
      { path: 'forgot', component: ForgotComponent },
    ],
  },

  {
    path: 'home',
    component: Header2Component,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'customerdetails',
        component: CustomerdetailsComponent,
        canActivate: [AuthGuard],
      },
      { path: 'orders2', component: OrdersComponent, canActivate: [AuthGuard] },
      { path: 'orders', component: Orders2Component, canActivate: [AuthGuard] },
      { path: 'admin', component: AdminComponent },
      { path: 'color', component: MColorComponent, canActivate: [AuthGuard] },
      {
        path: 'executive',
        component: MExecutiveComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'labeltype',
        component: MLabeltypeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'documenttype',
        component: MdocumenttypeComponent,
        canActivate: [AuthGuard],
      },
      { path: 'unit', component: MUnitComponent, canActivate: [AuthGuard] },
      { path: 'status', component: MStatusComponent, canActivate: [AuthGuard] },
      {
        path: 'location',
        component: MLocationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'productreference',
        component: MProductreferenceComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'customerreference',
        component: MCustomerreferenceComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'otherdetails',
        component: MOtherdetailsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'customer',
        component: MCustomerComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'territory',
        component: TerritoryComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'company',
        component: CompanyComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'quotation',
        component: QuotationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'quotation/:id',
        component: QuotationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'quotationorders',
        component: QuotationOrdersComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'forms',
        component: TransactionFormsComponent,
        canActivate: [AuthGuard],
      },
      { path: 'uforms/:id', component: UpdateTransactionFormsComponent },
      {
        path: 'test',
        component: TestcomponentComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [AuthGuard],
      },
      { path: 'approveusers', component: UserApprovalComponent },
      {
        path: 'companyv2',
        component: CompanyComponentV2,
        canActivate: [AuthGuard],
      },
      {
        path: 'merchandiser',
        component: MerchandiserComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'costingWoven/:id',
        component: WovenComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'costingPrinted/:id',
        component: PrintedComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'costingList',
        component: CostingListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'wovenCosting/:id',
        component: WovenCostingComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'printedCosting/:id',
        component: PrintedCostingComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'costingApproval',
        component: CostingApprovalComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'costingRejected',
        component: CostingRejectedComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'tagCosting/:id',
        component: TagCostingComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'tape',
        component: MTapeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'tapeMachine',
        component: MTapeMachineComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'paper',
        component: MpaperComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'stickerFlexoCosting/:id',
        component: StickerFlexoCostingComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'stickerOffsetCosting/:id',
        component: StickerOffsetCostingComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      relativeLinkResolution: 'legacy',
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
