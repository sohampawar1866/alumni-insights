-- ============================================================
-- Migration: Multi-Role System
-- Converts profiles.role (user_role enum) → profiles.roles (text array)
-- Drops & recreates all dependent RLS policies and views
-- ============================================================

-- Step 1: Add new `roles` column as text array
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS roles text[] DEFAULT '{}'::text[];

-- Step 2: Migrate existing data from `role` (enum) → `roles` (text array)
-- Cast the enum to text before creating the array
UPDATE public.profiles
SET roles = ARRAY[role::text]
WHERE role IS NOT NULL AND (roles IS NULL OR roles = '{}');

-- Step 3: Drop ALL dependent RLS policies that reference the old `role` column.

-- Policies on profiles
DROP POLICY IF EXISTS "students_read_alumni" ON public.profiles;
DROP POLICY IF EXISTS "moderators_read_all_profiles" ON public.profiles;

-- Policies on audit_logs
DROP POLICY IF EXISTS "moderators_read_audit_logs" ON public.audit_logs;
DROP POLICY IF EXISTS "allow_audit_log_insert" ON public.audit_logs;

-- Policies on announcements
DROP POLICY IF EXISTS "mod_alumni_insert_announcements" ON public.announcements;
DROP POLICY IF EXISTS "Moderators and Alumni can insert announcements" ON public.announcements;
DROP POLICY IF EXISTS "Moderators can update any announcement (for pinning/flagging)" ON public.announcements;
DROP POLICY IF EXISTS "Moderators can delete any announcement" ON public.announcements;

-- Policies on alumni_applications
DROP POLICY IF EXISTS "moderators_read_applications" ON public.alumni_applications;
DROP POLICY IF EXISTS "Moderators can view applications" ON public.alumni_applications;

-- Drop the dependent view
DROP VIEW IF EXISTS public.alumni_contribution_stats;

-- Step 4: Now safe to drop the old `role` column
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- Step 5: Drop the user_role enum type (no longer needed)
DROP TYPE IF EXISTS public.user_role;

-- Step 6: Create a GIN index on the roles array for efficient queries
CREATE INDEX IF NOT EXISTS idx_profiles_roles ON public.profiles USING GIN (roles);

-- Step 7: Recreate RLS policies using the new `roles` text array

-- ==================== profiles ====================
CREATE POLICY "students_read_alumni" ON public.profiles
  FOR SELECT USING (
    'alumni' = ANY(roles)
    OR auth.uid() = id
  );

CREATE POLICY "moderators_read_all_profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND ('moderator' = ANY(p.roles) OR 'admin' = ANY(p.roles))
    )
  );

-- ==================== audit_logs ====================
CREATE POLICY "moderators_read_audit_logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND ('moderator' = ANY(p.roles) OR 'admin' = ANY(p.roles))
    )
  );

CREATE POLICY "allow_audit_log_insert" ON public.audit_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND ('moderator' = ANY(p.roles) OR 'admin' = ANY(p.roles))
    )
  );

-- ==================== announcements ====================
CREATE POLICY "mod_alumni_insert_announcements" ON public.announcements
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND ('moderator' = ANY(p.roles) OR 'alumni' = ANY(p.roles))
    )
  );

CREATE POLICY "Moderators can update any announcement (for pinning/flagging)" ON public.announcements
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND 'moderator' = ANY(p.roles)
    )
  );

CREATE POLICY "Moderators can delete any announcement" ON public.announcements
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND 'moderator' = ANY(p.roles)
    )
  );

-- ==================== alumni_applications ====================
CREATE POLICY "moderators_read_applications" ON public.alumni_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND ('moderator' = ANY(p.roles) OR 'admin' = ANY(p.roles))
    )
  );

-- ==================== Recreate alumni_contribution_stats view ====================
CREATE OR REPLACE VIEW public.alumni_contribution_stats AS
SELECT
  p.id AS alumni_id,
  p.full_name,
  count(DISTINCT cr.id) FILTER (WHERE cr.status = 'accepted') AS accepted_count,
  count(DISTINCT cr.id) FILTER (WHERE cr.status = 'completed') AS completed_count,
  COALESCE(round(avg(sf.rating), 1), 0) AS avg_rating,
  count(DISTINCT sf.id) AS feedback_count,
  CASE
    WHEN count(DISTINCT cr.id) FILTER (WHERE cr.status = 'completed') >= 50 THEN 'Platinum'
    WHEN count(DISTINCT cr.id) FILTER (WHERE cr.status = 'completed') >= 25 THEN 'Gold'
    WHEN count(DISTINCT cr.id) FILTER (WHERE cr.status = 'completed') >= 10 THEN 'Silver'
    WHEN count(DISTINCT cr.id) FILTER (WHERE cr.status = 'completed') >= 3 THEN 'Bronze'
    ELSE 'New'
  END AS tier,
  CASE
    WHEN count(DISTINCT cr.id) FILTER (WHERE cr.status IN ('accepted', 'completed', 'declined')) > 0
    THEN round(
      (count(DISTINCT cr.id) FILTER (WHERE cr.status IN ('accepted', 'completed'))::numeric
       / count(DISTINCT cr.id) FILTER (WHERE cr.status IN ('accepted', 'completed', 'declined'))::numeric)
      * 100, 0
    )
    ELSE 0
  END AS acceptance_rate,
  COALESCE(
    avg(EXTRACT(epoch FROM (cr.updated_at - cr.created_at))) FILTER (WHERE cr.status IN ('accepted', 'declined')),
    0
  ) / 3600.0 AS avg_response_hours
FROM public.profiles p
LEFT JOIN public.connection_requests cr ON cr.alumni_id = p.id
LEFT JOIN public.session_feedback sf ON sf.alumni_id = p.id
WHERE 'alumni' = ANY(p.roles)
GROUP BY p.id, p.full_name;

-- Step 8: Helper function to check if a user has a specific role
CREATE OR REPLACE FUNCTION public.user_has_role(user_id uuid, check_role text)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND check_role = ANY(roles)
  );
$$;
