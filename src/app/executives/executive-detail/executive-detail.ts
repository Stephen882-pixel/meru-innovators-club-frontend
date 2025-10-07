import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CommunitiesService, Executive} from '../../core/services/communities.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-executive-detail',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './executive-detail.html',
  styleUrls:['./executive-detail.scss']
})
export class ExecutiveDetail implements OnInit{
  private communitiesService = inject(CommunitiesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  executive: Executive | null = null;
  isLoading = true;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const executiveId = +params['id'];
      this.loadExecutiveDetails(executiveId);
    });
  }

  loadExecutiveDetails(executiveId: number) {
    this.isLoading = true;
    this.communitiesService.getExecutiveById(executiveId).subscribe({
      next: (response) => {
        this.executive = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading executive details:', error);
        this.isLoading = false;
      }
    });
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  formatPosition(position: string): string {
    const positionMap: { [key: string]: string } = {
      'LEAD': 'Community Lead',
      'CO_LEAD': 'Co-Lead',
      'SECRETARY': 'Secretary'
    };
    return positionMap[position] || position;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

}
