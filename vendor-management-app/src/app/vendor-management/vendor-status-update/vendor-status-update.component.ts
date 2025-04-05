import { Component } from '@angular/core';

@Component({
  selector: 'app-vendor-status-update',
  templateUrl: './vendor-status-update.component.html',
  styleUrls: ['./vendor-status-update.component.css']
})
export class VendorStatusUpdateComponent {
  vendors = [
    { id: 1, name: 'Vendor A', status: 'Active' },
    { id: 2, name: 'Vendor B', status: 'Inactive' },
    { id: 3, name: 'Vendor C', status: 'Pending' }
  ];

  selectedVendor: number | null = null;
  status: string = 'Active';

  updateStatus() {
    alert(`Vendor ${this.selectedVendor} status updated to ${this.status}`);
  }
}
