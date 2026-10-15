import React, { useState } from 'react';
import { Printer, X, FileText, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedItems: any[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  savedItems
}) => {
  const [projectTitle, setProjectTitle] = useState('مشروع تجهيز منشأة كهربائية ومعمارية');
  const [clientName, setClientName] = useState('العميل / المؤسسة المستفيدة');
  const [engineerName, setEngineerName] = useState('المهندس / الفني المشرف');
  const [inspectionBody, setInspectionBody] = useState('مطابق لمعيار NFC 15-100 / Consuel');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8">
        {/* Modal Top Bar (Hidden in Print) */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950 no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              بطاقة الحساب والتقرير الفني (Fiche Technique de Dimensionnement)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-md shadow-amber-500/20"
            >
              <Printer className="w-4 h-4" />
              طباعة / حفظ كـ PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE REPORT DOCUMENT */}
        <div className="p-8 bg-slate-900 text-slate-100 print:bg-white print:text-black space-y-6">
          {/* Header of document */}
          <div className="border-b-2 border-amber-500 pb-4 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 text-amber-400 print:text-amber-600 font-black text-xl">
                <Zap className="w-6 h-6 fill-current" />
                ElectroPro Engineering Workstation
              </div>
              <p className="text-xs text-slate-400 print:text-slate-600 font-mono mt-0.5">
                مذكرة حسابات كهربائية مطابقة لمعايير NFC 15-100 و IEC 60364
              </p>
            </div>

            <div className="text-left font-mono text-xs text-slate-400 print:text-slate-600">
              <div>التاريخ: {new Date().toLocaleDateString('ar-EG')}</div>
              <div>المرجع: DOC-EL-{Math.floor(1000 + Math.random() * 9000)}</div>
            </div>
          </div>

          {/* Project Details Form / Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-950 print:bg-slate-50 p-4 rounded-xl border border-slate-800 print:border-slate-300">
            <div>
              <span className="text-slate-400 print:text-slate-500 block text-[10px]">عنوان المشروع:</span>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full bg-transparent font-bold text-white print:text-black focus:outline-none border-b border-dashed border-slate-700"
              />
            </div>

            <div>
              <span className="text-slate-400 print:text-slate-500 block text-[10px]">العميل / الجهة المالكة:</span>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-transparent font-bold text-white print:text-black focus:outline-none border-b border-dashed border-slate-700"
              />
            </div>

            <div>
              <span className="text-slate-400 print:text-slate-500 block text-[10px]">المهندس أو الفني المصمم:</span>
              <input
                type="text"
                value={engineerName}
                onChange={(e) => setEngineerName(e.target.value)}
                className="w-full bg-transparent font-bold text-white print:text-black focus:outline-none border-b border-dashed border-slate-700"
              />
            </div>

            <div>
              <span className="text-slate-400 print:text-slate-500 block text-[10px]">معيار الفحص والرقابة:</span>
              <input
                type="text"
                value={inspectionBody}
                onChange={(e) => setInspectionBody(e.target.value)}
                className="w-full bg-transparent font-bold text-white print:text-black focus:outline-none border-b border-dashed border-slate-700 font-mono text-[11px]"
              />
            </div>
          </div>

          {/* Calculations Summary Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 print:text-amber-700 border-b border-slate-800 print:border-slate-300 pb-1">
              جدول نتائج حساب مقاطع الكابلات والحمايات المعتمدة
            </h4>

            {savedItems.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl text-xs text-slate-400">
                لم يتم حفظ أي حسابات بعد. يمكنك الضغط على زر "حفظ النتيجة للتقرير" داخل نافذة حاسبة الكابلات لإضافتها هنا تلقائياً.
              </div>
            ) : (
              <div className="space-y-4">
                {savedItems.map((item, index) => (
                  <div key={index} className="bg-slate-950 print:bg-slate-50 border border-slate-800 print:border-slate-300 rounded-xl p-4 text-xs space-y-3">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-white print:text-black font-mono text-sm">{item.title}</span>
                      <span className="text-emerald-400 print:text-emerald-700 flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        مقطع معتمد: {item.result.standardSectionMm2} مم²
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                      <div className="bg-slate-900 print:bg-white p-2 rounded border border-slate-800 print:border-slate-200">
                        <span className="text-slate-400 print:text-slate-600 block text-[10px]">تيار الاستعمال Ib</span>
                        <span className="font-bold text-white print:text-black">{item.result.designCurrentIb} A</span>
                      </div>
                      <div className="bg-slate-900 print:bg-white p-2 rounded border border-slate-800 print:border-slate-200">
                        <span className="text-slate-400 print:text-slate-600 block text-[10px]">هبوط الجهد ΔU</span>
                        <span className="font-bold text-emerald-400 print:text-emerald-700">{item.result.actualVoltageDropPercent}% ({item.result.actualVoltageDropV}V)</span>
                      </div>
                      <div className="bg-slate-900 print:bg-white p-2 rounded border border-slate-800 print:border-slate-200">
                        <span className="text-slate-400 print:text-slate-600 block text-[10px]">القاطع Disjoncteur</span>
                        <span className="font-bold text-sky-400 print:text-sky-700">{item.result.recommendedBreakerA}A (منحنى {item.result.breakerCurve})</span>
                      </div>
                      <div className="bg-slate-900 print:bg-white p-2 rounded border border-slate-800 print:border-slate-200">
                        <span className="text-slate-400 print:text-slate-600 block text-[10px]">أنبوب Gaine ICTA</span>
                        <span className="font-bold text-amber-400 print:text-amber-700">Ø {item.result.minConduitDiameterIctaMm} مم</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Standards Compliance Stamp */}
          <div className="pt-4 border-t border-slate-800 print:border-slate-300 flex items-center justify-between text-[11px] text-slate-400 print:text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400 print:text-emerald-600" />
              <span>الحسابات مستندة إلى الصيغ الرياضية والجداول المعيارية الصادرة عن IEC 60364 و NFC 15-100.</span>
            </div>
            <div className="font-mono text-[10px]">
              توقيع المهندس المسؤول: __________________
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
