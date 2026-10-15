import { NfcRoomRule } from '../types/electrical';

export const NFC_ROOM_RULES: NfcRoomRule[] = [
  {
    id: 'living_room',
    nameAr: 'غرفة المعيشة والصالون (Séjour / Salon)',
    nameFr: 'Séjour / Salon',
    iconName: 'Sofa',
    descriptionAr: 'الفضاء الرئيسي في المنزل؛ يخضع لقاعدة مساحة الغرفة لتحديد عدد المآخذ مع وجوب مآخذ RJ45 لشبكة الاتصالات.',
    minOutlets: 'مأخذ واحد لكل 4 متر² بمجموع لا يقل عن 5 مآخذ (إذا كانت المساحة أكبر من 28م²: ما لا يقل عن 7 مآخذ). مأخذ إضافي بجانب كل مأخذ RJ45.',
    lightingPoints: 'نقطة إضاءة واحدة على الأقل في السقف مزودة بمقبس DCL (Boîte de connexion de luminaire).',
    dedicatedCircuits: ['دارة مآخذ عامة (2.5mm² حتى 12 مأخذ مع قاطع 20A)', 'دارة مآخذ تلفزيون / وسائط متعددة', 'دارة تدفئة كهربائية مخصصة إذا وجدت'],
    maxProtection: 'قاطع 16A لأسلاك 1.5mm² (حتى 8 مآخذ) أو قاطع 20A لأسلاك 2.5mm² (حتى 12 مأخذ)',
    wireGauge: '1.5 مم² أو 2.5 مم²',
    specialRules: [
      'توفير مأخذي شبكة RJ45 بجانب شاشة التلفاز الرئيسية للوسائط المتعددة.',
      'ممنوع توصيل أكثر من 8 مآخذ على سلك 1.5 مم² (قاطع 16A كحد أقصى).',
      'ارتفاع المآخذ: 5 سم على الأقل من مستوى الأرضية المشطبة (Plinthe).'
    ]
  },
  {
    id: 'kitchen',
    nameAr: 'المطبخ (Cuisine)',
    nameFr: 'Cuisine',
    iconName: 'Utensils',
    descriptionAr: 'المنطقة الأكثر استهلاكاً للطاقة في المنزل، تتطلب دوائر مخصصة ذات تيار عالٍ ومآخذ فوق طاولة العمل.',
    minOutlets: '6 مآخذ تيار غير مخصصة على الأقل، منها 4 مآخذ فوق طاولة العمل (Plan de travail). لا يركب أي مأخذ فوق حوض الجلي أو موقد الطهي مباشرة.',
    lightingPoints: 'نقطة إضاءة سقفية DCL بنظام تحكم عند المدخل، ويفضل إضاءة موجهة لطاولة العمل.',
    dedicatedCircuits: [
      'دارة فرن الطهي أو الصفيحة الكهربائية (Plaque de cuisson): 32A أحادي الطور بمقطع 6 مم² محمي بقاطع تفاضلي من النوع A (Type A).',
      'دارة مخصصة للفرن المستقل (Four): 20A بمقطع 2.5 مم².',
      'دارة مخصصة لغسالة الأواني (Lave-vaisselle): 20A بمقطع 2.5 مم².',
      'دارة مخصصة لغسالة الملابس إذا كانت في المطبخ: 20A بمقطع 2.5 مم².'
    ],
    maxProtection: 'قاطع 32A لدارة الطهي (6mm²)، وقواطع 20A للدوائر المخصصة الأخرى (2.5mm²).',
    wireGauge: '6 مم² للطهي، 2.5 مم² للأجهزة الكبرى، 1.5 مم² للإضاءة',
    specialRules: [
      'يمنع منعاً باتاً تركيب أي مأخذ كهربائي مباشرة فوق صفيحة الطهي أو حوض الماء لتفادي السوائل ورذاذ الزيت.',
      'يجب حماية دارة الطهي بقاطع تفاضلي من الصنف A (Interrupteur différentiel 30mA Type A) لكشف التيارات المستمرة المتبقية.',
      'المآخذ فوق طاولة العمل تركب على ارتفاع 8 إلى 25 سم فوق السطح.'
    ]
  },
  {
    id: 'bathroom',
    nameAr: 'الحمام وفضاءات الاستحمام (Salle d\'eau / Salle de bain)',
    nameFr: 'Salle de bain',
    iconName: 'Droplets',
    descriptionAr: 'أخطر منطقة في المسكن بسبب الرطوبة والماء. تقسم إلى أحجام أمان معيارية (Volumes 0, 1, 2, Hors Volume).',
    minOutlets: 'مأخذ واحد فقط مسموح به في الحجم 2 (حجم الحلاقة بشاحن مع محول عزل SELV)، ومآخذ عادية في الحجم الخارج (Hors Volume) فقط.',
    lightingPoints: 'نقطة إضاءة مركزية IPX4 أو IPX5 حسب موضعها من الحجم.',
    dedicatedCircuits: ['دارة سخان الماء الكهربائي (Chauffe-eau ECS): 20A بمقطع 2.5 مم²', 'دارة تدفئة مجفف المناشف (Sèche-serviette): 20A'],
    maxProtection: 'حماية تفاضلية إلزامية عالية الحساسية 30mA لجميع دوائر الحمام دون استثناء.',
    wireGauge: '2.5 مم² للسخان، 1.5 مم² للإضاءة، سلك تأريض الربط متساوي الجهد (LES) 2.5 مم² أو 4 مم²',
    specialRules: [
      'الحجم 0 (داخل حوض الاستحمام/الدش): يمنع أي جهاز باستثناء أجهزة SELV 12V بتصنيف IPX7.',
      'الحجم 1 (فوق الحوض حتى ارتفاع 2.25م): يسمح فقط بسخانات المياه اللحظية أو الفورية فئة Class III مع SELV 12V IPX5.',
      'الحجم 2 (60 سم حول الحجم 1): يسمح بأجهزة التدفئة Class II ذات العزل المزدوج ومآخذ الحلاقة المجهزة بمحول عزل.',
      'الربط متساوي الجهد المحلي (Liaison Équipotentielle Supplémentaire - LES): ربط جميع الأنابيب المعدنية والإطارات المعدنية بشبكة التأريض.'
    ]
  },
  {
    id: 'bedroom',
    nameAr: 'غرف النوم (Chambres)',
    nameFr: 'Chambres',
    iconName: 'Bed',
    descriptionAr: 'فضاءات الراحة؛ تركز على توزيع المآخذ لسهولة الشحن والإنارة والتحكم من السرير.',
    minOutlets: '3 مآخذ تيار 16A/20A موزعة بانتظام على محيط الغرفة، ومأخذ شبكة RJ45 بجانب أحد المآخذ.',
    lightingPoints: 'نقطة إضاءة سقفية DCL بتحكم عند الباب، يفضل مفتاح مزدوج أو ذهاب وإياب (Va-et-vient) من جانب السرير.',
    dedicatedCircuits: ['دارة مآخذ عامة مشتركة أو مخصصة للغرفة', 'دارة رادياتور كهربائي مخصص'],
    maxProtection: 'قاطع 16A أو 20A للمآخذ، و16A كحد أقصى للإضاءة.',
    wireGauge: '1.5 مم² للإضاءة ومآخذ 16A، 2.5 مم² لمآخذ 20A ومكيف الهواء',
    specialRules: [
      'توفير مأخذ قرب طاولة السرير (Chevet) ومأخذ قرب الباب.',
      'إذا توفرت ستائر كهربائية (Volets roulants)، تخصيص دارة 1.5 مم² مع قاطع 16A.'
    ]
  },
  {
    id: 'corridor',
    nameAr: 'الممرات والمداخل (Couloirs & Entrées)',
    nameFr: 'Couloir & Dégagement',
    iconName: 'Footprints',
    descriptionAr: 'مناطق الحركة والربط؛ تشترط إضاءة كافية ومآخذ للصيانة مع تحكم متعدد النقاط.',
    minOutlets: 'مأخذ واحد على الأقل للممرات التي تزيد مساحتها عن 4 متر².',
    lightingPoints: 'نقطة إضاءة لكل ممر، بتحكم من طرفي الممر (نظام Va-et-vient أو Télérupteur لمفاتيح الدفع المضيئة).',
    dedicatedCircuits: ['دارة إضاءة', 'دارة مآخذ عامة'],
    maxProtection: 'قاطع 16A للإضاءة والمآخذ.',
    wireGauge: '1.5 مم²',
    specialRules: [
      'إذا تجاوزت نقاط التحكم 2، يوصى باستخدام قاطع نبضي (Télérupteur) مع أزرار ضغط (Boutons Poussoirs).',
      'تركيب لوحة التوزيع الكهربائي الرئيسية (GTL - Gaine Technique Logement) بالقرب من المدخل أو المرآب.'
    ]
  },
  {
    id: 'garage',
    nameAr: 'المرآب وورشة العمل (Garage / Sous-sol)',
    nameFr: 'Garage',
    iconName: 'Warehouse',
    descriptionAr: 'منطقة ذات متطلبات خاصة لشحن السيارات الكهربائية (IRVE) والمعدات اليدوية والآلات.',
    minOutlets: 'مأخذ واحد على الأقل محمي، ويوصى بتركيب مأخذ مقوى (Prise renforcée Green\'up) أو صندوق شحن (Wallbox).',
    lightingPoints: 'نقطة إضاءة واحدة على الأقل مقاومة للغبار والرطوبة بتصنيف IP44 على الأقل.',
    dedicatedCircuits: [
      'دارة مخصصة لشاحن السيارة الكهربائية (IRVE): كابل 2.5 مم² (16A مقوى) أو 6 مم² إلى 10 مم² (صندوق 32A 7.4kW) محمي بقاطع تفاضلي Type F أو Type B.',
      'دارة مقبس الباب الآلي (Porte de garage motorisée): 16A.'
    ],
    maxProtection: 'قاطع 20A للمآخذ، وقاطع 32A لشاحن السيارات بقدرة 7kW.',
    wireGauge: '2.5 مم² إلى 10 مم² حسب تيار الشحن والمعدات المستخدمة',
    specialRules: [
      'أجهزة الشحن الكهربائي تتطلب قاطع تفاضلي من الصنف F (Type F) أو Type B للكشف عن تسربات التردد العالي والتيار المستمر.',
      'استخدام معدات حماية بتصنيف حماية لا يقل عن IP44 و IK08 لمقاومة الصدمات الميكانيكية.'
    ]
  }
];

export const CIRCUIT_MATRIX_NFC15100 = [
  {
    usageAr: 'الإنارة والتحكم (Éclairage)',
    usageFr: 'Éclairage & Volets roulants',
    minSectionMm2: 1.5,
    maxBreakerA: 16,
    maxPoints: '8 نقاط إضاءة كحد أقصى لكل دارة',
    diffType: 'Type AC أو Type A',
    standardGaineIcta: 'Ø 16 أو 20 مم'
  },
  {
    usageAr: 'مآخذ التيار العامة (Prises de courant 16A)',
    usageFr: 'Prises de courant standard',
    minSectionMm2: 1.5,
    maxBreakerA: 16,
    maxPoints: '8 مآخذ كحد أقصى على سلك 1.5 مم²',
    diffType: 'Type AC أو Type A',
    standardGaineIcta: 'Ø 20 مم'
  },
  {
    usageAr: 'مآخذ التيار العامة المقواة (Prises de courant 20A)',
    usageFr: 'Prises de courant confort',
    minSectionMm2: 2.5,
    maxBreakerA: 20,
    maxPoints: '12 مأخذ كحد أقصى على سلك 2.5 مم²',
    diffType: 'Type AC أو Type A',
    standardGaineIcta: 'Ø 20 مم'
  },
  {
    usageAr: 'صفيحة الطهي الكهربائية (Plaque de cuisson)',
    usageFr: 'Plaque de cuisson / Cuisinière',
    minSectionMm2: 6.0,
    maxBreakerA: 32,
    maxPoints: 'دارة مخصصة أحادية واحدة فقط',
    diffType: 'Type A إلزامي (30mA)',
    standardGaineIcta: 'Ø 25 أو 32 مم'
  },
  {
    usageAr: 'غسالة الملابس (Lave-linge)',
    usageFr: 'Lave-linge',
    minSectionMm2: 2.5,
    maxBreakerA: 20,
    maxPoints: 'دارة مخصصة واحدة',
    diffType: 'Type A إلزامي (30mA)',
    standardGaineIcta: 'Ø 20 مم'
  },
  {
    usageAr: 'سخان الماء وسخان الغسالة (Lave-vaisselle / Chauffe-eau)',
    usageFr: 'Lave-vaisselle & Sèche-linge',
    minSectionMm2: 2.5,
    maxBreakerA: 20,
    maxPoints: 'دارة مخصصة لكل جهاز على حدة',
    diffType: 'Type AC أو Type A',
    standardGaineIcta: 'Ø 20 مم'
  },
  {
    usageAr: 'نظام التهوية الميكانيكية المركزية (VMC)',
    usageFr: 'Ventilation Mécanique Contrôlée',
    minSectionMm2: 1.5,
    maxBreakerA: 2,
    maxPoints: 'دارة مخصصة منفصلة',
    diffType: 'Type AC',
    standardGaineIcta: 'Ø 16 مم'
  },
  {
    usageAr: 'شاحن المركبة الكهربائية (Borne IRVE 7.4 kW)',
    usageFr: 'Recharge Véhicule Électrique',
    minSectionMm2: 10.0,
    maxBreakerA: 40,
    maxPoints: 'نقطة شحن واحدة مع كابل مخصص',
    diffType: 'Type F أو Type B (30mA)',
    standardGaineIcta: 'Ø 32 مم'
  }
];

export const DIFFERENTIAL_TYPES_GUIDE = [
  {
    type: 'Type AC',
    symbol: '〜',
    titleAr: 'النوع المتردد AC القياسي',
    titleFr: 'Interrupteur Différentiel Type AC',
    descriptionAr: 'يكشف تيارات التسرب المترددة الجيبية (Courants alternatifs sinusoïdaux). مخصص للأحمال الخطية التقليدية.',
    examplesAr: 'الإنارة العادية، التدفئة الكهربائية بمقاومات، مآخذ الغرف والممرات، الثلاجة العادية.'
  },
  {
    type: 'Type A',
    symbol: '〜 + ⎓',
    titleAr: 'النوع A المخصص للمكونات المستمرة المتبقية',
    titleFr: 'Interrupteur Différentiel Type A',
    descriptionAr: 'يكشف التيارات المترددة والتيارات المستمرة النابضة (Composantes continues pulsées). إلزامي لدارات الأجهزة الإلكترونية.',
    examplesAr: 'صفائح الطهي الحثية (Plaques à induction)، غسالة الملابس الحديثة المزودة بعاكس إلكتروني (Inverter).'
  },
  {
    type: 'Type F (Hpi / Si)',
    symbol: '〜 + ⎓ + Freq',
    titleAr: 'النوع F عالي المناعة (Super Immunisé)',
    titleFr: 'Type F (Anciennement Hpi / Si)',
    descriptionAr: 'مناعة فائقة ضد الفصل المفاجئ الناجم عن الصواعق والضجيج التوافقي؛ يكشف الترددات المتغيرة حتى 1kHz.',
    examplesAr: 'المضخات الحرارية (Pompe à chaleur)، مكيفات الهواء بالعاكس، الأجهزة الطبية الحساسة، أجهزة التجميد (Congélateur).'
  },
  {
    type: 'Type B',
    symbol: '⎓ DC Pure',
    titleAr: 'النوع B للتيار المستمر النقي',
    titleFr: 'Interrupteur Différentiel Type B',
    descriptionAr: 'يكشف التسربات في التيار المستمر الخالص (DC pur) بدون عبور للصفر. مطلوب في التركيبات المتقدمة.',
    examplesAr: 'محطات شحن السيارات السريعة (DC)، العواكس الشمسية الكهروضوئية (Onduleurs solaires PV)، مغيرات السرعة ثلاثية الطور.'
  }
];
