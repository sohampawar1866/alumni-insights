import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { FeedbackButton } from "@/components/feedback-button";

export default async function MyRequestsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: requests } = await supabase
    .from("connection_requests")
    .select(
      `
      id,
      message,
      status,
      created_at,
      alumni:profiles!connection_requests_alumni_id_fkey (
        id,
        full_name,
        role_title,
        company,
        linkedin_url
      )
    `
    )
    .eq("student_id", user!.id)
    .order("created_at", { ascending: false });

  // Fetch existing feedback so we know which completed requests already have it
  const { data: feedbackData } = await supabase
    .from("session_feedback")
    .select("request_id")
    .eq("student_id", user!.id);

  const feedbackRequestIds = new Set(feedbackData?.map((f) => f.request_id) || []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        ← Back to Dashboard
      </Link>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Requests</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your connection requests to alumni.
          </p>
        </div>
        <Link
          href="/search"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Find more alumni &rarr;
        </Link>
      </div>

      <div className="space-y-4">
        {!requests || requests.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-slate-500">You haven&apos;t sent any requests yet.</p>
          </div>
        ) : (
          requests.map((req) => {
            const alumni = req.alumni as unknown as {
              id: string;
              full_name: string | null;
              role_title: string | null;
              company: string | null;
              linkedin_url: string | null;
            } | null;

            return (
              <div
                key={req.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {alumni?.full_name || "Unknown Alumni"}
                    </h3>
                    <p className="text-sm text-slate-600 mt-0.5">
                      {alumni?.role_title || "—"}{" "}
                      {alumni?.company ? `at ${alumni.company}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        req.status === "accepted"
                          ? "bg-emerald-50 text-emerald-700"
                          : req.status === "declined"
                          ? "bg-red-50 text-red-700"
                          : req.status === "completed"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </span>
                    <time className="text-xs text-slate-400">
                      {new Date(req.created_at).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600">
                  <p className="font-medium text-slate-900 mb-1">Your message:</p>
                  <p className="whitespace-pre-wrap">{req.message}</p>
                </div>

                {req.status === "accepted" && alumni?.linkedin_url && (
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-sm text-slate-600 mb-2">
                      🎉 Request accepted! You can now reach out via LinkedIn:
                    </p>
                    <a
                      href={alumni.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
                    >
                      Message on LinkedIn
                    </a>
                  </div>
                )}

                {req.status === "completed" && alumni && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-sm text-slate-600">
                      ✅ Session completed
                    </p>
                    <FeedbackButton
                      requestId={req.id}
                      alumniId={alumni.id}
                      alumniName={alumni.full_name || "Alumni"}
                      hasFeedback={feedbackRequestIds.has(req.id)}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
