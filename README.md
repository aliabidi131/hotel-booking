# Hotel Booking Angular Application

A full-featured hotel booking website built with Angular 17, Firebase, and Angular Material.

## Features

### Frontend
- **Home Page**: Display featured hotels with images, star ratings, and prices
- **Hotel List**: Browse all hotels with filtering and sorting capabilities
- **Hotel Detail**: View hotel details, gallery, book rooms, and read/write reviews
- **My Bookings**: View and manage personal bookings
- **Contact Page**: Contact form for inquiries
- **Responsive Design**: Works on desktop and mobile devices

### Authentication
- User signup and login with Firebase Authentication
- Protected routes for authenticated users
- Admin-only access for hotel management

### Admin Panel
- Dashboard with statistics (hotels, bookings, revenue)
- CRUD operations for hotels
- Manage all bookings (confirm, complete, cancel)

### Filtering & Sorting
- Filter hotels by star rating
- Filter by price range
- Sort by price (ascending/descending)
- Sort by star rating

## Tech Stack

- **Frontend**: Angular 17 (Standalone Components)
- **UI Library**: Angular Material
- **Backend/Database**: Firebase (Firestore)
- **Authentication**: Firebase Auth
- **Styling**: SCSS

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── admin-dashboard.component.ts
│   │   │   ├── booking-list-admin.component.ts
│   │   │   ├── hotel-form.component.ts
│   │   │   └── hotel-list-admin.component.ts
│   │   ├── auth/
│   │   │   ├── login.component.ts
│   │   │   └── signup.component.ts
│   │   ├── booking-form/
│   │   │   └── booking-form.component.ts
│   │   ├── contact/
│   │   │   └── contact.component.ts
│   │   ├── home/
│   │   │   └── home.component.ts
│   │   ├── hotel-detail/
│   │   │   └── hotel-detail.component.ts
│   │   ├── hotel-list/
│   │   │   └── hotel-list.component.ts
│   │   ├── my-bookings/
│   │   │   └── my-bookings.component.ts
│   │   ├── navbar/
│   │   │   └── navbar.component.ts
│   │   ├── rating-form/
│   │   │   └── rating-form.component.ts
│   │   ├── rating-list/
│   │   │   └── rating-list.component.ts
│   │   └── shared/
│   │       └── confirm-dialog.component.ts
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── models/
│   │   ├── booking.model.ts
│   │   ├── hotel.model.ts
│   │   ├── rating.model.ts
│   │   └── user.model.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── booking.service.ts
│   │   ├── hotel.service.ts
│   │   └── rating.service.ts
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
├── index.html
├── main.ts
└── styles.scss
```

## Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)

2. Enable **Authentication** with Email/Password provider

3. Create a **Firestore Database** with the following collections:
   - `hotels`
   - `bookings`
   - `ratings`
   - `users`

4. Update `src/environments/environment.ts` with your Firebase config:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT_ID.appspot.com',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID'
  }
};
```

5. Set up Firestore Security Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Hotels - anyone can read, only admins can write
    match /hotels/{hotelId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Bookings - users can read/write their own bookings
    match /bookings/{bookingId} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Ratings - anyone can read, authenticated users can create
    match /ratings/{ratingId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Users - users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null;
    }
  }
}
```

## Installation & Running

1. Install dependencies:
```bash
cd hotel-booking
npm install
```

2. Start the development server:
```bash
ng serve
```

3. Open your browser to `http://localhost:4200`

## Creating an Admin User

To create an admin user, you need to manually set the `role` field to `'admin'` in the Firestore users collection for the desired user document.

1. Create a regular account through the signup page
2. Go to Firebase Console > Firestore
3. Find the user document in the `users` collection
4. Change the `role` field from `'user'` to `'admin'`

## Sample Hotel Data

You can add sample hotels through the admin panel or directly in Firestore:

```json
{
  "name": "Grand Hotel Paradise",
  "stars": 5,
  "price": 299,
  "description": "Experience luxury at its finest...",
  "location": "New York, USA",
  "images": [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd"
  ],
  "amenities": ["Free WiFi", "Pool", "Spa", "Restaurant", "Gym"],
  "roomTypes": [
    { "name": "Standard", "price": 299, "capacity": 2 },
    { "name": "Deluxe", "price": 449, "capacity": 3 },
    { "name": "Suite", "price": 599, "capacity": 4 }
  ]
}
```

## Building for Production

```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/hotel-booking` directory.

## License

MIT
