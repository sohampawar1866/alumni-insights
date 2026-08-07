import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { FeedbackButton } from "@/components/feedback-button";
import { ArrowLeft, ArrowRight, MessageSquare, CheckCircle2 } from "lucide-react";

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

  const { data: feedbackData } = await supabase
    .from("session_feedback")
    .select("request_id")
    .eq("student_id", user!.id);

  const feedbackRequestIds = new Set(feedbackData?.map((f) => f.request_id) || []);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 font-sans">
      <div>
        <Link 
          href="/dashboard" 
          className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors mb-4 gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-2 border-slate-900">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-heading">
              My Connection Requests
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Track your outgoing mentorship requests and active chat sessions.
            </p>
          </div>
          <Link
            href="/search"
            className="shrink-0 bg-amber-400 text-slate-900 text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0f172a] transition-all inline-flex items-center gap-2"
          >
            Find Alumni <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {!requests || requests.length === 0 ? (
          <div className="border-2 border-slate-900 rounded-2xl bg-white p-12 text-center shadow-[5px_5px_0px_#0f172a] space-y-2">
            <p className="text-lg font-bold text-slate-900 font-heading">No Connection Requests Sent</p>
            <p className="text-xs text-slate-600">Browse the alumni directory and send structured mentorship asks to get started.</p>
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
                className="border-2 border-slate-900 rounded-2xl bg-white shadow-[5px_5px_0px_#0f172a] overflow-hidden transition-all"
              >
                <div className="p-6 border-b-2 border-slate-900 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-heading">
                      {alumni?.full_name || "Alumnus Member"}
                    </h3>
                    <p className="text-xs font-semibold text-slate-600 mt-1">
                      {alumni?.role_title || "Graduate"}{" "}
                      {alumni?.company ? `@ ${alumni.company}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full border-2 border-slate-900 text-xs font-bold shadow-[2px_2px_0px_#0f172a] ${
                        req.status === "accepted"
                          ? "bg-emerald-400 text-slate-900"
                          : req.status === "declined"
                          ? "bg-red-400 text-slate-900"
                          : req.status === "completed"
                          ? "bg-cyan-300 text-slate-900"
                          : "bg-amber-400 text-slate-900"
                      }`}
                    >
                      {req.status === "pending" ? "Pending Approval" : req.status.toUpperCase()}
                    </span>
                    {req.status === "declined" && (
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
                        Try a different mentor
                      </span>
                    )}
                    <time className="text-xs font-bold text-slate-700 border-2 border-slate-900 px-2.5 py-1 rounded-lg bg-white shadow-[2px_2px_0px_#0f172a]">
                      {new Date(req.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                      })}
                    </time>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Your Note to Alumnus:</p>
                    <div className="bg-amber-50/50 border-2 border-slate-900 rounded-xl p-4 shadow-[3px_3px_0px_#0f172a]">
                      <p className="text-sm font-medium text-slate-800 leading-relaxed whitespace-pre-wrap">{req.message}</p>
                    </div>
                    {req.status === "declined" && (
                      <p className="text-xs text-slate-500 mt-2 font-medium">
                        This mentor was unable to take your request.{" "}
                        <Link href="/search" className="font-bold text-slate-700 underline hover:text-slate-900">
                          Browse available mentors &rarr;
                        </Link>
                      </p>
                    )}
                  </div>

                  {req.status === "accepted" && alumni && (
                    <div className="pt-4 border-t-2 border-slate-900/10 flex flex-wrap items-center gap-3">
                      <Link
                        href={`/dashboard/messages/${req.id}`}
                        className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0f172a] transition-all inline-flex items-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4 text-emerald-400" strokeWidth={2.5} /> Open 1:1 Mentorship Chat
                      </Link>
                      {alumni.linkedin_url && (
                        <a
                          href={alumni.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white text-slate-900 text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0f172a] transition-all"
                        >
                          LinkedIn Profile
                        </a>
                      )}
                    </div>
                  )}

                  {req.status === "completed" && alumni && (
                    <div className="pt-4 border-t-2 border-slate-900/10 flex flex-wrap items-center justify-between gap-4">
                      <div className="bg-emerald-100 border-2 border-slate-900 px-3.5 py-1.5 rounded-lg shadow-[2px_2px_0px_#0f172a]">
                         <p className="text-xs font-bold text-emerald-900 tracking-wider flex items-center gap-1.5">
                           <CheckCircle2 className="w-4 h-4 text-emerald-700" strokeWidth={2.5} /> Mentorship Session Completed
                         </p>
                      </div>
                      <FeedbackButton
                        requestId={req.id}
                        alumniId={alumni.id}
                        alumniName={alumni.full_name || "Alumnus"}
                        hasFeedback={feedbackRequestIds.has(req.id)}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
