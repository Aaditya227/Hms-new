// import {
//   FlaskConical,
//   Clock,
//   CheckCircle,
//   AlertCircle,
//   Upload,
//   FileText,
// } from "../../lib/icons";
// import { StatsCard } from "../../components/common/StatsCard";
// import { Button } from "../../components/common/Button";
// import { DataTable } from "../../components/common/DataTable";

// export function LabTechDashboard() {
//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-display font-bold text-gray-900">
//             Laboratory Dashboard
//           </h1>
//           <p className="text-gray-600 mt-1">Test management and results</p>
//         </div>
//         <div className="flex gap-3">
//           <Button variant="outline" icon={FlaskConical}>
//             Collect Sample
//           </Button>
//           <Button variant="primary" icon={Upload}>
//             Upload Results
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatsCard
//           title="Pending Tests"
//           value="23"
//           icon={Clock}
//           color="orange"
//         />
//         <StatsCard
//           title="In Progress"
//           value="15"
//           icon={FlaskConical}
//           color="purple"
//         />
//         <StatsCard
//           title="Completed Today"
//           value="42"
//           icon={CheckCircle}
//           color="green"
//         />
//         <StatsCard
//           title="Critical Results"
//           value="3"
//           icon={AlertCircle}
//           color="red"
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//           <h2 className="text-xl font-bold text-gray-900 mb-4">
//             Pending Sample Collection
//           </h2>
//           <div className="space-y-3">
//             {[1, 2, 3, 4, 5].map((i) => (
//               <div
//                 key={i}
//                 className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
//               >
//                 <div className="flex items-start justify-between mb-2">
//                   <div>
//                     <p className="font-medium text-gray-900">
//                       Order #{3000 + i}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       Patient: John Doe - UPID: P{1000 + i}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       Ordered by: Dr. Smith
//                     </p>
//                   </div>
//                   <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-medium">
//                     Urgent
//                   </span>
//                 </div>
//                 <div className="mb-3">
//                   <p className="text-sm font-medium">Tests:</p>
//                   <p className="text-sm">• Complete Blood Count (CBC)</p>
//                   <p className="text-sm">• Blood Sugar (Fasting)</p>
//                 </div>
//                 <div className="flex gap-2">
//                   <Button size="sm" variant="primary" className="flex-1">
//                     Collect Sample
//                   </Button>
//                   <Button size="sm" variant="outline">
//                     View Order
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="space-y-6">
//           <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">
//               Tests In Progress
//             </h2>
//             <div className="space-y-3">
//               {[1, 2, 3].map((i) => (
//                 <div key={i} className="p-3 bg-gray-50 rounded-lg">
//                   <div className="flex items-center justify-between mb-1">
//                     <p className="font-medium text-gray-900">
//                       Sample #{4000 + i}
//                     </p>
//                     <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
//                       Processing
//                     </span>
//                   </div>
//                   <p className="text-sm text-gray-600">
//                     CBC - Patient: Jane Smith
//                   </p>
//                   <div className="mt-2 bg-gray-200 rounded-full h-2">
//                     <div
//                       className="bg-hospital-purple rounded-full h-2"
//                       style={{ width: `${30 + i * 20}%` }}
//                     ></div>
//                   </div>
//                   <p className="text-xs text-gray-500 mt-1">
//                     Estimated completion: {i + 1} hours
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">
//               Critical Results
//             </h2>
//             <div className="space-y-2">
//               {[1, 2, 3].map((i) => (
//                 <div
//                   key={i}
//                   className="p-3 bg-error-50 border border-error-200 rounded-lg"
//                 >
//                   <div className="flex items-start gap-2">
//                     <AlertCircle className="w-5 h-5 text-error-600 flex-shrink-0 mt-0.5" />
//                     <div className="flex-1">
//                       <p className="font-medium text-error-900">
//                         Sample #{5000 + i} - Abnormal
//                       </p>
//                       <p className="text-sm text-error-700">
//                         Patient needs immediate attention
//                       </p>
//                       <Button size="sm" variant="danger" className="mt-2">
//                         Notify Doctor
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//         <h2 className="text-xl font-bold text-gray-900 mb-4">
//           Completed Tests Today
//         </h2>
//         <DataTable
//           data={[]}
//           columns={[
//             { header: "Sample ID", accessor: "sampleId" },
//             { header: "Patient", accessor: "patient" },
//             { header: "Test Type", accessor: "testType" },
//             { header: "Result Status", accessor: "status" },
//             { header: "Completed At", accessor: "completedAt" },
//             { header: "Actions", accessor: "actions" },
//           ]}
//         />
//       </div>
//     </div>
//   );
// }



import {
  FlaskConical,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  FileText,
} from "../../lib/icons";
import { StatsCard } from "../../components/common/StatsCard";
import { Button } from "../../components/common/Button";
import { DataTable } from "../../components/common/DataTable";

export function LabTechDashboard() {
  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
            Laboratory Dashboard
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Test management and results
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button variant="outline" icon={FlaskConical}>
            Collect Sample
          </Button>
          <Button variant="primary" icon={Upload}>
            Upload Results
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard title="Pending Tests" value="23" icon={Clock} color="orange" />
        <StatsCard title="In Progress" value="15" icon={FlaskConical} color="purple" />
        <StatsCard title="Completed Today" value="42" icon={CheckCircle} color="green" />
        <StatsCard title="Critical Results" value="3" icon={AlertCircle} color="red" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Left Section */}
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
            Pending Sample Collection
          </h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                  <div>
                    <p className="font-medium text-gray-900">Order #{3000 + i}</p>
                    <p className="text-sm text-gray-600">
                      Patient: John Doe - UPID: P{1000 + i}
                    </p>
                    <p className="text-sm text-gray-600">
                      Ordered by: Dr. Smith
                    </p>
                  </div>
                  <span className="self-start sm:self-center px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-medium">
                    Urgent
                  </span>
                </div>
                <div className="mb-3">
                  <p className="text-sm font-medium">Tests:</p>
                  <p className="text-sm">• Complete Blood Count (CBC)</p>
                  <p className="text-sm">• Blood Sugar (Fasting)</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button size="sm" variant="primary" className="flex-1">
                    Collect Sample
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    View Order
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-4 sm:space-y-6">
          {/* Tests In Progress */}
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              Tests In Progress
            </h2>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex flex-wrap items-center justify-between mb-1">
                    <p className="font-medium text-gray-900">
                      Sample #{4000 + i}
                    </p>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full mt-1 sm:mt-0">
                      Processing
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    CBC - Patient: Jane Smith
                  </p>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-hospital-purple rounded-full h-2"
                      style={{ width: `${30 + i * 20}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Estimated completion: {i + 1} hours
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Results */}
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              Critical Results
            </h2>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-3 bg-error-50 border border-error-200 rounded-lg"
                >
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-error-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-error-900">
                        Sample #{5000 + i} - Abnormal
                      </p>
                      <p className="text-sm text-error-700">
                        Patient needs immediate attention
                      </p>
                      <Button size="sm" variant="danger" className="mt-2 w-full sm:w-auto">
                        Notify Doctor
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Completed Tests Table */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100 overflow-x-auto">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
          Completed Tests Today
        </h2>
        <div className="min-w-[600px]">
          <DataTable
            data={[]}
            columns={[
              { header: "Sample ID", accessor: "sampleId" },
              { header: "Patient", accessor: "patient" },
              { header: "Test Type", accessor: "testType" },
              { header: "Result Status", accessor: "status" },
              { header: "Completed At", accessor: "completedAt" },
              { header: "Actions", accessor: "actions" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
