import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.css']
})
export class VendorListComponent {
  vendors = [
    { id: 1, name: 'Vendor A', status: 'Active' },
    { id: 2, name: 'Vendor B', status: 'Inactive' },
    { id: 3, name: 'Vendor C', status: 'Pending' }
  ];

  constructor(private router: Router) {}

  viewDetails(id: number) {
    this.router.navigate(['/vendor-details', id]);
  }

  editVendor(id: number) {
    this.router.navigate(['/vendor-edit', id]);
  }
}
