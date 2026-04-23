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

  const currentAcademicYear = parseInt(process.env.NEXT_PUBLIC_CURRENT_ACADEMIC_YEAR || new Date().getFullYear().toString());
  const isEligibleForAlumni = profile?.graduation_year && (profile.graduation_year - currentAcademicYear <= 1);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-12">
      {/* Welcome Section */}
      <div className="bg-background border-4 border-foreground shadow-[8px_8px_0px_var(--color-foreground)] p-8 sm:p-12 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary rounded-full border-4 border-foreground" />
        <div className="absolute right-20 -bottom-10 w-24 h-24 bg-secondary rounded-none border-4 border-foreground rotate-12" />
        
        <h1 className="font-heading text-5xl sm:text-7xl font-black uppercase tracking-tighter text-foreground relative z-10">
          Welcome back,<br /> <span className="text-primary" style={{ textShadow: "4px 4px 0px var(--color-foreground)" }}>{firstName}!</span>
        </h1>
        <p className="mt-4 text-xl font-bold uppercase tracking-wide text-foreground/80 relative z-10 bg-white inline-block px-3 py-1 border-2 border-foreground">
          {profile?.branch} · Class of {profile?.graduation_year}
        </p>

        <div className="mt-8 relative z-10">
          <Link
            href="/search"
            className="inline-flex items-center justify-center bg-primary text-foreground border-2 border-foreground font-black uppercase tracking-widest px-8 py-4 text-lg shadow-[4px_4px_0px_var(--color-foreground)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            Find Alumni →
          </Link>
        </div>
      </div>

      {/* Two Column Layout (Main Feed & Sidebar) */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column (Main Feed) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-tighter border-b-4 border-foreground pb-2">Your Dashboard</h2>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Requests Remaining Card */}
            <div className="bg-background border-4 border-foreground shadow-[6px_6px_0px_var(--color-foreground)] p-6 relative">
              <div className="absolute top-0 right-0 bg-secondary border-b-4 border-l-4 border-foreground px-3 py-1 font-black text-sm uppercase">Weekly Limit</div>
              <p className="text-sm font-black uppercase tracking-widest text-foreground mt-4 mb-2">
                Connection Requests
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-foreground tracking-tighter">
                  {remaining}
                </span>
                <span className="text-lg font-bold text-foreground/60 uppercase">/ {weeklyLimit} left</span>
              </div>
              <div className="mt-6 h-4 border-2 border-foreground bg-muted overflow-hidden w-full">
                <div
                  className="h-full bg-primary border-r-2 border-foreground transition-all duration-500"
                  style={{ width: `${(remaining / weeklyLimit) * 100}%` }}
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border-4 border-foreground bg-muted shadow-[6px_6px_0px_var(--color-foreground)] p-6 flex flex-col justify-center">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Quick Links</h3>
              <div className="space-y-3">
                <Link href="/dashboard/requests" className="block w-full bg-background border-2 border-foreground px-4 py-3 font-bold uppercase text-sm hover:bg-secondary hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--color-foreground)] transition-all">
                  View Pending Requests
                </Link>
                <Link href="/dashboard/messages" className="block w-full bg-background border-2 border-foreground px-4 py-3 font-bold uppercase text-sm hover:bg-secondary hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--color-foreground)] transition-all">
                  Open Messages
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-tighter border-b-4 border-foreground pb-2">Announcements</h2>
          
          <div className="bg-background border-4 border-foreground shadow-[6px_6px_0px_var(--color-foreground)] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 bg-primary border-2 border-foreground rounded-full animate-pulse" />
              <h3 className="text-lg font-black uppercase tracking-wide">Live Feed</h3>
            </div>
            <p className="text-sm font-bold text-foreground/70 uppercase">
              Check the announcements page for upcoming AMAs and placement talks by alumni.
            </p>
            <Link href="/announcements" className="mt-6 inline-block text-sm font-black uppercase text-secondary-foreground border-b-2 border-foreground hover:bg-secondary transition-colors">
              View All →
            </Link>
          </div>

          {isEligibleForAlumni && (
            <div className="bg-primary border-4 border-foreground shadow-[6px_6px_0px_var(--color-foreground)] p-6 relative overflow-hidden mt-8">
              <div className="absolute right-0 top-0 w-16 h-16 bg-secondary border-b-4 border-l-4 border-foreground rounded-bl-full" />
              <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Graduating?</h3>
              <p className="text-sm font-bold text-foreground/90 uppercase tracking-wide mb-6">
                Apply to have your profile listed in the Alumni Directory.
              </p>
              <Link
                href="/dashboard/apply"
                className="block w-full text-center bg-background text-foreground border-2 border-foreground font-black uppercase px-4 py-3 shadow-[4px_4px_0px_var(--color-foreground)] hover:bg-secondary transition-all"
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
