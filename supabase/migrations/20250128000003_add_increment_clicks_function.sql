CREATE OR REPLACE FUNCTION increment_outbound_clicks(competition_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.competitions 
    SET outbound_clicks = COALESCE(outbound_clicks, 0) + 1
    WHERE id = competition_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
