import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CommunitiesService, Community} from '../../core/services/communities.service';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-community-join',
  standalone:true,
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './community-join.html',
  styleUrls: ['./community-join.scss']
})
export class CommunityJoin {

  private fb = inject(FormBuilder);
  private communitiesService = inject(CommunitiesService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  community: Community | null = null;
  isLoading = true;
  isSubmitting = false;
  joinMessage = '';
  errorMessage = '';

  joinForm = this.fb.group({
    name:['',Validators.required],
    email:['',[Validators.required,Validators.email]]
  });


}
