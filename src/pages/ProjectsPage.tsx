import { useState, useEffect } from 'react';
import { Building, BuildingStatus } from '../types';
import { db, subscribeToDB } from '../lib/supabase';
import { useRouter } from '../context/NavigationContext';
import {
  Building2,
  MapPin,
  Sparkles,
  PlusCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Layers,
  Search
} from 'lucide-react';

export function ProjectsPage() {
  const { navigate } = useRouter();
  const [buildings, setBuildings] = useState<Building[]>(() => db.getBuildings());
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const unsub = subscribeToDB(() => {
      setBuildings(db.getBuildings());
    });
    return unsub;
  }, []);

  const filtered = buildings.filter((b) => {
    if (selectedStatus !== 'all' && b.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = b.title.toLowerCase().includes(q);
      const matchAddress = b.address.toLowerCase().includes(q);
      const matchUse = b.proposed_use.toLowerCase().includes(q);
      if (!matchTitle && !matchAddress && !matchUse) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-slate-100">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-950/80 border border-amber-500/30 text-amber-300">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            Pillar 2: Dead Building Revival
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Abandoned Spaces Transformed into Community Assets
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Instead of demolishing old structures and filling landfills with rubble, we catalog forgotten architecture and revitalize them into green social hubs.
          </p>
        </div>

        <button
          onClick={() => navigate('/submit-building')}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs md:text-sm shadow-lg shadow-amber-600/30 transition-all shrink-0 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Submit an Unused Space</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0b1222]/90 backdrop-blur-xl p-3.5 rounded-2xl border border-slate-800 shadow-md">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, location or purpose..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-900 border border-slate-750 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto text-xs font-semibold">
          {[
            { id: 'all', label: 'All Spaces' },
            { id: 'revived', label: 'Revived (Living)' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'approved', label: 'Approved Blueprint' },
            { id: 'pending', label: 'Under Review' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedStatus === tab.id
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Buildings Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-[#0b1222] rounded-3xl p-16 text-center border border-slate-800 space-y-3">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No buildings matched your criteria</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your search query or submit a new abandoned structure in your neighborhood.
          </p>
          <button
            onClick={() => navigate('/submit-building')}
            className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold"
          >
            Submit First Space
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((building) => {
            const isRevived = building.status === 'revived';
            return (
              <div
                key={building.id}
                onClick={() => navigate(`/building/${building.id}`)}
                className="group glass-card rounded-3xl overflow-hidden border border-slate-800 hover:border-amber-500/40 shadow-xl cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Photo with status and score badges */}
                  <div className="relative h-56 w-full overflow-hidden bg-slate-950">
                    <img
                      src={building.image_url}
                      alt={building.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Revival Score Badge */}
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/85 text-white backdrop-blur-md shadow-md border border-slate-700 flex items-center gap-1.5 text-xs font-bold font-mono">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Score: {building.revival_score}/100</span>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isRevived
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : building.status === 'in_progress'
                          ? 'bg-sky-600 text-white shadow-sm'
                          : building.status === 'approved'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-slate-700 text-slate-200 shadow-sm'
                      }`}
                    >
                      {building.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-extrabold text-white text-lg group-hover:text-amber-400 transition-colors leading-snug">
                        {building.title}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{building.address}</span>
                      </p>
                    </div>

                    {/* Proposed Use Box */}
                    <div className="p-3 bg-amber-950/30 rounded-2xl border border-amber-500/20 text-xs">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        Proposed Revival Use:
                      </span>
                      <p className="font-semibold text-slate-200 mt-0.5">
                        {building.proposed_use}
                      </p>
                    </div>

                    {/* Quick Specs */}
                    <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-400 border-t border-slate-800 pt-3">
                      <div>
                        <span className="text-slate-500 block">Footprint</span>
                        <strong className="text-white font-mono font-bold">{building.area_sqft} sq.ft</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Dormant</span>
                        <strong className="text-white font-mono font-bold">{building.years_abandoned} yrs</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Structure</span>
                        <strong className="text-white font-mono font-bold">{building.structural_rating}/10</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Link */}
                <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-amber-300">
                  <span>Inspect Blueprint & Score</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
