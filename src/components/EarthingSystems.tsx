import React, { useState } from 'react';
import { EARTHING_REGIMES } from '../data/industrialData';
import { EarthingRegime } from '../types/electrical';
import { 
  ShieldCheck, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  Calculator, 
  Info,
  Layers
} from 'lucide-react';

interface EarthingSystemsProps {
  showFrenchTerms: boolean;
}

export const EarthingSystems: React.FC<EarthingSystemsProps> = ({ showFrenchTerms }) => {
  const [selectedRegimeId, setSelectedRegimeId] = useState<'TT' | 'TN-S' | 'TN-C' | 'IT'>('TT');
  
  // Earthing Resistance Calculator State
  const [differentialRatingMa, setDifferentialRatingMa] = useState<number>(500); // 30, 300, 500 mA
  const [limitVoltageUlV, setLimitVoltageUlV] = useState<number>(50); // 50V (dry) or 25V (wet)
  const [actualEarthResistanceOhm, setActualEarthResistanceOhm] = useState<number>(35);

  const selectedRegime: EarthingRegime = EARTHING_REGIMES.find(r => r.id === selectedRegimeId) || EARTHING_REGIMES[0];

  // Max Allowed Earth Resistance: Ra <= Ul / Idn
  const maxAllowedRaOhm = (limitVoltageUlV / (differentialRatingMa / 1000));
  const isEarthResistanceCompliant = actualEarthResistanceOhm <= maxAllowedRaOhm;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h2 className="text-lg md:text-xl font-bold text-white">
                أنظمة التأريض ونظام الحيادي المعياري (Régimes de Neutre TT / TN / IT)
              </h2>
              {showFrenchTerms && (
                <span className="text-xs text-slate-400 font-mono">
                  (Schémas des Liaisons à la Terre - SLT selon NFC 15-100 & IEC 60364)
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl">
              دراسة مسارات تيارات العطل، أجهزة الحماية الإلزامية (DDR / Disjoncteur / CPI)، استمرارية الخدمة وحساب المقاومة القصوى لقطب التأريض (Ra).
            </p>
          </div>

          {/* Regime Selector Buttons */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            {EARTHING_REGIMES.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRegimeId(r.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedRegimeId === r.id
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r.name.split('(')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Details + Interactive Schematic */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: INTERACTIVE SCHEMATIC OF CURRENT FAULT LOOP */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              مخطط مسار تيار عطل العزل الكهربائي (Boucle de défaut)
            </h3>
            <span className="text-xs font-mono text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded">
              {selectedRegime.id}
            </span>
          </div>

          {/* Visual Canvas Representation */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 blueprint-grid space-y-6">
            {/* Top: HTA/BT Substation Transformer */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-400 block">محطة التحويل HTA / BT (المصدر)</span>
                <span className="text-[11px] text-slate-300 font-mono">نقطة الحيادي (Neutre Transfo): {selectedRegime.neutralSource}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold font-mono text-xs">
                {selectedRegime.id[0]}
              </div>
            </div>

            {/* Middle: Power Cable Distribution Wires */}
            <div className="space-y-1.5 font-mono text-[11px] py-1">
              <div className="flex items-center gap-2">
                <span className="w-12 text-rose-400 font-bold">L1:</span>
                <div className="h-1 bg-rose-500 flex-1 rounded"></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 text-emerald-400 font-bold">L2:</span>
                <div className="h-1 bg-emerald-500 flex-1 rounded"></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 text-sky-400 font-bold">L3:</span>
                <div className="h-1 bg-sky-500 flex-1 rounded"></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 text-blue-400 font-bold">N:</span>
                <div className="h-1 bg-blue-500 flex-1 rounded"></div>
              </div>
              {selectedRegime.id === 'TN-C' ? (
                <div className="flex items-center gap-2">
                  <span className="w-12 text-yellow-400 font-bold">PEN:</span>
                  <div className="h-1 bg-yellow-400 flex-1 rounded"></div>
                  <span className="text-[10px] text-yellow-300 font-sans">(حيادي + أرضي مشترك)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="w-12 text-emerald-400 font-bold">PE:</span>
                  <div className="h-1 bg-emerald-400 flex-1 rounded"></div>
                  <span className="text-[10px] text-emerald-300 font-sans">(سلك الحماية الأرضي)</span>
                </div>
              )}
            </div>

            {/* Bottom: Consumer Equipment with Insulation Fault */}
            <div className="bg-slate-900 border-2 border-rose-500/60 rounded-xl p-4 space-y-3 relative">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">الجهاز المستهلك (Hيكل معدني Masse)</span>
                  <span className="text-[11px] text-slate-300">ربط الهيكل: {selectedRegime.exposedPartsMasses}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center gap-1 font-mono">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  عطل عزل (Phase ➔ Masse)
                </span>
              </div>

              {/* Loop Explanation Alert */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1">
                <div className="font-bold text-amber-400">طبيعة تيار العطل في نظام {selectedRegime.id}:</div>
                <div className="font-mono text-white text-xs">{selectedRegime.faultCurrentLevel}</div>
                <div className="text-[11px] text-slate-400">
                  وسيلة الحماية الإلزامية: <span className="text-sky-300 font-bold">{selectedRegime.protectionDevice}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Advantages & Disadvantages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                أهم المزايا (Avantages)
              </span>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                {selectedRegime.advantages.map((adv, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-400">•</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-rose-400 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                العيوب والقيود (Inconvénients)
              </span>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                {selectedRegime.disadvantages.map((dis, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-400">•</span>
                    <span>{dis}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT: REGIME DETAILS & EARTH RESISTANCE CALCULATOR */}
        <div className="lg:col-span-5 space-y-5">
          {/* Regime Specifications Summary Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
              المواصفات التقنية: {selectedRegime.titleAr}
            </h4>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">استمرارية التغذية:</span>
                <span className="font-bold text-white">{selectedRegime.continuityOfService}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">التكلفة المالية:</span>
                <span className="font-bold text-amber-400">{selectedRegime.costLevel}</span>
              </div>
              <div className="border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400 block mb-1">مجال التطبيق الموصى به:</span>
                <span className="text-slate-200">{selectedRegime.recommendedUseAr}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">المادة المعيارية (NFC 15-100):</span>
                <span className="text-sky-400 font-mono text-[11px] bg-slate-950 p-2 rounded block border border-slate-800">
                  {selectedRegime.safetyStandardClause}
                </span>
              </div>
            </div>
          </div>

          {/* Earth Resistance Calculator (Ra <= Ul / Idn) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-amber-400 border-b border-slate-800 pb-2 flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              حاسبة مطابقة مقاومة الأرضي (Terre Ra)
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  حساسية القاطع التفاضلي (IΔn)
                </label>
                <select
                  value={differentialRatingMa}
                  onChange={(e) => setDifferentialRatingMa(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                >
                  <option value={500}>500 mA (قاطع التوصيل العام Disjoncteur de branchement)</option>
                  <option value={300}>300 mA (حماية المنشآت الصناعية من الحرائق)</option>
                  <option value={30}>30 mA (حماية الأشخاص ذات الحساسية العالية)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  جهد الأمان المسموح به (Tension limite conventionnelle UL)
                </label>
                <select
                  value={limitVoltageUlV}
                  onChange={(e) => setLimitVoltageUlV(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                >
                  <option value={50}>50V (الأماكن الجافة العادية)</option>
                  <option value={25}>25V (الأماكن الرطبة كالحمامات والورش والمباني الزراعية)</option>
                  <option value={12}>12V (الأماكن المغمورة بالماء)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  المقاومة المقاسة لقطب التأريض الفعلي Ra (أوم)
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={actualEarthResistanceOhm}
                  onChange={(e) => setActualEarthResistanceOhm(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Earth Sizing Result */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">الحد الأقصى المسموح (Ra max):</span>
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {maxAllowedRaOhm} Ω
                </span>
              </div>
              <div className="font-mono text-[11px] text-slate-400">
                الصيغة: Ra ≤ UL / IΔn = {limitVoltageUlV}V / {(differentialRatingMa / 1000)}A
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-slate-300 font-bold">حالة المطابقة المعيارية:</span>
                <span className={`px-2.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1 ${
                  isEarthResistanceCompliant 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {isEarthResistanceCompliant ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      مطابق للمعيار ({actualEarthResistanceOhm}Ω ≤ {maxAllowedRaOhm}Ω)
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5" />
                      غير مطابق! خطر صعق مميت
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
