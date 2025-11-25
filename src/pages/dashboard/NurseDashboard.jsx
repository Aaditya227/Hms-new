// import { useState, useEffect } from "react";
// import {
//   Activity,
//   Users,
//   Pill,
//   FileText,
//   AlertCircle,
//   Thermometer,
//   Calendar,
//   Clock,
//   CheckCircle,
// } from "../../lib/icons";
// import { StatsCard } from "../../components/common/StatsCard";
// import { Button } from "../../components/common/Button";
// import { DataTable } from "../../components/common/DataTable";
// import { Modal } from "../../components/common/Modal";
// import { patientsApi } from "../../services/api/patients";
// import { appointmentsApi } from "../../services/api/appointments";
// import { prescriptionsApi } from "../../services/api/prescriptions";

// export function NurseDashboard() {
//   const [patients, setPatients] = useState([]);
//   const [appointments, setAppointments] = useState([]);
//   const [prescriptions, setPrescriptions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [patientsModalOpen, setPatientsModalOpen] = useState(false);
//   const [loadingPatients, setLoadingPatients] = useState(false);

//   const [vitalsModalOpen, setVitalsModalOpen] = useState(false);
//   const [selectedPatient, setSelectedPatient] = useState(null);

//   const [medicationModalOpen, setMedicationModalOpen] = useState(false);
//   const [loadingMedications, setLoadingMedications] = useState(false);

//   const [appointmentsModalOpen, setAppointmentsModalOpen] = useState(false);
//   const [loadingAppointments, setLoadingAppointments] = useState(false);

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       const [patientsData, appointmentsData, prescriptionsData] =
//         await Promise.all([
//           patientsApi.getAll(),
//           appointmentsApi.getToday(),
//           prescriptionsApi.getAll(),
//         ]);
//       setPatients(patientsData || []);
//       setAppointments(appointmentsData || []);
//       setPrescriptions(prescriptionsData || []);
//     } catch (error) {
//       console.error("Error loading data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewPatients = async () => {
//     setPatientsModalOpen(true);
//     setLoadingPatients(true);
//     try {
//       const data = await patientsApi.getAll();
//       setPatients(data || []);
//     } catch (error) {
//       console.error("Error loading patients:", error);
//     } finally {
//       setLoadingPatients(false);
//     }
//   };

//   const handleRecordVitals = (patient) => {
//     setSelectedPatient(patient);
//     setVitalsModalOpen(true);
//   };

//   const handleViewMedications = async () => {
//     setMedicationModalOpen(true);
//     setLoadingMedications(true);
//     try {
//       const data = await prescriptionsApi.getAll();
//       setPrescriptions(data.filter((p) => p.status === "PENDING") || []);
//     } catch (error) {
//       console.error("Error loading medications:", error);
//     } finally {
//       setLoadingMedications(false);
//     }
//   };

//   const handleViewAppointments = async () => {
//     setAppointmentsModalOpen(true);
//     setLoadingAppointments(true);
//     try {
//       const data = await appointmentsApi.getToday();
//       setAppointments(data || []);
//     } catch (error) {
//       console.error("Error loading appointments:", error);
//     } finally {
//       setLoadingAppointments(false);
//     }
//   };

//   const handleCheckInPatient = async (id) => {
//     try {
//       await appointmentsApi.updateStatus(id, "CHECKED_IN");
//       handleViewAppointments();
//     } catch (error) {
//       console.error("Error checking in patient:", error);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "OPD":
//         return "bg-green-100 text-green-700";
//       case "IPD":
//         return "bg-orange-100 text-orange-700";
//       case "EMERGENCY":
//         return "bg-red-100 text-red-700";
//       case "SCHEDULED":
//         return "bg-blue-100 text-blue-700";
//       case "CHECKED_IN":
//         return "bg-yellow-100 text-yellow-700";
//       case "IN_CONSULTATION":
//         return "bg-purple-100 text-purple-700";
//       case "COMPLETED":
//         return "bg-green-100 text-green-700";
//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   const ipdPatients = patients.filter(
//     (p) => p.status === "IPD" || p.status === "EMERGENCY"
//   );
//   const opdPatients = patients.filter((p) => p.status === "OPD");
//   const pendingMeds = prescriptions.filter(
//     (p) => p.status === "PENDING"
//   ).length;
//   const criticalPatients = patients.filter(
//     (p) => p.status === "EMERGENCY"
//   ).length;

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-display font-bold text-gray-900">
//             Nurse Station
//           </h1>
//           <p className="text-gray-600 mt-1">Patient care and monitoring</p>
//         </div>
//         <div className="flex gap-3">
//           <Button
//             variant="outline"
//             icon={Thermometer}
//             onClick={() => handleViewPatients()}
//           >
//             Record Vitals
//           </Button>
//           <Button variant="primary" icon={Pill} onClick={handleViewMedications}>
//             Medications
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatsCard
//           title="IPD Patients"
//           value={ipdPatients.length.toString()}
//           icon={Users}
//           color="blue"
//         />
//         <StatsCard
//           title="Medications Due"
//           value={pendingMeds.toString()}
//           icon={Pill}
//           color="yellow"
//         />
//         <StatsCard
//           title="OPD Patients"
//           value={opdPatients.length.toString()}
//           icon={Activity}
//           color="green"
//         />
//         <StatsCard
//           title="Critical Alerts"
//           value={criticalPatients.toString()}
//           icon={AlertCircle}
//           color="red"
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2">
//           <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">
//               IPD Patients
//             </h2>
//             {loading ? (
//               <div className="text-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//               </div>
//             ) : (
//               <DataTable
//                 data={ipdPatients}
//                 columns={[
//                   { header: "UPID", accessor: "upid" },
//                   {
//                     header: "Name",
//                     accessor: (row) => `${row.first_name} ${row.last_name}`,
//                   },
//                   { header: "Phone", accessor: "phone" },
//                   {
//                     header: "Status",
//                     accessor: (row) => (
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
//                           row.status
//                         )}`}
//                       >
//                         {row.status}
//                       </span>
//                     ),
//                   },
//                   {
//                     header: "Actions",
//                     accessor: (row) => (
//                       <button
//                         onClick={() => handleRecordVitals(row)}
//                         className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                       >
//                         Record Vitals
//                       </button>
//                     ),
//                   },
//                 ]}
//               />
//             )}
//           </div>
//         </div>

//         <div className="space-y-6">
//           <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//             <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
//             <div className="space-y-2">
//               <Button
//                 variant="outline"
//                 className="w-full justify-start"
//                 onClick={handleViewPatients}
//               >
//                 <Users className="w-4 h-4 mr-2" />
//                 View All Patients
//               </Button>
//               <Button
//                 variant="outline"
//                 className="w-full justify-start"
//                 onClick={handleViewAppointments}
//               >
//                 <Calendar className="w-4 h-4 mr-2" />
//                 Today's Appointments
//               </Button>
//               <Button
//                 variant="outline"
//                 className="w-full justify-start"
//                 onClick={handleViewMedications}
//               >
//                 <Pill className="w-4 h-4 mr-2" />
//                 Medication Schedule
//               </Button>
//             </div>
//           </div>

//           <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//             <h3 className="font-bold text-gray-900 mb-4">Today's Summary</h3>
//             <div className="space-y-3">
//               <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
//                 <span className="text-sm font-medium">IPD Patients</span>
//                 <span className="font-bold text-blue-600">
//                   {ipdPatients.length}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
//                 <span className="text-sm font-medium">Meds Pending</span>
//                 <span className="font-bold text-yellow-600">{pendingMeds}</span>
//               </div>
//               <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
//                 <span className="text-sm font-medium">Critical</span>
//                 <span className="font-bold text-red-600">
//                   {criticalPatients}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Patients Modal */}
//       <Modal
//         isOpen={patientsModalOpen}
//         onClose={() => setPatientsModalOpen(false)}
//         title="All Patients"
//       >
//         <div className="max-h-[600px] overflow-y-auto">
//           {loadingPatients ? (
//             <div className="text-center py-8">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//             </div>
//           ) : (
//             <DataTable
//               data={patients}
//               columns={[
//                 { header: "UPID", accessor: "upid" },
//                 {
//                   header: "Name",
//                   accessor: (row) => `${row.first_name} ${row.last_name}`,
//                 },
//                 { header: "Phone", accessor: "phone" },
//                 {
//                   header: "Status",
//                   accessor: (row) => (
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
//                         row.status
//                       )}`}
//                     >
//                       {row.status}
//                     </span>
//                   ),
//                 },
//                 {
//                   header: "Actions",
//                   accessor: (row) => (
//                     <button
//                       onClick={() => handleRecordVitals(row)}
//                       className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded"
//                     >
//                       Vitals
//                     </button>
//                   ),
//                 },
//               ]}
//             />
//           )}
//         </div>
//       </Modal>

//       {/* Vitals Recording Modal */}
//       <Modal
//         isOpen={vitalsModalOpen}
//         onClose={() => {
//           setVitalsModalOpen(false);
//           setSelectedPatient(null);
//         }}
//         title="Record Vital Signs"
//       >
//         {selectedPatient && (
//           <div className="space-y-4">
//             <div className="bg-blue-50 p-4 rounded-lg">
//               <h3 className="font-bold text-gray-900">
//                 {selectedPatient.first_name} {selectedPatient.last_name}
//               </h3>
//               <p className="text-sm text-gray-600">
//                 UPID: {selectedPatient.upid}
//               </p>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Blood Pressure
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="120/80"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Heart Rate
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="72"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Temperature (°F)
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="98.6"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Oxygen Saturation (%)
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="98"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Notes
//               </label>
//               <textarea
//                 rows={3}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 placeholder="Additional observations..."
//               />
//             </div>

//             <div className="flex gap-3 justify-end">
//               <Button
//                 variant="outline"
//                 onClick={() => setVitalsModalOpen(false)}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 onClick={() => {
//                   setVitalsModalOpen(false);
//                   setSelectedPatient(null);
//                 }}
//               >
//                 Save Vitals
//               </Button>
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* Medications Modal */}
//       <Modal
//         isOpen={medicationModalOpen}
//         onClose={() => setMedicationModalOpen(false)}
//         title="Medication Schedule"
//       >
//         <div className="max-h-[600px] overflow-y-auto">
//           {loadingMedications ? (
//             <div className="text-center py-8">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//             </div>
//           ) : (
//             <DataTable
//               data={prescriptions}
//               columns={[
//                 { header: "Rx #", accessor: "prescription_number" },
//                 {
//                   header: "Patient",
//                   accessor: (row) =>
//                     row.patient
//                       ? `${row.patient.first_name} ${row.patient.last_name}`
//                       : "N/A",
//                 },
//                 {
//                   header: "Date",
//                   accessor: (row) =>
//                     new Date(row.prescribed_date).toLocaleDateString(),
//                 },
//                 {
//                   header: "Status",
//                   accessor: (row) => (
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
//                         row.status
//                       )}`}
//                     >
//                       {row.status}
//                     </span>
//                   ),
//                 },
//                 {
//                   header: "Actions",
//                   accessor: (row) => (
//                     <button className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded">
//                       View
//                     </button>
//                   ),
//                 },
//               ]}
//             />
//           )}
//         </div>
//       </Modal>

//       {/* Appointments Modal */}
//       <Modal
//         isOpen={appointmentsModalOpen}
//         onClose={() => setAppointmentsModalOpen(false)}
//         title="Today's Appointments"
//       >
//         <div className="max-h-[600px] overflow-y-auto">
//           {loadingAppointments ? (
//             <div className="text-center py-8">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//             </div>
//           ) : (
//             <DataTable
//               data={appointments}
//               columns={[
//                 { header: "Token", accessor: "token_number" },
//                 {
//                   header: "Patient",
//                   accessor: (row) =>
//                     row.patient
//                       ? `${row.patient.first_name} ${row.patient.last_name}`
//                       : "N/A",
//                 },
//                 {
//                   header: "Time",
//                   accessor: (row) =>
//                     new Date(row.scheduled_at).toLocaleTimeString(),
//                 },
//                 {
//                   header: "Status",
//                   accessor: (row) => (
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
//                         row.status
//                       )}`}
//                     >
//                       {row.status.replace("_", " ")}
//                     </span>
//                   ),
//                 },
//                 {
//                   header: "Actions",
//                   accessor: (row) => (
//                     <div>
//                       {row.status === "SCHEDULED" && (
//                         <button
//                           onClick={() => handleCheckInPatient(row.id)}
//                           className="px-2 py-1 text-xs text-green-600 hover:bg-green-50 rounded"
//                         >
//                           Check In
//                         </button>
//                       )}
//                     </div>
//                   ),
//                 },
//               ]}
//             />
//           )}
//         </div>
//       </Modal>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import {
  Activity,
  Users,
  Pill,
  FileText,
  AlertCircle,
  Thermometer,
  Calendar,
} from "../../lib/icons";
import { StatsCard } from "../../components/common/StatsCard";
import { Button } from "../../components/common/Button";
import { DataTable } from "../../components/common/DataTable";
import { Modal } from "../../components/common/Modal";
import { patientsApi } from "../../services/api/patients";
import { appointmentsApi } from "../../services/api/appointments";
import { prescriptionsApi } from "../../services/api/prescriptions";

export function NurseDashboard() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [patientsModalOpen, setPatientsModalOpen] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(false);

  const [vitalsModalOpen, setVitalsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [medicationModalOpen, setMedicationModalOpen] = useState(false);
  const [loadingMedications, setLoadingMedications] = useState(false);

  const [appointmentsModalOpen, setAppointmentsModalOpen] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [patientsData, appointmentsData, prescriptionsData] =
        await Promise.all([
          patientsApi.getAll(),
          appointmentsApi.getToday(),
          prescriptionsApi.getAll(),
        ]);
      setPatients(patientsData || []);
      setAppointments(appointmentsData || []);
      setPrescriptions(prescriptionsData || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPatients = async () => {
    setPatientsModalOpen(true);
    setLoadingPatients(true);
    try {
      const data = await patientsApi.getAll();
      setPatients(data || []);
    } catch (error) {
      console.error("Error loading patients:", error);
    } finally {
      setLoadingPatients(false);
    }
  };

  const handleRecordVitals = (patient) => {
    setSelectedPatient(patient);
    setVitalsModalOpen(true);
  };

  const handleViewMedications = async () => {
    setMedicationModalOpen(true);
    setLoadingMedications(true);
    try {
      const data = await prescriptionsApi.getAll();
      setPrescriptions(data.filter((p) => p.status === "PENDING") || []);
    } catch (error) {
      console.error("Error loading medications:", error);
    } finally {
      setLoadingMedications(false);
    }
  };

  const handleViewAppointments = async () => {
    setAppointmentsModalOpen(true);
    setLoadingAppointments(true);
    try {
      const data = await appointmentsApi.getToday();
      setAppointments(data || []);
    } catch (error) {
      console.error("Error loading appointments:", error);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "OPD":
        return "bg-green-100 text-green-700";
      case "IPD":
        return "bg-orange-100 text-orange-700";
      case "EMERGENCY":
        return "bg-red-100 text-red-700";
      case "SCHEDULED":
        return "bg-blue-100 text-blue-700";
      case "CHECKED_IN":
        return "bg-yellow-100 text-yellow-700";
      case "IN_CONSULTATION":
        return "bg-purple-100 text-purple-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const ipdPatients = patients.filter(
    (p) => p.status === "IPD" || p.status === "EMERGENCY"
  );
  const opdPatients = patients.filter((p) => p.status === "OPD");
  const pendingMeds = prescriptions.filter(
    (p) => p.status === "PENDING"
  ).length;
  const criticalPatients = patients.filter(
    (p) => p.status === "EMERGENCY"
  ).length;

  return (
    <div className="space-y-6 p-2 sm:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
            Nurse Station
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Patient care and monitoring
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            icon={Thermometer}
            onClick={handleViewPatients}
          >
            Record Vitals
          </Button>
          <Button variant="primary" icon={Pill} onClick={handleViewMedications}>
            Medications
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard title="IPD Patients" value={ipdPatients.length.toString()} icon={Users} color="blue" />
        <StatsCard title="Medications Due" value={pendingMeds.toString()} icon={Pill} color="yellow" />
        <StatsCard title="OPD Patients" value={opdPatients.length.toString()} icon={Activity} color="green" />
        <StatsCard title="Critical Alerts" value={criticalPatients.toString()} icon={AlertCircle} color="red" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section (Table) */}
        <div className="lg:col-span-2">
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100 overflow-x-auto">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              IPD Patients
            </h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <DataTable
                  data={ipdPatients}
                  columns={[
                    { header: "UPID", accessor: "upid" },
                    {
                      header: "Name",
                      accessor: (row) => `${row.first_name} ${row.last_name}`,
                    },
                    { header: "Phone", accessor: "phone" },
                    {
                      header: "Status",
                      accessor: (row) => (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}
                        >
                          {row.status}
                        </span>
                      ),
                    },
                    {
                      header: "Actions",
                      accessor: (row) => (
                        <button
                          onClick={() => handleRecordVitals(row)}
                          className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          Record Vitals
                        </button>
                      ),
                    },
                  ]}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Section (Quick Actions + Summary) */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={handleViewPatients}>
                <Users className="w-4 h-4 mr-2" /> View All Patients
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleViewAppointments}>
                <Calendar className="w-4 h-4 mr-2" /> Today's Appointments
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleViewMedications}>
                <Pill className="w-4 h-4 mr-2" /> Medication Schedule
              </Button>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Today's Summary</h3>
            <div className="space-y-3 text-sm sm:text-base">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">IPD Patients</span>
                <span className="font-bold text-blue-600">{ipdPatients.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="font-medium">Meds Pending</span>
                <span className="font-bold text-yellow-600">{pendingMeds}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="font-medium">Critical</span>
                <span className="font-bold text-red-600">{criticalPatients}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
