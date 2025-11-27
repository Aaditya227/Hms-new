import React, { useState, useEffect } from "react";
import { FlaskConical, Search, Check, X } from "../lib/icons.js";
// import { Button } from "../components/common/Button.jsx";
import { DataTable } from "../components/common/DataTable.jsx";
import axiosInstance from "../utils/axiosInstance.js"; // Import the axios instance

export function LabRequest() {
  const [searchQuery, setSearchQuery] = useState("");
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Status Color
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Accepted":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // === FETCH LAB ORDERS ===
  const fetchLabOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/labs/lab-requests");
      // Transform the API data to match the component's expected format
      const transformedData = response.data.map(item => ({
        id: item.id,
        doctorName: item.doctor_name,
        patientName: item.patient_name,
        testName: item.test_name,
        status: item.status,
        price: item.price,
        patientId: item.patient_id,
        testId: item.test_id,
        requestedBy: item.requested_by,
        createdAt: item.created_at
      }));
      setLabTests(transformedData);
    } catch (error) {
      console.error("Error fetching lab orders:", error);
      setError("Failed to fetch lab requests. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabOrders();
  }, []);

  // === ACCEPT LAB REQUEST ===
  const handleAccept = async (id) => {
    try {
      // Update the status in the backend
      await axiosInstance.put(`/labs/lab-requests/${id}`, { status: "Accepted" });
      
      // Update the status in the local state
      setLabTests(prevTests => 
        prevTests.map(test => 
          test.id === id ? { ...test, status: "Accepted" } : test
        )
      );
    } catch (error) {
      console.error("Error accepting lab request:", error);
      alert("Failed to accept the lab request. Please try again.");
    }
  };

  // === REJECT LAB REQUEST ===
  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this lab request?")) return;
    try {
      // Update the status in the backend
      await axiosInstance.put(`/labs/lab-requests/${id}`, { status: "Rejected" });
      
      // Update the status in the local state
      setLabTests(prevTests => 
        prevTests.map(test => 
          test.id === id ? { ...test, status: "Rejected" } : test
        )
      );
    } catch (error) {
      console.error("Error rejecting lab request:", error);
      alert("Failed to reject the lab request. Please try again.");
    }
  };

  // === FILTER DATA ===
  const filteredTests = labTests.filter(
    (t) =>
      t.doctorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.testName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">Laboratory Requests</h1>
          <p className="text-gray-600 mt-1">View and manage lab test requests</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search lab requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <DataTable
            data={filteredTests}
            columns={[
              { header: "ID", accessor: "id" },
              { header: "Doctor", accessor: "doctorName" },
              { header: "Patient", accessor: "patientName" },
              { header: "Test Name", accessor: "testName" },
              { header: "Price", accessor: (row) => `₹${row.price}` },
              {
                header: "Status",
                accessor: (row) => (
                  <span
                    className={`px-3 py-1 rounded-full text-md font-medium ${getStatusColor(row.status)}`}
                  >
                    {row.status}
                  </span>
                ),
              },
              {
                header: "Actions",
                accessor: (row) => (
                  <div className="flex gap-2">
                    {row.status === "Pending" && (
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
                    {row.status !== "Pending" && (
                      <span className="text-gray-500 text-sm">
                        {row.status === "Accepted" ? "Accepted" : "Rejected"}
                      </span>
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
