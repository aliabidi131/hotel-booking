export interface Hotel {
  id: string;
  name: string;
  stars: number;
  price: number;
  description: string;
  images: string[];
  location?: string;
  amenities?: string[];
  roomTypes?: RoomType[];
  coordinates?: Coordinates;
  address?: string;
  phone?: string;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface RoomType {
  name: string;
  price: number;
  capacity: number;
}

export interface HotelFilter {
  minStars?: number;
  maxStars?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'stars-asc' | 'stars-desc';
}
