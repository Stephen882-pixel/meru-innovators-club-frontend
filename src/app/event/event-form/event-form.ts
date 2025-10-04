import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CATEGORY_CHOICES, CategoryChoice, EventsService} from '../../core/services/events.service';
import {AuthService} from '../../core/services/auth.service';
import {data} from 'autoprefixer';

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


  private loadEventData(id:number):void{
    this.eventService.getEventById(id).subscribe({
      next: (response) => {
        const event = response.data;
        this.eventForm.patchValue({
          name:event.name,
          category:event.category,
          title:event.title,
          description:event.description,
          date:this.eventService.formatDateForInput(event.date),
          location:event.location,
          organizer:event.organizer,
          contact_email:event.contact_email,
          is_virtual:event.is_virtual
        });
      },
      error: (error) => {
        this.errorMessage = 'Failed to load event data.';
        console.error('Error loading events:',data);
      }
    });
  }

  onSubmit():void{
    if(this.eventForm.valid){
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formValue = this.eventForm.value;
      const eventData = {
        name:formValue.name.trim(),
        category:formValue.category,
        title:formValue.title.trim(),
        description:formValue.description.trim(),
        date:this.eventService.formatDateForBackend(formValue.date),
        location:formValue.location.trim(),
        organizer:formValue.organizer.trim(),
        contact_email:formValue.contact_email.trim(),
        is_virtual:formValue.is_virtual === true
      };
      if(this.isEditMode && this.eventId){
        this.updateEvent(eventData);
      } else{
        this.createEvent(eventData);
      }
    } else {
      this.markFormAsTouched();
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }

  private createEvent(eventData:any):void{
    this.eventService.addEvent(eventData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.successMessage = response.message;
        setTimeout(() => {
          this.router.navigate(['events-list',response.data.id]);
        },2000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Failed to create event. Please try again.';
        console.log('Error creating event',error);
      }
    });
  }

  private updateEvent(eventData:any):void{
    this.eventService.updateEvent(this.eventId!, eventData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.successMessage = response.message;
        setTimeout(() => {
          this.router.navigate(['events-list',this.eventId]);
        },2000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Failed to update event. Please try again.';
        console.error('Error updating event:',error);
      }
    });
  }

  private markFormAsTouched():void{
    Object.keys(this.eventForm.controls).forEach(key => {
      this.eventForm.get(key)?.markAsTouched();
    });
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
