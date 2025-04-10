import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BankDetailsService } from '../bank-details/bank-details.service';

@Component({
  selector: 'app-msp-details',
  templateUrl: './msp-details.component.html',
  styleUrls: ['./msp-details.component.css']
})
export class MspDetailsComponent implements OnInit {
  mspDetailsForm!: FormGroup;
  vendorID: number = 0;
  originalFormValues: any;

  constructor(private fb: FormBuilder, private authService: AuthService, private bankDetailsService: BankDetailsService) {}

  ngOnInit(): void {

    this.authService.loadVendorID();
    this.authService.vendorId$.subscribe(vendorId => {
      this.vendorID = Number(vendorId);
    });

    this.mspDetailsForm = this.fb.group({
      mspId: [{value: '', disabled: true}],
      mspName: [{value: '', disabled: true}, Validators.required],
      contactemail: [{value: '', disabled: true}, Validators.required],
      mspContactEmail: [{value: '', disabled: true}, [Validators.required, Validators.email]],
      mspContactMobileNo: [{value: '', disabled: true}, [Validators.required, Validators.pattern('[0-9]{10}')]],
      status: [{value: '', disabled: true}, Validators.required]
    });

    this.bankDetailsService.getMspDetails(this.vendorID).subscribe((data: any) => {
      if(data.status == 200) {
        this.mspDetailsForm.patchValue({
          mspId: data.mspid,
          mspName: data.mspname,
          contactemail: data.contactemail,
          mspContactMobileNo: data.contactphone,
          status: data.mspstatus
        });
        this.saveOriginalValues();
      } else {
        alert("Internal error occurred");
      }
    })
  }

  saveOriginalValues() {
    this.originalFormValues = { ...this.mspDetailsForm.value };
  }

  onSubmit(): void {
    if (this.mspDetailsForm.valid) {
      console.log('MSP Details:', this.mspDetailsForm.value);
      // Call API service here to save data
    }
  }
}
