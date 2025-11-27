import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../components/common/Button";
import { X, Edit2, Trash2, Plus, Eye } from "lucide-react";
import base_url from "../utils/baseurl";

export default function PatientPrescription() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    notes: "",
    items: [],
  });
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const API_BASE = `${base_url}`;

  // Get patient ID from localStorage
  const getPatientId = () => {
    const authData = JSON.parse(localStorage.getItem("authData") || "{}");
    return authData.user?.id;
  };

  // ---------------- Fetch Data ----------------
  useEffect(() => {
    fetchPrescriptionsByPatient();
    fetchPatients();
    fetchDoctors();
    fetchMedicines();
  }, []);

  const fetchPrescriptionsByPatient = async () => {
    try {
      setDataLoading(true);
      const patientId = getPatientId();
      if (!patientId) {
        console.error("No patient ID found in localStorage");
        return;
      }
      
      const response = await axios.get(`${API_BASE}/prescriptions/by-patient/${patientId}`);
      if (response.data.success) {
        setPrescriptions(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      alert("Failed to fetch prescriptions!");
    } finally {
      setDataLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${API_BASE}/patients`);
      if (response.data.success) {
        setPatients(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${API_BASE}/doctors`);
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchMedicines = async () => {
    try {
      const response = await axios.get(`${API_BASE}/medicines`);
      if (response.data.success) {
        setMedicines(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };
 
  // ---------------- Handle Form ----------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        ...formData,
        doctorId: Number(formData.doctorId),
        patientId: Number(formData.patientId),
        items: formData.items.map((i) => ({
          ...i,
          medicineId: Number(i.medicineId),
          quantity: Number(i.quantity),
          durationDays: Number(i.durationDays),
        })),
      };

      if (editingId) {
        await axios.put(`${API_BASE}/prescriptions/${editingId}`, payload);
      } else {
        await axios.post(`${API_BASE}/prescriptions`, payload);
      }

      await fetchPrescriptionsByPatient();
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
    setFormData({ 
      patientId: getPatientId() || "", 
      doctorId: "", 
      notes: "", 
      items: [] 
    });
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setFormData({
      patientId: p.patient_id,
      doctorId: p.doctor_id,
      notes: p.notes || "",
      items: p.items?.map((i) => ({
        medicineId: i.medication_id,
        dosage: i.dose || "",
        quantity: i.quantity || 1,
        durationDays: i.days || 1,
      })) || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this prescription?")) return;
    try {
      await axios.delete(`${API_BASE}/prescriptions/${id}`);
      await fetchPrescriptionsByPatient();
    } catch (error) {
      console.error("Error deleting prescription:", error);
      alert("Failed to delete prescription!");
    }
  };

  const handleView = (prescription) => {
    setSelectedPrescription(prescription);
    setShowDetails(true);
  };

  const getDoctorName = (id) => {
    const doc = doctors.find((d) => d.id === id);
    return doc ? `${doc.first_name} ${doc.last_name} (${doc.speciality})` : "N/A";
  };

  const getPatientName = (id) => {
    const p = patients.find((pt) => pt.id === id);
    return p ? `${p.first_name} ${p.last_name}` : "N/A";
  };

  // Updated function to get medicine names based on the API response structure
  const getMedicineNames = (items) => {
    if (!items || items.length === 0) return "-";
    
    return items
      .map((item) => {
        // Try to get the medicine name from the item data first
        if (item.medication_name) {
          return `${item.medication_name} (${item.dose})`;
        }
        
        // If medication_name is not available, use the name field
        if (item.name) {
          return `${item.name} (${item.dose})`;
        }
        
        // If neither is available, check the medicines array
        const medicine = medicines.find((med) => med.id === item.medication_id);
        if (medicine) {
          return `${medicine.brand_name || medicine.name} (${item.dose})`;
        }
        
        return "-";
      })
      .join(", ");
  };

  // ---------------- UI ----------------
  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">My Prescriptions</h2>
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

            {/* Patient & Doctor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label>Patient</label>
                <select name="patientId" value={formData.patientId} onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-md">
                  <option value="">Select Patient</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.first_name} {p.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Doctor</label>
                <select name="doctorId" value={formData.doctorId} onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-md">
                  <option value="">Select Doctor</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.first_name} {d.last_name} — {d.speciality}
                    </option>
                  ))}
                </select>
              </div>
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
                <div key={index}
                  className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-2 items-center sm:items-end">
                  
                  <select
                    value={item.medicineId}
                    onChange={(e) => handleItemChange(index, "medicineId", e.target.value)}
                    className="p-2 border rounded-md"
                  >
                    <option value="">Select Medicine</option>
                    {medicines.map((m) => (
                      <option key={m.id} value={m.id}>{m.brand_name || m.name} — {m.strength}</option>
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
                  />

                  <input
                    type="number"
                    placeholder="Days"
                    value={item.durationDays}
                    onChange={(e) => handleItemChange(index, "durationDays", e.target.value)}
                    className="p-2 border rounded-md"
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

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700">Prescription ID</h4>
                <p className="text-gray-900">{selectedPrescription.id}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-700">Date</h4>
                <p className="text-gray-900">{new Date(selectedPrescription.created_at).toLocaleDateString()}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-700">Doctor</h4>
                <p className="text-gray-900">
                  {selectedPrescription.doctor_first_name} {selectedPrescription.doctor_last_name}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-700">Patient</h4>
                <p className="text-gray-900">
                  {selectedPrescription.patient_first_name} {selectedPrescription.patient_last_name}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-700">Notes</h4>
                <p className="text-gray-900">{selectedPrescription.notes || "No notes provided"}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-700">Medicines</h4>
                {selectedPrescription.items && selectedPrescription.items.length > 0 ? (
                  <div className="mt-2 border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration (Days)</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedPrescription.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 whitespace-nowrap">
                              {item.medication_name || item.name || 
                                (medicines.find(m => m.id === item.medication_id)?.brand_name || 
                                 medicines.find(m => m.id === item.medication_id)?.name || "N/A")}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">{item.dose || item.dosage || "N/A"}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{item.quantity || "N/A"}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{item.days || item.durationDays || "N/A"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-900">No medicines prescribed</p>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button 
                onClick={() => setShowDetails(false)} 
                className="text-white w-full sm:w-auto"
              >
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
              <th className="p-2">Doctor</th>
              <th className="p-2">Medicines</th>
              <th className="p-2">Notes</th>
              <th className="p-2">Date</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {dataLoading ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500 italic">
                  Loading prescriptions...
                </td>
              </tr>
            ) : prescriptions.length > 0 ? (
              prescriptions.map((p, index) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{p.doctor_first_name} {p.doctor_last_name}</td>
                  <td className="px-4 py-2">{getMedicineNames(p.items)}</td>
                  <td className="px-4 py-2">{p.notes || "-"}</td>
                  <td className="px-4 py-2">{new Date(p.created_at).toLocaleDateString()}</td>

                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleView(p)}
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