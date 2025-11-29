import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Hotel } from '../../models/hotel.model';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule,
    MatIconModule, MatSnackBarModule, MatProgressSpinnerModule
  ],
  template: `
    <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Check-in Date</mat-label>
        <input matInput [matDatepicker]="checkinPicker" formControlName="checkIn" [min]="minDate">
        <mat-datepicker-toggle matIconSuffix [for]="checkinPicker"></mat-datepicker-toggle>
        <mat-datepicker #checkinPicker></mat-datepicker>
        <mat-error *ngIf="bookingForm.get('checkIn')?.hasError('required')">Check-in date is required</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Check-out Date</mat-label>
        <input matInput [matDatepicker]="checkoutPicker" formControlName="checkOut" [min]="minCheckoutDate()">
        <mat-datepicker-toggle matIconSuffix [for]="checkoutPicker"></mat-datepicker-toggle>
        <mat-datepicker #checkoutPicker></mat-datepicker>
        <mat-error *ngIf="bookingForm.get('checkOut')?.hasError('required')">Check-out date is required</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Number of Guests</mat-label>
        <mat-select formControlName="guests">
          <mat-option *ngFor="let num of guestOptions" [value]="num">{{ num }} {{ num === 1 ? 'Guest' : 'Guests' }}</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Room Type</mat-label>
        <mat-select formControlName="roomType">
          <ng-container *ngIf="hotel.roomTypes?.length; else defaultRooms">
            <mat-option *ngFor="let room of hotel.roomTypes" [value]="room.name">{{ room.name }} - \${{ room.price }}/night</mat-option>
          </ng-container>
          <ng-template #defaultRooms>
            <mat-option value="Standard">Standard Room - \${{ hotel.price }}/night</mat-option>
            <mat-option value="Deluxe">Deluxe Room - \${{ hotel.price * 1.5 }}/night</mat-option>
          </ng-template>
        </mat-select>
      </mat-form-field>

      <div class="price-summary" *ngIf="totalPrice() > 0">
        <div class="price-row">
          <span>{{ nights() }} {{ nights() === 1 ? 'night' : 'nights' }}</span>
          <span>\${{ pricePerNight() }} x {{ nights() }}</span>
        </div>
        <div class="price-row total">
          <span>Total</span>
          <span class="total-price">\${{ totalPrice() }}</span>
        </div>
      </div>

      <button mat-raised-button color="accent" type="submit" class="full-width submit-btn" [disabled]="!bookingForm.valid || isSubmitting()">
        <mat-spinner diameter="20" *ngIf="isSubmitting()"></mat-spinner>
        <ng-container *ngIf="!isSubmitting()"><mat-icon>book_online</mat-icon> Book Now</ng-container>
      </button>
    </form>
  `,
  styles: [`
    form { display: flex; flex-direction: column; gap: 8px; }
    .full-width { width: 100%; }
    .price-summary { background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 8px 0; }
    .price-row { display: flex; justify-content: space-between; margin-bottom: 8px; color: #666; }
    .price-row.total { border-top: 1px solid #ddd; padding-top: 8px; margin-bottom: 0; font-weight: 500; color: #333; }
    .total-price { color: #4caf50; font-size: 1.25rem; }
    .submit-btn { margin-top: 8px; padding: 8px 16px; }
    .submit-btn mat-icon { margin-right: 8px; }
  `]
})
export class BookingFormComponent {
  @Input() hotel!: Hotel;
  @Output() bookingCreated = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private bookingService = inject(BookingService);
  private snackBar = inject(MatSnackBar);

  minDate = new Date();
  guestOptions = [1, 2, 3, 4, 5, 6];
  isSubmitting = signal<boolean>(false);

  bookingForm: FormGroup = this.fb.group({
    checkIn: ['', Validators.required],
    checkOut: ['', Validators.required],
    guests: [2, Validators.required],
    roomType: ['', Validators.required]
  });

  minCheckoutDate = signal<Date>(new Date());

  constructor() {
    this.bookingForm.get('checkIn')?.valueChanges.subscribe(value => {
      if (value) {
        const nextDay = new Date(value);
        nextDay.setDate(nextDay.getDate() + 1);
        this.minCheckoutDate.set(nextDay);
      }
    });
  }

  nights(): number {
    const checkIn = this.bookingForm.get('checkIn')?.value;
    const checkOut = this.bookingForm.get('checkOut')?.value;
    if (!checkIn || !checkOut) return 0;
    const diffTime = Math.abs(new Date(checkOut).getTime() - new Date(checkIn).getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  pricePerNight(): number {
    const roomType = this.bookingForm.get('roomType')?.value;
    if (!roomType) return this.hotel.price;
    const room = this.hotel.roomTypes?.find(r => r.name === roomType);
    if (room) return room.price;
    return roomType === 'Deluxe' ? this.hotel.price * 1.5 : this.hotel.price;
  }

  totalPrice(): number { return this.nights() * this.pricePerNight(); }

  async onSubmit() {
    if (!this.bookingForm.valid) return;
    this.isSubmitting.set(true);
    try {
      const result = await this.bookingService.createBooking(
        this.hotel.id, 
        this.hotel.name, 
        this.bookingForm.value, 
        this.totalPrice()
      );
      
      if (result.success) {
        this.snackBar.open(result.message, 'Close', { duration: 5000 });
        this.bookingForm.reset({ guests: 2 });
        this.bookingCreated.emit();
      } else {
        this.snackBar.open(result.message, 'Close', { duration: 5000 });
      }
    } catch (error: any) {
      this.snackBar.open(error.message || 'Failed to create booking', 'Close', { duration: 5000 });
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
