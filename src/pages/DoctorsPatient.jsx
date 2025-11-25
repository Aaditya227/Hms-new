
// // my component
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { Users, Plus, Search, Edit2, Eye, Trash2 } from "../lib/icons";
// import { Button } from "../components/common/Button";
// import { DataTable } from "../components/common/DataTable";
// import { Modal } from "../components/common/Modal";
// import { PatientRegistrationForm } from "../components/forms/PatientRegistrationForm";

// const normalizePatientKeys = (p) => ({
//   ...p,
//   firstName: p.firstName || p.user?.firstName,
//   lastName: p.lastName || p.user?.lastName,
//   email: p.email || p.user?.email,
//   phone: p.phone || p.user?.phone,
//   address: p.address || p.user?.address,
//   gender: p.gender || p.user?.gender,
//   dateOfBirth: p.dateOfBirth || p.user?.dateOfBirth,
//   fatherName: p.fatherName,
//   bloodGroup: p.bloodGroup,
//   height: p.height,
//   weight: p.weight,
//   status: p.status,
//   upid: p.publicId || p.upid,
//   id: p.id,
// });

// export function Patients() {
//   const [patients, setPatients] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const [viewModalOpen, setViewModalOpen] = useState(false);

//   // ✅ Fetch all patients
//   useEffect(() => {
//     fetchPatients();
//   }, []);

//   const fetchPatients = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get("http://localhost:5000/api/patients");
//       const data = res.data.map((p) => normalizePatientKeys(p));
//       setPatients(data);
//     } catch (err) {
//       console.error("Error fetching patients:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateAge = (dob) => {
//     if (!dob) return "-";
//     const today = new Date();
//     const birth = new Date(dob);
//     let age = today.getFullYear() - birth.getFullYear();
//     const m = today.getMonth() - birth.getMonth();
//     if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
//     return age;
//   };

//   // ✅ Add / Update patient
//   const handleRegisterSuccess = async (formData) => {
//     try {
//       if (selectedPatient) {
//         // PUT (Update)
//         await axios.put(`http://localhost:5000/api/patients/${selectedPatient.id}`, formData);
//       } else {
//         // POST (Create)
//         await axios.post("http://localhost:5000/api/patients", formData);
//       }
//       await fetchPatients();
//       setIsModalOpen(false);
//       setSelectedPatient(null);
//     } catch (err) {
//       console.error("Error saving patient:", err);
//     }
//   };

//   // ✅ Delete patient
//   const handleDeletePatient = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this patient?")) return;

//     try {
//       await axios.delete(`http://localhost:5000/api/patients/${id}`);
//       setPatients((prev) => prev.filter((p) => p.id !== id));
//     } catch (err) {
//       console.error("Error deleting patient:", err);
//     }
//   };

//   const filteredPatients = patients.filter(
//     (p) =>
//       p.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       p.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       p.phone?.includes(searchQuery) ||
//       p.upid?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   if (loading)
//     return <p className="text-center py-8 text-gray-500">Loading patients...</p>;

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-wrap items-center justify-between gap-3 mt-10">
//         <div>
//           <h1 className="text-3xl font-display font-bold text-gray-900">Patients</h1>
//           <p className="text-gray-600 mt-1">Manage patient records and information</p>
//         </div>
//         <Button
//           icon={Plus}
//           onClick={() => {
//             setSelectedPatient(null);
//             setIsModalOpen(true);
//           }}
//         >
//           Register New Patient
//         </Button>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//         {[
//           { label: "Total Patients", value: patients.length, color: "blue" },
//           { label: "OPD Patients", value: patients.filter((p) => p.status === "OPD").length, color: "green" },
//           { label: "IPD Patients", value: patients.filter((p) => p.status === "IPD").length, color: "orange" },
//         ].map((stat, i) => (
//           <div
//             key={i}
//             className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-5 border border-gray-100"
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">{stat.label}</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
//               </div>
//               <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
//                 <Users className={`w-6 h-6 text-${stat.color}-600`} />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Search + Table */}
//       <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//         <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
//           <div className="w-full sm:w-1/2 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <input
//               type="text"
//               placeholder="Search by name, UPID, or phone..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//         </div>

//         {filteredPatients.length === 0 ? (
//           <p className="text-gray-500 text-center py-8">No patients found. Register a new one!</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <DataTable
//               data={filteredPatients}
//               columns={[
//                 { header: "UPID", accessor: "upid" },
//                 { header: "Name", accessor: (r) => `${r.firstName || ""} ${r.lastName || ""}` },
//                 { header: "Phone", accessor: "phone" },
//                 { header: "Age", accessor: (r) => calculateAge(r.dateOfBirth) },
//                 { header: "Gender", accessor: "gender" },
//                 {
//                   header: "Status",
//                   accessor: (r) => {
//                     let color = "bg-gray-100 text-gray-700";
//                     if (r.status === "OPD") color = "bg-green-100 text-green-700";
//                     else if (r.status === "IPD") color = "bg-orange-100 text-orange-700";
//                     return (
//                       <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
//                         {r.status}
//                       </span>
//                     );
//                   },
//                 },
//                 {
//                   header: "Actions",
//                   accessor: (r) => (
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => {
//                           setSelectedPatient(r);
//                           setViewModalOpen(true);
//                         }}
//                         className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                       >
//                         <Eye className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => {
//                           setSelectedPatient(r);
//                           setIsModalOpen(true);
//                         }}
//                         className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//                       >
//                         <Edit2 className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => handleDeletePatient(r.id)}
//                         className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   ),
//                 },
//               ]}
//             />
//           </div>
//         )}
//       </div>

//       {/* Register/Edit Modal */}
//       <Modal
//         isOpen={isModalOpen}
//         onClose={() => {
//           setIsModalOpen(false);
//           setSelectedPatient(null);
//         }}
//         title={selectedPatient ? "Edit Patient" : "Register New Patient"}
//       >
//         <PatientRegistrationForm
//           patient={selectedPatient ? normalizePatientKeys(selectedPatient) : null}
//           onSuccess={handleRegisterSuccess}
//         />
//       </Modal>

//       {/* View Modal */}
//       <Modal
//         isOpen={viewModalOpen}
//         onClose={() => {
//           setViewModalOpen(false);
//           setSelectedPatient(null);
//         }}
//         title="Patient Details"
//       >
//         {selectedPatient && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
//             <p><strong>UPID:</strong> {selectedPatient.upid}</p>
//             <p><strong>Name:</strong> {selectedPatient.firstName} {selectedPatient.lastName}</p>
//             <p><strong>Father’s Name:</strong> {selectedPatient.fatherName}</p>
//             <p><strong>DOB:</strong> {selectedPatient.dateOfBirth}</p>
//             <p><strong>Age:</strong> {calculateAge(selectedPatient.dateOfBirth)}</p>
//             <p><strong>Gender:</strong> {selectedPatient.gender}</p>
//             <p><strong>Phone:</strong> {selectedPatient.phone}</p>
//             <p><strong>Email:</strong> {selectedPatient.email || "—"}</p>
//             <p><strong>Address:</strong> {selectedPatient.address || "—"}</p>
//             <p><strong>Blood Group:</strong> {selectedPatient.bloodGroup}</p>
//             <p><strong>Height:</strong> {selectedPatient.height} cm</p>
//             <p><strong>Weight:</strong> {selectedPatient.weight} kg</p>
//             <p><strong>Treatment:</strong> {selectedPatient.currentTreatment}</p>
//             <p><strong>Allergies:</strong> {selectedPatient.allergies}</p>
//             <p><strong>History:</strong> {selectedPatient.medicalHistory}</p>
//             <p><strong>National ID:</strong> {selectedPatient.nationalId}</p>
//             <p><strong>Insurance:</strong> {selectedPatient.insuranceProvider}</p>
//             <p><strong>Policy No:</strong> {selectedPatient.policyNumber}</p>
//             <p><strong>Emergency Contact:</strong> {selectedPatient.emergencyName}</p>
//             <p><strong>Emergency Phone:</strong> {selectedPatient.emergencyPhone}</p>
//             <p><strong>Status:</strong> {selectedPatient.status}</p>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// }



// update

import { useState, useEffect } from "react";
import axios from "axios";
import { Users, Plus, Search, Edit2, Eye, Trash2 } from "../lib/icons";
import { Button } from "../components/common/Button";
import { DataTable } from "../components/common/DataTable";
import { Modal } from "../components/common/Modal";
import { PatientRegistrationForm } from "../components/forms/PatientRegistrationForm";
import base_url from "../utils/baseurl";

const normalizePatientKeys = (p) => ({
  ...p,
  firstName: p.firstName || p.user?.firstName,
  lastName: p.lastName || p.user?.lastName,
  email: p.email || p.user?.email,
  // password: p.password || p.user?.password,
  phone: p.phone || p.user?.phone,
  address: p.address || p.user?.address,
  gender: p.gender || p.user?.gender,
  dateOfBirth: p.dateOfBirth || p.user?.dateOfBirth,
  fatherName: p.fatherName,
  bloodGroup: p.bloodGroup,
  height: p.height,
  weight: p.weight,
  status: p.status,
  upid: p.publicId || p.upid,
  id: p.id,
});

export function DoctorsPatient() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // ✅ Fetch all patients
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${base_url}/patients`);
      const data = res.data.map((p) => normalizePatientKeys(p));
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

  // ✅ Add / Update patient
  const handleRegisterSuccess = async (formData) => {
    try {
      if (selectedPatient) {
        // PUT (Update)
        await axios.put(`${base_url}/patients/${selectedPatient.id}`, formData);
      } else {
        // POST (Create)
        await axios.post(`${base_url}/patients`, formData);
      }
      await fetchPatients();
      setIsModalOpen(false);
      setSelectedPatient(null);
    } catch (err) {
      console.error("Error saving patient:", err);
    }
  };

  // ✅ Delete patient
  const handleDeletePatient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;

    try {
      await axios.delete(`${base_url}/patients/${id}`);
      setPatients((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting patient:", err);
    }
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone?.includes(searchQuery) ||
      p.upid?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading)
    return <p className="text-center py-8 text-gray-500">Loading patients...</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-10">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600 mt-1">Manage patient records and information</p>
        </div>
        <Button
          icon={Plus}
          onClick={() => {
            setSelectedPatient(null);
            setIsModalOpen(true);
          }}
        >
          Register New Patient
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Total Patients", value: patients.length, color: "blue" },
          { label: "OPD Patients", value: patients.filter((p) => p.status === "OPD").length, color: "green" },
          { label: "IPD Patients", value: patients.filter((p) => p.status === "IPD").length, color: "orange" },
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
              placeholder="Search by name, UPID, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {filteredPatients.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No patients found. Register a new one!</p>
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              data={filteredPatients}
              columns={[
                // { header: "UPID", accessor: "upid" },
                { header: "Name", accessor: (r) => `${r.firstName || ""} ${r.lastName || ""}` },
                { header: "Phone", accessor: "phone" },
                { header: "Age", accessor: (r) => calculateAge(r.dateOfBirth) },
                { header: "Gender", accessor: "gender" },
                {
                  header: "Status",
                  accessor: (r) => {
                    let color = "bg-gray-100 text-gray-700";
                    if (r.status === "OPD") color = "bg-green-100 text-green-700";
                    else if (r.status === "IPD") color = "bg-orange-100 text-orange-700";
                    return (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
                        {r.status}
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
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPatient(r);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePatient(r.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}
      </div>

      {/* Register/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPatient(null);
        }}
        title={selectedPatient ? "Edit Patient" : "Register New Patient"}
      >
        <PatientRegistrationForm
          patient={selectedPatient ? normalizePatientKeys(selectedPatient) : null}
          onSuccess={handleRegisterSuccess}
        />
      </Modal>

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
            <p><strong>UPID:</strong> {selectedPatient.upid}</p>
            <p><strong>Name:</strong> {selectedPatient.firstName} {selectedPatient.lastName}</p>
            <p><strong>Father’s Name:</strong> {selectedPatient.fatherName}</p>
            <p><strong>DOB:</strong> {selectedPatient.dateOfBirth}</p>
            <p><strong>Age:</strong> {calculateAge(selectedPatient.dateOfBirth)}</p>
            <p><strong>Gender:</strong> {selectedPatient.gender}</p>
            <p><strong>Phone:</strong> {selectedPatient.phone}</p>
            <p><strong>Email:</strong> {selectedPatient.email || "—"}</p>
            <p><strong>Address:</strong> {selectedPatient.address || "—"}</p>
            <p><strong>Blood Group:</strong> {selectedPatient.bloodGroup}</p>
            <p><strong>Height:</strong> {selectedPatient.height} cm</p>
            <p><strong>Weight:</strong> {selectedPatient.weight} kg</p>
            <p><strong>Treatment:</strong> {selectedPatient.currentTreatment}</p>
            <p><strong>Allergies:</strong> {selectedPatient.allergies}</p>
            <p><strong>History:</strong> {selectedPatient.medicalHistory}</p>
            <p><strong>National ID:</strong> {selectedPatient.nationalId}</p>
            <p><strong>Insurance:</strong> {selectedPatient.insuranceProvider}</p>
            <p><strong>Policy No:</strong> {selectedPatient.policyNumber}</p>
            <p><strong>Emergency Contact:</strong> {selectedPatient.emergencyName}</p>
            <p><strong>Emergency Phone:</strong> {selectedPatient.emergencyPhone}</p>
            <p><strong>Status:</strong> {selectedPatient.status}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}