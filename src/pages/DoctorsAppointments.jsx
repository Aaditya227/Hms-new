// update
import React, { useState, useEffect } from "react";
import axios from "axios";
import base_url from "../utils/baseurl";
import { Calendar, Search, Eye } from "../lib/icons";
import { Button } from "../components/common/Button";
import { DataTable } from "../components/common/DataTable";
import { Modal } from "../components/common/Modal";
import { useAuth } from "../context/AuthContext"; // ✅ Import your AuthContext

export default function DoctorsAppointments() {
  const { employee_id, loading: authLoading } = useAuth(); // ✅ Get employee_id directly

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");

  // Fetch appointments once employee_id is available
  useEffect(() => {
    if (employee_id) {
      fetchAppointments();
    }
  }, [employee_id]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      // ✅ Now using employee_id from AuthContext (not localStorage parsing!)
      const res = await axios.get(`${base_url}/doctors/appointments/${employee_id}`);
      const data = res.data.data || []; // API returns { success, count, data[] }
      setAppointments(data);
    } catch (error) {
      console.error("❌ Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === "confirmed") return "bg-green-100 text-green-700";
    if (s === "scheduled") return "bg-blue-100 text-blue-700";
    if (s === "cancelled" || s === "no_show") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredAppointments = appointments.filter((appt) => {
    const matchesSearch =
      appt.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.appointment_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.phone?.includes(searchQuery);
    
    const matchesStatus = filterStatus === "ALL" || appt.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Show loading while auth or data loads
  if (authLoading || loading) {
    return <p className="text-center py-8 text-gray-500">Loading appointments...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-10">
        <div>
          <h1 className="text-3xl font-bold">My Appointments</h1>
          <p className="text-gray-600">View your scheduled patient appointments</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, code, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {["ALL", "confirmed", "scheduled", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-2 rounded-lg text-sm font-medium capitalize ${
                filterStatus === status
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status === "ALL" ? "All" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
        {filteredAppointments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No appointments found.</p>
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              data={filteredAppointments}
              columns={[
                { 
                  header: "Appointment Code", 
                  accessor: "appointment_code" 
                },
                { 
                  header: "Patient", 
                  accessor: (row) => `${row.first_name || ""} ${row.last_name || ""}` 
                },
                { 
                  header: "Phone", 
                  accessor: "phone" 
                },
                { 
                  header: "Scheduled At", 
                  accessor: (row) => formatDateTime(row.scheduled_at) 
                },
                { 
                  header: "Duration (min)", 
                  accessor: "duration_minutes" 
                },
                {
                  header: "Status",
                  accessor: (row) => (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
                      {row.status?.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase()) || "—"}
                    </span>
                  ),
                },
                {
                  header: "Actions",
                  accessor: (row) => (
                    <button
                      onClick={() => setSelectedAppointment(row)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  ),
                },
              ]}
            />
          </div>
        )}
      </div>

      {/* View Details Modal */}
      <Modal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        title="Appointment Details"
      >
        {selectedAppointment && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
            <p><strong>Appointment Code:</strong> {selectedAppointment.appointment_code}</p>
            <p><strong>Status:</strong> {selectedAppointment.status}</p>
            <p><strong>Scheduled At:</strong> {formatDateTime(selectedAppointment.scheduled_at)}</p>
            <p><strong>Duration:</strong> {selectedAppointment.duration_minutes} minutes</p>
            <p><strong>Reason:</strong> {selectedAppointment.reason || "—"}</p>
            <p><strong>Notes:</strong> {selectedAppointment.notes || "—"}</p>

            <p><strong>Patient Name:</strong> {selectedAppointment.first_name} {selectedAppointment.last_name}</p>
            <p><strong>Phone:</strong> {selectedAppointment.phone}</p>
            <p><strong>Email:</strong> {selectedAppointment.email || "—"}</p>
            <p><strong>DOB:</strong> {selectedAppointment.dob?.split("T")[0] || "—"}</p>
            <p><strong>Age:</strong> {selectedAppointment.age || "—"}</p>
            <p><strong>Gender:</strong> {selectedAppointment.gender}</p>
            <p><strong>Address:</strong> {selectedAppointment.address || "—"}</p>
            <p><strong>Blood Group:</strong> {selectedAppointment.blood_group}</p>
            <p><strong>Allergies:</strong> {selectedAppointment.allergies}</p>
            <p><strong>Medical History:</strong> {selectedAppointment.medical_history}</p>
            <p><strong>Current Treatment:</strong> {selectedAppointment.current_treatment}</p>
            <p><strong>Insurance:</strong> {selectedAppointment.insurance_provider}</p>
            <p><strong>Policy No:</strong> {selectedAppointment.insurance_number}</p>
            <p><strong>Emergency Contact:</strong> {selectedAppointment.emergency_contact_name}</p>
            <p><strong>Emergency Phone:</strong> {selectedAppointment.emergency_contact_phone}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}