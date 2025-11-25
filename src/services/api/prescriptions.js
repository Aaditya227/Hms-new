// import { supabase } from '../../lib/supabase';

// export const prescriptionsApi = {
//   async getAll() {
//     const { data, error } = await supabase
//       .from('prescriptions')
//       .select(`
//         *,
//         patient:patients(first_name, last_name),
//         doctor:staff!prescriptions_doctor_id_fkey(first_name, last_name)
//       `)
//       .order('prescribed_date', { ascending: false });

//     if (error) throw error;
//     return data;
//   },

//   async getById(id) {
//     const { data, error } = await supabase
//       .from('prescriptions')
//       .select(`
//         *,
//         patient:patients(*),
//         doctor:staff!prescriptions_doctor_id_fkey(*),
//         prescription_items(
//           *,
//           medicine:medicines(*)
//         )
//       `)
//       .eq('id', id)
//       .maybeSingle();

//     if (error) throw error;
//     return data;
//   },

//   async updateStatus(id, status) {
//     const { data, error } = await supabase
//       .from('prescriptions')
//       .update({
//         status,
//         dispensed_date: status === 'DISPENSED' ? new Date().toISOString() : null
//       })
//       .eq('id', id)
//       .select()
//       .single();

//     if (error) throw error;
//     return data;
//   },
// };






import axios from "axios";

const API_URL = "http://localhost:5000/api/prescriptions";

export const prescriptionsApi = {
  // 🟢 Get all prescriptions
  async getAll() {
    try {
      const response = await axios.get(API_URL);
      return response.data; // backend se direct array aata hai
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      throw error;
    }
  },

  // 🟢 Get prescription by ID (with items & medicines)
  async getById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching prescription:", error);
      throw error;
    }
  },

  // 🟢 Update prescription status (e.g. DISPENSED / PENDING)
  async updateStatus(id, status) {
    try {
      const response = await axios.patch(`${API_URL}/${id}`, {
        status,
        dispensedDate:
          status === "DISPENSED" ? new Date().toISOString() : null,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating prescription status:", error);
      throw error;
    }
  },
};
