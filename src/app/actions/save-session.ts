'use server';

import { supabase } from '@/lib/supabase';
import { calculate } from '@/lib/meridian-calculator';
import { MERIDIAN_MAP } from '@/constants/meridians';
import type { MeasurementInput, MeridianInput } from '@/types';

/**
 * Server Action: Lưu phiên đo mới vào Supabase
 * 1. Upsert patient (nếu có thông tin)
 * 2. Insert measurement_session
 * 3. Tính toán kết quả
 * 4. Insert measurement_values
 */
export async function saveSession(input: MeasurementInput) {
  try {
    let patientId: string | null = null;

    // 1. Upsert patient nếu có thông tin
    if (input.patient && (input.patient.fullName || input.patient.patientCode)) {
      const patientData = {
        full_name: input.patient.fullName || null,
        patient_code: input.patient.patientCode || null,
        age: input.patient.age || null,
        birth_year: input.patient.birthYear || null,
        gender: input.patient.gender || null,
        notes: input.patient.notes || null,
      };

      // Nếu có id, update; nếu không, insert
      if (input.patient.id) {
        const { data, error } = await supabase
          .from('patients')
          .update(patientData)
          .eq('id', input.patient.id)
          .select('id')
          .single();
        if (error) throw error;
        patientId = data.id;
      } else {
        const { data, error } = await supabase
          .from('patients')
          .insert(patientData)
          .select('id')
          .single();
        if (error) throw error;
        patientId = data.id;
      }
    }

    // 2. Tính toán kết quả
    const result = calculate(input.meridians);

    // 3. Insert measurement_session
    const { data: session, error: sessionError } = await supabase
      .from('measurement_sessions')
      .insert({
        patient_id: patientId,
        measured_at: input.measuredAt || new Date().toISOString(),
        operator_name: input.operatorName || null,
        symptoms_note: input.symptomsNote || null,
        condition_note: input.conditionNote || null,
        room_temperature: input.roomTemperature || null,
        blood_pressure: input.bloodPressure || null,
        pulse: input.pulse || null,
        spo2: input.spo2 || null,
        conclusion_note: input.conclusionNote || null,
        upper_group_center: result.handStats.groupCenter,
        lower_group_center: result.footStats.groupCenter,
        upper_lower_diff: result.upperLowerDiff,
      })
      .select('id')
      .single();

    if (sessionError) throw sessionError;

    // 4. Insert measurement_values
    const valuesData = result.meridians.map(mr => ({
      session_id: session.id,
      meridian_code: mr.meridianCode,
      meridian_name: mr.meridianName,
      group_type: mr.groupType,
      left_temp: mr.leftTemp,
      right_temp: mr.rightTemp,
      mean_temp: mr.mean,
      left_right_diff: mr.diff,
      left_state: mr.leftState,
      right_state: mr.rightState,
      final_state: mr.finalState,
      group_left_mean: mr.groupLeftMean,
      group_right_mean: mr.groupRightMean,
      group_max: mr.groupMax,
      group_min: mr.groupMin,
      group_range: mr.groupRange,
      group_center: mr.groupCenter,
      group_error: mr.groupError,
      upper_threshold: mr.upperThreshold,
      lower_threshold: mr.lowerThreshold,
      deviation_from_center: mr.deviationFromCenter,
      rank_diff: mr.rankDiff,
    }));

    const { error: valuesError } = await supabase
      .from('measurement_values')
      .insert(valuesData);

    if (valuesError) throw valuesError;

    return { success: true, sessionId: session.id };
  } catch (error: any) {
    console.error('Error saving session:', error);
    const errorMessage = error?.message || error?.details || JSON.stringify(error);
    return { success: false, error: errorMessage };
  }
}
