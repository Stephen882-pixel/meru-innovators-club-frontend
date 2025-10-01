import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormArray, FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService, User} from '../../core/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile-edit',
  standalone:true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './profile-edit.html',
  styleUrls: ['./profile-edit.scss']
})
export class ProfileEdit  implements OnInit{

  private fb = inject(FormBuilder)
  private  authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  user : User | null = null;

  profileForm = this.fb.group({
    first_name:['',Validators.required],
    last_name:['',Validators.required],
    email:['',[Validators.required,Validators.email]],
    username:['',Validators.required],
    course:['',Validators.required],
    registration_no:[''],
    bio:[''],
    year_of_study:[null],
    graduation_year:[null],
    tech_stacks:this.fb.array([]),
    skills:this.fb.array([]),
    github:[''],
    linkedIn:[''],
    twitter:[''],
    projects:this.fb.array([])
  });

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      if(user){
        this.populateForm(user);
      }
    });
    if(!this.user){
      this.authService.getUserData().subscribe({
        next: (response) => {
          this.user = response.data;
          this.populateForm(response.data);
        }
      });
    }
  }

  get techStacks() {
    return this.profileForm.get('tech_stacks') as FormArray;
  }

  get skills() {
    return this.profileForm.get('skills') as FormArray;
  }

  get projects() {
    return this.profileForm.get('projects') as FormArray;
  }

  getProjectTechnologies(projectIndex: number): FormArray {
    return this.projects.at(projectIndex).get('technologies') as FormArray;
  }

  addTechStack() {
    this.techStacks.push(this.fb.control(''));
  }

  removeTechStacks(index:number){
    this.techStacks.removeAt(index);
  }

  addSkill(){
    this.skills.push(this.fb.control(''));
  }

  removeSkill(index:number){
    this.skills.removeAt(index);
  }

  addProject(){
    const projectGroup = this.fb.group({
      name: ['',Validators.required],
      description:[''],
      link:[''],
      technologies:this.fb.array([])
    });
    this.projects.push(projectGroup);
  }

  removeProject(index:number){
    this.projects.removeAt(index);
  }

  addProjectTechnology(projectIndex:number){
    this.getProjectTechnologies(projectIndex).push(this.fb.control(''));
  }


}
