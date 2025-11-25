/*
  # Create IPD (Inpatient Department) Management Tables
  
  1. New Tables:
    - admissions - Patient admissions
    - wards - Hospital wards
    - rooms - Rooms in wards
    - beds - Beds in rooms
    - bed_assignments - Bed allocation tracking
    
  2. Security:
    - RLS enabled on all tables
    - Admin and medical staff access
*/

-- Create admissions table
CREATE TABLE IF NOT EXISTS admissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  admission_date timestamptz NOT NULL,
  discharge_date timestamptz,
  reason text NOT NULL,
  admission_type text DEFAULT 'ELECTIVE',
  status text DEFAULT 'ADMITTED',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create wards table
CREATE TABLE IF NOT EXISTS wards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  ward_type text NOT NULL,
  floor integer NOT NULL,
  capacity integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ward_id uuid REFERENCES wards(id) ON DELETE CASCADE NOT NULL,
  room_number text NOT NULL,
  room_type text NOT NULL,
  daily_rate decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(ward_id, room_number)
);

-- Create bed status enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'bed_status') THEN
    CREATE TYPE bed_status AS ENUM ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'CLEANING');
  END IF;
END $$;

-- Create beds table
CREATE TABLE IF NOT EXISTS beds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  bed_number text NOT NULL,
  status bed_status DEFAULT 'AVAILABLE',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(room_id, bed_number)
);

-- Create bed_assignments table
CREATE TABLE IF NOT EXISTS bed_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admission_id uuid REFERENCES admissions(id) ON DELETE CASCADE NOT NULL,
  bed_id uuid REFERENCES beds(id) ON DELETE CASCADE NOT NULL,
  assigned_at timestamptz DEFAULT now(),
  discharged_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admissions_patient_id ON admissions(patient_id);
CREATE INDEX IF NOT EXISTS idx_admissions_status ON admissions(status);
CREATE INDEX IF NOT EXISTS idx_rooms_ward_id ON rooms(ward_id);
CREATE INDEX IF NOT EXISTS idx_beds_room_id ON beds(room_id);
CREATE INDEX IF NOT EXISTS idx_bed_assignments_admission_id ON bed_assignments(admission_id);
CREATE INDEX IF NOT EXISTS idx_bed_assignments_bed_id ON bed_assignments(bed_id, assigned_at);

-- Enable RLS
ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wards ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE bed_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Medical staff can view admissions"
  ON admissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')
    )
  );

CREATE POLICY "Staff can create admissions"
  ON admissions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('ADMIN', 'DOCTOR', 'RECEPTIONIST')
    )
  );

CREATE POLICY "Authenticated users can view wards"
  ON wards FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin can manage wards"
  ON wards FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'ADMIN'
    )
  );

CREATE POLICY "Authenticated users can view rooms"
  ON rooms FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can view beds"
  ON beds FOR SELECT TO authenticated USING (true);

CREATE POLICY "Staff can manage bed assignments"
  ON bed_assignments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('ADMIN', 'NURSE', 'RECEPTIONIST')
    )
  );

-- Triggers
CREATE TRIGGER update_admissions_updated_at BEFORE UPDATE ON admissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wards_updated_at BEFORE UPDATE ON wards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_beds_updated_at BEFORE UPDATE ON beds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
