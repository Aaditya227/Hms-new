

// update

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

export default function DoctorsAppointments() {
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

      setAppointments(appRes.data || []);
      setPatients(patRes.data || []);
      setDoctors(docRes.data || []);
      setDepartments(deptRes.data || []);

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
      const res = await axios.post(`${base_url}/appointments`, formData);
      setAppointments((prev) => [...prev, res.data.data]);
      setIsModalOpen(false);
      alert("✅ Appointment booked successfully!");
      fetchAllData();
    } catch (error) {
      console.error("❌ Error creating appointment:", error.response?.data || error);
      alert("❌ Failed to create appointment.");
    }
  };

  // Edit
  const handleEditSuccess = async (updatedData) => {
    try {
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
      alert("❌ Failed to update appointment.");
    }
  };

  // Cancel
  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await axios.delete(`${base_url}/appointments/${id}`);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      alert("🗑️ Appointment cancelled!");
    } catch (error) {
      console.error("❌ Error cancelling:", error);
      alert("❌ Failed to cancel.");
    }
  };

  // Helpers
  const getPatientName = (id) => {
    const p = patients.find((x) => x.id === id);
    return p ? `${p.user?.firstName} ${p.user?.lastName}` : "-";
  };

  const getDoctorName = (id) => {
    const d = doctors.find((x) => x.id === id);
    return d ? d.fullName : "-";
  };

  // FIXED: Correct department name
  const getDepartmentName = (doctorId) => {
    const doc = doctors.find((x) => x.id === doctorId);
    return doc?.department || "-";
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

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          "ALL",
          "SCHEDULED",
          "CONFIRMED",
          "RESCHEDULED",
          "COMPLETED",
          "CANCELLED",
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
          data={appointments.filter(
            (a) => filterStatus === "ALL" || a.status === filterStatus
          )}
          columns={[
            { header: "Appt No", accessor: "appointmentNumber" },
            { header: "Patient", accessor: (row) => getPatientName(row.patientId) },
            { header: "Doctor", accessor: (row) => getDoctorName(row.doctorId) },
            { header: "Department", accessor: (row) => getDepartmentName(row.doctorId) },
            { header: "Scheduled At", accessor: "scheduledAt" },
            {
              header: "Status",
              accessor: (row) => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
                  {row.status.replace("_", " ")}
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
                  {row.status !== "COMPLETED" &&
                    row.status !== "CANCELLED" && (
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
            <p><strong>Patient:</strong> {getPatientName(selectedAppointment.patientId)}</p>
            <p><strong>Doctor:</strong> {getDoctorName(selectedAppointment.doctorId)}</p>
            <p><strong>Department:</strong> {getDepartmentName(selectedAppointment.doctorId)}</p>
            <p><strong>Duration (mins):</strong> {selectedAppointment.durationMins}</p>
            <p><strong>Scheduled At:</strong> {selectedAppointment.scheduledAt}</p>
            <p><strong>Status:</strong> {selectedAppointment.status}</p>
            <p><strong>Reason:</strong> {selectedAppointment.reason}</p>
            <p><strong>Notes:</strong> {selectedAppointment.notes}</p>
          </div>
        </Modal>
      )}
    </div>
  );
}