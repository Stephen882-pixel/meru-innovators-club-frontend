import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../core/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-reset-password-otp',
  standalone:true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './reset-password-otp.html',
  styleUrl: './reset-password-otp.scss'
})
export class ResetPasswordOtp implements OnInit{

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  otpForm = this.fb.group({
    email: ['',[Validators.required,Validators.email]],
    otp_code: ['',[Validators.required,Validators.minLength(6)]]
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if(params['email']){
        this.otpForm.patchValue({email:params['email']});
      }
    });
  }

  onSubmit() {
    if (this.otpForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.authService.verifyOtp(
        this.otpForm.value.email!,
        this.otpForm.value.otp_code!
      ).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = response.message;

          // Redirect to reset password page after successful verification
          setTimeout(() => {
            this.router.navigate(['/reset-password'], {
              queryParams: { email: this.otpForm.value.email }
            });
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'OTP verification failed. Please try again.';
        }
      });
    }
  }


}
