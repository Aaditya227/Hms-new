/*
  # Add Extended Patient Fields
  
  1. New Fields Added to patients table:
    - age (integer) - Patient age
    - height (integer) - Height in cm
    - weight (integer) - Weight in kg
    - current_treatment (text) - Current treatment details
    - national_id (text) - National ID number
    - medical_history (text) - Medical history
    - insurance_provider (text) - Insurance provider name
    - insurance_policy_number (text) - Policy number
    
  2. Notes:
    - All new fields are nullable to maintain compatibility
    - Sensitive fields should be encrypted at application level
*/

-- Add missing fields to patients table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'patients' AND column_name = 'age'
  ) THEN
    ALTER TABLE patients ADD COLUMN age integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'patients' AND column_name = 'height'
  ) THEN
    ALTER TABLE patients ADD COLUMN height integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'patients' AND column_name = 'weight'
  ) THEN
    ALTER TABLE patients ADD COLUMN weight integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'patients' AND column_name = 'current_treatment'
  ) THEN
    ALTER TABLE patients ADD COLUMN current_treatment text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'patients' AND column_name = 'national_id'
  ) THEN
    ALTER TABLE patients ADD COLUMN national_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'patients' AND column_name = 'medical_history'
  ) THEN
    ALTER TABLE patients ADD COLUMN medical_history text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'patients' AND column_name = 'insurance_provider'
  ) THEN
    ALTER TABLE patients ADD COLUMN insurance_provider text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'patients' AND column_name = 'insurance_policy_number'
  ) THEN
    ALTER TABLE patients ADD COLUMN insurance_policy_number text;
  END IF;
END $$;

-- Create indexes for commonly queried fields
CREATE INDEX IF NOT EXISTS idx_patients_national_id ON patients(national_id) WHERE national_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_patients_insurance_provider ON patients(insurance_provider) WHERE insurance_provider IS NOT NULL;
