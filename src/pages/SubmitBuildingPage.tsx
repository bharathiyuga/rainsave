import { useState, useMemo } from 'react';
import { db } from '../lib/supabase';
import { calculateRevivalScore } from '../utils/sustainability';
import { BuildingCondition } from '../types';
import { useToast } from '../context/ToastContext';
import { useRouter } from '../context/NavigationContext';
import {
  Building2,
  Upload,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export function SubmitBuildingPage() {
  const { navigate } = useRouter();
  const { success, error } = useToast();

  const [title, setTitle] = useState('');
  const [originalUse, setOriginalUse] = useState('');
  const [proposedUse, setProposedUse] = useState('');
  const [address, setAddress] = useState('');
  const [areaSqft, setAreaSqft] = useState(4500);
  const [condition, setCondition] = useState<BuildingCondition>('fair');
  const [yearsAbandoned, setYearsAbandoned] = useState(5);
  const [structuralRating, setStructuralRating] = useState(7);
  const [greenPlanSummary, setGreenPlanSummary] = useState('');
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const liveScore = useMemo(() => {
    return calculateRevivalScore({
      structuralRating,
      condition,
      yearsAbandoned,
      areaSqft,
    });
  }, [structuralRating, condition, yearsAbandoned, areaSqft]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      error(`Image size is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum allowed is 5MB.`, 'Upload Error');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    success('Image selected and validated.', 'Ready');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !address.trim() || !proposedUse.trim()) {
      error('Please fill in the building title, address, and proposed use.', 'Validation Error');
      return;
    }

    setSubmitting(true);
    try {
      let finalImageUrl = imagePreview;

      if (imageFile) {
        finalImageUrl = await db.uploadImage('building-images', imageFile);
      } else if (!finalImageUrl) {
        finalImageUrl = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80';
      }

      const latitude = 11.6643 + (Math.random() - 0.5) * 0.1;
      const longitude = 78.1460 + (Math.random() - 0.5) * 0.1;

      const newBuilding = db.submitBuilding({
        title,
        original_use: originalUse || 'Commercial Warehouse',
        proposed_use: proposedUse,
        address,
        latitude,
        longitude,
        area_sqft: areaSqft,
        condition,
        years_abandoned: yearsAbandoned,
        structural_rating: structuralRating,
        revival_score: liveScore.score,
        image_url: finalImageUrl,
        green_plan_summary: greenPlanSummary || `Adaptive reuse blueprint: converting ${areaSqft} sq.ft into a community hub with rainwater collection.`,
        status: 'pending',
      });

      db.saveGreenPlan({
        building_id: newBuilding.id,
        user_id: newBuilding.user_id,
        building_title: newBuilding.title,
        rainwater_system_type: 'Dual-Cistern Gravity System & First-Flush Diverter',
        estimated_harvest_liters: Math.round(areaSqft * 0.0929 * 950 * 0.82),
        recommended_materials: ['Reclaimed clay bricks', 'Surplus steel rebars', 'Salvaged timber rafters'],
        solar_potential_kwh: Math.round(areaSqft * 1.8),
        co2_offset_tons: Number((areaSqft * 0.003).toFixed(1)),
        estimated_cost_inr: Math.round(areaSqft * 60),
        timeline_months: 4,
        steps: [
          { step: 1, title: 'Non-Destructive Structural Survey & Debris Clearance', description: 'Load-bearing core drill verification and masonry stability audit.', duration_weeks: 2, category: 'structural' },
          { step: 2, title: 'Rooftop Rain Harvesting Plumbing Installation', description: 'Install high-flow gutters and tie downspouts into recharge wells.', duration_weeks: 3, category: 'water' },
          { step: 3, title: 'Procure Surplus Materials via RainRevive Marketplace', description: 'Source bricks, cement bags, and plumbing fittings from local sellers.', duration_weeks: 2, category: 'materials' },
          { step: 4, title: 'Clean Energy & Ventilation Retrofit', description: 'Install solar PV array and skylights for daylight harvesting.', duration_weeks: 3, category: 'energy' },
          { step: 5, title: 'Community Handover & Opening', description: 'Organize citizen orientation for community workshop and library.', duration_weeks: 2, category: 'community' },
        ],
      });

      success('Your building has been submitted and revival plan generated!', 'Submission Successful');
      navigate(`/building/${newBuilding.id}`);
    } catch (err: any) {
      error(err.message || 'Failed to submit building');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-slate-100">
      
      {/* Header */}
      <div className="max-w-3xl space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-950/80 border border-amber-500/30 text-amber-300">
          <Building2 className="w-3.5 h-3.5 text-amber-400" />
          Pillar 2: Dead Building Revival
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Submit an Abandoned Building for Revival
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Catalog vacant or derelict buildings in your city. Our algorithm calculates its Revival Viability Score and generates a Green Blueprint.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Form (8 Cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 bg-[#0b1222]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
          
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            Building Diagnostic Information
          </h2>

          <div className="space-y-4">
            
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-300 tracking-wide">
                Building Name / Identification *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Old Cooperative Cotton Mill or Suburban Postal Depot"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 focus:ring-2 focus:ring-amber-500 text-white text-sm outline-none font-medium"
              />
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-300 tracking-wide flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" /> Full Location Address *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 14 Gandhi Road, Ammapet, Salem, Tamil Nadu"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 focus:ring-2 focus:ring-amber-500 text-white text-sm outline-none font-medium"
              />
            </div>

            {/* Uses Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-300 tracking-wide">
                  Original / Historic Function
                </label>
                <input
                  type="text"
                  placeholder="e.g. Grain Storage Warehouse"
                  value={originalUse}
                  onChange={(e) => setOriginalUse(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 focus:ring-2 focus:ring-amber-500 text-slate-200 text-sm outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-300 tracking-wide">
                  Proposed Community Revival Use *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Urban Hydroponic Hub & Youth Maker Space"
                  value={proposedUse}
                  onChange={(e) => setProposedUse(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 focus:ring-2 focus:ring-amber-500 text-slate-200 text-sm outline-none"
                />
              </div>
            </div>

            {/* Structural Parameters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-300 tracking-wide">
                  Built Footprint (sq.ft)
                </label>
                <input
                  type="number"
                  min="200"
                  max="200000"
                  value={areaSqft}
                  onChange={(e) => setAreaSqft(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white font-mono text-sm outline-none font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-300 tracking-wide">
                  Years Abandoned
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={yearsAbandoned}
                  onChange={(e) => setYearsAbandoned(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white font-mono text-sm outline-none font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-300 tracking-wide">
                  Current Condition
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as BuildingCondition)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-200 text-sm outline-none font-medium"
                >
                  <option value="fair">Fair (Intact roof & walls)</option>
                  <option value="moderate">Moderate (Minor water seepage)</option>
                  <option value="poor">Poor (Damaged plaster/openings)</option>
                  <option value="critical">Critical (Cracked lintels)</option>
                  <option value="dilapidated">Dilapidated (Roof collapsed)</option>
                </select>
              </div>
            </div>

            {/* Structural Rating Slider */}
            <div className="space-y-2 p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase text-slate-300 tracking-wide">
                  Estimated Structural Integrity Rating (1 - 10)
                </label>
                <span className="text-sm font-black text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-lg border border-amber-500/30 font-mono">
                  {structuralRating} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={structuralRating}
                onChange={(e) => setStructuralRating(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <p className="text-[11px] text-slate-400">
                10 = Excellent columns/beams, 5 = Needs column jacketing, 1 = Structurally compromised
              </p>
            </div>

            {/* Image Upload with 5MB validation */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-300 tracking-wide">
                Building Photo (Max 5MB • JPG, PNG, WEBP)
              </label>

              <div className="border-2 border-dashed border-slate-700 hover:border-amber-500 rounded-2xl p-6 text-center cursor-pointer transition-colors relative bg-slate-900/50">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {imagePreview ? (
                  <div className="space-y-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-xl object-cover shadow-sm"
                    />
                    <p className="text-xs text-emerald-400 font-bold">Image ready for upload</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-amber-400 mx-auto" />
                    <p className="text-xs font-bold text-white">
                      Click to upload building photo or drag and drop
                    </p>
                    <p className="text-[11px] text-slate-500">
                      High resolution exterior facade or interior rafters recommended
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Vision / Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-300 tracking-wide">
                Community Vision & Green Features
              </label>
              <textarea
                rows={3}
                placeholder="Mention desired green features (e.g. rainwater downspouts, solar terrace, reusing marketplace materials)..."
                value={greenPlanSummary}
                onChange={(e) => setGreenPlanSummary(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-sm outline-none focus:ring-2 focus:ring-amber-500"
              ></textarea>
            </div>

          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs md:text-sm shadow-lg shadow-amber-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Building2 className="w-4 h-4" />
            <span>{submitting ? 'Analyzing & Saving to Database...' : 'Submit Building & Generate Revival Blueprint'}</span>
          </button>
        </form>

        {/* Live Revival Score Preview Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0b1222]/90 backdrop-blur-xl text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-6 sticky top-24">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Live Score Engine
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                Algorithmic
              </span>
            </div>

            {/* Big Score Gauge */}
            <div className="text-center py-2 space-y-1">
              <div className="inline-flex items-center justify-center w-28 h-28 rounded-full border-4 border-amber-500/30 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                <span className="text-4xl font-black text-amber-400 font-mono">
                  {liveScore.score}
                </span>
                <span className="text-sm font-semibold text-slate-400 -mt-3">/100</span>
              </div>
              <h3 className="text-base font-bold text-white pt-2">
                Grade: {liveScore.grade}
              </h3>
              <p className="text-xs text-amber-300 font-medium px-2">
                {liveScore.verdict}
              </p>
            </div>

            {/* Score Breakdown factors */}
            <div className="space-y-3 pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Structural Integrity</span>
                <span className="font-bold text-white font-mono">+{structuralRating * 7} pts</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Condition Modifier</span>
                <span className="font-bold text-white capitalize">{condition}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Decay Penalty</span>
                <span className="font-bold text-rose-400 font-mono">-{Math.min(15, yearsAbandoned * 1.5)} pts</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Spatial Community Leverage</span>
                <span className="font-bold text-emerald-400 font-mono">+{areaSqft > 5000 ? 8 : 5} pts</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 text-xs space-y-2">
              <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Blueprint Generation Ready
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Upon submitting, a Green Blueprint will be created integrating rainwater filtration and material recommendations from our surplus marketplace.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
