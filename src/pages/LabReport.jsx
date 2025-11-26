import React, { useState, useEffect } from "react";
import { FlaskConical, Search, Check, X, Upload, FileText, Download } from "../lib/icons.js";
import { DataTable } from "../components/common/DataTable.jsx";

export function LabReport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [labTests, setLabTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [notes, setNotes] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Status Color
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "ACCEPTED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      case "COMPLETED":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // === MOCK DATA FOR LAB ORDERS ===
  const mockLabTests = [
    { id: 1, doctorName: "Dr. Smith", patientName: "John Doe", testName: "Blood Test", status: "ACCEPTED", requestDate: "2023-05-15", price: 120.00 },
    { id: 2, doctorName: "Dr. Johnson", patientName: "Jane Smith", testName: "X-Ray", status: "ACCEPTED", requestDate: "2023-05-16", price: 250.00 },
    { id: 3, doctorName: "Dr. Williams", patientName: "Robert Johnson", testName: "MRI Scan", status: "COMPLETED", requestDate: "2023-05-10", reportDate: "2023-05-12", price: 850.00 },
    { id: 4, doctorName: "Dr. Brown", patientName: "Emily Davis", testName: "Urine Test", status: "REJECTED", requestDate: "2023-05-11", price: 75.00 },
    { id: 5, doctorName: "Dr. Miller", patientName: "Michael Wilson", testName: "ECG", status: "ACCEPTED", requestDate: "2023-05-17", price: 150.00 },
    { id: 6, doctorName: "Dr. Davis", patientName: "Sarah Taylor", testName: "CT Scan", status: "COMPLETED", requestDate: "2023-05-08", reportDate: "2023-05-09", price: 650.00 },
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

  // === HANDLE FILE UPLOAD ===
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // === UPLOAD REPORT ===
  const handleUploadReport = async () => {
    if (!selectedFile || !selectedTest) return;
    
    setIsUploading(true);
    
    try {
      // Simulate API call
      setTimeout(() => {
        // Update the status in the local state
        setLabTests(prevTests => 
          prevTests.map(test => 
            test.id === selectedTest.id 
              ? { ...test, status: "COMPLETED", reportDate: new Date().toISOString().split('T')[0] } 
              : test
          )
        );
        
        // Reset form and close modal
        setSelectedFile(null);
        setNotes("");
        setShowUploadModal(false);
        setIsUploading(false);
        
        alert("Report uploaded successfully!");
      }, 1500);
    } catch (error) {
      console.error("Error uploading report:", error);
      setIsUploading(false);
      alert("Error uploading report. Please try again.");
    }
  };

  // === OPEN UPLOAD MODAL ===
  const openUploadModal = (test) => {
    setSelectedTest(test);
    setShowUploadModal(true);
  };

  // === CLOSE UPLOAD MODAL ===
  const closeUploadModal = () => {
    setShowUploadModal(false);
    setSelectedTest(null);
    setSelectedFile(null);
    setNotes("");
  };

  // === FILTER DATA ===
  const filteredTests = labTests.filter(
    (t) =>
      (t.doctorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.testName?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (t.status === "ACCEPTED" || t.status === "COMPLETED")
  );

  // Format price as currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">Lab Report Generation</h1>
          <p className="text-gray-600 mt-1">Upload and manage lab test reports</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search lab tests..."
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
            { header: "Request Date", accessor: "requestDate" },
            { 
              header: "Price", 
              accessor: (row) => (
                <span className="font-medium">
                  {formatPrice(row.price)}
                </span>
              )
            },
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
              header: "Report Date",
              accessor: (row) => row.reportDate || "-",
            },
            {
              header: "Actions",
              accessor: (row) => (
                <div className="flex gap-2">
                  {row.status === "ACCEPTED" && (
                    <button
                      onClick={() => openUploadModal(row)}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      title="Upload Report"
                    >
                      <Upload className="w-4 h-4" />
                      <span className="hidden sm:inline">Upload</span>
                    </button>
                  )}
                  {row.status === "COMPLETED" && (
                    <button
                      className="text-green-600 hover:text-green-800 flex items-center gap-1"
                      title="Download Report"
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
      </div>

      {/* Upload Report Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Upload Lab Report</h2>
                <button
                  onClick={closeUploadModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {selectedTest && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Patient</p>
                      <p className="font-medium">{selectedTest.patientName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Test</p>
                      <p className="font-medium">{selectedTest.testName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Doctor</p>
                      <p className="font-medium">{selectedTest.doctorName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Request ID</p>
                      <p className="font-medium">{selectedTest.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Price</p>
                      <p className="font-medium">{formatPrice(selectedTest.price)}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Report File <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <FileText className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, JPG, PNG up to 10MB
                      </p>
                    </div>
                  </div>
                  {selectedFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected file: {selectedFile.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                    placeholder="Enter any additional notes about the lab results"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={closeUploadModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
                  onClick={handleUploadReport}
                  disabled={!selectedFile || isUploading}
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-1" />
                      Upload Report
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}