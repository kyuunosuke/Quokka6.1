-- Create profiles table with role-based access control
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text,
    full_name text,
    avatar_url text,
    role text NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin', 'client')),
    bio text,
    location text,
    website text,
    phone text,
    social_links jsonb DEFAULT '{}',
    preferences jsonb DEFAULT '{}',
    email_notifications boolean DEFAULT true,
    push_notifications boolean DEFAULT true,
    marketing_notifications boolean DEFAULT false,
    competition_notifications boolean DEFAULT true,
    profile_public boolean DEFAULT true,
    show_email boolean DEFAULT false,
    show_stats boolean DEFAULT true,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
-- Users can view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Admins can update all profiles
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" 
ON public.profiles FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Admins can delete profiles
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
CREATE POLICY "Admins can delete profiles" 
ON public.profiles FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    avatar_url,
    role,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    'member', -- Default role
    NEW.created_at,
    NEW.updated_at
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

-- Create function to handle user profile updates
CREATE OR REPLACE FUNCTION public.handle_user_profile_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET
    email = NEW.email,
    full_name = NEW.raw_user_meta_data->>'full_name',
    avatar_url = NEW.raw_user_meta_data->>'avatar_url',
    updated_at = NEW.updated_at
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update profile when auth user is updated
DROP TRIGGER IF EXISTS on_auth_user_updated_profile ON auth.users;
CREATE TRIGGER on_auth_user_updated_profile
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_profile_update();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_profiles_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at on profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles 
    FOR EACH ROW EXECUTE FUNCTION update_profiles_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON public.profiles(is_active);

-- Enable realtime for profiles table
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- Update RLS policies for saved_competitions to use profiles
DROP POLICY IF EXISTS "Users can view own saved competitions" ON public.saved_competitions;
CREATE POLICY "Users can view own saved competitions" 
ON public.saved_competitions FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own saved competitions" ON public.saved_competitions;
CREATE POLICY "Users can insert own saved competitions" 
ON public.saved_competitions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own saved competitions" ON public.saved_competitions;
CREATE POLICY "Users can delete own saved competitions" 
ON public.saved_competitions FOR DELETE 
USING (auth.uid() = user_id);

-- Update RLS policies for competition_submissions to use profiles
DROP POLICY IF EXISTS "Users can view own submissions" ON public.competition_submissions;
CREATE POLICY "Users can view own submissions" 
ON public.competition_submissions FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own submissions" ON public.competition_submissions;
CREATE POLICY "Users can insert own submissions" 
ON public.competition_submissions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own submissions" ON public.competition_submissions;
CREATE POLICY "Users can update own submissions" 
ON public.competition_submissions FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own submissions" ON public.competition_submissions;
CREATE POLICY "Users can delete own submissions" 
ON public.competition_submissions FOR DELETE 
USING (auth.uid() = user_id);

-- Enable RLS on saved_competitions and competition_submissions
ALTER TABLE public.saved_competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_submissions ENABLE ROW LEVEL SECURITY;

-- Public read access for competitions (anyone can view competitions)
DROP POLICY IF EXISTS "Public can view competitions" ON public.competitions;
CREATE POLICY "Public can view competitions" 
ON public.competitions FOR SELECT 
USING (true);

-- Only authenticated users can create competitions
DROP POLICY IF EXISTS "Authenticated users can create competitions" ON public.competitions;
CREATE POLICY "Authenticated users can create competitions" 
ON public.competitions FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own competitions
DROP POLICY IF EXISTS "Users can update own competitions" ON public.competitions;
CREATE POLICY "Users can update own competitions" 
ON public.competitions FOR UPDATE 
USING (auth.uid() = organizer_id);

-- Users can delete their own competitions
DROP POLICY IF EXISTS "Users can delete own competitions" ON public.competitions;
CREATE POLICY "Users can delete own competitions" 
ON public.competitions FOR DELETE 
USING (auth.uid() = organizer_id);

-- Enable RLS on competitions
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;