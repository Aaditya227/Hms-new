// updated 3 — read-only version with GET API calls only
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../components/common/Button";
import { X, Edit2, Eye, Trash2, Plus } from "lucide-react";
import base_url from "../utils/baseurl";

export default function PharmacistPrescription() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [doctorPatients, setDoctorPatients] = useState([]); // Only patients of selected doctor
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_BASE = `${base_url}`;

  // ---------------- Fetch Data ----------------
  useEffect(() => {
    fetchAllPrescriptions();
    fetchDoctors();
    fetchMedicines();
  }, []);

  const fetchAllPrescriptions = async () => {
    try {
      const res = await axios.get(`${API_BASE}/prescriptions`);
      if (res.data.success) {
        setPrescriptions(res.data.data);
      } else {
        console.error("API returned unsuccessful response");
        setPrescriptions([]);
      }
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API_BASE}/doctors`);
      setDoctors(res.data.doctors || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchMedicines = async () => {
    try {
      const res = await axios.get(`${API_BASE}/pharmacy`);
      setMedicines(res.data || []);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  // Fetch patients assigned to a specific doctor (by user_id)
  const fetchPatientsByDoctor = async (doctorId) => {
    if (!doctorId) {
      setDoctorPatients([]);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE}/doctors/patients/${doctorId}`);
      if (res.data.success) {
        setDoctorPatients(res.data.data || []);
      } else {
        console.error("Failed to fetch doctor's patients");
        setDoctorPatients([]);
      }
    } catch (error) {
      console.error("Error fetching doctor's patients:", error);
      setDoctorPatients([]);
    }
  };

  // View prescription details
  const handleViewDetails = (prescription) => {
    setSelectedPrescription(prescription);
    setShowDetails(true);
    if (prescription.doctor_id) {
      fetchPatientsByDoctor(prescription.doctor_id);
    }
  };

  // Get doctor name by user_id
  const getDoctorName = (id) => {
    const doc = doctors.find((d) => d.user_id === Number(id));
    return doc ? `${doc.first_name} ${doc.last_name} (${doc.specialization || "N/A"})` : "N/A";
  };

  const getMedicineNames = (items) => {
    if (!items || items.length === 0) return "-";
    return items
      .map((i) => {
        const medicineName = i.medication_name || i.name || "Unknown";
        const dosage = i.dose || "";
        return dosage ? `${medicineName} (${dosage})` : medicineName;
      })
      .join(", ");
  };

  // Get patient name by ID
  const getPatientName = (patientId) => {
    const patient = doctorPatients.find((p) => p.id === Number(patientId));
    return patient ? `${patient.first_name} ${patient.last_name}` : "Unknown Patient";
  };

  // Get medicine name by ID
  const getMedicineName = (medicineId) => {
    const medicine = medicines.find((m) => m.id === Number(medicineId));
    return medicine ? `${medicine.brand_name} — ${medicine.strength}` : "Unknown Medicine";
  };

  // ---------------- UI ----------------
  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">Prescriptions</h2>
      </div>

      {/* ---------------- Details Modal ---------------- */}
      {showDetails && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full sm:w-[90%] md:w-[700px] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowDetails(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-semibold mb-4">Prescription Details</h3>

            {/* Patient & Doctor Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="font-medium">Patient</label>
                <p className="mt-1 p-2 bg-gray-50 rounded-md">
                  {selectedPrescription.patient_first_name} {selectedPrescription.patient_last_name}
                </p>
              </div>

              <div>
                <label className="font-medium">Doctor</label>
                <p className="mt-1 p-2 bg-gray-50 rounded-md">
                  {selectedPrescription.doctor_first_name} {selectedPrescription.doctor_last_name}
                </p>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label className="font-medium">Notes</label>
              <p className="mt-1 p-2 bg-gray-50 rounded-md min-h-[60px]">
                {selectedPrescription.notes || "No notes provided"}
              </p>
            </div>

            {/* Medicine Items */}
            <div className="mb-4">
              <label className="font-medium block mb-2">Medicines</label>
              
              {selectedPrescription.items && selectedPrescription.items.length > 0 ? (
                <div className="space-y-3">
                  {selectedPrescription.items.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 sm:grid-cols-4 gap-2 p-3 border rounded-md bg-gray-50"
                    >
                      <div>
                        <p className="text-sm text-gray-500">Medicine</p>
                        <p>{getMedicineName(item.medication_id)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Dosage</p>
                        <p>{item.dose || "N/A"}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Quantity</p>
                        <p>{item.quantity || "N/A"}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p>{item.days || "N/A"} days</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No medicines prescribed</p>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <Button onClick={() => setShowDetails(false)} className="w-full sm:w-auto">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Table ---------------- */}
      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg text-md">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="p-2">Id</th>
              <th className="p-2">Patient</th>
              <th className="p-2">Doctor</th>
              <th className="p-2">Medicines</th>
              <th className="p-2">Notes</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.length > 0 ? (
              prescriptions.map((p, index) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{p.patient_first_name} {p.patient_last_name}</td>
                  <td className="px-4 py-2">{p.doctor_first_name} {p.doctor_last_name}</td>
                  <td className="px-4 py-2">{getMedicineNames(p.items)}</td>
                  <td className="px-4 py-2">{p.notes || "-"}</td>
                  <td className="px-4 py-2">
                    <button 
                      onClick={() => handleViewDetails(p)} 
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Eye size={16} /> 
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500 italic">
                  No prescriptions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}