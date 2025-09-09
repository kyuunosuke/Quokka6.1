-- Add missing fields to competitions table that are used in the form

-- Add permits field (for game of luck permits/licenses)
ALTER TABLE public.competitions 
ADD COLUMN IF NOT EXISTS permits TEXT;

-- Add region field (geographic region/location)
ALTER TABLE public.competitions 
ADD COLUMN IF NOT EXISTS region TEXT;

-- Add participating_requirement field (requirements to participate)
ALTER TABLE public.competitions 
ADD COLUMN IF NOT EXISTS participating_requirement TEXT;

-- Add total_prize field (total prize details)
ALTER TABLE public.competitions 
ADD COLUMN IF NOT EXISTS total_prize TEXT;

-- Add comments to explain the columns
COMMENT ON COLUMN public.competitions.permits IS 'Required permits or licenses for the competition (typically for Game of Luck)';
COMMENT ON COLUMN public.competitions.region IS 'Geographic region where the competition is available (e.g., Nationwide, Victoria, NSW, etc.)';
COMMENT ON COLUMN public.competitions.participating_requirement IS 'Requirements needed to participate in the competition';
COMMENT ON COLUMN public.competitions.total_prize IS 'Total prize details and description';