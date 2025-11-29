// Billing.jsx
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Eye, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data
const mockPatients = [
  { id: 1, user: { firstName: "Rahul", lastName: "Sharma" }, phone: "9876543210", dob: "1985-04-12" },
  { id: 2, user: { firstName: "Priya", lastName: "Mehta" }, phone: "8765432109", dob: "1992-11-30" },
  { id: 3, user: { firstName: "Amit", lastName: "Kumar" }, phone: "7654321098", dob: "1978-07-22" },
  { id: 4, user: { firstName: "Sneha", lastName: "Patel" }, phone: "9988776655", dob: "2000-01-15" },
];

const mockServices = [
  { id: "CONSULT", name: "General Consultation", rate: 1200 },
  { id: "CBC", name: "Complete Blood Count (CBC)", rate: 350 },
  { id: "XRAY", name: "X-Ray (Single View)", rate: 600 },
  { id: "ULTRA", name: "Ultrasound Abdomen", rate: 1500 },
  { id: "MEDS", name: "Medicines (Pharmacy)", rate: 0 }, // custom rate
];

const initialLineItem = { serviceId: "", description: "", quantity: 1, rate: "" };

export default function Billing() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editInvoice, setEditInvoice] = useState(null);
  const [lineItems, setLineItems] = useState([initialLineItem]);

  const [formData, setFormData] = useState({
    invoiceType: "",
    patientId: "",
    paymentMode: "",
    issuedAt: new Date().toISOString().split("T")[0],
    dueAt: "",
    notes: "",
    status: "PENDING",
  });

  // Auto-set due date = issuedAt + 15 days
  useEffect(() => {
    if (formData.issuedAt) {
      const due = new Date(formData.issuedAt);
      due.setDate(due.getDate() + 15);
      setFormData((prev) => ({
        ...prev,
        dueAt: due.toISOString().split("T")[0],
      }));
    }
  }, [formData.issuedAt]);

  const getPatientById = (id) => mockPatients.find((p) => p.id === Number(id)) || null;
  const getServiceById = (id) => mockServices.find((s) => s.id === id) || null;

  const handleLineItemChange = (index, field, value) => {
    const newItems = [...lineItems];
    newItems[index][field] = value;

    // Auto-fill rate if service selected
    if (field === "serviceId" && value) {
      const service = getServiceById(value);
      if (service) {
        newItems[index].description = service.name;
        newItems[index].rate = service.rate;
      } else {
        newItems[index].description = "";
        newItems[index].rate = "";
      }
    }

    setLineItems(newItems);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, initialLineItem]);
  };

  const removeLineItem = (index) => {
    if (lineItems.length > 1) {
      const newItems = lineItems.filter((_, i) => i !== index);
      setLineItems(newItems);
    }
  };

  const calculateTotals = () => {
    let subtotal = 0;
    lineItems.forEach((item) => {
      const qty = Number(item.quantity) || 0;
      const rate = Number(item.rate) || 0;
      subtotal += qty * rate;
    });
    
    return subtotal;
  };

  const totalAmount = calculateTotals();

  const handleCreateForm = () => {
    setShowForm(true);
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const patient = getPatientById(formData.patientId);
    if (!patient) return alert("Please select a valid patient.");

    // Auto-generate invoice number
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const invNum = editInvoice 
      ? editInvoice.invoiceNumber 
      : `INV-${year}${month}-${String(mockInvoices.length + 1).padStart(3, "0")}`;

    const invoiceData = {
      ...formData,
      invoiceNumber: invNum,
      patient,
      lineItems: lineItems.map((item) => ({
        ...item,
        quantity: Number(item.quantity) || 1,
        rate: Number(item.rate) || 0,
      })),
      totalAmount,
      paidAmount: formData.status === "PAID" ? totalAmount : 0,
      paymentStatus: formData.status,
    };

    // Navigate to the billing-invoice path
    navigate("/dashboard/billing-invoice", { state: { invoiceData } });
    setShowForm(false);
  };

  const resetForm = () => {
    setFormData({
      invoiceType: "",
      patientId: "",
      paymentMode: "",
      issuedAt: new Date().toISOString().split("T")[0],
      dueAt: "",
      notes: "",
      status: "PENDING",
    });
    setLineItems([initialLineItem]);
    setEditInvoice(null);
  };

  const handleEdit = (invoice) => {
    // Set the edit invoice data
    setEditInvoice(invoice);
    
    // Populate form with invoice data
    setFormData({
      invoiceType: invoice.invoiceType,
      patientId: invoice.patient.id,
      paymentMode: invoice.paymentMode || "",
      issuedAt: invoice.issuedAt || new Date().toISOString().split("T")[0],
      dueAt: invoice.dueAt || "",
      notes: invoice.notes || "",
      status: invoice.paymentStatus,
    });
    
    // Populate line items with invoice data
    if (invoice.lineItems && invoice.lineItems.length > 0) {
      const formattedLineItems = invoice.lineItems.map(item => ({
        serviceId: item.serviceId || "",
        description: item.description,
        quantity: item.quantity,
        rate: item.rate
      }));
      setLineItems(formattedLineItems);
    } else {
      setLineItems([initialLineItem]);
    }
    
    // Show the form modal
    setShowForm(true);
  };

  const handleDelete = (id) => {
    alert("🗑️ UI Demo: Delete clicked (no API call)");
  };

  const handleViewInvoice = (invoiceId) => {
    // Find the invoice in mockInvoices
    const invoice = mockInvoices.find(inv => inv.invoiceNumber === invoiceId);

    if (invoice) {
      navigate("/dashboard/billing-invoice", {
        state: {
          invoiceData: {
            ...invoice,
            issuedAt: new Date().toISOString().split("T")[0],
            lineItems: [
              { description: "General Consultation", quantity: 1, rate: 1200 },
              { description: "Complete Blood Count (CBC)", quantity: 1, rate: 350 },
              { description: "X-Ray (Single View)", quantity: 1, rate: 600 }
            ]
          }
        }
      });
    } else {
      navigate("/dashboard/billing-invoice");
    }
  };

  // Mock invoices for table (non-editable in this demo)
  const mockInvoices = [
    {
      id: 1,
      invoiceNumber: "INV-2511-001",
      invoiceType: "CONSULTATION",
      patient: { id: 1, user: { firstName: "Rahul", lastName: "Sharma" } },
      totalAmount: 1200,
      paidAmount: 1200,
      paymentStatus: "PAID",
      paymentMode: "CASH",
      issuedAt: "2025-11-01",
      dueAt: "2025-11-16",
      notes: "Regular consultation fee",
      lineItems: [
        { serviceId: "CONSULT", description: "General Consultation", quantity: 1, rate: 1200 }
      ]
    },
    {
      id: 2,
      invoiceNumber: "INV-2511-002",
      invoiceType: "LAB_TESTS",
      patient: { id: 2, user: { firstName: "Priya", lastName: "Mehta" } },
      totalAmount: 950,
      paidAmount: 500,
      paymentStatus: "PARTIAL",
      paymentMode: "CARD",
      issuedAt: "2025-11-05",
      dueAt: "2025-11-20",
      notes: "Blood tests and X-ray",
      lineItems: [
        { serviceId: "CBC", description: "Complete Blood Count (CBC)", quantity: 1, rate: 350 },
        { serviceId: "XRAY", description: "X-Ray (Single View)", quantity: 1, rate: 600 }
      ]
    }
  ];

  return (
    <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-md">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">🧾 Billing Management</h2>
        <button
          onClick={handleCreateForm}
          className="bg-[rgb(167,139,250)] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[rgb(147,119,230)] w-fit"
        >
          <Plus size={18} /> Create Invoice
        </button>
      </div>

      {/* Invoice Table */}
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
                  <td className="p-3 font-mono">{inv.invoiceNumber}</td>
                  <td className="p-3">{inv.invoiceType}</td>
                  <td className="p-3">
                    {inv.patient?.user
                      ? `${inv.patient.user.firstName} ${inv.patient.user.lastName}`
                      : "N/A"}
                  </td>
                  <td className="p-3">₹{inv.totalAmount.toLocaleString()}</td>
                  <td className="p-3">₹{inv.paidAmount.toLocaleString()}</td>
                  <td
                    className={`p-3 font-medium ${inv.paymentStatus === "PAID"
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
                      onClick={() => handleViewInvoice(inv.invoiceNumber)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <Eye size={18} />
                    </button>
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

      {/* Create/Edit Invoice Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                {editInvoice ? "Edit Invoice" : "Create New Invoice"}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  name="patientId"
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  className="w-full border rounded-lg p-3"
                  required
                >
                  <option value="">Select Patient</option>
                  {mockPatients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.user.firstName} {p.user.lastName} • {p.phone}
                    </option>
                  ))}
                </select>

                <select
                  name="invoiceType"
                  value={formData.invoiceType}
                  onChange={(e) => setFormData({ ...formData, invoiceType: e.target.value })}
                  className="w-full border rounded-lg p-3"
                  required
                >
                  <option value="">Select Invoice Type</option>
                  <option value="CONSULTATION">Consultation</option>
                  <option value="PROCEDURE">Procedure</option>
                  <option value="MEDICINES">Medicines</option>
                  <option value="LAB_TESTS">Lab Tests</option>
                  <option value="COMBINED">Combined</option>
                </select>

                <input
                  name="issuedAt"
                  type="date"
                  value={formData.issuedAt}
                  onChange={(e) => setFormData({ ...formData, issuedAt: e.target.value })}
                  className="w-full border rounded-lg p-3"
                  required
                />

                <input
                  name="dueAt"
                  type="date"
                  value={formData.dueAt}
                  readOnly
                  className="w-full border rounded-lg p-3 bg-gray-100"
                />

                <select
                  name="paymentMode"
                  value={formData.paymentMode}
                  onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                  className="w-full border rounded-lg p-3"
                  required
                >
                  <option value="">Select Payment Mode</option>
                  <option value="CASH">Cash</option>
                  <option value="CARD">Card</option>
                  <option value="UPI">UPI</option>
                  <option value="INSURANCE">Insurance</option>
                  <option value="NEFT">NEFT/RTGS</option>
                </select>

                <select
                  name="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border rounded-lg p-3"
                  required
                >
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                  <option value="PARTIAL">Partial</option>
                  <option value="OVERDUE">Overdue</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full border rounded-lg p-3"
                  rows="3"
                  placeholder="Additional notes..."
                />
              </div>

              {/* Line Items */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-700 text-lg">Billing Items</h4>
                  <button
                    type="button"
                    onClick={addLineItem}
                    className="text-purple-600 hover:underline flex items-center gap-1"
                  >
                    <Plus size={16} /> Add Item
                  </button>
                </div>

                {lineItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 mb-4 items-end">
                    <select
                      value={item.serviceId}
                      onChange={(e) => handleLineItemChange(index, "serviceId", e.target.value)}
                      className="col-span-4 border rounded p-3"
                    >
                      <option value="">Select Service</option>
                      {mockServices.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleLineItemChange(index, "description", e.target.value)}
                      placeholder="Description"
                      className="col-span-3 border rounded p-3"
                      required
                    />
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleLineItemChange(index, "quantity", e.target.value)}
                      className="col-span-1 border rounded p-3 text-right"
                      required
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) => handleLineItemChange(index, "rate", e.target.value)}
                      placeholder="Rate"
                      className="col-span-2 border rounded p-3 text-right"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeLineItem(index)}
                      disabled={lineItems.length === 1}
                      className="col-span-2 text-red-500 hover:text-red-700 disabled:opacity-30 py-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium text-lg">Total Amount:</span>
                  <span className="font-bold text-xl">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-6 py-3 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[rgb(167,139,250)] px-6 py-3 text-white rounded-lg hover:bg-[rgb(147,119,230)]"
                >
                  {editInvoice ? "Update Invoice" : "Create Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}