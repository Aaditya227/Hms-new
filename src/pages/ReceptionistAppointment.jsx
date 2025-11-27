// UPDATED – GET API ONLY + VIEW ONLY

import React, { useState, useEffect } from "react";
import axios from "axios";
import base_url from "../utils/baseurl";
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  Eye,
} from "../lib/icons";
import { Button } from "../components/common/Button";
import { DataTable } from "../components/common/DataTable";
import { Modal } from "../components/common/Modal";

export default function ReceptionistAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Fetch all data (GET only)
  const fetchAllData = async () => {
    try {
      const [appRes, patRes, docRes, deptRes] = await Promise.all([
        axios.get(`${base_url}/appointments`),
        axios.get(`${base_url}/patients`),
        axios.get(`${base_url}/doctors`),
        axios.get(`${base_url}/departments`),
      ]);

      setAppointments(appRes.data.data || appRes.data || []);
      setPatients(patRes.data.data || patRes.data || []);
      const doctorsData =
        docRes.data.doctors || docRes.data.data || docRes.data || [];
      setDoctors(doctorsData);
      setDepartments(deptRes.data.data || deptRes.data || []);
    } catch (error) {
      console.error("❌ Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Status styling
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

  // Helpers
  const getPatientName = (id) => {
    const p = patients.find((x) => x.id === id);
    return p ? `${p.first_name} ${p.last_name}` : "-";
  };

  const getDoctorName = (id) => {
    const d = doctors.find((x) => x.doctor_id === id);
    return d ? `${d.first_name} ${d.last_name}` : "-";
  };

  const getDepartmentName = (doctorId) => {
    const doc = doctors.find((x) => x.id === doctorId);
    return doc?.department_name || doc?.department || "-";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-10">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-gray-600">
            View all scheduled patient appointments
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total",
            value: appointments.length,
            icon: Calendar,
            colorClass: "bg-blue-100 text-blue-600",
          },
          {
            label: "Scheduled",
            value: appointments.filter((a) => a.status === "scheduled").length,
            icon: Clock,
            colorClass: "bg-yellow-100 text-yellow-600",
          },
          {
            label: "In Consultation",
            value: appointments.filter((a) => a.status === "in_consultation")
              .length,
            icon: User,
            colorClass: "bg-purple-100 text-purple-600",
          },
          {
            label: "Completed",
            value: appointments.filter((a) => a.status === "completed").length,
            icon: CheckCircle,
            colorClass: "bg-green-100 text-green-600",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow p-5 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
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
        {["ALL", "scheduled", "confirmed", "rescheduled", "completed", "cancelled"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                filterStatus === status
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          )
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <DataTable
          data={appointments.filter(
            (a) => filterStatus === "ALL" || a.status === filterStatus
          )}
          columns={[
            { header: "Appt No", accessor: "appointment_code" },
            {
              header: "Patient",
              accessor: (row) => getPatientName(row.patient_id),
            },
            {
              header: "Doctor",
              accessor: (row) => getDoctorName(row.doctor_id),
            },
            {
              header: "Scheduled At",
              accessor: (row) => formatDate(row.scheduled_at),
            },
            {
              header: "Status",
              accessor: (row) => (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    row.status
                  )}`}
                >
                  {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                </span>
              ),
            },
            {
              header: "Actions",
              accessor: (row) => (
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setSelectedAppointment(row)}
                    className="text-indigo-600"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* View Appointment Modal */}
      {selectedAppointment && (
        <Modal
          isOpen={!!selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          title="Appointment Details"
        >
          <div className="space-y-3 text-sm">
            <p><strong>ID:</strong> {selectedAppointment.id}</p>
            <p>
              <strong>Appointment No:</strong>{" "}
              {selectedAppointment.appointment_code}
            </p>
            <p>
              <strong>Patient:</strong>{" "}
              {getPatientName(selectedAppointment.patient_id)}
            </p>
            <p>
              <strong>Doctor:</strong>{" "}
              {getDoctorName(selectedAppointment.doctor_id)}
            </p>
            {/* <p>
              <strong>Department:</strong>{" "}
              {getDepartmentName(selectedAppointment.doctor_id)}
            </p> */}
            <p>
              <strong>Duration (mins):</strong>{" "}
              {selectedAppointment.duration_minutes}
            </p>
            <p>
              <strong>Scheduled At:</strong>{" "}
              {formatDate(selectedAppointment.scheduled_at)}
            </p>
            <p>
              <strong>Status:</strong> {selectedAppointment.status}
            </p>
            <p>
              <strong>Reason:</strong> {selectedAppointment.reason}
            </p>
            <p>
              <strong>Notes:</strong> {selectedAppointment.notes}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
