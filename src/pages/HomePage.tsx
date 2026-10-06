import { useState, useEffect } from 'react';
import { useRouter } from '../context/NavigationContext';
import { db, subscribeToDB } from '../lib/supabase';
import { Building, SustainabilityMetrics } from '../types';
import { CommunityMap } from '../components/CommunityMap';
import {
  Droplets,
  Building2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Coins,
  Recycle,
  Trees,
  MapPin,
  ExternalLink,
  PlusCircle,
  Globe
} from 'lucide-react';

export function HomePage() {
  const { navigate } = useRouter();
  const [metrics, setMetrics] = useState<SustainabilityMetrics>(() => db.getSustainabilityMetrics());
  const [featuredBuildings, setFeaturedBuildings] = useState<Building[]>(() => db.getBuildings());

  useEffect(() => {
    const unsub = subscribeToDB(() => {
      setMetrics(db.getSustainabilityMetrics());
      setFeaturedBuildings(db.getBuildings());
    });
    return unsub;
  }, []);

  return (
    <div className="space-y-24 pb-24 text-slate-100">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-24 md:pb-32">
        {/* Ambient Dark Atmospheric Glowing Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-32 left-1/4 w-[550px] h-[550px] rounded-full bg-emerald-500/15 blur-[120px] animate-pulse-subtle"></div>
          <div className="absolute top-20 right-1/4 w-[480px] h-[480px] rounded-full bg-cyan-500/15 blur-[120px] animate-pulse-subtle"></div>
          <div className="absolute bottom-10 left-1/3 w-[400px] h-[400px] rounded-full bg-teal-500/10 blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Creed Pill with subtle glow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs md:text-sm font-bold shadow-[0_0_20px_rgba(16,185,129,0.15)] backdrop-blur-md animate-in fade-in">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>“Don’t waste a drop. Don’t waste a space.”</span>
          </div>

          {/* Tri-Fold Hero Headline */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.12]">
              Revive What We Have. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400">
                Reuse What Nature Gives.
              </span> <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-300">
                Regenerate Cities.
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
              Calculate and manage rooftop rainwater harvesting potential, and identify abandoned buildings to convert them into vibrant community spaces.
            </p>
          </div>

          {/* 2 Core Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/rain-calculator')}
              className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-sky-600/25 transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Droplets className="w-4 h-4" />
              <span>Calculate Rainwater Potential</span>
            </button>

            <button
              onClick={() => navigate('/projects')}
              className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm shadow-lg border border-slate-700 transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Explore Dead Buildings</span>
            </button>

            <button
              onClick={() => navigate('/submit-building')}
              className="flex items-center gap-2 px-5 py-4 rounded-2xl bg-amber-950/70 hover:bg-amber-900/80 text-amber-300 font-bold text-xs sm:text-sm border border-amber-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>Submit a Space</span>
            </button>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> PostgreSQL & Supabase Powered
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-sky-400" /> Real Engineering Calculations
            </span>
            <span className="flex items-center gap-1.5">
              <Recycle className="w-4 h-4 text-teal-400" /> Architectural Revival Blueprints
            </span>
          </div>

        </div>
      </section>

      {/* 2. LIVE IMPACT METRICS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0b1222]/90 backdrop-blur-xl text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 hover:border-emerald-500/30 transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
            <div>
              <span className="text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Live Regional Sustainability Tracker
              </span>
              <h2 className="text-xl sm:text-2xl font-bold mt-1">Aggregated Environmental Impact</h2>
            </div>
            <button
              onClick={() => navigate('/impact')}
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 group transition-colors cursor-pointer"
            >
              <span>Explore Analytics & Methodology</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-sky-400 text-xs font-medium">
                <Droplets className="w-4 h-4" /> Rainwater Potential
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight tabular-nums font-mono">
                {(metrics.waterHarvestedLiters / 1000).toLocaleString()} <span className="text-xs font-normal text-slate-400 font-sans">kL</span>
              </p>
              <p className="text-[11px] text-slate-400">Harvestable annual runoff</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-medium">
                <Building2 className="w-4 h-4" /> Dead Buildings Scouted
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight tabular-nums font-mono">
                {metrics.buildingsSubmitted} <span className="text-xs font-normal text-slate-400 font-sans">sites</span>
              </p>
              <p className="text-[11px] text-slate-400">Mapped for community conversion</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                <Trees className="w-4 h-4" /> Revived Spaces Created
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight tabular-nums font-mono">
                {metrics.buildingsRevived} <span className="text-xs font-normal text-slate-400 font-sans">hubs</span>
              </p>
              <p className="text-[11px] text-slate-400">Active public gathering centers</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-medium">
                <Coins className="w-4 h-4" /> Community Water Savings
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight tabular-nums font-mono">
                ₹{(metrics.waterSavedInr / 1000).toFixed(0)}k
              </p>
              <p className="text-[11px] text-slate-400">Saved in water tanker expenses</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS: 4-STEP REGENERATIVE PIPELINE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
            Circular Sustainability Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How RainRevive Works
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Linking hydrologic engineering and architectural revival into a resilient community ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Step 1 */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-2xl bg-sky-950/80 border border-sky-500/30 text-sky-400 flex items-center justify-center font-black text-sm">
                01
              </span>
              <span className="text-2xl">🌧️</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Capture Rain</h3>
              <p className="text-xs font-semibold text-sky-400 mt-0.5">Rain to Resource</p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Use our engineering calculator to analyze your rooftop surface, rainfall in Salem/Chennai, and optimal tank storage size to eliminate tanker water dependency.
            </p>
            <button
              onClick={() => navigate('/rain-calculator')}
              className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              Open Rain Calculator →
            </button>
          </div>

          {/* Step 2 */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-2xl bg-amber-950/80 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black text-sm">
                02
              </span>
              <span className="text-2xl">🏚️</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Identify Dead Buildings</h3>
              <p className="text-xs font-semibold text-amber-400 mt-0.5">Dead Space Revival</p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Citizens scout and catalog abandoned mills, warehouses, and closed municipal clinics. Upload photos and structural specs to our geospatial map.
            </p>
            <button
              onClick={() => navigate('/submit-building')}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              Submit an Abandoned Space →
            </button>
          </div>

          {/* Step 3 */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-2xl bg-teal-950/80 border border-teal-500/30 text-teal-400 flex items-center justify-center font-black text-sm">
                03
              </span>
              <span className="text-2xl">🌱</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Green Revival Blueprints</h3>
              <p className="text-xs font-semibold text-teal-400 mt-0.5">Automated Architecture Plans</p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The revival score engine assesses structural suitability and automatically generates a Green Blueprint with rooftop rainwater retention and solar potential.
            </p>
            <button
              onClick={() => navigate('/projects')}
              className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              View Green Blueprints →
            </button>
          </div>

          {/* Step 4 */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-sm">
                04
              </span>
              <span className="text-2xl">🏛️</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Community Activation</h3>
              <p className="text-xs font-semibold text-emerald-400 mt-0.5">Living Community Spaces</p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dead spaces transform into artisan guild workshops, hydroponic urban farms, public tool libraries, and educational daycare centers.
            </p>
            <button
              onClick={() => navigate('/impact')}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              Track Community Impact →
            </button>
          </div>

        </div>
      </section>

      {/* 4. FEATURED DEAD BUILDING REVIVAL PROJECTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Dead Building → Living Space
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Active Revival Sites in Tamil Nadu
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Historic and disused structures undergoing regenerative transformation.
            </p>
          </div>
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold shrink-0 border border-slate-700 transition-colors cursor-pointer"
          >
            <span>View All Dead Buildings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredBuildings.map((building) => (
            <div
              key={building.id}
              onClick={() => navigate(`/building/${building.id}`)}
              className="group glass-card rounded-3xl overflow-hidden border border-slate-800 hover:border-emerald-500/40 shadow-xl cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                  <img
                    src={building.image_url}
                    alt={building.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    building.status === 'revived'
                      ? 'bg-emerald-600 text-white'
                      : building.status === 'in_progress'
                      ? 'bg-amber-600 text-white'
                      : 'bg-sky-600 text-white'
                  }`}>
                    {building.status.replace('_', ' ')}
                  </span>
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 text-white border border-slate-700">
                    Revival Score: {building.revival_score}/100
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {building.title}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{building.address}</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <p className="text-[11px] text-slate-400">
                      <strong className="text-slate-300">Former:</strong> {building.original_use}
                    </p>
                    <p className="text-[11px] text-emerald-300">
                      <strong>Proposed:</strong> {building.proposed_use}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-3 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  {building.area_sqft.toLocaleString()} sq.ft
                </span>
                <span className="text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  View Blueprint <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. GEOSPATIAL COMMUNITY MAP SECTION */}
      <section id="map-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            Geospatial Infrastructure Network
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Interactive Community Spaces Map
          </h2>
          <p className="text-slate-400 text-sm">
            Discover revived spaces and scouting candidates across Salem, Coimbatore, Chennai, and Madurai.
          </p>
        </div>

        <CommunityMap buildings={featuredBuildings} />
      </section>

      {/* 6. CALL TO ACTION CREED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-emerald-950 via-[#0b172a] to-slate-900 text-white p-8 sm:p-12 overflow-hidden border border-emerald-500/20 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider">
              Ecological Regeneration
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-white">
              Ready to turn forgotten resources into living community wealth?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Calculate your building's rainwater harvesting potential today or submit an abandoned warehouse in your neighborhood for green revival.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => navigate('/rain-calculator')}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
              >
                Calculate Rooftop Rainwater
              </button>
              <button
                onClick={() => navigate('/submit-building')}
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm backdrop-blur-sm border border-white/20 transition-all active:scale-95 cursor-pointer"
              >
                Submit a Dead Building
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
