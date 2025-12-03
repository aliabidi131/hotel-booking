import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <mat-toolbar color="primary" class="navbar">
      <div class="navbar-container">
        <a routerLink="/" class="logo">
          <mat-icon>hotel</mat-icon>
          <span>HotelBook</span>
        </a>

        <nav class="nav-links desktop-nav">
          <a mat-button routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a mat-button routerLink="/hotels" routerLinkActive="active">Hotels</a>
          <a mat-button routerLink="/my-bookings" routerLinkActive="active" *ngIf="authService.isAuthenticated()">My Bookings</a>
          <a mat-button routerLink="/contact" routerLinkActive="active">Contact</a>
          <a mat-button routerLink="/admin" routerLinkActive="active" *ngIf="authService.isAdmin()">Admin</a>
        </nav>

        <div class="auth-section">
          <ng-container *ngIf="authService.isAuthenticated(); else authButtons">
            <button mat-button [matMenuTriggerFor]="userMenu">
              <mat-icon>account_circle</mat-icon>
              <span class="user-name">{{ authService.currentUser()?.displayName || authService.currentUser()?.email }}</span>
            </button>
            <mat-menu #userMenu="matMenu">
              <button mat-menu-item routerLink="/my-bookings">
                <mat-icon>book_online</mat-icon> My Bookings
              </button>
              <button mat-menu-item (click)="authService.logout()">
                <mat-icon>logout</mat-icon> Logout
              </button>
            </mat-menu>
          </ng-container>
          <ng-template #authButtons>
            <a mat-button routerLink="/login">Login</a>
            <a mat-raised-button color="accent" routerLink="/signup">Sign Up</a>
          </ng-template>
        </div>

        <button mat-icon-button class="mobile-menu" [matMenuTriggerFor]="mobileMenu">
          <mat-icon>menu</mat-icon>
        </button>
        <mat-menu #mobileMenu="matMenu">
          <a mat-menu-item routerLink="/">Home</a>
          <a mat-menu-item routerLink="/hotels">Hotels</a>
          <a mat-menu-item routerLink="/my-bookings" *ngIf="authService.isAuthenticated()">My Bookings</a>
          <a mat-menu-item routerLink="/contact">Contact</a>
          <a mat-menu-item routerLink="/admin" *ngIf="authService.isAdmin()">Admin</a>
          <ng-container *ngIf="authService.isAuthenticated(); else mobileAuth">
            <button mat-menu-item (click)="authService.logout()">Logout</button>
          </ng-container>
          <ng-template #mobileAuth>
            <a mat-menu-item routerLink="/login">Login</a>
            <a mat-menu-item routerLink="/signup">Sign Up</a>
          </ng-template>
        </mat-menu>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; }
    .navbar-container { display: flex; align-items: center; justify-content: space-between; width: 100%; max-width: 1200px; margin: 0 auto; }
    .logo { display: flex; align-items: center; gap: 8px; color: white; text-decoration: none; font-size: 1.25rem; font-weight: 500; }
    .nav-links { display: flex; gap: 8px; }
    .nav-links a.active { background: rgba(255,255,255,0.1); }
    .auth-section { display: flex; align-items: center; gap: 8px; }
    .user-name { margin-left: 8px; }
    .mobile-menu { display: none; }
    @media (max-width: 768px) {
      .desktop-nav, .auth-section { display: none; }
      .mobile-menu { display: block; }
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);
}
