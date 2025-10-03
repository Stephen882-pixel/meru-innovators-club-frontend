import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {EventsService, MusicEvent} from '../../core/services/events.service';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-event-details',
  standalone:true,
  imports: [CommonModule,RouterLink],
  templateUrl: './event-details.html',
  styleUrls: ['./event-details.scss']
})
export class EventDetails implements  OnInit{

  private eventService = inject(EventsService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  event: MusicEvent | null = null;
  isLoading = true;
  isAdmin = false;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const eventId = +params['id'];
      this.loadEventDetails(eventId);
    });
    this.checkAdminStatus();
  }

  loadEventDetails(eventId:number){
    this.isLoading = true;
    this.eventService.getEventById(eventId).subscribe({
      next: (response) => {
        this.event = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading event details:',error);
      }
    });
  }

  checkAdminStatus(){
    this.authService.currentUser$.subscribe(user => {
      this.isAdmin = true; // Implement proper admin check
    });
  }


}
