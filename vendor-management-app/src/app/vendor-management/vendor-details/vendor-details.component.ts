import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.css']
})
export class VendorDetailsComponent {
  vendor: any;

  vendors = [
    { id: 1, name: 'Vendor A', status: 'Active' },
    { id: 2, name: 'Vendor B', status: 'Inactive' },
    { id: 3, name: 'Vendor C', status: 'Pending' }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.vendor = this.vendors.find(v => v.id === id);
  }

  goBack() {
    this.router.navigate(['/vendor-list']);
  }
}
