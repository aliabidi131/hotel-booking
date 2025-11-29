export interface Rating {
  id: string;
  hotelId: string;
  userId: string;
  userName?: string;
  stars: number;
  comment: string;
  date: Date;
  createdAt?: Date;
}

export interface RatingFormData {
  stars: number;
  comment: string;
}
