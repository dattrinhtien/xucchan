'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { MERIDIANS, MERIDIAN_SHORT_LABELS } from '@/constants/meridians';
import { COMPARISON_PALETTE, CHART_COLORS } from '@/constants/colors';
import type { DBMeasurementValue } from '@/types';

interface Props {
  sessions: { id: string; measured_at: string }[];
  allValues: DBMeasurementValue[];
  selectedMeridians?: string[]; // meridian codes to show
}

/**
 * Biểu đồ xu hướng theo thời gian
 */
export function TrendChart({ sessions, allValues, selectedMeridians }: Props) {
  if (sessions.length === 0) return null;

  const meridiansToShow = selectedMeridians && selectedMeridians.length > 0
    ? MERIDIANS.filter(m => selectedMeridians.includes(m.code))
    : MERIDIANS;

  // Data: mỗi session là 1 điểm trên trục X
  const data = sessions.map(s => {
    const point: Record<string, string | number> = {
      date: new Date(s.measured_at).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
      }),
    };
    meridiansToShow.forEach(m => {
      const value = allValues.find(
        v => v.session_id === s.id && v.meridian_code === m.code
      );
      point[MERIDIAN_SHORT_LABELS[m.code]] = value ? value.mean_temp : 0;
    });
    return point;
  });

  return (
    <div className="glass-card p-4 md:p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        📈 Xu hướng theo thời gian
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
          <XAxis
            dataKey="date"
            tick={{ fill: '#A09CB0', fontSize: 11 }}
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
          {meridiansToShow.map((m, idx) => (
            <Line
              key={m.code}
              type="monotone"
              dataKey={MERIDIAN_SHORT_LABELS[m.code]}
              stroke={COMPARISON_PALETTE[idx % COMPARISON_PALETTE.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
