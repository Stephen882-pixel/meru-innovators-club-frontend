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
    //year_of_study:[null],
    graduation_year:[''],
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

  removeProjectTechnology(projectIndex: number, techIndex: number) {
    this.getProjectTechnologies(projectIndex).removeAt(techIndex);
  }

  populateForm(user: User) {
    this.profileForm.patchValue({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      username: user.username,
      course: user.course,
      registration_no: user.registration_no,
      bio: user.bio,
      //year_of_study: user.year_of_study,
      graduation_year: user.graduation_year,
      github: user.social_media?.github || '',
      linkedIn: user.social_media?.linkedIn || '',
      twitter: user.social_media?.twitter || ''
    });

    while(this.techStacks.length) this.techStacks.removeAt(0);
    while (this.skills.length) this.skills.removeAt(0);
    while (this.projects.length) this.projects.removeAt(0);


    user.tech_stacks?.forEach(tech => {
      this.techStacks.push(this.fb.control(tech));
    });

    user.skills?.forEach(skill => {
      this.skills.push(this.fb.control(skill));
    });

    user.projects?.forEach(project => {
      const projectGroup = this.fb.group({
        name: [project.name, Validators.required],
        description: [project.description],
        link: [project.link],
        technologies: this.fb.array([])
      });

      const technologiesArray = projectGroup.get('technologies') as FormArray;
      project.technologies?.forEach((tech: any) => {
        technologiesArray.push(this.fb.control(tech));
      });

      this.projects.push(projectGroup);
    });
  }

  onSubmit(){
    if(this.profileForm.valid){
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formValue = this.profileForm.value;

      const updateData = {
        first_name: formValue.first_name,
        last_name: formValue.last_name,
        email : formValue.email,
        username : formValue.username,
        course : formValue.course,
        registration_no: formValue.registration_no,
        bio : formValue.bio,
        graduation_year : formValue.graduation_year,
        tech_stacks : formValue.tech_stacks?.filter(tech => tech.trim() !== ''),
        skills : formValue.skills?.filter(skill => skill.trim() !== ''),
        social_media : {
          github:formValue.github,
          linkedIn : formValue.linkedIn,
          twitter : formValue.twitter
        },
        projects : formValue.projects?.map(project => ({
          name:project.name,
          description: project.description,
          link:project.link,
          technologies: project.technologies?.filter(tech => tech.trim() !== '')
        })).filter(project => project.name.trim() !== '')
      };

      this.authService.updateUserProfile(updateData).subscribe({
        next:(response) => {
          this.isLoading = false;
          this.successMessage = response.message;

          setTimeout(() => {
            this.router.navigate(['/profile']);
          },2000)
        },
        error:(error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to update profile. Please try again.';
        }
      });
    }
  }

  cancel(){
    this.router.navigate(['/profile']);
  }

  navigateToDashboard(){
    this.router.navigate(['/dashboard']);
  }



}
