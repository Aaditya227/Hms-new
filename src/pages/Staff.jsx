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
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedStaff, setSelectedStaff] = useState(null);

  const API_URL = `${base_url}/employees`;
  const DEPT_API = `${base_url}/departments`; // ✅ new
  const ROLES_API = `${base_url}/roles`;

  // ✅ Fetch all employees
  const fetchStaff = async () => {
    try {
      const res = await axios.get(API_URL);
        setStaffMembers(res.data.employees || []);
    } catch (err) {
      console.error("❌ Error fetching staff:", err);
    }
  };

//  ✅ Fetch departments
  const fetchDepartments = async () => {
    try {
      const res = await axios.get(DEPT_API);
      setDepartments(res.data.data || res.data || []);
    } catch (err) {
      console.error("❌ Error fetching departments:", err);
    }
  };   

  // ✅ Fetch roles (if API available)
  const fetchRoles = async () => {
    try {
      const res = await axios.get(ROLES_API);
      setRoles(res.data.data || res.data || []);
    } catch (err) {
      console.warn("Roles endpoint not available or failed:", err);
      setRoles([]);
    }
  };

  useEffect(() => {
    fetchStaff();
    fetchDepartments();
    fetchRoles();
  }, []);

  const [formData, setFormData] = useState({
    employeeCode: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    dob: "",
    address: "",
    department_id: "",
    specialization: "",
    qualification: "",
    experience: "",
    date_joined: "",
    license_number  : "",
    role_id: "",
    is_active: true,
  });

  // Function to format date to yyyy-mm-dd for API
  const formatDateToYYYYMMDD = (dateString) => {
    if (!dateString) return "";
    
    // If already in yyyy-mm-dd format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  // Function to format date for display in input fields (yyyy-mm-dd)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error formatting date for input:", error);
      return "";
    }
  };

  // ✅ Add Employee
  const handleAddStaff = async (e) => {
    e.preventDefault();
    // validate required fields
    const missing = [];
    if (!formData.email) missing.push("email");
    if (!formData.password) missing.push("password");
    if (!formData.first_name) missing.push("first_name");
    if (!formData.department_id) missing.push("department_id");
    if (!formData.role_id) missing.push("role_id");
    if (missing.length > 0) {
      alert(`Please provide required fields: ${missing.join(", ")}`);
      return;
    }

    try {
      const res = await axios.post(API_URL, {
        ...formData,
        department_id: Number(formData.department_id),
        is_active: formData.is_active ? 1 : 0,
        // Format the date to yyyy-mm-dd for API
        dob: formatDateToYYYYMMDD(formData.dob),
        date_joined: formatDateToYYYYMMDD(formData.date_joined),
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
    // validate required fields for update
    const missing = [];
    if (!formData.first_name) missing.push("first_name");
    if (!formData.department_id) missing.push("department_id");
    if (!formData.role_id) missing.push("role_id");
    if (missing.length > 0) {
      alert(`Please provide required fields: ${missing.join(", ")}`);
      return;
    }
    
    try {
      const res = await axios.patch(`${API_URL}/${selectedStaff.employee_id}`, {
        ...formData,
        department_id: Number(formData.department_id),
        is_active: formData.is_active ? 1 : 0,
        // Format the date to yyyy-mm-dd for API
        dob: formatDateToYYYYMMDD(formData.dob),
        date_joined: formatDateToYYYYMMDD(formData.date_joined),
        user: {
          firstName: formData.first_name,
          lastName: formData.last_name,
          phone: formData.phone,
          gender: formData.gender,
          address: formData.address,
          email: formData.email,
          dateOfBirth: formatDateToYYYYMMDD(formData.dob),
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
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      phone: "",
      gender: "",
      dob: "",
      address: "",
      department_id: "",
      specialization: "",
      qualification: "",
      experience: "",
      date_joined: "",
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (staff) => {
    try {
      setModalMode("edit");
      setSelectedStaff(staff);

      // Format dates for input fields
      const dateJoined = formatDateForInput(staff.date_joined);
      const dob = formatDateForInput(staff.dob);

      setFormData({
        first_name: staff.first_name || "",
        last_name: staff.last_name || "",
        email: staff.email || "",
        phone: staff.phone || "",
        gender: staff.gender || "MALE",
        dob: dob,
        address: staff.address || "",
        department_id: staff.department_id || "",
        specialization: staff.specialization || "",
        qualification: staff.qualification || "",
        experience: staff.experience || "",
        date_joined: dateJoined,
        is_active: staff.emp_active === 1 ? true : false,
      });
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error opening edit modal, staff object shape:", err, staff);
      alert("Unable to open edit modal because of unexpected data. Check console for details.");
    }
  };

  const filteredStaff = staffMembers.filter((m) => {
    const search = searchQuery.toLowerCase();
    return (
      m.first_name?.toLowerCase().includes(search) ||
      m.last_name?.toLowerCase().includes(search) ||
      m.employee_id?.toString().includes(search) ||
      m.department_name?.toLowerCase().includes(search)
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
            { header: "ID", accessor: "employee_id" },
            {
              header: "Name",
              accessor: (r) =>
                `${r.first_name || ""} ${r.last_name || ""}`,
            },
            { header: "Department", accessor: (r) => r.department_name || "—" },
            { header: "Phone", accessor: (r) => r.phone || "—" },
            { header: "Email", accessor: (r) => r.email || "—" },
            {
              header: "Status",
              accessor: (r) => (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    r.emp_active === 1
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {r.emp_active === 1 ? "Active" : "Inactive"}
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
                    onClick={() => handleDeleteStaff(row.employee_id)}
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 relative">
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
                "first_name",
                "last_name",
                "email",
                "password",
                "phone",
                "address",
                "specialization",
                "qualification",
                "experience",
              ].map((field, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {field.replace(/_/g, " ")}
                  </label>
                  <input
                    type={
                      field === "password"
                        ? "password"
                        : "text"
                    }
                    value={formData[field] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    required={["first_name", "email"].includes(field)}
                    disabled={modalMode === "edit" && field === "password"}
                  />
                </div>
              ))}

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dob || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, dob: e.target.value })
                  }
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Date Joined */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Joined
                </label>
                <input
                  type="date"
                  value={formData.date_joined || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, date_joined: e.target.value })
                  }
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={formData.role_id}
                  onChange={(e) => {
                    setFormData({ 
                      ...formData, 
                      role_id: e.target.value
                    });
                  }}
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">Select Role</option>
                  {roles.length > 0
                    ? roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name || r.title || r.role}
                        </option>
                      ))
                    : (
                      <>
                        <option value="1">Admin</option>
                        <option value="2">Doctor</option>
                        <option value="3">Nurse</option>
                        <option value="4">Pharmacist</option>
                      </>
                    )}
                </select>
              </div>

              {/* ✅ Department Dropdown (Dynamic) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  value={formData.department_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      department_id: Number(e.target.value),
                    })
                  }
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">Select Department</option>
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
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Active */}
              <div className="flex items-center gap-2 sm:col-span-2 mt-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
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