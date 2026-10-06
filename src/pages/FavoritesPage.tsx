import { useState, useEffect } from 'react';
import { db, subscribeToDB } from '../lib/supabase';
import { MaterialListing } from '../types';
import { useRouter } from '../context/NavigationContext';
import { useToast } from '../context/ToastContext';
import {
  Heart,
  MapPin,
  Trash2,
  ArrowRight,
  ShoppingBag,
  Layers
} from 'lucide-react';

export function FavoritesPage() {
  const { navigate } = useRouter();
  const { success } = useToast();

  const [favorites, setFavorites] = useState<MaterialListing[]>(() => {
    const favRecords = db.getFavorites();
    const favIds = favRecords.map((f) => f.listing_id);
    return db.getListings().filter((l) => favIds.includes(l.id));
  });

  useEffect(() => {
    const unsub = subscribeToDB(() => {
      const favRecords = db.getFavorites();
      const favIds = favRecords.map((f) => f.listing_id);
      setFavorites(db.getListings().filter((l) => favIds.includes(l.id)));
    });
    return unsub;
  }, []);

  const handleRemoveFavorite = (id: string) => {
    db.toggleFavorite(id);
    success('Removed from your favorites', 'Removed');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-950/80 border border-rose-500/30 text-rose-300">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            Saved Items
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            My Saved Construction Materials
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Keep track of surplus materials you want to acquire for upcoming builds.
          </p>
        </div>

        <button
          onClick={() => navigate('/materials')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-750 text-white font-bold text-xs hover:bg-slate-850"
        >
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>Browse Marketplace</span>
        </button>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-[#0b1222] rounded-3xl p-16 text-center border border-slate-800 space-y-3">
          <Heart className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No saved favorites yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click the heart icon on any material in the marketplace to save it here for later.
          </p>
          <button
            onClick={() => navigate('/materials')}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
          >
            Discover Materials
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-3xl overflow-hidden border border-slate-800 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full bg-slate-950">
                  <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-950/80 text-white border border-slate-700">
                    {item.category}
                  </span>
                  <button
                    onClick={() => handleRemoveFavorite(item.id)}
                    className="absolute top-2.5 right-2.5 p-2 rounded-full bg-rose-600 text-white hover:bg-rose-500 shadow-md"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-sm text-white line-clamp-1">{item.material_name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">{item.location}</span>
                  </p>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-base font-extrabold text-white font-mono">₹{item.price.toLocaleString()}</span>
                    <span className="text-xs text-slate-400 font-semibold font-mono">{item.quantity} {item.unit}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs font-bold">
                <button
                  onClick={() => navigate(`/materials/${item.id}`)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Request to Buy / View</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
