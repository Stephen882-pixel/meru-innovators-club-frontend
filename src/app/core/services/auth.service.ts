import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { environment } from "../../../environments/environments";
import { BehaviorSubject, Observable } from "rxjs";


export interface User {
    id:number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    course: string;
    registration_no:string;
    bio:string;
    tech_stacks: string[];
    social_media:{
        github:string,
        linkedIn:string,
        twitter:string
    };
    photo: string | null;
    graduation_year:number;
    projects:any[];
    skills:string[];
}

export interface AuthResponse {
    message:string;
    status:string;
    data?:{
        refresh:string;
        access:string;
    };
}

export interface ApiResponse {
    message:string;
    status:string;
    data:any;
}


export class AuthService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(){
        const token = this.getToken();
        if(token){
            this.getUserData().subscribe();
        }
    }

    register(userData: any): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${this.apiUrl}/account/register/`, userData);
    }

    verifyOtp(email: string, otpCode: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/account/verify-otp/`, {
      email,
      otp_code: otpCode
    });
  }


}