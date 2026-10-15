import React, { useState, useMemo } from 'react';
import { ELECTRICAL_FORMULAS, RESISTOR_COLOR_CODES } from '../data/formulasData';
import { 
  BookOpen, 
  Calculator, 
  HelpCircle, 
  Info, 
  CheckCircle2, 
  Layers,
  Sparkles
} from 'lucide-react';

interface FormulasAndTablesProps {
  showFrenchTerms: boolean;
}

export const FormulasAndTables: React.FC<FormulasAndTablesProps> = ({ showFrenchTerms }) => {
  const [subTab, setSubTab] = useState<'formulas' | 'ohms_wheel' | 'resistors' | 'conduit_filling'>('ohms_wheel');

  // Interactive Ohm's Law Solver State
  const [knownVar1, setKnownVar1] = useState<'V' | 'I' | 'R' | 'P'>('V');
  const [knownVar2, setKnownVar2] = useState<'V' | 'I' | 'R' | 'P'>('R');
  const [val1, setVal1] = useState<number>(230);
  const [val2, setVal2] = useState<number>(23);

  // Resistor Color Code Calculator State
  const [band1, setBand1] = useState<number>(2); // Red (2)
  const [band2, setBand2] = useState<number>(7); // Violet (7)
  const [bandMultiplier, setBandMultiplier] = useState<number>(100); // Red (*100) -> 2.7k
  const [bandTolerance, setBandTolerance] = useState<string>('±5%'); // Gold

  // Conduit Filling Rule State
  const [conduitOuterMm, setConduitOuterMm] = useState<number>(20); // ICTA 20
  const [wires15Count, setWires15Count] = useState<number>(3);
  const [wires25Count, setWires25Count] = useState<number>(3);
  const [wires6Count, setWires6Count] = useState<number>(0);

  // Solve Ohm's Law
  const ohmSolution = useMemo(() => {
    let V = 0, I = 0, R = 0, P = 0;

    if ((knownVar1 === 'V' && knownVar2 === 'I') || (knownVar1 === 'I' && knownVar2 === 'V')) {
      V = knownVar1 === 'V' ? val1 : val2;
      I = knownVar1 === 'I' ? val1 : val2;
      R = I !== 0 ? V / I : 0;
      P = V * I;
    } else if ((knownVar1 === 'V' && knownVar2 === 'R') || (knownVar1 === 'R' && knownVar2 === 'V')) {
      V = knownVar1 === 'V' ? val1 : val2;
      R = knownVar1 === 'R' ? val1 : val2;
      I = R !== 0 ? V / R : 0;
      P = R !== 0 ? Math.pow(V, 2) / R : 0;
    } else if ((knownVar1 === 'V' && knownVar2 === 'P') || (knownVar1 === 'P' && knownVar2 === 'V')) {
      V = knownVar1 === 'V' ? val1 : val2;
      P = knownVar1 === 'P' ? val1 : val2;
      I = V !== 0 ? P / V : 0;
      R = P !== 0 ? Math.pow(V, 2) / P : 0;
    } else if ((knownVar1 === 'I' && knownVar2 === 'R') || (knownVar1 === 'R' && knownVar2 === 'I')) {
      I = knownVar1 === 'I' ? val1 : val2;
      R = knownVar1 === 'R' ? val1 : val2;
      V = R * I;
      P = R * Math.pow(I, 2);
    } else if ((knownVar1 === 'I' && knownVar2 === 'P') || (knownVar1 === 'P' && knownVar2 === 'I')) {
      I = knownVar1 === 'I' ? val1 : val2;
      P = knownVar1 === 'P' ? val1 : val2;
      V = I !== 0 ? P / I : 0;
      R = I !== 0 ? P / Math.pow(I, 2) : 0;
    } else if ((knownVar1 === 'R' && knownVar2 === 'P') || (knownVar1 === 'P' && knownVar2 === 'R')) {
      R = knownVar1 === 'R' ? val1 : val2;
      P = knownVar1 === 'P' ? val1 : val2;
      V = Math.sqrt(P * R);
      I = R !== 0 ? Math.sqrt(P / R) : 0;
    }

    return {
      V: Number(V.toFixed(2)),
      I: Number(I.toFixed(2)),
      R: Number(R.toFixed(2)),
      P: Number(P.toFixed(2))
    };
  }, [knownVar1, knownVar2, val1, val2]);

  // Calculate Resistor Value
  const calculatedResistor = useMemo(() => {
    const rawOhms = (band1 * 10 + band2) * bandMultiplier;
    let formatted = `${rawOhms} Ω`;
    if (rawOhms >= 1000000) {
      formatted = `${(rawOhms / 1000000).toFixed(2)} MΩ`;
    } else if (rawOhms >= 1000) {
      formatted = `${(rawOhms / 1000).toFixed(2)} kΩ`;
    }
    return {
      rawOhms,
      formatted,
      tolerance: bandTolerance
    };
  }, [band1, band2, bandMultiplier, bandTolerance]);

  // Calculate Conduit Filling (Règle du tiers 1/3)
  const conduitCalc = useMemo(() => {
    // Inner diameter approximate: ICTA 16 -> 10.7mm, 20 -> 14.1mm, 25 -> 18.2mm, 32 -> 24.2mm
    const innerDiameterMap: Record<number, number> = {
      16: 10.7,
      20: 14.1,
      25: 18.2,
      32: 24.2,
      40: 31.2
    };
    const innerD = innerDiameterMap[conduitOuterMm] || conduitOuterMm * 0.7;
    const innerArea = Math.PI * Math.pow(innerD / 2, 2);
    const usableAreaOneThird = innerArea / 3;

    // Cross section of insulated wires (outer including insulation):
    // 1.5mm² outer D ~ 3.0mm -> area ~ 7.1 mm²
    // 2.5mm² outer D ~ 3.6mm -> area ~ 10.2 mm²
    // 6.0mm² outer D ~ 5.0mm -> area ~ 19.6 mm²
    const totalWiresArea = 
      wires15Count * (Math.PI * Math.pow(3.0 / 2, 2)) +
      wires25Count * (Math.PI * Math.pow(3.6 / 2, 2)) +
      wires6Count * (Math.PI * Math.pow(5.0 / 2, 2));

    const fillRatioPercent = (totalWiresArea / innerArea) * 100;
    const isCompliant = totalWiresArea <= usableAreaOneThird;

    return {
      innerD: Number(innerD.toFixed(1)),
      innerArea: Number(innerArea.toFixed(1)),
      usableAreaOneThird: Number(usableAreaOneThird.toFixed(1)),
      totalWiresArea: Number(totalWiresArea.toFixed(1)),
      fillRatioPercent: Number(fillRatioPercent.toFixed(1)),
      isCompliant
    };
  }, [conduitOuterMm, wires15Count, wires25Count, wires6Count]);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <BookOpen className="w-5 h-5" />
              </span>
              <h2 className="text-lg md:text-xl font-bold text-white">
                دليل القوانين الكهربائية، حاسبة أوم، وجداول الألوان
              </h2>
              {showFrenchTerms && (
                <span className="text-xs text-slate-400 font-mono">
                  (Formulaire Électrique, Roue d'Ohm & Code des Résistances)
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl">
              حاسبة تفاعلية لحل قانون أوم والقدرة (V, I, R, P)، فك شفرة ألوان المقاومات، قاعدة ثلث ملء الأنابيب (Règle du tiers ICTA)، ومكتبة المعادلات المعتمدة.
            </p>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setSubTab('ohms_wheel')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                subTab === 'ohms_wheel' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              حاسبة قانون أوم (Roue d'Ohm)
            </button>
            <button
              onClick={() => setSubTab('resistors')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                subTab === 'resistors' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              شفرة ألوان المقاومات
            </button>
            <button
              onClick={() => setSubTab('conduit_filling')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                subTab === 'conduit_filling' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              سعة الأنابيب (قاعدة 1/3)
            </button>
            <button
              onClick={() => setSubTab('formulas')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                subTab === 'formulas' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              مرجع القوانين والمعادلات
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: OHM'S WHEEL INTERACTIVE SOLVER */}
      {subTab === 'ohms_wheel' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-amber-400" />
              أدخل قيمتين لحساب القيمتين المتبقيتين
            </h3>

            {/* Variable 1 */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">المتغير الأول المعلوم</label>
              <div className="grid grid-cols-4 gap-1.5 mb-2">
                {(['V', 'I', 'R', 'P'] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => {
                      if (k !== knownVar2) setKnownVar1(k);
                    }}
                    className={`py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      knownVar1 === k ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {k === 'V' ? 'الجهد (V)' : k === 'I' ? 'التيار (I)' : k === 'R' ? 'المقاومة (R)' : 'القدرة (P)'}
                  </button>
                ))}
              </div>
              <input
                type="number"
                step="0.1"
                value={val1}
                onChange={(e) => setVal1(Math.max(0.001, Number(e.target.value)))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Variable 2 */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">المتغير الثاني المعلوم</label>
              <div className="grid grid-cols-4 gap-1.5 mb-2">
                {(['V', 'I', 'R', 'P'] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => {
                      if (k !== knownVar1) setKnownVar2(k);
                    }}
                    className={`py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      knownVar2 === k ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {k === 'V' ? 'الجهد (V)' : k === 'I' ? 'التيار (I)' : k === 'R' ? 'المقاومة (R)' : 'القدرة (P)'}
                  </button>
                ))}
              </div>
              <input
                type="number"
                step="0.1"
                value={val2}
                onChange={(e) => setVal2(Math.max(0.001, Number(e.target.value)))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Ohm's Law Results Display */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>نتائج الحساب الأومي والقدرة</span>
              <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                Roue d'Ohm
              </span>
            </h3>

            <div className="grid grid-cols-2 gap-4 text-center font-mono">
              {/* Voltage */}
              <div className="bg-slate-950 border border-amber-500/40 rounded-xl p-4">
                <span className="text-xs text-slate-400 font-sans block mb-1">الجهد الكهربائي (U / V)</span>
                <span className="text-3xl font-black text-amber-400">{ohmSolution.V}</span>
                <span className="text-xs text-slate-300 mr-1 font-sans">فولت (Volts)</span>
              </div>

              {/* Current */}
              <div className="bg-slate-950 border border-sky-500/40 rounded-xl p-4">
                <span className="text-xs text-slate-400 font-sans block mb-1">شدة التيار (I)</span>
                <span className="text-3xl font-black text-sky-400">{ohmSolution.I}</span>
                <span className="text-xs text-slate-300 mr-1 font-sans">أمبير (Ampères)</span>
              </div>

              {/* Resistance */}
              <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-4">
                <span className="text-xs text-slate-400 font-sans block mb-1">المقاومة (R)</span>
                <span className="text-3xl font-black text-emerald-400">{ohmSolution.R}</span>
                <span className="text-xs text-slate-300 mr-1 font-sans">أوم (Ω)</span>
              </div>

              {/* Power */}
              <div className="bg-slate-950 border border-rose-500/40 rounded-xl p-4">
                <span className="text-xs text-slate-400 font-sans block mb-1">القدرة الفعالة (P)</span>
                <span className="text-3xl font-black text-rose-400">{ohmSolution.P}</span>
                <span className="text-xs text-slate-300 mr-1 font-sans">واط (Watts)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RESISTOR COLOR CODE CALCULATOR */}
      {subTab === 'resistors' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              حاسبة كود ألوان المقاومات الكهربائية (Code des Couleurs des Résistances)
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              اختر ألوان الحلقات لقراءة قيمة المقاومة الأومية ونسبة التفاوت (Tolérance) فوراً.
            </p>
          </div>

          {/* Interactive Resistor Visual Graphic */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center">
            <div className="relative w-80 h-20 bg-[#d8b589] rounded-2xl border-4 border-slate-700 shadow-2xl flex items-center justify-around px-8">
              {/* Left Lead wire */}
              <div className="absolute -left-10 w-10 h-2 bg-slate-400"></div>

              {/* Band 1 */}
              <div
                className="w-5 h-full rounded shadow"
                style={{ backgroundColor: RESISTOR_COLOR_CODES.find(c => c.digit === band1)?.colorHex || '#EF4444' }}
                title={`الحلقة 1: ${band1}`}
              ></div>

              {/* Band 2 */}
              <div
                className="w-5 h-full rounded shadow"
                style={{ backgroundColor: RESISTOR_COLOR_CODES.find(c => c.digit === band2)?.colorHex || '#A855F7' }}
                title={`الحلقة 2: ${band2}`}
              ></div>

              {/* Multiplier Band */}
              <div
                className="w-5 h-full rounded shadow"
                style={{ backgroundColor: RESISTOR_COLOR_CODES.find(c => c.multiplier === bandMultiplier)?.colorHex || '#EF4444' }}
                title={`المعامل: ×${bandMultiplier}`}
              ></div>

              {/* Tolerance Band */}
              <div
                className="w-5 h-full rounded shadow ml-6"
                style={{ backgroundColor: bandTolerance === '±5%' ? '#D4AF37' : '#C0C0C0' }}
                title={`التفاوت: ${bandTolerance}`}
              ></div>

              {/* Right Lead wire */}
              <div className="absolute -right-10 w-10 h-2 bg-slate-400"></div>
            </div>

            {/* Readout Value */}
            <div className="mt-5 text-center">
              <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                {calculatedResistor.formatted}
              </span>
              <span className="text-xs text-slate-400 font-mono mr-2">
                (دقة {calculatedResistor.tolerance})
              </span>
            </div>
          </div>

          {/* Color Selection Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            {/* Band 1 Picker */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="font-bold text-slate-200 block mb-2">الحلقة الأولى (الرقم 1):</span>
              <div className="space-y-1">
                {RESISTOR_COLOR_CODES.filter(c => c.digit !== null && c.digit > 0).map(c => (
                  <button
                    key={c.digit}
                    onClick={() => setBand1(c.digit!)}
                    className={`w-full py-1 px-2 rounded flex items-center justify-between text-[11px] ${
                      band1 === c.digit ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{c.color}</span>
                    <span className="font-mono">{c.digit}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Band 2 Picker */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="font-bold text-slate-200 block mb-2">الحلقة الثانية (الرقم 2):</span>
              <div className="space-y-1">
                {RESISTOR_COLOR_CODES.filter(c => c.digit !== null).map(c => (
                  <button
                    key={c.digit}
                    onClick={() => setBand2(c.digit!)}
                    className={`w-full py-1 px-2 rounded flex items-center justify-between text-[11px] ${
                      band2 === c.digit ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{c.color}</span>
                    <span className="font-mono">{c.digit}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Multiplier Picker */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="font-bold text-slate-200 block mb-2">معامل الضرب (Multiplicateur):</span>
              <div className="space-y-1">
                {RESISTOR_COLOR_CODES.filter(c => c.multiplier !== null && c.multiplier <= 1000000).map(c => (
                  <button
                    key={c.color}
                    onClick={() => setBandMultiplier(c.multiplier!)}
                    className={`w-full py-1 px-2 rounded flex items-center justify-between text-[11px] ${
                      bandMultiplier === c.multiplier ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{c.color}</span>
                    <span className="font-mono">×{c.multiplier}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tolerance Picker */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="font-bold text-slate-200 block mb-2">نسبة التفاوت (Tolérance):</span>
              <div className="space-y-1">
                <button
                  onClick={() => setBandTolerance('±5%')}
                  className={`w-full py-2 px-2 rounded flex items-center justify-between text-[11px] ${
                    bandTolerance === '±5%' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>ذهبي (Or)</span>
                  <span className="font-mono">±5%</span>
                </button>
                <button
                  onClick={() => setBandTolerance('±10%')}
                  className={`w-full py-2 px-2 rounded flex items-center justify-between text-[11px] ${
                    bandTolerance === '±10%' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>فضي (Argent)</span>
                  <span className="font-mono">±10%</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONDUIT FILLING RULE (RÈGLE DU TIERS 1/3) */}
      {subTab === 'conduit_filling' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              قاعدة الثلث (Règle du tiers 1/3) لسحب الأسلاك في أنابيب ICTA
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              حسب معيار NFC 15-100، لا يجوز أن يتجاوز مجموع المقاطع الخارجية للأسلاك المعزولة (بما فيها العازل) ثلث (1/3) المقطع الداخلي للأنبوب لضمان سهولة السحب وتبديد الحرارة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">قطر أنبوب التمرير (Gaine ICTA Ø)</label>
                <select
                  value={conduitOuterMm}
                  onChange={(e) => setConduitOuterMm(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                >
                  <option value={16}>ICTA Ø 16 مم (داخلي ~10.7 مم)</option>
                  <option value={20}>ICTA Ø 20 مم (داخلي ~14.1 مم)</option>
                  <option value={25}>ICTA Ø 25 مم (داخلي ~18.2 مم)</option>
                  <option value={32}>ICTA Ø 32 مم (داخلي ~24.2 مم)</option>
                </select>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-300 block">عدد الأسلاك المراد تمريرها:</span>
                
                <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
                  <span>سلك 1.5 مم² (إنارة / تحكم):</span>
                  <input
                    type="number"
                    min="0"
                    max="15"
                    value={wires15Count}
                    onChange={(e) => setWires15Count(Number(e.target.value))}
                    className="w-16 bg-slate-800 border border-slate-700 rounded-lg text-center font-mono py-1 text-white"
                  />
                </div>

                <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
                  <span>سلك 2.5 مم² (مآخذ / أجهزة):</span>
                  <input
                    type="number"
                    min="0"
                    max="12"
                    value={wires25Count}
                    onChange={(e) => setWires25Count(Number(e.target.value))}
                    className="w-16 bg-slate-800 border border-slate-700 rounded-lg text-center font-mono py-1 text-white"
                  />
                </div>

                <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
                  <span>سلك 6.0 مم² (طهي / تغذية):</span>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={wires6Count}
                    onChange={(e) => setWires6Count(Number(e.target.value))}
                    className="w-16 bg-slate-800 border border-slate-700 rounded-lg text-center font-mono py-1 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Filling Gauge Result */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <span className="text-xs font-bold text-slate-300">نسبة الامتلاء الحالية:</span>
                  <span className={`font-mono text-sm font-black ${conduitCalc.isCompliant ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {conduitCalc.fillRatioPercent}% (المسموح ≤ 33.3%)
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden mb-4">
                  <div
                    className={`h-full transition-all ${conduitCalc.isCompliant ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    style={{ width: `${Math.min(100, conduitCalc.fillRatioPercent * 3)}%` }}
                  />
                </div>

                <div className="space-y-1.5 text-xs font-mono text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">المساحة الداخلية للأنبوب:</span>
                    <span>{conduitCalc.innerArea} مم²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">مساحة الثلث المسموح بها (1/3):</span>
                    <span className="text-amber-400 font-bold">{conduitCalc.usableAreaOneThird} مم²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">مساحة الأسلاك الإجمالية:</span>
                    <span className={conduitCalc.isCompliant ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                      {conduitCalc.totalWiresArea} مم²
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800">
                <span className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 ${
                  conduitCalc.isCompliant 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {conduitCalc.isCompliant ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      مطابق لقاعدة 1/3 - السحب سلس وآمن
                    </>
                  ) : (
                    <>
                      أنبوب ضيق جداً! اختر قطراً أكبر (مثلاً Ø 25 أو 32 مم)
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GENERAL ELECTRICAL FORMULAS */}
      {subTab === 'formulas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ELECTRICAL_FORMULAS.map((formula, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-xs font-extrabold text-white">{formula.titleAr}</h4>
                {showFrenchTerms && <span className="text-[10px] text-slate-400 font-mono">{formula.titleFr}</span>}
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs font-bold text-amber-400 text-center">
                {formula.latexOrFormula}
              </div>

              <div className="space-y-1 text-[11px] text-slate-300">
                {formula.variables.map((v, i) => (
                  <div key={i} className="flex items-center justify-between font-mono">
                    <span className="text-sky-400 font-bold">{v.symbol}:</span>
                    <span className="font-sans text-slate-300">{v.nameAr} ({v.unit})</span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 text-[11px] text-slate-400">
                <strong className="text-amber-400 font-sans">تطبيق عملي: </strong>
                {formula.applicationTipAr}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
