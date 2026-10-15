import React, { useState, useMemo } from 'react';
import { ELECTRICAL_SYMBOLS } from '../data/symbolsData';
import { ElectricalSymbol } from '../types/electrical';
import { 
  Layers, 
  Search, 
  Filter, 
  Info, 
  CheckCircle2, 
  Award,
  Sparkles
} from 'lucide-react';

interface SymbolsGlossaryProps {
  showFrenchTerms: boolean;
}

// Render SVG electrical symbols dynamically
const renderSymbolSvg = (svgType: string) => {
  switch (svgType) {
    case 'motor_breaker': // Disjoncteur moteur GV2
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-amber-400 fill-none stroke-2">
          {/* Main Contacts */}
          <line x1="50" y1="10" x2="50" y2="35" />
          <line x1="50" y1="35" x2="65" y2="60" strokeWidth="2.5" />
          <line x1="50" y1="65" x2="50" y2="90" />
          {/* Thermal square hook */}
          <path d="M 45 42 L 55 42 L 55 48 L 45 48" stroke="currentColor" fill="none" />
          {/* Magnetic arrow / Cross */}
          <line x1="42" y1="52" x2="48" y2="58" stroke="#38bdf8" />
          <line x1="48" y1="52" x2="42" y2="58" stroke="#38bdf8" />
        </svg>
      );
    case 'thermal_relay': // Relais thermique
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-rose-400 fill-none stroke-2">
          <line x1="50" y1="10" x2="50" y2="30" />
          {/* Bimetal rectangular hook */}
          <path d="M 40 30 L 60 30 L 60 45 L 40 45 L 40 60 L 60 60" />
          <line x1="50" y1="60" x2="50" y2="90" />
        </svg>
      );
    case 'fuse': // Fusible
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-amber-400 fill-none stroke-2">
          <line x1="50" y1="15" x2="50" y2="30" />
          <rect x="35" y="30" width="30" height="40" className="stroke-amber-400 fill-slate-900" />
          <line x1="50" y1="30" x2="50" y2="70" />
          <line x1="50" y1="70" x2="50" y2="85" />
        </svg>
      );
    case 'contactor_coil': // Bobine KM
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-sky-400 fill-none stroke-2">
          <line x1="50" y1="10" x2="50" y2="30" />
          <rect x="30" y="30" width="40" height="40" className="stroke-sky-400 fill-slate-900" />
          <line x1="30" y1="30" x2="70" y2="70" strokeWidth="1" stroke="#64748b" />
          <line x1="50" y1="70" x2="50" y2="90" />
          <text x="36" y="24" fill="#94a3b8" fontSize="10" stroke="none">A1</text>
          <text x="36" y="86" fill="#94a3b8" fontSize="10" stroke="none">A2</text>
        </svg>
      );
    case 'contact_no': // Contact NO 13-14
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-emerald-400 fill-none stroke-2">
          <line x1="50" y1="15" x2="50" y2="40" />
          <line x1="50" y1="40" x2="70" y2="60" strokeWidth="2.5" />
          <circle cx="50" cy="65" r="3" fill="#22c55e" />
          <line x1="50" y1="65" x2="50" y2="85" />
          <text x="34" y="35" fill="#94a3b8" fontSize="10" stroke="none">13</text>
          <text x="34" y="75" fill="#94a3b8" fontSize="10" stroke="none">14</text>
        </svg>
      );
    case 'contact_nc': // Contact NC 21-22
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-rose-400 fill-none stroke-2">
          <line x1="50" y1="15" x2="50" y2="40" />
          <line x1="50" y1="40" x2="65" y2="60" strokeWidth="2.5" />
          <line x1="60" y1="60" x2="70" y2="60" />
          <line x1="65" y1="60" x2="50" y2="65" />
          <line x1="50" y1="65" x2="50" y2="85" />
          <text x="34" y="35" fill="#94a3b8" fontSize="10" stroke="none">21</text>
          <text x="34" y="75" fill="#94a3b8" fontSize="10" stroke="none">22</text>
        </svg>
      );
    case 'pushbutton_no': // BP Marche
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-emerald-400 fill-none stroke-2">
          <line x1="50" y1="15" x2="50" y2="40" />
          <line x1="45" y1="40" x2="55" y2="40" />
          <line x1="50" y1="40" x2="70" y2="60" strokeWidth="2.5" />
          <line x1="50" y1="65" x2="50" y2="85" />
          {/* Pushbutton hat */}
          <line x1="40" y1="48" x2="40" y2="56" />
          <line x1="36" y1="48" x2="44" y2="48" />
        </svg>
      );
    case 'pushbutton_nc': // BP Arrêt
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-rose-400 fill-none stroke-2">
          <line x1="50" y1="15" x2="50" y2="38" />
          <line x1="50" y1="38" x2="65" y2="58" strokeWidth="2.5" />
          <line x1="50" y1="60" x2="50" y2="85" />
          {/* Pushbutton hat */}
          <line x1="40" y1="45" x2="40" y2="53" />
          <line x1="36" y1="45" x2="44" y2="45" />
        </svg>
      );
    case 'motor_3ph': // Moteur 3~
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-amber-400 fill-none stroke-2">
          <circle cx="50" cy="50" r="32" className="stroke-amber-400 fill-slate-900" />
          <text x="44" y="48" fill="#f59e0b" fontSize="16" fontWeight="bold" stroke="none">M</text>
          <text x="42" y="66" fill="#38bdf8" fontSize="12" fontWeight="bold" stroke="none">3 ~</text>
        </svg>
      );
    case 'vfd_drive': // Variateur de vitesse
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-sky-400 fill-none stroke-2">
          <rect x="20" y="20" width="60" height="60" className="stroke-sky-400 fill-slate-900" />
          <line x1="20" y1="20" x2="80" y2="80" strokeWidth="1" stroke="#64748b" />
          {/* AC to DC and DC to AC symbols */}
          <text x="28" y="42" fill="#f59e0b" fontSize="12" stroke="none">~</text>
          <text x="38" y="40" fill="#f59e0b" fontSize="10" stroke="none">=</text>
          <text x="54" y="70" fill="#38bdf8" fontSize="10" stroke="none">=</text>
          <text x="64" y="72" fill="#38bdf8" fontSize="12" stroke="none">~</text>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-slate-400 fill-none stroke-2">
          <circle cx="50" cy="50" r="28" />
          <line x1="30" y1="50" x2="70" y2="50" />
        </svg>
      );
  }
};

export const SymbolsGlossary: React.FC<SymbolsGlossaryProps> = ({ showFrenchTerms }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSymbol, setSelectedSymbol] = useState<ElectricalSymbol | null>(ELECTRICAL_SYMBOLS[0]);

  // Categories
  const categories = [
    { id: 'all', label: 'الكل (Tous)' },
    { id: 'protection', label: 'الحماية (Protection)' },
    { id: 'control', label: 'التحكم (Commande)' },
    { id: 'motors', label: 'المحركات والقدرة (Moteurs)' },
    { id: 'architectural', label: 'المعمارية (Bâtiment)' },
  ];

  const filteredSymbols = useMemo(() => {
    return ELECTRICAL_SYMBOLS.filter((s) => {
      const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        s.nameAr.toLowerCase().includes(q) ||
        s.nameFr.toLowerCase().includes(q) ||
        s.nameEn.toLowerCase().includes(q) ||
        s.tag.toLowerCase().includes(q) ||
        s.standardRef.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <Layers className="w-5 h-5" />
              </span>
              <h2 className="text-lg md:text-xl font-bold text-white">
                مكتبة الرموز والمخططات الكهربائية المعيارية (IEC 60617 / NF)
              </h2>
              {showFrenchTerms && (
                <span className="text-xs text-slate-400 font-mono">
                  (Symboles Électriques Normalisés & Repérage des Bornes)
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl">
              مرجع شامل للرموز الصناعية والمعمارية مع ترقيم الأطراف القياسي (13-14 NO، 21-22 NC، 95-96 حراري، A1-A2) وشرح وظيفي مفصل.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="بحث باسم الرمز، Q1, KM1..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800 overflow-x-auto text-xs font-semibold">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === c.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Symbols Cards + Symbol Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Symbols Grid */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredSymbols.map((symbol) => {
            const isSelected = selectedSymbol?.id === symbol.id;
            return (
              <div
                key={symbol.id}
                onClick={() => setSelectedSymbol(symbol)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center justify-between shadow-md ${
                  isSelected
                    ? 'bg-slate-900 border-amber-400 shadow-amber-500/10'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className="w-full flex items-center justify-between text-[10px] font-mono mb-2">
                  <span className="bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-bold">
                    {symbol.tag}
                  </span>
                  <span className="text-slate-500">{symbol.category}</span>
                </div>

                {/* SVG Visual */}
                <div className="my-2 p-2 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-center">
                  {renderSymbolSvg(symbol.svgType)}
                </div>

                <div className="w-full mt-2">
                  <h4 className="text-xs font-bold text-white line-clamp-1">
                    {symbol.nameAr}
                  </h4>
                  {showFrenchTerms && (
                    <p className="text-[10px] text-slate-400 font-mono line-clamp-1 mt-0.5">
                      {symbol.nameFr}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Inspector Panel */}
        <div className="lg:col-span-5">
          {selectedSymbol ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-28 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-mono text-amber-400 font-extrabold bg-amber-400/10 px-2 py-0.5 rounded">
                    {selectedSymbol.tag}
                  </span>
                  <h3 className="text-base font-extrabold text-white mt-1">
                    {selectedSymbol.nameAr}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono">
                    {selectedSymbol.nameFr} / {selectedSymbol.nameEn}
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                  {renderSymbolSvg(selectedSymbol.svgType)}
                </div>
              </div>

              {/* Terminal Markings */}
              {selectedSymbol.terminalMarking && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-[11px] text-amber-400 font-bold block">
                    ترقيم الأطراف القياسي (Repérage normalisé des bornes):
                  </span>
                  <div className="font-mono text-sm text-sky-400 font-bold">
                    {selectedSymbol.terminalMarking}
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans">
                    وفق معيار ترقيم التماسات IEC (مثال: أرقام فردية للدخول 1-3-5، وزوجية للخروج 2-4-6).
                  </p>
                </div>
              )}

              {/* Function and Description */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-white block">الوظيفة الهندسية والاستخدام:</span>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                  {selectedSymbol.descriptionAr}
                </p>
              </div>

              {/* Standard Reference Clause */}
              <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between border-t border-slate-800 pt-3">
                <span>المرجع المعياري:</span>
                <span className="text-slate-200 font-bold">{selectedSymbol.standardRef}</span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 text-xs">
              اختر رمزاً من القائمة للاطلاع على تفاصيل ترقيم أطرافه واستخداماته.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
