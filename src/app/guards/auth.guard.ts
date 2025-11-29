import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Auth guard: allow route only if user is authenticated
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isLoading()) return false;
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};

// Admin guard: allow only admin users
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isLoading()) return false;
  if (!authService.isAuthenticated() || !authService.isAdmin()) {
    router.navigate(['/']);
    return false;
  }
  return true;
};

// Guest guard: allow only non-authenticated users
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isLoading()) return false;
  if (authService.isAuthenticated()) {
    router.navigate(['/']);
    return false;
  }
  return true;
};

