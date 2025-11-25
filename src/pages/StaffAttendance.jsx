// // src/pages/StaffAttendance.jsx
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { UserCog, Search, Plus, Edit2, Eye, Trash2 } from "../lib/icons";
// import { Button } from "../components/common/Button";
// import { DataTable } from "../components/common/DataTable";

// const API_BASE_URL = "http://localhost:5000/api/attendance";
// const STAFF_API = "http://localhost:5000/api/staff";

// export function StaffAttendance() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterStaff, setFilterStaff] = useState("ALL");
//   const [filterDate, setFilterDate] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalMode, setModalMode] = useState("add");
//   const [selectedAttendance, setSelectedAttendance] = useState(null);
//   const [attendances, setAttendances] = useState([]);
//   const [staffList, setStaffList] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     staffId: "",
//     date: "",
//     shiftType: "MORNING",
//     status: "PRESENT",
//     checkInTime: "",
//     checkOutTime: "",
//     remarks: "",
//   });

//   const formatDate = (iso) => {
//     if (!iso) return "—";
//     try {
//       const d = new Date(iso);
//       return d.toLocaleString();
//     } catch {
//       return iso;
//     }
//   };

//   const fetchStaff = async () => {
//     try {
//       const res = await axios.get(STAFF_API);
//       setStaffList(res.data.data || []);
//     } catch (err) {
//       console.error("❌ Staff fetch error:", err);
//       setStaffList([]);
//     }
//   };

//   const fetchAttendance = async () => {
//     try {
//       setLoading(true);
//       const params = {};
//       if (filterDate) params.date = filterDate;
//       if (filterStaff !== "ALL") params.staffId = filterStaff;

//       const res = await axios.get(API_BASE_URL, { params });
//       setAttendances(res.data.data || []);
//     } catch (err) {
//       console.error("❌ Attendance fetch error:", err);
//       setAttendances([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // AUTO RELOAD WHEN FILTERS CHANGE
//   useEffect(() => {
//     fetchAttendance();
//   }, [filterDate, filterStaff]);

//   useEffect(() => {
//     fetchStaff();
//     fetchAttendance();
//   }, []);

//   const handleAddAttendance = async (e) => {
//     e.preventDefault();
//     try {
//       if (!formData.staffId || !formData.date) {
//         alert("Staff, date and shift required.");
//         return;
//       }

//       const payload = {
//         ...formData,
//         staffId: Number(formData.staffId),
//         date: formData.date ? new Date(formData.date).toISOString() : null,
//         checkInTime: formData.checkInTime
//           ? new Date(formData.checkInTime).toISOString()
//           : null,
//         checkOutTime: formData.checkOutTime
//           ? new Date(formData.checkOutTime).toISOString()
//           : null,
//         remarks: formData.remarks || "",
//       };

//       const res = await axios.post(API_BASE_URL, payload);
//       setAttendances((prev) => [res.data.data, ...prev]);

//       alert("Attendance marked successfully");
//       setIsModalOpen(false);
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "Failed to mark attendance");
//     }
//   };

//   const handleEditAttendance = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = {
//         shiftType: formData.shiftType,
//         status: formData.status,
//         remarks: formData.remarks,
//         checkInTime: formData.checkInTime
//           ? new Date(formData.checkInTime).toISOString()
//           : null,
//         checkOutTime: formData.checkOutTime
//           ? new Date(formData.checkOutTime).toISOString()
//           : null,
//       };

//       const res = await axios.put(`${API_BASE_URL}/${selectedAttendance.id}`, payload);

//       setAttendances((prev) =>
//         prev.map((a) => (a.id === selectedAttendance.id ? res.data.data : a))
//       );

//       alert("Attendance updated");
//       setIsModalOpen(false);
//     } catch (err) {
//       console.error(err);
//       alert("Update failed");
//     }
//   };

//   const handleDeleteAttendance = async (id) => {
//     if (!window.confirm("Are you sure?")) return;

//     try {
//       await axios.delete(`${API_BASE_URL}/${id}`);
//       setAttendances((prev) => prev.filter((a) => a.id !== id));
//       alert("Deleted successfully");
//     } catch (err) {
//       console.error(err);
//       alert("Delete failed");
//     }
//   };

//   const openAddModal = () => {
//     setModalMode("add");
//     setSelectedAttendance(null);
//     setFormData({
//       staffId: staffList[0]?.id || "",
//       date: "",
//       shiftType: "MORNING",
//       status: "PRESENT",
//       checkInTime: "",
//       checkOutTime: "",
//       remarks: "",
//     });
//     setIsModalOpen(true);
//   };

//   const openViewModal = (att) => {
//     setModalMode("view");
//     setSelectedAttendance(att);

//     setFormData({
//       staffId: att.staffId || att.staff?.id || "",
//       date: att.date ? att.date.split("T")[0] : "",
//       shiftType: att.shiftType,
//       status: att.status,
//       checkInTime: att.checkInTime
//         ? new Date(att.checkInTime).toISOString().slice(0, 16)
//         : "",
//       checkOutTime: att.checkOutTime
//         ? new Date(att.checkOutTime).toISOString().slice(0, 16)
//         : "",
//       remarks: att.remarks || "",
//     });

//     setIsModalOpen(true);
//   };

//   const openEditModal = (att) => {
//     setModalMode("edit");
//     setSelectedAttendance(att);

//     setFormData({
//       staffId: att.staffId || att.staff?.id || "",
//       date: att.date ? att.date.split("T")[0] : "",
//       shiftType: att.shiftType,
//       status: att.status,
//       checkInTime: att.checkInTime
//         ? new Date(att.checkInTime).toISOString().slice(0, 16)
//         : "",
//       checkOutTime: att.checkOutTime
//         ? new Date(att.checkOutTime).toISOString().slice(0, 16)
//         : "",
//       remarks: att.remarks || "",
//     });

//     setIsModalOpen(true);
//   };

//   const filtered = attendances.filter((a) => {
//     const staffName = `${a.staff?.firstName || ""} ${a.staff?.lastName || ""}`.toLowerCase();
//     const q = searchQuery.toLowerCase();
//     return staffName.includes(q) || String(a.id).includes(q);
//   });

//   return (
//     <div className="space-y-8">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-10">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Staff Attendance</h1>
//           <p className="text-gray-600 mt-1">Mark and manage attendance</p>
//         </div>
//         <Button icon={Plus} onClick={openAddModal}>
//           Mark Attendance
//         </Button>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-xl shadow p-6">
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-10 border rounded-lg p-2"
//             />
//           </div>

//           <select
//             value={filterStaff}
//             onChange={(e) => setFilterStaff(e.target.value)}
//             className="border p-2 rounded-lg"
//           >
//             <option value="ALL">All Staff</option>
//             {staffList.map((s) => (
//               <option key={s.id} value={s.id}>
//                 {s.firstName} {s.lastName}
//               </option>
//             ))}
//           </select>

//           <input
//             type="date"
//             value={filterDate}
//             onChange={(e) => setFilterDate(e.target.value)}
//             className="border p-2 rounded-lg"
//           />

//           <Button
//             onClick={() => {
//               setFilterStaff("ALL");
//               setFilterDate("");
//               setSearchQuery("");
//               fetchAttendance();
//             }}
//           >
//             Reset
//           </Button>
//         </div>

//         {loading ? (
//           <p className="text-center mt-4 text-gray-500">Loading...</p>
//         ) : (
//           <div className="mt-6 overflow-x-auto">
//             <DataTable
//               data={filtered}
//               columns={[
//                 { header: "ID", accessor: "id" },
//                 {
//                   header: "Staff",
//                   accessor: (r) =>
//                     r.staff ? `${r.staff.firstName} ${r.staff.lastName}` : `#${r.staffId}`,
//                 },
//                 { header: "Date", accessor: (r) => r.date?.split("T")[0] || "—" },
//                 { header: "Shift", accessor: "shiftType" },
//                 { header: "Status", accessor: "status" },
//                 {
//                   header: "Check In",
//                   accessor: (r) => (r.checkInTime ? formatDate(r.checkInTime) : "—"),
//                 },
//                 {
//                   header: "Check Out",
//                   accessor: (r) => (r.checkOutTime ? formatDate(r.checkOutTime) : "—"),
//                 },
//                 { header: "Remarks", accessor: "remarks" },
//                 {
//                   header: "Actions",
//                   accessor: (row) => (
//                     <div className="flex gap-2">
//                       <button onClick={() => openViewModal(row)}>
//                         <Eye className="w-4 h-4 text-blue-600" />
//                       </button>
//                       <button onClick={() => openEditModal(row)}>
//                         <Edit2 className="w-4 h-4 text-gray-600" />
//                       </button>
//                       <button onClick={() => handleDeleteAttendance(row.id)}>
//                         <Trash2 className="w-4 h-4 text-red-600" />
//                       </button>
//                     </div>
//                   ),
//                 },
//               ]}
//             />
//           </div>
//         )}
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
//             <button
//               className="absolute top-3 right-3 text-gray-500 text-2xl"
//               onClick={() => setIsModalOpen(false)}
//             >
//               ✕
//             </button>

//             <h2 className="text-2xl font-semibold mb-4 text-center">
//               {modalMode === "view"
//                 ? "View Attendance"
//                 : modalMode === "edit"
//                 ? "Edit Attendance"
//                 : "Mark Attendance"}
//             </h2>

//             <form
//               onSubmit={
//                 modalMode === "edit"
//                   ? handleEditAttendance
//                   : modalMode === "add"
//                   ? handleAddAttendance
//                   : undefined
//               }
//               className="grid grid-cols-1 sm:grid-cols-2 gap-4"
//             >
//               <div>
//                 <label>Staff</label>
//                 <select
//                   value={formData.staffId}
//                   disabled={modalMode === "view"}
//                   onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
//                   className="w-full border p-2 rounded-lg"
//                 >
//                   <option value="">Select staff</option>
//                   {staffList.map((s) => (
//                     <option key={s.id} value={s.id}>
//                       {s.firstName} {s.lastName}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label>Date</label>
//                 <input
//                   type="date"
//                   value={formData.date}
//                   readOnly={modalMode === "view"}
//                   onChange={(e) => setFormData({ ...formData, date: e.target.value })}
//                   className="w-full border p-2 rounded-lg"
//                 />
//               </div>

//               <div>
//                 <label>Shift Type</label>
//                 <select
//                   value={formData.shiftType}
//                   disabled={modalMode === "view"}
//                   onChange={(e) => setFormData({ ...formData, shiftType: e.target.value })}
//                   className="w-full border p-2 rounded-lg"
//                 >
//                   <option value="MORNING">Morning</option>
//                   <option value="EVENING">Evening</option>
//                   <option value="NIGHT">Night</option>
//                   <option value="FLEX">Flex</option>
//                 </select>
//               </div>

//               <div>
//                 <label>Status</label>
//                 <select
//                   value={formData.status}
//                   disabled={modalMode === "view"}
//                   onChange={(e) => setFormData({ ...formData, status: e.target.value })}
//                   className="w-full border p-2 rounded-lg"
//                 >
//                   <option value="PRESENT">Present</option>
//                   <option value="ABSENT">Absent</option>
//                   <option value="LEAVE">Leave</option>
//                   <option value="ON_DUTY">On Duty</option>
//                 </select>
//               </div>

//               <div>
//                 <label>Check-in Time</label>
//                 <input
//                   type="datetime-local"
//                   value={formData.checkInTime}
//                   readOnly={modalMode === "view"}
//                   onChange={(e) =>
//                     setFormData({ ...formData, checkInTime: e.target.value })
//                   }
//                   className="w-full border p-2 rounded-lg"
//                 />
//               </div>

//               <div>
//                 <label>Check-out Time</label>
//                 <input
//                   type="datetime-local"
//                   value={formData.checkOutTime}
//                   readOnly={modalMode === "view"}
//                   onChange={(e) =>
//                     setFormData({ ...formData, checkOutTime: e.target.value })
//                   }
//                   className="w-full border p-2 rounded-lg"
//                 />
//               </div>

//               <div className="sm:col-span-2">
//                 <label>Remarks</label>
//                 <textarea
//                   value={formData.remarks}
//                   readOnly={modalMode === "view"}
//                   onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
//                   className="w-full border p-2 rounded-lg h-20"
//                 />
//               </div>

//               <div className="sm:col-span-2 mt-3">
//                 {modalMode === "view" ? (
//                   <Button onClick={() => setIsModalOpen(false)} className="w-full">
//                     Close
//                   </Button>
//                 ) : (
//                   <Button type="submit" className="w-full">
//                     {modalMode === "edit" ? "Save Changes" : "Mark Attendance"}
//                   </Button>
//                 )}
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default StaffAttendance;


// uni

// src/pages/StaffAttendance.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { UserCog, Search, Plus, Edit2, Eye, Trash2 } from "../lib/icons";
import { Button } from "../components/common/Button";
import { DataTable } from "../components/common/DataTable";
import base_url from "../utils/baseurl";

const API_BASE_URL = `${base_url}/staffattendance`;
const STAFF_API = `${base_url}/employees`;

export function StaffAttendance() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStaff, setFilterStaff] = useState("ALL");
  const [filterDate, setFilterDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add | edit | view
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [attendances, setAttendances] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    staffId: "",
    date: "",
    shiftType: "", // example values: MORNING/EVENING/NIGHT/FLEX
    status: "PRESENT", // example: PRESENT/ABSENT/LEAVE
    checkInTime: "",
    checkOutTime: "",
    remarks: "",
  });

  // helpers


  const formatDate = (iso) => {
    if (!iso) return "—";
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch {
      return iso;
    }
  };

  // fetch staff list
  const fetchStaff = async () => {
    try {
      const res = await axios.get(STAFF_API);
      setStaffList(res.data.data || []);
    } catch (err) {
      console.error("❌ Error fetching staff list:", err);
      setStaffList([]);
    }
  };

  // fetch attendance records (with optional filters)
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterDate) params.date = filterDate; // yyyy-mm-dd
      if (filterStaff && filterStaff !== "ALL") params.staffId = filterStaff;
      const res = await axios.get(API_BASE_URL, { params });
      setAttendances(res.data.data || []);
    } catch (err) {
      console.error("❌ Error fetching attendance:", err);
      setAttendances([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // create attendance
  const handleAddAttendance = async (e) => {
    e.preventDefault();
    try {
      // minimal validation
      if (!formData.staffId || !formData.date || !formData.shiftType) {
        alert("Staff, date and shift are required.");
        return;
      }

      // convert datetime-local to ISO if present (browser input gives local)
      const payload = {
        ...formData,
        staffId: Number(formData.staffId),
        checkInTime: formData.checkInTime || null,
        checkOutTime: formData.checkOutTime || null,
      };

      const res = await axios.post(API_BASE_URL, payload);
      setAttendances((prev) => [res.data.data, ...prev]);
      alert("Attendance marked successfully");
      setIsModalOpen(false);
    } catch (err) {
      console.error("❌ Error creating attendance:", err);
      alert(err.response?.data?.message || "Failed to mark attendance");
    }
  };

  // update attendance
  const handleEditAttendance = async (e) => {
    e.preventDefault();
    try {
      if (!selectedAttendance) return;
      const payload = {
        shiftType: formData.shiftType,
        status: formData.status,
        checkInTime: formData.checkInTime || null,
        checkOutTime: formData.checkOutTime || null,
        remarks: formData.remarks || "",
      };

      const res = await axios.put(`${API_BASE_URL}/${selectedAttendance.id}`, payload);
      setAttendances((prev) =>
        prev.map((a) => (a.id === selectedAttendance.id ? res.data.data : a))
      );
      alert("Attendance updated successfully");
      setIsModalOpen(false);
    } catch (err) {
      console.error("❌ Error updating attendance:", err);
      alert(err.response?.data?.message || "Failed to update attendance");
    }
  };

  // delete
  const handleDeleteAttendance = async (id) => {
    if (!window.confirm("Are you sure you want to delete this attendance?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setAttendances((prev) => prev.filter((a) => a.id !== id));
      alert("Attendance deleted successfully");
    } catch (err) {
      console.error("❌ Error deleting attendance:", err);
      alert("Failed to delete attendance");
    }
  };

  const openAddModal = () => {
    setModalMode("add");
    setSelectedAttendance(null);
    setFormData({
      staffId: staffList[0]?.id || "",
      date: "",
      shiftType: "",
      status: "PRESENT",
      checkInTime: "",
      checkOutTime: "",
      remarks: "",
    });
    setIsModalOpen(true);
  };

  const openViewModal = (att) => {
    setModalMode("view");
    setSelectedAttendance(att);
    setFormData({
      staffId: att.staff?.id || att.staffId || "",
      date: att.date ? att.date.split("T")[0] : "",
      shiftType: att.shiftType || "",
      status: att.status || "",
      checkInTime: att.checkInTime ? new Date(att.checkInTime).toISOString().slice(0, 16) : "",
      checkOutTime: att.checkOutTime ? new Date(att.checkOutTime).toISOString().slice(0, 16) : "",
      remarks: att.remarks || "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (att) => {
    setModalMode("edit");
    setSelectedAttendance(att);
    setFormData({
      staffId: att.staff?.id || att.staffId || "",
      date: att.date ? att.date.split("T")[0] : "",
      shiftType: att.shiftType || "",
      status: att.status || "",
      checkInTime: att.checkInTime ? new Date(att.checkInTime).toISOString().slice(0, 16) : "",
      checkOutTime: att.checkOutTime ? new Date(att.checkOutTime).toISOString().slice(0, 16) : "",
      remarks: att.remarks || "",
    });
    setIsModalOpen(true);
  };

  const filtered = attendances.filter((a) => {
    const staffName =
      `${a.staff?.firstName || ""} ${a.staff?.lastName || ""}`.toLowerCase();
    const matchesSearch =
      staffName.includes(searchQuery.toLowerCase()) ||
      String(a.id).includes(searchQuery);
    return matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
            Staff Attendance
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Mark and manage staff attendance records
          </p>
        </div>
        <Button icon={Plus} onClick={openAddModal} className="w-full sm:w-auto">
          Mark Attendance
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by staff name or record ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>

          <div className="flex gap-3 items-center">
            <select
              value={filterStaff}
              onChange={(e) => setFilterStaff(e.target.value)}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Staff</option>
              {staffList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.user.firstName} {s.user.lastName} ({s.user.role});
                </option>
              ))}
            </select>

            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            />

            <Button
              onClick={() => {
                fetchAttendance();
              }}
            >
              Apply
            </Button>
            <Button
              onClick={() => {
                setFilterDate("");
                setFilterStaff("ALL");
                setSearchQuery("");
                fetchAttendance();
              }}
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-center text-gray-500 py-4">Loading attendance...</p>
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              data={filtered}
              columns={[
                { header: "ID", accessor: "id" },
                {
                  header: "Staff",
                  accessor: (r) =>
                    r.staff ? `${r.staff.firstName} ${r.staff.lastName}` : `#${r.staffId}`,
                },
                { header: "Date", accessor: (r) => (r.date ? r.date.split("T")[0] : "—") },
                { header: "Shift", accessor: "shiftType" },
                { header: "Status", accessor: "status" },
                { header: "Check In", accessor: (r) => formatDate(r.checkInTime) },
                { header: "Check Out", accessor: (r) => formatDate(r.checkOutTime) },
                { header: "Remarks", accessor: "remarks" },
                {
                  header: "Actions",
                  accessor: (row) => (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openViewModal(row)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(row)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAttendance(row.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>

            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
              {modalMode === "view"
                ? "View Attendance"
                : modalMode === "edit"
                ? "Edit Attendance"
                : "Mark Attendance"}
            </h2>

            <form
              onSubmit={
                modalMode === "edit"
                  ? handleEditAttendance
                  : modalMode === "add"
                  ? handleAddAttendance
                  : undefined
              }
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {/* Staff selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Staff
                </label>
                <select
                  value={formData.staffId}
                  disabled={modalMode === "view"}
                  onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                  className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 ${
                    modalMode === "view" ? "bg-gray-100" : ""
                  }`}
                >
                  <option value="">Select staff</option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.user.firstName} {s.user.lastName} ({s.user.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  readOnly={modalMode === "view"}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 ${
                    modalMode === "view" ? "bg-gray-100" : ""
                  }`}
                />
              </div>

              {/* Shift */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shift Type
                </label>
                <select
                  value={formData.shiftType}
                  disabled={modalMode === "view"}
                  onChange={(e) => setFormData({ ...formData, shiftType: e.target.value })}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Shift</option>
                  <option value="DAY">Day</option>
                  <option value="NIGHT">Night</option>
                  <option value="FLEX">Flex</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  disabled={modalMode === "view"}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PRESENT">Present</option>
                  <option value="ABSENT">Absent</option>
                  <option value="LEAVE">Leave</option>
                  <option value="ON_DUTY">On Duty</option>
                </select>
              </div>

              {/* Check in */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.checkInTime}
                  readOnly={modalMode === "view"}
                  onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                  className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 ${
                    modalMode === "view" ? "bg-gray-100" : ""
                  }`}
                />
              </div>

              {/* Check out */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-out Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.checkOutTime}
                  readOnly={modalMode === "view"}
                  onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
                  className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 ${
                    modalMode === "view" ? "bg-gray-100" : ""
                  }`}
                />
              </div>

              {/* Remarks */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  value={formData.remarks}
                  readOnly={modalMode === "view"}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 h-20 ${
                    modalMode === "view" ? "bg-gray-100" : ""
                  }`}
                />
              </div>

              <div className="sm:col-span-2 mt-2">
                {modalMode === "view" ? (
                  <Button onClick={() => setIsModalOpen(false)} className="w-full">
                    Close
                  </Button>
                ) : (
                  <Button type="submit" className="w-full">
                    {modalMode === "edit" ? "Save Changes" : "Mark Attendance"}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffAttendance;

