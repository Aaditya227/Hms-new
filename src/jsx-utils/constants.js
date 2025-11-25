// User Roles
export const USER_ROLES = {
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

// Appointment Status
export const APPOINTMENT_STATUS = {
  SCHEDULED: 'SCHEDULED',
  CHECKED_IN: 'CHECKED_IN',
  IN_CONSULTATION: 'IN_CONSULTATION',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW',
};

// Patient Status
export const PATIENT_STATUS = {
  OPD: 'OPD',
  IPD: 'IPD',
  DISCHARGED: 'DISCHARGED',
  EMERGENCY: 'EMERGENCY',
  DECEASED: 'DECEASED',
};

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'CASH',
  FIB: 'FIB',
  INSURANCE: 'INSURANCE',
  CARD: 'CARD',
  DIGITAL_WALLET: 'DIGITAL_WALLET',
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  PARTIALLY_PAID: 'PARTIALLY_PAID',
  REFUNDED: 'REFUNDED',
  FAILED: 'FAILED',
};

// Test Status
export const TEST_STATUS = {
  REQUESTED: 'REQUESTED',
  SAMPLE_COLLECTED: 'SAMPLE_COLLECTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

// Bed Status
export const BED_STATUS = {
  AVAILABLE: 'AVAILABLE',
  OCCUPIED: 'OCCUPIED',
  MAINTENANCE: 'MAINTENANCE',
  CLEANING: 'CLEANING',
};

// Gender Options
export const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

// Blood Group Options
export const BLOOD_GROUPS = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];
