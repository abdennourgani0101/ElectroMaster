export interface CircuitDiagram {
  id: string;
  category: 'architectural' | 'industrial';
  titleAr: string;
  titleFr: string;
  titleEn: string;
  descriptionAr: string;
  standardProtection: string;
  standardCableSection: string;
  componentsList: string[];
  operationPrincipleAr: string;
  wiringStepsAr: string[];
  frequentProblems: {
    symptom: string;
    probableCause: string;
    solution: string;
  }[];
  svgType: string;
}

export const COMMON_CIRCUITS: CircuitDiagram[] = [
  // ----------------- ARCHITECTURAL CIRCUITS -----------------
  {
    id: 'simple_allumage',
    category: 'architectural',
    titleAr: 'دارة إنارة بسيطة بمفتاح أحادي (Simple Allumage)',
    titleFr: 'Simple Allumage (Schéma 1)',
    titleEn: 'Single-Pole One-Way Lighting Circuit',
    descriptionAr: 'الدارة الكهربائية الأساسية للتحكم في نقطة إضاءة واحدة أو أكثر من مكان واحد بواسطة مفتاح قاطع أحادي القطب (Interrupteur unipolaire).',
    standardProtection: 'قاطع آلي 16A كحد أقصى (Disjoncteur 16A)',
    standardCableSection: '1.5 مم² نحاس (Phase L بني/أحمر، Neutre N أزرق، PE أخضر/أصفر)',
    componentsList: ['قاطع حماية 10A أو 16A في لوحة التوزيع', 'مفتاح قاطع أحادي SA1', 'نقطة إضاءة DCL مع مصباح E27 أو LED'],
    operationPrincipleAr: 'يمر سلك الطور (Phase L) عبر المفتاح أولاً كقاطع للتيار، ثم يخرج سلك العودة (Retour lampe) إلى المصباح، بينما يتصل سلك الحيادي (Neutre N) مباشرة بالطرف الآخر للمصباح، وسلك الأرضي (PE) بهيكل وحدة الإضاءة.',
    wiringStepsAr: [
      'تغذية المفتاح بسلك الطور (L) القادم من القاطع في اللوحة.',
      'توصيل سلك عودة المصباح من المخرج الآخر للمفتاح إلى قاعدة المصباح.',
      'توصيل سلك الحيادي (N) الأزرق مباشرة من لوحة التوزيع إلى المصباح.',
      'توصيل سلك التأريض (PE) بهيكل المصباح المعدني.'
    ],
    frequentProblems: [
      {
        symptom: 'المصباح يومض خفيفاً حتى والمفتاح مقفل في وضع إطفاء (Scintillement LED)',
        probableCause: 'تم قطع سلك الحيادي بالمفتاح بدلاً من سلك الطور (Inversion Phase/Neutre)، أو وجود سعة طفيلية في الكابل.',
        solution: 'عكس التوصيل فوراً بحيث يقطع المفتاح سلك الطور (Phase L) حصراً.'
      },
      {
        symptom: 'المصباح لا يضيء نهائياً رغم سلامة المصباح',
        probableCause: 'انقطاع في سلك العودة أو ارتخاء في برغي تلامس المفتاح.',
        solution: 'قياس الجهد 230V بين مدخل المفتاح والحيادي، ثم قياس مخرج المفتاح أثناء غلقه.'
      }
    ],
    svgType: 'simple_allumage'
  },
  {
    id: 'va_et_vient',
    category: 'architectural',
    titleAr: 'دارة إنارة ذهاب وإياب (Va-et-Vient)',
    titleFr: 'Va-et-Vient (Schéma 6)',
    titleEn: 'Two-Way Switching Circuit',
    descriptionAr: 'تتيح التحكم في نفس نقطة الإنارة من موضعين مختلفين (مثل طرفي الرواق أو مدخل الغرفة وبجانب السرير) باستخدام مفتاحي تبديل ذوي 3 أطراف.',
    standardProtection: 'قاطع 16A كحد أقصى',
    standardCableSection: '1.5 مم² (سلكا المكوك Navettes بلون برتقالي أو بنفسجي أو أسود)',
    componentsList: ['قاطع 16A', 'مفتاح تبديل أول SA1 (طرف مشترك L وطرفا مكوك 1-2)', 'مفتاح تبديل ثانٍ SA2 (طرف مشترك L وطرفا مكوك 1-2)', 'وحدة الإنارة'],
    operationPrincipleAr: 'يصل سلك الطور إلى النقطة المشتركة (L) للمفتاح الأول، ويخرج سلكا المكوك (Navettes 1 & 2) ليصلان مباشرة بالطرفين 1 و 2 للمفتاح الثاني. يخرج سلك العودة من النقطة المشتركة (L) للمفتاح الثاني إلى المصباح.',
    wiringStepsAr: [
      'وصل سلك الطور L بالطرف المشترك L للمفتاح الأول SA1.',
      'مد سلكي المكوك (Navettes) بين الطرفين 1-2 للمفتاح الأول والطرفين 1-2 للمفتاح الثاني.',
      'وصل الطرف المشترك L للمفتاح الثاني بسلك عودة المصباح.',
      'وصل الحيادي N والتأريض PE مباشرة بالمصباح.'
    ],
    frequentProblems: [
      {
        symptom: 'الإنارة تعمل من أحد المفتاحين فقط ولا تستجيب إلا إذا كان الآخر في وضع محدد',
        probableCause: 'خلط بين سلك الطور L أو سلك العودة مع أحد أسلاك المكوك (Erreur de raccordement de la borne commune L).',
        solution: 'فحص وتحديد الطرف المشترك L الموسوم برقم أو لون مختلف، وتوصيل أسلاك المكوك حصراً بالطرفين 1 و 2.'
      }
    ],
    svgType: 'va_et_vient'
  },
  {
    id: 'telerupteur',
    category: 'architectural',
    titleAr: 'دارة القاطع النبضي بأزرار ضغط متعددة (Télérupteur)',
    titleFr: 'Télérupteur unipolaire avec Boutons Poussoirs',
    titleEn: 'Latching / Step Relay with Multiple Pushbuttons',
    descriptionAr: 'الحل المعياري والأوفر عندما يتطلب التحكم في الإنارة أكثر من موضعين (صالة واسعة، ممر طويل، درج عمارة)، حيث يتم استخدام أزرار دفع لحظية (Boutons Poussoirs NO) بالتوازي.',
    standardProtection: 'قاطع 16A للدارة أو قاطعان منفصلان (2A للتحكم و 10A/16A للقدرة)',
    standardCableSection: '1.5 مم²',
    componentsList: ['قاطع نبضي نمطي (Télérupteur modulaire) في لوحة التوزيع', 'أزرار ضغط NO (غير محدودة العدد)', 'وحدات إنارة'],
    operationPrincipleAr: 'كل نبضة كهربائية عند الضغط على أي زر دفع تغذي ملف القاطع النبضي (A1-A2) لحظياً، فيغير تلامس القدرة (1-2) حالته من الفتح إلى الغلق أو العكس ويثبت ميكانيكياً حتى النبضة التالية.',
    wiringStepsAr: [
      'توصيل الطور L إلى أحد طرفي أزرار الدفع الموصولة جميعاً بالتوازي.',
      'تجميع أسلاك العودة من أزرار الدفع وربطها بالطرف A1 لملف القاطع النبضي.',
      'ربط الطرف A2 لملف القاطع النبضي بالحيادي N (أو العكس في التحكم بالحيادي).',
      'توصيل خط القدرة من القاطع إلى مدخل التلامس 1، وخروج سلك المصباح من المخرج 2.'
    ],
    frequentProblems: [
      {
        symptom: 'الإنارة تظل مشتعلة دائماً وملف التيليروبتير يسخن ويصدر طنيناً مستمراً',
        probableCause: 'أحد أزرار الدفع في المنزل عالق ميكانيكياً في وضع الغلق (Bouton poussoir bloqué enfoncé).',
        solution: 'فصل أسلاك أزرار الدفع بالتوالي لتحديد الزر المعطوب واستبداله.'
      }
    ],
    svgType: 'telerupteur'
  },
  {
    id: 'minuterie_escalier',
    category: 'architectural',
    titleAr: 'دارة مؤقت الدرج الزمني (Minuterie d\'Escalier)',
    titleFr: 'Minuterie d\'escalier (avec préavis d\'extinction)',
    titleEn: 'Staircase Lighting Timer Circuit',
    descriptionAr: 'تتحكم في إضاءة أدراج المباني السكنية والعمارات المشتركة؛ تضيء بضغطة زر وتطفئ تلقائياً بعد مدة زمنية محددة (قابلة للضبط من 30 ثانية إلى 10 دقائق).',
    standardProtection: 'قاطع 10A أو 16A',
    standardCableSection: '1.5 مم²',
    componentsList: ['مؤقت درج نمطي (Minuterie modulaire)', 'أزرار ضغط NO مزودة بمصابيح مؤشر ضوئية', 'مصابيح الدرج'],
    operationPrincipleAr: 'تغذية لحظية تشغل مؤقتاً إلكترونياً يبقي التماس مغلقاً لفترة زمنية محددة مع إمكانية التمديد بإعادة الضغط، وخاصية التحذير قبل الإطفاء (Préavis d\'extinction) بوميض خفيف.',
    wiringStepsAr: [
      'اختيار نمط التوصيل (3 أسلاك مع التحكم بالحيادي، أو 4 أسلاك مع التحكم بالطور).',
      'ربط أزرار الدفع بالتوازي إلى مدخل إشارة المؤقت (Borne poussoir).',
      'ربط مخرج التلامس بمصابيح الدرج.',
      'ضبط المهلة الزمنية عبر القرص الدوار للمؤقت.'
    ],
    frequentProblems: [
      {
        symptom: 'المؤقت يطفئ فوراً ولا يكمل المدة المحددة',
        probableCause: 'المفتاح التبديل الميكانيكي على واجهة المؤقت موضوع على وضع الدوام (Position Permanent 1) بدلاً من وضع المؤقت (Auto/Minuterie).',
        solution: 'إعادة مفتاح الواجهة لوضع التشغيل التلقائي (Auto).'
      }
    ],
    svgType: 'minuterie'
  },
  {
    id: 'contacteur_jour_nuit',
    category: 'architectural',
    titleAr: 'دارة كونتاكتور سخان الماء بالساعات المخفضة (Contacteur Jour/Nuit Heures Creuses)',
    titleFr: 'Contacteur Chauffe-eau Heures Creuses / Pleines',
    titleEn: 'Day/Night Off-Peak Water Heater Contactor',
    descriptionAr: 'تشغيل سخان الماء الكهربائي (Chauffe-eau) حصراً أثناء الساعات ذات التعرفة الرخيصة ليلاً لتوفير فاتورة الكهرباء عبر إشارة قادمة من عداد الكهرباء الذكي (Linky أو العداد الإلكتروني).',
    standardProtection: 'قاطع 2A لحماية دارة التحكم، وقاطع 20A لدارة قدرة السخان',
    standardCableSection: '2.5 مم² لدارة السخان، 1.5 مم² لإشارة العداد',
    componentsList: ['كونتاكتور ساعات مخفضة (Contacteur J/N)', 'قاطع 2A لتماس العداد C1-C2', 'قاطع 20A للسخان', 'سخان الماء'],
    operationPrincipleAr: 'عند حلول موعد التعرفة المخفضة (Heures Creuses)، يغلق العداد تلامسه الجاف (C1-C2) فيغذي ملف الكونتاكتور، مما يوصل التيار 230V لسخان الماء. في النهار يفتح التماس ويتوقف السخان.',
    wiringStepsAr: [
      'تغذية دارة التحكم بقاطع 2A، وتوصيل أحد أطرافه بملف الكونتاكتور A2 عبر تماس العداد C1-C2.',
      'توصيل دارة القدرة من قاطع 20A إلى مدخل الكونتاكتور (1-3).',
      'توصيل مخرج الكونتاكتور (2-4) بمقاومة سخان الماء.',
      'اختبار الأوضاع الثلاثة لمقبس الكونتاكتور: 0 (إيقاف دائم)، Auto (تلقائي بالعداد)، 1 (تشغيل قسري يعود تلقائياً لـ Auto).'
    ],
    frequentProblems: [
      {
        symptom: 'سخان الماء لا يسخن أبداً في وضع التلقائي (Auto)',
        probableCause: 'احتراق مصهر العداد، أو تماس العداد C1-C2 تالف، أو سلك التحكم مقطوع.',
        solution: 'وضع مقبض الكونتاكتور على وضع (1 Marche forcée). إذا سخن الماء، فالعطل محصور في إشارة العداد C1-C2 أو قاطع 2A.'
      }
    ],
    svgType: 'contacteur_jn'
  },

  // ----------------- INDUSTRIAL CIRCUITS -----------------
  {
    id: 'dol_industrial_complete',
    category: 'industrial',
    titleAr: 'مخطط القدرة والتحكم للإقلاع المباشر للمحركات (DOL Complet)',
    titleFr: 'Démarrage Direct 1 Sens (Puissance & Commande)',
    titleEn: 'Direct-On-Line Motor Starter Complete Schematic',
    descriptionAr: 'المخطط الصناعي القياسي المعتمد في المنشآت الصناعية والمضخات ومحطات المياه؛ يضم دارة القدرة (Circuit de puissance 400V) ودارة التحكم (Circuit de commande 24V/230V).',
    standardProtection: 'قاطع محرك كهرومغناطيسي GV2 أو مصهرات aM + ريليه حراري F1',
    standardCableSection: 'يحسب وفق استطاعة المحرك وهبوط الجهد (مثلاً 2.5 مم² لمحرك 4kW)',
    componentsList: ['قاطع محرك Q1', 'كونتاكتور خط KM1', 'مرحل حراري F1', 'زر إيقاف طوارئ S_AU', 'زر إيقاف S0', 'زر تشغيل S1', 'محرك M1 3~'],
    operationPrincipleAr: 'تغذية الملف A1-A2 للكونتاكتور KM1 عبر زر التشغيل S1 مع تماس الاستمرارية (13-14). عند حدوث فرط حمل، يفتح تماس المرحل الحراري (95-96) ليقطع تيار التحكم فوراً ويغلق (97-98) لإضاءة مصباح العطل.',
    wiringStepsAr: [
      'دارة القدرة: من القاطع العام إلى مدخل Q1، ثم إلى 1-3-5 للكونتاكتور KM1، ثم إلى المرحل الحراري F1، ثم إلى U1-V1-W1 للمحرك.',
      'دارة التحكم: سلك الطور يمر عبر زر الطوارئ NC ثم تماس الريليه الحراري 95-96 NC ثم زر الإيقاف S0 NC.',
      'توصيل زر التشغيل S1 NO بالتوازي مع تماس KM1 NO (13-14).',
      'الخروج إلى ملف الكونتاكتور A1، وربط A2 بالحيادي.'
    ],
    frequentProblems: [
      {
        symptom: 'المحرك يدور فقط طالما أن إصبع المشغل ضاغط على زر التشغيل، ويتوقف فور رفع الإصبع',
        probableCause: 'فشل أو عدم توصيل دارة الاستمرارية الذاتية (Défaut de câblage de l\'auto-maintien KM1 13-14).',
        solution: 'التأكد من ربط التماس المساعد المفتوح 13-14 للكونتاكتور KM1 بالتوازي التام مع زر التشغيل S1.'
      },
      {
        symptom: 'المرحل الحراري يسقط بعد بضع دقائق من التشغيل مع سخونة هيكل المحرك',
        probableCause: 'حمل ميكانيكي زائد على المضخة، أو ضبط خاطئ لتيار الريليه، أو انخفاض الجهد المغذي.',
        solution: 'قياس التيار الفعلي بواسطة ملقط أمبيري (Pince ampèremétrique) في كل طور ومقارنته بالتيار الاسمي In على لوحة المحرك.'
      }
    ],
    svgType: 'dol_industrial'
  },
  {
    id: 'inversor_sens_marche',
    category: 'industrial',
    titleAr: 'مخطط التحكم في اتجاهي الدوران مع قفل مزدوج (Inverseur de Sens)',
    titleFr: 'Inverseur de Sens de Marche avec double verrouillage',
    titleEn: 'Forward/Reverse Motor Control with Electrical & Mechanical Interlock',
    descriptionAr: 'يستخدم في الرافعات (Ponts roulants)، المصاعد، والأبواب الآلية لتبديل اتجاه الدوران بعكس طورين (L1 و L3) مع نظام قفل ميكانيكي وكهربائي صارم لمنع حدوث ماس بين الأطوار.',
    standardProtection: 'قاطع محرك GV2 أو مصهرات aM',
    standardCableSection: 'حسب قدرة المحرك',
    componentsList: ['كونتاكتور الدوران يميناً KM1', 'كونتاكتور الدوران يساراً KM2', 'قفل ميكانيكي بين KM1 و KM2', 'أزرار تشغيل S1 و S2', 'مرحل حراري F1'],
    operationPrincipleAr: 'الكونتاكتور KM1 يوصل الأطوار بالترتيب (L1-U, L2-V, L3-W). الكونتاكتور KM2 يعكس طورين (L1-W, L2-V, L3-U). يمر تيار ملف KM1 عبر تلامس مغلق NC (21-22) للكونتاكتور KM2، والعكس صحيح.',
    wiringStepsAr: [
      'دارة القدرة: ربط مداخل KM1 و KM2 بالتوازي مع خطوط التغذية L1, L2, L3.',
      'في مخارج القدرة: عكس توصيل سلكين (مثلاً ربط مخرج طور 1 في KM2 مع طور 3 للمحرك).',
      'تركيب القفل الميكانيكي (Verrouillage mécanique) بين هيكلي الكونتاكتورين.',
      'دارة التحكم: إدخال تلامس NC (21-22) لـ KM2 على التوالي قبل ملف KM1، وتلامس NC لـ KM1 قبل ملف KM2.'
    ],
    frequentProblems: [
      {
        symptom: 'صوت انفجار شرارة كهربائية وسقوط القاطع العام عند الضغط على زر الاتجاه المعاكس',
        probableCause: 'غياب القفل الكهربائي أو قصر زمن التبديل مما أدى لإغلاق KM2 قبل انطفاء القوس الكهربائي في KM1.',
        solution: 'إصلاح التوصيل عبر تماسات NC (21-22) وإضافة مؤقت تأخير زمني قصير (Temporisation de sécurité 0.5s) عند التبديل.'
      }
    ],
    svgType: 'inverseur'
  },
  {
    id: 'etoile_triangle_complete',
    category: 'industrial',
    titleAr: 'مخطط إقلاع نجمي - مثلثي آلي بمؤقت (Étoile-Triangle Y-Δ)',
    titleFr: 'Démarrage Étoile-Triangle automatique avec relais temporisé',
    titleEn: 'Automatic Star-Delta Starter with Transition Timer',
    descriptionAr: 'المخطط التقليدي الأكثر شهرة لتقليل تيار الإقلاع للمحركات الحثية الكبيرة (فوق 5.5kW) دون استخدام إلكترونيات باهظة.',
    standardProtection: 'قاطع محرك + مصهرات aM',
    standardCableSection: 'كابل سداسي النواة (6 conducteurs) من اللوحة إلى المحرك',
    componentsList: ['كونتاكتور خط KM1', 'كونتاكتور مثلث KM2', 'كونتاكتور نجمة KM3', 'مؤقت زمني إلكتروني T1', 'مرحل حراري F1', 'محرك 400V/690V'],
    operationPrincipleAr: 'يبدأ الإقلاع بغلق KM1 و KM3 معاً (نجمة Y). ينخفض تيار الإقلاع والعزم إلى الثلث. بعد 3 إلى 7 ثوانٍ ينتهي عداد المؤقت، فيفتح KM3 أولاً، ثم بعد مهلة 40ms يغلق KM2 (مثلث Δ) ليعمل المحرك بكامل عزمه.',
    wiringStepsAr: [
      'توصيل كابلات أطراف المحرك الستة: U1, V1, W1 إلى مخارج KM1، و U2, V2, W2 إلى مخارج KM2 و KM3.',
      'ربط مخارج KM3 معاً لتشكيل نقطة الحيادي النجمية (Point neutre étoile).',
      'ربط ملف المؤقت T1 بالتوازي مع ملف KM1.',
      'استخدام تلامس المؤقت المغلق للتحكم في KM3، والتلامس المفتوح للتحكم في KM2 مع قفل كهربائي متبادل بينهما.'
    ],
    frequentProblems: [
      {
        symptom: 'المحرك يقلع بنجاح في وضع النجمة ولكن القاطع يسقط فوراً عند لحظة التحويل للمثلث',
        probableCause: 'خطأ في ترتيب أطوار كونتاكتور المثلث KM2 أدى لقصر مباشر بين طورين، أو أن المحرك 230V/400V وليس 400V/690V.',
        solution: 'مراجعة توصيل أسلاك المثلث: يجب أن يتصل U1 مع W2، و V1 مع U2، و W1 مع V2.'
      }
    ],
    svgType: 'etoile_triangle'
  },
  {
    id: 'pompe_relais_niveau',
    category: 'industrial',
    titleAr: 'دارة تحكم وحماية مضخة مياه بمرحل منسوب وفواشة (Station de Pompage)',
    titleFr: 'Commande de pompe avec relais de niveau et flotteur',
    titleEn: 'Water Pump Control with Float Switch & Liquid Level Relay',
    descriptionAr: 'تستخدم في آبار المياه وخزانات الصرف ومحطات الرفع لحماية المضخة من ظاهرة التشغيل الجاف الكارثية (Marche à sec) والتحكم الآلي في ملء أو تفريغ الخزان.',
    standardProtection: 'قاطع محرك GV2 ومرحل كهرومغناطيسي',
    standardCableSection: 'حسب عمق البئر واستطاعة المضخة مع مراعاة هبوط الجهد',
    componentsList: ['مرحل مراقبة المنسوب (Relais de niveau)', 'حساسات منسوب (Sondes Haut/Bas/Réf)', 'فواشة كهربائية (Flotteur)', 'مضخة غاطسة'],
    operationPrincipleAr: 'يقيس المرحل مقاومة الماء بين مسباري المستوى العلوي والمستوى السفلي. عند انخفاض الماء تحت المستوى الأدنى، يفتح التلامس ويوقف المضخة فوراً لحمايتها من الاحتراق.',
    wiringStepsAr: [
      'تنزيل مسبار المرجع (Com) إلى قاع البئر، ومسبار المستوى الأدنى (Bas) فوق المضخة بـ 50 سم، والمسبار العلوي (Haut) عند منسوب الامتلاء.',
      'توصيل إشارة الحساسات بمدخل مرحل المنسوب الإلكتروني.',
      'توصيل تلامس خرج المرحل NO على التوالي في دارة تشغيل كونتاكتور المضخة.',
      'إضافة مفتاح يدوي/آلي (Commutateur Manuel - 0 - Auto).'
    ],
    frequentProblems: [
      {
        symptom: 'المضخة تتوقف وتشتغل بسرعة متقطعة غير مستقرة عند وصول الماء للحد الأدنى',
        probableCause: 'تذبذب سطح الماء بسبب حركة الضخ وقصر المسافة بين المسبارين العلوي والسفلي.',
        solution: 'زيادة المسافة الرأسية بين مسبار الحد الأدنى والحد الأقصى لتوفير فاصل تخلف مناسب (Hystérésis).'
      }
    ],
    svgType: 'pompe_niveau'
  }
];
