// src/pages/Radiology.jsx
import { useEffect, useState } from "react";
import { Activity, Search, Check, X } from "../lib/icons.js";
import { DataTable } from "../components/common/DataTable.jsx";
import base_url from "../utils/baseurl";
import axios from "axios";

export function RadiologyRequest() {
  const [searchQuery, setSearchQuery] = useState("");
  const [radiologyOrders, setRadiologyOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Normalize status for UI (convert API status to consistent casing)
  const normalizeStatus = (status) => {
    return status?.toUpperCase().replace(/\s+/g, "_") || "UNKNOWN";
  };

  // Status Color Mapping (using normalized status)
  const getStatusColor = (status) => {
    const normalized = normalizeStatus(status);
    switch (normalized) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-purple-100 text-purple-800";
      case "REPORTED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // === FETCH REAL RADIOLOGY ORDERS FROM API ===
  const fetchRadiologyOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${base_url}/radiology/requests`);
      // API returns array directly (not wrapped in { data: [...] })
      const data = Array.isArray(response.data) ? response.data : [];
      setRadiologyOrders(data);
    } catch (error) {
      console.error("Error fetching radiology orders:", error);
      setRadiologyOrders([]);
      alert("Failed to load radiology requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRadiologyOrders();
  }, []);

  // === ACCEPT REQUEST (Update status to "In Progress") ===
  const handleAccept = async (id) => {
    if (!window.confirm("Are you sure you want to accept this request?")) return;
    try {
      await axios.patch(`${base_url}/radiology/requests/${id}/accept`);
      // Optimistic UI update
      setRadiologyOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: "In Progress" } : order
        )
      );
    } catch (error) {
      console.error("Error accepting request:", error);
      alert("Failed to accept the request.");
      // Re-fetch to sync state
      fetchRadiologyOrders();
    }
  };

  // === REJECT REQUEST ===
  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this radiology request?")) return;
    try {
      await axios.patch(`${base_url}/radiology/requests/${id}/reject`);
      // Optimistic UI update
      setRadiologyOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: "Rejected" } : order
        )
      );
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Failed to reject the request.");
      fetchRadiologyOrders();
    }
  };

  // === FILTER DATA ===
  const filteredOrders = radiologyOrders.filter((order) =>
    (order.doctor_name || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
    (order.patient_name || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
    (order.test_name || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
    (order.id?.toString() || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Display status in readable format
  const readableStatus = (status) => {
    return status
      ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
      : "Unknown";
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">
            Radiology Requests
          </h1>
          <p className="text-gray-600 mt-1">
            View and manage radiology imaging requests
          </p>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by doctor, patient, or test..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading radiology requests...</div>
        ) : (
          <DataTable
            data={filteredOrders}
            columns={[
              {
                header: "Order ID",
                accessor: (row) => `RAD${String(row.id).padStart(3, "0")}`,
              },
              { header: "Doctor", accessor: "doctor_name" },
              { header: "Patient", accessor: "patient_name" },
              { header: "Study Type", accessor: "test_name" },
              {
                header: "Status",
                accessor: (row) => (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      row.status
                    )}`}
                  >
                    {readableStatus(row.status)}
                  </span>
                ),
              },
              {
                header: "Actions",
                accessor: (row) => {
                  const isPending = row.status?.toLowerCase() === "pending";
                  return (
                    <div className="flex gap-2">
                      {isPending ? (
                        <>
                          <button
                            onClick={() => handleAccept(row.id)}
                            className="text-green-600 hover:text-green-800 flex items-center gap-1 text-sm"
                            title="Accept"
                          >
                            <Check className="w-4 h-4" />
                            <span className="hidden sm:inline">Accept</span>
                          </button>
                          <button
                            onClick={() => handleReject(row.id)}
                            className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                            <span className="hidden sm:inline">Reject</span>
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-500 text-sm">
                          {readableStatus(row.status)}
                        </span>
                      )}
                    </div>
                  );
                },
              },
            ]}
          />
        )}
      </div>
    </div>
  );
}