import React, { useState, useMemo } from 'react';
import { 
  calculateMotorParameters, 
  calculatePowerFactorCorrection, 
  MotorCalcInput 
} from '../utils/electricalCalculations';
import { 
  Activity, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  Sliders, 
  Info,
  TrendingDown,
  Layers,
  Sparkles
} from 'lucide-react';

interface IndustrialCalculatorsProps {
  showFrenchTerms: boolean;
}

export const IndustrialCalculators: React.FC<IndustrialCalculatorsProps> = ({ showFrenchTerms }) => {
  const [activeTab, setActiveTab] = useState<'motor' | 'power_factor' | 'nameplate_checker'>('motor');

  // Motor Calculator State
  const [powerUnit, setPowerUnit] = useState<'kw' | 'hp'>('kw');
  const [powerValue, setPowerValue] = useState<number>(7.5);
  const [motorVoltageV, setMotorVoltageV] = useState<number>(400);
  const [powerFactorCosPhi, setPowerFactorCosPhi] = useState<number>(0.84);
  const [efficiencyEta, setEfficiencyEta] = useState<number>(0.89);
  const [polesCount, setPolesCount] = useState<number>(4);
  const [frequencyHz, setFrequencyHz] = useState<number>(50);

  // Power Factor Correction State
  const [plantActivePowerKw, setPlantActivePowerKw] = useState<number>(120);
  const [currentCosPhi, setCurrentCosPhi] = useState<number>(0.72);
  const [targetCosPhi, setTargetCosPhi] = useState<number>(0.96);
  const [gridVoltageV, setGridVoltageV] = useState<number>(400);

  // Nameplate Coupling Checker State
  const [plateLowV, setPlateLowV] = useState<number>(230);
  const [plateHighV, setPlateHighV] = useState<number>(400);
  const [gridPhaseVoltageV, setGridPhaseVoltageV] = useState<number>(400);

  // Motor calculation results
  const motorResults = useMemo(() => {
    const input: MotorCalcInput = {
      powerUnit,
      powerValue,
      voltageV: motorVoltageV,
      powerFactorCosPhi,
      efficiencyEta,
      polesCount,
      frequencyHz
    };
    return calculateMotorParameters(input);
  }, [powerUnit, powerValue, motorVoltageV, powerFactorCosPhi, efficiencyEta, polesCount, frequencyHz]);

  // Power factor correction results
  const pfcResults = useMemo(() => {
    return calculatePowerFactorCorrection(
      plantActivePowerKw,
      currentCosPhi,
      targetCosPhi,
      gridVoltageV,
      50
    );
  }, [plantActivePowerKw, currentCosPhi, targetCosPhi, gridVoltageV]);

  // Coupling verdict
  const couplingVerdict = useMemo(() => {
    if (gridPhaseVoltageV === plateLowV) {
      return {
        coupling: 'مثلث (Triangle Δ)',
        canStarDeltaOnThisGrid: false,
        explanation: `جهد الشبكة (${gridPhaseVoltageV}V) يطابق الجهد الأدنى على اللوحة (${plateLowV}V). كل ملف مصمم للعمل عند ${plateLowV}V، لذا يجب التوصيل بمثلث مباشرة. لا يمكن تطبيق إقلاع نجمي-مثلثي لأن الجهد بعد الانتقال سيبقى ملائماً لكن التوصيل النجمي على هذه الشبكة سيعطي جهداً ضعيفاً جداً غير كافٍ.`,
        badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      };
    } else if (gridPhaseVoltageV === plateHighV) {
      if (plateLowV === 400 && plateHighV === 690) {
        return {
          coupling: 'مثلث (Triangle Δ) لإقلاع Y-Δ',
          canStarDeltaOnThisGrid: true,
          explanation: `هذا المحرك (400V Δ / 690V Y) مصمم خصيصاً للعمل الدائم في وضع المثلث (Δ) على شبكة 400V، وهو متوافق 100% مع بادئ الإقلاع النجمي - المثلثي (Y-Δ)! سيبدأ في النجمة عند 230V لكل ملف ثم يستقر في المثلث عند 400V.`,
          badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30'
        };
      } else {
        return {
          coupling: 'نجمة (Étoile Y)',
          canStarDeltaOnThisGrid: false,
          explanation: `جهد الشبكة (${gridPhaseVoltageV}V) يطابق الجهد الأقصى على اللوحة (${plateHighV}V). يجب التوصيل بنجمة (Y) حصراً بحيث يتلقى كل ملف ${plateLowV}V = ${gridPhaseVoltageV}/√3. يحظر منعاً باتاً التوصيل بمثلث على شبكة ${gridPhaseVoltageV}V وإلا ستحترق ملفات المحرك فوراً!`,
          badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
        };
      }
    } else {
      return {
        coupling: 'غير متوافق مع جهد الشبكة',
        canStarDeltaOnThisGrid: false,
        explanation: `جهد الشبكة (${gridPhaseVoltageV}V) لا يتطابق مع أي من قيم لوحة المحرك (${plateLowV}V أو ${plateHighV}V). يتطلب محول عزل أو مغير تردد.`,
        badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
      };
    }
  }, [plateLowV, plateHighV, gridPhaseVoltageV]);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <Activity className="w-5 h-5" />
              </span>
              <h2 className="text-lg md:text-xl font-bold text-white">
                حاسبة المحركات الصناعية وتحسين معامل القدرة (cos φ)
              </h2>
              {showFrenchTerms && (
                <span className="text-xs text-slate-400 font-mono">
                  (Dimensionnement Moteur & Compensation d'Énergie Réactive)
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl">
              تحديد تيار المحرك الاسمي وتيار الإقلاع، اختيار الكونتاكتور والريليه الحراري، وحساب سعة مكثفات تحسين معامل القدرة وتفادي الغرامات.
            </p>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setActiveTab('motor')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'motor' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              حساب المحرك واختيار المكونات
            </button>
            <button
              onClick={() => setActiveTab('power_factor')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'power_factor' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              مكثفات تحسين cos φ
            </button>
            <button
              onClick={() => setActiveTab('nameplate_checker')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'nameplate_checker' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              محدد توصيل النجمة والمثلث (Y-Δ)
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: MOTOR SIZING & PROTECTION CALC */}
      {activeTab === 'motor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              بيانات المحرك الحثي (Plaque Moteur)
            </h3>

            {/* Power Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">الاستطاعة الميكانيكية المفيدة (Puissance)</label>
                <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg text-xs">
                  <button
                    onClick={() => setPowerUnit('kw')}
                    className={`px-2 py-0.5 rounded font-bold ${powerUnit === 'kw' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                  >
                    kW
                  </button>
                  <button
                    onClick={() => setPowerUnit('hp')}
                    className={`px-2 py-0.5 rounded font-bold ${powerUnit === 'hp' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                  >
                    HP (حصان)
                  </button>
                </div>
              </div>
              <input
                type="number"
                step="0.5"
                min="0.25"
                value={powerValue}
                onChange={(e) => setPowerValue(Math.max(0.1, Number(e.target.value)))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Voltage & Cos Phi */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">الجهد U (فولت)</label>
                <select
                  value={motorVoltageV}
                  onChange={(e) => setMotorVoltageV(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                >
                  <option value={400}>400V (ثلاثي أطوار)</option>
                  <option value={230}>230V (أحادي أو ثلاثي)</option>
                  <option value={690}>690V (صناعي عالي)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">معامل القدرة (cos φ)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.6"
                  max="0.98"
                  value={powerFactorCosPhi}
                  onChange={(e) => setPowerFactorCosPhi(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Efficiency & Poles */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">مردود المحرك (Rendement η)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.5"
                  max="0.98"
                  value={efficiencyEta}
                  onChange={(e) => setEfficiencyEta(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">أقطاب المحرك (Pôles)</label>
                <select
                  value={polesCount}
                  onChange={(e) => setPolesCount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                >
                  <option value={2}>قطبان (2 pôles - 3000 RPM)</option>
                  <option value={4}>4 أقطاب (4 pôles - 1500 RPM)</option>
                  <option value={6}>6 أقطاب (6 pôles - 1000 RPM)</option>
                  <option value={8}>8 أقطاب (8 pôles - 750 RPM)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sizing & Components Output */}
          <div className="lg:col-span-7 space-y-4">
            {/* Top Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-3 text-center">
                <span className="text-[10px] text-slate-400 block font-sans">التيار الاسمي In</span>
                <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">{motorResults.nominalCurrentA} A</span>
                <span className="text-[10px] text-slate-400 block font-mono">Pe = {motorResults.electricalPowerKw} kW</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
                <span className="text-[10px] text-slate-400 block font-sans">تيار الإقلاع المباشر Id</span>
                <span className="text-lg sm:text-xl font-bold text-rose-400 font-mono">{motorResults.directStartingCurrentA} A</span>
                <span className="text-[10px] text-slate-400 block font-mono">~6.5 × In</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
                <span className="text-[10px] text-slate-400 block font-sans">تيار إقلاع نجمة Y</span>
                <span className="text-lg sm:text-xl font-bold text-sky-400 font-mono">{motorResults.starDeltaStartingCurrentA} A</span>
                <span className="text-[10px] text-slate-400 block font-mono">Id / 3 (ثلث)</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
                <span className="text-[10px] text-slate-400 block font-sans">عزم الدوران المفيد</span>
                <span className="text-lg sm:text-xl font-bold text-emerald-400 font-mono">{motorResults.nominalTorqueNm} N.m</span>
                <span className="text-[10px] text-slate-400 block font-mono">{motorResults.nominalSpeedRpm} RPM</span>
              </div>
            </div>

            {/* Recommended Hardware Components Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center justify-between">
                <span>جدول اختيار واقتراح معدات التحكم والحماية الصناعية</span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                  Calibre Appareillage
                </span>
              </h4>

              <div className="space-y-2 text-xs">
                {/* Breaker */}
                <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-bold font-mono">Q1 (GV2)</span>
                    <span className="text-slate-200">قاطع المحرك المغناطيسي الحراري (Disjoncteur Moteur):</span>
                  </div>
                  <span className="font-mono font-bold text-white text-sm">
                    {motorResults.gv2BreakerRatingA} A (منحنى مغناطيسي 13 In)
                  </span>
                </div>

                {/* Contactor DOL */}
                <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold font-mono">KM1 (DOL)</span>
                    <span className="text-slate-200">كونتاكتور الإقلاع المباشر فئة AC-3:</span>
                  </div>
                  <span className="font-mono font-bold text-amber-400 text-sm">
                    {motorResults.dolContactorA} A كحد أدنى (AC-3)
                  </span>
                </div>

                {/* Contactor Star Delta */}
                <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold font-mono">KM1/2/3 (Y-Δ)</span>
                    <span className="text-slate-200">كونتاكتورات النجمي-المثلثي:</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 text-xs">
                    KM1 & KM2 = {motorResults.starDeltaLineContactorA}A | KM3 = {motorResults.starDeltaStarContactorA}A
                  </span>
                </div>

                {/* Thermal Relay */}
                <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold font-mono">F1 (Relais)</span>
                    <span className="text-slate-200">المرحل الحراري ومجال الضبط:</span>
                  </div>
                  <span className="font-mono font-bold text-rose-400 text-sm">
                    الضبط على: {motorResults.thermalRelaySettingA}A (مجال {motorResults.thermalRelayRange})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: POWER FACTOR CORRECTION */}
      {activeTab === 'power_factor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              بيانات المنشأة والشبكة الصناعية
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">القدرة الفعالة الإجمالية P (kW)</label>
              <input
                type="number"
                min="5"
                max="5000"
                value={plantActivePowerKw}
                onChange={(e) => setPlantActivePowerKw(Math.max(1, Number(e.target.value)))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">معامل القدرة الحالي (cos φ1)</label>
                <input
                  type="number"
                  step="0.02"
                  min="0.5"
                  max="0.95"
                  value={currentCosPhi}
                  onChange={(e) => setCurrentCosPhi(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
                <span className="text-[10px] text-rose-400">منخفض - غرامات مالية</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">المعامل المستهدف (cos φ2)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.9"
                  max="0.99"
                  value={targetCosPhi}
                  onChange={(e) => setTargetCosPhi(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
                <span className="text-[10px] text-emerald-400">ممتاز (بدون غرامة)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">جهد التغذية U (فولت)</label>
              <input
                type="number"
                value={gridVoltageV}
                onChange={(e) => setGridVoltageV(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* PFC Output */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-slate-900 border border-amber-500/40 rounded-xl p-3 text-center">
                <span className="text-[10px] text-slate-400 block">سعة المكثفات المطلوبة Qc</span>
                <span className="text-2xl font-black text-amber-400 font-mono">{pfcResults.requiredQcKvar}</span>
                <span className="text-xs text-slate-300 mr-1 font-mono">kVAR</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
                <span className="text-[10px] text-slate-400 block">سعة الطور بالمثلث C</span>
                <span className="text-2xl font-black text-sky-400 font-mono">{pfcResults.capacitanceMicroFaradsDelta}</span>
                <span className="text-xs text-slate-300 mr-1 font-mono">µF / phase</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
                <span className="text-[10px] text-slate-400 block">انخفاض تيار الخط الإجمالي</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">{pfcResults.currentGainPercent}%</span>
                <span className="text-[10px] text-slate-400 block font-mono">{pfcResults.currentBeforeA}A ➔ {pfcResults.currentAfterA}A</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                المكاسب الهندسية والاقتصادية للتحسين
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                  <span>
                    <strong>تخفيض تيار الكابلات والمحولات:</strong> ينخفض التيار المار في خطوط التغذية الرئيسية من 
                    <span className="text-amber-400 font-mono mx-1">{pfcResults.currentBeforeA}A</span> إلى 
                    <span className="text-emerald-400 font-mono mx-1">{pfcResults.currentAfterA}A</span>، 
                    مما يحرر قدرة إضافية في المحول ويقلل الضياع الحراري (Pertes Joule).
                  </span>
                </li>
                <li className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                  <span>
                    <strong>إلغاء غرامات شركة الكهرباء:</strong> توفير تقديري يبلغ 
                    <span className="text-emerald-400 font-mono font-bold mx-1">{pfcResults.estimatedAnnualSavingsKvarh} kVAR.h</span> سنوياً 
                    من الطاقة الارتكاسية غير المفيدة.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NAMEPLATE STAR/DELTA COUPLING VERIFIER */}
      {activeTab === 'nameplate_checker' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              محدد نوع التوصيل التلقائي (Étoile ou Triangle) حسب لوحة المحرك
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              أدخل قيم الجهد المكتوبة على لوحة المحرك وجهد الشبكة المتوفرة، وسيقوم النظام بتحديد التوصيل الإلزامي بدقة مع التحذير من الاحتراق.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">الجهد الأدنى للوحة (V)</label>
              <select
                value={plateLowV}
                onChange={(e) => setPlateLowV(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
              >
                <option value={230}>230 V (المحركات الشائعة الصغيرة)</option>
                <option value={400}>400 V (المحركات الكبيرة Y-Δ)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">الجهد الأعلى للوحة (V)</label>
              <select
                value={plateHighV}
                onChange={(e) => setPlateHighV(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
              >
                <option value={400}>400 V</option>
                <option value={690}>690 V</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">جهد الشبكة بين الأطوار (V)</label>
              <select
                value={gridPhaseVoltageV}
                onChange={(e) => setGridPhaseVoltageV(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
              >
                <option value={400}>400 V (الشبكة القياسية 3Ph)</option>
                <option value={230}>230 V (شبكة ثلاثية نادرة)</option>
              </select>
            </div>
          </div>

          {/* Verdict Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-bold">القرار الهندسي للتوصيل:</span>
              <span className={`px-3 py-1 rounded-xl text-xs font-black border ${couplingVerdict.badgeColor}`}>
                {couplingVerdict.coupling}
              </span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed bg-slate-900 p-4 rounded-xl border border-slate-800">
              {couplingVerdict.explanation}
            </p>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">هل يمكن استخدام إقلاع نجمي - مثلثي على هذه الشبكة؟</span>
              <span className={`font-bold ${couplingVerdict.canStarDeltaOnThisGrid ? 'text-emerald-400' : 'text-rose-400'}`}>
                {couplingVerdict.canStarDeltaOnThisGrid ? 'نعم، مؤهل تماماً (Compatible Y-Δ)' : 'كلا، لا يمكن إقلاعه نجمي-مثلثي على هذه الشبكة'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
