import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Rating } from '../../models/rating.model';

@Component({
  selector: 'app-rating-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="no-ratings" *ngIf="ratings.length === 0">
      <mat-icon>rate_review</mat-icon>
      <p>No reviews yet. Be the first to review!</p>
    </div>

    <div class="ratings-list" *ngIf="ratings.length > 0">
      <mat-card class="rating-card" *ngFor="let rating of ratings">
        <mat-card-header>
          <mat-icon mat-card-avatar>account_circle</mat-icon>
          <mat-card-title>{{ rating.userName || 'Anonymous' }}</mat-card-title>
          <mat-card-subtitle>{{ formatDate(rating.date) }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="star-rating">
            <mat-icon *ngFor="let s of getStarsArray(rating.stars)">star</mat-icon>
            <mat-icon *ngFor="let s of getEmptyStarsArray(rating.stars)">star_border</mat-icon>
          </div>
          <p class="comment">{{ rating.comment }}</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .no-ratings { text-align: center; padding: 40px 20px; color: #666; }
    .no-ratings mat-icon { font-size: 48px; width: 48px; height: 48px; color: #ccc; margin-bottom: 16px; }
    .ratings-list { display: flex; flex-direction: column; gap: 16px; }
    .rating-card { transition: box-shadow 0.2s; }
    .rating-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    mat-card-header mat-icon[mat-card-avatar] { font-size: 40px; width: 40px; height: 40px; color: #3f51b5; }
    .star-rating { display: flex; margin-bottom: 12px; color: #ffc107; }
    .star-rating mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .comment { color: #444; line-height: 1.6; }
  `]
})
export class RatingListComponent {
  @Input() ratings: Rating[] = [];

  formatDate(date: any): string {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  getStarsArray(stars: number): number[] { return Array(stars).fill(0); }
  getEmptyStarsArray(stars: number): number[] { return Array(5 - stars).fill(0); }
}
