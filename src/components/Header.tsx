import React from 'react';
import { 
  Zap, 
  Calculator, 
  Home, 
  Cpu, 
  ShieldCheck, 
  BookOpen, 
  HelpCircle, 
  FileText, 
  Wrench, 
  Activity,
  Layers
} from 'lucide-react';

export type ActiveTab = 
  | 'cables'
  | 'circuit_lab'
  | 'circuits'
  | 'standards_library'
  | 'nfc'
  | 'motor_simulator'
  | 'industrial_calc'
  | 'earthing'
  | 'symbols'
  | 'formulas'
  | 'troubleshooting'
  | 'quiz';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  showFrenchTerms: boolean;
  setShowFrenchTerms: (val: boolean | ((prev: boolean) => boolean)) => void;
  onOpenReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  showFrenchTerms,
  setShowFrenchTerms,
  onOpenReport
}) => {
  const tabs = [
    { id: 'cables' as ActiveTab, label: 'حساب الكابلات وهبوط الجهد', sub: 'Câbles & Chute ΔU', icon: Calculator },
    { id: 'circuit_lab' as ActiveTab, label: 'رسم وتجريب الدوائر (مختبر)', sub: 'Labo de Simulation', icon: Cpu },
    { id: 'circuits' as ActiveTab, label: 'مخططات الدوائر الشائعة', sub: 'Schémas des Circuits', icon: Layers },
    { id: 'standards_library' as ActiveTab, label: 'مكتبة معايير NFC 15-100', sub: 'Normes & Articles', icon: BookOpen },
    { id: 'nfc' as ActiveTab, label: 'دليل السكن ولوحة التوزيع', sub: 'Guide Bâtiment', icon: Home },
    { id: 'motor_simulator' as ActiveTab, label: 'محاكي إقلاع المحركات', sub: 'Démarrage Moteurs', icon: Activity },
    { id: 'industrial_calc' as ActiveTab, label: 'حساب المحركات و cos φ', sub: 'Moteurs & Condensateurs', icon: Activity },
    { id: 'earthing' as ActiveTab, label: 'أنظمة التأريض (TT/TN/IT)', sub: 'Régimes de Neutre', icon: ShieldCheck },
    { id: 'symbols' as ActiveTab, label: 'الرموز والمخططات IEC', sub: 'Symboles Électriques', icon: Layers },
    { id: 'formulas' as ActiveTab, label: 'القوانين وجداول الألوان', sub: 'Formules & Résistances', icon: BookOpen },
    { id: 'troubleshooting' as ActiveTab, label: 'تشخيص الأعطال والسلامة', sub: 'Dépannage & Consignation', icon: Wrench },
    { id: 'quiz' as ActiveTab, label: 'اختبار المعارف الكهربائية', sub: 'Quiz Technique', icon: HelpCircle },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl no-print">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <Zap className="w-6 h-6 fill-current animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                ElectroPro
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono">
                  NFC 15-100 / IEC
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              المرجع الشامل للهندسة الكهربائية المعمارية والصناعية والكهروميكانيك
            </p>
          </div>
        </div>

        {/* Global Controls & Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Terminology Toggle Button */}
          <button
            onClick={() => setShowFrenchTerms(prev => !prev)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              showFrenchTerms 
                ? 'bg-blue-950/80 text-blue-300 border-blue-600/60 shadow-sm shadow-blue-500/20' 
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="إظهار المصطلحات التقنية المعيارية بالفرنسية إلى جانب العربية"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            المصطلحات الفنية (Français): {showFrenchTerms ? 'مُفعّلة' : 'مُعطّلة'}
          </button>

          {/* Export Report Sheet */}
          <button
            onClick={onOpenReport}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            تصدير تقرير فني (Fiche de Calcul)
          </button>
        </div>
      </div>

      {/* Navigation Scrollable Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 overflow-x-auto">
        <nav className="flex space-x-1 space-x-reverse min-w-max py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                <span className="text-right">{tab.label}</span>
                {showFrenchTerms && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-slate-900/20 text-slate-900' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.sub}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
