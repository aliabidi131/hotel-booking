-- ============================================
-- 🗄️ SUPABASE SCHEMA - HOTEL BOOKING APP
-- ============================================
-- Copiez et exécutez ce script dans:
-- Supabase Dashboard > SQL Editor > New Query
-- ============================================

-- Supprimer les tables existantes
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS hotels CASCADE;

-- ============================================
-- 1. TABLE HOTELS
-- ============================================
CREATE TABLE hotels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  stars INTEGER NOT NULL CHECK (stars >= 1 AND stars <= 5),
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  location TEXT,
  images TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  "roomTypes" JSONB DEFAULT '[]',
  coordinates JSONB,
  address TEXT,
  phone TEXT,
  email TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. TABLE BOOKINGS
-- ============================================
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "hotelId" UUID REFERENCES hotels(id) ON DELETE CASCADE,
  "hotelName" TEXT,
  "checkIn" TIMESTAMPTZ NOT NULL,
  "checkOut" TIMESTAMPTZ NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  "roomType" TEXT NOT NULL,
  "totalPrice" DECIMAL(10,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. TABLE RATINGS
-- ============================================
CREATE TABLE ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "hotelId" UUID REFERENCES hotels(id) ON DELETE CASCADE,
  "userId" TEXT NOT NULL,
  "userName" TEXT,
  stars INTEGER NOT NULL CHECK (stars >= 1 AND stars <= 5),
  comment TEXT,
  date TIMESTAMPTZ DEFAULT NOW(),
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. TABLE CONTACTS
-- ============================================
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "repliedAt" TIMESTAMPTZ
);

-- ============================================
-- 5. INDEX POUR PERFORMANCES
-- ============================================
CREATE INDEX idx_bookings_user ON bookings("userId");
CREATE INDEX idx_bookings_hotel ON bookings("hotelId");
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_ratings_hotel ON ratings("hotelId");
CREATE INDEX idx_hotels_stars ON hotels(stars);
CREATE INDEX idx_hotels_price ON hotels(price);
CREATE INDEX idx_contacts_status ON contacts(status);

-- ============================================
-- 6. DÉSACTIVER RLS (pour développement)
-- ============================================
ALTER TABLE hotels DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE ratings DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;

-- ============================================
-- ✅ TABLES CRÉÉES AVEC SUCCÈS!
-- 
-- Prochaine étape:
-- 1. Lancez: ng serve
-- 2. Allez dans Admin > Database
-- 3. Cliquez sur "Clear & Reseed All"
--
-- 8 hôtels seront ajoutés:
-- • 5 hôtels internationaux
-- • 3 hôtels tunisiens (El Mouradi, Mövenpick, The Mora)
-- ============================================
