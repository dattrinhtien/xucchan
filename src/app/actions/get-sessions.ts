'use server';

import { supabase } from '@/lib/supabase';
import type { DBMeasurementSession } from '@/types';

/**
 * Lấy danh sách tất cả phiên đo, sắp xếp theo thời gian mới nhất
 */
export async function getSessions(limit = 50, offset = 0) {
  try {
    const { data, error, count } = await supabase
      .from('measurement_sessions')
      .select(`
        *,
        patients (*)
      `, { count: 'exact' })
      .order('measured_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      success: true,
      sessions: data as DBMeasurementSession[],
      total: count || 0,
    };
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return { success: false, sessions: [], total: 0, error: String(error) };
  }
}

/**
 * Lấy danh sách phiên đo theo patient_id
 */
export async function getSessionsByPatient(patientId: string) {
  try {
    const { data, error } = await supabase
      .from('measurement_sessions')
      .select(`
        *,
        patients (*)
      `)
      .eq('patient_id', patientId)
      .order('measured_at', { ascending: false });

    if (error) throw error;

    return { success: true, sessions: data as DBMeasurementSession[] };
  } catch (error) {
    console.error('Error fetching sessions by patient:', error);
    return { success: false, sessions: [], error: String(error) };
  }
}
