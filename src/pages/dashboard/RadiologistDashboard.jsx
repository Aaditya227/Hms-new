// import {
//   Activity,
//   Image,
//   Upload,
//   Clock,
//   CheckCircle,
//   FileText,
// } from "../../lib/icons";
// import { StatsCard } from "../../components/common/StatsCard";
// import { Button } from "../../components/common/Button";
// import { DataTable } from "../../components/common/DataTable";

// export function RadiologistDashboard() {
//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-display font-bold text-gray-900">
//             Radiology Dashboard
//           </h1>
//           <p className="text-gray-600 mt-1">Imaging requests and reporting</p>
//         </div>
//         <div className="flex gap-3">
//           <Button variant="outline" icon={Image}>
//             View Images
//           </Button>
//           <Button variant="primary" icon={Upload}>
//             Upload Report
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatsCard
//           title="Pending Scans"
//           value="16"
//           icon={Clock}
//           color="orange"
//         />
//         <StatsCard
//           title="Pending Reports"
//           value="8"
//           icon={FileText}
//           color="purple"
//         />
//         <StatsCard
//           title="Completed Today"
//           value="25"
//           icon={CheckCircle}
//           color="green"
//         />
//         <StatsCard title="Urgent Cases" value="4" icon={Activity} color="red" />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Pending Imaging Requests */}
//         <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//           <h2 className="text-xl font-bold text-gray-900 mb-4">
//             Pending Imaging Requests
//           </h2>
//           <div className="space-y-3 max-h-[500px] overflow-y-auto">
//             {[
//               { type: "X-Ray", body: "Chest", urgent: true },
//               { type: "CT Scan", body: "Brain", urgent: true },
//               { type: "MRI", body: "Spine", urgent: false },
//               { type: "Ultrasound", body: "Abdomen", urgent: false },
//               { type: "X-Ray", body: "Left Knee", urgent: false },
//             ].map((scan, i) => (
//               <div
//                 key={i}
//                 className={`p-4 rounded-lg border-2 ${
//                   scan.urgent
//                     ? "bg-error-50 border-error-500"
//                     : "bg-gray-50 border-gray-200"
//                 }`}
//               >
//                 <div className="flex items-start justify-between mb-2">
//                   <div>
//                     <p className="font-medium text-gray-900">
//                       Request #{6000 + i}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       Patient: John Doe - UPID: P{1000 + i}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       Requested by: Dr. Smith
//                     </p>
//                   </div>
//                   {scan.urgent && (
//                     <span className="px-2 py-1 bg-error-200 text-error-900 rounded-full text-xs font-bold">
//                       URGENT
//                     </span>
//                   )}
//                 </div>
//                 <div className="mb-3">
//                   <p className="text-sm font-medium">
//                     {scan.type} - {scan.body}
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     Requested: Today, 9:30 AM
//                   </p>
//                 </div>
//                 <div className="flex gap-2">
//                   <Button size="sm" variant="primary" className="flex-1">
//                     Start Scan
//                   </Button>
//                   <Button size="sm" variant="outline">
//                     View Details
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Right Column */}
//         <div className="space-y-6">
//           {/* Awaiting Reports */}
//           <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">
//               Awaiting Reports
//             </h2>
//             <div className="space-y-3">
//               {[1, 2, 3, 4].map((i) => (
//                 <div
//                   key={i}
//                   className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <div>
//                       <p className="font-medium text-gray-900">
//                         Scan #{7000 + i}
//                       </p>
//                       <p className="text-sm text-gray-600">CT Scan - Brain</p>
//                       <p className="text-sm text-gray-600">
//                         Patient: Jane Smith
//                       </p>
//                     </div>
//                     <Image className="w-8 h-8 text-blue-600" />
//                   </div>
//                   <div className="flex gap-2 mt-3">
//                     <Button
//                       size="sm"
//                       variant="primary"
//                       className="flex-1"
//                       icon={FileText}
//                     >
//                       Write Report
//                     </Button>
//                     <Button size="sm" variant="outline" icon={Image}>
//                       View Images
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Equipment Status */}
//           <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">
//               Equipment Status
//             </h2>
//             <div className="space-y-2">
//               {[
//                 {
//                   name: "X-Ray Machine A",
//                   status: "Available",
//                   color: "success",
//                 },
//                 { name: "CT Scanner 1", status: "In Use", color: "warning" },
//                 { name: "MRI Scanner", status: "Available", color: "success" },
//                 { name: "Ultrasound 1", status: "Maintenance", color: "error" },
//               ].map((equipment, i) => (
//                 <div
//                   key={i}
//                   className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//                 >
//                   <span className="font-medium text-gray-900">
//                     {equipment.name}
//                   </span>
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-medium ${
//                       equipment.color === "success"
//                         ? "bg-success-100 text-success-700"
//                         : equipment.color === "warning"
//                         ? "bg-warning-100 text-warning-700"
//                         : "bg-error-100 text-error-700"
//                     }`}
//                   >
//                     {equipment.status}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Completed Reports Table */}
//       <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//         <h2 className="text-xl font-bold text-gray-900 mb-4">
//           Completed Reports Today
//         </h2>
//         <DataTable
//           data={[]}
//           columns={[
//             { header: "Report ID", accessor: "reportId" },
//             { header: "Patient", accessor: "patient" },
//             { header: "Scan Type", accessor: "scanType" },
//             { header: "Findings", accessor: "findings" },
//             { header: "Completed At", accessor: "completedAt" },
//             { header: "Actions", accessor: "actions" },
//           ]}
//         />
//       </div>
//     </div>
//   );
// }


import {
  Activity,
  Image,
  Upload,
  Clock,
  CheckCircle,
  FileText,
} from "../../lib/icons";
import { StatsCard } from "../../components/common/StatsCard";
import { Button } from "../../components/common/Button";
import { DataTable } from "../../components/common/DataTable";

export function RadiologistDashboard() {
  return (
    <div className="space-y-6 px-3 sm:px-4 md:px-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
            Radiology Dashboard
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Imaging requests and reporting
          </p>
        </div>
        <div className="flex flex-wrap justify-start sm:justify-end gap-3">
          <Button variant="outline" icon={Image}>
            View Images
          </Button>
          <Button variant="primary" icon={Upload}>
            Upload Report
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard title="Pending Scans" value="16" icon={Clock} color="orange" />
        <StatsCard title="Pending Reports" value="8" icon={FileText} color="purple" />
        <StatsCard title="Completed Today" value="25" icon={CheckCircle} color="green" />
        <StatsCard title="Urgent Cases" value="4" icon={Activity} color="red" />
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Imaging Requests */}
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
            Pending Imaging Requests
          </h2>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {[
              { type: "X-Ray", body: "Chest", urgent: true },
              { type: "CT Scan", body: "Brain", urgent: true },
              { type: "MRI", body: "Spine", urgent: false },
              { type: "Ultrasound", body: "Abdomen", urgent: false },
              { type: "X-Ray", body: "Left Knee", urgent: false },
            ].map((scan, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg border-2 ${
                  scan.urgent
                    ? "bg-error-50 border-error-500"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                  <div>
                    <p className="font-medium text-gray-900">
                      Request #{6000 + i}
                    </p>
                    <p className="text-sm text-gray-600">
                      Patient: John Doe - UPID: P{1000 + i}
                    </p>
                    <p className="text-sm text-gray-600">
                      Requested by: Dr. Smith
                    </p>
                  </div>
                  {scan.urgent && (
                    <span className="self-start sm:self-center px-2 py-1 bg-error-200 text-error-900 rounded-full text-xs font-bold">
                      URGENT
                    </span>
                  )}
                </div>
                <div className="mb-3">
                  <p className="text-sm font-medium">
                    {scan.type} - {scan.body}
                  </p>
                  <p className="text-sm text-gray-600">
                    Requested: Today, 9:30 AM
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button size="sm" variant="primary" className="flex-1">
                    Start Scan
                  </Button>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Awaiting Reports */}
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              Awaiting Reports
            </h2>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                    <div>
                      <p className="font-medium text-gray-900">
                        Scan #{7000 + i}
                      </p>
                      <p className="text-sm text-gray-600">CT Scan - Brain</p>
                      <p className="text-sm text-gray-600">
                        Patient: Jane Smith
                      </p>
                    </div>
                    <Image className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="primary"
                      className="flex-1"
                      icon={FileText}
                    >
                      Write Report
                    </Button>
                    <Button size="sm" variant="outline" icon={Image}>
                      View Images
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment Status */}
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              Equipment Status
            </h2>
            <div className="space-y-2">
              {[
                { name: "X-Ray Machine A", status: "Available", color: "success" },
                { name: "CT Scanner 1", status: "In Use", color: "warning" },
                { name: "MRI Scanner", status: "Available", color: "success" },
                { name: "Ultrasound 1", status: "Maintenance", color: "error" },
              ].map((equipment, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium text-gray-900">
                    {equipment.name}
                  </span>
                  <span
                    className={`mt-1 sm:mt-0 px-3 py-1 rounded-full text-xs font-medium ${
                      equipment.color === "success"
                        ? "bg-success-100 text-success-700"
                        : equipment.color === "warning"
                        ? "bg-warning-100 text-warning-700"
                        : "bg-error-100 text-error-700"
                    }`}
                  >
                    {equipment.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Completed Reports Table */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
          Completed Reports Today
        </h2>
        <div className="overflow-x-auto">
          <DataTable
            data={[]}
            columns={[
              { header: "Report ID", accessor: "reportId" },
              { header: "Patient", accessor: "patient" },
              { header: "Scan Type", accessor: "scanType" },
              { header: "Findings", accessor: "findings" },
              { header: "Completed At", accessor: "completedAt" },
              { header: "Actions", accessor: "actions" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
