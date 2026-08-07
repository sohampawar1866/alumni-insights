import { createClient } from "@/utils/supabase/server";
import { BarChart3, Users, Activity, CheckCircle2 } from "lucide-react";

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  // Execute all 6 analytics queries concurrently via Promise.all for maximum speed
  const [
    { count: totalAlumni },
    { data: branchData },
    { data: companyData },
    { data: cityData },
    { data: activeAlumniData },
    { count: completedSessions },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .contains("roles", ["alumni"]),
    supabase
      .from("profiles")
      .select("branch")
      .contains("roles", ["alumni"])
      .not("branch", "is", null),
    supabase
      .from("profiles")
      .select("company")
      .contains("roles", ["alumni"])
      .not("company", "is", null),
    supabase
      .from("profiles")
      .select("city")
      .contains("roles", ["alumni"])
      .not("city", "is", null),
    supabase
      .from("connection_requests")
      .select("alumni_id")
      .eq("status", "accepted")
      .gte("updated_at", ninetyDaysAgo.toISOString()),
    supabase
      .from("connection_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed"),
  ]);

  const branchCounts: Record<string, number> = {};
  branchData?.forEach((r) => {
    const b = r.branch || "Unknown";
    branchCounts[b] = (branchCounts[b] || 0) + 1;
  });

  const companyCounts: Record<string, number> = {};
  companyData?.forEach((r) => {
    const c = r.company || "Unknown";
    companyCounts[c] = (companyCounts[c] || 0) + 1;
  });
  const topCompanies = Object.entries(companyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const cityCounts: Record<string, number> = {};
  cityData?.forEach((r) => {
    const c = r.city || "Unknown";
    cityCounts[c] = (cityCounts[c] || 0) + 1;
  });
  const topCities = Object.entries(cityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const activeAlumniCount = new Set(
    activeAlumniData?.map((r) => r.alumni_id)
  ).size;

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      <div className="pb-6 border-b-2 border-slate-900">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-slate-700" /> Platform Analytics
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Alumni distribution metrics and student mentorship engagement.
        </p>
      </div>

      {/* Top-level stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Total Alumni Registered" value={totalAlumni || 0} icon={Users} />
        <StatCard label="Active Mentors (90 Days)" value={activeAlumniCount} icon={Activity} />
        <StatCard label="Completed Sessions" value={completedSessions || 0} icon={CheckCircle2} />
      </div>

      {/* Breakdowns */}
      <div className="grid lg:grid-cols-3 gap-4">
        <BreakdownCard title="By Branch" data={Object.entries(branchCounts).sort((a, b) => b[1] - a[1])} />
        <BreakdownCard title="Top Companies" data={topCompanies} />
        <BreakdownCard title="Top Cities" data={topCities} />
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: any }) {
  return (
    <div className="border-2 border-slate-900 rounded-2xl bg-white p-5 shadow-[4px_4px_0px_#0f172a] space-y-2">
      <div className="flex items-center justify-between text-slate-500">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-600">{label}</span>
        <Icon className="w-4 h-4 text-slate-700" />
      </div>
      <p className="text-3xl font-bold text-slate-900 font-heading">{value}</p>
    </div>
  );
}

function BreakdownCard({
  title,
  data,
}: {
  title: string;
  data: [string, number][];
}) {
  return (
    <div className="border-2 border-slate-900 rounded-2xl bg-white p-5 shadow-[4px_4px_0px_#0f172a] space-y-4">
      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading border-b-2 border-slate-100 pb-2">
        {title}
      </h3>
      {data.length === 0 ? (
        <p className="text-xs font-medium text-slate-400">No data available yet</p>
      ) : (
        <div className="space-y-2">
          {data.map(([name, count]) => (
            <div key={name} className="flex items-center justify-between text-xs border-b border-slate-100 pb-1.5 last:border-0 last:pb-0">
              <span className="font-semibold text-slate-800 truncate mr-2">
                {name}
              </span>
              <span className="shrink-0 font-mono font-bold text-slate-900 bg-slate-100 border border-slate-300 rounded px-2 py-0.5">
                {count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
