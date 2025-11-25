/*
  # Appointments and Clinical Management

  ## Overview
  Creates tables for appointment scheduling and clinical workflows

  ## Tables Created
  1. **appointments** - Patient appointments with doctors
     - id, token_number (text, unique)
     - patient_id, doctor_id (foreign keys)
     - scheduled_at, duration (timestamps/integer)
     - type, reason, notes (text)
     - status (enum)
     - created_at, updated_at (timestamps)

  2. **encounters** - Clinical consultations (EMR)
     - id (uuid, primary key)
     - appointment_id (foreign key)
     - patient_id, doctor_id (foreign keys)
     - chief_complaint, history, examination (text)
     - diagnosis, treatment_plan (text)
     - encounter_date (timestamp)
     - status (enum)

  ## Security
  - RLS enabled on all tables
  - Role-based access policies
  - Patients can view own appointments
  - Medical staff can manage appointments

  ## Notes
  - Token numbers auto-generated for queue management
  - Status workflow: SCHEDULED → CHECKED_IN → IN_CONSULTATION → COMPLETED
  - Encounters linked to appointments for continuity of care
*/

-- Create appointment status enum
CREATE TYPE appointment_status AS ENUM (
  'SCHEDULED',
  'CHECKED_IN',
  'IN_CONSULTATION',
  'COMPLETED',
  'CANCELLED',
  'NO_SHOW'
);

CREATE TYPE encounter_status AS ENUM (
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED'
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_number text UNIQUE NOT NULL,
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  doctor_id uuid REFERENCES staff(id) ON DELETE SET NULL NOT NULL,
  scheduled_at timestamptz NOT NULL,
  duration integer DEFAULT 30,
  type text NOT NULL,
  reason text,
  notes text,
  status appointment_status DEFAULT 'SCHEDULED',
  checked_in_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Encounters table (EMR)
CREATE TABLE IF NOT EXISTS encounters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES appointments(id) ON DELETE SET NULL,
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  doctor_id uuid REFERENCES staff(id) ON DELETE SET NULL NOT NULL,
  encounter_date timestamptz DEFAULT now(),
  chief_complaint text,
  history_of_present_illness text,
  physical_examination text,
  diagnosis text,
  treatment_plan text,
  follow_up_instructions text,
  status encounter_status DEFAULT 'IN_PROGRESS',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_token_number ON appointments(token_number);
CREATE INDEX IF NOT EXISTS idx_encounters_patient_id ON encounters(patient_id);
CREATE INDEX IF NOT EXISTS idx_encounters_doctor_id ON encounters(doctor_id);
CREATE INDEX IF NOT EXISTS idx_encounters_encounter_date ON encounters(encounter_date);

-- Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE encounters ENABLE ROW LEVEL SECURITY;

-- RLS Policies for appointments
CREATE POLICY "Patients can view own appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (
    patient_id IN (
      SELECT id FROM patients WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Medical staff can view all appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')
    )
  );

CREATE POLICY "Receptionist can create appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('ADMIN', 'RECEPTIONIST', 'PATIENT')
    )
  );

CREATE POLICY "Receptionist and doctors can update appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('ADMIN', 'DOCTOR', 'RECEPTIONIST')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('ADMIN', 'DOCTOR', 'RECEPTIONIST')
    )
  );

-- RLS Policies for encounters
CREATE POLICY "Patients can view own encounters"
  ON encounters FOR SELECT
  TO authenticated
  USING (
    patient_id IN (
      SELECT id FROM patients WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can view encounters"
  ON encounters FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('ADMIN', 'DOCTOR', 'NURSE')
    )
  );

CREATE POLICY "Doctors can create encounters"
  ON encounters FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('ADMIN', 'DOCTOR')
    )
  );

CREATE POLICY "Doctors can update own encounters"
  ON encounters FOR UPDATE
  TO authenticated
  USING (
    doctor_id IN (
      SELECT id FROM staff WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    doctor_id IN (
      SELECT id FROM staff WHERE user_id = auth.uid()
    )
  );

-- Triggers for updated_at
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_encounters_updated_at BEFORE UPDATE ON encounters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate token numbers
CREATE OR REPLACE FUNCTION generate_token_number()
RETURNS text AS $$
DECLARE
  new_token text;
  token_exists boolean;
BEGIN
  LOOP
    new_token := 'TOK-' || to_char(now(), 'YYYYMMDD') || '-' || LPAD(floor(random() * 10000)::text, 4, '0');
    SELECT EXISTS(SELECT 1 FROM appointments WHERE token_number = new_token) INTO token_exists;
    EXIT WHEN NOT token_exists;
  END LOOP;
  RETURN new_token;
END;
$$ LANGUAGE plpgsql;
