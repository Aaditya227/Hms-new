// import { supabase } from '../../lib/supabase';

// export const laboratoryApi = {
//   async getAllOrders() {
//     const { data, error } = await supabase
//       .from('lab_orders')
//       .select(`
//         *,
//         patient:patients(first_name, last_name),
//         doctor:staff!lab_orders_doctor_id_fkey(first_name, last_name),
//         test:laboratory_tests(name, code)
//       `)
//       .order('ordered_date', { ascending: false });

//     if (error) throw error;
//     return data;
//   },

//   async getOrderById(id) {
//     const { data, error } = await supabase
//       .from('lab_orders')
//       .select(`
//         *,
//         patient:patients(*),
//         doctor:staff!lab_orders_doctor_id_fkey(*),
//         test:laboratory_tests(*),
//         results:lab_results(*)
//       `)
//       .eq('id', id)
//       .maybeSingle();

//     if (error) throw error;
//     return data;
//   },

//   async updateOrderStatus(id, status) {
//     const { data, error } = await supabase
//       .from('lab_orders')
//       .update({ status })
//       .eq('id', id)
//       .select()
//       .single();

//     if (error) throw error;
//     return data;
//   },

//   async getAllTests() {
//     const { data, error } = await supabase
//       .from('laboratory_tests')
//       .select('*')
//       .eq('is_active', true)
//       .order('name');

//     if (error) throw error;
//     return data;
//   },
// };







// const API_BASE_URL = "http://localhost:5000/api/lab";

// export const labApi = {
//   // 🔹 Get all lab orders
//   async getAll() {
//     const res = await fetch(API_BASE_URL);
//     if (!res.ok) throw new Error("Failed to fetch lab orders");
//     return res.json();
//   },

//   // 🔹 Create new lab order
//   async create(orderData) {
//     const res = await fetch(API_BASE_URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(orderData),
//     });
//     if (!res.ok) throw new Error("Failed to create lab order");
//     return res.json();
//   },

//   // 🔹 Update lab order
//   async update(id, updatedData) {
//     const res = await fetch(`${API_BASE_URL}/${id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(updatedData),
//     });
//     if (!res.ok) throw new Error("Failed to update lab order");
//     return res.json();
//   },

//   // 🔹 Delete lab order
//   async delete(id) {
//     const res = await fetch(`${API_BASE_URL}/${id}`, {
//       method: "DELETE",
//     });
//     if (!res.ok) throw new Error("Failed to delete lab order");
//     return res.json();
//   },
// };








export const laboratoryApi = {
  async getAllTests() {
    const res = await fetch("http://localhost:5000/api/lab");
    if (!res.ok) throw new Error("Failed to fetch lab tests");
    return res.json();
  },

  async getTestById(id) {
    const res = await fetch(`http://localhost:5000/api/lab/${id}`);
    if (!res.ok) throw new Error("Failed to fetch test");
    return res.json();
  },

  async createTest(data) {
    const res = await fetch("http://localhost:5000/api/lab", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create test");
    return res.json();
  },

  async updateTest(id, data) {
    const res = await fetch(`http://localhost:5000/api/lab/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update test");
    return res.json();
  },

  async deleteTest(id) {
    const res = await fetch(`http://localhost:5000/api/lab/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete test");
    return res.json();
  },
};
