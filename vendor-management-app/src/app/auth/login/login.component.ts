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

  constructor(private router: Router, private authService: AuthService) {}

  onLogin() {
    if (this.loginData.username === 'admin' && this.loginData.role === 'admin' && this.loginData.password === 'admin') {
      this.router.navigate(['/org-dashboard']);
      this.authService.setUserRole('admin');
    } else if (this.loginData.username === 'vendor' && this.loginData.role === 'vendor' && this.loginData.password === 'vendor') {
      this.router.navigate(['/vendor-dashboard']);
      this.authService.setUserRole('vendor');
    } else {
      alert('Invalid credentials');
    }
  }
}
