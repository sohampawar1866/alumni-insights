"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

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
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Alumni Applications</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review students who have applied to be listed as alumni.
          </p>
        </div>
        <Button onClick={exportCSV} disabled={applications.length === 0}>
          Export CSV for Bulk Import
        </Button>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-slate-500">No pending applications.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3"
            >
              <div>
                <h3 className="font-semibold text-slate-900">
                  {app.profiles.full_name}
                </h3>
                <p className="text-xs text-slate-500">{app.profiles.email}</p>
                <p className="text-xs text-slate-500">
                  {app.profiles.branch} · {app.profiles.graduation_year}
                </p>
              </div>
              <div className="space-y-1 border-t border-slate-100 pt-3">
                <p className="text-sm text-slate-700">
                  <span className="font-medium text-slate-900">Role:</span> {app.role_title}
                </p>
                <p className="text-sm text-slate-700">
                  <span className="font-medium text-slate-900">Company:</span> {app.company}
                </p>
                <p className="text-sm text-slate-700">
                  <span className="font-medium text-slate-900">Type:</span> {app.emp_type}
                </p>
                <p className="text-sm text-slate-700">
                  <span className="font-medium text-slate-900">Location:</span> {app.city}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
