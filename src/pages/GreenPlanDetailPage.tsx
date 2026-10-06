import { useState, useEffect } from 'react';
import { db, subscribeToDB } from '../lib/supabase';
import { GreenPlan, Building } from '../types';
import { useRouter } from '../context/NavigationContext';
import {
  Sparkles,
  Droplets,
  Layers,
  Sun,
  Coins,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Share2,
  Download,
  Building2
} from 'lucide-react';

export function GreenPlanDetailPage() {
  const { params, navigate } = useRouter();
  const [building, setBuilding] = useState<Building | undefined>(() =>
    db.getBuildingById(params.id)
  );
  const [plan, setPlan] = useState<GreenPlan | undefined>(() =>
    db.getGreenPlanByBuildingId(params.id)
  );

  useEffect(() => {
    const unsub = subscribeToDB(() => {
      setBuilding(db.getBuildingById(params.id));
      setPlan(db.getGreenPlanByBuildingId(params.id));
    });
    return unsub;
  }, [params.id]);

  if (!building) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4 text-slate-100">
        <h2 className="text-xl font-bold text-white">Building record not found</h2>
        <button
          onClick={() => navigate('/projects')}
          className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold"
        >
          Back to Revival Projects
        </button>
      </div>
    );
  }

  const effectivePlan: GreenPlan = plan || {
    id: 'gp-auto',
    building_id: building.id,
    user_id: building.user_id,
    building_title: building.title,
    rainwater_system_type: 'Dual-Cistern Gravity System & First-Flush Diverter',
    estimated_harvest_liters: Math.round(building.area_sqft * 0.0929 * 950 * 0.82),
    recommended_materials: ['Reclaimed clay bricks', 'Surplus steel rebars', 'Salvaged timber rafters'],
    solar_potential_kwh: Math.round(building.area_sqft * 1.8),
    co2_offset_tons: Number((building.area_sqft * 0.003).toFixed(1)),
    estimated_cost_inr: Math.round(building.area_sqft * 60),
    timeline_months: 4,
    steps: [
      { step: 1, title: 'Non-Destructive Structural Survey & Masonry Clearing', description: 'Load-bearing core drill verification and masonry stability audit.', duration_weeks: 2, category: 'structural' },
      { step: 2, title: 'Rooftop Rain Harvesting Plumbing Installation', description: 'Install high-flow gutters and tie downspouts into recharge wells.', duration_weeks: 3, category: 'water' },
      { step: 3, title: 'Procure Surplus Materials via RainRevive Marketplace', description: 'Source bricks, cement bags, and plumbing fittings from local sellers.', duration_weeks: 2, category: 'materials' },
      { step: 4, title: 'Clean Energy & Ventilation Retrofit', description: 'Install solar PV array and skylights for daylight harvesting.', duration_weeks: 3, category: 'energy' },
      { step: 5, title: 'Community Handover & Opening', description: 'Organize citizen orientation for community workshop and library.', duration_weeks: 2, category: 'community' },
    ],
    created_at: new Date().toISOString(),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-slate-100">
      
      {/* Header Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <button
            onClick={() => navigate(`/building/${building.id}`)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Building File</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
              Ecological Blueprint
            </span>
            <span className="text-xs text-slate-500 font-mono">ID: {effectivePlan.id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Green Revival Plan: {building.title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/rain-calculator')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Calculate Rainwater System</span>
          </button>
        </div>
      </div>

      {/* 4 Key Blueprint Pillars Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Water */}
        <div className="bg-[#0b1626] rounded-3xl p-6 border border-sky-500/30 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-sky-400" /> Rainwater Catch
          </span>
          <p className="text-3xl font-black text-white font-mono">
            {effectivePlan.estimated_harvest_liters.toLocaleString()} <span className="text-xs font-sans font-semibold text-sky-400">L/yr</span>
          </p>
          <p className="text-xs text-sky-300">
            {effectivePlan.rainwater_system_type}
          </p>
        </div>

        {/* Solar & Energy */}
        <div className="bg-[#1a1409] rounded-3xl p-6 border border-amber-500/30 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-amber-400" /> Solar Potential
          </span>
          <p className="text-3xl font-black text-white font-mono">
            {effectivePlan.solar_potential_kwh.toLocaleString()} <span className="text-xs font-sans font-semibold text-amber-400">kWh/yr</span>
          </p>
          <p className="text-xs text-amber-300">
            Cuts ≈ {effectivePlan.co2_offset_tons} tons CO₂ per year
          </p>
        </div>

        {/* Budget */}
        <div className="bg-[#091a18] rounded-3xl p-6 border border-emerald-500/30 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-emerald-400" /> Estimated Budget
          </span>
          <p className="text-3xl font-black text-white font-mono">
            ₹{effectivePlan.estimated_cost_inr.toLocaleString()}
          </p>
          <p className="text-xs text-emerald-300">
            62% cheaper than new construction
          </p>
        </div>

        {/* Timeline */}
        <div className="bg-[#12122b] rounded-3xl p-6 border border-indigo-500/30 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-indigo-400" /> Conversion Window
          </span>
          <p className="text-3xl font-black text-white font-mono">
            {effectivePlan.timeline_months} <span className="text-xs font-sans font-semibold text-indigo-400">Months</span>
          </p>
          <p className="text-xs text-indigo-300">
            From clearance to community launch
          </p>
        </div>

      </div>

      {/* Recommended Marketplace Materials Sourcing Section */}
      <div className="bg-[#0b1222]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              Circular Marketplace Procurement Matrix
            </h3>
            <p className="text-xs text-slate-400">
              Leftover construction supplies prioritized for this building's retrofit
            </p>
          </div>
          <button
            onClick={() => navigate('/materials')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            <span>Search live seller listings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {effectivePlan.recommended_materials.map((mat, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between group hover:border-emerald-500/40 transition-colors"
            >
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Item #{idx + 1}</span>
                <p className="font-bold text-xs text-slate-200">{mat}</p>
              </div>
              <div className="p-1.5 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phased Execution Roadmap Steps */}
      <div className="bg-[#0b1222]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white">
            Phased Revival Execution Roadmap
          </h3>
          <p className="text-xs text-slate-400">
            Step-by-step engineering and community retrofitting sequence
          </p>
        </div>

        <div className="space-y-6 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-800">
          {effectivePlan.steps.map((st) => (
            <div key={st.step} className="relative flex items-start gap-4">
              <span className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 text-white flex items-center justify-center font-black text-sm shrink-0 ring-4 ring-[#0b1222] z-10 font-mono">
                {st.step}
              </span>
              <div className="flex-1 bg-slate-900/80 rounded-2xl p-5 border border-slate-800 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-bold text-sm text-white">{st.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 font-mono">
                      {st.category}
                    </span>
                    <span className="text-xs font-semibold text-emerald-400 font-mono">
                      {st.duration_weeks} weeks
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pt-1">
                  {st.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
