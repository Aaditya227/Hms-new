
// import { useState } from "react";
// import {
//   ClipboardList,
//   Download,
//   Calendar,
//   TrendingUp,
//   DollarSign,
//   Users,
// } from "../lib/icons";
// import { Button } from "../components/common/Button";

// export function Reports() {
//   const [selectedReport, setSelectedReport] = useState("");
//   const [dateRange, setDateRange] = useState({ from: "", to: "" });

//   const reportCategories = [
//     {
//       title: "Financial Reports",
//       icon: DollarSign,
//       color: "green",
//       reports: [
//         "Daily Revenue Report",
//         "Monthly Revenue Summary",
//         "Department-wise Revenue",
//         "Payment Collection Report",
//         "Outstanding Invoices",
//       ],
//     },
//     {
//       title: "Clinical Reports",
//       icon: ClipboardList,
//       color: "blue",
//       reports: [
//         "Patient Admission Report",
//         "Discharge Summary Report",
//         "Surgery Report",
//         "Lab Test Report",
//         "Radiology Report",
//       ],
//     },
//     {
//       title: "Operational Reports",
//       icon: TrendingUp,
//       color: "purple",
//       reports: [
//         "Appointment Statistics",
//         "Bed Occupancy Report",
//         "Staff Attendance Report",
//         "Department Performance",
//         "Service Utilization Report",
//       ],
//     },
//     {
//       title: "Administrative Reports",
//       icon: Users,
//       color: "orange",
//       reports: [
//         "Patient Demographics",
//         "Staff Directory",
//         "Inventory Status",
//         "Compliance Report",
//         "Audit Trail Report",
//       ],
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
//         <div>
//           <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mt-10">
//             Reports & Analytics
//           </h1>
//           <p className="text-gray-600 mt-1 text-sm sm:text-base">
//             Generate and download various hospital reports
//           </p>
//         </div>
//       </div>

//       {/* Top Stats Section */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {[
//           {
//             label: "Total Reports",
//             value: "1,234",
//             icon: ClipboardList,
//             color: "blue",
//           },
//           { label: "This Month", value: "156", icon: Calendar, color: "green" },
//           {
//             label: "Downloaded",
//             value: "892",
//             icon: Download,
//             color: "purple",
//           },
//           {
//             label: "Scheduled",
//             value: "24",
//             icon: TrendingUp,
//             color: "orange",
//           },
//         ].map((stat, index) => (
//           <div
//             key={index}
//             className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-5 border border-gray-100"
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">{stat.label}</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-1">
//                   {stat.value}
//                 </p>
//               </div>
//               <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
//                 <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Generate Report Section */}
//       <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//         <h2 className="text-xl font-bold text-gray-900 mb-4">
//           Generate Report
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {/* Report Type */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Report Type
//             </label>
//             <select
//               value={selectedReport}
//               onChange={(e) => setSelectedReport(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
//             >
//               <option value="">Select a report type</option>
//               {reportCategories.map((category) =>
//                 category.reports.map((report, index) => (
//                   <option key={`${category.title}-${index}`} value={report}>
//                     {report}
//                   </option>
//                 ))
//               )}
//             </select>
//           </div>

//           {/* From Date */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               From Date
//             </label>
//             <input
//               type="date"
//               value={dateRange.from}
//               onChange={(e) =>
//                 setDateRange({ ...dateRange, from: e.target.value })
//               }
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
//             />
//           </div>

//           {/* To Date */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               To Date
//             </label>
//             <input
//               type="date"
//               value={dateRange.to}
//               onChange={(e) =>
//                 setDateRange({ ...dateRange, to: e.target.value })
//               }
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
//             />
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="mt-4 flex flex-col sm:flex-row gap-3">
//           <Button icon={Download}>Generate & Download</Button>
//           <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
//             Preview
//           </button>
//         </div>
//       </div>

//       {/* Report Categories */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {reportCategories.map((category, index) => (
//           <div
//             key={index}
//             className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100"
//           >
//             <div className="flex items-center gap-3 mb-4">
//               <div className={`p-3 bg-${category.color}-100 rounded-lg`}>
//                 <category.icon
//                   className={`w-6 h-6 text-${category.color}-600`}
//                 />
//               </div>
//               <h2 className="text-lg sm:text-xl font-bold text-gray-900">
//                 {category.title}
//               </h2>
//             </div>

//             <div className="space-y-2">
//               {category.reports.map((report, reportIndex) => (
//                 <button
//                   key={reportIndex}
//                   onClick={() => setSelectedReport(report)}
//                   className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors group text-sm sm:text-base"
//                 >
//                   <div className="flex items-center justify-between">
//                     <span className="font-medium text-gray-900 group-hover:text-blue-600">
//                       {report}
//                     </span>
//                     <Download className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Recent Reports */}
//       <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//         <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Reports</h2>
//         <div className="space-y-3">
//           {[
//             {
//               name: "Daily Revenue Report",
//               date: "2024-10-28",
//               size: "2.4 MB",
//             },
//             {
//               name: "Patient Admission Report",
//               date: "2024-10-28",
//               size: "1.8 MB",
//             },
//             {
//               name: "Staff Attendance Report",
//               date: "2024-10-27",
//               size: "890 KB",
//             },
//             {
//               name: "Department Performance",
//               date: "2024-10-27",
//               size: "3.2 MB",
//             },
//           ].map((report, index) => (
//             <div
//               key={index}
//               className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg gap-3"
//             >
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-blue-100 rounded-lg">
//                   <ClipboardList className="w-5 h-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <p className="font-medium text-gray-900 text-sm sm:text-base">
//                     {report.name}
//                   </p>
//                   <p className="text-xs sm:text-sm text-gray-600">
//                     Generated on {report.date} • {report.size}
//                   </p>
//                 </div>
//               </div>
//               <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors self-start sm:self-auto">
//                 <Download className="w-5 h-5" />
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


// update


import { useState } from "react";
import {
  ClipboardList,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
} from "../lib/icons";
import { Button } from "../components/common/Button";

export function Reports() {
  const [selectedReport, setSelectedReport] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  const reportCategories = [
    {
      title: "Financial Reports",
      icon: DollarSign,
      color: "green",
      reports: [
        "Daily Revenue Report",
        "Monthly Revenue Summary",
        "Department-wise Revenue",
        "Payment Collection Report",
        "Outstanding Invoices",
      ],
    },
    {
      title: "Clinical Reports",
      icon: ClipboardList,
      color: "blue",
      reports: [
        "Patient Admission Report",
        "Discharge Summary Report",
        "Surgery Report",
        "Lab Test Report",
        "Radiology Report",
      ],
    },
    {
      title: "Operational Reports",
      icon: TrendingUp,
      color: "purple",
      reports: [
        "Appointment Statistics",
        "Bed Occupancy Report",
        "Staff Attendance Report",
        "Department Performance",
        "Service Utilization Report",
      ],
    },
    {
      title: "Administrative Reports",
      icon: Users,
      color: "orange",
      reports: [
        "Patient Demographics",
        "Staff Directory",
        "Inventory Status",
        "Compliance Report",
        "Audit Trail Report",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mt-10">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Generate and download various hospital reports
          </p>
        </div>
      </div>

      {/* Top Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Reports",
            value: "1,234",
            icon: ClipboardList,
            color: "blue",
          },
          { label: "This Month", value: "156", icon: Calendar, color: "green" },
          {
            label: "Downloaded",
            value: "892",
            icon: Download,
            color: "purple",
          },
          {
            label: "Scheduled",
            value: "24",
            icon: TrendingUp,
            color: "orange",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-5 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Generate Report Section */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Generate Report
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="">Select a report type</option>
              {reportCategories.map((category) =>
                category.reports.map((report, index) => (
                  <option key={`${category.title}-${index}`} value={report}>
                    {report}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* From Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange({ ...dateRange, from: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>

          {/* To Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange({ ...dateRange, to: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <Button icon={Download}>Generate & Download</Button>
          <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            Preview
          </button>
        </div>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportCategories.map((category, index) => (
          <div
            key={index}
            className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 bg-${category.color}-100 rounded-lg`}>
                <category.icon
                  className={`w-6 h-6 text-${category.color}-600`}
                />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                {category.title}
              </h2>
            </div>

            <div className="space-y-2">
              {category.reports.map((report, reportIndex) => (
                <button
                  key={reportIndex}
                  onClick={() => setSelectedReport(report)}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors group text-sm sm:text-base"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 group-hover:text-blue-600">
                      {report}
                    </span>
                    <Download className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Reports */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Reports</h2>
        <div className="space-y-3">
          {[
            {
              name: "Daily Revenue Report",
              date: "2024-10-28",
              size: "2.4 MB",
            },
            {
              name: "Patient Admission Report",
              date: "2024-10-28",
              size: "1.8 MB",
            },
            {
              name: "Staff Attendance Report",
              date: "2024-10-27",
              size: "890 KB",
            },
            {
              name: "Department Performance",
              date: "2024-10-27",
              size: "3.2 MB",
            },
          ].map((report, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ClipboardList className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm sm:text-base">
                    {report.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Generated on {report.date} • {report.size}
                  </p>
                </div>
              </div>
              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors self-start sm:self-auto">
                <Download className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
