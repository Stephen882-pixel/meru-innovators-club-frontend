import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { environment } from "../../../environments/environments";
import { BehaviorSubject, Observable, tap } from "rxjs";


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

    login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/account/login/`, credentials)
      .pipe(
        tap(response => {
          if (response.data?.access) {
            this.setToken(response.data.access);
          }
        })
      );
    }


    requestPasswordReset(email:string): Observable<ApiResponse>{
      return this.http.post<ApiResponse>(`${this.apiUrl}/account/password-reset/request/`,{
        email
      });
    }

    resetPassword(email:string,newPassword:string):Observable<ApiResponse>{
      return this.http.post<ApiResponse>(`${this.apiUrl}/account/password-reset/reset/`,{
        email,
        new_password:newPassword
      });
    }

    changePassword(passwordData:{
      old_password:string;
      new_password:string;
      confirm_password:string;
    }):Observable<ApiResponse>{
      return this.http.post<ApiResponse>(`${this.apiUrl}/account/change-password/`,passwordData);
    }

    getUserData():Observable<ApiResponse>{
      return this.http.get<ApiResponse>(`${this.apiUrl}/account/get-user-data/`)
        .pipe(
          tap(response => {
            if(response.data){
              this.currentUserSubject.next(response.data);
            }
          })
        );
    }

    updateUserProfile(userData:any):Observable<ApiResponse> {
      return this.http.patch<ApiResponse>(`${this.apiUrl}/account/update-user-profile/`, userData)
        .pipe(
          tap(response => {
            if(response.data){
              this.currentUserSubject.next(response.data);
            }
          })
        );
    }

    logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/account/logout/`, {})
      .pipe(
        tap(() => {
          this.clearAuth();
        })
      );
  }

    deleteAccount(): Observable<any> {
      return this.http.delete(`${this.apiUrl}/account/delete-account/`)
        .pipe(
          tap(() => {
            this.clearAuth();
          })
        );
    }

    private setToken(token:string):void {
      localStorage.setItem('access_token',token);
    }

    getToken():string | null {
      return localStorage.getItem('access_token');
    }

    

}