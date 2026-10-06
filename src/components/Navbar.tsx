import { useState } from 'react';
import { useRouter } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import {
  Droplets,
  Building2,
  PackageCheck,
  PlusCircle,
  Menu,
  X,
  Heart,
  ShoppingBag,
  ShieldCheck,
  BarChart3,
  MapPin,
  ChevronDown,
  Layers,
  Sparkles,
  UserCheck
} from 'lucide-react';

export function Navbar() {
  const { currentPath, navigate } = useRouter();
  const { user, isAdmin, availableUsers, switchUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Rain to Resource', path: '/rain-calculator', icon: Droplets },
    { name: 'Revive Buildings', path: '/projects', icon: Building2 },
    { name: 'Impact Tracker', path: '/impact', icon: BarChart3 },
    { name: 'Community Map', path: '/#map-section', icon: MapPin },
  ];

  const handleLinkClick = (path: string) => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    if (path.startsWith('/#')) {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(path.replace('/#', ''));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      navigate(path);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#070c18]/85 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleLinkClick('/')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 group-hover:shadow-emerald-500/40 transition-all duration-300">
                <Droplets className="w-5 h-5 -mr-1" />
                <Building2 className="w-3.5 h-3.5 -ml-1 text-emerald-200" />
                <span className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  Rain<span className="text-emerald-400">Revive</span>
                </span>
                <span className="hidden lg:block text-[10px] font-semibold text-slate-400 uppercase tracking-widest -mt-1">
                  Circular Sustainability
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-emerald-300 bg-emerald-950/70 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)] font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  {link.name}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Submit Building CTA + User Profile */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => handleLinkClick('/submit-building')}
              className="relative group overflow-hidden flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-600/30 transition-all duration-300 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Revive Space</span>
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>
            </button>

            {/* User Profile / Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-slate-750 bg-slate-900/80 hover:bg-slate-800/80 hover:border-slate-600 transition-all text-left shadow-sm cursor-pointer"
              >
                <img
                  src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={user.full_name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-emerald-500/40"
                />
                <div className="hidden xl:block text-xs">
                  <div className="font-semibold text-slate-200 leading-tight truncate max-w-[110px]">
                    {user.full_name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] capitalize text-emerald-400 font-medium">
                    {user.role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900/95 backdrop-blur-2xl shadow-2xl border border-slate-750 py-2 z-50 animate-in fade-in-50 zoom-in-95">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-[11px] text-slate-400 font-medium">Signed in as</p>
                    <p className="text-sm font-bold text-white truncate">{user.full_name}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                      {user.role} Account
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => handleLinkClick('/dashboard')}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800/80 hover:text-emerald-300 text-left transition-colors cursor-pointer"
                    >
                      <BarChart3 className="w-4 h-4 text-slate-400" />
                      Dashboard & Impact
                    </button>
                    <button
                      onClick={() => handleLinkClick('/projects')}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800/80 hover:text-emerald-300 text-left transition-colors cursor-pointer"
                    >
                      <Building2 className="w-4 h-4 text-slate-400" />
                      Dead Building Catalog
                    </button>
                    <button
                      onClick={() => handleLinkClick('/rain-calculator')}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800/80 hover:text-emerald-300 text-left transition-colors cursor-pointer"
                    >
                      <Droplets className="w-4 h-4 text-slate-400" />
                      Rainwater Calculator
                    </button>

                    <button
                      onClick={() => handleLinkClick('/login')}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-950/40 hover:text-emerald-300 text-left transition-colors border-t border-slate-800 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      Sign In / Switch Account
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => handleLinkClick('/admin')}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-indigo-300 bg-indigo-950/50 hover:bg-indigo-900/60 font-semibold text-left transition-colors border-y border-indigo-900/30 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-indigo-400" />
                        Admin Management
                      </button>
                    )}
                  </div>

                  {/* Switch Demo Persona Quick Bar */}
                  <div className="mt-1 pt-2 border-t border-slate-800 px-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-emerald-400" /> Switch Test Persona:
                    </p>
                    <div className="space-y-1">
                      {availableUsers.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            switchUser(u.id);
                            setUserDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors ${
                            u.id === user.id
                              ? 'bg-emerald-950/70 border border-emerald-500/30 font-bold text-emerald-300'
                              : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <span className="truncate">{u.full_name}</span>
                          <span className="text-[10px] text-slate-500 capitalize">({u.role})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleLinkClick('/submit-building')}
              className="p-2 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
              aria-label="Revive space"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0c1427] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-2xl border border-slate-800 mb-2">
            <img src={user.avatar_url} alt="" className="w-10 h-10 rounded-xl object-cover ring-1 ring-emerald-500/30" />
            <div>
              <p className="font-bold text-sm text-white">{user.full_name}</p>
              <p className="text-xs text-emerald-400 capitalize font-medium">{user.role} Account • {user.location}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-left text-xs font-semibold text-slate-300 hover:text-white"
                >
                  <Icon className="w-4 h-4 text-emerald-400" />
                  {link.name}
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-800 pt-2 space-y-1">
            <button
              onClick={() => handleLinkClick('/dashboard')}
              className="w-full flex items-center gap-2 p-2 text-xs font-medium text-slate-300 rounded-lg hover:bg-slate-850"
            >
              <BarChart3 className="w-4 h-4 text-slate-400" /> Dashboard & Stats
            </button>
            <button
              onClick={() => handleLinkClick('/projects')}
              className="w-full flex items-center gap-2 p-2 text-xs font-medium text-slate-300 rounded-lg hover:bg-slate-850"
            >
              <Building2 className="w-4 h-4 text-slate-400" /> Dead Building Catalog
            </button>
            <button
              onClick={() => handleLinkClick('/submit-building')}
              className="w-full flex items-center gap-2 p-2 text-xs font-medium text-slate-300 rounded-lg hover:bg-slate-850"
            >
              <PlusCircle className="w-4 h-4 text-slate-400" /> Submit Dead Building
            </button>
            <button
              onClick={() => handleLinkClick('/login')}
              className="w-full flex items-center gap-2 p-2 text-xs font-semibold text-emerald-400 rounded-lg hover:bg-emerald-950/40"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" /> Sign In / Switch Account
            </button>
            {isAdmin && (
              <button
                onClick={() => handleLinkClick('/admin')}
                className="w-full flex items-center gap-2 p-2 text-xs font-semibold text-indigo-300 bg-indigo-950/60 border border-indigo-800/40 rounded-lg"
              >
                <ShieldCheck className="w-4 h-4 text-indigo-400" /> Admin Management
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
