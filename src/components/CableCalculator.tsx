import React, { useState, useMemo } from 'react';
import { 
  CableCalculationInput, 
  ConductorMaterial, 
  InstallationMethod, 
  SystemPhase 
} from '../types/electrical';
import { 
  calculateCableSizing, 
  STANDARD_SECTIONS, 
  RHO_COPPER_75, 
  RHO_ALUMINUM_75,
  REACTANCE_LAMBDA
} from '../utils/electricalCalculations';
import { 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  HelpCircle, 
  Share2, 
  Download,
  Info,
  Maximize2
} from 'lucide-react';

interface CableCalculatorProps {
  showFrenchTerms: boolean;
  onSaveToReport?: (data: any) => void;
}

export const CableCalculator: React.FC<CableCalculatorProps> = ({ 
  showFrenchTerms,
  onSaveToReport
}) => {
  const [phase, setPhase] = useState<SystemPhase>('single');
  const [voltage, setVoltage] = useState<number>(230);
  const [useCurrentDirectly, setUseCurrentDirectly] = useState<boolean>(false);
  const [powerKw, setPowerKw] = useState<number>(4.5);
  const [currentA, setCurrentA] = useState<number>(20);
  const [powerFactor, setPowerFactor] = useState<number>(0.85);
  const [lengthMeters, setLengthMeters] = useState<number>(35);
  const [material, setMaterial] = useState<ConductorMaterial>('copper');
  const [installationMethod, setInstallationMethod] = useState<InstallationMethod>('conduit_masonry');
  const [ambientTempC, setAmbientTempC] = useState<number>(30);
  const [cablesGrouped, setCablesGrouped] = useState<number>(1);
  const [maxVoltageDropPercent, setMaxVoltageDropPercent] = useState<number>(3.0);
  const [savedAlert, setSavedAlert] = useState(false);

  // Auto update voltage when phase flips
  const handlePhaseChange = (newPhase: SystemPhase) => {
    setPhase(newPhase);
    if (newPhase === 'single' && voltage === 400) {
      setVoltage(230);
    } else if (newPhase === 'three' && voltage === 230) {
      setVoltage(400);
    }
  };

  const inputConfig: CableCalculationInput = {
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
  };

  const result = useMemo(() => {
    return calculateCableSizing(inputConfig);
  }, [inputConfig]);

  // Comparison matrix for other wire sections
  const sectionComparison = useMemo(() => {
    const rho = material === 'copper' ? RHO_COPPER_75 : RHO_ALUMINUM_75;
    const sinPhi = Math.sqrt(Math.max(0, 1 - Math.pow(powerFactor, 2)));
    const ib = result.designCurrentIb;

    return STANDARD_SECTIONS.filter(s => material === 'copper' || s >= 16).slice(0, 8).map(s => {
      const r = (rho * lengthMeters) / s;
      const x = REACTANCE_LAMBDA * lengthMeters;
      let dU = 0;
      if (phase === 'single') {
        dU = 2 * ib * (r * powerFactor + x * sinPhi);
      } else {
        dU = Math.sqrt(3) * ib * (r * powerFactor + x * sinPhi);
      }
      const dUPercent = (dU / voltage) * 100;
      const pLoss = (phase === 'single' ? 2 : 3) * r * Math.pow(ib, 2);
      const isOk = dUPercent <= maxVoltageDropPercent;

      return {
        section: s,
        voltageDropV: Number(dU.toFixed(2)),
        voltageDropPercent: Number(dUPercent.toFixed(2)),
        powerLossW: Number(pLoss.toFixed(1)),
        isOk,
        isChosen: s === result.standardSectionMm2
      };
    });
  }, [material, lengthMeters, powerFactor, result.designCurrentIb, phase, voltage, maxVoltageDropPercent, result.standardSectionMm2]);

  const handleSaveToReport = () => {
    if (onSaveToReport) {
      onSaveToReport({
        type: 'cable',
        title: `حساب كابل ${powerKw}kW بطول ${lengthMeters}م`,
        input: inputConfig,
        result
      });
      setSavedAlert(true);
      setTimeout(() => setSavedAlert(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <Zap className="w-5 h-5" />
              </span>
              <h2 className="text-lg md:text-xl font-bold text-white">
                حاسبة مقاطع الكابلات وهبوط الجهد المعيارية
              </h2>
              {showFrenchTerms && (
                <span className="text-xs text-slate-400 font-mono">
                  (Dimensionnement des Câbles & Chute de Tension - NFC 15-100 / IEC 60364)
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl">
              تحديد المقطع الأدنى للنواقل وفقاً لمعياري التحمل الحراري لتيار الاستعمال (Iz ≥ Ib / K) وهبوط الجهد الأقصى المسموح به (ΔU max)، واقتراح القاطع وقطر أنبوب التمرير المناسب.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveToReport}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              حفظ النتيجة للتقرير
            </button>
          </div>
        </div>

        {savedAlert && (
          <div className="mt-3 py-1.5 px-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            تم حفظ نتائج الحساب بنجاح في تقرير المشروع الفني!
          </div>
        )}
      </div>

      {/* Main Grid: Inputs (Left) and Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUTS COLUMN */}
        <div className="lg:col-span-6 space-y-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              معطيات الدارة والشبكة
              {showFrenchTerms && <span className="text-xs font-mono text-slate-400">(Paramètres du Circuit)</span>}
            </h3>
            <span className="text-xs text-amber-400 font-mono bg-amber-400/10 px-2 py-0.5 rounded">
              NFC 15-100 §525
            </span>
          </div>

          {/* Phase & Voltage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                نظام التغذية الكهربائية
                {showFrenchTerms && <span className="text-[11px] text-slate-400 font-mono"> (Phase)</span>}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handlePhaseChange('single')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    phase === 'single'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                  }`}
                >
                  أحادي الطور (Monophasé)
                </button>
                <button
                  type="button"
                  onClick={() => handlePhaseChange('three')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    phase === 'three'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                  }`}
                >
                  ثلاثي الطور (Triphasé)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                الجهد الاسمي U (فولت)
                {showFrenchTerms && <span className="text-[11px] text-slate-400 font-mono"> (Tension)</span>}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={voltage}
                  onChange={(e) => setVoltage(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                />
                <span className="absolute left-3 top-2 text-xs text-slate-400 font-mono">V</span>
              </div>
            </div>
          </div>

          {/* Load input mode toggle */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                طريقة إدخال الحمل
              </label>
              <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => setUseCurrentDirectly(false)}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    !useCurrentDirectly ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  الاستطاعة بالـ kW
                </button>
                <button
                  type="button"
                  onClick={() => setUseCurrentDirectly(true)}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    useCurrentDirectly ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  التيار مباشرة بالـ A
                </button>
              </div>
            </div>

            {!useCurrentDirectly ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    القدرة الفعالة P
                    {showFrenchTerms && <span className="text-[11px] text-slate-400 font-mono"> (Puissance)</span>}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={powerKw}
                      onChange={(e) => setPowerKw(Math.max(0.01, Number(e.target.value)))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                    />
                    <span className="absolute left-3 top-2 text-xs text-slate-400 font-mono">kW</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    معامل القدرة (cos φ)
                    {showFrenchTerms && <span className="text-[11px] text-slate-400 font-mono"> (Facteur de puissance)</span>}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0.5"
                      max="1.0"
                      step="0.05"
                      value={powerFactor}
                      onChange={(e) => setPowerFactor(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <span className="w-12 text-center text-xs font-mono font-bold text-amber-400 bg-slate-800 py-1.5 rounded-lg border border-slate-700">
                      {powerFactor}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  شدة التيار الاسمي للحمل (Ib)
                  {showFrenchTerms && <span className="text-[11px] text-slate-400 font-mono"> (Courant assigné)</span>}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={currentA}
                    onChange={(e) => setCurrentA(Math.max(0.1, Number(e.target.value)))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                  <span className="absolute left-3 top-2 text-xs text-slate-400 font-mono">Ampères</span>
                </div>
              </div>
            )}
          </div>

          {/* Cable Length & Material */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                طول الكابل L (متر)
                {showFrenchTerms && <span className="text-[11px] text-slate-400 font-mono"> (Longueur)</span>}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={lengthMeters}
                  onChange={(e) => setLengthMeters(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                />
                <span className="absolute left-3 top-2 text-xs text-slate-400 font-mono">m</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                معدن الناقل (Conducteur)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMaterial('copper')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    material === 'copper'
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  النحاس (Cuivre)
                </button>
                <button
                  type="button"
                  onClick={() => setMaterial('aluminum')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    material === 'aluminum'
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  الألومنيوم (Alu ≥16mm²)
                </button>
              </div>
            </div>
          </div>

          {/* Installation Method */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              طريقة التثبيت والتمديد
              {showFrenchTerms && <span className="text-[11px] text-slate-400 font-mono"> (Mode de pose - IEC 60364-5-52)</span>}
            </label>
            <select
              value={installationMethod}
              onChange={(e) => setInstallationMethod(e.target.value as InstallationMethod)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="conduit_insulated_wall">طريقة A: داخل أنبوب في جدار عازل للحرارة (Worst thermal)</option>
              <option value="conduit_masonry">طريقة B: داخل أنبوب مدفون في الخرسانة/البناء (Encastré maçonnerie)</option>
              <option value="surface_conduit">طريقة B2: أنبوب أو مجرى سطحي بارز على الجدار (Sous conduit apparent)</option>
              <option value="cable_tray_perforated">طريقة E: على حامل كابلات مثقب (Chemin de câbles perforé)</option>
              <option value="cable_ladder">طريقة F: على سلم كابلات هوائي (Échelle à câbles)</option>
              <option value="buried_in_ground">طريقة D: كابل مدفون في الأرض مع أنبوب حماية (Enterré sous conduit)</option>
            </select>
          </div>

          {/* Environmental factors & tolerance */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                درجة الحرارة المحيطة (°C)
              </label>
              <input
                type="number"
                min="10"
                max="55"
                value={ambientTempC}
                onChange={(e) => setAmbientTempC(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                تجميع الكابلات المتجاورة
              </label>
              <input
                type="number"
                min="1"
                max="9"
                value={cablesGrouped}
                onChange={(e) => setCablesGrouped(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                هبوط الجهد المسموح ΔU%
              </label>
              <select
                value={maxVoltageDropPercent}
                onChange={(e) => setMaxVoltageDropPercent(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value={3.0}>3% (إنارة NFC 15-100)</option>
                <option value={5.0}>5% (محركات وقوى)</option>
                <option value={8.0}>8% (خطوط خاصة/طويلة)</option>
              </select>
            </div>
          </div>
        </div>

        {/* RESULTS & CALCULATIONS COLUMN */}
        <div className="lg:col-span-6 space-y-5">
          {/* Main Sizing Highlight Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/80 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                نتيجة الحساب الهندسي المعتمدة
              </span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                مطابق لمعيار NFC 15-100
              </span>
            </div>

            {/* Core Section Hero */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-5">
              <div className="bg-slate-800/80 border border-amber-500/40 rounded-xl p-3 shadow-inner">
                <p className="text-[11px] text-slate-400 mb-1">المقطع القياسي الأدنى</p>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                  {result.standardSectionMm2}
                  <span className="text-xs text-slate-300 mr-1">مم²</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">
                  {material === 'copper' ? 'Cuivre' : 'Aluminium'}
                </p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3">
                <p className="text-[11px] text-slate-400 mb-1">تيار التشغيل (Ib)</p>
                <div className="text-xl sm:text-2xl font-black text-white font-mono">
                  {result.designCurrentIb}
                  <span className="text-xs text-slate-400 mr-1">A</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">
                  Iz = {result.admissibleCurrentIz}A
                </p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3">
                <p className="text-[11px] text-slate-400 mb-1">هبوط الجهد الفعلي</p>
                <div className={`text-xl sm:text-2xl font-black font-mono ${
                  result.actualVoltageDropPercent <= maxVoltageDropPercent ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {result.actualVoltageDropPercent}%
                </div>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">
                  {result.actualVoltageDropV} V
                </p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3">
                <p className="text-[11px] text-slate-400 mb-1">القاطع المقترح (In)</p>
                <div className="text-xl sm:text-2xl font-black text-sky-400 font-mono">
                  {result.recommendedBreakerA}A
                </div>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">
                  منحنى {result.breakerCurve} (Courbe)
                </p>
              </div>
            </div>

            {/* Quick Tech Specs Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-slate-300 bg-slate-900/90 rounded-xl p-3 border border-slate-800">
              <div>
                <span className="text-slate-400 block text-[11px]">أنبوب التمرير (Gaine ICTA):</span>
                <span className="font-mono font-bold text-amber-300">Ø {result.minConduitDiameterIctaMm} مم</span>
                <span className="text-[10px] text-slate-400 mr-1">(قاعدة الثلث 1/3)</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">معامل التصحيح البيئي K:</span>
                <span className="font-mono font-bold text-slate-200">{result.kTotalFactor}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">الضياع الحراري (Pertes Joule):</span>
                <span className="font-mono font-bold text-rose-300">{result.powerLossWatts} W</span>
              </div>
            </div>
          </div>

          {/* Section Comparison Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md overflow-hidden">
            <h4 className="text-xs font-bold text-slate-200 mb-2 flex items-center justify-between">
              <span>مقارنة المقاطع القياسية لنفس الدارة ({lengthMeters}م)</span>
              <span className="text-[10px] font-mono text-slate-400">ΔU max = {maxVoltageDropPercent}%</span>
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2 px-2.5 font-semibold">المقطع (mm²)</th>
                    <th className="py-2 px-2.5 font-semibold">هبوط الجهد (V)</th>
                    <th className="py-2 px-2.5 font-semibold">نسبة الهبوط (ΔU%)</th>
                    <th className="py-2 px-2.5 font-semibold">ضياع القدرة (W)</th>
                    <th className="py-2 px-2.5 font-semibold">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {sectionComparison.map((row) => (
                    <tr 
                      key={row.section}
                      className={`${
                        row.isChosen 
                          ? 'bg-amber-500/15 text-amber-300 font-bold' 
                          : 'text-slate-300 hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-2 px-2.5 flex items-center gap-1.5">
                        {row.section} مم²
                        {row.isChosen && (
                          <span className="text-[9px] bg-amber-400 text-slate-950 px-1 rounded font-sans font-extrabold">
                            المختار
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-2.5">{row.voltageDropV} V</td>
                      <td className="py-2 px-2.5">
                        <span className={row.isOk ? 'text-emerald-400' : 'text-rose-400'}>
                          {row.voltageDropPercent}%
                        </span>
                      </td>
                      <td className="py-2 px-2.5">{row.powerLossW} W</td>
                      <td className="py-2 px-2.5 font-sans">
                        {row.isOk ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" /> مطابق
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-rose-400">
                            <AlertTriangle className="w-3 h-3" /> تجاوز للحد
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Educational Step-by-Step Breakdown for Students */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
            <h4 className="text-xs font-bold text-amber-400 mb-3 flex items-center gap-2">
              <Info className="w-4 h-4" />
              خطوات الحل والمعادلات الفيزيائية للطلاب والمهندسين
              {showFrenchTerms && <span className="text-[10px] font-mono text-slate-400">(Démonstration Mathématique)</span>}
            </h4>

            <div className="space-y-2.5">
              {result.formulasUsed.map((step, idx) => (
                <div key={idx} className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs">
                  <div className="font-bold text-slate-200 mb-1">{step.title}</div>
                  <div className="font-mono text-sky-400 text-[11px] mb-1">{step.formula}</div>
                  <div className="font-mono text-slate-400 text-[10px] mb-1">{step.substitution}</div>
                  <div className="font-mono text-emerald-400 font-bold text-[11px]">{step.result}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
