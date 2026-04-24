"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlumniCard } from "@/components/alumni-card";
import Link from "next/link";

type Alumni = {
  id: string;
  full_name: string | null;
  role_title: string | null;
  company: string | null;
  emp_type: "Intern" | "Full-time" | null;
  graduation_year: number | null;
  branch: string | null;
  city: string | null;
  mentorship_available: boolean | null;
  bio: string | null;
  linkedin_url: string | null;
};

export default function SearchPage() {
  const supabase = createClient();
  const [results, setResults] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [company, setCompany] = useState("");
  const [roleKeyword, setRoleKeyword] = useState("");
  const [branch, setBranch] = useState("");
  const [city, setCity] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [empType, setEmpType] = useState<"" | "Intern" | "Full-time">("");
  const [mentorshipOnly, setMentorshipOnly] = useState(false);

  const search = useCallback(async () => {
    setLoading(true);

    let query = supabase
      .from("profiles")
      .select(
        "id, full_name, role_title, company, emp_type, graduation_year, branch, city, mentorship_available, bio, linkedin_url"
      )
      .contains("roles", ["alumni"]);

    if (company.trim()) query = query.ilike("company", `%${company.trim()}%`);
    if (roleKeyword.trim())
      query = query.ilike("role_title", `%${roleKeyword.trim()}%`);
    if (branch.trim()) query = query.ilike("branch", `%${branch.trim()}%`);
    if (city.trim()) query = query.ilike("city", `%${city.trim()}%`);
    if (yearFrom) query = query.gte("graduation_year", parseInt(yearFrom));
    if (yearTo) query = query.lte("graduation_year", parseInt(yearTo));
    if (empType) query = query.eq("emp_type", empType);
    if (mentorshipOnly) query = query.eq("mentorship_available", true);

    const { data } = await query;
    let fetchedData = (data as Alumni[]) || [];

    // Calculate completeness and sort
    fetchedData = fetchedData.sort((a, b) => {
      const getScore = (profile: Alumni) => {
        let score = 0;
        if (profile.role_title?.trim()) score += 20;
        if (profile.company?.trim()) score += 20;
        if (profile.emp_type) score += 10;
        if (profile.city?.trim()) score += 15;
        if (profile.bio?.trim()) score += 20;
        if (profile.linkedin_url?.trim()) score += 15;
        return score;
      };
      
      const scoreA = getScore(a);
      const scoreB = getScore(b);
      
      // Secondary sort by name
      if (scoreA === scoreB) {
        return (a.full_name || "").localeCompare(b.full_name || "");
      }
      return scoreB - scoreA;
    });

    setResults(fetchedData);
    setLoading(false);
  }, [company, roleKeyword, branch, city, yearFrom, yearTo, empType, mentorshipOnly, supabase]);

  // Initial load
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    search();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search();
  };

  const clearFilters = () => {
    setCompany("");
    setRoleKeyword("");
    setBranch("");
    setCity("");
    setYearFrom("");
    setYearTo("");
    setEmpType("");
    setMentorshipOnly(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-12">
      <Link
        href="/dashboard"
        className="inline-flex items-center text-sm font-black uppercase text-foreground bg-secondary border-2 border-foreground px-3 py-1 shadow-[4px_4px_0px_var(--color-foreground)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_var(--color-foreground)] transition-all mb-4"
      >
        ← Back
      </Link>
      <h1 className="text-5xl font-black text-foreground uppercase tracking-tighter mb-8 border-b-4 border-foreground pb-4">
        Alumni Directory
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Sidebar */}
        <form
          onSubmit={handleSubmit}
          className="lg:w-80 shrink-0 space-y-6 p-6 bg-background border-4 border-foreground shadow-[8px_8px_0px_var(--color-foreground)] h-fit lg:sticky lg:top-24"
        >
          <div className="flex items-center justify-between border-b-2 border-foreground pb-2">
            <h2 className="text-xl font-black uppercase tracking-tighter">
              Filters
            </h2>
            <button type="button" onClick={clearFilters} className="text-xs font-bold uppercase text-muted-foreground hover:text-foreground">Clear All</button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black uppercase tracking-wide">
              Company
            </label>
            <Input
              placeholder="e.g., Google"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_var(--color-foreground)]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black uppercase tracking-wide">
              Role / Title
            </label>
            <Input
              placeholder="e.g., SDE"
              value={roleKeyword}
              onChange={(e) => setRoleKeyword(e.target.value)}
              className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_var(--color-foreground)]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black uppercase tracking-wide">Branch</label>
            <Input
              placeholder="e.g., CSE"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_var(--color-foreground)]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black uppercase tracking-wide">City</label>
            <Input
              placeholder="e.g., Bangalore"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_var(--color-foreground)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-black uppercase tracking-wide">
                From Year
              </label>
              <Input
                type="number"
                placeholder="2020"
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
                className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_var(--color-foreground)]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black uppercase tracking-wide">
                To Year
              </label>
              <Input
                type="number"
                placeholder="2025"
                value={yearTo}
                onChange={(e) => setYearTo(e.target.value)}
                className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_var(--color-foreground)]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black uppercase tracking-wide">
              Employment Type
            </label>
            <select
              className="flex h-12 w-full border-2 border-foreground bg-background px-4 py-2 text-base font-bold shadow-[4px_4px_0px_var(--color-foreground)] transition-colors focus-visible:bg-secondary focus-visible:outline-none cursor-pointer"
              value={empType}
              onChange={(e) =>
                setEmpType(e.target.value as "" | "Intern" | "Full-time")
              }
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Intern">Intern</option>
            </select>
          </div>

          <label className="flex items-center gap-3 cursor-pointer bg-muted border-2 border-foreground p-3 hover:bg-secondary transition-colors">
            <input
              type="checkbox"
              className="w-5 h-5 border-2 border-foreground appearance-none checked:bg-primary checked:border-foreground relative checked:after:content-['✔'] checked:after:absolute checked:after:text-foreground checked:after:text-xs checked:after:font-black checked:after:left-[2px] checked:after:top-0"
              checked={mentorshipOnly}
              onChange={(e) => setMentorshipOnly(e.target.checked)}
            />
            <span className="text-sm font-black uppercase">
              Mentor Only
            </span>
          </label>

          <Button type="submit" className="w-full text-lg h-14 bg-primary shadow-[8px_8px_0px_var(--color-foreground)] hover:shadow-[4px_4px_0px_var(--color-foreground)] hover:translate-y-1 hover:translate-x-1">
            SEARCH DATABASE
          </Button>
        </form>

        {/* Results Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-16 w-16 bg-primary border-4 border-foreground animate-spin shadow-[8px_8px_0px_var(--color-foreground)]" />
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-20 bg-background border-4 border-foreground border-dashed shadow-[8px_8px_0px_var(--color-foreground)]">
              <p className="text-2xl font-black uppercase tracking-tighter text-foreground mb-2">
                No Results Found
              </p>
              <p className="text-sm font-bold uppercase text-muted-foreground">
                Try loosening your filters.
              </p>
            </div>
          ) : (
            <>
              <p className="text-lg font-black uppercase tracking-wide text-foreground mb-4 border-b-4 border-foreground w-fit pr-4 pb-1">
                {results.length} Profile{results.length === 1 ? '' : 's'} Found
              </p>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {results.map((alumni) => (
                  <AlumniCard key={alumni.id} {...alumni} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
