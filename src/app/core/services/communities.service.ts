import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from '../../../environments/environments';


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

export interface CommunityMembersResponse{
  status: string;
  total_members: number;
  data: CommunityMember[];
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

export interface Club {
  id:number;
  name:string;
  about_us:string;
  vision:string;
  mission:string;
  social_media:SocialMedia[];
  communities:Community[];
}

export interface ClubResponse {
  message:string;
  status:string;
  data:Club;
}

@Injectable({
  providedIn:'root'
})
export class CommunitiesService{
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getCommunities(page:number=1):Observable<CommunitiesResponse> {
    let params = new HttpParams().set('page',page.toString());
    return this.http.get<CommunitiesResponse>(`${this.apiUrl}/list-communities/`,{params});
  }

  getCommunityById(communityId:number):Observable<CommunityResponse> {
    return this.http.get<CommunityResponse>(`${this.apiUrl}/get-community/${communityId}/`);
  }

  getCommunityByName(name:string):Observable<CommunityResponse>{
    let params = new HttpParams().set('name',name);
    return this.http.get<CommunityResponse>(`${this.apiUrl}/search-community/`,{params});
  }

  joinCommunity(communityId:number,memberData:{name:string,email:string}):Observable<CommunityResponse>{
    return this.http.post<CommunityResponse>(`${this.apiUrl}/join-community/${communityId}/`,memberData);
  }


  createCommunity(communityData:any):Observable<CommunityResponse> {
    return this.http.post<CommunityResponse>(`${this.apiUrl}/add-community/`,communityData);
  }

  updateCommunity(communityId:number,updateData:any):Observable<CommunityResponse>{
    return this.http.patch<CommunityResponse>(`${this.apiUrl}/update-community/${communityId}/`,updateData);
  }

  getCommunityMembers(communityId:number):Observable<CommunityMembersResponse> {
    return this.http.get<CommunityMembersResponse>(`${this.apiUrl}/community-members/${communityId}`);
  }

  getClub():Observable<ClubResponse>{
    return this.http.get<ClubResponse>(`${this.apiUrl}/club/`);
  }

  createClub(clubData:any):Observable<ClubResponse>{
    return this.http.post<ClubResponse>(`${this.apiUrl}/club/`,clubData);
  }

  updateClub(clubData:any):Observable<ClubResponse>{
    return this.http.put<ClubResponse>(`${this.apiUrl}/club/`,clubData);
  }

  getExecutives():Observable<ExecutivesResponse>{
    return this.http.get<ExecutivesResponse>(`${this.apiUrl}/executives/`);
  }

  getExecutiveById(executiveId:number):Observable<ExecutiveResponse>{
    return this.http.get<ExecutiveResponse>(`${this.apiUrl}/executives/${executiveId}/`);
  }
}




