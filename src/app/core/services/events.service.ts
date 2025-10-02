import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
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


}


