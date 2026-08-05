import Link from "next/link";
import { Building2, MapPin, GraduationCap, CheckCircle2 } from "lucide-react";

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
      className="group flex flex-col justify-between p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
    >
      {/* Header */}
      <div className="space-y-3 mb-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {full_name || "Alumnus"}
          </h3>
          {mentorship_available && (
            <span className="shrink-0 inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2.5 py-0.5 rounded-full text-xs font-semibold">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Available
            </span>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-800 line-clamp-1">
            {role_title || "Alumni Member"}
          </p>
          {company && (
            <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="line-clamp-1">{company}</span>
            </p>
          )}
        </div>
      </div>

      {/* Meta Tags */}
      <div className="flex flex-wrap items-center gap-1.5 pt-4 border-t border-slate-100 mt-auto text-xs">
        {emp_type && (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md font-semibold text-[11px] ${
              emp_type === "Intern"
                ? "bg-amber-50 text-amber-800 border border-amber-200"
                : "bg-slate-900 text-white"
            }`}
          >
            {emp_type}
          </span>
        )}
        {branch && (
          <span className="inline-flex items-center bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium text-[11px]">
            {branch}
          </span>
        )}
        {graduation_year && (
          <span className="inline-flex items-center bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium text-[11px]">
            <GraduationCap className="w-3 h-3 mr-1 text-slate-400" />
            Class of &apos;{String(graduation_year).slice(-2)}
          </span>
        )}
        {city && (
          <span className="inline-flex items-center bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium text-[11px] ml-auto">
            <MapPin className="w-3 h-3 mr-0.5 text-slate-400" />
            {city}
          </span>
        )}
      </div>
    </Link>
  );
}
