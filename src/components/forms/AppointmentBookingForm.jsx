




import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../common/Button";
import base_url from "../../utils/baseurl";

export function AppointmentBookingForm({ onSuccess, initialData, isEdit }) {
  const [formData, setFormData] = useState(
    initialData || {
      appointmentNumber: "",
      patientId: "",
      doctorId: "",
      // departmentId: "",
      scheduledAt: "",
      durationMins: 30,
      status: "",
      reason: "",
      notes: "",
    }
  );

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  // const [departments, setDepartments] = useState([]);

  // ✅ Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get(`${base_url}/patients`);
        setPatients(res.data || []);
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };
    fetchPatients();
  }, []);

  // ✅ Fetch doctors (can be from API later)
  useEffect(() => {
    // Currently static, can replace with API later
     const fetchDoctors = async () => {
      try {
        const res = await axios.get(`${base_url}/doctors`);
        setDoctors(res.data || []);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

 



  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare payload
    const payload = {
      appointmentNumber:String(formData.appointmentNumber) || "A-101",
      patientId: Number(formData.patientId),
      doctorId:  Number(formData.doctorId),
      
      scheduledAt: new Date(formData.scheduledAt).toISOString(),
      durationMins: Number(formData.durationMins || 30),
      status: formData.status || "",
      reason: formData.reason || "Regular Checkup",
      notes: formData.notes || "",
      createdById: 1, // Admin user ID
    };

    try {
      await onSuccess(payload);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-4 bg-white rounded-lg shadow">
  {/* appointment number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Number </label>
        <input
          type="text"
          name="appointmentNumber"
          value={formData.appointmentNumber}
          onChange={handleChange}
          placeholder="Appointment Number (A-101)"
          className="w-full border rounded-md p-2"
        />
      </div>


      {/* Patient */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
        <select
          name="patientId"
          value={formData.patientId}
          onChange={handleChange}
          required
          className="w-full border rounded-md p-2"
        >
          <option value="">Select Patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.user?.firstName} {p.user?.lastName} 
            </option>
          ))}
        </select>
      </div>

      {/* Doctor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
        <select
          name="doctorId"
          value={formData.doctorId}
          onChange={handleChange}
          className="w-full border rounded-md p-2"
        >
          <option value="">Select Doctor</option>
          {doctors.map((d) => (
           <option key={d.id} value={d.id}>
          {d.fullName} ({d.department})
        </option>

          ))}
        </select>
      </div>


     

      {/* Scheduled At */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled At</label>
        <input
          type="datetime-local"
          name="scheduledAt"
          value={formData.scheduledAt}
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
          name="durationMins"
          value={formData.durationMins}
          onChange={handleChange}
          min="10"
          max="120"
          className="w-full border rounded-md p-2"
        />
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
          {["Select Type","SCHEDULED", "CONFIRMED", "RESCHEDULED", "COMPLETED"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" className="w-full bg-blue-600 text-white">
        {isEdit ? "Update Appointment" : "Book Appointment"}
      </Button>
    </form>
  );
}
