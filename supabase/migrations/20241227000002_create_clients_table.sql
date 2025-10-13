-- Create clients table

CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  email_address TEXT NOT NULL,
  website TEXT,
  phone_number TEXT,
  person_in_charge TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clients_client_name ON public.clients(client_name);
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email_address);

alter publication supabase_realtime add table clients;
