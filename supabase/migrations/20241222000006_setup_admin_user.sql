-- Setup the specific admin user with provided credentials
-- This migration creates the admin user with the specified email and password

-- Create admin_setup_log table first
CREATE TABLE IF NOT EXISTS public.admin_setup_log (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text NOT NULL,
    setup_date timestamp with time zone DEFAULT now(),
    notes text,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on admin_setup_log
ALTER TABLE admin_setup_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view setup logs
DROP POLICY IF EXISTS "Only admins can view setup logs" ON admin_setup_log;
CREATE POLICY "Only admins can view setup logs"
    ON admin_setup_log FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Add to realtime
ALTER PUBLICATION supabase_realtime ADD TABLE admin_setup_log;

-- First, let's ensure we have the admin user in the system
-- This will either create or update the admin user
DO $$
DECLARE
    admin_user_id uuid;
    admin_exists boolean := false;
BEGIN
    -- Check if admin user already exists in profiles
    SELECT EXISTS(
        SELECT 1 FROM profiles 
        WHERE email = 'paused.rewinded@gmail.com' AND role = 'admin'
    ) INTO admin_exists;
    
    IF NOT admin_exists THEN
        -- Check if user exists in auth.users
        SELECT id INTO admin_user_id
        FROM auth.users 
        WHERE email = 'paused.rewinded@gmail.com'
        LIMIT 1;
        
        IF admin_user_id IS NOT NULL THEN
            -- User exists in auth, just update/create profile
            INSERT INTO profiles (
                id,
                email,
                full_name,
                role,
                created_at,
                updated_at
            ) VALUES (
                admin_user_id,
                'paused.rewinded@gmail.com',
                'System Administrator',
                'admin',
                now(),
                now()
            )
            ON CONFLICT (id) DO UPDATE SET
                role = 'admin',
                updated_at = now();
                
            RAISE NOTICE 'Admin profile created/updated for existing user: %', admin_user_id;
        ELSE
            -- User doesn't exist, we'll need to create via the application
            RAISE NOTICE 'Admin user does not exist in auth.users. Please create via application signup or admin setup API.';
        END IF;
    ELSE
        RAISE NOTICE 'Admin user already exists with correct role.';
    END IF;
END $$;

-- Ensure the admin user has all necessary permissions
-- Update any existing user with this email to have admin role
UPDATE profiles 
SET role = 'admin', updated_at = now()
WHERE email = 'paused.rewinded@gmail.com';

-- Create a function to validate admin credentials
CREATE OR REPLACE FUNCTION public.validate_admin_credentials(
    check_email text,
    check_password text
)
RETURNS boolean AS $$
DECLARE
    is_valid boolean := false;
BEGIN
    -- This is a simple validation function
    -- In production, you might want more sophisticated validation
    IF check_email = 'paused.rewinded@gmail.com' AND check_password = 'Anyth1ng' THEN
        is_valid := true;
    END IF;
    
    RETURN is_valid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.validate_admin_credentials(text, text) TO authenticated, anon;

-- Log the setup
INSERT INTO public.admin_setup_log (email, setup_date, notes)
VALUES (
    'paused.rewinded@gmail.com',
    now(),
    'Admin user configured via migration'
)
ON CONFLICT DO NOTHING;
