import React, { useState } from 'react';
import { COMMON_CIRCUITS, CircuitDiagram } from '../data/circuitDiagramsData';
import { 
  Layers, 
  Zap, 
  Sliders, 
  Wrench, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  HelpCircle,
  Play,
  RotateCcw
} from 'lucide-react';

interface CircuitsLibraryProps {
  showFrenchTerms: boolean;
}

export const CircuitsLibrary: React.FC<CircuitsLibraryProps> = ({ showFrenchTerms }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'architectural' | 'industrial'>('all');
  const [selectedCircuitId, setSelectedCircuitId] = useState<string>('va_et_vient');
  
  // Interactive Simulation State
  const [isSwitchActive, setIsSwitchActive] = useState<boolean>(false);
  const [isSecondSwitchActive, setIsSecondSwitchActive] = useState<boolean>(false);

  const filteredCircuits = COMMON_CIRCUITS.filter(
    c => selectedCategory === 'all' || c.category === selectedCategory
  );

  const currentCircuit = COMMON_CIRCUITS.find(c => c.id === selectedCircuitId) || COMMON_CIRCUITS[0];

  const handleSelectCircuit = (id: string) => {
    setSelectedCircuitId(id);
    setIsSwitchActive(false);
    setIsSecondSwitchActive(false);
  };

  // Logic for light/load state in simple/two-way circuits
  const isLoadPowered = () => {
    if (currentCircuit.id === 'simple_allumage') {
      return isSwitchActive;
    }
    if (currentCircuit.id === 'va_et_vient') {
      // Two-way switch: on when both switches in same state (XNOR)
      return isSwitchActive === isSecondSwitchActive;
    }
    if (currentCircuit.id === 'telerupteur' || currentCircuit.id === 'minuterie') {
      return isSwitchActive;
    }
    if (currentCircuit.category === 'industrial') {
      return isSwitchActive;
    }
    return isSwitchActive;
  };

  const loadActive = isLoadPowered();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <Layers className="w-5 h-5" />
              </span>
              <h2 className="text-lg md:text-xl font-bold text-white">
                مخططات الدوائر الكهربائية المعمارية والصناعية الشائعة
              </h2>
              {showFrenchTerms && (
                <span className="text-xs text-slate-400 font-mono">
                  (Schémas des Circuits Électriques Standards & Guides de Dépannage)
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl">
              مخططات تفاعلية واضحة للدوائر السكنية والصناعية (إنارة بسيطة، ذهاب وإياب، تيليروبتير، مؤقت الدرج، إقلاع المحركات، ومضخات المياه) مع دليل تشخيص الأعطال الخاص بكل دارة.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              الكل (Tous)
            </button>
            <button
              onClick={() => setSelectedCategory('architectural')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'architectural'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              الكهرباء المعمارية (Bâtiment)
            </button>
            <button
              onClick={() => setSelectedCategory('industrial')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'industrial'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              الكهرباء الصناعية (Industriel)
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Circuits Selector (Left) + Interactive Schematic & Guide (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Circuit Selector Cards */}
        <div className="lg:col-span-4 space-y-2.5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            اختر المخطط الكهربائي:
          </h3>

          <div className="space-y-2">
            {filteredCircuits.map((circuit) => {
              const isSelected = circuit.id === selectedCircuitId;
              return (
                <div
                  key={circuit.id}
                  onClick={() => handleSelectCircuit(circuit.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 shadow-md shadow-amber-500/10'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      circuit.category === 'architectural' ? 'bg-sky-500/20 text-sky-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {circuit.category === 'architectural' ? 'معماري سكني' : 'صناعي ومحركات'}
                    </span>
                    <span className="text-slate-400">{circuit.standardProtection.split(' ')[0]}</span>
                  </div>

                  <h4 className={`text-xs font-bold ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                    {circuit.titleAr}
                  </h4>
                  {showFrenchTerms && (
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5 line-clamp-1">
                      {circuit.titleFr}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Diagram + Detailed Engineering Guide */}
        <div className="lg:col-span-8 space-y-5">
          {/* Main Card with Interactive Schematic */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded">
                  {currentCircuit.category === 'architectural' ? 'Architecture & Bâtiment' : 'Électromécanique & Industrie'}
                </span>
                <h3 className="text-base sm:text-lg font-black text-white mt-1">
                  {currentCircuit.titleAr}
                </h3>
                <div className="text-xs text-slate-400 font-mono">
                  {currentCircuit.titleFr}
                </div>
              </div>

              {/* Standard Quick Spec Badges */}
              <div className="flex items-center gap-2 text-xs">
                <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-center font-mono">
                  <span className="text-[10px] text-slate-400 block font-sans">القاطع القياسي</span>
                  <span className="font-bold text-sky-400">{currentCircuit.standardProtection}</span>
                </div>
                <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-center font-mono">
                  <span className="text-[10px] text-slate-400 block font-sans">مقطع السلك</span>
                  <span className="font-bold text-amber-400">{currentCircuit.standardCableSection}</span>
                </div>
              </div>
            </div>

            {/* INTERACTIVE SCHEMATIC CANVAS */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 blueprint-grid relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-4 border-b border-slate-800/80 pb-2">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  مخطط التوصيل التفاعلي الحي (انقر على المفاتيح لتجربة مسار التيار):
                </span>
                <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                  loadActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse' : 'bg-slate-800 text-slate-400'
                }`}>
                  {loadActive ? '⚡ الحمل يعمل (Alimenté)' : '○ متوقف (Hors tension)'}
                </span>
              </div>

              {/* SVG Schematics depending on circuit type */}
              <div className="py-4 flex items-center justify-center">
                {currentCircuit.id === 'simple_allumage' && (
                  <div className="w-full max-w-lg space-y-4 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <div className="text-rose-400 font-bold bg-rose-500/10 px-2.5 py-1 rounded border border-rose-500/30">
                        L (Phase 230V)
                      </div>
                      <div className="text-sky-400 font-bold bg-sky-500/10 px-2.5 py-1 rounded border border-sky-500/30">
                        N (Neutre 0V)
                      </div>
                    </div>

                    {/* Circuit Flow */}
                    <div className="flex items-center justify-around py-6 border-y border-slate-800 relative">
                      {/* Switch 1 Interactive Button */}
                      <button
                        onClick={() => setIsSwitchActive(prev => !prev)}
                        className={`p-3 rounded-2xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                          isSwitchActive
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/30 font-bold'
                            : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        <span className="text-xs">مفتاح SA1</span>
                        <span className="text-[10px] font-mono">{isSwitchActive ? '[مغلق ON]' : '[مفتوح OFF]'}</span>
                      </button>

                      {/* Connecting Line with pulse */}
                      <div className={`h-1 flex-1 mx-4 rounded transition-all ${loadActive ? 'bg-amber-400 wire-live' : 'bg-slate-700'}`}></div>

                      {/* Lamp Visual */}
                      <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all ${
                        loadActive
                          ? 'bg-amber-400 border-amber-200 text-slate-950 shadow-2xl shadow-amber-400/80 animate-pulse font-bold'
                          : 'bg-slate-900 border-slate-700 text-slate-500'
                      }`}>
                        <span className="text-xs">مصباح</span>
                      </div>
                    </div>
                  </div>
                )}

                {currentCircuit.id === 'va_et_vient' && (
                  <div className="w-full max-w-xl space-y-4 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <div className="text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded">Phase L</div>
                      <div className="text-slate-400 text-[11px] font-sans">أسلاك المكوك (Navettes 1 & 2)</div>
                      <div className="text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded">Neutre N</div>
                    </div>

                    <div className="flex items-center justify-between py-6 border-y border-slate-800">
                      {/* Switch 1 */}
                      <button
                        onClick={() => setIsSwitchActive(prev => !prev)}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                          isSwitchActive ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold' : 'bg-slate-900 text-slate-200 border-slate-700'
                        }`}
                      >
                        <span className="text-xs">مفتاح 1 (SA1)</span>
                        <span className="text-[10px] font-mono">{isSwitchActive ? 'وضع A' : 'وضع B'}</span>
                      </button>

                      {/* Navettes Wire Graphic */}
                      <div className="flex-1 mx-4 space-y-3">
                        <div className={`h-1 rounded transition-all ${isSwitchActive && isSecondSwitchActive ? 'bg-amber-400 wire-live' : 'bg-slate-700'}`} title="المكوك 1"></div>
                        <div className={`h-1 rounded transition-all ${!isSwitchActive && !isSecondSwitchActive ? 'bg-amber-400 wire-live' : 'bg-slate-700'}`} title="المكوك 2"></div>
                      </div>

                      {/* Switch 2 */}
                      <button
                        onClick={() => setIsSecondSwitchActive(prev => !prev)}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                          isSecondSwitchActive ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold' : 'bg-slate-900 text-slate-200 border-slate-700'
                        }`}
                      >
                        <span className="text-xs">مفتاح 2 (SA2)</span>
                        <span className="text-[10px] font-mono">{isSecondSwitchActive ? 'وضع A' : 'وضع B'}</span>
                      </button>

                      {/* Lamp */}
                      <div className={`w-14 h-14 rounded-full border-2 ml-4 flex items-center justify-center transition-all ${
                        loadActive
                          ? 'bg-amber-400 border-amber-200 text-slate-950 shadow-2xl shadow-amber-400/80 animate-pulse font-bold'
                          : 'bg-slate-900 border-slate-700 text-slate-500'
                      }`}>
                        <span className="text-[11px]">مصباح</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Industrial or Other Circuits Generic Live Interactive Block */}
                {currentCircuit.id !== 'simple_allumage' && currentCircuit.id !== 'va_et_vient' && (
                  <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-4 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-400">محاكاة التشغيل اللحظي:</span>
                      <button
                        onClick={() => setIsSwitchActive(prev => !prev)}
                        className={`px-4 py-1.5 rounded-xl font-bold cursor-pointer transition-all ${
                          isSwitchActive
                            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                            : 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                        }`}
                      >
                        {isSwitchActive ? 'إيقاف الدارة (Stop)' : 'بدء التشغيل (Start)'}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-sans">ملف التحكم A1-A2</span>
                        <span className={`font-bold ${isSwitchActive ? 'text-amber-400' : 'text-slate-500'}`}>
                          {isSwitchActive ? 'مغذى (230V AC)' : '0V (مفصول)'}
                        </span>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-sans">حالة الحمل الميكانيكي/الكهربائي</span>
                        <span className={`font-bold ${isSwitchActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {isSwitchActive ? 'يعمل بكفاءة عالية' : 'متوقف'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Principle of Operation & Step-by-Step Wiring */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Info className="w-4 h-4" />
                  مبدأ العمل الفيزيائي:
                </span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {currentCircuit.operationPrincipleAr}
                </p>

                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-slate-400 font-bold block mb-1">المكونات المطلوبة:</span>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    {currentCircuit.componentsList.map((comp, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                        <span>{comp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  خطوات التوصيل المعيارية في الميدان:
                </span>
                <ul className="space-y-1.5 text-slate-300 text-[11px]">
                  {currentCircuit.wiringStepsAr.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800">
                      <span className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] flex items-center justify-center shrink-0 font-bold">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Dedicated Troubleshooting for this specific circuit */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-rose-400 flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                أشهر الأعطال الميدانية لهذه الدارة وطرق علاجها الفورية:
              </h4>

              <div className="space-y-2.5">
                {currentCircuit.frequentProblems.map((prob, idx) => (
                  <div key={idx} className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      <span>العرض: {prob.symptom}</span>
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      <strong>السبب المرجح: </strong> {prob.probableCause}
                    </div>
                    <div className="text-emerald-400 text-[11px]">
                      <strong>العلاج الفوري: </strong> {prob.solution}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
