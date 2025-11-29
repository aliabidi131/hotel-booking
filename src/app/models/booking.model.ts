export interface Booking {
  id: string;
  userId: string;
  hotelId: string;
  hotelName?: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  roomType: string;
  totalPrice?: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
  updatedAt?: Date;
}

export interface BookingFormData {
  checkIn: Date;
  checkOut: Date;
  guests: number;
  roomType: string;
}
