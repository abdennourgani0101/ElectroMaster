import { PrebuiltTemplate } from '../types/simulator';

export const SIMULATOR_PREBUILT_TEMPLATES: PrebuiltTemplate[] = [
  // 1. SIMPLE ALLUMAGE
  {
    id: 'simple_allumage',
    nameAr: 'دارة الإنارة البسيطة (Simple Allumage)',
    nameFr: 'Simple Allumage 230V avec Disjoncteur',
    descriptionAr: 'دارة كلاسيكية تضم قاطع حماية 16A، مفتاح إنارة أحادي SA1، ومصباح 230V مع كشف سريان التيار الحي.',
    elements: [
      {
        id: 'elem_src_l',
        type: 'source_phase',
        label: 'طور التغذية L (230V)',
        tag: 'L1',
        x: 1,
        y: 1,
        state: { isEnergized: true }
      },
      {
        id: 'elem_q1',
        type: 'breaker_q1',
        label: 'قاطع 16A',
        tag: 'Q1',
        x: 3,
        y: 1,
        state: { isClosed: true }
      },
      {
        id: 'elem_sa1',
        type: 'switch_spst',
        label: 'مفتاح إنارة أحادي',
        tag: 'SA1',
        x: 6,
        y: 1,
        state: { isClosed: false }
      },
      {
        id: 'elem_lamp1',
        type: 'lamp_e1',
        label: 'مصباح إنارة E1',
        tag: 'E1',
        x: 9,
        y: 1,
        state: { isEnergized: false }
      },
      {
        id: 'elem_src_n',
        type: 'source_neutral',
        label: 'خط الحيادي N (0V)',
        tag: 'N',
        x: 11,
        y: 1,
        state: { isEnergized: false }
      }
    ],
    connections: [
      { id: 'w1', fromElementId: 'elem_src_l', fromTerminal: 'out', toElementId: 'elem_q1', toTerminal: 'in' },
      { id: 'w2', fromElementId: 'elem_q1', fromTerminal: 'out', toElementId: 'elem_sa1', toTerminal: 'in' },
      { id: 'w3', fromElementId: 'elem_sa1', fromTerminal: 'out', toElementId: 'elem_lamp1', toTerminal: 'in' },
      { id: 'w4', fromElementId: 'elem_lamp1', fromTerminal: 'out', toElementId: 'elem_src_n', toTerminal: 'in' }
    ]
  },

  // 2. LATCHING CONTACTOR (AUTO-MAINTIEN 13-14)
  {
    id: 'latching_contactor',
    nameAr: 'دارة تشغيل كونتاكتور مع استمرارية ذاتية (Auto-maintien)',
    nameFr: 'Commande Contacteur avec Auto-maintien (Latch 13-14)',
    descriptionAr: 'الدارة الصناعية الأكثر استخداماً: زر تشغيل أخضر S1 بالتوازي مع تماس KM1 13-14، وزر إيقاف أحمر S0 لقطع الاستمرارية.',
    elements: [
      {
        id: 'elem_src_l',
        type: 'source_phase',
        label: 'الطور L (230V)',
        tag: 'L1',
        x: 1,
        y: 1,
        state: { isEnergized: true }
      },
      {
        id: 'elem_s0',
        type: 'pushbutton_nc',
        label: 'زر إيقاف أحمر (1-2)',
        tag: 'S0 (Arrêt)',
        x: 3,
        y: 1,
        state: { isClosed: true, isPressed: false }
      },
      {
        id: 'elem_s1',
        type: 'pushbutton_no',
        label: 'زر تشغيل أخضر (3-4)',
        tag: 'S1 (Marche)',
        x: 6,
        y: 1,
        state: { isClosed: false, isPressed: false }
      },
      {
        id: 'elem_km1_no',
        type: 'aux_contact_no',
        label: 'تماس استمرارية (13-14)',
        tag: 'KM1 (13-14)',
        x: 6,
        y: 3,
        state: { isClosed: false }
      },
      {
        id: 'elem_coil_km1',
        type: 'contactor_coil',
        label: 'ملف الكونتاكتور (A1-A2)',
        tag: 'KM1 (Bobine)',
        x: 9,
        y: 1,
        state: { isEnergized: false }
      },
      {
        id: 'elem_src_n',
        type: 'source_neutral',
        label: 'الحيادي N (0V)',
        tag: 'N',
        x: 11,
        y: 1,
        state: { isEnergized: false }
      }
    ],
    connections: [
      { id: 'w1', fromElementId: 'elem_src_l', fromTerminal: 'out', toElementId: 'elem_s0', toTerminal: 'in' },
      { id: 'w2', fromElementId: 'elem_s0', fromTerminal: 'out', toElementId: 'elem_s1', toTerminal: 'in' },
      { id: 'w3', fromElementId: 'elem_s0', fromTerminal: 'out', toElementId: 'elem_km1_no', toTerminal: 'in' },
      { id: 'w4', fromElementId: 'elem_s1', fromTerminal: 'out', toElementId: 'elem_coil_km1', toTerminal: 'in' },
      { id: 'w5', fromElementId: 'elem_km1_no', fromTerminal: 'out', toElementId: 'elem_coil_km1', toTerminal: 'in' },
      { id: 'w6', fromElementId: 'elem_coil_km1', fromTerminal: 'out', toElementId: 'elem_src_n', toTerminal: 'in' }
    ]
  },

  // 3. INDUSTRIAL DOL WITH THERMAL RELAY & FAULT LIGHT
  {
    id: 'dol_thermal_emergency',
    nameAr: 'إقلاع مباشر صناعي مع ريليه حراري F1 وطوارئ ومحرك',
    nameFr: 'Démarrage DOL avec Relais Thermique F1, Arrêt d\'Urgence et Moteur',
    descriptionAr: 'مخطط تحكم صناعي مكتمل يضم زر طوارئ S_AU، تماس حراري 95-96 يقطع الدارة عند فرط الحمل، وتماس 97-98 يضيء مصباح العطل، ومحرك M1.',
    elements: [
      {
        id: 'elem_src_l',
        type: 'source_phase',
        label: 'طور التحكم L',
        tag: 'L1',
        x: 1,
        y: 1,
        state: { isEnergized: true }
      },
      {
        id: 'elem_thermal_nc',
        type: 'thermal_nc',
        label: 'تماس حراري NC (95-96)',
        tag: 'F1 (95-96)',
        x: 2,
        y: 1,
        state: { isClosed: true, isTripped: false }
      },
      {
        id: 'elem_sau',
        type: 'emergency_stop',
        label: 'زر طوارئ برأس فطر',
        tag: 'S_AU',
        x: 4,
        y: 1,
        state: { isClosed: true, isPressed: false }
      },
      {
        id: 'elem_s0',
        type: 'pushbutton_nc',
        label: 'زر إيقاف S0',
        tag: 'S0 (Arrêt)',
        x: 5,
        y: 1,
        state: { isClosed: true, isPressed: false }
      },
      {
        id: 'elem_s1',
        type: 'pushbutton_no',
        label: 'زر تشغيل S1',
        tag: 'S1 (Marche)',
        x: 7,
        y: 1,
        state: { isClosed: false, isPressed: false }
      },
      {
        id: 'elem_km1_no',
        type: 'aux_contact_no',
        label: 'استمرارية (13-14)',
        tag: 'KM1 (13-14)',
        x: 7,
        y: 3,
        state: { isClosed: false }
      },
      {
        id: 'elem_coil_km1',
        type: 'contactor_coil',
        label: 'ملف KM1 (A1-A2)',
        tag: 'KM1 (Coil)',
        x: 9,
        y: 1,
        state: { isEnergized: false }
      },
      {
        id: 'elem_motor',
        type: 'motor_3ph',
        label: 'المحرك الحثي M1',
        tag: 'M1 (3~)',
        x: 9,
        y: 3,
        state: { isEnergized: false }
      },
      {
        id: 'elem_lamp_fault',
        type: 'lamp_e1',
        label: 'مصباح عطل أحمر H2',
        tag: 'H2 (Défaut)',
        x: 5,
        y: 4,
        state: { isEnergized: false }
      },
      {
        id: 'elem_thermal_no',
        type: 'thermal_no',
        label: 'تماس حراري NO (97-98)',
        tag: 'F1 (97-98)',
        x: 2,
        y: 4,
        state: { isClosed: false, isTripped: false }
      },
      {
        id: 'elem_src_n',
        type: 'source_neutral',
        label: 'الحيادي N',
        tag: 'N',
        x: 11,
        y: 1,
        state: { isEnergized: false }
      }
    ],
    connections: [
      { id: 'w1', fromElementId: 'elem_src_l', fromTerminal: 'out', toElementId: 'elem_thermal_nc', toTerminal: 'in' },
      { id: 'w1b', fromElementId: 'elem_src_l', fromTerminal: 'out', toElementId: 'elem_thermal_no', toTerminal: 'in' },
      { id: 'w2', fromElementId: 'elem_thermal_nc', fromTerminal: 'out', toElementId: 'elem_sau', toTerminal: 'in' },
      { id: 'w3', fromElementId: 'elem_sau', fromTerminal: 'out', toElementId: 'elem_s0', toTerminal: 'in' },
      { id: 'w4', fromElementId: 'elem_s0', fromTerminal: 'out', toElementId: 'elem_s1', toTerminal: 'in' },
      { id: 'w5', fromElementId: 'elem_s0', fromTerminal: 'out', toElementId: 'elem_km1_no', toTerminal: 'in' },
      { id: 'w6', fromElementId: 'elem_s1', fromTerminal: 'out', toElementId: 'elem_coil_km1', toTerminal: 'in' },
      { id: 'w7', fromElementId: 'elem_km1_no', fromTerminal: 'out', toElementId: 'elem_coil_km1', toTerminal: 'in' },
      { id: 'w8', fromElementId: 'elem_coil_km1', fromTerminal: 'out', toElementId: 'elem_src_n', toTerminal: 'in' },
      { id: 'w9', fromElementId: 'elem_coil_km1', fromTerminal: 'in', toElementId: 'elem_motor', toTerminal: 'in' },
      { id: 'w10', fromElementId: 'elem_thermal_no', fromTerminal: 'out', toElementId: 'elem_lamp_fault', toTerminal: 'in' },
      { id: 'w11', fromElementId: 'elem_lamp_fault', fromTerminal: 'out', toElementId: 'elem_src_n', toTerminal: 'in' }
    ]
  },

  // 4. ON-DELAY TIMER CIRCUIT (TEMPORISATEUR AU TRAVAIL TON)
  {
    id: 'timer_ton_circuit',
    nameAr: 'دارة مؤقت زمني عند التشغيل (Temporisation TON)',
    nameFr: 'Circuit avec Relais Temporisé au Travail (TON)',
    descriptionAr: 'تشغيل مفتاح التحكم SA1 يبدأ العد التنازلي للمؤقت الزمني TON KA1، وبعد انقضاء 3 ثوانٍ يغلق تلامسه 67-68 ليشتغل الحمل تلقائياً.',
    elements: [
      {
        id: 'elem_src_l',
        type: 'source_phase',
        label: 'الطور L (230V)',
        tag: 'L1',
        x: 1,
        y: 1,
        state: { isEnergized: true }
      },
      {
        id: 'elem_sa1',
        type: 'switch_spst',
        label: 'مفتاح البدء S1',
        tag: 'SA1',
        x: 3,
        y: 1,
        state: { isClosed: false }
      },
      {
        id: 'elem_timer',
        type: 'timer_ton',
        label: 'مؤقت TON (3 ثوانٍ)',
        tag: 'KA1 (Timer)',
        x: 6,
        y: 1,
        state: { isEnergized: false, timerValue: 3, timerElapsed: 0 }
      },
      {
        id: 'elem_timer_no',
        type: 'timer_contact_no',
        label: 'تماس المؤقت (67-68)',
        tag: 'KA1 (67-68)',
        x: 6,
        y: 3,
        state: { isClosed: false }
      },
      {
        id: 'elem_lamp1',
        type: 'lamp_e1',
        label: 'الحمل المؤجل (مصباح)',
        tag: 'E1',
        x: 9,
        y: 3,
        state: { isEnergized: false }
      },
      {
        id: 'elem_src_n',
        type: 'source_neutral',
        label: 'الحيادي N',
        tag: 'N',
        x: 11,
        y: 1,
        state: { isEnergized: false }
      }
    ],
    connections: [
      { id: 'w1', fromElementId: 'elem_src_l', fromTerminal: 'out', toElementId: 'elem_sa1', toTerminal: 'in' },
      { id: 'w2', fromElementId: 'elem_sa1', fromTerminal: 'out', toElementId: 'elem_timer', toTerminal: 'in' },
      { id: 'w3', fromElementId: 'elem_sa1', fromTerminal: 'out', toElementId: 'elem_timer_no', toTerminal: 'in' },
      { id: 'w4', fromElementId: 'elem_timer', fromTerminal: 'out', toElementId: 'elem_src_n', toTerminal: 'in' },
      { id: 'w5', fromElementId: 'elem_timer_no', fromTerminal: 'out', toElementId: 'elem_lamp1', toTerminal: 'in' },
      { id: 'w6', fromElementId: 'elem_lamp1', fromTerminal: 'out', toElementId: 'elem_src_n', toTerminal: 'in' }
    ]
  }
];
