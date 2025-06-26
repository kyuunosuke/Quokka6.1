# Admin Authorization Setup Guide

## Overview
This system implements secure admin authorization with role-based access control using Supabase. Admins can manage competitions through a protected dashboard.

## Environment Variables Setup

### Required Environment Variables
Add these to your `.env.local` file:

```bash
# Supabase Configuration (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key

# Admin Configuration
ADMIN_EMAIL=paused.rewinded@gmail.com
ADMIN_PASSWORD=Anyth1ng
ADMIN_NAME=System Administrator

# Optional: Multiple admin emails
ADMIN_EMAILS=paused.rewinded@gmail.com

# Setup security key (for initial setup API)
ADMIN_SETUP_KEY=your_secure_setup_key_2024
```

## Database Setup

The migrations have been created and will set up:

1. **Profiles Table**: Enhanced with role-based access control
2. **RLS Policies**: Row-level security for all tables
3. **Admin Functions**: Helper functions for role checking
4. **Triggers**: Automatic profile creation on user signup

### Key Features:
- **Roles**: `admin`, `member`, `client`, `user`
- **RLS Policies**: Secure access control for all operations
- **Admin Functions**: `is_admin()`, `get_user_role()`, `create_admin_user()`

## Authentication Modes

### 1. Pre-configured Admin (Recommended)
- Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in environment
- Admin can login with these credentials
- System automatically creates admin user if needed

### 2. Standard Supabase Auth
- Regular email/password authentication
- Requires manual role assignment in database

## Admin User Creation

### Method 1: Automatic (Recommended)
1. Set environment variables
2. Admin logs in with pre-configured credentials
3. System automatically creates admin user

### Method 2: Manual Database Setup
Run this SQL in your Supabase SQL editor:

```sql
-- Create admin user manually
SELECT public.create_admin_user(
  'paused.rewinded@gmail.com',
  'Anyth1ng',
  'System Administrator'
);
```

### Method 3: Setup API
Call the setup endpoint (one-time use):

```bash
curl -X POST https://your-domain.com/api/admin/setup \
  -H "Authorization: Bearer your_setup_key" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "paused.rewinded@gmail.com",
    "password": "Anyth1ng",
    "name": "System Administrator"
  }'
```

## Security Features

### Row-Level Security (RLS)
- **Profiles**: Users can only see/edit their own profiles, admins see all
- **Competitions**: Public viewing, admin management
- **Submissions**: Users manage their own, admins can view all
- **Saved Competitions**: User-specific access

### Access Control
- Admin routes protected by middleware
- Server-side role verification in all admin actions
- Pre-configured credentials for secure admin access

### Security Policies
- All sensitive operations require admin role
- Automatic session validation
- Protected API endpoints

## Admin Dashboard Access

1. Navigate to `/admin/login`
2. Enter admin credentials
3. System validates and redirects to `/admin`
4. Full competition management available

## Troubleshooting

### Admin Can't Login
1. Check environment variables are set correctly
2. Verify admin user exists in database
3. Check Supabase logs for authentication errors

### Permission Denied Errors
1. Verify user has `admin` role in profiles table
2. Check RLS policies are enabled
3. Ensure service role key is correct

### Database Issues
1. Run migrations in order
2. Check table permissions
3. Verify triggers are created

## Production Deployment

1. Set all environment variables in production
2. Use strong, unique passwords
3. Enable database backups
4. Monitor admin access logs
5. Regularly rotate admin credentials

## API Endpoints

- `GET /api/admin/auth-mode` - Check authentication mode
- `POST /api/admin/validate-credentials` - Validate admin credentials
- `POST /api/admin/setup` - One-time admin setup

## Next Steps

1. Set your environment variables
2. Deploy the application
3. Access `/admin/login` to create your first admin
4. Start managing competitions!

For additional security, consider implementing:
- Two-factor authentication
- IP whitelisting
- Audit logging
- Session timeout controls
