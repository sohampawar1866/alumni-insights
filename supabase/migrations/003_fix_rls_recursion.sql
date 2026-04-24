-- Create a SECURITY DEFINER function to bypass RLS and check roles securely
-- This prevents infinite recursion when RLS policies need to check the current user's roles.
CREATE OR REPLACE FUNCTION public.has_role(check_role text)
RETURNS boolean
LANGUAGE sql 
SECURITY DEFINER 
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND check_role = ANY(roles)
  );
$$;

-- 1. profiles
DROP POLICY IF EXISTS "moderators_read_all_profiles" ON public.profiles;
CREATE POLICY "moderators_read_all_profiles" ON public.profiles
  FOR SELECT USING (has_role('moderator') OR has_role('admin'));

-- 2. audit_logs
DROP POLICY IF EXISTS "moderators_read_audit_logs" ON public.audit_logs;
CREATE POLICY "moderators_read_audit_logs" ON public.audit_logs
  FOR SELECT USING (has_role('moderator') OR has_role('admin'));

DROP POLICY IF EXISTS "allow_audit_log_insert" ON public.audit_logs;
CREATE POLICY "allow_audit_log_insert" ON public.audit_logs
  FOR INSERT WITH CHECK (has_role('moderator') OR has_role('admin'));

-- 3. announcements
DROP POLICY IF EXISTS "mod_alumni_insert_announcements" ON public.announcements;
CREATE POLICY "mod_alumni_insert_announcements" ON public.announcements
  FOR INSERT WITH CHECK (has_role('moderator') OR has_role('alumni'));

DROP POLICY IF EXISTS "Moderators can update any announcement (for pinning/flagging)" ON public.announcements;
CREATE POLICY "Moderators can update any announcement (for pinning/flagging)" ON public.announcements
  FOR UPDATE USING (has_role('moderator'));

DROP POLICY IF EXISTS "Moderators can delete any announcement" ON public.announcements;
CREATE POLICY "Moderators can delete any announcement" ON public.announcements
  FOR DELETE USING (has_role('moderator'));

-- 4. alumni_applications
DROP POLICY IF EXISTS "moderators_read_applications" ON public.alumni_applications;
CREATE POLICY "moderators_read_applications" ON public.alumni_applications
  FOR SELECT USING (has_role('moderator') OR has_role('admin'));
