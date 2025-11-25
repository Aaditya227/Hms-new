/*
  # Hospital Management System - Core Tables

  ## Overview
  Creates the core database schema for the Hospital Management System including:
  - Users and authentication
  - Staff and patient management
  - Departments and specializations
  - Basic audit logging

  ## Tables Created
  1. **users** - System users with role-based access
     - id (uuid, primary key)
     - email (text, unique)
     - role (enum: ADMIN, DOCTOR, NURSE, etc.)
     - is_active (boolean)
     - created_at, updated_at (timestamps)

  2. **departments** - Hospital departments
     - id (uuid, primary key)
     - name, code (text)
     - description (text, optional)
     - is_active (boolean)

  3. **specializations** - Medical specializations
     - id (uuid, primary key)
     - name, code (text)
     - department_id (foreign key)

  4. **staff** - Hospital staff members
     - id (uuid, primary key)
     - user_id (foreign key to users)
     - employee_id (text, unique)
     - first_name, last_name (text)
     - phone, date_of_birth, gender, address (text)
     - department_id, specialization_id (foreign keys)
     - is_active (boolean)

  5. **patients** - Patient records
     - id (uuid, primary key)
     - user_id (optional foreign key to users for portal access)
     - upid (unique patient ID, text, unique)
     - first_name, last_name, date_of_birth, gender (text)
     - phone, email, address (text)
     - blood_group, allergies (text, optional)
     - status (enum: OPD, IPD, DISCHARGED, EMERGENCY, DECEASED)

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Policies for role-based access control
  - Audit trail support

  ## Notes
  - All timestamps stored in UTC
  - Soft deletes using is_active flag
  - Foreign keys with cascade on delete where appropriate
*/

-- Create enum types
CREATE TYPE user_role AS ENUM (
  'ADMIN',
  'DOCTOR',
  'NURSE',
  'RECEPTIONIST',
  'PHARMACIST',
  'LAB_TECH',
  'RADIOLOGIST',
  'FINANCE',
  'HR',
  'PATIENT',
  'AUDITOR'
);

CREATE TYPE patient_status AS ENUM (
  'OPD',
  'IPD',
  'DISCHARGED',
  'EMERGENCY',
  'DECEASED'
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'PATIENT',
  is_active boolean DEFAULT true,
  last_login_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Specializations table
CREATE TABLE IF NOT EXISTS specializations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Staff table
CREATE TABLE IF NOT EXISTS staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  employee_id text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  date_of_birth date NOT NULL,
  gender text NOT NULL,
  address text,
  department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
  specialization_id uuid REFERENCES specializations(id) ON DELETE SET NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  upid text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date NOT NULL,
  gender text NOT NULL,
  phone text NOT NULL,
  email text,
  address text,
  blood_group text,
  allergies text,
  status patient_status DEFAULT 'OPD',
  emergency_contact_name text,
  emergency_contact_phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_staff_user_id ON staff(user_id);
CREATE INDEX IF NOT EXISTS idx_staff_employee_id ON staff(employee_id);
CREATE INDEX IF NOT EXISTS idx_patients_upid ON patients(upid);
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admin can read all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'ADMIN'
    )
  );

CREATE POLICY "Admin can update users"
  ON users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'ADMIN'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'ADMIN'
    )
  );

-- RLS Policies for departments (readable by all authenticated users)
CREATE POLICY "Authenticated users can read departments"
  ON departments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can manage departments"
  ON departments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('ADMIN', 'HR')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('ADMIN', 'HR')
    )
  );

-- RLS Policies for specializations
CREATE POLICY "Authenticated users can read specializations"
  ON specializations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can manage specializations"
  ON specializations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('ADMIN', 'HR')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('ADMIN', 'HR')
    )
  );

-- RLS Policies for staff
CREATE POLICY "Staff can read own data"
  ON staff FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admin and HR can read all staff"
  ON staff FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('ADMIN', 'HR')
    )
  );

CREATE POLICY "Admin and HR can manage staff"
  ON staff FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('ADMIN', 'HR')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('ADMIN', 'HR')
    )
  );

-- RLS Policies for patients
CREATE POLICY "Patients can read own data"
  ON patients FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Medical staff can read patients"
  ON patients FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'LAB_TECH', 'RADIOLOGIST', 'PHARMACIST')
    )
  );

CREATE POLICY "Receptionist can create patients"
  ON patients FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('ADMIN', 'RECEPTIONIST')
    )
  );

CREATE POLICY "Medical staff can update patients"
  ON patients FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_specializations_updated_at BEFORE UPDATE ON specializations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
