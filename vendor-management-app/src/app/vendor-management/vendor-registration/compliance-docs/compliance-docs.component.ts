import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-compliance-docs',
  templateUrl: './compliance-docs.component.html',
  styleUrls: ['./compliance-docs.component.css']
})
export class ComplianceDocsComponent implements OnInit {
  complianceDocsForm!: FormGroup;
  files: { [key: string]: File | null } = {
    w9Form: null,
    businessLicence: null,
    vendorAgreement: null
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.complianceDocsForm = this.fb.group({
      agreedToTerms: [false, Validators.requiredTrue],
      status: ['Pending', Validators.required]
    });
  }

  onFileChange(event: any, field: string): void {
    if (event.target.files.length > 0) {
      this.files[field] = event.target.files[0];
    }
  }

  onSubmit(): void {
    if (this.complianceDocsForm.valid) {
      console.log('Compliance Docs:', this.complianceDocsForm.value);
      console.log('Uploaded Files:', this.files);
      // Call API service here to upload files and save data
    }
  }
}
