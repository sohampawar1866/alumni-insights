import { createClient } from "@/utils/supabase/server";
import { AlumniCard } from "@/components/alumni-card";
import { Search, Filter, Users } from "lucide-react";

interface AlumniDirectoryPageProps {
  searchParams: Promise<{
    q?: string;
    branch?: string;
    membership?: string;
    city?: string;
  }>;
}

export default async function AlumniDirectoryPage({ searchParams }: AlumniDirectoryPageProps) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || "";
  const branchFilter = resolvedParams.branch || "";
  const membershipFilter = resolvedParams.membership || "";
  const cityFilter = resolvedParams.city || "";

  const supabase = await createClient();

  // Fetch all alumni profiles with RLS policy
  let query = supabase
    .from("profiles")
    .select("id, full_name, role_title, company, emp_type, graduation_year, branch, city, mentorship_available, membership_type, roles")
    .contains("roles", ["alumni"]);

  if (q.trim()) {
    query = query.or(`full_name.ilike.%${q}%,company.ilike.%${q}%,role_title.ilike.%${q}%`);
  }
  if (branchFilter) {
    query = query.eq("branch", branchFilter);
  }
  if (membershipFilter) {
    query = query.eq("membership_type", membershipFilter);
  }
  if (cityFilter) {
    query = query.ilike("city", `%${cityFilter}%`);
  }

  const { data: alumniList } = await query.order("full_name", { ascending: true });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8 font-sans">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold">
          <Users className="w-3.5 h-3.5 text-blue-600" />
          Official IIIT Nagpur Alumni Network
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-heading">
          Alumni Directory 🎓
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
          Search and connect with fellow IIIT Nagpur graduates across companies, branches, cities, and membership tiers.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <form method="GET" className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="grid sm:grid-cols-4 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search by name, company, or role..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <select
              name="membership"
              defaultValue={membershipFilter}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="">All Membership Tiers</option>
              <option value="core">Core Team Member</option>
              <option value="lifetime">Lifetime Member</option>
              <option value="5_year">5-Year Member</option>
              <option value="2_year">2-Year Member</option>
              <option value="none">Non-Member</option>
            </select>
          </div>

          <div>
            <select
              name="branch"
              defaultValue={branchFilter}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="">All Branches</option>
              <option value="CSE">Computer Science (CSE)</option>
              <option value="ECE">Electronics & Communication (ECE)</option>
              <option value="AI">Artificial Intelligence (AI)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{alumniList?.length || 0}</strong> graduates
          </span>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 bg-slate-900 text-white px-4 py-2 rounded-xl font-bold shadow-sm hover:bg-slate-800 transition-all"
          >
            <Filter className="w-3.5 h-3.5" />
            Apply Filters
          </button>
        </div>
      </form>

      {/* Directory Grid */}
      {alumniList && alumniList.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {alumniList.map((alumnus) => (
            <AlumniCard
              key={alumnus.id}
              id={alumnus.id}
              full_name={alumnus.full_name}
              role_title={alumnus.role_title}
              company={alumnus.company}
              emp_type={alumnus.emp_type}
              graduation_year={alumnus.graduation_year}
              branch={alumnus.branch}
              city={alumnus.city}
              mentorship_available={alumnus.mentorship_available}
              membership_type={alumnus.membership_type}
              hrefPrefix="/alumni"
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <Users className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Alumni Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or clearing selected filters to view more alumni profiles.
          </p>
        </div>
      )}
    </div>
  );
}
