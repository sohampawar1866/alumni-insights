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
      <div className="max-w-2xl mx-auto px-6 py-20 text-center space-y-6 font-sans">
        <div className="w-24 h-24 bg-primary text-background border-4 border-foreground shadow-[8px_8px_0px_var(--color-foreground)] flex items-center justify-center mx-auto text-5xl font-black -rotate-6">✓</div>
        <div className="border-4 border-foreground bg-white p-8 shadow-[8px_8px_0px_var(--color-foreground)] space-y-4 inline-block mt-8">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground">Application Submitted</h1>
          <p className="text-base font-bold uppercase tracking-wider text-muted-foreground">Your application to be listed in the alumni directory has been sent to the placement cell for review.</p>
          <p className="text-xs font-black uppercase tracking-widest text-primary pt-4">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8 font-sans">
      <div className="border-l-8 border-primary pl-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm font-black uppercase tracking-widest text-background bg-foreground px-3 py-1 mb-6 hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--color-primary)] transition-all border-2 border-transparent"
        >
          ← BACK TO DASHBOARD
        </Link>
        <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground mb-2">Apply as Alumni</h1>
        <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Are you working or interning? Submit your details below to be listed in the Alumni Directory so juniors can connect with you.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border-4 border-foreground p-8 shadow-[8px_8px_0px_var(--color-foreground)] space-y-8"
      >
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-foreground">Current Role / Title</label>
            <Input
              required
              placeholder="Software Engineering Intern"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              className="border-4 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] rounded-none focus-visible:ring-0 focus-visible:border-primary text-base font-bold h-12"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-foreground">Company</label>
            <Input
              required
              placeholder="Google"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="border-4 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] rounded-none focus-visible:ring-0 focus-visible:border-primary text-base font-bold h-12"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-foreground">Employment Type</label>
            <select
              required
              className="flex h-12 w-full border-4 border-foreground bg-white px-3 py-2 text-base font-bold shadow-[4px_4px_0px_var(--color-foreground)] focus-visible:outline-none focus:bg-secondary transition-colors uppercase cursor-pointer appearance-none"
              value={empType}
              onChange={(e) => setEmpType(e.target.value as "Full-time" | "Intern")}
            >
              <option value="" disabled>SELECT...</option>
              <option value="Full-time">FULL-TIME</option>
              <option value="Intern">INTERN</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-foreground">City / Country</label>
            <Input
              required
              placeholder="Bangalore, India"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border-4 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] rounded-none focus-visible:ring-0 focus-visible:border-primary text-base font-bold h-12"
            />
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <label className="text-xs font-black uppercase tracking-wider text-foreground">LinkedIn URL (optional)</label>
          <Input
            type="url"
            placeholder="https://linkedin.com/in/yourname"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            className="border-4 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] rounded-none focus-visible:ring-0 focus-visible:border-primary text-base font-bold h-12 bg-muted/50"
          />
        </div>

        {error && (
          <div className="border-4 border-foreground bg-destructive text-background p-4 shadow-[4px_4px_0px_var(--color-foreground)]">
            <p className="text-sm font-black uppercase tracking-widest">
              {error}
            </p>
          </div>
        )}

        <div className="pt-6 border-t-4 border-foreground border-dashed">
          <Button 
            type="submit" 
            disabled={loading} 
            className="h-14 px-10 bg-primary text-background border-4 border-foreground shadow-[8px_8px_0px_var(--color-foreground)] text-lg font-black uppercase tracking-widest hover:-translate-y-1 hover:translate-x-1 hover:shadow-[12px_12px_0px_var(--color-foreground)] transition-all rounded-none w-full sm:w-auto"
          >
            {loading ? "SUBMITTING..." : "SUBMIT APPLICATION"}
          </Button>
        </div>
      </form>
    </div>
  );
}
