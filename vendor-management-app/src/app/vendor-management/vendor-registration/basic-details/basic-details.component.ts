import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css']
})
export class BasicDetailsComponent implements OnInit {
  basicDetailsForm!: FormGroup;
  isEditMode = false;
  originalFormValues: any;

  vendorData = {};
  vendorID: number = 0;

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.basicDetailsForm = this.fb.group({
      vendorName: [{ value: '', disabled: true }, Validators.required],
      vendorAddress: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, Validators.required],
      mobileNumber: [{ value: '', disabled: true }, Validators.required],
      userName: [{ value: '', disabled: true }, Validators.required],
      password: [{ value: '', disabled: true }, Validators.required],
      status: [{ value: 'Pending', disabled: true }]  // Dropdown initially disabled
    });
    
    this.authService.loadVendorID();
    this.authService.vendorId$.subscribe(vendorId => {
      this.vendorID = Number(vendorId);
    });
    this.getVendorInfo(this.vendorID);
  }

  getVendorInfo(id: number): void {
    const apiUrl = `http://127.0.0.1:8000/vendor_info/${id}/`;
    this.http.get<any>(apiUrl).subscribe({
      next: (data) => {
        this.vendorData = data;
        console.log('Vendor Info:', data);
        this.basicDetailsForm.patchValue({
          vendorName: data.VENDORNAME,
          vendorAddress: data.VENDORADDRESS,
          email: data.EMAIL,
          mobileNumber: data.MOBILENUMBER,
          userName: data.USERNAME,
          password: data.PASSWORDHASH,
          status: data.STATUS
        });
        this.saveOriginalValues();
      },
      error: (error) => {
        console.error('Error fetching vendor info:', error);
      }
    });
  }
  

  saveOriginalValues() {
    this.originalFormValues = { ...this.basicDetailsForm.value }; // Store current values
  }

  enableEditMode() {
    this.isEditMode = true;
    this.basicDetailsForm.enable();  // Enable all form fields
  }
  
  cancelEdit() {
    this.basicDetailsForm.setValue(this.originalFormValues); // Reset values to original state
    this.isEditMode = false;
    this.basicDetailsForm.disable(); // Disable all form fields
  }

  onSubmit(): void {
    if (this.basicDetailsForm.valid) {
      console.log('Basic Details:', this.basicDetailsForm.value);
    }
  }
}
