import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-verify-otp',
  standalone:true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './verify-otp.html',
  styleUrls: ['./verify-otp.scss']
})
export class VerifyOtp implements OnInit {

  private fb = inject(FormBuilder)
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

  ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        if(params['email']){
          this.otpForm.patchValue({email:params['email']});
        }
      });
  }

  onSubmit(){
    if(this.otpForm.valid){
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

          setTimeout(() => {
            this.router.navigate(['/login']);
          },2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'OTP Verfication failed. Please try again.';
        }
      });
    }
  }

}
