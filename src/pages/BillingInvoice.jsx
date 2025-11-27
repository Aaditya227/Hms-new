// BillingInvoice.jsx
import { useLocation } from "react-router-dom";

const BillingInvoice = () => {
  const location = useLocation();

  const previewData = location.state?.invoiceData || {
    invoiceNumber: "INV-2511-002",
    issuedAt: "2025-11-27",
    patient: {
      user: { firstName: "Rahul", lastName: "Sharma" },
      phone: "9876543210",
      dob: "1985-04-12",
    },
    lineItems: [{ description: "General Consultation", quantity: 1, rate: 1200 }],
    totalAmount: 1200,
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mx-auto">

        {/* TOP: Hospital Left + Invoice + Doctor Right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

          {/* LEFT SIDE — Hospital Details + Billed To */}
          <div>
            {/* Hospital Info */}
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              ClinicCare Hospital
            </h1>
            <p className="text-gray-600 mb-1">#456, Health Avenue, Bangalore</p>
            <p className="text-gray-600 mb-1">📞 +91 98765 43210</p>
            <p className="text-gray-500 text-sm mb-6">GSTIN: 29AABCCDD1234F1Z5</p>

            {/* Billed To */}
            <h3 className="font-semibold text-gray-700 mb-2">Billed To:</h3>
            <p className="font-medium text-lg">
              {previewData.patient.user.firstName} {previewData.patient.user.lastName}
            </p>
            <p className="mt-1">📱 {previewData.patient.phone}</p>
            <p className="mt-1">
              Age:{" "}
              {Math.floor(
                (new Date() - new Date(previewData.patient.dob)) /
                  (365.25 * 24 * 60 * 60 * 1000)
              )}
            </p>
          </div>

          {/* RIGHT SIDE — Invoice Info + Attending Doctor */}
          <div className="text-left md:text-right">

            {/* Invoice Info */}
            <h2 className="text-2xl font-bold text-gray-800">INVOICE</h2>
            <p className="text-gray-700 mt-1">{previewData.invoiceNumber}</p>
            <p className="text-gray-500 mt-1">
              Date: {new Date(previewData.issuedAt).toLocaleDateString("en-IN")}
            </p>

            {/* Doctor Info */}
            <div className="mt-6 md:mt-10">
              <h3 className="font-semibold text-gray-700 mb-2">Attending Doctor:</h3>
              <p className="font-medium text-lg">Dr. Deep Depnashwani</p>
              <p className="mt-1">Specialization: General Physician</p>
              <p className="mt-1">Employee ID: 3</p>
            </div>

          </div>

        </div>

        {/* Line Items Table */}
        <div className="mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3">Description</th>
                <th className="text-right py-3">Qty</th>
                <th className="text-right py-3">Rate (₹)</th>
                <th className="text-right py-3">Amount (₹)</th>
              </tr>
            </thead>

            <tbody>
              {previewData.lineItems.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-200">
                  <td className="py-3">{item.description}</td>
                  <td className="text-right py-3">{item.quantity}</td>
                  <td className="text-right py-3">
                    {Number(item.rate).toLocaleString()}
                  </td>
                  <td className="text-right py-3">
                    {(item.quantity * item.rate).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className="font-bold">
                <td colSpan="3" className="text-right py-3">
                  Total Amount:
                </td>
                <td className="text-right py-3">
                  ₹{previewData.totalAmount.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Back
          </button>

          <button
            onClick={() => {
              alert("✅ Bill saved! (UI Demo)");
              window.history.back();
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Save & Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default BillingInvoice;
