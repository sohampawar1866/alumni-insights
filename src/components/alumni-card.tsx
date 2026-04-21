import Link from "next/link";

type AlumniCardProps = {
  id: string;
  full_name: string | null;
  role_title: string | null;
  company: string | null;
  emp_type: "Intern" | "Full-time" | null;
  graduation_year: number | null;
  branch: string | null;
  city: string | null;
  mentorship_available: boolean | null;
};

export function AlumniCard({
  id,
  full_name,
  role_title,
  company,
  emp_type,
  graduation_year,
  branch,
  city,
  mentorship_available,
}: AlumniCardProps) {
  return (
    <Link
      href={`/alumni/${id}`}
      className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5"
    >
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
            {full_name || "Alumni"}
          </h3>
          {mentorship_available && (
            <span className="shrink-0 ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Open
            </span>
          )}
        </div>
        <p className="text-sm text-slate-600 truncate">
          {role_title || "—"} {company ? `at ${company}` : ""}
        </p>
      </div>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {emp_type && (
          <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
              emp_type === "Intern"
                ? "bg-amber-50 text-amber-700"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            {emp_type}
          </span>
        )}
        {branch && (
          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
            {branch}
          </span>
        )}
        {graduation_year && (
          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
            {graduation_year}
          </span>
        )}
        {city && (
          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
            📍 {city}
          </span>
        )}
      </div>
    </Link>
  );
}
