"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlumniBadge } from "@/components/alumni-badge";
import { MembershipBadge, MembershipType } from "@/components/membership-badge";
import { MembershipBanner } from "@/components/membership-banner";
import { Check, Save, Sparkles, Users, Megaphone } from "lucide-react";

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

  const [userId, setUserId] = useState<string>("");
  const [fullName, setFullName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [company, setCompany] = useState("");
  const [empType, setEmpType] = useState<"Full-time" | "Intern" | "">("");
  const [city, setCity] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [bio, setBio] = useState("");
  const [mentorshipAvailable, setMentorshipAvailable] = useState(false);
  const [mentorshipPreferences, setMentorshipPreferences] = useState("");
  const [membershipType, setMembershipType] = useState<MembershipType>("none");

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
      setUserId(user.id);

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setFullName(data.full_name || "Alumnus");
        setRoleTitle(data.role_title || "");
        setCompany(data.company || "");
        setEmpType(data.emp_type || "");
        setCity(data.city || "");
        setLinkedinUrl(data.linkedin_url || "");
        setBio(data.bio || "");
        setMentorshipAvailable(data.mentorship_available || false);
        setMentorshipPreferences(data.mentorship_preferences || "");
        setMembershipType(data.membership_type || "none");
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

    const { error: saveError } = await supabase
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

    if (saveError) {
      console.error("Profile save failed:", saveError.message);
      alert("Failed to save profile. Please check your connection and try again.");
      return;
    }

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
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-8 font-sans">
      {/* Membership Upgrade Banner for non-members / expired */}
      <MembershipBanner currentMembership={membershipType} alumniId={userId} />

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Alumni Portal
            </span>
            <MembershipBadge type={membershipType} showDetails size="sm" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            Welcome back, {fullName}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Manage your official alumni profile, membership status, mentorship availability, and connect with IIIT Nagpur graduates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/alumni/dashboard/directory"
            className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm hover:bg-slate-800 transition-all"
          >
            <Users className="w-4 h-4 text-blue-400" />
            Alumni Directory
          </Link>
          <Link
            href="/alumni/dashboard/announcements"
            className="inline-flex items-center gap-2 bg-white border-2 border-slate-900 text-slate-900 font-bold text-xs px-4 py-2.5 rounded-xl shadow-[3px_3px_0px_#0f172a] hover:-translate-y-0.5 transition-all"
          >
            <Megaphone className="w-4 h-4 text-slate-700" />
            Committee News
          </Link>
        </div>
      </div>

      {/* Profile Completeness Score */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Profile Completeness</h2>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-0.5 rounded-full">{completeness}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-slate-900 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completeness}%` }}
          />
        </div>
        {completeness < 100 ? (
          <p className="text-xs text-slate-500">
            Complete your profile details to stay fully searchable in the IIIT Nagpur Alumni Directory.
          </p>
        ) : (
          <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Profile fully optimized and discoverable in the network.
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

      {/* Profile Form */}
      <form
        onSubmit={handleSave}
        className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
      >
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900 font-heading">Edit Profile Details</h2>
          <p className="text-xs text-slate-500">Update your career, position, and mentorship availability.</p>
        </div>

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
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-slate-900 focus:outline-none"
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
            rows={3}
            maxLength={300}
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
            placeholder="Briefly describe your career journey, expertise, and what topics you enjoy guiding juniors on..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        {/* Mentorship Settings Toggle */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-slate-900 font-heading">
                Volunteer Student Mentorship Status
              </span>
              <p className="text-xs text-slate-600">
                Allow IIIT Nagpur students to discover your profile and send structured guidance requests.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={mentorshipAvailable}
                onChange={(e) => setMentorshipAvailable(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>

          {mentorshipAvailable && (
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <label className="text-xs font-semibold text-slate-700">
                Mentorship Preference Topics
              </label>
              <div className="flex flex-wrap gap-2">
                {MENTORSHIP_SUGGESTIONS.map((topic) => {
                  const isSelected = mentorshipPreferences
                    ?.split(",")
                    .map((s) => s.trim())
                    .includes(topic);
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => {
                        const current = mentorshipPreferences
                          ? mentorshipPreferences.split(",").map((s) => s.trim())
                          : [];
                        const updated = isSelected
                          ? current.filter((t) => t !== topic)
                          : [...current, topic];
                        setMentorshipPreferences(updated.join(", "));
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                        isSelected
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-700 border-slate-300 hover:border-slate-500"
                      }`}
                    >
                      {topic}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 animate-in fade-in">
              <Check className="w-4 h-4" /> Profile saved successfully!
            </span>
          )}
          <Button
            type="submit"
            disabled={saving}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl px-6 py-2.5 text-xs shadow-sm gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving Changes..." : "Save Profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}
