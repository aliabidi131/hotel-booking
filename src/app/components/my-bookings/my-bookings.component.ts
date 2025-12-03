import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { Booking } from '../../models/booking.model';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatSnackBarModule, MatProgressSpinnerModule, MatDialogModule],
  template: `
    <div class="my-bookings-container container">
      <h1 class="page-title">My Bookings</h1>

      <div class="loading" *ngIf="isLoading()">
        <mat-spinner></mat-spinner>
      </div>

      <div class="no-bookings" *ngIf="!isLoading() && bookings().length === 0">
        <mat-icon>event_busy</mat-icon>
        <h2>No Bookings Yet</h2>
        <p>You haven't made any bookings. Start exploring our hotels!</p>
        <a mat-raised-button color="primary" routerLink="/hotels">Browse Hotels</a>
      </div>

      <div class="bookings-list" *ngIf="!isLoading() && bookings().length > 0">
        <mat-card class="booking-card" *ngFor="let booking of bookings()">
          <mat-card-header>
            <mat-card-title>{{ booking.hotelName }}</mat-card-title>
            <mat-card-subtitle>
              <mat-chip [ngClass]="'status-' + booking.status">{{ booking.status | titlecase }}</mat-chip>
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="booking-details">
              <div class="detail-row"><mat-icon>calendar_today</mat-icon><span>{{ formatDate(booking.checkIn) }} - {{ formatDate(booking.checkOut) }}</span></div>
              <div class="detail-row"><mat-icon>people</mat-icon><span>{{ booking.guests }} {{ booking.guests === 1 ? 'Guest' : 'Guests' }}</span></div>
              <div class="detail-row"><mat-icon>hotel</mat-icon><span>{{ booking.roomType }}</span></div>
              <div class="detail-row total" *ngIf="booking.totalPrice"><mat-icon>payments</mat-icon><span class="price">\${{ booking.totalPrice }}</span></div>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <a mat-button color="primary" [routerLink]="['/hotels', booking.hotelId]">View Hotel</a>
            <button mat-button color="warn" (click)="cancelBooking(booking)" *ngIf="booking.status === 'pending' || booking.status === 'confirmed'">Cancel</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .my-bookings-container { padding-top: 84px; }
    .loading { display: flex; justify-content: center; padding: 60px; }
    .no-bookings { text-align: center; padding: 60px 20px; background: white; border-radius: 8px; }
    .no-bookings mat-icon { font-size: 64px; width: 64px; height: 64px; color: #ccc; }
    .no-bookings h2 { margin: 16px 0 8px; }
    .no-bookings p { color: #666; margin-bottom: 24px; }
    .bookings-list { display: flex; flex-direction: column; gap: 16px; }
    .booking-card { transition: box-shadow 0.2s; }
    .booking-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    .booking-details { display: flex; flex-wrap: wrap; gap: 24px; margin-top: 16px; }
    .detail-row { display: flex; align-items: center; gap: 8px; color: #666; }
    .detail-row mat-icon { color: #3f51b5; }
    .detail-row.total { font-weight: 500; }
    .detail-row .price { color: #4caf50; font-size: 1.1rem; }
    .status-pending { background-color: #fff3e0 !important; color: #e65100 !important; }
    .status-confirmed { background-color: #e8f5e9 !important; color: #2e7d32 !important; }
    .status-cancelled { background-color: #ffebee !important; color: #c62828 !important; }
    .status-completed { background-color: #e3f2fd !important; color: #1565c0 !important; }
  `]
})
export class MyBookingsComponent implements OnInit {
  private bookingService = inject(BookingService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  bookings = signal<Booking[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.bookingService.getUserBookings(user.uid).subscribe({
        next: (bookings) => { this.bookings.set(bookings); this.isLoading.set(false); },
        error: () => { this.isLoading.set(false); }
      });
    } else { this.isLoading.set(false); }
  }

  formatDate(date: any): string {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  cancelBooking(booking: Booking) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Cancel Booking', message: `Are you sure you want to cancel your booking at ${booking.hotelName}?` }
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        try {
          await this.bookingService.cancelBooking(booking.id);
          this.snackBar.open('Booking cancelled successfully', 'Close', { duration: 3000 });
        } catch (error) {
          this.snackBar.open('Failed to cancel booking', 'Close', { duration: 3000 });
        }
      }
    });
  }
}
