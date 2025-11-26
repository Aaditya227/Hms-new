import React, { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2 } from "../lib/icons";
import { Button } from "../components/common/Button";
import { DataTable } from "../components/common/DataTable";
import { Modal } from "../components/common/Modal";
import api from "../lib/api.js";

export function Laboratory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [labTests, setLabTests] = useState([]);
  const [labTestOptions, setLabTestOptions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [doctorPatients, setDoctorPatients] = useState([]); // Only used in form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "",
    testId: "",
    doctorId: "",
  });
  const [editId, setEditId] = useState(null);

  const API_URL = "/labs/lab-requests";

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "in_progress": return "bg-blue-100 text-blue-700";
      case "completed": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // === FETCH DATA ===
  const fetchLabOrders = async () => {
    try {
      const res = await api.get(API_URL);
      setLabTests(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching lab orders:", error);
    }
  };

  const fetchLabTestOptions = async () => {
    try {
      const res = await api.get("/labs/lab-tests");
      setLabTestOptions(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching lab tests:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await api.get("/doctors");
      const list = Array.isArray(res.data) ? res.data : res.data?.doctors || [];
      setDoctors(list);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchPatientsByDoctor = async (employeeId) => {
    if (!employeeId) {
      setDoctorPatients([]);
      return;
    }
    try {
      const res = await api.get(`/doctors/patients/${employeeId}`);
      const patients = res.data?.success
        ? res.data.data || []
        : Array.isArray(res.data) ? res.data : [];
      setDoctorPatients(patients);
    } catch (error) {
      console.error("Error fetching patients:", error);
      setDoctorPatients([]);
    }
  };

  useEffect(() => {
    fetchLabOrders();
    fetchLabTestOptions();
    fetchDoctors();
  }, []);

  // === FORM HANDLERS ===
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "doctorId") {
      fetchPatientsByDoctor(value);
      setFormData((prev) => ({ ...prev, patientId: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        patient_id: Number(formData.patientId),
        test_id: Number(formData.testId),
        requested_by: Number(formData.doctorId), // ✅ employee_id
      };

      if (editId) {
        await api.put(`${API_URL}/${editId}`, payload);
      } else {
        await api.post(API_URL, payload);
      }

      await fetchLabOrders();
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving lab order:", error);
      alert("Failed to save lab order.");
    }
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ patientId: "", testId: "", doctorId: "" });
    setDoctorPatients([]);
  };

  const handleEdit = (order) => {
    setEditId(order.id);
    setFormData({
      patientId: order.patient_id,
      testId: order.test_id,
      doctorId: order.requested_by,
    });
    setIsModalOpen(true);
    fetchPatientsByDoctor(order.requested_by);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lab order?")) return;
    try {
      await api.delete(`${API_URL}/${id}`);
      await fetchLabOrders();
    } catch (error) {
      console.error("Error deleting lab order:", error);
    }
  };

  // === DISPLAY HELPERS (for TABLE only) ===
  const getTestName = (testId) => {
    const test = labTestOptions.find(t => t.id == testId);
    return test ? test.name : `Test #${testId}`;
  };

  const filteredTests = labTests.filter((item) => {
    const patient = (item.patient_name || "").toLowerCase();
    const test = getTestName(item.test_id).toLowerCase();
    const doctor = (item.doctor_name || "").toLowerCase();
    const q = searchQuery.toLowerCase();
    return patient.includes(q) || test.includes(q) || doctor.includes(q);
  });

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">Laboratory</h1>
          <p className="text-gray-600 mt-1">Manage lab tests and results</p>
        </div>
        <Button
          icon={Plus}
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="w-full sm:w-auto"
        >
          Create Lab Order
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div className="mb-6">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by patient, doctor, or test..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <DataTable
          data={filteredTests}
          columns={[
            { header: "ID", accessor: "id" },
            { 
              header: "Patient", 
              accessor: (row) => row.patient_name || `Patient #${row.patient_id}` 
            },
            { 
              header: "Test Type", 
              accessor: (row) => getTestName(row.test_id) 
            },
            { 
              header: "Ordered By", 
              accessor: (row) => row.doctor_name || `Doctor #${row.requested_by}` 
            },
            {
              header: "Status",
              accessor: (row) => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
                  {row.status || "Pending"}
                </span>
              ),
            },
            {
              header: "Actions",
              accessor: (row) => (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(row)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(row.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editId ? "Edit Lab Order" : "Create Lab Order"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Doctor */}
          <select
            name="doctorId"
            value={formData.doctorId}
            onChange={handleFormChange}
            className="w-full border rounded-lg p-2"
            required
          >
            <option value="">Select Doctor</option>
            {doctors.map((doc) => (
              <option key={doc.employee_id} value={doc.employee_id}>
                {doc.first_name} {doc.last_name}
                {doc.specialization ? ` — ${doc.specialization}` : ""}
              </option>
            ))}
          </select>

          {/* Patient */}
          <select
            name="patientId"
            value={formData.patientId}
            onChange={handleFormChange}
            className="w-full border rounded-lg p-2"
            required
            disabled={!formData.doctorId}
          >
            <option value="">Select Patient</option>
            {doctorPatients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.first_name} {p.last_name}
                {p.age ? ` (${p.age} yrs)` : ""}
              </option>
            ))}
          </select>

          {/* Test */}
          <select
            name="testId"
            value={formData.testId}
            onChange={handleFormChange}
            className="w-full border rounded-lg p-2"
            required
          >
            <option value="">Select Test</option>
            {labTestOptions.map((test) => (
              <option key={test.id} value={test.id}>
                {test.name} {test.price ? ` - ₹${test.price}` : ""}
              </option>
            ))}
          </select>

          <Button type="submit" variant="primary" className="w-full">
            {editId ? "Update" : "Save"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}