"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download, FileText, CheckCircle2, UserCheck, Trash2 } from "lucide-react";

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
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [createdCredentials, setCreatedCredentials] = useState<{
    name: string;
    email: string;
    password: string;
  } | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    setLoading(true);
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

  const handleApprove = async (app: Application) => {
    setProcessingId(app.id);
    const p = app.profiles;
    const tempPassword = generatePassword();

    // Call Supabase function or direct creation
    const { data, error } = await supabase.functions.invoke("create-alumni", {
      body: {
        full_name: p.full_name,
        email: p.email,
        branch: p.branch || "",
        graduation_year: p.graduation_year || null,
        company: app.company,
        role_title: app.role_title,
        city: app.city,
        password: tempPassword,
      },
    });

    if (error || data?.error) {
      toast.error("Approval Failed", {
        description: data?.error || error?.message || "Failed to create alumni account.",
      });
    } else {
      // Remove approved application from DB queue
      await supabase.from("alumni_applications").delete().eq("id", app.id);
      
      setCreatedCredentials({
        name: p.full_name,
        email: p.email,
        password: tempPassword,
      });

      setApplications((prev) => prev.filter((a) => a.id !== app.id));

      toast.success("Application Approved!", {
        description: `Created Alumni Account for ${p.full_name}. Credentials generated below.`,
      });
    }
    setProcessingId(null);
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    const { error } = await supabase.from("alumni_applications").delete().eq("id", id);
    if (!error) {
      setApplications((prev) => prev.filter((a) => a.id !== id));
      toast.info("Application Rejected", {
        description: "Application removed from queue.",
      });
    }
    setProcessingId(null);
  };

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
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
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
          className="gap-2 shrink-0 font-bold text-xs shadow-[3px_3px_0px_#0f172a]"
        >
          <Download className="w-4 h-4" /> Export CSV for Bulk Import
        </Button>
      </div>

      {/* Generated Credential Card Modal Banner */}
      {createdCredentials && (
        <div className="bg-amber-100 border-2 border-slate-900 rounded-2xl p-5 shadow-[5px_5px_0px_#0f172a] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-heading">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              Alumni Account Created & Shareable Credential Card
            </h3>
            <button
              onClick={() => setCreatedCredentials(null)}
              className="text-xs font-bold text-slate-700 hover:text-slate-900"
            >
              Dismiss &times;
            </button>
          </div>
          <div className="bg-white border-2 border-slate-900 rounded-xl p-4 text-xs font-mono text-slate-900 space-y-1 shadow-[2px_2px_0px_#0f172a]">
            <p><strong className="text-slate-600">NAME:</strong> {createdCredentials.name}</p>
            <p><strong className="text-slate-600">EMAIL:</strong> {createdCredentials.email}</p>
            <p><strong className="text-slate-600">PASSWORD:</strong> <span className="bg-amber-300 px-1.5 py-0.5 rounded font-bold">{createdCredentials.password}</span></p>
          </div>
        </div>
      )}

      {applications.length === 0 ? (
        <div className="border-2 border-slate-900 rounded-2xl bg-white p-10 text-center shadow-[4px_4px_0px_#0f172a]">
          <p className="text-xs font-semibold text-slate-500">No pending student applications.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="border-2 border-slate-900 rounded-2xl bg-white p-5 shadow-[4px_4px_0px_#0f172a] space-y-4 hover:-translate-y-0.5 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-base text-slate-900 font-heading">
                    {app.profiles.full_name}
                  </h3>
                  <p className="text-xs text-slate-500">{app.profiles.email}</p>
                  <span className="inline-block bg-amber-200 border-2 border-slate-900 rounded-md px-2 py-0.5 text-xs font-bold text-slate-900 mt-2 shadow-[2px_2px_0px_#0f172a]">
                    {app.profiles.branch} &bull; Class of &apos;{String(app.profiles.graduation_year).slice(-2)}
                  </span>
                </div>
                <div className="space-y-1.5 pt-3 border-t-2 border-slate-100 text-xs font-medium text-slate-700">
                  <p><span className="text-slate-400 inline-block w-16 font-bold uppercase">Role:</span> {app.role_title}</p>
                  <p><span className="text-slate-400 inline-block w-16 font-bold uppercase">Company:</span> {app.company}</p>
                  <p><span className="text-slate-400 inline-block w-16 font-bold uppercase">Type:</span> {app.emp_type}</p>
                  <p><span className="text-slate-400 inline-block w-16 font-bold uppercase">City:</span> {app.city}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t-2 border-slate-900 flex items-center gap-2">
                <Button
                  onClick={() => handleApprove(app)}
                  disabled={processingId === app.id}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs gap-1.5 h-9"
                >
                  <UserCheck className="w-4 h-4" /> Approve & Create
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleReject(app.id)}
                  disabled={processingId === app.id}
                  className="text-red-700 border-red-900 bg-red-50 hover:bg-red-100 px-2.5 h-9"
                  title="Reject Application"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function generatePassword(): string {
  const chars =
    "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
}
