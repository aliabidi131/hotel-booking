import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HotelService } from '../../services/hotel.service';
import { RatingService } from '../../services/rating.service';
import { AuthService } from '../../services/auth.service';
import { Hotel } from '../../models/hotel.model';
import { Rating } from '../../models/rating.model';
import { BookingFormComponent } from '../booking-form/booking-form.component';
import { RatingFormComponent } from '../rating-form/rating-form.component';
import { RatingListComponent } from '../rating-list/rating-list.component';

@Component({
  selector: 'app-hotel-detail',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule,
    MatTabsModule, MatChipsModule, MatDividerModule, MatProgressSpinnerModule,
    BookingFormComponent, RatingFormComponent, RatingListComponent
  ],
  template: `
    <div class="hotel-detail-container container">
      <div class="loading" *ngIf="isLoading()">
        <mat-spinner></mat-spinner>
      </div>

      <ng-container *ngIf="!isLoading() && hotel()">
        <div class="hotel-header">
          <div class="header-content">
            <h1>{{ hotel()!.name }}</h1>
            <div class="hotel-meta">
              <div class="star-rating">
                <mat-icon *ngFor="let s of getStarsArray(hotel()!.stars)">star</mat-icon>
              </div>
              <span class="avg-rating" *ngIf="averageRating() > 0">
                <mat-icon>thumb_up</mat-icon> {{ averageRating() }} ({{ ratings().length }} reviews)
              </span>
              <span class="location" *ngIf="hotel()!.location">
                <mat-icon>location_on</mat-icon> {{ hotel()!.location }}
              </span>
            </div>
          </div>
          <div class="header-price">
            <span class="price">\${{ hotel()!.price }}</span>
            <span class="per-night">per night</span>
          </div>
        </div>

        <div class="hotel-gallery">
          <div class="main-image">
            <img [src]="selectedImage() || hotel()!.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'" [alt]="hotel()!.name">
          </div>
          <div class="thumbnail-list" *ngIf="hotel()!.images.length > 1">
            <img *ngFor="let image of hotel()!.images; let i = index"
              [src]="image" 
              [alt]="hotel()!.name"
              [class.active]="selectedImage() === image"
              (click)="selectImage(image)">
          </div>
        </div>

        <div class="hotel-content">
          <div class="content-main">
            <mat-tab-group>
              <mat-tab label="Description">
                <div class="tab-content">
                  <p class="description">{{ hotel()!.description }}</p>
                  
                  <ng-container *ngIf="hotel()!.amenities?.length">
                    <h3>Amenities</h3>
                    <div class="amenities-list">
                      <mat-chip *ngFor="let amenity of hotel()!.amenities">
                        <mat-icon>check_circle</mat-icon> {{ amenity }}
                      </mat-chip>
                    </div>
                  </ng-container>

                  <ng-container *ngIf="hotel()!.roomTypes?.length">
                    <h3>Room Types</h3>
                    <div class="room-types">
                      <mat-card class="room-card" *ngFor="let room of hotel()!.roomTypes">
                        <mat-card-content>
                          <h4>{{ room.name }}</h4>
                          <p>Capacity: {{ room.capacity }} guests</p>
                          <p class="room-price">\${{ room.price }} / night</p>
                        </mat-card-content>
                      </mat-card>
                    </div>
                  </ng-container>
                </div>
              </mat-tab>

              <mat-tab label="Reviews ({{ ratings().length }})">
                <div class="tab-content">
                  <ng-container *ngIf="authService.isAuthenticated() && !hasUserRated()">
                    <app-rating-form [hotelId]="hotelId" (ratingSubmitted)="onRatingSubmitted()"></app-rating-form>
                    <mat-divider class="my-4"></mat-divider>
                  </ng-container>
                  <app-rating-list [ratings]="ratings()"></app-rating-list>
                </div>
              </mat-tab>
            </mat-tab-group>
          </div>

          <div class="content-sidebar">
            <mat-card class="booking-card">
              <mat-card-header>
                <mat-card-title>Book This Hotel</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ng-container *ngIf="authService.isAuthenticated(); else loginPrompt">
                  <app-booking-form [hotel]="hotel()!" (bookingCreated)="onBookingCreated()"></app-booking-form>
                </ng-container>
                <ng-template #loginPrompt>
                  <div class="login-prompt">
                    <p>Please log in to make a booking</p>
                    <a mat-raised-button color="primary" routerLink="/login">Login to Book</a>
                  </div>
                </ng-template>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </ng-container>

      <div class="not-found" *ngIf="!isLoading() && !hotel()">
        <mat-icon>error_outline</mat-icon>
        <h2>Hotel Not Found</h2>
        <p>The hotel you're looking for doesn't exist.</p>
        <a mat-raised-button color="primary" routerLink="/hotels">Browse Hotels</a>
      </div>
    </div>
  `,
  styles: [`
    .hotel-detail-container { padding-top: 84px; }
    .loading { display: flex; justify-content: center; padding: 60px; }
    .hotel-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
    .hotel-header h1 { font-size: 2rem; margin-bottom: 8px; }
    .hotel-meta { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; }
    .star-rating { color: #ffc107; display: flex; }
    .avg-rating, .location { display: flex; align-items: center; gap: 4px; color: #666; }
    .header-price { text-align: right; }
    .header-price .price { display: block; font-size: 2rem; color: #4caf50; font-weight: 500; }
    .header-price .per-night { color: #666; }
    .hotel-gallery { margin-bottom: 24px; }
    .main-image img { width: 100%; height: 400px; object-fit: cover; border-radius: 8px; }
    .thumbnail-list { display: flex; gap: 8px; margin-top: 12px; overflow-x: auto; }
    .thumbnail-list img { width: 100px; height: 70px; object-fit: cover; border-radius: 4px; cursor: pointer; opacity: 0.7; transition: opacity 0.2s; }
    .thumbnail-list img:hover, .thumbnail-list img.active { opacity: 1; }
    .hotel-content { display: grid; grid-template-columns: 1fr 350px; gap: 24px; }
    .tab-content { padding: 24px 0; }
    .description { line-height: 1.8; color: #444; }
    h3 { margin: 24px 0 16px; color: #333; }
    .amenities-list { display: flex; flex-wrap: wrap; gap: 8px; }
    .room-types { display: grid; gap: 16px; }
    .room-card h4 { margin: 0 0 8px; }
    .room-price { color: #4caf50; font-weight: 500; font-size: 1.1rem; }
    .booking-card { position: sticky; top: 84px; }
    .login-prompt { text-align: center; padding: 20px; }
    .login-prompt p { margin-bottom: 16px; color: #666; }
    .my-4 { margin: 24px 0; }
    .not-found { text-align: center; padding: 60px 20px; }
    .not-found mat-icon { font-size: 64px; width: 64px; height: 64px; color: #ccc; }
    .not-found h2 { margin: 16px 0 8px; }
    .not-found p { color: #666; margin-bottom: 24px; }
    @media (max-width: 900px) {
      .hotel-content { grid-template-columns: 1fr; }
      .booking-card { position: static; }
      .main-image img { height: 250px; }
    }
  `]
})
export class HotelDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private hotelService = inject(HotelService);
  private ratingService = inject(RatingService);
  authService = inject(AuthService);

  hotelId!: string;
  hotel = signal<Hotel | null>(null);
  ratings = signal<Rating[]>([]);
  averageRating = signal<number>(0);
  selectedImage = signal<string>('');
  isLoading = signal<boolean>(true);
  hasUserRated = signal<boolean>(false);

  ngOnInit() {
    this.hotelId = this.route.snapshot.paramMap.get('id')!;
    this.loadHotel();
    this.loadRatings();
    this.checkUserRating();
  }

  loadHotel() {
    this.hotelService.getHotelById(this.hotelId).subscribe({
      next: (hotel) => {
        this.hotel.set(hotel);
        if (hotel?.images?.length) { this.selectedImage.set(hotel.images[0]); }
        this.isLoading.set(false);
      },
      error: () => { this.isLoading.set(false); }
    });
  }

  loadRatings() {
    this.ratingService.getHotelRatings(this.hotelId).subscribe(ratings => this.ratings.set(ratings));
    this.ratingService.getAverageRating(this.hotelId).subscribe(avg => this.averageRating.set(avg));
  }

  checkUserRating() {
    this.ratingService.hasUserRated(this.hotelId).subscribe(hasRated => this.hasUserRated.set(hasRated));
  }

  selectImage(image: string) { this.selectedImage.set(image); }
  onBookingCreated() {}
  onRatingSubmitted() { this.checkUserRating(); this.loadRatings(); }
  getStarsArray(stars: number): number[] { return Array(stars).fill(0); }
}
