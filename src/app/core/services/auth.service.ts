

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