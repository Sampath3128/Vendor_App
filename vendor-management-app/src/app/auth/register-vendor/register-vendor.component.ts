import { HttpClient } from '@angular/common/http';
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
    org_id: ''
  };

  organizations = [
    { code: 'ORG001', name: 'Organization A' },
    { code: 'ORG002', name: 'Organization B' }
  ];

  orgData = [];

  constructor(private router: Router, private http : HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('http://127.0.0.1:8000/all_orgs/')
      .subscribe({
        next: (data) => {
          this.orgData = data;
          console.log("Organization List: ");
          console.log(this.orgData);
        },
        error: (error) => {
          console.error('Error fetching vendor data:', error);
        }
      });
  }

  onRegister() {
    fetch('http://localhost:8000/register-vendor/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.vendorData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.status == 200) {
        alert('Vendor registered successfully!');
        this.router.navigate(['/login']);
      } else {
        alert('Registration failed: ' + data.error);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Registration failed.');
    });
  }  
}
