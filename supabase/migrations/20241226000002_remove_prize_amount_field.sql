-- Remove prize_amount field from competitions table

ALTER TABLE public.competitions 
DROP COLUMN IF EXISTS prize_amount,
DROP COLUMN IF EXISTS prize_currency;
