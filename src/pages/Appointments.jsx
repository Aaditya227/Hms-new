<<<<<<< HEAD


// update

=======
>>>>>>> 43fcfc8163b000b0d7f254ea9c207a39a528ed24
import React, { useState, useEffect } from "react";
import axios from "axios";
import base_url from "../utils/baseurl";
import {
  Calendar,
  Plus,
  Clock,
  User,
  CheckCircle,
  Eye,
  Edit2,
  Trash2,
} from "../lib/icons";
import { Button } from "../components/common/Button";
import { DataTable } from "../components/common/DataTable";
import { Modal } from "../components/common/Modal";
import { AppointmentBookingForm } from "../components/forms/AppointmentBookingForm";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [editAppointment, setEditAppointment] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Fetch all data
  const fetchAllData = async () => {
    try {
      const [appRes, patRes, docRes, deptRes] = await Promise.all([
        axios.get(`${base_url}/appointments`),
        axios.get(`${base_url}/patients`),
        axios.get(`${base_url}/doctors`),
        axios.get(`${base_url}/departments`),
      ]);

      console.log("Appointments data:", appRes.data); // Debug log
      console.log("Patients data:", patRes.data); // Debug log
      console.log("Doctors data:", docRes.data); // Debug log

      setAppointments(appRes.data.data || appRes.data || []);
      setPatients(patRes.data.data || patRes.data || []);
      // Handle different response structures for doctors
      const doctorsData = docRes.data.doctors || docRes.data.data || docRes.data || [];
      setDoctors(doctorsData);
      setDepartments(deptRes.data.data || deptRes.data || []);

    } catch (error) {
      console.error("❌ Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Status colors
  const getStatusColor = (status) => {
    switch (status) {
      case "SCHEDULED":
      case "CONFIRMED":
        return "bg-blue-100 text-blue-700";
      case "CHECKED_IN":
        return "bg-yellow-100 text-yellow-700";
      case "IN_CONSULTATION":
        return "bg-purple-100 text-purple-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
      case "NO_SHOW":
        return "bg-red-100 text-red-700";
      case "RESCHEDULED":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Create appointment
  const handleBookingSuccess = async (formData) => {
    try {
      console.log("Creating appointment with data:", formData); // Debug log
      const res = await axios.post(`${base_url}/appointments`, formData);
      setAppointments((prev) => [...prev, res.data.data]);
      setIsModalOpen(false);
      alert("✅ Appointment booked successfully!");
      fetchAllData();
    } catch (error) {
      console.error("❌ Error creating appointment:", error.response?.data || error);
      alert(`❌ Failed to create appointment: ${error.response?.data?.message || "Unknown error"}`);
    }
  };

  // Edit
  const handleEditSuccess = async (updatedData) => {
    try {
      console.log("Updating appointment with data:", updatedData); // Debug log
      const res = await axios.put(
        `${base_url}/appointments/${updatedData.id}`,
        updatedData
      );

      setAppointments((prev) =>
        prev.map((a) => (a.id === updatedData.id ? res.data.data : a))
      );

      setIsEditModalOpen(false);
      setEditAppointment(null);
      alert("✅ Appointment updated!");
      fetchAllData();

    } catch (error) {
      console.error("❌ Error updating appointment:", error.response?.data || error);
      alert(`❌ Failed to update appointment: ${error.response?.data?.message || "Unknown error"}`);
    }
  };

  // Cancel
  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await axios.delete(`${base_url}/appointments/${id}`);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      alert("🗑️ Appointment cancelled!");
      fetchAllData();
    } catch (error) {
      console.error("❌ Error cancelling:", error);
      alert(`❌ Failed to cancel: ${error.response?.data?.message || "Unknown error"}`);
    }
  };

  // Helpers
  const getPatientName = (id) => {
    const p = patients.find((x) => x.id === id);
    return p ? `${p.first_name} ${p.last_name}` : "-";
  };

  const getDoctorName = (id) => {
    const d = doctors.find((x) => x.doctor_id === id);
    return d ? `${d.first_name} ${d.last_name}` : "-";
  };

  // Get department name from doctor
  const getDepartmentName = (doctorId) => {
    const doc = doctors.find((x) => x.id === doctorId);
    return doc?.department_name || doc?.department || "-";
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-10">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-gray-600">Manage and schedule patient appointments</p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} icon={Plus}>
          Book Appointment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total", value: appointments.length, icon: Calendar, colorClass: "bg-blue-100 text-blue-600" },
          { label: "Scheduled", value: appointments.filter(a => a.status === "scheduled").length, icon: Clock, colorClass: "bg-yellow-100 text-yellow-600" },
          { label: "In Consultation", value: appointments.filter(a => a.status === "in_consultation").length, icon: User, colorClass: "bg-purple-100 text-purple-600" },
          { label: "Completed", value: appointments.filter(a => a.status === "completed").length, icon: CheckCircle, colorClass: "bg-green-100 text-green-600" }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.colorClass}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          "ALL",
          "scheduled",
          "confirmed",
          "rescheduled",
          "completed",
          "cancelled",
        ].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              filterStatus === status
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status.replace("_", " ").charAt(0).toUpperCase() + status.replace("_", " ").slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <DataTable
          data={appointments.filter(
            (a) => filterStatus === "ALL" || a.status === filterStatus
          )}
          columns={[
            { header: "Appt No", accessor: "appointment_code" },
            { header: "Patient", accessor: (row) => getPatientName(row.patient_id) },
            { header: "Doctor", accessor: (row) => getDoctorName(row.doctor_id) },
            // { header: "Department", accessor: (row) => getDepartmentName(row.doctor_id) },
            { header: "Scheduled At", accessor: (row) => formatDate(row.scheduled_at) },
            {
              header: "Status",
              accessor: (row) => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
                  {row.status.replace("_", " ").charAt(0).toUpperCase() + row.status.replace("_", " ").slice(1)}
                </span>
              ),
            },
            {
              header: "Actions",
              accessor: (row) => (
                <div className="flex gap-3 justify-center">
                  <button onClick={() => setSelectedAppointment(row)} className="text-indigo-600">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => { setEditAppointment(row); setIsEditModalOpen(true); }} className="text-green-600">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {row.status !== "completed" &&
                    row.status !== "cancelled" && (
                      <button onClick={() => handleCancel(row.id)} className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Modal (Create) */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Book Appointment">
        <AppointmentBookingForm onSuccess={handleBookingSuccess} />
      </Modal>

      {/* Modal (Edit) */}
      {editAppointment && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Appointment"
        >
          <AppointmentBookingForm
            onSuccess={handleEditSuccess}
            initialData={editAppointment}
            isEdit
          />
        </Modal>
      )}

      {/* Modal (View Details) */}
      {selectedAppointment && (
        <Modal
          isOpen={!!selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          title="Appointment Details"
        >
          <div className="space-y-3 text-sm">
            <p><strong>ID:</strong> {selectedAppointment.id}</p>
            <p><strong>Appointment No:</strong> {selectedAppointment.appointmentNumber}</p>
            <p><strong>Patient:</strong> {getPatientName(selectedAppointment.patient_id)}</p>
            <p><strong>Doctor:</strong> {getDoctorName(selectedAppointment.doctor_id)}</p>
            <p><strong>Department:</strong> {getDepartmentName(selectedAppointment.doctor_id)}</p>
            <p><strong>Duration (mins):</strong> {selectedAppointment.duration_minutes}</p>
            <p><strong>Scheduled At:</strong> {formatDate(selectedAppointment.scheduled_at)}</p>
            <p><strong>Status:</strong> {selectedAppointment.status}</p>
            <p><strong>Reason:</strong> {selectedAppointment.reason}</p>
            <p><strong>Notes:</strong> {selectedAppointment.notes}</p>
          </div>
        </Modal>
      )}
    </div>
  );
}