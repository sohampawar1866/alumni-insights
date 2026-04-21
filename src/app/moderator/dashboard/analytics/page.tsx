import { createClient } from "@/utils/supabase/server";

export default async function AnalyticsPage() {
  const supabase = await createClient();

  // Total alumni count
  const { count: totalAlumni } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "alumni");

  // By branch
  const { data: branchData } = await supabase
    .from("profiles")
    .select("branch")
    .eq("role", "alumni")
    .not("branch", "is", null);

  const branchCounts: Record<string, number> = {};
  branchData?.forEach((r) => {
    const b = r.branch || "Unknown";
    branchCounts[b] = (branchCounts[b] || 0) + 1;
  });

  // By company (top 10)
  const { data: companyData } = await supabase
    .from("profiles")
    .select("company")
    .eq("role", "alumni")
    .not("company", "is", null);

  const companyCounts: Record<string, number> = {};
  companyData?.forEach((r) => {
    const c = r.company || "Unknown";
    companyCounts[c] = (companyCounts[c] || 0) + 1;
  });
  const topCompanies = Object.entries(companyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // By city (top 10)
  const { data: cityData } = await supabase
    .from("profiles")
    .select("city")
    .eq("role", "alumni")
    .not("city", "is", null);

  const cityCounts: Record<string, number> = {};
  cityData?.forEach((r) => {
    const c = r.city || "Unknown";
    cityCounts[c] = (cityCounts[c] || 0) + 1;
  });
  const topCities = Object.entries(cityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Active alumni (responded to at least one request in last 90 days)
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const { data: activeAlumniData } = await supabase
    .from("connection_requests")
    .select("alumni_id")
    .eq("status", "accepted")
    .gte("updated_at", ninetyDaysAgo.toISOString());

  const activeAlumniCount = new Set(
    activeAlumniData?.map((r) => r.alumni_id)
  ).size;

  // Total mentorship sessions (completed)
  const { count: completedSessions } = await supabase
    .from("connection_requests")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed");

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">
          Alumni distribution and platform activity.
        </p>
      </div>

      {/* Top-level stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Total Alumni" value={totalAlumni || 0} />
        <StatCard label="Active Alumni (90d)" value={activeAlumniCount} />
        <StatCard label="Completed Sessions" value={completedSessions || 0} />
      </div>

      {/* Breakdowns */}
      <div className="grid lg:grid-cols-3 gap-6">
        <BreakdownCard title="By Branch" data={Object.entries(branchCounts).sort((a, b) => b[1] - a[1])} />
        <BreakdownCard title="Top Companies" data={topCompanies} />
        <BreakdownCard title="Top Cities" data={topCities} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
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
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
        {title}
      </h3>
      {data.length === 0 ? (
        <p className="text-sm text-slate-400">No data yet</p>
      ) : (
        <div className="space-y-2.5">
          {data.map(([name, count]) => (
            <div key={name} className="flex items-center justify-between">
              <span className="text-sm text-slate-600 truncate mr-2">
                {name}
              </span>
              <span className="shrink-0 text-xs font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                {count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
