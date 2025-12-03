import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { HotelService } from '../../services/hotel.service';
import { Hotel, HotelFilter } from '../../models/hotel.model';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatSelectModule, MatInputModule, MatChipsModule
  ],
  template: `
    <div class="hotel-list-container container">
      <h1 class="page-title">Browse Hotels</h1>

      <div class="filters-section">
        <mat-card class="filters-card">
          <mat-card-content>
            <div class="filters-grid">
              <mat-form-field appearance="outline">
                <mat-label>Sort By</mat-label>
                <mat-select [(value)]="sortBy" (selectionChange)="applyFilters()">
                  <mat-option value="">Default</mat-option>
                  <mat-option value="price-asc">Price: Low to High</mat-option>
                  <mat-option value="price-desc">Price: High to Low</mat-option>
                  <mat-option value="stars-desc">Stars: High to Low</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Min Stars</mat-label>
                <mat-select [(value)]="minStars" (selectionChange)="applyFilters()">
                  <mat-option [value]="0">Any</mat-option>
                  <mat-option [value]="3">3+ Stars</mat-option>
                  <mat-option [value]="4">4+ Stars</mat-option>
                  <mat-option [value]="5">5 Stars</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Max Price</mat-label>
                <input matInput type="number" [(ngModel)]="maxPrice" (change)="applyFilters()">
              </mat-form-field>

              <button mat-stroked-button color="primary" (click)="resetFilters()">
                <mat-icon>refresh</mat-icon> Reset
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="results-info">
        <p>Showing {{ filteredHotels().length }} hotels</p>
      </div>

      <div class="card-grid">
        <mat-card class="hotel-card" *ngFor="let hotel of filteredHotels()">
          <img mat-card-image [src]="hotel.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'" [alt]="hotel.name">
          <mat-card-content>
            <h3 class="hotel-name">{{ hotel.name }}</h3>
            <div class="hotel-info">
              <div class="star-rating">
                <mat-icon *ngFor="let s of getStarsArray(hotel.stars)">star</mat-icon>
                <mat-icon *ngFor="let s of getEmptyStarsArray(hotel.stars)">star_border</mat-icon>
              </div>
              <p class="location" *ngIf="hotel.location">
                <mat-icon>location_on</mat-icon> {{ hotel.location }}
              </p>
            </div>
            <p class="price">\${{ hotel.price }} <span class="per-night">/ night</span></p>
            <p class="description">{{ hotel.description | slice:0:120 }}...</p>
          </mat-card-content>
          <mat-card-actions>
            <a mat-button color="primary" [routerLink]="['/hotels', hotel.id]">View Details</a>
            <a mat-raised-button color="accent" [routerLink]="['/hotels', hotel.id]">Book Now</a>
          </mat-card-actions>
        </mat-card>

        <div class="no-results" *ngIf="filteredHotels().length === 0">
          <mat-icon>search_off</mat-icon>
          <p>No hotels found matching your criteria.</p>
          <button mat-raised-button color="primary" (click)="resetFilters()">Clear Filters</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hotel-list-container { padding-top: 84px; }
    .filters-section { margin-bottom: 24px; }
    .filters-card { background: white; }
    .filters-grid { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; }
    .filters-grid mat-form-field { flex: 1; min-width: 150px; }
    .results-info { margin-bottom: 16px; color: #666; }
    .hotel-card { transition: transform 0.2s, box-shadow 0.2s; }
    .hotel-card:hover { transform: translateY(-4px); box-shadow: 0 8px 16px rgba(0,0,0,0.15); }
    .hotel-card img { height: 200px; object-fit: cover; }
    .hotel-name { font-size: 1.25rem; margin: 16px 0 8px; color: #333; }
    .star-rating { color: #ffc107; display: flex; margin-bottom: 4px; }
    .star-rating mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .location { display: flex; align-items: center; gap: 4px; color: #666; font-size: 0.875rem; }
    .location mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .price { font-size: 1.5rem; color: #4caf50; font-weight: 500; margin: 8px 0; }
    .per-night { font-size: 0.875rem; color: #666; }
    .description { color: #666; line-height: 1.5; margin-bottom: 12px; }
    .no-results { grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: white; border-radius: 8px; }
    .no-results mat-icon { font-size: 64px; width: 64px; height: 64px; color: #ccc; margin-bottom: 16px; }
    .no-results p { color: #666; margin-bottom: 24px; }
    @media (max-width: 768px) { .filters-grid { flex-direction: column; } .filters-grid mat-form-field { width: 100%; } }
  `]
})
export class HotelListComponent implements OnInit {
  private hotelService = inject(HotelService);

  allHotels = signal<Hotel[]>([]);
  filteredHotels = signal<Hotel[]>([]);

  sortBy: string = '';
  minStars: number = 0;
  maxPrice: number | undefined;

  ngOnInit() {
    this.hotelService.getHotels().subscribe(hotels => {
      this.allHotels.set(hotels);
      this.applyFilters();
    });
  }

  applyFilters() {
    const filter: HotelFilter = {
      minStars: this.minStars || undefined,
      maxPrice: this.maxPrice,
      sortBy: this.sortBy as HotelFilter['sortBy'] || undefined
    };
    this.hotelService.getFilteredHotels(filter).subscribe(hotels => {
      this.filteredHotels.set(hotels);
    });
  }

  resetFilters() {
    this.sortBy = '';
    this.minStars = 0;
    this.maxPrice = undefined;
    this.applyFilters();
  }

  getStarsArray(stars: number): number[] { return Array(stars).fill(0); }
  getEmptyStarsArray(stars: number): number[] { return Array(5 - stars).fill(0); }
}
