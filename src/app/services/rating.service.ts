// src/app/services/rating.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { AuthService } from './auth.service';
import { Rating, RatingFormData } from '../models/rating.model';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private supabase = inject(SupabaseService).supabase;
  private authService = inject(AuthService);

  getAllRatings(): Observable<Rating[]> {
    return from(
      this.supabase
        .from('ratings')
        .select('*')
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data as Rating[]) || [];
      })
    );
  }

  getHotelRatings(hotelId: string): Observable<Rating[]> {
    return from(
      this.supabase
        .from('ratings')
        .select('*')
        .eq('hotelId', hotelId)
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data as Rating[]) || [];
      })
    );
  }

  getUserRatings(userId: string): Observable<Rating[]> {
    return from(
      this.supabase
        .from('ratings')
        .select('*')
        .eq('userId', userId)
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data as Rating[]) || [];
      })
    );
  }

  getAverageRating(hotelId: string): Observable<number> {
    return this.getHotelRatings(hotelId).pipe(
      map(ratings => {
        if (ratings.length === 0) return 0;
        const sum = ratings.reduce((acc, r) => acc + r.stars, 0);
        return Math.round((sum / ratings.length) * 10) / 10;
      })
    );
  }

  async addRating(hotelId: string, formData: RatingFormData): Promise<string> {
    const user = this.authService.currentUser();
    if (!user) throw new Error('User must be logged in to add a rating');

    const rating: Omit<Rating, 'id'> = {
      hotelId,
      userId: user.uid,
      userName: user.displayName || user.email,
      stars: formData.stars,
      comment: formData.comment,
      date: new Date(),
      createdAt: new Date()
    };

    const { data, error } = await this.supabase
      .from('ratings')
      .insert(rating)
      .select()
      .single();

    if (error) throw error;
    return data.id;
  }

  async updateRating(id: string, formData: RatingFormData): Promise<void> {
    const { error } = await this.supabase
      .from('ratings')
      .update({
        stars: formData.stars,
        comment: formData.comment
      })
      .eq('id', id);

    if (error) throw error;
  }

  async deleteRating(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('ratings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  hasUserRated(hotelId: string): Observable<boolean> {
    const user = this.authService.currentUser();
    if (!user) return new Observable(sub => sub.next(false));

    return this.getHotelRatings(hotelId).pipe(
      map(ratings => ratings.some(r => r.userId === user.uid))
    );
  }
}
