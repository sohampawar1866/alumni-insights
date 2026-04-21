import { createClient } from "@/utils/supabase/server";

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
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Audit Log</h1>
        <p className="text-sm text-slate-500 mt-1">
          Chronological record of all moderator actions. Read-only.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {!logs || logs.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400">
            No actions recorded yet.
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
                  className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors"
                >
                  {/* Timeline dot */}
                  <div className="mt-1.5 shrink-0">
                    <div className="h-2.5 w-2.5 rounded-full bg-blue-400 ring-4 ring-blue-50" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">{log.action}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium text-slate-500">
                        {moderator?.full_name || "Unknown"}
                      </span>
                      <span className="text-xs text-slate-300">·</span>
                      <time className="text-xs text-slate-400">
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
