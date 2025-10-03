import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {EventsService} from '../../core/services/events.service';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-event-form',
  standalone:true,
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './event-form.html',
  styleUrls: ['./event-form.scss']
})
export class EventForm  implements  OnInit{

  private fb = inject(FormBuilder);
  private eventService = inject(EventsService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = false;
  eventId: number | null = null;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  eventForm = this.fb.group({
    name:['',Validators.required],
    category:['',Validators.required],
    title:['',Validators.required],
    description:['',Validators.required],
    date:['',Validators.required],
    location:['',Validators.required],
    organizer:['',Validators.required],
    contact_email: ['', [Validators.required, Validators.email]],
    is_virtual:[false]
  });

  ngOnInit() {
    this.route.params.subscribe(params => {
      if(params['id']){
        this.isEditMode = true;
        this.eventId = +params['id'];
        this.loadEventForEdit(this.eventId);
      }
    });
  }

  loadEventForEdit(eventId:number){
    this.eventService.getEventById(eventId).subscribe({
      next: (response) => {
        const event = response.data;
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toISOString().slice(0,16);

        this.eventForm.patchValue({
          ...event,
          date: formattedDate,
          is_virtual: event.is_virtual
        });
      },
      error: (error) => {
        console.error('Error loading event for edit:',error);
        this.errorMessage = 'Failed to load event details.';
      }
    });
  }

  onSubmit(){
    if(this.eventForm.valid){
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      // Send as JSON object instead of FormData
      const eventData = {
        ...this.eventForm.value,
        is_virtual: this.eventForm.value.is_virtual === true // Ensure it's a boolean
      };

      if(this.isEditMode && this.eventId){
        this.eventService.updateEvent(this.eventId, eventData).subscribe({
          next: (response) => {
            this.isSubmitting = false;
            this.successMessage = response.message;
            setTimeout(() => {
              this.router.navigate(['/events', this.eventId]);
            }, 2000)
          },
          error: (error) => {
            this.isSubmitting = false;
            this.errorMessage = error.error?.message || 'Failed to update event. Please try again.';
          }
        });
      } else {
        this.eventService.addEvent(eventData).subscribe({
          next: (response) => {
            this.isSubmitting = false;
            this.successMessage = response.message;
            setTimeout(() => {
              this.router.navigate(['/events', response.data.id]);
            }, 2000)
          },
          error: (error) => {
            this.isSubmitting = false;
            this.errorMessage = error.error?.message || 'Failed to create event. Please try again.';
          }
        });
      }
    }
  }

  cancel() {
    if (this.isEditMode && this.eventId) {
      this.router.navigate(['/events', this.eventId]);
    } else {
      this.router.navigate(['/events']);
    }
  }

  navigateToEvents() {
    this.router.navigate(['/events']);
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }



}
