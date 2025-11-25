



// src/pages/Radiology.jsx
import { useEffect, useState } from "react";
import { Activity, Search, Plus, FileImage } from "../lib/icons";
import { Button } from "../components/common/Button";
import { DataTable } from "../components/common/DataTable";
import { Modal } from "../components/common/Modal"; // or your Modal path
import { radiologyApi } from "../services/api/radiology.js";

export function Radiology() {
  const [searchQuery, setSearchQuery] = useState("");
  const [radiologyOrders, setRadiologyOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    orderId: "",
    patientName: "",
    studyType: "",
    orderedBy: "",
    orderedDate: "",
    status: "PENDING",
  });

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await radiologyApi.getAllOrders();
      // If backend wraps data (e.g., { orders: [...] }) adapt accordingly
      setRadiologyOrders(Array.isArray(data) ? data : (data.orders || []));
    } catch (err) {
      console.error("Failed to fetch radiology orders", err);
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Reset form
  const openCreate = () => {
    setEditingOrder(null);
    setForm({
      orderId: "",
      patientName: "",
      studyType: "",
      orderedBy: "",
      orderedDate: "",
      status: "PENDING",
    });
    setIsModalOpen(true);
  };

  const openEdit = (order) => {
    setEditingOrder(order);
    setForm({
      orderId: order.orderId ?? "",
      patientName: order.patientName ?? "",
      studyType: order.studyType ?? "",
      orderedBy: order.orderedBy ?? "",
      orderedDate: order.orderedDate ? new Date(order.orderedDate).toISOString().slice(0,10) : "",
      status: order.status ?? "PENDING",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingOrder) {
        await radiologyApi.updateOrder(editingOrder.id, {
          ...form,
          orderedDate: form.orderedDate || undefined,
        });
        // optimistic: update local list
        setRadiologyOrders((prev) =>
          prev.map((p) => (p.id === editingOrder.id ? { ...p, ...form } : p))
        );
      } else {
        const created = await radiologyApi.createOrder({
          ...form,
          orderedDate: form.orderedDate || new Date().toISOString(),
        });
        // backend might return created.order or plain object
        const item = created.order ?? created;
        setRadiologyOrders((prev) => [item, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Create/update failed", err);
      alert("Operation failed: " + (err?.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      await radiologyApi.deleteOrder(id);
      setRadiologyOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed: " + (err?.response?.data?.message || err.message));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";
      case "COMPLETED":
        return "bg-purple-100 text-purple-700";
      case "REPORTED":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filtered = radiologyOrders.filter((r) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      (r.patientName || "").toLowerCase().includes(q) ||
      (r.orderId || "").toLowerCase().includes(q) ||
      (r.studyType || "").toLowerCase().includes(q) ||
      (r.orderedBy || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
            Radiology
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Manage imaging studies and reports
          </p>
        </div>
        <Button icon={Plus} onClick={openCreate}>
          Create Radiology Order
        </Button>
      </div>

      {/* Stats - static or compute from list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total", value: radiologyOrders.length || "0", icon: Activity, color: "blue" },
          { label: "Pending", value: radiologyOrders.filter(o => o.status==="PENDING").length || "0", icon: Activity, color: "yellow" },
          { label: "In Progress", value: radiologyOrders.filter(o => o.status==="IN_PROGRESS").length || "0", icon: Activity, color: "purple" },
          { label: "Completed/Reported", value: radiologyOrders.filter(o => ["COMPLETED","REPORTED"].includes(o.status)).length || "0", icon: FileImage, color: "green" },
        ].map((stat, i) => (
          <div key={i} className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-5 border border-gray-100 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat.color === "blue" ? "bg-blue-100 text-blue-600" : stat.color === "yellow" ? "bg-yellow-100 text-yellow-600" : stat.color === "purple" ? "bg-purple-100 text-purple-600" : "bg-green-100 text-green-600"}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Search + Table */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100 overflow-x-auto">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="relative w-full sm:w-1/2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by ID, patient, or study type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              data={filtered}
              columns={[
                { header: "Order ID", accessor: "orderId" },
                { header: "Patient", accessor: "patientName" },
                { header: "Study Type", accessor: "studyType" },
                { header: "Ordered By", accessor: "orderedBy" },
                { header: "Date", accessor: (r) => (r.orderedDate ? new Date(r.orderedDate).toLocaleDateString() : "") },
                {
                  header: "Status",
                  accessor: (r) => (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(r.status)}`}>
                      {r.status?.replace("_", " ") || ""}
                    </span>
                  ),
                },
                {
                  header: "Actions",
                  accessor: (r) => (
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(r)} className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">Edit</button>
                      <button onClick={() => handleDelete(r.id)} className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg">Delete</button>
                      {["REPORTED","COMPLETED"].includes(r.status) && <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">View Report</button>}
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}
      </div>

      {/* Modal (create / edit) */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingOrder ? "Edit Radiology Order" : "Create Radiology Order"} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Order ID", key: "orderId", type: "text" },
            { label: "Patient Name", key: "patientName", type: "text" },
            { label: "Study Type", key: "studyType", type: "text" },
            { label: "Ordered By (Doctor)", key: "orderedBy", type: "text" },
            { label: "Ordered Date", key: "orderedDate", type: "date" },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input
                type={f.type}
                value={form[f.key] || ""}
                onChange={(e) => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm sm:text-base"
                required={f.key !== "orderId"} // make orderId optional
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={form.status} onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))} className="w-full border border-gray-300 rounded-lg p-2 text-sm sm:text-base">
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="REPORTED">Reported</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-blue-600 text-white" disabled={submitting}>
              {submitting ? (editingOrder ? "Saving..." : "Creating...") : (editingOrder ? "Save Changes" : "Add Order")}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
