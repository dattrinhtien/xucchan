/**
 * Danh sách 12 đường kinh cố định
 * Hard-code, không cho sửa tên kinh ở phiên bản v1
 */

export type GroupType = 'tay' | 'chan';

export interface MeridianDefinition {
  code: string;       // Mã kinh (key duy nhất)
  name: string;       // Tên hiển thị
  group: GroupType;    // Nhóm tay hoặc chân
  order: number;      // Thứ tự hiển thị
}

/**
 * 12 đường kinh theo thứ tự:
 * Nhóm tay: TTr, Tâm, 3Tiêu, TBL, ĐTr, Phế
 * Nhóm chân: BQ, Thận, Đởm, Vị, Can, Tỳ
 */
export const MERIDIANS: MeridianDefinition[] = [
  // Nhóm tay (6 kinh)
  { code: 'TTr',    name: 'Tiểu Trường',   group: 'tay',  order: 1 },
  { code: 'Tam',    name: 'Tâm',            group: 'tay',  order: 2 },
  { code: '3Tieu',  name: 'Tam Tiêu',       group: 'tay',  order: 3 },
  { code: 'TBL',    name: 'Tâm Bào Lạc',    group: 'tay',  order: 4 },
  { code: 'DTr',    name: 'Đại Trường',     group: 'tay',  order: 5 },
  { code: 'Phe',    name: 'Phế',            group: 'tay',  order: 6 },
  // Nhóm chân (6 kinh)
  { code: 'BQ',     name: 'Bàng Quang',     group: 'chan', order: 7 },
  { code: 'Than',   name: 'Thận',           group: 'chan', order: 8 },
  { code: 'Dom',    name: 'Đởm',            group: 'chan', order: 9 },
  { code: 'Vi',     name: 'Vị',             group: 'chan', order: 10 },
  { code: 'Can',    name: 'Can',            group: 'chan', order: 11 },
  { code: 'Ty',     name: 'Tỳ',             group: 'chan', order: 12 },
];

/** Lấy danh sách kinh theo nhóm */
export const HAND_MERIDIANS = MERIDIANS.filter(m => m.group === 'tay');
export const FOOT_MERIDIANS = MERIDIANS.filter(m => m.group === 'chan');

/** Map code -> definition để tra cứu nhanh */
export const MERIDIAN_MAP = new Map<string, MeridianDefinition>(
  MERIDIANS.map(m => [m.code, m])
);

/** Tên hiển thị ngắn cho biểu đồ */
export const MERIDIAN_SHORT_LABELS: Record<string, string> = {
  'TTr': 'TTr',
  'Tam': 'Tâm',
  '3Tieu': '3Tiêu',
  'TBL': 'TBL',
  'DTr': 'ĐTr',
  'Phe': 'Phế',
  'BQ': 'BQ',
  'Than': 'Thận',
  'Dom': 'Đởm',
  'Vi': 'Vị',
  'Can': 'Can',
  'Ty': 'Tỳ',
};
