import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {CommunitiesService, Executive} from '../../core/services/communities.service';

@Component({
  selector: 'app-executives-list',
  standalone:true,
  imports: [CommonModule,RouterLink],
  templateUrl: './executives-list.html',
  styleUrls:['./executives-list.scss']
})
export class ExecutivesList implements OnInit{
  private communitiesService = inject(CommunitiesService);
  private router = inject(Router);

  executives: Executive[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadExecutives();
  }

  loadExecutives(){
    this.isLoading = true;
    this.communitiesService.getExecutives().subscribe({
      next : (response) => {
        this.executives = response.data;
        this.isLoading = false;
      },
      error : (error) => {
        console.error('Error loading executives:',error);
        this.isLoading = false;
      }
    });
  }

  getExecutivesByPosition(position:string): Executive[] {
    return this.executives.filter(exec => exec.position === position);
  }

  getInitials(firstName:string,lastName:string):string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
  formatPosition(position:string):string{
    const positionMap: {[key:string]:string} = {
      'LEAD':'Community Lead',
      'CO_LEAD':'Co-Lead',
      'SECRETARY':'Secretary'
    };
    return positionMap[position] || position;
  }

}
