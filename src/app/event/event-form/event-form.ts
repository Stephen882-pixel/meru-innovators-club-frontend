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



}
