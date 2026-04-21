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
      .eq("role", "alumni");

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
    <div className="max-w-6xl mx-auto px-6 py-10">
      <Link
        href="/dashboard"
        className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 transition-colors mb-4"
      >
        ← Back to Dashboard
      </Link>
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-8">
        Alumni Directory
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Sidebar */}
        <form
          onSubmit={handleSubmit}
          className="lg:w-72 shrink-0 space-y-5 p-5 rounded-2xl border border-slate-200 bg-white shadow-sm h-fit lg:sticky lg:top-6"
        >
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
            Filters
          </h2>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">
              Company
            </label>
            <Input
              placeholder="e.g., Google"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">
              Role / Title
            </label>
            <Input
              placeholder="e.g., SDE"
              value={roleKeyword}
              onChange={(e) => setRoleKeyword(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Branch</label>
            <Input
              placeholder="e.g., CSE"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">City</label>
            <Input
              placeholder="e.g., Bangalore"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">
                Year from
              </label>
              <Input
                type="number"
                placeholder="2020"
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">
                Year to
              </label>
              <Input
                type="number"
                placeholder="2025"
                value={yearTo}
                onChange={(e) => setYearTo(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">
              Employment Type
            </label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={empType}
              onChange={(e) =>
                setEmpType(e.target.value as "" | "Intern" | "Full-time")
              }
            >
              <option value="">All</option>
              <option value="Full-time">Full-time</option>
              <option value="Intern">Intern</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              checked={mentorshipOnly}
              onChange={(e) => setMentorshipOnly(e.target.checked)}
            />
            <span className="text-sm text-slate-600">
              Open to mentorship only
            </span>
          </label>

          <div className="flex gap-2 pt-1">
            <Button type="submit" className="flex-1">
              Search
            </Button>
            <Button type="button" variant="outline" onClick={clearFilters}>
              Clear
            </Button>
          </div>
        </form>

        {/* Results Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-slate-400">
                No alumni found matching your filters.
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Try broadening your search criteria.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-500 mb-4">
                {results.length} alumni found
              </p>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
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
