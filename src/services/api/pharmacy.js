// import { supabase } from '../../lib/supabase';

// export const pharmacyApi = {
//   async getAllMedicines() {
//     const { data, error } = await supabase
//       .from('medicines')
//       .select(`
//         *,
//         batches:medicine_batches(*)
//       `)
//       .order('name');

//     if (error) throw error;
//     return data;
//   },

//   async getMedicineById(id) {
//     const { data, error } = await supabase
//       .from('medicines')
//       .select(`
//         *,
//         batches:medicine_batches(*)
//       `)
//       .eq('id', id)
//       .maybeSingle();

//     if (error) throw error;
//     return data;
//   },

//   async createMedicine(medicine) {
//     const { data, error } = await supabase
//       .from('medicines')
//       .insert(medicine)
//       .select()
//       .single();

//     if (error) throw error;
//     return data;
//   },

//   async updateMedicine(id, updates) {
//     const { data, error } = await supabase
//       .from('medicines')
//       .update(updates)
//       .eq('id', id)
//       .select()
//       .single();

//     if (error) throw error;
//     return data;
//   },
// };








import axios from "axios";

const API_URL = "http://localhost:5000/api/pharmacy"; // apne backend route ke hisab se change karna

export const pharmacyApi = {
  async getAllMedicines() {
    const res = await axios.get(`${API_URL}`);
    return res.data;
  },
  async createMedicine(data) {
    const res = await axios.post(`${API_URL}`, data);
    return res.data;
  },
  async updateMedicine(id, data) {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return res.data;
  },
  async deleteMedicine(id) {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  },
};
