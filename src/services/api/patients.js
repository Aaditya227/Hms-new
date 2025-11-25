// import { supabase, DEMO_MODE } from "../../lib/supabase";

// const MOCK_PATIENTS = [
//   {
//     id: "1",
//     upid: "P1001",
//     first_name: "John",
//     last_name: "Doe",
//     date_of_birth: "1980-01-15",
//     gender: "MALE",
//     phone: "+1234567890",
//     email: "john.doe@email.com",
//     address: "123 Main St, City",
//     status: "OPD",
//     blood_group: "O+",
//     allergies: "None",
//   },
//   {
//     id: "2",
//     upid: "P1002",
//     first_name: "Jane",
//     last_name: "Smith",
//     date_of_birth: "1992-05-20",
//     gender: "FEMALE",
//     phone: "+1234567891",
//     email: "jane.smith@email.com",
//     address: "456 Oak Ave, City",
//     status: "IPD",
//     blood_group: "A+",
//     allergies: "Penicillin",
//   },
// ];

// export async function getPatients(limit = 100) {
//   try {
//     if (DEMO_MODE) {
//       return Promise.resolve(MOCK_PATIENTS);
//     }

//     const { data, error } = await supabase
//       .from("patients")
//       .select("*")
//       .order("created_at", { ascending: false })
//       .limit(limit);

//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error("Error fetching patients:", error);
//     return MOCK_PATIENTS;
//   }
// }

// export async function getPatientById(id) {
//   try {
//     if (DEMO_MODE) {
//       return MOCK_PATIENTS.find((p) => p.id === id) || null;
//     }

//     const { data, error } = await supabase
//       .from("patients")
//       .select("*")
//       .eq("id", id)
//       .maybeSingle();

//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error("Error fetching patient:", error);
//     return MOCK_PATIENTS.find((p) => p.id === id) || null;
//   }
// }

// export async function searchPatients(query) {
//   try {
//     if (DEMO_MODE) {
//       const lowerQuery = query.toLowerCase();
//       return MOCK_PATIENTS.filter(
//         (p) =>
//           p.firstName.toLowerCase().includes(lowerQuery) ||
//           p.lastName.toLowerCase().includes(lowerQuery) ||
//           p.upid.toLowerCase().includes(lowerQuery) ||
//           p.phone.includes(query)
//       );
//     }

//     const { data, error } = await supabase
//       .from("patients")
//       .select("*")
//       .or(
//         `first_name.ilike.%${query}%,last_name.ilike.%${query}%,upid.ilike.%${query}%,phone.ilike.%${query}%`
//       )
//       .limit(50);

//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error("Error searching patients:", error);
//     return [];
//   }
// }

// export async function createPatient(patient) {
//   try {
//     if (DEMO_MODE) {
//       const newPatient = {
//         id: `${Date.now()}`,
//         ...patient,
//         upid: patient.upid || `P${Date.now().toString().slice(-6)}`,
//       };
//       return Promise.resolve(newPatient);
//     }

//     const upid = patient.upid || `P${Date.now().toString().slice(-6)}`;

//     const { data, error } = await supabase
//       .from("patients")
//       .insert([
//         {
//           ...patient,
//           upid,
//         },
//       ])
//       .select()
//       .single();

//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error("Error creating patient:", error);
//     throw error;
//   }
// }

// export async function updatePatient(id, updates) {
//   try {
//     if (DEMO_MODE) {
//       const patient = MOCK_PATIENTS.find((p) => p.id === id);
//       if (!patient) throw new Error("Patient not found");
//       return Promise.resolve({ ...patient, ...updates });
//     }

//     const { data, error } = await supabase
//       .from("patients")
//       .update(updates)
//       .eq("id", id)
//       .select()
//       .single();

//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error("Error updating patient:", error);
//     throw error;
//   }
// }

// export const patientsApi = {
//   getAll: getPatients,
//   getById: getPatientById,
//   search: searchPatients,
//   create: createPatient,
//   update: updatePatient,
// };









import axios from "axios";

const API_URL = "http://localhost:5000/api/patients";

export const patientsApi = {
  // 🔹 Get all patients
  async getAll() {
    try {
      const res = await axios.get(API_URL);
      return res.data; // backend se array aata hai
    } catch (err) {
      console.error("Error fetching patients:", err);
      throw err;
    }
  },

  // 🔹 Get patient by ID
  async getById(id) {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error fetching patient:", err);
      throw err;
    }
  },

  // 🔹 Search patients
  async search(query) {
    try {
      const res = await axios.get(`${API_URL}?search=${query}`);
      return res.data;
    } catch (err) {
      console.error("Error searching patients:", err);
      throw err;
    }
  },

  // 🔹 Create new patient
  async create(patient) {
    try {
      const res = await axios.post(API_URL, patient);
      return res.data;
    } catch (err) {
      console.error("Error creating patient:", err);
      throw err;
    }
  },

  // 🔹 Update existing patient
  async update(id, updates) {
    try {
      const res = await axios.put(`${API_URL}/${id}`, updates);
      return res.data;
    } catch (err) {
      console.error("Error updating patient:", err);
      throw err;
    }
  },
};
