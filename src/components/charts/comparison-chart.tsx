'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { MERIDIAN_SHORT_LABELS, MERIDIANS } from '@/constants/meridians';
import { COMPARISON_PALETTE } from '@/constants/colors';
import { CHART_COLORS } from '@/constants/colors';
import type { DBMeasurementSession, DBMeasurementValue } from '@/types';

interface Props {
  sessions: DBMeasurementSession[];
  allValues: DBMeasurementValue[];
}

/**
 * Biểu đồ so sánh nhiều lần đo
 */
export function ComparisonChart({ sessions, allValues }: Props) {
  if (sessions.length === 0) return null;

  // Chuẩn bị data: mỗi meridian là 1 data point, mỗi session là 1 bar
  const data = MERIDIANS.map(m => {
    const point: Record<string, string | number> = {
      name: MERIDIAN_SHORT_LABELS[m.code] || m.code,
    };
    sessions.forEach((s, idx) => {
      const value = allValues.find(
        v => v.session_id === s.id && v.meridian_code === m.code
      );
      const label = new Date(s.measured_at).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
      });
      point[`Lần ${idx + 1} (${label})`] = value ? value.mean_temp : 0;
    });
    return point;
  });

  return (
    <div className="glass-card p-4 md:p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        🔄 So sánh nhiều lần đo
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#A09CB0', fontSize: 10 }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#A09CB0', fontSize: 11 }}
            tickLine={false}
            domain={['auto', 'auto']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#2A2640',
              border: '1px solid #3D3756',
              borderRadius: '12px',
              color: '#F1F0F5',
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {sessions.map((s, idx) => {
            const label = new Date(s.measured_at).toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
            });
            return (
              <Bar
                key={s.id}
                dataKey={`Lần ${idx + 1} (${label})`}
                fill={COMPARISON_PALETTE[idx % COMPARISON_PALETTE.length]}
                radius={[3, 3, 0, 0]}
              />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
