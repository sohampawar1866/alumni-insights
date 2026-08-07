import { memo } from "react";
import Link from "next/link";
import { Building2, MapPin, GraduationCap, CheckCircle2 } from "lucide-react";
import { MembershipBadge, MembershipType } from "./membership-badge";

type AlumniCardProps = {
  id: string;
  full_name: string | null;
  role_title: string | null;
  company: string | null;
  emp_type: "Intern" | "Full-time" | null;
  graduation_year: number | null;
  branch: string | null;
  city: string | null;
  mentorship_available?: boolean | null;
  membership_type?: MembershipType | null;
  hrefPrefix?: string;
};

export const AlumniCard = memo(function AlumniCard({
  id,
  full_name,
  role_title,
  company,
  emp_type,
  graduation_year,
  branch,
  city,
  mentorship_available,
  membership_type,
  hrefPrefix = "/alumni",
}: AlumniCardProps) {
  return (
    <Link
      href={`${hrefPrefix}/${id}`}
      className="group flex flex-col justify-between p-6 bg-white border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_#0f172a] hover:shadow-[7px_7px_0px_#0f172a] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-200"
    >
      {/* Header */}
      <div className="space-y-3 mb-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 font-heading">
              {full_name || "Alumnus"}
            </h3>
            {membership_type && membership_type !== "none" && (
              <div className="pt-0.5">
                <MembershipBadge type={membership_type} size="sm" />
              </div>
            )}
          </div>
          {mentorship_available && (
            <span className="shrink-0 inline-flex items-center gap-1 bg-emerald-400 text-slate-900 border-2 border-slate-900 px-2 py-0.5 rounded-full text-[11px] font-bold shadow-[2px_2px_0px_#0f172a]">
              <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} />
              Mentor
            </span>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-sm font-bold text-slate-800 line-clamp-1">
            {role_title || "Alumni Member"}
          </p>
          {company && (
            <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" strokeWidth={2.5} />
              <span className="line-clamp-1">{company}</span>
            </p>
          )}
        </div>
      </div>

      {/* Meta Tags */}
      <div className="flex flex-wrap items-center gap-2 pt-4 border-t-2 border-slate-900/10 mt-auto text-xs">
        {emp_type && (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-lg border-2 border-slate-900 font-bold text-xs shadow-[2px_2px_0px_#0f172a] ${
              emp_type === "Intern"
                ? "bg-amber-400 text-slate-900"
                : "bg-slate-900 text-white"
            }`}
          >
            {emp_type}
          </span>
        )}
        {branch && (
          <span className="inline-flex items-center bg-slate-100 text-slate-900 border-2 border-slate-900 px-2.5 py-1 rounded-lg font-bold text-xs shadow-[2px_2px_0px_#0f172a]">
            {branch}
          </span>
        )}
        {graduation_year && (
          <span className="inline-flex items-center bg-slate-100 text-slate-900 border-2 border-slate-900 px-2.5 py-1 rounded-lg font-bold text-xs shadow-[2px_2px_0px_#0f172a]">
            <GraduationCap className="w-3.5 h-3.5 mr-1" strokeWidth={2.5} />
            &apos;{String(graduation_year).slice(-2)}
          </span>
        )}
        {city && (
          <span className="inline-flex items-center bg-slate-100 text-slate-900 border-2 border-slate-900 px-2.5 py-1 rounded-lg font-bold text-xs shadow-[2px_2px_0px_#0f172a] ml-auto">
            <MapPin className="w-3.5 h-3.5 mr-1" strokeWidth={2.5} />
            {city}
          </span>
        )}
      </div>
    </Link>
  );
});
