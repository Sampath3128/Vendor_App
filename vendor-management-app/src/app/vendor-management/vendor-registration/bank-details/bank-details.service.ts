import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BankDetailsService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getBankDetails(vendorId: number) {
    return this.http.get(`${this.baseUrl}/bank-details/${vendorId}`);
  }

  updateBankDetails(vendorId: number, formData: any): Observable<any> {
    const url = `${this.baseUrl}/update-bank-details/${vendorId}/`;
    return this.http.post(url, formData);
  }

  getMspDetails(vendorId: number) {
    return this.http.get(`${this.baseUrl}/vendor-msp-details/${vendorId}`);
  }
}