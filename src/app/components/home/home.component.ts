import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HotelService } from '../../services/hotel.service';
import { Hotel } from '../../models/hotel.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="home-container">
      <section class="hero">
        <div class="hero-content">
          <h1>Find Your Perfect Stay</h1>
          <p>Discover amazing hotels at the best prices</p>
          <a mat-raised-button color="accent" routerLink="/hotels" class="cta-button">
            Browse Hotels
          </a>
        </div>
      </section>

      <section class="featured-hotels container">
        <h2 class="section-title">Featured Hotels</h2>
        <div class="card-grid">
          <mat-card class="hotel-card" *ngFor="let hotel of featuredHotels()">
            <img mat-card-image [src]="hotel.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'" [alt]="hotel.name">
            <mat-card-content>
              <h3 class="hotel-name">{{ hotel.name }}</h3>
              <div class="star-rating">
                <mat-icon *ngFor="let star of getStarsArray(hotel.stars)">star</mat-icon>
              </div>
              <p class="price">\${{ hotel.price }} <span class="per-night">/ night</span></p>
              <p class="description">{{ hotel.description | slice:0:100 }}...</p>
            </mat-card-content>
            <mat-card-actions>
              <a mat-button color="primary" [routerLink]="['/hotels', hotel.id]">View Details</a>
              <a mat-raised-button color="accent" [routerLink]="['/hotels', hotel.id]">Book Now</a>
            </mat-card-actions>
          </mat-card>
          <p class="no-hotels" *ngIf="featuredHotels().length === 0">No hotels available.</p>
        </div>
      </section>

      <section class="features container">
        <h2 class="section-title">Why Choose Us</h2>
        <div class="features-grid">
          <div class="feature-item">
            <mat-icon color="primary">verified</mat-icon>
            <h3>Best Price Guarantee</h3>
            <p>We offer the most competitive prices</p>
          </div>
          <div class="feature-item">
            <mat-icon color="primary">support_agent</mat-icon>
            <h3>24/7 Support</h3>
            <p>Our team is always ready to help</p>
          </div>
          <div class="feature-item">
            <mat-icon color="primary">security</mat-icon>
            <h3>Secure Booking</h3>
            <p>Your data is always protected</p>
          </div>
          <div class="feature-item">
            <mat-icon color="primary">star</mat-icon>
            <h3>Top Rated Hotels</h3>
            <p>Only the best hotels on our platform</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container { padding-top: 64px; }
    .hero {
      background: linear-gradient(135deg, #3f51b5 0%, #1a237e 100%);
      color: white;
      padding: 80px 20px;
      text-align: center;
    }
    .hero-content h1 { font-size: 3rem; margin-bottom: 16px; }
    .hero-content p { font-size: 1.25rem; margin-bottom: 32px; opacity: 0.9; }
    .section-title { text-align: center; margin: 48px 0 32px; font-size: 2rem; }
    .hotel-card { transition: transform 0.2s, box-shadow 0.2s; }
    .hotel-card:hover { transform: translateY(-4px); box-shadow: 0 8px 16px rgba(0,0,0,0.15); }
    .hotel-card img { height: 200px; object-fit: cover; }
    .hotel-name { font-size: 1.25rem; margin: 16px 0 8px; }
    .star-rating { color: #ffc107; display: flex; margin-bottom: 8px; }
    .star-rating mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .price { font-size: 1.5rem; color: #4caf50; font-weight: 500; margin: 8px 0; }
    .per-night { font-size: 0.875rem; color: #666; }
    .description { color: #666; line-height: 1.5; }
    .no-hotels { text-align: center; grid-column: 1 / -1; padding: 40px; color: #666; }
    .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 32px; padding: 20px; }
    .feature-item { text-align: center; padding: 32px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .feature-item mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 16px; }
    .feature-item h3 { margin-bottom: 8px; color: #333; }
    .feature-item p { color: #666; }
    @media (max-width: 768px) {
      .hero-content h1 { font-size: 2rem; }
      .hero-content p { font-size: 1rem; }
    }
  `]
})
export class HomeComponent implements OnInit {
  private hotelService = inject(HotelService);
  featuredHotels = signal<Hotel[]>([]);

  ngOnInit() {
    this.hotelService.getHotels().subscribe(hotels => {
      this.featuredHotels.set(hotels.slice(0, 6));
    });
  }

  getStarsArray(stars: number): number[] {
    return Array(stars).fill(0);
  }
}
