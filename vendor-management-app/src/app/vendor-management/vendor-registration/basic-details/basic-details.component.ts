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
    this.originalFormValues = { ...this.basicDetailsForm.value };
    console.log(this.originalFormValues);
  }

  enableEditMode() {
    this.isEditMode = true;
    this.basicDetailsForm.enable();
  }
  
  cancelEdit() {
    this.basicDetailsForm.setValue(this.originalFormValues);
    this.isEditMode = false;
    this.basicDetailsForm.disable();
  }

  onSubmit(): void {
    if (this.basicDetailsForm.valid) {
      const apiUrl = `http://127.0.0.1:8000/vendor_info_update_request/${this.vendorID}/`;
      
      const payload = {
        vendorName: this.basicDetailsForm.value.vendorName,
        vendorAddress: this.basicDetailsForm.value.vendorAddress,
        email: this.basicDetailsForm.value.email,
        mobileNumber: this.basicDetailsForm.value.mobileNumber,
        username: this.basicDetailsForm.value.userName,
        status: this.basicDetailsForm.value.status
      };
  
      this.http.put(apiUrl, payload).subscribe({
        next: (response) => {
          console.log('Vendor updated successfully:', response);
          this.isEditMode = false;
          this.basicDetailsForm.disable();
          this.ngOnInit();
        },
        error: (error) => {
          console.error('Error updating vendor:', error);
        }
      });
    }
  }
}
