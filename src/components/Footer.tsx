import { Droplets, Building2, Layers, HeartHandshake, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useRouter } from '../context/NavigationContext';

export function Footer() {
  const { navigate } = useRouter();

  return (
    <footer className="bg-[#050913] text-slate-300 border-t border-slate-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Tagline Banner */}
        <div className="bg-gradient-to-r from-emerald-950/60 via-[#0a1224] to-teal-950/60 rounded-3xl p-8 border border-emerald-500/20 mb-12 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="text-emerald-400 text-xs uppercase tracking-widest font-bold">The Tri-Fold Creed</span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
                “Don’t waste a drop. Don’t waste a space. Don’t waste a material.”
              </h3>
              <p className="text-slate-400 text-sm mt-2 max-w-2xl">
                RainRevive bridges hydrologic conservation, architectural upcycling, and surplus construction circularity into an open, community-powered ecosystem.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/rain-calculator')}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wide transition-all shadow-lg shadow-emerald-900/30 active:scale-95 cursor-pointer"
              >
                Calculate Rainwater
              </button>
              <button
                onClick={() => navigate('/projects')}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs tracking-wide transition-all border border-slate-700 active:scale-95 cursor-pointer"
              >
                Explore Dead Buildings
              </button>
            </div>
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-800/60">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
                <Droplets className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Rain<span className="text-emerald-400">Revive</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Empowering communities and cities to reverse resource depletion. Calculate rainwater harvesting potential and transform abandoned architecture into thriving community spaces.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>PostgreSQL & Supabase Storage Enabled</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-sky-400" /> 1. Rain to Resource
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => navigate('/rain-calculator')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Harvest Potential Calculator
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/rain-calculator')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Rooftop Surface Coefficients
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/impact')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Cistern Capacity Sizing
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/dashboard')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Water Bill Savings Tracker
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-400" /> 2. Dead Building Revival
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => navigate('/projects')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Community Revival Catalog
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/submit-building')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Submit Abandoned Space
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/projects')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Revival Score Algorithm
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/projects')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Green Revival Blueprints
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} RainRevive. Dedicated to zero urban waste and ecological circularity.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/impact')} className="hover:text-slate-300 transition-colors">
              Impact Analytics
            </button>
            <button onClick={() => navigate('/admin')} className="hover:text-slate-300 transition-colors">
              Admin Governance
            </button>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All Systems Operational
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
