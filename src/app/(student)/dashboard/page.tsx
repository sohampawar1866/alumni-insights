import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function StudentDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, branch, graduation_year")
    .eq("id", user!.id)
    .single();

  // Calculate weekly requests remaining
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon...
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - mondayOffset);
  weekStart.setHours(0, 0, 0, 0);

  const { count: requestsSentThisWeek } = await supabase
    .from("connection_requests")
    .select("*", { count: "exact", head: true })
    .eq("student_id", user!.id)
    .gte("created_at", weekStart.toISOString());

  const weeklyLimit = parseInt(process.env.STUDENT_WEEKLY_REQUEST_LIMIT || "10");
  const remaining = Math.max(0, weeklyLimit - (requestsSentThisWeek || 0));

  const firstName = profile?.full_name?.split(" ")[0] || "there";

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Hey, {firstName} 👋
        </h1>
        <p className="mt-1 text-slate-500">
          {profile?.branch} · Class of {profile?.graduation_year}
        </p>
      </div>

      {/* Stats + Quick Actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Requests Remaining Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">
            Connection Requests
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-slate-900">
              {remaining}
            </span>
            <span className="text-sm text-slate-400">/ {weeklyLimit} this week</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
              style={{ width: `${(remaining / weeklyLimit) * 100}%` }}
            />
          </div>
        </div>

        {/* Search CTA Card */}
        <Link
          href="/search"
          className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-200"
        >
          <p className="text-sm font-medium text-slate-500 mb-1">
            Alumni Directory
          </p>
          <p className="text-lg font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
            Search & discover alumni →
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Filter by company, role, branch, city, and more.
          </p>
        </Link>
      </div>
    </div>
  );
}
