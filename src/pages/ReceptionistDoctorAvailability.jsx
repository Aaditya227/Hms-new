import { useState } from "react";
import { Eye } from "lucide-react";

const mockDoctors = [
  {
    id: 1,
    name: "Dr. Rahul Sharma",
    department: "Cardiology",
    status: "AVAILABLE",
    shift: "9:00 AM - 1:00 PM",
    contact: "+91 98765 43210",
    email: "rahul.sharma@hospital.com",
    experience: "10 years",
    education: "MBBS, MD (Cardiology)"
  },
  {
    id: 2,
    name: "Dr. Priya Mehta",
    department: "Gynecology",
    status: "BUSY",
    shift: "10:00 AM - 4:00 PM",
    contact: "+91 98765 43211",
    email: "priya.mehta@hospital.com",
    experience: "8 years",
    education: "MBBS, MS (Obstetrics & Gynecology)"
  },
  {
    id: 3,
    name: "Dr. Arjun Patel",
    department: "Orthopedics",
    status: "ON LEAVE",
    shift: "—",
    contact: "+91 98765 43212",
    email: "arjun.patel@hospital.com",
    experience: "12 years",
    education: "MBBS, MS (Orthopedics)"
  }
];

export default function ReceptionistDoctorAvailability() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleView = (doc) => {
    setSelectedDoctor(doc);
  };

  const statusColor = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "text-green-600 bg-green-100";
      case "BUSY":
        return "text-orange-600 bg-orange-100";
      case "ON LEAVE":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-md">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          🩺 Doctor Availability
        </h2>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse min-w-[700px] text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3">Doctor Name</th>
              <th className="p-3">Department</th>
              <th className="p-3">Status</th>
              <th className="p-3">Shift Timing</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {mockDoctors.map((doc) => (
              <tr key={doc.id} className="border-b hover:bg-purple-50">
                <td className="p-3">{doc.name}</td>
                <td className="p-3">{doc.department}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(
                      doc.status
                    )}`}
                  >
                    {doc.status}
                  </span>
                </td>
                <td>{doc.shift}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleView(doc)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Eye size={18} /> 
                  </button>
                </td>
              </tr>
            ))}

            {mockDoctors.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No doctors available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {mockDoctors.map((doc) => (
          <div
            key={doc.id}
            className="border rounded-lg p-4 shadow-sm hover:bg-purple-50"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-800">{doc.name}</h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(
                  doc.status
                )}`}
              >
                {doc.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              Department: {doc.department}
            </p>
            <p className="text-sm text-gray-600 mb-3">Shift: {doc.shift}</p>

            <button
              onClick={() => handleView(doc)}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
            >
              <Eye size={16} /> View Details
            </button>
          </div>
        ))}

        {mockDoctors.length === 0 && (
          <div className="p-4 text-center text-gray-500 border rounded-lg">
            No doctors available.
          </div>
        )}
      </div>

      {/* DOCTOR DETAILS MODAL */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-[450px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Doctor Details
              </h3>
              <button
                onClick={() => setSelectedDoctor(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xl font-bold">
                  {selectedDoctor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h4 className="font-semibold text-lg">
                    {selectedDoctor.name}
                  </h4>
                  <p className="text-gray-600">
                    {selectedDoctor.department}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(
                      selectedDoctor.status
                    )}`}
                  >
                    {selectedDoctor.status}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Shift</p>
                  <p className="font-medium">{selectedDoctor.shift}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Contact</p>
                  <p className="font-medium">{selectedDoctor.contact}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="font-medium">{selectedDoctor.experience}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-medium">{selectedDoctor.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Education</p>
                <p className="font-medium">{selectedDoctor.education}</p>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
