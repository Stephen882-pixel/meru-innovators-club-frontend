import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'/dashboard',
        pathMatch:'full'
    },
    {
        path:'register',
        loadComponent: () => import('./auth/register/register').then(c => c.Register)
    },
    {
        path:'login',
        loadComponent: () => import('./auth/login/login').then(c => c.Login)
    },
    {
        path:'verify-otp',
        loadComponent: () => import('./auth/verify-otp/verify-otp').then(c => c.VerifyOtp)
    },
    {
        path:'dashboad',
        loadComponent: () => import('./auth/dashboard/dashboard').then(c => c.Dashboard)
    }    
];
