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
import {ChangePassword} from './auth/change-password/change-password';
import {authGuard} from './core/guards/auth.guard';
import {EventsList} from './event/events-list/events-list';
import {EventDetails} from './event/event-details/event-details';
import {EventRegistration} from './event/event-registration/event-registration';
import {EventForm} from './event/event-form/event-form';
import {MyRegistrations} from './event/my-registrations/my-registrations';
import {ClubDetails} from './club/club-details/club-details';
import {CommunitiesList} from './community/communities-list/communities-list';

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
    },
    {
        path:'change-password',
        component:ChangePassword
    },
    {
      path:'events/add',
      component:EventForm
    },
    {
        path:'events/:id/edit',
        component:EventForm
    },
    {
        path:'events-list',
        component:EventsList
    },
    {
        path:'event-details/:id',
        component:EventDetails
    },
    {
        path:'event-registration/:id',
        component:EventRegistration
    },
    {
        path:'my-registrations',
        component:MyRegistrations
    },
    {
        path:'club',
        component:ClubDetails
    },
    {
        path:'communities',
        component:CommunitiesList
    }
];
