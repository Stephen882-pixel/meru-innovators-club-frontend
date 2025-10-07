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

}
