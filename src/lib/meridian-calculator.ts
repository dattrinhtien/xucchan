/**
 * Module tính toán nghiệp vụ 12 đường kinh
 * 
 * QUAN TRỌNG: Logic trong file này phải giữ đúng 100% theo Excel nghiệp vụ.
 * Không tự ý thay đổi, tối ưu hóa, hoặc "cải tiến" công thức.
 * 
 * Quy trình tính:
 * 1. Tính mean và diff cho từng kinh
 * 2. Tính thống kê theo nhóm tay/chân (groupMax, groupMin, groupRange, groupCenter, groupError, thresholds)
 * 3. Phân loại Hàn/Nhiệt cho từng bên trái/phải
 * 4. Kết luận Biểu/Lý
 * 5. Cảnh báo bất thường + ranking
 */

import { MERIDIANS, HAND_MERIDIANS, FOOT_MERIDIANS, MERIDIAN_MAP, type GroupType } from '@/constants/meridians';
import type {
  MeridianInput,
  MeridianResult,
  GroupStats,
  CalculationResult,
  ThermalState,
  AlertItem,
  RankingItem,
} from '@/types';

// ==============================
// 3.1. Tính toán từng kinh
// ==============================

/**
 * Tính trung bình của 1 kinh
 * mean = (left + right) / 2
 */
export function calculateMean(left: number, right: number): number {
  return (left + right) / 2;
}

/**
 * Tính chênh lệch trái-phải của 1 kinh
 * diff = ABS(left - right)
 */
export function calculateDiff(left: number, right: number): number {
  return Math.abs(left - right);
}

// ==============================
// 3.2. Tính toán theo nhóm tay / chân
// ==============================

/**
 * Tính thống kê theo nhóm (tay hoặc chân)
 * 
 * Mỗi nhóm có 6 kinh.
 * - groupLeftMean = trung bình 6 giá trị bên trái của nhóm
 * - groupRightMean = trung bình 6 giá trị bên phải của nhóm
 * - groupMax = giá trị lớn nhất trong toàn bộ 12 điểm (6 trái + 6 phải)
 * - groupMin = giá trị nhỏ nhất trong toàn bộ 12 điểm
 * - groupRange = groupMax - groupMin
 * - groupCenter = (groupMax + groupMin) / 2
 * - groupError = groupRange / 6
 * - upperThreshold = groupCenter + groupError
 * - lowerThreshold = groupCenter - groupError
 */
export function calculateGroupStats(
  inputs: MeridianInput[],
  groupType: GroupType
): GroupStats {
  // Lọc lấy các kinh thuộc nhóm
  const groupCodes = (groupType === 'tay' ? HAND_MERIDIANS : FOOT_MERIDIANS)
    .map(m => m.code);
  
  const groupInputs = inputs.filter(i => groupCodes.includes(i.meridianCode));
  
  if (groupInputs.length === 0) {
    return {
      groupType,
      groupLeftMean: 0,
      groupRightMean: 0,
      groupMax: 0,
      groupMin: 0,
      groupRange: 0,
      groupCenter: 0,
      groupError: 0,
      upperThreshold: 0,
      lowerThreshold: 0,
    };
  }

  const leftValues = groupInputs.map(i => i.leftTemp);
  const rightValues = groupInputs.map(i => i.rightTemp);
  const allValues = [...leftValues, ...rightValues];

  // Trung bình bên trái và phải của nhóm
  const groupLeftMean = leftValues.reduce((a, b) => a + b, 0) / leftValues.length;
  const groupRightMean = rightValues.reduce((a, b) => a + b, 0) / rightValues.length;

  // Max, Min trong toàn bộ 12 điểm (6 trái + 6 phải)
  const groupMax = Math.max(...allValues);
  const groupMin = Math.min(...allValues);

  // Biên độ
  const groupRange = groupMax - groupMin;

  // Trung tâm
  const groupCenter = (groupMax + groupMin) / 2;

  // Sai số = biên độ / 6
  const groupError = groupRange / 6;

  // Ngưỡng trên và dưới
  const upperThreshold = groupCenter + groupError;
  const lowerThreshold = groupCenter - groupError;

  return {
    groupType,
    groupLeftMean: round2(groupLeftMean),
    groupRightMean: round2(groupRightMean),
    groupMax: round2(groupMax),
    groupMin: round2(groupMin),
    groupRange: round2(groupRange),
    groupCenter: round2(groupCenter),
    groupError: round2(groupError),
    upperThreshold: round2(upperThreshold),
    lowerThreshold: round2(lowerThreshold),
  };
}

// ==============================
// 3.4. Quy tắc Hàn / Nhiệt
// ==============================

/**
 * Phân loại Hàn/Nhiệt cho 1 giá trị
 * 
 * - value > upperThreshold => "Nhiệt"
 * - value < lowerThreshold => "Hàn"
 * - giữa ngưỡng => "" (bình thường)
 */
export function classifyThermalState(
  value: number,
  upperThreshold: number,
  lowerThreshold: number
): ThermalState {
  if (value > upperThreshold) return 'Nhiệt';
  if (value < lowerThreshold) return 'Hàn';
  return '';
}

// ==============================
// 3.5. Quy tắc Biểu / Lý
// ==============================

/**
 * Kết luận Biểu/Lý cho 1 kinh dựa trên trạng thái trái/phải
 * 
 * Logic giữ đúng 100% theo Excel:
 * - trái = phải = "Nhiệt" => "Lý Nhiệt"
 * - trái = phải = "Hàn" => "Lý Hàn"
 * - trái = phải = "" => ""
 * - trái rỗng, phải có giá trị => "Biểu {state} Phải"
 * - phải rỗng, trái có giá trị => "Biểu {state} Trái"
 * - trái = "Hàn", phải = "Nhiệt" => "Biểu Hàn Trái, Biểu Nhiệt Phải"
 * - trái = "Nhiệt", phải = "Hàn" => "Biểu Nhiệt Trái, Biểu Hàn Phải"
 */
export function determineFinalState(
  leftState: ThermalState,
  rightState: ThermalState
): string {
  // Cả hai giống nhau
  if (leftState === rightState) {
    if (leftState === 'Nhiệt') return 'Lý Nhiệt';
    if (leftState === 'Hàn') return 'Lý Hàn';
    return ''; // cả hai đều bình thường
  }

  // Một bên rỗng, bên kia có giá trị
  if (leftState === '' && rightState !== '') {
    return `Biểu ${rightState} Phải`;
  }
  if (rightState === '' && leftState !== '') {
    return `Biểu ${leftState} Trái`;
  }

  // Hai bên khác nhau (Hàn vs Nhiệt)
  return `Biểu ${leftState} Trái, Biểu ${rightState} Phải`;
}

// ==============================
// 3.3. Chênh tay – chân
// ==============================

/**
 * Chênh tay – chân
 * upperLowerDiff = groupCenter(tay) - groupCenter(chân)
 */
export function calculateUpperLowerDiff(
  handStats: GroupStats,
  footStats: GroupStats
): number {
  return round2(handStats.groupCenter - footStats.groupCenter);
}

// ==============================
// 3.7. Cảnh báo bất thường
// ==============================

/**
 * Tạo danh sách cảnh báo bất thường:
 * - Kinh có diff trái-phải lớn nhất
 * - Kinh có mean lệch nhiều nhất so với groupCenter
 * - Giá trị vượt ngưỡng rõ rệt
 */
function generateAlerts(meridianResults: MeridianResult[]): AlertItem[] {
  const alerts: AlertItem[] = [];

  for (const mr of meridianResults) {
    // Cảnh báo chênh trái-phải lớn (> 0.5)
    if (mr.diff > 0.5) {
      alerts.push({
        type: 'diff_high',
        meridianCode: mr.meridianCode,
        meridianName: mr.meridianName,
        message: `${mr.meridianName}: Chênh trái-phải ${mr.diff.toFixed(2)}°C`,
        severity: mr.diff > 1.0 ? 'danger' : 'warning',
      });
    }

    // Cảnh báo vượt ngưỡng
    if (mr.leftState === 'Nhiệt' || mr.leftState === 'Hàn') {
      const deviation = mr.leftState === 'Nhiệt'
        ? mr.leftTemp - mr.upperThreshold
        : mr.lowerThreshold - mr.leftTemp;
      if (deviation > 0.3) {
        alerts.push({
          type: 'threshold_exceeded',
          meridianCode: mr.meridianCode,
          meridianName: mr.meridianName,
          message: `${mr.meridianName} (Trái): ${mr.leftState} vượt ngưỡng ${deviation.toFixed(2)}°C`,
          severity: deviation > 0.5 ? 'danger' : 'warning',
        });
      }
    }

    if (mr.rightState === 'Nhiệt' || mr.rightState === 'Hàn') {
      const deviation = mr.rightState === 'Nhiệt'
        ? mr.rightTemp - mr.upperThreshold
        : mr.lowerThreshold - mr.rightTemp;
      if (deviation > 0.3) {
        alerts.push({
          type: 'threshold_exceeded',
          meridianCode: mr.meridianCode,
          meridianName: mr.meridianName,
          message: `${mr.meridianName} (Phải): ${mr.rightState} vượt ngưỡng ${deviation.toFixed(2)}°C`,
          severity: deviation > 0.5 ? 'danger' : 'warning',
        });
      }
    }

    // Cảnh báo mean lệch nhiều so với groupCenter
    if (mr.deviationFromCenter > 0.5) {
      alerts.push({
        type: 'deviation_high',
        meridianCode: mr.meridianCode,
        meridianName: mr.meridianName,
        message: `${mr.meridianName}: Lệch tâm ${mr.deviationFromCenter.toFixed(2)}°C`,
        severity: mr.deviationFromCenter > 1.0 ? 'danger' : 'warning',
      });
    }
  }

  return alerts;
}

/**
 * Tạo ranking các kinh lệch mạnh nhất
 * Sắp xếp theo diff (chênh trái-phải) giảm dần
 */
function generateRankings(meridianResults: MeridianResult[]): RankingItem[] {
  return meridianResults
    .map(mr => ({
      meridianCode: mr.meridianCode,
      meridianName: mr.meridianName,
      rank: 0,
      diff: mr.diff,
      deviationFromCenter: mr.deviationFromCenter,
    }))
    .sort((a, b) => b.diff - a.diff)
    .map((item, idx) => ({ ...item, rank: idx + 1 }));
}

// ==============================
// MAIN: Tính toán toàn bộ
// ==============================

/**
 * Hàm tính toán chính.
 * Nhận raw input, trả ra structured result.
 * Không phụ thuộc UI.
 */
export function calculate(inputs: MeridianInput[]): CalculationResult {
  // Bước 1: Tính thống kê nhóm tay và chân
  const handStats = calculateGroupStats(inputs, 'tay');
  const footStats = calculateGroupStats(inputs, 'chan');

  // Bước 2: Tính kết quả từng kinh
  const meridianResults: MeridianResult[] = inputs.map(input => {
    const definition = MERIDIAN_MAP.get(input.meridianCode);
    if (!definition) {
      throw new Error(`Meridian code not found: ${input.meridianCode}`);
    }

    const groupStats = definition.group === 'tay' ? handStats : footStats;

    // 3.1. Mean và Diff
    const mean = round2(calculateMean(input.leftTemp, input.rightTemp));
    const diff = round2(calculateDiff(input.leftTemp, input.rightTemp));

    // 3.4. Phân loại Hàn/Nhiệt cho từng bên
    const leftState = classifyThermalState(
      input.leftTemp,
      groupStats.upperThreshold,
      groupStats.lowerThreshold
    );
    const rightState = classifyThermalState(
      input.rightTemp,
      groupStats.upperThreshold,
      groupStats.lowerThreshold
    );

    // 3.5. Kết luận Biểu/Lý
    const finalState = determineFinalState(leftState, rightState);

    // Độ lệch so với groupCenter
    const deviationFromCenter = round2(Math.abs(mean - groupStats.groupCenter));

    return {
      meridianCode: input.meridianCode,
      meridianName: definition.name,
      groupType: definition.group,
      leftTemp: input.leftTemp,
      rightTemp: input.rightTemp,
      mean,
      diff,
      leftState,
      rightState,
      finalState,
      groupLeftMean: groupStats.groupLeftMean,
      groupRightMean: groupStats.groupRightMean,
      groupMax: groupStats.groupMax,
      groupMin: groupStats.groupMin,
      groupRange: groupStats.groupRange,
      groupCenter: groupStats.groupCenter,
      groupError: groupStats.groupError,
      upperThreshold: groupStats.upperThreshold,
      lowerThreshold: groupStats.lowerThreshold,
      deviationFromCenter,
      rankDiff: 0, // sẽ được gán sau
    };
  });

  // Bước 3: Tính ranking theo diff (xếp hạng chênh trái-phải)
  const sortedByDiff = [...meridianResults].sort((a, b) => b.diff - a.diff);
  sortedByDiff.forEach((mr, idx) => {
    const original = meridianResults.find(m => m.meridianCode === mr.meridianCode);
    if (original) {
      original.rankDiff = idx + 1;
    }
  });

  // 3.3. Chênh tay – chân
  const upperLowerDiff = calculateUpperLowerDiff(handStats, footStats);

  // 3.7. Cảnh báo bất thường
  const alerts = generateAlerts(meridianResults);

  // Ranking
  const rankings = generateRankings(meridianResults);

  return {
    meridians: meridianResults,
    handStats,
    footStats,
    upperLowerDiff,
    alerts,
    rankings,
  };
}

// ==============================
// Utilities
// ==============================

/** Làm tròn 2 chữ số thập phân */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
