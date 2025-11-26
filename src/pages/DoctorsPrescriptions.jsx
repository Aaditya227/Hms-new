// src/pages/Prescriptions.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../components/common/Button";
import { X, Edit2, Trash2, Plus } from "lucide-react";
import base_url from "../utils/baseurl";

// Helper: get logged-in doctor's employee ID from localStorage
const getCurrentDoctorEmployeeId = () => {
  try {
    const authData = JSON.parse(localStorage.getItem("authData"));
    return authData?.employee?.id || null;
  } catch (e) {
    console.warn("Failed to parse authData from localStorage");
    return null;
  }
};

export default function DoctorsPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [doctorPatients, setDoctorPatients] = useState([]); // Only your patients
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    patientId: "",
    notes: "",
    items: [],
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_BASE = `${base_url}`;
  const currentDoctorId = getCurrentDoctorEmployeeId(); // e.g., 3

  // ---------------- Fetch Data ----------------
  useEffect(() => {
    if (currentDoctorId) {
      fetchAllPrescriptions();
      fetchMedicines();
      fetchPatientsByDoctor(currentDoctorId);
    }
  }, [currentDoctorId]);

  // ✅ UPDATED: Fetch only prescriptions for current doctor
  const fetchAllPrescriptions = async () => {
    try {
      const res = await axios.get(`${API_BASE}/prescriptions/by-doctor/${currentDoctorId}`);
      if (res.data.success) {
        setPrescriptions(res.data.data || []);
      } else {
        console.warn("Prescriptions API returned unsuccessful response");
        setPrescriptions([]);
      }
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      setPrescriptions([]);
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

  const fetchPatientsByDoctor = async (empId) => {
    if (!empId) return;
    try {
      const res = await axios.get(`${API_BASE}/doctors/patients/${empId}`);
      if (res.data.success) {
        setDoctorPatients(res.data.data || []);
      } else {
        setDoctorPatients([]);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      setDoctorPatients([]);
    }
  };

  // ---------------- Form Handlers ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { medicineId: "", dosage: "", quantity: 1, durationDays: 1 }],
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  // ---------------- Save ----------------
  const handleSave = async () => {
    try {
      setLoading(true);

      const payload = {
        patient_id: Number(formData.patientId),
        doctor_id: currentDoctorId, // Always current logged-in doctor
        notes: formData.notes,
        items: formData.items.map((i) => ({
          medication_id: Number(i.medicineId),
          name: medicines.find((m) => m.id === i.medicineId)?.brand_name || "",
          dose: i.dosage,
          days: Number(i.durationDays),
          quantity: Number(i.quantity),
        })),
      };

      if (editingId) {
        await axios.put(`${API_BASE}/prescriptions/${editingId}`, payload);
      } else {
        await axios.post(`${API_BASE}/prescriptions`, payload);
      }

      await fetchAllPrescriptions();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Error saving prescription:", error);
      alert("Failed to save prescription!");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ patientId: "", notes: "", items: [] });
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setFormData({
      patientId: p.patient_id,
      notes: p.notes || "",
      items: p.items?.map((i) => ({
        medicineId: i.medication_id,
        dosage: i.dose || "",
        quantity: i.quantity || 1,
        durationDays: i.days || 1,
      })) || [],
    });
    setShowForm(true);
    // Patients already loaded for current doctor
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this prescription?")) return;
    try {
      await axios.delete(`${API_BASE}/prescriptions/${id}`);
      await fetchAllPrescriptions();
    } catch (error) {
      console.error("Error deleting prescription:", error);
      alert("Failed to delete prescription!");
    }
  };

  // ---------------- Helpers ----------------
  const getMedicineNames = (items) => {
    if (!items || items.length === 0) return "-";
    return items
      .map((i) => {
        const name = i.medication_name || i.name || "Unknown";
        const dose = i.dose || "";
        return dose ? `${name} (${dose})` : name;
      })
      .join(", ");
  };

  // ---------------- UI ----------------
  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">Prescriptions</h2>
        <Button onClick={() => { resetForm(); setShowForm(true); }} className="w-full sm:w-auto">
          + Add Prescription
        </Button>
      </div>

      {/* ---------------- Form Modal ---------------- */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full sm:w-[90%] md:w-[700px] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Prescription" : "Add New Prescription"}
            </h3>

            {/* Patient (doctor auto-assigned) */}
            <div className="mb-4">
              <label>Patient</label>
              <select
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md"
                required
              >
                <option value="">Select Patient</option>
                {doctorPatients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.first_name} {p.last_name} {p.age ? `(${p.age} yrs)` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label>Notes</label>
              <textarea
                rows={2}
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md"
              ></textarea>
            </div>

            {/* Medicine Items */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <Button onClick={addItem} className="flex items-center gap-2 w-full sm:w-auto">
                  <Plus size={16} /> Add Medicine
                </Button>
              </div>

              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-2 items-center sm:items-end"
                >
                  <select
                    value={item.medicineId}
                    onChange={(e) => handleItemChange(index, "medicineId", e.target.value)}
                    className="p-2 border rounded-md"
                  >
                    <option value="">Select Medicine</option>
                    {medicines.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.brand_name} — {m.strength}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Dosage"
                    value={item.dosage}
                    onChange={(e) => handleItemChange(index, "dosage", e.target.value)}
                    className="p-2 border rounded-md"
                  />

                  <input
                    type="number"
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                    className="p-2 border rounded-md"
                    min="1"
                  />

                  <input
                    type="number"
                    placeholder="Days"
                    value={item.durationDays}
                    onChange={(e) => handleItemChange(index, "durationDays", e.target.value)}
                    className="p-2 border rounded-md"
                    min="1"
                  />

                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-800 mx-auto sm:mx-0"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-4">
              <Button onClick={handleSave} disabled={loading} className="text-white w-full sm:w-auto">
                {loading ? "Saving..." : editingId ? "Update" : "Save"}
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
                  <td className="px-4 py-2">
                    {p.doctor_first_name} {p.doctor_last_name}
                  </td>
                  <td className="px-4 py-2">{getMedicineNames(p.items)}</td>
                  <td className="px-4 py-2">{p.notes || "-"}</td>
                  <td className="px-4 py-2 flex gap-3">
                    <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800">
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
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