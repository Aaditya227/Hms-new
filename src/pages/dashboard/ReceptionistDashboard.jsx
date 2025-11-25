

// import React, { useState } from "react";
// import {
//   UserPlus,
//   Calendar,
//   DollarSign,
//   Users,
//   Search,
//   Clock,
// } from "../../lib/icons";
// import { StatsCard } from "../../components/common/StatsCard";
// import { Button } from "../../components/common/Button";
// import { PatientRegistrationForm } from "../../components/forms/PatientRegistrationForm";
// import { Modal } from "../../components/common/Modal";

// export default function ReceptionistDashboard() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

//   const handleOpenRegister = () => setIsRegisterModalOpen(true);
//   const handleCloseRegister = () => setIsRegisterModalOpen(false);

//   return (
//     <div className="space-y-6">
//       {/* Header Section */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-display font-bold text-gray-900">
//             Reception Dashboard
//           </h1>
//           <p className="text-gray-600 mt-1">
//             Manage patient registration and appointments
//           </p>
//         </div>
//         <div className="flex gap-3">
//           <Button variant="outline" icon={Calendar}>
//             Schedule Appointment
//           </Button>
//           <Button
//             variant="primary"
//             icon={UserPlus}
//             onClick={handleOpenRegister}
//           >
//             Register Patient
//           </Button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatsCard
//           title="Today's Appointments"
//           value="48"
//           icon={Calendar}
//           color="purple"
//         />
//         <StatsCard title="Checked In" value="32" icon={Users} color="teal" />
//         <StatsCard title="Waiting" value="8" icon={Clock} color="orange" />
//         <StatsCard
//           title="Collections"
//           value="$8,340"
//           icon={DollarSign}
//           color="green"
//         />
//       </div>

//       {/* Patient Search */}
//       <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//         <h2 className="text-xl font-bold text-gray-900 mb-4">Patient Search</h2>
//         <div className="relative max-w-2xl">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search by name, phone, or patient ID..."
//             className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hospital-purple focus:border-transparent"
//           />
//         </div>
//       </div>

//       {/* Appointment Queue and Pending Payments */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Appointment Queue */}
//         <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//           <h2 className="text-xl font-bold text-gray-900 mb-4">
//             Appointment Queue
//           </h2>
//           <div className="space-y-3">
//             {[1, 2, 3, 4, 5].map((i) => (
//               <div
//                 key={i}
//                 className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
//               >
//                 <div className="flex items-center gap-4">
//                   <div className="w-10 h-10 bg-hospital-purple rounded-lg flex items-center justify-center text-white font-bold">
//                     {i}
//                   </div>
//                   <div>
//                     <p className="font-medium text-gray-900">John Doe</p>
//                     <p className="text-sm text-gray-600">
//                       Dr. Smith • 10:00 AM
//                     </p>
//                   </div>
//                 </div>
//                 <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
//                   Waiting
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Pending Payments */}
//         <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//           <h2 className="text-xl font-bold text-gray-900 mb-4">
//             Pending Payments
//           </h2>
//           <div className="space-y-3">
//             {[1, 2, 3].map((i) => (
//               <div
//                 key={i}
//                 className="p-4 bg-warning-50 border border-warning-200 rounded-lg"
//               >
//                 <div className="flex items-center justify-between mb-2">
//                   <p className="font-medium text-gray-900">
//                     Patient #{1000 + i}
//                   </p>
//                   <span className="font-bold text-warning-600">
//                     ${(Math.random() * 500 + 100).toFixed(2)}
//                   </span>
//                 </div>
//                 <div className="flex gap-2">
//                   <Button size="sm" variant="primary" className="flex-1">
//                     Collect Payment
//                   </Button>
//                   <Button size="sm" variant="outline" className="flex-1">
//                     View Invoice
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Doctor Availability */}
//       <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//         <h2 className="text-xl font-bold text-gray-900 mb-4">
//           Doctor Availability
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {["Dr. Smith", "Dr. Johnson", "Dr. Williams"].map((doctor, i) => (
//             <div
//               key={i}
//               className="p-4 bg-success-50 border border-success-200 rounded-lg"
//             >
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 bg-success-500 rounded-full flex items-center justify-center text-white font-bold">
//                   {doctor.split(" ")[1][0]}
//                 </div>
//                 <div>
//                   <p className="font-medium text-gray-900">{doctor}</p>
//                   <p className="text-sm text-success-600">Available</p>
//                 </div>
//               </div>
//               <div className="mt-3 text-sm text-gray-600">
//                 <p>Next: 11:00 AM</p>
//                 <p>Queue: 3 patients</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Patient Registration Modal */}
//       <Modal
//         title="Register New Patient"
//         isOpen={isRegisterModalOpen}
//         onClose={handleCloseRegister}
//       >
//         <PatientRegistrationForm onClose={handleCloseRegister} />
//       </Modal>
//     </div>
//   );
// }




import React, { useState } from "react";
import {
  UserPlus,
  Calendar,
  DollarSign,
  Users,
  Search,
  Clock,
} from "../../lib/icons";
import { StatsCard } from "../../components/common/StatsCard";
import { Button } from "../../components/common/Button";
import { PatientRegistrationForm } from "../../components/forms/PatientRegistrationForm";
import { Modal } from "../../components/common/Modal";

export default function ReceptionistDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const handleOpenRegister = () => setIsRegisterModalOpen(true);
  const handleCloseRegister = () => setIsRegisterModalOpen(false);

  return (
    <div className="space-y-6 px-3 sm:px-4 md:px-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
            Reception Dashboard
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Manage patient registration and appointments
          </p>
        </div>

        <div className="flex flex-wrap justify-start sm:justify-end gap-3">
          <Button variant="outline" icon={Calendar}>
            Schedule Appointment
          </Button>
          <Button
            variant="primary"
            icon={UserPlus}
            onClick={handleOpenRegister}
          >
            Register Patient
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard
          title="Today's Appointments"
          value="48"
          icon={Calendar}
          color="purple"
        />
        <StatsCard title="Checked In" value="32" icon={Users} color="teal" />
        <StatsCard title="Waiting" value="8" icon={Clock} color="orange" />
        <StatsCard
          title="Collections"
          value="$8,340"
          icon={DollarSign}
          color="green"
        />
      </div>

      {/* Patient Search */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
          Patient Search
        </h2>
        <div className="relative w-full sm:max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, or patient ID..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hospital-purple focus:border-transparent text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Appointment Queue and Pending Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Queue */}
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
            Appointment Queue
          </h2>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-3"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-hospital-purple rounded-lg flex items-center justify-center text-white font-bold">
                    {i}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">John Doe</p>
                    <p className="text-sm text-gray-600">
                      Dr. Smith • 10:00 AM
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium self-start sm:self-auto">
                  Waiting
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
            Pending Payments
          </h2>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-4 bg-warning-50 border border-warning-200 rounded-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <p className="font-medium text-gray-900">
                    Patient #{1000 + i}
                  </p>
                  <span className="font-bold text-warning-600 mt-1 sm:mt-0">
                    ${(Math.random() * 500 + 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button size="sm" variant="primary" className="flex-1">
                    Collect Payment
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    View Invoice
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Doctor Availability */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
          Doctor Availability
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {["Dr. Smith", "Dr. Johnson", "Dr. Williams"].map((doctor, i) => (
            <div
              key={i}
              className="p-4 bg-success-50 border border-success-200 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-success-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {doctor.split(" ")[1][0]}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{doctor}</p>
                  <p className="text-sm text-success-600">Available</p>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                <p>Next: 11:00 AM</p>
                <p>Queue: 3 patients</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Patient Registration Modal */}
      <Modal
        title="Register New Patient"
        isOpen={isRegisterModalOpen}
        onClose={handleCloseRegister}
      >
        <PatientRegistrationForm onClose={handleCloseRegister} />
      </Modal>
    </div>
  );
}
