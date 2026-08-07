"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Check, X, MessageSquare, Clock } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type RequestItem = {
  id: string;
  message: string;
  status: "pending" | "accepted" | "declined" | "completed";
  created_at: string;
  student: {
    id: string;
    full_name: string | null;
    branch: string | null;
    graduation_year: number | null;
  } | null;
};

export default function AlumniRequestsPage() {
  const supabase = createClient();
  const [activeRequests, setActiveRequests] = useState<RequestItem[]>([]);
  const [pastRequests, setPastRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Parallelize Active and Past Requests fetching concurrently via Promise.all
    const [{ data: pendingData }, { data: historyData }] = await Promise.all([
      supabase
        .from("connection_requests")
        .select(`
          id,
          message,
          status,
          created_at,
          student:profiles!connection_requests_student_id_fkey (
            id,
            full_name,
            branch,
            graduation_year
          )
        `)
        .eq("alumni_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false }),
      supabase
        .from("connection_requests")
        .select(`
          id,
          message,
          status,
          created_at,
          student:profiles!connection_requests_student_id_fkey (
            id,
            full_name,
            branch,
            graduation_year
          )
        `)
        .eq("alumni_id", user.id)
        .in("status", ["accepted", "declined", "completed"])
        .order("created_at", { ascending: false }),
    ]);

    if (pendingData) {
      setActiveRequests(pendingData as unknown as RequestItem[]);
    }
    if (historyData) {
      setPastRequests(historyData as unknown as RequestItem[]);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void (async () => { await loadRequests(); })();
  }, [loadRequests]);

  const handleUpdateStatus = async (
    requestId: string,
    status: "accepted" | "declined"
  ) => {
    const { error } = await supabase
      .from("connection_requests")
      .update({ status })
      .eq("id", requestId);

    if (error) {
      toast.error("Failed to update status", {
        description: error.message,
      });
    } else {
      toast.success(status === "accepted" ? "Request Accepted!" : "Request Declined", {
        description: status === "accepted" ? "A 1:1 chat thread has been created." : "The student has been notified.",
      });
      loadRequests();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 font-sans">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="pb-6 border-b-2 border-slate-900">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Clock className="w-6 h-6 text-slate-700" /> Mentorship Requests
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Review inbound guidance requests from IIIT Nagpur students and manage your active chat sessions.
        </p>
      </div>

      {/* Active Pending Requests */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-heading">Pending Outreach</h2>
        {activeRequests.length === 0 ? (
          <div className="text-xs font-semibold text-slate-500 bg-white border-2 border-slate-900 rounded-2xl p-8 shadow-[4px_4px_0px_#0f172a] text-center">
            No pending requests. You will be notified when students reach out!
          </div>
        ) : (
          activeRequests.map((req) => (
            <div
              key={req.id}
              className="border-2 border-slate-900 rounded-2xl bg-white p-6 shadow-[5px_5px_0px_#0f172a] space-y-4 hover:-translate-y-0.5 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-slate-100 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-heading">
                    {req.student?.full_name || "Anonymous Student"}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    {req.student?.branch || "Student"} &bull; Class of &apos;{String(req.student?.graduation_year || "N/A").slice(-2)}
                  </p>
                </div>
                <time className="text-xs font-bold text-slate-500">
                  {new Date(req.created_at).toLocaleDateString("en-US", { month: "short", day: "2-digit" })}
                </time>
              </div>

              <div className="bg-slate-50 border-2 border-slate-900 rounded-xl p-4 shadow-[2px_2px_0px_#0f172a]">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Student Note:</p>
                <p className="text-sm font-medium text-slate-800 leading-relaxed whitespace-pre-wrap">{req.message}</p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => handleUpdateStatus(req.id, "accepted")}
                  className="bg-emerald-500 text-white hover:bg-emerald-600 gap-1.5 text-xs h-10 px-5"
                >
                  <Check className="w-4 h-4" /> Accept Request
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleUpdateStatus(req.id, "declined")}
                  className="text-red-700 border-red-900 bg-red-50 hover:bg-red-100 gap-1.5 text-xs h-10 px-5"
                >
                  <X className="w-4 h-4" /> Decline
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Past Requests */}
      <div className="space-y-4 pt-6 border-t-2 border-slate-900">
        <h2 className="text-lg font-bold text-slate-900 font-heading">Past Sessions & History</h2>
        {pastRequests.length === 0 ? (
          <div className="text-xs font-semibold text-slate-500 bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[3px_3px_0px_#0f172a] text-center">
            No history yet.
          </div>
        ) : (
          pastRequests.map((req) => (
            <div
              key={req.id}
              className="border-2 border-slate-900 rounded-2xl bg-white p-5 shadow-[4px_4px_0px_#0f172a] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <p className="text-base font-bold text-slate-900 font-heading">
                  {req.student?.full_name || "Student"}
                </p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  {req.student?.branch || "Student"} &bull; Class of &apos;{String(req.student?.graduation_year || "N/A").slice(-2)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full border-2 border-slate-900 text-xs font-bold shadow-[2px_2px_0px_#0f172a] ${
                    req.status === "accepted"
                      ? "bg-emerald-400 text-slate-900"
                      : req.status === "completed"
                      ? "bg-cyan-300 text-slate-900"
                      : "bg-slate-200 text-slate-800"
                  }`}
                >
                  {req.status.toUpperCase()}
                </span>
                {req.status === "accepted" && (
                  <Link href={`/alumni/dashboard/messages/${req.id}`}>
                    <Button size="sm" className="gap-1.5 text-xs bg-slate-900 text-white shadow-[2px_2px_0px_#0f172a]">
                      <MessageSquare className="w-3.5 h-3.5" /> Open Chat
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
