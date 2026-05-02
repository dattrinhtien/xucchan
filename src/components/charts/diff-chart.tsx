'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import { CHART_COLORS } from '@/constants/colors';
import { MERIDIAN_SHORT_LABELS } from '@/constants/meridians';
import type { DBMeasurementValue } from '@/types';

interface Props {
  values: DBMeasurementValue[];
}

/**
 * Biểu đồ chênh trái–phải từng kinh
 */
export function DiffChart({ values }: Props) {
  const data = values.map(v => ({
    name: MERIDIAN_SHORT_LABELS[v.meridian_code] || v.meridian_code,
    'Chênh T-P': v.left_right_diff,
    isHigh: v.left_right_diff > 0.5,
  }));

  return (
    <div className="glass-card p-4 md:p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        ↔️ Chênh lệch Trái – Phải
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#A09CB0', fontSize: 11 }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#A09CB0', fontSize: 11 }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#2A2640',
              border: '1px solid #3D3756',
              borderRadius: '12px',
              color: '#F1F0F5',
            }}
            formatter={(value) => [`${Number(value).toFixed(2)}°C`, 'Chênh lệch']}
          />
          <Bar dataKey="Chênh T-P" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.isHigh ? '#EF4444' : CHART_COLORS.diff}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
