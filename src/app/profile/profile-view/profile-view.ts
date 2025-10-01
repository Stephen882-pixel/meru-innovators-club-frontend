import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthService, User} from '../../core/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile-view',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './profile-view.html',
  styleUrls: ['./profile-view.scss']
})
export class ProfileView implements  OnInit{

  private authService = inject(AuthService);
  private router = inject(Router);

  user: User | null = null;

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });

    // Load user data if not already loaded
    if (!this.user) {
      this.authService.getUserData().subscribe();
    }
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  navigateToEditProfile() {
    this.router.navigate(['/profile-edit']);
  }

  changePassword() {
    this.router.navigate(['/change-password']);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });
  }

}
