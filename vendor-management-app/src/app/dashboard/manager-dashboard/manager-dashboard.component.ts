import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.css']
})
export class ManagerDashboardComponent {
  vendors = [
    { id: 1, name: 'ABC Suppliers', status: 'Pending' },
    { id: 2, name: 'XYZ Services', status: 'Verified' },
    { id: 3, name: 'LMN Traders', status: 'Rejected' }
  ];

  constructor(private router: Router) {}

  viewVendor(vendorId: number) {
    this.router.navigate(['/vendor-management/vendor-details', vendorId]);
  }

  verifyVendor(vendorId: number) {
    console.log('Verifying Vendor ID:', vendorId);
    this.updateVendorStatus(vendorId, 'Verified');
  }

  rejectVendor(vendorId: number) {
    console.log('Rejecting Vendor ID:', vendorId);
    this.updateVendorStatus(vendorId, 'Rejected');
  }

  updateVendorStatus(vendorId: number, status: string) {
    const vendor = this.vendors.find(v => v.id === vendorId);
    if (vendor) {
      vendor.status = status;
    }
  }

  getStatusClass(status: string) {
    return {
      'status-pending': status === 'Pending',
      'status-verified': status === 'Verified',
      'status-rejected': status === 'Rejected'
    };
  }
}
