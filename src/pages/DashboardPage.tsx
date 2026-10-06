import { useState, useEffect } from 'react';
import { db, subscribeToDB } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/NavigationContext';
import { SustainabilityMetrics, RainwaterCalculation, Building } from '../types';
import {
  BarChart3,
  Droplets,
  Building2,
  Coins,
  Trees,
  PlusCircle,
  ExternalLink,
  ArrowRight,
  Calculator,
  Calendar,
  Sparkles
} from 'lucide-react';

export function DashboardPage() {
  const { user } = useAuth();
  const { navigate } = useRouter();

  const [metrics, setMetrics] = useState<SustainabilityMetrics>(() => db.getSustainabilityMetrics());
  const [calculations, setCalculations] = useState<RainwaterCalculation[]>(() => db.getCalculations());
  const [buildings, setBuildings] = useState<Building[]>(() =>
    db.getBuildings().filter((b) => b.user_id === user.id || user.role === 'admin')
  );

  const [activeTab, setActiveTab] = useState<'water' | 'buildings'>('water');

  useEffect(() => {
    const unsub = subscribeToDB(() => {
      setMetrics(db.getSustainabilityMetrics());
      setCalculations(db.getCalculations());
      setBuildings(db.getBuildings().filter((b) => b.user_id === user.id || user.role === 'admin'));
    });
    return unsub;
  }, [user.id, user.role]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">
              Community Sustainability Portfolio
            </span>
            <span className="text-xs text-slate-400 capitalize">• {user.role} Member</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            Welcome back, {user.full_name}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time tracking of water harvested, rooftop catchment, and dead buildings cataloged for community revival.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('/rain-calculator')}
            className="px-3.5 py-2 rounded-xl bg-sky-950/70 text-sky-300 border border-sky-500/30 text-xs font-bold hover:bg-sky-900/80 transition-colors cursor-pointer"
          >
            + Calculate Rain
          </button>
          <button
            onClick={() => navigate('/submit-building')}
            className="px-3.5 py-2 rounded-xl bg-amber-950/70 text-amber-300 border border-amber-500/30 text-xs font-bold hover:bg-amber-900/80 transition-colors cursor-pointer"
          >
            + Revive Space
          </button>
        </div>
      </div>

      {/* Core Sustainability Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* 1. Water Potential */}
        <div className="bg-[#0b1222]/90 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-sky-400 text-[11px] font-bold uppercase">
            <Droplets className="w-3.5 h-3.5" /> Rain Potential
          </div>
          <p className="text-xl sm:text-2xl font-black text-white font-mono">
            {(metrics.waterHarvestedLiters / 1000).toLocaleString()}<span className="text-xs font-normal text-slate-400 font-sans">kL</span>
          </p>
          <span className="text-[10px] text-slate-400">Runoff captured</span>
        </div>

        {/* 2. Buildings Submitted */}
        <div className="bg-[#0b1222]/90 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 text-[11px] font-bold uppercase">
            <Building2 className="w-3.5 h-3.5" /> Dead Buildings
          </div>
          <p className="text-xl sm:text-2xl font-black text-white font-mono">{metrics.buildingsSubmitted}</p>
          <span className="text-[10px] text-slate-400">Scouted for conversion</span>
        </div>

        {/* 3. Buildings Revived */}
        <div className="bg-[#0b1222]/90 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-bold uppercase">
            <Trees className="w-3.5 h-3.5" /> Revived Hubs
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">{metrics.buildingsRevived}</p>
          <span className="text-[10px] text-slate-400">Living community spaces</span>
        </div>

        {/* 4. Community Savings */}
        <div className="bg-[#0b1222]/90 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-300 text-[11px] font-bold uppercase">
            <Coins className="w-3.5 h-3.5" /> Water Savings
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-300 font-mono">₹{(metrics.waterSavedInr / 1000).toFixed(0)}k</p>
          <span className="text-[10px] text-slate-400">Saved in water costs</span>
        </div>

      </div>

      {/* Tabs Section for Deep Dive Activity */}
      <div className="bg-[#0b1222]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('water')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'water'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>Rainwater Calculations ({calculations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('buildings')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'buildings'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Dead Building Catalog ({buildings.length})</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Rainwater Calculations History */}
        {activeTab === 'water' && (
          <div className="space-y-4">
            {calculations.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                No rainwater calculations saved yet. Run the calculator to generate your first audit!
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {calculations.map((calc) => (
                  <div key={calc.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white">{calc.location}</h4>
                        <span className="text-[10px] font-bold text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded-full border border-sky-500/30 font-mono">
                          {calc.rooftop_area_sqm} m² Rooftop
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Catchment Yield: <strong className="text-white font-mono">{calc.potential_liters.toLocaleString()} L/yr</strong> • Tank: {calc.recommended_tank_capacity_liters.toLocaleString()} L
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {calc.notes || 'Standard residential assessment'} • {new Date(calc.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Annual Savings</span>
                        <span className="text-sm font-black text-emerald-400 font-mono">₹{calc.estimated_savings_inr.toLocaleString()}</span>
                      </div>
                      <button
                        onClick={() => navigate('/rain-calculator')}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-750 text-slate-300 cursor-pointer"
                        title="Recalculate"
                      >
                        <Calculator className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Buildings */}
        {activeTab === 'buildings' && (
          <div className="space-y-4">
            {buildings.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                No building spaces submitted under this account yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {buildings.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => navigate(`/building/${b.id}`)}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex gap-4 cursor-pointer hover:border-amber-500/40 transition-colors"
                  >
                    <img src={b.image_url} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0" />
                    <div className="space-y-1 min-w-0 flex-1">
                      <h4 className="font-bold text-sm text-white truncate">{b.title}</h4>
                      <p className="text-xs text-slate-400 truncate">{b.address}</p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/30 font-mono">
                          Score: {b.revival_score}/100
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">{b.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
