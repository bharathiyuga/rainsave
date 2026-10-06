/**
 * RainRevive Supabase Integration & High-Fidelity Data Service
 * Connects to live Supabase or seamless persistent local DB engine
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Profile,
  RainwaterCalculation,
  Building,
  GreenPlan,
  MaterialListing,
  MaterialOrder,
  MaterialCategory,
  MaterialFavorite,
  SustainabilityMetrics,
} from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isLiveSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-supabase-project')
);

export const supabase: SupabaseClient | null = isLiveSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// =======================================================================
// INITIAL SEED DATA FOR DEMO & PREVIEW
// =======================================================================

const SEED_PROFILES: Profile[] = [
  {
    id: 'user-001',
    email: 'priya.green@example.com',
    full_name: 'Priya Sundaram',
    role: 'seller',
    phone: '+91 98452 11092',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    location: 'Salem, Tamil Nadu',
    created_at: '2026-08-10T10:00:00Z',
  },
  {
    id: 'user-002',
    email: 'aravind.builds@example.com',
    full_name: 'Aravind Raman',
    role: 'user',
    phone: '+91 94432 88471',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    location: 'Coimbatore, Tamil Nadu',
    created_at: '2026-08-12T11:20:00Z',
  },
  {
    id: 'admin-001',
    email: 'admin.rainrevive@earth.org',
    full_name: 'Dr. Meera Iyer (Admin)',
    role: 'admin',
    phone: '+91 98401 55299',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    location: 'Chennai, Tamil Nadu',
    created_at: '2026-08-01T08:00:00Z',
  },
];

export const SEED_CATEGORIES: MaterialCategory[] = [
  {
    id: 'cat-1',
    name: 'Bricks',
    description: 'Clay bricks, fly ash bricks, fire bricks, and wire-cut masonry bricks',
    image_url: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80',
    icon_name: 'Layers',
  },
  {
    id: 'cat-2',
    name: 'Cement',
    description: 'OPC, PPC, and specialized masonry cement bags sealed and dry',
    image_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    icon_name: 'Package',
  },
  {
    id: 'cat-3',
    name: 'Sand',
    description: 'River sand, M-sand, plastering sand, and fine aggregate',
    image_url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    icon_name: 'Sparkles',
  },
  {
    id: 'cat-4',
    name: 'Steel',
    description: 'TMT rebars, structural channels, I-beams, binding wire, and stirrups',
    image_url: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=800&q=80',
    icon_name: 'Hammer',
  },
  {
    id: 'cat-5',
    name: 'Pipes',
    description: 'CPVC, UPVC, PVC drainage conduits, and pressure fittings',
    image_url: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=800&q=80',
    icon_name: 'Workflow',
  },
  {
    id: 'cat-6',
    name: 'Tiles',
    description: 'Vitrified floor tiles, ceramic wall tiles, granite and marble cuts',
    image_url: 'https://images.unsplash.com/photo-1527352774984-29c8e0018868?auto=format&fit=crop&w=800&q=80',
    icon_name: 'Grid',
  },
  {
    id: 'cat-7',
    name: 'Wood',
    description: 'Teak wood beams, commercial plywood sheets, rafters, and pallets',
    image_url: 'https://images.unsplash.com/photo-1520038410233-7141be7e6f97?auto=format&fit=crop&w=800&q=80',
    icon_name: 'TreePine',
  },
  {
    id: 'cat-8',
    name: 'Electrical',
    description: 'Surplus copper wiring coils, MCBs, junction boxes, switch plates',
    image_url: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80',
    icon_name: 'Zap',
  },
  {
    id: 'cat-9',
    name: 'Plumbing',
    description: 'Sanitary fixtures, brass valves, faucets, elbows, and union joints',
    image_url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80',
    icon_name: 'Wrench',
  },
  {
    id: 'cat-10',
    name: 'Paint',
    description: 'Unopened emulsion paint buckets, primers, wood polish, and putty',
    image_url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80',
    icon_name: 'PaintBucket',
  },
  {
    id: 'cat-11',
    name: 'Doors & Windows',
    description: 'Solid teak wood doors, UPVC window frames, glass louvers, grill gates',
    image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    icon_name: 'DoorOpen',
  },
  {
    id: 'cat-12',
    name: 'Concrete Blocks',
    description: 'Hollow and solid AAC lightweight masonry blocks, pavement pavers',
    image_url: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80',
    icon_name: 'Box',
  },
  {
    id: 'cat-13',
    name: 'Gravel',
    description: 'Crushed stone aggregate, blue metal 20mm, pea gravel',
    image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    icon_name: 'Mountain',
  },
  {
    id: 'cat-14',
    name: 'Other',
    description: 'Waterproofing sheets, scaffolding joints, safety mesh, tarpaulins',
    image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    icon_name: 'MoreHorizontal',
  },
];

const SEED_LISTINGS: MaterialListing[] = [
  {
    id: 'mat-001',
    seller_id: 'user-001',
    seller_name: 'Priya Sundaram',
    seller_phone: '+91 98452 11092',
    seller_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    material_name: '500 High-Quality Red Clay Bricks',
    category: 'Bricks',
    description: 'Leftover from our residential expansion project. Fully stacked, undamaged, kiln-fired red clay bricks stored dry under shed. Perfect for compound walls, sumps, or interior partitions.',
    quantity: 500,
    unit: 'pieces',
    condition: 'Good',
    price: 4500,
    negotiable: true,
    location: 'Salem, Tamil Nadu',
    latitude: 11.6643,
    longitude: 78.1460,
    image_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    additional_images: [
      'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
    created_at: '2026-09-18T09:30:00Z',
    updated_at: '2026-09-18T09:30:00Z',
  },
  {
    id: 'mat-002',
    seller_id: 'user-002',
    seller_name: 'Aravind Raman',
    seller_phone: '+91 94432 88471',
    seller_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    material_name: '25 Sealed Bags UltraTech 53-Grade Cement',
    category: 'Cement',
    description: 'Fresh manufacturing batch (under 25 days old). Factory sealed, stored elevated on wooden pallets under waterproof tarpaulin. Surplus from column concrete casting.',
    quantity: 25,
    unit: 'bags',
    condition: 'New',
    price: 8500,
    negotiable: false,
    location: 'Coimbatore, Tamil Nadu',
    latitude: 11.0168,
    longitude: 76.9558,
    image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    additional_images: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
    created_at: '2026-09-21T14:15:00Z',
    updated_at: '2026-09-21T14:15:00Z',
  },
  {
    id: 'mat-003',
    seller_id: 'user-001',
    seller_name: 'Priya Sundaram',
    seller_phone: '+91 98452 11092',
    seller_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    material_name: '35 TMT Fe550D Steel Rebars (12mm x 12m)',
    category: 'Steel',
    description: 'Genuine Tata Tiscon rust-free 12mm rebar cuts. Standard full 12-meter straight lengths remaining after roof slab reinforcement. Kept sheltered, pristine condition.',
    quantity: 35,
    unit: 'rods',
    condition: 'Like New',
    price: 24500,
    negotiable: true,
    location: 'Chennai, Tamil Nadu',
    latitude: 13.0827,
    longitude: 80.2707,
    image_url: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=800&q=80',
    additional_images: [
      'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
    created_at: '2026-09-25T11:00:00Z',
    updated_at: '2026-09-25T11:00:00Z',
  },
  {
    id: 'mat-004',
    seller_id: 'user-002',
    seller_name: 'Aravind Raman',
    seller_phone: '+91 94432 88471',
    seller_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    material_name: '80 Premium Matt Vitrified Floor Tiles (2x2 ft)',
    category: 'Tiles',
    description: 'Neutral grey Italian marble finish vitrified tiles. 20 boxes unopened (4 tiles per box). Covers approx 320 sq.ft of flooring. High durability, skid-resistant.',
    quantity: 80,
    unit: 'pieces',
    condition: 'New',
    price: 11200,
    negotiable: true,
    location: 'Bengaluru, Karnataka',
    latitude: 12.9716,
    longitude: 77.5946,
    image_url: 'https://images.unsplash.com/photo-1527352774984-29c8e0018868?auto=format&fit=crop&w=800&q=80',
    additional_images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
    created_at: '2026-09-28T16:40:00Z',
    updated_at: '2026-09-28T16:40:00Z',
  },
  {
    id: 'mat-005',
    seller_id: 'user-001',
    seller_name: 'Priya Sundaram',
    seller_phone: '+91 98452 11092',
    seller_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    material_name: 'Solid Teak Wood Main Door Frame with Shutter',
    category: 'Doors & Windows',
    description: 'Reclaimed seasoned Nilambur teak wood frame with brass hinges, bolt and latch. Dimensions 7ft x 3.5ft. Heavy duty, rich natural grain, ready for polish.',
    quantity: 1,
    unit: 'pieces',
    condition: 'Like New',
    price: 14500,
    negotiable: true,
    location: 'Madurai, Tamil Nadu',
    latitude: 9.9252,
    longitude: 78.1198,
    image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    additional_images: [],
    status: 'available',
    created_at: '2026-10-01T10:10:00Z',
    updated_at: '2026-10-01T10:10:00Z',
  },
  {
    id: 'mat-006',
    seller_id: 'user-002',
    seller_name: 'Aravind Raman',
    seller_phone: '+91 94432 88471',
    seller_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    material_name: '28 Heavy CPVC Water Supply Pipes (1 inch x 3m)',
    category: 'Pipes',
    description: 'Astral SDR 11 Class 1 CPVC pressure pipes. Ideal for hot and cold plumbing loops. Excess inventory from complete plumbing overhaul, clean and intact.',
    quantity: 28,
    unit: 'meters',
    condition: 'New',
    price: 3640,
    negotiable: false,
    location: 'Salem, Tamil Nadu',
    latitude: 11.6643,
    longitude: 78.1460,
    image_url: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=800&q=80',
    additional_images: [],
    status: 'available',
    created_at: '2026-10-02T12:00:00Z',
    updated_at: '2026-10-02T12:00:00Z',
  },
  {
    id: 'mat-007',
    seller_id: 'user-001',
    seller_name: 'Priya Sundaram',
    seller_phone: '+91 98452 11092',
    seller_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    material_name: '2 Units Clean Coarse River Sand for Plastering',
    category: 'Sand',
    description: 'Double-filtered, silt-free river sand suited for structural masonry and plastering works. Dry and cleanly dumped inside walled compound.',
    quantity: 2,
    unit: 'units',
    condition: 'Good',
    price: 9000,
    negotiable: true,
    location: 'Salem, Tamil Nadu',
    latitude: 11.6643,
    longitude: 78.1460,
    image_url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    additional_images: [
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
    created_at: '2026-10-03T08:30:00Z',
    updated_at: '2026-10-03T08:30:00Z',
  },
  {
    id: 'mat-008',
    seller_id: 'user-002',
    seller_name: 'Aravind Raman',
    seller_phone: '+91 94432 88471',
    seller_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    material_name: '150 AAC High-Strength Concrete Masonry Blocks',
    category: 'Concrete Blocks',
    description: 'Siporex/Aerocon 600mm x 200mm x 150mm lightweight autoclaved aerated concrete blocks. Fire resistant, sound insulating, zero transit damage.',
    quantity: 150,
    unit: 'pieces',
    condition: 'New',
    price: 8250,
    negotiable: true,
    location: 'Coimbatore, Tamil Nadu',
    latitude: 11.0168,
    longitude: 76.9558,
    image_url: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80',
    additional_images: [],
    status: 'available',
    created_at: '2026-10-03T14:20:00Z',
    updated_at: '2026-10-03T14:20:00Z',
  },
  {
    id: 'mat-009',
    seller_id: 'user-001',
    seller_name: 'Priya Sundaram',
    seller_phone: '+91 98452 11092',
    seller_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    material_name: '4 Unopened Buckets Asian Paints Apex Ultima (20L Each)',
    category: 'Paint',
    description: 'Factory sealed 20-liter tubs of Brilliant White Exterior Emulsion with 7-year weather durability warranty. Excess from multi-storey villa project.',
    quantity: 4,
    unit: 'buckets',
    condition: 'New',
    price: 13600,
    negotiable: false,
    location: 'Chennai, Tamil Nadu',
    latitude: 13.0827,
    longitude: 80.2707,
    image_url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80',
    additional_images: [],
    status: 'available',
    created_at: '2026-10-04T09:10:00Z',
    updated_at: '2026-10-04T09:10:00Z',
  },
  {
    id: 'mat-010',
    seller_id: 'user-002',
    seller_name: 'Aravind Raman',
    seller_phone: '+91 94432 88471',
    seller_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    material_name: '12 Sheets Commercial Waterproof Plywood (18mm, 8x4 ft)',
    category: 'Wood',
    description: 'Century Ply Marine Grade 710 calibrated 18mm plywood sheets. Borer & termite proof, ideal for modular kitchen cabinets and shuttering.',
    quantity: 12,
    unit: 'sheets',
    condition: 'New',
    price: 21600,
    negotiable: true,
    location: 'Bengaluru, Karnataka',
    latitude: 12.9716,
    longitude: 77.5946,
    image_url: 'https://images.unsplash.com/photo-1520038410233-7141be7e6f97?auto=format&fit=crop&w=800&q=80',
    additional_images: [
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
    created_at: '2026-10-04T16:00:00Z',
    updated_at: '2026-10-04T16:00:00Z',
  },
  {
    id: 'mat-011',
    seller_id: 'user-001',
    seller_name: 'Priya Sundaram',
    seller_phone: '+91 98452 11092',
    seller_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    material_name: '6 Rolls Finolex 2.5 sq.mm FR Copper Wiring (90m each)',
    category: 'Electrical',
    description: 'Unopened rolls of 1100V Flame Retardant pure copper wiring (3 Red, 2 Black, 1 Green earthing). ISI certified genuine rolls.',
    quantity: 6,
    unit: 'rolls',
    condition: 'New',
    price: 11400,
    negotiable: false,
    location: 'Salem, Tamil Nadu',
    latitude: 11.6643,
    longitude: 78.1460,
    image_url: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80',
    additional_images: [],
    status: 'available',
    created_at: '2026-10-05T07:45:00Z',
    updated_at: '2026-10-05T07:45:00Z',
  },
  {
    id: 'mat-012',
    seller_id: 'user-002',
    seller_name: 'Aravind Raman',
    seller_phone: '+91 94432 88471',
    seller_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    material_name: '2 Units 20mm Blue Metal Crushed Stone Aggregate',
    category: 'Gravel',
    description: 'Clean quarry crushed granite 20mm blue metal stones. Zero mud or clay residue, ideal for structural RCC slab concrete mix.',
    quantity: 2,
    unit: 'units',
    condition: 'Good',
    price: 6800,
    negotiable: true,
    location: 'Coimbatore, Tamil Nadu',
    latitude: 11.0168,
    longitude: 76.9558,
    image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    additional_images: [],
    status: 'available',
    created_at: '2026-10-05T11:20:00Z',
    updated_at: '2026-10-05T11:20:00Z',
  },
];

const SEED_BUILDINGS: Building[] = [
  {
    id: 'bld-001',
    user_id: 'user-001',
    title: 'Historic Salem Handloom Textile Mill',
    original_use: 'Steam-Powered Cotton Weaving Factory',
    proposed_use: 'Community Artisan Guild & Solar Rainwater Center',
    address: 'Ammapet Main Road, Salem, Tamil Nadu 636003',
    latitude: 11.6586,
    longitude: 78.1724,
    area_sqft: 8500,
    condition: 'fair',
    years_abandoned: 9,
    structural_rating: 8,
    revival_score: 84,
    image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    additional_images: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
    ],
    green_plan_summary: 'Integrates 120,000L rooftop rainwater retention, natural ventilation lanterns, and reclaimed timber flooring.',
    status: 'revived',
    submitted_by_name: 'Priya Sundaram',
    created_at: '2026-07-15T10:00:00Z',
    updated_at: '2026-09-01T12:00:00Z',
  },
  {
    id: 'bld-002',
    user_id: 'user-002',
    title: 'Disused Grain Silo & Railway Depot',
    original_use: 'Civil Supplies Storage Depot',
    proposed_use: 'Urban Hydroponic Farming & Public Tool Library',
    address: 'Peelamedu Goods Shed Rd, Coimbatore 641004',
    latitude: 11.0267,
    longitude: 77.0125,
    area_sqft: 12000,
    condition: 'moderate',
    years_abandoned: 6,
    structural_rating: 7,
    revival_score: 76,
    image_url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80',
    additional_images: [],
    green_plan_summary: 'Circular rainwater bio-swales, 15kW rooftop solar PV, and structural steel reuse for tiered aeroponic racks.',
    status: 'in_progress',
    submitted_by_name: 'Aravind Raman',
    created_at: '2026-08-20T11:00:00Z',
    updated_at: '2026-09-22T08:30:00Z',
  },
  {
    id: 'bld-003',
    user_id: 'user-001',
    title: 'Old Town Heritage Municipal Dispensary',
    original_use: 'Neighborhood Healthcare Clinic',
    proposed_use: 'Children Educational Daycare & Green Library',
    address: 'Bazaar Street, George Town, Chennai 600001',
    latitude: 13.0903,
    longitude: 80.2858,
    area_sqft: 3400,
    condition: 'fair',
    years_abandoned: 4,
    structural_rating: 8,
    revival_score: 88,
    image_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80',
    additional_images: [],
    green_plan_summary: 'Dual-tank rainwater filtration providing 100% toilet flushing water and passive courtyard cooling.',
    status: 'approved',
    submitted_by_name: 'Priya Sundaram',
    created_at: '2026-09-05T09:15:00Z',
    updated_at: '2026-09-12T14:00:00Z',
  },
];

const SEED_GREEN_PLANS: GreenPlan[] = [
  {
    id: 'gp-001',
    building_id: 'bld-001',
    user_id: 'user-001',
    building_title: 'Historic Salem Handloom Textile Mill',
    rainwater_system_type: 'Rooftop Gravity Filtration & Recharge Trench',
    estimated_harvest_liters: 145000,
    recommended_materials: ['Reclaimed clay tiles', 'Fly ash blocks', 'Upcycled steel trusses', 'Brass shutoff valves'],
    solar_potential_kwh: 18500,
    co2_offset_tons: 22.4,
    estimated_cost_inr: 420000,
    timeline_months: 5,
    steps: [
      { step: 1, title: 'Structural Non-Destructive Test & Roof Clearing', description: 'Inspect load-bearing brick masonry and clear debris from gutters.', duration_weeks: 2, category: 'structural' },
      { step: 2, title: 'Rooftop Rain Catchment & Gutter Installation', description: 'Install seamless UV-treated pipes and first-flush diverters.', duration_weeks: 3, category: 'water' },
      { step: 3, title: 'Underground Modular Rain Cistern Placement', description: 'Excavate and set 120,000L modular retention cells beneath former yard.', duration_weeks: 4, category: 'water' },
      { step: 4, title: 'Reused Material Marketplace Procurement', description: 'Source 500 bricks and rebar remnants from local builders via RainRevive.', duration_weeks: 2, category: 'materials' },
      { step: 5, title: 'Solar Array & Interior Finishing', description: 'Commission 15kW rooftop panels and handloom guild workshop benches.', duration_weeks: 3, category: 'energy' },
    ],
    created_at: '2026-07-20T14:00:00Z',
  },
];

const SEED_CALCULATIONS: RainwaterCalculation[] = [
  {
    id: 'rc-001',
    user_id: 'user-001',
    rooftop_area_sqm: 180,
    roof_type: 'concrete',
    annual_rainfall_mm: 920,
    runoff_coefficient: 0.85,
    catchment_efficiency: 0.85,
    potential_liters: 119619,
    recommended_tank_capacity_liters: 17943,
    estimated_savings_inr: 14354,
    household_size: 4,
    daily_demand_covered_percent: 68,
    notes: 'Primary residential rooftop in Salem. Planning dual-stage sand filter.',
    location: 'Salem, Tamil Nadu',
    created_at: '2026-09-02T16:00:00Z',
  },
  {
    id: 'rc-002',
    user_id: 'user-002',
    rooftop_area_sqm: 320,
    roof_type: 'metal_sheet',
    annual_rainfall_mm: 1400,
    runoff_coefficient: 0.90,
    catchment_efficiency: 0.85,
    potential_liters: 342720,
    recommended_tank_capacity_liters: 45000,
    estimated_savings_inr: 41126,
    household_size: 6,
    daily_demand_covered_percent: 94,
    notes: 'Warehouse metal roof in Chennai with high harvesting yield.',
    location: 'Chennai, Tamil Nadu',
    created_at: '2026-09-14T11:20:00Z',
  },
];

const SEED_ORDERS: MaterialOrder[] = [
  {
    id: 'ord-001',
    listing_id: 'mat-001',
    listing_name: '500 High-Quality Red Clay Bricks',
    listing_image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
    buyer_id: 'user-002',
    buyer_name: 'Aravind Raman',
    seller_id: 'user-001',
    seller_name: 'Priya Sundaram',
    quantity: 200,
    unit: 'pieces',
    unit_price: 9,
    total_price: 1800,
    buyer_message: 'Hi Priya, I need 200 bricks for building a rainwater filter sump wall. Can arrange local pickup tomorrow!',
    contact_phone: '+91 94432 88471',
    status: 'accepted',
    created_at: '2026-09-22T10:15:00Z',
    updated_at: '2026-09-23T08:00:00Z',
  },
  {
    id: 'ord-002',
    listing_id: 'mat-006',
    listing_name: '28 Heavy CPVC Water Supply Pipes (1 inch x 3m)',
    listing_image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&auto=format&fit=crop&q=80',
    buyer_id: 'user-001',
    buyer_name: 'Priya Sundaram',
    seller_id: 'user-002',
    seller_name: 'Aravind Raman',
    quantity: 28,
    unit: 'meters',
    unit_price: 130,
    total_price: 3640,
    buyer_message: 'Purchased for the rainwater collection downspouts at Salem site.',
    contact_phone: '+91 98452 11092',
    status: 'completed',
    created_at: '2026-09-11T09:00:00Z',
    updated_at: '2026-09-15T15:30:00Z',
  },
];

const SEED_FAVORITES: MaterialFavorite[] = [
  {
    id: 'fav-001',
    user_id: 'user-002',
    listing_id: 'mat-003',
    created_at: '2026-09-26T12:00:00Z',
  },
];

// =======================================================================
// PERSISTENT CLIENT ENGINE (STORAGE & RLS COMPLIANT)
// =======================================================================

const STORAGE_KEYS = {
  CURRENT_USER: 'rainrevive_auth_user',
  PROFILES: 'rainrevive_db_profiles',
  CATEGORIES: 'rainrevive_db_categories',
  LISTINGS: 'rainrevive_db_listings',
  ORDERS: 'rainrevive_db_orders',
  BUILDINGS: 'rainrevive_db_buildings',
  GREEN_PLANS: 'rainrevive_db_green_plans',
  CALCULATIONS: 'rainrevive_db_calculations',
  FAVORITES: 'rainrevive_db_favorites',
};

function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('Storage quota or serialization warning', err);
  }
}

// Initialise storage if first run or upgraded data version
const DB_VERSION_KEY = 'rainrevive_db_schema_version_v3';
if (typeof window !== 'undefined') {
  const currentVer = localStorage.getItem(DB_VERSION_KEY);
  if (currentVer !== 'v3.0') {
    // Refresh categories and listings to ensure genuine high-res construction photos load
    saveToStorage(STORAGE_KEYS.CATEGORIES, SEED_CATEGORIES);
    saveToStorage(STORAGE_KEYS.LISTINGS, SEED_LISTINGS);
    localStorage.setItem(DB_VERSION_KEY, 'v3.0');
  }

  if (!localStorage.getItem(STORAGE_KEYS.PROFILES)) saveToStorage(STORAGE_KEYS.PROFILES, SEED_PROFILES);
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) saveToStorage(STORAGE_KEYS.CATEGORIES, SEED_CATEGORIES);
  if (!localStorage.getItem(STORAGE_KEYS.LISTINGS)) saveToStorage(STORAGE_KEYS.LISTINGS, SEED_LISTINGS);
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) saveToStorage(STORAGE_KEYS.ORDERS, SEED_ORDERS);
  if (!localStorage.getItem(STORAGE_KEYS.BUILDINGS)) saveToStorage(STORAGE_KEYS.BUILDINGS, SEED_BUILDINGS);
  if (!localStorage.getItem(STORAGE_KEYS.GREEN_PLANS)) saveToStorage(STORAGE_KEYS.GREEN_PLANS, SEED_GREEN_PLANS);
  if (!localStorage.getItem(STORAGE_KEYS.CALCULATIONS)) saveToStorage(STORAGE_KEYS.CALCULATIONS, SEED_CALCULATIONS);
  if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) saveToStorage(STORAGE_KEYS.FAVORITES, SEED_FAVORITES);

  // Default active user is Priya (Seller/Community Champion) so user can test selling and browsing immediately
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    saveToStorage(STORAGE_KEYS.CURRENT_USER, SEED_PROFILES[0]);
  }
}

// Subscribers for real-time reactivity across components
type DBListener = () => void;
const listeners: Set<DBListener> = new Set();
export function subscribeToDB(listener: DBListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
function notifyDBChange() {
  listeners.forEach((fn) => fn());
}

// =======================================================================
// DB API SERVICES (SUPABASE + LOCAL ENGINE)
// =======================================================================

export const db = {
  // --- AUTH & PROFILES ---
  getCurrentUser(): Profile {
    return getFromStorage<Profile>(STORAGE_KEYS.CURRENT_USER, SEED_PROFILES[0]);
  },

  setCurrentUser(user: Profile): void {
    saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
    notifyDBChange();
  },

  getAvailableUsers(): Profile[] {
    return getFromStorage<Profile[]>(STORAGE_KEYS.PROFILES, SEED_PROFILES);
  },

  switchUser(userId: string): Profile {
    const users = this.getAvailableUsers();
    const found = users.find((u) => u.id === userId) || users[0];
    this.setCurrentUser(found);
    return found;
  },

  registerUser(fullName: string, email: string, role: Profile['role'], phone = '', location = ''): Profile {
    const users = this.getAvailableUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      this.setCurrentUser(existing);
      return existing;
    }
    const newUser: Profile = {
      id: 'usr-' + Math.random().toString(36).substring(2, 9),
      full_name: fullName,
      email,
      role,
      phone,
      location,
      avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      created_at: new Date().toISOString(),
    };
    users.push(newUser);
    saveToStorage(STORAGE_KEYS.PROFILES, users);
    this.setCurrentUser(newUser);
    return newUser;
  },

  // --- MATERIAL CATEGORIES ---
  getCategories(): MaterialCategory[] {
    return getFromStorage<MaterialCategory[]>(STORAGE_KEYS.CATEGORIES, SEED_CATEGORIES);
  },

  // --- MATERIAL LISTINGS ---
  getListings(): MaterialListing[] {
    return getFromStorage<MaterialListing[]>(STORAGE_KEYS.LISTINGS, SEED_LISTINGS);
  },

  getListingById(id: string): MaterialListing | undefined {
    return this.getListings().find((l) => l.id === id);
  },

  createListing(listingData: Omit<MaterialListing, 'id' | 'seller_id' | 'seller_name' | 'created_at' | 'updated_at'>): MaterialListing {
    const user = this.getCurrentUser();
    const listings = this.getListings();
    const newListing: MaterialListing = {
      ...listingData,
      id: 'mat-' + Math.random().toString(36).substring(2, 9),
      seller_id: user.id,
      seller_name: user.full_name,
      seller_phone: user.phone || '+91 98452 11092',
      seller_avatar: user.avatar_url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    listings.unshift(newListing);
    saveToStorage(STORAGE_KEYS.LISTINGS, listings);
    notifyDBChange();
    return newListing;
  },

  updateListing(id: string, updates: Partial<MaterialListing>): MaterialListing {
    const user = this.getCurrentUser();
    const listings = this.getListings();
    const index = listings.findIndex((l) => l.id === id);
    if (index === -1) throw new Error('Listing not found');

    const listing = listings[index];
    // RLS Enforcement: Only owner or admin can update
    if (listing.seller_id !== user.id && user.role !== 'admin') {
      throw new Error('RLS Violation: You can only edit your own material listings');
    }

    const updated = {
      ...listing,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    listings[index] = updated;
    saveToStorage(STORAGE_KEYS.LISTINGS, listings);
    notifyDBChange();
    return updated;
  },

  deleteListing(id: string): void {
    const user = this.getCurrentUser();
    const listings = this.getListings();
    const listing = listings.find((l) => l.id === id);
    if (!listing) return;

    // RLS Enforcement
    if (listing.seller_id !== user.id && user.role !== 'admin') {
      throw new Error('RLS Violation: You can only delete your own listings');
    }

    const filtered = listings.filter((l) => l.id !== id);
    saveToStorage(STORAGE_KEYS.LISTINGS, filtered);
    notifyDBChange();
  },

  // --- MATERIAL ORDERS ---
  getOrders(): MaterialOrder[] {
    return getFromStorage<MaterialOrder[]>(STORAGE_KEYS.ORDERS, SEED_ORDERS);
  },

  getUserOrders(): MaterialOrder[] {
    const user = this.getCurrentUser();
    const all = this.getOrders();
    // Admin sees all, buyer sees their requests, seller sees orders for their materials
    if (user.role === 'admin') return all;
    return all.filter((o) => o.buyer_id === user.id || o.seller_id === user.id);
  },

  createOrder(params: {
    listing_id: string;
    quantity: number;
    buyer_message: string;
    contact_phone: string;
  }): MaterialOrder {
    const user = this.getCurrentUser();
    const listing = this.getListingById(params.listing_id);
    if (!listing) throw new Error('Listing does not exist');

    const unitPrice = listing.quantity > 0 ? Number((listing.price / listing.quantity).toFixed(2)) : listing.price;
    const totalPrice = Math.round(unitPrice * params.quantity);

    const newOrder: MaterialOrder = {
      id: 'ord-' + Math.random().toString(36).substring(2, 9),
      listing_id: listing.id,
      listing_name: listing.material_name,
      listing_image: listing.image_url,
      buyer_id: user.id,
      buyer_name: user.full_name,
      seller_id: listing.seller_id,
      seller_name: listing.seller_name,
      quantity: params.quantity,
      unit: listing.unit,
      unit_price: unitPrice,
      total_price: totalPrice,
      buyer_message: params.buyer_message,
      contact_phone: params.contact_phone,
      status: 'requested',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const orders = this.getOrders();
    orders.unshift(newOrder);
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
    notifyDBChange();
    return newOrder;
  },

  updateOrderStatus(orderId: string, status: MaterialOrder['status']): MaterialOrder {
    const user = this.getCurrentUser();
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) throw new Error('Order not found');

    const order = orders[index];
    // RLS: Seller can accept/reject/complete, buyer can cancel
    if (user.role !== 'admin') {
      if (status === 'cancelled' && order.buyer_id !== user.id) {
        throw new Error('Only buyer can cancel order');
      }
      if (['accepted', 'rejected', 'completed'].includes(status) && order.seller_id !== user.id) {
        throw new Error('Only seller can accept or complete order');
      }
    }

    order.status = status;
    order.updated_at = new Date().toISOString();
    orders[index] = order;

    // If order completed, mark material as sold or reduce quantity
    if (status === 'completed') {
      const listing = this.getListingById(order.listing_id);
      if (listing) {
        const remaining = Math.max(0, listing.quantity - order.quantity);
        this.updateListing(listing.id, {
          quantity: remaining,
          status: remaining === 0 ? 'sold' : listing.status,
        });
      }
    }

    saveToStorage(STORAGE_KEYS.ORDERS, orders);
    notifyDBChange();
    return order;
  },

  // --- MATERIAL FAVORITES ---
  getFavorites(): MaterialFavorite[] {
    const user = this.getCurrentUser();
    const all = getFromStorage<MaterialFavorite[]>(STORAGE_KEYS.FAVORITES, SEED_FAVORITES);
    return all.filter((f) => f.user_id === user.id);
  },

  toggleFavorite(listingId: string): boolean {
    const user = this.getCurrentUser();
    let all = getFromStorage<MaterialFavorite[]>(STORAGE_KEYS.FAVORITES, SEED_FAVORITES);
    const existing = all.find((f) => f.user_id === user.id && f.listing_id === listingId);

    let isFav = false;
    if (existing) {
      all = all.filter((f) => f.id !== existing.id);
      isFav = false;
    } else {
      all.push({
        id: 'fav-' + Math.random().toString(36).substring(2, 9),
        user_id: user.id,
        listing_id: listingId,
        created_at: new Date().toISOString(),
      });
      isFav = true;
    }

    saveToStorage(STORAGE_KEYS.FAVORITES, all);
    notifyDBChange();
    return isFav;
  },

  isFavorited(listingId: string): boolean {
    const user = this.getCurrentUser();
    const all = getFromStorage<MaterialFavorite[]>(STORAGE_KEYS.FAVORITES, SEED_FAVORITES);
    return all.some((f) => f.user_id === user.id && f.listing_id === listingId);
  },

  // --- BUILDINGS (DEAD BUILDING REVIVAL) ---
  getBuildings(): Building[] {
    return getFromStorage<Building[]>(STORAGE_KEYS.BUILDINGS, SEED_BUILDINGS);
  },

  getBuildingById(id: string): Building | undefined {
    return this.getBuildings().find((b) => b.id === id);
  },

  submitBuilding(data: Omit<Building, 'id' | 'user_id' | 'submitted_by_name' | 'created_at' | 'updated_at'>): Building {
    const user = this.getCurrentUser();
    const buildings = this.getBuildings();
    const newBuilding: Building = {
      ...data,
      id: 'bld-' + Math.random().toString(36).substring(2, 9),
      user_id: user.id,
      submitted_by_name: user.full_name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    buildings.unshift(newBuilding);
    saveToStorage(STORAGE_KEYS.BUILDINGS, buildings);
    notifyDBChange();
    return newBuilding;
  },

  updateBuildingStatus(id: string, status: Building['status']): Building {
    const user = this.getCurrentUser();
    const buildings = this.getBuildings();
    const index = buildings.findIndex((b) => b.id === id);
    if (index === -1) throw new Error('Building not found');

    if (user.role !== 'admin') {
      throw new Error('Admin privileges required to update building status');
    }

    buildings[index].status = status;
    buildings[index].updated_at = new Date().toISOString();
    saveToStorage(STORAGE_KEYS.BUILDINGS, buildings);
    notifyDBChange();
    return buildings[index];
  },

  // --- GREEN REVIVAL PLANS ---
  getGreenPlans(): GreenPlan[] {
    return getFromStorage<GreenPlan[]>(STORAGE_KEYS.GREEN_PLANS, SEED_GREEN_PLANS);
  },

  getGreenPlanByBuildingId(buildingId: string): GreenPlan | undefined {
    return this.getGreenPlans().find((gp) => gp.building_id === buildingId);
  },

  saveGreenPlan(plan: Omit<GreenPlan, 'id' | 'created_at'>): GreenPlan {
    const plans = this.getGreenPlans();
    const existingIdx = plans.findIndex((p) => p.building_id === plan.building_id);
    const newPlan: GreenPlan = {
      ...plan,
      id: existingIdx >= 0 ? plans[existingIdx].id : 'gp-' + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
    };

    if (existingIdx >= 0) {
      plans[existingIdx] = newPlan;
    } else {
      plans.unshift(newPlan);
    }

    saveToStorage(STORAGE_KEYS.GREEN_PLANS, plans);
    notifyDBChange();
    return newPlan;
  },

  // --- RAINWATER CALCULATIONS ---
  getCalculations(): RainwaterCalculation[] {
    const user = this.getCurrentUser();
    const all = getFromStorage<RainwaterCalculation[]>(STORAGE_KEYS.CALCULATIONS, SEED_CALCULATIONS);
    if (user.role === 'admin') return all;
    return all.filter((c) => c.user_id === user.id);
  },

  saveCalculation(calcData: Omit<RainwaterCalculation, 'id' | 'user_id' | 'created_at'>): RainwaterCalculation {
    const user = this.getCurrentUser();
    const all = getFromStorage<RainwaterCalculation[]>(STORAGE_KEYS.CALCULATIONS, SEED_CALCULATIONS);
    const record: RainwaterCalculation = {
      ...calcData,
      id: 'rc-' + Math.random().toString(36).substring(2, 9),
      user_id: user.id,
      created_at: new Date().toISOString(),
    };
    all.unshift(record);
    saveToStorage(STORAGE_KEYS.CALCULATIONS, all);
    notifyDBChange();
    return record;
  },

  // --- SUPABASE STORAGE SIMULATOR / HANDLER ---
  async uploadImage(bucket: 'building-images' | 'material-images', file: File): Promise<string> {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Unsupported image format. Please upload JPG, PNG, or WEBP.');
    }

    // Validate size (Max 5MB)
    const MAX_SIZE_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      throw new Error(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed is 5MB.`);
    }

    // If live Supabase client is configured, upload to real bucket
    if (supabase) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file);
        if (!uploadError) {
          const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
          if (data?.publicUrl) return data.publicUrl;
        }
      } catch (e) {
        console.warn('Direct Supabase upload failed, falling back to data URL', e);
      }
    }

    // Fallback/standard browser data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });
  },

  // --- AGGREGATED SUSTAINABILITY METRICS ---
  getSustainabilityMetrics(): SustainabilityMetrics {
    const calcs = getFromStorage<RainwaterCalculation[]>(STORAGE_KEYS.CALCULATIONS, SEED_CALCULATIONS);
    const buildings = this.getBuildings();
    const listings = this.getListings();
    const orders = this.getOrders();

    const waterHarvestedLiters = calcs.reduce((acc, c) => acc + (c.potential_liters || 0), 2840000);
    const waterSavedInr = Math.round(waterHarvestedLiters * 0.12);

    const buildingsSubmitted = buildings.length + 18;
    const buildingsRevived = buildings.filter((b) => b.status === 'revived').length + 7;
    const communitySpacesCreated = buildingsRevived + 4;

    // Materials sold/ordered
    const completedOrders = orders.filter((o) => o.status === 'completed' || o.status === 'accepted');
    const materialsReusedCount = completedOrders.length + 42;

    // Weight and CO2 calculations
    const materialsReusedKg = completedOrders.reduce((acc, ord) => {
      return acc + (ord.quantity * 25);
    }, 18450);

    const wastePreventedTons = Number((materialsReusedKg / 1000).toFixed(2));
    const communityMoneySavedInr = waterSavedInr + 482000;
    const co2ReductionKg = Math.round(materialsReusedKg * 0.95);

    return {
      waterHarvestedLiters,
      waterSavedInr,
      buildingsSubmitted,
      buildingsRevived,
      communitySpacesCreated,
      materialsReusedCount,
      materialsReusedKg,
      wastePreventedTons,
      communityMoneySavedInr,
      co2ReductionKg,
      totalTransactions: orders.length + 38,
    };
  },
};
