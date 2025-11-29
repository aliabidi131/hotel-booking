// ============================================
// 📄 APP.ROUTES.TS - VERSION CORRIGÉE
// ============================================

import { Routes } from '@angular/router';
import { authGuard, adminGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'hotels',
    loadComponent: () => import('./components/hotel-list/hotel-list.component').then(m => m.HotelListComponent)
  },
  {
    path: 'hotels/:id',
    loadComponent: () => import('./components/hotel-detail/hotel-detail.component').then(m => m.HotelDetailComponent)
  },
  {
    path: 'booking/:hotelId',
    loadComponent: () => import('./components/booking-form/booking-form.component').then(m => m.BookingFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'my-bookings',
    loadComponent: () => import('./components/my-bookings/my-bookings.component').then(m => m.MyBookingsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'contact',
    loadComponent: () => import('./components/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'signup',
    loadComponent: () => import('./components/auth/signup.component').then(m => m.SignupComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'admin/hotels',
    loadComponent: () => import('./components/admin/hotel-list-admin.component').then(m => m.HotelListAdminComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'admin/bookings',
    loadComponent: () => import('./components/admin/booking-list-admin.component').then(m => m.BookingListAdminComponent),
    canActivate: [adminGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

