import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService, User } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {


  private authService = inject(AuthService);
  private router = inject(Router);

  user: User | null = null;

  ngOnInit(): void {
      this.authService.currentUser$.subscribe(user => {
        this.user = user;
      });

      if(!this.user){
        this.authService.getUserData().subscribe();
      }
  }

  navigateToProfile(){
    this.router.navigate(['/profile']);
  }

  navigateToEvents(){
    this.router.navigate(['/events-list']);
  }



  logout(){
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
