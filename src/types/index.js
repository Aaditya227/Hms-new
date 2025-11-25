// User Roles (converted from enum)
export const UserRole = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  NURSE: 'NURSE',
  RECEPTIONIST: 'RECEPTIONIST',
  PHARMACIST: 'PHARMACIST',
  LAB_TECH: 'LAB_TECH',
  RADIOLOGIST: 'RADIOLOGIST',
  FINANCE: 'FINANCE',
  HR: 'HR',
  PATIENT: 'PATIENT',
  AUDITOR: 'AUDITOR',
};

// Sample structure references (for documentation or initialization)

export const UserExample = {
  id: '',
  email: '',
  role: UserRole.ADMIN,
  isActive: true,
  lastLoginAt: '',
  createdAt: '',
  updatedAt: '',
};

export const AuthUserExample = {
  ...UserExample,
  staff: null,
  patient: null,
};

export const StaffExample = {
  id: '',
  userId: '',
  employeeId: '',
  firstName: '',
  lastName: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  address: '',
  departmentId: '',
  specializationId: '',
  isActive: true,
};

export const PatientExample = {
  id: '',
  userId: '',
  upid: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  phone: '',
  email: '',
  address: '',
  status: 'OPD', // OPD | IPD | DISCHARGED | EMERGENCY | DECEASED
  bloodGroup: '',
  allergies: '',
  age: 0,
  height: 0,
  weight: 0,
  currentTreatment: '',
  nationalId: '',
  medicalHistory: '',
  insuranceProvider: '',
  insurancePolicyNumber: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
};

export const AppointmentExample = {
  id: '',
  tokenNumber: '',
  patientId: '',
  doctorId: '',
  scheduledAt: '',
  duration: 0,
  type: '',
  reason: '',
  status: 'SCHEDULED', // SCHEDULED | CHECKED_IN | IN_CONSULTATION | COMPLETED | CANCELLED | NO_SHOW
  patient: null,
  doctor: null,
};

export const DepartmentExample = {
  id: '',
  name: '',
  code: '',
  description: '',
  isActive: true,
};

export const DashboardStatsExample = {
  totalPatients: 0,
  totalStaff: 0,
  totalRevenue: 0,
  todayAppointments: 0,
  pendingPayments: 0,
  admissions: 0,
};

export const EncounterExample = {
  id: '',
  appointmentId: '',
  patientId: '',
  doctorId: '',
  chiefComplaint: '',
  symptoms: '',
  diagnosis: '',
  notes: '',
  heightCm: 0,
  weightKg: 0,
  bmi: 0,
  createdAt: '',
  updatedAt: '',
};

export const VitalLogExample = {
  id: '',
  patientId: '',
  temperatureCelsius: 0,
  bloodPressureSystolic: 0,
  bloodPressureDiastolic: 0,
  heartRate: 0,
  respiratoryRate: 0,
  oxygenSaturation: 0,
  weightKg: 0,
  heightCm: 0,
  notes: '',
  recordedAt: '',
  recordedBy: '',
};

export const AdmissionExample = {
  id: '',
  patientId: '',
  admissionDate: '',
  dischargeDate: '',
  reason: '',
  admissionType: '',
  status: '',
  patient: null,
};

export const WardExample = {
  id: '',
  name: '',
  code: '',
  wardType: '',
  floor: 0,
  capacity: 0,
};

export const RoomExample = {
  id: '',
  wardId: '',
  roomNumber: '',
  roomType: '',
  dailyRate: 0,
  ward: null,
};

export const BedExample = {
  id: '',
  roomId: '',
  bedNumber: '',
  status: 'AVAILABLE', // AVAILABLE | OCCUPIED | MAINTENANCE | CLEANING
  room: null,
};

export const BedAssignmentExample = {
  id: '',
  admissionId: '',
  bedId: '',
  assignedAt: '',
  dischargedAt: '',
  notes: '',
  admission: null,
  bed: null,
};
