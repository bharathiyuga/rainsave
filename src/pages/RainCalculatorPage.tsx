import { useState, useMemo } from 'react';
import { calculateRainwaterPotential, CITY_RAINFALL_PRESETS, ROOF_TYPES } from '../utils/sustainability';
import { db } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useRouter } from '../context/NavigationContext';
import {
  Droplets,
  Calculator,
  Save,
  CheckCircle2,
  TrendingUp,
  Coins,
  ShieldCheck,
  Building,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';

export function RainCalculatorPage() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const { navigate } = useRouter();

  // Inputs
  const [unitType, setUnitType] = useState<'sqm' | 'sqft'>('sqm');
  const [areaInput, setAreaInput] = useState<number>(150);
  const [roofType, setRoofType] = useState<string>('concrete');
  const [selectedCityKey, setSelectedCityKey] = useState<string>('salem');
  const [customRainfall, setCustomRainfall] = useState<number>(920);
  const [householdSize, setHouseholdSize] = useState<number>(4);
  const [locationName, setLocationName] = useState<string>('Salem, Tamil Nadu');
  const [notes, setNotes] = useState<string>('');
  const [saving, setSaving] = useState(false);

  // Normalize area to sqm
  const areaSqm = useMemo(() => {
    if (unitType === 'sqft') {
      return Math.round(areaInput * 0.092903);
    }
    return areaInput;
  }, [areaInput, unitType]);

  // Rainfall value
  const rainfallMm = useMemo(() => {
    if (selectedCityKey === 'custom') return customRainfall;
    return CITY_RAINFALL_PRESETS[selectedCityKey]?.rainfallMm || 1000;
  }, [selectedCityKey, customRainfall]);

  // Perform calculation
  const result = useMemo(() => {
    return calculateRainwaterPotential({
      rooftopAreaSqm: Math.max(1, areaSqm),
      roofType,
      annualRainfallMm: Math.max(10, rainfallMm),
      catchmentEfficiency: 0.85,
      householdSize,
    });
  }, [areaSqm, roofType, rainfallMm, householdSize]);

  // Monthly harvest estimation data for Recharts
  const monthlyData = useMemo(() => {
    const weights = [0.01, 0.01, 0.02, 0.04, 0.07, 0.12, 0.18, 0.20, 0.16, 0.12, 0.05, 0.02];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((m, idx) => ({
      month: m,
      harvest: Math.round(result.potentialLiters * weights[idx]),
      demand: householdSize * 75 * 30,
    }));
  }, [result.potentialLiters, householdSize]);

  const handleCityChange = (cityKey: string) => {
    setSelectedCityKey(cityKey);
    if (cityKey !== 'custom') {
      const preset = CITY_RAINFALL_PRESETS[cityKey];
      setCustomRainfall(preset.rainfallMm);
      setLocationName(`${preset.label}, ${preset.state}`);
    }
  };

  const handleSaveCalculation = () => {
    if (!areaInput || areaInput <= 0) {
      error('Please specify a valid rooftop area.');
      return;
    }
    setSaving(true);
    try {
      db.saveCalculation({
        rooftop_area_sqm: areaSqm,
        roof_type: roofType,
        annual_rainfall_mm: rainfallMm,
        runoff_coefficient: ROOF_TYPES[roofType]?.runoffCoeff || 0.8,
        catchment_efficiency: 0.85,
        potential_liters: result.potentialLiters,
        recommended_tank_capacity_liters: result.recommendedTankLiters,
        estimated_savings_inr: result.estimatedSavingsInr,
        household_size: householdSize,
        daily_demand_covered_percent: result.dailyDemandCoveredPercent,
        location: locationName || 'Salem, Tamil Nadu',
        notes: notes || `Rooftop ${areaSqm}m² with ${roofType} finish`,
      });
      success('Rainwater calculation saved to your profile!', 'Saved Successfully');
    } catch (e: any) {
      error(e.message || 'Failed to save calculation');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-slate-100">
      
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-950/80 border border-sky-500/30 text-sky-300">
          <Droplets className="w-3.5 h-3.5 text-sky-400" />
          Pillar 1: Rain to Resource
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Rainwater Harvesting Potential Calculator
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Accurately calculate annual runoff potential, sizing requirements for containment cisterns, and annual tanker water bill savings.
        </p>
      </div>

      {/* Main Grid: Inputs Form & Results Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Parameters Form (5 Cols) */}
        <div className="lg:col-span-5 bg-[#0b1222]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Calculator className="w-5 h-5 text-sky-400" />
            Catchment Parameters
          </h2>

          {/* Rooftop Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase text-slate-300 tracking-wide">
                Rooftop Area
              </label>
              <div className="flex bg-slate-800/80 p-0.5 rounded-lg text-xs font-semibold border border-slate-700">
                <button
                  type="button"
                  onClick={() => setUnitType('sqm')}
                  className={`px-2.5 py-1 rounded-md transition-all ${unitType === 'sqm' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400'}`}
                >
                  sq. meters (m²)
                </button>
                <button
                  type="button"
                  onClick={() => setUnitType('sqft')}
                  className={`px-2.5 py-1 rounded-md transition-all ${unitType === 'sqft' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400'}`}
                >
                  sq. feet (ft²)
                </button>
              </div>
            </div>
            <div className="relative">
              <input
                type="number"
                min="5"
                max="50000"
                value={areaInput}
                onChange={(e) => setAreaInput(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/90 focus:ring-2 focus:ring-sky-500 text-white font-mono font-bold text-base outline-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
                {unitType === 'sqm' ? 'm²' : 'ft²'}
              </span>
            </div>
            {unitType === 'sqft' && (
              <p className="text-[11px] text-slate-400 font-mono">
                Equivalent to ≈ {areaSqm} m² of effective catchment area
              </p>
            )}
          </div>

          {/* Roof Surface Material */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-slate-300 tracking-wide">
              Roof Surface Material
            </label>
            <select
              value={roofType}
              onChange={(e) => setRoofType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700 focus:ring-2 focus:ring-sky-500 text-slate-200 font-medium text-sm outline-none bg-slate-900"
            >
              {Object.entries(ROOF_TYPES).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label} (Runoff Coeff: {val.runoffCoeff})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500">
              {ROOF_TYPES[roofType]?.description}
            </p>
          </div>

          {/* Geographic Region / City Preset */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-slate-300 tracking-wide">
              Location & Rainfall Preset
            </label>
            <select
              value={selectedCityKey}
              onChange={(e) => handleCityChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700 focus:ring-2 focus:ring-sky-500 text-slate-200 font-medium text-sm outline-none bg-slate-900"
            >
              {Object.entries(CITY_RAINFALL_PRESETS).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.label}, {item.state} ({item.rainfallMm} mm/year)
                </option>
              ))}
              <option value="custom">Custom Annual Rainfall (mm)</option>
            </select>
          </div>

          {/* Custom Rainfall Input if selected */}
          {selectedCityKey === 'custom' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-300 tracking-wide">
                Annual Rainfall (mm)
              </label>
              <input
                type="number"
                min="50"
                max="8000"
                value={customRainfall}
                onChange={(e) => setCustomRainfall(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white text-sm outline-none font-bold"
              />
            </div>
          )}

          {/* Household Size */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase text-slate-300 tracking-wide">
                Household / Facility Occupants
              </label>
              <span className="text-xs font-bold text-sky-400">{householdSize} persons</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={householdSize}
              onChange={(e) => setHouseholdSize(Number(e.target.value))}
              className="w-full accent-sky-500"
            />
            <p className="text-[11px] text-slate-400">
              Estimated non-potable domestic requirement: {householdSize * 75} Liters / day
            </p>
          </div>

          {/* Location details & optional note */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <label className="text-xs font-bold uppercase text-slate-300 tracking-wide">
              Site Address / Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., North Block Rooftop, Salem"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white outline-none"
            />
          </div>

          {/* Save Action */}
          <button
            onClick={handleSaveCalculation}
            disabled={saving}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving to Database...' : 'Save Calculation to Profile'}</span>
          </button>
        </div>

        {/* Results & Visual Analytics (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Key Metric Cards with Luminous Dark Styling */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Harvest Potential */}
            <div className="bg-[#0b1424] rounded-3xl p-5 border border-sky-500/30 shadow-lg shadow-sky-500/10 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wide text-sky-400 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5" /> Annual Harvest
              </span>
              <p className="text-3xl font-black text-white tracking-tight tabular-nums font-mono">
                {result.potentialLiters.toLocaleString()}
                <span className="text-xs font-semibold text-sky-400 ml-1 font-sans">L</span>
              </p>
              <p className="text-xs text-sky-300">
                ≈ {result.potentialKiloliters} Kiloliters / year
              </p>
            </div>

            {/* Recommended Cistern Capacity */}
            <div className="bg-[#09181c] rounded-3xl p-5 border border-emerald-500/30 shadow-lg shadow-emerald-500/10 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wide text-emerald-400 flex items-center gap-1">
                <Building className="w-3.5 h-3.5" /> Recommended Tank
              </span>
              <p className="text-3xl font-black text-white tracking-tight tabular-nums font-mono">
                {result.recommendedTankLiters.toLocaleString()}
                <span className="text-xs font-semibold text-emerald-400 ml-1 font-sans">L</span>
              </p>
              <p className="text-xs text-emerald-300">
                Holds ~25 days buffer supply
              </p>
            </div>

            {/* Estimated Financial Savings */}
            <div className="bg-[#1b1409] rounded-3xl p-5 border border-amber-500/30 shadow-lg shadow-amber-500/10 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wide text-amber-400 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" /> Annual Savings
              </span>
              <p className="text-3xl font-black text-white tracking-tight tabular-nums font-mono">
                ₹{result.estimatedSavingsInr.toLocaleString()}
              </p>
              <p className="text-xs text-amber-300">
                Avoided municipal / tanker cost
              </p>
            </div>

          </div>

          {/* Secondary Impact Metrics Bar */}
          <div className="bg-[#0b1222]/90 backdrop-blur-xl rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">Daily Demand Coverage</span>
              <span className="text-emerald-400 font-mono font-extrabold">{result.dailyDemandCoveredPercent}% Covered</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-500 via-teal-400 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                style={{ width: `${result.dailyDemandCoveredPercent}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-300">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="block text-slate-400 font-medium">Daily Equivalent</span>
                <strong className="text-white font-mono font-bold text-sm">
                  {result.dailyHarvestEquivalentLiters} L / day
                </strong>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="block text-slate-400 font-medium">CO₂ Pump Offset</span>
                <strong className="text-white font-mono font-bold text-sm">
                  {result.co2OffsetKg} kg CO₂ / yr
                </strong>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                <span className="block text-slate-400 font-medium">Catchment Efficiency</span>
                <strong className="text-white font-bold text-sm">85% (First-flush)</strong>
              </div>
            </div>
          </div>

          {/* Seasonal Harvest Bar Chart (Recharts Dark Theme) */}
          <div className="bg-[#0b1222]/90 backdrop-blur-xl rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  Estimated Monthly Rainfall Inflow
                </h3>
                <p className="text-xs text-slate-400">
                  Expected volume pattern across seasonal monsoon cycles
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-sky-950/80 text-sky-300 font-semibold border border-sky-500/30">
                Litres / Month
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    formatter={(value: any) => [`${Number(value).toLocaleString()} L`, 'Harvested']}
                    contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="harvest" fill="#0284c7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Direct link to Reused Materials */}
          <div className="bg-gradient-to-r from-emerald-950/80 via-[#0a1526] to-slate-900 text-white rounded-3xl p-6 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
                Cross-Pillar Synergy
              </span>
              <h4 className="text-base font-bold mt-0.5">
                Build your rainwater tank using surplus bricks & cement
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Browse nearby construction leftovers to construct your sump wall at 60% lower material costs.
              </p>
            </div>
            <button
              onClick={() => navigate('/materials')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-md shadow-emerald-600/30"
            >
              <span>Source Surplus Materials</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
