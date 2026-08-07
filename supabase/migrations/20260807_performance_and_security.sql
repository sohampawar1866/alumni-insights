-- Database Indexes for Ultra-Fast Queries & Low Latency
-- Run this in your Supabase SQL Editor to accelerate all searches and requests.

-- 1. Index on Profiles roles and branch/company for directory searching
CREATE INDEX IF NOT EXISTS idx_profiles_roles ON public.profiles USING GIN (roles);
CREATE INDEX IF NOT EXISTS idx_profiles_company ON public.profiles (company) WHERE company IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_branch ON public.profiles (branch) WHERE branch IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_city ON public.profiles (city) WHERE city IS NOT NULL;

-- 2. Index on Connection Requests for fast Dashboard & Requests lookups
CREATE INDEX IF NOT EXISTS idx_conn_requests_student_id ON public.connection_requests (student_id);
CREATE INDEX IF NOT EXISTS idx_conn_requests_alumni_id ON public.connection_requests (alumni_id);
CREATE INDEX IF NOT EXISTS idx_conn_requests_status ON public.connection_requests (status);
CREATE INDEX IF NOT EXISTS idx_conn_requests_created_at ON public.connection_requests (created_at DESC);

-- 3. Index on Audit Logs and Announcements for quick feed generation
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON public.announcements (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_is_pinned ON public.announcements (is_pinned) WHERE is_pinned = true;

-- 4. Index on Messages for 1:1 Chat Threads
CREATE INDEX IF NOT EXISTS idx_messages_request_id ON public.messages (request_id, created_at ASC);

-- Row Level Security (RLS) Policies Safety Verification
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_applications ENABLE ROW LEVEL SECURITY;
