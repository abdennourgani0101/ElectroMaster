export type SystemPhase = 'single' | 'three';
export type ConductorMaterial = 'copper' | 'aluminum';
export type InstallationMethod = 
  | 'conduit_insulated_wall' // Sous conduit dans paroi isolante (Méthode A)
  | 'conduit_masonry'        // Sous conduit encastré maçonnerie (Méthode B)
  | 'surface_conduit'        // Sous conduit en apparent (Méthode B2)
  | 'cable_tray_perforated'  // Sur chemin de câbles perforé (Méthode E/F)
  | 'cable_ladder'           // Sur échelle à câbles (Méthode F)
  | 'buried_in_ground';      // Enterré dans le sol avec gaine (Méthode D)

export interface CableCalculationInput {
  voltage: number; // 230 or 400
  phase: SystemPhase;
  material: ConductorMaterial;
  powerKw: number;
  currentA?: number;
  useCurrentDirectly: boolean;
  powerFactor: number; // cos phi, typically 0.8 to 1.0
  lengthMeters: number;
  installationMethod: InstallationMethod;
  ambientTempC: number;
  cablesGrouped: number;
  maxVoltageDropPercent: number; // 3% for lighting, 5% for other
}

export interface CableCalculationResult {
  designCurrentIb: number; // Courant d'emploi Ib (A)
  voltageDropMaxAllowedV: number;
  standardSectionMm2: number; // Recommended standard section (1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300)
  actualVoltageDropV: number;
  actualVoltageDropPercent: number;
  isVoltageDropCompliant: boolean;
  cableResistanceTotalOhm: number;
  powerLossWatts: number;
  recommendedBreakerA: number; // In of Disjoncteur
  breakerCurve: 'B' | 'C' | 'D';
  minConduitDiameterIctaMm: number; // Gaine ICTA recommandée (16, 20, 25, 32, 40)
  kTotalFactor: number; // Facteur de correction global K = K1 * K2 * K3
  admissibleCurrentIz: number; // Courant admissible Iz
  formulasUsed: {
    title: string;
    formula: string;
    substitution: string;
    result: string;
  }[];
}

export interface NfcRoomRule {
  id: string;
  nameAr: string;
  nameFr: string;
  iconName: string;
  descriptionAr: string;
  minOutlets: string;
  lightingPoints: string;
  dedicatedCircuits: string[];
  maxProtection: string;
  wireGauge: string;
  specialRules: string[];
}

export interface MotorStarterType {
  id: 'dol' | 'dol_rev' | 'star_delta' | 'vfd';
  nameAr: string;
  nameFr: string;
  nameEn: string;
  descriptionAr: string;
  startingCurrentRatio: string; // e.g. 4 - 8 In
  startingTorqueRatio: string;  // e.g. 1.5 - 2.5 Cn
  advantages: string[];
  disadvantages: string[];
  typicalUses: string[];
}

export interface EarthingRegime {
  id: 'TT' | 'TN-S' | 'TN-C' | 'IT';
  name: string;
  titleAr: string;
  titleFr: string;
  neutralSource: string; // T = Terre, I = Isolé
  exposedPartsMasses: string; // T = Terre, N = Neutre
  faultCurrentLevel: string; // Faible, Très élevé (court-circuit), Très faible (1er défaut)
  protectionDevice: string; // DDR, Disjoncteur/Fusible, CPI
  continuityOfService: string; // Coupure 1er défaut vs Signalisation
  costLevel: string;
  recommendedUseAr: string;
  advantages: string[];
  disadvantages: string[];
  safetyStandardClause: string;
}

export interface ElectricalSymbol {
  id: string;
  nameAr: string;
  nameFr: string;
  nameEn: string;
  category: 'power' | 'protection' | 'control' | 'architectural' | 'sensors' | 'motors';
  standardRef: string; // IEC 60617 / NF C 03-201
  tag: string; // Q1, KM1, F1, S1, S2, etc.
  descriptionAr: string;
  terminalMarking?: string; // e.g. 1-2, 3-4 / 13-14 / A1-A2
  svgType: string;
}

export interface DiagnosticFault {
  id: string;
  titleAr: string;
  titleFr: string;
  category: 'residential' | 'industrial' | 'motors';
  symptoms: string[];
  probableCauses: string[];
  safetyWarnings: string[];
  diagnosticSteps: {
    stepNumber: number;
    actionAr: string;
    toolRequired: string;
    expectedResult: string;
    decisionIfFail: string;
  }[];
  finalRemedyAr: string;
}

export interface QuizQuestion {
  id: number;
  category: 'nfc15100' | 'industrial' | 'electromechanics' | 'safety';
  questionAr: string;
  optionsAr: string[];
  correctIndex: number;
  explanationAr: string;
  standardReference: string;
}
