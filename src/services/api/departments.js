import { supabase } from '../../lib/supabase';

export async function getDepartments() {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getDepartmentById(id) {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createDepartment(department) {
  const { data, error } = await supabase
    .from('departments')
    .insert([department])
    .select()
    .single();

  if (error) throw error;
  return data;
}
