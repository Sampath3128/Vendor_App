import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vendor-edit',
  templateUrl: './vendor-edit.component.html',
  styleUrls: ['./vendor-edit.component.css']
})
export class VendorEditComponent {
  vendor: any = { id: 0, name: '', status: '' };

  vendors = [
    { id: 1, name: 'Vendor A', status: 'Active' },
    { id: 2, name: 'Vendor B', status: 'Inactive' },
    { id: 3, name: 'Vendor C', status: 'Pending' }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.vendor = this.vendors.find(v => v.id === id) || { id: id, name: '', status: 'Pending' };
  }

  saveChanges() {
    alert(`Vendor ${this.vendor.id} updated successfully!`);
    this.router.navigate(['/vendor-dashboard']);
  }
}
