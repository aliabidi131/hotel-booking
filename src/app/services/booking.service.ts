// ============================================
// 🏨 BOOKING SERVICE - With Email Notifications
// ============================================
import { Injectable, inject } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';
import { Booking, BookingFormData } from '../models/booking.model';

interface EmailResult {
  success: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private supabase = inject(SupabaseService).supabase;
  private authService = inject(AuthService);

  /**
   * Get all bookings (admin)
   */
  getAllBookings(): Observable<Booking[]> {
    return from(
      this.supabase
        .from('bookings')
        .select('*')
        .order('createdAt', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data as Booking[]) || [];
      })
    );
  }

  /**
   * Get bookings for a specific user
   */
  getUserBookings(userId: string): Observable<Booking[]> {
    return from(
      this.supabase
        .from('bookings')
        .select('*')
        .eq('userId', userId)
        .order('createdAt', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data as Booking[]) || [];
      })
    );
  }

  /**
   * Get bookings for a specific hotel
   */
  getHotelBookings(hotelId: string): Observable<Booking[]> {
    return from(
      this.supabase
        .from('bookings')
        .select('*')
        .eq('hotelId', hotelId)
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data as Booking[]) || [];
      })
    );
  }

  /**
   * Create a new booking with email notifications
   * Sends email to both admin and guest
   */
  async createBooking(
    hotelId: string,
    hotelName: string,
    formData: BookingFormData,
    totalPrice: number
  ): Promise<{ success: boolean; bookingId?: string; message: string }> {
    const user = this.authService.currentUser();
    if (!user) {
      return { success: false, message: 'User must be logged in to create a booking' };
    }

    try {
      // 1. Create booking in database
      const bookingData = {
        userId: user.uid,
        hotelId,
        hotelName,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: formData.guests,
        roomType: formData.roomType,
        totalPrice,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const { data, error } = await this.supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (error) {
        console.error('Error creating booking:', error);
        return { success: false, message: 'Failed to create booking: ' + error.message };
      }

      const bookingId = data.id;

      // 2. Send email notifications via Edge Function
      const emailResult = await this.sendBookingNotification({
        bookingId,
        userEmail: user.email,
        userName: user.displayName || user.email.split('@')[0],
        hotelName,
        checkIn: formData.checkIn.toString(),
        checkOut: formData.checkOut.toString(),
        guests: formData.guests,
        roomType: formData.roomType,
        totalPrice
      });

      if (!emailResult.success) {
        console.warn('Email notification failed, but booking was created:', emailResult.error);
      }

      return { 
        success: true, 
        bookingId,
        message: 'Booking created successfully! Check your email for confirmation.' 
      };

    } catch (error: any) {
      console.error('Booking error:', error);
      return { success: false, message: 'Error: ' + error.message };
    }
  }

  /**
   * Call Edge Function to send booking notifications
   */
  private async sendBookingNotification(data: {
    bookingId: string;
    userEmail: string;
    userName: string;
    hotelName: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    roomType: string;
    totalPrice: number;
  }): Promise<EmailResult> {
    try {
      const { data: result, error } = await this.supabase.functions.invoke('send-email', {
        body: {
          type: 'booking',
          ...data
        }
      });

      if (error) {
        console.error('Booking email error:', error);
        return { success: false, error: error.message };
      }

      console.log('Booking notification sent:', result);
      return { success: true };

    } catch (error: any) {
      console.error('Email send error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update booking status
   */
  async updateBookingStatus(id: string, status: Booking['status']): Promise<void> {
    const { error } = await this.supabase
      .from('bookings')
      .update({ 
        status, 
        updatedAt: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Cancel a booking
   */
  async cancelBooking(id: string): Promise<void> {
    await this.updateBookingStatus(id, 'cancelled');
  }

  /**
   * Confirm a booking
   */
  async confirmBooking(id: string): Promise<void> {
    await this.updateBookingStatus(id, 'confirmed');
  }

  /**
   * Delete a booking
   */
  async deleteBooking(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Calculate total price
   */
  calculateTotalPrice(
    pricePerNight: number,
    checkIn: Date,
    checkOut: Date
  ): number {
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return pricePerNight * Math.max(diffDays, 1);
  }

  /**
   * Get booking by ID
   */
  async getBookingById(id: string): Promise<Booking | null> {
    const { data, error } = await this.supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching booking:', error);
      return null;
    }

    return data as Booking;
  }
}
