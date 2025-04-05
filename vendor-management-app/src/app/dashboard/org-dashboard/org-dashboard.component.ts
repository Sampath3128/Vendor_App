import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-org-dashboard',
  templateUrl: './org-dashboard.component.html',
  styleUrls: ['./org-dashboard.component.css']
})
export class OrgDashboardComponent {
  vendors = [
    { id: 1, name: 'ABC Suppliers', status: 'Pending', verifier: 'OrgAdmin' },
    { id: 2, name: 'XYZ Services', status: 'Verified', verifier: 'OrgAdmin' },
    { id: 3, name: 'LMN Traders', status: 'Rejected', verifier: 'Manager' }
  ];

  vendorData: any = {};

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('http://127.0.0.1:8000/all_vendors/')
      .subscribe({
        next: (data) => {
          this.vendorData = data;
          console.log("vendorData: ");
          console.log(this.vendorData);
        },
        error: (error) => {
          console.error('Error fetching vendor data:', error);
        }
      });
  }

  viewVendor(vendorId: number) {
    this.router.navigate(['/vendor-dashboard']);
  }

  verifyVendor(vendorId: number) {
    console.log('Verifying Vendor ID:', vendorId);
    this.updateVendorStatus(vendorId, 'Verified');
  }

  rejectVendor(vendorId: number) {
    console.log('Rejecting Vendor ID:', vendorId);
    this.updateVendorStatus(vendorId, 'Rejected');
  }

  updateVerifier(vendorId: number) {
    console.log('Updating Verifier for Vendor ID:', vendorId);
    const vendor = this.vendors.find(v => v.id === vendorId);
    if (vendor) {
      vendor.verifier = 'UpdatedVerifier';
    }
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
