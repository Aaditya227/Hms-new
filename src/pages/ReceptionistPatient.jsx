import { useState, useEffect } from "react";
import axios from "axios";
import { Users, Search, Eye } from "../lib/icons";
import { DataTable } from "../components/common/DataTable";
import { Modal } from "../components/common/Modal";
import base_url from "../utils/baseurl";

// Map status (API number) ↔ UI label
const getStatusLabel = (statusValue) => {
  if (statusValue === 1 || statusValue === "1") return "OPD";
  if (statusValue === 2 || statusValue === "2") return "IPD";
  return "Inactive";
};

// Format height/weight: "180.00" → "180"
const formatDimension = (value) => {
  if (!value) return "-";
  const num = parseFloat(value);
  return isNaN(num) ? "-" : Math.round(num);
};

export function ReceptionistPatient() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${base_url}/patients`);
      const data = res.data.data || [];
      setPatients(data);
    } catch (err) {
      console.error("Error fetching patients:", err);
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

  const filteredPatients = patients.filter((p) =>
    (p.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone?.includes(searchQuery) ||
      p.id?.toString().includes(searchQuery))
  );

  if (loading)
    return <p className="text-center py-8 text-gray-500">Loading patients...</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-10">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600 mt-1">View patient records and information</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Total Patients", value: patients.length, color: "blue" },
          { label: "OPD Patients", value: patients.filter((p) => p.status == "1").length, color: "green" },
          { label: "IPD Patients", value: patients.filter((p) => p.status == "2").length, color: "orange" },
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
          <p className="text-gray-500 text-center py-8">No patients found.</p>
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              data={filteredPatients}
              columns={[
                { 
                  header: "Name", 
                  accessor: (r) => `${r.first_name || ""} ${r.last_name || ""}` 
                },
                { header: "Phone", accessor: "phone" },
                { 
                  header: "Age", 
                  accessor: (r) => calculateAge(r.dob) 
                },
                { header: "Gender", accessor: "gender" },
                {
                  header: "Status",
                  accessor: (r) => {
                    const status = getStatusLabel(r.status);
                    let color = "bg-gray-100 text-gray-700";
                    if (status === "OPD") color = "bg-green-100 text-green-700";
                    else if (status === "IPD") color = "bg-orange-100 text-orange-700";
                    return (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
                        {status}
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
            <p><strong>Name:</strong> {selectedPatient.first_name} {selectedPatient.last_name}</p>
            <p><strong>DOB:</strong> {selectedPatient.dob?.split("T")[0] || "—"}</p>
            <p><strong>Age:</strong> {calculateAge(selectedPatient.dob)}</p>
            <p><strong>Gender:</strong> {selectedPatient.gender}</p>
            <p><strong>Phone:</strong> {selectedPatient.phone}</p>
            <p><strong>Email:</strong> {selectedPatient.email || "—"}</p>
            <p><strong>Address:</strong> {selectedPatient.address || "—"}</p>
            <p><strong>Blood Group:</strong> {selectedPatient.blood_group}</p>
            <p><strong>Height:</strong> {formatDimension(selectedPatient.height_cm)} cm</p>
            <p><strong>Weight:</strong> {formatDimension(selectedPatient.weight_kg)} kg</p>
            <p><strong>Current Treatment:</strong> {selectedPatient.current_treatment || "—"}</p>
            <p><strong>Allergies:</strong> {selectedPatient.allergies || "—"}</p>
            <p><strong>Medical History:</strong> {selectedPatient.medical_history || "—"}</p>
            <p><strong>Insurance Provider:</strong> {selectedPatient.insurance_provider || "—"}</p>
            <p><strong>Insurance Number:</strong> {selectedPatient.insurance_number || "—"}</p>
            <p><strong>Emergency Contact:</strong> {selectedPatient.emergency_contact_name || "—"}</p>
            <p><strong>Emergency Phone:</strong> {selectedPatient.emergency_contact_phone || "—"}</p>
            <p><strong>Status:</strong> {getStatusLabel(selectedPatient.status)}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}