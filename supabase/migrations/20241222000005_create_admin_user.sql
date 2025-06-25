-- Create admin user setup
-- This migration will be used to set up the initial admin user

-- Function to create admin user (will be called manually or via environment setup)
CREATE OR REPLACE FUNCTION public.create_admin_user(
  admin_email text,
  admin_password text,
  admin_name text DEFAULT 'System Administrator'
)
RETURNS uuid AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- This function should be called with service role key
  -- Insert into auth.users (this requires service role)
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role
  ) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    admin_email,
    crypt(admin_password, gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    json_build_object('full_name', admin_name),
    false,
    'authenticated'
  ) RETURNING id INTO new_user_id;

  -- Insert into profiles with admin role
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    admin_email,
    admin_name,
    'admin',
    now(),
    now()
  );

  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to service role
GRANT EXECUTE ON FUNCTION public.create_admin_user(text, text, text) TO service_role;

-- Note: To create an admin user, you'll need to run this with service role:
-- SELECT public.create_admin_user('admin@yourcompany.com', 'your_secure_password', 'Admin User');
