import React, { useState } from 'react';
import { 
  NFC_ROOM_RULES, 
  CIRCUIT_MATRIX_NFC15100, 
  DIFFERENTIAL_TYPES_GUIDE 
} from '../data/nfc15100Data';
import { 
  Home, 
  Droplets, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Plus, 
  Trash2,
  Info,
  Maximize2
} from 'lucide-react';

interface NfcGuideProps {
  showFrenchTerms: boolean;
}

interface PanelCircuit {
  id: string;
  name: string;
  type: 'lighting' | 'sockets' | 'cooking' | 'water_heater' | 'washing' | 'ev_charger' | 'ac';
  ratingA: number;
  wireGaugeMm2: number;
  rcdGroup: 'rcd1_type_a' | 'rcd2_type_ac' | 'rcd3_type_f';
  powerWatts: number;
}

export const NfcGuide: React.FC<NfcGuideProps> = ({ showFrenchTerms }) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string>('bathroom');
  const [activeSubTab, setActiveSubTab] = useState<'rooms' | 'bathroom_volumes' | 'panel_builder' | 'differential_rules'>('rooms');

  // Interactive Electrical Panel Builder State
  const [circuits, setCircuits] = useState<PanelCircuit[]>([
    { id: '1', name: 'صفيحة الطهي (Plaque de cuisson)', type: 'cooking', ratingA: 32, wireGaugeMm2: 6, rcdGroup: 'rcd1_type_a', powerWatts: 7000 },
    { id: '2', name: 'غسالة الملابس (Lave-linge)', type: 'washing', ratingA: 20, wireGaugeMm2: 2.5, rcdGroup: 'rcd1_type_a', powerWatts: 2200 },
    { id: '3', name: 'مآخذ المطبخ (Prises cuisine)', type: 'sockets', ratingA: 20, wireGaugeMm2: 2.5, rcdGroup: 'rcd1_type_a', powerWatts: 3000 },
    { id: '4', name: 'إنارة الصالون والمطبخ (Éclairage)', type: 'lighting', ratingA: 16, wireGaugeMm2: 1.5, rcdGroup: 'rcd2_type_ac', powerWatts: 600 },
    { id: '5', name: 'مآخذ غرف النوم والصالون', type: 'sockets', ratingA: 20, wireGaugeMm2: 2.5, rcdGroup: 'rcd2_type_ac', powerWatts: 2500 },
    { id: '6', name: 'سخان الماء (Chauffe-eau ECS)', type: 'water_heater', ratingA: 20, wireGaugeMm2: 2.5, rcdGroup: 'rcd2_type_ac', powerWatts: 2400 },
  ]);

  const [newCircuitName, setNewCircuitName] = useState('');
  const [newCircuitType, setNewCircuitType] = useState<PanelCircuit['type']>('sockets');
  const [newCircuitRcd, setNewCircuitRcd] = useState<PanelCircuit['rcdGroup']>('rcd2_type_ac');

  const selectedRoom = NFC_ROOM_RULES.find(r => r.id === selectedRoomId) || NFC_ROOM_RULES[0];

  const handleAddCircuit = () => {
    if (!newCircuitName) return;
    let rating = 16;
    let wire = 1.5;
    let power = 1500;

    if (newCircuitType === 'cooking') {
      rating = 32;
      wire = 6;
      power = 7000;
    } else if (newCircuitType === 'sockets' || newCircuitType === 'water_heater' || newCircuitType === 'washing' || newCircuitType === 'ac') {
      rating = 20;
      wire = 2.5;
      power = 2200;
    } else if (newCircuitType === 'ev_charger') {
      rating = 32;
      wire = 10;
      power = 7400;
    }

    const newCircuit: PanelCircuit = {
      id: Date.now().toString(),
      name: newCircuitName,
      type: newCircuitType,
      ratingA: rating,
      wireGaugeMm2: wire,
      rcdGroup: newCircuitRcd,
      powerWatts: power
    };

    setCircuits([...circuits, newCircuit]);
    setNewCircuitName('');
  };

  const handleDeleteCircuit = (id: string) => {
    setCircuits(circuits.filter(c => c.id !== id));
  };

  // Rule of upstream / downstream for RCD 30mA sizing:
  // Amperage of RCD >= Sum of (Circuits sockets * 0.5 + other circuits * 1)
  const calculateRcdLoading = (group: PanelCircuit['rcdGroup'], rcdRatingA: number = 40) => {
    const groupCircuits = circuits.filter(c => c.rcdGroup === group);
    const downstreamFactorSum = groupCircuits.reduce((acc, c) => {
      const coef = c.type === 'sockets' ? 0.5 : 1.0;
      return acc + c.ratingA * coef;
    }, 0);
    return {
      circuitsCount: groupCircuits.length,
      downstreamFactorSum: Number(downstreamFactorSum.toFixed(1)),
      isOverloaded: downstreamFactorSum > rcdRatingA,
      recommendedRcdA: downstreamFactorSum > 40 ? 63 : 40
    };
  };

  const rcd1Stats = calculateRcdLoading('rcd1_type_a', 40);
  const rcd2Stats = calculateRcdLoading('rcd2_type_ac', 40);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <Home className="w-5 h-5" />
              </span>
              <h2 className="text-lg md:text-xl font-bold text-white">
                دليل ومعايير الكهرباء المعمارية والسكنية (NFC 15-100)
              </h2>
              {showFrenchTerms && (
                <span className="text-xs text-slate-400 font-mono">
                  (Installations Électriques Résidentielles)
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl">
              المرجع الشامل لاشتراطات كل غرفة، أحجام حماية الحمام (Volumes de sécurité)، القواطع التفاضلية 30mA، ومصمم لوحة التوزيع الكهربائي (Tableau Électrique).
            </p>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setActiveSubTab('rooms')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeSubTab === 'rooms' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              اشتراطات الغرف والمساحات
            </button>
            <button
              onClick={() => setActiveSubTab('bathroom_volumes')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeSubTab === 'bathroom_volumes' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              أحجام أمان الحمام (Volumes 0,1,2)
            </button>
            <button
              onClick={() => setActiveSubTab('panel_builder')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeSubTab === 'panel_builder' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              مصمم لوحة التوزيع (Tableau)
            </button>
            <button
              onClick={() => setActiveSubTab('differential_rules')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeSubTab === 'differential_rules' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              أنواع الحمايات التفاضلية 30mA
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: ROOMS EXPLORER */}
      {activeSubTab === 'rooms' && (
        <div className="space-y-6">
          {/* Room Selector Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {NFC_ROOM_RULES.map((room) => {
              const isSelected = room.id === selectedRoomId;
              return (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoomId(room.id)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold mb-1">{room.nameAr.split('(')[0]}</div>
                  <div className="text-[10px] font-mono text-slate-400 truncate">{room.nameFr}</div>
                </button>
              );
            })}
          </div>

          {/* Room Details View */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <span>{selectedRoom.nameAr}</span>
                  {showFrenchTerms && <span className="text-xs font-mono text-slate-400">({selectedRoom.nameFr})</span>}
                </h3>
                <p className="text-xs text-slate-300 mt-1">{selectedRoom.descriptionAr}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-center">
                  <span className="text-[10px] text-slate-400 block">أقصى قاطع</span>
                  <span className="text-xs font-mono font-bold text-sky-400">{selectedRoom.maxProtection}</span>
                </div>
                <div className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-center">
                  <span className="text-[10px] text-slate-400 block">مقاطع الأسلاك</span>
                  <span className="text-xs font-mono font-bold text-amber-400">{selectedRoom.wireGauge}</span>
                </div>
              </div>
            </div>

            {/* Matrix of Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Outlets & Lighting */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-amber-400 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  الحد الأدنى لمآخذ التيار (Prises de courant)
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800">
                  {selectedRoom.minOutlets}
                </p>

                <h4 className="text-xs font-bold text-sky-400 flex items-center gap-2 pt-2">
                  <Info className="w-4 h-4" />
                  نقاط الإنارة والإضاءة السقفية (Éclairage DCL)
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800">
                  {selectedRoom.lightingPoints}
                </p>
              </div>

              {/* Dedicated Circuits & Special Rules */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  الدوائر المخصصة الإلزامية (Circuits spécialisés)
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedRoom.dedicatedCircuits.map((circ, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                      <span>{circ}</span>
                    </li>
                  ))}
                </ul>

                <h4 className="text-xs font-bold text-rose-400 flex items-center gap-2 pt-2">
                  <AlertCircle className="w-4 h-4" />
                  قواعد واشتراطات أمان صارمة يجب مراعاتها
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedRoom.specialRules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0"></span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Standard Matrix Reference Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
              <span>جدول مقاطع الأسلاك والقواطع المعيارية (Tableau 771F - NFC 15-100)</span>
              <span className="text-xs text-amber-400 font-mono">Norme Officielle</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/50">
                    <th className="py-2.5 px-3">نوع الدارة والاستخدام</th>
                    <th className="py-2.5 px-3">المقطع الأدنى للسلك</th>
                    <th className="py-2.5 px-3">القاطع الأقصى المسموح</th>
                    <th className="py-2.5 px-3">الحد الأقصى للنقاط</th>
                    <th className="py-2.5 px-3">صنف التفاضلي 30mA</th>
                    <th className="py-2.5 px-3">أنبوب ICTA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                  {CIRCUIT_MATRIX_NFC15100.map((c, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-sans font-bold text-white">
                        {c.usageAr}
                        {showFrenchTerms && <div className="text-[10px] text-slate-400 font-mono">{c.usageFr}</div>}
                      </td>
                      <td className="py-2.5 px-3 text-amber-400 font-bold">{c.minSectionMm2} مم² Cu</td>
                      <td className="py-2.5 px-3 text-sky-400 font-bold">{c.maxBreakerA} A</td>
                      <td className="py-2.5 px-3 font-sans text-slate-300">{c.maxPoints}</td>
                      <td className="py-2.5 px-3 font-sans text-emerald-400">{c.diffType}</td>
                      <td className="py-2.5 px-3 text-slate-400">{c.standardGaineIcta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BATHROOM SAFETY VOLUMES INTERACTIVE */}
      {activeSubTab === 'bathroom_volumes' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Droplets className="w-5 h-5 text-sky-400" />
              أحجام الأمان في الحمام ودورات المياه (Volumes de sécurité de la Salle d'eau)
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              حسب المادة 701 من المعيار NFC 15-100، يقسم الحمام إلى مناطق حماية لحماية الأشخاص من خطر الصعق الناتج عن انخفاض مقاومة الجلد البشري المبلل بالماء.
            </p>
          </div>

          {/* Interactive Graphical Diagram of Bathroom Volumes */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="text-center font-bold text-xs text-slate-400 mb-4">
              مخطط مقطعي تفاعلي لأحجام الأمان (Coupe verticale des volumes de sécurité)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              {/* Volume 0 */}
              <div className="border-2 border-rose-500/80 bg-rose-950/30 rounded-xl p-4 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-rose-500 text-slate-950 text-xs font-black mb-2">
                    الحجم 0 (Volume 0)
                  </div>
                  <h4 className="text-xs font-bold text-white mb-2">داخل حوض الاستحمام أو أرضية الدش</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                    المحيط الداخلي لحوض الاستحمام (Baignoire) أو أسفل الدش الإيطالي المغمور بالماء.
                  </p>
                </div>
                <div className="bg-slate-900/90 rounded-lg p-2.5 border border-rose-500/30 text-left font-mono text-[10px] space-y-1">
                  <div className="text-rose-400 font-bold">الحماية: IPX7 إلزامي</div>
                  <div className="text-slate-300">الجهد: SELV 12V DC/AC كحد أقصى</div>
                  <div className="text-slate-400">الأجهزة المسموحة: إضاءة مغمورة مخصصة لحوض الجاكوزي فقط. ممنوع أي مفتاح أو مأخذ نهائياً!</div>
                </div>
              </div>

              {/* Volume 1 */}
              <div className="border-2 border-amber-500/80 bg-amber-950/30 rounded-xl p-4 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-xs font-black mb-2">
                    الحجم 1 (Volume 1)
                  </div>
                  <h4 className="text-xs font-bold text-white mb-2">فوق الحوض حتى ارتفاع 2.25م</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                    الفضاء العمودي المحيط برشاش الدش ورذاذ الماء المباشر حتى ارتفاع 2.25 متر من أرضية الحوض.
                  </p>
                </div>
                <div className="bg-slate-900/90 rounded-lg p-2.5 border border-amber-500/30 text-left font-mono text-[10px] space-y-1">
                  <div className="text-amber-400 font-bold">الحماية: IPX4 (أو IPX5 لرذاذ أفقي)</div>
                  <div className="text-slate-300">الجهد: TBTS 12V (محول العزل خارج 0 و 1)</div>
                  <div className="text-slate-400">الأجهزة: سخان ماء لحظي فئة Class III أو سخان أفقي محمي. ممنوع أي مفاتيح أو مآخذ 230V.</div>
                </div>
              </div>

              {/* Volume 2 */}
              <div className="border-2 border-sky-500/80 bg-sky-950/30 rounded-xl p-4 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-sky-500 text-slate-950 text-xs font-black mb-2">
                    الحجم 2 (Volume 2)
                  </div>
                  <h4 className="text-xs font-bold text-white mb-2">60 سم حول الحجم 1 بارتفاع 2.25م</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                    المسافة الآمنة المحيطة بحوض الاستحمام بعرض 60 سم، مع ارتفاع 2.25م من الأرضية.
                  </p>
                </div>
                <div className="bg-slate-900/90 rounded-lg p-2.5 border border-sky-500/30 text-left font-mono text-[10px] space-y-1">
                  <div className="text-sky-400 font-bold">الحماية: IPX4 على الأقل</div>
                  <div className="text-slate-300">الأجهزة: أجهزة تدفئة ومجفف مناشف فئة ثانية (Classe II - عزل مزدوج)</div>
                  <div className="text-slate-400">المآخذ: مسموح فقط بمأخذ الحلاقة المجهز بمحول عزل داخلي (Prise rasoir avec transfo d'isolement).</div>
                </div>
              </div>

              {/* Hors Volume */}
              <div className="border-2 border-emerald-500/80 bg-emerald-950/30 rounded-xl p-4 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-xs font-black mb-2">
                    خارج الأحجام (Hors Volume)
                  </div>
                  <h4 className="text-xs font-bold text-white mb-2">أكثر من 60 سم بعيداً عن حوض الاستحمام</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                    باقي أجزاء الحمام التي لا يصلها رذاذ الماء المباشر (مثل ركن الغسالة أو المدخل).
                  </p>
                </div>
                <div className="bg-slate-900/90 rounded-lg p-2.5 border border-emerald-500/30 text-left font-mono text-[10px] space-y-1">
                  <div className="text-emerald-400 font-bold">الحماية: IPX1 أو IP21</div>
                  <div className="text-slate-300">المآخذ: مآخذ 230V 2P+T قياسية مسموحة</div>
                  <div className="text-slate-400">الشرط الصارم: حماية تفاضلية 30mA لجميع الدوائر دون استثناء وربط متساوي الجهد (LES).</div>
                </div>
              </div>
            </div>
          </div>

          {/* Local Equipotential Bonding (LES) Section */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold text-amber-400 flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4" />
              الربط متساوي الجهد التكميلي الإلزامي (Liaison Équipotentielle Supplémentaire - LES)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              وفقاً لـ NFC 15-100، يجب ربط جميع العناصر المعدنية الموصلة في الحمام بسلك تأريض أخضر/أصفر (مقطع 2.5 مم² تحت أنبوب أو 4 مم² مثبت مباشرة) إلى صندوق الربط متساوي الجهد:
              أنابيب المياه الباردة والساخنة المعدنية، أنابيب الغاز، إطارات الأبواب المعدنية إن وجدت، هيكل حوض الاستحمام المعدني، وشبكة الصرف الصحي المعدنية.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: ELECTRICAL PANEL BUILDER */}
      {activeSubTab === 'panel_builder' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  مصمم وموزع أحمال لوحة التوزيع السكنية (Tableau Électrique)
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  توزيع الدوائر الفرعية تحت القواطع التفاضلية 30mA (Type A و Type AC) والتحقق التلقائي من قاعدة المنبع والمصب (Règle amont/aval).
                </p>
              </div>

              {/* Add New Circuit Inline Form */}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="اسم الدارة (مثلاً: إنارة الحديقة)"
                  value={newCircuitName}
                  onChange={(e) => setNewCircuitName(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
                <select
                  value={newCircuitType}
                  onChange={(e) => setNewCircuitType(e.target.value as any)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="sockets">مآخذ عامة (20A - 2.5mm²)</option>
                  <option value="lighting">إنارة (16A - 1.5mm²)</option>
                  <option value="cooking">صفيحة طهي (32A - 6mm²)</option>
                  <option value="washing">غسالة (20A - 2.5mm²)</option>
                  <option value="water_heater">سخان ماء (20A - 2.5mm²)</option>
                  <option value="ev_charger">شاحن سيارة (32A - 10mm²)</option>
                  <option value="ac">مكيف هواء (20A - 2.5mm²)</option>
                </select>
                <select
                  value={newCircuitRcd}
                  onChange={(e) => setNewCircuitRcd(e.target.value as any)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="rcd1_type_a">تفاضلي 1 (Type A 30mA)</option>
                  <option value="rcd2_type_ac">تفاضلي 2 (Type AC 30mA)</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddCircuit}
                  className="flex items-center gap-1.5 bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs hover:bg-amber-400 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  إضافة
                </button>
              </div>
            </div>

            {/* Differential Rows Visualizer (Like a real DIN rail enclosure) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* ROW 1: RCD TYPE A (30mA) */}
              <div className="bg-slate-950 border-2 border-amber-500/30 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="px-2.5 py-1 bg-amber-500 text-slate-950 font-extrabold text-xs rounded-lg font-mono">
                        RCD 1 (Type A)
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">قاطع تفاضلي 30mA صنف A</h4>
                        <span className="text-[10px] text-slate-400 font-mono">إلزامي لدارات الطهي والغسيل</span>
                      </div>
                    </div>

                    <div className="text-left font-mono text-xs">
                      <span className="text-slate-400 block text-[10px]">حمولة المصب المعيارية:</span>
                      <span className={`font-bold ${rcd1Stats.isOverloaded ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {rcd1Stats.downstreamFactorSum} A / 40A
                      </span>
                    </div>
                  </div>

                  {/* Circuits List inside RCD 1 */}
                  <div className="space-y-2">
                    {circuits.filter(c => c.rcdGroup === 'rcd1_type_a').map((circ) => (
                      <div key={circ.id} className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                          <span className="font-semibold text-slate-200">{circ.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sky-400 font-bold">{circ.ratingA}A</span>
                          <span className="font-mono text-slate-400 text-[11px]">{circ.wireGaugeMm2} مم²</span>
                          <button
                            onClick={() => handleDeleteCircuit(circ.id)}
                            className="text-slate-500 hover:text-rose-400 transition-all p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">القاطع المقترح للمجموعة:</span>
                  <span className="font-mono font-bold text-amber-300">
                    {rcd1Stats.recommendedRcdA}A / 30mA Type A
                  </span>
                </div>
              </div>

              {/* ROW 2: RCD TYPE AC (30mA) */}
              <div className="bg-slate-950 border-2 border-sky-500/30 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="px-2.5 py-1 bg-sky-500 text-slate-950 font-extrabold text-xs rounded-lg font-mono">
                        RCD 2 (Type AC)
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">قاطع تفاضلي 30mA صنف AC</h4>
                        <span className="text-[10px] text-slate-400 font-mono">مخصص للإنارة والمآخذ العامة</span>
                      </div>
                    </div>

                    <div className="text-left font-mono text-xs">
                      <span className="text-slate-400 block text-[10px]">حمولة المصب المعيارية:</span>
                      <span className={`font-bold ${rcd2Stats.isOverloaded ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {rcd2Stats.downstreamFactorSum} A / 40A
                      </span>
                    </div>
                  </div>

                  {/* Circuits List inside RCD 2 */}
                  <div className="space-y-2">
                    {circuits.filter(c => c.rcdGroup === 'rcd2_type_ac').map((circ) => (
                      <div key={circ.id} className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                          <span className="font-semibold text-slate-200">{circ.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sky-400 font-bold">{circ.ratingA}A</span>
                          <span className="font-mono text-slate-400 text-[11px]">{circ.wireGaugeMm2} مم²</span>
                          <button
                            onClick={() => handleDeleteCircuit(circ.id)}
                            className="text-slate-500 hover:text-rose-400 transition-all p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">القاطع المقترح للمجموعة:</span>
                  <span className="font-mono font-bold text-sky-300">
                    {rcd2Stats.recommendedRcdA}A / 30mA Type AC
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DIFFERENTIAL RCD TYPES GUIDE */}
      {activeSubTab === 'differential_rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DIFFERENTIAL_TYPES_GUIDE.map((diff, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 font-black text-xs rounded-lg font-mono">
                    {diff.type}
                  </span>
                  <h4 className="text-sm font-bold text-white">{diff.titleAr}</h4>
                </div>
                <span className="font-mono text-sm text-slate-400 border border-slate-700 px-2 py-0.5 rounded">
                  {diff.symbol}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{diff.descriptionAr}</p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-amber-400 font-bold block mb-1">أمثلة الأجهزة النموذجية:</span>
                <span className="text-xs text-slate-300">{diff.examplesAr}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
