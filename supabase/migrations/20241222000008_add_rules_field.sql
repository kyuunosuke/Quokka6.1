-- Add rules field to competitions table
ALTER TABLE public.competitions ADD COLUMN IF NOT EXISTS rules text;

-- Add index for better performance if needed
CREATE INDEX IF NOT EXISTS idx_competitions_rules ON public.competitions(rules) WHERE rules IS NOT NULL;
