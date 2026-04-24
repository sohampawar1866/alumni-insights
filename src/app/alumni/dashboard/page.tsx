"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlumniBadge } from "@/components/alumni-badge";
import { Check } from "lucide-react";

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

      // Fetch contribution stats
      const { data: stats } = await supabase
        .from("alumni_contribution_stats")
        .select("*")
        .eq("alumni_id", user.id)
        .single();
      if (stats) setContributionStats(stats);
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
        <div className="h-12 w-12 animate-spin border-4 border-foreground border-t-primary shadow-[4px_4px_0px_var(--color-foreground)]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8 font-sans">
      <div className="border-l-8 border-primary pl-4">
        <h1 className="font-heading text-4xl font-black uppercase tracking-tighter text-foreground mb-2">My Profile</h1>
        <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Update your professional details. Students will see this when they search for alumni.
        </p>
      </div>

      {/* Profile Completeness Score */}
      <div className="bg-white border-4 border-foreground p-6 shadow-[8px_8px_0px_var(--color-foreground)] space-y-4 transition-all hover:shadow-[12px_12px_0px_var(--color-foreground)] hover:-translate-y-1">
        <div className="flex items-center justify-between border-b-4 border-foreground pb-2 mb-2">
          <h2 className="text-xl font-black uppercase tracking-tight text-foreground">Profile Completeness</h2>
          <span className="text-xl font-black text-background bg-foreground px-3 py-1 -rotate-2 shadow-[2px_2px_0px_var(--color-foreground)]">{completeness}%</span>
        </div>
        <div className="h-6 w-full bg-muted border-4 border-foreground overflow-hidden">
          <div
            className="h-full bg-primary border-r-4 border-foreground transition-all duration-500 ease-out flex items-center shadow-[inset_-4px_0_0_rgba(0,0,0,0.1)]"
            style={{ width: `${completeness}%` }}
          />
        </div>
        {completeness < 100 ? (
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground pt-1">
            COMPLETE YOUR PROFILE TO RANK HIGHER IN STUDENT SEARCH RESULTS.
          </p>
        ) : (
          <p className="text-xs font-black uppercase tracking-widest text-primary pt-1">
            PERFECT. PROFILE FULLY OPTIMIZED.
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
        className="bg-white border-4 border-foreground p-8 shadow-[8px_8px_0px_var(--color-foreground)] space-y-8"
      >
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-foreground">
              Current Role / Title
            </label>
            <Input
              placeholder="Software Engineer"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              className="border-4 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] rounded-none focus-visible:ring-0 focus-visible:border-primary text-base font-bold h-12"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-foreground">
              Company
            </label>
            <Input
              placeholder="Google"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="border-4 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] rounded-none focus-visible:ring-0 focus-visible:border-primary text-base font-bold h-12"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-foreground">
              Employment Type
            </label>
            <select
              className="flex h-12 w-full border-4 border-foreground bg-white px-3 py-2 text-base font-bold shadow-[4px_4px_0px_var(--color-foreground)] focus-visible:outline-none focus:bg-secondary transition-colors uppercase cursor-pointer appearance-none"
              value={empType}
              onChange={(e) =>
                setEmpType(e.target.value as "Full-time" | "Intern" | "")
              }
            >
              <option value="">SELECT...</option>
              <option value="Full-time">FULL-TIME</option>
              <option value="Intern">INTERN</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-foreground">
              City / Country
            </label>
            <Input
              placeholder="Bangalore, India"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border-4 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] rounded-none focus-visible:ring-0 focus-visible:border-primary text-base font-bold h-12"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-foreground">
            LinkedIn URL (optional)
          </label>
          <Input
            type="url"
            placeholder="https://linkedin.com/in/yourname"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            className="border-4 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] rounded-none focus-visible:ring-0 focus-visible:border-primary text-base font-bold h-12 bg-muted/50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-foreground">
            Bio / What I can help with{" "}
            <span className="text-muted-foreground">(max 300 chars)</span>
          </label>
          <textarea
            className="flex w-full border-4 border-foreground p-4 text-base font-bold shadow-[4px_4px_0px_var(--color-foreground)] focus-visible:outline-none focus:bg-secondary transition-colors resize-y min-h-[120px]"
            placeholder="I can help with resume reviews, career advice, and company insights..."
            maxLength={300}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-right border-t-4 border-foreground pt-2 mt-2 -rotate-1 w-max ml-auto">
            {bio.length}/300
          </p>
        </div>

        {/* Mentorship Toggle */}
        <div className="flex items-center justify-between border-4 border-foreground bg-muted p-6 shadow-[4px_4px_0px_var(--color-foreground)]">
          <div>
            <p className="text-lg font-black uppercase tracking-tight text-foreground">
              Open to mentorship
            </p>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1">
              Students will see you as available for connection requests.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={mentorshipAvailable}
              onChange={() => setMentorshipAvailable(!mentorshipAvailable)}
            />
            <div className="w-14 h-8 bg-background border-4 border-foreground peer-focus:outline-none rounded-none peer peer-checked:after:translate-x-full peer-checked:after:border-foreground after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-foreground after:border-foreground after:border-2 after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {/* Mentorship Preferences */}
        {mentorshipAvailable && (
          <div className="space-y-4 pt-4 border-t-4 border-foreground border-dashed">
            <label className="text-xs font-black uppercase tracking-wider text-foreground block">
              Mentorship Preferences
            </label>
            <div className="relative group">
              <Input
                placeholder="TYPE YOUR PREFERENCES OR TAP SUGGESTIONS BELOW"
                value={mentorshipPreferences}
                onChange={(e) => setMentorshipPreferences(e.target.value)}
                className="peer border-4 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] rounded-none focus-visible:ring-0 focus-visible:border-primary text-sm font-bold h-12 uppercase"
              />
              <div className="hidden peer-focus:flex hover:flex flex-wrap gap-2 mt-4 bg-background p-4 border-4 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] absolute z-10 w-full left-0">
                <p className="w-full text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">COMMON SUGGESTIONS:</p>
                {MENTORSHIP_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevents input onBlur from firing immediately
                      setMentorshipPreferences((prev) =>
                        prev ? `${prev}, ${s}` : s
                      );
                    }}
                    className="border-2 border-foreground bg-muted px-3 py-1.5 text-xs font-black uppercase tracking-wider text-foreground hover:bg-secondary hover:-translate-y-1 hover:shadow-[2px_2px_0px_var(--color-foreground)] transition-all"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 pt-4">
          <Button 
            type="submit" 
            disabled={saving}
            className="h-14 px-8 bg-foreground text-background border-4 border-transparent shadow-[4px_4px_0px_var(--color-primary)] text-lg font-black uppercase tracking-widest hover:-translate-y-1 hover:translate-x-1 hover:shadow-[6px_6px_0px_var(--color-primary)] transition-all rounded-none"
          >
            {saving ? "SAVING..." : "SAVE PROFILE"}
          </Button>
          {saved && (
            <span className="text-sm font-black uppercase tracking-widest text-primary bg-primary/10 border-2 border-primary px-4 py-2 mt-1 -rotate-2">
              <Check className="w-4 h-4 inline-block mr-1" strokeWidth={3} /> CHANGES SAVED
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
