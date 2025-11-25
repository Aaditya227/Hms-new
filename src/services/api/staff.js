import { supabase } from '../../lib/supabase';

export const staffApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('staff')
      .select(`
        *,
        user:users(email, role),
        department:departments(name),
        specialization:specializations(name)
      `)
      .order('first_name');

    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('staff')
      .select(`
        *,
        user:users(*),
        department:departments(*),
        specialization:specializations(*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('staff')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
