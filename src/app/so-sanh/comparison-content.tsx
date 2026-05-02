'use client';

import { useState, useEffect } from 'react';
import type { DBMeasurementSession, DBMeasurementValue } from '@/types';
import { getComparison } from '@/app/actions/get-comparison';
import { ComparisonChart } from '@/components/charts/comparison-chart';
import { TrendChart } from '@/components/charts/trend-chart';
import { MERIDIANS, MERIDIAN_SHORT_LABELS } from '@/constants/meridians';

interface Props {
  availableSessions: DBMeasurementSession[];
}

export function ComparisonContent({ availableSessions }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [compSessions, setCompSessions] = useState<DBMeasurementSession[]>([]);
  const [compValues, setCompValues] = useState<DBMeasurementValue[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMeridians, setSelectedMeridians] = useState<string[]>(
    MERIDIANS.slice(0, 4).map(m => m.code)
  );

  const toggleSession = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleMeridian = (code: string) => {
    setSelectedMeridians(prev =>
      prev.includes(code) ? prev.filter(x => x !== code) : [...prev, code]
    );
  };

  useEffect(() => {
    if (selectedIds.length < 2) {
      setCompSessions([]);
      setCompValues([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      const result = await getComparison(selectedIds);
      if (result.success) {
        setCompSessions(result.sessions as DBMeasurementSession[]);
        setCompValues(result.allValues as DBMeasurementValue[]);
      }
      setLoading(false);
    };
    fetchData();
  }, [selectedIds]);

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <h2 className="text-xl font-bold flex items-center gap-2">
        📊 So sánh nhiều lần đo
      </h2>

      {/* Session selector */}
      <div className="glass-card p-4 md:p-6">
        <h3 className="font-semibold mb-3 text-sm">
          Chọn ít nhất 2 lần đo để so sánh ({selectedIds.length} đã chọn)
        </h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {availableSessions.length === 0 ? (
            <p className="text-text-secondary text-sm">Chưa có dữ liệu</p>
          ) : (
            availableSessions.map(s => {
              const isSelected = selectedIds.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => toggleSession(s.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all text-sm ${
                    isSelected
                      ? 'bg-primary/20 border border-primary/40'
                      : 'bg-surface-2/30 border border-transparent hover:border-border/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded flex items-center justify-center text-xs ${
                        isSelected ? 'bg-primary text-white' : 'bg-surface-3 text-text-secondary'
                      }`}>
                        {isSelected ? '✓' : ''}
                      </span>
                      <span className="font-medium">
                        {s.patients?.full_name || 'Chưa có tên'}
                      </span>
                    </div>
                    <span className="text-text-secondary text-xs">
                      {new Date(s.measured_at).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-8 text-text-secondary">
          <span className="animate-spin inline-block text-2xl">⏳</span>
          <p className="mt-2">Đang tải dữ liệu...</p>
        </div>
      )}

      {/* Charts */}
      {compSessions.length >= 2 && !loading && (
        <>
          <ComparisonChart sessions={compSessions} allValues={compValues} />

          {/* Meridian selector for trend */}
          <div className="glass-card p-4 md:p-6">
            <h3 className="font-semibold mb-3 text-sm">Chọn kinh để xem xu hướng</h3>
            <div className="flex flex-wrap gap-2">
              {MERIDIANS.map(m => {
                const isSelected = selectedMeridians.includes(m.code);
                return (
                  <button
                    key={m.code}
                    onClick={() => toggleMeridian(m.code)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-primary/20 text-primary-light border border-primary/40'
                        : 'bg-surface-2/30 text-text-secondary border border-transparent hover:border-border/40'
                    }`}
                  >
                    {MERIDIAN_SHORT_LABELS[m.code]}
                  </button>
                );
              })}
            </div>
          </div>

          <TrendChart
            sessions={compSessions.map(s => ({ id: s.id, measured_at: s.measured_at }))}
            allValues={compValues}
            selectedMeridians={selectedMeridians}
          />
        </>
      )}

      {selectedIds.length > 0 && selectedIds.length < 2 && !loading && (
        <div className="glass-card p-8 text-center">
          <div className="text-3xl mb-3">☝️</div>
          <p className="text-text-secondary">Chọn thêm ít nhất 1 lần đo nữa để so sánh</p>
        </div>
      )}
    </div>
  );
}
