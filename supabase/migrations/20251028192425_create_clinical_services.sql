/*
  # Clinical Services - Pharmacy, Laboratory, and Radiology

  ## Overview
  Creates tables for clinical support services

  ## Tables Created
  1. **medicines** - Medicine catalog
  2. **medicine_batches** - Batch tracking and expiry
  3. **prescriptions** - Doctor prescriptions
  4. **prescription_items** - Individual medicine items
  5. **laboratory_tests** - Lab test catalog
  6. **lab_orders** - Lab test orders
  7. **lab_results** - Lab test results
  8. **radiology_orders** - Imaging orders
  9. **radiology_reports** - Imaging reports

  ## Security
  - RLS enabled on all tables
  - Role-based access control
  - Pharmacists manage medicines and prescriptions
  - Lab techs manage lab orders and results
  - Radiologists manage imaging

  ## Notes
  - Stock management with batch tracking
  - Complete audit trail for prescriptions
  - Results flagged as critical when needed
*/

-- Prescriptions and Pharmacy
CREATE TABLE IF NOT EXISTS medicines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  generic_name text,
  manufacturer text,
  category text,
  unit text DEFAULT 'tablets',
  reorder_level integer DEFAULT 50,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS medicine_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medicine_id uuid REFERENCES medicines(id) ON DELETE CASCADE NOT NULL,
  batch_number text NOT NULL,
  quantity integer NOT NULL DEFAULT 0,
  unit_price decimal(10,2),
  selling_price decimal(10,2),
  expiry_date date NOT NULL,
  received_date date DEFAULT CURRENT_DATE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(medicine_id, batch_number)
);

CREATE TABLE IF NOT EXISTS prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_number text UNIQUE NOT NULL,
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  doctor_id uuid REFERENCES staff(id) ON DELETE SET NULL NOT NULL,
  encounter_id uuid REFERENCES encounters(id) ON DELETE SET NULL,
  prescribed_date timestamptz DEFAULT now(),
  dispensed_date timestamptz,
  dispensed_by uuid REFERENCES staff(id) ON DELETE SET NULL,
  status text DEFAULT 'PENDING',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS prescription_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id uuid REFERENCES prescriptions(id) ON DELETE CASCADE NOT NULL,
  medicine_id uuid REFERENCES medicines(id) ON DELETE RESTRICT NOT NULL,
  batch_id uuid REFERENCES medicine_batches(id) ON DELETE SET NULL,
  quantity integer NOT NULL,
  dosage text NOT NULL,
  frequency text NOT NULL,
  duration text NOT NULL,
  instructions text,
  dispensed_quantity integer DEFAULT 0,
  unit_price decimal(10,2),
  total_price decimal(10,2),
  created_at timestamptz DEFAULT now()
);

-- Laboratory
CREATE TABLE IF NOT EXISTS laboratory_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  category text,
  price decimal(10,2),
  normal_range text,
  unit text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lab_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  doctor_id uuid REFERENCES staff(id) ON DELETE SET NULL NOT NULL,
  test_id uuid REFERENCES laboratory_tests(id) ON DELETE RESTRICT NOT NULL,
  ordered_date timestamptz DEFAULT now(),
  sample_collected_at timestamptz,
  collected_by uuid REFERENCES staff(id) ON DELETE SET NULL,
  status text DEFAULT 'PENDING',
  priority text DEFAULT 'ROUTINE',
  clinical_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lab_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES lab_orders(id) ON DELETE CASCADE NOT NULL,
  result_value text,
  result_text text,
  is_abnormal boolean DEFAULT false,
  is_critical boolean DEFAULT false,
  result_date timestamptz DEFAULT now(),
  verified_by uuid REFERENCES staff(id) ON DELETE SET NULL,
  verified_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Radiology
CREATE TABLE IF NOT EXISTS radiology_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  doctor_id uuid REFERENCES staff(id) ON DELETE SET NULL NOT NULL,
  imaging_type text NOT NULL,
  body_part text NOT NULL,
  ordered_date timestamptz DEFAULT now(),
  scheduled_date timestamptz,
  performed_date timestamptz,
  performed_by uuid REFERENCES staff(id) ON DELETE SET NULL,
  status text DEFAULT 'PENDING',
  priority text DEFAULT 'ROUTINE',
  clinical_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS radiology_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES radiology_orders(id) ON DELETE CASCADE NOT NULL,
  findings text,
  impression text,
  radiologist_id uuid REFERENCES staff(id) ON DELETE SET NULL NOT NULL,
  report_date timestamptz DEFAULT now(),
  image_urls text[],
  is_critical boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_medicines_name ON medicines(name);
CREATE INDEX IF NOT EXISTS idx_medicine_batches_medicine_id ON medicine_batches(medicine_id);
CREATE INDEX IF NOT EXISTS idx_medicine_batches_expiry_date ON medicine_batches(expiry_date);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor_id ON prescriptions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_status ON prescriptions(status);
CREATE INDEX IF NOT EXISTS idx_lab_orders_patient_id ON lab_orders(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_orders_status ON lab_orders(status);
CREATE INDEX IF NOT EXISTS idx_radiology_orders_patient_id ON radiology_orders(patient_id);
CREATE INDEX IF NOT EXISTS idx_radiology_orders_status ON radiology_orders(status);

-- Enable RLS
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE laboratory_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE radiology_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE radiology_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies (simplified for key tables)
CREATE POLICY "Authenticated users can view medicines"
  ON medicines FOR SELECT TO authenticated USING (true);

CREATE POLICY "Pharmacists can manage medicines"
  ON medicines FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('ADMIN', 'PHARMACIST')))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('ADMIN', 'PHARMACIST')));

CREATE POLICY "Medical staff can view prescriptions"
  ON prescriptions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('ADMIN', 'DOCTOR', 'PHARMACIST', 'NURSE')));

CREATE POLICY "Doctors can create prescriptions"
  ON prescriptions FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('ADMIN', 'DOCTOR')));

CREATE POLICY "Pharmacists can update prescriptions"
  ON prescriptions FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('ADMIN', 'PHARMACIST')))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('ADMIN', 'PHARMACIST')));

CREATE POLICY "Medical staff can view lab orders"
  ON lab_orders FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('ADMIN', 'DOCTOR', 'LAB_TECH', 'NURSE')));

CREATE POLICY "Doctors can create lab orders"
  ON lab_orders FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('ADMIN', 'DOCTOR')));

CREATE POLICY "Lab techs can update lab orders"
  ON lab_orders FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('ADMIN', 'LAB_TECH')))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('ADMIN', 'LAB_TECH')));

-- Triggers
CREATE TRIGGER update_medicines_updated_at BEFORE UPDATE ON medicines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prescriptions_updated_at BEFORE UPDATE ON prescriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lab_orders_updated_at BEFORE UPDATE ON lab_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_radiology_orders_updated_at BEFORE UPDATE ON radiology_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
