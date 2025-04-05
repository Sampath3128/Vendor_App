import { Component } from '@angular/core';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css']
})
export class VerifyOtpComponent {
  otp: string = '';
  verificationMessage: string | null = null;
  isVerified: boolean = false;

  verifyOtp() {
    console.log('Verifying OTP:', this.otp);

    // Simulating OTP verification
    if (this.otp === '123456') {
      this.isVerified = true;
      this.verificationMessage = 'OTP verified successfully!';
    } else {
      this.isVerified = false;
      this.verificationMessage = 'Invalid OTP. Please try again.';
    }
  }

  resendOtp() {
    console.log('Resending OTP...');
    this.verificationMessage = 'A new OTP has been sent to your registered mobile number.';
  }
}
