'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MERIDIANS, HAND_MERIDIANS, FOOT_MERIDIANS } from '@/constants/meridians';
import { MERIDIAN_SHORT_LABELS } from '@/constants/meridians';
import { calculate } from '@/lib/meridian-calculator';
import { saveSession } from '@/app/actions/save-session';
import type { MeridianInput, MeasurementInput, PatientInfo } from '@/types';

/** Validate nhiệt độ hợp lệ: 25-42°C */
function isValidTemp(val: string): boolean {
  if (val === '') return false;
  const n = parseFloat(val);
  return !isNaN(n) && n >= 20 && n <= 45;
}

/** Validate cảnh báo bất thường: ngoài 28-38°C */
function isSuspiciousTemp(val: string): boolean {
  const n = parseFloat(val);
  return !isNaN(n) && (n < 28 || n > 38);
}

export default function NhapLieuPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showExtraFields, setShowExtraFields] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [warnings, setWarnings] = useState<string[]>([]);
  const [confirmSuspicious, setConfirmSuspicious] = useState(false);

  // State cho 12 kinh (trái/phải)
  const [temps, setTemps] = useState<Record<string, { left: string; right: string }>>(
    () => {
      const initial: Record<string, { left: string; right: string }> = {};
      MERIDIANS.forEach(m => {
        initial[m.code] = { left: '', right: '' };
      });
      return initial;
    }
  );

  // State cho thông tin bệnh nhân
  const [patient, setPatient] = useState<PatientInfo>({
    fullName: '',
    patientCode: '',
    age: undefined,
    birthYear: undefined,
    gender: '',
    notes: '',
  });

  // State cho thông tin phiên đo
  const [sessionInfo, setSessionInfo] = useState({
    operatorName: '',
    symptomsNote: '',
    conditionNote: '',
    roomTemperature: '',
    bloodPressure: '',
    pulse: '',
    spo2: '',
    conclusionNote: '',
  });

  const updateTemp = useCallback((code: string, side: 'left' | 'right', value: string) => {
    // Cho phép nhập số thập phân
    if (value !== '' && !/^\d*\.?\d*$/.test(value)) return;
    setTemps(prev => ({
      ...prev,
      [code]: { ...prev[code], [side]: value },
    }));
    // Xóa lỗi khi user sửa
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`${code}_${side}`];
      return newErrors;
    });
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    const newWarnings: string[] = [];
    let hasError = false;

    MERIDIANS.forEach(m => {
      const left = temps[m.code].left;
      const right = temps[m.code].right;

      if (left === '') {
        newErrors[`${m.code}_left`] = 'Bắt buộc';
        hasError = true;
      } else if (!isValidTemp(left)) {
        newErrors[`${m.code}_left`] = 'Không hợp lệ (20-45)';
        hasError = true;
      } else if (isSuspiciousTemp(left)) {
        newWarnings.push(`${MERIDIAN_SHORT_LABELS[m.code]} (Trái): ${left}°C - giá trị bất thường`);
      }

      if (right === '') {
        newErrors[`${m.code}_right`] = 'Bắt buộc';
        hasError = true;
      } else if (!isValidTemp(right)) {
        newErrors[`${m.code}_right`] = 'Không hợp lệ (20-45)';
        hasError = true;
      } else if (isSuspiciousTemp(right)) {
        newWarnings.push(`${MERIDIAN_SHORT_LABELS[m.code]} (Phải): ${right}°C - giá trị bất thường`);
      }
    });

    setErrors(newErrors);
    setWarnings(newWarnings);
    return !hasError;
  }, [temps]);

  const handleSubmit = async () => {
    if (!validate()) return;

    // Check suspicious values
    if (warnings.length > 0 && !confirmSuspicious) {
      setConfirmSuspicious(true);
      return;
    }

    setSaving(true);
    try {
      const meridianInputs: MeridianInput[] = MERIDIANS.map(m => ({
        meridianCode: m.code,
        leftTemp: parseFloat(temps[m.code].left),
        rightTemp: parseFloat(temps[m.code].right),
      }));

      const input: MeasurementInput = {
        meridians: meridianInputs,
        measuredAt: new Date().toISOString(),
        patient: showPatientForm ? patient : undefined,
        operatorName: sessionInfo.operatorName || undefined,
        symptomsNote: sessionInfo.symptomsNote || undefined,
        conditionNote: sessionInfo.conditionNote || undefined,
        roomTemperature: sessionInfo.roomTemperature ? parseFloat(sessionInfo.roomTemperature) : undefined,
        bloodPressure: sessionInfo.bloodPressure || undefined,
        pulse: sessionInfo.pulse ? parseInt(sessionInfo.pulse) : undefined,
        spo2: sessionInfo.spo2 ? parseFloat(sessionInfo.spo2) : undefined,
        conclusionNote: sessionInfo.conclusionNote || undefined,
      };

      const result = await saveSession(input);
      if (result.success && result.sessionId) {
        router.push(`/ket-qua/${result.sessionId}`);
      } else {
        alert('Lỗi lưu dữ liệu: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Lỗi: ' + String(err));
    } finally {
      setSaving(false);
    }
  };

  const renderMeridianGroup = (meridians: typeof MERIDIANS, groupLabel: string, emoji: string) => (
    <div className="glass-card p-4 md:p-6 space-y-4">
      <h3 className="font-bold text-base flex items-center gap-2">
        <span>{emoji}</span>
        <span>{groupLabel}</span>
        <span className="text-xs text-text-secondary font-normal">(6 kinh)</span>
      </h3>
      <div className="space-y-3">
        {meridians.map(m => (
          <div key={m.code} className="flex items-center gap-2 md:gap-3">
            {/* Label */}
            <div className="w-12 md:w-16 shrink-0">
              <div className="font-semibold text-sm">{MERIDIAN_SHORT_LABELS[m.code]}</div>
            </div>
            {/* Left input */}
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-text-secondary mb-0.5 md:hidden">Trái</div>
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                placeholder="Trái"
                value={temps[m.code].left}
                onChange={e => updateTemp(m.code, 'left', e.target.value)}
                className={`input-field text-sm py-2.5 text-center ${
                  errors[`${m.code}_left`] ? 'border-danger' : ''
                }`}
              />
              {errors[`${m.code}_left`] && (
                <div className="text-danger text-[10px] mt-0.5">{errors[`${m.code}_left`]}</div>
              )}
            </div>
            {/* Right input */}
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-text-secondary mb-0.5 md:hidden">Phải</div>
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                placeholder="Phải"
                value={temps[m.code].right}
                onChange={e => updateTemp(m.code, 'right', e.target.value)}
                className={`input-field text-sm py-2.5 text-center ${
                  errors[`${m.code}_right`] ? 'border-danger' : ''
                }`}
              />
              {errors[`${m.code}_right`] && (
                <div className="text-danger text-[10px] mt-0.5">{errors[`${m.code}_right`]}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span>✏️</span> Nhập liệu mới
        </h2>
      </div>

      {/* Header labels (desktop) */}
      <div className="hidden md:flex items-center gap-3 px-6 text-sm text-text-secondary">
        <div className="w-16 shrink-0">Kinh</div>
        <div className="flex-1 text-center">Trái (°C)</div>
        <div className="flex-1 text-center">Phải (°C)</div>
      </div>

      {/* Nhóm Tay */}
      {renderMeridianGroup(HAND_MERIDIANS, 'Nhóm Tay', '🖐️')}

      {/* Nhóm Chân */}
      {renderMeridianGroup(FOOT_MERIDIANS, 'Nhóm Chân', '🦶')}

      {/* Toggle thông tin bệnh nhân */}
      <button
        type="button"
        onClick={() => setShowPatientForm(!showPatientForm)}
        className="btn-secondary w-full"
      >
        {showPatientForm ? '▼' : '▶'} Thông tin bệnh nhân (không bắt buộc)
      </button>

      {showPatientForm && (
        <div className="glass-card p-4 md:p-6 space-y-3 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Họ tên</label>
              <input
                type="text"
                value={patient.fullName || ''}
                onChange={e => setPatient(p => ({ ...p, fullName: e.target.value }))}
                className="input-field text-sm"
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Mã bệnh nhân</label>
              <input
                type="text"
                value={patient.patientCode || ''}
                onChange={e => setPatient(p => ({ ...p, patientCode: e.target.value }))}
                className="input-field text-sm"
                placeholder="BN001"
              />
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Tuổi</label>
              <input
                type="number"
                inputMode="numeric"
                value={patient.age || ''}
                onChange={e => setPatient(p => ({ ...p, age: e.target.value ? parseInt(e.target.value) : undefined }))}
                className="input-field text-sm"
                placeholder="45"
              />
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Năm sinh</label>
              <input
                type="number"
                inputMode="numeric"
                value={patient.birthYear || ''}
                onChange={e => setPatient(p => ({ ...p, birthYear: e.target.value ? parseInt(e.target.value) : undefined }))}
                className="input-field text-sm"
                placeholder="1981"
              />
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Giới tính</label>
              <select
                value={patient.gender || ''}
                onChange={e => setPatient(p => ({ ...p, gender: e.target.value as PatientInfo['gender'] }))}
                className="input-field text-sm"
              >
                <option value="">-- Chọn --</option>
                <option value="nam">Nam</option>
                <option value="nu">Nữ</option>
                <option value="khac">Khác</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Ghi chú</label>
              <input
                type="text"
                value={patient.notes || ''}
                onChange={e => setPatient(p => ({ ...p, notes: e.target.value }))}
                className="input-field text-sm"
                placeholder="Ghi chú..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Toggle thông tin phiên đo */}
      <button
        type="button"
        onClick={() => setShowExtraFields(!showExtraFields)}
        className="btn-secondary w-full"
      >
        {showExtraFields ? '▼' : '▶'} Thông tin phiên đo (không bắt buộc)
      </button>

      {showExtraFields && (
        <div className="glass-card p-4 md:p-6 space-y-3 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Người đo</label>
              <input
                type="text"
                value={sessionInfo.operatorName}
                onChange={e => setSessionInfo(s => ({ ...s, operatorName: e.target.value }))}
                className="input-field text-sm"
                placeholder="BS. Nguyễn..."
              />
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Nhiệt độ phòng (°C)</label>
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                value={sessionInfo.roomTemperature}
                onChange={e => setSessionInfo(s => ({ ...s, roomTemperature: e.target.value }))}
                className="input-field text-sm"
                placeholder="26.5"
              />
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Huyết áp</label>
              <input
                type="text"
                value={sessionInfo.bloodPressure}
                onChange={e => setSessionInfo(s => ({ ...s, bloodPressure: e.target.value }))}
                className="input-field text-sm"
                placeholder="120/80"
              />
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Mạch</label>
              <input
                type="number"
                inputMode="numeric"
                value={sessionInfo.pulse}
                onChange={e => setSessionInfo(s => ({ ...s, pulse: e.target.value }))}
                className="input-field text-sm"
                placeholder="72"
              />
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">SpO2 (%)</label>
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                value={sessionInfo.spo2}
                onChange={e => setSessionInfo(s => ({ ...s, spo2: e.target.value }))}
                className="input-field text-sm"
                placeholder="98"
              />
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Tình trạng lúc đo</label>
              <input
                type="text"
                value={sessionInfo.conditionNote}
                onChange={e => setSessionInfo(s => ({ ...s, conditionNote: e.target.value }))}
                className="input-field text-sm"
                placeholder="Nghỉ ngơi 10p..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-text-secondary mb-1 block">Ghi chú triệu chứng</label>
              <textarea
                value={sessionInfo.symptomsNote}
                onChange={e => setSessionInfo(s => ({ ...s, symptomsNote: e.target.value }))}
                className="input-field text-sm"
                rows={2}
                placeholder="Mô tả triệu chứng..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-text-secondary mb-1 block">Ghi chú kết luận</label>
              <textarea
                value={sessionInfo.conclusionNote}
                onChange={e => setSessionInfo(s => ({ ...s, conclusionNote: e.target.value }))}
                className="input-field text-sm"
                rows={2}
                placeholder="Kết luận..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Warnings */}
      {confirmSuspicious && warnings.length > 0 && (
        <div className="glass-card p-4 border-warning/30 animate-fade-in">
          <h4 className="text-warning font-semibold mb-2">⚠️ Cảnh báo giá trị bất thường</h4>
          <ul className="text-sm text-text-secondary space-y-1 mb-3">
            {warnings.map((w, i) => (
              <li key={i}>• {w}</li>
            ))}
          </ul>
          <p className="text-sm text-text-secondary mb-3">Bạn có muốn tiếp tục lưu không?</p>
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="btn-primary text-sm flex-1" disabled={saving}>
              {saving ? 'Đang lưu...' : 'Vẫn lưu'}
            </button>
            <button onClick={() => setConfirmSuspicious(false)} className="btn-secondary text-sm flex-1">
              Sửa lại
            </button>
          </div>
        </div>
      )}

      {/* Submit button */}
      {!confirmSuspicious && (
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="btn-primary w-full text-lg py-4 pulse-glow"
        >
          {saving ? (
            <>
              <span className="animate-spin">⏳</span> Đang lưu...
            </>
          ) : (
            <>
              💾 Lưu & Xem kết quả
            </>
          )}
        </button>
      )}
    </div>
  );
}
