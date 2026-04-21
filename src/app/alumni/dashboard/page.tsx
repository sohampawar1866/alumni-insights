"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MENTORSHIP_SUGGESTIONS = [
  "Resume Review",
  "Career Advice",
  "Job Referrals",
  "Mock Interviews",
  "Company Insights",
];

export default function AlumniDashboardPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [roleTitle, setRoleTitle] = useState("");
  const [company, setCompany] = useState("");
  const [empType, setEmpType] = useState<"Full-time" | "Intern" | "">("");
  const [city, setCity] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [bio, setBio] = useState("");
  const [mentorshipAvailable, setMentorshipAvailable] = useState(false);
  const [mentorshipPreferences, setMentorshipPreferences] = useState("");

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setRoleTitle(data.role_title || "");
        setCompany(data.company || "");
        setEmpType(data.emp_type || "");
        setCity(data.city || "");
        setLinkedinUrl(data.linkedin_url || "");
        setBio(data.bio || "");
        setMentorshipAvailable(data.mentorship_available || false);
        setMentorshipPreferences(data.mentorship_preferences || "");
      }
      setLoading(false);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("profiles")
      .update({
        role_title: roleTitle || null,
        company: company || null,
        emp_type: empType || null,
        city: city || null,
        linkedin_url: linkedinUrl || null,
        bio: bio || null,
        mentorship_available: mentorshipAvailable,
        mentorship_preferences: mentorshipPreferences || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-sm text-slate-500 mt-1">
          Update your professional details. Students will see this when they
          search for alumni.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">
              Current Role / Title
            </label>
            <Input
              placeholder="Software Engineer"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">
              Company
            </label>
            <Input
              placeholder="Google"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">
              Employment Type
            </label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={empType}
              onChange={(e) =>
                setEmpType(e.target.value as "Full-time" | "Intern" | "")
              }
            >
              <option value="">Select...</option>
              <option value="Full-time">Full-time</option>
              <option value="Intern">Intern</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">
              City / Country
            </label>
            <Input
              placeholder="Bangalore, India"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">
            LinkedIn URL (optional)
          </label>
          <Input
            type="url"
            placeholder="https://linkedin.com/in/yourname"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">
            Bio / What I can help with{" "}
            <span className="text-slate-400">(max 300 chars)</span>
          </label>
          <textarea
            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            placeholder="I can help with resume reviews, career advice, and company insights..."
            maxLength={300}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <p className="text-xs text-slate-400 text-right">
            {bio.length}/300
          </p>
        </div>

        {/* Mentorship Toggle */}
        <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
          <div>
            <p className="text-sm font-medium text-slate-700">
              Open to mentorship
            </p>
            <p className="text-xs text-slate-500">
              Students will see you as available for connection requests.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={mentorshipAvailable}
            onClick={() => setMentorshipAvailable(!mentorshipAvailable)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
              mentorshipAvailable ? "bg-blue-600" : "bg-slate-200"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${
                mentorshipAvailable ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Mentorship Preferences */}
        {mentorshipAvailable && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500">
              Mentorship Preferences
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {MENTORSHIP_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() =>
                    setMentorshipPreferences((prev) =>
                      prev ? `${prev}, ${s}` : s
                    )
                  }
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
                >
                  + {s}
                </button>
              ))}
            </div>
            <Input
              placeholder="Type your preferences or tap suggestions above"
              value={mentorshipPreferences}
              onChange={(e) => setMentorshipPreferences(e.target.value)}
            />
          </div>
        )}

        <div className="flex items-center gap-3 pt-1">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </Button>
          {saved && (
            <span className="text-sm text-emerald-600">✓ Changes saved</span>
          )}
        </div>
      </form>
    </div>
  );
}
