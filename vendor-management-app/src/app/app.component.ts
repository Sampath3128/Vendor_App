import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  userRole: string | null = null;
  hideSidebarRoutes = ['/login', '/register-org', '/register-vendor'];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.userRole$.subscribe(role => {
      this.userRole = role;
    });

    this.authService.loadUserRole();
  }

  shouldShowSidebar(): boolean {
    return !this.hideSidebarRoutes.includes(this.router.url);
  }
}