-- =============================================
-- Dữ liệu demo cho ứng dụng
-- Chạy SQL này SAU KHI đã chạy schema.sql
-- =============================================

-- 1. Tạo patient demo
INSERT INTO patients (id, full_name, patient_code, age, birth_year, gender, notes) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-111111111111', 'Nguyễn Văn An', 'BN001', 45, 1981, 'nam', 'Khám định kỳ'),
  ('a1b2c3d4-e5f6-7890-abcd-222222222222', 'Trần Thị Bình', 'BN002', 38, 1988, 'nu', 'Đau vai gáy mãn tính');

-- 2. Tạo measurement session demo #1 (Nguyễn Văn An - lần 1)
INSERT INTO measurement_sessions (id, patient_id, measured_at, operator_name, symptoms_note, condition_note, room_temperature, blood_pressure, pulse, spo2, conclusion_note, upper_group_center, lower_group_center, upper_lower_diff)
VALUES (
  'b1b2c3d4-e5f6-7890-abcd-111111111111',
  'a1b2c3d4-e5f6-7890-abcd-111111111111',
  '2026-04-28 09:00:00+07',
  'BS. Lê Minh',
  'Mỏi vai trái, mất ngủ',
  'Nghỉ ngơi 10 phút trước đo',
  26.5,
  '120/80',
  72,
  98,
  'Tâm kinh hơi nhiệt bên trái, Thận hàn cả 2 bên',
  31.75, 32.10, -0.35
);

-- Measurement values cho session #1
INSERT INTO measurement_values (session_id, meridian_code, meridian_name, group_type, left_temp, right_temp, mean_temp, left_right_diff, left_state, right_state, final_state, group_left_mean, group_right_mean, group_max, group_min, group_range, group_center, group_error, upper_threshold, lower_threshold, deviation_from_center, rank_diff) VALUES
  ('b1b2c3d4-e5f6-7890-abcd-111111111111', 'TTr',   'Tiểu Trường',  'tay',  31.5, 31.3, 31.40, 0.20, '',      '',      '', 31.58, 31.52, 32.50, 31.00, 1.50, 31.75, 0.25, 32.00, 31.50, 0.35, 8),
  ('b1b2c3d4-e5f6-7890-abcd-111111111111', 'Tam',   'Tâm',           'tay',  32.50, 31.80, 32.15, 0.70, 'Nhiệt', '',      'Biểu Nhiệt Trái', 31.58, 31.52, 32.50, 31.00, 1.50, 31.75, 0.25, 32.00, 31.50, 0.40, 2),
  ('b1b2c3d4-e5f6-7890-abcd-111111111111', '3Tieu', 'Tam Tiêu',      'tay',  31.80, 31.70, 31.75, 0.10, '',      '',      '', 31.58, 31.52, 32.50, 31.00, 1.50, 31.75, 0.25, 32.00, 31.50, 0.00, 11),
  ('b1b2c3d4-e5f6-7890-abcd-111111111111', 'TBL',   'Tâm Bào Lạc',  'tay',  31.60, 31.50, 31.55, 0.10, '',      '',      '', 31.58, 31.52, 32.50, 31.00, 1.50, 31.75, 0.25, 32.00, 31.50, 0.20, 10),
  ('b1b2c3d4-e5f6-7890-abcd-111111111111', 'DTr',   'Đại Trường',   'tay',  31.20, 31.00, 31.10, 0.20, '',      'Hàn',   'Biểu Hàn Phải', 31.58, 31.52, 32.50, 31.00, 1.50, 31.75, 0.25, 32.00, 31.50, 0.65, 7),
  ('b1b2c3d4-e5f6-7890-abcd-111111111111', 'Phe',   'Phế',           'tay',  31.90, 31.80, 31.85, 0.10, '',      '',      '', 31.58, 31.52, 32.50, 31.00, 1.50, 31.75, 0.25, 32.00, 31.50, 0.10, 12),
  ('b1b2c3d4-e5f6-7890-abcd-111111111111', 'BQ',    'Bàng Quang',   'chan', 32.40, 32.20, 32.30, 0.20, '',      '',      '', 32.02, 31.98, 32.80, 31.40, 1.40, 32.10, 0.23, 32.33, 31.87, 0.20, 9),
  ('b1b2c3d4-e5f6-7890-abcd-111111111111', 'Than',  'Thận',          'chan', 31.40, 31.50, 31.45, 0.10, 'Hàn',   'Hàn',   'Lý Hàn', 32.02, 31.98, 32.80, 31.40, 1.40, 32.10, 0.23, 32.33, 31.87, 0.65, 6),
  ('b1b2c3d4-e5f6-7890-abcd-111111111111', 'Dom',   'Đởm',           'chan', 32.10, 32.30, 32.20, 0.20, '',      '',      '', 32.02, 31.98, 32.80, 31.40, 1.40, 32.10, 0.23, 32.33, 31.87, 0.10, 5),
  ('b1b2c3d4-e5f6-7890-abcd-111111111111', 'Vi',    'Vị',            'chan', 32.00, 31.80, 31.90, 0.20, '',      '',      '', 32.02, 31.98, 32.80, 31.40, 1.40, 32.10, 0.23, 32.33, 31.87, 0.20, 4),
  ('b1b2c3d4-e5f6-7890-abcd-111111111111', 'Can',   'Can',           'chan', 32.50, 32.80, 32.65, 0.30, 'Nhiệt', 'Nhiệt', 'Lý Nhiệt', 32.02, 31.98, 32.80, 31.40, 1.40, 32.10, 0.23, 32.33, 31.87, 0.55, 3),
  ('b1b2c3d4-e5f6-7890-abcd-111111111111', 'Ty',    'Tỳ',            'chan', 31.70, 31.60, 31.65, 0.10, '',      '',      '', 32.02, 31.98, 32.80, 31.40, 1.40, 32.10, 0.23, 32.33, 31.87, 0.45, 1);

-- 3. Tạo measurement session demo #2 (Nguyễn Văn An - lần 2, sau 1 tuần)
INSERT INTO measurement_sessions (id, patient_id, measured_at, operator_name, symptoms_note, condition_note, room_temperature, blood_pressure, pulse, spo2, conclusion_note, upper_group_center, lower_group_center, upper_lower_diff)
VALUES (
  'b1b2c3d4-e5f6-7890-abcd-222222222222',
  'a1b2c3d4-e5f6-7890-abcd-111111111111',
  '2026-05-02 09:00:00+07',
  'BS. Lê Minh',
  'Giảm mỏi vai, ngủ tốt hơn',
  'Nghỉ ngơi 10 phút trước đo',
  27.0,
  '118/78',
  70,
  99,
  'Cải thiện so với lần 1, Tâm kinh hết nhiệt',
  31.85, 32.05, -0.20
);

INSERT INTO measurement_values (session_id, meridian_code, meridian_name, group_type, left_temp, right_temp, mean_temp, left_right_diff, left_state, right_state, final_state, group_left_mean, group_right_mean, group_max, group_min, group_range, group_center, group_error, upper_threshold, lower_threshold, deviation_from_center, rank_diff) VALUES
  ('b1b2c3d4-e5f6-7890-abcd-222222222222', 'TTr',   'Tiểu Trường',  'tay',  31.60, 31.50, 31.55, 0.10, '',  '',  '', 31.68, 31.60, 32.20, 31.20, 1.00, 31.70, 0.17, 31.87, 31.53, 0.15, 10),
  ('b1b2c3d4-e5f6-7890-abcd-222222222222', 'Tam',   'Tâm',           'tay',  32.00, 31.90, 31.95, 0.10, 'Nhiệt', 'Nhiệt', 'Lý Nhiệt', 31.68, 31.60, 32.20, 31.20, 1.00, 31.70, 0.17, 31.87, 31.53, 0.25, 9),
  ('b1b2c3d4-e5f6-7890-abcd-222222222222', '3Tieu', 'Tam Tiêu',      'tay',  31.70, 31.65, 31.68, 0.05, '',  '',  '', 31.68, 31.60, 32.20, 31.20, 1.00, 31.70, 0.17, 31.87, 31.53, 0.03, 12),
  ('b1b2c3d4-e5f6-7890-abcd-222222222222', 'TBL',   'Tâm Bào Lạc',  'tay',  31.80, 31.60, 31.70, 0.20, '',  '',  '', 31.68, 31.60, 32.20, 31.20, 1.00, 31.70, 0.17, 31.87, 31.53, 0.00, 5),
  ('b1b2c3d4-e5f6-7890-abcd-222222222222', 'DTr',   'Đại Trường',   'tay',  31.40, 31.20, 31.30, 0.20, '',  'Hàn',  'Biểu Hàn Phải', 31.68, 31.60, 32.20, 31.20, 1.00, 31.70, 0.17, 31.87, 31.53, 0.40, 4),
  ('b1b2c3d4-e5f6-7890-abcd-222222222222', 'Phe',   'Phế',           'tay',  31.80, 31.75, 31.78, 0.05, '',  '',  '', 31.68, 31.60, 32.20, 31.20, 1.00, 31.70, 0.17, 31.87, 31.53, 0.08, 11),
  ('b1b2c3d4-e5f6-7890-abcd-222222222222', 'BQ',    'Bàng Quang',   'chan', 32.30, 32.10, 32.20, 0.20, '',  '',  '', 31.98, 31.92, 32.60, 31.50, 1.10, 32.05, 0.18, 32.23, 31.87, 0.15, 6),
  ('b1b2c3d4-e5f6-7890-abcd-222222222222', 'Than',  'Thận',          'chan', 31.60, 31.50, 31.55, 0.10, '',  'Hàn',  'Biểu Hàn Phải', 31.98, 31.92, 32.60, 31.50, 1.10, 32.05, 0.18, 32.23, 31.87, 0.50, 8),
  ('b1b2c3d4-e5f6-7890-abcd-222222222222', 'Dom',   'Đởm',           'chan', 32.00, 32.20, 32.10, 0.20, '',  '',  '', 31.98, 31.92, 32.60, 31.50, 1.10, 32.05, 0.18, 32.23, 31.87, 0.05, 7),
  ('b1b2c3d4-e5f6-7890-abcd-222222222222', 'Vi',    'Vị',            'chan', 31.90, 31.80, 31.85, 0.10, '',  '',  '', 31.98, 31.92, 32.60, 31.50, 1.10, 32.05, 0.18, 32.23, 31.87, 0.20, 3),
  ('b1b2c3d4-e5f6-7890-abcd-222222222222', 'Can',   'Can',           'chan', 32.40, 32.60, 32.50, 0.20, 'Nhiệt', 'Nhiệt', 'Lý Nhiệt', 31.98, 31.92, 32.60, 31.50, 1.10, 32.05, 0.18, 32.23, 31.87, 0.45, 2),
  ('b1b2c3d4-e5f6-7890-abcd-222222222222', 'Ty',    'Tỳ',            'chan', 31.70, 31.60, 31.65, 0.10, '',  '',  '', 31.98, 31.92, 32.60, 31.50, 1.10, 32.05, 0.18, 32.23, 31.87, 0.40, 1);

-- 4. Tạo measurement session demo #3 (Trần Thị Bình)
INSERT INTO measurement_sessions (id, patient_id, measured_at, operator_name, symptoms_note, condition_note, room_temperature, blood_pressure, pulse, spo2, conclusion_note, upper_group_center, lower_group_center, upper_lower_diff)
VALUES (
  'b1b2c3d4-e5f6-7890-abcd-333333333333',
  'a1b2c3d4-e5f6-7890-abcd-222222222222',
  '2026-04-30 14:30:00+07',
  'BS. Lê Minh',
  'Đau vai gáy bên phải, tê tay phải',
  'Sau bữa trưa 1 tiếng',
  27.0,
  '115/75',
  68,
  99,
  'TTr và ĐTr nhiệt rõ bên phải, nghi viêm kinh lạc vùng vai gáy',
  31.90, 32.15, -0.25
);

INSERT INTO measurement_values (session_id, meridian_code, meridian_name, group_type, left_temp, right_temp, mean_temp, left_right_diff, left_state, right_state, final_state, group_left_mean, group_right_mean, group_max, group_min, group_range, group_center, group_error, upper_threshold, lower_threshold, deviation_from_center, rank_diff) VALUES
  ('b1b2c3d4-e5f6-7890-abcd-333333333333', 'TTr',   'Tiểu Trường',  'tay',  31.60, 32.40, 32.00, 0.80, '', 'Nhiệt', 'Biểu Nhiệt Phải', 31.72, 31.88, 32.40, 31.20, 1.20, 31.80, 0.20, 32.00, 31.60, 0.20, 1),
  ('b1b2c3d4-e5f6-7890-abcd-333333333333', 'Tam',   'Tâm',           'tay',  31.80, 31.70, 31.75, 0.10, '',  '',  '', 31.72, 31.88, 32.40, 31.20, 1.20, 31.80, 0.20, 32.00, 31.60, 0.05, 10),
  ('b1b2c3d4-e5f6-7890-abcd-333333333333', '3Tieu', 'Tam Tiêu',      'tay',  31.60, 31.80, 31.70, 0.20, '',  '',  '', 31.72, 31.88, 32.40, 31.20, 1.20, 31.80, 0.20, 32.00, 31.60, 0.10, 6),
  ('b1b2c3d4-e5f6-7890-abcd-333333333333', 'TBL',   'Tâm Bào Lạc',  'tay',  31.90, 32.00, 31.95, 0.10, '',  '',  '', 31.72, 31.88, 32.40, 31.20, 1.20, 31.80, 0.20, 32.00, 31.60, 0.15, 8),
  ('b1b2c3d4-e5f6-7890-abcd-333333333333', 'DTr',   'Đại Trường',   'tay',  31.30, 32.10, 31.70, 0.80, '', 'Nhiệt', 'Biểu Nhiệt Phải', 31.72, 31.88, 32.40, 31.20, 1.20, 31.80, 0.20, 32.00, 31.60, 0.10, 2),
  ('b1b2c3d4-e5f6-7890-abcd-333333333333', 'Phe',   'Phế',           'tay',  31.20, 31.30, 31.25, 0.10, 'Hàn',  'Hàn',  'Lý Hàn', 31.72, 31.88, 32.40, 31.20, 1.20, 31.80, 0.20, 32.00, 31.60, 0.55, 9),
  ('b1b2c3d4-e5f6-7890-abcd-333333333333', 'BQ',    'Bàng Quang',   'chan', 32.20, 32.10, 32.15, 0.10, '',  '',  '', 32.05, 32.00, 32.70, 31.60, 1.10, 32.15, 0.18, 32.33, 31.97, 0.00, 11),
  ('b1b2c3d4-e5f6-7890-abcd-333333333333', 'Than',  'Thận',          'chan', 31.70, 31.60, 31.65, 0.10, 'Hàn',  'Hàn',  'Lý Hàn', 32.05, 32.00, 32.70, 31.60, 1.10, 32.15, 0.18, 32.33, 31.97, 0.50, 7),
  ('b1b2c3d4-e5f6-7890-abcd-333333333333', 'Dom',   'Đởm',           'chan', 32.10, 32.00, 32.05, 0.10, '',  '',  '', 32.05, 32.00, 32.70, 31.60, 1.10, 32.15, 0.18, 32.33, 31.97, 0.10, 12),
  ('b1b2c3d4-e5f6-7890-abcd-333333333333', 'Vi',    'Vị',            'chan', 32.00, 31.80, 31.90, 0.20, '',  '',  '', 32.05, 32.00, 32.70, 31.60, 1.10, 32.15, 0.18, 32.33, 31.97, 0.25, 4),
  ('b1b2c3d4-e5f6-7890-abcd-333333333333', 'Can',   'Can',           'chan', 32.50, 32.70, 32.60, 0.20, 'Nhiệt', 'Nhiệt', 'Lý Nhiệt', 32.05, 32.00, 32.70, 31.60, 1.10, 32.15, 0.18, 32.33, 31.97, 0.45, 3),
  ('b1b2c3d4-e5f6-7890-abcd-333333333333', 'Ty',    'Tỳ',            'chan', 31.80, 31.80, 31.80, 0.00, '',  '',  '', 32.05, 32.00, 32.70, 31.60, 1.10, 32.15, 0.18, 32.33, 31.97, 0.35, 5);
