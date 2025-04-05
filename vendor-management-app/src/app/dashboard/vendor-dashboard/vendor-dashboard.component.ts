import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

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

  vendorID: number = 0;
  vendorData: any = {};

  constructor(private router: Router, private http: HttpClient, private authService : AuthService) {}

  ngOnInit(): void {
    this.authService.loadVendorID();
    this.authService.vendorId$.subscribe(vendorId => {
      this.vendorID = Number(vendorId);
    });
    this.getVendorInfo(this.vendorID);
  }

  getVendorInfo(id: number): void {
    const apiUrl = `http://127.0.0.1:8000/vendor_info/${id}/`;
    this.http.get(apiUrl).subscribe({
      next: (response) => {
        this.vendorData = response;
        console.log('Vendor Info:', response);
      },
      error: (error) => {
        console.error('Error fetching vendor info:', error);
      }
    });
  }

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
