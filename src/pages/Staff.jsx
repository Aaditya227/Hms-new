
// update


import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Plus, Edit2, Eye, Trash2 } from "../lib/icons";
import { Button } from "../components/common/Button";
import { DataTable } from "../components/common/DataTable";
import base_url from "../utils/baseurl";

export function Staff() {
  const [searchQuery, setSearchQuery] = useState("");
  const [staffMembers, setStaffMembers] = useState([]);
  const [departments, setDepartments] = useState([]); // ✅ new
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedStaff, setSelectedStaff] = useState(null);

  const API_URL = `${base_url}/employees`;
  const DEPT_API = `${base_url}/departments`; // ✅ new

  // ✅ Fetch all employees
  const fetchStaff = async () => {
    try {
      const res = await axios.get(API_URL);
      setStaffMembers(res.data);
    } catch (err) {
      console.error("❌ Error fetching staff:", err);
    }
  };

//  ✅ Fetch departments
  const fetchDepartments = async () => {
    try {
      const res = await axios.get(DEPT_API);
      setDepartments(res.data);
    } catch (err) {
      console.error("❌ Error fetching departments:", err);
    }
  };   

  useEffect(() => {
    fetchStaff();
    fetchDepartments();
  }, []);

  const [formData, setFormData] = useState({
    employeeCode: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    departmentId: "",
    specialization: "",
    qualification: "",
    experience: "",
    joinDate: "",
    role: "",
    isActive: true,
  });

  // ✅ Add Employee
  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API_URL, {
        ...formData,
        departmentId: Number(formData.departmentId), // ✅ ensure numeric
      });
      alert("✅ Employee added successfully!");
      setIsModalOpen(false);
      fetchStaff();
    } catch (err) {
      console.error("❌ Error adding staff:", err);
      alert("Failed to add staff.");
    }
  };

  // ✅ Update Employee
  const handleEditStaff = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(`${API_URL}/${selectedStaff.id}`, {
        ...formData,
        departmentId: Number(formData.departmentId), // ✅ ensure numeric
        user: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          gender: formData.gender,
          address: formData.address,
          email: formData.email,
          dateOfBirth: formData.dateOfBirth,
        },
      });
      alert("✅ Employee updated successfully!");
      setIsModalOpen(false);
      fetchStaff();
    } catch (err) {
      console.error("❌ Error updating staff:", err);
      alert("Failed to update staff.");
    }
  };

  // ✅ Delete (soft delete)
  const handleDeleteStaff = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert("🗑️ Employee deleted successfully!");
      fetchStaff();
    } catch (err) {
      console.error("❌ Error deleting staff:", err);
    }
  };

  const openAddModal = () => {
    setModalMode("add");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      gender: "",
      dateOfBirth: "",
      address: "",
      departmentId: "",
      specialization: "",
      qualification: "",
      experience: "",
      joinDate: "",
      role: "",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (staff) => {
    setModalMode("edit");
    setSelectedStaff(staff);
    setFormData({
      firstName: staff.user?.firstName || "",
      lastName: staff.user?.lastName || "",
      email: staff.user?.email || "",
      phone: staff.user?.phone || "",
      gender: staff.user?.gender || "MALE",
      dateOfBirth: staff.user?.dateOfBirth
        ? staff.user.dateOfBirth.split("T")[0]
        : "",
      address: staff.user?.address || "",
      departmentId: staff.department?.id || "",
      specialization: staff.specialization || "",
      qualification: staff.qualification || "",
      experience: staff.experience || "",
      // joinDate: staff.joinDate ? staff.joinDate.split("T")[0] : "",
      joinDate: staff.joinDate?.joinDate ? staff.joinDate.split("T")[0] : "",
      role: staff.role ,
      isActive: staff.isActive,
    });
    setIsModalOpen(true);
  };

  const filteredStaff = staffMembers.filter((m) => {
    const search = searchQuery.toLowerCase();
    return (
      m.user?.firstName?.toLowerCase().includes(search) ||
      m.employeeCode?.toLowerCase().includes(search) ||
      m.department?.name?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-8">
      Header
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-10">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Staff Management
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage all hospital employees and staff members
          </p>
        </div>
        <Button icon={Plus} onClick={openAddModal} className="w-full sm:w-auto">
          Add Employee
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, code, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <DataTable
          data={filteredStaff}
          columns={[
            { header: "Code", accessor: "employeeCode" },
            {
              header: "Name",
              accessor: (r) =>
                `${r.user?.firstName || ""} ${r.user?.lastName || ""}`,
            },
            { header: "Role", accessor: "role" },
            { header: "Department", accessor: (r) => r.department?.name || "—" },
            { header: "Phone", accessor: (r) => r.user?.phone || "—" },
            { header: "Email", accessor: (r) => r.user?.email || "—" },
            {
              header: "Status",
              accessor: (r) => (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    r.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {r.isActive ? "Active" : "Inactive"}
                </span>
              ),
            },
            {
              header: "Actions",
              accessor: (row) => (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(row)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteStaff(row.id)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>

            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
              {modalMode === "add" ? "Add New Employee" : "Edit Employee"}
            </h2>

            <form
              onSubmit={modalMode === "add" ? handleAddStaff : handleEditStaff}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            >
              {/* Inputs */}
              {[
                "firstName",
                "lastName",
                "email",
                "password",
                "phone",
                "dateOfBirth",
                "address",
                "specialization",
                "qualification",
                "experience",
                "joinDate",
              ].map((field, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type={
                      field === "password"
                        ? "password"
                        : field.includes("date")
                        ? "date"
                        : "text"
                    }
                    value={formData[field] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    required={["firstName", "email"].includes(field)}
                  />
                </div>
              ))}

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full border rounded-lg p-2"
                >
                <option value="">Search Role</option>
                  <option value="DOCTOR">Doctor</option>
                  <option value="NURSE">Nurse</option>
                  <option value="PHARMACIST">Pharmacist</option>
                  {/* <option value="LAB_TECH">Lab Technician</option>
                  <option value="RECEPTIONIST">Receptionist</option> */}
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              {/* ✅ Department Dropdown (Dynamic) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  value={formData.departmentId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      departmentId: Number(e.target.value),
                    })
                  }
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">Search Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">Search Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Active */}
              <div className="flex items-center gap-2 sm:col-span-2 mt-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 accent-blue-600"
                />
                <label className="text-sm text-gray-700">Active</label>
              </div>

              <div className="sm:col-span-2 mt-4">
                <Button type="submit" className="w-full">
                  {modalMode === "add" ? "Add Employee" : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

