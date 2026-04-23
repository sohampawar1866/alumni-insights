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
      <div className="flex items-center justify-center py-20 min-h-screen">
        <div className="h-12 w-12 border-4 border-foreground border-t-primary rounded-none animate-[spin_1s_linear_infinite] shadow-[4px_4px_0px_#000]" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-l-8 border-accent pl-4 gap-4">
        <div>
          <h1 className="font-heading text-4xl font-black uppercase tracking-tight text-foreground">Applications</h1>
          <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mt-2">
            Review students who have applied to be listed as alumni.
          </p>
        </div>
        <Button 
          onClick={exportCSV} 
          disabled={applications.length === 0}
          className="font-black uppercase tracking-wider border-2 border-foreground rounded-none shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
        >
          Export CSV for Bulk Import
        </Button>
      </div>

      {applications.length === 0 ? (
        <div className="border-4 border-foreground bg-white p-10 text-center shadow-[8px_8px_0px_#000]">
          <p className="text-sm font-black uppercase tracking-wider text-muted-foreground">No pending applications.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="border-4 border-foreground bg-white p-6 shadow-[8px_8px_0px_#000] space-y-4 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_#000] transition-all"
            >
              <div>
                <h3 className="font-black text-lg uppercase tracking-tight text-foreground bg-primary border-2 border-foreground px-2 py-1 inline-block mb-2">
                  {app.profiles.full_name}
                </h3>
                <p className="text-xs font-bold uppercase text-muted-foreground">{app.profiles.email}</p>
                <p className="text-xs font-bold uppercase text-foreground bg-muted border-2 border-foreground px-2 py-0.5 inline-block mt-2">
                  {app.profiles.branch} · {app.profiles.graduation_year}
                </p>
              </div>
              <div className="space-y-2 border-t-4 border-foreground pt-4">
                <p className="text-sm font-bold uppercase tracking-wider text-foreground">
                  <span className="opacity-50 inline-block w-20">ROLE:</span> {app.role_title}
                </p>
                <p className="text-sm font-bold uppercase tracking-wider text-foreground">
                  <span className="opacity-50 inline-block w-20">CO:</span> {app.company}
                </p>
                <p className="text-sm font-bold uppercase tracking-wider text-foreground">
                  <span className="opacity-50 inline-block w-20">TYPE:</span> {app.emp_type}
                </p>
                <p className="text-sm font-bold uppercase tracking-wider text-foreground">
                  <span className="opacity-50 inline-block w-20">LOC:</span> {app.city}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
