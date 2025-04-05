import { Component } from '@angular/core';

@Component({
  selector: 'app-upload-docs',
  templateUrl: './upload-docs.component.html',
  styleUrls: ['./upload-docs.component.css']
})
export class UploadDocsComponent {
  complianceDocs: { [key: string]: any } = {
    w9Form: null,
    businessLicense: null,
    vendorAgreement: null,
    agreedToTerms: false
  };

  onFileSelect(event: any, docType: string) {
    if (event.target.files.length > 0) {
      this.complianceDocs[docType] = event.target.files[0];
      console.log(`${docType} uploaded:`, this.complianceDocs[docType]);
    }
  }

  onSubmit() {
    if (!this.complianceDocs['agreedToTerms']) {
      alert('You must agree to the terms before submitting.');
      return;
    }

    console.log('Compliance documents submitted:', this.complianceDocs);
    alert('Compliance documents submitted successfully!');
  }
}
