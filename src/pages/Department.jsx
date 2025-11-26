<<<<<<< HEAD

// update

=======
>>>>>>> 43fcfc8163b000b0d7f254ea9c207a39a528ed24
import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Plus, Edit2, Trash2, Eye } from "../lib/icons";
import { Button } from "../components/common/Button";
import { DataTable } from "../components/common/DataTable";
import base_url from "../utils/baseurl";
import Swal from "sweetalert2";

export function Department() {
  const API_URL = `${base_url}/departments`;

  const [departments, setDepartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedDept, setSelectedDept] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewDept, setViewDept] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    code: "",
    description: "",
    status: 1, // Default to active (1)
  });

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(API_URL);
      // Adjusting to match the API response structure
      if (res.data.success) {
        setDepartments(res.data.data);
      }
    } catch (err) {
      console.error("❌ Error fetching departments:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch departments. Please try again.",
      });
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Format the data to match what the API expects
      const departmentData = {
        name: formData.name,
        type: formData.type,
        code: formData.code,
        description: formData.description,
        status: formData.status ? 1 : 0, // Convert boolean to 1/0
      };

      const res = await axios.post(API_URL, departmentData);
      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Department created successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
        setIsModalOpen(false);
        fetchDepartments();
        // Reset form
        setFormData({
          name: "",
          type: "",
          code: "",
          description: "",
          status: 1,
        });
      }
    } catch (err) {
      console.error("❌ Error creating department:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to create department.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditDepartment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Format the data to match what the API expects
      const departmentData = {
        name: formData.name,
        type: formData.type,
        code: formData.code,
        description: formData.description,
        status: formData.status ? 1 : 0, // Convert boolean to 1/0
      };

      const res = await axios.put(`${API_URL}/${selectedDept.id}`, departmentData);
      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Department updated successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
        setIsModalOpen(false);
        fetchDepartments();
      }
    } catch (err) {
      console.error("❌ Error updating department:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to update department.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(`${API_URL}/${id}`);
        if (res.data.success) {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Department has been deleted.",
            timer: 2000,
            showConfirmButton: false,
          });
          fetchDepartments();
        }
      } catch (err) {
        console.error("❌ Error deleting department:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete department.",
        });
      }
    }
  };

  const openAddModal = () => {
    setModalMode("add");
    setFormData({
      name: "",
      type: "",
      code: "",
      description: "",
      status: 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (dept) => {
    setModalMode("edit");
    setSelectedDept(dept);

    // Handle both possible status formats: string ("active"/"inactive") or number (1/0)
    let statusValue;
    if (typeof dept.status === 'string') {
      statusValue = dept.status === "active" ? 1 : 0;
    } else {
      statusValue = dept.status === 1 ? 1 : 0;
    }

    setFormData({
      name: dept.name || "",
      type: dept.type || "",
      code: dept.code || "",
      description: dept.description || "",
      status: statusValue,
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

  // Helper function to determine status display
  const getStatusDisplay = (status) => {
    // Handle both possible status formats: string ("active"/"inactive") or number (1/0)
    if (typeof status === 'string') {
      return status === "active" ? "Active" : "Inactive";
    } else {
      return status === 1 ? "Active" : "Inactive";
    }
  };

  // Helper function to determine status class
  const getStatusClass = (status) => {
    // Handle both possible status formats: string ("active"/"inactive") or number (1/0)
    if (typeof status === 'string') {
      return status === "active" 
        ? "bg-green-100 text-green-600" 
        : "bg-gray-200 text-gray-600";
    } else {
      return status === 1 
        ? "bg-green-100 text-green-600" 
        : "bg-gray-200 text-gray-600";
    }
  };

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
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(d.status)}`}
                >
                  {getStatusDisplay(d.status)}
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
                {viewDept ? getStatusDisplay(viewDept.status) : ""}
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
                  required
                >
                  <option value="">Select Type</option>
                  <option value="CLINICAL">Clinical</option>
                  <option value="NON_CLINICAL">Non-Clinical</option>
                  <option value="SUPPORT">Support</option>
                  <option value="ADMIN">Admin</option>
                  <option value="Medical">Medical</option>
                </select>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={formData.status === 1}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.checked ? 1 : 0 })
                  }
                />
                <label>Active</label>
              </div>

              <Button 
                type="submit" 
                className="w-full mt-4"
                disabled={loading}
              >
                {loading 
                  ? (modalMode === "add" ? "Creating..." : "Updating...") 
                  : (modalMode === "add" ? "Create Department" : "Save Changes")
                }
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}