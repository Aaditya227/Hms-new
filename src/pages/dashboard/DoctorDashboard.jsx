// import { useState, useEffect } from "react";
// import {
//   Calendar,
//   FileText,
//   FlaskConical,
//   Activity,
//   Clock,
//   Users,
//   CheckCircle,
//   Plus,
//   Search,
// } from "../../lib/icons";
// import { StatsCard } from "../../components/common/StatsCard";
// import { Button } from "../../components/common/Button";
// import { DataTable } from "../../components/common/DataTable";
// import { Modal } from "../../components/common/Modal";
// import { appointmentsApi } from "../../services/api/appointments";
// import { patientsApi } from "../../services/api/patients";
// import { laboratoryApi } from "../../services/api/laboratory";
// import { radiologyApi } from "../../services/api/radiology";
// import { prescriptionsApi } from "../../services/api/prescriptions";
// import { useAuth } from "../../context/AuthContext";

// export function DoctorDashboard() {
//   const { user } = useAuth();
//   // Removed <any[]> type annotation
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [patientsModalOpen, setPatientsModalOpen] = useState(false);
//   // Removed <any[]> type annotation
//   const [patients, setPatients] = useState([]);
//   const [loadingPatients, setLoadingPatients] = useState(false);

//   const [labModalOpen, setLabModalOpen] = useState(false);
//   // Removed <any[]> type annotation
//   const [labOrders, setLabOrders] = useState([]);
//   const [loadingLab, setLoadingLab] = useState(false);

//   const [radiologyModalOpen, setRadiologyModalOpen] = useState(false);
//   // Removed <any[]> type annotation
//   const [radiologyOrders, setRadiologyOrders] = useState([]);
//   const [loadingRadiology, setLoadingRadiology] = useState(false);

//   const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
//   // Removed <any[]> type annotation
//   const [prescriptions, setPrescriptions] = useState([]);
//   const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);

//   useEffect(() => {
//     loadTodayAppointments();
//   }, []);

//   const loadTodayAppointments = async () => {
//     try {
//       setLoading(true);
//       const data = await appointmentsApi.getToday();
//       setAppointments(data || []);
//     } catch (error) {
//       console.error("Error loading appointments:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Removed type annotation for id: string
//   const handleStartConsultation = async (id) => {
//     try {
//       await appointmentsApi.updateStatus(id, "IN_CONSULTATION");
//       loadTodayAppointments();
//     } catch (error) {
//       console.error("Error starting consultation:", error);
//     }
//   };

//   // Removed type annotation for id: string
//   const handleCompleteConsultation = async (id) => {
//     try {
//       await appointmentsApi.updateStatus(id, "COMPLETED");
//       loadTodayAppointments();
//     } catch (error) {
//       console.error("Error completing consultation:", error);
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

//   const handleViewLabOrders = async () => {
//     setLabModalOpen(true);
//     setLoadingLab(true);
//     try {
//       const data = await laboratoryApi.getAllOrders();
//       setLabOrders(data || []);
//     } catch (error) {
//       console.error("Error loading lab orders:", error);
//     } finally {
//       setLoadingLab(false);
//     }
//   };

//   const handleViewRadiologyOrders = async () => {
//     setRadiologyModalOpen(true);
//     setLoadingRadiology(true);
//     try {
//       const data = await radiologyApi.getAllOrders();
//       setRadiologyOrders(data || []);
//     } catch (error) {
//       console.error("Error loading radiology orders:", error);
//     } finally {
//       setLoadingRadiology(false);
//     }
//   };

//   const handleViewPrescriptions = async () => {
//     setPrescriptionModalOpen(true);
//     setLoadingPrescriptions(true);
//     try {
//       const data = await prescriptionsApi.getAll();
//       setPrescriptions(data || []);
//     } catch (error) {
//       console.error("Error loading prescriptions:", error);
//     } finally {
//       setLoadingPrescriptions(false);
//     }
//   };

//   // Removed type annotations for id: string and status: string
//   const handleUpdateLabStatus = async (id, status) => {
//     try {
//       await laboratoryApi.updateOrderStatus(id, status);
//       handleViewLabOrders();
//     } catch (error) {
//       console.error("Error updating lab status:", error);
//     }
//   };

//   // Removed type annotations for id: string and status: string
//   const handleUpdateRadiologyStatus = async (id, status) => {
//     try {
//       await radiologyApi.updateOrderStatus(id, status);
//       handleViewRadiologyOrders();
//     } catch (error) {
//       console.error("Error updating radiology status:", error);
//     }
//   };

//   // Removed type annotation for status: string
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "SCHEDULED":
//       case "PENDING":
//         return "bg-blue-100 text-blue-700";
//       case "CHECKED_IN":
//         return "bg-yellow-100 text-yellow-700";
//       case "IN_CONSULTATION":
//       case "IN_PROGRESS":
//         return "bg-purple-100 text-purple-700";
//       case "COMPLETED":
//       case "DISPENSED":
//         return "bg-green-100 text-green-700";
//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   const stats = {
//     total: appointments.length,
//     waiting: appointments.filter((a) => a.status === "CHECKED_IN").length,
//     inProgress: appointments.filter((a) => a.status === "IN_CONSULTATION")
//       .length,
//     completed: appointments.filter((a) => a.status === "COMPLETED").length,
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-display font-bold text-gray-900">
//             Doctor Dashboard
//           </h1>
//           <p className="text-gray-600 mt-1">Welcome back, Doctor</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatsCard
//           title="Today's Appointments"
//           value={stats.total.toString()}
//           icon={Calendar}
//           color="blue"
//         />
//         <StatsCard
//           title="Waiting"
//           value={stats.waiting.toString()}
//           icon={Clock}
//           color="yellow"
//         />
//         <StatsCard
//           title="In Consultation"
//           value={stats.inProgress.toString()}
//           icon={Users}
//           color="purple"
//         />
//         <StatsCard
//           title="Completed"
//           value={stats.completed.toString()}
//           icon={CheckCircle}
//           color="green"
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2">
//           <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">
//               Today's Appointment Queue
//             </h2>
//             {loading ? (
//               <div className="text-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//                 <p className="text-gray-600 mt-2">Loading appointments...</p>
//               </div>
//             ) : (
//               <DataTable
//                 data={appointments}
//                 columns={[
//                   { header: "Token", accessor: "token_number" },
//                   {
//                     header: "Patient",
//                     accessor: (row) =>
//                       row.patient
//                         ? `${row.patient.first_name} ${row.patient.last_name}`
//                         : "N/A",
//                   },
//                   {
//                     header: "Time",
//                     accessor: (row) =>
//                       new Date(row.scheduled_at).toLocaleTimeString(),
//                   },
//                   { header: "Type", accessor: "type" },
//                   {
//                     header: "Status",
//                     accessor: (row) => (
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
//                           row.status
//                         )}`}
//                       >
//                         {row.status.replace("_", " ")}
//                       </span>
//                     ),
//                   },
//                   {
//                     header: "Actions",
//                     accessor: (row) => (
//                       <div className="flex items-center gap-2">
//                         {row.status === "CHECKED_IN" && (
//                           <button
//                             onClick={() => handleStartConsultation(row.id)}
//                             className="px-3 py-1 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
//                           >
//                             Start
//                           </button>
//                         )}
//                         {row.status === "IN_CONSULTATION" && (
//                           <button
//                             onClick={() => handleCompleteConsultation(row.id)}
//                             className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
//                           >
//                             Complete
//                           </button>
//                         )}
//                       </div>
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
//                 View Patients
//               </Button>
//               <Button
//                 variant="outline"
//                 className="w-full justify-start"
//                 onClick={handleViewLabOrders}
//               >
//                 <FlaskConical className="w-4 h-4 mr-2" />
//                 Lab Orders
//               </Button>
//               <Button
//                 variant="outline"
//                 className="w-full justify-start"
//                 onClick={handleViewRadiologyOrders}
//               >
//                 <Activity className="w-4 h-4 mr-2" />
//                 Radiology Orders
//               </Button>
//               <Button
//                 variant="outline"
//                 className="w-full justify-start"
//                 onClick={handleViewPrescriptions}
//               >
//                 <FileText className="w-4 h-4 mr-2" />
//                 Prescriptions
//               </Button>
//             </div>
//           </div>

//           <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//             <h3 className="font-bold text-gray-900 mb-4">Today's Summary</h3>
//             <div className="space-y-3">
//               <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
//                 <span className="text-sm font-medium">Total Appointments</span>
//                 <span className="font-bold text-blue-600">{stats.total}</span>
//               </div>
//               <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
//                 <span className="text-sm font-medium">Completed</span>
//                 <span className="font-bold text-green-600">
//                   {stats.completed}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
//                 <span className="text-sm font-medium">Pending</span>
//                 <span className="font-bold text-yellow-600">
//                   {stats.waiting + stats.inProgress}
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
//         title="My Patients"
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
//               ]}
//             />
//           )}
//         </div>
//       </Modal>

//       {/* Lab Orders Modal */}
//       <Modal
//         isOpen={labModalOpen}
//         onClose={() => setLabModalOpen(false)}
//         title="Laboratory Orders"
//       >
//         <div className="max-h-[600px] overflow-y-auto">
//           {loadingLab ? (
//             <div className="text-center py-8">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//             </div>
//           ) : (
//             <DataTable
//               data={labOrders}
//               columns={[
//                 { header: "Order #", accessor: "order_number" },
//                 {
//                   header: "Patient",
//                   accessor: (row) =>
//                     row.patient
//                       ? `${row.patient.first_name} ${row.patient.last_name}`
//                       : "N/A",
//                 },
//                 {
//                   header: "Test",
//                   accessor: (row) => (row.test ? row.test.name : "N/A"),
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
//                     <div className="flex gap-2">
//                       {row.status === "COMPLETED" && (
//                         <button className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded">
//                           View Results
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

//       {/* Radiology Orders Modal */}
//       <Modal
//         isOpen={radiologyModalOpen}
//         onClose={() => setRadiologyModalOpen(false)}
//         title="Radiology Orders"
//       >
//         <div className="max-h-[600px] overflow-y-auto">
//           {loadingRadiology ? (
//             <div className="text-center py-8">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//             </div>
//           ) : (
//             <DataTable
//               data={radiologyOrders}
//               columns={[
//                 { header: "Order #", accessor: "order_number" },
//                 {
//                   header: "Patient",
//                   accessor: (row) =>
//                     row.patient
//                       ? `${row.patient.first_name} ${row.patient.last_name}`
//                       : "N/A",
//                 },
//                 { header: "Study", accessor: "imaging_type" },
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
//               ]}
//             />
//           )}
//         </div>
//       </Modal>

//       {/* Prescriptions Modal */}
//       <Modal
//         isOpen={prescriptionModalOpen}
//         onClose={() => setPrescriptionModalOpen(false)}
//         title="My Prescriptions"
//       >
//         <div className="max-h-[600px] overflow-y-auto">
//           {loadingPrescriptions ? (
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
  Calendar,
  FileText,
  FlaskConical,
  Activity,
  Clock,
  Users,
  CheckCircle,
} from "../../lib/icons";
import { StatsCard } from "../../components/common/StatsCard";
import { Button } from "../../components/common/Button";
import { DataTable } from "../../components/common/DataTable";
import { Modal } from "../../components/common/Modal";
import { appointmentsApi } from "../../services/api/appointments";
import { patientsApi } from "../../services/api/patients";
import { laboratoryApi } from "../../services/api/laboratory";
import { radiologyApi } from "../../services/api/radiology";
import { prescriptionsApi } from "../../services/api/prescriptions";
import { useAuth } from "../../context/AuthContext";

export function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [patientsModalOpen, setPatientsModalOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);

  const [labModalOpen, setLabModalOpen] = useState(false);
  const [labOrders, setLabOrders] = useState([]);
  const [loadingLab, setLoadingLab] = useState(false);

  const [radiologyModalOpen, setRadiologyModalOpen] = useState(false);
  const [radiologyOrders, setRadiologyOrders] = useState([]);
  const [loadingRadiology, setLoadingRadiology] = useState(false);

  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);

  useEffect(() => {
    loadTodayAppointments();
  }, []);

  const loadTodayAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentsApi.getToday();
      setAppointments(data || []);
    } catch (error) {
      console.error("Error loading appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartConsultation = async (id) => {
    try {
      await appointmentsApi.updateStatus(id, "IN_CONSULTATION");
      loadTodayAppointments();
    } catch (error) {
      console.error("Error starting consultation:", error);
    }
  };

  const handleCompleteConsultation = async (id) => {
    try {
      await appointmentsApi.updateStatus(id, "COMPLETED");
      loadTodayAppointments();
    } catch (error) {
      console.error("Error completing consultation:", error);
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

  const handleViewLabOrders = async () => {
    setLabModalOpen(true);
    setLoadingLab(true);
    try {
      const data = await laboratoryApi.getAllOrders();
      setLabOrders(data || []);
    } catch (error) {
      console.error("Error loading lab orders:", error);
    } finally {
      setLoadingLab(false);
    }
  };

  const handleViewRadiologyOrders = async () => {
    setRadiologyModalOpen(true);
    setLoadingRadiology(true);
    try {
      const data = await radiologyApi.getAllOrders();
      setRadiologyOrders(data || []);
    } catch (error) {
      console.error("Error loading radiology orders:", error);
    } finally {
      setLoadingRadiology(false);
    }
  };

  const handleViewPrescriptions = async () => {
    setPrescriptionModalOpen(true);
    setLoadingPrescriptions(true);
    try {
      const data = await prescriptionsApi.getAll();
      setPrescriptions(data || []);
    } catch (error) {
      console.error("Error loading prescriptions:", error);
    } finally {
      setLoadingPrescriptions(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "SCHEDULED":
      case "PENDING":
        return "bg-blue-100 text-blue-700";
      case "CHECKED_IN":
        return "bg-yellow-100 text-yellow-700";
      case "IN_CONSULTATION":
      case "IN_PROGRESS":
        return "bg-purple-100 text-purple-700";
      case "COMPLETED":
      case "DISPENSED":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const stats = {
    total: appointments.length,
    waiting: appointments.filter((a) => a.status === "CHECKED_IN").length,
    inProgress: appointments.filter((a) => a.status === "IN_CONSULTATION").length,
    completed: appointments.filter((a) => a.status === "COMPLETED").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
            Doctor Dashboard
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Welcome back, Doctor
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard title="Today's Appointments" value={stats.total.toString()} icon={Calendar} color="blue" />
        <StatsCard title="Waiting" value={stats.waiting.toString()} icon={Clock} color="yellow" />
        <StatsCard title="In Consultation" value={stats.inProgress.toString()} icon={Users} color="purple" />
        <StatsCard title="Completed" value={stats.completed.toString()} icon={CheckCircle} color="green" />
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointment Table */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100 overflow-x-auto">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              Today's Appointment Queue
            </h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">
                  Loading appointments...
                </p>
              </div>
            ) : (
              <DataTable
                data={appointments}
                columns={[
                  { header: "Token", accessor: "token_number" },
                  {
                    header: "Patient",
                    accessor: (row) =>
                      row.patient
                        ? `${row.patient.first_name} ${row.patient.last_name}`
                        : "N/A",
                  },
                  {
                    header: "Time",
                    accessor: (row) =>
                      new Date(row.scheduled_at).toLocaleTimeString(),
                  },
                  { header: "Type", accessor: "type" },
                  {
                    header: "Status",
                    accessor: (row) => (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          row.status
                        )}`}
                      >
                        {row.status.replace("_", " ")}
                      </span>
                    ),
                  },
                  {
                    header: "Actions",
                    accessor: (row) => (
                      <div className="flex flex-wrap gap-2">
                        {row.status === "CHECKED_IN" && (
                          <button
                            onClick={() => handleStartConsultation(row.id)}
                            className="px-3 py-1 text-xs sm:text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          >
                            Start
                          </button>
                        )}
                        {row.status === "IN_CONSULTATION" && (
                          <button
                            onClick={() => handleCompleteConsultation(row.id)}
                            className="px-3 py-1 text-xs sm:text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    ),
                  },
                ]}
              />
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6 order-1 lg:order-2">
          {/* Quick Actions */}
          <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={handleViewPatients}>
                <Users className="w-4 h-4 mr-2" /> View Patients
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleViewLabOrders}>
                <FlaskConical className="w-4 h-4 mr-2" /> Lab Orders
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleViewRadiologyOrders}>
                <Activity className="w-4 h-4 mr-2" /> Radiology Orders
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleViewPrescriptions}>
                <FileText className="w-4 h-4 mr-2" /> Prescriptions
              </Button>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Today's Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium">Total Appointments</span>
                <span className="font-bold text-blue-600">{stats.total}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium">Completed</span>
                <span className="font-bold text-green-600">{stats.completed}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm font-medium">Pending</span>
                <span className="font-bold text-yellow-600">
                  {stats.waiting + stats.inProgress}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
