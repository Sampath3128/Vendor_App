import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = { orgCode: '', role: '', username: '', password: '' };
  organizations = [
    { code: 'ORG001', name: 'Organization A' },
    { code: 'ORG002', name: 'Organization B' }
  ];

  roles = [
    { code: 'admin', name: 'Admin' },
    { code: 'vendor', name: 'Vendor' }
  ];

  orgData = [];

  constructor(private router: Router, private authService: AuthService, private http: HttpClient) {}

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

  onLogin() {
    const loginPayload = {
      orgCode: parseInt(this.loginData.orgCode),
      role: this.loginData.role,
      username: this.loginData.username,
      password: this.loginData.password
    };
  
    this.http.post<any>('http://127.0.0.1:8000/login/', loginPayload).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.authService.setVendorID(response.vendor_id);
        if (this.loginData.role === 'vendor') {
          this.router.navigate(['/vendor-dashboard/']);
        } else {
          this.router.navigate(['/org-dashboard']);
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
        alert(error.error?.error || 'Login failed');
      }
    });
  }
  
}
