-- Create comprehensive competition-related tables

-- Competitions table
CREATE TABLE IF NOT EXISTS public.competitions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    detailed_description text,
    thumbnail_url text,
    banner_url text,
    category text NOT NULL,
    subcategory text,
    difficulty_level text NOT NULL CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced', 'All Levels')),
    prize_amount numeric(10,2),
    prize_currency text DEFAULT 'USD',
    prize_description text,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    submission_deadline timestamp with time zone NOT NULL,
    judging_start_date timestamp with time zone,
    judging_end_date timestamp with time zone,
    winner_announcement_date timestamp with time zone,
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'submission_closed', 'judging', 'completed', 'cancelled')),
    max_participants integer,
    current_participants integer DEFAULT 0,
    entry_fee numeric(10,2) DEFAULT 0,
    is_team_competition boolean DEFAULT false,
    max_team_size integer,
    min_team_size integer DEFAULT 1,
    organizer_id uuid REFERENCES public.users(id),
    organizer_name text,
    organizer_email text,
    organizer_website text,
    tags text[],
    featured boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Competition eligibility table
CREATE TABLE IF NOT EXISTS public.competition_eligibility (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id uuid NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    eligibility_type text NOT NULL CHECK (eligibility_type IN ('age', 'location', 'experience', 'education', 'profession', 'other')),
    requirement_text text NOT NULL,
    is_mandatory boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Competition requirements table
CREATE TABLE IF NOT EXISTS public.competition_requirements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id uuid NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    requirement_type text NOT NULL CHECK (requirement_type IN ('submission_format', 'file_size', 'dimensions', 'duration', 'word_count', 'technical_specs', 'content_guidelines', 'other')),
    requirement_title text NOT NULL,
    requirement_description text NOT NULL,
    is_mandatory boolean DEFAULT true,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Competition rules table
CREATE TABLE IF NOT EXISTS public.competition_rules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id uuid NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    rule_category text NOT NULL CHECK (rule_category IN ('submission', 'judging', 'conduct', 'intellectual_property', 'prizes', 'general')),
    rule_title text NOT NULL,
    rule_description text NOT NULL,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Saved competitions table (user's saved/bookmarked competitions)
CREATE TABLE IF NOT EXISTS public.saved_competitions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    competition_id uuid NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    saved_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    notes text,
    UNIQUE(user_id, competition_id)
);

-- Competition submissions table
CREATE TABLE IF NOT EXISTS public.competition_submissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id uuid NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    team_name text,
    submission_title text NOT NULL,
    submission_description text,
    submission_files jsonb, -- Array of file URLs and metadata
    submission_data jsonb, -- Additional structured data
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'accepted', 'rejected', 'winner', 'runner_up')),
    submitted_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, competition_id)
);

-- Competition categories lookup table
CREATE TABLE IF NOT EXISTS public.competition_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    description text,
    icon_name text,
    color_scheme text,
    is_active boolean DEFAULT true,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_competitions_status ON public.competitions(status);
CREATE INDEX IF NOT EXISTS idx_competitions_category ON public.competitions(category);
CREATE INDEX IF NOT EXISTS idx_competitions_end_date ON public.competitions(end_date);
CREATE INDEX IF NOT EXISTS idx_competitions_featured ON public.competitions(featured);
CREATE INDEX IF NOT EXISTS idx_competitions_organizer ON public.competitions(organizer_id);
CREATE INDEX IF NOT EXISTS idx_competition_eligibility_competition ON public.competition_eligibility(competition_id);
CREATE INDEX IF NOT EXISTS idx_competition_requirements_competition ON public.competition_requirements(competition_id);
CREATE INDEX IF NOT EXISTS idx_competition_rules_competition ON public.competition_rules(competition_id);
CREATE INDEX IF NOT EXISTS idx_saved_competitions_user ON public.saved_competitions(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_competitions_competition ON public.saved_competitions(competition_id);
CREATE INDEX IF NOT EXISTS idx_competition_submissions_competition ON public.competition_submissions(competition_id);
CREATE INDEX IF NOT EXISTS idx_competition_submissions_user ON public.competition_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_competition_submissions_status ON public.competition_submissions(status);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.competitions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.competition_eligibility;
ALTER PUBLICATION supabase_realtime ADD TABLE public.competition_requirements;
ALTER PUBLICATION supabase_realtime ADD TABLE public.competition_rules;
ALTER PUBLICATION supabase_realtime ADD TABLE public.saved_competitions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.competition_submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.competition_categories;

-- Insert default competition categories
INSERT INTO public.competition_categories (name, description, icon_name, color_scheme, order_index) VALUES
('Design & Art', 'Visual design, digital art, illustrations, and creative artwork', 'palette', 'from-pink-500 to-rose-500', 1),
('Photography', 'Photo contests, visual storytelling, and image competitions', 'camera', 'from-blue-500 to-cyan-500', 2),
('Writing', 'Creative writing, copywriting, journalism, and literary contests', 'pen-tool', 'from-green-500 to-emerald-500', 3),
('Video & Film', 'Video production, filmmaking, animation, and multimedia', 'video', 'from-purple-500 to-violet-500', 4),
('Music & Audio', 'Music composition, audio production, and sound design', 'music', 'from-orange-500 to-red-500', 5),
('Innovation', 'Technology, startups, product development, and innovation challenges', 'lightbulb', 'from-indigo-500 to-blue-500', 6),
('Gaming', 'Game development, esports, and interactive entertainment', 'gamepad-2', 'from-yellow-500 to-orange-500', 7),
('Business', 'Entrepreneurship, marketing, business plans, and case studies', 'briefcase', 'from-gray-500 to-slate-500', 8)
ON CONFLICT (name) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_competitions_updated_at BEFORE UPDATE ON public.competitions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_competition_submissions_updated_at BEFORE UPDATE ON public.competition_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to update participant count
CREATE OR REPLACE FUNCTION update_competition_participant_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'submitted' THEN
        UPDATE public.competitions 
        SET current_participants = current_participants + 1 
        WHERE id = NEW.competition_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.status != 'submitted' AND NEW.status = 'submitted' THEN
        UPDATE public.competitions 
        SET current_participants = current_participants + 1 
        WHERE id = NEW.competition_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.status = 'submitted' AND NEW.status != 'submitted' THEN
        UPDATE public.competitions 
        SET current_participants = current_participants - 1 
        WHERE id = NEW.competition_id;
    ELSIF TG_OP = 'DELETE' AND OLD.status = 'submitted' THEN
        UPDATE public.competitions 
        SET current_participants = current_participants - 1 
        WHERE id = OLD.competition_id;
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ language 'plpgsql';

-- Create trigger for participant count
CREATE TRIGGER update_participant_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.competition_submissions
    FOR EACH ROW EXECUTE FUNCTION update_competition_participant_count();
