import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Authentication Components
import { LoginComponent } from './auth/login/login.component';
import { RegisterOrgComponent } from './auth/register-org/register-org.component';
import { RegisterVendorComponent } from './auth/register-vendor/register-vendor.component';
import { VerifyOtpComponent } from './auth/verify-otp/verify-otp.component';

// Dashboard Components
import { OrgDashboardComponent } from './dashboard/org-dashboard/org-dashboard.component';
import { VendorDashboardComponent } from './dashboard/vendor-dashboard/vendor-dashboard.component';

// Vendor Management Components
import { VendorListComponent } from './vendor-management/vendor-list/vendor-list.component';
import { VendorDetailsComponent } from './vendor-management/vendor-details/vendor-details.component';
import { VendorStatusUpdateComponent } from './vendor-management/vendor-status-update/vendor-status-update.component';

// Bank Components
import { ValidateBankComponent } from './bank/validate-bank/validate-bank.component';

// Compliance Components
import { UploadDocsComponent } from './compliance/upload-docs/upload-docs.component';
import { DocListComponent } from './compliance/doc-list/doc-list.component';

// Role Management Component
import { RoleDropdownComponent } from './role-management/role-dropdown/role-dropdown.component';

import { NotFoundComponent } from './shared/not-found/not-found.component';
import { BasicDetailsComponent } from './vendor-management/vendor-registration/basic-details/basic-details.component';
import { MspDetailsComponent } from './vendor-management/vendor-registration/msp-details/msp-details.component';
import { ComplianceDocsComponent } from './vendor-management/vendor-registration/compliance-docs/compliance-docs.component';
import { BankDetailsComponent } from './vendor-management/vendor-registration/bank-details/bank-details.component';

const routes: Routes = [
  // Default Route
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Authentication Routes
  { path: 'login', component: LoginComponent },
  { path: 'register-org', component: RegisterOrgComponent },
  { path: 'register-vendor', component: RegisterVendorComponent },
  { path: 'verify-otp', component: VerifyOtpComponent },

  // Dashboard Routes
  { path: 'org-dashboard', component: OrgDashboardComponent },
  { path: 'vendor-dashboard', component: VendorDashboardComponent },

  // Vendor Management Routes
  { path: 'vendor-list', component: VendorListComponent },
  { path: 'vendor-details', component: VendorDetailsComponent },
  { path: 'vendor-status-update', component: VendorStatusUpdateComponent },
  { path: 'vendor-edit-basic-details', component: BasicDetailsComponent },
  { path: 'vendor-edit-bank-details', component: BankDetailsComponent },
  { path: 'vendor-edit-msp-details', component: MspDetailsComponent },
  { path: 'vendor-edit-doc-details', component: ComplianceDocsComponent },

  // Bank Routes
  { path: 'validate-bank', component: ValidateBankComponent },

  // Compliance Routes
  { path: 'upload-docs', component: UploadDocsComponent },
  { path: 'doc-list', component: DocListComponent },

  // Role Management
  { path: 'role-dropdown', component: RoleDropdownComponent },

  // 404 Page (Catch-all Route)
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
