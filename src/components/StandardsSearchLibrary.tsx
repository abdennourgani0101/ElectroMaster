import React, { useState, useMemo } from 'react';
import { NFC_15_100_LIBRARY, StandardArticle } from '../data/nfc15100LibraryData';
import { 
  BookOpen, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  ShieldCheck, 
  Copy, 
  Check,
  FileText,
  Sparkles,
  ExternalLink,
  ClipboardCheck,
  Zap,
  Cable,
  Shield,
  Home
} from 'lucide-react';
import { ActiveTab } from './Header';

interface StandardsSearchLibraryProps {
  showFrenchTerms: boolean;
  onNavigateToTab?: (tab: ActiveTab) => void;
}

export const StandardsSearchLibrary: React.FC<StandardsSearchLibraryProps> = ({ 
  showFrenchTerms,
  onNavigateToTab
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticleId, setSelectedArticleId] = useState<string>(NFC_15_100_LIBRARY[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'library' | 'consuel_checklist'>('library');

  // Consuel Checklist interactive state
  const [consuelChecks, setConsuelChecks] = useState<Record<string, boolean>>({});

  const categories = [
    { 
      id: 'all', 
      label: 'كافة المعايير', 
      sub: 'Toutes les normes', 
      icon: BookOpen,
      count: NFC_15_100_LIBRARY.length 
    },
    { 
      id: 'wiring', 
      label: 'لوائح التمديدات والكابلات', 
      sub: 'Wiring Regulations (§525, §771, §529, §514)', 
      icon: Cable,
      count: NFC_15_100_LIBRARY.filter(a => a.category === 'wiring').length 
    },
    { 
      id: 'safety', 
      label: 'إرشادات السلامة العامة', 
      sub: 'Safety Guidelines (§411, NF C 18-510, §421)', 
      icon: Shield,
      count: NFC_15_100_LIBRARY.filter(a => a.category === 'safety').length 
    },
    { 
      id: 'grounding', 
      label: 'متطلبات التأريض والـ LEP', 
      sub: 'Grounding Requirements (§411.5, §543, §415)', 
      icon: ShieldCheck,
      count: NFC_15_100_LIBRARY.filter(a => a.category === 'grounding').length 
    },
    { 
      id: 'protection', 
      label: 'أجهزة الحماية والصواعق', 
      sub: 'Protection Devices (§531, §434, §443)', 
      icon: Zap,
      count: NFC_15_100_LIBRARY.filter(a => a.category === 'protection').length 
    },
    { 
      id: 'special_locations', 
      label: 'المواقع الخاصة والحمامات', 
      sub: 'Special Locations (§701, §771.53, §771.314)', 
      icon: Home,
      count: NFC_15_100_LIBRARY.filter(a => a.category === 'special_locations').length 
    },
  ];

  const filteredArticles = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return NFC_15_100_LIBRARY.filter((art) => {
      const matchesCat = selectedCategory === 'all' || art.category === selectedCategory;
      if (!matchesCat) return false;
      if (!q) return true;

      return (
        art.articleCode.toLowerCase().includes(q) ||
        art.titleAr.toLowerCase().includes(q) ||
        art.titleFr.toLowerCase().includes(q) ||
        art.officialClauseSummaryAr.toLowerCase().includes(q) ||
        art.keyRules.some(r => r.toLowerCase().includes(q)) ||
        (art.roomOrApplication && art.roomOrApplication.toLowerCase().includes(q)) ||
        art.tags.some(tag => tag.toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, searchQuery]);

  const activeArticle = NFC_15_100_LIBRARY.find(a => a.id === selectedArticleId) || filteredArticles[0] || NFC_15_100_LIBRARY[0];

  const handleCopyCitation = (art: StandardArticle) => {
    const text = `[${art.articleCode}] ${art.titleAr} (${art.titleFr})\nالاشتراطات المعيارية: ${art.officialClauseSummaryAr}\n\nأهم القواعد:\n${art.keyRules.map(r => '• ' + r).join('\n')}\n(مرجع: ElectroPro - معيار NFC 15-100)`;
    navigator.clipboard.writeText(text);
    setCopiedId(art.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const toggleConsuelCheck = (id: string) => {
    setConsuelChecks(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const consuelScore = Math.round(
    (Object.values(consuelChecks).filter(Boolean).length / NFC_15_100_LIBRARY.length) * 100
  );

  return (
    <div className="space-y-6">
      {/* Top Banner with Search & View Toggle */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <BookOpen className="w-5 h-5" />
              </span>
              <h2 className="text-lg md:text-xl font-bold text-white">
                المكتبة الرقمية للرموز والمعايير الدولية (NFC 15-100 & IEC)
              </h2>
              {showFrenchTerms && (
                <span className="text-xs text-slate-400 font-mono">
                  (Bibliothèque Normative Complète & Textes Réglementaires)
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl">
              محرك بحث فوري في بنود ومواد المعايير: لوائح التمديدات والكابلات (Wiring Regulations)، إرشادات السلامة (Safety Guidelines)، متطلبات التأريض (Grounding)، وأجهزة الحماية (Protection Devices).
            </p>
          </div>

          {/* Quick Search Input & Consuel Toggle */}
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="ابحث برقم المادة (525, 771, 411, 443) أو بكلمة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold shrink-0">
              <button
                onClick={() => setViewMode('library')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'library' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                تصفح المواد
              </button>
              <button
                onClick={() => setViewMode('consuel_checklist')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'consuel_checklist' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
                فحص Consuel
              </button>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-4 pt-3 border-t border-slate-800">
          {categories.map((c) => {
            const Icon = c.icon;
            const isSelected = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-md shadow-amber-500/10'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                    {c.count}
                  </span>
                </div>
                <div className="text-xs font-bold truncate leading-snug">{c.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW 1: REGULAR ARTICLES LIBRARY & READER */}
      {viewMode === 'library' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Matched Articles Cards */}
          <div className="lg:col-span-5 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="font-bold uppercase tracking-wider">
                المواد والبنود المتطابقة ({filteredArticles.length}):
              </span>
              {searchQuery && (
                <span className="text-[10px] text-amber-400 font-mono">
                  بحث: "{searchQuery}"
                </span>
              )}
            </div>

            <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1">
              {filteredArticles.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-400">
                  لم يتم العثور على أي مادة تطابق بحثك. جرب البحث برقم المادة مثل: "525", "771", "411", "443" أو بكلمات مفتاحية.
                </div>
              ) : (
                filteredArticles.map((art) => {
                  const isSelected = art.id === activeArticle?.id;
                  return (
                    <div
                      key={art.id}
                      onClick={() => setSelectedArticleId(art.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-400 shadow-md shadow-amber-500/10'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="font-extrabold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                          {art.articleCode}
                        </span>
                        {art.isMandatoryConsuel && (
                          <span className="bg-rose-500/15 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded text-[9px] font-sans font-bold">
                            إلزامي للفحص Consuel
                          </span>
                        )}
                      </div>

                      <h4 className={`text-xs font-bold leading-snug ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                        {art.titleAr}
                      </h4>

                      {showFrenchTerms && (
                        <p className="text-[10px] text-slate-400 font-mono line-clamp-1">
                          {art.titleFr}
                        </p>
                      )}

                      {art.roomOrApplication && (
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 font-sans">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                          <span>المجال: {art.roomOrApplication}</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Full Standard Clause Reader View */}
          <div className="lg:col-span-7">
            {activeArticle ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-28 space-y-6">
                {/* Top Meta & Actions */}
                <div className="flex items-start justify-between border-b border-slate-800 pb-4 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="px-2.5 py-1 bg-amber-500 text-slate-950 font-black text-xs rounded-lg font-mono">
                        {activeArticle.articleCode}
                      </span>
                      {activeArticle.isMandatoryConsuel && (
                        <span className="text-[10px] font-mono text-rose-300 bg-rose-950/60 border border-rose-500/30 px-2 py-0.5 rounded font-bold">
                          إلزامي لشهادة المطابقة Consuel
                        </span>
                      )}
                      {activeArticle.roomOrApplication && (
                        <span className="text-[10px] text-sky-300 bg-sky-950/60 border border-sky-500/30 px-2 py-0.5 rounded font-mono">
                          {activeArticle.roomOrApplication}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-extrabold text-white mt-2">
                      {activeArticle.titleAr}
                    </h3>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      {activeArticle.titleFr}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Link to related engineering tool if present */}
                    {activeArticle.relatedToolTab && onNavigateToTab && (
                      <button
                        onClick={() => onNavigateToTab(activeArticle.relatedToolTab as any)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 transition-all cursor-pointer"
                        title="فتح أداة الحساب المرتبطة بهذه المادة المعيارية"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>فتح الحاسبة</span>
                      </button>
                    )}

                    {/* Copy Citation Button */}
                    <button
                      onClick={() => handleCopyCitation(activeArticle)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
                      title="نسخ نص الاستشهاد بالمعيار لملف المشروع أو التقرير"
                    >
                      {copiedId === activeArticle.id ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400">تم النسخ!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>نسخ الاستشهاد</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Official Clause Summary */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    النص الملخص للمادة المعيارية الرسمية:
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-serif">
                    "{activeArticle.officialClauseSummaryAr}"
                  </p>
                  {showFrenchTerms && (
                    <p className="text-[11px] text-slate-400 font-mono italic pt-1 border-t border-slate-800/60">
                      "{activeArticle.officialClauseSummaryFr}"
                    </p>
                  )}
                </div>

                {/* Key Rules List */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    الشروط والاشتراطات الفنية الإلزامية للمادة:
                  </span>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {activeArticle.keyRules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                        <span className="leading-relaxed">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exceptions & Allowances */}
                {activeArticle.exceptionsAndAllowances.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                      <Info className="w-4 h-4" />
                      الاستثناءات والتسامحات المعيارية المسموح بها:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {activeArticle.exceptionsAndAllowances.map((ex, idx) => (
                        <li key={idx} className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 text-[11px] text-slate-300">
                          • {ex}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Practical Field Experience Advice */}
                <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-xl p-4 text-xs space-y-1">
                  <span className="text-amber-400 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    نصيحة كهربائي خبير في الميدان (Conseil d'Électricien):
                  </span>
                  <p className="text-slate-200 leading-relaxed text-[11px]">
                    {activeArticle.practicalFieldAdvice}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
                اختر مادة من القائمة للاطلاع على كامل نصوصها واشتراطاتها المعيارية.
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: INTERACTIVE CONSUEL INSPECTION CHECKLIST */}
      {viewMode === 'consuel_checklist' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-amber-400" />
                قائمة التحقق الميدانية لاعتماد المنشأة (Checklist de Conformité Consuel)
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                تأكد من استيفاء هذه البنود الـ 12 الإلزامية قبل استدعاء مفتش الرقابة (Consuel) للحصول على شهادة مطابقة الكهرباء دون أي ملاحظات سالبة.
              </p>
            </div>

            {/* Score Badge */}
            <div className="flex items-center gap-3">
              <div className="text-left font-mono">
                <span className="text-[10px] text-slate-400 block font-sans">نسبة الجاهزية:</span>
                <span className={`text-base font-black ${consuelScore >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {consuelScore}% ({Object.values(consuelChecks).filter(Boolean).length}/{NFC_15_100_LIBRARY.length})
                </span>
              </div>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-3">
            {NFC_15_100_LIBRARY.map((art) => {
              const isChecked = !!consuelChecks[art.id];
              return (
                <div
                  key={art.id}
                  onClick={() => toggleConsuelCheck(art.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                    isChecked
                      ? 'bg-emerald-950/20 border-emerald-500/50 shadow-sm'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    isChecked ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold' : 'border-slate-600 bg-slate-900'
                  }`}>
                    {isChecked && <Check className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-amber-400 font-mono text-xs">
                        {art.articleCode}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {art.category}
                      </span>
                    </div>

                    <h4 className={`text-sm font-bold ${isChecked ? 'text-emerald-300' : 'text-white'}`}>
                      {art.titleAr}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed text-[11px] pt-1">
                      {art.officialClauseSummaryAr}
                    </p>

                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80 text-[11px] text-slate-400 mt-2">
                      <strong className="text-amber-300 font-sans">شرط التحقق الإلزامي: </strong>
                      {art.keyRules[0]}
                    </div>
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
