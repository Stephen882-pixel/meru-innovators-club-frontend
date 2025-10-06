import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CommunitiesService, Community} from '../../core/services/communities.service';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-community-details',
  standalone:true,
  imports: [CommonModule,RouterLink],
  templateUrl: './community-details.html',
  styleUrls: ['./community-details.scss']
})
export class CommunityDetails implements  OnInit{

  private communitiesService = inject(CommunitiesService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  community: Community | null = null;
  isLoading = true;
  isAdmin = true; // Static admin status for now

  ngOnInit() {
    this.route.params.subscribe(params => {
      const communityId = +params['id'];
      this.loadCommunityDetails(communityId);
    });
  }

  loadCommunityDetails(communityId:number){
    this.isLoading = true;
    this.communitiesService.getCommunityById(communityId).subscribe({
      next: (response) => {
        this.community = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading community details:',error);
        this.isLoading = false;
      }
    });
  }

  formatDate(dateString:string):string{
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US',{
      year:'numeric',
      month:'long',
      day:'numeric'
    });
  }

  getPlatformInitial(platform: string): string {
    return platform.charAt(0).toUpperCase();
  }

  joinCommunity() {
    if (this.community) {
      this.router.navigate(['/communities', this.community.id, 'join']);
    }
  }

  editCommuity(){
    if(this.community){
      this.router.navigate(['/communities',this.community.id,'edit']);
    }
  }

  viewMembers(){
    if(this.community){
      this.router.navigate(['/communities',this.community.id,'members']);
    }
  }



}
