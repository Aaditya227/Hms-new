



import React, { useState, useEffect } from "react";
import { Button } from "../common/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import base_url from "../../utils/baseurl";
const calculateAge = (dob) => {
  if (!dob) return "";
  
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // Month is 0-indexed
  const currentDay = today.getDate();

  const [birthYear, birthMonth, birthDay] = dob.split('-').map(Number);
  
  let age = currentYear - birthYear;
  
  // Adjust age if the birthday hasn't occurred this year
  if (
    currentMonth < birthMonth || 
    (currentMonth === birthMonth && currentDay < birthDay)
  ) {
    age--;
  }

  return age >= 0 ? age : ""; // Return empty string for future dates or invalid DOB
};



export const createPatient = async (data) => {
  const response = await axios.post(`${base_url}/patients`, data);
  return response.data;
};


export const updatePatient = async (id, data) => {
  const response = await axios.put(`${base_url}/patients/${id}`, data);
  return response.data;
};
export function PatientRegistrationForm({ patient, onSuccess, onCancel }) {
    const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("basic"); 

  const [formData, setFormData] = useState({
    // Basic Info
    firstName: patient?.firstName || "",
    lastName: patient?.lastName || "",
    dateOfBirth: patient?.dateOfBirth || "",
    gender: patient?.gender || "MALE",
    phone: patient?.phone || "",
    email: patient?.email || "",
    address: patient?.address || "",
    // Initialize age using the calculation if DOB is present
    age: patient?.dateOfBirth ? calculateAge(patient.dateOfBirth) : (patient?.age || ""),
    nationalId: patient?.nationalId || "",
    fatherName: patient?.fatherName || "", // ✅ Father's Name
    status:patient?.status || "",

    // Medical Info
    height: patient?.height || "",
    weight: patient?.weight || "",
    bloodGroup: patient?.bloodGroup || "",
    allergies: patient?.allergies || "",
    currentTreatment: patient?.currentTreatment || "",
    medicalHistory: patient?.medicalHistory || "",

    // Insurance & Emergency
    insuranceProvider: patient?.insuranceProvider || "",
    insurancePolicyNumber: patient?.insurancePolicyNumber || "",
    emergencyContactName: patient?.emergencyContactName || "",
    emergencyContactPhone: patient?.emergencyContactPhone || "",
  });

  // 💡 Effect to automatically calculate and update age when DOB changes
  useEffect(() => {
    if (formData.dateOfBirth) {
      const newAge = calculateAge(formData.dateOfBirth);
      setFormData(prev => ({
        ...prev,
        age: newAge,
      }));
    } else if (formData.age !== "") {
      // Clear age if DOB is cleared, but only if it was automatically calculated (optional)
      setFormData(prev => ({ ...prev, age: "" }));
    }
  }, [formData.dateOfBirth]);


  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };


 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const payload = {
      user: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: "123456", // 🔹 temporary default (you can add password field in form later)
        phone: formData.phone,
        address: formData.address,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
      },
      fatherName: formData.fatherName,
      nationalId: formData.nationalId,
      bloodGroup: formData.bloodGroup,
      allergies: formData.allergies,
      medicalHistory: formData.medicalHistory,
      currentTreatment: formData.currentTreatment,
    //   height: formData.height,
    //   weight: formData.weight,
    height: formData.height ? Number(formData.height) : null,
weight: formData.weight ? Number(formData.weight) : null,

      emergencyName: formData.emergencyContactName,
      emergencyPhone: formData.emergencyContactPhone,
      insuranceProvider: formData.insuranceProvider,
      policyNumber: formData.insurancePolicyNumber,
      insuranceInfo: "N/A", // optional
      status: formData.status || "OPD",
    };

    const result = patient
      ? await updatePatient(patient.id, payload)
      : await createPatient(payload);

    if (onSuccess) {onSuccess(result)
         navigate("/patients");
    }
    //  navigate("/patients");
        
  } catch (err) {
    setError(err.response?.data?.message || err.message || "Failed to save patient");
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-500 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Tabs (No Change) */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            type="button"
            onClick={() => setActiveTab("basic")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "basic"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Basic Information
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("medical")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "medical"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Medical Information
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("insurance")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "insurance"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Insurance & Emergency
          </button>
        </nav>
      </div>

      {/* Basic Information */}
      {activeTab === "basic" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Father's Name (No Change) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Father's Name
            </label>
            <input
              type="text"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]} // Prevents selecting future dates
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Age - NOW READ-ONLY and AUTO-CALCULATED */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age (Auto-Calculated)
            </label>
            <input
              type="text" // Changed to text as it's read-only
              name="age"
              value={formData.age}
              readOnly // 🛑 Made read-only
              placeholder="Calculated from DOB"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-500 focus:outline-none"
            />
          </div>

          {/* Gender (No Change) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Phone (No Change) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Email (No Change) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* National ID (No Change) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              National ID
            </label>
            <input
              type="text"
              name="nationalId"
              value={formData.nationalId}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

{/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Status</option>
              <option value="OPD">OPD</option>
              <option value="IPD">IPD</option>
              <option value="EMERGENCY">EMERGENCY</option>
              <option value="DISCHARGE">DISCHARGE</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          {/* Address (No Change) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}



      {/* Medical Info (No Change) */}
      {activeTab === "medical" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Height */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Blood Group */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blood Group
            </label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Blood Group</option>
              <option value="A_POSITIVE">A+</option>
              <option value="A_NEGATIVE">A-</option>
              <option value="B_POSITIVE">B+</option>
              <option value="B_NEGATIVE">B-</option>
              <option value="AB_POSITIVE">AB+</option>
              <option value="AB_NEGATIVE">AB-</option>
              <option value="O_POSITIVE">O+</option>
              <option value="O_NEGATIVE">O-</option>
            </select>
          </div>

          {/* Current Treatment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Treatment
            </label>
            <input
              type="text"
              name="currentTreatment"
              value={formData.currentTreatment}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Allergies */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Allergies
            </label>
            <textarea
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              rows="2"
              placeholder="List any known allergies..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Medical History */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medical History
            </label>
            <textarea
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              rows="4"
              placeholder="Enter medical history, past conditions, surgeries, etc..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Insurance (No Change) */}
      {activeTab === "insurance" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Insurance Provider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Insurance Provider
            </label>
            <input
              type="text"
              name="insuranceProvider"
              value={formData.insuranceProvider}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Policy Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Policy Number
            </label>
            <input
              type="text"
              name="insurancePolicyNumber"
              value={formData.insurancePolicyNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Emergency Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emergency Contact Name
            </label>
            <input
              type="text"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Emergency Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emergency Contact Phone
            </label>
            <input
              type="tel"
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Actions (No Change) */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : patient
            ? "Update Patient"
            : "Register Patient"}
        </Button>
      </div>
    </form>
  );
}




