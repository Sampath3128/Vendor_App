import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-org-dashboard',
  templateUrl: './org-dashboard.component.html',
  styleUrls: ['./org-dashboard.component.css']
})
export class OrgDashboardComponent implements OnInit {
  vendors: any[] = [];
  showModal: boolean = false;
  
  requestDetails: any = null; // This will hold the full response
  requestComparisonData: any[] = []; // This will hold the formatted data for UI


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchChangeRequests();
  }

  // Fetch all change requests (bank, basic, msp)
  fetchChangeRequests(): void {
    this.http.get<any>(`http://127.0.0.1:8000/change-requests`).subscribe(
      data => {
        this.vendors = data.changeRequests;
      },
      error => {
        console.error('Error fetching change requests', error);
      }
    );
  }

  // Open the modal and display change request details
  viewVendorDetails(requestType: string, vendorid: string): void {
    const requestBody = {
      vendor_id: vendorid,
      request_type: requestType
    };
  
    this.http.post<any>('http://127.0.0.1:8000/change-request-info/', requestBody).subscribe(
      data => {
        this.requestDetails = data;
  
        // Transform the data into a list of { field, original, new }
        this.requestComparisonData = Object.keys(data.original_data).map(key => ({
          field: this.formatFieldName(key),
          original: data.original_data[key],
          new: data.request_data[key]
        }));
  
        this.showModal = true;
      },
      error => {
        console.error('Error fetching vendor info:', error);
      }
    );
  }

  formatFieldName(key: string): string {
    // Optional: convert snake_case to Title Case for display
    return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  // Approve change request
  approveRequest(requestId: string): void {
    this.updateRequestStatus(requestId, 'approve');
  }

  // Reject change request
  rejectRequest(requestId: string): void {
    this.updateRequestStatus(requestId, 'reject');
  }

  // Update request status (approve/reject)
  updateRequestStatus(requestId: string, action: string): void {
    this.http.put<any>(`http://127.0.0.1:8000/change-request-status/${requestId}/${action}`, {}).subscribe(
      data => {
        this.fetchChangeRequests();  // Refresh the requests after update
        this.closeModal();
      },
      error => {
        console.error('Error updating request status', error);
      }
    );
  }

  // Close the modal
  closeModal(): void {
    this.showModal = false;
    this.requestDetails = null;
  }

  // Get status class for styling
  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'pending';
      case 'Approved': return 'approved';
      case 'Rejected': return 'rejected';
      default: return '';
    }
  }
}