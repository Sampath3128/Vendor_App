import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userRole = new BehaviorSubject<string | null>(null);
  private vendorId = new BehaviorSubject<string | null>(null);
  userRole$ = this.userRole.asObservable();
  vendorId$ = this.vendorId.asObservable();

  setUserRole(role: string) {
    localStorage.setItem('userRole', role);
    this.userRole.next(role);
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  setVendorID(vendorID: string) {
    localStorage.setItem('vendorID', vendorID);
    this.vendorId.next(vendorID);
  }

  getVendorID(): string | null {
    return localStorage.getItem('vendorID');
  }

  loadUserRole() {
    const role = this.getUserRole();
    if (role) {
      this.userRole.next(role);
    }
  }

  loadVendorID() {
    const vendorID = this.getVendorID();
    if (vendorID) {
      this.vendorId.next(vendorID);
    }
  }
}