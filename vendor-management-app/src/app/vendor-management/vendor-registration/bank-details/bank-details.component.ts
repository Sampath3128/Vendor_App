import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BankDetailsService } from './bank-details.service';

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.css']
})
export class BankDetailsComponent implements OnInit {
  bankDetailsForm!: FormGroup;
  isEditMode = false;
  originalFormValues: any;
  vendorID: number = 0;

  constructor(private fb: FormBuilder, private bankDetailsService: BankDetailsService, private authService: AuthService) {}

  ngOnInit(): void {

    this.authService.loadVendorID();
    this.authService.vendorId$.subscribe(vendorId => {
      this.vendorID = Number(vendorId);
    });

    this.bankDetailsForm = this.fb.group({
      bankName: [{ value: '', disabled: true }, Validators.required],
      accountHolderName: [{ value: '', disabled: true }, Validators.required],
      accountNumber: [{ value: '', disabled: true }, Validators.required],
      ifsccode: [{ value: '', disabled: true }, Validators.required],
      branchName: [{ value: '', disabled: true }, Validators.required]
    });

    this.bankDetailsService.getBankDetails(this.vendorID).subscribe((data: any) => {
      if (data.status == 200) {
        this.bankDetailsForm.patchValue({
          bankName: data.bankName,
          accountHolderName: data.accountHolderName,
          accountNumber: data.accountNumber,
          ifsccode: data.ifsccode,
          branchName: data.branchName
        });
        this.saveOriginalValues();
      } else {
        console.log("Invalid data received")
      }
    });
  }

  saveOriginalValues() {
    this.originalFormValues = { ...this.bankDetailsForm.value };
  }

  enableEditMode() {
    this.isEditMode = true;
    this.bankDetailsForm.enable();
  }

  cancelEdit() {
    if (this.originalFormValues) {
      this.bankDetailsForm.setValue(this.originalFormValues);
    }
    this.isEditMode = false;
    this.bankDetailsForm.disable();
  }

  onSubmit() {
    if (this.bankDetailsForm.valid) {
      const formData = {
        bankName: this.bankDetailsForm.value.bankName,
        accountHolderName: this.bankDetailsForm.value.accountHolderName,
        accountNumber: this.bankDetailsForm.value.accountNumber,
        ifsccode: this.bankDetailsForm.value.ifsccode,
        branchName: this.bankDetailsForm.value.branchName
      };
  
      this.bankDetailsService.updateBankDetails(this.vendorID, formData).subscribe(
        res => {
          if (res && res.status === 200) {
            console.log('Bank details updated', res.message);
            this.isEditMode = false;
          } else {
            console.error('Update failed:', res.message || 'Unexpected response');
          }
        },
        err => {
          console.error('Update failed with error:', err);
        }
      );
    }
  }

}