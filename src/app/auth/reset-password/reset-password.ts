import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import {AuthService} from '../../core/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';


function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('new_password');
  const confirmPassword = control.get('confirm_password');

  if(password && confirmPassword && password.value !== confirmPassword.value){
    return {
      passwordMismatch : true
    };
  }
  return null;
}

@Component({
  selector: 'app-reset-password',
  standalone:true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPassword implements OnInit{

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  resetPasswordForm = this.fb.group({
    email: ['',[Validators.required,Validators.email]],
    new_password:['',Validators.required],
    confirm_password:['',Validators.required]
  },{validators: passwordMatchValidator });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if(params['email']) {
        this.resetPasswordForm.patchValue({email:params['email']});
      }
    });
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.authService.resetPassword(
        this.resetPasswordForm.value.email!,
        this.resetPasswordForm.value.new_password!
      ).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = response.message;

          // Redirect to login after successful password reset
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Password reset failed. Please try again.';
        }
      });
    }
  }

}
