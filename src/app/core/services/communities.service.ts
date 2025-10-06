

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


