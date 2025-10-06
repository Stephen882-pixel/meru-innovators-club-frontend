import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormArray, FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CommunitiesService} from '../../core/services/communities.service';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-community-form',
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './community-form.html',
  styleUrls: ['./community-form.scss']
})
export class CommunityForm implements OnInit{

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

  ngOnInit() {
    this.route.params.subscribe(params => {
      if(params['id']){
        this.isEditMode = true;
        this.communityId = +params['id'];
        this.loadCommunityForEdit(this.communityId);
      }
    });
  }

  get techStack(){
      return this.communityForm.get('tech_stack') as FormArray;
  }

  get socialMedia(){
    return this.communityForm.get('social_media') as FormArray;
  }



  loadCommunityForEdit(communityId:number){
    this.communitiesService.getCommunityById(communityId).subscribe({
      next: (response) => {
        const community = response.data;

        while (this.techStack.length) this.techStack.removeAt(0);
        while (this.socialMedia.length) this.socialMedia.removeAt(0);
        while (this.sessions.length) this.sessions.removeAt(0);

        this.communityForm.patchValue({
          name:community.name,
          description:community.description,
          community_lead:community.community_lead_details.id.toString(),
          co_lead: community.co_lead_details.id.toString(),
          secretary: community.secretary_details.id.toString(),
          email: community.email,
          phone_number: community.phone_number,
          founding_date: community.founding_date,
          is_recruiting: community.is_recruiting
        });

        community.tech_stack.forEach(tech => {
          tech.techStack.push(this.fb.control(tech));
        });

        community.social_media.forEach(social => {
          const socialGroup = this.fb.group({
            platform:[social.platform,Validators.required],
            url:[social.url,Validators.required]
          });
          this.socialMedia.push(socialGroup);
        });

        community.sessions.forEach(session => {
          const sessionGroup = this.fb.group({
            day:[session.day,Validators.required],
            start_time:[session.start_time,Validators.required],
            end_time:[session.end_time,Validators.required],
            meeting_type:[session.meeting_type,Validators.required],
            location:[session.location,Validators.required]
          });
          this.sessions.push(sessionGroup);
        });
      },
      error: (error) => {
        console.error('Error loading community for edit:',error);
        this.errorMessage = 'Failed to load community details.';
      }
    });
  }

}
