import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-msp-details',
  templateUrl: './msp-details.component.html',
  styleUrls: ['./msp-details.component.css']
})
export class MspDetailsComponent implements OnInit {
  mspDetailsForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.mspDetailsForm = this.fb.group({
      mspName: ['', Validators.required],
      mspRepresentativeName: ['', Validators.required],
      mspContactEmail: ['', [Validators.required, Validators.email]],
      mspContactMobileNo: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      status: ['Pending', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.mspDetailsForm.valid) {
      console.log('MSP Details:', this.mspDetailsForm.value);
      // Call API service here to save data
    }
  }
}
