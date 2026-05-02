/**
 * Unit tests cho module tính toán nghiệp vụ
 * Kiểm tra: mean, diff, groupStats, Hàn/Nhiệt, Biểu/Lý
 */

import {
  calculateMean,
  calculateDiff,
  calculateGroupStats,
  classifyThermalState,
  determineFinalState,
  calculateUpperLowerDiff,
  calculate,
} from '../meridian-calculator';
import type { MeridianInput } from '@/types';

// ========== Test data ==========
const sampleInputs: MeridianInput[] = [
  // Nhóm tay
  { meridianCode: 'TTr',   leftTemp: 31.5,  rightTemp: 31.3 },
  { meridianCode: 'Tam',   leftTemp: 32.5,  rightTemp: 31.8 },
  { meridianCode: '3Tieu', leftTemp: 31.8,  rightTemp: 31.7 },
  { meridianCode: 'TBL',   leftTemp: 31.6,  rightTemp: 31.5 },
  { meridianCode: 'DTr',   leftTemp: 31.2,  rightTemp: 31.0 },
  { meridianCode: 'Phe',   leftTemp: 31.9,  rightTemp: 31.8 },
  // Nhóm chân
  { meridianCode: 'BQ',    leftTemp: 32.4,  rightTemp: 32.2 },
  { meridianCode: 'Than',  leftTemp: 31.4,  rightTemp: 31.5 },
  { meridianCode: 'Dom',   leftTemp: 32.1,  rightTemp: 32.3 },
  { meridianCode: 'Vi',    leftTemp: 32.0,  rightTemp: 31.8 },
  { meridianCode: 'Can',   leftTemp: 32.5,  rightTemp: 32.8 },
  { meridianCode: 'Ty',    leftTemp: 31.7,  rightTemp: 31.6 },
];

// ========== 3.1 Tests ==========
describe('calculateMean', () => {
  test('tính trung bình chính xác', () => {
    expect(calculateMean(31.5, 31.3)).toBeCloseTo(31.4, 2);
    expect(calculateMean(32.5, 31.8)).toBeCloseTo(32.15, 2);
    expect(calculateMean(31.0, 31.0)).toBeCloseTo(31.0, 2);
  });
});

describe('calculateDiff', () => {
  test('tính chênh lệch tuyệt đối', () => {
    expect(calculateDiff(31.5, 31.3)).toBeCloseTo(0.2, 2);
    expect(calculateDiff(31.8, 32.5)).toBeCloseTo(0.7, 2);
    expect(calculateDiff(31.0, 31.0)).toBe(0);
  });
});

// ========== 3.2 Tests ==========
describe('calculateGroupStats', () => {
  test('tính thống kê nhóm tay', () => {
    const stats = calculateGroupStats(sampleInputs, 'tay');
    
    // groupLeftMean = (31.5 + 32.5 + 31.8 + 31.6 + 31.2 + 31.9) / 6
    expect(stats.groupLeftMean).toBeCloseTo(31.75, 1);
    
    // groupMax = max of all 12 values in hand group
    expect(stats.groupMax).toBe(32.5);
    
    // groupMin = min of all 12 values
    expect(stats.groupMin).toBe(31.0);
    
    // groupRange = max - min
    expect(stats.groupRange).toBeCloseTo(1.5, 2);
    
    // groupCenter = (max + min) / 2
    expect(stats.groupCenter).toBeCloseTo(31.75, 2);
    
    // groupError = range / 6
    expect(stats.groupError).toBeCloseTo(0.25, 2);
    
    // upperThreshold = center + error
    expect(stats.upperThreshold).toBeCloseTo(32.0, 2);
    
    // lowerThreshold = center - error
    expect(stats.lowerThreshold).toBeCloseTo(31.5, 2);
  });

  test('tính thống kê nhóm chân', () => {
    const stats = calculateGroupStats(sampleInputs, 'chan');
    
    // groupMax = max(32.4, 32.2, 31.4, 31.5, 32.1, 32.3, 32.0, 31.8, 32.5, 32.8, 31.7, 31.6)
    expect(stats.groupMax).toBe(32.8);
    expect(stats.groupMin).toBe(31.4);
  });
});

// ========== 3.4 Tests ==========
describe('classifyThermalState', () => {
  test('Nhiệt khi vượt ngưỡng trên', () => {
    expect(classifyThermalState(32.5, 32.0, 31.5)).toBe('Nhiệt');
  });

  test('Hàn khi dưới ngưỡng dưới', () => {
    expect(classifyThermalState(31.0, 32.0, 31.5)).toBe('Hàn');
  });

  test('Bình thường khi nằm giữa', () => {
    expect(classifyThermalState(31.8, 32.0, 31.5)).toBe('');
  });

  test('Bình thường khi bằng đúng ngưỡng trên', () => {
    expect(classifyThermalState(32.0, 32.0, 31.5)).toBe('');
  });

  test('Bình thường khi bằng đúng ngưỡng dưới', () => {
    expect(classifyThermalState(31.5, 32.0, 31.5)).toBe('');
  });
});

// ========== 3.5 Tests ==========
describe('determineFinalState', () => {
  test('cả hai Nhiệt => Lý Nhiệt', () => {
    expect(determineFinalState('Nhiệt', 'Nhiệt')).toBe('Lý Nhiệt');
  });

  test('cả hai Hàn => Lý Hàn', () => {
    expect(determineFinalState('Hàn', 'Hàn')).toBe('Lý Hàn');
  });

  test('cả hai bình thường => rỗng', () => {
    expect(determineFinalState('', '')).toBe('');
  });

  test('trái rỗng, phải Nhiệt => Biểu Nhiệt Phải', () => {
    expect(determineFinalState('', 'Nhiệt')).toBe('Biểu Nhiệt Phải');
  });

  test('phải rỗng, trái Hàn => Biểu Hàn Trái', () => {
    expect(determineFinalState('Hàn', '')).toBe('Biểu Hàn Trái');
  });

  test('trái Hàn, phải Nhiệt => cả hai Biểu', () => {
    expect(determineFinalState('Hàn', 'Nhiệt')).toBe('Biểu Hàn Trái, Biểu Nhiệt Phải');
  });

  test('trái Nhiệt, phải Hàn => cả hai Biểu', () => {
    expect(determineFinalState('Nhiệt', 'Hàn')).toBe('Biểu Nhiệt Trái, Biểu Hàn Phải');
  });

  test('trái rỗng, phải Hàn => Biểu Hàn Phải', () => {
    expect(determineFinalState('', 'Hàn')).toBe('Biểu Hàn Phải');
  });

  test('trái Nhiệt, phải rỗng => Biểu Nhiệt Trái', () => {
    expect(determineFinalState('Nhiệt', '')).toBe('Biểu Nhiệt Trái');
  });
});

// ========== 3.3 Tests ==========
describe('calculateUpperLowerDiff', () => {
  test('chênh tay - chân', () => {
    const handStats = calculateGroupStats(sampleInputs, 'tay');
    const footStats = calculateGroupStats(sampleInputs, 'chan');
    const diff = calculateUpperLowerDiff(handStats, footStats);
    // diff = handCenter - footCenter
    expect(typeof diff).toBe('number');
  });
});

// ========== Full calculation test ==========
describe('calculate (full pipeline)', () => {
  test('trả ra kết quả đúng cấu trúc', () => {
    const result = calculate(sampleInputs);
    
    expect(result.meridians).toHaveLength(12);
    expect(result.handStats.groupType).toBe('tay');
    expect(result.footStats.groupType).toBe('chan');
    expect(typeof result.upperLowerDiff).toBe('number');
    expect(Array.isArray(result.alerts)).toBe(true);
    expect(Array.isArray(result.rankings)).toBe(true);
    expect(result.rankings).toHaveLength(12);
  });

  test('rankings sắp xếp theo diff giảm dần', () => {
    const result = calculate(sampleInputs);
    for (let i = 1; i < result.rankings.length; i++) {
      expect(result.rankings[i - 1].diff).toBeGreaterThanOrEqual(result.rankings[i].diff);
    }
  });

  test('mỗi kinh có rankDiff từ 1-12', () => {
    const result = calculate(sampleInputs);
    const ranks = result.meridians.map(m => m.rankDiff).sort((a, b) => a - b);
    expect(ranks).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  test('finalState tuân theo quy tắc Biểu/Lý', () => {
    const result = calculate(sampleInputs);
    result.meridians.forEach(m => {
      if (m.leftState === 'Nhiệt' && m.rightState === 'Nhiệt') {
        expect(m.finalState).toBe('Lý Nhiệt');
      }
      if (m.leftState === 'Hàn' && m.rightState === 'Hàn') {
        expect(m.finalState).toBe('Lý Hàn');
      }
      if (m.leftState === '' && m.rightState === '') {
        expect(m.finalState).toBe('');
      }
    });
  });
});
