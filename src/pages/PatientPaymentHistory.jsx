import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataTable } from "../components/common/DataTable";
import { Modal } from "../components/common/Modal";
import { Search, Eye } from "lucide-react";
import base_url from "../utils/baseurl";

export default function PatientPaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${base_url}/payments/patient`); 
      setPayments(res.data.data || []);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter((p) =>
    p.invoice_id?.toString().includes(searchQuery) ||
    p.service_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.payment_method?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading)
    return <p className="text-center py-8 text-gray-500">Loading payment history...</p>;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">
          Payment History
        </h1>
        <p className="text-gray-600 mt-1">
          View all payments made for consultations and medical services
        </p>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Total Payments", value: payments.length, color: "blue" },
          {
            label: "Paid Amount",
            value: `₹ ${payments.reduce((a, b) => a + (b.amount_paid || 0), 0)}`,
            color: "green",
          },
          {
            label: "Pending Amount",
            value: `₹ ${payments.reduce((a, b) => a + (b.due_amount || 0), 0)}`,
            color: "orange",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-5 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <Eye className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Table */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
          <div className="w-full sm:w-1/2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by Invoice ID, Service, Method..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        {filteredPayments.length === 0 ? (
          <p className="text-center text-gray-500 py-6">No payments found.</p>
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              data={filteredPayments}
              columns={[
                { header: "Invoice ID", accessor: "invoice_id" },
                { header: "Service", accessor: "service_name" },
                {
                  header: "Amount Paid",
                  accessor: (p) => `₹ ${p.amount_paid}`,
                },
                {
                  header: "Due Amount",
                  accessor: (p) => `₹ ${p.due_amount}`,
                },
                {
                  header: "Payment Method",
                  accessor: "payment_method",
                },
                {
                  header: "Date",
                  accessor: (p) => p.date?.split("T")[0],
                },

                // View Only
                {
                  header: "Actions",
                  accessor: (p) => (
                    <button
                      onClick={() => {
                        setSelectedPayment(p);
                        setViewModalOpen(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  ),
                },
              ]}
            />
          </div>
        )}
      </div>

      {/* View Payment Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Payment Details"
      >
        {selectedPayment && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800 text-sm">
            <p><strong>Invoice ID:</strong> {selectedPayment.invoice_id}</p>
            <p><strong>Service:</strong> {selectedPayment.service_name}</p>
            <p><strong>Amount Paid:</strong> ₹ {selectedPayment.amount_paid}</p>
            <p><strong>Due Amount:</strong> ₹ {selectedPayment.due_amount}</p>
            <p><strong>Payment Method:</strong> {selectedPayment.payment_method}</p>
            <p><strong>Date:</strong> {selectedPayment.date?.split("T")[0]}</p>
            <p className="sm:col-span-2">
              <strong>Notes:</strong> {selectedPayment.notes || "—"}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
