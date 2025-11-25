



// update


import React, { useState, useEffect } from "react";
import { FlaskConical, Search, Plus, FileCheck, Trash2, Edit2 } from "../lib/icons";
import { Button } from "../components/common/Button";
import { DataTable } from "../components/common/DataTable";
import { Modal } from "../components/common/Modal";
import api from "../lib/api.js"; // ✅ ADDED

export function DoctorsLaboratory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [labTests, setLabTests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientName: "",
    testType: "",
    orderedBy: "",
    status: "PENDING",
  });
  const [editId, setEditId] = useState(null);

  const API_URL = "/lab"; // ❗ BASE URL auto handle axios instance karega

  // Status Color
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // === FETCH LAB ORDERS (with Token) ===
  const fetchLabOrders = async () => {
    try {
      const response = await api.get(API_URL); // ✅ UPDATED
      setLabTests(response.data);
    } catch (error) {
      console.error("Error fetching lab orders:", error);
    }
  };

  useEffect(() => {
    fetchLabOrders();
  }, []);

  // === CREATE / UPDATE ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`${API_URL}/${editId}`, formData); // ✅ UPDATED
      } else {
        await api.post(API_URL, formData); // ✅ UPDATED
      }

      await fetchLabOrders();
      setIsModalOpen(false);
      setEditId(null);

      setFormData({
        patientName: "",
        testType: "",
        orderedBy: "",
        status: "PENDING",
      });
    } catch (error) {
      console.error("Error saving lab order:", error);
    }
  };

  // === EDIT ===
  const handleEdit = (order) => {
    setEditId(order.id);
    setFormData({
      patientName: order.patientName,
      testType: order.testType,
      orderedBy: order.orderedBy,
      status: order.status,
    });
    setIsModalOpen(true);
  };

  // === DELETE ===
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lab order?")) return;
    try {
      await api.delete(`${API_URL}/${id}`); // ✅ UPDATED
      await fetchLabOrders();
    } catch (error) {
      console.error("Error deleting lab order:", error);
    }
  };

  // === FILTER DATA ===
  const filteredTests = labTests.filter(
    (t) =>
      t.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.testType?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">Laboratory</h1>
          <p className="text-gray-600 mt-1">Manage lab tests and results</p>
        </div>
        <div className="w-full sm:w-auto">
          <Button icon={Plus} onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
            Create Lab Order
          </Button>
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
            { header: "Patient", accessor: "patientName" },
            { header: "Test Type", accessor: "testType" },
            { header: "Ordered By", accessor: "orderedBy" },
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
                  <button
                    onClick={() => handleEdit(row)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(row.id)}
                    className="text-red-600 hover:text-red-800"
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

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditId(null);
        }}
        title={editId ? "Edit Lab Order" : "Create Lab Order"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Patient Name"
            value={formData.patientName}
            onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
            className="w-full border rounded-lg p-2"
            required
          />

          <input
            type="text"
            placeholder="Test Type"
            value={formData.testType}
            onChange={(e) => setFormData({ ...formData, testType: e.target.value })}
            className="w-full border rounded-lg p-2"
            required
          />

          <input
            type="text"
            placeholder="Ordered By"
            value={formData.orderedBy}
            onChange={(e) => setFormData({ ...formData, orderedBy: e.target.value })}
            className="w-full border rounded-lg p-2"
            required
          />

          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full border rounded-lg p-2"
          >
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <Button type="submit" variant="primary" className="w-full">
            {editId ? "Update" : "Save"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
