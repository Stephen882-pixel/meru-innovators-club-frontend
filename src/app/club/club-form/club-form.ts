import {Component, inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink, RouterLinkWithHref} from '@angular/router';
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
  private router = inject(Router);

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

  get socialMedia(){
    return this.clubForm.get('social_media') as FormArray;
  }

  addSocialMedia(){
    const socialGroup = this.fb.group({
      platform:['',Validators.required],
      url: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
    this.socialMedia.push(socialGroup);
  }

  removeSocialMedia(index:number){
    this.socialMedia.removeAt(index);
  }

  loadExistingClub(){
    this.communitiesService.getClub().subscribe({
      next: (response) => {
        this.existingClub = response.data;
        this.isEditMode = true;
        this.populateForm();
      },
      error: (error) => {
        this.isEditMode = false;
      }
    });
  }

  populateForm(){
    if(this.existingClub){
      this.clubForm.patchValue({
        name:this.existingClub.name,
        about_us: this.existingClub.about_us,
        vision:this.existingClub.vision,
        mission: this.existingClub.mission
      });

      while(this.socialMedia.length) this.socialMedia.removeAt(0);

      this.existingClub.social_media.forEach(social => {
        const socialGroup = this.fb.group({
          platForm:[social.platform,Validators.required],
          url:[social.url,[Validators.required,Validators.pattern('https?://.+')]]
        });
        this.socialMedia.push(socialGroup);
      });
    }
  }

  onSubmit(){
    if(this.clubForm.valid){
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formValue = this.clubForm.value;

      const clubData = {
        name:formValue.name,
        about_us:formValue.about_us,
        vision:formValue.vision,
        mission:formValue.mission,
        social_media:formValue.social_media?.filter(social =>
        social.platform.trim() !== '' && social.url.trim() !== ''
        )
      };

      if(this.isEditMode){
        this.communitiesService.updateClub(clubData).subscribe({
          next : (response) => {
            this.isSubmitting = false;
            this.successMessage = response.message;
            setTimeout(() => {
                this.router.navigate(['/club']);
            },2000);
          },
          error : (error) => {
            this.isSubmitting = false;
            this.errorMessage = error.error?.message || 'Failed to update club. Please try again';
          }
        });
      } else {
        this.communitiesService.createClub(clubData).subscribe({
          next: (response) => {
            this.isSubmitting = false;
            this.successMessage = response.message;
            setTimeout(() => {
                this.router.navigate(['/club']);
            },2000);
          },
          error: (error) => {
            this.isSubmitting = false;
            this.errorMessage = error.error?.message || 'Failed to create club. Please try again';
          }
        });
      }
    }
  }

  cancel(){
    this.router.navigate(['/club']);
  }


  navigateToClub(){
    this.router.navigate(['/club']);
  }


}
