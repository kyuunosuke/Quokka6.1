-- Create client_submissions table for competition requests
CREATE TABLE IF NOT EXISTS client_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Competition Details
  title TEXT NOT NULL,
  description TEXT,
  detailed_description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  
  -- Dates and Timeline
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  submission_deadline DATE NOT NULL,
  judging_start_date DATE,
  judging_end_date DATE,
  winner_announcement_date DATE,
  
  -- Prize Information
  prize_amount DECIMAL(10,2),
  prize_currency TEXT DEFAULT 'USD',
  prize_description TEXT,
  
  -- Competition Settings
  max_participants INTEGER,
  is_team_competition BOOLEAN DEFAULT false,
  min_team_size INTEGER,
  max_team_size INTEGER,
  entry_fee DECIMAL(10,2) DEFAULT 0,
  difficulty_level TEXT DEFAULT 'beginner',
  
  -- Media and Assets
  thumbnail_url TEXT,
  banner_url TEXT,
  
  -- Rules and Requirements
  rules TEXT,
  terms_conditions_url TEXT,
  tags TEXT[],
  
  -- Client/Organizer Information
  organizer_name TEXT NOT NULL,
  organizer_email TEXT NOT NULL,
  organizer_website TEXT,
  company_name TEXT,
  company_description TEXT,
  
  -- Submission Status and Admin Review
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'published')),
  admin_notes TEXT,
  rejection_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE
);

-- Add client role to profiles if not exists
DO $$
BEGIN
  -- Update the role column to allow 'client' if it doesn't already
  ALTER TABLE profiles ALTER COLUMN role DROP DEFAULT;
  ALTER TABLE profiles ALTER COLUMN role TYPE TEXT;
  ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'member';
EXCEPTION
  WHEN others THEN
    -- Column might already be TEXT, continue
    NULL;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_client_submissions_client_id ON client_submissions(client_id);
CREATE INDEX IF NOT EXISTS idx_client_submissions_status ON client_submissions(status);
CREATE INDEX IF NOT EXISTS idx_client_submissions_created_at ON client_submissions(created_at);

-- Enable RLS
ALTER TABLE client_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for client_submissions

-- Clients can view their own submissions
CREATE POLICY "Clients can view own submissions" ON client_submissions
  FOR SELECT USING (auth.uid() = client_id);

-- Clients can insert their own submissions
CREATE POLICY "Clients can create submissions" ON client_submissions
  FOR INSERT WITH CHECK (auth.uid() = client_id);

-- Clients can update their own submissions (only if not yet submitted or if rejected)
CREATE POLICY "Clients can update own submissions" ON client_submissions
  FOR UPDATE USING (
    auth.uid() = client_id AND 
    (status IN ('draft', 'rejected'))
  );

-- Admins can view all submissions
CREATE POLICY "Admins can view all submissions" ON client_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Admins can update all submissions (for review process)
CREATE POLICY "Admins can update all submissions" ON client_submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_client_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_client_submissions_updated_at_trigger
  BEFORE UPDATE ON client_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_client_submissions_updated_at();

-- Create function to handle status transitions
CREATE OR REPLACE FUNCTION handle_client_submission_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Set submitted_at when status changes to submitted
  IF NEW.status = 'submitted' AND OLD.status != 'submitted' THEN
    NEW.submitted_at = NOW();
  END IF;
  
  -- Set reviewed_at when status changes to approved or rejected
  IF NEW.status IN ('approved', 'rejected') AND OLD.status NOT IN ('approved', 'rejected') THEN
    NEW.reviewed_at = NOW();
  END IF;
  
  -- Set approved_at when status changes to approved
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    NEW.approved_at = NOW();
  END IF;
  
  -- Set published_at when status changes to published
  IF NEW.status = 'published' AND OLD.status != 'published' THEN
    NEW.published_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for status changes
CREATE TRIGGER handle_client_submission_status_change_trigger
  BEFORE UPDATE ON client_submissions
  FOR EACH ROW
  EXECUTE FUNCTION handle_client_submission_status_change();

-- Enable realtime for client_submissions
ALTER PUBLICATION supabase_realtime ADD TABLE client_submissions;
