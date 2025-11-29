// src/app/services/seed.service.ts
import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class SeedService {
  private supabase = inject(SupabaseService).supabase;

  private sampleHotels = [
    {
      name: 'Grand Hotel Paradise',
      stars: 5,
      price: 299,
      description: 'Experience luxury at its finest at Grand Hotel Paradise. Our 5-star hotel offers breathtaking views, world-class amenities, and impeccable service. Located in the heart of the city, we provide easy access to major attractions while offering a peaceful retreat from the urban bustle. Our rooms feature designer furnishings, marble bathrooms, and panoramic city views.',
      location: 'New York, USA',
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'
      ],
      amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Room Service', 'Concierge', 'Valet Parking'],
      roomTypes: [
        { name: 'Standard Room', price: 299, capacity: 2 },
        { name: 'Deluxe Room', price: 449, capacity: 3 },
        { name: 'Executive Suite', price: 599, capacity: 4 },
        { name: 'Presidential Suite', price: 999, capacity: 6 }
      ]
    },
    {
      name: 'Seaside Resort & Spa',
      stars: 4,
      price: 189,
      description: 'Escape to tranquility at Seaside Resort & Spa. Nestled along the pristine coastline, our resort offers stunning ocean views from every room. Enjoy direct beach access, water sports, and our award-winning spa. Perfect for romantic getaways and family vacations alike. Wake up to the sound of waves and enjoy spectacular sunsets from your private balcony.',
      location: 'Miami Beach, USA',
      images: [
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800',
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'
      ],
      amenities: ['Free WiFi', 'Beach Access', 'Pool', 'Spa', 'Restaurant', 'Water Sports', 'Kids Club', 'Bar'],
      roomTypes: [
        { name: 'Garden View Room', price: 189, capacity: 2 },
        { name: 'Ocean View Room', price: 259, capacity: 2 },
        { name: 'Beach Front Suite', price: 389, capacity: 4 },
        { name: 'Villa', price: 599, capacity: 6 }
      ]
    },
    {
      name: 'Mountain Lodge Retreat',
      stars: 4,
      price: 159,
      description: 'Discover the magic of the mountains at Mountain Lodge Retreat. Our cozy alpine lodge offers spectacular mountain views, ski-in/ski-out access, and authentic rustic charm. After a day on the slopes, unwind by the fireplace with a glass of local wine. Experience the perfect blend of adventure and relaxation in our mountain sanctuary.',
      location: 'Aspen, Colorado, USA',
      images: [
        'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=800',
        'https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=800',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
        'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'
      ],
      amenities: ['Free WiFi', 'Ski Storage', 'Fireplace', 'Restaurant', 'Hot Tub', 'Sauna', 'Ski Rentals', 'Shuttle Service'],
      roomTypes: [
        { name: 'Cozy Room', price: 159, capacity: 2 },
        { name: 'Mountain View Room', price: 219, capacity: 2 },
        { name: 'Family Suite', price: 329, capacity: 5 },
        { name: 'Chalet', price: 499, capacity: 8 }
      ]
    },
    {
      name: 'Urban Boutique Hotel',
      stars: 3,
      price: 99,
      description: 'Experience modern comfort at Urban Boutique Hotel. Located in the trendy downtown district, our hotel puts you at the center of the action. Walk to the best restaurants, shops, and nightlife. Our stylish rooms feature contemporary design, smart technology, and all the amenities you need for a comfortable stay. Perfect for business travelers and urban explorers.',
      location: 'Los Angeles, USA',
      images: [
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
        'https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=800',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
        'https://images.unsplash.com/photo-1587874522487-fe10e954d035?w=800'
      ],
      amenities: ['Free WiFi', 'Gym', 'Business Center', 'Rooftop Bar', 'Breakfast Included', 'Bike Rentals'],
      roomTypes: [
        { name: 'Standard Room', price: 99, capacity: 2 },
        { name: 'Superior Room', price: 139, capacity: 2 },
        { name: 'Junior Suite', price: 189, capacity: 3 }
      ]
    },
    {
      name: 'Historic Palace Hotel',
      stars: 5,
      price: 399,
      description: 'Step into a world of timeless elegance at Historic Palace Hotel. This magnificent 19th-century palace has been meticulously restored to offer the ultimate in luxury accommodation. Marvel at crystal chandeliers, antique furnishings, and hand-painted ceilings while enjoying modern comforts. Our Michelin-starred restaurant and legendary afternoon tea make every moment special.',
      location: 'Paris, France',
      images: [
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
        'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
        'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'
      ],
      amenities: ['Free WiFi', 'Spa', 'Fine Dining', 'Bar', 'Concierge', 'Butler Service', 'Garden', 'Ballroom'],
      roomTypes: [
        { name: 'Classic Room', price: 399, capacity: 2 },
        { name: 'Deluxe Room', price: 549, capacity: 2 },
        { name: 'Junior Suite', price: 749, capacity: 3 },
        { name: 'Royal Suite', price: 1299, capacity: 4 }
      ]
    },
    // ============================================
    // 🇹🇳 HÔTELS TUNISIENS
    // ============================================
    {
      name: 'El Mouradi Tozeur',
      stars: 5,
      price: 120,
      description: 'Bienvenue à El Mouradi Tozeur, un oasis de luxe au cœur du Sahara tunisien. Cet hôtel 5 étoiles offre une architecture traditionnelle tunisienne avec tout le confort moderne. Profitez de vues imprenables sur les palmeraies et le désert, explorez les dunes dorées, et détendez-vous dans notre spa oriental. Une expérience inoubliable aux portes du désert.',
      location: 'Tozeur, Tunisie',
      coordinates: { lat: 33.9197, lng: 8.1339 },
      images: [
        'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800',
        'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
        'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800',
        'https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=800'
      ],
      amenities: ['Free WiFi', 'Piscine', 'Spa Oriental', 'Restaurant Traditionnel', 'Excursions Désert', 'Tennis', 'Hammam', 'Animation'],
      roomTypes: [
        { name: 'Chambre Standard', price: 120, capacity: 2 },
        { name: 'Chambre Supérieure', price: 160, capacity: 2 },
        { name: 'Suite Palmier', price: 220, capacity: 3 },
        { name: 'Suite Royale Sahara', price: 350, capacity: 4 }
      ],
      address: 'Route Touristique, 2200 Tozeur, Tunisie',
      phone: '+216 76 452 900',
      email: 'reservation.tozeur@elmouradi.com'
    },
    {
      name: 'Mövenpick Resort & Marine Spa Sousse',
      stars: 5,
      price: 150,
      description: 'Le Mövenpick Resort & Marine Spa Sousse est un havre de paix sur la côte méditerranéenne tunisienne. Situé sur une plage de sable fin, cet hôtel allie élégance contemporaine et hospitalité tunisienne. Découvrez notre spa marin primé, savourez une cuisine gastronomique, et profitez de la vue panoramique sur la mer Méditerranée. À proximité de la médina historique de Sousse.',
      location: 'Sousse, Tunisie',
      coordinates: { lat: 35.8256, lng: 10.6084 },
      images: [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'
      ],
      amenities: ['Free WiFi', 'Plage Privée', 'Spa Marin', '5 Restaurants', 'Piscines', 'Fitness', 'Kids Club', 'Sports Nautiques', 'Casino'],
      roomTypes: [
        { name: 'Chambre Classique', price: 150, capacity: 2 },
        { name: 'Chambre Vue Mer', price: 200, capacity: 2 },
        { name: 'Suite Junior', price: 280, capacity: 3 },
        { name: 'Suite Présidentielle', price: 450, capacity: 4 }
      ],
      address: 'Boulevard du 14 Janvier, 4039 Sousse, Tunisie',
      phone: '+216 73 241 999',
      email: 'resort.sousse@movenpick.com'
    },
    {
      name: 'The Mora Sahara Tozeur',
      stars: 5,
      price: 280,
      description: 'Anciennement Anantara Tozeur, The Mora Sahara est l\'adresse la plus exclusive du Sahara tunisien. Ce resort de luxe offre des villas privées avec piscine, un spa de classe mondiale, et des expériences désertiques uniques. Admirez les couchers de soleil sur les dunes depuis votre terrasse privée, dînez sous les étoiles, et vivez l\'aventure saharienne dans un confort absolu.',
      location: 'Tozeur, Tunisie',
      coordinates: { lat: 33.9289, lng: 8.1167 },
      images: [
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
        'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
        'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
        'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800'
      ],
      amenities: ['Free WiFi', 'Piscine Privée', 'Spa', 'Restaurant Gastronomique', 'Excursions 4x4', 'Balade Dromadaire', 'Yoga', 'Observatory', 'Butler Service'],
      roomTypes: [
        { name: 'Villa Oasis', price: 280, capacity: 2 },
        { name: 'Villa Palmier avec Piscine', price: 380, capacity: 2 },
        { name: 'Villa Dune avec Piscine', price: 480, capacity: 3 },
        { name: 'Royal Sahara Villa', price: 750, capacity: 4 }
      ],
      address: 'Route de Nefta, 2200 Tozeur, Tunisie',
      phone: '+216 76 454 500',
      email: 'reservations.tozeur@themorahotels.com'
    }
  ];

  private sampleBookings = [
    {
      hotelName: 'Grand Hotel Paradise',
      bookings: [
        { guestName: 'Jean Dupont', checkIn: 7, checkOut: 10, guests: 2, roomType: 'Deluxe Room', status: 'confirmed' as const },
        { guestName: 'Marie Martin', checkIn: 14, checkOut: 17, guests: 4, roomType: 'Executive Suite', status: 'pending' as const }
      ]
    },
    {
      hotelName: 'Seaside Resort & Spa',
      bookings: [
        { guestName: 'Pierre Bernard', checkIn: 3, checkOut: 8, guests: 2, roomType: 'Ocean View Room', status: 'confirmed' as const },
        { guestName: 'Sophie Leroy', checkIn: 20, checkOut: 25, guests: 6, roomType: 'Villa', status: 'pending' as const }
      ]
    },
    {
      hotelName: 'Mountain Lodge Retreat',
      bookings: [
        { guestName: 'Lucas Moreau', checkIn: 5, checkOut: 9, guests: 5, roomType: 'Family Suite', status: 'confirmed' as const }
      ]
    },
    {
      hotelName: 'Urban Boutique Hotel',
      bookings: [
        { guestName: 'Emma Petit', checkIn: 1, checkOut: 3, guests: 2, roomType: 'Superior Room', status: 'completed' as const },
        { guestName: 'Hugo Roux', checkIn: 10, checkOut: 12, guests: 1, roomType: 'Standard Room', status: 'cancelled' as const }
      ]
    },
    {
      hotelName: 'Historic Palace Hotel',
      bookings: [
        { guestName: 'Camille Fournier', checkIn: 15, checkOut: 20, guests: 2, roomType: 'Royal Suite', status: 'confirmed' as const }
      ]
    }
  ];

  private sampleRatings = [
    {
      hotelName: 'Grand Hotel Paradise',
      ratings: [
        { stars: 5, comment: 'Absolutely stunning hotel! The service was impeccable and the views were breathtaking. Will definitely return!', userName: 'John D.' },
        { stars: 5, comment: 'Best hotel experience I\'ve ever had. The spa was amazing and the restaurant exceeded expectations.', userName: 'Sarah M.' },
        { stars: 4, comment: 'Beautiful hotel with great amenities. Only minor issue was the slow elevator during peak hours.', userName: 'Michael R.' },
        { stars: 5, comment: 'The Presidential Suite was worth every penny. Pure luxury!', userName: 'Emily W.' }
      ]
    },
    {
      hotelName: 'Seaside Resort & Spa',
      ratings: [
        { stars: 5, comment: 'Perfect beach vacation! The ocean view from our room was incredible. Kids loved the pool.', userName: 'David L.' },
        { stars: 4, comment: 'Great resort with friendly staff. The beach was pristine and the spa treatments were relaxing.', userName: 'Jennifer K.' },
        { stars: 4, comment: 'Wonderful family holiday. The kids club was a lifesaver! Food could be more varied.', userName: 'Robert T.' },
        { stars: 5, comment: 'Romantic getaway perfection. The sunset dinner on the beach was magical.', userName: 'Amanda S.' }
      ]
    },
    {
      hotelName: 'Mountain Lodge Retreat',
      ratings: [
        { stars: 5, comment: 'Ski-in/ski-out is a game changer! Cozy lodge with amazing hot chocolate by the fire.', userName: 'Chris B.' },
        { stars: 4, comment: 'Beautiful mountain views and great slopes nearby. The sauna after skiing was perfect.', userName: 'Lisa P.' },
        { stars: 5, comment: 'Authentic alpine experience with modern comforts. The chalet was perfect for our group.', userName: 'Mark H.' },
        { stars: 4, comment: 'Great location and friendly staff. Restaurant food was delicious and hearty.', userName: 'Nicole F.' }
      ]
    },
    {
      hotelName: 'Urban Boutique Hotel',
      ratings: [
        { stars: 4, comment: 'Perfect location for exploring the city! Modern rooms and great rooftop bar.', userName: 'Alex G.' },
        { stars: 4, comment: 'Stylish and affordable. Loved the complimentary breakfast and bike rentals.', userName: 'Rachel V.' },
        { stars: 3, comment: 'Good value for money. Rooms are a bit small but have everything you need.', userName: 'Tom C.' },
        { stars: 5, comment: 'Best boutique hotel I\'ve stayed at. The design is so Instagram-worthy!', userName: 'Sophie L.' }
      ]
    },
    {
      hotelName: 'Historic Palace Hotel',
      ratings: [
        { stars: 5, comment: 'Like staying in a fairy tale! The palace is absolutely magnificent.', userName: 'Victoria A.' },
        { stars: 5, comment: 'The afternoon tea was the highlight of our trip. Impeccable service throughout.', userName: 'James W.' },
        { stars: 5, comment: 'Worth every euro! The Royal Suite made us feel like royalty. Unforgettable experience.', userName: 'Marie D.' },
        { stars: 4, comment: 'Stunning historic building with luxurious rooms. The restaurant deserves its Michelin star.', userName: 'Pierre B.' }
      ]
    },
    // 🇹🇳 Avis Hôtels Tunisiens
    {
      hotelName: 'El Mouradi Tozeur',
      ratings: [
        { stars: 5, comment: 'Hôtel magnifique au cœur du désert! Le hammam est exceptionnel et le personnel très accueillant.', userName: 'Ahmed B.' },
        { stars: 5, comment: 'Les excursions dans le désert organisées par l\'hôtel sont inoubliables. Coucher de soleil magique!', userName: 'Fatima M.' },
        { stars: 4, comment: 'Très bel hôtel avec une architecture traditionnelle superbe. La piscine est un vrai plus.', userName: 'Jean-Pierre L.' },
        { stars: 5, comment: 'Accueil chaleureux, cuisine tunisienne délicieuse. On se sent vraiment en vacances!', userName: 'Sophie R.' }
      ]
    },
    {
      hotelName: 'Mövenpick Resort & Marine Spa Sousse',
      ratings: [
        { stars: 5, comment: 'Resort incroyable! La plage privée est parfaite et le spa marin est une expérience unique.', userName: 'Karim H.' },
        { stars: 5, comment: 'Séjour parfait en famille. Les enfants ont adoré le kids club et nous le spa!', userName: 'Nadia T.' },
        { stars: 4, comment: 'Excellent emplacement près de la médina. Restaurants variés et de qualité.', userName: 'Thomas D.' },
        { stars: 5, comment: 'Le petit-déjeuner buffet est extraordinaire. Vue mer depuis notre chambre, un rêve!', userName: 'Amira S.' }
      ]
    },
    {
      hotelName: 'The Mora Sahara Tozeur',
      ratings: [
        { stars: 5, comment: 'Le plus bel hôtel où j\'ai séjourné! La villa avec piscine privée est un paradis.', userName: 'Laurent M.' },
        { stars: 5, comment: 'Expérience saharienne de luxe. Le dîner sous les étoiles restera gravé dans ma mémoire.', userName: 'Yasmine K.' },
        { stars: 5, comment: 'Service de butler exceptionnel. Chaque détail est pensé pour votre confort.', userName: 'Michel P.' },
        { stars: 5, comment: 'La balade en dromadaire au coucher du soleil est magique. Hôtel d\'exception!', userName: 'Salma A.' }
      ]
    }
  ];

  async seedHotels(): Promise<{ success: boolean; message: string }> {
    try {
      const { data: existingHotels, error: checkError } = await this.supabase
        .from('hotels')
        .select('id')
        .limit(1);

      if (checkError) {
        console.error('Error checking existing hotels:', checkError);
        return { success: false, message: 'Error checking existing hotels: ' + checkError.message };
      }

      if (existingHotels && existingHotels.length > 0) {
        console.log('Hotels already exist, skipping seed.');
        return { success: true, message: 'Hotels already exist in database. Use clearAndSeed() to reset.' };
      }

      const insertedHotels: any[] = [];
      for (const hotel of this.sampleHotels) {
        const { data, error } = await this.supabase
          .from('hotels')
          .insert({
            ...hotel,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
          .select()
          .single();

        if (error) {
          console.error('Error seeding hotel:', error);
          return { success: false, message: 'Error seeding hotel: ' + error.message };
        }
        insertedHotels.push(data);
      }

      console.log('Sample hotels added successfully!', insertedHotels);
      return { success: true, message: `${insertedHotels.length} hotels added successfully!` };
    } catch (error: any) {
      console.error('Seed error:', error);
      return { success: false, message: 'Seed error: ' + error.message };
    }
  }

  async seedBookings(): Promise<{ success: boolean; message: string }> {
    try {
      const { data: hotels, error: hotelError } = await this.supabase
        .from('hotels')
        .select('id, name, roomTypes');

      if (hotelError) {
        return { success: false, message: 'Error fetching hotels: ' + hotelError.message };
      }

      if (!hotels || hotels.length === 0) {
        return { success: false, message: 'No hotels found. Please seed hotels first.' };
      }

      let totalBookings = 0;
      const now = new Date();

      for (const sampleBooking of this.sampleBookings) {
        const hotel = hotels.find((h: any) => h.name === sampleBooking.hotelName);
        if (!hotel) continue;

        for (const booking of sampleBooking.bookings) {
          const checkInDate = new Date(now);
          checkInDate.setDate(checkInDate.getDate() + booking.checkIn);
          
          const checkOutDate = new Date(now);
          checkOutDate.setDate(checkOutDate.getDate() + booking.checkOut);

          const roomType = hotel.roomTypes?.find((r: any) => r.name === booking.roomType);
          const pricePerNight = roomType?.price || 100;
          const nights = booking.checkOut - booking.checkIn;
          const totalPrice = pricePerNight * nights;

          const { error } = await this.supabase
            .from('bookings')
            .insert({
              userId: 'demo-user-' + Math.random().toString(36).substring(7),
              hotelId: hotel.id,
              hotelName: hotel.name,
              checkIn: checkInDate.toISOString(),
              checkOut: checkOutDate.toISOString(),
              guests: booking.guests,
              roomType: booking.roomType,
              totalPrice,
              status: booking.status,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });

          if (error) {
            console.error('Error seeding booking:', error);
          } else {
            totalBookings++;
          }
        }
      }

      return { success: true, message: `${totalBookings} bookings added successfully!` };
    } catch (error: any) {
      return { success: false, message: 'Error seeding bookings: ' + error.message };
    }
  }

  async seedRatings(): Promise<{ success: boolean; message: string }> {
    try {
      const { data: hotels, error: hotelError } = await this.supabase
        .from('hotels')
        .select('id, name');

      if (hotelError) {
        return { success: false, message: 'Error fetching hotels: ' + hotelError.message };
      }

      if (!hotels || hotels.length === 0) {
        return { success: false, message: 'No hotels found. Please seed hotels first.' };
      }

      let totalRatings = 0;

      for (const sampleRating of this.sampleRatings) {
        const hotel = hotels.find((h: any) => h.name === sampleRating.hotelName);
        if (!hotel) continue;

        for (const rating of sampleRating.ratings) {
          const { error } = await this.supabase
            .from('ratings')
            .insert({
              hotelId: hotel.id,
              userId: 'demo-user-' + Math.random().toString(36).substring(7),
              userName: rating.userName,
              stars: rating.stars,
              comment: rating.comment,
              date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
              createdAt: new Date().toISOString()
            });

          if (error) {
            console.error('Error seeding rating:', error);
          } else {
            totalRatings++;
          }
        }
      }

      return { success: true, message: `${totalRatings} ratings added successfully!` };
    } catch (error: any) {
      return { success: false, message: 'Error seeding ratings: ' + error.message };
    }
  }

  async clearHotels(): Promise<{ success: boolean; message: string }> {
    try {
      const { error: ratingsError } = await this.supabase
        .from('ratings')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (ratingsError) {
        console.error('Error clearing ratings:', ratingsError);
      }

      const { error: bookingsError } = await this.supabase
        .from('bookings')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (bookingsError) {
        console.error('Error clearing bookings:', bookingsError);
      }

      const { error: hotelsError } = await this.supabase
        .from('hotels')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (hotelsError) {
        return { success: false, message: 'Error clearing hotels: ' + hotelsError.message };
      }

      return { success: true, message: 'All data cleared successfully!' };
    } catch (error: any) {
      return { success: false, message: 'Error clearing data: ' + error.message };
    }
  }

  async clearAndSeed(): Promise<{ success: boolean; message: string }> {
    const clearResult = await this.clearHotels();
    if (!clearResult.success) {
      return clearResult;
    }

    const hotelResult = await this.seedHotels();
    if (!hotelResult.success) {
      return hotelResult;
    }

    const ratingResult = await this.seedRatings();
    const bookingResult = await this.seedBookings();

    const messages = [hotelResult.message];
    if (ratingResult.success) messages.push(ratingResult.message);
    if (bookingResult.success) messages.push(bookingResult.message);

    return { success: true, message: 'Database seeded successfully! ' + messages.join(' ') };
  }

  async getStats(): Promise<{ hotels: number; ratings: number; bookings: number }> {
    const [hotelsRes, ratingsRes, bookingsRes] = await Promise.all([
      this.supabase.from('hotels').select('id', { count: 'exact' }),
      this.supabase.from('ratings').select('id', { count: 'exact' }),
      this.supabase.from('bookings').select('id', { count: 'exact' })
    ]);

    return {
      hotels: hotelsRes.count || 0,
      ratings: ratingsRes.count || 0,
      bookings: bookingsRes.count || 0
    };
  }
}
