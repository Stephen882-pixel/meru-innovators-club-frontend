import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CATEGORY_CHOICES, CategoryChoice, EventsService} from '../../core/services/events.service';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-event-form',
  standalone:true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './event-form.html',
  styleUrls: ['./event-form.scss']
})
export class EventForm  implements  OnInit{

  private fb = inject(FormBuilder);
  private eventService = inject(EventsService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  eventForm!:FormGroup;
  isEditMode = false;
  eventId: number | null = null;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  categoryChoices: CategoryChoice[] = CATEGORY_CHOICES;

  // eventForm = this.fb.group({
  //   name:['',Validators.required],
  //   category:['',Validators.required],
  //   title:['',Validators.required],
  //   description:['',Validators.required],
  //   date:['',Validators.required],
  //   location:['',Validators.required],
  //   organizer:['',Validators.required],
  //   contact_email: ['', [Validators.required, Validators.email]],
  //   is_virtual:[false]
  // });

  // ngOnInit() {
  //   this.route.params.subscribe(params => {
  //     if(params['id']){
  //       this.isEditMode = true;
  //       this.eventId = +params['id'];
  //       this.loadEventForEdit(this.eventId);
  //     }
  //   });
  // }
  ngOnInit() {
    this.initializeForm();
    this.checkEditMode();
  }

  private initializeForm():void{
    this.eventForm = this.fb.group({
      name:['',[Validators.required,Validators.maxLength(100)]],
      category:['',Validators.required],
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', Validators.required],
      date: ['', Validators.required],
      location: ['', [Validators.required, Validators.maxLength(255)]],
      organizer: ['', [Validators.required, Validators.maxLength(100)]],
      contact_email: ['', [Validators.required, Validators.email]],
      is_virtual: [false]
    });
  }

  private checkEditMode():void{
    this.route.params.subscribe(params => {
      if(params['id']){
        this.isEditMode = true;
        this.eventId = +params['id'];
        this.loadEventData(this.eventId);
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

 // on-submit

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
