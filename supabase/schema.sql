-- =======================================================================
-- RAINREVIVE POSTGRESQL SCHEMA FOR SUPABASE
-- "Don't waste a drop. Don't waste a space. Don't waste a material."
-- =======================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'seller', 'admin')),
  phone TEXT,
  avatar_url TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. RAINWATER CALCULATIONS
CREATE TABLE IF NOT EXISTS rainwater_calculations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rooftop_area_sqm NUMERIC NOT NULL,
  roof_type TEXT NOT NULL,
  annual_rainfall_mm NUMERIC NOT NULL,
  runoff_coefficient NUMERIC NOT NULL,
  catchment_efficiency NUMERIC NOT NULL DEFAULT 0.85,
  potential_liters NUMERIC NOT NULL,
  recommended_tank_capacity_liters NUMERIC NOT NULL,
  estimated_savings_inr NUMERIC NOT NULL,
  household_size NUMERIC DEFAULT 4,
  daily_demand_covered_percent NUMERIC DEFAULT 40,
  notes TEXT,
  location TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. BUILDINGS (Dead Building Revival)
CREATE TABLE IF NOT EXISTS buildings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  original_use TEXT NOT NULL,
  proposed_use TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  area_sqft NUMERIC NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('poor', 'fair', 'critical', 'moderate', 'dilapidated')),
  years_abandoned NUMERIC NOT NULL,
  structural_rating NUMERIC NOT NULL CHECK (structural_rating >= 1 AND structural_rating <= 10),
  revival_score NUMERIC NOT NULL CHECK (revival_score >= 0 AND revival_score <= 100),
  image_url TEXT NOT NULL,
  additional_images JSONB DEFAULT '[]'::jsonb,
  green_plan_summary TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'in_progress', 'revived', 'rejected')),
  submitted_by_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. GREEN REVIVAL PLANS
CREATE TABLE IF NOT EXISTS green_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  building_title TEXT NOT NULL,
  rainwater_system_type TEXT NOT NULL,
  estimated_harvest_liters NUMERIC NOT NULL,
  recommended_materials JSONB DEFAULT '[]'::jsonb,
  solar_potential_kwh NUMERIC NOT NULL,
  co2_offset_tons NUMERIC NOT NULL,
  estimated_cost_inr NUMERIC NOT NULL,
  timeline_months NUMERIC NOT NULL,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. MATERIAL CATEGORIES
CREATE TABLE IF NOT EXISTS material_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  icon_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. MATERIAL LISTINGS (Leftover Construction Materials Marketplace)
CREATE TABLE IF NOT EXISTS material_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  seller_name TEXT NOT NULL,
  seller_phone TEXT,
  seller_avatar TEXT,
  material_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  quantity NUMERIC NOT NULL CHECK (quantity > 0),
  unit TEXT NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('New', 'Like New', 'Good', 'Used')),
  price NUMERIC NOT NULL CHECK (price >= 0),
  negotiable BOOLEAN DEFAULT true,
  location TEXT NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  image_url TEXT NOT NULL,
  additional_images JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. MATERIAL ORDERS (Purchase Requests)
CREATE TABLE IF NOT EXISTS material_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES material_listings(id) ON DELETE CASCADE NOT NULL,
  listing_name TEXT NOT NULL,
  listing_image TEXT,
  buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  buyer_name TEXT NOT NULL,
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  seller_name TEXT NOT NULL,
  quantity NUMERIC NOT NULL CHECK (quantity > 0),
  unit TEXT NOT NULL,
  unit_price NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  buyer_message TEXT,
  contact_phone TEXT,
  status TEXT DEFAULT 'requested' CHECK (status IN ('requested', 'accepted', 'rejected', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. MATERIAL FAVORITES
CREATE TABLE IF NOT EXISTS material_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES material_listings(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, listing_id)
);

-- =======================================================================
-- STORAGE BUCKETS CONFIGURATION (Supabase Storage)
-- =======================================================================
-- Bucket: 'building-images' (Max 5MB per image, JPG, PNG, WEBP)
-- Bucket: 'material-images' (Max 5MB per image, JPG, PNG, WEBP)

-- =======================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =======================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rainwater_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE green_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_favorites ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can view seller profile; users can update their own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Rainwater Calculations: Users view their own, insert own
CREATE POLICY "Users can view their calculations" ON rainwater_calculations FOR SELECT USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
CREATE POLICY "Users can insert calculations" ON rainwater_calculations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Buildings: Everyone can view approved/in_progress/revived; Users view their own; Admins view all
CREATE POLICY "Anyone can view approved buildings" ON buildings FOR SELECT USING (status != 'rejected' OR auth.uid() = user_id OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
CREATE POLICY "Users can submit buildings" ON buildings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own building or Admin can update" ON buildings FOR UPDATE USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Material Listings: Everyone can view available; Sellers can manage their own; Admins can manage all
CREATE POLICY "Anyone can view available materials" ON material_listings FOR SELECT USING (status = 'available' OR auth.uid() = seller_id OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
CREATE POLICY "Sellers can insert their listings" ON material_listings FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update own listings" ON material_listings FOR UPDATE USING (auth.uid() = seller_id OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
CREATE POLICY "Sellers can delete own listings" ON material_listings FOR DELETE USING (auth.uid() = seller_id OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Material Orders: Buyer, Seller, and Admin can view
CREATE POLICY "Order parties can view orders" ON material_orders FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
CREATE POLICY "Buyers can create purchase requests" ON material_orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Order parties can update orders" ON material_orders FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Favorites: Users can manage their own favorites
CREATE POLICY "Users can view own favorites" ON material_favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert favorites" ON material_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete favorites" ON material_favorites FOR DELETE USING (auth.uid() = user_id);
