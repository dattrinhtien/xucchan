'use client';

import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip
} from 'recharts';
import { CHART_COLORS } from '@/constants/colors';
import { MERIDIAN_SHORT_LABELS } from '@/constants/meridians';
import type { DBMeasurementValue } from '@/types';

interface Props {
  values: DBMeasurementValue[];
}

/**
 * Biểu đồ radar 12 kinh theo mean
 */
export function RadarChart12({ values }: Props) {
  const data = values.map(v => ({
    subject: MERIDIAN_SHORT_LABELS[v.meridian_code] || v.meridian_code,
    TB: v.mean_temp,
    fullMark: 36,
  }));

  return (
    <div className="glass-card p-4 md:p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        🎯 Radar 12 Kinh
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#3D3756" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#A09CB0', fontSize: 11 }}
          />
          <PolarRadiusAxis
            tick={{ fill: '#6B7280', fontSize: 10 }}
            axisLine={false}
          />
          <Radar
            name="Trung bình"
            dataKey="TB"
            stroke={CHART_COLORS.mean}
            fill={CHART_COLORS.mean}
            fillOpacity={0.25}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#2A2640',
              border: '1px solid #3D3756',
              borderRadius: '12px',
              color: '#F1F0F5',
            }}
            formatter={(value) => [`${Number(value).toFixed(2)}°C`, 'TB']}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
