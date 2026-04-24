-- ============================================================
-- Migration: Pre-seed admin profile
-- Looks up admin@iiitn.ac.in from auth.users and creates the
-- profiles row with the admin role.
-- ============================================================

INSERT INTO public.profiles (id, email, roles, full_name)
SELECT
  au.id,
  au.email,
  '{admin}'::text[],
  COALESCE(au.raw_user_meta_data ->> 'full_name', 'Admin')
FROM auth.users au
WHERE au.email = 'admin@iiitn.ac.in'
ON CONFLICT (id) DO UPDATE
  SET roles = CASE
    WHEN 'admin' = ANY(profiles.roles) THEN profiles.roles
    ELSE array_append(profiles.roles, 'admin')
  END;
