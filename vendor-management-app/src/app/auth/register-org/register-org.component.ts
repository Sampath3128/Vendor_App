import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-org',
  templateUrl: './register-org.component.html',
  styleUrls: ['./register-org.component.css']
})
export class RegisterOrgComponent {
  orgData = {
    organizationName: '',
    organizationCode: '',
    registrationNumber: '',
    address: '',
    adminName: '',
    adminEmail: '',
    adminMobileNumber: '',
    adminUsername: '',
    adminPassword: ''
  };

  constructor(private router: Router) {}

  onRegister() {
    console.log('Organization Registered:', this.orgData);
    alert('Organization registered successfully!');
    this.router.navigate(['/login']);
  }
}
