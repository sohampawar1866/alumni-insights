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
    .eq("role", "alumni")
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
        href="/search"
        className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        ← Back to search
      </Link>

      {/* Profile Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">
                {alumni.full_name || "Alumni"}
              </h1>
              {alumni.mentorship_available && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Open to Mentorship
                </span>
              )}
            </div>
            <p className="text-lg text-slate-600">
              {alumni.role_title || "—"}{" "}
              {alumni.company ? `at ${alumni.company}` : ""}
            </p>
          </div>

          {alumni.emp_type && (
            <span
              className={`self-start inline-flex items-center rounded-lg px-3 py-1 text-sm font-medium ${
                alumni.emp_type === "Intern"
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "bg-blue-50 text-blue-700 border border-blue-200"
              }`}
            >
              {alumni.emp_type}
            </span>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              Branch
            </p>
            <p className="text-sm text-slate-700 mt-0.5">
              {alumni.branch || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              Graduation
            </p>
            <p className="text-sm text-slate-700 mt-0.5">
              {alumni.graduation_year || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              City
            </p>
            <p className="text-sm text-slate-700 mt-0.5">
              {alumni.city || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              Response
            </p>
            <p className="text-sm text-slate-700 mt-0.5">
              {totalRequests && totalRequests > 0
                ? `${acceptedRequests || 0} of ${totalRequests} accepted`
                : "No requests yet"}
            </p>
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
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">
            What I can help with
          </h2>
          <p className="text-slate-600 leading-relaxed">{alumni.bio}</p>
        </div>
      )}

      {/* Mentorship Preferences */}
      {alumni.mentorship_preferences && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">
            Mentorship Preferences
          </h2>
          <p className="text-slate-600">{alumni.mentorship_preferences}</p>
        </div>
      )}

      {/* LinkedIn */}
      {alumni.linkedin_url && (
        <a
          href={alumni.linkedin_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          View LinkedIn Profile →
        </a>
      )}

      {/* Connect Button */}
      <div className="pt-4">
        <ConnectSection alumniId={alumni.id} alumniName={alumni.full_name || "Alumni"} />
        <p className="text-xs text-slate-400 mt-2">
          You can send a connection request with a short note explaining your
          ask.
        </p>
      </div>
    </div>
  );
}
