import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.css']
})
export class BankDetailsComponent implements OnInit {
  bankDetailsForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.bankDetailsForm = this.fb.group({
      bankName: ['', Validators.required],
      accountHolderName: ['', Validators.required],
      accountNumber: ['', [Validators.required, Validators.minLength(10)]],
      routingNumber: ['', Validators.required],
      authorisedPersonName: ['', Validators.required],
      authorisedPersonMobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
    });
  }

  onSubmit() {
    if (this.bankDetailsForm.valid) {
      console.log('Form Data:', this.bankDetailsForm.value);
    }
  }
}
