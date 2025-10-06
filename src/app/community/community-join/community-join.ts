import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CommunitiesService, Community} from '../../core/services/communities.service';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-community-join',
  standalone:true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './community-join.html',
  styleUrls: ['./community-join.scss']
})
export class CommunityJoin implements OnInit{

  private fb = inject(FormBuilder);
  private communitiesService = inject(CommunitiesService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  community: Community | null = null;
  isLoading = true;
  isSubmitting = false;
  joinSuccess = false;
  errorMessage = '';


  joinForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  ngOnInit() {
    this.route.params.subscribe(params => {
      const communityId = +params['id'];
      this.loadCommunityDetails(communityId);
    });

    // Pre-fill user data if available
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.joinForm.patchValue({
          name: `${user.first_name} ${user.last_name}`,
          email: user.email
        });
      }
    });
  }

  loadCommunityDetails(communityId: number) {
    this.isLoading = true;
    this.communitiesService.getCommunityById(communityId).subscribe({
      next: (response) => {
        this.community = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading community details:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.joinForm.valid && this.community) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const {name, email} = this.joinForm.value;
      this.communitiesService.joinCommunity(this.community.id,{name:name ?? '', email: email ?? ''}).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.joinSuccess = true;
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.error?.message || 'Failed to join community. Please try again.';
        }
      });
    }
  }

  formatDate(dateString:string):string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US',{
      year:'numeric',
      month:'long',
      day:'numeric'
    });
  }



}
