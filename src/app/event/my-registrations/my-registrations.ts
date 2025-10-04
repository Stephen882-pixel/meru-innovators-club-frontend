import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {EventRegistration, EventsService} from '../../core/services/events.service';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-my-registrations',
  standalone:true,
  imports: [CommonModule,RouterLink],
  templateUrl: './my-registrations.html',
  styleUrls: ['./my-registrations.scss']
})
export class MyRegistrations implements OnInit{

  private eventService = inject(EventsService);
  private authService = inject(AuthService);
  private router = inject(Router);

  registrations: EventRegistration[] = [];
  eventsMap: Map<number, Event> = new Map();
  isLoading = true;

  ngOnInit() {
    this.loadMyRegistrations();
  }

  loadMyRegistrations(){
    this.isLoading = true;
    this.eventService.getMyRegistrations().subscribe({
      next: (response) => {
        this.registrations = response.data;
        this.loadEventDetails();
      },
      error: (error) => {
        console.error('Error loading registrations:',error);
        this.isLoading = false;

        this.authService.currentUser$.subscribe(user => {
          if(user){
            this.eventService.getUserRegistrations(user.email).subscribe({
              next: (response) => {
                this.registrations = response.data;
                this.loadEventDetails();
              },
              error: (error) => {
                console.error('Error loading user registrations:',error);
                this.isLoading = false;
              }
            });
          }
        });
      }
    });
  }



}
