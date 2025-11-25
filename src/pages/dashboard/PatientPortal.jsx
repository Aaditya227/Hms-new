// import {
//   Calendar,
//   FileText,
//   Pill,
//   DollarSign,
//   User,
//   Download,
// } from "../../lib/icons";
// import { StatsCard } from "../../components/common/StatsCard";
// import { Button } from "../../components/common/Button";
// import { DataTable } from "../../components/common/DataTable";

// export function PatientPortal() {
//   // Mock data for Upcoming Appointments
//   const upcomingAppointments = [
//     {
//       doctor: "Dr. Smith",
//       specialty: "Cardiology",
//       date: "Dec 20, 2024",
//       time: "10:00 AM",
//     },
//     {
//       doctor: "Dr. Johnson",
//       specialty: "General Medicine",
//       date: "Dec 22, 2024",
//       time: "2:30 PM",
//     },
//   ];

//   // Mock data for Active Prescriptions
//   const activePrescriptions = [
//     { med: "Metformin 500mg", dose: "2x daily", expires: "Jan 15, 2025" },
//     { med: "Lisinopril 10mg", dose: "1x daily", expires: "Feb 20, 2025" },
//     { med: "Aspirin 75mg", dose: "1x daily", expires: "Mar 10, 2025" },
//   ];

//   // Mock data for Recent Lab Reports
//   const recentLabReports = [
//     { test: "Blood Sugar", date: "Dec 10, 2024", status: "Normal" },
//     { test: "Lipid Profile", date: "Dec 5, 2024", status: "Normal" },
//     { test: "Complete Blood Count", date: "Nov 28, 2024", status: "Normal" },
//   ];

//   // Column definitions for Medical History and Billing & Payments are already defined in the JSX

//   return (
//     <div className="space-y-6">
//       {/* Header Section */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-display font-bold text-gray-900">
//             Patient Portal
//           </h1>
//           <p className="text-gray-600 mt-1">Welcome back, John Doe</p>
//         </div>
//         <div className="flex gap-3">
//           <Button variant="outline" icon={Download}>
//             Download Records
//           </Button>
//           <Button variant="primary" icon={Calendar}>
//             Book Appointment
//           </Button>
//         </div>
//       </div>

//       {/* Stats Cards Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatsCard
//           title="Upcoming Appointments"
//           value="2"
//           icon={Calendar}
//           color="purple"
//         />
//         <StatsCard
//           title="Pending Bills"
//           value="$450"
//           icon={DollarSign}
//           color="orange"
//         />
//         <StatsCard
//           title="Active Prescriptions"
//           value="3"
//           icon={Pill}
//           color="teal"
//         />
//         <StatsCard title="Lab Reports" value="5" icon={FileText} color="blue" />
//       </div>

//       {/* Main Content Grid (Appointments/History + Profile/Prescriptions/Reports) */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left Column (2/3 width on large screens) */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Upcoming Appointments Card */}
//           <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">
//               Upcoming Appointments
//             </h2>
//             <div className="space-y-3">
//               {upcomingAppointments.map((apt, i) => (
//                 <div
//                   key={i}
//                   className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
//                 >
//                   <div className="flex items-start justify-between mb-2">
//                     <div>
//                       <p className="font-bold text-gray-900">{apt.doctor}</p>
//                       <p className="text-sm text-gray-600">{apt.specialty}</p>
//                     </div>
//                     <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-medium">
//                       Confirmed
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-4 text-sm text-gray-700">
//                     <span>📅 {apt.date}</span>
//                     <span>⏰ {apt.time}</span>
//                   </div>
//                   <div className="flex gap-2 mt-3">
//                     <Button size="sm" variant="outline" className="flex-1">
//                       Reschedule
//                     </Button>
//                     <Button size="sm" variant="danger" className="flex-1">
//                       Cancel
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Medical History Card (DataTable) */}
//           <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">
//               Medical History
//             </h2>
//             <DataTable
//               data={[]} // Empty array for demonstration
//               columns={[
//                 { header: "Date", accessor: "date" },
//                 { header: "Doctor", accessor: "doctor" },
//                 { header: "Diagnosis", accessor: "diagnosis" },
//                 { header: "Treatment", accessor: "treatment" },
//                 { header: "Actions", accessor: "actions" },
//               ]}
//             />
//           </div>
//         </div>

//         {/* Right Column (1/3 width on large screens) */}
//         <div className="space-y-6">
//           {/* Patient Profile Card */}
//           <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">
//               Patient Profile
//             </h2>
//             <div className="space-y-3">
//               <div className="flex items-center gap-4 mb-4">
//                 <div className="w-20 h-20 bg-hospital-purple rounded-full flex items-center justify-center text-white text-3xl font-bold">
//                   JD
//                 </div>
//                 <div>
//                   <p className="font-bold text-gray-900">John Doe</p>
//                   <p className="text-sm text-gray-600">UPID: P1001</p>
//                 </div>
//               </div>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Age:</span>
//                   <span className="font-medium">45 years</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Blood Group:</span>
//                   <span className="font-medium">O+</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Gender:</span>
//                   <span className="font-medium">Male</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Phone:</span>
//                   <span className="font-medium">+1 234-567-8900</span>
//                 </div>
//               </div>
//               <Button variant="outline" className="w-full mt-4" icon={User}>
//                 Edit Profile
//               </Button>
//             </div>
//           </div>

//           {/* Active Prescriptions Card */}
//           <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">
//               Active Prescriptions
//             </h2>
//             <div className="space-y-2">
//               {activePrescriptions.map((rx, i) => (
//                 <div key={i} className="p-3 bg-gray-50 rounded-lg">
//                   <p className="font-medium text-gray-900">{rx.med}</p>
//                   <p className="text-sm text-gray-600">{rx.dose}</p>
//                   <p className="text-xs text-gray-500 mt-1">
//                     Valid until: {rx.expires}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Recent Lab Reports Card */}
//           <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">
//               Recent Lab Reports
//             </h2>
//             <div className="space-y-2">
//               {recentLabReports.map((report, i) => (
//                 <div
//                   key={i}
//                   className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//                 >
//                   <div>
//                     <p className="font-medium text-gray-900">{report.test}</p>
//                     <p className="text-xs text-gray-600">{report.date}</p>
//                   </div>
//                   <Button size="sm" variant="outline" icon={Download}>
//                     View
//                   </Button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Billing & Payments Section */}
//       <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//         <h2 className="text-xl font-bold text-gray-900 mb-4">
//           Billing & Payments
//         </h2>
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
//           <div className="p-4 bg-success-50 rounded-lg">
//             <p className="text-sm text-gray-600">Total Paid</p>
//             <p className="text-2xl font-bold text-success-700">$3,450</p>
//           </div>
//           <div className="p-4 bg-warning-50 rounded-lg">
//             <p className="text-sm text-gray-600">Pending</p>
//             <p className="text-2xl font-bold text-warning-700">$450</p>
//           </div>
//           <div className="p-4 bg-blue-50 rounded-lg">
//             <p className="text-sm text-gray-600">Insurance Covered</p>
//             <p className="text-2xl font-bold text-blue-700">$2,100</p>
//           </div>
//         </div>
//         <DataTable
//           data={[]} // Empty array for demonstration
//           columns={[
//             { header: "Invoice", accessor: "invoice" },
//             { header: "Date", accessor: "date" },
//             { header: "Description", accessor: "description" },
//             { header: "Amount", accessor: "amount" },
//             { header: "Status", accessor: "status" },
//             { header: "Actions", accessor: "actions" },
//           ]}
//         />
//       </div>
//     </div>
//   );
// }



import {
  Calendar,
  FileText,
  Pill,
  DollarSign,
  User,
  Download,
} from "../../lib/icons";
import { StatsCard } from "../../components/common/StatsCard";
import { Button } from "../../components/common/Button";
import { DataTable } from "../../components/common/DataTable";

export function PatientPortal() {
  const upcomingAppointments = [
    {
      doctor: "Dr. Smith",
      specialty: "Cardiology",
      date: "Dec 20, 2024",
      time: "10:00 AM",
    },
    {
      doctor: "Dr. Johnson",
      specialty: "General Medicine",
      date: "Dec 22, 2024",
      time: "2:30 PM",
    },
  ];

  const activePrescriptions = [
    { med: "Metformin 500mg", dose: "2x daily", expires: "Jan 15, 2025" },
    { med: "Lisinopril 10mg", dose: "1x daily", expires: "Feb 20, 2025" },
    { med: "Aspirin 75mg", dose: "1x daily", expires: "Mar 10, 2025" },
  ];

  const recentLabReports = [
    { test: "Blood Sugar", date: "Dec 10, 2024", status: "Normal" },
    { test: "Lipid Profile", date: "Dec 5, 2024", status: "Normal" },
    { test: "Complete Blood Count", date: "Nov 28, 2024", status: "Normal" },
  ];

  return (
    <div className="space-y-6 px-3 sm:px-6 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
            Patient Portal
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Welcome back, John Doe
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button variant="outline" icon={Download} className="w-full sm:w-auto">
            Download Records
          </Button>
          {/* <Button variant="primary" icon={Calendar} className="w-full sm:w-auto">
            Book Appointment
          </Button> */}
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Upcoming Appointments" value="2" icon={Calendar} color="purple" />
        <StatsCard title="Pending Bills" value="$450" icon={DollarSign} color="orange" />
        <StatsCard title="Active Prescriptions" value="3" icon={Pill} color="teal" />
        <StatsCard title="Lab Reports" value="5" icon={FileText} color="blue" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Appointments */}
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              Upcoming Appointments
            </h2>
            <div className="space-y-3">
              {upcomingAppointments.map((apt, i) => (
                <div
                  key={i}
                  className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                    <div>
                      <p className="font-bold text-gray-900">{apt.doctor}</p>
                      <p className="text-sm text-gray-600">{apt.specialty}</p>
                    </div>
                    <span className="self-start sm:self-center px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-medium">
                      Confirmed
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-700">
                    <span>📅 {apt.date}</span>
                    <span>⏰ {apt.time}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1">
                      Reschedule
                    </Button>
                    <Button size="sm" variant="danger" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Medical History */}
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100 overflow-x-auto">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              Medical History
            </h2>
            <DataTable
              data={[]}
              columns={[
                { header: "Date", accessor: "date" },
                { header: "Doctor", accessor: "doctor" },
                { header: "Diagnosis", accessor: "diagnosis" },
                { header: "Treatment", accessor: "treatment" },
                { header: "Actions", accessor: "actions" },
              ]}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Profile */}
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              Patient Profile
            </h2>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <div className="w-20 h-20 bg-hospital-purple rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  JD
                </div>
                <div>
                  <p className="font-bold text-gray-900">John Doe</p>
                  <p className="text-sm text-gray-600">UPID: P1001</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Age:</span>
                  <span className="font-medium">45 years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Blood Group:</span>
                  <span className="font-medium">O+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gender:</span>
                  <span className="font-medium">Male</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">+1 234-567-8900</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4" icon={User}>
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Prescriptions */}
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              Active Prescriptions
            </h2>
            <div className="space-y-2">
              {activePrescriptions.map((rx, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">{rx.med}</p>
                  <p className="text-sm text-gray-600">{rx.dose}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Valid until: {rx.expires}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Reports */}
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              Recent Lab Reports
            </h2>
            <div className="space-y-2">
              {recentLabReports.map((report, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-3"
                >
                  <div>
                    <p className="font-medium text-gray-900">{report.test}</p>
                    <p className="text-xs text-gray-600">{report.date}</p>
                  </div>
                  <Button size="sm" variant="outline" icon={Download}>
                    View
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Billing Section */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100 overflow-x-auto">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
          Billing & Payments
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="p-4 bg-success-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Paid</p>
            <p className="text-2xl font-bold text-success-700">$3,450</p>
          </div>
          <div className="p-4 bg-warning-50 rounded-lg">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-warning-700">$450</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Insurance Covered</p>
            <p className="text-2xl font-bold text-blue-700">$2,100</p>
          </div>
        </div>
        <DataTable
          data={[]}
          columns={[
            { header: "Invoice", accessor: "invoice" },
            { header: "Date", accessor: "date" },
            { header: "Description", accessor: "description" },
            { header: "Amount", accessor: "amount" },
            { header: "Status", accessor: "status" },
            { header: "Actions", accessor: "actions" },
          ]}
        />
      </div>
    </div>
  );
}
