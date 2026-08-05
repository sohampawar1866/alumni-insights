"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { MessageSquare, Check, X, CheckCircle2 } from "lucide-react";
import Link from "next/link";

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
      <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-3 font-sans">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading Requests...</p>
      </div>
    );
  }

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const pastRequests = requests.filter((r) => r.status !== "pending");

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      <div className="pb-6 border-b-2 border-slate-900">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-heading flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-slate-700" /> Student Mentorship Requests
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Review and respond to incoming guidance requests from IIIT Nagpur students.
        </p>
      </div>

      {/* Pending Requests */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading">
            Pending Requests
          </h2>
          <span className="bg-amber-400 text-slate-900 border-2 border-slate-900 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-[2px_2px_0px_#0f172a]">
            {pendingRequests.length}
          </span>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="border-2 border-slate-900 rounded-2xl bg-white p-8 text-center shadow-[4px_4px_0px_#0f172a]">
            <p className="text-sm font-bold text-slate-900 font-heading">No Pending Requests</p>
            <p className="text-xs text-slate-500 mt-1">You are all caught up! New student requests will appear here.</p>
          </div>
        ) : (
          pendingRequests.map((req) => (
            <div
              key={req.id}
              className="border-2 border-slate-900 rounded-2xl bg-white p-6 shadow-[5px_5px_0px_#0f172a] space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-slate-100 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-heading">
                    {req.student?.full_name || "Anonymous Student"}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    {req.student?.branch || "Student"} &bull; Class of &apos;{String(req.student?.graduation_year || "—").slice(-2)}
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
                  {req.student?.branch || "Student"} &bull; Class of &apos;{String(req.student?.graduation_year || "—").slice(-2)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full border-2 border-slate-900 text-xs font-bold shadow-[2px_2px_0px_#0f172a] ${
                    req.status === "accepted"
                      ? "bg-emerald-400 text-slate-900"
                      : req.status === "completed"
                      ? "bg-cyan-300 text-slate-900"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {req.status.toUpperCase()}
                </span>
                {(req.status === "accepted" || req.status === "completed") && (
                  <Link href={`/alumni/dashboard/messages/${req.id}`}>
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                      <MessageSquare className="w-3.5 h-3.5" /> Open Chat
                    </Button>
                  </Link>
                )}
                {req.status === "accepted" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus(req.id, "completed")}
                    className="gap-1 text-xs bg-emerald-50 text-emerald-800 border-emerald-900"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Complete Session
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
