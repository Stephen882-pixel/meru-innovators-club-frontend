import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CommunitiesService, Community} from '../../core/services/communities.service';
import {AuthService} from '../../core/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-communities-list',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './communities-list.html',
  styleUrls:['./communities-list.scss']
})
export class CommunitiesList implements OnInit{

  private  communitiesService = inject(CommunitiesService);
  private authService = inject(AuthService);
  private router = inject(Router);

  communities: Community[] = [];
  filteredCommunities: Community[] = [];
  isLoading = true;
  searchTerm = '';
  recruitmentFilter = 'all';
  currentPage = 1;
  hasNextPage = false;
  hasPreviousPage = false;
  isAdmin = true; // static admin status for now

  ngOnInit() {
    this.loadCommunities();
  }

  loadCommunities(){
      this.isLoading = true;
      this.communitiesService.getCommunities(this.currentPage).subscribe({
        next: (response) => {
          this.communities = response.data.results;
          this.filteredCommunities = this.communities;
          this.hasNextPage = !!response.data.next;
          this.hasPreviousPage = !!response.data.previous;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading communities:',error);
          this.isLoading = false;
        }
      });
  }

  searchCommunities(){
    if(!this.searchTerm.trim()){
      this.filteredCommunities = this.communities;
    } else {
      this.filteredCommunities = this.communities.filter(community => {
        community.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        community.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      });
    }
  }


}
