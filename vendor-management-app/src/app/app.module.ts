import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterOrgComponent } from './auth/register-org/register-org.component';
import { RegisterVendorComponent } from './auth/register-vendor/register-vendor.component';
import { VerifyOtpComponent } from './auth/verify-otp/verify-otp.component';
import { OrgDashboardComponent } from './dashboard/org-dashboard/org-dashboard.component';
import { VendorDashboardComponent } from './dashboard/vendor-dashboard/vendor-dashboard.component';
import { VendorListComponent } from './vendor-management/vendor-list/vendor-list.component';
import { VendorDetailsComponent } from './vendor-management/vendor-details/vendor-details.component';
import { VendorStatusUpdateComponent } from './vendor-management/vendor-status-update/vendor-status-update.component';
import { ValidateBankComponent } from './bank/validate-bank/validate-bank.component';
import { UploadDocsComponent } from './compliance/upload-docs/upload-docs.component';
import { DocListComponent } from './compliance/doc-list/doc-list.component';
import { RoleDropdownComponent } from './role-management/role-dropdown/role-dropdown.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminSidebarComponent } from './shared/components/admin-sidebar/admin-sidebar.component';
import { VendorSidebarComponent } from './shared/components/vendor-sidebar/vendor-sidebar.component';
import { BasicDetailsComponent } from './vendor-management/vendor-registration/basic-details/basic-details.component';
import { MspDetailsComponent } from './vendor-management/vendor-registration/msp-details/msp-details.component';
import { ComplianceDocsComponent } from './vendor-management/vendor-registration/compliance-docs/compliance-docs.component';
import { BankDetailsComponent } from './vendor-management/vendor-registration/bank-details/bank-details.component';
import { HttpClientModule } from '@angular/common/http';
import { ChangeRequestPopupComponent } from './dashboard/org-dashboard/change-request-popup/change-request-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterOrgComponent,
    RegisterVendorComponent,
    VerifyOtpComponent,
    OrgDashboardComponent,
    VendorDashboardComponent,
    VendorListComponent,
    VendorDetailsComponent,
    VendorStatusUpdateComponent,
    BankDetailsComponent,
    ValidateBankComponent,
    UploadDocsComponent,
    DocListComponent,
    RoleDropdownComponent,
    NotFoundComponent,
    AdminSidebarComponent,
    VendorSidebarComponent,
    BasicDetailsComponent,
    MspDetailsComponent,
    ComplianceDocsComponent,
    BankDetailsComponent,
    ChangeRequestPopupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
