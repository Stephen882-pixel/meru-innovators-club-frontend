import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {EventRegistration, EventsService, MusicEvent} from '../../core/services/events.service';
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
  eventsMap: Map<number, MusicEvent> = new Map();
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

  loadEventDetails() {
    const eventIds = [...new Set(this.registrations.map(r => r.event))];

    eventIds.forEach(eventId => {
      this.eventService.getEventById(eventId).subscribe({
        next: (response) => {
          this.eventsMap.set(eventId, response.data);
        },
        error: (error) => {
          console.error('Error loading event details:', error);
        }
      });
    });

    this.isLoading = false;
  }

  getEventName(eventId: number): string {
    const event = this.eventsMap.get(eventId);
    return event ? event.name : `Event #${eventId}`;
  }

  viewEventDetails(eventId:number){
    this.router.navigate(['/event-details/:id']);
  }

  downloadTicket(registration:EventRegistration){
    const ticketContent = `
    MUSIC CLUB - EVENT TICKET
    =========================

    Event: ${this.getEventName(registration.event)}
    Ticket Number: ${registration.ticket_number}
    Name: ${registration.full_name}
    Email: ${registration.email}
    Course: ${registration.course}
    Year: ${registration.educational_level}
    Phone: ${registration.phone_number}
    Registered: ${this.formatDate(registration.registration_timestamp)}

    Please present this ticket at the event venue.
    `.trim();

    const blob = new Blob([ticketContent],{type:'text/plain'});
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ticket-${registration.ticket_number}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  }


}
