import { Routes } from '@angular/router';
import { Register } from './auth/register/register';
import { Component } from '@angular/core';
import { Login } from './auth/login/login';
import { Dashboard } from './auth/dashboard/dashboard';
import { VerifyOtp } from './auth/verify-otp/verify-otp';

export const routes: Routes = [
    {
        path:'',
        component:Register
    },
    {
        path:'login',
        component:Login
    },
    {
        path:'dashboard',
        component:Dashboard
    },
    {
        path:'verify-otp',
        component:VerifyOtp
    }
    // {
    //     path:'',
    //     component:Register,
    //     children[
    //         {
    //             loadChildren: () => import('app/auth/register/register.routes.ts')
    //         }
    //     ]
    // }
];
