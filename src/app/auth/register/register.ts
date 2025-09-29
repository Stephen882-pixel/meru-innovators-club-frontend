import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    isLoading = false;
    errorMessage = '';
    successMessage = '';

    registerForm = this.fb.group({
        firstname: ['',Validators.required],
        lastname: ['',Validators.required],
        email: ['', [Validators.required, Validators.email]],
        username: ['',Validators.required],
        password: ['',Validators.required],
        couse: ['', Validators.required]
    });

    onSubmit(){
      if(this.registerForm.valid){
        this.isLoading = true;
        this.errorMessage = '';
        this.successMessage = '';

        this.authService.register(this.registerForm.value).subscribe({
          next: (response) => {
            this.isLoading = false;
            this.successMessage = response.message;

            this.router.navigate(['/verify-otp'],{
              queryParams: {email:this.registerForm.value.email}
            });
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.error?.message || 'Registration Failed. Please try again.';
          }
        });
      }
    }

}
