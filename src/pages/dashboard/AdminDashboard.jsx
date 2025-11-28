import React, { useState } from "react";
import {
  Users,
  UserCheck,
  DollarSign,
  Calendar,
  AlertCircle,
  TrendingUp,
} from "../../lib/icons";
import { StatsCard } from "../../components/common/StatsCard";
import { DataTable } from "../../components/common/DataTable";

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPatients: 1248,
    totalStaff: 86,
    todayRevenue: 125640.50,
    totalAppointments: 42,
  });

  const [pendingPayments, setPendingPayments] = useState([
    {
      id: 1,
      invoiceNumber: "INV-2023-001",
      patient: {
        user: {
          firstName: "John",
          lastName: "Doe"
        }
      },
      totalAmount: 5000,
      paidAmount: 2000
    },
    {
      id: 2,
      invoiceNumber: "INV-2023-002",
      patient: {
        user: {
          firstName: "Jane",
          lastName: "Smith"
        }
      },
      totalAmount: 7500,
      paidAmount: 0
    },
    {
      id: 3,
      invoiceNumber: "INV-2023-003",
      patient: {
        user: {
          firstName: "Robert",
          lastName: "Johnson"
        }
      },
      totalAmount: 3200,
      paidAmount: 1000
    }
  ]);

  const [recentAppointments, setRecentAppointments] = useState([
    {
      id: 1,
      appointmentNumber: "APT-001",
      patient: {
        user: {
          firstName: "Sarah",
          lastName: "Williams"
        }
      },
      doctor: {
        user: {
          firstName: "Michael",
          lastName: "Brown"
        }
      },
      scheduledAt: "2023-11-15T09:30:00",
      status: "COMPLETED"
    },
    {
      id: 2,
      appointmentNumber: "APT-002",
      patient: {
        user: {
          firstName: "David",
          lastName: "Miller"
        }
      },
      doctor: {
        user: {
          firstName: "Jennifer",
          lastName: "Davis"
        }
      },
      scheduledAt: "2023-11-15T10:15:00",
      status: "IN_CONSULTATION"
    },
    {
      id: 3,
      appointmentNumber: "APT-003",
      patient: {
        user: {
          firstName: "Lisa",
          lastName: "Garcia"
        }
      },
      doctor: {
        user: {
          firstName: "Robert",
          lastName: "Wilson"
        }
      },
      scheduledAt: "2023-11-15T11:00:00",
      status: "SCHEDULED"
    },
    {
      id: 4,
      appointmentNumber: "APT-004",
      patient: {
        user: {
          firstName: "James",
          lastName: "Martinez"
        }
      },
      doctor: {
        user: {
          firstName: "Patricia",
          lastName: "Anderson"
        }
      },
      scheduledAt: "2023-11-15T11:45:00",
      status: "SCHEDULED"
    }
  ]);

  const [loading] = useState(false);
  const [error] = useState(null);

  return (
    <div className="space-y-6 px-3 sm:px-4 md:px-6 lg:px-8 mt-10">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Overview of hospital operations and metrics
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3">
          Error loading dashboard: {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Patients"
          value={stats.totalPatients?.toLocaleString()}
          icon={Users}
          color="purple"
          trend={{ value: "+12%", isPositive: true }}
        />
        <StatsCard
          title="Total Staff"
          value={stats.totalStaff?.toLocaleString()}
          icon={UserCheck}
          color="teal"
          trend={{ value: "+3", isPositive: true }}
        />
        <StatsCard
          title="Revenue (Today)"
          value={`₹${Number(stats.todayRevenue || 0).toFixed(2)}`}
          icon={DollarSign}
          color="green"
          trend={{ value: "+18%", isPositive: true }}
        />
        <StatsCard
          title="Appointments"
          value={stats.totalAppointments?.toLocaleString()}
          icon={Calendar}
          color="blue"
        />
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Pending Payments */}
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
            Pending Payments
          </h2>
          <div className="space-y-3">
            {loading ? (
              <p className="text-gray-500">Loading payments...</p>
            ) : pendingPayments.length === 0 ? (
              <p className="text-gray-500">No pending payments</p>
            ) : (
              pendingPayments.map((inv) => {
                const patientName = inv?.patient?.user
                  ? `${inv.patient.user.firstName || ""} ${inv.patient.user.lastName || ""}`.trim()
                  : "Unknown Patient";
                const amountDue = (inv.totalAmount || 0) - (inv.paidAmount || 0);
                return (
                  <div
                    key={inv.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-yellow-50 rounded-lg"
                  >
                    <div className="text-center sm:text-left">
                      <p className="font-medium text-gray-900">{patientName}</p>
                      <p className="text-sm text-gray-600">Invoice #{inv.invoiceNumber || inv.id}</p>
                    </div>
                    <span className="font-bold text-yellow-600">₹{Number(amountDue).toFixed(2)}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Department Performance (static list kept — could be dynamic later) */}
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
            Department Performance
          </h2>
          <div className="space-y-3">
            {['Cardiology', 'Neurology', 'Orthopedics'].map((dept, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900">{dept}</span>
                </div>
                <span className="font-bold text-gray-900">{85 + i * 3}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Recent Activity</h2>
        <div className="overflow-x-auto">
          <DataTable
            data={recentAppointments}
            columns={[
              { header: "Token", accessor: "appointmentNumber" },
              {
                header: "Patient",
                accessor: (row) =>
                  row.patient?.user ? `${row.patient.user.firstName} ${row.patient.user.lastName}` : "Unknown",
              },
              {
                header: "Doctor",
                accessor: (row) =>
                  row.doctor?.user ? `Dr. ${row.doctor.user.firstName} ${row.doctor.user.lastName}` : "-",
              },
              { header: "Time", accessor: (row) => new Date(row.scheduledAt).toLocaleString() },
              {
                header: "Status",
                accessor: (row) => (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      row.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : row.status === "IN_CONSULTATION"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {row.status}
                  </span>
                ),
              },
            ]}
          />
        </div>
      </div>

      {/* System Alerts */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-4 sm:p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 text-center sm:text-left">
          <div className="flex justify-center sm:justify-start">
            <div className="p-3 bg-yellow-100 rounded-lg inline-block">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">System Alerts</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• 3 medicines below reorder level</li>
              <li>• 2 pending lab results from yesterday</li>
              <li>• Database backup scheduled for tonight</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;