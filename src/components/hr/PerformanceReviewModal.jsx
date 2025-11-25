// import { useState } from "react";
// import { Button } from "../common/Button";

// export function PerformanceReviewModal({ isOpen, onClose }) {
//   const [feedback, setFeedback] = useState("");

//   if (!isOpen) return null;

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert("Performance review submitted!");
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
//         <h2 className="text-xl font-bold mb-4">Performance Review</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Feedback / Review
//             </label>
//             <textarea
//               placeholder="Enter feedback..."
//               value={feedback}
//               onChange={(e) => setFeedback(e.target.value)}
//               className="w-full border rounded p-2"
//               rows={4}
//               required
//             ></textarea>
//           </div>
//           <div className="flex justify-end gap-2">
//             <Button variant="outline" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="submit" variant="primary">
//               Submit
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }



import { useState } from "react";
import { Button } from "../common/Button";

export function PerformanceReviewModal({ isOpen, onClose }) {
  const [feedback, setFeedback] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Performance review submitted!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg p-5 sm:p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-center sm:text-left">
          Performance Review
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Feedback Textarea */}
          <div>
            <label className="block text-gray-700 text-sm sm:text-base font-medium mb-1">
              Feedback / Review
            </label>
            <textarea
              placeholder="Enter feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200 text-sm sm:text-base resize-none"
              rows={4}
              required
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
