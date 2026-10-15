import React, { useState, useEffect } from 'react';
import { MOTOR_STARTERS, MOTOR_COUPLING_RULES } from '../data/industrialData';
import { 
  Cpu, 
  Play, 
  Square, 
  RotateCcw, 
  AlertTriangle, 
  Sliders, 
  CheckCircle2, 
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';

interface MotorStarterSimulatorProps {
  showFrenchTerms: boolean;
}

export const MotorStarterSimulator: React.FC<MotorStarterSimulatorProps> = ({ showFrenchTerms }) => {
  const [selectedStarterId, setSelectedStarterId] = useState<'dol' | 'dol_rev' | 'star_delta' | 'vfd'>('star_delta');
  
  // Simulation states
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [direction, setDirection] = useState<'forward' | 'reverse'>('forward');
  const [starDeltaPhase, setStarDeltaPhase] = useState<'idle' | 'star' | 'delta'>('idle');
  const [starTimerSeconds, setStarTimerSeconds] = useState<number>(0);
  const [isThermalTripped, setIsThermalTripped] = useState<boolean>(false);
  
  // VFD specific states
  const [vfdFrequencyHz, setVfdFrequencyHz] = useState<number>(45);
  const [activeSchematicView, setActiveSchematicView] = useState<'control' | 'power' | 'terminal_coupling'>('control');

  const selectedStarter = MOTOR_STARTERS.find(s => s.id === selectedStarterId) || MOTOR_STARTERS[0];

  // Star-Delta Timer simulation
  useEffect(() => {
    let interval: any;
    if (isRunning && selectedStarterId === 'star_delta' && starDeltaPhase === 'star') {
      interval = setInterval(() => {
        setStarTimerSeconds((prev) => {
          if (prev >= 4) {
            // Transition to Delta (KM3 opens, KM2 closes)
            setStarDeltaPhase('delta');
            return 4;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, selectedStarterId, starDeltaPhase]);

  // Reset states when changing starter
  const handleSelectStarter = (id: 'dol' | 'dol_rev' | 'star_delta' | 'vfd') => {
    setSelectedStarterId(id);
    setIsRunning(false);
    setIsThermalTripped(false);
    setStarDeltaPhase('idle');
    setStarTimerSeconds(0);
    setDirection('forward');
  };

  // User Actions
  const handleStartForward = () => {
    if (isThermalTripped) return;
    setIsRunning(true);
    setDirection('forward');
    if (selectedStarterId === 'star_delta') {
      setStarDeltaPhase('star');
      setStarTimerSeconds(0);
    }
  };

  const handleStartReverse = () => {
    if (isThermalTripped) return;
    setIsRunning(true);
    setDirection('reverse');
  };

  const handleStop = () => {
    setIsRunning(false);
    setStarDeltaPhase('idle');
    setStarTimerSeconds(0);
  };

  const handleToggleThermalTrip = () => {
    const nextTrip = !isThermalTripped;
    setIsThermalTripped(nextTrip);
    if (nextTrip) {
      setIsRunning(false);
      setStarDeltaPhase('idle');
      setStarTimerSeconds(0);
    }
  };

  // Motor Dynamic Metrics
  const calculateCurrentRpm = () => {
    if (!isRunning || isThermalTripped) return 0;
    if (selectedStarterId === 'vfd') {
      return Math.round((vfdFrequencyHz / 50) * 1440);
    }
    if (selectedStarterId === 'star_delta' && starDeltaPhase === 'star') {
      return 850; // Initial acceleration during star phase
    }
    return 1440; // Full nominal speed
  };

  const calculateCurrentAmpsRatio = () => {
    if (!isRunning || isThermalTripped) return 0;
    if (selectedStarterId === 'dol' || selectedStarterId === 'dol_rev') {
      return 1.0;
    }
    if (selectedStarterId === 'star_delta') {
      return starDeltaPhase === 'star' ? 0.33 : 1.0;
    }
    if (selectedStarterId === 'vfd') {
      return Number(((vfdFrequencyHz / 50) * 0.95).toFixed(2));
    }
    return 1.0;
  };

  const rpm = calculateCurrentRpm();
  const ampsRatio = calculateCurrentAmpsRatio();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <Cpu className="w-5 h-5" />
              </span>
              <h2 className="text-lg md:text-xl font-bold text-white">
                محاكي ومخططات إقلاع المحركات الحثية ثلاثية الطور
              </h2>
              {showFrenchTerms && (
                <span className="text-xs text-slate-400 font-mono">
                  (Simulateur de Démarrage & Schémas Électromécaniques)
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl">
              محاكاة حية تفاعلية لمخططات التحكم والقدرة: إقلاع مباشر، اتجاهين مع قفل كهربائي وميكانيكي، نجمي-مثلثي بمؤقت زمني، ومغير سرعة VFD.
            </p>
          </div>

          {/* Starter Selector Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 overflow-x-auto text-xs font-semibold">
            {MOTOR_STARTERS.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelectStarter(s.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedStarterId === s.id
                    ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s.nameFr.split('(')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: INTERACTIVE CONTROL PANEL & MOTOR ANIMATION */}
        <div className="lg:col-span-5 space-y-5">
          {/* Virtual Control Desk (Pupitre de Commande) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                لوحة أزرار التحكم الصناعية (Pupitre)
              </h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                isThermalTripped 
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' 
                  : isRunning 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                    : 'bg-slate-800 text-slate-400'
              }`}>
                {isThermalTripped ? 'عطل حراري F1 (Déclenché)' : isRunning ? 'المحرك قيد الدوران (En marche)' : 'متوقف (À l\'arrêt)'}
              </span>
            </div>

            {/* Industrial Push Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Forward Start PB (S1) */}
              <button
                type="button"
                onClick={handleStartForward}
                disabled={isThermalTripped}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isRunning && direction === 'forward'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/30'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-emerald-500/40'
                } ${isThermalTripped ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-emerald-400 flex items-center justify-center text-white shadow-inner">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                <span className="text-xs font-bold">
                  {selectedStarterId === 'dol_rev' ? 'تشغيل يمين (S1)' : 'تشغيل (S1 Marche)'}
                </span>
                <span className="text-[10px] font-mono text-emerald-300">NO (13-14)</span>
              </button>

              {/* Reverse Start PB (S2) - Only if DOL Reversing */}
              {selectedStarterId === 'dol_rev' && (
                <button
                  type="button"
                  onClick={handleStartReverse}
                  disabled={isThermalTripped}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isRunning && direction === 'reverse'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/30'
                      : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-emerald-500/40'
                  } ${isThermalTripped ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-emerald-400 flex items-center justify-center text-white shadow-inner">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold">تشغيل يسار (S2)</span>
                  <span className="text-[10px] font-mono text-emerald-300">KM2 (21-22)</span>
                </button>
              )}

              {/* Stop Pushbutton (S0) */}
              <button
                type="button"
                onClick={handleStop}
                className="p-3 rounded-xl border border-rose-500/40 bg-slate-800 hover:bg-slate-750 text-slate-200 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-rose-600 border-2 border-rose-400 flex items-center justify-center text-white shadow-inner">
                  <Square className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="text-xs font-bold">إيقاف (S0 Arrêt)</span>
                <span className="text-[10px] font-mono text-rose-300">NC (1-2)</span>
              </button>

              {/* Thermal Overload Simulation Button */}
              <button
                type="button"
                onClick={handleToggleThermalTrip}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isThermalTripped
                    ? 'bg-rose-500 text-slate-950 border-rose-400 shadow-lg shadow-rose-500/30'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-amber-500/40'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-amber-600 border-2 border-amber-400 flex items-center justify-center text-white shadow-inner">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold">
                  {isThermalTripped ? 'إعادة ضبط (Reset F1)' : 'اختبار عطل حراري F1'}
                </span>
                <span className="text-[10px] font-mono text-amber-300">95-96 / 97-98</span>
              </button>
            </div>

            {/* VFD Frequency Slider (When VFD is selected) */}
            {selectedStarterId === 'vfd' && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-sky-400">مغير التردد التناظري (Potentiomètre VFD):</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">{vfdFrequencyHz} Hz</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="1"
                  value={vfdFrequencyHz}
                  onChange={(e) => setVfdFrequencyHz(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>0 Hz (توقف)</span>
                  <span>25 Hz (نصف سرعة)</span>
                  <span>50 Hz (السرعة الاسمية)</span>
                  <span>60 Hz (فوق التزامن)</span>
                </div>
              </div>
            )}

            {/* Pilot Indicator Lights (Voyants) */}
            <div className="flex items-center justify-around bg-slate-950 p-3 rounded-xl border border-slate-800">
              {/* Green Run Lamp */}
              <div className="flex flex-col items-center gap-1">
                <div className={`w-6 h-6 rounded-full border-2 transition-all ${
                  isRunning && !isThermalTripped 
                    ? 'bg-emerald-400 border-emerald-300 shadow-lg shadow-emerald-400/80 animate-pulse' 
                    : 'bg-emerald-950 border-emerald-900'
                }`} />
                <span className="text-[10px] font-mono text-slate-400">H1 (Marche)</span>
              </div>

              {/* Red Stop Lamp */}
              <div className="flex flex-col items-center gap-1">
                <div className={`w-6 h-6 rounded-full border-2 transition-all ${
                  !isRunning && !isThermalTripped 
                    ? 'bg-rose-500 border-rose-300 shadow-lg shadow-rose-500/80' 
                    : 'bg-rose-950 border-rose-900'
                }`} />
                <span className="text-[10px] font-mono text-slate-400">H2 (Arrêt)</span>
              </div>

              {/* Orange/Yellow Fault Lamp */}
              <div className="flex flex-col items-center gap-1">
                <div className={`w-6 h-6 rounded-full border-2 transition-all ${
                  isThermalTripped 
                    ? 'bg-amber-400 border-amber-200 shadow-lg shadow-amber-400/80 animate-bounce' 
                    : 'bg-amber-950 border-amber-900'
                }`} />
                <span className="text-[10px] font-mono text-slate-400">H3 (Défaut F1)</span>
              </div>
            </div>
          </div>

          {/* Graphical Electromechanical Motor Unit (Animated Rotor) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden flex flex-col items-center justify-center">
            <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-amber-400" />
                المحرك الكهربائي الحثي (Moteur M1 3~)
              </span>
              <span className="font-mono text-amber-300 font-bold">{rpm} RPM</span>
            </div>

            {/* Visual Motor Rotating Disc */}
            <div className="relative w-44 h-44 my-2 flex items-center justify-center">
              {/* Stator Outer Ring */}
              <div className="absolute inset-0 rounded-full border-8 border-slate-700 bg-slate-950 shadow-2xl flex items-center justify-center">
                {/* Stator slots marks */}
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1.5 h-4 bg-slate-600"
                    style={{
                      transform: `rotate(${i * 30}deg) translateY(-80px)`
                    }}
                  />
                ))}
              </div>

              {/* Spinning Rotor */}
              <div
                className={`relative w-28 h-28 rounded-full border-4 border-amber-500/70 bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center shadow-lg transition-transform ${
                  isRunning && !isThermalTripped ? 'wire-live' : ''
                }`}
                style={{
                  animation: isRunning && !isThermalTripped
                    ? `spin ${direction === 'reverse' ? -1 : 1}s linear infinite`
                    : 'none',
                  animationDuration: rpm > 0 ? `${Math.max(0.2, 1440 / rpm)}s` : '0s'
                }}
              >
                {/* Rotor Shaft */}
                <div className="w-8 h-8 rounded-full bg-amber-400 border-2 border-slate-950 flex items-center justify-center font-bold text-[10px] text-slate-950 font-mono shadow-md">
                  M1
                </div>

                {/* Rotor Bar vanes */}
                <div className="absolute w-full h-1 bg-amber-400/60"></div>
                <div className="absolute h-full w-1 bg-amber-400/60"></div>
              </div>
            </div>

            {/* Dynamic Telemetry Stats */}
            <div className="w-full grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 text-center font-mono">
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">السرعة</span>
                <span className="text-xs font-bold text-white">{rpm} tr/min</span>
              </div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">التيار النسبي</span>
                <span className="text-xs font-bold text-amber-400">{ampsRatio} × In</span>
              </div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">الحالة</span>
                <span className="text-xs font-bold text-emerald-400">
                  {selectedStarterId === 'star_delta' && isRunning
                    ? starDeltaPhase === 'star' ? `نجمة (${starTimerSeconds}s)` : 'مثلث (Δ)'
                    : isRunning ? 'دوران' : 'توقف'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE ELECTRICAL SCHEMATIC (SCHÉMA) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            {/* View Selector Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  المخطط الكهربائي التفاعلي المباشر
                </h3>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
                <button
                  onClick={() => setActiveSchematicView('control')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    activeSchematicView === 'control' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  مخطط التحكم (Commande)
                </button>
                <button
                  onClick={() => setActiveSchematicView('power')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    activeSchematicView === 'power' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  مخطط القدرة (Puissance)
                </button>
                <button
                  onClick={() => setActiveSchematicView('terminal_coupling')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    activeSchematicView === 'terminal_coupling' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  صندوق الأطراف (Boîte à bornes)
                </button>
              </div>
            </div>

            {/* SCHEMATIC 1: CONTROL CIRCUIT (COMMANDE) */}
            {activeSchematicView === 'control' && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 blueprint-grid min-h-[380px] flex flex-col justify-between font-mono text-xs">
                {/* Control Top Rail (Phase 24V or 230V) */}
                <div className="flex items-center justify-between border-b-2 border-amber-500 pb-1 text-amber-400 font-bold text-xs">
                  <span>خط التغذية L (Phase Commande 230V)</span>
                  <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded">Fusible 2A</span>
                </div>

                {/* Circuit Branches */}
                <div className="py-4 space-y-4">
                  {/* Step 1: Thermal Relay NC Contact (95-96) */}
                  <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-xl p-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full ${!isThermalTripped ? 'bg-emerald-400 shadow-md shadow-emerald-400/50' : 'bg-rose-500'}`}></span>
                      <span className="font-bold text-slate-200">تماس الريليه الحراري F1 (95-96 NC)</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                      !isThermalTripped ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {!isThermalTripped ? 'مغلق (Passant)' : 'مفتوح (Coupé!)'}
                    </span>
                  </div>

                  {/* Step 2: Emergency Stop & Stop Pushbutton (S0) */}
                  <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-xl p-3">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                      <span className="font-bold text-slate-200">زر الإيقاف S0 (NC 1-2) وطوارئ S_AU</span>
                    </div>
                    <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-emerald-500/20 text-emerald-400">
                      مغلق في وضع الراحة
                    </span>
                  </div>

                  {/* Step 3: Start Button & Latching (Auto-maintien 13-14) */}
                  <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-xl p-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full ${isRunning ? 'bg-amber-400 shadow-md shadow-amber-400/80 animate-pulse' : 'bg-slate-700'}`}></span>
                      <div>
                        <span className="font-bold text-slate-200">زر التشغيل S1 بالتوازي مع تماس الاستمرارية KM1 (13-14)</span>
                        <div className="text-[10px] text-slate-400">Auto-maintien (Latch)</div>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                      isRunning ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isRunning ? 'التماس مغلق (Actif)' : 'مفتوح'}
                    </span>
                  </div>

                  {/* Specific logic for Star-Delta / Reversing */}
                  {selectedStarterId === 'star_delta' && (
                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sky-400">مؤقت الانتقال الزمني T1 (4 ثوانٍ)</span>
                        <span className="text-amber-400 font-bold font-mono">{starTimerSeconds}s / 4s</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className={`p-2 rounded-lg border ${
                          starDeltaPhase === 'star' ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}>
                          كونتاكتور النجمة KM3: {starDeltaPhase === 'star' ? 'ON (نشط)' : 'OFF'}
                        </div>
                        <div className={`p-2 rounded-lg border ${
                          starDeltaPhase === 'delta' ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}>
                          كونتاكتور المثلث KM2: {starDeltaPhase === 'delta' ? 'ON (نشط)' : 'OFF'}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedStarterId === 'dol_rev' && (
                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-400">القفل الكهربائي المتبادل (Verrouillage 21-22)</span>
                        <span className="text-emerald-400 font-bold">حماية من تماس الأطوار</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1">
                        مرور تيار تغذية ملف KM1 عبر تلامس NC لـ KM2، وتغذية KM2 عبر تلامس NC لـ KM1 لمنع عملهما معاً.
                      </p>
                    </div>
                  )}
                </div>

                {/* Control Bottom Rail (Neutral N) */}
                <div className="flex items-center justify-between border-t-2 border-sky-500 pt-1 text-sky-400 font-bold text-xs">
                  <span>خط الحيادي N (Neutre de commande A2)</span>
                  <span className="text-[10px] text-slate-400 font-mono">0V Potentiel</span>
                </div>
              </div>
            )}

            {/* SCHEMATIC 2: POWER CIRCUIT (PUISSANCE) */}
            {activeSchematicView === 'power' && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 blueprint-grid min-h-[380px] space-y-4 font-mono text-xs">
                {/* 3-Phase Rails */}
                <div className="grid grid-cols-3 gap-2 text-center font-bold text-xs border-b border-slate-800 pb-2">
                  <div className="text-rose-400 bg-rose-500/10 py-1 rounded">الطور L1 (Phase 1)</div>
                  <div className="text-emerald-400 bg-emerald-500/10 py-1 rounded">الطور L2 (Phase 2)</div>
                  <div className="text-sky-400 bg-sky-500/10 py-1 rounded">الطور L3 (Phase 3)</div>
                </div>

                {/* Power Components Cascade */}
                <div className="space-y-3">
                  {/* Q1: Motor Circuit Breaker */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Q1: قاطع المحرك الكهرومغناطيسي (Disjoncteur Moteur GV2)</span>
                      <span className="text-[10px] text-slate-400 font-sans">حماية مشتركة ضد قصر الدارات والأحمال الزائدة</span>
                    </div>
                    <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                      1-2, 3-4, 5-6 (مغلق)
                    </span>
                  </div>

                  {/* KM1: Main Contactor */}
                  <div className={`border rounded-xl p-3 flex items-center justify-between transition-all ${
                    isRunning 
                      ? 'bg-amber-500/15 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10 font-bold' 
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}>
                    <div>
                      <span className="block font-bold">KM1: كونتاكتور الخط الرئيسي (Contacteur de ligne)</span>
                      <span className="text-[10px] text-slate-400 font-sans">توصيل الأطوار الثلاثة بمداخل ملفات المحرك U1, V1, W1</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      isRunning ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isRunning ? 'مغلق (Passant 400V)' : 'مفتوح (Ouvert)'}
                    </span>
                  </div>

                  {/* F1: Thermal Overload Relay */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">F1: المرحل الحراري ثلاثي الأقطاب (Relais Thermique)</span>
                      <span className="text-[10px] text-slate-400 font-sans">شرائح ثنائية المعدن لمراقبة تيار كل طور</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      isThermalTripped ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {isThermalTripped ? 'فاصل (Déclenché)' : 'سليم (Armé)'}
                    </span>
                  </div>

                  {/* Motor Terminal */}
                  <div className="bg-slate-900 border-2 border-sky-500/40 rounded-xl p-3 text-center">
                    <span className="font-bold text-sky-400 block text-xs mb-1">
                      المحرك الحثي M1 (3~) - 400V
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans">
                      توصيل أطراف الدخول: U1 - V1 - W1 وأطراف الخروج: U2 - V2 - W2
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* SCHEMATIC 3: MOTOR TERMINAL COUPLING (BOÎTE À BORNER) */}
            {activeSchematicView === 'terminal_coupling' && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-5">
                <div className="border-b border-slate-800 pb-3">
                  <h4 className="text-xs font-bold text-amber-400 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    توصيل صفائح النحاس (Barrettes de couplage) في صندوق أطراف المحرك
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1">
                    كيفية ربط الأطراف الستة (U1, V1, W1, W2, U2, V2) لنظام النجمة أو المثلث حسب معيار IEC.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Star Coupling Box */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-extrabold text-amber-400">توصيل نجمي (Couplage Étoile Y)</span>
                      <span className="text-[10px] font-mono bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded">400V</span>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {MOTOR_COUPLING_RULES[0].barrettesStar}
                    </p>

                    {/* Graphic Box */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-center space-y-3">
                      <div className="flex justify-around text-xs font-bold text-amber-400">
                        <div className="bg-slate-800 px-2 py-1 rounded">W2</div>
                        <div className="bg-slate-800 px-2 py-1 rounded">U2</div>
                        <div className="bg-slate-800 px-2 py-1 rounded">V2</div>
                      </div>

                      {/* Horizontal Copper Bar */}
                      <div className="h-2 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 rounded-full mx-4 shadow-md shadow-amber-500/30" title="قطعة نحاسية أفقية"></div>

                      <div className="flex justify-around text-xs font-bold text-sky-400">
                        <div className="bg-slate-800 px-2 py-1 rounded">U1 (L1)</div>
                        <div className="bg-slate-800 px-2 py-1 rounded">V1 (L2)</div>
                        <div className="bg-slate-800 px-2 py-1 rounded">W1 (L3)</div>
                      </div>
                    </div>
                  </div>

                  {/* Delta Coupling Box */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-extrabold text-emerald-400">توصيل مثلثي (Couplage Triangle Δ)</span>
                      <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded">230V</span>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {MOTOR_COUPLING_RULES[0].barrettesDelta}
                    </p>

                    {/* Graphic Box */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-center">
                      <div className="grid grid-cols-3 gap-2">
                        {/* Pair 1 */}
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs font-bold text-amber-400">W2</span>
                          <div className="w-2.5 h-8 bg-amber-400 rounded-full shadow-md" title="قطعة نحاسية عمودية"></div>
                          <span className="text-xs font-bold text-sky-400">U1 (L1)</span>
                        </div>

                        {/* Pair 2 */}
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs font-bold text-amber-400">U2</span>
                          <div className="w-2.5 h-8 bg-amber-400 rounded-full shadow-md" title="قطعة نحاسية عمودية"></div>
                          <span className="text-xs font-bold text-sky-400">V1 (L2)</span>
                        </div>

                        {/* Pair 3 */}
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs font-bold text-amber-400">V2</span>
                          <div className="w-2.5 h-8 bg-amber-400 rounded-full shadow-md" title="قطعة نحاسية عمودية"></div>
                          <span className="text-xs font-bold text-sky-400">W1 (L3)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Technical Info Box about the chosen starter */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              المواصفات الهندسية: {selectedStarter.nameAr}
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">تيار الإقلاع:</span>
                <span className="font-bold text-amber-400">{selectedStarter.startingCurrentRatio}</span>
              </div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">عزم الإقلاع:</span>
                <span className="font-bold text-sky-400">{selectedStarter.startingTorqueRatio}</span>
              </div>
            </div>

            <div className="text-xs text-slate-300 space-y-1">
              <div className="font-bold text-slate-200">الاستخدامات الموصى بها:</div>
              <div className="flex flex-wrap gap-1.5">
                {selectedStarter.typicalUses.map((use, i) => (
                  <span key={i} className="bg-slate-800 px-2 py-0.5 rounded text-[11px] text-slate-300 border border-slate-700">
                    {use}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
