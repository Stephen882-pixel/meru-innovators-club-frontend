import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone:true,
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss']
})
export class ForgotPassword {

    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private  router = inject(Router);

    isLoading = false;
    errorMessage = '';
    successMessage = '';

    forgotPasswordForm = this.fb.group({
      email:['',[Validators.required,Validators.email]]
    });

    onSubmit(){
      if(this.forgotPasswordForm.valid){
        this.isLoading = true;
        this.errorMessage = '';
        this.successMessage = '';

        this.authService.requestPasswordReset(this.forgotPasswordForm.value.email!).subscribe({
          next: (response) => {
            this.isLoading = false;
            this.successMessage = response.message;

            setTimeout(() => {
              this.router.navigate(['/reset-password-otp'],{
                queryParams: {email:this.forgotPasswordForm.value.email}
              });
            },2000)
          },
          error:(error) => {
            this.isLoading = false;
            this.errorMessage = error.error?.message || 'Failed to send OTP. Please try again'
          }
        });
      }
    }

}
