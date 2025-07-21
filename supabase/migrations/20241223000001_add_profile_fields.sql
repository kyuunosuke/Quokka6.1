-- Add new fields to profiles table for the three profile cards

-- Basic Information fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS nickname TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;

-- General Profile fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS postcode TEXT;

-- Demographic & Lifestyle fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS interests TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS hobbies TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS occupation TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS marital_status TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS income_range TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS education TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ethnicity TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS languages_spoken TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS home_ownership TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS vehicle_ownership TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pet_ownership TEXT;

-- Add constraints for better data integrity
ALTER TABLE profiles ADD CONSTRAINT check_gender CHECK (gender IN ('male', 'female', 'non-binary', 'prefer-not-to-say') OR gender IS NULL);
ALTER TABLE profiles ADD CONSTRAINT check_marital_status CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed', 'separated', 'prefer-not-to-say') OR marital_status IS NULL);
ALTER TABLE profiles ADD CONSTRAINT check_income_range CHECK (income_range IN ('under-25k', '25k-50k', '50k-75k', '75k-100k', '100k-150k', 'over-150k', 'prefer-not-to-say') OR income_range IS NULL);
ALTER TABLE profiles ADD CONSTRAINT check_education CHECK (education IN ('high-school', 'some-college', 'associates', 'bachelors', 'masters', 'doctorate', 'other') OR education IS NULL);
ALTER TABLE profiles ADD CONSTRAINT check_home_ownership CHECK (home_ownership IN ('own', 'rent', 'live-with-family', 'other') OR home_ownership IS NULL);
ALTER TABLE profiles ADD CONSTRAINT check_vehicle_ownership CHECK (vehicle_ownership IN ('own-car', 'own-multiple', 'no-vehicle', 'use-public-transport') OR vehicle_ownership IS NULL);
ALTER TABLE profiles ADD CONSTRAINT check_pet_ownership CHECK (pet_ownership IN ('dog', 'cat', 'both', 'other-pets', 'no-pets') OR pet_ownership IS NULL);

