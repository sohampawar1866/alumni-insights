"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlumniBadge } from "@/components/alumni-badge";
import { Check, User, Save, Sparkles } from "lucide-react";

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
  
  type ContributionStats = {
    tier: string;
    completed_count: number;
    avg_rating: number | string;
    feedback_count: number;
    acceptance_rate: number | string;
  };
  const [contributionStats, setContributionStats] = useState<ContributionStats | null>(null);

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

      const { data: stats } = await supabase
        .from("alumni_contribution_stats")
        .select("*")
        .eq("alumni_id", user.id)
        .single();
      if (stats) setContributionStats(stats);
    }
    load();
  }, [supabase]);

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

  const calculateCompleteness = () => {
    let score = 0;
    if (roleTitle?.trim()) score += 20;
    if (company?.trim()) score += 20;
    if (empType) score += 10;
    if (city?.trim()) score += 15;
    if (bio?.trim()) score += 20;
    if (linkedinUrl?.trim()) score += 15;
    return score;
  };

  const completeness = calculateCompleteness();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 font-sans">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 font-sans">
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 font-heading">My Alumni Profile</h1>
        <p className="text-sm text-slate-600 mt-1">
          Manage your current company, position, mentorship preferences, and availability status.
        </p>
      </div>

      {/* Profile Completeness Score */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Profile Completeness</h2>
          <span className="text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-0.5 rounded-full">{completeness}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-slate-900 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completeness}%` }}
          />
        </div>
        {completeness < 100 ? (
          <p className="text-xs text-slate-500">
            Complete your profile to rank higher in student search results.
          </p>
        ) : (
          <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Profile fully optimized and discoverable.
          </p>
        )}
      </div>

      {/* Contribution & Recognition */}
      {contributionStats && (
        <AlumniBadge
          tier={contributionStats.tier}
          completedCount={contributionStats.completed_count}
          avgRating={Number(contributionStats.avg_rating)}
          feedbackCount={contributionStats.feedback_count}
          acceptanceRate={Number(contributionStats.acceptance_rate)}
        />
      )}

      <form
        onSubmit={handleSave}
        className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6"
      >
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Current Role / Title
            </label>
            <Input
              placeholder="e.g. Software Engineer, SDE-II"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Company / Employer
            </label>
            <Input
              placeholder="e.g. Google, Razorpay"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Employment Type
            </label>
            <select
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none"
              value={empType}
              onChange={(e) =>
                setEmpType(e.target.value as "Full-time" | "Intern" | "")
              }
            >
              <option value="">Select Employment Type...</option>
              <option value="Full-time">Full-time</option>
              <option value="Intern">Intern</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              City / Location
            </label>
            <Input
              placeholder="e.g. Bangalore, India"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            LinkedIn Profile URL <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <Input
            type="url"
            placeholder="https://linkedin.com/in/yourprofile"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Bio & Mentorship Topics <span className="text-slate-400 font-normal">(Max 300 chars)</span>
          </label>
          <textarea
            className="w-full rounded-lg border border-slate-200 bg-white p-3.5 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none min-h-[100px]"
            placeholder="Describe what advice or guidance you can provide to IIITN students..."
            maxLength={300}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <p className="text-xs text-slate-400 text-right">
            {bio.length}/300
          </p>
        </div>

        {/* Mentorship Toggle */}
        <div className="flex items-center justify-between border border-slate-200 bg-slate-50 p-4 rounded-xl">
          <div>
            <p className="text-sm font-bold text-slate-900">
              Available for Volunteer Mentorship
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Allow IIITN students to discover your profile and send connection requests.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={mentorshipAvailable}
              onChange={() => setMentorshipAvailable(!mentorshipAvailable)}
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        {/* Mentorship Preferences */}
        {mentorshipAvailable && (
          <div className="space-y-3 pt-2">
            <label className="text-xs font-semibold text-slate-700 block">
              Mentorship Focus Areas
            </label>
            <div className="relative">
              <Input
                placeholder="e.g. Resume Review, Career Advice"
                value={mentorshipPreferences}
                onChange={(e) => setMentorshipPreferences(e.target.value)}
              />
              <div className="flex flex-wrap gap-2 mt-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <p className="w-full text-xs font-semibold text-slate-500">Tap to add quick topics:</p>
                {MENTORSHIP_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setMentorshipPreferences((prev) =>
                        prev ? `${prev}, ${s}` : s
                      );
                    }}
                    className="border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 pt-2">
          <Button 
            type="submit" 
            disabled={saving}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving Changes..." : "Save Profile"}
          </Button>
          {saved && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-md flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Profile Saved Successfully
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
