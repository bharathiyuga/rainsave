/**
 * Sustainability Calculation Utilities for RainRevive
 * Rain to Resource, Dead Building Revival, and Construction Material Reuse
 */

export interface RainwaterInputs {
  rooftopAreaSqm: number;
  roofType: string;
  annualRainfallMm: number;
  catchmentEfficiency?: number; // default 0.85 (filtration & first flush losses)
  householdSize?: number;
}

export interface RainwaterResult {
  potentialLiters: number;
  potentialKiloliters: number;
  recommendedTankLiters: number;
  estimatedSavingsInr: number;
  dailyHarvestEquivalentLiters: number;
  dailyDemandCoveredPercent: number;
  co2OffsetKg: number; // Water pumping energy avoided
}

export const CITY_RAINFALL_PRESETS: Record<string, { rainfallMm: number; label: string; state: string }> = {
  mumbai: { rainfallMm: 2200, label: 'Mumbai', state: 'Maharashtra' },
  chennai: { rainfallMm: 1400, label: 'Chennai', state: 'Tamil Nadu' },
  salem: { rainfallMm: 920, label: 'Salem', state: 'Tamil Nadu' },
  coimbatore: { rainfallMm: 710, label: 'Coimbatore', state: 'Tamil Nadu' },
  bengaluru: { rainfallMm: 970, label: 'Bengaluru', state: 'Karnataka' },
  delhi: { rainfallMm: 800, label: 'Delhi NCR', state: 'Delhi' },
  hyderabad: { rainfallMm: 810, label: 'Hyderabad', state: 'Telangana' },
  kolkata: { rainfallMm: 1650, label: 'Kolkata', state: 'West Bengal' },
  pune: { rainfallMm: 760, label: 'Pune', state: 'Maharashtra' },
  kochi: { rainfallMm: 3100, label: 'Kochi', state: 'Kerala' },
  jaipur: { rainfallMm: 650, label: 'Jaipur', state: 'Rajasthan' },
};

export const ROOF_TYPES: Record<string, { label: string; runoffCoeff: number; description: string }> = {
  concrete: { label: 'RCC / Concrete Flat Roof', runoffCoeff: 0.85, description: 'Smooth concrete surface with minimal absorption' },
  clay_tile: { label: 'Mangalore / Clay Tiles', runoffCoeff: 0.80, description: 'Traditional pitched roof tiles' },
  metal_sheet: { label: 'Corrugated GI / Metal Sheet', runoffCoeff: 0.90, description: 'Impervious metal roof with highest yield' },
  asbestos: { label: 'Cement / Asbestos Sheet', runoffCoeff: 0.80, description: 'Rough corrugated sheets' },
  green_roof: { label: 'Extensive Green Roof (Vegetated)', runoffCoeff: 0.50, description: 'Retains significant water for vegetation' },
};

/**
 * Calculates Annual Rainwater Harvesting Potential
 * Formula: Volume (L) = Area (m²) * Rainfall (mm) * Runoff Coefficient * Filter Efficiency
 */
export function calculateRainwaterPotential(inputs: RainwaterInputs): RainwaterResult {
  const { rooftopAreaSqm, roofType, annualRainfallMm, catchmentEfficiency = 0.85, householdSize = 4 } = inputs;
  const runoffCoeff = ROOF_TYPES[roofType]?.runoffCoeff || 0.80;

  // 1 mm of rain on 1 m² = 1 Liter of water
  const potentialLiters = Math.round(rooftopAreaSqm * annualRainfallMm * runoffCoeff * catchmentEfficiency);
  const potentialKiloliters = Number((potentialLiters / 1000).toFixed(1));

  // Recommended tank capacity: designed to hold ~20-25 days of consumption or peak monsoon buffer
  // Typical domestic non-potable daily usage per person = 75 L (flushing, cleaning, gardening)
  const dailyHouseholdNeed = householdSize * 75;
  const recommendedTankLiters = Math.min(
    Math.round(potentialLiters * 0.15), // 15% buffer of annual catch
    Math.max(3000, Math.round(dailyHouseholdNeed * 25))
  );

  // Average cost of delivered tanker / piped water in urban India is ~₹0.10 - ₹0.15 per liter
  const estimatedSavingsInr = Math.round(potentialLiters * 0.12);

  const dailyHarvestEquivalentLiters = Math.round(potentialLiters / 365);
  const dailyDemandCoveredPercent = Math.min(100, Math.round((dailyHarvestEquivalentLiters / dailyHouseholdNeed) * 100));

  // Carbon reduction: Municipal water pumping & treatment uses ~0.00035 kWh/L = ~0.28 kg CO2 per kL
  const co2OffsetKg = Math.round((potentialLiters / 1000) * 0.28);

  return {
    potentialLiters,
    potentialKiloliters,
    recommendedTankLiters,
    estimatedSavingsInr,
    dailyHarvestEquivalentLiters,
    dailyDemandCoveredPercent,
    co2OffsetKg,
  };
}

/**
 * Material specific impact factors
 * Weight in kg per standard unit, virgin CO2 emissions prevented per kg, and new market cost baseline
 */
export const MATERIAL_FACTORS: Record<string, {
  unitKg: number;
  co2Factor: number; // kg CO2 saved per kg material reused
  marketPricePerUnit: number; // approximate new purchase price in INR
}> = {
  'Bricks': { unitKg: 3.2, co2Factor: 0.28, marketPricePerUnit: 12 },
  'Cement': { unitKg: 50.0, co2Factor: 0.82, marketPricePerUnit: 390 },
  'Sand': { unitKg: 1000.0, co2Factor: 0.05, marketPricePerUnit: 2400 },
  'Gravel': { unitKg: 1000.0, co2Factor: 0.04, marketPricePerUnit: 1800 },
  'Steel': { unitKg: 12.0, co2Factor: 1.85, marketPricePerUnit: 950 },
  'Pipes': { unitKg: 4.5, co2Factor: 1.90, marketPricePerUnit: 450 },
  'Tiles': { unitKg: 2.5, co2Factor: 0.65, marketPricePerUnit: 70 },
  'Wood': { unitKg: 15.0, co2Factor: 0.40, marketPricePerUnit: 1200 },
  'Paint': { unitKg: 1.4, co2Factor: 2.10, marketPricePerUnit: 380 },
  'Doors & Windows': { unitKg: 28.0, co2Factor: 1.20, marketPricePerUnit: 6500 },
  'Concrete Blocks': { unitKg: 18.0, co2Factor: 0.45, marketPricePerUnit: 65 },
  'Electrical': { unitKg: 2.0, co2Factor: 3.10, marketPricePerUnit: 350 },
  'Plumbing': { unitKg: 3.0, co2Factor: 2.20, marketPricePerUnit: 280 },
  'Other': { unitKg: 5.0, co2Factor: 0.50, marketPricePerUnit: 200 },
};

/**
 * Calculates environmental and economic impact of material reuse
 */
export function calculateMaterialImpact(category: string, quantity: number, sellingPrice: number) {
  const factor = MATERIAL_FACTORS[category] || MATERIAL_FACTORS['Other'];
  const totalWeightKg = Math.round(quantity * factor.unitKg);
  const totalWeightTons = Number((totalWeightKg / 1000).toFixed(2));
  const co2ReductionKg = Math.round(totalWeightKg * factor.co2Factor);

  const baselineNewPrice = quantity * factor.marketPricePerUnit;
  const estimatedSavingsInr = Math.max(0, Math.round(baselineNewPrice - sellingPrice));

  return {
    totalWeightKg,
    totalWeightTons,
    co2ReductionKg,
    estimatedSavingsInr,
  };
}

/**
 * Calculates Dead Building Revival Score (0 to 100)
 */
export function calculateRevivalScore(params: {
  structuralRating: number; // 1 - 10
  condition: string;
  yearsAbandoned: number;
  areaSqft: number;
}): { score: number; verdict: string; grade: string; color: string } {
  const { structuralRating, condition, yearsAbandoned, areaSqft } = params;

  let base = structuralRating * 7; // up to 70 pts from structural integrity

  // Condition modifier
  const conditionPts: Record<string, number> = {
    fair: 18,
    moderate: 14,
    poor: 8,
    critical: 4,
    dilapidated: 1,
  };
  base += conditionPts[condition] || 10;

  // Years abandoned penalty (decay over time)
  const decayPenalty = Math.min(15, yearsAbandoned * 1.5);
  base -= decayPenalty;

  // Area scale factor (larger abandoned spaces have greater community leverage)
  if (areaSqft > 5000) base += 8;
  else if (areaSqft > 2000) base += 5;
  else base += 3;

  const score = Math.max(10, Math.min(99, Math.round(base)));

  let verdict = 'Prime candidate for community revival';
  let grade = 'A+';
  let color = 'text-emerald-600 bg-emerald-50 border-emerald-200';

  if (score >= 80) {
    verdict = 'Outstanding Candidate - High structural soundness & rapid conversion potential';
    grade = 'A';
    color = 'text-emerald-700 bg-emerald-50 border-emerald-300';
  } else if (score >= 65) {
    verdict = 'Strong Potential - Minor structural retrofits & high community utility';
    grade = 'B';
    color = 'text-blue-700 bg-blue-50 border-blue-300';
  } else if (score >= 45) {
    verdict = 'Moderate Viability - Requires targeted structural reinforcement';
    grade = 'C';
    color = 'text-amber-700 bg-amber-50 border-amber-300';
  } else {
    verdict = 'Challenging Revival - Substantial underpinning & safety clearances needed';
    grade = 'D';
    color = 'text-rose-700 bg-rose-50 border-rose-300';
  }

  return { score, verdict, grade, color };
}
