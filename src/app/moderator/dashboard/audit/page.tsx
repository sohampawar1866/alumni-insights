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
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div className="border-l-8 border-destructive pl-4">
        <h1 className="font-heading text-4xl font-black uppercase tracking-tight text-foreground">Audit Log</h1>
        <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mt-2">
          Chronological record of all moderator actions. Read-only.
        </p>
      </div>

      <div className="border-4 border-foreground bg-white shadow-[8px_8px_0px_#000] overflow-hidden">
        {!logs || logs.length === 0 ? (
          <div className="p-10 text-center text-sm font-black uppercase tracking-wider text-muted-foreground border-4 border-foreground m-4 shadow-[4px_4px_0px_#000]">
            No actions recorded yet.
          </div>
        ) : (
          <div className="divide-y-4 divide-foreground">
            {logs.map((log) => {
              const moderator = log.moderator as unknown as {
                full_name: string | null;
              } | null;
              return (
                <div
                  key={log.id}
                  className="flex items-start gap-4 px-6 py-5 hover:bg-muted transition-colors relative group"
                >
                  {/* Timeline dot */}
                  <div className="mt-1 shrink-0 relative z-10">
                    <div className="h-4 w-4 bg-primary border-2 border-foreground shadow-[2px_2px_0px_#000] group-hover:scale-110 transition-transform" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black uppercase tracking-tight text-foreground">{log.action}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-foreground bg-white border-2 border-foreground px-2 py-0.5 shadow-[2px_2px_0px_#000]">
                        {moderator?.full_name || "Unknown"}
                      </span>
                      <time className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
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
