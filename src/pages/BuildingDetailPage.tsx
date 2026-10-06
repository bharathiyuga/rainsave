import { useState, useEffect } from 'react';
import { db, subscribeToDB } from '../lib/supabase';
import { Building, BuildingStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useRouter } from '../context/NavigationContext';
import {
  Building2,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Share2,
  Droplets
} from 'lucide-react';

export function BuildingDetailPage() {
  const { params, navigate } = useRouter();
  const { user, isAdmin } = useAuth();
  const { success, error } = useToast();

  const [building, setBuilding] = useState<Building | undefined>(() =>
    db.getBuildingById(params.id)
  );

  useEffect(() => {
    const unsub = subscribeToDB(() => {
      setBuilding(db.getBuildingById(params.id));
    });
    return unsub;
  }, [params.id]);

  if (!building) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4 text-slate-100">
        <h2 className="text-2xl font-bold text-white">Building record not found</h2>
        <p className="text-slate-400 text-sm">The space ID may be invalid or has been archived.</p>
        <button
          onClick={() => navigate('/projects')}
          className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold"
        >
          Back to Revival Projects
        </button>
      </div>
    );
  }

  const handleStatusChange = (newStatus: BuildingStatus) => {
    try {
      db.updateBuildingStatus(building.id, newStatus);
      success(`Building status updated to ${newStatus}`, 'Status Updated');
    } catch (e: any) {
      error(e.message || 'Failed to update status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-100">
      
      {/* Top Breadcrumb & Action */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Projects</span>
        </button>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
              building.status === 'revived'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                : building.status === 'in_progress'
                ? 'bg-sky-950/80 text-sky-300 border border-sky-500/40'
                : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
            }`}
          >
            Status: {building.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Main Feature Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Visuals & Narrative (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl">
            <img
              src={building.image_url}
              alt={building.title}
              className="w-full h-96 object-cover"
            />
            <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-slate-950/85 text-white backdrop-blur-md border border-slate-700 flex items-center gap-1.5 text-xs font-bold font-mono">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Revival Viability: {building.revival_score}/100</span>
            </div>
          </div>

          <div className="bg-[#0b1222]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                Diagnostic File • {building.id}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {building.title}
              </h1>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-1.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{building.address}</span>
              </p>
            </div>

            {/* Proposed vs Historic */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400">Historic Usage</span>
                <p className="font-bold text-slate-200 text-sm mt-0.5">{building.original_use}</p>
              </div>
              <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-500/30">
                <span className="text-[10px] font-bold uppercase text-emerald-400">Proposed Revival</span>
                <p className="font-bold text-white text-sm mt-0.5">{building.proposed_use}</p>
              </div>
            </div>

            {/* Green Plan Summary Banner */}
            <div className="p-5 bg-gradient-to-br from-emerald-950/90 to-slate-900 text-white rounded-2xl border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Green Revival Blueprint Attached
                </span>
                <button
                  onClick={() => navigate(`/green-plan/${building.id}`)}
                  className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-md shadow-emerald-600/30"
                >
                  <span>Open Full Blueprint</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {building.green_plan_summary}
              </p>
            </div>

            {/* Submitter & Timeline metadata */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-800">
              <span>Submitted by: <strong className="text-slate-200">{building.submitted_by_name || 'Community Member'}</strong></span>
              <span>Cataloged: {new Date(building.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Diagnostic Breakdown & Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Structural Assessment Card */}
          <div className="bg-[#0b1222]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-5">
            <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Structural & Spatial Assessment
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Structural Rating</span>
                <span className="text-sm font-black text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-lg border border-amber-500/30 font-mono">
                  {building.structural_rating} / 10
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Physical Condition</span>
                <span className="text-xs font-bold text-white capitalize">
                  {building.condition}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Dormant Duration</span>
                <span className="text-xs font-bold text-white font-mono">
                  {building.years_abandoned} years
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Usable Footprint</span>
                <span className="text-xs font-bold text-white font-mono">
                  {building.area_sqft.toLocaleString()} sq.ft
                </span>
              </div>
            </div>

            {/* Cross-Link to Rainwater System */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase text-slate-300 tracking-wide block">
                Rainwater Catchment Integration
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculate the rainwater harvesting potential and cistern capacity for this building's rooftop area.
              </p>
              <button
                onClick={() => navigate('/rain-calculator')}
                className="w-full mt-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-750 cursor-pointer"
              >
                <Droplets className="w-3.5 h-3.5 text-sky-400" />
                <span>Calculate Rooftop Rainwater</span>
              </button>
            </div>
          </div>

          {/* Admin Management Panel */}
          {isAdmin && (
            <div className="bg-indigo-950/90 text-white rounded-3xl p-6 border border-indigo-700/50 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" /> Admin Controls
                </span>
                <span className="text-[10px] bg-indigo-900/80 px-2 py-0.5 rounded text-indigo-200 font-mono">
                  RLS Verified
                </span>
              </div>
              <p className="text-xs text-indigo-200">
                Change building lifecycle status. This directly mutates the Supabase records.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleStatusChange('approved')}
                  className="py-2 px-3 rounded-xl bg-indigo-800 hover:bg-indigo-700 text-white font-bold text-xs"
                >
                  Approve Blueprint
                </button>
                <button
                  onClick={() => handleStatusChange('in_progress')}
                  className="py-2 px-3 rounded-xl bg-sky-700 hover:bg-sky-600 text-white font-bold text-xs"
                >
                  Mark In Progress
                </button>
                <button
                  onClick={() => handleStatusChange('revived')}
                  className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs col-span-2"
                >
                  ✓ Mark Fully Revived (Living Space)
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
