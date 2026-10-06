import { useState, useEffect } from 'react';
import { db, subscribeToDB } from '../lib/supabase';
import { SustainabilityMetrics } from '../types';
import { useRouter } from '../context/NavigationContext';
import {
  Droplets,
  Building2,
  Layers,
  Recycle,
  Coins,
  Globe,
  Trees,
  TrendingUp,
  BarChart3,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  CartesianGrid
} from 'recharts';

export function ImpactPage() {
  const { navigate } = useRouter();
  const [metrics, setMetrics] = useState<SustainabilityMetrics>(() => db.getSustainabilityMetrics());

  useEffect(() => {
    const unsub = subscribeToDB(() => {
      setMetrics(db.getSustainabilityMetrics());
    });
    return unsub;
  }, []);

  const waterTrendData = [
    { month: 'May', harvestLiters: 450000, cumulativeLiters: 450000 },
    { month: 'Jun', harvestLiters: 680000, cumulativeLiters: 1130000 },
    { month: 'Jul', harvestLiters: 920000, cumulativeLiters: 2050000 },
    { month: 'Aug', harvestLiters: 850000, cumulativeLiters: 2900000 },
    { month: 'Sep', harvestLiters: 740000, cumulativeLiters: 3640000 },
    { month: 'Oct', harvestLiters: 560000, cumulativeLiters: 4200000 },
  ];

  const buildingCategoryData = [
    { name: 'Artisan & Craft Guilds', value: 5, color: '#10b981' },
    { name: 'Hydroponics & Urban Ag', value: 4, color: '#0284c7' },
    { name: 'Libraries & Daycares', value: 3, color: '#f59e0b' },
    { name: 'Youth Maker Spaces', value: 3, color: '#8b5cf6' },
  ];

  const materialWasteData = [
    { category: 'Bricks & Blocks', preventedKg: 7800, fill: '#f97316' },
    { category: 'Cement Bags', preventedKg: 4200, fill: '#64748b' },
    { category: 'Steel Rebars', preventedKg: 3100, fill: '#3b82f6' },
    { category: 'Tiles & Ceramics', preventedKg: 1950, fill: '#10b981' },
    { category: 'Timber & Doors', preventedKg: 1400, fill: '#a855f7' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 text-slate-100">
      
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">
          <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
          Dual-Pillar Ecological Ledger
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Sustainability Impact & Planetary Returns
        </h1>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
          Tracking the measurable outcomes of rainwater harvested and dormant architecture revived into living community spaces across Tamil Nadu.
        </p>
      </div>

      {/* SECTION 1: 💧 WATER */}
      <section className="bg-[#0b1222]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-950 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Pillar 1</span>
              <h2 className="text-2xl font-black text-white">WATER IMPACT</h2>
            </div>
          </div>
          <button
            onClick={() => navigate('/rain-calculator')}
            className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
          >
            <span>Run Rain Calculator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-sky-950/40 border border-sky-500/20 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wide text-sky-400">Rainwater Collected</span>
            <p className="text-3xl sm:text-4xl font-black text-white font-mono">
              {(metrics.waterHarvestedLiters / 1000).toLocaleString()} <span className="text-sm font-sans font-semibold text-sky-400">kL</span>
            </p>
            <p className="text-xs text-slate-400 font-mono">
              ≈ {metrics.waterHarvestedLiters.toLocaleString()} Liters retained locally
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-sky-950/40 border border-sky-500/20 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wide text-sky-400">Tank Capacity Built</span>
            <p className="text-3xl sm:text-4xl font-black text-white font-mono">
              485,000 <span className="text-sm font-sans font-semibold text-sky-400">L</span>
            </p>
            <p className="text-xs text-slate-400">
              Combined decentralized cistern storage
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-sky-950/40 border border-sky-500/20 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wide text-sky-400">Water Utility Saved</span>
            <p className="text-3xl sm:text-4xl font-black text-white font-mono">
              ₹{(metrics.waterSavedInr / 1000).toFixed(0)}k
            </p>
            <p className="text-xs text-slate-400">
              Avoided municipal and commercial water tanker bills
            </p>
          </div>
        </div>

        {/* Recharts Area Chart for Water Harvest Trend */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-white">
            Cumulative Regional Rainwater Retention (May - Oct)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waterTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${Number(val).toLocaleString()} Liters`, 'Harvested']}
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="harvestLiters" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#waterGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* SECTION 2: 🏚️ BUILDINGS */}
      <section className="bg-[#0b1222]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-950 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Pillar 2</span>
              <h2 className="text-2xl font-black text-white">BUILDINGS REVIVED</h2>
            </div>
          </div>
          <button
            onClick={() => navigate('/projects')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            <span>Explore All Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-amber-950/40 border border-amber-500/20 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wide text-amber-400">Buildings Submitted</span>
            <p className="text-3xl sm:text-4xl font-black text-white font-mono">
              {metrics.buildingsSubmitted}
            </p>
            <p className="text-xs text-slate-400">
              Dormant architectural structures cataloged
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-amber-950/40 border border-amber-500/20 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wide text-amber-400">Buildings Revived</span>
            <p className="text-3xl sm:text-4xl font-black text-white font-mono">
              {metrics.buildingsRevived}
            </p>
            <p className="text-xs text-slate-400">
              Restored with Green Revival Plans
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-amber-950/40 border border-amber-500/20 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wide text-amber-400">Community Spaces Created</span>
            <p className="text-3xl sm:text-4xl font-black text-white font-mono">
              {metrics.communitySpacesCreated}
            </p>
            <p className="text-xs text-slate-400">
              Maker hubs, workshops, daycare & urban farms
            </p>
          </div>
        </div>

        {/* Recharts Pie Chart for Repurposed Typology */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-white">
              Repurposed Building Typology Distribution
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dormant industrial mills, municipal sheds, and grain warehouses are adapted to fill crucial civic needs without consuming virgin greenfield land.
            </p>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={buildingCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {buildingCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

    </div>
  );
}
