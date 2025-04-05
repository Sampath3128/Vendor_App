import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  userRole: string | null = null;
  dashboardLink: string = '/dashboard'; // Default route
  private roleSubscription!: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to userRole observable
    this.roleSubscription = this.authService.userRole$.subscribe((role) => {
      this.userRole = role;
      this.dashboardLink = role === 'admin' ? '/org-dashboard' : '/vendor-dashboard';
    });
  }

  logout() {
    this.authService.loadUserRole();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
  }
}