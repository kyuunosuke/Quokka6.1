-- Add draw_date column to competitions table
ALTER TABLE public.competitions 
ADD COLUMN IF NOT EXISTS draw_date DATE;

-- Add comment to explain the column
COMMENT ON COLUMN public.competitions.draw_date IS 'Date when the competition winner will be announced';