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
      <div className="border-l-8 border-[var(--color-primary)] pl-4">
        <h1 className="font-heading text-4xl font-black uppercase tracking-tight text-foreground">Analytics</h1>
        <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mt-2">
          Alumni distribution and platform activity.
        </p>
      </div>

      {/* Top-level stats */}
      <div className="grid sm:grid-cols-3 gap-6">
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
    <div className="border-4 border-foreground bg-white p-6 shadow-[8px_8px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_#000] transition-all">
      <p className="text-sm font-black uppercase tracking-wider text-foreground">{label}</p>
      <p className="text-5xl font-black text-foreground mt-2">{value}</p>
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
    <div className="border-4 border-foreground bg-white p-6 shadow-[8px_8px_0px_#000]">
      <h3 className="text-lg font-black text-foreground bg-secondary border-2 border-foreground px-3 py-1 inline-block uppercase tracking-tight mb-6">
        {title}
      </h3>
      {data.length === 0 ? (
        <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">No data yet</p>
      ) : (
        <div className="space-y-3">
          {data.map(([name, count]) => (
            <div key={name} className="flex items-center justify-between border-b-2 border-foreground pb-2 last:border-0 last:pb-0">
              <span className="text-sm font-bold uppercase tracking-wider text-foreground truncate mr-2">
                {name}
              </span>
              <span className="shrink-0 text-xs font-black text-foreground bg-primary border-2 border-foreground px-2 py-0.5 shadow-[2px_2px_0px_#000]">
                {count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
