ALTER TABLE public.competitions 
ADD COLUMN IF NOT EXISTS draw_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS permits text,
ADD COLUMN IF NOT EXISTS region text;

CREATE INDEX IF NOT EXISTS idx_competitions_draw_date ON public.competitions(draw_date);
CREATE INDEX IF NOT EXISTS idx_competitions_region ON public.competitions(region);

-- Only add table to realtime publication if not already added
DO $
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'competitions'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE competitions;
    END IF;
END $;
