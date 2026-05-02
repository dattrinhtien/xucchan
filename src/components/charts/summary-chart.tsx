'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { CHART_COLORS } from '@/constants/colors';

interface Props {
  handCenter: number;
  footCenter: number;
  diff: number;
}

/**
 * Biểu đồ so sánh nhóm tay vs chân
 */
export function SummaryChart({ handCenter, footCenter, diff }: Props) {
  const data = [
    { name: 'Tay (Trên)', value: handCenter, fill: CHART_COLORS.handGroup },
    { name: 'Chân (Dưới)', value: footCenter, fill: CHART_COLORS.footGroup },
  ];

  return (
    <div className="glass-card p-4 md:p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        ⚖️ So sánh Tay – Chân
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#A09CB0', fontSize: 12 }}
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
            formatter={(value) => [`${Number(value).toFixed(2)}°C`, 'Tâm nhóm']}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={60}>
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="text-center mt-2">
        <span className="text-sm text-text-secondary">
          Chênh tay – chân:{' '}
          <span className={`font-bold ${diff > 0 ? 'text-nhiet' : diff < 0 ? 'text-han' : 'text-binh'}`}>
            {diff > 0 ? '+' : ''}{diff.toFixed(2)}°C
          </span>
        </span>
      </div>
    </div>
  );
}
