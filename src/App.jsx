
// update

import { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { lazyImport } from "./utils/lazyImport";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { BeaconManager } from "./pages/BeaconManager";



//  Login + Layout
const Login = lazyImport(() => import("./pages/Login"));
const DashboardLayout = lazyImport(() => import("./components/layouts/DashboardLayout"));

//  Role-based Dashboards
const dashboards = {
  ADMIN: lazyImport(() => import("./pages/dashboard/AdminDashboard")),
  DOCTOR: lazyImport(() => import("./pages/dashboard/DoctorDashboard")),
  NURSE: lazyImport(() => import("./pages/dashboard/NurseDashboard")),
  RECEPTIONIST: lazyImport(() => import("./pages/dashboard/ReceptionistDashboard")),
  PHARMACIST: lazyImport(() => import("./pages/dashboard/PharmacistDashboard")),
  LAB_TECH: lazyImport(() => import("./pages/dashboard/LabTechDashboard")),
  RADIOLOGIST: lazyImport(() => import("./pages/dashboard/RadiologistDashboard")),
  FINANCE: lazyImport(() => import("./pages/dashboard/FinanceDashboard")),
  HR: lazyImport(() => import("./pages/dashboard/HRDashboard")),
  PATIENT: lazyImport(() => import("./pages/dashboard/PatientPortal")),
  AUDITOR: lazyImport(() => import("./pages/dashboard/AuditorDashboard")),
};      

//  Common Pages
const Patients = lazyImport(() => import("./pages/Patients"));
const Appointments = lazyImport(() => import("./pages/Appointments"));
const Prescriptions = lazyImport(() => import("./pages/Prescriptions"));
const Pharmacy = lazyImport(() => import("./pages/Pharmacy"));
const Laboratory = lazyImport(() => import("./pages/Laboratory"));
const Radiology = lazyImport(() => import("./pages/Radiology"));
const Billing = lazyImport(() => import("./pages/Billing"));
const Staff = lazyImport(() => import("./pages/Staff"));
const Reports = lazyImport(() => import("./pages/Reports"));
const LocationTracker = lazyImport(() => import("./pages/LocationTracker"));
const Department = lazyImport(() => import("./pages/Department"));
const staffAttendance = lazyImport(() => import("./pages/StaffAttendance"));

// doctors 
const DoctorsPatient = lazyImport(() => import("./pages/DoctorsPatient"));
const DoctorsAppointment = lazyImport(() => import("./pages/DoctorsAppointments"));
const DoctorsPrescriptions = lazyImport(() => import("./pages/DoctorsPrescriptions"));
const DoctorsRadiology = lazyImport(() => import("./pages/DoctorsRadiology"));
const DoctorsLaboratory = lazyImport(() => import("./pages/DoctorsLaboratory"));
const DoctorPharmacy = lazyImport(() => import("./pages/DoctorPharmacy"));
const DoctorLabReport = lazyImport(() => import("./pages/DoctorLabReport"));
const DoctorRadiologyReport = lazyImport(() => import("./pages/DoctorRadiologyReport"));
//end doctors 

//patient 
const PatientsAppointments = lazyImport(() => import("./pages/PatientsAppointments"));
const PatientPrescription = lazyImport(() => import("./pages/PatientPrescription"));
const PatientDoctor = lazyImport(() => import("./pages/PatientDoctor"));
const PatientLabReport = lazyImport(() => import("./pages/PatientLabReport"));
const PatientRadiologyReport = lazyImport(() => import("./pages/PatientRadiologyReport"));
const PatientPaymentHistory = lazyImport(() => import("./pages/PatientPaymentHistory"));

//Nurse
const NursePrescriptions = lazyImport(() => import("./pages/NursePrescriptions"));
const NursePatient = lazyImport(() => import("./pages/NursePatient"));
const NurseRadiologyReport = lazyImport(() => import("./pages/NurseRadiologyReport"));
const NurseLabReport = lazyImport(() => import("./pages/NurseLabReport"));

//Pharmacist
const PharmacistPharmacy = lazyImport(() => import("./pages/PharmacistPharmacy"));
const PharmacistPrescription = lazyImport(() => import("./pages/PharmacistPrescription"));

//Lab Tech
const LabRequest = lazyImport(() => import("./pages/LabRequest"));
const LabReport = lazyImport(() => import("./pages/LabReport"));

//Radiologist
const RadiologyRequest = lazyImport(() => import("./pages/RadiologyRequest"));
const RadiologyReport = lazyImport(() => import("./pages/RadiologyReport"));

//Receptionist
const ReceptionistPatient = lazyImport(() => import("./pages/ReceptionistPatient"));
const ReceptionistAppointment = lazyImport(() => import("./pages/ReceptionistAppointment"));
const ReceptionistBilling = lazyImport(() => import("./pages/ReceptionistBilling"));
const ReceptionistDoctorAvailability = lazyImport(() => import("./pages/ReceptionistDoctorAvailability"));
/* ------------------ Loader ------------------ */
const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-hospital-purple/20 via-white to-teal-500/20 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-hospital-purple mx-auto mb-4"></div>
      <p className="text-lg font-medium text-gray-700">Loading...</p>
    </div>
  </div>
);

/* ------------------ Protected Route ------------------ */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingFallback />;
  if (!user) return <Navigate to="/login" replace />;
  return <Suspense fallback={<LoadingFallback />}>{children}</Suspense>;
};

/* ------------------ Dashboard Router (Dynamic) ------------------ */
const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  const Component = dashboards[user.role];

  if (!Component) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to HMS</h2>
        <p className="text-gray-600">
          Dashboard for <strong>{user.role}</strong> is under development.
        </p>
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Component />
    </Suspense>
  );
};

/* ------------------ Main App ------------------ */
function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* ✅ Login */}
            <Route
              path="/login"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <ErrorBoundary>
                    <Login />
                  </ErrorBoundary>
                </Suspense>
              }
            />

            {/* ✅ Protected Dashboard */}
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <ErrorBoundary>
                      <DashboardLayout />
                    </ErrorBoundary>
                  </Suspense>
                </ProtectedRoute>
              }
            >
              {/* Default dashboard route */}
              <Route
                index
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ErrorBoundary>
                      <DashboardRouter />
                    </ErrorBoundary>
                  </Suspense>
                }
              />

              {/* ✅ Nested Pages */}
              {[
                // Common routes//
                { path: "patients", Component: Patients },
                { path: "appointments", Component: Appointments },
                { path: "prescriptions", Component: Prescriptions },
                { path: "pharmacy", Component: Pharmacy },
                { path: "laboratory", Component: Laboratory },
                { path: "radiology", Component: Radiology },
                { path: "billing", Component: Billing },
                { path: "staff", Component: Staff },
                { path: "reports", Component: Reports },
                { path: "locationtracker", Component: LocationTracker },//mukul add this line
                { path: "beaconmanager", Component: BeaconManager },//mukul add this line
                { path: "department", Component: Department },
                { path: "staffattendance", Component: staffAttendance },
                // end common routes//

                // doctors  routes//
                { path: "doctorspatient", Component: DoctorsPatient },
                {path: "doctorsappointment", Component: DoctorsAppointment },
                {path: "doctors-prescription", Component: DoctorsPrescriptions},
                {path: "doctors-radiology", Component: DoctorsRadiology },
                {path: "doctors-laboratory", Component: DoctorsLaboratory },
                {path: "doctor-lab-report", Component: DoctorLabReport},
                {path: "doctor-radiology-report", Component: DoctorRadiologyReport},
                // doctors end route// 

                //Nurse routes//
                { path: "nursepatient", Component: NursePatient },
                {path: "nurse-prescription", Component: NursePrescriptions},
                {path: "nurse-radiology-report", Component: NurseRadiologyReport },
                {path: "nurse-lab-report", Component: NurseLabReport},
                //end Nurse routes//
                
                // patient routes//
                {path: "patient-appointment", Component: PatientsAppointments },
                {path: "patient-prescriptions", Component: PatientPrescription},
                {path: "patient-doctor", Component: PatientDoctor },
                {path: "patient-lab-report", Component: PatientLabReport},
                {path: "patient-radiology", Component: PatientRadiologyReport},
                {path: "patient-payment-history", Component: PatientPaymentHistory},
                //end patient routes//

                //Phasrmacist routes//
                { path: "pharmacist-pharmacy", Component: PharmacistPharmacy },
                {path: "pharmacist-prescriptions", Component: PharmacistPrescription},
                //end Pharmacist routes//

                //Lab Tech routes//
                {path: "lab-request", Component: LabRequest},
                {path: "lab-report", Component: LabReport},
                //end Lab Tech routes//

                //Radiologist routes//
                {path: "radiology-request", Component: RadiologyRequest},
                {path: "radiology-report", Component: RadiologyReport},
                //end Radiologist routes//

                //receptionist routes//
                {path: "receptionist-patients", Component: ReceptionistPatient},
                {path: "receptionist-appointments", Component: ReceptionistAppointment},
                {path: "receptionist-billing", Component: ReceptionistBilling},
                {path: "receptionist-doctor-availability", Component: ReceptionistDoctorAvailability},
                //end receptionist routes//

              ].map(({ path, Component }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <ErrorBoundary>
                        <Component />
                      </ErrorBoundary>
                    </Suspense>
                  }
                />
              ))}
            </Route>

            {/* ✅ Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;