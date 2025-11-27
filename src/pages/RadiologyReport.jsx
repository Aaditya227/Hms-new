// src/pages/Radiology.jsx
import React, { useState, useEffect } from "react";
import { Search, Upload, Download, X, FileText } from "../lib/icons.js";
import { DataTable } from "../components/common/DataTable.jsx";
import base_url from "../utils/baseurl";
import axios from "axios";

export function RadiologyReport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [radiologyOrders, setRadiologyOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRadiologyOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${base_url}/radiology/requests`);
      setRadiologyOrders(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching radiology requests:", error);
      setRadiologyOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRadiologyOrders();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    let color = "bg-gray-100 text-gray-800";
    if (status === "Pending") color = "bg-yellow-100 text-yellow-800";
    else if (status === "In Progress") color = "bg-blue-100 text-blue-800";
    else if (status === "Reported") color = "bg-green-100 text-green-800";
    else if (status === "Rejected") color = "bg-red-100 text-red-800";

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {status}
      </span>
    );
  };

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
    String(order.id).includes(searchQuery)
  );

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mt-10">
        <h1 className="text-2xl font-bold text-gray-900">Radiology Report</h1>
        <p className="text-gray-600">Upload and manage radiology imaging reports</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        {/* Search */}
        <div className="mb-6 w-full max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by doctor, patient, or test..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>
        </div>

 {/* Table */}
{loading ? (
  <p className="py-6 text-center text-gray-500">Loading radiology requests...</p>
) : radiologyOrders.length === 0 ? (
  <p className="py-6 text-center text-gray-500">No radiology requests found.</p>
) : (
  <DataTable
    data={filteredOrders}
    columns={[
      {
        header: "Request ID",
        accessor: (row) => `RAD${String(row.id).padStart(3, "0")}`,
      },
      {
        header: "Doctor Name",
        accessor: (row) => row.doctor_name || "-",
      },
      {
        header: "Patient Name",
        accessor: (row) => row.patient_name || "-",
      },
      {
        header: "Test Name",
        accessor: (row) => row.test_name || "-",
      },
      {
        header: "Price",
        accessor: (row) => {
          if (row.price == null) return "-";
          // Format as currency (e.g., $150.00)
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
          }).format(row.price);
        },
      },
      {
        header: "Requested At",
        accessor: (row) => formatDate(row.requested_at),
      },
      {
        header: "Reported At",
        accessor: (row) => (row.report_uploaded_at ? formatDate(row.report_uploaded_at) : "-"),
      },
      {
        header: "Status",
        accessor: (row) => getStatusBadge(row.status),
      },
      {
        header: "Actions",
        accessor: (row) => (
          <div className="flex gap-2">
            {row.status === "Pending" && (
              <button
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                onClick={() => alert(`Upload report for RAD${row.id}`)}
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Upload</span>
              </button>
            )}
            {row.status === "Reported" && (
              <button
                className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1"
                onClick={() => alert(`Download report for RAD${row.id}`)}
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </button>
            )}
          </div>
        ),
      },
    ]}
  />
)}
      </div>
    </div>
  );
}