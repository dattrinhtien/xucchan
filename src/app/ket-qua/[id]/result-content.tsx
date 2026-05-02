'use client';

import { useRef } from 'react';
import Link from 'next/link';
import type { DBMeasurementSession, DBMeasurementValue } from '@/types';
import { MERIDIAN_SHORT_LABELS } from '@/constants/meridians';
import { BarChart12 } from '@/components/charts/bar-chart-12';
import { ThresholdChart } from '@/components/charts/threshold-chart';
import { DiffChart } from '@/components/charts/diff-chart';
import { SummaryChart } from '@/components/charts/summary-chart';
import { RadarChart12 } from '@/components/charts/radar-chart';

interface Props {
  session: DBMeasurementSession;
  values: DBMeasurementValue[];
}

function getStateBadge(state: string) {
  if (state === 'Nhiệt') return <span className="badge-nhiet">Nhiệt</span>;
  if (state === 'Hàn') return <span className="badge-han">Hàn</span>;
  return null;
}

function getFinalStateBadge(state: string) {
  if (!state) return <span className="text-text-secondary text-xs">—</span>;
  if (state.includes('Nhiệt') && state.includes('Hàn')) {
    return <span className="text-xs text-warning font-medium">{state}</span>;
  }
  if (state.includes('Nhiệt')) {
    return <span className="badge-nhiet text-xs">{state}</span>;
  }
  if (state.includes('Hàn')) {
    return <span className="badge-han text-xs">{state}</span>;
  }
  return <span className="text-xs text-text-secondary">{state}</span>;
}

export function ResultContent({ session, values }: Props) {
  const reportRef = useRef<HTMLDivElement>(null);

  const handValues = values.filter(v => v.group_type === 'tay');
  const footValues = values.filter(v => v.group_type === 'chan');

  // Group stats from first value of each group
  const handSample = handValues[0];
  const footSample = footValues[0];

  const handCenter = handSample?.group_center || 0;
  const footCenter = footSample?.group_center || 0;
  const upperLowerDiff = session.upper_lower_diff || 0;

  // Alerts: kinh có diff cao và vượt ngưỡng
  const alertValues = values
    .filter(v => v.left_right_diff > 0.3 || v.left_state || v.right_state)
    .sort((a, b) => b.left_right_diff - a.left_right_diff);

  // Rankings
  const rankings = [...values]
    .sort((a, b) => b.left_right_diff - a.left_right_diff)
    .slice(0, 5);

  const handleExportPDF = async () => {
    try {
      const { toCanvas } = await import('html-to-image');
      const jsPDF = (await import('jspdf')).default;

      if (!reportRef.current) return;

      const width = reportRef.current.scrollWidth;
      const height = reportRef.current.scrollHeight;

      const canvas = await toCanvas(reportRef.current, {
        pixelRatio: 2,
        backgroundColor: '#13111C',
        width: width,
        height: height,
        style: {
          width: `${width}px`,
          height: `${height}px`,
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Handle multi-page
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      const patientName = session.patients?.full_name || 'BaoCao';
      const dateStr = new Date(session.measured_at).toISOString().split('T')[0];
      pdf.save(`XucChan_${patientName}_${dateStr}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Lỗi xuất PDF: ' + String(err));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            📋 Kết quả đo
          </h2>
          <p className="text-sm text-text-secondary mt-1" suppressHydrationWarning>
            {new Date(session.measured_at).toLocaleDateString('vi-VN', {
              weekday: 'long',
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <div className="flex gap-2 no-print">
          <button onClick={handleExportPDF} className="btn-primary text-sm">
            📄 Xuất PDF
          </button>
          <Link href="/nhap-lieu" className="btn-secondary text-sm">
            ✏️ Đo mới
          </Link>
        </div>
      </div>

      {/* Report content for PDF export */}
      <div ref={reportRef} className="space-y-6">
        {/* Patient info */}
        {session.patients && (
          <div className="glass-card p-4 md:p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              👤 Thông tin bệnh nhân
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              {session.patients.full_name && (
                <div>
                  <span className="text-text-secondary">Họ tên: </span>
                  <span className="font-medium">{session.patients.full_name}</span>
                </div>
              )}
              {session.patients.patient_code && (
                <div>
                  <span className="text-text-secondary">Mã BN: </span>
                  <span className="font-medium">{session.patients.patient_code}</span>
                </div>
              )}
              {session.patients.age && (
                <div>
                  <span className="text-text-secondary">Tuổi: </span>
                  <span className="font-medium">{session.patients.age}</span>
                </div>
              )}
              {session.patients.gender && (
                <div>
                  <span className="text-text-secondary">Giới: </span>
                  <span className="font-medium">
                    {session.patients.gender === 'nam' ? 'Nam' : session.patients.gender === 'nu' ? 'Nữ' : 'Khác'}
                  </span>
                </div>
              )}
              {session.operator_name && (
                <div>
                  <span className="text-text-secondary">Người đo: </span>
                  <span className="font-medium">{session.operator_name}</span>
                </div>
              )}
              {session.room_temperature && (
                <div>
                  <span className="text-text-secondary">Nhiệt phòng: </span>
                  <span className="font-medium">{session.room_temperature}°C</span>
                </div>
              )}
              {session.blood_pressure && (
                <div>
                  <span className="text-text-secondary">Huyết áp: </span>
                  <span className="font-medium">{session.blood_pressure}</span>
                </div>
              )}
              {session.pulse && (
                <div>
                  <span className="text-text-secondary">Mạch: </span>
                  <span className="font-medium">{session.pulse}</span>
                </div>
              )}
              {session.spo2 && (
                <div>
                  <span className="text-text-secondary">SpO2: </span>
                  <span className="font-medium">{session.spo2}%</span>
                </div>
              )}
            </div>
            {session.symptoms_note && (
              <div className="mt-3 text-sm">
                <span className="text-text-secondary">Triệu chứng: </span>
                <span>{session.symptoms_note}</span>
              </div>
            )}
            {session.condition_note && (
              <div className="mt-1 text-sm">
                <span className="text-text-secondary">Tình trạng: </span>
                <span>{session.condition_note}</span>
              </div>
            )}
          </div>
        )}

        {/* Results table */}
        <div className="glass-card p-4 md:p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            🌡️ Bảng kết quả
          </h3>

          {/* Nhóm Tay */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-primary-light mb-2 flex items-center gap-1">
              🖐️ Nhóm Tay
            </h4>
            <div className="responsive-table">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-text-secondary text-xs border-b border-border/30">
                    <th className="text-left py-2 px-1">Kinh</th>
                    <th className="text-center py-2 px-1">Trái</th>
                    <th className="text-center py-2 px-1">Phải</th>
                    <th className="text-center py-2 px-1">TB</th>
                    <th className="text-center py-2 px-1">Chênh</th>
                    <th className="text-center py-2 px-1">T.Thái</th>
                    <th className="text-center py-2 px-1 hidden md:table-cell">Kết luận</th>
                  </tr>
                </thead>
                <tbody>
                  {handValues.map(v => (
                    <tr key={v.meridian_code} className="border-b border-border/10 hover:bg-surface-2/30">
                      <td className="py-2 px-1 font-medium">
                        {MERIDIAN_SHORT_LABELS[v.meridian_code]}
                      </td>
                      <td className="text-center py-2 px-1">
                        <span className={v.left_state === 'Nhiệt' ? 'text-nhiet font-semibold' : v.left_state === 'Hàn' ? 'text-han font-semibold' : ''}>
                          {v.left_temp}
                        </span>
                      </td>
                      <td className="text-center py-2 px-1">
                        <span className={v.right_state === 'Nhiệt' ? 'text-nhiet font-semibold' : v.right_state === 'Hàn' ? 'text-han font-semibold' : ''}>
                          {v.right_temp}
                        </span>
                      </td>
                      <td className="text-center py-2 px-1 font-medium">{v.mean_temp}</td>
                      <td className="text-center py-2 px-1">
                        <span className={v.left_right_diff > 0.5 ? 'text-warning font-semibold' : 'text-text-secondary'}>
                          {v.left_right_diff}
                        </span>
                      </td>
                      <td className="text-center py-2 px-1 space-x-1">
                        {getStateBadge(v.left_state)}
                        {getStateBadge(v.right_state)}
                        {!v.left_state && !v.right_state && <span className="text-text-secondary text-xs">—</span>}
                      </td>
                      <td className="text-center py-2 px-1 hidden md:table-cell">
                        {getFinalStateBadge(v.final_state)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Hand group stats */}
            {handSample && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-xs">
                <div className="bg-surface-2/30 rounded-lg p-2 text-center">
                  <div className="text-text-secondary">Tâm nhóm</div>
                  <div className="font-bold text-sm">{handSample.group_center}°C</div>
                </div>
                <div className="bg-surface-2/30 rounded-lg p-2 text-center">
                  <div className="text-text-secondary">Biên độ</div>
                  <div className="font-bold text-sm">{handSample.group_range}°C</div>
                </div>
                <div className="bg-surface-2/30 rounded-lg p-2 text-center">
                  <div className="text-nhiet">Ngưỡng trên</div>
                  <div className="font-bold text-sm">{handSample.upper_threshold}°C</div>
                </div>
                <div className="bg-surface-2/30 rounded-lg p-2 text-center">
                  <div className="text-han">Ngưỡng dưới</div>
                  <div className="font-bold text-sm">{handSample.lower_threshold}°C</div>
                </div>
              </div>
            )}
          </div>

          {/* Nhóm Chân */}
          <div>
            <h4 className="text-sm font-semibold text-accent mb-2 flex items-center gap-1">
              🦶 Nhóm Chân
            </h4>
            <div className="responsive-table">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-text-secondary text-xs border-b border-border/30">
                    <th className="text-left py-2 px-1">Kinh</th>
                    <th className="text-center py-2 px-1">Trái</th>
                    <th className="text-center py-2 px-1">Phải</th>
                    <th className="text-center py-2 px-1">TB</th>
                    <th className="text-center py-2 px-1">Chênh</th>
                    <th className="text-center py-2 px-1">T.Thái</th>
                    <th className="text-center py-2 px-1 hidden md:table-cell">Kết luận</th>
                  </tr>
                </thead>
                <tbody>
                  {footValues.map(v => (
                    <tr key={v.meridian_code} className="border-b border-border/10 hover:bg-surface-2/30">
                      <td className="py-2 px-1 font-medium">
                        {MERIDIAN_SHORT_LABELS[v.meridian_code]}
                      </td>
                      <td className="text-center py-2 px-1">
                        <span className={v.left_state === 'Nhiệt' ? 'text-nhiet font-semibold' : v.left_state === 'Hàn' ? 'text-han font-semibold' : ''}>
                          {v.left_temp}
                        </span>
                      </td>
                      <td className="text-center py-2 px-1">
                        <span className={v.right_state === 'Nhiệt' ? 'text-nhiet font-semibold' : v.right_state === 'Hàn' ? 'text-han font-semibold' : ''}>
                          {v.right_temp}
                        </span>
                      </td>
                      <td className="text-center py-2 px-1 font-medium">{v.mean_temp}</td>
                      <td className="text-center py-2 px-1">
                        <span className={v.left_right_diff > 0.5 ? 'text-warning font-semibold' : 'text-text-secondary'}>
                          {v.left_right_diff}
                        </span>
                      </td>
                      <td className="text-center py-2 px-1 space-x-1">
                        {getStateBadge(v.left_state)}
                        {getStateBadge(v.right_state)}
                        {!v.left_state && !v.right_state && <span className="text-text-secondary text-xs">—</span>}
                      </td>
                      <td className="text-center py-2 px-1 hidden md:table-cell">
                        {getFinalStateBadge(v.final_state)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Foot group stats */}
            {footSample && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-xs">
                <div className="bg-surface-2/30 rounded-lg p-2 text-center">
                  <div className="text-text-secondary">Tâm nhóm</div>
                  <div className="font-bold text-sm">{footSample.group_center}°C</div>
                </div>
                <div className="bg-surface-2/30 rounded-lg p-2 text-center">
                  <div className="text-text-secondary">Biên độ</div>
                  <div className="font-bold text-sm">{footSample.group_range}°C</div>
                </div>
                <div className="bg-surface-2/30 rounded-lg p-2 text-center">
                  <div className="text-nhiet">Ngưỡng trên</div>
                  <div className="font-bold text-sm">{footSample.upper_threshold}°C</div>
                </div>
                <div className="bg-surface-2/30 rounded-lg p-2 text-center">
                  <div className="text-han">Ngưỡng dưới</div>
                  <div className="font-bold text-sm">{footSample.lower_threshold}°C</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chênh tay-chân summary */}
        <div className="glass-card p-4 md:p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            ⚖️ Chênh lệch Tay – Chân
          </h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-surface-2/30 rounded-xl p-3">
              <div className="text-xs text-text-secondary mb-1">Tâm Tay</div>
              <div className="text-lg font-bold text-primary-light">{handCenter}°C</div>
            </div>
            <div className="bg-surface-2/30 rounded-xl p-3">
              <div className="text-xs text-text-secondary mb-1">Tâm Chân</div>
              <div className="text-lg font-bold text-accent">{footCenter}°C</div>
            </div>
            <div className="bg-surface-2/30 rounded-xl p-3">
              <div className="text-xs text-text-secondary mb-1">Chênh T-C</div>
              <div className={`text-lg font-bold ${upperLowerDiff > 0 ? 'text-nhiet' : upperLowerDiff < 0 ? 'text-han' : 'text-binh'}`}>
                {upperLowerDiff > 0 ? '+' : ''}{Number(upperLowerDiff).toFixed(2)}°C
              </div>
            </div>
          </div>
        </div>

        {/* Kết luận Biểu/Lý */}
        {values.some(v => v.final_state) && (
          <div className="glass-card p-4 md:p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              🔍 Kết luận Biểu / Lý
            </h3>
            <div className="space-y-2">
              {values.filter(v => v.final_state).map(v => (
                <div key={v.meridian_code} className="flex items-center justify-between p-3 bg-surface-2/30 rounded-xl">
                  <span className="font-medium text-sm">
                    {MERIDIAN_SHORT_LABELS[v.meridian_code]} ({v.meridian_name})
                  </span>
                  {getFinalStateBadge(v.final_state)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cảnh báo bất thường */}
        {alertValues.length > 0 && (
          <div className="glass-card p-4 md:p-6 border-warning/20">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-warning">
              ⚠️ Cảnh báo bất thường
            </h3>
            <div className="space-y-2">
              {alertValues.map(v => (
                <div key={v.meridian_code} className="p-3 bg-surface-2/30 rounded-xl text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{MERIDIAN_SHORT_LABELS[v.meridian_code]}</span>
                    <span className="text-warning text-xs">
                      Chênh: {v.left_right_diff}°C | Lệch tâm: {v.deviation_from_center}°C
                    </span>
                  </div>
                  {v.final_state && (
                    <div className="text-xs text-text-secondary">{v.final_state}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Xếp hạng kinh lệch */}
        <div className="glass-card p-4 md:p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            🏆 Xếp hạng kinh chênh lệch
          </h3>
          <div className="space-y-2">
            {rankings.map((v, idx) => (
              <div key={v.meridian_code} className="flex items-center gap-3 p-2 bg-surface-2/30 rounded-lg">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  idx === 0 ? 'bg-warning/20 text-warning' : 'bg-surface-3 text-text-secondary'
                }`}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <span className="font-medium text-sm">{MERIDIAN_SHORT_LABELS[v.meridian_code]}</span>
                </div>
                <div className="text-sm">
                  <span className="text-text-secondary">Chênh T-P: </span>
                  <span className={v.left_right_diff > 0.5 ? 'text-warning font-semibold' : ''}>{v.left_right_diff}°C</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conclusion note */}
        {session.conclusion_note && (
          <div className="glass-card p-4 md:p-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2">📝 Ghi chú kết luận</h3>
            <p className="text-sm text-text-secondary">{session.conclusion_note}</p>
          </div>
        )}

        {/* Charts */}
        <BarChart12 values={values} />
        <ThresholdChart values={values} />
        <DiffChart values={values} />
        <SummaryChart handCenter={Number(handCenter)} footCenter={Number(footCenter)} diff={Number(upperLowerDiff)} />
        <RadarChart12 values={values} />
      </div>
    </div>
  );
}
