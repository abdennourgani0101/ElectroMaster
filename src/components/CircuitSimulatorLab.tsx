import React, { useState, useEffect, useMemo } from 'react';
import { 
  CircuitElement, 
  WireConnection, 
  ComponentType, 
  PrebuiltTemplate 
} from '../types/simulator';
import { SIMULATOR_PREBUILT_TEMPLATES } from '../data/simulatorTemplatesData';
import { 
  Play, 
  Square, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Zap, 
  Layers, 
  Cpu, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  Download,
  Share2,
  FolderOpen
} from 'lucide-react';

interface CircuitSimulatorLabProps {
  showFrenchTerms: boolean;
}

export const CircuitSimulatorLab: React.FC<CircuitSimulatorLabProps> = ({ showFrenchTerms }) => {
  // Simulator core state
  const [elements, setElements] = useState<CircuitElement[]>(SIMULATOR_PREBUILT_TEMPLATES[1].elements);
  const [connections, setConnections] = useState<WireConnection[]>(SIMULATOR_PREBUILT_TEMPLATES[1].connections);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('latching_contactor');
  
  // Wire creation state
  const [wireSourceId, setWireSourceId] = useState<string | null>(null);
  const [timerTick, setTimerTick] = useState<number>(0);
  const [saveAlert, setSaveAlert] = useState<boolean>(false);

  // Timer simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerTick(t => t + 1);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // REAL-TIME ELECTRICAL SIMULATION SOLVER
  // Evaluates which elements are energized from Phase L through closed switches/contacts
  const simulatedState = useMemo(() => {
    if (!isSimulating) {
      return {
        elements: elements.map(el => ({ ...el, state: { ...el.state, isEnergized: false } })),
        liveWires: new Set<string>()
      };
    }

    // Clone element states
    const elMap: Record<string, CircuitElement> = {};
    elements.forEach(el => {
      elMap[el.id] = { ...el, state: { ...el.state } };
    });

    const liveWires = new Set<string>();

    // 1. Identify power sources
    const phaseSources = elements.filter(el => el.type === 'source_phase' || el.type === 'source_dc_pos');
    
    // Breadth-first voltage propagation from sources
    const queue: string[] = phaseSources.map(s => s.id);
    const visited = new Set<string>();
    phaseSources.forEach(s => {
      if (elMap[s.id]) elMap[s.id].state.isEnergized = true;
    });

    // Check if KM1 coil was energized in previous step for latching contact
    const km1Coil = elements.find(el => el.type === 'contactor_coil');
    const isKm1Energized = km1Coil?.state.isEnergized;

    // Update auxiliary contacts based on coil state
    elements.forEach(el => {
      if (el.type === 'aux_contact_no') {
        elMap[el.id].state.isClosed = !!isKm1Energized;
      } else if (el.type === 'aux_contact_nc') {
        elMap[el.id].state.isClosed = !isKm1Energized;
      }
    });

    // Propagate electricity
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (visited.has(currentId)) continue;
      visited.add(currentId);

      const currentEl = elMap[currentId];
      if (!currentEl) continue;

      // Find outgoing wire connections
      const outgoingWires = connections.filter(w => w.fromElementId === currentId);

      for (const wire of outgoingWires) {
        const targetEl = elMap[wire.toElementId];
        if (!targetEl) continue;

        // Can current pass through targetEl?
        let canPass = false;
        
        if (targetEl.type === 'source_neutral' || targetEl.type === 'source_dc_neg') {
          // Reached return path
          canPass = false;
          liveWires.add(wire.id);
        } else if (targetEl.type === 'lamp_e1' || targetEl.type === 'contactor_coil' || targetEl.type === 'motor_3ph' || targetEl.type === 'timer_ton' || targetEl.type === 'buzzer') {
          // Loads absorb power and energize
          targetEl.state.isEnergized = true;
          liveWires.add(wire.id);
          canPass = true; // can continue to neutral
          queue.push(targetEl.id);
        } else if (targetEl.type === 'switch_spst' || targetEl.type === 'pushbutton_no' || targetEl.type === 'aux_contact_no' || targetEl.type === 'timer_contact_no') {
          // Open contacts pass only if closed
          if (targetEl.state.isClosed) {
            targetEl.state.isEnergized = true;
            liveWires.add(wire.id);
            canPass = true;
            queue.push(targetEl.id);
          }
        } else if (targetEl.type === 'pushbutton_nc' || targetEl.type === 'emergency_stop' || targetEl.type === 'breaker_q1' || targetEl.type === 'thermal_nc' || targetEl.type === 'aux_contact_nc') {
          // Closed contacts pass unless tripped/opened
          if (targetEl.state.isClosed && !targetEl.state.isTripped) {
            targetEl.state.isEnergized = true;
            liveWires.add(wire.id);
            canPass = true;
            queue.push(targetEl.id);
          }
        } else if (targetEl.type === 'thermal_no') {
          // Thermal fault contact passes if tripped
          if (targetEl.state.isTripped || targetEl.state.isClosed) {
            targetEl.state.isEnergized = true;
            liveWires.add(wire.id);
            canPass = true;
            queue.push(targetEl.id);
          }
        } else {
          targetEl.state.isEnergized = true;
          liveWires.add(wire.id);
          canPass = true;
          queue.push(targetEl.id);
        }
      }
    }

    return {
      elements: Object.values(elMap),
      liveWires
    };
  }, [elements, connections, isSimulating, timerTick]);

  // Handle Loading Prebuilt Template
  const handleLoadTemplate = (templateId: string) => {
    const t = SIMULATOR_PREBUILT_TEMPLATES.find(tpl => tpl.id === templateId);
    if (!t) return;
    setSelectedTemplateId(templateId);
    setElements(JSON.parse(JSON.stringify(t.elements)));
    setConnections(JSON.parse(JSON.stringify(t.connections)));
    setWireSourceId(null);
  };

  // Toggle Switch or Push Button
  const handleElementClick = (elementId: string) => {
    setElements(prev => prev.map(el => {
      if (el.id !== elementId) return el;

      if (el.type === 'switch_spst') {
        return { ...el, state: { ...el.state, isClosed: !el.state.isClosed } };
      }
      if (el.type === 'breaker_q1') {
        return { ...el, state: { ...el.state, isClosed: !el.state.isClosed, isTripped: !el.state.isClosed } };
      }
      if (el.type === 'pushbutton_no') {
        // Toggle pushbutton latch in simulation
        return { ...el, state: { ...el.state, isClosed: !el.state.isClosed, isPressed: !el.state.isPressed } };
      }
      if (el.type === 'pushbutton_nc' || el.type === 'emergency_stop') {
        // Break contact
        return { ...el, state: { ...el.state, isClosed: !el.state.isClosed, isPressed: !el.state.isPressed } };
      }
      if (el.type === 'thermal_nc' || el.type === 'thermal_no') {
        // Overload fault trip simulation
        const nextTripped = !el.state.isTripped;
        return { ...el, state: { ...el.state, isTripped: nextTripped, isClosed: el.type === 'thermal_nc' ? !nextTripped : nextTripped } };
      }
      return el;
    }));
  };

  // Add Component to Grid
  const handleAddComponent = (type: ComponentType) => {
    const newId = `elem_${Date.now()}`;
    let label = 'عنصر';
    let tag = 'X1';
    let defaultState: any = { isEnergized: false };

    if (type === 'switch_spst') { label = 'مفتاح أحادي'; tag = 'SA'; defaultState.isClosed = false; }
    else if (type === 'pushbutton_no') { label = 'زر تشغيل (NO)'; tag = 'S1'; defaultState.isClosed = false; }
    else if (type === 'pushbutton_nc') { label = 'زر إيقاف (NC)'; tag = 'S0'; defaultState.isClosed = true; }
    else if (type === 'lamp_e1') { label = 'مصباح إشارة'; tag = 'H1'; }
    else if (type === 'contactor_coil') { label = 'ملف كونتاكتور'; tag = 'KM1'; }
    else if (type === 'aux_contact_no') { label = 'تماس مساعد (13-14)'; tag = 'KM1'; defaultState.isClosed = false; }
    else if (type === 'aux_contact_nc') { label = 'تماس مساعد (21-22)'; tag = 'KM1'; defaultState.isClosed = true; }
    else if (type === 'motor_3ph') { label = 'محرك 3~'; tag = 'M1'; }
    else if (type === 'breaker_q1') { label = 'قاطع حماية Q1'; tag = 'Q1'; defaultState.isClosed = true; }
    else if (type === 'thermal_nc') { label = 'ريليه حراري (95-96)'; tag = 'F1'; defaultState.isClosed = true; }
    else if (type === 'timer_ton') { label = 'مؤقت TON'; tag = 'KA1'; defaultState.timerValue = 3; }

    const newElement: CircuitElement = {
      id: newId,
      type,
      label,
      tag,
      x: (elements.length * 2) % 11 + 1,
      y: 2,
      state: defaultState
    };

    setElements([...elements, newElement]);
  };

  // Handle Wire Terminal Connection (Click first element, then click second element)
  const handleConnectTerminals = (elementId: string) => {
    if (!wireSourceId) {
      setWireSourceId(elementId);
    } else {
      if (wireSourceId !== elementId) {
        // Create wire between wireSourceId and elementId
        const newWire: WireConnection = {
          id: `w_${Date.now()}`,
          fromElementId: wireSourceId,
          fromTerminal: 'out',
          toElementId: elementId,
          toTerminal: 'in'
        };
        setConnections([...connections, newWire]);
      }
      setWireSourceId(null);
    }
  };

  const handleDeleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    setConnections(connections.filter(w => w.fromElementId !== id && w.toElementId !== id));
    if (wireSourceId === id) setWireSourceId(null);
  };

  const handleResetCircuit = () => {
    setElements(prev => prev.map(el => {
      if (el.type === 'pushbutton_no' || el.type === 'switch_spst') {
        return { ...el, state: { ...el.state, isClosed: false, isPressed: false, isEnergized: false } };
      }
      if (el.type === 'pushbutton_nc' || el.type === 'emergency_stop' || el.type === 'breaker_q1' || el.type === 'thermal_nc') {
        return { ...el, state: { ...el.state, isClosed: true, isTripped: false, isPressed: false, isEnergized: false } };
      }
      return { ...el, state: { ...el.state, isEnergized: false } };
    }));
  };

  const handleSaveCustomCircuit = () => {
    try {
      const customData = { elements, connections };
      localStorage.setItem('electropro_custom_circuit', JSON.stringify(customData));
      setSaveAlert(true);
      setTimeout(() => setSaveAlert(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

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
                مختبر رسم ومحاكاة الدوائر الكهربائية التفاعلي
              </h2>
              {showFrenchTerms && (
                <span className="text-xs text-slate-400 font-mono">
                  (Simulateur de Schémas Interactif & Bibliothèque de Modèles Prêts)
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl">
              صمم وجرب دوائر التحكم الصناعية والمعمارية مباشرة على لوحة العمل: أضف القواطع والأزرار والكونتاكتورات والمحركات، ثم شغل المحاكاة واختبر سريان التيار اللحظي واستجابة التماسات.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md ${
                isSimulating 
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20' 
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              {isSimulating ? (
                <>
                  <Zap className="w-4 h-4 fill-current animate-pulse" />
                  المحاكاة نشطة (Simulation ON)
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  بدء المحاكاة (Run)
                </>
              )}
            </button>

            <button
              onClick={handleResetCircuit}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 cursor-pointer"
              title="إعادة ضبط حالة جميع التماسات والأزرار"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              إعادة ضبط
            </button>

            <button
              onClick={handleSaveCustomCircuit}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-amber-400 border border-amber-500/30 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              حفظ الدارة
            </button>
          </div>
        </div>

        {saveAlert && (
          <div className="mt-3 py-1.5 px-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            تم حفظ مخطط الدارة بنجاح في ذاكرة الجهاز المحلية!
          </div>
        )}

        {/* Ready-Made Schematics Bar (مخططات جاهزة للتحميل الفوري) */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          <span className="text-slate-400 font-sans whitespace-nowrap flex items-center gap-1 text-[11px]">
            <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
            المخططات الجاهزة:
          </span>
          {SIMULATOR_PREBUILT_TEMPLATES.map(tpl => (
            <button
              key={tpl.id}
              onClick={() => handleLoadTemplate(tpl.id)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap border ${
                selectedTemplateId === tpl.id
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm shadow-amber-500/20'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {tpl.nameAr.split('(')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Component Palette Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
          <span className="font-bold text-slate-200 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-amber-400" />
            شريط إضافة العناصر الكهربائية إلى لوحة الرسم:
          </span>
          <span className="text-[10px] text-amber-400 font-mono">
            {wireSourceId ? `📍 اختر العنصر الثاني لربط السلك الكهربائي...` : 'انقر على عنصر لإضافته، أو انقر على رمز الربط لمد الأسلاك'}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <button
            onClick={() => handleAddComponent('switch_spst')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-850 text-slate-200 border border-slate-800 text-xs font-semibold cursor-pointer shrink-0"
          >
            + مفتاح عادي SA
          </button>
          <button
            onClick={() => handleAddComponent('pushbutton_no')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-850 text-emerald-300 border border-emerald-500/30 text-xs font-semibold cursor-pointer shrink-0"
          >
            + زر تشغيل (NO)
          </button>
          <button
            onClick={() => handleAddComponent('pushbutton_nc')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-850 text-rose-300 border border-rose-500/30 text-xs font-semibold cursor-pointer shrink-0"
          >
            + زر إيقاف (NC)
          </button>
          <button
            onClick={() => handleAddComponent('contactor_coil')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-850 text-sky-300 border border-sky-500/30 text-xs font-semibold cursor-pointer shrink-0 font-mono"
          >
            + ملف KM1 (A1-A2)
          </button>
          <button
            onClick={() => handleAddComponent('aux_contact_no')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-850 text-amber-300 border border-amber-500/30 text-xs font-semibold cursor-pointer shrink-0 font-mono"
          >
            + تماس استمرارية (13-14)
          </button>
          <button
            onClick={() => handleAddComponent('aux_contact_nc')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-850 text-rose-300 border border-rose-500/30 text-xs font-semibold cursor-pointer shrink-0 font-mono"
          >
            + تماس قفل (21-22)
          </button>
          <button
            onClick={() => handleAddComponent('lamp_e1')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-850 text-yellow-300 border border-yellow-500/30 text-xs font-semibold cursor-pointer shrink-0"
          >
            + مصباح إنارة E1
          </button>
          <button
            onClick={() => handleAddComponent('motor_3ph')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-850 text-amber-400 border border-amber-500/30 text-xs font-semibold cursor-pointer shrink-0 font-mono"
          >
            + محرك حثي M1
          </button>
          <button
            onClick={() => handleAddComponent('thermal_nc')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-850 text-rose-400 border border-rose-500/30 text-xs font-semibold cursor-pointer shrink-0"
          >
            + ريليه حراري F1
          </button>
          <button
            onClick={() => handleAddComponent('timer_ton')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-850 text-purple-300 border border-purple-500/30 text-xs font-semibold cursor-pointer shrink-0 font-mono"
          >
            + مؤقت TON
          </button>
        </div>
      </div>

      {/* SCHEMATIC CANVAS BOARD */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
            <span className="font-bold text-white">لوحة الرسم والمحاكاة التفاعلية (Canvas)</span>
            <span className="text-[10px] text-slate-400 font-mono">
              ({simulatedState.elements.length} عناصر • {connections.length} أسلاك توصيل)
            </span>
          </div>

          <span className="text-[11px] text-slate-400 font-sans">
            اضغط على أي مفتاح أو زر أو ريليه حراري لتغيير حالته فوراً واختبار سريان الكهرباء
          </span>
        </div>

        {/* Visual Blueprint Grid Area */}
        <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-6 blueprint-grid min-h-[460px] relative overflow-x-auto">
          {/* Top Voltage Busbar Graphic */}
          <div className="flex items-center justify-between border-b-2 border-amber-500/80 pb-2 mb-6 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                Phase L (230V AC)
              </span>
              <span className="text-[10px] text-slate-400 font-sans">خط التغذية الرئيسي</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-sans">خط العودة المشترك</span>
              <span className="px-2.5 py-0.5 rounded bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30">
                Neutral N (0V)
              </span>
            </div>
          </div>

          {/* Interactive Circuit Elements Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {simulatedState.elements.map((el) => {
              const isEnergized = el.state.isEnergized;
              const isSelectedForWire = wireSourceId === el.id;

              return (
                <div
                  key={el.id}
                  className={`bg-slate-900/90 border-2 rounded-2xl p-4 shadow-lg transition-all flex flex-col justify-between relative ${
                    isEnergized 
                      ? 'border-amber-400 shadow-amber-500/20 bg-slate-900' 
                      : 'border-slate-800'
                  } ${isSelectedForWire ? 'ring-2 ring-sky-400' : ''}`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 text-[11px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-bold">
                      {el.tag}
                    </span>
                    <div className="flex items-center gap-1">
                      {/* Wire Link Button */}
                      <button
                        onClick={() => handleConnectTerminals(el.id)}
                        className={`p-1 rounded text-[10px] font-sans font-bold cursor-pointer transition-all ${
                          isSelectedForWire ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                        title="ربط سلك كهربائي مع عنصر آخر"
                      >
                        سلك ⚡
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteElement(el.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
                        title="حذف هذا العنصر"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Visual Body / Schematic Symbol with Interactive Click */}
                  <div
                    onClick={() => handleElementClick(el.id)}
                    className="py-3 flex flex-col items-center justify-center cursor-pointer select-none group"
                  >
                    {/* Switch SPST */}
                    {el.type === 'switch_spst' && (
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-12 h-6 rounded-full p-1 border transition-all ${
                          el.state.isClosed ? 'bg-amber-500 border-amber-300 justify-end' : 'bg-slate-800 border-slate-600 justify-start'
                        } flex items-center`}>
                          <div className="w-4 h-4 rounded-full bg-slate-950 shadow"></div>
                        </div>
                        <span className="text-xs font-bold text-slate-200">
                          {el.state.isClosed ? 'مفتاح مغلق (ON)' : 'مفتاح مفتوح (OFF)'}
                        </span>
                      </div>
                    )}

                    {/* Pushbutton NO */}
                    {el.type === 'pushbutton_no' && (
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                          el.state.isClosed ? 'bg-emerald-500 border-emerald-300 shadow-lg shadow-emerald-500/50 scale-95' : 'bg-emerald-950 border-emerald-700 text-emerald-400'
                        }`}>
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                        <span className="text-xs font-bold text-emerald-300">
                          {el.label} {el.state.isClosed ? '[مضغوط]' : '[حر]'}
                        </span>
                      </div>
                    )}

                    {/* Pushbutton NC / Emergency Stop */}
                    {(el.type === 'pushbutton_nc' || el.type === 'emergency_stop') && (
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                          !el.state.isClosed ? 'bg-rose-500 border-rose-300 shadow-lg shadow-rose-500/50 scale-95' : 'bg-rose-950 border-rose-700 text-rose-400'
                        }`}>
                          <Square className="w-4 h-4 fill-current" />
                        </div>
                        <span className="text-xs font-bold text-rose-300">
                          {el.label} {!el.state.isClosed ? '[مقطوع!]' : '[مغلق طبيعياً]'}
                        </span>
                      </div>
                    )}

                    {/* Contactor Coil (KM1 A1-A2) */}
                    {el.type === 'contactor_coil' && (
                      <div className="flex flex-col items-center gap-2 font-mono">
                        <div className={`w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
                          isEnergized 
                            ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow-xl shadow-sky-500/40 animate-pulse' 
                            : 'bg-slate-950 border-slate-700 text-slate-500'
                        }`}>
                          <span className="text-[10px]">A1</span>
                          <span className="text-sm font-black">[ KM1 ]</span>
                          <span className="text-[10px]">A2</span>
                        </div>
                        <span className={`text-xs font-bold ${isEnergized ? 'text-sky-400' : 'text-slate-400'}`}>
                          {isEnergized ? '⚡ الملف مغذى (Actif)' : 'مفصول (0V)'}
                        </span>
                      </div>
                    )}

                    {/* Auxiliary Contact NO (13-14) */}
                    {el.type === 'aux_contact_no' && (
                      <div className="flex flex-col items-center gap-1 font-mono">
                        <div className="text-xs text-amber-400">13 —— / —— 14</div>
                        <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          el.state.isClosed ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40' : 'bg-slate-800 text-slate-500'
                        }`}>
                          {el.state.isClosed ? 'مغلق بالاستمرارية (Latch ON)' : 'مفتوح (Relâché)'}
                        </div>
                      </div>
                    )}

                    {/* Auxiliary Contact NC (21-22) */}
                    {el.type === 'aux_contact_nc' && (
                      <div className="flex flex-col items-center gap-1 font-mono">
                        <div className="text-xs text-rose-400">21 —— \ —— 22</div>
                        <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          el.state.isClosed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {el.state.isClosed ? 'مغلق (سليم)' : 'مفتوح (قفل أمان!)'}
                        </div>
                      </div>
                    )}

                    {/* Thermal Relay Contact */}
                    {(el.type === 'thermal_nc' || el.type === 'thermal_no') && (
                      <div className="flex flex-col items-center gap-2">
                        <div className={`p-2 rounded-xl border flex items-center gap-2 ${
                          el.state.isTripped ? 'bg-rose-500 text-slate-950 border-rose-300 font-bold' : 'bg-slate-950 border-slate-700 text-slate-300'
                        }`}>
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-xs font-mono">{el.tag}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {el.state.isTripped ? '⚠️ عطل حراري فاصل' : 'سليم (انقر للاختبار)'}
                        </span>
                      </div>
                    )}

                    {/* Lamp Indicator E1 */}
                    {el.type === 'lamp_e1' && (
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${
                          isEnergized 
                            ? 'bg-amber-400 border-amber-200 text-slate-950 shadow-2xl shadow-amber-400/80 animate-pulse font-black' 
                            : 'bg-slate-950 border-slate-700 text-slate-600'
                        }`}>
                          {isEnergized ? '💡 مضيء' : 'طفأ'}
                        </div>
                        <span className="text-xs font-bold text-slate-300">{el.label}</span>
                      </div>
                    )}

                    {/* Motor M1 (3~) */}
                    {el.type === 'motor_3ph' && (
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all ${
                          isEnergized 
                            ? 'border-amber-400 bg-slate-800 text-amber-400 shadow-2xl shadow-amber-500/50 wire-live animate-spin' 
                            : 'border-slate-700 bg-slate-950 text-slate-600'
                        }`}
                        style={{ animationDuration: isEnergized ? '0.8s' : '0s' }}
                        >
                          <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center font-bold text-xs font-mono">
                            M
                          </div>
                        </div>
                        <span className={`text-xs font-bold ${isEnergized ? 'text-amber-400' : 'text-slate-400'}`}>
                          {isEnergized ? 'المحرك يدور (1440 RPM)' : 'المحرك متوقف'}
                        </span>
                      </div>
                    )}

                    {/* Timer TON */}
                    {el.type === 'timer_ton' && (
                      <div className="flex flex-col items-center gap-2 font-mono">
                        <div className={`p-3 rounded-2xl border flex flex-col items-center justify-center ${
                          isEnergized ? 'bg-purple-950/40 border-purple-400 text-purple-300' : 'bg-slate-950 border-slate-700 text-slate-500'
                        }`}>
                          <span className="text-xs font-bold">مؤقت TON</span>
                          <span className="text-sm font-black text-amber-400">
                            {isEnergized ? '⏱️ عد تنازلي...' : 'جاهز'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer status */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{el.label}</span>
                    <span className={`font-mono font-bold ${isEnergized ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {isEnergized ? '230V' : '0V'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Wires List & Connectivity Inspector */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-xs space-y-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              شبكة الأسلاك الكهربائية النشطة:
            </span>

            <div className="flex flex-wrap gap-2">
              {connections.map((w, idx) => {
                const isLive = simulatedState.liveWires.has(w.id);
                const fromEl = elements.find(e => e.id === w.fromElementId);
                const toEl = elements.find(e => e.id === w.toElementId);

                return (
                  <span
                    key={w.id}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[11px] border flex items-center gap-1.5 ${
                      isLive 
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-sm shadow-amber-500/20' 
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    <span>{fromEl?.tag || 'Src'}</span>
                    <span>➔</span>
                    <span>{toEl?.tag || 'Load'}</span>
                    <span className="text-[9px] font-sans">
                      {isLive ? '(حي ⚡)' : '(مفصول)'}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Educational Guide Box below the canvas */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
          <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-white">كيف يعمل مختبر المحاكاة التفاعلي؟</strong>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              يقوم المحرك الكهربائي بحساب مسار الجهد الكهربائي تلقائياً من الطور L إلى الحيادي N. عند النقر على أي زر تشغيل أخضر S1، يمر التيار إلى ملف الكونتاكتور KM1، مما يؤدي فوراً إلى غلق تماس الاستمرارية (13-14) بالتوازي، فيستمر التيار حتى بعد رفع يدك عن الزر! لاختبار قطع الدارة، اضغط على زر الإيقاف S0 أو انقر على الريليه الحراري F1 لتجربة فصل المحرك وإضاءة مصباح العطل الأحمر.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
