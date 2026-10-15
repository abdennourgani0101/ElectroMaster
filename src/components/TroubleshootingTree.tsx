import React, { useState } from 'react';
import { ELECTRICAL_FAULTS, ELECTRICAL_ISOLATION_STEPS } from '../data/faultsData';
import { DiagnosticFault } from '../types/electrical';
import { 
  Wrench, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Activity, 
  ArrowRight,
  Info
} from 'lucide-react';

interface TroubleshootingTreeProps {
  showFrenchTerms: boolean;
}

export const TroubleshootingTree: React.FC<TroubleshootingTreeProps> = ({ showFrenchTerms }) => {
  const [activeTab, setActiveTab] = useState<'faults' | 'isolation_checklist'>('faults');
  const [selectedFaultId, setSelectedFaultId] = useState<string>('rcd_trips_instantly');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  
  // Isolation Checklist state
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});

  const selectedFault: DiagnosticFault = ELECTRICAL_FAULTS.find(f => f.id === selectedFaultId) || ELECTRICAL_FAULTS[0];

  const handleSelectFault = (id: string) => {
    setSelectedFaultId(id);
    setCurrentStepIndex(0);
  };

  const toggleIsolationStep = (stepNum: number) => {
    setCheckedSteps(prev => ({
      ...prev,
      [stepNum]: !prev[stepNum]
    }));
  };

  const allIsolationStepsCompleted = ELECTRICAL_ISOLATION_STEPS.every(s => checkedSteps[s.stepNumber]);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <Wrench className="w-5 h-5" />
              </span>
              <h2 className="text-lg md:text-xl font-bold text-white">
                دليل تشخيص واكتشاف الأعطال الكهربائية وإجراءات السلامة
              </h2>
              {showFrenchTerms && (
                <span className="text-xs text-slate-400 font-mono">
                  (Diagnostic des Pannes Électriques & Consignation NF C 18-510)
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl">
              شجرة تشخيص تفاعلية خطوة بخطوة للأعطال الأكثر شيوعاً في الميدان الصناعي والسكني، وبروتوكول العزل الكهربائي الخماسي الصارم (Consignation en 5 étapes).
            </p>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setActiveTab('faults')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'faults' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              شجرة تشخيص الأعطال
            </button>
            <button
              onClick={() => setActiveTab('isolation_checklist')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'isolation_checklist' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              بروتوكول السلامة والعزل (Consignation)
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: FAULTS DIAGNOSIS TREE */}
      {activeTab === 'faults' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Fault Selector Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              اختر العطل المراد تشخيصه:
            </h3>

            <div className="space-y-2">
              {ELECTRICAL_FAULTS.map((fault) => {
                const isSelected = fault.id === selectedFaultId;
                return (
                  <div
                    key={fault.id}
                    onClick={() => handleSelectFault(fault.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 shadow-md shadow-amber-500/10'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        fault.category === 'residential' ? 'bg-sky-500/20 text-sky-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {fault.category === 'residential' ? 'سكني (NFC 15-100)' : 'صناعي وكهروميكانيك'}
                      </span>
                    </div>

                    <h4 className={`text-xs font-bold leading-snug ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                      {fault.titleAr}
                    </h4>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Diagnosis Stepper */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-400" />
                {selectedFault.titleAr}
              </h3>
              {showFrenchTerms && (
                <div className="text-xs font-mono text-slate-400 mt-1">
                  {selectedFault.titleFr}
                </div>
              )}
            </div>

            {/* Symptoms & Probable Causes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Info className="w-4 h-4" />
                  الأعراض الظاهرة (Symptômes):
                </span>
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  {selectedFault.symptoms.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-400">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-sky-400 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  الأسباب المحتملة (Causes probables):
                </span>
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  {selectedFault.probableCauses.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-sky-400">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Safety Warning */}
            <div className="bg-rose-950/40 border border-rose-500/40 rounded-xl p-3 text-xs text-rose-300 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong>تحذير أمان صارم: </strong>
                {selectedFault.safetyWarnings.join(' ')}
              </div>
            </div>

            {/* Step By Step Guided Diagnostic Actions */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 block">
                خطوات الفحص الميداني الموصى بها ({selectedFault.diagnosticSteps.length} خطوات):
              </span>

              <div className="space-y-3">
                {selectedFault.diagnosticSteps.map((step) => {
                  return (
                    <div
                      key={step.stepNumber}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs">
                          الخطوة {step.stepNumber}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          الأداة: {step.toolRequired}
                        </span>
                      </div>

                      <div className="text-slate-100 font-semibold leading-relaxed">
                        {step.actionAr}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                        <div className="bg-slate-900 p-2 rounded border border-emerald-500/20 text-emerald-300">
                          <strong>النتيجة السليمة المتوقعة: </strong>
                          {step.expectedResult}
                        </div>
                        <div className="bg-slate-900 p-2 rounded border border-rose-500/20 text-rose-300">
                          <strong>في حال الفشل / العطل: </strong>
                          {step.decisionIfFail}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Final Solution Verdict */}
            <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-4 text-xs text-emerald-200">
              <strong className="block text-emerald-400 font-bold mb-1">الحل والعلاج النهائي:</strong>
              {selectedFault.finalRemedyAr}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ISOLATION CHECKLIST (CONSIGNATION EN 5 ÉTAPES) */}
      {activeTab === 'isolation_checklist' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-400" />
                المراحل الخمس الإلزامية للعزل الكهربائي (Consignation Électrique - NF C 18-510)
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                وفقاً للمعيار الدولي، يمنع التدخل في أي منشأة كهربائية قبل استيفاء هذه الخطوات الخمس بالترتيب الدقيق.
              </p>
            </div>

            {/* Safety Confirmation Badge */}
            <div className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
              allIsolationStepsCompleted 
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/30' 
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              <CheckCircle2 className="w-4 h-4" />
              {allIsolationStepsCompleted ? 'المنشأة معزولة وآمنة للعمل بنسبة 100%' : 'المنشأة غير مؤمنة بعد! استكمل الخطوات'}
            </div>
          </div>

          {/* Steps List with Checkboxes */}
          <div className="space-y-4">
            {ELECTRICAL_ISOLATION_STEPS.map((step) => {
              const isChecked = !!checkedSteps[step.stepNumber];
              return (
                <div
                  key={step.stepNumber}
                  onClick={() => toggleIsolationStep(step.stepNumber)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                    isChecked
                      ? 'bg-emerald-950/20 border-emerald-500/50 shadow-sm'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    isChecked ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold' : 'border-slate-600 bg-slate-900'
                  }`}>
                    {isChecked && <CheckCircle2 className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-bold ${isChecked ? 'text-emerald-300' : 'text-white'}`}>
                        {step.titleAr}
                      </h4>
                      <span className="font-mono text-xs text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {step.symbol}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 font-mono">
                      {step.titleFr}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed pt-1">
                      {step.descriptionAr}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
