"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, UserPlus } from "lucide-react";

export default function ApplyAlumniPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [roleTitle, setRoleTitle] = useState("");
  const [company, setCompany] = useState("");
  const [empType, setEmpType] = useState<"Full-time" | "Intern" | "">("");
  const [city, setCity] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: existingApp } = await supabase
      .from("alumni_applications")
      .select("id")
      .eq("student_id", user.id)
      .single();

    if (existingApp) {
      setError("You have already submitted an application.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase
      .from("alumni_applications")
      .insert({
        student_id: user.id,
        role_title: roleTitle,
        company,
        emp_type: empType,
        city,
        linkedin_url: linkedinUrl || null,
      });

    if (insertError) {
      setError(insertError.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2500);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4 font-sans">
        <div className="w-16 h-16 bg-emerald-100 border-2 border-slate-900 text-emerald-700 rounded-2xl shadow-[4px_4px_0px_#0f172a] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" strokeWidth={2.5} />
        </div>
        <div className="border-2 border-slate-900 bg-white p-8 rounded-2xl shadow-[6px_6px_0px_#0f172a] space-y-3">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 font-heading">Application Submitted</h1>
          <p className="text-xs text-slate-600 font-medium">Your application to be listed in the Alumni Directory has been sent to the placement cell for review.</p>
          <p className="text-xs font-bold text-amber-600 pt-2 animate-pulse">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 font-sans">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors gap-1 mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <div className="pb-6 border-b-2 border-slate-900">
          <h1 className="text-2xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-slate-700" /> Apply for Alumni Listing
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Are you currently working or interning? Submit your profile details to join the verified IIIT Nagpur Alumni Directory.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_#0f172a] space-y-5"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Current Role / Title</label>
            <Input
              required
              placeholder="e.g. Software Engineer"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Company</label>
            <Input
              required
              placeholder="e.g. Razorpay"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Employment Type</label>
            <select
              required
              className="h-11 w-full rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm text-slate-900 font-medium shadow-[2px_2px_0px_#0f172a] focus:shadow-[4px_4px_0px_#0f172a] outline-none transition-all cursor-pointer"
              value={empType}
              onChange={(e) => setEmpType(e.target.value as "Full-time" | "Intern")}
            >
              <option value="" disabled>Select type...</option>
              <option value="Full-time">Full-time</option>
              <option value="Intern">Intern</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">City / Location</label>
            <Input
              required
              placeholder="e.g. Bangalore, India"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">LinkedIn Profile URL (Optional)</label>
          <Input
            type="url"
            placeholder="https://linkedin.com/in/username"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
          />
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-900 rounded-xl p-3 text-xs font-bold text-red-900 shadow-[2px_2px_0px_#0f172a]">
            {error}
          </div>
        )}

        <div className="pt-4 border-t-2 border-slate-900">
          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full sm:w-auto px-8"
          >
            {loading ? "Submitting Application..." : "Submit Alumni Application"}
          </Button>
        </div>
      </form>
    </div>
  );
}
