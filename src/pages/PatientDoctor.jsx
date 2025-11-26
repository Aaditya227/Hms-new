import { useState, useEffect } from "react";
import axios from "axios";
import { Users, Eye } from "../lib/icons";
import { Button } from "../components/common/Button";
import base_url from "../utils/baseurl";
import { Modal } from "../components/common/Modal";
import { PatientRegistrationForm } from "../components/forms/PatientRegistrationForm";

// Utility to normalize patient data
const normalizePatientKeys = (p) => ({
  ...p,
  firstName: p.first_name || p.firstName,
  lastName: p.last_name || p.lastName,
  email: p.email,
  phone: p.phone,
  address: p.address,
  gender: p.gender,
  dateOfBirth: p.dob || p.dateOfBirth,
  fatherName: p.father_name || p.fatherName,
  bloodGroup: p.blood_group || p.bloodGroup,
  height: p.height_cm,
  weight: p.weight_kg,
  status: p.status,
  upid: p.public_id || p.upid,
  id: p.id,
});

export function PatientDoctor() {
  const [patient, setPatient] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);

  const getPatientId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.id;
    } catch (e) {
      console.error("Failed to parse user from localStorage");
      return null;
    }
  };

  const fetchPatientAndDoctors = async () => {
    const patientId = getPatientId();
    if (!patientId) {
      console.error("No patient ID found in localStorage");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const patientRes = await axios.get(`${base_url}/patients/${patientId}`);
      const normalizedPatient = normalizePatientKeys(patientRes.data.data || patientRes.data);
      setPatient(normalizedPatient);

      const doctorsRes = await axios.get(`${base_url}/doctors/doctorsbypatient/${patientId}`);
      setDoctors(doctorsRes.data.data || []);
    } catch (err) {
      console.error("Error fetching patient or doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientAndDoctors();
  }, []);

  const calculateAge = (dob) => {
    if (!dob) return "-";
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const handleRegisterSuccess = async (formData) => {
    try {
      const patientId = getPatientId();
      await axios.put(`${base_url}/patients/${patientId}`, formData);
      await fetchPatientAndDoctors();
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Error updating patient:", err);
      alert("Failed to update profile.");
    }
  };

  const handleViewDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setIsDoctorModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading your profile...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Patient profile not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">View and manage your personal information</p>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">
              {patient.firstName} {patient.lastName}
            </h2>
            <p className="text-gray-600">UPID: {patient.upid || "—"}</p>
            <p className="text-gray-500 mt-1">
              Age: {calculateAge(patient.dateOfBirth)} • {patient.gender}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              icon={Eye}
              variant="outline"
              onClick={() => setIsViewModalOpen(true)}
            >
              View Details
            </Button>
            <Button
              icon={Eye}
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Doctors Section — TABLE */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold">My Doctors ({doctors.length})</h2>
        </div>

        {doctors.length === 0 ? (
          <p className="text-gray-500">No doctors assigned yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {doctors.map((doc) => (
                  <tr key={doc.doctor_id}>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                      Dr. {doc.first_name} {doc.last_name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700">{doc.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700">{doc.phone}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Button
                        icon={Eye}
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDoctor(doc)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit My Profile"
      >
        <PatientRegistrationForm
          patient={patient}
          onSuccess={handleRegisterSuccess}
          isEditingSelf={true}
        />
      </Modal>

      {/* Patient View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="My Details"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
          <p><strong>UPID:</strong> {patient.upid || "—"}</p>
          <p><strong>Name:</strong> {patient.firstName} {patient.lastName}</p>
          <p><strong>Father’s Name:</strong> {patient.fatherName || "—"}</p>
          <p><strong>DOB:</strong> {patient.dateOfBirth || "—"}</p>
          <p><strong>Age:</strong> {calculateAge(patient.dateOfBirth)}</p>
          <p><strong>Gender:</strong> {patient.gender || "—"}</p>
          <p><strong>Phone:</strong> {patient.phone || "—"}</p>
          <p><strong>Email:</strong> {patient.email || "—"}</p>
          <p><strong>Address:</strong> {patient.address || "—"}</p>
          <p><strong>Blood Group:</strong> {patient.bloodGroup || "—"}</p>
          <p><strong>Height:</strong> {patient.height ? `${patient.height} cm` : "—"}</p>
          <p><strong>Weight:</strong> {patient.weight ? `${patient.weight} kg` : "—"}</p>
          <p><strong>Allergies:</strong> {patient.allergies || "None"}</p>
          <p><strong>Medical History:</strong> {patient.medical_history || "—"}</p>
          <p><strong>Current Treatment:</strong> {patient.current_treatment || "—"}</p>
          <p><strong>Insurance:</strong> {patient.insurance_provider || "—"}</p>
          <p><strong>Policy No:</strong> {patient.insurance_number || "—"}</p>
          <p><strong>Emergency Contact:</strong> {patient.emergency_contact_name || "—"}</p>
          <p><strong>Emergency Phone:</strong> {patient.emergency_contact_phone || "—"}</p>
          <p><strong>Status:</strong> {patient.status || "—"}</p>
        </div>
      </Modal>

      {/* Doctor View Modal */}
      <Modal
        isOpen={isDoctorModalOpen}
        onClose={() => {
          setIsDoctorModalOpen(false);
          setSelectedDoctor(null);
        }}
        title="Doctor Details"
      >
        {selectedDoctor && (
          <div className="space-y-3 text-sm text-gray-800">
            <p><strong>Name:</strong> Dr. {selectedDoctor.first_name} {selectedDoctor.last_name}</p>
            <p><strong>Email:</strong> {selectedDoctor.email}</p>
            <p><strong>Phone:</strong> {selectedDoctor.phone}</p>
            <p><strong>Doctor ID:</strong> {selectedDoctor.doctor_id}</p>
            <p><strong>Joined:</strong> {selectedDoctor.created_at ? new Date(selectedDoctor.created_at).toLocaleDateString() : "—"}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}