import { useState, useEffect } from 'react';
import { db, subscribeToDB } from '../lib/supabase';
import { MaterialListing } from '../types';
import { calculateMaterialImpact } from '../utils/sustainability';
import { useRouter } from '../context/NavigationContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import {
  Layers,
  MapPin,
  Heart,
  Share2,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowLeft,
  Coins,
  Recycle,
  X,
  Send,
  ShoppingBag
} from 'lucide-react';

export function MaterialDetailPage() {
  const { params, navigate } = useRouter();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [listing, setListing] = useState<MaterialListing | undefined>(() =>
    db.getListingById(params.id)
  );
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isFav, setIsFav] = useState(false);

  // Request to Buy Modal State
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [requestedQty, setRequestedQty] = useState(1);
  const [buyerMessage, setBuyerMessage] = useState('');
  const [buyerPhone, setBuyerPhone] = useState(user.phone || '');
  const [submittingOrder, setSubmittingOrder] = useState(false);

  useEffect(() => {
    const unsub = subscribeToDB(() => {
      const item = db.getListingById(params.id);
      setListing(item);
      if (item) {
        setIsFav(db.isFavorited(item.id));
      }
    });
    return unsub;
  }, [params.id]);

  useEffect(() => {
    if (listing) {
      setSelectedImage(listing.image_url);
      setRequestedQty(Math.min(listing.quantity, Math.max(1, Math.round(listing.quantity * 0.5))));
      setIsFav(db.isFavorited(listing.id));
      if (!buyerMessage) {
        setBuyerMessage(`Hello ${listing.seller_name}, I am interested in purchasing this leftover ${listing.material_name}. Could we coordinate pickup?`);
      }
    }
  }, [listing]);

  if (!listing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4 text-slate-100">
        <h2 className="text-2xl font-bold text-white">Material listing not found</h2>
        <p className="text-xs text-slate-400">The listing might have been removed or marked as sold.</p>
        <button
          onClick={() => navigate('/materials')}
          className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
        >
          Back to Marketplace
        </button>
      </div>
    );
  }

  const impact = calculateMaterialImpact(listing.category, listing.quantity, listing.price);
  const unitPrice = listing.quantity > 0 ? Number((listing.price / listing.quantity).toFixed(2)) : listing.price;
  const computedTotalPrice = Math.round(requestedQty * unitPrice);

  const handleFavoriteClick = () => {
    const favState = db.toggleFavorite(listing.id);
    setIsFav(favState);
    if (favState) {
      success('Material saved to your favorites!', 'Saved');
    } else {
      success('Removed from your favorites', 'Removed');
    }
  };

  const handleSendPurchaseRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (requestedQty <= 0) {
      error('Please select a quantity greater than zero.');
      return;
    }
    if (requestedQty > listing.quantity) {
      error(`Requested quantity cannot exceed available stock (${listing.quantity} ${listing.unit}).`);
      return;
    }

    setSubmittingOrder(true);
    try {
      db.createOrder({
        listing_id: listing.id,
        quantity: requestedQty,
        buyer_message: buyerMessage,
        contact_phone: buyerPhone || user.phone || '+91 94432 88471',
      });
      success('Purchase request sent to the seller.', 'Request Sent');
      setShowOrderModal(false);
      navigate('/my-orders');
    } catch (err: any) {
      error(err.message || 'Failed to send purchase request');
    } finally {
      setSubmittingOrder(false);
    }
  };

  const allImages = [listing.image_url, ...(listing.additional_images || [])];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-slate-100">
      
      {/* Top Back Nav & Controls */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={() => navigate('/materials')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Materials Marketplace</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleFavoriteClick}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              isFav
                ? 'bg-rose-950/80 border-rose-500/40 text-rose-300'
                : 'bg-slate-900 border-slate-750 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current text-rose-500' : ''}`} />
            <span>{isFav ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Visuals (7 cols) + Details & Purchase Card (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Gallery & Description Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Photo Display */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl">
            <img
              src={selectedImage || listing.image_url}
              alt={listing.material_name}
              className="w-full h-[400px] object-cover"
            />
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-950/85 text-white shadow-md backdrop-blur-md border border-slate-700">
              {listing.category}
            </span>
            <span
              className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                listing.status === 'available'
                  ? 'bg-emerald-600/90 text-white'
                  : 'bg-amber-600/90 text-white'
              }`}
            >
              {listing.status}
            </span>
          </div>

          {/* Thumbnails row if multiple */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-slate-800'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Description Section */}
          <div className="bg-[#0b1222]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
              Material Description & History
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800 text-xs">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block font-medium">Condition</span>
                <strong className="text-white font-bold">{listing.condition}</strong>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block font-medium">Quantity Available</span>
                <strong className="text-white font-bold font-mono">{listing.quantity} {listing.unit}</strong>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block font-medium">Price Flexibility</span>
                <strong className="text-emerald-400 font-bold">
                  {listing.negotiable ? 'Negotiable' : 'Fixed Price'}
                </strong>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block font-medium">Listed Date</span>
                <strong className="text-white font-bold font-mono">
                  {new Date(listing.created_at).toLocaleDateString()}
                </strong>
              </div>
            </div>
          </div>

          {/* ENVIRONMENTAL IMPACT OF THIS MATERIAL REUSE */}
          <div className="bg-gradient-to-br from-emerald-950 via-[#0a1628] to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-1.5">
                <Recycle className="w-4 h-4 text-emerald-400" /> Circular Reuse Impact
              </span>
              <span className="text-[10px] bg-emerald-950/80 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                Estimated Values
              </span>
            </div>

            <h3 className="text-lg font-bold">
              Environmental & Economic Return by Diverting This Lot
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-xs text-slate-300">Construction Waste Prevented</span>
                <p className="text-2xl font-black text-emerald-400 font-mono">
                  {impact.totalWeightTons} <span className="text-xs font-semibold text-slate-300 font-sans">tons</span>
                </p>
                <p className="text-[11px] text-slate-400 font-mono">≈ {impact.totalWeightKg.toLocaleString()} kg total mass</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-xs text-slate-300">Virgin CO₂ Emissions Saved</span>
                <p className="text-2xl font-black text-sky-400 font-mono">
                  {impact.co2ReductionKg.toLocaleString()} <span className="text-xs font-semibold text-slate-300 font-sans">kg</span>
                </p>
                <p className="text-[11px] text-slate-400">Embodied energy avoided</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-xs text-slate-300">Estimated Cost Saved</span>
                <p className="text-2xl font-black text-amber-400 font-mono">
                  ₹{impact.estimatedSavingsInr.toLocaleString()}
                </p>
                <p className="text-[11px] text-slate-400">vs. buying brand new retail</p>
              </div>
            </div>
          </div>

        </div>

        {/* Purchase Request & Seller Profile Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Action & Price Card */}
          <div className="bg-[#0b1222]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-6">
            
            <div className="space-y-1.5">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
                {listing.material_name}
              </h1>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{listing.location}</span>
              </p>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-750 flex items-baseline justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-slate-400 block">Total Lot Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white font-mono">₹{listing.price.toLocaleString()}</span>
                  <span className="text-xs text-slate-400 font-semibold font-mono">
                    (₹{unitPrice} / {listing.unit.replace(/s$/, '')})
                  </span>
                </div>
              </div>
              {listing.negotiable && (
                <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  Negotiable
                </span>
              )}
            </div>

            {/* Purchase Request Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => setShowOrderModal(true)}
                disabled={listing.status === 'sold'}
                className={`w-full py-3.5 rounded-2xl font-bold text-xs md:text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
                  listing.status === 'sold'
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/30 hover:scale-[1.01] active:scale-95'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{listing.status === 'sold' ? 'Material Already Sold' : 'Request to Buy'}</span>
              </button>

              <button
                onClick={handleFavoriteClick}
                className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-750 transition-all flex items-center justify-center gap-1.5"
              >
                <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current text-rose-500' : ''}`} />
                <span>{isFav ? 'Saved in My Favorites' : 'Save to Favorites'}</span>
              </button>
            </div>

            {/* Seller Information Card */}
            <div className="pt-6 border-t border-slate-800 space-y-4">
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Seller Information
              </h3>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <img
                  src={listing.seller_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt=""
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/40"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm text-white truncate">{listing.seller_name}</p>
                  <p className="text-xs text-emerald-400 font-medium">Verified Sustainable Builder</p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-slate-500" />
                    <span>{listing.seller_phone || '+91 98452 11092'}</span>
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* REQUEST TO BUY MODAL (Dark Glassmorphism) */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-[#0b1424] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-750 space-y-6 animate-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-lg text-white">Request to Buy Material</h3>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendPurchaseRequest} className="space-y-4">
              
              <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-2xl border border-slate-800">
                <img src={listing.image_url} alt="" className="w-12 h-12 rounded-xl object-cover" />
                <div className="min-w-0">
                  <p className="font-bold text-xs text-white truncate">{listing.material_name}</p>
                  <p className="text-[11px] text-slate-400">
                    Seller: <strong className="text-slate-200">{listing.seller_name}</strong> • Available: {listing.quantity} {listing.unit}
                  </p>
                </div>
              </div>

              {/* Quantity Stepper & Price Calculation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-300">
                  <span>Required Quantity ({listing.unit}) *</span>
                  <span className="text-slate-500">Max: {listing.quantity} {listing.unit}</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max={listing.quantity}
                    required
                    value={requestedQty}
                    onChange={(e) => setRequestedQty(Math.min(listing.quantity, Math.max(1, Number(e.target.value))))}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 font-extrabold text-base text-white outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                  <div className="p-3 bg-emerald-950/80 rounded-xl border border-emerald-500/40 text-right">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase block">Total Price</span>
                    <strong className="text-base font-black text-emerald-300 font-mono">
                      ₹{computedTotalPrice.toLocaleString()}
                    </strong>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  Calculated: {requestedQty} {listing.unit} × ₹{unitPrice} = ₹{computedTotalPrice}
                </p>
              </div>

              {/* Message to seller */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-300 tracking-wide">
                  Message to Seller
                </label>
                <textarea
                  rows={3}
                  required
                  value={buyerMessage}
                  onChange={(e) => setBuyerMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              {/* Contact phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-300 tracking-wide">
                  Your Contact Phone *
                </label>
                <input
                  type="text"
                  required
                  placeholder="+91 94432 88471"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingOrder}
                  className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingOrder ? 'Submitting Request...' : 'Send Purchase Request'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
