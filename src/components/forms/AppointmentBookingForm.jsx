import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../common/Button";
import base_url from "../../utils/baseurl";

export function AppointmentBookingForm({ onSuccess, initialData, isEdit }) {
  const [formData, setFormData] = useState(
    initialData || {
      appointmentNumber: "",
      patient_id: "",
      doctor_id: "",
      scheduled_at: "",
      duration_minutes: 30,
      status: "scheduled",
      reason: "",
      notes: "",
      created_by: 5, // Default user ID
    }
  );

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get(`${base_url}/patients`);
        console.log("Patients data:", res.data); // Debug log
        setPatients(res.data.data || res.data || []);
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };
    fetchPatients();
  }, []);

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`${base_url}/doctors`);
        console.log("Doctors data:", res.data); // Debug log
        // Handle different response structures
        const doctorsData = res.data.doctors || res.data.data || res.data || [];
        setDoctors(doctorsData);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Format date for datetime-local input
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Format as YYYY-MM-DDTHH:MM
    return date.toISOString().slice(0, 16);
  };

  // Format date for API
  const formatDateForAPI = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Format as YYYY-MM-DD HH:MM:SS
    return date.toISOString().slice(0, 19).replace("T", " ");
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    if (!formData.patient_id || !formData.doctor_id || !formData.scheduled_at) {
      alert("Patient, Doctor, and Scheduled At are required fields");
      setLoading(false);
      return;
    }

    // Prepare payload matching API requirements
    const payload = {
      patient_id: Number(formData.patient_id),
      doctor_id: Number(formData.doctor_id),
      status: formData.status || "scheduled",
      scheduled_at: formatDateForAPI(formData.scheduled_at),
      duration_minutes: Number(formData.duration_minutes || 30),
      reason: formData.reason || "General checkup",
      notes: formData.notes || "",
      created_by: Number(formData.created_by || 5),
    };

    // Only include appointmentNumber if it exists and we're editing
    if (isEdit && formData.appointmentNumber) {
      payload.appointmentNumber = formData.appointmentNumber;
    }

    console.log("Submitting payload:", payload); // Debug log

    try {
      await onSuccess(payload);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Error: ${error.response?.data?.message || "Failed to submit appointment"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-4 bg-white rounded-lg shadow">
      {/* appointment number - only show in edit mode */}
      {isEdit && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Number</label>
          <input
            type="text"
            name="appointmentNumber"
            value={formData.appointmentNumber}
            onChange={handleChange}
            placeholder="Appointment Number (A-101)"
            className="w-full border rounded-md p-2"
            readOnly
          />
        </div>
      )}

      {/* Patient */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
        <select
          name="patient_id"
          value={formData.patient_id}
          onChange={handleChange}
          required
          className="w-full border rounded-md p-2"
        >
          <option value="">Select Patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.first_name} {p.last_name}
            </option>
          ))}
        </select>
      </div>

      {/* Doctor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Doctor *</label>
        <select
          name="doctor_id"
          value={formData.doctor_id}
          onChange={handleChange}
          required
          className="w-full border rounded-md p-2"
        >
          <option value="">Select Doctor</option>
          {doctors.map((d) => (
<<<<<<< HEAD
           <option key={d.id} value={d.id}>
          {d.fullName} ({d.department})
        </option>

=======
            <option key={d.id} value={d.doctor_id}>
              {d.first_name} {d.last_name} ({d.department_name || d.department})
            </option>
>>>>>>> 43fcfc8163b000b0d7f254ea9c207a39a528ed24
          ))}
        </select>
      </div>

      {/* Scheduled At */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled At *</label>
        <input
          type="datetime-local"
          name="scheduled_at"
          value={formatDateForInput(formData.scheduled_at)}
          onChange={handleChange}
          required
          className="w-full border rounded-md p-2"
        />
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
        <input
          type="number"
          name="duration_minutes"
          value={formData.duration_minutes}
          onChange={handleChange}
          min="10"
          max="120"
          className="w-full border rounded-md p-2"
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border rounded-md p-2"
        >
          {["scheduled", "confirmed", "rescheduled", "completed", "cancelled"].map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Reason */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
        <input
          type="text"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          placeholder="Reason for appointment"
          className="w-full border rounded-md p-2"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full border rounded-md p-2"
          rows="3"
        />
      </div>

      {/* Created By - only show in create mode */}
      {!isEdit && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Created By (User ID)</label>
          <input
            type="number"
            name="created_by"
            value={formData.created_by}
            onChange={handleChange}
            min="1"
            className="w-full border rounded-md p-2"
          />
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full bg-blue-600 text-white"
        disabled={loading}
      >
        {loading ? "Processing..." : (isEdit ? "Update Appointment" : "Book Appointment")}
      </Button>
    </form>
  );
}