-- Fix competition form field issues

-- 1. Remove permit_number column from competitions table
ALTER TABLE public.competitions 
DROP COLUMN IF EXISTS permit_number;

-- 2. Add rules column if it doesn't exist (for Competition Rules and Winning Methods)
ALTER TABLE public.competitions 
ADD COLUMN IF NOT EXISTS rules TEXT;

-- 3. Ensure participating_requirement column exists (it should from previous migration)
ALTER TABLE public.competitions 
ADD COLUMN IF NOT EXISTS participating_requirement TEXT;

-- Add comments to clarify the purpose of these columns
COMMENT ON COLUMN public.competitions.rules IS 'Competition rules, guidelines, and winning methods';
COMMENT ON COLUMN public.competitions.participating_requirement IS 'Requirements needed to participate in the competition';