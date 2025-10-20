DROP FUNCTION IF EXISTS update_competition_status_on_end_date() CASCADE;
DROP FUNCTION IF EXISTS check_competition_end_date() CASCADE;
DROP TRIGGER IF EXISTS trigger_check_competition_end_date ON public.competitions;

CREATE OR REPLACE FUNCTION update_competition_status_by_deadline()
RETURNS void AS $$
BEGIN
    UPDATE public.competitions 
    SET status = 'completed', 
        updated_at = timezone('utc'::text, now())
    WHERE submission_deadline <= timezone('utc'::text, now())
    AND status = 'active';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_competition_deadline()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.submission_deadline <= timezone('utc'::text, now()) AND NEW.status = 'active' THEN
        NEW.status = 'completed';
        NEW.updated_at = timezone('utc'::text, now());
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_competition_deadline
    BEFORE INSERT OR UPDATE ON public.competitions
    FOR EACH ROW
    EXECUTE FUNCTION check_competition_deadline();

SELECT update_competition_status_by_deadline();