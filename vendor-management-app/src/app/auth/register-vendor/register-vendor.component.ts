import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-vendor',
  templateUrl: './register-vendor.component.html',
  styleUrls: ['./register-vendor.component.css']
})
export class RegisterVendorComponent {
  vendorData = {
    vendorName: '',
    vendorAddress: '',
    email: '',
    mobileNumber: '',
    username: '',
    password: '',
    orgCode: ''
  };

  organizations = [
    { code: 'ORG001', name: 'Organization A' },
    { code: 'ORG002', name: 'Organization B' }
  ];

  constructor(private router: Router) {}

  onRegister() {
    console.log('Vendor Registered:', this.vendorData);
    alert('Vendor registered successfully!');
    this.router.navigate(['/login']);
  }
}
