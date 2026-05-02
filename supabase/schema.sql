-- =============================================
-- Schema cho ứng dụng đo nhiệt độ 12 đường kinh
-- Chạy SQL này trong Supabase SQL Editor
-- =============================================

-- Bảng bệnh nhân
CREATE TABLE IF NOT EXISTS patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT,
  patient_code TEXT,
  age INTEGER,
  birth_year INTEGER,
  gender TEXT CHECK (gender IN ('nam', 'nu', 'khac', '')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng phiên đo
CREATE TABLE IF NOT EXISTS measurement_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
  measured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  operator_name TEXT,
  symptoms_note TEXT,
  condition_note TEXT,
  room_temperature NUMERIC(5,2),
  blood_pressure TEXT,
  pulse INTEGER,
  spo2 NUMERIC(5,2),
  conclusion_note TEXT,
  upper_group_center NUMERIC(6,3),
  lower_group_center NUMERIC(6,3),
  upper_lower_diff NUMERIC(6,3),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng giá trị đo từng kinh
CREATE TABLE IF NOT EXISTS measurement_values (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES measurement_sessions(id) ON DELETE CASCADE,
  meridian_code TEXT NOT NULL,
  meridian_name TEXT NOT NULL,
  group_type TEXT NOT NULL CHECK (group_type IN ('tay', 'chan')),
  left_temp NUMERIC(5,2) NOT NULL,
  right_temp NUMERIC(5,2) NOT NULL,
  mean_temp NUMERIC(6,3) NOT NULL,
  left_right_diff NUMERIC(6,3) NOT NULL,
  left_state TEXT DEFAULT '',
  right_state TEXT DEFAULT '',
  final_state TEXT DEFAULT '',
  group_left_mean NUMERIC(6,3),
  group_right_mean NUMERIC(6,3),
  group_max NUMERIC(6,3),
  group_min NUMERIC(6,3),
  group_range NUMERIC(6,3),
  group_center NUMERIC(6,3),
  group_error NUMERIC(6,3),
  upper_threshold NUMERIC(6,3),
  lower_threshold NUMERIC(6,3),
  deviation_from_center NUMERIC(6,3),
  rank_diff INTEGER DEFAULT 0
);

-- Indexes cho query hiệu quả
CREATE INDEX IF NOT EXISTS idx_sessions_patient ON measurement_sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_sessions_measured_at ON measurement_sessions(measured_at DESC);
CREATE INDEX IF NOT EXISTS idx_values_session ON measurement_values(session_id);
CREATE INDEX IF NOT EXISTS idx_values_meridian ON measurement_values(meridian_code);

-- RLS: Tắt vì app nội bộ 1 người dùng
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurement_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurement_values ENABLE ROW LEVEL SECURITY;

-- Policies cho phép full access (app nội bộ, không cần auth)
CREATE POLICY "Allow all on patients" ON patients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on measurement_sessions" ON measurement_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on measurement_values" ON measurement_values FOR ALL USING (true) WITH CHECK (true);
