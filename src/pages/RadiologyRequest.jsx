// src/pages/Radiology.jsx
import { useEffect, useState } from "react";
import { Activity, Search, Check, X } from "../lib/icons.js";
import { DataTable } from "../components/common/DataTable.jsx";

export function RadiologyRequest() {
  const [searchQuery, setSearchQuery] = useState("");
  const [radiologyOrders, setRadiologyOrders] = useState([]);

  // Status Color
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";
      case "COMPLETED":
        return "bg-purple-100 text-purple-700";
      case "REPORTED":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // === MOCK DATA FOR RADIOLOGY ORDERS ===
  const mockRadiologyOrders = [
    { id: 1, orderId: "RAD001", doctorName: "Dr. Smith", patientName: "John Doe", studyType: "X-Ray", status: "PENDING" },
    { id: 2, orderId: "RAD002", doctorName: "Dr. Johnson", patientName: "Jane Smith", studyType: "CT Scan", status: "PENDING" },
    { id: 3, orderId: "RAD003", doctorName: "Dr. Williams", patientName: "Robert Johnson", studyType: "MRI", status: "IN_PROGRESS" },
    { id: 4, orderId: "RAD004", doctorName: "Dr. Brown", patientName: "Emily Davis", studyType: "Ultrasound", status: "COMPLETED" },
    { id: 5, orderId: "RAD005", doctorName: "Dr. Miller", patientName: "Michael Wilson", studyType: "X-Ray", status: "PENDING" },
    { id: 6, orderId: "RAD006", doctorName: "Dr. Davis", patientName: "Sarah Taylor", studyType: "CT Scan", status: "REPORTED" },
  ];

  // === FETCH RADIOLOGY ORDERS (using mock data) ===
  const fetchRadiologyOrders = async () => {
    try {
      // Simulating API delay
      setTimeout(() => {
        setRadiologyOrders(mockRadiologyOrders);
      }, 500);
    } catch (error) {
      console.error("Error fetching radiology orders:", error);
    }
  };

  useEffect(() => {
    fetchRadiologyOrders();
  }, []);

  // === ACCEPT RADIOLOGY REQUEST ===
  const handleAccept = async (id) => {
    try {
      // Update the status in the local state
      setRadiologyOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === id ? { ...order, status: "IN_PROGRESS" } : order
        )
      );
    } catch (error) {
      console.error("Error accepting radiology request:", error);
    }
  };

  // === REJECT RADIOLOGY REQUEST ===
  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this radiology request?")) return;
    try {
      // Update the status in the local state
      setRadiologyOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === id ? { ...order, status: "REJECTED" } : order
        )
      );
    } catch (error) {
      console.error("Error rejecting radiology request:", error);
    }
  };

  // === FILTER DATA ===
  const filteredOrders = radiologyOrders.filter(
    (order) =>
      order.doctorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.studyType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">Radiology Requests</h1>
          <p className="text-gray-600 mt-1">View and manage radiology imaging requests</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search radiology requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <DataTable
          data={filteredOrders}
          columns={[
            { header: "Order ID", accessor: "orderId" },
            { header: "Doctor", accessor: "doctorName" },
            { header: "Patient", accessor: "patientName" },
            { header: "Study Type", accessor: "studyType" },
            {
              header: "Status",
              accessor: (row) => (
                <span
                  className={`px-3 py-1 rounded-full text-md font-medium ${getStatusColor(row.status)}`}
                >
                  {row.status.replace("_", " ")}
                </span>
              ),
            },
            {
              header: "Actions",
              accessor: (row) => (
                <div className="flex gap-2">
                  {row.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleAccept(row.id)}
                        className="text-green-600 hover:text-green-800 flex items-center gap-1"
                        title="Accept"
                      >
                        <Check className="w-4 h-4" />
                        <span className="hidden sm:inline">Accept</span>
                      </button>
                      <button
                        onClick={() => handleReject(row.id)}
                        className="text-red-600 hover:text-red-800 flex items-center gap-1"
                        title="Reject"
                      >
                        <X className="w-4 h-4" />
                        <span className="hidden sm:inline">Reject</span>
                      </button>
                    </>
                  )}
                  {row.status !== "PENDING" && (
                    <span className="text-gray-500 text-sm">
                      {row.status === "IN_PROGRESS" ? "In Progress" : 
                       row.status === "COMPLETED" ? "Completed" :
                       row.status === "REPORTED" ? "Reported" : "Rejected"}
                    </span>
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}