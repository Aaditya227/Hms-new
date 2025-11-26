import React, { useState, useEffect } from "react";
import axios from "axios";
import base_url from "../utils/baseurl";
import {
  Calendar,
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

export default function PatientsAppointments() {
  const [appointments, setAppointments] = useState([]); // Initialize as empty array
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [editAppointment, setEditAppointment] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [patientId, setPatientId] = useState(null); // Store patient ID from localStorage

  // Get patient ID from localStorage
  useEffect(() => {
    try {
      const authData = localStorage.getItem("authData");
      if (authData) {
        const parsedData = JSON.parse(authData);
        if (parsedData.user && parsedData.user.id) {
          setPatientId(parsedData.user.id);
        }
      }
    } catch (error) {
      console.error("Error parsing authData from localStorage:", error);
    }
  }, []);

  // Fetch patient appointments
  const fetchAppointments = async () => {
    if (!patientId) return; // Don't fetch if patientId is not available
    
    setLoading(true);
    try {
      // Fetch patient-specific appointments
      const appRes = await axios.get(`${base_url}/appointments/patient/${patientId}`);
      
      // Handle the response structure for appointments
      setAppointments(appRes.data && appRes.data.data ? appRes.data.data : []);
    } catch (error) {
      console.error("❌ Error fetching appointments:", error);
      // Set empty array on error to prevent filter issues
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchAppointments();
    }
  }, [patientId]);

  // Status colors
  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "checked_in":
        return "bg-yellow-100 text-yellow-700";
      case "in_consultation":
        return "bg-purple-100 text-purple-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
      case "no_show":
        return "bg-red-100 text-red-700";
      case "rescheduled":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Edit
  const handleEditSuccess = async (updatedData) => {
    try {
      const res = await axios.put(
        `${base_url}/appointments/${updatedData.id}`,
        updatedData
      );

      if (res.data && res.data.data) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === updatedData.id ? res.data.data : a))
        );
      }

      setIsEditModalOpen(false);
      setEditAppointment(null);
      alert("✅ Appointment updated!");
      fetchAppointments();
    } catch (error) {
      console.error("❌ Error updating appointment:", error.response?.data || error);
      alert("❌ Failed to update appointment.");
    }
  };

  // Cancel
  // const handleCancel = async (id) => {
  //   if (!window.confirm("Are you sure?")) return;

  //   try {
  //     await axios.delete(`${base_url}/appointments/${id}`);
  //     setAppointments((prev) => prev.filter((a) => a.id !== id));
  //     alert("🗑️ Appointment cancelled!");
  //   } catch (error) {
  //     console.error("❌ Error cancelling:", error);
  //     alert("❌ Failed to cancel.");
  //   }
  // };

  // Format date for display
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "-";
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-10">
        <div>
          <h1 className="text-3xl font-bold">My Appointments</h1>
          <p className="text-gray-600">View and manage your appointments</p>
        </div>
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
          "SCHEDULED",
          "CONFIRMED",
          "RESCHEDULED",
          "CHECKED_IN",
          "IN_CONSULTATION",
          "COMPLETED",
          "CANCELLED",
          "NO_SHOW"
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
            {status.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <DataTable
          data={Array.isArray(appointments) ? appointments.filter(
            (a) => filterStatus === "ALL" || a.status === filterStatus.toLowerCase()
          ) : []}
          columns={[
            { header: "Appt Code", accessor: "appointment_code" },
            { header: "Doctor", accessor: (row) => `${row.doctor_first_name || ""} ${row.doctor_last_name || ""}`.trim() || "-" },
            { header: "Scheduled At", accessor: (row) => formatDateTime(row.scheduled_at) },
            { header: "Duration", accessor: (row) => `${row.duration_minutes || 0} mins` },
            {
              header: "Status",
              accessor: (row) => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
                  {row.status ? row.status.replace("_", " ") : "UNKNOWN"}
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
                  {/* <button onClick={() => { setEditAppointment(row); setIsEditModalOpen(true); }} className="text-green-600">
                    <Edit2 className="w-4 h-4" />
                  </button> */}
                  {/* {row.status !== "completed" &&
                    row.status !== "cancelled" && (
                      <button onClick={() => handleCancel(row.id)} className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )} */}
                </div>
              ),
            },
          ]}
        />
      </div>

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
            <p><strong>Appointment Code:</strong> {selectedAppointment.appointment_code}</p>
            <p><strong>Doctor:</strong> {`${selectedAppointment.doctor_first_name || ""} ${selectedAppointment.doctor_last_name || ""}`.trim() || "-"}</p>
            <p><strong>Doctor Email:</strong> {selectedAppointment.doctor_email}</p>
            <p><strong>Doctor Phone:</strong> {selectedAppointment.doctor_phone}</p>
            <p><strong>Duration (mins):</strong> {selectedAppointment.duration_minutes}</p>
            <p><strong>Scheduled At:</strong> {formatDateTime(selectedAppointment.scheduled_at)}</p>
            <p><strong>Status:</strong> {selectedAppointment.status}</p>
            <p><strong>Reason:</strong> {selectedAppointment.reason}</p>
            <p><strong>Notes:</strong> {selectedAppointment.notes}</p>
          </div>
        </Modal>
      )}
    </div>
  );
}