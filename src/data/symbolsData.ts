import { ElectricalSymbol } from '../types/electrical';

export const ELECTRICAL_SYMBOLS: ElectricalSymbol[] = [
  // Protection
  {
    id: 'disjoncteur_magneto_thermique',
    nameAr: 'قاطع كهرومغناطيسي لحماية المحركات (Disjoncteur Moteur GV2)',
    nameFr: 'Disjoncteur magnéto-thermique moteur',
    nameEn: 'Motor Protection Circuit Breaker (MPCB)',
    category: 'protection',
    standardRef: 'IEC 60947-2 / NF C 03-201',
    tag: 'Q1',
    terminalMarking: '1/L1-2/T1, 3/L2-4/T2, 5/L3-6/T3',
    descriptionAr: 'يجمع بين الحماية الحرارية (من الحمولات الزائدة عبر شريط ثنائي المعدن Bimetal) والحماية المغناطيسية السريعة (من تيارات القصر القصوى عبر ملف كهرومغناطيسي).',
    svgType: 'motor_breaker'
  },
  {
    id: 'relais_thermique',
    nameAr: 'المرحل الحراري للحماية من فرط الحمل (Relais Thermique)',
    nameFr: 'Relais de protection thermique',
    nameEn: 'Thermal Overload Relay',
    category: 'protection',
    standardRef: 'IEC 60947-4-1',
    tag: 'F1',
    terminalMarking: 'قوى: 1-2, 3-4, 5-6 | تحكم: 95-96 (NC), 97-98 (NO)',
    descriptionAr: 'يحمي المحرك من السخونة الزائدة الناتجة عن الحمل الميكانيكي الزائد أو انقطاع أحد الأطوار. التماس 95-96 يقطع دارة التحكم عند العطل، بينما 97-98 يضيء مصباح الإشارة الأحمر.',
    svgType: 'thermal_relay'
  },
  {
    id: 'fusible_am',
    nameAr: 'مصهر حماية المحركات (Fusible aM - accompagnement Moteur)',
    nameFr: 'Fusible cartouche aM',
    nameEn: 'aM Cartridge Fuse',
    category: 'protection',
    standardRef: 'IEC 60269',
    tag: 'F0 / F2',
    terminalMarking: '1 - 2',
    descriptionAr: 'مصهر بطيء مخصص لتحمل قمم تيار الإقلاع العالية للمحركات دون أن يحترق، مخصص حصراً للحماية من تيارات القصر (Court-circuit). يرمز له باللون الأخضر.',
    svgType: 'fuse'
  },
  {
    id: 'disjoncteur_differentiel_ddr',
    nameAr: 'القاطع التفاضلي للحماية من التسرب الأرضي (Disjoncteur Différentiel DDR)',
    nameFr: 'Disjoncteur différentiel (RCBO)',
    nameEn: 'Residual Current Circuit Breaker with Overcurrent (RCBO)',
    category: 'protection',
    standardRef: 'IEC 61009-1 / NFC 15-100',
    tag: 'Q_diff',
    terminalMarking: 'N-1, N-2, Test (T)',
    descriptionAr: 'يكشف التيارات المتسربة للأرض لحماية الأشخاص من الصعق الكهربائي (عتبة 30mA للأشخاص و300mA/500mA للحرائق)، بالإضافة للحماية من الحمل الزائد والماس.',
    svgType: 'rcd_breaker'
  },

  // Control & Actuation
  {
    id: 'contacteur_bobine',
    nameAr: 'ملف الكونتاكتور الكهرومغناطيسي (Bobine de Contacteur)',
    nameFr: 'Bobine de contacteur',
    nameEn: 'Contactor Coil',
    category: 'control',
    standardRef: 'IEC 60617-7',
    tag: 'KM1 / KM2',
    terminalMarking: 'A1 - A2 (24V AC/DC, 230V AC)',
    descriptionAr: 'الملف المغناطيسي الذي يجذب القلب الحديدي المتحرك ليغلق نقاط التلامس الرئيسية في دارة القدرة ونقاط التلامس المساعدة في دارة التحكم.',
    svgType: 'contactor_coil'
  },
  {
    id: 'contact_aux_no',
    nameAr: 'تماس مساعد مفتوح طبيعياً - استمرارية (Contact Auxiliaire NO 13-14)',
    nameFr: 'Contact auxiliaire NO (Auto-maintien)',
    nameEn: 'Normally Open Auxiliary Contact (13-14)',
    category: 'control',
    standardRef: 'IEC 60617-7',
    tag: 'KM1 (13-14)',
    terminalMarking: '13 - 14 (أو .3 - .4)',
    descriptionAr: 'يستعمل لتحقيق دارة الاستمرارية الذاتية (Auto-maintien / Latch) بحيث يستمر الكونتاكتور في العمل بعد رفع الإصبع عن زر التشغيل الأخضر.',
    svgType: 'contact_no'
  },
  {
    id: 'contact_aux_nc',
    nameAr: 'تماس مساعد مغلق طبيعياً - قفل كهربائي (Contact Auxiliaire NC 21-22)',
    nameFr: 'Contact auxiliaire NC (Verrouillage)',
    nameEn: 'Normally Closed Auxiliary Contact (21-22)',
    category: 'control',
    standardRef: 'IEC 60617-7',
    tag: 'KM1 (21-22)',
    terminalMarking: '21 - 22 (أو .1 - .2)',
    descriptionAr: 'يستعمل للقفل الكهربائي المتبادل (Verrouillage électrique) في دوائر عكس الاتجاه ودائرة نجمي-مثلثي لمنع تشغيل كونتاكتورين متعارضين في نفس اللحظة.',
    svgType: 'contact_nc'
  },
  {
    id: 'bouton_poussoir_marche',
    nameAr: 'زر ضغط للتشغيل مفتوح في الراحة (Bouton Poussoir NO Vert)',
    nameFr: 'Bouton poussoir Marche (NO)',
    nameEn: 'Start Pushbutton (NO Green)',
    category: 'control',
    standardRef: 'IEC 60617',
    tag: 'S1 / S2',
    terminalMarking: '3 - 4',
    descriptionAr: 'زر غير مستقر بلون أخضر، عند الضغط عليه يغلق التماس ليمرر التيار لملف التشغيل.',
    svgType: 'pushbutton_no'
  },
  {
    id: 'bouton_poussoir_arret',
    nameAr: 'زر ضغط للإيقاف مغلق في الراحة (Bouton Poussoir NC Rouge)',
    nameFr: 'Bouton poussoir Arrêt (NC)',
    nameEn: 'Stop Pushbutton (NC Red)',
    category: 'control',
    standardRef: 'IEC 60617',
    tag: 'S0',
    terminalMarking: '1 - 2',
    descriptionAr: 'زر غير مستقر أحمر، موصول على التوالي في بداية دارة التحكم لقطع التيار عن جميع الملفات عند الضغط عليه.',
    svgType: 'pushbutton_nc'
  },
  {
    id: 'arret_urgence',
    nameAr: 'زر توقف الطوارئ برأس فطر وقفل (Arrêt d\'Urgence Coup de poing)',
    nameFr: 'Arrêt d\'urgence à verrouillage mécanique',
    nameEn: 'Emergency Stop Mushroom Button',
    category: 'control',
    standardRef: 'ISO 13850 / IEC 60947-5-5',
    tag: 'S_AU',
    terminalMarking: '1 - 2 (NC Action positive)',
    descriptionAr: 'زر أحمر بارز على خلفية صفراء، عند ضربه يفتح الدائرة ميكانيكياً ويثبت مقفلاً ولا يعود إلا بالتدوير أو بمفتاح خاص، لضمان أعلى مستويات الأمان الصناعي.',
    svgType: 'emergency_stop'
  },
  {
    id: 'temporisateur_travail',
    nameAr: 'مؤقت زمني عند التشغيل (Temporisateur Travail TON)',
    nameFr: 'Contact temporisé au travail (TON)',
    nameEn: 'On-Delay Timer Contact',
    category: 'control',
    standardRef: 'IEC 60617-7',
    tag: 'KA1 / KT1',
    terminalMarking: '55-56 (NC temp), 67-68 (NO temp)',
    descriptionAr: 'يبدأ العد التنازلي بمجرد تغذية ملفه، ولا يغير حالة تماساته إلا بعد انقضاء المهلة الزمنية المضبوطة (ضروري في دائرة نجمي-مثلثي Y-Δ).',
    svgType: 'timer_ton'
  },

  // Power & Motors
  {
    id: 'moteur_asynchrone_tri',
    nameAr: 'محرك حثي ثلاثي الطور بقفص سنجاب (Moteur Asynchrone Triphasé)',
    nameFr: 'Moteur asynchrone triphasé à cage',
    nameEn: '3-Phase Squirrel Cage Induction Motor',
    category: 'motors',
    standardRef: 'IEC 60034 / IEC 60617',
    tag: 'M1 (3~)',
    terminalMarking: 'U1, V1, W1 / U2, V2, W2 + PE',
    descriptionAr: 'المحرك القياسي الأكثر استخداماً في الصناعة بنسبة تفوق 90%، يتميز بالقوة وقلة الصيانة وتغيير اتجاه الدوران بعكس طورين.',
    svgType: 'motor_3ph'
  },
  {
    id: 'variateur_frequence',
    nameAr: 'مغير التردد للتحكم بالسرعة (Variateur de Vitesse VFD)',
    nameFr: 'Variateur électronique de fréquence',
    nameEn: 'Variable Frequency Drive (VFD)',
    category: 'power',
    standardRef: 'IEC 61800',
    tag: 'U1 / ATV',
    terminalMarking: 'دخل: R/L1, S/L2, T/L3 | خرج: U, V, W | تحكم: LI1, LI2, +24V, AI1, 10V',
    descriptionAr: 'محول إلكتروني ذكي يتحكم في سرعة وعزم المحرك بدقة بالغة عبر توليد ترددات وجهود متناسبة (f & U).',
    svgType: 'vfd_drive'
  },

  // Architectural
  {
    id: 'interrupteur_va_et_vient',
    nameAr: 'مفتاح إنارة ذهاب وإياب (Interrupteur Va-et-Vient)',
    nameFr: 'Interrupteur Va-et-Vient (Schéma 6)',
    nameEn: 'Two-Way Switch / 3-Way Switch',
    category: 'architectural',
    standardRef: 'NF C 03-201 / IEC 60617-11',
    tag: 'SA1',
    terminalMarking: 'L (Phase) - 1, 2 (Navettes)',
    descriptionAr: 'يسمح بالتحكم في نقطة إضاءة واحدة من مكانين مختلفين (مثلاً مدخل الغرفة وبجانب السرير أو طرفي الممر).',
    svgType: 'va_et_vient'
  },
  {
    id: 'telerupteur',
    nameAr: 'القاطع النبضي للتحكم بأزرار متعددة (Télérupteur modulaire)',
    nameFr: 'Télérupteur électromécanique ou électronique',
    nameEn: 'Impulse Latching Relay (Step Relay)',
    category: 'architectural',
    standardRef: 'NF C 03-201',
    tag: 'TL1',
    terminalMarking: 'ملف: A1 - A2 | تلامس: 1 - 2',
    descriptionAr: 'يركب في لوحة التوزيع، يتيح التحكم في الإنارة من عدد غير محدود من أزرار الدفع (Boutons Poussoirs) الموزعة على ممر أو صالة كبيرة.',
    svgType: 'telerupteur'
  },
  {
    id: 'prise_courant_2p_t',
    nameAr: 'مأخذ تيار قياسي مع أرضي (Prise de courant 2P+T)',
    nameFr: 'Socle de prise de courant avec contact de terre',
    nameEn: 'AC Socket Outlet with Earth Pin (Type E / F)',
    category: 'architectural',
    standardRef: 'NF C 61-314 / NFC 15-100',
    tag: 'PC1',
    terminalMarking: 'Ph (طور) - N (حيادي) - PE (أرضي)',
    descriptionAr: 'مأخذ قياسي مزود بدبوس تأريض وسدادات حماية للأطفال (Éclipses de protection) لمنع إدخال أي جسم غريب.',
    svgType: 'socket_2pt'
  }
];
