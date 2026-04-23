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
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <div className="mb-8">
        <Link 
          href="/dashboard" 
          className="inline-block text-sm font-black uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors group mb-6"
        >
          <span className="inline-block transition-transform group-hover:-translate-x-1">←</span> BACK TO MISSION CONTROL
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter text-foreground mb-2">MY ACTIVE COMMS</h1>
            <p className="text-xl font-bold uppercase tracking-wider text-muted-foreground">
              TRACK YOUR CONNECTION REQUESTS AND MENTORSHIP STATUS.
            </p>
          </div>
          <Link
            href="/search"
            className="flex-shrink-0 bg-[#fdc800] text-foreground text-sm font-black uppercase tracking-wider px-6 py-3 border-4 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all hover:shadow-[2px_2px_0px_var(--color-foreground)] inline-flex items-center gap-2"
          >
            DISCOVER TARGETS <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {!requests || requests.length === 0 ? (
          <div className="border-4 border-foreground bg-background p-12 text-center shadow-[8px_8px_0px_var(--color-foreground)]">
            <p className="text-2xl font-black uppercase text-foreground mb-2">NO ACTIVE COMMS</p>
            <p className="font-bold text-muted-foreground uppercase">YOU HAVEN&apos;T SENT ANY REQUESTS YET. GET TO IT.</p>
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
                className="border-4 border-foreground bg-background shadow-[8px_8px_0px_var(--color-foreground)] overflow-hidden"
              >
                <div className="p-6 border-b-4 border-foreground bg-[#f4f4f4] flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-black uppercase text-foreground">
                      {alumni?.full_name || "UNKNOWN ALUMNI"}
                    </h3>
                    <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mt-1">
                      {alumni?.role_title || "—"}{" "}
                      {alumni?.company ? `AT ${alumni.company}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div
                      className={`px-3 py-1.5 border-4 border-foreground text-sm font-black uppercase shadow-[2px_2px_0px_var(--color-foreground)] ${
                        req.status === "accepted"
                          ? "bg-[#00ff66] text-foreground"
                          : req.status === "declined"
                          ? "bg-[#ff3366] text-foreground"
                          : req.status === "completed"
                          ? "bg-[#00ffff] text-foreground"
                          : "bg-[#fdc800] text-foreground animate-pulse"
                      }`}
                    >
                      {req.status}
                    </div>
                    <time className="text-sm font-bold uppercase text-muted-foreground border-2 border-foreground px-2 py-1 bg-background">
                      {new Date(req.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                      })}
                    </time>
                  </div>
                </div>

                <div className="p-6 bg-background">
                  <div className="mb-6">
                    <p className="text-sm font-black uppercase text-foreground mb-2">YOUR TRANSMISSION:</p>
                    <div className="bg-secondary border-2 border-foreground p-4 shadow-[4px_4px_0px_var(--color-foreground)]">
                      <p className="whitespace-pre-wrap font-medium text-foreground">{req.message}</p>
                    </div>
                  </div>

                  {req.status === "accepted" && alumni && (
                    <div className="pt-6 border-t-4 border-foreground border-dashed flex flex-wrap items-center gap-4">
                      <Link
                        href={`/dashboard/messages/${req.id}`}
                        className="bg-primary text-background text-sm font-black uppercase tracking-wider px-6 py-3 border-4 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all hover:shadow-[2px_2px_0px_var(--color-foreground)] inline-flex items-center gap-2"
                      >
                        <span className="text-xl">💬</span> ENTER SECURE CHAT
                      </Link>
                      {alumni.linkedin_url && (
                        <a
                          href={alumni.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-background text-foreground text-sm font-black uppercase tracking-wider px-6 py-3 border-4 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all hover:shadow-[2px_2px_0px_var(--color-foreground)] hover:bg-[#0077b5] hover:text-white"
                        >
                          LINKEDIN TARGET
                        </a>
                      )}
                    </div>
                  )}

                  {req.status === "completed" && alumni && (
                    <div className="pt-6 border-t-4 border-foreground border-dashed flex flex-wrap items-center justify-between gap-4">
                      <div className="bg-[#00ff66] border-4 border-foreground px-4 py-2 shadow-[2px_2px_0px_var(--color-foreground)]">
                         <p className="text-sm font-black uppercase text-foreground tracking-wider">
                           ✅ MISSION ACCOMPLISHED
                         </p>
                      </div>
                      <FeedbackButton
                        requestId={req.id}
                        alumniId={alumni.id}
                        alumniName={alumni.full_name || "ALUMNI"}
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
