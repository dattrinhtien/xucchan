'use server';

import { supabase } from '@/lib/supabase';
import type { DBMeasurementSession, DBMeasurementValue } from '@/types';

/**
 * Lấy dữ liệu so sánh nhiều phiên đo
 * Trả về sessions + values để client render chart so sánh
 */
export async function getComparison(sessionIds: string[]) {
  try {
    if (sessionIds.length === 0) {
      return { success: true, sessions: [], allValues: [] };
    }

    // 1. Lấy sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from('measurement_sessions')
      .select(`
        *,
        patients (*)
      `)
      .in('id', sessionIds)
      .order('measured_at', { ascending: true });

    if (sessionsError) throw sessionsError;

    // 2. Lấy tất cả values cho các sessions
    const { data: allValues, error: valuesError } = await supabase
      .from('measurement_values')
      .select('*')
      .in('session_id', sessionIds);

    if (valuesError) throw valuesError;

    return {
      success: true,
      sessions: sessions as DBMeasurementSession[],
      allValues: allValues as DBMeasurementValue[],
    };
  } catch (error) {
    console.error('Error fetching comparison data:', error);
    return { success: false, sessions: [], allValues: [], error: String(error) };
  }
}

/**
 * Lấy dữ liệu xu hướng qua thời gian cho 1 bệnh nhân
 */
export async function getTrend(patientId: string) {
  try {
    // Lấy tất cả sessions của bệnh nhân, sắp xếp theo thời gian
    const { data: sessions, error: sessionsError } = await supabase
      .from('measurement_sessions')
      .select('id, measured_at')
      .eq('patient_id', patientId)
      .order('measured_at', { ascending: true });

    if (sessionsError) throw sessionsError;
    if (!sessions || sessions.length === 0) {
      return { success: true, sessions: [], allValues: [] };
    }

    const sessionIds = sessions.map(s => s.id);

    // Lấy values
    const { data: allValues, error: valuesError } = await supabase
      .from('measurement_values')
      .select('*')
      .in('session_id', sessionIds);

    if (valuesError) throw valuesError;

    return {
      success: true,
      sessions: sessions as { id: string; measured_at: string }[],
      allValues: allValues as DBMeasurementValue[],
    };
  } catch (error) {
    console.error('Error fetching trend data:', error);
    return { success: false, sessions: [], allValues: [], error: String(error) };
  }
}
