

export interface CommunityMember {
  id:number;
  name:string;
  email:string;
  joined_date:string;
}

export interface SocialMedia {
  id?:number;
  platform:string;
  url:string;
}

export interface Session {
  day:string;
  start_time:string;
  end_time:string;
  meeting_type:string;
  location:string;
}

export interface UserDetails {
  id:number;
  username:string;
  email:string;
  first_name:string;
  last_name:string;
}

export interface Community {
  id:number;
  name:string;
  community_lead_details:UserDetails;
  co_lead_details:UserDetails;
  secretary_details:UserDetails;
  email:string;
  phone_number:string;
  social_media:SocialMedia[];
  description:string;
  founding_date:string;
  total_members:number;
  members:CommunityMember[];
  is_recruiting:boolean;
  tech_stack:string[];
  sessions:Session[];
}


export interface CommunitiesResponse {
  message:string;
  status:string;
  data:{
    count:number;
    next:string | null;
    previous:string | null;
    results:Community[];
  };
}

export interface CommunityResponse {
  message:string;
  status:string;
  data:Community;
}


export interface Executive {
  id:number;
  user:number;
  community:number;
  position:string;
  joined_date:string;
  user_details:UserDetails;
  community_details:{
    id:number;
    name:string;
  };
}

export interface ExecutivesResponse {
  message:string;
  status:string;
  data:Executive[];
}

export interface ExecutiveResponse {
  message:string;
  status:string;
  data:Executive;
}




