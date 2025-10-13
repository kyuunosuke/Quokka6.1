-- Add entry_criteria field to competitions table

ALTER TABLE public.competitions 
ADD COLUMN IF NOT EXISTS entry_criteria TEXT[];

COMMENT ON COLUMN public.competitions.entry_criteria IS 'Array of entry criteria options: 18+, AU Residents, Members only';
