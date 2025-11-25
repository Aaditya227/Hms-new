/*
  # Extend Medicines Table

  ## Overview
  Adds additional columns to medicines table for direct inventory management

  ## Changes
  1. Add columns to medicines table:
     - strength - Medicine strength/dosage (e.g., 500mg, 10ml)
     - unit_price - Price per unit
     - stock_quantity - Current stock level
     - expiry_date - Expiry date for tracking
     - description - Additional information

  ## Notes
  - Allows simpler medicine management without complex batch tracking
  - Maintains backward compatibility with existing data
  - All new fields have appropriate defaults
*/

-- Add new columns to medicines table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'medicines' AND column_name = 'strength'
  ) THEN
    ALTER TABLE medicines ADD COLUMN strength text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'medicines' AND column_name = 'unit_price'
  ) THEN
    ALTER TABLE medicines ADD COLUMN unit_price decimal(10,2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'medicines' AND column_name = 'stock_quantity'
  ) THEN
    ALTER TABLE medicines ADD COLUMN stock_quantity integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'medicines' AND column_name = 'expiry_date'
  ) THEN
    ALTER TABLE medicines ADD COLUMN expiry_date date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'medicines' AND column_name = 'description'
  ) THEN
    ALTER TABLE medicines ADD COLUMN description text;
  END IF;
END $$;

-- Create index for expiry date to quickly find expiring medicines
CREATE INDEX IF NOT EXISTS idx_medicines_expiry_date ON medicines(expiry_date);

-- Create index for stock quantity to find low stock items
CREATE INDEX IF NOT EXISTS idx_medicines_stock_quantity ON medicines(stock_quantity);
