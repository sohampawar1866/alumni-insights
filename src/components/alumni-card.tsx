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
      className="group flex flex-col justify-between p-6 bg-background border-4 border-foreground shadow-[8px_8px_0px_var(--color-foreground)] transition-all hover:shadow-[4px_4px_0px_var(--color-foreground)] hover:translate-x-1 hover:translate-y-1"
    >
      {/* Header */}
      <div className="space-y-2 mb-6">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-black uppercase tracking-tighter text-foreground group-hover:bg-primary group-hover:text-background w-fit transition-colors line-clamp-2">
            {full_name || "ALUMNI"}
          </h3>
          {mentorship_available && (
            <span className="shrink-0 ml-3 inline-flex items-center gap-1 border-2 border-foreground bg-[#00e559] px-2 py-1 text-xs font-black uppercase text-foreground shadow-[2px_2px_0px_var(--color-foreground)]">
              <span className="inline-block w-2 h-2 bg-foreground" />
              MENTOR
            </span>
          )}
        </div>
        <p className="text-base font-bold text-muted-foreground uppercase tracking-wide line-clamp-2">
          {role_title || "—"} {company ? `// ${company}` : ""}
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-auto">
        {emp_type && (
          <span
            className={`inline-flex items-center border-2 border-foreground px-2 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_var(--color-foreground)] ${
              emp_type === "Intern"
                ? "bg-[#fdc800] text-foreground"
                : "bg-primary text-background"
            }`}
          >
            {emp_type}
          </span>
        )}
        {branch && (
          <span className="inline-flex items-center border-2 border-foreground bg-muted px-2 py-1 text-xs font-black uppercase text-foreground shadow-[2px_2px_0px_var(--color-foreground)]">
            {branch}
          </span>
        )}
        {graduation_year && (
          <span className="inline-flex items-center border-2 border-foreground bg-muted px-2 py-1 text-xs font-black uppercase text-foreground shadow-[2px_2px_0px_var(--color-foreground)]">
            &apos;{String(graduation_year).slice(-2)}
          </span>
        )}
        {city && (
          <span className="inline-flex items-center border-2 border-foreground bg-muted px-2 py-1 text-xs font-black uppercase text-foreground shadow-[2px_2px_0px_var(--color-foreground)]">
            {city}
          </span>
        )}
      </div>
    </Link>
  );
}
