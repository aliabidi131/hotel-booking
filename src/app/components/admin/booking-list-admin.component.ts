import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-booking-list-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    MatSnackBarModule
  ],
  template: `
    <div class="table-container">
      <table mat-table [dataSource]="bookings" class="full-width">
        <ng-container matColumnDef="hotel">
          <th mat-header-cell *matHeaderCellDef>Hotel</th>
          <td mat-cell *matCellDef="let booking">
            <a [routerLink]="['/hotels', booking.hotelId]" class="hotel-link">
              {{ booking.hotelName }}
            </a>
          </td>
        </ng-container>

        <ng-container matColumnDef="dates">
          <th mat-header-cell *matHeaderCellDef>Dates</th>
          <td mat-cell *matCellDef="let booking">
            {{ formatDate(booking.checkIn) }} - {{ formatDate(booking.checkOut) }}
          </td>
        </ng-container>

        <ng-container matColumnDef="guests">
          <th mat-header-cell *matHeaderCellDef>Guests</th>
          <td mat-cell *matCellDef="let booking">{{ booking.guests }}</td>
        </ng-container>

        <ng-container matColumnDef="roomType">
          <th mat-header-cell *matHeaderCellDef>Room</th>
          <td mat-cell *matCellDef="let booking">{{ booking.roomType }}</td>
        </ng-container>

        <ng-container matColumnDef="total">
          <th mat-header-cell *matHeaderCellDef>Total</th>
          <td mat-cell *matCellDef="let booking">
            <span class="price">\${{ booking.totalPrice || 0 }}</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let booking">
            <mat-chip [ngClass]="getStatusClass(booking.status)">
              {{ booking.status | titlecase }}
            </mat-chip>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let booking">
            <button mat-icon-button [matMenuTriggerFor]="statusMenu">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #statusMenu="matMenu">
              <button mat-menu-item (click)="updateStatus(booking, 'confirmed')" 
                [disabled]="booking.status === 'confirmed'">
                <mat-icon>check_circle</mat-icon>
                <span>Confirm</span>
              </button>
              <button mat-menu-item (click)="updateStatus(booking, 'completed')"
                [disabled]="booking.status === 'completed'">
                <mat-icon>done_all</mat-icon>
                <span>Complete</span>
              </button>
              <button mat-menu-item (click)="updateStatus(booking, 'cancelled')"
                [disabled]="booking.status === 'cancelled'">
                <mat-icon>cancel</mat-icon>
                <span>Cancel</span>
              </button>
            </mat-menu>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>

    @if (bookings.length === 0) {
      <div class="no-data">
        <mat-icon>book_online</mat-icon>
        <p>No bookings found.</p>
      </div>
    }
  `,
  styles: [`
    .table-container {
      overflow-x: auto;
      background: white;
      border-radius: 8px;
    }

    table {
      width: 100%;
    }

    .hotel-link {
      color: #3f51b5;
      text-decoration: none;
      font-weight: 500;
    }

    .hotel-link:hover {
      text-decoration: underline;
    }

    .price {
      color: #4caf50;
      font-weight: 500;
    }

    .status-pending {
      background-color: #fff3e0 !important;
      color: #e65100 !important;
    }

    .status-confirmed {
      background-color: #e8f5e9 !important;
      color: #2e7d32 !important;
    }

    .status-cancelled {
      background-color: #ffebee !important;
      color: #c62828 !important;
    }

    .status-completed {
      background-color: #e3f2fd !important;
      color: #1565c0 !important;
    }

    .no-data {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .no-data mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #ccc;
      margin-bottom: 16px;
    }
  `]
})
export class BookingListAdminComponent {
  @Input() bookings: Booking[] = [];
  @Output() bookingUpdated = new EventEmitter<void>();

  private bookingService = inject(BookingService);
  private snackBar = inject(MatSnackBar);

  displayedColumns = ['hotel', 'dates', 'guests', 'roomType', 'total', 'status', 'actions'];

  formatDate(date: any): string {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  async updateStatus(booking: Booking, status: Booking['status']) {
    try {
      await this.bookingService.updateBookingStatus(booking.id, status);
      this.snackBar.open(`Booking ${status}`, 'Close', { duration: 3000 });
      this.bookingUpdated.emit();
    } catch (error) {
      this.snackBar.open('Failed to update booking', 'Close', { duration: 3000 });
    }
  }
}
