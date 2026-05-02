'use client';

import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine
} from 'recharts';
import { CHART_COLORS } from '@/constants/colors';
import { MERIDIAN_SHORT_LABELS } from '@/constants/meridians';
import type { DBMeasurementValue } from '@/types';

interface Props {
  values: DBMeasurementValue[];
}

/**
 * Biểu đồ trung bình + ngưỡng trên/dưới
 */
export function ThresholdChart({ values }: Props) {
  // Nhóm theo group để hiển thị ngưỡng tương ứng
  const data = values.map(v => ({
    name: MERIDIAN_SHORT_LABELS[v.meridian_code] || v.meridian_code,
    'TB': v.mean_temp,
    'Ngưỡng trên': v.upper_threshold,
    'Ngưỡng dưới': v.lower_threshold,
    'Tâm nhóm': v.group_center,
  }));

  return (
    <div className="glass-card p-4 md:p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        📈 Trung bình & Ngưỡng
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
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
          <Bar isAnimationActive={false} dataKey="TB" fill={CHART_COLORS.mean} radius={[4, 4, 0, 0]} barSize={20} />
          <Line
            dataKey="Ngưỡng trên"
            stroke={CHART_COLORS.upperThreshold}
            strokeDasharray="5 5"
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey="Ngưỡng dưới"
            stroke={CHART_COLORS.lowerThreshold}
            strokeDasharray="5 5"
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey="Tâm nhóm"
            stroke="#9CA3AF"
            strokeDasharray="3 3"
            strokeWidth={1}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
