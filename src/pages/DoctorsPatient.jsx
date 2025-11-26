import { useState, useEffect } from "react";
import axios from "axios";
import { Users, Search, Eye } from "../lib/icons"; // Trash2 not used — removed
import { Button } from "../components/common/Button";
import { DataTable } from "../components/common/DataTable";
import { Modal } from "../components/common/Modal";
import base_url from "../utils/baseurl";
import { useAuth } from "../context/AuthContext"; // ✅ Import your AuthContext

// Normalize API → UI
const normalizePatientKeys = (p) => {
  return {
    id: p.id,
    firstName: p.first_name || "",
    lastName: p.last_name || "",
    email: p.email || "",
    phone: p.phone || "",
    address: p.address || "",
    gender: p.gender || "",
    dateOfBirth: p.dob || "",
    bloodGroup: p.blood_group || "",
    height: p.height_cm ? parseFloat(p.height_cm) : "",
    weight: p.weight_kg ? parseFloat(p.weight_kg) : "",
    status: p.status === "1" ? "OPD" : p.status === "2" ? "IPD" : "Inactive",
    currentTreatment: p.current_treatment || "",
    allergies: p.allergies || "",
    medicalHistory: p.medical_history || "",
    insuranceProvider: p.insurance_provider || "",
    policyNumber: p.insurance_number || "",
    emergencyName: p.emergency_contact_name || "",
    emergencyPhone: p.emergency_contact_phone || "",
    age: p.age || "",
  };
};

export function DoctorsPatient() {
  const { employee_id, loading: authLoading } = useAuth(); // ✅ Get employee_id from context

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    if (employee_id) {
      fetchPatientsForDoctor();
    }
  }, [employee_id]);

  const fetchPatientsForDoctor = async () => {
    try {
      setLoading(true);

      // ✅ Now using employee_id from AuthContext
      const res = await axios.get(`${base_url}/doctors/patients/${employee_id}`);
      const data = res.data.data || []; // API returns { success, count, data[] }
      setPatients(data.map(normalizePatientKeys));
    } catch (err) {
      console.error("Error fetching doctor's patients:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return "-";
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone?.includes(searchQuery) ||
      p.id?.toString().includes(searchQuery)
  );

  // Show loading while auth or data loads
  if (authLoading || loading) {
    return <p className="text-center py-8 text-gray-500">Loading patients...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-10">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">My Patients</h1>
          <p className="text-gray-600 mt-1">View your assigned patient records</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Total Patients", value: patients.length, color: "blue" },
          { label: "OPD Patients", value: patients.filter((p) => p.status === "OPD").length, color: "green" },
          { label: "IPD Patients", value: patients.filter((p) => p.status === "IPD").length, color: "orange" },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-5 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <Users className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Table */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
          <div className="w-full sm:w-1/2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, ID, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {filteredPatients.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No patients assigned to you.</p>
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              data={filteredPatients}
              columns={[
                { 
                  header: "Name", 
                  accessor: (r) => `${r.firstName || ""} ${r.lastName || ""}` 
                },
                { header: "Phone", accessor: "phone" },
                { 
                  header: "Age", 
                  accessor: (r) => calculateAge(r.dateOfBirth) 
                },
                { header: "Gender", accessor: "gender" },
                {
                  header: "Status",
                  accessor: (r) => {
                    let color = "bg-gray-100 text-gray-700";
                    if (r.status === "OPD") color = "bg-green-100 text-green-700";
                    else if (r.status === "IPD") color = "bg-orange-100 text-orange-700";
                    return (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
                        {r.status}
                      </span>
                    );
                  },
                },
                {
                  header: "Actions",
                  accessor: (r) => (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedPatient(r);
                          setViewModalOpen(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}
      </div>

      {/* View Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedPatient(null);
        }}
        title="Patient Details"
      >
        {selectedPatient && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
            <p><strong>ID:</strong> {selectedPatient.id}</p>
            <p><strong>Name:</strong> {selectedPatient.firstName} {selectedPatient.lastName}</p>
            <p><strong>DOB:</strong> {selectedPatient.dateOfBirth?.split("T")[0] || "—"}</p>
            <p><strong>Age:</strong> {calculateAge(selectedPatient.dateOfBirth)}</p>
            <p><strong>Gender:</strong> {selectedPatient.gender}</p>
            <p><strong>Phone:</strong> {selectedPatient.phone}</p>
            <p><strong>Email:</strong> {selectedPatient.email || "—"}</p>
            <p><strong>Address:</strong> {selectedPatient.address || "—"}</p>
            <p><strong>Blood Group:</strong> {selectedPatient.bloodGroup}</p>
            <p><strong>Height:</strong> {selectedPatient.height ? `${selectedPatient.height} cm` : "—"}</p>
            <p><strong>Weight:</strong> {selectedPatient.weight ? `${selectedPatient.weight} kg` : "—"}</p>
            <p><strong>Current Treatment:</strong> {selectedPatient.currentTreatment || "—"}</p>
            <p><strong>Allergies:</strong> {selectedPatient.allergies || "—"}</p>
            <p><strong>Medical History:</strong> {selectedPatient.medicalHistory || "—"}</p>
            <p><strong>Insurance Provider:</strong> {selectedPatient.insuranceProvider || "—"}</p>
            <p><strong>Policy No:</strong> {selectedPatient.policyNumber || "—"}</p>
            <p><strong>Emergency Contact:</strong> {selectedPatient.emergencyName || "—"}</p>
            <p><strong>Emergency Phone:</strong> {selectedPatient.emergencyPhone || "—"}</p>
            <p><strong>Status:</strong> {selectedPatient.status}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}