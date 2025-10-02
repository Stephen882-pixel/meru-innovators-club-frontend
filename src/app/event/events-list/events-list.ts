import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {EventService} from '../../core/services/events.service';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-events-list',
  standalone:true,
  imports: [CommonModule,RouterLink],
  templateUrl: './events-list.html',
  styleUrl: './events-list.scss'
})
export class EventsList implements  OnInit{

  private eventService = inject(EventService);
  private authService = inject(AuthService);
  private router = inject(Router);

  events: Event[] = [];
  filteredEvents: Event[] = [];
  isLoading = true;
  searchTerm = '';
  selectedCategory = '';
  currentPage = 1;
  hasNextPage = false;
  hasPreviousPage = false;
  isAdmin = false;

  ngOnInit() {
    this.loadEvents();
    this.checkAdminStatus();
  }

  checkAdminStatus(){
    this.authService.currentUser$.subscribe(user => {
      this.isAdmin = true;
    })
  }

}
