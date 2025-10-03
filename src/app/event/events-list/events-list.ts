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
  styleUrls: ['./events-list.scss']
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

  loadEvents(page:number = 1){
    this.isAdmin = true;
    this.eventService.getEvents(page).subscribe({
      next : (response) => {
        this.events = response.data.results;
        this.filteredEvents = this.events;
        this.hasNextPage = !!response.data.next;
        this.hasPreviousPage = !!response.data.previous;
        this.currentPage = page;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading events:',error);
        this.isLoading = false;
      }
    });
  }


  checkAdminStatus(){
    this.authService.currentUser$.subscribe(user => {
      this.isAdmin = true;
    })
  }

  searchEvents() {
    if (!this.searchTerm.trim()) {
      this.filteredEvents = this.events;
    } else {
      this.filteredEvents = this.events.filter(event =>
        event.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        event.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  filterEvents(){
    if(!this.selectedCategory){
      this.filteredEvents = this.events;
    } else {
      this.filteredEvents = this.events.filter(event =>
        event.category === this.selectedCategory
      );
    }
  }

  viewEventDetails(eventId:number){
    this.router.navigate(['/events',eventId]);
  }

  registerForEvent(eventId:number){
    this.router.navigate(['/events',eventId,'register']);
  }

  nextPage(){
    if(this.hasNextPage){
      this.loadEvents(this.currentPage + 1);
    }
  }

  previousPage(){
    if(this.hasPreviousPage){
      this.loadEvents(this.currentPage - 1);
    }
  }



}
