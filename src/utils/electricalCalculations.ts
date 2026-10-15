import { CableCalculationInput, CableCalculationResult, InstallationMethod } from '../types/electrical';

// Standard metric cable cross-sections (mm²)
export const STANDARD_SECTIONS = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300];

// Standard Breaker Ratings (A) according to NF / IEC
export const STANDARD_BREAKERS = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250];

// ICTA Standard Conduit Diameters (mm)
export const STANDARD_CONDUITS = [16, 20, 25, 32, 40, 50, 63];

// Resistivity at working temp (approx 75°C) according to NFC 15-100 guide
// Rho copper: 0.0225 ohm.mm²/m at 75°C (or 0.0175 at 20°C)
// Rho aluminum: 0.036 ohm.mm²/m at 75°C (or 0.028 at 20°C)
export const RHO_COPPER_75 = 0.0225;
export const RHO_ALUMINUM_75 = 0.036;
export const REACTANCE_LAMBDA = 0.00008; // Ohm/m

// Basic current carrying capacity (Iz in Amperes) for Copper at 30°C
// Table 52C of NFC 15-100 / IEC 60364-5-52
export const REFERENCE_CURRENT_CAPACITY: Record<InstallationMethod, Record<number, number>> = {
  // Method A (Conduit in insulated wall - worst thermal dissipation)
  conduit_insulated_wall: {
    1.5: 14.5, 2.5: 19.5, 4: 26, 6: 34, 10: 46, 16: 61, 25: 80, 35: 99, 50: 119, 70: 151, 95: 182, 120: 210, 150: 240, 185: 273, 240: 321, 300: 367
  },
  // Method B (Conduit in masonry / wall)
  conduit_masonry: {
    1.5: 17.5, 2.5: 24, 4: 32, 6: 41, 10: 57, 16: 76, 25: 101, 35: 125, 50: 151, 70: 192, 95: 232, 120: 269, 150: 300, 185: 341, 240: 400, 300: 458
  },
  // Method B2 (Surface conduit)
  surface_conduit: {
    1.5: 18.5, 2.5: 25, 4: 34, 6: 43, 10: 60, 16: 80, 25: 106, 35: 131, 50: 159, 70: 202, 95: 244, 120: 282, 150: 320, 185: 360, 240: 420, 300: 480
  },
  // Method E (Perforated cable tray)
  cable_tray_perforated: {
    1.5: 22, 2.5: 30, 4: 40, 6: 52, 10: 71, 16: 96, 25: 119, 35: 148, 50: 180, 70: 232, 95: 282, 120: 328, 150: 379, 185: 434, 240: 514, 300: 593
  },
  // Method F (Cable ladder)
  cable_ladder: {
    1.5: 24, 2.5: 33, 4: 45, 6: 58, 10: 80, 16: 107, 25: 138, 35: 171, 50: 209, 70: 269, 95: 328, 120: 382, 150: 441, 185: 506, 240: 599, 300: 693
  },
  // Method D (Buried in ground with conduit)
  buried_in_ground: {
    1.5: 23, 2.5: 31, 4: 41, 6: 53, 10: 71, 16: 94, 25: 122, 35: 149, 50: 179, 70: 221, 95: 264, 120: 300, 150: 340, 185: 384, 240: 445, 300: 505
  }
};

// Temperature correction factors (Table 52-D1, PVC insulation, ref 30°C)
export function getTempCorrectionFactor(ambientTempC: number): number {
  if (ambientTempC <= 10) return 1.22;
  if (ambientTempC <= 15) return 1.17;
  if (ambientTempC <= 20) return 1.12;
  if (ambientTempC <= 25) return 1.06;
  if (ambientTempC <= 30) return 1.00;
  if (ambientTempC <= 35) return 0.94;
  if (ambientTempC <= 40) return 0.87;
  if (ambientTempC <= 45) return 0.79;
  if (ambientTempC <= 50) return 0.71;
  if (ambientTempC <= 55) return 0.61;
  return 0.50;
}

// Grouping correction factor (Table 52-E1)
export function getGroupingCorrectionFactor(cablesCount: number): number {
  if (cablesCount <= 1) return 1.0;
  if (cablesCount === 2) return 0.8;
  if (cablesCount === 3) return 0.7;
  if (cablesCount === 4) return 0.65;
  if (cablesCount <= 6) return 0.57;
  if (cablesCount <= 9) return 0.50;
  return 0.45;
}

/**
 * Calculates complete cable sizing, voltage drop, and protection according to NFC 15-100 & IEC 60364
 */
export function calculateCableSizing(input: CableCalculationInput): CableCalculationResult {
  const {
    voltage,
    phase,
    material,
    powerKw,
    currentA,
    useCurrentDirectly,
    powerFactor,
    lengthMeters,
    installationMethod,
    ambientTempC,
    cablesGrouped,
    maxVoltageDropPercent
  } = input;

  // 1. Calculate Design Current (Courant d'emploi Ib)
  let ib = 0;
  if (useCurrentDirectly && currentA && currentA > 0) {
    ib = currentA;
  } else {
    const powerW = powerKw * 1000;
    const cosPhi = Math.max(0.1, Math.min(1.0, powerFactor || 0.85));
    if (phase === 'single') {
      ib = powerW / (voltage * cosPhi);
    } else {
      // Three phase: P = sqrt(3) * U * I * cos phi
      ib = powerW / (Math.sqrt(3) * voltage * cosPhi);
    }
  }

  // 2. Environmental & Grouping Derating Factors (K = K1 * K2 * K3)
  const k1 = getTempCorrectionFactor(ambientTempC);
  const k2 = getGroupingCorrectionFactor(cablesGrouped);
  const kTotal = k1 * k2;

  // Admissible current threshold required: Iz' >= Ib / K
  const requiredIz = ib / Math.max(0.2, kTotal);

  // Material factor: Aluminum capacity is approx 77% of copper
  const materialMultiplier = material === 'aluminum' ? 0.77 : 1.0;
  const rho = material === 'copper' ? RHO_COPPER_75 : RHO_ALUMINUM_75;
  const sinPhi = Math.sqrt(Math.max(0, 1 - Math.pow(powerFactor, 2)));

  // 3. Find candidate cross-section by thermal limit (Échauffement)
  const capacities = REFERENCE_CURRENT_CAPACITY[installationMethod] || REFERENCE_CURRENT_CAPACITY.surface_conduit;
  
  // Starting candidate based on thermal current
  let thermalSection = STANDARD_SECTIONS[STANDARD_SECTIONS.length - 1];
  for (const s of STANDARD_SECTIONS) {
    // Standard minimums: 1.5mm² for Cu, 16mm² for Al under NFC 15-100
    if (material === 'aluminum' && s < 16) continue;
    const nominalCapacity = (capacities[s] || s * 3.5) * materialMultiplier;
    if (nominalCapacity >= requiredIz) {
      thermalSection = s;
      break;
    }
  }

  // 4. Check & size by Voltage Drop (Chute de tension delta U)
  const maxDeltaUV = (maxVoltageDropPercent / 100) * voltage;
  let finalSection = thermalSection;
  let actualDeltaUV = 0;
  let actualDeltaUPercent = 0;
  let cableResistance = 0;

  for (const s of STANDARD_SECTIONS) {
    if (s < thermalSection) continue;
    if (material === 'aluminum' && s < 16) continue;

    // Resistance: R = rho * L / S
    const rConductor = (rho * lengthMeters) / s;
    const xConductor = REACTANCE_LAMBDA * lengthMeters;

    let deltaU = 0;
    if (phase === 'single') {
      // 1-phase: Delta U = 2 * I * (R*cosPhi + X*sinPhi)
      deltaU = 2 * ib * (rConductor * powerFactor + xConductor * sinPhi);
    } else {
      // 3-phase: Delta U = sqrt(3) * I * (R*cosPhi + X*sinPhi)
      deltaU = Math.sqrt(3) * ib * (rConductor * powerFactor + xConductor * sinPhi);
    }

    const deltaPercent = (deltaU / voltage) * 100;

    if (deltaPercent <= maxVoltageDropPercent || s === STANDARD_SECTIONS[STANDARD_SECTIONS.length - 1]) {
      finalSection = s;
      actualDeltaUV = deltaU;
      actualDeltaUPercent = deltaPercent;
      cableResistance = rConductor;
      break;
    }
  }

  // 5. Select recommended circuit breaker (In >= Ib and In <= Iz)
  let recommendedBreaker = STANDARD_BREAKERS[0];
  for (const b of STANDARD_BREAKERS) {
    if (b >= ib) {
      recommendedBreaker = b;
      break;
    }
  }

  // Breaker curve: Curve D for motors/high inrush, C for general, B for long lines
  let breakerCurve: 'B' | 'C' | 'D' = 'C';
  if (lengthMeters > 80 && actualDeltaUPercent > 3.5) {
    breakerCurve = 'B';
  }

  // 6. Minimum Conduit Diameter (Gaine ICTA) according to 1/3 rule
  // Approximate outer diameter of conductors based on section:
  // 1.5mm² -> 3.0mm, 2.5mm² -> 3.6mm, 4mm² -> 4.3mm, 6mm² -> 4.9mm, 10mm² -> 6.5mm, 16mm² -> 7.8mm...
  const conductorsCount = phase === 'single' ? 3 : 5; // Ph + N + PE or 3Ph + N + PE
  const conductorOuterD = Math.sqrt(finalSection) * 2.2 + 0.5;
  const singleConductorArea = Math.PI * Math.pow(conductorOuterD / 2, 2);
  const totalConductorArea = singleConductorArea * conductorsCount;
  // Conduit internal area >= 3 * total conductor area
  const requiredConduitInnerArea = 3 * totalConductorArea;
  const requiredConduitInnerD = Math.sqrt((4 * requiredConduitInnerArea) / Math.PI);
  // Conduit outer diameter is roughly inner diameter + 3 to 4mm
  const estimatedConduitOuterD = requiredConduitInnerD + 4;
  let minConduit = STANDARD_CONDUITS[0];
  for (const c of STANDARD_CONDUITS) {
    if (c >= estimatedConduitOuterD) {
      minConduit = c;
      break;
    }
  }

  // 7. Power loss in cable
  // Ploss = (phase === 'single' ? 2 : 3) * R * I^2
  const powerLossWatts = (phase === 'single' ? 2 : 3) * cableResistance * Math.pow(ib, 2);
  const admissibleCurrentIz = (capacities[finalSection] || finalSection * 3.5) * materialMultiplier * kTotal;

  // Step-by-step formula breakdown for students and engineers
  const formulasUsed = [
    {
      title: '1. حساب تيار الاستعمال (Courant d\'emploi Ib)',
      formula: phase === 'single' ? 'Ib = P / (U × cos φ)' : 'Ib = P / (√3 × U × cos φ)',
      substitution: phase === 'single' 
        ? `${(powerKw * 1000).toFixed(0)} W / (${voltage} V × ${powerFactor})`
        : `${(powerKw * 1000).toFixed(0)} W / (1.732 × ${voltage} V × ${powerFactor})`,
      result: `Ib = ${ib.toFixed(2)} A`
    },
    {
      title: '2. معاملات التصحيح البيئية (Facteur de correction K)',
      formula: 'K = K1 (حرارة) × K2 (تجميع الكابلات)',
      substitution: `K = ${k1.toFixed(2)} × ${k2.toFixed(2)}`,
      result: `K = ${kTotal.toFixed(2)} | تيار العتبة Iz' = ${(ib / kTotal).toFixed(2)} A`
    },
    {
      title: '3. حساب هبوط الجهد الحقيقي (Chute de tension ΔU)',
      formula: phase === 'single' 
        ? 'ΔU = 2 × Ib × L × (ρ/S × cos φ + λ × sin φ)' 
        : 'ΔU = √3 × Ib × L × (ρ/S × cos φ + λ × sin φ)',
      substitution: `${phase === 'single' ? '2' : '1.732'} × ${ib.toFixed(1)} A × ${lengthMeters} m × [(${rho}/${finalSection}) × ${powerFactor} + ...]`,
      result: `ΔU = ${actualDeltaUV.toFixed(2)} V (${actualDeltaUPercent.toFixed(2)}% من ${voltage}V)`
    },
    {
      title: '4. ضياع القدرة الحراري في الكابل (Pertes Joule)',
      formula: phase === 'single' ? 'P_perte = 2 × R × Ib²' : 'P_perte = 3 × R × Ib²',
      substitution: `${phase === 'single' ? '2' : '3'} × ${cableResistance.toFixed(4)} Ω × (${ib.toFixed(1)} A)²`,
      result: `P_perte = ${powerLossWatts.toFixed(1)} Watts`
    }
  ];

  return {
    designCurrentIb: Number(ib.toFixed(2)),
    voltageDropMaxAllowedV: Number(maxDeltaUV.toFixed(2)),
    standardSectionMm2: finalSection,
    actualVoltageDropV: Number(actualDeltaUV.toFixed(2)),
    actualVoltageDropPercent: Number(actualDeltaUPercent.toFixed(2)),
    isVoltageDropCompliant: actualDeltaUPercent <= maxVoltageDropPercent,
    cableResistanceTotalOhm: Number(cableResistance.toFixed(4)),
    powerLossWatts: Number(powerLossWatts.toFixed(1)),
    recommendedBreakerA: recommendedBreaker,
    breakerCurve,
    minConduitDiameterIctaMm: minConduit,
    kTotalFactor: Number(kTotal.toFixed(2)),
    admissibleCurrentIz: Number(admissibleCurrentIz.toFixed(1)),
    formulasUsed
  };
}

/**
 * Motor calculation utility
 */
export interface MotorCalcInput {
  powerUnit: 'kw' | 'hp';
  powerValue: number;
  voltageV: number; // 400 or 230
  powerFactorCosPhi: number; // e.g. 0.85
  efficiencyEta: number; // e.g. 0.88
  polesCount: number; // 2, 4, 6, 8 poles
  frequencyHz: number; // 50Hz or 60Hz
}

export function calculateMotorParameters(input: MotorCalcInput) {
  const powerKw = input.powerUnit === 'hp' ? input.powerValue * 0.7457 : input.powerValue;
  const powerWatts = powerKw * 1000;
  
  // Electrical input power Pe = Pmech / eta
  const electricalPowerWatts = powerWatts / input.efficiencyEta;

  // Nominal Current In = Pe / (sqrt(3) * U * cosPhi)
  const nominalCurrentA = electricalPowerWatts / (Math.sqrt(3) * input.voltageV * input.powerFactorCosPhi);

  // Synchronous speed Ns = (120 * f) / poles
  const syncSpeedRpm = (120 * input.frequencyHz) / input.polesCount;
  
  // Typical nominal speed (with 3-5% slip)
  const typicalSlipPercent = 3.5;
  const nominalSpeedRpm = syncSpeedRpm * (1 - typicalSlipPercent / 100);

  // Nominal Torque Cn = P(Watts) / omega = 9550 * P(kW) / N(rpm)
  const nominalTorqueNm = (9550 * powerKw) / nominalSpeedRpm;

  // Starting currents
  const directStartingCurrentA = nominalCurrentA * 6.5;
  const starDeltaStartingCurrentA = directStartingCurrentA / 3;

  // Components Sizing
  // Contactor AC-3: for DOL KM1 = In. For Star-Delta KM1 & KM2 = In / sqrt(3) = 0.58 In, KM3 = In / 3 = 0.33 In
  const dolContactorA = Math.ceil(nominalCurrentA * 1.15);
  const starDeltaLineContactorA = Math.ceil((nominalCurrentA / Math.sqrt(3)) * 1.15);
  const starDeltaStarContactorA = Math.ceil((nominalCurrentA / 3) * 1.15);

  // Thermal relay range setting: 0.9 to 1.1 In
  const thermalRelaySettingA = Number(nominalCurrentA.toFixed(1));
  const thermalRelayMinA = Number((nominalCurrentA * 0.8).toFixed(1));
  const thermalRelayMaxA = Number((nominalCurrentA * 1.25).toFixed(1));

  // Magnetic Breaker (GV2) rating
  let gv2BreakerRatingA = 0.63;
  const gv2Ratings = [0.63, 1, 1.6, 2.5, 4, 6.3, 10, 14, 18, 23, 25, 32, 40, 50, 65, 80];
  for (const r of gv2Ratings) {
    if (r >= nominalCurrentA) {
      gv2BreakerRatingA = r;
      break;
    }
  }

  return {
    powerKw: Number(powerKw.toFixed(2)),
    electricalPowerKw: Number((electricalPowerWatts / 1000).toFixed(2)),
    nominalCurrentA: Number(nominalCurrentA.toFixed(2)),
    syncSpeedRpm,
    nominalSpeedRpm: Math.round(nominalSpeedRpm),
    nominalTorqueNm: Number(nominalTorqueNm.toFixed(2)),
    directStartingCurrentA: Number(directStartingCurrentA.toFixed(1)),
    starDeltaStartingCurrentA: Number(starDeltaStartingCurrentA.toFixed(1)),
    dolContactorA,
    starDeltaLineContactorA,
    starDeltaStarContactorA,
    thermalRelaySettingA,
    thermalRelayRange: `${thermalRelayMinA}A - ${thermalRelayMaxA}A`,
    gv2BreakerRatingA
  };
}

/**
 * Power Factor Correction (Batterie de condensateurs)
 */
export function calculatePowerFactorCorrection(
  activePowerKw: number,
  currentCosPhi: number,
  targetCosPhi: number,
  voltageV: number,
  frequencyHz: number = 50
) {
  const tanPhi1 = Math.tan(Math.acos(Math.max(0.1, Math.min(0.99, currentCosPhi))));
  const tanPhi2 = Math.tan(Math.acos(Math.max(0.1, Math.min(0.99, targetCosPhi))));
  
  // Reactive power required: Qc = P * (tan phi1 - tan phi2) in kVAR
  const requiredQcKvar = Math.max(0, activePowerKw * (tanPhi1 - tanPhi2));

  // Current reduction: I1 -> I2
  // I1 = P / (sqrt(3) * U * cosPhi1)
  const currentBeforeA = (activePowerKw * 1000) / (Math.sqrt(3) * voltageV * currentCosPhi);
  const currentAfterA = (activePowerKw * 1000) / (Math.sqrt(3) * voltageV * targetCosPhi);
  const currentGainPercent = ((currentBeforeA - currentAfterA) / currentBeforeA) * 100;

  // Capacitance per phase in Delta (Triangle) connection:
  // C = Qc / (3 * 2 * pi * f * U^2)
  const omega = 2 * Math.PI * frequencyHz;
  const capacitanceFaradsDelta = (requiredQcKvar * 1000) / (3 * omega * Math.pow(voltageV, 2));
  const capacitanceMicroFaradsDelta = capacitanceFaradsDelta * 1e6;

  // Estimated annual savings (based on avoiding 0.05 $/kWh penalty on reactive power)
  const estimatedAnnualSavingsKvarh = requiredQcKvar * 8 * 250; // 8 hrs/day, 250 days

  return {
    requiredQcKvar: Number(requiredQcKvar.toFixed(2)),
    currentBeforeA: Number(currentBeforeA.toFixed(1)),
    currentAfterA: Number(currentAfterA.toFixed(1)),
    currentGainPercent: Number(currentGainPercent.toFixed(1)),
    capacitanceMicroFaradsDelta: Number(capacitanceMicroFaradsDelta.toFixed(1)),
    estimatedAnnualSavingsKvarh: Math.round(estimatedAnnualSavingsKvarh)
  };
}
