ALTER TABLE public.competitions 
ADD COLUMN IF NOT EXISTS outbound_clicks INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_competitions_outbound_clicks ON public.competitions(outbound_clicks);
