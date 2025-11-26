import React, { useState, useEffect } from "react";
import { FlaskConical, Search, Check, X } from "../lib/icons.js";
// import { Button } from "../components/common/Button.jsx";
import { DataTable } from "../components/common/DataTable.jsx";

export function LabRequest() {
  const [searchQuery, setSearchQuery] = useState("");
  const [labTests, setLabTests] = useState([]);

  // Status Color
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "ACCEPTED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // === MOCK DATA FOR LAB ORDERS ===
  const mockLabTests = [
    { id: 1, doctorName: "Dr. Smith", patientName: "John Doe", testName: "Blood Test", status: "PENDING" },
    { id: 2, doctorName: "Dr. Johnson", patientName: "Jane Smith", testName: "X-Ray", status: "PENDING" },
    { id: 3, doctorName: "Dr. Williams", patientName: "Robert Johnson", testName: "MRI Scan", status: "ACCEPTED" },
    { id: 4, doctorName: "Dr. Brown", patientName: "Emily Davis", testName: "Urine Test", status: "REJECTED" },
    { id: 5, doctorName: "Dr. Miller", patientName: "Michael Wilson", testName: "ECG", status: "PENDING" },
    { id: 6, doctorName: "Dr. Davis", patientName: "Sarah Taylor", testName: "CT Scan", status: "ACCEPTED" },
  ];

  // === FETCH LAB ORDERS (using mock data) ===
  const fetchLabOrders = async () => {
    try {
      // Simulating API delay
      setTimeout(() => {
        setLabTests(mockLabTests);
      }, 500);
    } catch (error) {
      console.error("Error fetching lab orders:", error);
    }
  };

  useEffect(() => {
    fetchLabOrders();
  }, []);

  // === ACCEPT LAB REQUEST ===
  const handleAccept = async (id) => {
    try {
      // Update the status in the local state
      setLabTests(prevTests => 
        prevTests.map(test => 
          test.id === id ? { ...test, status: "ACCEPTED" } : test
        )
      );
    } catch (error) {
      console.error("Error accepting lab request:", error);
    }
  };

  // === REJECT LAB REQUEST ===
  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this lab request?")) return;
    try {
      // Update the status in the local state
      setLabTests(prevTests => 
        prevTests.map(test => 
          test.id === id ? { ...test, status: "REJECTED" } : test
        )
      );
    } catch (error) {
      console.error("Error rejecting lab request:", error);
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

        <DataTable
          data={filteredTests}
          columns={[
            { header: "ID", accessor: "id" },
            { header: "Doctor", accessor: "doctorName" },
            { header: "Patient", accessor: "patientName" },
            { header: "Test Name", accessor: "testName" },
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
                      {row.status === "ACCEPTED" ? "Accepted" : "Rejected"}
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