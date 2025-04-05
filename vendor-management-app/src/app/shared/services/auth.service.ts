import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userRole = new BehaviorSubject<string | null>(null); // Default: null
  userRole$ = this.userRole.asObservable();

  setUserRole(role: string) {
    localStorage.setItem('userRole', role);
    this.userRole.next(role);
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  loadUserRole() {
    const role = this.getUserRole();
    if (role) {
      this.userRole.next(role);
    }
  }
}