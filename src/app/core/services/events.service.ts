import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environments';
import {Observable} from 'rxjs';


export interface Event {
  id:number;
  name:string;
  category:string;
  title:string;
  description:string;
  date:string;
  location:string;
  organizer:string;
  contact_email:string;
  is_virtual:boolean;
}

export interface EventRegistration {
  uid:string;
  event:number;
  full_name:string;
  email:string;
  course:string;
  education_level:string;
  phone_number:string;
  expectations:string;
  registration_timestamp:string;
  ticket_number:string;
}

export interface EventsResponse {
  message:string;
  status:string;
  data:{
    count:number;
    next:string | null;
    previous:string | null;
    result:Event[];
  };
}

export interface EventResponse {
  message:string;
  status:string;
  data:Event;
}

export interface RegistrationResponse {
  message:string;
  status:string;
  data:EventRegistration;
}

export interface UserRegistrationResponse {
  message:string;
  status:string;
  data:EventRegistration[];
}

@Injectable({
  providedIn:'root'
})
export class EventService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  addEvent(eventData: FormData): Observable<EventResponse> {
    return this.http.post<EventResponse>(`${this.apiUrl}/events/add/`, eventData);
  }

  updateEvent(eventId:number,eventData:FormData):Observable<EventResponse>{
    return this.http.patch<EventResponse>(`${this.apiUrl}/events/${eventId}/update`,eventData);
  }

  deleteEvent(eventId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/events/${eventId}/delete`);
  }

  getEvents(page:number = 1):Observable<EventResponse> {
    let params = new HttpParams().set('page',page.toString());
    return this.http.get<EventResponse>(`${this.apiUrl}/events/list/`,{params});
  }

  getEventById(eventId:number):Observable<EventResponse> {
    return this.http.get<EventResponse>(`${this.apiUrl}/events/${eventId}/view/`);
  }

  getEventByName(name:string) : Observable<EventResponse> {
    let params= new HttpParams().set('name',name);
    return this.http.get<EventResponse>(`${this.apiUrl}/events/by-name/`,{params});
  }

  registerForEvent(eventId:number,registrationData: any): Observable<RegistrationResponse>{
    return this.http.post<RegistrationResponse>(`${this.apiUrl}/events/${eventId}/registrations/`,registrationData);
  }

  getUserRegistrations(email: string): Observable<UserRegistrationsResponse> {
    let params = new HttpParams().set('email', email);
    return this.http.get<UserRegistrationsResponse>(`${this.apiUrl}/registrations/user-registrations/`, { params });
  }

  getMyRegistrations(): Observable<UserRegistrationsResponse> {
    return this.http.get<UserRegistrationsResponse>(`${this.apiUrl}/events/1/registrations/my-registrations/`);
  }
}


