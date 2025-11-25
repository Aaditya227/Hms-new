
// update

import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Plus, Edit2, Trash2, Eye } from "../lib/icons";
import { Button } from "../components/common/Button";
import { DataTable } from "../components/common/DataTable";
import base_url from "../utils/baseurl";

export function Department() {
  const API_URL = `${base_url}/departments`;

  const [departments, setDepartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedDept, setSelectedDept] = useState(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewDept, setViewDept] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    type: "",
    isActive: true,
  });

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(API_URL);
      setDepartments(res.data);
    } catch (err) {
      console.error("❌ Error fetching departments:", err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleAddDepartment = async (e) => {
    e.preventDefault();

    try {
      await axios.post(API_URL, formData);
      alert("✅ Department created successfully!");
      setIsModalOpen(false);
      fetchDepartments();
    } catch (err) {
      console.error("❌ Error creating department:", err);
      alert(err.response?.data?.message || "Failed to create department.");
    }
  };

  const handleEditDepartment = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${API_URL}/${selectedDept.id}`, formData);
      alert("✅ Department updated successfully!");
      setIsModalOpen(false);
      fetchDepartments();
    } catch (err) {
      console.error("❌ Error updating department:", err);
      alert("Failed to update department.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this department?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      alert("🗑️ Department deleted successfully!");
      fetchDepartments();
    } catch (err) {
      console.error("❌ Error deleting department:", err);
    }
  };

  const openAddModal = () => {
    setModalMode("add");
    setFormData({
      name: "",
      code: "",
      description: "",
      type: "",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (dept) => {
    setModalMode("edit");
    setSelectedDept(dept);

    setFormData({
      name: dept.name || "",
      code: dept.code || "",
      description: dept.description || "",
      type: dept.type,
      isActive: dept.isActive,
    });

    setIsModalOpen(true);
  };

  const openViewModal = (dept) => {
    setViewDept(dept);
    setIsViewModalOpen(true);
  };

  const filteredDepartments = departments.filter((d) => {
    const s = searchQuery.toLowerCase();

    return (
      d.name.toLowerCase().includes(s) ||
      d.code.toLowerCase().includes(s) ||
      d.type.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-10">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Department Management
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage all hospital departments
          </p>
        </div>

        <Button icon={Plus} onClick={openAddModal} className="w-full sm:w-auto">
          Add Department
        </Button>
      </div>

      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, code, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <DataTable
          data={filteredDepartments}
          columns={[
            { header: "Code", accessor: "code" },
            { header: "Name", accessor: "name" },
            { header: "Type", accessor: "type" },
            {
              header: "Status",
              accessor: (d) => (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    d.isActive
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {d.isActive ? "Active" : "Inactive"}
                </span>
              ),
            },
            {
              header: "Actions",
              accessor: (row) => (
                <div className="flex items-center gap-2">

                  <button
                    onClick={() => openViewModal(row)}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => openEditModal(row)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(row.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ),
            },
          ]}
        />
      </div>

      {isViewModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-8 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setIsViewModalOpen(false)}
            >
              ✕
            </button>

            <h2 className="text-2xl font-semibold mb-6 text-center">
              Department Details
            </h2>

            <div className="space-y-3">
              <p><strong>Name:</strong> {viewDept?.name}</p>
              <p><strong>Code:</strong> {viewDept?.code}</p>
              <p><strong>Type:</strong> {viewDept?.type}</p>
              <p><strong>Description:</strong> {viewDept?.description}</p>
              <p>
                <strong>Status:</strong>{" "}
                {viewDept?.isActive ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-8 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>

            <h2 className="text-2xl font-semibold mb-6 text-center">
              {modalMode === "add" ? "Add Department" : "Edit Department"}
            </h2>

            <form
              onSubmit={
                modalMode === "add"
                  ? handleAddDepartment
                  : handleEditDepartment
              }
              className="grid grid-cols-1 gap-5"
            >
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border rounded-lg p-2"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  className="w-full border rounded-lg p-2"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full border rounded-lg p-2"
                  rows={3}
                ></textarea>
              </div>

              <div>
                <label className="text-sm font-medium">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">Select Type</option>
                  <option value="CLINICAL">Clinical</option>
                  <option value="NON_CLINICAL">Non-Clinical</option>
                  <option value="SUPPORT">Support</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                />
                <label>Active</label>
              </div>

              <Button type="submit" className="w-full mt-4">
                {modalMode === "add" ? "Create Department" : "Save Changes"}
              </Button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

