-- Create requirements table to store predefined requirement options
CREATE TABLE IF NOT EXISTS public.requirement_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create junction table to link competitions with their requirements
CREATE TABLE IF NOT EXISTS public.competition_requirements_selected (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
  requirement_option_id UUID NOT NULL REFERENCES public.requirement_options(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(competition_id, requirement_option_id)
);

-- Insert predefined requirement options
INSERT INTO public.requirement_options (name, description) VALUES
  ('Age restriction 18+', 'Participants must be 18 years or older'),
  ('Australian resident', 'Participants must be Australian residents'),
  ('One entry per person', 'Each person can only enter once'),
  ('Exclusion of employees or promoter/agencies', 'Employees and agency staff are excluded'),
  ('Sharing of email address', 'Email address must be provided'),
  ('Sharing of personal information', 'Personal information sharing required'),
  ('Like, share or comment on social media', 'Social media engagement required'),
  ('Join a group or page', 'Must join specified group or page'),
  ('Watch a video or ads', 'Must watch required video content'),
  ('Refer or tag a friend', 'Must refer or tag friends'),
  ('Join newsletter', 'Must subscribe to newsletter'),
  ('Download an app', 'Must download specified application'),
  ('Leave a review', 'Must leave a review'),
  ('Participate in an event/poll', 'Must participate in event or poll'),
  ('Sign-up for a site', 'Must register for specified website'),
  ('Complete a survey', 'Must complete required survey'),
  ('Requires to make a purchase or transaction (product, service or subscription)', 'Purchase or transaction required')
ON CONFLICT (name) DO NOTHING;

-- Enable realtime for the new tables
ALTER PUBLICATION supabase_realtime ADD TABLE requirement_options;
ALTER PUBLICATION supabase_realtime ADD TABLE competition_requirements_selected;
