// import { supabase } from '../../lib/supabase';

// export const radiologyApi = {
//   async getAllOrders() {
//     const { data, error } = await supabase
//       .from('radiology_orders')
//       .select(`
//         *,
//         patient:patients(first_name, last_name),
//         doctor:staff!radiology_orders_doctor_id_fkey(first_name, last_name)
//       `)
//       .order('ordered_date', { ascending: false });

//     if (error) throw error;
//     return data;
//   },

//   async getOrderById(id) {
//     const { data, error } = await supabase
//       .from('radiology_orders')
//       .select(`
//         *,
//         patient:patients(*),
//         doctor:staff!radiology_orders_doctor_id_fkey(*),
//         reports:radiology_reports(*)
//       `)
//       .eq('id', id)
//       .maybeSingle();

//     if (error) throw error;
//     return data;
//   },

//   async updateOrderStatus(id, status) {
//     const { data, error } = await supabase
//       .from('radiology_orders')
//       .update({ status })
//       .eq('id', id)
//       .select()
//       .single();

//     if (error) throw error;
//     return data;
//   },
// };




// src/services/radiologyApi.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const RESOURCE = `${API_BASE}/api/radiology`;

const client = axios.create({
  baseURL: RESOURCE,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export const radiologyApi = {
  async getAllOrders() {
    const res = await client.get("/");
    return res.data;
  },

  async getOrderById(id) {
    const res = await client.get(`/${id}`);
    return res.data;
  },

  async createOrder(orderData) {
    // orderData: { patientName, studyType, orderedBy, orderedDate, status }
    const res = await client.post("/", orderData);
    return res.data;
  },

  async updateOrder(id, orderData) {
    const res = await client.put(`/${id}`, orderData);
    return res.data;
  },

  async deleteOrder(id) {
    const res = await client.delete(`/${id}`);
    return res.data;
  },
};
