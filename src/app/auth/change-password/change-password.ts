import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import {AuthService} from '../../core/services/auth.service';
import {Router} from '@angular/router';


function passwordMatchValidator(control:AbstractControl): ValidationErrors | null  {
  const newPassword = control.get('new_password')
  const confirmPassword = control.get('confirm_password')

  if(newPassword && confirmPassword && newPassword.value !== confirmPassword.value){
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-change-password',
  standalone:true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.scss']
})
export class ChangePassword {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showEmailVerification = false;

  changePasswordForm = this.fb.group({
    old_password:['',Validators.required],
    new_password:['',Validators.required],
    confirm_password:['',Validators.required],
  },{validators : passwordMatchValidator});

  onSubmit(){
    if(this.changePasswordForm.valid){
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      this.showEmailVerification = false;

      const passwordData = {
        old_password:this.changePasswordForm.value.old_password!,
        new_password:this.changePasswordForm.value.new_password!,
        confirm_password: this.changePasswordForm.value.confirm_password!
      };
      this.authService.changePassword(passwordData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = response.message;
          this.showEmailVerification = response.status === 'Pending';

          if(response.status === 'Pending'){
            this.changePasswordForm.reset();
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to change password. Please try again.';
        }
      });
    }
  }

  cancel(){
    this.router.navigate(['/profile']);
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

}
