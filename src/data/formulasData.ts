export interface ElectricalFormula {
  category: 'general' | 'three_phase' | 'motors' | 'cables' | 'transformers';
  titleAr: string;
  titleFr: string;
  latexOrFormula: string;
  variables: { symbol: string; nameAr: string; unit: string }[];
  applicationTipAr: string;
}

export const ELECTRICAL_FORMULAS: ElectricalFormula[] = [
  {
    category: 'general',
    titleAr: 'قانون أوم الأساسي والقدرة الكهربائية المستمرة',
    titleFr: 'Loi d\'Ohm et Puissance en continu',
    latexOrFormula: 'U = R × I  |  P = U × I = R × I² = U² / R',
    variables: [
      { symbol: 'U', nameAr: 'فرق الجهد الكهربائي', unit: 'فولت (V)' },
      { symbol: 'I', nameAr: 'شدة التيار الكهربائي', unit: 'أمبير (A)' },
      { symbol: 'R', nameAr: 'المقاومة الأومية', unit: 'أوم (Ω)' },
      { symbol: 'P', nameAr: 'القدرة الفعالة المستهلكة', unit: 'واط (W)' }
    ],
    applicationTipAr: 'الأساس لحساب هبوط الجهد ومعاوقة الخطوط واختيار مقاومات التسخين.'
  },
  {
    category: 'three_phase',
    titleAr: 'القدرة في النظام ثلاثي الطور المتوازن',
    titleFr: 'Puissances en Triphasé équilibré (P, Q, S)',
    latexOrFormula: 'P = √3 × U × I × cos φ  |  Q = √3 × U × I × sin φ  |  S = √3 × U × I = √(P² + Q²)',
    variables: [
      { symbol: 'P', nameAr: 'القدرة الفعالة الحقيقية (Active)', unit: 'واط أو كيلوواط (kW)' },
      { symbol: 'Q', nameAr: 'القدرة الارتكاسية التفاعلية (Réactive)', unit: 'فار أو كيلوفار (kVAR)' },
      { symbol: 'S', nameAr: 'القدرة الظاهرية الكلية (Apparente)', unit: 'فولت أمبير أو كيلوفولت أمبير (kVA)' },
      { symbol: 'U', nameAr: 'الجهد المركب بين طورين (Tension composée)', unit: 'فولت (V e.g. 400V)' },
      { symbol: 'cos φ', nameAr: 'معامل الاستطاعة أو القدرة (Facteur de puissance)', unit: 'بدون وحدة (0 إلى 1)' }
    ],
    applicationTipAr: 'لحساب تيار الخط الاسمي الذي يمر في الكابل، نقسم القدرة بالكيلوواط على (1.732 × 400 × cos φ).'
  },
  {
    category: 'motors',
    titleAr: 'سرعة التزامن والانزلاق في المحركات الحثية',
    titleFr: 'Vitesse de synchronisme et Glissement (Ns & g)',
    latexOrFormula: 'Ns = (60 × f) / p  |  g = (Ns - N) / Ns × 100%',
    variables: [
      { symbol: 'Ns', nameAr: 'السرعة التزامنية للمجال الدوار', unit: 'دورة في الدقيقة (tr/min أو RPM)' },
      { symbol: 'f', nameAr: 'تردد الشبكة الكهربائية', unit: 'هرتز (Hz e.g. 50Hz)' },
      { symbol: 'p', nameAr: 'عدد أزواج الأقطاب المغناطيسية (Paires de pôles)', unit: 'عدد صحيح (1, 2, 3, 4)' },
      { symbol: 'N', nameAr: 'السرعة الميكانيكية الفعلية للدوار (Rotor)', unit: 'دورة في الدقيقة (RPM)' },
      { symbol: 'g', nameAr: 'معامل الانزلاق (Glissement)', unit: 'نسبة مئوية (%)' }
    ],
    applicationTipAr: 'عند 50Hz: محرك ذو زوج أقطاب واحد (p=1) سرعته Ns=3000 RPM (فعلي 2880)، زوجين (p=2) سرعته Ns=1500 RPM (فعلي 1440).'
  },
  {
    category: 'motors',
    titleAr: 'العزم الميكانيكي على محور المحرك',
    titleFr: 'Couple utile moteur (C)',
    latexOrFormula: 'C = P / Ω = (9550 × P_kW) / N_rpm',
    variables: [
      { symbol: 'C', nameAr: 'عزم الدوران الميكانيكي المفيد', unit: 'نيوتن متر (N.m)' },
      { symbol: 'P_kW', nameAr: 'القدرة الميكانيكية على عمود الدوران', unit: 'كيلوواط (kW)' },
      { symbol: 'N_rpm', nameAr: 'سرعة دوران المحرك الفعلية', unit: 'دورة في الدقيقة (tr/min)' },
      { symbol: 'Ω', nameAr: 'السرعة الزاوية (2 × π × N / 60)', unit: 'راديان/ثانية (rad/s)' }
    ],
    applicationTipAr: 'كلما زاد عدد الأقطاب قلت السرعة وزاد العزم بنفس القدرة، وهو سر تفضيل محركات 1000 و750 RPM للأحمال الثقيلة.'
  },
  {
    category: 'cables',
    titleAr: 'مقاومة الناقل الكهربائي وهبوط الجهد',
    titleFr: 'Résistance linéique et Chute de tension',
    latexOrFormula: 'R = ρ × (L / S)  |  ΔU = b × ( (ρ/S) × cos φ + λ × sin φ ) × L × Ib',
    variables: [
      { symbol: 'ρ (رو)', nameAr: 'المقاومة النوعية للنحاس (0.0225) أو الألومنيوم (0.036)', unit: 'Ω.mm²/m' },
      { symbol: 'L', nameAr: 'طول الكابل', unit: 'متر (m)' },
      { symbol: 'S', nameAr: 'مقطع السلك', unit: 'مم² (mm²)' },
      { symbol: 'b', nameAr: 'معامل الطور: 2 لأحادي الطور، و 1.732 (√3) لثلاثي الطور', unit: 'بدون وحدة' }
    ],
    applicationTipAr: 'حسب معيار NFC 15-100: الحد الأقصى المسموح به لهبوط الجهد هو 3% لدوائر الإنارة و5% للقوى والمحركات.'
  },
  {
    category: 'transformers',
    titleAr: 'سعة مكثفات تحسين معامل القدرة (Batterie de Condensateurs)',
    titleFr: 'Compensation de l\'énergie réactive (Qc)',
    latexOrFormula: 'Qc = P × (tan φ1 - tan φ2)  |  C_delta = Qc / (3 × 2 × π × f × U²)',
    variables: [
      { symbol: 'Qc', nameAr: 'استطاعة مكثفات التعويض', unit: 'كيلوفار (kVAR)' },
      { symbol: 'P', nameAr: 'القدرة الفعالة الكلية للمنشأة', unit: 'كيلوواط (kW)' },
      { symbol: 'tan φ1', nameAr: 'ظل زاوية الطور قبل التحسين', unit: 'بدون وحدة' },
      { symbol: 'tan φ2', nameAr: 'ظل زاوية الطور المستهدفة (مثلاً cos φ = 0.95)', unit: 'بدون وحدة' }
    ],
    applicationTipAr: 'رفع معامل القدرة إلى ما فوق 0.93 يجنب المنشأة الصناعية دفع غرامات استهلاك الطاقة الارتكاسية في الفاتورة.'
  }
];

export const RESISTOR_COLOR_CODES = [
  { color: 'أسود (Noir)', colorHex: '#000000', digit: 0, multiplier: 1, tolerance: null },
  { color: 'بني (Brun)', colorHex: '#8B4513', digit: 1, multiplier: 10, tolerance: '±1%' },
  { color: 'أحمر (Rouge)', colorHex: '#EF4444', digit: 2, multiplier: 100, tolerance: '±2%' },
  { color: 'برتقالي (Orange)', colorHex: '#F97316', digit: 3, multiplier: 1000, tolerance: null },
  { color: 'أصفر (Jaune)', colorHex: '#EAB308', digit: 4, multiplier: 10000, tolerance: null },
  { color: 'أخضر (Vert)', colorHex: '#22C55E', digit: 5, multiplier: 100000, tolerance: '±0.5%' },
  { color: 'أزرق (Bleu)', colorHex: '#3B82F6', digit: 6, multiplier: 1000000, tolerance: '±0.25%' },
  { color: 'بنفسجي (Violet)', colorHex: '#A855F7', digit: 7, multiplier: 10000000, tolerance: '±0.1%' },
  { color: 'رمادي (Gris)', colorHex: '#6B7280', digit: 8, multiplier: 100000000, tolerance: '±0.05%' },
  { color: 'أبيض (Blanc)', colorHex: '#F3F4F6', digit: 9, multiplier: 1000000000, tolerance: null },
  { color: 'ذهبي (Or)', colorHex: '#D4AF37', digit: null, multiplier: 0.1, tolerance: '±5%' },
  { color: 'فضي (Argent)', colorHex: '#C0C0C0', digit: null, multiplier: 0.01, tolerance: '±10%' }
];
