-- Add client_id to competitions table and remove old organizer fields

ALTER TABLE public.competitions 
ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_competitions_client_id ON public.competitions(client_id);
