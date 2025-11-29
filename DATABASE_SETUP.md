# 🗄️ Configuration de la Base de Données Supabase

## 📋 Prérequis

1. Créer un compte sur [Supabase](https://supabase.com)
2. Créer un nouveau projet
3. Récupérer l'URL et la clé API (anon/public)

## 🚀 Installation

### Étape 1: Configurer les variables d'environnement

Modifier `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  supabase: {
    url: 'https://VOTRE_PROJECT_ID.supabase.co',
    key: 'VOTRE_ANON_KEY'
  }
};
```

### Étape 2: Créer les tables

1. Aller dans **Supabase Dashboard** → **SQL Editor**
2. Créer une nouvelle requête
3. Copier le contenu de `supabase-schema.sql`
4. Exécuter la requête

### Étape 3: Ajouter les données de démonstration

1. Lancer l'application: `ng serve`
2. Se connecter en tant qu'admin
3. Aller dans **Admin Dashboard** → Onglet **Database**
4. Cliquer sur **"Seed Hotels & Ratings"**

## 📊 Structure de la Base de Données

### Tables

| Table | Description |
|-------|-------------|
| `hotels` | Liste des hôtels avec images, amenities, types de chambres |
| `users` | Profils utilisateurs (lié à auth.users) |
| `bookings` | Réservations des utilisateurs |
| `ratings` | Avis et notes des utilisateurs |

### Schéma

```
hotels
├── id (UUID, PK)
├── name (TEXT)
├── stars (INTEGER, 1-5)
├── price (DECIMAL)
├── description (TEXT)
├── location (TEXT)
├── images (TEXT[])
├── amenities (TEXT[])
├── roomTypes (JSONB)
├── createdAt (TIMESTAMPTZ)
└── updatedAt (TIMESTAMPTZ)

users
├── uid (UUID, PK, FK → auth.users)
├── email (TEXT)
├── displayName (TEXT)
├── photoURL (TEXT)
├── role (TEXT: 'user' | 'admin')
└── createdAt (TIMESTAMPTZ)

bookings
├── id (UUID, PK)
├── userId (UUID, FK → users)
├── hotelId (UUID, FK → hotels)
├── hotelName (TEXT)
├── checkIn (TIMESTAMPTZ)
├── checkOut (TIMESTAMPTZ)
├── guests (INTEGER)
├── roomType (TEXT)
├── totalPrice (DECIMAL)
├── status (TEXT: 'pending' | 'confirmed' | 'cancelled' | 'completed')
├── createdAt (TIMESTAMPTZ)
└── updatedAt (TIMESTAMPTZ)

ratings
├── id (UUID, PK)
├── hotelId (UUID, FK → hotels)
├── userId (TEXT)
├── userName (TEXT)
├── stars (INTEGER, 1-5)
├── comment (TEXT)
├── date (TIMESTAMPTZ)
└── createdAt (TIMESTAMPTZ)
```

## 🔐 Sécurité (RLS)

Row Level Security est activé sur toutes les tables:

- **Hotels**: Lecture publique, écriture authentifiée
- **Bookings**: Utilisateurs voient leurs propres réservations
- **Ratings**: Lecture publique, écriture authentifiée
- **Users**: Utilisateurs voient leur propre profil

## 📦 Données de Démonstration

### 5 Hôtels

| Hôtel | Étoiles | Prix | Lieu |
|-------|---------|------|------|
| Grand Hotel Paradise | ⭐⭐⭐⭐⭐ | $299 | New York, USA |
| Seaside Resort & Spa | ⭐⭐⭐⭐ | $189 | Miami Beach, USA |
| Mountain Lodge Retreat | ⭐⭐⭐⭐ | $159 | Aspen, Colorado, USA |
| Urban Boutique Hotel | ⭐⭐⭐ | $99 | Los Angeles, USA |
| Historic Palace Hotel | ⭐⭐⭐⭐⭐ | $399 | Paris, France |

### 20 Avis (4 par hôtel)

Notes de 3 à 5 étoiles avec commentaires réalistes.

### 8 Réservations

Statuts variés: pending, confirmed, cancelled, completed.

## 🛠️ Commandes du SeedService

```typescript
// Ajouter les hôtels (si vide)
seedService.seedHotels();

// Ajouter les avis
seedService.seedRatings();

// Ajouter les réservations
seedService.seedBookings();

// Tout effacer
seedService.clearHotels();

// Effacer et réinitialiser
seedService.clearAndSeed();

// Obtenir les statistiques
seedService.getStats();
```

## 🔧 Dépannage

### Erreur "relation does not exist"
→ Exécuter le script SQL `supabase-schema.sql`

### Erreur "permission denied"
→ Vérifier les politiques RLS dans Supabase Dashboard

### Les images ne s'affichent pas
→ Les images utilisent Unsplash, vérifier la connexion internet

## 👤 Créer un Admin

Dans Supabase SQL Editor:

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'votre-email@example.com';
```
