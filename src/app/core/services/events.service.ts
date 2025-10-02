

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


