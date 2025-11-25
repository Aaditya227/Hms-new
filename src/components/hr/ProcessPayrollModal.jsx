// import { useState } from "react";
// import { Button } from "../common/Button";

// export function ProcessPayrollModal({ isOpen, onClose }) {
//   const [isProcessing, setProcessing] = useState(false);

//   if (!isOpen) return null;

//   const handleProcess = () => {
//     setProcessing(true);
//     setTimeout(() => {
//       setProcessing(false);
//       alert("Payroll processed successfully!");
//       onClose();
//     }, 1500);
//   };

//   return (
//     <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
//         <h2 className="text-xl font-bold mb-4">Process Payroll</h2>
//         <p className="text-gray-700 mb-4">
//           This will calculate and release salaries for all employees for this
//           month.
//         </p>
//         <div className="flex justify-end gap-2">
//           <Button variant="outline" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button
//             variant="primary"
//             onClick={handleProcess}
//             disabled={isProcessing}
//           >
//             {isProcessing ? "Processing..." : "Confirm"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }



import { useState } from "react";
import { Button } from "../common/Button";

export function ProcessPayrollModal({ isOpen, onClose }) {
  const [isProcessing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const handleProcess = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      alert("Payroll processed successfully!");
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg p-5 sm:p-6 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center sm:text-left">
          Process Payroll
        </h2>

        {/* Description */}
        <p className="text-gray-700 text-sm sm:text-base mb-4 sm:mb-5 text-center sm:text-left">
          This will calculate and release salaries for all employees for this month.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleProcess}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Confirm"}
          </Button>
        </div>
      </div>
    </div>
  );
}
