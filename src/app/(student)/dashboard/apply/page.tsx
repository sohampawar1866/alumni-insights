"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

    // Check if application already exists
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
      setTimeout(() => router.push("/dashboard"), 3000);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl">✓</div>
        <h1 className="text-2xl font-bold text-slate-900">Application Submitted</h1>
        <p className="text-slate-500">Your application to be listed in the alumni directory has been sent to the placement cell for review.</p>
        <p className="text-sm text-slate-400">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 transition-colors mb-4"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Apply as Alumni</h1>
        <p className="text-sm text-slate-500 mt-1">
          Are you working or interning? Submit your details below to be listed in the Alumni Directory so juniors can connect with you.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Current Role / Title</label>
            <Input
              required
              placeholder="Software Engineering Intern"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Company</label>
            <Input
              required
              placeholder="Google"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Employment Type</label>
            <select
              required
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={empType}
              onChange={(e) => setEmpType(e.target.value as "Full-time" | "Intern")}
            >
              <option value="" disabled>Select...</option>
              <option value="Full-time">Full-time</option>
              <option value="Intern">Intern</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">City / Country</label>
            <Input
              required
              placeholder="Bangalore, India"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">LinkedIn URL (optional)</label>
          <Input
            type="url"
            placeholder="https://linkedin.com/in/yourname"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">
            {error}
          </p>
        )}

        <div className="pt-2">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </form>
    </div>
  );
}
