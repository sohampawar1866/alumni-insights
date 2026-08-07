import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { ArrowRight, Search, MessageSquare, Clock, GraduationCap, Megaphone } from "lucide-react";

export default async function StudentDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const now = new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - mondayOffset);
  weekStart.setHours(0, 0, 0, 0);

  // Parallelize Profile and Weekly Quota calculation queries via Promise.all
  const [{ data: profile }, { count: requestsSentThisWeek }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, branch, graduation_year")
      .eq("id", user!.id)
      .single(),
    supabase
      .from("connection_requests")
      .select("*", { count: "exact", head: true })
      .eq("student_id", user!.id)
      .gte("created_at", weekStart.toISOString()),
  ]);

  const weeklyLimit = parseInt(process.env.STUDENT_WEEKLY_REQUEST_LIMIT || "10");
  const remaining = Math.max(0, weeklyLimit - (requestsSentThisWeek || 0));

  const firstName = profile?.full_name?.split(" ")[0] || "Student";

  const currentAcademicYear = parseInt(process.env.NEXT_PUBLIC_CURRENT_ACADEMIC_YEAR || new Date().getFullYear().toString());
  const isEligibleForAlumni = profile?.graduation_year && (profile.graduation_year - currentAcademicYear <= 1);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8 font-sans">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
            <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
            {profile?.branch || "IIITN"} Student · Class of {profile?.graduation_year || "2026"}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-heading">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-sm text-slate-600 max-w-xl">
            Search IIIT Nagpur alumni across top companies, send structured mentorship requests, and track your career guidance sessions.
          </p>
        </div>

        <div className="shrink-0 z-10">
          <Link
            href="/search"
            className="inline-flex items-center justify-center bg-slate-900 text-white font-semibold rounded-xl px-5 py-3 text-sm shadow-sm hover:bg-slate-800 transition-all gap-2"
          >
            <Search className="w-4 h-4" />
            Search Directory
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 font-heading border-b border-slate-200 pb-3">
            Overview & Quota
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Weekly Quota Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Weekly Quota</span>
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                  <Clock className="w-3 h-3 text-blue-600" />
                  Resets Monday
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-900 font-heading">
                    {remaining}
                  </span>
                  <span className="text-sm text-slate-500 font-medium">/ {weeklyLimit} requests left</span>
                </div>
              </div>

              <div className="h-2 rounded-full bg-slate-100 overflow-hidden w-full">
                <div
                  className="h-full bg-slate-900 rounded-full transition-all duration-500"
                  style={{ width: `${(remaining / weeklyLimit) * 100}%` }}
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">Quick Navigation</h3>
                <div className="space-y-2">
                  <Link 
                    href="/dashboard/requests" 
                    className="flex items-center justify-between bg-slate-50 border border-slate-200/80 hover:bg-slate-100 rounded-lg p-3 text-xs font-semibold text-slate-800 transition-colors"
                  >
                    <span>View Pending Requests</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                  <Link 
                    href="/dashboard/requests" 
                    className="flex items-center justify-between bg-slate-50 border border-slate-200/80 hover:bg-slate-100 rounded-lg p-3 text-xs font-semibold text-slate-800 transition-colors"
                  >
                    <span>Open Messages</span>
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900 font-heading border-b border-slate-200 pb-3">
            Campus Bulletin
          </h2>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Announcements Feed</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Stay updated with Alumni Committee talks, official notices, and alumni guest sessions on the bulletin board.
            </p>
            <Link 
              href="/announcements" 
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              View Announcements <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {isEligibleForAlumni && (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-6 shadow-sm space-y-3">
              <h3 className="text-base font-bold">Graduating Soon?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Submit an application to have your profile added to the official Alumni Directory.
              </p>
              <Link
                href="/dashboard/apply"
                className="inline-block w-full text-center bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs py-2.5 rounded-lg transition-colors shadow-sm mt-2"
              >
                Apply as Alumni
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
