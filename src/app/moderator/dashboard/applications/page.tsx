"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

type Application = {
  id: string;
  role_title: string;
  company: string;
  emp_type: string;
  city: string;
  linkedin_url: string;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
    branch: string;
    graduation_year: number;
  };
};

export default function ApplicationsPage() {
  const supabase = createClient();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("alumni_applications")
        .select(`
          id,
          role_title,
          company,
          emp_type,
          city,
          linkedin_url,
          created_at,
          profiles (
            full_name,
            email,
            branch,
            graduation_year
          )
        `)
        .order("created_at", { ascending: false });

      if (data) {
        setApplications(data as unknown as Application[]);
      }
      setLoading(false);
    }
    load();
  }, [supabase]);

  const exportCSV = () => {
    const header = "name,email,branch,graduation_year,role_title,company,emp_type,city,linkedin_url";
    const rows = applications.map((app) => {
      const p = app.profiles;
      return `"${p.full_name}","${p.email}","${p.branch || ""}","${p.graduation_year || ""}","${app.role_title}","${app.company}","${app.emp_type}","${app.city}","${app.linkedin_url || ""}"`;
    });

    const csvContent = [header, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `alumni_applications_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 font-sans">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-slate-900 gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-slate-700" /> Student Alumni Applications
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Review 4th-year students who have applied for placement cell alumni directory listing.
          </p>
        </div>
        <Button 
          onClick={exportCSV} 
          disabled={applications.length === 0}
          className="gap-2 shrink-0"
        >
          <Download className="w-4 h-4" /> Export CSV for Bulk Import
        </Button>
      </div>

      {applications.length === 0 ? (
        <div className="border-2 border-slate-900 rounded-2xl bg-white p-10 text-center shadow-[4px_4px_0px_#0f172a]">
          <p className="text-xs font-semibold text-slate-500">No pending student applications.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="border-2 border-slate-900 rounded-2xl bg-white p-5 shadow-[4px_4px_0px_#0f172a] space-y-3 hover:-translate-y-0.5 transition-all"
            >
              <div>
                <h3 className="font-bold text-base text-slate-900 font-heading">
                  {app.profiles.full_name}
                </h3>
                <p className="text-xs text-slate-500">{app.profiles.email}</p>
                <span className="inline-block bg-slate-100 border-2 border-slate-900 rounded-md px-2 py-0.5 text-xs font-bold text-slate-800 mt-2">
                  {app.profiles.branch} &bull; Class of &apos;{String(app.profiles.graduation_year).slice(-2)}
                </span>
              </div>
              <div className="space-y-1 pt-3 border-t-2 border-slate-100 text-xs font-medium text-slate-700">
                <p><span className="text-slate-400 inline-block w-16 font-bold uppercase">Role:</span> {app.role_title}</p>
                <p><span className="text-slate-400 inline-block w-16 font-bold uppercase">Company:</span> {app.company}</p>
                <p><span className="text-slate-400 inline-block w-16 font-bold uppercase">Type:</span> {app.emp_type}</p>
                <p><span className="text-slate-400 inline-block w-16 font-bold uppercase">City:</span> {app.city}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
