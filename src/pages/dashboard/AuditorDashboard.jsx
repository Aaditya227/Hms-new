// import {
//   Shield,
//   FileText,
//   AlertTriangle,
//   CheckCircle,
//   TrendingUp,
//   Activity,
// } from "../../lib/icons";
// import { StatsCard } from "../../components/common/StatsCard";
// import { Button } from "../../components/common/Button";
// import { DataTable } from "../../components/common/DataTable";

// export function AuditorDashboard() {
//   const recentAuditLogs = [
//     {
//       id: 1,
//       timestamp: "2024-10-29 14:30",
//       user: "finance@hospital.com",
//       action: "VIEW_INVOICE",
//       module: "Billing",
//       status: "SUCCESS",
//     },
//     {
//       id: 2,
//       timestamp: "2024-10-29 14:28",
//       user: "doctor@hospital.com",
//       action: "UPDATE_PATIENT_RECORD",
//       module: "Patient",
//       status: "SUCCESS",
//     },
//     {
//       id: 3,
//       timestamp: "2024-10-29 14:25",
//       user: "reception@hospital.com",
//       action: "LOGIN",
//       module: "Auth",
//       status: "FAILURE", // Example of a failed action
//     },
//     {
//       id: 4,
//       timestamp: "2024-10-29 14:20",
//       user: "admin@hospital.com",
//       action: "CHANGE_USER_ROLE",
//       module: "Staff",
//       status: "SUCCESS",
//     },
//   ]; // Added dummy data for demonstration

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-display font-bold text-gray-900">
//             Audit Dashboard
//           </h1>
//           <p className="text-gray-600 mt-1">
//             Compliance monitoring and system audits
//           </p>
//         </div>
//         <div className="flex gap-3">
//           <Button variant="outline" icon={FileText}>
//             Export Report
//           </Button>
//           <Button variant="primary" icon={Shield}>
//             New Audit
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatsCard
//           title="Compliance Score"
//           value="94%"
//           icon={CheckCircle}
//           color="green"
//           trend={{ value: "+2%", isPositive: true }}
//         />
//         <StatsCard
//           title="Active Alerts"
//           value="12"
//           icon={AlertTriangle}
//           color="orange"
//         />
//         <StatsCard
//           title="Audits This Month"
//           value="28"
//           icon={FileText}
//           color="purple"
//         />
//         <StatsCard
//           title="System Activity"
//           value="High"
//           icon={Activity}
//           color="teal"
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 space-y-6">
//           <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">
//               Compliance Metrics
//             </h2>
//             <div className="space-y-4">
//               {[
//                 {
//                   category: "Data Security",
//                   score: 98,
//                   status: "excellent",
//                   color: "bg-success-500",
//                 },
//                 {
//                   category: "Patient Privacy (HIPAA)",
//                   score: 95,
//                   status: "excellent",
//                   color: "bg-success-500",
//                 },
//                 {
//                   category: "Access Control",
//                   score: 92,
//                   status: "good",
//                   color: "bg-blue-500",
//                 },
//                 {
//                   category: "Audit Trails",
//                   score: 88,
//                   status: "good",
//                   color: "bg-blue-500",
//                 },
//                 {
//                   category: "Document Management",
//                   score: 85,
//                   status: "fair",
//                   color: "bg-warning-500",
//                 },
//               ].map((metric, i) => (
//                 <div key={i}>
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="font-medium text-gray-900">
//                       {metric.category}
//                     </span>
//                     <span className="font-bold text-gray-900">
//                       {metric.score}%
//                     </span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-3">
//                     <div
//                       className={`${metric.color} h-3 rounded-full transition-all duration-500`}
//                       style={{ width: `${metric.score}%` }}
//                     ></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">
//               Recent Audit Logs
//             </h2>
//             <DataTable
//               // Used dummy data
//               data={recentAuditLogs}
//               columns={[
//                 // Removed type annotations for accessor
//                 { header: "Timestamp", accessor: "timestamp" },
//                 { header: "User", accessor: "user" },
//                 { header: "Action", accessor: "action" },
//                 { header: "Module", accessor: "module" },
//                 {
//                   header: "Status",
//                   accessor: (row) => (
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         row.status === "SUCCESS"
//                           ? "bg-success-100 text-success-700"
//                           : row.status === "FAILURE"
//                           ? "bg-error-100 text-error-700"
//                           : "bg-gray-100 text-gray-700"
//                       }`}
//                     >
//                       {row.status}
//                     </span>
//                   ),
//                 },
//               ]}
//             />
//           </div>
//         </div>

//         <div className="space-y-6">
//           <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">
//               Active Alerts
//             </h2>
//             <div className="space-y-3">
//               {[
//                 {
//                   type: "Failed Login",
//                   count: 5,
//                   severity: "medium",
//                   color: "bg-warning-50 border-warning-500",
//                 },
//                 {
//                   type: "Unauthorized Access",
//                   count: 2,
//                   severity: "high",
//                   color: "bg-error-50 border-error-500",
//                 },
//                 {
//                   type: "Data Export",
//                   count: 3,
//                   severity: "low",
//                   color: "bg-blue-50 border-blue-500",
//                 },
//                 {
//                   type: "Permission Change",
//                   count: 2,
//                   severity: "medium",
//                   color: "bg-warning-50 border-warning-500",
//                 },
//               ].map((alert, i) => (
//                 <div
//                   key={i}
//                   className={`p-3 rounded-lg border-2 ${alert.color}`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="font-medium text-gray-900">{alert.type}</p>
//                       <p className="text-sm text-gray-600">
//                         {alert.count} incidents
//                       </p>
//                     </div>
//                     <AlertTriangle
//                       className={`w-5 h-5 ${
//                         alert.severity === "high"
//                           ? "text-error-600"
//                           : alert.severity === "medium"
//                           ? "text-warning-600"
//                           : "text-blue-600"
//                       }`}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">
//               User Activity
//             </h2>
//             <div className="space-y-2">
//               <div className="flex items-center justify-between p-2">
//                 <span className="text-sm text-gray-700">Active Users</span>
//                 <span className="text-sm font-bold text-success-600">124</span>
//               </div>
//               <div className="flex items-center justify-between p-2">
//                 <span className="text-sm text-gray-700">Sessions Today</span>
//                 <span className="text-sm font-bold text-gray-900">456</span>
//               </div>
//               <div className="flex items-center justify-between p-2">
//                 <span className="text-sm text-gray-700">Failed Logins</span>
//                 <span className="text-sm font-bold text-error-600">8</span>
//               </div>
//               <div className="flex items-center justify-between p-2">
//                 <span className="text-sm text-gray-700">Avg Session Time</span>
//                 <span className="text-sm font-bold text-gray-900">2.5 hrs</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">
//               Quick Actions
//             </h2>
//             <div className="space-y-2">
//               <Button
//                 variant="outline"
//                 className="w-full justify-start"
//                 icon={FileText}
//               >
//                 Generate Audit Report
//               </Button>
//               <Button
//                 variant="outline"
//                 className="w-full justify-start"
//                 icon={Activity}
//               >
//                 View System Logs
//               </Button>
//               <Button
//                 variant="outline"
//                 className="w-full justify-start"
//                 icon={Shield}
//               >
//                 Security Settings
//               </Button>
//               <Button
//                 variant="outline"
//                 className="w-full justify-start"
//                 icon={AlertTriangle}
//               >
//                 Alert Configuration
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//           <h2 className="text-xl font-bold text-gray-900 mb-4">
//             Data Access by Module
//           </h2>
//           <div className="space-y-3">
//             {[
//               { module: "Patient Records", accesses: 1245, trend: "+12%" },
//               { module: "Billing", accesses: 856, trend: "+8%" },
//               { module: "Pharmacy", accesses: 642, trend: "+15%" },
//               { module: "Laboratory", accesses: 534, trend: "+5%" },
//               { module: "Administration", accesses: 423, trend: "+3%" },
//             ].map((mod, i) => (
//               <div
//                 key={i}
//                 className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//               >
//                 <div>
//                   <p className="font-medium text-gray-900">{mod.module}</p>
//                   <p className="text-sm text-gray-600">
//                     {mod.accesses} accesses today
//                   </p>
//                 </div>
//                 <span className="text-sm font-bold text-success-600">
//                   {mod.trend}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//           <h2 className="text-xl font-bold text-gray-900 mb-4">
//             Compliance Issues
//           </h2>
//           <div className="space-y-3">
//             {[
//               {
//                 issue: "Password expiry pending",
//                 count: 12,
//                 priority: "medium",
//               },
//               { issue: "Incomplete audit trails", count: 3, priority: "high" },
//               { issue: "Access review overdue", count: 8, priority: "medium" },
//               {
//                 issue: "Training certificates expired",
//                 count: 5,
//                 priority: "low",
//               },
//             ].map((issue, i) => (
//               <div
//                 key={i}
//                 className={`p-3 rounded-lg ${
//                   issue.priority === "high"
//                     ? "bg-error-50"
//                     : issue.priority === "medium"
//                     ? "bg-warning-50"
//                     : "bg-blue-50"
//                 }`}
//               >
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="font-medium text-gray-900">{issue.issue}</p>
//                     <p className="text-sm text-gray-600">{issue.count} items</p>
//                   </div>
//                   <Button size="sm" variant="outline">
//                     Review
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import {
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle,
  Activity,
} from "../../lib/icons";
import { StatsCard } from "../../components/common/StatsCard";
import { Button } from "../../components/common/Button";
import { DataTable } from "../../components/common/DataTable";

export function AuditorDashboard() {
  const recentAuditLogs = [
    {
      id: 1,
      timestamp: "2024-10-29 14:30",
      user: "finance@hospital.com",
      action: "VIEW_INVOICE",
      module: "Billing",
      status: "SUCCESS",
    },
    {
      id: 2,
      timestamp: "2024-10-29 14:28",
      user: "doctor@hospital.com",
      action: "UPDATE_PATIENT_RECORD",
      module: "Patient",
      status: "SUCCESS",
    },
    {
      id: 3,
      timestamp: "2024-10-29 14:25",
      user: "reception@hospital.com",
      action: "LOGIN",
      module: "Auth",
      status: "FAILURE",
    },
    {
      id: 4,
      timestamp: "2024-10-29 14:20",
      user: "admin@hospital.com",
      action: "CHANGE_USER_ROLE",
      module: "Staff",
      status: "SUCCESS",
    },
  ];

  return (
    <div className="space-y-6 px-3 sm:px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="text-center sm:text-left w-full">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
            Audit Dashboard
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Compliance monitoring and system audits
          </p>
        </div>
        <div className="flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">
          <Button variant="outline" icon={FileText}>
            Export Report
          </Button>
          <Button variant="primary" icon={Shield}>
            New Audit
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Compliance Score"
          value="94%"
          icon={CheckCircle}
          color="green"
          trend={{ value: "+2%", isPositive: true }}
        />
        <StatsCard
          title="Active Alerts"
          value="12"
          icon={AlertTriangle}
          color="orange"
        />
        <StatsCard
          title="Audits This Month"
          value="28"
          icon={FileText}
          color="purple"
        />
        <StatsCard
          title="System Activity"
          value="High"
          icon={Activity}
          color="teal"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Compliance Metrics */}
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
              Compliance Metrics
            </h2>
            <div className="space-y-4">
              {[
                {
                  category: "Data Security",
                  score: 98,
                  color: "bg-green-500",
                },
                {
                  category: "Patient Privacy (HIPAA)",
                  score: 95,
                  color: "bg-green-500",
                },
                {
                  category: "Access Control",
                  score: 92,
                  color: "bg-blue-500",
                },
                {
                  category: "Audit Trails",
                  score: 88,
                  color: "bg-blue-500",
                },
                {
                  category: "Document Management",
                  score: 85,
                  color: "bg-yellow-500",
                },
              ].map((metric, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900 text-sm sm:text-base">
                      {metric.category}
                    </span>
                    <span className="font-bold text-gray-900 text-sm">
                      {metric.score}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${metric.color} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${metric.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Audit Logs */}
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100 overflow-x-auto">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
              Recent Audit Logs
            </h2>
            <DataTable
              data={recentAuditLogs}
              columns={[
                { header: "Timestamp", accessor: "timestamp" },
                { header: "User", accessor: "user" },
                { header: "Action", accessor: "action" },
                { header: "Module", accessor: "module" },
                {
                  header: "Status",
                  accessor: (row) => (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        row.status === "SUCCESS"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {row.status}
                    </span>
                  ),
                },
              ]}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Active Alerts */}
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
              Active Alerts
            </h2>
            <div className="space-y-3">
              {[
                {
                  type: "Failed Login",
                  count: 5,
                  severity: "medium",
                  color: "bg-yellow-50 border-yellow-400",
                },
                {
                  type: "Unauthorized Access",
                  count: 2,
                  severity: "high",
                  color: "bg-red-50 border-red-400",
                },
                {
                  type: "Data Export",
                  count: 3,
                  severity: "low",
                  color: "bg-blue-50 border-blue-400",
                },
              ].map((alert, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border ${alert.color} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2`}
                >
                  <div className="text-center sm:text-left">
                    <p className="font-medium text-gray-900">{alert.type}</p>
                    <p className="text-sm text-gray-600">
                      {alert.count} incidents
                    </p>
                  </div>
                  <AlertTriangle
                    className={`w-5 h-5 ${
                      alert.severity === "high"
                        ? "text-red-600"
                        : alert.severity === "medium"
                        ? "text-yellow-600"
                        : "text-blue-600"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* User Activity */}
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
              User Activity
            </h2>
            <div className="space-y-2 text-sm">
              {[
                ["Active Users", "124", "text-green-600"],
                ["Sessions Today", "456", "text-gray-900"],
                ["Failed Logins", "8", "text-red-600"],
                ["Avg Session Time", "2.5 hrs", "text-gray-900"],
              ].map(([label, value, color], i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-700">{label}</span>
                  <span className={`font-bold ${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              {[
                ["Generate Audit Report", FileText],
                ["View System Logs", Activity],
                ["Security Settings", Shield],
                ["Alert Configuration", AlertTriangle],
              ].map(([label, Icon], i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="w-full justify-start"
                  icon={Icon}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuditorDashboard;
