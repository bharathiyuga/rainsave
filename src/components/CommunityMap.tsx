import React, { useState, useMemo } from 'react';
import { Building } from '../types';
import { useRouter } from '../context/NavigationContext';
import {
  MapPin,
  Building2,
  Filter,
  Maximize2,
  Navigation,
  ExternalLink,
  Sparkles,
  Info
} from 'lucide-react';

interface CommunityMapProps {
  buildings: Building[];
  materials?: any[];
}

export function CommunityMap({ buildings }: CommunityMapProps) {
  const { navigate } = useRouter();
  const [filterStatus, setFilterStatus] = useState<'all' | 'revived' | 'in_progress' | 'pending'>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [activeBuilding, setActiveBuilding] = useState<Building | null>(null);

  // Geographic boundaries approximation for regional view (Tamil Nadu / South India hub)
  const mapBounds = {
    minLat: 9.5,
    maxLat: 13.6,
    minLng: 76.5,
    maxLng: 80.6,
  };

  const getPosition = (lat: number, lng: number) => {
    const y = ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 82 + 9;
    const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 82 + 9;
    return {
      top: `${Math.max(10, Math.min(90, y))}%`,
      left: `${Math.max(10, Math.min(90, x))}%`,
    };
  };

  const filteredBuildings = useMemo(() => {
    return buildings.filter((b) => {
      if (filterStatus !== 'all' && b.status !== filterStatus) {
        return false;
      }
      if (selectedCity !== 'all' && !b.address.toLowerCase().includes(selectedCity.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [buildings, filterStatus, selectedCity]);

  return (
    <div className="relative bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Top Map Controls Header */}
      <div className="p-4 sm:p-6 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Navigation className="w-3 h-3 mr-1" /> Live Geospatial Grid
            </span>
            <span className="text-xs text-slate-400">
              {filteredBuildings.length} architecture revival sites mapped
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            Dead Building Revival & Community Spaces Map
          </h3>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 text-xs font-semibold">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterStatus === 'all' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Sites ({buildings.length})
            </button>
            <button
              onClick={() => setFilterStatus('revived')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                filterStatus === 'revived' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Revived
            </button>
            <button
              onClick={() => setFilterStatus('in_progress')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                filterStatus === 'in_progress' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" /> In Progress
            </button>
          </div>

          {/* City Selector */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Cities & Regions</option>
            <option value="salem">Salem Hub</option>
            <option value="coimbatore">Coimbatore Hub</option>
            <option value="chennai">Chennai Metro</option>
            <option value="madurai">Madurai District</option>
          </select>
        </div>
      </div>

      {/* Main Map View Area */}
      <div className="relative w-full h-[520px] bg-[#0c1424] overflow-hidden select-none">
        
        {/* Decorative Grid Lines & Terrain Contours */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:6rem_6rem]"></div>

        {/* Regional Water Bodies & Coastal SVG outline */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 50 100 Q 150 180 300 240 T 600 350 T 800 480"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="3"
            strokeDasharray="6 6"
          />
          <path
            d="M 120 40 Q 280 120 440 180 T 780 290"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
        </svg>

        {/* City Reference Labels */}
        <div className="absolute top-[28%] left-[72%] text-[11px] font-mono font-bold text-slate-400/80 pointer-events-none">
          ● Chennai Hub
        </div>
        <div className="absolute top-[48%] left-[45%] text-[11px] font-mono font-bold text-emerald-400/80 pointer-events-none">
          ● Salem Circular Zone
        </div>
        <div className="absolute top-[62%] left-[28%] text-[11px] font-mono font-bold text-slate-400/80 pointer-events-none">
          ● Coimbatore Node
        </div>
        <div className="absolute top-[32%] left-[32%] text-[11px] font-mono font-bold text-slate-400/80 pointer-events-none">
          ● Bengaluru Node
        </div>
        <div className="absolute top-[78%] left-[46%] text-[11px] font-mono font-bold text-slate-400/80 pointer-events-none">
          ● Madurai Node
        </div>

        {/* Building Pins */}
        {filteredBuildings.map((building) => {
          const pos = getPosition(building.latitude, building.longitude);
          const isRevived = building.status === 'revived';
          const isInProgress = building.status === 'in_progress';

          return (
            <button
              key={building.id}
              onClick={() => setActiveBuilding(building)}
              style={{ top: pos.top, left: pos.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none z-20 cursor-pointer"
              title={building.title}
            >
              <div className="relative flex items-center justify-center">
                <span className={`absolute w-8 h-8 rounded-full animate-ping opacity-30 ${
                  isRevived ? 'bg-emerald-500' : isInProgress ? 'bg-amber-500' : 'bg-sky-500'
                }`}></span>
                <div
                  className={`relative w-8 h-8 rounded-xl shadow-lg flex items-center justify-center text-white border-2 transition-transform group-hover:scale-125 ${
                    isRevived
                      ? 'bg-emerald-600 border-emerald-300'
                      : isInProgress
                      ? 'bg-amber-600 border-amber-300'
                      : 'bg-sky-600 border-sky-300'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                </div>
                {/* Floating tooltip */}
                <div className="absolute -bottom-7 whitespace-nowrap bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity border border-slate-700">
                  {building.title.substring(0, 24)}...
                </div>
              </div>
            </button>
          );
        })}

        {/* Interactive Popup Card for Active Pin */}
        {activeBuilding && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 border border-slate-700 shadow-2xl z-30 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                  activeBuilding.status === 'revived'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}
              >
                {activeBuilding.status === 'revived' ? 'Revived Community Hub' : 'Dead Building Candidate'}
              </span>
              <button
                onClick={() => setActiveBuilding(null)}
                className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-slate-800"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="flex gap-3">
                <img
                  src={activeBuilding.image_url}
                  alt=""
                  className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-700"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{activeBuilding.title}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{activeBuilding.address}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold text-xs border border-emerald-800">
                      Score: {activeBuilding.revival_score}/100
                    </span>
                    <span className="text-[11px] text-slate-400 capitalize">
                      {activeBuilding.condition} • {activeBuilding.area_sqft} sq.ft
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-300 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 leading-relaxed">
                {activeBuilding.green_plan_summary || `Proposed Conversion: ${activeBuilding.proposed_use}`}
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => navigate(`/building/${activeBuilding.id}`)}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  View Space Details <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Map Legend Overlay */}
        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md rounded-xl p-2.5 border border-slate-800 text-[11px] text-slate-300 space-y-1.5 pointer-events-none hidden sm:block">
          <div className="font-bold text-white text-xs mb-1">Map Legend</div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-emerald-600 border border-emerald-400"></span>
            <span>Revived Community Space</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-amber-600 border border-amber-400"></span>
            <span>In-Progress / Scouted Building</span>
          </div>
        </div>

      </div>
    </div>
  );
}
