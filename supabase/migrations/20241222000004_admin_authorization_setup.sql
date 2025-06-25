-- Create admin authorization setup with RLS policies

-- First, ensure the profiles table has the correct structure
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS push_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS marketing_notifications BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS competition_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS profile_public BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS show_email BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS show_stats BOOLEAN DEFAULT true;

-- Update the role column to have proper constraints
ALTER TABLE profiles 
ALTER COLUMN role SET DEFAULT 'user';

-- Add constraint to ensure role is one of the allowed values
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('admin', 'member', 'client', 'user'));

-- Create or replace the trigger function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    'user',
    now(),
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

-- Create RLS policies for profiles table
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (profile_public = true);

-- Enable RLS on competitions table
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view active competitions" ON competitions;
DROP POLICY IF EXISTS "Admins can manage all competitions" ON competitions;
DROP POLICY IF EXISTS "Organizers can manage their competitions" ON competitions;

-- Create RLS policies for competitions table
CREATE POLICY "Anyone can view active competitions"
  ON competitions FOR SELECT
  USING (status IN ('active', 'submission_closed', 'judging', 'completed'));

CREATE POLICY "Admins can manage all competitions"
  ON competitions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Organizers can manage their competitions"
  ON competitions FOR ALL
  USING (organizer_id = auth.uid());

-- Enable RLS on saved_competitions table
ALTER TABLE saved_competitions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage their saved competitions" ON saved_competitions;

-- Create RLS policies for saved_competitions table
CREATE POLICY "Users can manage their saved competitions"
  ON saved_competitions FOR ALL
  USING (user_id = auth.uid());

-- Enable RLS on competition_submissions table
ALTER TABLE competition_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage their submissions" ON competition_submissions;
DROP POLICY IF EXISTS "Admins can view all submissions" ON competition_submissions;

-- Create RLS policies for competition_submissions table
CREATE POLICY "Users can manage their submissions"
  ON competition_submissions FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all submissions"
  ON competition_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role INTO user_role
  FROM profiles
  WHERE id = user_id;
  
  RETURN COALESCE(user_role, 'user');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role(uuid) TO authenticated;

-- Enable realtime for relevant tables
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE competitions;
ALTER PUBLICATION supabase_realtime ADD TABLE saved_competitions;
ALTER PUBLICATION supabase_realtime ADD TABLE competition_submissions;
