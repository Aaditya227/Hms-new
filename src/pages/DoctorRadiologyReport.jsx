import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataTable } from "../components/common/DataTable";
import { Modal } from "../components/common/Modal";
import base_url from "../utils/baseurl";
import { Eye, Trash2, Search } from "lucide-react";

export default function DoctorRadiologyReport() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // Fetch reports for the specific patient
  useEffect(() => {
    fetchPatientReports();
  }, []);

  const fetchPatientReports = async () => {
    try {
      setLoading(true);
      
      // Get patient ID from localStorage
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");
      const patientId = authData.user?.id;
      
      if (!patientId) {
        console.error("Patient ID not found in authData");
        setLoading(false);
        return;
      }
      
      // Fetch reports for the specific patient
      const res = await axios.get(`${base_url}/radiology/results/patient/${patientId}`);
      setReports(res.data.data || []);
    } catch (error) {
      console.error("Error fetching patient radiology reports:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete Report
  const handleDeleteReport = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      await axios.delete(`${base_url}/radiologyreports/${id}`);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error deleting radiology report:", error);
    }
  };

  // Filter search
  const filteredReports = reports.filter((r) =>
    r.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.report_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.id?.toString().includes(searchQuery)
  );

  if (loading)
    return (
      <p className="text-center py-8 text-gray-500">
        Loading radiology reports...
      </p>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-10">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            My Radiology Reports
          </h1>
          <p className="text-gray-600 mt-1">
            View your radiology test results and report information
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Total Reports", value: reports.length, color: "blue" },
          {
            label: "Completed",
            value: reports.filter((r) => r.status === "Completed").length,
            color: "green",
          },
          {
            label: "Pending",
            value: reports.filter((r) => r.status === "Pending").length,
            color: "orange",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-5 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <Eye className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Table */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
          <div className="w-full sm:w-1/2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by report type, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Table */}
        {filteredReports.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No radiology reports found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              data={filteredReports}
              columns={[
                { header: "Report Type", accessor: "report_type" },
                {
                  header: "Date",
                  accessor: (r) => r.date?.split("T")[0],
                },
                {
                  header: "Status",
                  accessor: (r) => (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        r.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  ),
                },
                {
                  header: "Actions",
                  accessor: (r) => (
                    <div className="flex items-center gap-2">
                      {/* View */}
                      <button
                        onClick={() => {
                          setSelectedReport(r);
                          setViewModalOpen(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteReport(r.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}
      </div>

      {/* View Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedReport(null);
        }}
        title="Radiology Report Details"
      >
        {selectedReport && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
            <p>
              <strong>ID:</strong> {selectedReport.id}
            </p>
            <p>
              <strong>Report Type:</strong> {selectedReport.report_type}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {selectedReport.date?.split("T")[0]}
            </p>
            <p>
              <strong>Status:</strong> {selectedReport.status}
            </p>
            <p className="col-span-2">
              <strong>Description:</strong>{" "}
              {selectedReport.description || "—"}
            </p>

            {/* File attachment */}
            {selectedReport.file_url && (
              <p className="col-span-2 mt-2">
                <a
                  href={selectedReport.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Attached Report File
                </a>
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}