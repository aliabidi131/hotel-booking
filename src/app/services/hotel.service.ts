// src/app/services/hotel.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { Hotel, HotelFilter } from '../models/hotel.model';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private supabase = inject(SupabaseService).supabase;

  getHotels(): Observable<Hotel[]> {
    return from(
      this.supabase
        .from('hotels')
        .select('*')
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data as Hotel[]) || [];
      })
    );
  }

  getHotelById(id: string): Observable<Hotel> {
    return from(
      this.supabase
        .from('hotels')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Hotel;
      })
    );
  }

  getFilteredHotels(filter: HotelFilter): Observable<Hotel[]> {
    return new Observable(subscriber => {
      this.getHotels().subscribe(hotels => {
        subscriber.next(this.applyFilters(hotels, filter));
      });
    });
  }

  private applyFilters(hotels: Hotel[], filter: HotelFilter): Hotel[] {
    let result = [...hotels];

    if (filter.minStars !== undefined) {
      result = result.filter(h => h.stars >= filter.minStars!);
    }

    if (filter.maxStars !== undefined) {
      result = result.filter(h => h.stars <= filter.maxStars!);
    }

    if (filter.minPrice !== undefined) {
      result = result.filter(h => h.price >= filter.minPrice!);
    }

    if (filter.maxPrice !== undefined) {
      result = result.filter(h => h.price <= filter.maxPrice!);
    }

    if (filter.sortBy) {
      switch (filter.sortBy) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'stars-asc':
          result.sort((a, b) => a.stars - b.stars);
          break;
        case 'stars-desc':
          result.sort((a, b) => b.stars - a.stars);
          break;
      }
    }

    return result;
  }

  async addHotel(hotel: Omit<Hotel, 'id'>): Promise<string> {
    const hotelData = {
      ...hotel,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const { data, error } = await this.supabase
      .from('hotels')
      .insert(hotelData)
      .select()
      .single();

    if (error) throw error;
    return data.id;
  }

  async updateHotel(id: string, hotel: Partial<Hotel>): Promise<void> {
    const { error } = await this.supabase
      .from('hotels')
      .update({
        ...hotel,
        updatedAt: new Date()
      })
      .eq('id', id);

    if (error) throw error;
  }

  async deleteHotel(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('hotels')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
