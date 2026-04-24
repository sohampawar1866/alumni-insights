"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

type Request = {
  id: string;
  message: string;
  status: string;
  created_at: string;
  student: {
    full_name: string | null;
    branch: string | null;
    graduation_year: number | null;
  };
};

export default function IncomingRequestsPage() {
  const supabase = createClient();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("connection_requests")
      .select(
        `
        id,
        message,
        status,
        created_at,
        student:profiles!connection_requests_student_id_fkey (
          full_name,
          branch,
          graduation_year
        )
      `
      )
      .eq("alumni_id", user.id)
      .order("created_at", { ascending: false });

    setRequests((data as unknown as Request[]) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRequests();
  }, [fetchRequests]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const { data, error } = await supabase.functions.invoke("update-request-status", {
      body: { request_id: id, status: newStatus },
    });

    if (!error && !data?.error) {
      fetchRequests();
    } else {
      alert(data?.error || error?.message || "Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="h-16 w-16 border-8 border-foreground border-t-primary rounded-full animate-spin shadow-[4px_4px_0px_var(--color-foreground)]"></div>
        <p className="text-xl font-black uppercase tracking-wider animate-pulse">LOADING TRANSMISSIONS...</p>
      </div>
    );
  }

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const pastRequests = requests.filter((r) => r.status !== "pending");

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-12">
      <div>
        <h1 className="text-5xl font-black uppercase tracking-tighter text-foreground mb-2">INCOMING OPS</h1>
        <p className="text-xl font-bold uppercase tracking-wider text-muted-foreground bg-[#fdc800] p-2 inline-block border-2 border-foreground shadow-[2px_2px_0px_var(--color-foreground)]">
          STUDENTS ASKING FOR YOUR GUIDANCE. STATUS: OVERSIGHT.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-black uppercase text-foreground inline-flex items-center gap-4">
          PENDING OPS
          <span className="bg-[#ff3366] text-background px-3 py-1 text-xl border-4 border-foreground shadow-[2px_2px_0px_var(--color-foreground)]">
            {pendingRequests.length}
          </span>
        </h2>
        {pendingRequests.length === 0 ? (
          <div className="border-4 border-foreground bg-background p-12 text-center shadow-[8px_8px_0px_var(--color-foreground)]">
            <p className="text-2xl font-black uppercase text-foreground mb-2">CLEAR QUEUE</p>
            <p className="font-bold text-muted-foreground uppercase">NO PENDING TRANSMISSIONS DETECTED.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingRequests.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                onUpdate={handleUpdateStatus}
              />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6 pt-12 border-t-8 border-foreground border-dotted">
        <h2 className="text-3xl font-black uppercase text-foreground inline-flex items-center gap-4 text-muted-foreground">
          ARCHIVED OPS
          <span className="bg-secondary text-foreground px-3 py-1 text-xl border-4 border-foreground shadow-[2px_2px_0px_var(--color-foreground)]">
            {pastRequests.length}
          </span>
        </h2>
        {pastRequests.length > 0 && (
          <div className="space-y-6 opacity-80 hover:opacity-100 transition-opacity">
            {pastRequests.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                onUpdate={handleUpdateStatus}
                readOnly
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RequestCard({
  request,
  onUpdate,
  readOnly = false,
}: {
  request: Request;
  onUpdate: (id: string, status: string) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="border-4 border-foreground bg-background shadow-[8px_8px_0px_var(--color-foreground)] overflow-hidden">
      <div className="p-6 border-b-4 border-foreground bg-[#f4f4f4] flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black uppercase text-foreground">
            {request.student?.full_name || "UNKNOWN OPERATIVE"}
          </h3>
          <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mt-1">
            {request.student?.branch || "—"} · CLASS OF {" "}
            <span className="bg-black text-white px-2 py-0.5">{request.student?.graduation_year || "—"}</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div
            className={`px-3 py-1.5 border-4 border-foreground text-sm font-black uppercase shadow-[2px_2px_0px_var(--color-foreground)] ${
              request.status === "accepted"
                ? "bg-[#00ff66] text-foreground"
                : request.status === "declined"
                ? "bg-[#ff3366] text-foreground"
                : request.status === "completed"
                ? "bg-[#00ffff] text-foreground"
                : "bg-[#fdc800] text-foreground animate-pulse"
            }`}
          >
            {request.status.toUpperCase()}
          </div>
          <time className="text-sm font-bold uppercase text-muted-foreground border-2 border-foreground px-2 py-1 bg-background">
            {new Date(request.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
            })}
          </time>
        </div>
      </div>

      <div className="p-6 bg-background">
        <p className="text-sm font-black uppercase text-foreground mb-2">INCOMING MESSAGE:</p>
        <div className="bg-secondary border-2 border-foreground p-4 shadow-[4px_4px_0px_var(--color-foreground)] mb-6">
          <p className="whitespace-pre-wrap font-medium text-foreground">{request.message}</p>
        </div>

        {!readOnly && (
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t-4 border-foreground border-dashed">
            <Button
              onClick={() => onUpdate(request.id, "accepted")}
              className="bg-[#00ff66] text-foreground text-sm font-black uppercase tracking-wider px-6 py-6 border-4 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all hover:shadow-[2px_2px_0px_var(--color-foreground)]"
            >
              APPROVE OPERATION
            </Button>
            <Button
              onClick={() => onUpdate(request.id, "declined")}
              variant="outline"
              className="bg-[#ff3366] text-background text-sm font-black uppercase tracking-wider px-6 py-6 border-4 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all hover:shadow-[2px_2px_0px_var(--color-foreground)]"
            >
              DENY OPERATION
            </Button>
          </div>
        )}

        {readOnly && request.status === "accepted" && (
          <div className="pt-4 border-t-4 border-foreground border-dashed mt-6 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <Button
                onClick={() => { window.location.href = `/alumni/dashboard/messages/${request.id}`; }}
                className="bg-primary text-background text-sm font-black uppercase tracking-wider px-6 py-3 border-4 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all hover:shadow-[2px_2px_0px_var(--color-foreground)]"
              >
                <MessageSquare className="w-5 h-5" strokeWidth={2.5} /> OPEN SECURE CHAT
              </Button>
              <Button
                onClick={() => onUpdate(request.id, "completed")}
                className="bg-[#00ffff] text-foreground text-sm font-black uppercase tracking-wider px-6 py-3 border-4 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all hover:shadow-[2px_2px_0px_var(--color-foreground)]"
              >
                MARK OPERATION COMPLETE
              </Button>
            </div>
            <p className="text-xs font-bold text-muted-foreground uppercase border-2 border-foreground bg-secondary inline-block px-2 py-1 shadow-[2px_2px_0px_var(--color-foreground)] mt-4">
              ONCE YOU HAVE HELPED THE STUDENT, MARK THIS AS COMPLETED TO UPDATE YOUR STATS.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
