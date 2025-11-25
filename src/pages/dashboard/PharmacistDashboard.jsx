// import { useState, useEffect } from "react";
// import { Pill, Package, AlertCircle, CheckCircle } from "../../lib/icons";
// import { StatsCard } from "../../components/common/StatsCard";
// import { Button } from "../../components/common/Button";
// import { DataTable } from "../../components/common/DataTable";
// import { prescriptionsApi } from "../../services/api/prescriptions";

// export function PharmacistDashboard() {
//   const [prescriptions, setPrescriptions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadPrescriptions();
//   }, []);

//   const loadPrescriptions = async () => {
//     try {
//       setLoading(true);
//       const data = await prescriptionsApi.getAll();
//       setPrescriptions(data || []);
//     } catch (error) {
//       console.error("Error loading prescriptions:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDispense = async (id) => {
//     try {
//       await prescriptionsApi.updateStatus(id, "DISPENSED");
//       loadPrescriptions();
//     } catch (error) {
//       console.error("Error dispensing prescription:", error);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "PENDING":
//         return "bg-yellow-100 text-yellow-700";
//       case "DISPENSED":
//         return "bg-green-100 text-green-700";
//       case "CANCELLED":
//         return "bg-red-100 text-red-700";
//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   const stats = {
//     total: prescriptions.length,
//     pending: prescriptions.filter((p) => p.status === "PENDING").length,
//     dispensed: prescriptions.filter((p) => p.status === "DISPENSED").length,
//     lowStock: 0,
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-display font-bold text-gray-900">
//             Pharmacist Dashboard
//           </h1>
//           <p className="text-gray-600 mt-1">
//             Manage prescriptions and inventory
//           </p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatsCard
//           title="Total Prescriptions"
//           value={stats.total.toString()}
//           icon={Pill}
//           color="blue"
//         />
//         <StatsCard
//           title="Pending"
//           value={stats.pending.toString()}
//           icon={Package}
//           color="yellow"
//         />
//         <StatsCard
//           title="Dispensed Today"
//           value={stats.dispensed.toString()}
//           icon={CheckCircle}
//           color="green"
//         />
//         <StatsCard
//           title="Low Stock Items"
//           value={stats.lowStock.toString()}
//           icon={AlertCircle}
//           color="red"
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2">
//           <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">
//               Pending Prescriptions
//             </h2>

//             {loading ? (
//               <div className="text-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//                 <p className="text-gray-600 mt-2">Loading prescriptions...</p>
//               </div>
//             ) : (
//               <DataTable
//                 data={prescriptions.filter((p) => p.status === "PENDING")}
//                 columns={[
//                   { header: "Rx #", accessor: "prescription_number" },
//                   {
//                     header: "Patient",
//                     accessor: (row) =>
//                       row.patient
//                         ? `${row.patient.first_name} ${row.patient.last_name}`
//                         : "N/A",
//                   },
//                   {
//                     header: "Doctor",
//                     accessor: (row) =>
//                       row.doctor
//                         ? `Dr. ${row.doctor.first_name} ${row.doctor.last_name}`
//                         : "N/A",
//                   },
//                   {
//                     header: "Date",
//                     accessor: (row) =>
//                       new Date(row.prescribed_date).toLocaleDateString(),
//                   },
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
//                       <div className="flex items-center gap-2">
//                         {row.status === "PENDING" && (
//                           <button
//                             onClick={() => handleDispense(row.id)}
//                             className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
//                           >
//                             Dispense
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
//               <a href="/dashboard/prescriptions">
//                 <Button variant="outline" className="w-full justify-start">
//                   <Pill className="w-4 h-4 mr-2" />
//                   All Prescriptions
//                 </Button>
//               </a>
//               <a href="/dashboard/pharmacy">
//                 <Button variant="outline" className="w-full justify-start">
//                   <Package className="w-4 h-4 mr-2" />
//                   Inventory
//                 </Button>
//               </a>
//             </div>
//           </div>

//           <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//             <h3 className="font-bold text-gray-900 mb-4">Today's Summary</h3>
//             <div className="space-y-3">
//               <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
//                 <span className="text-sm font-medium">Total</span>
//                 <span className="font-bold text-blue-600">{stats.total}</span>
//               </div>
//               <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
//                 <span className="text-sm font-medium">Pending</span>
//                 <span className="font-bold text-yellow-600">
//                   {stats.pending}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
//                 <span className="text-sm font-medium">Dispensed</span>
//                 <span className="font-bold text-green-600">
//                   {stats.dispensed}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import { Pill, Package, AlertCircle, CheckCircle } from "../../lib/icons";
import { StatsCard } from "../../components/common/StatsCard";
import { Button } from "../../components/common/Button";
import { DataTable } from "../../components/common/DataTable";
import { prescriptionsApi } from "../../services/api/prescriptions";

export function PharmacistDashboard() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      const data = await prescriptionsApi.getAll();
      setPrescriptions(data || []);
    } catch (error) {
      console.error("Error loading prescriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDispense = async (id) => {
    try {
      await prescriptionsApi.updateStatus(id, "DISPENSED");
      loadPrescriptions();
    } catch (error) {
      console.error("Error dispensing prescription:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "DISPENSED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const stats = {
    total: prescriptions.length,
    pending: prescriptions.filter((p) => p.status === "PENDING").length,
    dispensed: prescriptions.filter((p) => p.status === "DISPENSED").length,
    lowStock: 0,
  };

  return (
    <div className="space-y-6 px-3 sm:px-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
            Pharmacist Dashboard
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Manage prescriptions and inventory
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Prescriptions" value={stats.total.toString()} icon={Pill} color="blue" />
        <StatsCard title="Pending" value={stats.pending.toString()} icon={Package} color="yellow" />
        <StatsCard title="Dispensed Today" value={stats.dispensed.toString()} icon={CheckCircle} color="green" />
        <StatsCard title="Low Stock Items" value={stats.lowStock.toString()} icon={AlertCircle} color="red" />
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side */}
        <div className="lg:col-span-2">
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100 overflow-x-auto">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              Pending Prescriptions
            </h2>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading prescriptions...</p>
              </div>
            ) : (
              <DataTable
                data={prescriptions.filter((p) => p.status === "PENDING")}
                columns={[
                  { header: "Rx #", accessor: "prescription_number" },
                  {
                    header: "Patient",
                    accessor: (row) =>
                      row.patient
                        ? `${row.patient.first_name} ${row.patient.last_name}`
                        : "N/A",
                  },
                  {
                    header: "Doctor",
                    accessor: (row) =>
                      row.doctor
                        ? `Dr. ${row.doctor.first_name} ${row.doctor.last_name}`
                        : "N/A",
                  },
                  {
                    header: "Date",
                    accessor: (row) =>
                      new Date(row.prescribed_date).toLocaleDateString(),
                  },
                  {
                    header: "Status",
                    accessor: (row) => (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          row.status
                        )}`}
                      >
                        {row.status}
                      </span>
                    ),
                  },
                  {
                    header: "Actions",
                    accessor: (row) => (
                      <div className="flex flex-wrap items-center gap-2">
                        {row.status === "PENDING" && (
                          <button
                            onClick={() => handleDispense(row.id)}
                            className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            Dispense
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

        {/* Right Side */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 text-lg sm:text-xl">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <a href="/dashboard/prescriptions">
                <Button variant="outline" className="w-full justify-start text-sm sm:text-base">
                  <Pill className="w-4 h-4 mr-2" />
                  All Prescriptions
                </Button>
              </a>
              <a href="/dashboard/pharmacy">
                <Button variant="outline" className="w-full justify-start text-sm sm:text-base">
                  <Package className="w-4 h-4 mr-2" />
                  Inventory
                </Button>
              </a>
            </div>
          </div>

          {/* Today's Summary */}
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 text-lg sm:text-xl">
              Today's Summary
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm sm:text-base font-medium">Total</span>
                <span className="font-bold text-blue-600">{stats.total}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm sm:text-base font-medium">Pending</span>
                <span className="font-bold text-yellow-600">{stats.pending}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm sm:text-base font-medium">Dispensed</span>
                <span className="font-bold text-green-600">{stats.dispensed}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
