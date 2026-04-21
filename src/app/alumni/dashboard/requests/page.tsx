"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

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
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const pastRequests = requests.filter((r) => r.status !== "pending");

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Incoming Requests</h1>
        <p className="text-sm text-slate-500 mt-1">
          Students asking for your guidance.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Pending ({pendingRequests.length})
        </h2>
        {pendingRequests.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-slate-500">No pending requests right now.</p>
          </div>
        ) : (
          <div className="space-y-4">
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

      <div className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800">
          Past Requests ({pastRequests.length})
        </h2>
        {pastRequests.length > 0 && (
          <div className="space-y-4">
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
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-900">
            {request.student?.full_name || "Unknown Student"}
          </h3>
          <p className="text-sm text-slate-600 mt-0.5">
            {request.student?.branch || "—"} · Class of{" "}
            {request.student?.graduation_year || "—"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              request.status === "accepted"
                ? "bg-emerald-50 text-emerald-700"
                : request.status === "declined"
                ? "bg-red-50 text-red-700"
                : request.status === "completed"
                ? "bg-blue-50 text-blue-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
          <time className="text-xs text-slate-400">
            {new Date(request.created_at).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </time>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600">
        <p className="whitespace-pre-wrap">{request.message}</p>
      </div>

      {!readOnly && (
        <div className="flex items-center gap-3 pt-2">
          <Button
            onClick={() => onUpdate(request.id, "accepted")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Accept Request
          </Button>
          <Button
            onClick={() => onUpdate(request.id, "declined")}
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Decline
          </Button>
        </div>
      )}

      {readOnly && request.status === "accepted" && (
        <div className="pt-2">
          <Button
            onClick={() => onUpdate(request.id, "completed")}
            variant="outline"
            size="sm"
          >
            Mark as Completed
          </Button>
          <p className="text-xs text-slate-400 mt-2">
            Once you have helped the student, mark this as completed to update
            your stats.
          </p>
        </div>
      )}
    </div>
  );
}
