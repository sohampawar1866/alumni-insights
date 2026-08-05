import { createClient } from "@/utils/supabase/server";
import { ShieldCheck } from "lucide-react";

export default async function AuditLogPage() {
  const supabase = await createClient();

  const { data: logs } = await supabase
    .from("audit_logs")
    .select(
      `
      id,
      action,
      created_at,
      moderator:profiles!audit_logs_moderator_id_fkey ( full_name )
    `
    )
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      <div className="pb-6 border-b-2 border-slate-900">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-slate-700" /> Moderator Audit Log
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Read-only chronological audit log of all placement moderator operations.
        </p>
      </div>

      <div className="border-2 border-slate-900 rounded-2xl bg-white shadow-[5px_5px_0px_#0f172a] overflow-hidden">
        {!logs || logs.length === 0 ? (
          <div className="p-8 text-center text-xs font-semibold text-slate-500">
            No audit log entries recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {logs.map((log) => {
              const moderator = log.moderator as unknown as {
                full_name: string | null;
              } | null;
              return (
                <div
                  key={log.id}
                  className="flex items-start gap-3.5 px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="mt-1.5 shrink-0">
                    <div className="h-2.5 w-2.5 bg-slate-900 rounded-full" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900">{log.action}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5">
                        {moderator?.full_name || "Unknown Moderator"}
                      </span>
                      <time className="text-[11px] text-slate-400">
                        {new Date(log.created_at!).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </time>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
