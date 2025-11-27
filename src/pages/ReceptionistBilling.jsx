// update 2 – UI-Only (No API)

import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";

// Mock data for UI preview
const mockInvoices = [
  {
    id: 1,
    invoiceNumber: "INV-001",
    invoiceType: "CONSULTATION",
    patient: { user: { firstName: "Rahul", lastName: "Sharma" } },
    totalAmount: 1200,
    paidAmount: 1200,
    paymentStatus: "PAID",
  },
  {
    id: 2,
    invoiceNumber: "INV-002",
    invoiceType: "LAB",
    patient: { user: { firstName: "Priya", lastName: "Mehta" } },
    totalAmount: 2500,
    paidAmount: 1000,
    paymentStatus: "PARTIAL",
  },
  {
    id: 3,
    invoiceNumber: "INV-003",
    invoiceType: "PHARMACY",
    patient: { user: { firstName: "Amit", lastName: "Kumar" } },
    totalAmount: 850,
    paidAmount: 0,
    paymentStatus: "PENDING",
  },
];

const mockPatients = [
  { id: 1, user: { firstName: "Rahul", lastName: "Sharma" } },
  { id: 2, user: { firstName: "Priya", lastName: "Mehta" } },
  { id: 3, user: { firstName: "Amit", lastName: "Kumar" } },
  { id: 4, user: { firstName: "Sneha", lastName: "Patel" } },
];

export default function ReceptionistBilling() {
  const [showForm, setShowForm] = useState(false);
  const [editInvoice, setEditInvoice] = useState(null);

  const [formData, setFormData] = useState({
    invoiceNumber: "",
    invoiceType: "",
    patientId: "",
    totalAmount: "",
    paidAmount: "",
    paymentMode: "",
    paymentStatus: "PENDING",
    issuedAt: "",
    dueAt: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // No real submission — just close form for demo
    alert("✅ UI Demo: Form submitted (no API call)");
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      invoiceNumber: "",
      invoiceType: "",
      patientId: "",
      totalAmount: "",
      paidAmount: "",
      paymentMode: "",
      paymentStatus: "PENDING",
      issuedAt: "",
      dueAt: "",
    });
    setEditInvoice(null);
  };

  const handleEdit = (invoice) => {
    setEditInvoice(invoice);
    setFormData({
      ...invoice,
      patientId: invoice.patientId || "",
      totalAmount: invoice.totalAmount || "",
      paidAmount: invoice.paidAmount || "",
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    // Just for UI feedback
    alert("🗑️ UI Demo: Delete clicked (no API call)");
  };

  return (
    <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-md">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">🧾 Billing Management</h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-[rgb(167,139,250)] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[rgb(147,119,230)] w-fit"
        >
          <Plus size={18} /> New Invoice
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm sm:text-base min-w-[600px]">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3">Invoice</th>
              <th className="p-3">Type</th>
              <th className="p-3">Patient</th>
              <th className="p-3">Total</th>
              <th className="p-3">Paid</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockInvoices.length > 0 ? (
              mockInvoices.map((inv) => (
                <tr key={inv.id} className="border-b hover:bg-purple-50">
                  <td className="p-3">{inv.invoiceNumber}</td>
                  <td className="p-3">{inv.invoiceType}</td>
                  <td className="p-3">
                    {inv.patient?.user
                      ? `${inv.patient.user.firstName} ${inv.patient.user.lastName}`
                      : "N/A"}
                  </td>
                  <td className="p-3">₹{inv.totalAmount}</td>
                  <td className="p-3">₹{inv.paidAmount}</td>
                  <td
                    className={`p-3 font-medium ${
                      inv.paymentStatus === "PAID"
                        ? "text-green-600"
                        : inv.paymentStatus === "PARTIAL"
                        ? "text-blue-600"
                        : "text-orange-600"
                    }`}
                  >
                    {inv.paymentStatus}
                  </td>
                  <td className="p-3 flex justify-end gap-3">
                    <button
                      onClick={() => handleEdit(inv)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(inv.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Popup Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-[450px] max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {editInvoice ? "Edit Invoice" : "Create New Invoice"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
                placeholder="Invoice Number"
                className="w-full border rounded-lg p-2"
                required
              />

              <select
                name="invoiceType"
                value={formData.invoiceType}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                required
              >
                <option value="">Select Invoice Type</option>
                <option value="CONSULTATION">Consultation</option>
                <option value="LAB">Lab</option>
                <option value="RADIOLOGY">Radiology</option>
                <option value="PHARMACY">Pharmacy</option>
                <option value="PROCEDURE">Procedure</option>
                <option value="ADMISSION">Admission</option>
                <option value="OTHER">Other</option>
              </select>

              <select
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                required
              >
                <option value="">Select Patient</option>
                {mockPatients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.user?.firstName} {p.user?.lastName}
                  </option>
                ))}
              </select>

              <input
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
                placeholder="Total Amount"
                className="w-full border rounded-lg p-2"
                required
              />
              <input
                name="paidAmount"
                value={formData.paidAmount}
                onChange={handleChange}
                placeholder="Paid Amount"
                className="w-full border rounded-lg p-2"
              />

              <select
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                required
              >
                <option value="">Select Payment Mode</option>
                <option value="CASH">Cash</option>
                <option value="FIB">FIB</option>
                <option value="CARD">Card</option>
                <option value="INSURANCE">Insurance</option>
                <option value="NEFT">NEFT</option>
                <option value="UPI">UPI</option>
                <option value="OTHER">Other</option>
              </select>

              <select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                required
              >
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="PARTIAL">Partial</option>
                <option value="REFUNDED">Refunded</option>
                <option value="FAILED">Failed</option>
              </select>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[rgb(167,139,250)] px-4 py-2 text-white rounded-lg hover:bg-[rgb(147,119,230)]"
                >
                  {editInvoice ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}