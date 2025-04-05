import { Component } from '@angular/core';

@Component({
  selector: 'app-validate-bank',
  templateUrl: './validate-bank.component.html',
  styleUrls: ['./validate-bank.component.css']
})
export class ValidateBankComponent {
  bankDetails = {
    accountNumber: '',
    routingNumber: '',
    accountHolderName: ''
  };

  validationResult: { status: string, message: string } | null = null;

  validateBank() {
    console.log('Validating bank details...', this.bankDetails);

    // Simulating API call
    setTimeout(() => {
      if (this.bankDetails.accountNumber.startsWith('123')) {
        this.validationResult = { status: 'Valid', message: 'Bank details are verified successfully.' };
      } else {
        this.validationResult = { status: 'Invalid', message: 'Bank details could not be verified.' };
      }
    }, 1000);
  }
}
