// update 3 – Professional Billing UI (UI-Only, No API)
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";

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
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [editInvoice, setEditInvoice] = useState(null);

  const [lineItems, setLineItems] = useState([initialLineItem]);

  const [formData, setFormData] = useState({
    invoiceType: "",
    patientId: "",
    paymentMode: "",
    issuedAt: new Date().toISOString().split("T")[0],
    dueAt: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const patient = getPatientById(formData.patientId);
    if (!patient) return alert("Please select a valid patient.");

    // Auto-generate invoice number
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const invNum = `INV-${year}${month}-${String(mockInvoices.length + 1).padStart(3, "0")}`;

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
      paidAmount: 0,
      paymentStatus: "PENDING",
    };

    setPreviewData(invoiceData);
    setShowPreview(true);
    setShowForm(false);
  };

  const resetForm = () => {
    setFormData({
      invoiceType: "",
      patientId: "",
      paymentMode: "",
      issuedAt: new Date().toISOString().split("T")[0],
      dueAt: "",
    });
    setLineItems([initialLineItem]);
    setEditInvoice(null);
  };

  const handleEdit = (invoice) => {
    alert("Edit with line items not implemented in demo");
  };

  const handleDelete = (id) => {
    alert("🗑️ UI Demo: Delete clicked (no API call)");
  };

  // Mock invoices for table (non-editable in this demo)
  const mockInvoices = [
    {
      id: 1,
      invoiceNumber: "INV-2511-001",
      invoiceType: "CONSULTATION",
      patient: { user: { firstName: "Rahul", lastName: "Sharma" } },
      totalAmount: 1200,
      paidAmount: 1200,
      paymentStatus: "PAID",
    },
  ];

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
                      onClick={() => alert("Preview not linked in demo")}
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

      {/* Create/Edit Invoice Form - LARGER MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start z-50 p-4 pt-10 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-5xl max-h-[90vh]"> {/* ← Updated size */}
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {editInvoice ? "Edit Invoice" : "Create New Invoice"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  name="patientId"
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  className="w-full border rounded-lg p-2"
                  required
                >
                  <option value="">Select Patient</option>
                  {mockPatients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.user.firstName} {p.user.lastName} • {p.phone}
                    </option>
                  ))}
                </select>

                <input
                  name="issuedAt"
                  type="date"
                  value={formData.issuedAt}
                  onChange={(e) => setFormData({ ...formData, issuedAt: e.target.value })}
                  className="w-full border rounded-lg p-2"
                  required
                />

                <input
                  name="dueAt"
                  type="date"
                  value={formData.dueAt}
                  readOnly
                  className="w-full border rounded-lg p-2 bg-gray-100"
                />
              </div>

              {/* Line Items */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-700">Billing Items</h4>
                  <button
                    type="button"
                    onClick={addLineItem}
                    className="text-sm text-purple-600 hover:underline"
                  >
                    + Add Item
                  </button>
                </div>

                {lineItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 mb-3 items-end">
                    <select
                      value={item.serviceId}
                      onChange={(e) => handleLineItemChange(index, "serviceId", e.target.value)}
                      className="col-span-4 border rounded p-2 text-sm"
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
                      className="col-span-3 border rounded p-2 text-sm"
                      required
                    />
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleLineItemChange(index, "quantity", e.target.value)}
                      className="col-span-1 border rounded p-2 text-sm text-right"
                      required
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) => handleLineItemChange(index, "rate", e.target.value)}
                      placeholder="Rate"
                      className="col-span-2 border rounded p-2 text-sm text-right"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeLineItem(index)}
                      disabled={lineItems.length === 1}
                      className="col-span-2 text-red-500 hover:text-red-700 text-sm disabled:opacity-30"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium">Total Amount:</span>
                  <span className="font-bold text-lg">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <select
                name="paymentMode"
                value={formData.paymentMode}
                onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                className="w-full border rounded-lg p-2"
                required
              >
                <option value="">Select Payment Mode</option>
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
                <option value="UPI">UPI</option>
                <option value="INSURANCE">Insurance</option>
                <option value="NEFT">NEFT/RTGS</option>
              </select>

              <div className="flex justify-end gap-3 pt-2">
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
                  Generate Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Preview Modal */}
      {showPreview && previewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden">
            <div className="border-b p-6 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-purple-700">ClinicCare Hospital</h2>
                  <p className="text-gray-600 text-sm mt-1">
                    #456, Health Avenue, Bangalore • 📞 +91 98765 43210
                  </p>
                  <p className="text-gray-500 text-xs">GSTIN: 29AABCCDD1234F1Z5</p>
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-bold">INVOICE</h3>
                  <p className="text-gray-700">{previewData.invoiceNumber}</p>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(previewData.issuedAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Patient & Doctor Info */}
            <div className="grid grid-cols-2 gap-6 p-6 pt-2">
              <div>
                <h4 className="font-medium text-gray-700">Billed To:</h4>
                <p className="font-medium">
                  {previewData.patient.user.firstName} {previewData.patient.user.lastName}
                </p>
                <p>📱 {previewData.patient.phone}</p>
                <p>
                  Age:{" "}
                  {Math.floor(
                    (new Date() - new Date(previewData.patient.dob)) / (365.25 * 24 * 60 * 60 * 1000)
                  )}
                </p>
              </div>
              <div className="text-right">
                <h4 className="font-medium text-gray-700">Attending Doctor:</h4>
                <p className="font-medium">Dr. Deep Depnashwani</p>
                <p className="text-sm">Specialization: General Physician</p>
                <p className="text-sm">Employee ID: 3</p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="px-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Description</th>
                    <th className="text-right py-2">Qty</th>
                    <th className="text-right py-2">Rate (₹)</th>
                    <th className="text-right py-2">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.lineItems.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="py-2">{item.description}</td>
                      <td className="text-right py-2">{item.quantity}</td>
                      <td className="text-right py-2">{Number(item.rate).toLocaleString()}</td>
                      <td className="text-right py-2">
                        {(item.quantity * item.rate).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-bold">
                    <td colSpan="3" className="text-right py-2">
                      Total Amount:
                    </td>
                    <td className="text-right py-2">₹{previewData.totalAmount.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="border-t p-6 pt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert("✅ Bill saved! (UI Demo)");
                  setShowPreview(false);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}