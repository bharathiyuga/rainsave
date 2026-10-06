import { useState, useMemo } from 'react';
import { db } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useRouter } from '../context/NavigationContext';
import { calculateMaterialImpact } from '../utils/sustainability';
import { MaterialCondition } from '../types';
import {
  Layers,
  Upload,
  Sparkles,
  MapPin,
  CheckCircle2,
  X,
  Coins,
  Recycle,
  Tag,
  ArrowRight
} from 'lucide-react';

export function SellMaterialPage() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const { navigate } = useRouter();

  const categories = db.getCategories();

  // Form states
  const [materialName, setMaterialName] = useState('');
  const [category, setCategory] = useState('Bricks');
  const [quantity, setQuantity] = useState<number>(100);
  const [unit, setUnit] = useState('pieces');
  const [condition, setCondition] = useState<MaterialCondition>('Good');
  const [price, setPrice] = useState<number>(1500);
  const [negotiable, setNegotiable] = useState<boolean>(true);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(user.location || 'Salem, Tamil Nadu');

  // Images upload
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);

  // Live estimated impact
  const liveImpact = useMemo(() => {
    return calculateMaterialImpact(category, quantity, price);
  }, [category, quantity, price]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const validFiles: File[] = [];
    for (const f of files) {
      if (f.size > 5 * 1024 * 1024) {
        error(`File "${f.name}" is ${(f.size / (1024 * 1024)).toFixed(1)}MB. Max limit is 5MB.`, 'Upload Error');
        return;
      }
      validFiles.push(f);
    }

    setImageFiles((prev) => [...prev, ...validFiles]);

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    success(`${validFiles.length} image(s) attached and validated.`, 'Images Ready');
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!materialName.trim() || !description.trim() || !location.trim()) {
      error('Please complete the material name, description, and location.');
      return;
    }

    if (quantity <= 0 || price < 0) {
      error('Quantity and price must be valid positive values.');
      return;
    }

    setPublishing(true);
    try {
      const uploadedUrls: string[] = [];

      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const url = await db.uploadImage('material-images', file);
          uploadedUrls.push(url);
        }
      } else {
        const catObj = categories.find((c) => c.name === category);
        uploadedUrls.push(catObj?.image_url || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800');
      }

      const primaryImage = uploadedUrls[0];
      const additionalImages = uploadedUrls.slice(1);

      const lat = 11.6643 + (Math.random() - 0.5) * 0.08;
      const lng = 78.1460 + (Math.random() - 0.5) * 0.08;

      const newListing = db.createListing({
        material_name: materialName,
        category,
        description,
        quantity,
        unit,
        condition,
        price,
        negotiable,
        location,
        latitude: lat,
        longitude: lng,
        image_url: primaryImage,
        additional_images: additionalImages,
        status: 'available',
      });

      success('Your material has been listed successfully.', 'Listing Published');
      navigate(`/materials/${newListing.id}`);
    } catch (err: any) {
      error(err.message || 'Failed to publish listing');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-slate-100">
      
      {/* Header */}
      <div className="max-w-3xl space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          Pillar 3: Construction Material Reuse
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          List Unused or Surplus Construction Materials
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Don’t let leftover bricks, tiles, pipes, or cement end up in a landfill. Sell them to people who need them and recover your project costs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Form (8 Cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 bg-[#0b1222]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
          
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-400" />
            Material Information
          </h2>

          <div className="space-y-4">
            
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-300 tracking-wide">
                Material Name / Heading *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 500 Kiln Fired Red Clay Bricks (Dry Stored)"
                value={materialName}
                onChange={(e) => setMaterialName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 focus:ring-2 focus:ring-emerald-500 text-white text-sm outline-none font-medium"
              />
            </div>

            {/* Category & Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-300 tracking-wide">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 focus:ring-2 focus:ring-emerald-500 text-slate-200 text-sm outline-none font-medium"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-300 tracking-wide">
                  Condition *
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as MaterialCondition)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 focus:ring-2 focus:ring-emerald-500 text-slate-200 text-sm outline-none font-medium"
                >
                  <option value="New">New (Factory sealed / unopened)</option>
                  <option value="Like New">Like New (Cutoffs or uninstalled)</option>
                  <option value="Good">Good (Minor surface dust, 100% sound)</option>
                  <option value="Used">Used (Reclaimed / cleaned)</option>
                </select>
              </div>
            </div>

            {/* Quantity & Unit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-300 tracking-wide">
                  Available Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white font-mono text-sm outline-none font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-300 tracking-wide">
                  Unit of Measurement *
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-200 text-sm outline-none font-medium"
                >
                  <option value="pieces">pieces / units</option>
                  <option value="bags">bags (50kg)</option>
                  <option value="rods">rods / rebars</option>
                  <option value="meters">meters</option>
                  <option value="sq.ft">sq. feet</option>
                  <option value="boxes">boxes</option>
                  <option value="tons">tons</option>
                  <option value="kg">kg</option>
                  <option value="liters">liters</option>
                </select>
              </div>
            </div>

            {/* Price & Negotiable */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-300 tracking-wide">
                  Total Asking Price (₹ INR) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white font-mono text-sm outline-none font-extrabold"
                  />
                </div>
              </div>

              <div className="pt-5">
                <label className="flex items-center gap-2.5 cursor-pointer p-2.5 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-900 transition-colors">
                  <input
                    type="checkbox"
                    checked={negotiable}
                    onChange={(e) => setNegotiable(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 bg-slate-850"
                  />
                  <span className="text-xs font-semibold text-slate-300">
                    Open to price negotiation
                  </span>
                </label>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-300 tracking-wide flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Pickup Location / Neighborhood *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Fairlands, Salem, Tamil Nadu"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-sm outline-none font-medium"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-300 tracking-wide">
                Material Details & Storage Notes *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Explain why you have this surplus, how it was stored, and vehicle accessibility for loading..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              ></textarea>
            </div>

            {/* Multiple Images Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-300 tracking-wide">
                Upload Material Photos (Max 5MB per image • JPG, PNG, WEBP)
              </label>

              <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer transition-colors relative bg-slate-900/50">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleImageSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-1.5">
                  <Upload className="w-7 h-7 text-emerald-400 mx-auto" />
                  <p className="text-xs font-bold text-white">
                    Click to add photos or drag them here
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Sellers with clear photos get purchase requests 3x faster
                  </p>
                </div>
              </div>

              {/* Previews Grid */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                  {imagePreviews.map((img, idx) => (
                    <div key={idx} className="relative rounded-xl overflow-hidden h-24 border border-slate-700 group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-rose-600 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          <button
            type="submit"
            disabled={publishing}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs md:text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Layers className="w-4 h-4" />
            <span>{publishing ? 'Uploading to Supabase Storage...' : 'Publish Material Listing to Marketplace'}</span>
          </button>
        </form>

        {/* Live Environmental Impact Preview (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0b1222]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-6 sticky top-24">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Recycle className="w-4 h-4" /> Circular Economy Yield
              </span>
              <span className="text-[10px] bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40 font-mono">
                Live Calculation
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400">Landfill Debris Prevented</span>
                <p className="text-2xl font-black text-emerald-400 font-mono">
                  {liveImpact.totalWeightTons} <span className="text-xs font-semibold text-slate-300 font-sans">tons</span>
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  ≈ {liveImpact.totalWeightKg.toLocaleString()} kg diverted
                </p>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400">Estimated Community Savings</span>
                <p className="text-2xl font-black text-amber-400 font-mono">
                  ₹{liveImpact.estimatedSavingsInr.toLocaleString()}
                </p>
                <p className="text-[11px] text-slate-500">
                  Economic resource retained in local economy
                </p>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400">Virgin CO₂ Offset</span>
                <p className="text-2xl font-black text-sky-400 font-mono">
                  {liveImpact.co2ReductionKg.toLocaleString()} <span className="text-xs font-semibold text-slate-300 font-sans">kg CO₂</span>
                </p>
                <p className="text-[11px] text-slate-500">
                  Embodied manufacturing energy avoided
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline mr-1" />
              Listing is immediately saved to the Supabase PostgreSQL database and published to the live Community Map.
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
