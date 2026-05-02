'use server';

import { supabase } from '@/lib/supabase';
import type { DBMeasurementSession, DBMeasurementValue } from '@/types';

/**
 * Lấy chi tiết đầy đủ của 1 phiên đo
 * Bao gồm: session info + patient info + tất cả measurement values
 */
export async function getSessionDetail(sessionId: string) {
  try {
    // 1. Lấy session + patient
    const { data: session, error: sessionError } = await supabase
      .from('measurement_sessions')
      .select(`
        *,
        patients (*)
      `)
      .eq('id', sessionId)
      .single();

    if (sessionError) throw sessionError;

    // 2. Lấy measurement values
    const { data: values, error: valuesError } = await supabase
      .from('measurement_values')
      .select('*')
      .eq('session_id', sessionId)
      .order('meridian_code');

    if (valuesError) throw valuesError;

    return {
      success: true,
      session: session as DBMeasurementSession,
      values: values as DBMeasurementValue[],
    };
  } catch (error) {
    console.error('Error fetching session detail:', error);
    return { success: false, session: null, values: [], error: String(error) };
  }
}
