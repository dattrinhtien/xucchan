/**
 * TypeScript types cho toàn bộ ứng dụng
 */

import { GroupType } from '@/constants/meridians';

// ==============================
// Thông tin bệnh nhân
// ==============================
export interface PatientInfo {
  id?: string;
  fullName?: string;
  patientCode?: string;
  age?: number;
  birthYear?: number;
  gender?: 'nam' | 'nu' | 'khac' | '';
  notes?: string;
  createdAt?: string;
}

// ==============================
// Input đo lường
// ==============================

/** Giá trị nhập cho 1 kinh */
export interface MeridianInput {
  meridianCode: string;
  leftTemp: number;
  rightTemp: number;
}

/** Toàn bộ input cho 1 lần đo */
export interface MeasurementInput {
  // Thông tin bệnh nhân (tùy chọn)
  patient?: PatientInfo;
  // 12 kinh
  meridians: MeridianInput[];
  // Thông tin phiên đo
  measuredAt: string;       // ISO datetime
  operatorName?: string;    // Người đo
  symptomsNote?: string;    // Ghi chú triệu chứng
  conditionNote?: string;   // Tình trạng lúc đo
  roomTemperature?: number; // Nhiệt độ phòng
  bloodPressure?: string;   // Huyết áp
  pulse?: number;           // Mạch
  spo2?: number;            // SpO2
  conclusionNote?: string;  // Ghi chú kết luận
}

// ==============================
// Kết quả tính toán
// ==============================

/** Trạng thái Hàn / Nhiệt */
export type ThermalState = 'Nhiệt' | 'Hàn' | '';

/** Kết quả tính toán cho 1 kinh */
export interface MeridianResult {
  meridianCode: string;
  meridianName: string;
  groupType: GroupType;
  // Giá trị đo
  leftTemp: number;
  rightTemp: number;
  // Tính toán
  mean: number;           // (left + right) / 2
  diff: number;           // ABS(left - right)
  // Trạng thái
  leftState: ThermalState;    // Hàn / Nhiệt / ''
  rightState: ThermalState;
  finalState: string;         // Biểu/Lý conclusion
  // Thống kê nhóm (reference)
  groupLeftMean: number;
  groupRightMean: number;
  groupMax: number;
  groupMin: number;
  groupRange: number;
  groupCenter: number;
  groupError: number;
  upperThreshold: number;
  lowerThreshold: number;
  // Phân tích
  deviationFromCenter: number;  // |mean - groupCenter|
  rankDiff: number;             // Xếp hạng chênh trái-phải (1 = lớn nhất)
}

/** Thống kê theo nhóm tay / chân */
export interface GroupStats {
  groupType: GroupType;
  groupLeftMean: number;
  groupRightMean: number;
  groupMax: number;
  groupMin: number;
  groupRange: number;
  groupCenter: number;
  groupError: number;
  upperThreshold: number;
  lowerThreshold: number;
}

/** Kết quả tính toán đầy đủ cho 1 phiên đo */
export interface CalculationResult {
  meridians: MeridianResult[];
  handStats: GroupStats;
  footStats: GroupStats;
  upperLowerDiff: number;  // groupCenter(tay) - groupCenter(chân)
  alerts: AlertItem[];
  rankings: RankingItem[];
}

/** Cảnh báo bất thường */
export interface AlertItem {
  type: 'diff_high' | 'deviation_high' | 'threshold_exceeded';
  meridianCode: string;
  meridianName: string;
  message: string;
  severity: 'warning' | 'danger';
}

/** Xếp hạng kinh lệch */
export interface RankingItem {
  meridianCode: string;
  meridianName: string;
  rank: number;
  diff: number;
  deviationFromCenter: number;
}

// ==============================
// Phiên đo lưu DB
// ==============================
export interface MeasurementSession {
  id: string;
  patientId?: string | null;
  patient?: PatientInfo | null;
  measuredAt: string;
  operatorName?: string;
  symptomsNote?: string;
  conditionNote?: string;
  roomTemperature?: number;
  bloodPressure?: string;
  pulse?: number;
  spo2?: number;
  conclusionNote?: string;
  upperGroupCenter?: number;
  lowerGroupCenter?: number;
  upperLowerDiff?: number;
  createdAt: string;
  // Joined data
  values?: MeridianResult[];
}

// ==============================
// So sánh nhiều lần đo
// ==============================
export interface ComparisonResult {
  sessions: MeasurementSession[];
  // Dữ liệu đã chuẩn bị cho chart so sánh
  comparisonData: ComparisonDataPoint[];
}

export interface ComparisonDataPoint {
  meridianCode: string;
  meridianName: string;
  [sessionKey: string]: string | number; // mean_{sessionId}: number
}

// ==============================
// Export PDF
// ==============================
export interface ExportPayload {
  session: MeasurementSession;
  patient?: PatientInfo;
  result: CalculationResult;
}

// ==============================
// Database row types (Supabase)
// ==============================
export interface DBPatient {
  id: string;
  full_name: string | null;
  patient_code: string | null;
  age: number | null;
  birth_year: number | null;
  gender: string | null;
  notes: string | null;
  created_at: string;
}

export interface DBMeasurementSession {
  id: string;
  patient_id: string | null;
  measured_at: string;
  operator_name: string | null;
  symptoms_note: string | null;
  condition_note: string | null;
  room_temperature: number | null;
  blood_pressure: string | null;
  pulse: number | null;
  spo2: number | null;
  conclusion_note: string | null;
  upper_group_center: number | null;
  lower_group_center: number | null;
  upper_lower_diff: number | null;
  created_at: string;
  // Joined
  patients?: DBPatient | null;
}

export interface DBMeasurementValue {
  id: string;
  session_id: string;
  meridian_code: string;
  meridian_name: string;
  group_type: string;
  left_temp: number;
  right_temp: number;
  mean_temp: number;
  left_right_diff: number;
  left_state: string;
  right_state: string;
  final_state: string;
  group_left_mean: number;
  group_right_mean: number;
  group_max: number;
  group_min: number;
  group_range: number;
  group_center: number;
  group_error: number;
  upper_threshold: number;
  lower_threshold: number;
  deviation_from_center: number;
  rank_diff: number;
}
