import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {Club, CommunitiesService} from '../../core/services/communities.service';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-club-details',
  standalone:true,
  imports: [CommonModule,RouterLink],
  templateUrl: './club-details.html',
  styleUrls:['./club-details.scss']
})
export class ClubDetails implements OnInit{

  private communityService = inject(CommunitiesService);
  private authService = inject(AuthService);
  private router = inject(Router);

  club: Club | null = null;
  isLoading = true
  isAdmin = true; // static admin status for now

  ngOnInit() {
    this.loadClubDetails();
  }

  loadClubDetails(){
    this.isLoading = true;
    this.communityService.getClub().subscribe({
      next: (response) => {
        this.club = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading club details:',error);
        this.isLoading = false;
      }
    });
  }

  getPlatformInitial(platform:string):string {
    return platform.charAt(0).toUpperCase();
  }

  viewCommunity(communityId:number){
    this.router.navigate(['/communities',communityId]);
  }

  joinCommunity(communityId:number){
    this.router.navigate(['/communities',communityId,'join']);
  }


}
