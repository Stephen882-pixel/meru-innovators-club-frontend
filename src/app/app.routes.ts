import { Routes } from '@angular/router';
import { Register } from './auth/register/register';
import { Component } from '@angular/core';
import { Login } from './auth/login/login';
import { Dashboard } from './auth/dashboard/dashboard';
import { VerifyOtp } from './auth/verify-otp/verify-otp';
import {ForgotPassword} from './auth/forgot-password/forgot-password';
import {ResetPasswordOtp} from './auth/reset-password-otp/reset-password-otp';
import {ResetPassword} from './auth/reset-password/reset-password';
import {ProfileView} from './profile/profile-view/profile-view';
import {ProfileEdit} from './profile/profile-edit/profile-edit';

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
    },
    {
        path:'forgot-password',
        component:ForgotPassword
    },
    {
        path:'reset-password-otp',
        component: ResetPasswordOtp
    },
    {
        path:'reset-password',
        component:ResetPassword
    },
    {
        path:'profile',
        component:ProfileView
    },
    {
      path:'profile-edit',
      component:ProfileEdit
    }
];
