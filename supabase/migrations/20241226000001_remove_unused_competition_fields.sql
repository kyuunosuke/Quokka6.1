-- Remove unused fields from competitions table

ALTER TABLE public.competitions 
DROP COLUMN IF EXISTS price_amount,
DROP COLUMN IF EXISTS detailed_description,
DROP COLUMN IF EXISTS entry_fee,
DROP COLUMN IF EXISTS is_team_competition,
DROP COLUMN IF EXISTS min_team_size,
DROP COLUMN IF EXISTS max_team_size;
