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

  get sessions(){
    return this.communityForm.get('sessions') as FormArray;
  }

  addTechStack(){
    this.techStack.push(this.fb.control(''));
  }

  removeTechStack(index:number){
    this.techStack.removeAt(index);
  }

  addSocialMedia(){
    const socialGroup = this.fb.group({
      platform:['',Validators.required],
      url:['',Validators.required]
    });
    this.socialMedia.push(socialGroup);
  }

  removeSocialMedia(index: number) {
    this.socialMedia.removeAt(index);
  }

  addSession(){
    const sessionGroup = this.fb.group({
      day:['',Validators.required],
      start_time:['',Validators.required],
      end_time:['',Validators.required],
      meeting_type:['',Validators.required],
      location:['',Validators.required]
    });
    this.sessions.push(sessionGroup);
  }


  removeSession(index:number){
    this.sessions.removeAt(index);
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
          this.techStack.push(this.fb.control(tech));
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

  onSubmit(){
    if(this.communityForm.valid){
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formValue = this.communityForm.value;

      const communityData = {
        name:formValue.name,
        description:formValue.description,
        community_lead:parseInt(formValue.community_lead!),
        co_lead:parseInt(formValue.co_lead!),
        secretary:parseInt(formValue.secretary!),
        email:formValue.email,
        phone_number:formValue.phone_number,
        founding_date:formValue.founding_date,
        is_recruiting:formValue.is_recruiting,
        tech_stack: formValue.tech_stack?.filter(tech => tech.trim() !== ''),
        social_media:formValue.social_media?.filter(social => social.platform.trim() !== '' && social.url.trim() !==''),
        sessions: formValue.sessions?.filter(session =>
          session.day && session.start_time && session.end_time && session.meeting_type && session.location
        )
      };
      if(this.isEditMode && this.communityId){
        this.communitiesService.updateCommunity(this.communityId,communityData).subscribe({
          next : (response) => {
            this.isSubmitting = false;
            this.successMessage = response.message;
            setTimeout(() => {
              this.router.navigate(['/communities',this.communityId]);
            },2000)
          },
          error : (error) => {
            this.isSubmitting = false;
            this.errorMessage = error.error?.message || 'Failed to update community. Please try again.';
          }
        });
      } else {
        this.communitiesService.createCommunity(communityData).subscribe({
          next : (response) => {
            this.isSubmitting = false;
            this.successMessage = response.message;
            setTimeout(() => {
              this.router.navigate(['/communities',response.data.id]);
            },2000)
          },
          error : (error) => {
            this.isSubmitting = false;
            this.errorMessage = error.error?.message || 'Failed to create community. Please try again.';
          }
        });
      }
    }
  }

  cancel(){
    if(this.isEditMode && this.communityId){
      this.router.navigate(['/communities',this.communityId]);
    } else {
      this.router.navigate(['/communities']);
    }
  }

  navigateToCommunities(){
    this.router.navigate(['/communities']);
  }


  navigateToClub(){
    this.router.navigate(['/club']);
  }

}
