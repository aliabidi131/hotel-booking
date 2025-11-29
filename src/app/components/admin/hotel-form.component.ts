import { Component, Input, Output, EventEmitter, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HotelService } from '../../services/hotel.service';
import { Hotel } from '../../models/hotel.model';

@Component({
  selector: 'app-hotel-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <mat-card class="hotel-form-card">
      <mat-card-header>
        <mat-card-title>{{ hotel ? 'Edit Hotel' : 'Add New Hotel' }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="hotelForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Hotel Name</mat-label>
              <input matInput formControlName="name" placeholder="Enter hotel name">
              @if (hotelForm.get('name')?.hasError('required')) {
                <mat-error>Hotel name is required</mat-error>
              }
            </mat-form-field>
          </div>

          <div class="form-row two-cols">
            <mat-form-field appearance="outline">
              <mat-label>Star Rating</mat-label>
              <mat-select formControlName="stars">
                @for (star of [1, 2, 3, 4, 5]; track star) {
                  <mat-option [value]="star">{{ star }} {{ star === 1 ? 'Star' : 'Stars' }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Price per Night</mat-label>
              <input matInput type="number" formControlName="price" placeholder="100">
              <span matTextPrefix>$&nbsp;</span>
              @if (hotelForm.get('price')?.hasError('required')) {
                <mat-error>Price is required</mat-error>
              }
              @if (hotelForm.get('price')?.hasError('min')) {
                <mat-error>Price must be positive</mat-error>
              }
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Location</mat-label>
            <input matInput formControlName="location" placeholder="City, Country">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" rows="4" placeholder="Describe the hotel..."></textarea>
            @if (hotelForm.get('description')?.hasError('required')) {
              <mat-error>Description is required</mat-error>
            }
          </mat-form-field>

          <div class="images-section">
            <h4>Images</h4>
            <div formArrayName="images" class="images-list">
              @for (image of imagesArray.controls; track $index) {
                <div class="image-input">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Image URL {{ $index + 1 }}</mat-label>
                    <input matInput [formControlName]="$index" placeholder="https://...">
                  </mat-form-field>
                  <button mat-icon-button color="warn" type="button" (click)="removeImage($index)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              }
            </div>
            <button mat-stroked-button type="button" (click)="addImage()">
              <mat-icon>add_photo_alternate</mat-icon>
              Add Image
            </button>
          </div>

          <div class="amenities-section">
            <h4>Amenities</h4>
            <div class="amenities-input">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Add Amenity</mat-label>
                <input matInput #amenityInput placeholder="e.g., Free WiFi, Pool, Spa">
              </mat-form-field>
              <button mat-icon-button color="primary" type="button" 
                (click)="addAmenity(amenityInput.value); amenityInput.value = ''">
                <mat-icon>add</mat-icon>
              </button>
            </div>
            <div class="amenities-chips">
              @for (amenity of amenities(); track amenity; let i = $index) {
                <mat-chip (removed)="removeAmenity(i)">
                  {{ amenity }}
                  <mat-icon matChipRemove>cancel</mat-icon>
                </mat-chip>
              }
            </div>
          </div>

          <div class="room-types-section">
            <h4>Room Types</h4>
            <div formArrayName="roomTypes">
              @for (room of roomTypesArray.controls; track $index) {
                <div [formGroupName]="$index" class="room-type-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Room Name</mat-label>
                    <input matInput formControlName="name" placeholder="Standard">
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>Price</mat-label>
                    <input matInput type="number" formControlName="price">
                    <span matTextPrefix>$&nbsp;</span>
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>Capacity</mat-label>
                    <input matInput type="number" formControlName="capacity">
                  </mat-form-field>
                  <button mat-icon-button color="warn" type="button" (click)="removeRoomType($index)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              }
            </div>
            <button mat-stroked-button type="button" (click)="addRoomType()">
              <mat-icon>add</mat-icon>
              Add Room Type
            </button>
          </div>

          <div class="form-actions">
            <button mat-button type="button" (click)="cancelled.emit()">Cancel</button>
            <button mat-raised-button color="primary" type="submit" 
              [disabled]="!hotelForm.valid || isSubmitting()">
              @if (isSubmitting()) {
                <mat-spinner diameter="20"></mat-spinner>
              } @else {
                {{ hotel ? 'Update Hotel' : 'Add Hotel' }}
              }
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .hotel-form-card {
      margin-bottom: 24px;
    }

    .form-row {
      margin-bottom: 8px;
    }

    .form-row.two-cols {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    h4 {
      margin: 16px 0 12px;
      color: #333;
    }

    .images-list {
      margin-bottom: 12px;
    }

    .image-input {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .image-input mat-form-field {
      flex: 1;
    }

    .amenities-input {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .amenities-input mat-form-field {
      flex: 1;
    }

    .amenities-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 8px;
    }

    .room-type-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr auto;
      gap: 16px;
      align-items: center;
      margin-bottom: 8px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #eee;
    }

    @media (max-width: 600px) {
      .form-row.two-cols,
      .room-type-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HotelFormComponent implements OnInit {
  @Input() hotel?: Hotel;
  @Output() hotelSaved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private hotelService = inject(HotelService);
  private snackBar = inject(MatSnackBar);

  isSubmitting = signal<boolean>(false);
  amenities = signal<string[]>([]);

  hotelForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    stars: [3, Validators.required],
    price: [100, [Validators.required, Validators.min(1)]],
    location: [''],
    description: ['', Validators.required],
    images: this.fb.array([]),
    roomTypes: this.fb.array([])
  });

  get imagesArray(): FormArray {
    return this.hotelForm.get('images') as FormArray;
  }

  get roomTypesArray(): FormArray {
    return this.hotelForm.get('roomTypes') as FormArray;
  }

  ngOnInit() {
    if (this.hotel) {
      this.hotelForm.patchValue({
        name: this.hotel.name,
        stars: this.hotel.stars,
        price: this.hotel.price,
        location: this.hotel.location || '',
        description: this.hotel.description
      });

      this.hotel.images?.forEach(img => this.addImage(img));
      this.hotel.roomTypes?.forEach(room => this.addRoomType(room));
      this.amenities.set(this.hotel.amenities || []);
    } else {
      this.addImage();
    }
  }

  addImage(url: string = '') {
    this.imagesArray.push(this.fb.control(url));
  }

  removeImage(index: number) {
    this.imagesArray.removeAt(index);
  }

  addAmenity(amenity: string) {
    if (amenity.trim() && !this.amenities().includes(amenity.trim())) {
      this.amenities.set([...this.amenities(), amenity.trim()]);
    }
  }

  removeAmenity(index: number) {
    const current = this.amenities();
    current.splice(index, 1);
    this.amenities.set([...current]);
  }

  addRoomType(room?: { name: string; price: number; capacity: number }) {
    this.roomTypesArray.push(this.fb.group({
      name: [room?.name || '', Validators.required],
      price: [room?.price || 100, [Validators.required, Validators.min(1)]],
      capacity: [room?.capacity || 2, [Validators.required, Validators.min(1)]]
    }));
  }

  removeRoomType(index: number) {
    this.roomTypesArray.removeAt(index);
  }

  async onSubmit() {
    if (!this.hotelForm.valid) return;

    this.isSubmitting.set(true);
    
    const hotelData = {
      ...this.hotelForm.value,
      images: this.imagesArray.value.filter((url: string) => url.trim()),
      amenities: this.amenities(),
      roomTypes: this.roomTypesArray.value
    };

    try {
      if (this.hotel) {
        await this.hotelService.updateHotel(this.hotel.id, hotelData);
        this.snackBar.open('Hotel updated successfully!', 'Close', { duration: 3000 });
      } else {
        await this.hotelService.addHotel(hotelData);
        this.snackBar.open('Hotel added successfully!', 'Close', { duration: 3000 });
      }
      this.hotelSaved.emit();
    } catch (error: any) {
      this.snackBar.open(error.message || 'Failed to save hotel', 'Close', { duration: 3000 });
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
