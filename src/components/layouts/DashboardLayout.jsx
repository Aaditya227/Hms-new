import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../common/Sidebar";
import { TopBar } from "../common/TopBar";
import { useAuth } from "../../context/AuthContext";

import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Pill,
  FlaskConical,
  Activity,
  DollarSign,
  UserCog,
  ClipboardList,
} from "../../lib/icons";

import { Blocks, MapPin, RadioTower } from "lucide-react";

// =======================================
// NAV ITEMS
// =======================================
const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: [
      "ADMIN",
      "DOCTOR",
      "NURSE",
      "RECEPTIONIST",
      "PHARMACIST",
      "LAB_TECH",
      "RADIOLOGIST",
      "FINANCE",
      "HR",
      "PATIENT",
      "AUDITOR",
    ],
  },

  // Doctor
  { label: "Patient", path: "/dashboard/doctorspatient", icon: Users, roles: ["DOCTOR"] },
  { label: "Appointments", path: "/dashboard/doctorsappointment", icon: Calendar, roles: ["DOCTOR"] },
  { label: "Prescriptions", path: "/dashboard/doctors-prescriptions", icon: FileText, roles: ["DOCTOR"] },
  { label: "Laboratory", path: "/dashboard/doctors-laboratory", icon: FlaskConical, roles: ["DOCTOR"] },
  { label: "Radiology", path: "/dashboard/doctors-radiology", icon: Activity, roles: ["DOCTOR"] },
  { label: "Pharmacy", path: "/dashboard/doctor-pharmacy", icon: Pill, roles: ["DOCTOR"] },
  // Nurse
  { label: "Patient", path: "/dashboard/nursepatient", icon: Users, roles: ["NURSE"] },
  { label: "Prescriptions", path: "/dashboard/nurse-prescriptions", icon: FileText, roles: ["NURSE"] },
  { label: "Radiology Report", path: "/dashboard/nurse-radiology-report", icon: Activity, roles: ["NURSE"] },
  { label: "Lab Report", path: "/dashboard/nurse-lab-report", icon: FlaskConical, roles: ["NURSE"] },
  // Receptionist
  { label: "Patients", path: "/dashboard/receptionist-patients", icon: Users, roles: ["RECEPTIONIST"] },
  { label: "Appointments", path: "/dashboard/receptionist-appointments", icon: Calendar, roles: ["RECEPTIONIST"] },
  // patient
  { label: "Appointment", path: "/dashboard/patients-appointments", icon: Calendar, roles: ["PATIENT"] },
  { label: "Prescriptions", path: "/dashboard/patient-prescriptions", icon: FileText, roles: ["PATIENT"] },
  { label: "Doctor", path: "/dashboard/patient-doctor", icon: Users, roles: ["PATIENT"] },
  { label: "Lab Report", path: "/dashboard/patient-lab-report", icon: FlaskConical, roles: ["PATIENT"] },
  { label: "Radiology Report", path: "/dashboard/patient-radiology", icon: Activity, roles: ["PATIENT"] },
  { label: "Payment History", path: "/dashboard/patient-payment-history", icon: DollarSign, roles: ["PATIENT"] },
  // Pharmacist
  { label: "Pharmacy", path: "/dashboard/pharmacist-pharmacy", icon: Pill, roles: ["PHARMASTIC"] },
  // Lab Tech
  { label: "Lab Request", path: "/dashboard/lab-request", icon: FlaskConical, roles: ["LABTECH"] },
  { label: "Lab Report", path: "/dashboard/lab-report", icon: FileText, roles: ["LABTECH"] },
  // Radiologist 
  { label: "Radiology Request", path: "/dashboard/radiology-request", icon: Activity, roles: ["RADIOLOGIST"] },
  { label: "Radiology Report", path: "/dashboard/radiology-report", icon: FileText, roles: ["RADIOLOGIST"] },
  // Common
  { label: "Patients", path: "/dashboard/patients", icon: Users, roles: ["ADMIN"] },
  { label: "Department", path: "/dashboard/department", icon: Blocks, roles: ["ADMIN"] },
  { label: "Appointments", path: "/dashboard/appointments", icon: Calendar, roles: ["ADMIN"] },
  { label: "Prescriptions", path: "/dashboard/prescriptions", icon: FileText, roles: ["ADMIN"] },
  { label: "Pharmacy", path: "/dashboard/pharmacy", icon: Pill, roles: ["ADMIN"] },
  { label: "Laboratory", path: "/dashboard/laboratory", icon: FlaskConical, roles: ["ADMIN"] },
  { label: "Radiology", path: "/dashboard/radiology", icon: Activity, roles: ["ADMIN"] },
  { label: "Billing", path: "/dashboard/billing", icon: DollarSign, roles: ["ADMIN"] },
  { label: "Staff", path: "/dashboard/staff", icon: UserCog, roles: ["ADMIN"] },
  { label: "Staff Attendance", path: "/dashboard/staffattendance", icon: Users, roles: ["ADMIN"] },
  { label: "Reports", path: "/dashboard/reports", icon: ClipboardList, roles: ["ADMIN"] },
  { label: "Location Tracker", path: "/dashboard/locationtracker", icon: MapPin, roles: ["ADMIN"] },
  { label: "Beacon Manager", path: "/dashboard/beaconmanager", icon: RadioTower, roles: ["ADMIN"] },
];

// =======================================
// DASHBOARD LAYOUT FIXED
// =======================================
export function DashboardLayout() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);

  // Recover role from AuthContext OR LocalStorage
  useEffect(() => {
    let savedRole = user?.role_name || localStorage.getItem("userRole");
    if (savedRole) {
      savedRole = savedRole.toUpperCase();
      setCurrentRole(savedRole);
    }
  }, [user]);

  // Wait until role is ready
  if (!currentRole) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-hospital-purple/5 flex flex-col md:flex-row">

      {/* Sidebar */}
      <Sidebar
        items={navItems}
        currentRole={currentRole}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
        <TopBar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 pt-16 px-4 sm:px-6 md:px-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
