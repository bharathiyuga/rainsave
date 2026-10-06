import { useState, useEffect, useMemo } from 'react';
import { db, subscribeToDB } from '../lib/supabase';
import { MaterialListing, MaterialCategory } from '../types';
import { useRouter } from '../context/NavigationContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { calculateMaterialImpact } from '../utils/sustainability';
import confetti from 'canvas-confetti';
import {
  Layers,
  Search,
  Filter,
  PlusCircle,
  MapPin,
  Heart,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  SlidersHorizontal,
  CheckCircle2,
  X,
  LayoutGrid,
  List,
  Eye,
  Phone,
  Send,
  ShieldCheck,
  Package,
  TrendingDown,
  Info
} from 'lucide-react';

export function MaterialsMarketplacePage() {
  const { navigate } = useRouter();
  const { success, error, info } = useToast();
  const { user } = useAuth();

  const [listings, setListings] = useState<MaterialListing[]>(() => db.getListings());
  const [categories, setCategories] = useState<MaterialCategory[]>(() => db.getCategories());

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(50000);
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(true);
  const [onlyNegotiable, setOnlyNegotiable] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'qty_desc'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Quick Buy Request Modal State
  const [buyTargetListing, setBuyTargetListing] = useState<MaterialListing | null>(null);
  const [requestQty, setRequestQty] = useState<number>(1);
  const [buyerMessage, setBuyerMessage] = useState<string>('');
  const [buyerPhone, setBuyerPhone] = useState<string>(user.phone || '+91 94432 88471');
  const [submittingOrder, setSubmittingOrder] = useState<boolean>(false);

  // Quick View Modal State
  const [quickViewListing, setQuickViewListing] = useState<MaterialListing | null>(null);

  useEffect(() => {
    const unsub = subscribeToDB(() => {
      setListings(db.getListings());
      setCategories(db.getCategories());
    });
    return unsub;
  }, []);

  // Update phone when user changes
  useEffect(() => {
    if (user.phone) setBuyerPhone(user.phone);
  }, [user]);

  // Filtered and sorted listings
  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.material_name.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchLoc = item.location.toLowerCase().includes(q);
          const matchCat = item.category.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchLoc && !matchCat) return false;
        }

        if (selectedCategory !== 'all' && item.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
        if (selectedCondition !== 'all' && item.condition !== selectedCondition) return false;
        if (selectedLocation !== 'all' && !item.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
          return false;
        }
        if (item.price < minPrice || item.price > maxPrice) return false;
        if (onlyAvailable && item.status !== 'available') return false;
        if (onlyNegotiable && !item.negotiable) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'qty_desc') return b.quantity - a.quantity;
        return 0;
      });
  }, [
    listings,
    searchQuery,
    selectedCategory,
    selectedCondition,
    selectedLocation,
    minPrice,
    maxPrice,
    onlyAvailable,
    onlyNegotiable,
    sortBy,
  ]);

  const handleFavoriteToggle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const isNowFav = db.toggleFavorite(id);
    if (isNowFav) {
      success('Added to your saved favorites', 'Saved');
    } else {
      success('Removed from your favorites', 'Removed');
    }
  };

  const openBuyModal = (e: React.MouseEvent, item: MaterialListing) => {
    e.stopPropagation();
    setBuyTargetListing(item);
    const initialQty = Math.max(1, Math.min(item.quantity, Math.round(item.quantity * 0.5) || 1));
    setRequestQty(initialQty);
    setBuyerMessage(`Hi ${item.seller_name}, I am interested in purchasing this leftover ${item.material_name}. Can we coordinate pickup/transport?`);
  };

  const handleSendOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyTargetListing) return;

    if (requestQty <= 0) {
      error('Please specify a quantity greater than zero.');
      return;
    }

    if (requestQty > buyTargetListing.quantity) {
      error(`Maximum available is ${buyTargetListing.quantity} ${buyTargetListing.unit}.`);
      return;
    }

    if (!buyerPhone.trim()) {
      error('Please provide a contact phone number for the seller.');
      return;
    }

    try {
      setSubmittingOrder(true);
      db.createOrder({
        listing_id: buyTargetListing.id,
        quantity: requestQty,
        buyer_message: buyerMessage,
        contact_phone: buyerPhone,
      });

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.65 },
      });

      success(
        `Purchase request for ${requestQty} ${buyTargetListing.unit} dispatched to ${buyTargetListing.seller_name}!`,
        'Request Sent'
      );
      setBuyTargetListing(null);
    } catch (err: any) {
      error(err.message || 'Failed to place purchase request');
    } finally {
      setSubmittingOrder(false);
    }
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCondition('all');
    setSelectedLocation('all');
    setMinPrice(0);
    setMaxPrice(50000);
    setOnlyAvailable(false);
    setOnlyNegotiable(false);
    setSortBy('newest');
  };

  const isFilterActive =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'all' ||
    selectedCondition !== 'all' ||
    selectedLocation !== 'all' ||
    onlyNegotiable ||
    maxPrice < 50000;

  return (
    <div className="space-y-10 pb-28 text-slate-100">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#091528] via-[#08101e] to-[#070c18] border-b border-slate-800/80 pt-12 pb-16">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center md:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pillar 3: Construction Material Reuse</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                “Give Extra Materials a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Second Life</span>.”
              </h1>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                “Buy affordable leftover construction materials directly from nearby sites instead of letting usable resources go to waste.”
              </p>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
              <button
                onClick={() => navigate('/sell-material')}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Sell Leftover Materials</span>
              </button>

              <button
                onClick={() => navigate('/my-orders')}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs sm:text-sm border border-slate-700 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                <span>My Requests</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VISUAL REAL-PHOTO CATEGORY SELECTOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Browse by Material Category</span>
          </h2>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold underline flex items-center gap-1"
            >
              <span>Show All ({listings.length})</span>
            </button>
          )}
        </div>

        {/* Visual Category Cards Carousel */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
          {/* "All" Card */}
          <button
            onClick={() => setSelectedCategory('all')}
            className={`group relative overflow-hidden rounded-2xl p-3 text-left transition-all border cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-br from-emerald-950/90 to-slate-900 border-emerald-500 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/40'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
              <Layers className="w-4 h-4" />
            </div>
            <p className="font-extrabold text-xs text-white leading-tight">All Materials</p>
            <span className="text-[10px] text-slate-400 font-semibold">{listings.length} listed</span>
          </button>

          {/* Individual Category Cards with Real Images */}
          {categories.slice(0, 13).map((cat) => {
            const count = listings.filter((l) => l.category.toLowerCase() === cat.name.toLowerCase()).length;
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? 'all' : cat.name)}
                className={`group relative overflow-hidden rounded-2xl transition-all border text-left h-24 flex flex-col justify-end p-2.5 cursor-pointer ${
                  isSelected
                    ? 'border-emerald-400 shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-400'
                    : 'border-slate-800 hover:border-slate-650 hover:shadow-md'
                }`}
              >
                {/* Real photo background */}
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Gradient tint overlay */}
                <div className={`absolute inset-0 transition-opacity ${
                  isSelected
                    ? 'bg-gradient-to-t from-slate-950 via-slate-950/70 to-emerald-950/50'
                    : 'bg-gradient-to-t from-slate-950 via-slate-950/70 to-black/30 group-hover:via-slate-950/60'
                }`} />

                {/* Content */}
                <div className="relative z-10">
                  <p className="font-extrabold text-xs text-white drop-shadow-md group-hover:text-emerald-300 transition-colors">
                    {cat.name}
                  </p>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                    isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900/90 text-slate-300'
                  }`}>
                    {count} items
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. SEARCH & CONTROLS TOOLBAR */}
      <section id="catalog-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Main Search & Bar */}
        <div className="bg-[#0b1222]/95 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Big Search Input */}
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search bricks, cement, TMT steel, pipes, Salem, Chennai..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl text-xs bg-slate-950 border border-slate-750 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Pill Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {/* Condition Filter */}
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-750 text-xs font-semibold text-slate-300 bg-slate-950 outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Condition: Any</option>
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Used">Used</option>
            </select>

            {/* City Hub Filter */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-750 text-xs font-semibold text-slate-300 bg-slate-950 outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Hub: All Cities</option>
              <option value="salem">Salem</option>
              <option value="coimbatore">Coimbatore</option>
              <option value="chennai">Chennai</option>
              <option value="bengaluru">Bengaluru</option>
              <option value="madurai">Madurai</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-750 text-xs font-semibold text-slate-300 bg-slate-950 outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="qty_desc">Quantity: High to Low</option>
            </select>

            {/* View Mode Toggle: Grid vs List */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-750">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="List / Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* More Filters Toggle */}
            <button
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                showFilterDrawer || isFilterActive
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-950 border-slate-750 text-slate-300 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Budget & Filters</span>
            </button>
          </div>
        </div>

        {/* Quick Filter Bar (One-click chips) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 font-bold shrink-0 text-[11px] uppercase tracking-wide">Quick:</span>
          
          <button
            onClick={() => setOnlyAvailable(!onlyAvailable)}
            className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-all ${
              onlyAvailable
                ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🟢 Available Only
          </button>

          <button
            onClick={() => setOnlyNegotiable(!onlyNegotiable)}
            className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-all ${
              onlyNegotiable
                ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🏷️ Negotiable Only
          </button>

          <button
            onClick={() => {
              setMaxPrice(5000);
            }}
            className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-all ${
              maxPrice === 5000
                ? 'bg-cyan-950 border border-cyan-500/40 text-cyan-300'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            ⚡ Under ₹5,000
          </button>

          <button
            onClick={() => {
              setMaxPrice(15000);
            }}
            className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-all ${
              maxPrice === 15000
                ? 'bg-cyan-950 border border-cyan-500/40 text-cyan-300'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            💰 Under ₹15,000
          </button>

          {['Salem', 'Coimbatore', 'Chennai', 'Bengaluru'].map((city) => (
            <button
              key={city}
              onClick={() => setSelectedLocation(selectedLocation.toLowerCase() === city.toLowerCase() ? 'all' : city)}
              className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-all ${
                selectedLocation.toLowerCase() === city.toLowerCase()
                  ? 'bg-teal-950 border border-teal-500/40 text-teal-300'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              📍 {city}
            </button>
          ))}

          {isFilterActive && (
            <button
              onClick={resetAllFilters}
              className="px-2.5 py-1 rounded-lg font-bold text-rose-400 hover:text-rose-300 underline shrink-0 ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Extended Slider Drawer */}
        {showFilterDrawer && (
          <div className="bg-[#0c1424] p-5 rounded-3xl border border-slate-800 space-y-4 animate-in fade-in-50">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Budget Slider & Criteria
              </span>
              <button
                onClick={resetAllFilters}
                className="text-xs text-emerald-400 hover:underline font-semibold"
              >
                Clear Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Max Budget Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-400">Maximum Price</span>
                  <span className="font-bold text-emerald-400 font-mono text-sm">₹{maxPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="1000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>₹1,000</span>
                  <span>₹25,000</span>
                  <span>₹50,000</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-col justify-center space-y-2.5 text-xs text-slate-300">
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={(e) => setOnlyAvailable(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-900 border-slate-700"
                  />
                  <span>Exclude Sold Out Materials</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={onlyNegotiable}
                    onChange={(e) => setOnlyNegotiable(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-900 border-slate-700"
                  />
                  <span>Show Only Negotiable Pricing</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Results Count & Active Category Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <p>
            Showing <strong className="text-white">{filteredListings.length}</strong> available material lots
            {selectedCategory !== 'all' && (
              <span> in <strong className="text-emerald-400">{selectedCategory}</strong></span>
            )}
          </p>
        </div>

        {/* 4. RESULTS DISPLAY: GRID OR LIST VIEW */}
        {filteredListings.length === 0 ? (
          <div className="bg-[#0b1222] rounded-3xl p-16 text-center border border-slate-800 space-y-4">
            <Layers className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No surplus materials matched</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No construction materials match your current filter settings. Try adjusting your category or price range.
            </p>
            <button
              onClick={resetAllFilters}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-600/30"
            >
              Clear All Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((item) => {
              const isFav = db.isFavorited(item.id);
              const unitPrice = item.quantity > 0 ? Math.round(item.price / item.quantity) : item.price;

              return (
                <div
                  key={item.id}
                  onClick={() => navigate(`/materials/${item.id}`)}
                  className="group relative bg-[#0b1325]/90 backdrop-blur-xl rounded-3xl overflow-hidden border border-slate-800 hover:border-emerald-500/50 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Real Image Container */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                      <img
                        src={item.image_url}
                        alt={item.material_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      
                      {/* Gradient Vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30 pointer-events-none" />

                      {/* Category Badge */}
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-950/85 text-white backdrop-blur-md border border-slate-700/80 shadow-md">
                        {item.category}
                      </span>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => handleFavoriteToggle(e, item.id)}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md shadow-md transition-all ${
                          isFav
                            ? 'bg-rose-500 text-white shadow-rose-500/40'
                            : 'bg-black/60 text-white hover:bg-black/80 hover:text-rose-400'
                        }`}
                        title="Save to favorites"
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                      </button>

                      {/* Status Tag */}
                      <span
                        className={`absolute bottom-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                          item.status === 'available'
                            ? 'bg-emerald-600 text-white'
                            : item.status === 'reserved'
                            ? 'bg-amber-600 text-white'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {item.status}
                      </span>

                      {/* Condition Tag */}
                      <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-900/90 text-slate-300 border border-slate-700">
                        {item.condition}
                      </span>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 sm:p-5 space-y-3">
                      <div>
                        <h3 className="font-extrabold text-white text-sm sm:text-base group-hover:text-emerald-400 transition-colors line-clamp-1 leading-snug">
                          {item.material_name}
                        </h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </p>
                      </div>

                      {/* Stock & Unit Price Pill */}
                      <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="font-bold text-slate-300">
                          {item.quantity} {item.unit}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          ~₹{unitPrice} / {item.unit.replace(/s$/, '')}
                        </span>
                      </div>

                      {/* Seller Tag */}
                      <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
                        <div className="flex items-center gap-2">
                          <img
                            src={item.seller_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                            alt=""
                            className="w-5 h-5 rounded-full object-cover ring-1 ring-emerald-500/30"
                          />
                          <span className="truncate text-slate-300 font-semibold">{item.seller_name}</span>
                        </div>
                        {item.negotiable && (
                          <span className="text-[10px] font-bold text-emerald-400">
                            Negotiable
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Price & Quick Action Buttons */}
                  <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Price</span>
                      <span className="text-base sm:text-lg font-black text-white font-mono">
                        ₹{item.price.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Quick View Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuickViewListing(item);
                        }}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-750 transition-colors"
                        title="Quick View"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Request to Buy Button */}
                      <button
                        onClick={(e) => openBuyModal(e, item)}
                        disabled={item.status !== 'available'}
                        className="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs transition-all shadow-md shadow-emerald-600/30 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1"
                      >
                        <span>Buy Request</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* COMPACT LIST / TABLE VIEW */
          <div className="bg-[#0b1325]/90 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Material</th>
                    <th className="py-3.5 px-3">Category</th>
                    <th className="py-3.5 px-3">Available Stock</th>
                    <th className="py-3.5 px-3">Condition</th>
                    <th className="py-3.5 px-3">Location</th>
                    <th className="py-3.5 px-4 text-right">Asking Price</th>
                    <th className="py-3.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-medium text-slate-200">
                  {filteredListings.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => navigate(`/materials/${item.id}`)}
                      className="hover:bg-slate-900/60 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image_url}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-800 shrink-0"
                          />
                          <div>
                            <p className="font-extrabold text-white text-xs hover:text-emerald-400">
                              {item.material_name}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate max-w-xs">{item.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 font-semibold border border-slate-800">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-100">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="py-3.5 px-3 text-slate-300">{item.condition}</td>
                      <td className="py-3.5 px-3 text-slate-300">{item.location}</td>
                      <td className="py-3.5 px-4 text-right">
                        <p className="font-black text-white text-sm font-mono">₹{item.price.toLocaleString()}</p>
                        {item.negotiable && <span className="text-[10px] text-emerald-400">Negotiable</span>}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuickViewListing(item);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                            title="Quick view"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => openBuyModal(e, item)}
                            disabled={item.status !== 'available'}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 disabled:opacity-40"
                          >
                            Request Buy
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </section>

      {/* 5. QUICK BUY REQUEST MODAL (DIRECT FROM MARKETPLACE) */}
      {buyTargetListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#0c1426] rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-2xl space-y-5">
            <button
              onClick={() => setBuyTargetListing(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with Product Preview */}
            <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
              <img
                src={buyTargetListing.image_url}
                alt=""
                className="w-16 h-16 rounded-2xl object-cover ring-1 ring-emerald-500/30 shrink-0"
              />
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Direct Purchase Request
                </span>
                <h3 className="font-black text-white text-base leading-snug line-clamp-1">
                  {buyTargetListing.material_name}
                </h3>
                <p className="text-xs text-slate-400">
                  Seller: <strong className="text-white">{buyTargetListing.seller_name}</strong> • {buyTargetListing.location}
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSendOrder} className="space-y-4">
              
              {/* Quantity Stepper & Price Calculation */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">
                    Required Quantity ({buyTargetListing.unit}):
                  </span>
                  <span className="text-xs text-slate-400">
                    Max: <strong className="text-white">{buyTargetListing.quantity} {buyTargetListing.unit}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setRequestQty((prev) => Math.max(1, prev - 1))}
                    className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-base hover:bg-slate-800 flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>

                  <input
                    type="number"
                    min="1"
                    max={buyTargetListing.quantity}
                    value={requestQty}
                    onChange={(e) => setRequestQty(Math.min(buyTargetListing.quantity, Math.max(1, Number(e.target.value))))}
                    className="flex-1 py-2 px-3 text-center rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-base outline-none focus:ring-2 focus:ring-emerald-500"
                  />

                  <button
                    type="button"
                    onClick={() => setRequestQty((prev) => Math.min(buyTargetListing.quantity, prev + 1))}
                    className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-base hover:bg-slate-800 flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Live Total Price Calculation */}
                {(() => {
                  const unitPrice = buyTargetListing.quantity > 0 ? Number((buyTargetListing.price / buyTargetListing.quantity).toFixed(2)) : buyTargetListing.price;
                  const total = Math.round(requestQty * unitPrice);

                  return (
                    <div className="flex items-center justify-between pt-2 border-t border-slate-850 text-xs">
                      <div>
                        <span className="text-slate-400">Unit Price: </span>
                        <span className="font-mono font-bold text-white">₹{unitPrice} / {buyTargetListing.unit}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 text-[11px] block">Estimated Total:</span>
                        <span className="text-base font-black text-emerald-400 font-mono">₹{total.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Message to Seller */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-300 flex items-center justify-between">
                  <span>Message to Seller</span>
                  <span className="text-[10px] text-slate-500">Coordinate pickup/delivery</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={buyerMessage}
                  onChange={(e) => setBuyerMessage(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-750 text-xs text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Buyer Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-300">
                  Your Contact Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="+91 94432 00000"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-750 text-xs text-white outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBuyTargetListing(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingOrder}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingOrder ? 'Submitting...' : 'Send Buy Request'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. QUICK VIEW MODAL */}
      {quickViewListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#0c1426] rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setQuickViewListing(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Photo */}
              <div className="space-y-3">
                <div className="relative h-56 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                  <img
                    src={quickViewListing.image_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-black/80 text-white border border-slate-700">
                    {quickViewListing.category}
                  </span>
                </div>

                {quickViewListing.additional_images && quickViewListing.additional_images.length > 0 && (
                  <div className="flex gap-2">
                    {quickViewListing.additional_images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt=""
                        className="w-16 h-16 rounded-xl object-cover border border-slate-700"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-black text-white leading-tight">
                    {quickViewListing.material_name}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{quickViewListing.location}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Quantity</span>
                    <span className="font-bold text-white font-mono">{quickViewListing.quantity} {quickViewListing.unit}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Condition</span>
                    <span className="font-bold text-white">{quickViewListing.condition}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {quickViewListing.description}
                </p>

                {/* Seller & Total Price */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={quickViewListing.seller_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-emerald-500/40"
                    />
                    <div>
                      <p className="font-bold text-xs text-white">{quickViewListing.seller_name}</p>
                      <p className="text-[10px] text-slate-400">{quickViewListing.seller_phone}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Asking Price</span>
                    <span className="text-lg font-black text-emerald-400 font-mono">
                      ₹{quickViewListing.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      setQuickViewListing(null);
                      navigate(`/materials/${quickViewListing.id}`);
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-white font-bold text-xs text-center"
                  >
                    Full Details Page
                  </button>
                  <button
                    onClick={(e) => {
                      setQuickViewListing(null);
                      openBuyModal(e, quickViewListing);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs text-center shadow-lg shadow-emerald-600/30"
                  >
                    Request to Buy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
