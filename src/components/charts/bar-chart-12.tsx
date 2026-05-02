'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { CHART_COLORS } from '@/constants/colors';
import { MERIDIAN_SHORT_LABELS } from '@/constants/meridians';
import type { DBMeasurementValue } from '@/types';

interface Props {
  values: DBMeasurementValue[];
}

/**
 * Biểu đồ cột 12 kinh: trái / phải / trung bình
 */
export function BarChart12({ values }: Props) {
  const data = values.map(v => ({
    name: MERIDIAN_SHORT_LABELS[v.meridian_code] || v.meridian_code,
    'Trái': v.left_temp,
    'Phải': v.right_temp,
    'TB': v.mean_temp,
  }));

  return (
    <div className="glass-card p-4 md:p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        📊 Biểu đồ 12 Đường Kinh
      </h3>
      <ResponsiveContainer width="100%" height={300}>
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
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar isAnimationActive={false} dataKey="Trái" fill={CHART_COLORS.left} radius={[4, 4, 0, 0]} />
          <Bar isAnimationActive={false} dataKey="Phải" fill={CHART_COLORS.right} radius={[4, 4, 0, 0]} />
          <Bar isAnimationActive={false} dataKey="TB" fill={CHART_COLORS.mean} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
