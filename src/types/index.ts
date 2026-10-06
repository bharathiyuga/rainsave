export type UserRole = 'user' | 'seller' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  location?: string;
  created_at: string;
}

export interface RainwaterCalculation {
  id: string;
  user_id: string;
  rooftop_area_sqm: number;
  roof_type: string;
  annual_rainfall_mm: number;
  runoff_coefficient: number;
  catchment_efficiency: number;
  potential_liters: number;
  recommended_tank_capacity_liters: number;
  estimated_savings_inr: number;
  household_size?: number;
  daily_demand_covered_percent?: number;
  notes?: string;
  location: string;
  created_at: string;
}

export type BuildingCondition = 'poor' | 'fair' | 'critical' | 'moderate' | 'dilapidated';
export type BuildingStatus = 'pending' | 'approved' | 'in_progress' | 'revived' | 'rejected';

export interface Building {
  id: string;
  user_id: string;
  title: string;
  original_use: string;
  proposed_use: string;
  address: string;
  latitude: number;
  longitude: number;
  area_sqft: number;
  condition: BuildingCondition;
  years_abandoned: number;
  structural_rating: number; // 1 to 10
  revival_score: number; // 0 to 100
  image_url: string;
  additional_images?: string[];
  green_plan_summary?: string;
  status: BuildingStatus;
  submitted_by_name?: string;
  created_at: string;
  updated_at: string;
}

export interface GreenPlanStep {
  step: number;
  title: string;
  description: string;
  duration_weeks: number;
  category: 'water' | 'materials' | 'structural' | 'energy' | 'community';
}

export interface GreenPlan {
  id: string;
  building_id: string;
  user_id: string;
  building_title: string;
  rainwater_system_type: string;
  estimated_harvest_liters: number;
  recommended_materials: string[];
  solar_potential_kwh: number;
  co2_offset_tons: number;
  estimated_cost_inr: number;
  timeline_months: number;
  steps: GreenPlanStep[];
  created_at: string;
}

export type MaterialCondition = 'New' | 'Like New' | 'Good' | 'Used';
export type MaterialListingStatus = 'available' | 'reserved' | 'sold' | 'inactive';

export interface MaterialCategory {
  id: string;
  name: string;
  description: string;
  image_url: string;
  icon_name: string;
  created_at?: string;
}

export interface MaterialListing {
  id: string;
  seller_id: string;
  seller_name: string;
  seller_phone?: string;
  seller_avatar?: string;
  material_name: string;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  condition: MaterialCondition;
  price: number; // INR
  negotiable: boolean;
  location: string;
  latitude: number;
  longitude: number;
  image_url: string;
  additional_images?: string[];
  status: MaterialListingStatus;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 'requested' | 'accepted' | 'rejected' | 'completed' | 'cancelled';

export interface MaterialOrder {
  id: string;
  listing_id: string;
  listing_name: string;
  listing_image?: string;
  buyer_id: string;
  buyer_name: string;
  seller_id: string;
  seller_name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
  buyer_message: string;
  contact_phone: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface MaterialFavorite {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
}

export interface SustainabilityMetrics {
  waterHarvestedLiters: number;
  waterSavedInr: number;
  buildingsSubmitted: number;
  buildingsRevived: number;
  communitySpacesCreated: number;
  materialsReusedCount: number;
  materialsReusedKg: number;
  wastePreventedTons: number;
  communityMoneySavedInr: number;
  co2ReductionKg: number;
  totalTransactions: number;
}
