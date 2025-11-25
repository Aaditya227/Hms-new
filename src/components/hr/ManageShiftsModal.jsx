// import { useState } from "react";
// import { Button } from "../common/Button";

// export function ManageShiftsModal({ isOpen, onClose }) {
//   const [shifts, setShifts] = useState([
//     { name: "Morning", time: "8 AM - 2 PM" },
//     { name: "Evening", time: "2 PM - 8 PM" },
//   ]);

//   if (!isOpen) return null;

//   const addShift = () => {
//     setShifts([...shifts, { name: "Night", time: "8 PM - 8 AM" }]);
//   };

//   return (
//     <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
//         <h2 className="text-xl font-bold mb-4">Manage Shifts</h2>
//         <ul className="space-y-2">
//           {shifts.map((s, i) => (
//             <li key={i} className="border p-2 rounded flex justify-between">
//               <span className="font-medium">{s.name}</span>
//               <span className="text-gray-600 text-sm">{s.time}</span>
//             </li>
//           ))}
//         </ul>
//         <div className="flex justify-end gap-2 mt-4">
//           <Button variant="outline" onClick={onClose}>
//             Close
//           </Button>
//           <Button onClick={addShift} variant="primary">
//             + Add Shift
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }




import { useState } from "react";
import { Button } from "../common/Button";

export function ManageShiftsModal({ isOpen, onClose }) {
  const [shifts, setShifts] = useState([
    { name: "Morning", time: "8 AM - 2 PM" },
    { name: "Evening", time: "2 PM - 8 PM" },
  ]);

  if (!isOpen) return null;

  const addShift = () => {
    setShifts([...shifts, { name: "Night", time: "8 PM - 8 AM" }]);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg p-5 sm:p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-center sm:text-left">
          Manage Shifts
        </h2>

        {/* Shift List */}
        <ul className="space-y-2">
          {shifts.map((s, i) => (
            <li
              key={i}
              className="border p-2 rounded flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 text-center sm:text-left"
            >
              <span className="font-medium text-sm sm:text-base">{s.name}</span>
              <span className="text-gray-600 text-xs sm:text-sm">{s.time}</span>
            </li>
          ))}
        </ul>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-5">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={addShift} variant="primary">
            + Add Shift
          </Button>
        </div>
      </div>
    </div>
  );
}
