export type ComponentCategory = 'source' | 'switch' | 'protection' | 'relay' | 'load';

export type ComponentType = 
  | 'source_phase'        // خط الطور L (230V)
  | 'source_neutral'      // خط الحيادي N (0V)
  | 'source_dc_pos'       // +24V DC
  | 'source_dc_neg'       // 0V DC
  | 'switch_spst'         // مفتاح عادي أحادي
  | 'pushbutton_no'       // زر ضغط تشغيل NO (3-4)
  | 'pushbutton_nc'       // زر ضغط إيقاف NC (1-2)
  | 'emergency_stop'      // زر طوارئ NC
  | 'breaker_q1'          // قاطع حماية Q1
  | 'thermal_nc'          // تماس ريليه حراري F1 (95-96 NC)
  | 'thermal_no'          // تماس ريليه حراري F1 (97-98 NO)
  | 'contactor_coil'      // ملف كونتاكتور KM1 (A1-A2)
  | 'aux_contact_no'      // تماس مساعد مفتوح KM1 (13-14)
  | 'aux_contact_nc'      // تماس مساعد مغلق KM1 (21-22)
  | 'timer_ton'           // مؤقت تشغيل TON (A1-A2)
  | 'timer_contact_no'    // تماس مؤقت مفتوح (67-68)
  | 'lamp_e1'             // مصباح إشارة / إنارة
  | 'motor_3ph'           // محرك حثي M1
  | 'buzzer'              // منبه صوتي سونريت
  | 'resistor_load';      // مقاومة تسخين

export interface CircuitElement {
  id: string;
  type: ComponentType;
  label: string;
  tag: string;
  x: number; // grid column (0-11)
  y: number; // grid row (0-7)
  state: {
    isClosed?: boolean;     // for switches / contacts
    isEnergized?: boolean;  // for coils / lamps / motors
    isTripped?: boolean;    // for thermal / breaker
    isPressed?: boolean;    // for pushbuttons
    timerValue?: number;    // seconds
    timerElapsed?: number;
  };
  connectedTo?: string[]; // IDs of connected element terminals
}

export interface WireConnection {
  id: string;
  fromElementId: string;
  fromTerminal: string; // e.g. 'out', 'in', 'L', 'N', '13', '14', 'A1', 'A2'
  toElementId: string;
  toTerminal: string;
  isLive?: boolean;
}

export interface PrebuiltTemplate {
  id: string;
  nameAr: string;
  nameFr: string;
  descriptionAr: string;
  elements: CircuitElement[];
  connections: WireConnection[];
}
