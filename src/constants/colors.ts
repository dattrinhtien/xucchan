/**
 * Bảng màu cho trạng thái Hàn / Nhiệt / Bình
 */

export const STATE_COLORS = {
  /** Nhiệt = đỏ */
  nhiet: {
    bg: '#FEE2E2',
    text: '#DC2626',
    border: '#FECACA',
    chart: '#EF4444',
    gradient: 'from-red-50 to-red-100',
  },
  /** Hàn = xanh dương */
  han: {
    bg: '#DBEAFE',
    text: '#2563EB',
    border: '#BFDBFE',
    chart: '#3B82F6',
    gradient: 'from-blue-50 to-blue-100',
  },
  /** Bình thường = xám */
  binh: {
    bg: '#F3F4F6',
    text: '#6B7280',
    border: '#E5E7EB',
    chart: '#9CA3AF',
    gradient: 'from-gray-50 to-gray-100',
  },
} as const;

/** Màu cho biểu đồ */
export const CHART_COLORS = {
  left: '#8B5CF6',       // Tím - bên trái
  right: '#F59E0B',      // Vàng cam - bên phải
  mean: '#10B981',       // Xanh lá - trung bình
  upperThreshold: '#EF4444', // Đỏ - ngưỡng trên
  lowerThreshold: '#3B82F6', // Xanh - ngưỡng dưới
  handGroup: '#6366F1',  // Indigo - nhóm tay
  footGroup: '#EC4899',  // Hồng - nhóm chân
  diff: '#F97316',       // Cam - chênh lệch
  grid: '#E5E7EB',       // Xám nhạt - lưới
  background: '#F9FAFB', // Nền
} as const;

/** Palette cho so sánh nhiều lần đo */
export const COMPARISON_PALETTE = [
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F59E0B', // Amber
  '#8B5CF6', // Violet
  '#EF4444', // Red
  '#06B6D4', // Cyan
  '#84CC16', // Lime
] as const;
