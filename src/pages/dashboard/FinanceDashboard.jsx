// import {
//   DollarSign,
//   TrendingUp,
//   CreditCard,
//   FileText,
//   Users,
//   Calendar,
// } from "../../lib/icons";
// import { StatsCard } from "../../components/common/StatsCard";
// import { Button } from "../../components/common/Button";
// import { DataTable } from "../../components/common/DataTable";

// export function FinanceDashboard() {
//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-display font-bold text-gray-900">
//             Finance Dashboard
//           </h1>
//           <p className="text-gray-600 mt-1">
//             Revenue, billing, and financial analytics
//           </p>
//         </div>
//         <div className="flex gap-3">
//           <Button variant="outline" icon={FileText}>
//             Generate Report
//           </Button>
//           <Button variant="primary" icon={CreditCard}>
//             Process Payment
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatsCard
//           title="Revenue Today"
//           value="$24,580"
//           icon={DollarSign}
//           color="green"
//           trend={{ value: "+18%", isPositive: true }}
//         />
//         <StatsCard
//           title="Revenue MTD"
//           value="$456,320"
//           icon={TrendingUp}
//           color="purple"
//           trend={{ value: "+22%", isPositive: true }}
//         />
//         <StatsCard
//           title="Pending Payments"
//           value="$12,450"
//           icon={FileText}
//           color="orange"
//         />
//         <StatsCard
//           title="Outstanding Bills"
//           value="28"
//           icon={CreditCard}
//           color="red"
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2">
//           <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100 h-full">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">
//               Revenue Breakdown (This Month)
//             </h2>
//             <div className="space-y-4">
//               {[
//                 {
//                   category: "Consultations",
//                   amount: 125000,
//                   percentage: 27,
//                   color: "bg-hospital-purple",
//                 },
//                 {
//                   category: "Laboratory",
//                   amount: 98000,
//                   percentage: 21,
//                   color: "bg-teal-500",
//                 },
//                 {
//                   category: "Pharmacy",
//                   amount: 112000,
//                   percentage: 25,
//                   color: "bg-blue-500",
//                 },
//                 {
//                   category: "Radiology",
//                   amount: 67000,
//                   percentage: 15,
//                   color: "bg-orange-500",
//                 },
//                 {
//                   category: "Procedures",
//                   amount: 54320,
//                   percentage: 12,
//                   color: "bg-success-500",
//                 },
//               ].map((item, i) => (
//                 <div key={i}>
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="font-medium text-gray-900">
//                       {item.category}
//                     </span>
//                     <span className="font-bold text-gray-900">
//                       ${item.amount.toLocaleString()}
//                     </span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-3">
//                     <div
//                       className={`${item.color} h-3 rounded-full transition-all duration-500`}
//                       style={{ width: `${item.percentage}%` }}
//                     ></div>
//                   </div>
//                   <p className="text-xs text-gray-600 mt-1">
//                     {item.percentage}% of total revenue
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="space-y-6">
//           <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">
//               Quick Stats
//             </h2>
//             <div className="space-y-4">
//               <div className="p-3 bg-success-50 rounded-lg">
//                 <p className="text-sm text-gray-600">Collected Today</p>
//                 <p className="text-2xl font-bold text-success-700">$18,340</p>
//               </div>
//               <div className="p-3 bg-blue-50 rounded-lg">
//                 <p className="text-sm text-gray-600">Average Bill Value</p>
//                 <p className="text-2xl font-bold text-blue-700">$385</p>
//               </div>
//               <div className="p-3 bg-purple-50 rounded-lg">
//                 <p className="text-sm text-gray-600">Transactions Today</p>
//                 <p className="text-2xl font-bold text-purple-700">64</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">
//               Payment Methods
//             </h2>
//             <div className="space-y-2">
//               {[
//                 { method: "Cash", amount: 8420, percentage: 34 },
//                 { method: "Card", amount: 12350, percentage: 50 },
//                 { method: "Insurance", amount: 3810, percentage: 16 },
//               ].map((method, i) => (
//                 <div key={i} className="flex items-center justify-between p-2">
//                   <span className="text-sm text-gray-700">{method.method}</span>
//                   <div className="text-right">
//                     <p className="text-sm font-bold text-gray-900">
//                       ${method.amount.toLocaleString()}
//                     </p>
//                     <p className="text-xs text-gray-600">
//                       {method.percentage}%
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//         <h2 className="text-xl font-bold text-gray-900 mb-4">
//           Pending Payments
//         </h2>
//         <DataTable
//           data={[]}
//           columns={[
//             { header: "Invoice", accessor: "invoice" },
//             { header: "Patient", accessor: "patient" },
//             { header: "Amount", accessor: "amount" },
//             { header: "Due Date", accessor: "dueDate" },
//             { header: "Status", accessor: "status" },
//             { header: "Actions", accessor: "actions" },
//           ]}
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//           <h2 className="text-xl font-bold text-gray-900 mb-4">
//             Top Earning Doctors (MTD)
//           </h2>
//           <div className="space-y-3">
//             {[
//               { name: "Dr. Smith", consultations: 145, revenue: 36250 },
//               { name: "Dr. Johnson", consultations: 132, revenue: 33000 },
//               { name: "Dr. Williams", consultations: 128, revenue: 32000 },
//               { name: "Dr. Brown", consultations: 98, revenue: 24500 },
//             ].map((doctor, i) => (
//               <div
//                 key={i}
//                 className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//               >
//                 <div>
//                   <p className="font-medium text-gray-900">{doctor.name}</p>
//                   <p className="text-sm text-gray-600">
//                     {doctor.consultations} consultations
//                   </p>
//                 </div>
//                 <span className="font-bold text-success-600">
//                   ${doctor.revenue.toLocaleString()}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//           <h2 className="text-xl font-bold text-gray-900 mb-4">
//             Insurance Claims Status
//           </h2>
//           <div className="space-y-3">
//             {[
//               {
//                 status: "Pending",
//                 count: 23,
//                 amount: 45600,
//                 color: "bg-warning-100 text-warning-700",
//               },
//               {
//                 status: "Approved",
//                 count: 45,
//                 amount: 89000,
//                 color: "bg-success-100 text-success-700",
//               },
//               {
//                 status: "Rejected",
//                 count: 5,
//                 amount: 8900,
//                 color: "bg-error-100 text-error-700",
//               },
//               {
//                 status: "Under Review",
//                 count: 12,
//                 amount: 23400,
//                 color: "bg-blue-100 text-blue-700",
//               },
//             ].map((claim, i) => (
//               <div key={i} className={`p-4 rounded-lg ${claim.color}`}>
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="font-bold">{claim.status}</p>
//                     <p className="text-sm">{claim.count} claims</p>
//                   </div>
//                   <span className="text-lg font-bold">
//                     ${claim.amount.toLocaleString()}
//                   </span>
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
  DollarSign,
  TrendingUp,
  CreditCard,
  FileText,
  Users,
  Calendar,
} from "../../lib/icons";
import { StatsCard } from "../../components/common/StatsCard";
import { Button } from "../../components/common/Button";
import { DataTable } from "../../components/common/DataTable";

export function FinanceDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
            Finance Dashboard
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Revenue, billing, and financial analytics
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" icon={FileText} className="w-full sm:w-auto">
            Generate Report
          </Button>
          <Button variant="primary" icon={CreditCard} className="w-full sm:w-auto">
            Process Payment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Revenue Today"
          value="$24,580"
          icon={DollarSign}
          color="green"
          trend={{ value: "+18%", isPositive: true }}
        />
        <StatsCard
          title="Revenue MTD"
          value="$456,320"
          icon={TrendingUp}
          color="purple"
          trend={{ value: "+22%", isPositive: true }}
        />
        <StatsCard
          title="Pending Payments"
          value="$12,450"
          icon={FileText}
          color="orange"
        />
        <StatsCard
          title="Outstanding Bills"
          value="28"
          icon={CreditCard}
          color="red"
        />
      </div>

      {/* Revenue Breakdown + Side Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100 h-full">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              Revenue Breakdown (This Month)
            </h2>
            <div className="space-y-4">
              {[
                {
                  category: "Consultations",
                  amount: 125000,
                  percentage: 27,
                  color: "bg-hospital-purple",
                },
                {
                  category: "Laboratory",
                  amount: 98000,
                  percentage: 21,
                  color: "bg-teal-500",
                },
                {
                  category: "Pharmacy",
                  amount: 112000,
                  percentage: 25,
                  color: "bg-blue-500",
                },
                {
                  category: "Radiology",
                  amount: 67000,
                  percentage: 15,
                  color: "bg-orange-500",
                },
                {
                  category: "Procedures",
                  amount: 54320,
                  percentage: 12,
                  color: "bg-success-500",
                },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">
                      {item.category}
                    </span>
                    <span className="font-bold text-gray-900 text-sm sm:text-base">
                      ${item.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                    <div
                      className={`${item.color} h-2 sm:h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {item.percentage}% of total revenue
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6 order-1 lg:order-2">
          {/* Quick Stats */}
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              Quick Stats
            </h2>
            <div className="space-y-4">
              <div className="p-3 bg-success-50 rounded-lg">
                <p className="text-sm text-gray-600">Collected Today</p>
                <p className="text-xl sm:text-2xl font-bold text-success-700">
                  $18,340
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Average Bill Value</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-700">
                  $385
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Transactions Today</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-700">
                  64
                </p>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              Payment Methods
            </h2>
            <div className="space-y-2">
              {[
                { method: "Cash", amount: 8420, percentage: 34 },
                { method: "Card", amount: 12350, percentage: 50 },
                { method: "Insurance", amount: 3810, percentage: 16 },
              ].map((method, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm text-gray-700">{method.method}</span>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      ${method.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600">
                      {method.percentage}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pending Payments */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100 overflow-x-auto">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
          Pending Payments
        </h2>
        <DataTable
          data={[]}
          columns={[
            { header: "Invoice", accessor: "invoice" },
            { header: "Patient", accessor: "patient" },
            { header: "Amount", accessor: "amount" },
            { header: "Due Date", accessor: "dueDate" },
            { header: "Status", accessor: "status" },
            { header: "Actions", accessor: "actions" },
          ]}
        />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Earning Doctors */}
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
            Top Earning Doctors (MTD)
          </h2>
          <div className="space-y-3">
            {[
              { name: "Dr. Smith", consultations: 145, revenue: 36250 },
              { name: "Dr. Johnson", consultations: 132, revenue: 33000 },
              { name: "Dr. Williams", consultations: 128, revenue: 32000 },
              { name: "Dr. Brown", consultations: 98, revenue: 24500 },
            ].map((doctor, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{doctor.name}</p>
                  <p className="text-sm text-gray-600">
                    {doctor.consultations} consultations
                  </p>
                </div>
                <span className="font-bold text-success-600 text-sm sm:text-base">
                  ${doctor.revenue.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Insurance Claims */}
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
            Insurance Claims Status
          </h2>
          <div className="space-y-3">
            {[
              {
                status: "Pending",
                count: 23,
                amount: 45600,
                color: "bg-warning-100 text-warning-700",
              },
              {
                status: "Approved",
                count: 45,
                amount: 89000,
                color: "bg-success-100 text-success-700",
              },
              {
                status: "Rejected",
                count: 5,
                amount: 8900,
                color: "bg-error-100 text-error-700",
              },
              {
                status: "Under Review",
                count: 12,
                amount: 23400,
                color: "bg-blue-100 text-blue-700",
              },
            ].map((claim, i) => (
              <div key={i} className={`p-4 rounded-lg ${claim.color}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold">{claim.status}</p>
                    <p className="text-sm">{claim.count} claims</p>
                  </div>
                  <span className="text-sm sm:text-lg font-bold">
                    ${claim.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
