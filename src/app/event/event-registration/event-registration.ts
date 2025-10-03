import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {EventsService, MusicEvent} from '../../core/services/events.service';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-event-registration',
  standalone:true,
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './event-registration.html',
  styleUrl: './event-registration.scss'
})
export class EventRegistration implements OnInit{

  private fb = inject(FormBuilder);
  private eventService = inject(EventsService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  event: MusicEvent | null = null;
  registrationData: any = null;
  isLoading = true;
  isSubmitting = false;
  registrationSuccess = false;
  errorMessage = '';

  registrationForm = this.fb.group({
    full_name:['',Validators.required],
    email:['',[Validators.required,Validators.email]],
    course:['',Validators.required],
    educational_level:['',Validators.required],
    phone_number:['',Validators.required],
    expectations:['',Validators.required]
  });


  ngOnInit() {
    this.route.params.subscribe(params => {
      const eventId = +params['id'];
      this.loadEventDetails(eventId);
    });

    this.authService.currentUser$.subscribe(user => {
      if(user){
        this.registrationForm.patchValue({
          full_name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          course:user.course
        });
      }
    });
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
        this.isLoading = false;
      }
    });
  }



}
