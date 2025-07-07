-- Fix infinite recursion in RLS policies

-- Disable RLS temporarily to fix the policies
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON profiles;

-- Create a function to check admin role without causing recursion
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean AS $$
DECLARE
  user_role text;
BEGIN
  -- Use a direct query to avoid RLS recursion
  SELECT role INTO user_role
  FROM profiles
  WHERE id = auth.uid()
  LIMIT 1;
  
  RETURN COALESCE(user_role, 'user') = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create new policies that don't cause recursion
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Service role bypass policy (for admin creation)
CREATE POLICY "Service role can manage all profiles"
  ON profiles FOR ALL
  USING (current_setting('role') = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role');

-- Note: Public profile visibility policy removed as profile_public column doesn't exist

-- Update competitions policies to avoid recursion
DROP POLICY IF EXISTS "Admins can manage all competitions" ON competitions;

CREATE POLICY "Admins can manage all competitions"
  ON competitions FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Update submissions policies to avoid recursion
DROP POLICY IF EXISTS "Admins can view all submissions" ON competition_submissions;

CREATE POLICY "Admins can view all submissions"
  ON competition_submissions FOR SELECT
  USING (public.is_admin_user());

-- Grant execute permission on the new function
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO authenticated, anon;
