-- ============================================================
-- Migration: Membership Tiers, Membership Requests, & Targeted Announcements
-- ============================================================

-- 1. Add membership fields to public.profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS membership_type text DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS membership_expires_at timestamptz DEFAULT NULL;

-- Create an index on membership_type for fast filtering
CREATE INDEX IF NOT EXISTS idx_profiles_membership_type ON public.profiles(membership_type);

-- 2. Add target_role field to public.announcements
ALTER TABLE public.announcements
  ADD COLUMN IF NOT EXISTS target_role text DEFAULT 'all';

-- 3. Create public.membership_requests table for payment proof approvals
CREATE TABLE IF NOT EXISTS public.membership_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alumni_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  membership_type text NOT NULL,
  transaction_id text,
  proof_url text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on membership_requests
ALTER TABLE public.membership_requests ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for membership_requests
DROP POLICY IF EXISTS "alumni_own_membership_requests" ON public.membership_requests;
CREATE POLICY "alumni_own_membership_requests" ON public.membership_requests
  FOR ALL USING (auth.uid() = alumni_id);

DROP POLICY IF EXISTS "moderators_manage_membership_requests" ON public.membership_requests;
CREATE POLICY "moderators_manage_membership_requests" ON public.membership_requests
  FOR ALL USING (has_role('moderator') OR has_role('admin'));

-- 5. Enable Alumni to read all alumni profiles for the Directory
DROP POLICY IF EXISTS "authenticated_read_alumni" ON public.profiles;
CREATE POLICY "authenticated_read_alumni" ON public.profiles
  FOR SELECT USING (
    'alumni' = ANY(roles)
    OR auth.uid() = id
  );

-- 6. Indexes for membership_requests
CREATE INDEX IF NOT EXISTS idx_membership_requests_alumni_id ON public.membership_requests(alumni_id);
CREATE INDEX IF NOT EXISTS idx_membership_requests_status ON public.membership_requests(status);
