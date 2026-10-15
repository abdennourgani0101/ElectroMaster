export interface StandardArticle {
  id: string;
  articleCode: string;
  category: 'wiring' | 'safety' | 'grounding' | 'protection' | 'special_locations';
  titleAr: string;
  titleFr: string;
  officialClauseSummaryAr: string;
  officialClauseSummaryFr: string;
  keyRules: string[];
  exceptionsAndAllowances: string[];
  practicalFieldAdvice: string;
  roomOrApplication?: string;
  isMandatoryConsuel: boolean;
  relatedToolTab?: string;
  tags: string[];
}

export const NFC_15_100_LIBRARY: StandardArticle[] = [
  // =========================================================================
  // 1. WIRING REGULATIONS (قواعد ولوائح التمديدات والكابلات)
  // =========================================================================
  {
    id: 'art_525_chute_tension',
    articleCode: 'NFC 15-100 §525',
    category: 'wiring',
    titleAr: 'الحدود القصوى المعيارية لهبوط الجهد في المنشآت الكهربائية',
    titleFr: 'Limites admissibles de chute de tension dans les installations BT',
    officialClauseSummaryAr: 'يجب ألا يتجاوز هبوط الجهد بين نقطة تسليم الطاقة (العداد الرئيسي) وأبعد نقطة استهلاك القيم المعيارية المحددة لضمان عمل الأجهزة بكفاءة ومنع التلف الحراري.',
    officialClauseSummaryFr: 'La chute de tension entre l\'origine de l\'installation et le point d\'utilisation ne doit pas dépasser les limites conventionnelles.',
    keyRules: [
      'دوائر الإنارة السكنية والتجارية: هبوط الجهد الأقصى المسموح به هو 3% (أي 6.9V على شبكة 230V، أو 12V على شبكة 400V).',
      'دوائر القوى والمآخذ والمحركات: هبوط الجهد الأقصى هو 5% (أي 11.5V على شبكة 230V، أو 20V على شبكة 400V).',
      'في المنشآت التي تتغذى من محول خاص HTA/BT للمؤسسة: يسمح بهبوط 6% للإنارة و 8% للأحمال الأخرى.',
      'أثناء إقلاع المحركات الحثية الكبيرة: يسمح بتجاوز مؤقت لهبوط الجهد حتى 10% إلى 15% بشرط ألا يؤثر على أجهزة التحكم والكونتاكتورات.'
    ],
    exceptionsAndAllowances: [
      'في الخطوط الطويلة جداً المؤدية لملحقات خارجية نائية (مضخات ري، ملاحق حدائق نائية)، يسمح بزيادة 0.5% إضافية إذا كانت الأجهزة مصممة لتحمل الجهد المنخفض.'
    ],
    practicalFieldAdvice: 'عندما يتجاوز طول الكابل 25 متراً في دوائر 16A أو 20A، انتقل تلقائياً للمقطع الأعلى (من 1.5 مم² إلى 2.5 مم²، أو من 2.5 مم² إلى 4 مم²) لتفادي هبوط الجهد وسخونة الأسلاك.',
    roomOrApplication: 'جميع الدوائر والتمديدات',
    isMandatoryConsuel: true,
    relatedToolTab: 'cables',
    tags: ['525', 'chute de tension', 'هبوط الجهد', 'volts', 'delta u', 'section', 'كابلات', 'طول الكابل', 'voltage drop']
  },
  {
    id: 'art_771_533_sections_conducteurs',
    articleCode: 'NFC 15-100 §771.533',
    category: 'wiring',
    titleAr: 'المقاطع الدنيا للنواقل النحاسية وقيم القواطع المعيارية المخصصة',
    titleFr: 'Section minimale des conducteurs et calibre des disjoncteurs',
    officialClauseSummaryAr: 'تحدد المادة المقاطع الدنيا لأسلاك النحاس لكل نوع من أنواع الدوائر السكنية، والقيمة الاسمية القصوى للقاطع الواقي (Calibre maximal du disjoncteur).',
    officialClauseSummaryFr: 'Tableau des sections minimales des conducteurs en cuivre selon la nature du circuit et le calibre assigné de la protection.',
    keyRules: [
      'دارة الإنارة والتهوية VMC: مقطع 1.5 مم² نحاس مع قاطع آلي 16A كحد أقصى (أو مصهر 10A). الحد الأقصى 8 نقاط إضاءة لكل دارة.',
      'دارة المآخذ العامة 16A: مقطع 1.5 مم² مع قاطع 16A (بحد أقصى 8 مآخذ)، أو مقطع 2.5 مم² مع قاطع 20A (بحد أقصى 12 مأخذاً).',
      'دارة صفيحة الطهي أو الفرن المدمج (Plaque de cuisson): مقطع 6.0 مم² نحاس أحادي الطور مع قاطع 32A كحد أقصى وقاطع تفاضلي من الصنف A.',
      'الدوائر المخصصة الكبرى (غسالة ملابس، غسالة أواني، مجفف، سخان ماء، فرن): مقطع 2.5 مم² مع قاطع 20A مستقل لكل جهاز على حدة.',
      'شواحن السيارات الكهربائية المنزلية (Borne IRVE 7.4 kW): مقطع 10 مم² مع قاطع 40A وقاطع تفاضلي Type F أو Type B.'
    ],
    exceptionsAndAllowances: [
      'يسمح باستخدام أسلاك مقطع 0.75 مم² فقط في دوائر التحكم اللاسلكي والأجراس ذات الجهد المنخفض جداً SELV (أقل من 50V).'
    ],
    practicalFieldAdvice: 'يمنع في المعايير الحديثة دمج أسلاك مقاطع مختلفة في نفس الدارة (مثلاً 1.5 مم² مع 2.5 مم²). دائماً يحسب القاطع على أضعف سلك في الدارة.',
    roomOrApplication: 'لوحة التوزيع والقواطع',
    isMandatoryConsuel: true,
    relatedToolTab: 'cables',
    tags: ['771', '771.533', 'section', 'مقاطع الأسلاك', 'cuivre', 'نحاس', 'disjoncteur', '16A', '20A', '32A', 'قاطع', 'plaque cuisson']
  },
  {
    id: 'art_514_3_code_couleurs',
    articleCode: 'NFC 15-100 §514.3',
    category: 'wiring',
    titleAr: 'الترميز المعياري الإلزامي لألوان النواقل الكهربائية',
    titleFr: 'Code des couleurs normalisé des conducteurs isolés',
    officialClauseSummaryAr: 'تحدد المعايير بدقة صارمة ألوان العوازل البلاستيكية للأسلاك لمنع أي لبس أثناء الصيانة وتفادي حوادث الصعق المميتة.',
    officialClauseSummaryFr: 'Repérage obligatoire des conducteurs par couleurs normalisées pour garantir la sécurité et faciliter les interventions.',
    keyRules: [
      'سلك الحيادي (Neutre N): اللون الأزرق الفاتح (Bleu clair) حصراً وممنوع استخدامه لأي غرض آخر!',
      'سلك الحماية الأرضي (Conducteur de protection PE): اللون المزدوج أخضر مع أصفر (Vert/Jaune) حصراً وممنوع تماماً استعماله كطور أو محايد أو مكوك!',
      'سلك الطور (Phase L): الألوان المفضلة هي البني (Marron)، الأسود (Noir)، أو الأحمر (Rouge). في ثلاثي الطور L1 بني، L2 أسود، L3 رمادي.',
      'أسلاك المكوك والتحكم (Navettes & Retours): تستخدم ألواناً مميزة مثل البرتقالي (Orange)، البنفسجي (Violet)، أو الأبيض.'
    ],
    exceptionsAndAllowances: [
      'في الكابلات الصناعية متعددة النواة السوداء ذات الأرقام (Câbles numérotés): يسمح باستخدام أرقام مطبوعة (1, 2, 3...) على السلك الأسود مع وجوب سلك أخضر/أصفر للتأريض.'
    ],
    practicalFieldAdvice: 'لا تستخدم أبداً شريط لاصق لتغيير هوية سلك أزرق أو أخضر/أصفر لاستعماله كطور؛ مفتش Consuel يرفض التركيب فوراً ويعتبره مخالفة جسيمة من الدرجة الأولى.',
    roomOrApplication: 'التوصيل والأسلاك',
    isMandatoryConsuel: true,
    tags: ['514', 'couleur', 'ألوان الأسلاك', 'bleu', 'neutre', 'vert jaune', 'terre', 'phase', 'marron', 'rouge']
  },
  {
    id: 'art_529_regle_du_tiers_gaines',
    articleCode: 'NFC 15-100 §529.5',
    category: 'wiring',
    titleAr: 'قاعدة الثلث لملء أنابيب ومجاري الأسلاك (Règle du tiers ICTA)',
    titleFr: 'Règle du tiers pour le remplissage des conduits et gaines ICTA',
    officialClauseSummaryAr: 'يشترط ألا تتعدى المساحة الإجمالية المشغولة بالأسلاك المعزولة ثلث المساحة الداخلية للأنبوب لتسهيل السحب والتبديد الحراري.',
    officialClauseSummaryFr: 'La somme des sections totales des conducteurs ne doit pas dépasser le tiers de la section intérieure du conduit.',
    keyRules: [
      'أنبوب ICTA Ø 16 مم: مساحة داخلية ~90 مم²، الحد الأقصى المسموح لسحب الأسلاك هو 3 أسلاك 1.5 مم² فقط.',
      'أنبوب ICTA Ø 20 مم: مساحة داخلية ~155 مم²، يتسع لـ 3 أسلاك 2.5 مم² أو 5 أسلاك 1.5 مم².',
      'أنبوب ICTA Ø 25 مم: مساحة داخلية ~260 مم²، يتسع لـ 3 أسلاك 6 مم² أو 5 أسلاك 2.5 مم².',
      'أنبوب ICTA Ø 32 مم: مخصص لكابلات التغذية الرئيسية (10 مم² إلى 16 مم²) وخطوط العداد العام.'
    ],
    exceptionsAndAllowances: [
      'في المسارات المستقيمة القصيرة جداً (أقل من متر واحد بدون انحناءات)، يسمح بتجاوز طفيف لا يتعدى 40% من السعة الداخلية.'
    ],
    practicalFieldAdvice: 'استخدام سائل التزليق الخاص بسحب الكابلات (Lubrifiant de tirage de câble) وتجنب عمل زوايا حادة 90 درجة بدون انحناء نصف قطري واسع.',
    roomOrApplication: 'التمديدات والأنابيب',
    isMandatoryConsuel: true,
    relatedToolTab: 'formulas',
    tags: ['529', 'gaine', 'icta', 'أنبوب', 'قاعدة الثلث', 'سحب الأسلاك', 'conduit', 'remplissage', 'diamètre']
  },
  {
    id: 'art_558_etel_gtl',
    articleCode: 'NFC 15-100 §558',
    category: 'wiring',
    titleAr: 'الفضاء التقني السكني وخزانة التوزيع (ETEL & GTL)',
    titleFr: 'Espace Technique Électrique du Logement (ETEL) et Gaine Technique (GTL)',
    officialClauseSummaryAr: 'تحدد المادة أبعاد وموقع الفضاء التقني المخصص حصراً للوحات التوزيع الكهربائي والاتصالات في مدخل المسكن لمنع التداخلات والحرائق.',
    officialClauseSummaryFr: 'Caractéristiques dimensionnelles et d\'implantation de l\'ETEL et de la GTL dédiée aux réseaux de puissance et de communication.',
    keyRules: [
      'أبعاد فضاء الـ ETEL الأدنى: عرض 600 مم على الأقل وعمق 250 مم يمتد من الأرضية المشطبة حتى السقف تماماً.',
      'منع مرور الأنابيب غير الكهربائية: يحظر منعاً باتاً مرور أي أنبوب مياه أو غاز أو مجاري صرف صحي أو تدفئة داخل فضاء الـ ETEL أو فوقه.',
      'ارتفاع أجهزة التحكم والقواطع: يجب أن يقع مقبض القاطع الرئيسي العام وقواطع التحكم بين ارتفاع 0.90 متر و 1.80 متر من الأرضية المشطبة (أو 1.30م للأشخاص ذوي الإعاقة PRM).',
      'لوحة الاتصالات (Tableau de communication): إلزامية في أسفل أو جانب الـ GTL وتضم مقابس RJ45 وصندوق الألياف البصرية DTIo.'
    ],
    exceptionsAndAllowances: [
      'في أعمال الترميم والتجديد إذا كانت المساحة ضيقة جداً: يسمح بعرض 450 مم إذا كانت اللوحة لا تتجاوز صفين.'
    ],
    practicalFieldAdvice: 'اختر موقع الـ GTL بالقرب من مدخل المسكن أو في مرآب متصل مباشرة لسهولة الوصول في حالات الطوارئ ولقربها من مسار كابل العداد الرئيسي.',
    roomOrApplication: 'المدخل وخزانة اللوحة الرئيسية',
    isMandatoryConsuel: true,
    tags: ['558', 'gtl', 'etel', 'لوحة رئيسية', 'خزانة', 'tableau communication', 'rj45', 'hauteur disjoncteur']
  },

  // =========================================================================
  // 2. SAFETY GUIDELINES (إرشادات السلامة والوقاية من الصعق والحريق)
  // =========================================================================
  {
    id: 'art_411_protection_chocs',
    articleCode: 'NFC 15-100 §411',
    category: 'safety',
    titleAr: 'الحماية من الصدمات الكهربائية المباشرة وغير المباشرة',
    titleFr: 'Protection contre les chocs électriques (Contacts directs et indirects)',
    officialClauseSummaryAr: 'قواعد حماية الأشخاص ضد ملامسة الأجزاء الحية الحاملة للتيار (تماس مباشر) وملامسة الهياكل المعدنية المشحونة نتيجة عطل عزل (تماس غير مباشر).',
    officialClauseSummaryFr: 'Exigences fondamentales de sécurité pour la protection des personnes contre les contacts directs et indirects.',
    keyRules: [
      'الحماية من التماس المباشر: عزل تام للنواقل الكهربائية، وتغطية جميع أطراف الربط في الصناديق بتصنيف حماية لا يقل عن IP2X أو IPXXB.',
      'سدادات الأمان للأطفال (Éclipses de protection): إلزامية على جميع مآخذ التيار المنزلية لمنع إدخال المسامير أو الأسلاك المعدنية.',
      'الحماية من التماس غير المباشر: ربط جميع الهياكل المعدنية بشبكة التأريض مع القطع التلقائي للتغذية عبر جهاز حماية تفاضلي متبقي (DDR ≤ 30mA).',
      'جهد الأمان الحرج UL: محدد بـ 50V AC في الأماكن الجافة، و 25V AC في الأماكن الرطبة كالحمامات والورش الخارجية.'
    ],
    exceptionsAndAllowances: [
      'الدوائر ذات الجهد المنخفض جداً للأمان (TBTS / SELV ≤ 12V AC) في أحواض الاستحمام لا تتطلب قاطع تفاضلي أو تأريض.'
    ],
    practicalFieldAdvice: 'يجب التأكد من وجود أغطية بلاستيكية واقية على قضبان التوزيع المشطية (Peignes de raccordement) في لوحة التوزيع لمنع التماس العرضي أثناء الصيانة.',
    roomOrApplication: 'إجراءات السلامة العامة',
    isMandatoryConsuel: true,
    relatedToolTab: 'earthing',
    tags: ['411', 'chocs électriques', 'صعق', 'سلامة', 'تماس مباشر', 'sécurité', 'eclipses', 'ip2x', 'protection']
  },
  {
    id: 'art_421_risques_incendie',
    articleCode: 'NFC 15-100 §421',
    category: 'safety',
    titleAr: 'الوقاية من الحرائق الكهربائية والأقواس الطفيلية (AFDD)',
    titleFr: 'Protection contre les incendies et arcs électriques dangereux',
    officialClauseSummaryAr: 'معايير منع نشوب الحرائق الناتجة عن سخونة التوصيلات الكهربائية أو تسرب التيارات المستمرة أو ظهور القوس الكهربائي المتسلسل (Arc électrique).',
    officialClauseSummaryFr: 'Mesures préventives contre les risques d\'incendie causés par des défauts d\'arc ou des surintensités.',
    keyRules: [
      'قواطع كشف القوس الكهربائي (DPFA / AFDD): يوصى بها بشدة لحماية غرف النوم والمنشآت الخشبية والأماكن ذات التراث التاريخي لكشف الشرر الدقيق الذي لا يسقط القواطع العادية.',
      'شد عزم البراغي (Couple de serrage): يجب استخدام مفك عزم معاير لشد براغي القواطع في لوحة التوزيع (عادة 2 إلى 2.5 N.m) لأن الارتخاء هو السبب الأول لـ 80% من حرائق اللوحات!',
      'مواد التركيب المقاومة للهب: يجب أن تكون جميع الصناديق البلاستيكية للأجهزة ولوحات التوزيع مصنوعة من مواد ذاتية الإطفاء مجتازة لاختبار السلك المتوهج (Fil incandescent 850°C).'
    ],
    exceptionsAndAllowances: [
      'في المنشآت العادية غير الخشبية: لا يزال قاطع الـ AFDD موصى به وليس إلزامياً بالكامل في فرنسا باستثناء بعض المباني العامة ERP.'
    ],
    practicalFieldAdvice: 'قم بفحص لوحة التوزيع سنوياً بواسطة كاميرا حرارية (Caméra thermique) لكشف النقاط الساخنة (Points chauds) الناتجة عن ارتخاء براغي التثبيت قبل حدوث اشتعال.',
    roomOrApplication: 'الوقاية من الحرائق',
    isMandatoryConsuel: false,
    tags: ['421', 'incendie', 'حرائق', 'afdd', 'قوس كهربائي', 'points chauds', 'serrage', 'fil incandescent']
  },
  {
    id: 'art_537_coupure_urgence',
    articleCode: 'NFC 15-100 §537',
    category: 'safety',
    titleAr: 'جهاز الفصل العام في حالات الطوارئ (Coupure d\'urgence)',
    titleFr: 'Dispositif de coupure d\'urgence et de sectionnement',
    officialClauseSummaryAr: 'يشترط وجود جهاز قطع عام واحد يتيح لأي شخص في المسكن قطع التيار عن كامل المبنى بحركة يدوية واحدة وسريعة في حالات الخطر أو الصعق أو الحريق.',
    officialClauseSummaryFr: 'Présence obligatoire d\'un dispositif accessible permettant de couper l\'ensemble de l\'installation en une seule manœuvre.',
    keyRules: [
      'القاطع العام للمشترك (AGCP / Disjoncteur de branchement): يعمل كجهاز قطع عام ويفصل جميع الأطوار والحيادي في آن واحد.',
      'سهولة الوصول: يجب أن يكون القاطع العام موجوداً داخل المسكن على ارتفاع بين 0.90م و 1.80م دون الحاجة لصعود سلم أو استخدام مفتاح.',
      'في حال كان العداد والقاطع العام خارج المسكن في الشارع (على بعد أكثر من 30 متراً - Type 2): يجب وضع قاطع عزل عام إضافي (Interrupteur sectionneur d\'arrêt d\'urgence) داخل المسكن مباشرة في لوحة التوزيع.'
    ],
    exceptionsAndAllowances: [
      'لا يسمح بأي استثناء نهائياً لغياب وسيلة القطع العام داخل المسكن!'
    ],
    practicalFieldAdvice: 'تأكد من أن قاطع العزل العام من الصنف ثنائي القطب (Bipolaire 2P) الذي يقطع الطور والحيادي معاً، ومصنف بتيار يتحمل أقصى استطاعة للاشتراك (مثلاً 63A).'
    ,roomOrApplication: 'المدخل واللوحة العامة',
    isMandatoryConsuel: true,
    tags: ['537', 'coupure urgence', 'قطع عام', 'طوارئ', 'agcp', 'disjoncteur branchement', 'sectionneur', 'type 2']
  },
  {
    id: 'art_nfc_18510_consignation',
    articleCode: 'NF C 18-510 §7.1',
    category: 'safety',
    titleAr: 'المراحل الخمس الإلزامية للعزل الكهربائي الآمن (Consignation Électrique)',
    titleFr: 'Les 5 étapes de la consignation électrique hors tension',
    officialClauseSummaryAr: 'البروتوكول المعياري الإلزامي الصارم قبل بدء أي أعمال صيانة أو تركيبات على المنشآت الكهربائية لضمان انعدام الطاقة بنسبة 100%.',
    officialClauseSummaryFr: 'Procédure réglementaire de mise hors tension et de condamnation en cinq opérations successives.',
    keyRules: [
      'المرحلة 1 - الفصل التام (Séparation): عزل جميع مصادر التغذية المحتملة بما فيها المولدات الاحتياطية وعواكس الطاقة الشمسية.',
      'المرحلة 2 - الإقفال الميكانيكي (Condamnation): قفل ذراع القاطع بواسطة قفل شخصي (Cadenas) ووضع لافتة تحذير رسمية.',
      'المرحلة 3 - تحديد موقع العمل (Identification): التأكد البصري من أن الجزء المعزول هو نفسه المستهدف بالصيانة.',
      'المرحلة 4 - التحقق الفعلي من انعدام الجهد (VAT): استخدام جهاز فحص معتمد (Détecteur VAT homologué) واختباره قبل وبعد القياس مباشرة.',
      'المرحلة 5 - التأريض وعمل دارة قصر (MALT & CC): إلزامية في خطوط الجهد المتوسط والمنخفض ذات الأطوال الكبيرة لتفريغ أي شحنات مستحثة.'
    ],
    exceptionsAndAllowances: [
      'في المنشآت السكنية الفردية الصغيرة: يمكن الاكتفاء بالفصل التام والتحقق من انعدام الجهد (VAT) مع نزع المصهر أو إغلاق خزانة اللوحة بالمفتاح.'
    ],
    practicalFieldAdvice: 'لا تستخدم أبداً مسبار فحص الجهد البسيط (Tournevis testeur à néon) للتحقق من انعدام الجهد؛ فهو غير معتمد ويسبب حوادث مميتة. استعمل حصراً جهاز VAT حقيقي أو ملتيميتر CAT III / CAT IV.',
    roomOrApplication: 'إجراءات العزل والصيانة',
    isMandatoryConsuel: true,
    relatedToolTab: 'troubleshooting',
    tags: ['18-510', 'consignation', 'عزل كهربائي', 'vat', 'سلامة مهنية', 'قفل', 'cadenas', 'mise hors tension', 'malt']
  },

  // =========================================================================
  // 3. GROUNDING REQUIREMENTS (متطلبات التأريض والربط متساوي الجهد)
  // =========================================================================
  {
    id: 'art_411_5_mise_a_la_terre',
    articleCode: 'NFC 15-100 §411.5',
    category: 'grounding',
    titleAr: 'اشتراطات شبكة التأريض وقيمة مقاومة الأرضي القصوى Ra',
    titleFr: 'Prise de terre et valeur maximale de la résistance Ra',
    officialClauseSummaryAr: 'تحدد شروط تنفيذ قطب التأريض والحد الأقصى لمقاومة الأرضي لضمان عمل القواطع التفاضلية قبل وصول الجهد إلى قيمة خطرة على جسم الإنسان.',
    officialClauseSummaryFr: 'Exigences relatives à la réalisation de la prise de terre et à la résistance maximale admise selon la sensibilité du DDR.',
    keyRules: [
      'شرط الأمان المعياري في نظام TT: حاصل ضرب مقاومة الأرضي Ra في حساسية القاطع التفاضلي IΔn يجب ألا يتجاوز جهد الأمان UL: (Ra × IΔn ≤ UL).',
      'في وجود قاطع عام تفاضلي بحساسية 500mA وجهد أمان 50V: القيمة القصوى المطلقة لمقاومة الأرضي هي 100 أوم (Ra ≤ 100 Ω).',
      'يوصى بشدة في الممارسة الهندسية بألا تتجاوز مقاومة الأرضي 30 أوم لضمان استقرار الأجهزة الإلكترونية وتصريف الصواعق.',
      'مقطع سلك التأريض الرئيسي (Conducteur de terre): نحاس عاري 25 مم² مدفون، أو نحاس معزول أخضر/أصفر 16 مم².',
      'بارة القياس والفصل (Barrette de mesure / Coupure): إلزامية لتمكين مفتشي Consuel من قياس مقاومة الأرضي بمفرده بمعزل عن المبنى.'
    ],
    exceptionsAndAllowances: [
      'إذا كانت التربة صخرية جافة وتعذر النزول تحت 100 أوم: يجب خفض حساسية القاطع العام أو استخدام قواطع تفاضلية 30mA لجميع الخطوط دون استثناء.'
    ],
    practicalFieldAdvice: 'أفضل طريقة للتأريض هي عمل حلقة تأريض نحاسية عارية في قاع حفرة الأساسات (Boucle à fond de fouille 25mm² Cu) أثناء مرحلة البناء، أو دق وتد تأريض فولاذي مجلفن بعمق لا يقل عن 2 متر في تربة رطبة.',
    roomOrApplication: 'شبكة التأريض',
    isMandatoryConsuel: true,
    relatedToolTab: 'earthing',
    tags: ['411.5', 'terre', 'تأريض', 'ra', '100 ohms', 'مقاومة الأرضي', 'barrette coupure', 'piquet de terre', 'boucle fond de fouille']
  },
  {
    id: 'art_543_section_conducteur_pe',
    articleCode: 'NFC 15-100 §543',
    category: 'grounding',
    titleAr: 'تحديد المقطع المعياري لسلك الحماية والتأريض (PE)',
    titleFr: 'Section minimale des conducteurs de protection (PE)',
    officialClauseSummaryAr: 'تحدد المعادلة المعيارية كيفية حساب مقطع سلك الحماية الأرضي PE المتصل بكل دارة بناءً على مقطع سلك الطور المغذي.',
    officialClauseSummaryFr: 'Règle de dimensionnement de la section du conducteur de protection en fonction de la section des conducteurs de phase.',
    keyRules: [
      'إذا كان مقطع سلك الطور S_phase ≤ 16 مم²: يجب أن يكون سلك التأريض PE مساوياً لمقطع الطور تماماً (SPE = Sph).',
      'إذا كان مقطع سلك الطور بين 16 مم² و 35 مم²: يكون مقطع سلك التأريض PE ثابتاً عند 16 مم² نحاس.',
      'إذا كان مقطع سلك الطور S_phase > 35 مم²: يكون مقطع سلك التأريض مساوياً لنصف مقطع الطور (SPE = Sph / 2).',
      'يمنع منعاً باتاً تركيب أي وسيلة قطع أو مفتاح أو مصهر على مسار سلك التأريض PE!'
    ],
    exceptionsAndAllowances: [
      'يمكن تدقيق مقطع سلك التأريض بطريقة الحساب الحراري الأدياباتي (Méthode adiabatique S = √(I²t) / k) إذا رغب المصمم في توفير النحاس.'
    ],
    practicalFieldAdvice: 'في جميع التركيبات السكنية والصناعية حتى 16 مم²، احتفظ دائماً بسلك الأرضي بنفس مقطع سلك الطور لضمان تحمل تيار القصر دون انصهار.',
    roomOrApplication: 'الأسلاك والحماية',
    isMandatoryConsuel: true,
    tags: ['543', 'pe', 'section pe', 'سلك الحماية', 'تأريض', 'conducteur protection', 'vert jaune']
  },
  {
    id: 'art_415_2_liaisons_equipotentielles',
    articleCode: 'NFC 15-100 §415.2',
    category: 'grounding',
    titleAr: 'الربط متساوي الجهد الرئيسي والتكميلي (LEP & LES)',
    titleFr: 'Liaisons équipotentielles principale (LEP) et supplémentaire (LES)',
    officialClauseSummaryAr: 'إلزامية توصيل جميع العناصر المعدنية الهيكلية للمبنى بشبكة التأريض لإلغاء أي فرق جهد كهربائي بينها في حال حدوث عطل عزل.',
    officialClauseSummaryFr: 'Obligation d\'interconnecter tous les éléments métalliques du bâtiment à la terre pour éviter toute différence de potentiel.',
    keyRules: [
      'الربط متساوي الجهد الرئيسي (LEP): يربط عند مدخل المبنى: أنابيب المياه المعدنية الرئيسية، أنابيب الغاز المعدنية، هياكل المصاعد، والأعمدة الفولاذية للمبنى.',
      'سلك الـ LEP: يجب أن يكون سلك نحاس أخضر/أصفر بمقطع لا يقل عن نصف مقطع كابل التغذية الرئيسي وبحد أدنى 6 مم² إلى 10 مم².',
      'الربط متساوي الجهد التكميلي في الحمام (LES): يربط داخل كل حمام: أنابيب المياه الباردة والساخنة المعدنية، أنابيب التدفئة، هيكل حوض الاستحمام المعدني، ومجاري الصرف المعدنية.',
      'سلك الـ LES: سلك نحاسي 2.5 مم² تحت أنبوب، أو 4 مم² مثبت مباشرة بمشابك.'
    ],
    exceptionsAndAllowances: [
      'إذا كانت شبكة السباكة منفذة بالكامل من أنابيب بلاستيكية غير موصلة (PEX / PER / Multicouche): لا يتطلب ربط الأنابيب ولكن يجب التأكد من عدم وجود مقاطع معدنية متصلة بالأرض.'
    ],
    practicalFieldAdvice: 'استخدم مشابك تأريض نحاسية مخصصة (Colliers de mise à la terre) ذات شريط معدني محكم وتجنب اللحام بالقصدير العادي على أنابيب المياه.',
    roomOrApplication: 'الحمام وهيكل المبنى',
    isMandatoryConsuel: true,
    tags: ['415', 'lep', 'les', 'ربط متساوي الجهد', 'équipotentielle', 'حمامات', 'أنابيب معدنية', 'تأريض تكميلي']
  },

  // =========================================================================
  // 4. PROTECTION DEVICES (أجهزة الحماية والقواطع والصواعق)
  // =========================================================================
  {
    id: 'art_531_ddr_30ma',
    articleCode: 'NFC 15-100 §531.2',
    category: 'protection',
    titleAr: 'اشتراطات القواطع والمفاتيح التفاضلية عالية الحساسية 30mA',
    titleFr: 'Dispositifs différentiels à courant résiduel à haute sensibilité (DDR 30mA)',
    officialClauseSummaryAr: 'تفرض المادة حماية جميع دوائر المنشأة السكنية والتجارية بواسطة قواطع تفاضلية متبقية 30mA مع تحديد عددها وأنواعها وقاعدة تحديد شدتها.',
    officialClauseSummaryFr: 'Protection obligatoire de tous les circuits terminaux par des DDR 30mA avec règles de répartition et calibres minimaux.',
    keyRules: [
      'الحد الأدنى لعدد القواطع التفاضلية 30mA: قاطعان تفاضليان على الأقل لأي مسكن (أحدهما من الصنف Type A إلزامي).',
      'المساكن التي تزيد مساحتها عن 35م² وحتى 100م²: تتطلب ما لا يقل عن 3 قواطع تفاضلية 30mA.',
      'المساكن الأكبر من 100م²: تتطلب 4 قواطع تفاضلية 30mA على الأقل لتوزيع الأحمال.',
      'الحد الأقصى لعدد القواطع الفرعية خلف القاطع التفاضلي الواحد: لا يتجاوز 8 قواطع فرعية في نفس الصف.',
      'قاعدة تحديد شدة القاطع التفاضلي (Règle amont/aval): إما أن تكون شدة التفاضلي ≥ تيار القاطع العام (Amont)، أو شدة التفاضلي ≥ مجموع (تيارات مآخذ المصب × 0.5 + تيارات الدوائر الأخرى × 1).'
    ],
    exceptionsAndAllowances: [
      'دوائر الأجهزة الحساسة كالخوادم والإنذار وأجهزة التجميد: يوصى بحمايتها بقواطع تفاضلية مستقلة عالية المناعة Type F (Hpi) لمنع انقطاع التيار غير المبرر.'
    ],
    practicalFieldAdvice: 'ضع دارة الإنارة ودارة المآخذ لنفس الغرفة تحت قاطعين تفاضليين مختلفين، حتى إذا سقط تفاضلي المآخذ لا يغرق المكان في الظلام.',
    roomOrApplication: 'لوحة التوزيع',
    isMandatoryConsuel: true,
    relatedToolTab: 'nfc',
    tags: ['531', 'ddr', '30ma', 'تفاضلي', 'interrupteur différentiel', 'type a', 'type ac', 'amont aval', 'regle amont']
  },
  {
    id: 'art_434_pouvoir_coupure',
    articleCode: 'NFC 15-100 §434',
    category: 'protection',
    titleAr: 'الحماية من قصر الدارة وقدرة القطع (Pouvoir de coupure Icu / Icn)',
    titleFr: 'Protection contre les courts-circuits et pouvoir de coupure minimal',
    officialClauseSummaryAr: 'يشترط أن تكون قدرة القطع الاسمية لجميع القواطع أكبر من أو تساوي تيار القصر الأقصى المتوقع (Icc max) عند نقطة التركيب لمنع انفجار القاطع.',
    officialClauseSummaryFr: 'Le pouvoir de coupure de chaque dispositif de protection doit être au moins égal au courant de court-circuit présumé au point d\'installation.',
    keyRules: [
      'في المنشآت السكنية الفردية: قدرة قطع القواطع القياسية المعتمدة هي 3000A (3kA) أو 4500A (4.5kA) حسب معيار NF EN 60898.',
      'في المنشآت الصناعية والمباني القريبة من محطة التحويل HTA/BT: يجب ألا تقل قدرة القطع عن 10kA إلى 25kA أو استخدام مبدأ التتالي (Filiation / Cascading).',
      'منحنيات القطع المغناطيسي: منحنى C (Courbe C) قياسي لجميع الأحمال العادية، منحنى D للأحمال ذات تيار البدء العالي كالمحركات، ومنحنى B للخطوط الطويلة جداً.'
    ],
    exceptionsAndAllowances: [
      'مبدأ التتالي (Filiation): يسمح باستخدام قاطع ذي قدرة قطع أقل إذا كان القاطع الرئيسي قبله يحد من تيار القصر بدرجة كافية حسب جداول الصانع.'
    ],
    practicalFieldAdvice: 'لا تستخدم أبداً قواطع منحنى D في دوائر المآخذ المنزلية العادية؛ لأنها لن تفصل سريعاً عند حدوث تماس ضعيف في نهاية كابل طويل.',
    roomOrApplication: 'القواطع والحمايات',
    isMandatoryConsuel: true,
    tags: ['434', 'court-circuit', 'pouvoir de coupure', 'icc', 'قصر الدارة', 'قدرة القطع', 'courbe c', 'courbe d']
  },
  {
    id: 'art_443_parafoudres_spd',
    articleCode: 'NFC 15-100 §443 & §534',
    category: 'protection',
    titleAr: 'إلزامية واشتراطات مانعات الصواعق الكهربائية (Parafoudres SPD)',
    titleFr: 'Obligation et mise en œuvre des parafoudres de protection (SPD)',
    officialClauseSummaryAr: 'تحدد الحالات الإلزامية لتركيب مانع صواعق لحماية الأجهزة الإلكترونية المنزلية والصناعية من الجهد الزائد العابر الناتج عن الصواعق (Surtensions atmosphériques).',
    officialClauseSummaryFr: 'Conditions de mise en œuvre obligatoire des parafoudres BT selon la densité de foudroiement AQ et les caractéristiques du site.',
    keyRules: [
      'مانع الصواعق إلزامي في أي مبنى مجهز بصارية مانع صواعق خارجية على السطح (Paratonnerre) بغض النظر عن موقعه الجغرافي.',
      'مانع الصواعق إلزامي في جميع المناطق الجغرافية المصنفة ذات كثافة صواعق عالية (مستوى الصواعق AQ2 حيث Nk > 25 يوم رعدي في السنة) إذا كان المبنى يتغذى بخط هوائي جزئياً أو كلياً.',
      'مانع الصواعق إلزامي لأي شخص يعتمد في المنزل على أجهزة طبية تبقيه على قيد الحياة (Assistance médicale à domicile).',
      'طول أسلاك ربط مانع الصواعق (قاعدة 50 سم): المسافة الإجمالية بين طور التغذية، مانع الصواعق، وبارة الأرضي يجب ألا تتجاوز 50 سم لتقليل المعاوقة الحثية.'
    ],
    exceptionsAndAllowances: [
      'إذا كانت التغذية الكهربائية للمبنى بالكامل تحت الأرض (Enterrée) من محطة التحويل في منطقة غير معرّضة للصواعق: يظل مانع الصواعق اختيارياً وموصى به للأجهزة الحساسة.'
    ],
    practicalFieldAdvice: 'مانع الصواعق يتطلب دائماً قاطع فصل مخصص (Disjoncteur de déconnexion) يوضع قبله مباشرة لعزله في حال تلف خرطوشته الداخلية واحتراقها.',
    roomOrApplication: 'لوحة التوزيع ومدخل التغذية',
    isMandatoryConsuel: true,
    tags: ['443', '534', 'parafoudre', 'صواعق', 'مانع صواعق', 'spd', 'surtension', 'جهد عابر', 'foudre', 'linky']
  },

  // =========================================================================
  // 5. SPECIAL LOCATIONS & ROOMS (الفضاءات الخاصة والسكنية)
  // =========================================================================
  {
    id: 'art_701_salles_de_bain',
    articleCode: 'NFC 15-100 §701',
    category: 'special_locations',
    titleAr: 'أحجام واشتراطات السلامة الصارمة في الحمامات ودورات المياه',
    titleFr: 'Emplacements contenant une baignoire ou une douche (Volumes de sécurité)',
    officialClauseSummaryAr: 'تحديد أحجام الأمان (Volumes 0, 1, 2) والأجهزة المسموح والمحظور تركيبها في فضاءات الاستحمام لتفادي حوادث الغرق والصعق.',
    officialClauseSummaryFr: 'Règles spécifiques d\'installation dans les locaux contenant une baignoire ou une douche.',
    keyRules: [
      'الحجم 0 (داخل الحوض أو أرضية الدش): يمنع أي جهاز كهربائي باستثناء أجهزة SELV 12V بتصنيف حماية IPX7.',
      'الحجم 1 (فوق الحوض حتى ارتفاع 2.25م): مسموح فقط بسخان ماء فوري Class III أو أجهزة SELV 12V بتصنيف IPX4 (أو IPX5 لرذاذ الماء الأفقي). يمنع أي مفتاح أو مأخذ 230V.',
      'الحجم 2 (مسافة 60 سم حول الحجم 1 بارتفاع 2.25م): مسموح بأجهزة تدفئة ومجفف مناشف معزولة فئة ثانية Class II، ومآخذ الحلاقة المجهزة بمحول عزل SELV. يمنع أي مأخذ 230V قياسي.',
      'خارج الأحجام (Hors Volume): يسمح بالمآخذ العادية 230V 2P+T بشرط حمايتها بقاطع تفاضلي 30mA.',
      'الربط متساوي الجهد المحلي (LES) إلزامي لجميع العناصر المعدنية داخل الحمام.'
    ],
    exceptionsAndAllowances: [
      'في الحمامات المزودة بدش إيطالي بدون حوض مرئي: يحسب الحجم 1 بنصف قطر 120 سم من نقطة رشاش الدش الثابت على الجدار.'
    ],
    practicalFieldAdvice: 'إذا كان مفتاح إضاءة الحمام سيوضع في الداخل، يجب أن يوضع في منطقة Hors Volume على بعد أكثر من 60 سم من حافة حوض الاستحمام، أو استخدام مفتاح سحب بحبل معزول (Tirage cordon) أو تحكم بلمس عازل.',
    roomOrApplication: 'الحمام ودورات المياه',
    isMandatoryConsuel: true,
    relatedToolTab: 'nfc',
    tags: ['701', 'salle de bain', 'حمام', 'volumes', 'دش', 'baignoire', 'ipx4', 'ipx7', 'volume 0', 'volume 1', 'volume 2']
  },
  {
    id: 'art_771_cuisine_prises',
    articleCode: 'NFC 15-100 §771.53',
    category: 'special_locations',
    titleAr: 'اشتراطات المطبخ والمآخذ فوق طاولة العمل والدوائر الكبرى',
    titleFr: 'Équipement minimal de la cuisine et circuits spécialisés',
    officialClauseSummaryAr: 'قواعد التوزيع الإلزامية للمآخذ في المطبخ ومواضعها فوق سطح العمل والدوائر المخصصة للأجهزة الكهربائية ذات الاستهلاك العالي.',
    officialClauseSummaryFr: 'Nombre et disposition minimale des prises de courant en cuisine et règles des circuits spécialisés.',
    keyRules: [
      'الحد الأدنى لمآخذ التيار غير المخصصة: 6 مآخذ تيار على الأقل في المطبخ، 4 منها يجب أن توضع مباشرة فوق طاولة العمل (Plan de travail).',
      'منع مآخذ الماء والحرارة: يحظر تماماً تركيب أي مأخذ كهربائي مباشرة فوق حوض غسيل الأواني (Évier) أو فوق موقد الطهي (Plaques de cuisson).',
      'ارتفاع مآخذ طاولة العمل: بين 8 سم و 25 سم فوق سطح العمل المشطب.',
      'دارة الطهي: دارة 32A بمقطع 6 مم² مع قاطع تفاضلي Type A إلزامي.',
      'الدوائر المستقلة: يجب تخصيص 3 دوائر مستقلة 20A 2.5 مم² على الأقل للأجهزة المنزلية الكبرى (غسالة أواني، فرن، غسالة ملابس/مجفف).'
    ],
    exceptionsAndAllowances: [
      'في المطابخ الصغيرة المفتوحة على الصالون التي تقل مساحتها عن 4 متر²: يمكن خفض عدد مآخذ طاولة العمل إلى 3 مآخذ بدلاً من 4.'
    ],
    practicalFieldAdvice: 'اترك سلكاً احتياطياً إضافياً في صندوق مآخذ المطبخ، حيث يطلب العملاء غالباً مآخذ إضافية لأجهزة تحضير القهوة والميكروويف والخلاطات.',
    roomOrApplication: 'المطبخ',
    isMandatoryConsuel: true,
    relatedToolTab: 'nfc',
    tags: ['771.53', 'cuisine', 'مطبخ', 'plan de travail', 'prises', 'plaque cuisson', 'four', 'lave-vaisselle']
  },
  {
    id: 'art_771_314_reserve_tableau',
    articleCode: 'NFC 15-100 §771.314',
    category: 'special_locations',
    titleAr: 'الاحتياطي الإلزامي للأماكن الشاغرة في لوحة التوزيع (Réserve 20%)',
    titleFr: 'Réserve minimale d\'emplacements disponibles sur le tableau électrique',
    officialClauseSummaryAr: 'تشترط المادة ترك فراغات شاغرة في لوحة التوزيع لاستيعاب أي دوائر كهربائية مستقبلية دون الحاجة لتغيير اللوحة.',
    officialClauseSummaryFr: 'Obligation de prévoir une réserve d\'emplacements modulaires libres pour les extensions futures de l\'installation.',
    keyRules: [
      'في المساكن الفردية (Maison individuelle): يجب ترك نسبة 20% على الأقل من الأماكن النمطية شاغرة (Emplacements libres) بحد أدنى 6 وحدات نمطية (Modules).',
      'في الشقق السكنية الجماعية (Logement collectif): يجب ترك ما لا يقل عن 20% من المساحة الشاغرة.',
      'تغطية الفراغات الشاغرة: يجب تغطية الفراغات بأغطية بلاستيكية معيارية عازلة (Obturateurs) لمنع لمس المشط الكهربائي وتصنيف IP2X.'
    ],
    exceptionsAndAllowances: [
      'في اللوحات الفرعية الصغيرة المخصصة لغرفة واحدة أو ملحق بسيط: يكتفى بـ 2 إلى 3 وحدات شاغرة.'
    ],
    practicalFieldAdvice: 'اختر دائماً لوحة أكبر بصف كامل (مثلاً لوحة 3 صفوف بدلاً من 2 صف) لتسهيل تمديد الكابلات وتجنب الاكتظاظ الحراري داخل اللوحة.',
    roomOrApplication: 'لوحة التوزيع',
    isMandatoryConsuel: true,
    tags: ['771.314', 'reserve', 'tableau', 'لوحة', 'احتياطي 20%', 'modules', 'obturateurs']
  }
];
