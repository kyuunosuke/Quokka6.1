-- Create function to automatically update competition status to completed when end date is reached
CREATE OR REPLACE FUNCTION update_competition_status_on_end_date()
RETURNS void AS $$
BEGIN
    -- Update competitions to 'completed' status when end_date is today or in the past
    -- and current status is not already 'completed' or 'cancelled'
    UPDATE public.competitions 
    SET status = 'completed', 
        updated_at = timezone('utc'::text, now())
    WHERE DATE(end_date) <= CURRENT_DATE 
    AND status NOT IN ('completed', 'cancelled');
END;
$$ LANGUAGE plpgsql;

-- Create a trigger function that runs on INSERT/UPDATE of competitions
CREATE OR REPLACE FUNCTION check_competition_end_date()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the end_date is today or in the past and status should be completed
    IF DATE(NEW.end_date) <= CURRENT_DATE AND NEW.status NOT IN ('completed', 'cancelled') THEN
        NEW.status = 'completed';
        NEW.updated_at = timezone('utc'::text, now());
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger that fires before INSERT or UPDATE on competitions table
DROP TRIGGER IF EXISTS trigger_check_competition_end_date ON public.competitions;
CREATE TRIGGER trigger_check_competition_end_date
    BEFORE INSERT OR UPDATE ON public.competitions
    FOR EACH ROW
    EXECUTE FUNCTION check_competition_end_date();

-- Run the function once to update existing competitions
SELECT update_competition_status_on_end_date();