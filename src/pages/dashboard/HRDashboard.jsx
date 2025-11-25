// import { useState } from "react";
// import {
//   Users,
//   UserPlus,
//   Calendar,
//   DollarSign,
//   Clock,
//   Award,
//   Eye,
// } from "../../lib/icons";
// import { StatsCard } from "../../components/common/StatsCard";
// import { Button } from "../../components/common/Button";
// import { DataTable } from "../../components/common/DataTable";

// import { AddEmployeeModal } from "../../components/hr/AddEmployeeModal";
// import { ManageShiftsModal } from "../../components/hr/ManageShiftsModal";
// import { ProcessPayrollModal } from "../../components/hr/ProcessPayrollModal";
// import { PerformanceReviewModal } from "../../components/hr/PerformanceReviewModal";

// export default function HRDashboard() {
//   // ✅ Modal States
//   const [showAddEmployee, setShowAddEmployee] = useState(false);
//   const [showManageShifts, setShowManageShifts] = useState(false);
//   const [showProcessPayroll, setShowProcessPayroll] = useState(false);
//   const [showPerformanceReview, setShowPerformanceReview] = useState(false);
//   const [showAllStaff, setShowAllStaff] = useState(false);

//   // ✅ Employee State
//   const [allStaff, setAllStaff] = useState([
//     { name: "Dr. Sarah Lee", role: "Surgeon", department: "Doctors", joinDate: "2024-10-15" },
//     { name: "John Doe", role: "Nurse", department: "Nursing", joinDate: "2024-10-22" },
//     { name: "Mary Johnson", role: "HR Assistant", department: "Admin", joinDate: "2024-10-25" },
//   ]);

//   // ✅ Callback from Modal
//   const handleAddEmployee = (newEmp) => {
//     setAllStaff((prev) => [...prev, newEmp]);
//   };

//   // ✅ Mock Data
//   const staffDepartments = [
//     { dept: "Doctors", count: 42, color: "bg-hospital-purple" },
//     { dept: "Nurses", count: 68, color: "bg-teal-500" },
//     { dept: "Administration", count: 18, color: "bg-blue-500" },
//     { dept: "Support Staff", count: 28, color: "bg-orange-500" },
//   ];

//   const leaveRequests = [
//     { name: "Dr. John Smith", period: "Dec 25-27, 2024", reason: "Personal" },
//     { name: "Nurse Emily Brown", period: "Dec 29-31, 2024", reason: "Family Function" },
//     { name: "Mr. Robert Wilson", period: "Jan 3-4, 2025", reason: "Medical" },
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-display font-bold text-gray-900">
//             Human Resources
//           </h1>
//           <p className="text-gray-600 mt-1">Staff management and payroll overview</p>
//         </div>
//         <div className="flex gap-3">
//           <Button variant="outline" icon={Calendar} onClick={() => setShowManageShifts(true)}>
//             Manage Shifts
//           </Button>
//           <Button variant="primary" icon={UserPlus} onClick={() => setShowAddEmployee(true)}>
//             Add Employee
//           </Button>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatsCard title="Total Staff" value={allStaff.length} icon={Users} color="purple" />
//         <StatsCard title="On Duty Today" value="124" icon={Clock} color="teal" />
//         <StatsCard title="On Leave" value="8" icon={Calendar} color="orange" />
//         <StatsCard title="Payroll (MTD)" value="$245K" icon={DollarSign} color="green" />
//       </div>

//       {/* Main Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left Side */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Staff by Department */}
//           <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">Staff by Department</h2>
//             <div className="space-y-3">
//               {staffDepartments.map((dept, i) => (
//                 <div key={i} className="flex items-center gap-4">
//                   <div className="flex-1">
//                     <div className="flex items-center justify-between mb-1">
//                       <span className="font-medium text-gray-900">{dept.dept}</span>
//                       <span className="font-bold text-gray-900">{dept.count}</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-3">
//                       <div
//                         className={`${dept.color} h-3 rounded-full`}
//                         style={{ width: `${(dept.count / 156) * 100}%` }}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Employee Table */}
//           <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">All Employees</h2>
//             <DataTable
//               data={allStaff}
//               columns={[
//                 { header: "Name", accessor: "name" },
//                 { header: "Role", accessor: "role" },
//                 { header: "Department", accessor: "department" },
//                 { header: "Join Date", accessor: "joinDate" },
//               ]}
//             />
//           </div>
//         </div>

//         {/* Right Side */}
//         <div className="space-y-6">
//           {/* Leave Requests */}
//           <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">Leave Requests</h2>
//             <div className="space-y-3">
//               {leaveRequests.map((req, i) => (
//                 <div key={i} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                   <p className="font-medium text-gray-900">{req.name}</p>
//                   <p className="text-sm text-gray-600">Leave: {req.period}</p>
//                   <p className="text-sm text-gray-600">Reason: {req.reason}</p>
//                   <div className="flex gap-2 mt-2">
//                     <Button size="sm" variant="success" onClick={() => alert(`Approved leave for ${req.name}`)}>
//                       Approve
//                     </Button>
//                     <Button size="sm" variant="danger" onClick={() => alert(`Rejected leave for ${req.name}`)}>
//                       Reject
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Quick Actions */}
//           <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
//             <div className="space-y-2">
//               <Button variant="outline" icon={Eye} onClick={() => setShowAllStaff(true)} className="w-full justify-start">
//                 View All Staff
//               </Button>
//               <Button variant="outline" icon={Calendar} onClick={() => setShowManageShifts(true)} className="w-full justify-start">
//                 Shift Management
//               </Button>
//               <Button variant="outline" icon={DollarSign} onClick={() => setShowProcessPayroll(true)} className="w-full justify-start">
//                 Process Payroll
//               </Button>
//               <Button variant="outline" icon={Award} onClick={() => setShowPerformanceReview(true)} className="w-full justify-start">
//                 Performance Reviews
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ✅ Modals */}
//       <AddEmployeeModal
//         isOpen={showAddEmployee}
//         onClose={() => setShowAddEmployee(false)}
//         onAdd={handleAddEmployee}
//       />
//       <ManageShiftsModal isOpen={showManageShifts} onClose={() => setShowManageShifts(false)} />
//       <ProcessPayrollModal isOpen={showProcessPayroll} onClose={() => setShowProcessPayroll(false)} />
//       <PerformanceReviewModal isOpen={showPerformanceReview} onClose={() => setShowPerformanceReview(false)} />

//       {/* All Staff Modal */}
//       {showAllStaff && (
//         <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6">
//             <h2 className="text-xl font-bold mb-4">All Staff Members</h2>
//             <DataTable
//               data={allStaff}
//               columns={[
//                 { header: "Name", accessor: "name" },
//                 { header: "Role", accessor: "role" },
//                 { header: "Department", accessor: "department" },
//               ]}
//             />
//             <div className="flex justify-end mt-4">
//               <Button variant="outline" onClick={() => setShowAllStaff(false)}>
//                 Close
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import {
  Users,
  UserPlus,
  Calendar,
  DollarSign,
  Clock,
  Award,
  Eye,
} from "../../lib/icons";
import { StatsCard } from "../../components/common/StatsCard";
import { Button } from "../../components/common/Button";
import { DataTable } from "../../components/common/DataTable";

import { AddEmployeeModal } from "../../components/hr/AddEmployeeModal";
import { ManageShiftsModal } from "../../components/hr/ManageShiftsModal";
import { ProcessPayrollModal } from "../../components/hr/ProcessPayrollModal";
import { PerformanceReviewModal } from "../../components/hr/PerformanceReviewModal";

export default function HRDashboard() {
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showManageShifts, setShowManageShifts] = useState(false);
  const [showProcessPayroll, setShowProcessPayroll] = useState(false);
  const [showPerformanceReview, setShowPerformanceReview] = useState(false);
  const [showAllStaff, setShowAllStaff] = useState(false);

  const [allStaff, setAllStaff] = useState([
    { name: "Dr. Sarah Lee", role: "Surgeon", department: "Doctors", joinDate: "2024-10-15" },
    { name: "John Doe", role: "Nurse", department: "Nursing", joinDate: "2024-10-22" },
    { name: "Mary Johnson", role: "HR Assistant", department: "Admin", joinDate: "2024-10-25" },
  ]);

  const handleAddEmployee = (newEmp) => {
    setAllStaff((prev) => [...prev, newEmp]);
  };

  const staffDepartments = [
    { dept: "Doctors", count: 42, color: "bg-hospital-purple" },
    { dept: "Nurses", count: 68, color: "bg-teal-500" },
    { dept: "Administration", count: 18, color: "bg-blue-500" },
    { dept: "Support Staff", count: 28, color: "bg-orange-500" },
  ];

  const leaveRequests = [
    { name: "Dr. John Smith", period: "Dec 25-27, 2024", reason: "Personal" },
    { name: "Nurse Emily Brown", period: "Dec 29-31, 2024", reason: "Family Function" },
    { name: "Mr. Robert Wilson", period: "Jan 3-4, 2025", reason: "Medical" },
  ];

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
            Human Resources
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Staff management and payroll overview
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button
            variant="outline"
            icon={Calendar}
            onClick={() => setShowManageShifts(true)}
          >
            Manage Shifts
          </Button>
          <Button
            variant="primary"
            icon={UserPlus}
            onClick={() => setShowAddEmployee(true)}
          >
            Add Employee
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard title="Total Staff" value={allStaff.length} icon={Users} color="purple" />
        <StatsCard title="On Duty Today" value="124" icon={Clock} color="teal" />
        <StatsCard title="On Leave" value="8" icon={Calendar} color="orange" />
        <StatsCard title="Payroll (MTD)" value="$245K" icon={DollarSign} color="green" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Side */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Staff by Department */}
          <div className="bg-white rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              Staff by Department
            </h2>
            <div className="space-y-3">
              {staffDepartments.map((dept, i) => (
                <div key={i} className="flex items-center gap-3 sm:gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900 text-sm sm:text-base">{dept.dept}</span>
                      <span className="font-bold text-gray-900 text-sm sm:text-base">{dept.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                      <div
                        className={`${dept.color} h-2 sm:h-3 rounded-full`}
                        style={{ width: `${(dept.count / 156) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Employee Table */}
          <div className="bg-white rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100 overflow-x-auto">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              All Employees
            </h2>
            <div className="min-w-[600px]">
              <DataTable
                data={allStaff}
                columns={[
                  { header: "Name", accessor: "name" },
                  { header: "Role", accessor: "role" },
                  { header: "Department", accessor: "department" },
                  { header: "Join Date", accessor: "joinDate" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-4 sm:space-y-6">
          {/* Leave Requests */}
          <div className="bg-white rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              Leave Requests
            </h2>
            <div className="space-y-3">
              {leaveRequests.map((req, i) => (
                <div key={i} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="font-medium text-gray-900">{req.name}</p>
                  <p className="text-sm text-gray-600">Leave: {req.period}</p>
                  <p className="text-sm text-gray-600">Reason: {req.reason}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => alert(`Approved leave for ${req.name}`)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => alert(`Rejected leave for ${req.name}`)}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <Button
                variant="outline"
                icon={Eye}
                onClick={() => setShowAllStaff(true)}
                className="w-full justify-start"
              >
                View All Staff
              </Button>
              <Button
                variant="outline"
                icon={Calendar}
                onClick={() => setShowManageShifts(true)}
                className="w-full justify-start"
              >
                Shift Management
              </Button>
              <Button
                variant="outline"
                icon={DollarSign}
                onClick={() => setShowProcessPayroll(true)}
                className="w-full justify-start"
              >
                Process Payroll
              </Button>
              <Button
                variant="outline"
                icon={Award}
                onClick={() => setShowPerformanceReview(true)}
                className="w-full justify-start"
              >
                Performance Reviews
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddEmployeeModal
        isOpen={showAddEmployee}
        onClose={() => setShowAddEmployee(false)}
        onAdd={handleAddEmployee}
      />
      <ManageShiftsModal isOpen={showManageShifts} onClose={() => setShowManageShifts(false)} />
      <ProcessPayrollModal isOpen={showProcessPayroll} onClose={() => setShowProcessPayroll(false)} />
      <PerformanceReviewModal isOpen={showPerformanceReview} onClose={() => setShowPerformanceReview(false)} />

      {/* All Staff Modal */}
      {showAllStaff && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-3">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4">All Staff Members</h2>
            <div className="overflow-x-auto">
              <DataTable
                data={allStaff}
                columns={[
                  { header: "Name", accessor: "name" },
                  { header: "Role", accessor: "role" },
                  { header: "Department", accessor: "department" },
                ]}
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setShowAllStaff(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
