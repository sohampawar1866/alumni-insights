import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ConnectSection } from "./connect-section";
import { AlumniBadge } from "@/components/alumni-badge";

export default async function AlumniProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: alumni } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .contains("roles", ["alumni"])
    .single();

  if (!alumni) {
    notFound();
  }

  // Fetch connection stats for this alumni
  const { count: totalRequests } = await supabase
    .from("connection_requests")
    .select("*", { count: "exact", head: true })
    .eq("alumni_id", id);

  const { count: acceptedRequests } = await supabase
    .from("connection_requests")
    .select("*", { count: "exact", head: true })
    .eq("alumni_id", id)
    .eq("status", "accepted");

  // Fetch contribution stats for badges
  const { data: stats } = await supabase
    .from("alumni_contribution_stats")
    .select("*")
    .eq("alumni_id", id)
    .single();

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      {/* Back Link */}
      <Link
        href="/dashboard/search"
        className="inline-flex items-center text-sm font-black uppercase text-foreground bg-primary border-2 border-foreground px-4 py-2 hover:shadow-[4px_4px_0px_var(--color-foreground)] hover:-translate-y-1 transition-all"
      >
        ← BACK TO SEARCH
      </Link>

      {/* Profile Header */}
      <div className="bg-background border-4 border-foreground shadow-[8px_8px_0px_var(--color-foreground)] p-8 space-y-6 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#fdc800]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-foreground break-words max-w-full">
                {alumni.full_name || "Alumni"}
              </h1>
              {alumni.mentorship_available && (
                <span className="inline-flex items-center gap-1 border-2 border-foreground bg-[#00e559] px-3 py-1 text-xs sm:text-sm font-black uppercase text-foreground shadow-[4px_4px_0px_var(--color-foreground)] whitespace-nowrap">
                  <span className="inline-block w-2 h-2 bg-foreground" />
                  MENTOR
                </span>
              )}
            </div>
            <p className="text-xl sm:text-2xl font-bold text-muted-foreground uppercase tracking-wide">
              {alumni.role_title || "—"} {alumni.company ? `// ${alumni.company}` : ""}
            </p>
          </div>

          {alumni.emp_type && (
            <span
              className={`self-start inline-flex items-center border-2 border-foreground px-4 py-2 text-sm font-black uppercase shadow-[4px_4px_0px_var(--color-foreground)] whitespace-nowrap ${
                alumni.emp_type === "Intern"
                  ? "bg-[#fdc800] text-foreground"
                  : "bg-primary text-background"
              }`}
            >
              {alumni.emp_type}
            </span>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t-4 border-foreground relative z-10">
          <div className="flex flex-col">
            <p className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-1">
              Branch
            </p>
            <p className="text-base sm:text-lg font-bold text-foreground bg-muted border-2 border-foreground p-2 shadow-[2px_2px_0px_var(--color-foreground)] w-fit">
              {alumni.branch || "—"}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-1">
              Graduation
            </p>
            <p className="text-base sm:text-lg font-bold text-foreground bg-muted border-2 border-foreground p-2 shadow-[2px_2px_0px_var(--color-foreground)] w-fit">
              &apos;{String(alumni.graduation_year || "—").slice(-2)}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-1">
              City
            </p>
            <p className="text-base sm:text-lg font-bold text-foreground bg-muted border-2 border-foreground p-2 shadow-[2px_2px_0px_var(--color-foreground)] w-fit">
              {alumni.city || "—"}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-1">
              Response
            </p>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold text-foreground bg-muted border-2 border-foreground p-2 shadow-[2px_2px_0px_var(--color-foreground)] w-fit">
                {totalRequests && totalRequests > 0
                  ? `${acceptedRequests || 0}/${totalRequests} ACCPT`
                  : "N/A"}
              </p>
              {stats && stats.avg_response_hours > 0 && (
                <p className="text-xs font-bold text-muted-foreground uppercase">
                  ~{stats.avg_response_hours < 24 ? "<24 HR" : `${Math.round(stats.avg_response_hours / 24)} DAY`}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contribution Badge */}
      {stats && (
        <AlumniBadge
          tier={stats.tier}
          completedCount={stats.completed_count}
          avgRating={Number(stats.avg_rating)}
          feedbackCount={stats.feedback_count}
          acceptanceRate={Number(stats.acceptance_rate)}
        />
      )}

      {/* Bio / What I can help with */}
      {alumni.bio && (
        <div className="bg-background border-4 border-foreground shadow-[8px_8px_0px_var(--color-foreground)] p-6">
          <h2 className="text-lg font-black text-foreground uppercase tracking-widest mb-4 border-b-2 border-foreground pb-2 inline-block">
            What I Can Help With
          </h2>
          <p className="text-base text-foreground font-medium leading-relaxed font-mono">
            {alumni.bio}
          </p>
        </div>
      )}

      {/* Mentorship Preferences */}
      {alumni.mentorship_preferences && (
        <div className="bg-[#fdc800]/20 border-4 border-foreground shadow-[8px_8px_0px_var(--color-foreground)] p-6">
          <h2 className="text-lg font-black text-foreground uppercase tracking-widest mb-4 border-b-2 border-foreground pb-2 inline-block">
            Mentorship Preferences
          </h2>
          <p className="text-base text-foreground font-medium leading-relaxed font-mono">
            {alumni.mentorship_preferences}
          </p>
        </div>
      )}

      {/* LinkedIn */}
      {alumni.linkedin_url && (
        <a
          href={alumni.linkedin_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-black uppercase text-background bg-[#0A66C2] border-2 border-foreground px-6 py-3 shadow-[4px_4px_0px_var(--color-foreground)] hover:shadow-[2px_2px_0px_var(--color-foreground)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
           LINKEDIN PROFILE →
        </a>
      )}

      {/* Connect Button */}
      <div className="pt-8 pb-12 border-t-4 border-foreground border-dashed mt-8">
        <ConnectSection alumniId={alumni.id} alumniName={alumni.full_name || "Alumni"} />
        <p className="text-xs font-bold text-muted-foreground uppercase mt-4 max-w-md">
          SEND A CONNECTION REQUEST WITH A SHORT NOTE EXPLAINING YOUR ASK.
        </p>
      </div>
    </div>
  );
}
