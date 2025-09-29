import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-profile-edit',
  standalone:true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './profile-edit.html',
  styleUrl: './profile-edit.scss'
})
export class ProfileEdit {

}
