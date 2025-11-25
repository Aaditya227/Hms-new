// import { useState } from "react";
// import { Button } from "../common/Button";

// export function AddEmployeeModal({ isOpen, onClose, onAdd }) {
//   // Employee form state
//   const [form, setForm] = useState({
//     name: "",
//     role: "",
//     department: "",
//     joinDate: "",
//     email: "",
//     phone: "",
//   });

//   if (!isOpen) return null;

//   // Input change handler
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   // Form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!form.name || !form.role || !form.department) {
//       alert("Please fill all required fields.");
//       return;
//     }

//     // Send data to parent (HRDashboard)
//     if (onAdd) onAdd(form);

//     // Clear and close form
//     setForm({
//       name: "",
//       role: "",
//       department: "",
//       joinDate: "",
//       email: "",
//       phone: "",
//     });
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold text-gray-900">Add New Employee</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-800 text-lg"
//           >
//             ✕
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Full Name */}
//           <div>
//             <label className="block text-gray-700 font-medium mb-1">
//               Full Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="name"
//               placeholder="Enter full name"
//               value={form.name}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
//               required
//             />
//           </div>

//           {/* Role */}
//           <div>
//             <label className="block text-gray-700 font-medium mb-1">
//               Role <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="role"
//               placeholder="e.g., Nurse, Surgeon"
//               value={form.role}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
//               required
//             />
//           </div>

//           {/* Department */}
//           <div>
//             <label className="block text-gray-700 font-medium mb-1">
//               Department <span className="text-red-500">*</span>
//             </label>
//             <select
//               name="department"
//               value={form.department}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
//               required
//             >
//               <option value="">Select Department</option>
//               <option value="Doctors">Doctors</option>
//               <option value="Nursing">Nursing</option>
//               <option value="Administration">Administration</option>
//               <option value="Support Staff">Support Staff</option>
//             </select>
//           </div>

//           {/* Join Date */}
//           <div>
//             <label className="block text-gray-700 font-medium mb-1">
//               Join Date
//             </label>
//             <input
//               type="date"
//               name="joinDate"
//               value={form.joinDate}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-gray-700 font-medium mb-1">Email</label>
//             <input
//               type="email"
//               name="email"
//               placeholder="Enter email address"
//               value={form.email}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
//             />
//           </div>

//           {/* Phone */}
//           <div>
//             <label className="block text-gray-700 font-medium mb-1">
//               Phone Number
//             </label>
//             <input
//               type="tel"
//               name="phone"
//               placeholder="Enter phone number"
//               value={form.phone}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
//             />
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-end gap-3 pt-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={onClose}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               variant="primary"
//             >
//               Save Employee
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }



import { useState } from "react";
import { Button } from "../common/Button";

export function AddEmployeeModal({ isOpen, onClose, onAdd }) {
  const [form, setForm] = useState({
    name: "",
    role: "",
    department: "",
    joinDate: "",
    email: "",
    phone: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.role || !form.department) {
      alert("Please fill all required fields.");
      return;
    }
    if (onAdd) onAdd(form);
    setForm({
      name: "",
      role: "",
      department: "",
      joinDate: "",
      email: "",
      phone: "",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg sm:max-w-md md:max-w-lg lg:max-w-xl p-5 sm:p-6 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Add New Employee
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1 text-sm sm:text-base">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter full name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200 text-sm sm:text-base"
              required
            />
          </div>

          {/* Role */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1 text-sm sm:text-base">
              Role <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="role"
              placeholder="e.g., Nurse, Surgeon"
              value={form.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200 text-sm sm:text-base"
              required
            />
          </div>

          {/* Department */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1 text-sm sm:text-base">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200 text-sm sm:text-base"
              required
            >
              <option value="">Select Department</option>
              <option value="Doctors">Doctors</option>
              <option value="Nursing">Nursing</option>
              <option value="Administration">Administration</option>
              <option value="Support Staff">Support Staff</option>
            </select>
          </div>

          {/* Join Date */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1 text-sm sm:text-base">
              Join Date
            </label>
            <input
              type="date"
              name="joinDate"
              value={form.joinDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200 text-sm sm:text-base"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1 text-sm sm:text-base">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200 text-sm sm:text-base"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1 text-sm sm:text-base">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200 text-sm sm:text-base"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Employee
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
