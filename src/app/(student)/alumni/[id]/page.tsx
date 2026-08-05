import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ConnectSection } from "./connect-section";
import { AlumniBadge } from "@/components/alumni-badge";
import { ArrowLeft, ExternalLink, Building2, MapPin, GraduationCap, CheckCircle2 } from "lucide-react";

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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 font-sans">
      {/* Back Link */}
      <Link
        href="/search"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors gap-1"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Alumni Directory
      </Link>

      {/* Profile Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
                {alumni.full_name || "Alumnus"}
              </h1>
              {alumni.mentorship_available && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Available for Mentorship
                </span>
              )}
            </div>
            <p className="text-base sm:text-lg font-semibold text-slate-700">
              {alumni.role_title || "Alumni Member"} {alumni.company ? `@ ${alumni.company}` : ""}
            </p>
          </div>

          {alumni.emp_type && (
            <span
              className={`shrink-0 inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold ${
                alumni.emp_type === "Intern"
                  ? "bg-amber-50 text-amber-800 border border-amber-200"
                  : "bg-slate-900 text-white"
              }`}
            >
              {alumni.emp_type}
            </span>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400">Branch</p>
            <p className="text-sm font-semibold text-slate-900">{alumni.branch || "-"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400">Graduation Year</p>
            <p className="text-sm font-semibold text-slate-900">Class of &apos;{String(alumni.graduation_year || "N/A").slice(-2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400">City / Location</p>
            <p className="text-sm font-semibold text-slate-900">{alumni.city || "-"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400">Acceptance History</p>
            <p className="text-sm font-semibold text-slate-900">
              {totalRequests && totalRequests > 0
                ? `${acceptedRequests || 0} of ${totalRequests} accepted`
                : "New Mentor"}
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

      {/* Bio / Mentorship details */}
      {alumni.bio && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            About & Mentorship Focus
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            {alumni.bio}
          </p>
        </div>
      )}

      {/* Mentorship Preferences */}
      {alumni.mentorship_preferences && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Preferred Topics
          </h2>
          <p className="text-sm text-slate-800 font-medium leading-relaxed">
            {alumni.mentorship_preferences}
          </p>
        </div>
      )}

      {/* External Links */}
      {alumni.linkedin_url && (
        <a
          href={alumni.linkedin_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5 hover:bg-blue-100 transition-colors"
        >
          View LinkedIn Profile <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}

      {/* Connect Section */}
      <div className="pt-6 border-t border-slate-200 space-y-2">
        <ConnectSection alumniId={alumni.id} alumniName={alumni.full_name || "Alumnus"} />
      </div>
    </div>
  );
}
