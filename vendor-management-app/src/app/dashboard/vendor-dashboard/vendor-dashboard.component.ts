import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.css']
})
export class VendorDashboardComponent {
  vendor = {
    name: 'ABC Suppliers',
    email: 'vendor@abc.com',
    mobile: '+91 9876543210',
    status: 'Pending',
    verifier: 'OrgAdmin'
  };

  vendorData: any = {};

  constructor(private router: Router) {}

  editBasicDetails() {
    this.router.navigate(['/vendor-edit-basic-details']);
  }

  editMspDetails() {
    this.router.navigate(['/vendor-edit-msp-details'], { queryParams: { section: 'MSP' } });
  }

  editBankDetails() {
    this.router.navigate(['/vendor-edit-bank-details']);
  }

  uploadDocuments() {
    this.router.navigate(['/vendor-edit-doc-details']);
  }

  getStatusClass(status: string) {
    return {
      'status-pending': status === 'Pending',
      'status-verified': status === 'Verified',
      'status-rejected': status === 'Rejected'
    };
  }
}
