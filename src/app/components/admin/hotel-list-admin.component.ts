import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HotelService } from '../../services/hotel.service';
import { Hotel } from '../../models/hotel.model';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';
import { HotelFormComponent } from './hotel-form.component';

@Component({
  selector: 'app-hotel-list-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    HotelFormComponent
  ],
  template: `
    @if (editingHotel()) {
      <app-hotel-form
        [hotel]="editingHotel()!"
        (hotelSaved)="onHotelUpdated()"
        (cancelled)="editingHotel.set(null)">
      </app-hotel-form>
    }

    <div class="table-container">
      <table mat-table [dataSource]="hotels" class="full-width">
        <ng-container matColumnDef="image">
          <th mat-header-cell *matHeaderCellDef>Image</th>
          <td mat-cell *matCellDef="let hotel">
            <img [src]="hotel.images?.[0] || 'assets/placeholder-hotel.jpg'" [alt]="hotel.name" class="hotel-thumb">
          </td>
        </ng-container>

        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let hotel">
            <a [routerLink]="['/hotels', hotel.id]" class="hotel-name">{{ hotel.name }}</a>
          </td>
        </ng-container>

        <ng-container matColumnDef="stars">
          <th mat-header-cell *matHeaderCellDef>Stars</th>
          <td mat-cell *matCellDef="let hotel">
            <div class="star-rating">
              @for (star of getStarsArray(hotel.stars); track $index) {
                <mat-icon>star</mat-icon>
              }
            </div>
          </td>
        </ng-container>

        <ng-container matColumnDef="price">
          <th mat-header-cell *matHeaderCellDef>Price</th>
          <td mat-cell *matCellDef="let hotel">
            <span class="price">\${{ hotel.price }}</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="location">
          <th mat-header-cell *matHeaderCellDef>Location</th>
          <td mat-cell *matCellDef="let hotel">{{ hotel.location || '-' }}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let hotel">
            <button mat-icon-button color="primary" (click)="editHotel(hotel)" matTooltip="Edit">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteHotel(hotel)" matTooltip="Delete">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>

    @if (hotels.length === 0) {
      <div class="no-data">
        <mat-icon>hotel</mat-icon>
        <p>No hotels found. Add your first hotel!</p>
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

    .hotel-thumb {
      width: 80px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
    }

    .hotel-name {
      color: #3f51b5;
      text-decoration: none;
      font-weight: 500;
    }

    .hotel-name:hover {
      text-decoration: underline;
    }

    .star-rating {
      display: flex;
      color: #ffc107;
    }

    .star-rating mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .price {
      color: #4caf50;
      font-weight: 500;
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
export class HotelListAdminComponent {
  @Input() hotels: Hotel[] = [];
  @Output() hotelDeleted = new EventEmitter<void>();

  private hotelService = inject(HotelService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  editingHotel = signal<Hotel | null>(null);
  displayedColumns = ['image', 'name', 'stars', 'price', 'location', 'actions'];

  getStarsArray(stars: number): number[] {
    return Array(stars).fill(0);
  }

  editHotel(hotel: Hotel) {
    this.editingHotel.set(hotel);
  }

  onHotelUpdated() {
    this.editingHotel.set(null);
    this.hotelDeleted.emit();
  }

  deleteHotel(hotel: Hotel) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Hotel',
        message: `Are you sure you want to delete "${hotel.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        try {
          await this.hotelService.deleteHotel(hotel.id);
          this.snackBar.open('Hotel deleted successfully', 'Close', { duration: 3000 });
          this.hotelDeleted.emit();
        } catch (error) {
          this.snackBar.open('Failed to delete hotel', 'Close', { duration: 3000 });
        }
      }
    });
  }
}
