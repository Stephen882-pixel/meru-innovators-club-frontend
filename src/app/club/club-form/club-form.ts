import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterLink, RouterLinkWithHref} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Club, CommunitiesService} from '../../core/services/communities.service';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-club-form',
  standalone:true,
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './club-form.html',
  styleUrls:['./club-form.scss']
})
export class ClubForm implements OnInit{
  private fb = inject(FormBuilder);
  private communitiesService = inject(CommunitiesService);
  private authService = inject(AuthService);
  private router = inject(RouterLinkWithHref);

  isEditMode = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  existingClub: Club | null = null;

  clubForm = this.fb.group({
    name:['',Validators.required],
    about_us:['',Validators.required],
    vision:['',Validators.required],
    mission:['',Validators.required],
    social_media:this.fb.array([])
  });

  ngOnInit() {
    this.loadExistingClub();
  }


}
