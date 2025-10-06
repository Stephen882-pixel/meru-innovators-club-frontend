import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CommunitiesService} from '../../core/services/communities.service';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-community-form',
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './community-form.html',
  styleUrls: ['./community-form.scss']
})
export class CommunityForm {

  private fb = inject(FormBuilder);
  private communitiesService = inject(CommunitiesService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = false;
  communityId:number | null = null;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  communityForm = this.fb.group({
    name:['',Validators.required],
    description:['',Validators.required],
    community_lead:['',Validators.required],
    co_lead:['',Validators.required],
    secretary:['',Validators.required],
    email:['',[Validators.required,Validators.email]],
    phone_number:[''],
    founding_date:['',Validators.required],
    is_recruiting:[true],
    tech_stack:this.fb.array([]),
    social_media:this.fb.array([]),
    sessions:this.fb.array([])
  });

}
