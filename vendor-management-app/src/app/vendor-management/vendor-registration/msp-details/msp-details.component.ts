import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BankDetailsService } from '../bank-details/bank-details.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-msp-details',
  templateUrl: './msp-details.component.html',
  styleUrls: ['./msp-details.component.css']
})
export class MspDetailsComponent implements OnInit {
  mspDetailsForm!: FormGroup;
  vendorID: number = 0;
  originalFormValues: any;
  isEditMode:boolean=false;

  constructor(private fb: FormBuilder, private authService: AuthService, private bankDetailsService: BankDetailsService, private http:HttpClient) {}

  ngOnInit(): void {

    this.authService.loadVendorID();
    this.authService.vendorId$.subscribe(vendorId => {
      this.vendorID = Number(vendorId);
    });

    this.mspDetailsForm = this.fb.group({
      mspId: [{value: '', disabled: true}],
      mspName: [{value: '', disabled: true}, Validators.required],
      contactemail: [{value: '', disabled: true}, [Validators.required,Validators.email]],
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

  enableEditMode() {
    this.isEditMode = true;
    this.mspDetailsForm.enable();
  }

  cancelEdit() {
    if (this.originalFormValues) {
      this.mspDetailsForm.setValue(this.originalFormValues);
    }
    this.isEditMode = false;
    this.mspDetailsForm.disable();
  }

  saveOriginalValues() {
    this.originalFormValues = { ...this.mspDetailsForm.value };
  }
  onSubmit(): void {
    if (this.mspDetailsForm.valid) {
      const apiUrl = `http://127.0.0.1:8000/vendor_info_msp_update_request/${this.vendorID}/`;
      
      const payload = {
        mspName: this.mspDetailsForm.value.mspName,
        mspId: this.mspDetailsForm.value.mspId,
        contactemail: this.mspDetailsForm.value.contactemail,
        mobileNumber: this.mspDetailsForm.value.mspContactMobileNo,
        status: this.mspDetailsForm.value.status,
      };
  
      this.http.put(apiUrl, payload).subscribe({
        next: (response) => {
          console.log('Vendor updated successfully:', response);
          this.isEditMode = false;
          this.mspDetailsForm.disable();
          this.ngOnInit();
        },
        error: (error) => {
          console.error('Error updating vendor:', error);
        }
      });
    }
  }
}
