// src/pages/Radiology.jsx
import { useEffect, useState } from "react";
import { Activity, Search, Plus, FileImage, Edit2, Trash2, Eye } from "../lib/icons";
import { Button } from "../components/common/Button";
import { DataTable } from "../components/common/DataTable";
import { Modal } from "../components/common/Modal";
import api from "../lib/api.js";

export function Radiology() {
  const [searchQuery, setSearchQuery] = useState("");
  const [radiologyOrders, setRadiologyOrders] = useState([]);
  const [studyTypes, setStudyTypes] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [doctorPatients, setDoctorPatients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    patientId: "",
    testId: "",
    doctorId: "",
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Base API URL for list
  const LIST_API_URL = "/radiology/requests";
  // ✅ Detail API URL pattern for update/delete
  const DETAIL_API_URL = "/radiology/radiology-requests";

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "in_progress": return "bg-blue-100 text-blue-700";
      case "completed": return "bg-purple-100 text-purple-700";
      case "reported": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // === FETCHERS ===
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get(LIST_API_URL);
      setRadiologyOrders(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching radiology orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudyTypes = async () => {
    try {
      const res = await api.get("/radiology/tests");
      setStudyTypes(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching study types:", error);
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
    fetchOrders();
    fetchStudyTypes();
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
        doctor_id: Number(formData.doctorId),
        test_id: Number(formData.testId),
      };

      if (editId) {
        await api.put(`${DETAIL_API_URL}/${editId}`, payload);
      } else {
        await api.post(LIST_API_URL, payload);
      }

      await fetchOrders();
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving radiology order:", error);
      alert("Failed to save radiology order.");
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
      doctorId: order.doctor_id,
    });
    setIsModalOpen(true);
    fetchPatientsByDoctor(order.doctor_id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this radiology order?")) return;
    try {
      await api.delete(`${DETAIL_API_URL}/${id}`);
      await fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setViewModalOpen(true);
  };

  // === DISPLAY HELPERS ===
  const getPatientName = (row) => row.patient_name || `Patient #${row.patient_id}`;
  const getTestName = (id) => {
    const test = studyTypes.find(t => t.id == id);
    return test ? test.name : `Test #${id}`;
  };
  const getDoctorName = (row) => row.doctor_name || `Doctor #${row.doctor_id}`;

  const filtered = radiologyOrders.filter((item) => {
    const patient = (item.patient_name || "").toLowerCase();
    const test = getTestName(item.test_id).toLowerCase();
    const doctor = (item.doctor_name || "").toLowerCase();
    const q = searchQuery.toLowerCase();
    return patient.includes(q) || test.includes(q) || doctor.includes(q);
  });

  const isPending = (status) => status?.toLowerCase() === "pending";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
            Radiology
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Manage imaging studies and reports
          </p>
        </div>
        <Button
          icon={Plus}
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
        >
          Create Radiology Order
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total", value: radiologyOrders.length, color: "blue" },
          { label: "Pending", value: radiologyOrders.filter(o => isPending(o.status)).length, color: "yellow" },
          { label: "In Progress", value: radiologyOrders.filter(o => o.status?.toLowerCase() === "in_progress").length, color: "purple" },
          { label: "Completed", value: radiologyOrders.filter(o => ["completed", "reported"].includes(o.status?.toLowerCase())).length, color: "green" },
        ].map((stat, i) => (
          <div key={i} className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-5 border border-gray-100 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${
              stat.color === "blue" ? "bg-blue-100 text-blue-600" :
              stat.color === "yellow" ? "bg-yellow-100 text-yellow-600" :
              stat.color === "purple" ? "bg-purple-100 text-purple-600" :
              "bg-green-100 text-green-600"
            }`}>
              <Activity className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100 overflow-x-auto">
        <div className="mb-6">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by patient, doctor, or study..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading...</p>
        ) : (
          <DataTable
            data={filtered}
            columns={[
              { header: "ID", accessor: "id" },
              { header: "Patient", accessor: (row) => getPatientName(row) },
              { header: "Test", accessor: (row) => getTestName(row.test_id) },
              { header: "Ordered By", accessor: (row) => getDoctorName(row) },
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
                      onClick={() => handleView(row)}
                      className="text-gray-600 hover:text-gray-900"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {isPending(row.status) && (
                      <>
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
                      </>
                    )}

                    {["completed", "reported"].includes(row.status?.toLowerCase()) && (
                      <button className="text-green-600 hover:text-green-800" title="View Report">
                        <FileImage className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ),
              },
            ]}
          />
        )}
      </div>

      {/* VIEW DETAILS MODAL */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedOrder(null);
        }}
        title="Radiology Order Details"
      >
        {selectedOrder && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
            <p><strong>Order ID:</strong> {selectedOrder.id}</p>
            <p><strong>Patient:</strong> {getPatientName(selectedOrder)}</p>
            <p><strong>Test:</strong> {getTestName(selectedOrder.test_id)}</p>
            <p><strong>Ordered By:</strong> {getDoctorName(selectedOrder)}</p>
            <p><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.status)}`}>
              {selectedOrder.status || "Pending"}
            </span></p>
            <p><strong>Created At:</strong> {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : "—"}</p>
          </div>
        )}
      </Modal>

      {/* CREATE/EDIT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editId ? "Edit Radiology Order" : "Create Radiology Order"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <select
            name="testId"
            value={formData.testId}
            onChange={handleFormChange}
            className="w-full border rounded-lg p-2"
            required
          >
            <option value="">Select Test</option>
            {studyTypes.map((test) => (
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