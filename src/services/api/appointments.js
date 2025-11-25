import { supabase } from '../../lib/supabase';

export async function getAppointments(filters) {
  let query = supabase
    .from('appointments')
    .select(`
      *,
      patient:patients(*),
      doctor:staff(*)
    `)
    .order('scheduled_at', { ascending: true });

  if (filters && filters.date) {
    const startOfDay = new Date(filters.date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(filters.date);
    endOfDay.setHours(23, 59, 59, 999);

    query = query
      .gte('scheduled_at', startOfDay.toISOString())
      .lte('scheduled_at', endOfDay.toISOString());
  }

  if (filters && filters.doctorId) {
    query = query.eq('doctor_id', filters.doctorId);
  }

  if (filters && filters.patientId) {
    query = query.eq('patient_id', filters.patientId);
  }

  if (filters && filters.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query.limit(100);

  if (error) throw error;
  return data;
}

export async function getTodayAppointments(doctorId) {
  return getAppointments({
    date: new Date().toISOString().split('T')[0],
    doctorId,
  });
}

export async function createAppointment(appointment) {
  const tokenNumber = `TOK-${Date.now().toString().slice(-8)}`;

  const { data, error } = await supabase
    .from('appointments')
    .insert([{
      token_number: tokenNumber,
      patient_id: appointment.patientId,
      doctor_id: appointment.doctorId,
      scheduled_at: appointment.scheduledAt,
      type: appointment.type,
      reason: appointment.reason,
      duration: appointment.duration || 30,
      status: 'SCHEDULED',
    }])
    .select(`
      *,
      patient:patients(*),
      doctor:staff(*)
    `)
    .single();

  if (error) throw error;
  return data;
}

export async function updateAppointmentStatus(id, status) {
  const updates = { status };

  if (status === 'CHECKED_IN') {
    updates.checked_in_at = new Date().toISOString();
  } else if (status === 'COMPLETED') {
    updates.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('appointments')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      patient:patients(*),
      doctor:staff(*)
    `)
    .single();

  if (error) throw error;
  return data;
}

export async function cancelAppointment(id, reason) {
  return updateAppointmentStatus(id, 'CANCELLED');
}

export const appointmentsApi = {
  getAll: getAppointments,
  getToday: getTodayAppointments,
  create: createAppointment,
  updateStatus: updateAppointmentStatus,
  cancel: cancelAppointment,
};
