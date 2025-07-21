-- Add verification fields to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) DEFAULT 'not_submitted';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_documents JSONB;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_submitted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_approved_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_approved_by UUID REFERENCES auth.users(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_rejection_reason TEXT;

-- Add comment for verification_status values
COMMENT ON COLUMN profiles.verification_status IS 'Possible values: not_submitted, pending, approved, rejected';

-- Create storage bucket for verification documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('verification-documents', 'verification-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for verification documents bucket
CREATE POLICY "Users can upload their own verification documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'verification-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own verification documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'verification-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all verification documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'verification-documents' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);


