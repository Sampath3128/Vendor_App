import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css']
})
export class BasicDetailsComponent implements OnInit {
  basicDetailsForm!: FormGroup;
  isEditMode = false;
  originalFormValues: any;

  constructor(private fb: FormBuilder) {}

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

    this.saveOriginalValues();
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
