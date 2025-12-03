import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RatingService } from '../../services/rating.service';

@Component({
  selector: 'app-rating-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSnackBarModule, MatProgressSpinnerModule],
  template: `
    <div class="rating-form-container">
      <h3>Write a Review</h3>
      <form [formGroup]="ratingForm" (ngSubmit)="onSubmit()">
        <div class="star-selector">
          <span class="label">Your Rating:</span>
          <div class="stars">
            <mat-icon *ngFor="let star of [1,2,3,4,5]"
              [class.filled]="star <= selectedStars()"
              (click)="setRating(star)"
              (mouseenter)="hoveredStar.set(star)"
              (mouseleave)="hoveredStar.set(0)">
              {{ star <= (hoveredStar() || selectedStars()) ? 'star' : 'star_border' }}
            </mat-icon>
          </div>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Your Review</mat-label>
          <textarea matInput formControlName="comment" rows="4" placeholder="Share your experience..."></textarea>
          <mat-error *ngIf="ratingForm.get('comment')?.hasError('required')">Please write a comment</mat-error>
          <mat-error *ngIf="ratingForm.get('comment')?.hasError('minlength')">Comment must be at least 10 characters</mat-error>
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit" [disabled]="!ratingForm.valid || isSubmitting()">
          <mat-spinner diameter="20" *ngIf="isSubmitting()"></mat-spinner>
          <span *ngIf="!isSubmitting()">Submit Review</span>
        </button>
      </form>
    </div>
  `,
  styles: [`
    .rating-form-container { background: #f9f9f9; padding: 24px; border-radius: 8px; }
    h3 { margin-bottom: 16px; color: #333; }
    .star-selector { margin-bottom: 16px; }
    .star-selector .label { display: block; margin-bottom: 8px; color: #666; }
    .stars { display: flex; gap: 4px; }
    .stars mat-icon { cursor: pointer; color: #ccc; font-size: 32px; width: 32px; height: 32px; transition: color 0.2s, transform 0.2s; }
    .stars mat-icon:hover { transform: scale(1.1); }
    .stars mat-icon.filled { color: #ffc107; }
    .full-width { width: 100%; }
    button { margin-top: 8px; }
  `]
})
export class RatingFormComponent {
  @Input() hotelId!: string;
  @Output() ratingSubmitted = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private ratingService = inject(RatingService);
  private snackBar = inject(MatSnackBar);

  selectedStars = signal<number>(0);
  hoveredStar = signal<number>(0);
  isSubmitting = signal<boolean>(false);

  ratingForm: FormGroup = this.fb.group({
    stars: [0, [Validators.required, Validators.min(1)]],
    comment: ['', [Validators.required, Validators.minLength(10)]]
  });

  setRating(stars: number) {
    this.selectedStars.set(stars);
    this.ratingForm.patchValue({ stars });
  }

  async onSubmit() {
    if (!this.ratingForm.valid) { this.ratingForm.markAllAsTouched(); return; }
    this.isSubmitting.set(true);
    try {
      await this.ratingService.addRating(this.hotelId, this.ratingForm.value);
      this.snackBar.open('Review submitted successfully!', 'Close', { duration: 3000 });
      this.ratingForm.reset();
      this.selectedStars.set(0);
      this.ratingSubmitted.emit();
    } catch (error: any) {
      this.snackBar.open(error.message || 'Failed to submit review', 'Close', { duration: 3000 });
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
