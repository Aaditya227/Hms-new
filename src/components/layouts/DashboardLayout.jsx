

// 1
import { useState } from "react";
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





  // admin//


// Doctors//
{ label: "Doctors Patient", path: "/dashboard/doctorspatient", icon: Users, roles: ["DOCTOR"] },
{ label: " Doctors Appointments", path: "/dashboard/doctorsappointment", icon: Users, roles: ["DOCTOR"] },
{ label: "Doctors Prescriptions", path: "/dashboard/doctors-prescriptions", icon: Users, roles: ["DOCTOR"] },
{ label: "Doctors Laboratory", path: "/dashboard/doctors-laboratory", icon: Users, roles: ["DOCTOR"] },
{ label: "Doctors Radiology", path: "/dashboard/doctors-radiology", icon: Users, roles: ["DOCTOR"] },

{ label: "Patients", path: "/dashboard/patients", icon: Users, roles: ["ADMIN",  "NURSE", "RECEPTIONIST"] },


  { label: "Department", path: "/dashboard/department", icon:  Blocks, roles: ["ADMIN"] },
  { label: "Appointments", path: "/dashboard/appointments", icon: Calendar, roles: ["ADMIN",  "RECEPTIONIST"] },
  { label: "Prescriptions", path: "/dashboard/prescriptions", icon: FileText, roles: ["ADMIN", "DOCTOR", "PHARMACIST"] },
  { label: "Pharmacy", path: "/dashboard/pharmacy", icon: Pill, roles: ["ADMIN", "PHARMACIST"] },
  { label: "Laboratory", path: "/dashboard/laboratory", icon: FlaskConical, roles: ["ADMIN", "DOCTOR", "LAB_TECH"] },
  { label: "Radiology", path: "/dashboard/radiology", icon: Activity, roles: ["ADMIN", "DOCTOR", "RADIOLOGIST"] },
  { label: "Billing", path: "/dashboard/billing", icon: DollarSign, roles: ["ADMIN", "RECEPTIONIST", "FINANCE"] },
  { label: "Staff", path: "/dashboard/staff", icon: UserCog, roles: ["ADMIN", "HR"] },
  { label: "Staff Attendance", path: "/dashboard/staffattendance", icon: Users, roles: ["ADMIN", "HR"] },//mukul added this line
  { label: "Reports", path: "/dashboard/reports", icon: ClipboardList, roles: ["ADMIN", "FINANCE", "AUDITOR"] },
  { label: "Location Tracker", path: "/dashboard/locationtracker", icon: MapPin, roles: ["ADMIN", "HR" ," RECEPTIONIST"] },//mukul added this line
  { label: "Beacon Manager", path: "/dashboard/beaconmanager", icon: RadioTower, roles: ["ADMIN", "HR" ," RECEPTIONIST"] },//mukul added this line


];{} 

export function DashboardLayout() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-hospital-purple/5 flex flex-col md:flex-row">
      {/* Sidebar */}
      <Sidebar
        items={navItems}
        currentRole={user.role}
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
