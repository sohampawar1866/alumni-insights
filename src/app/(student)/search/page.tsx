"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlumniCard } from "@/components/alumni-card";
import Link from "next/link";
import { ArrowLeft, Search, Filter, RotateCcw } from "lucide-react";

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
      
      if (scoreA === scoreB) {
        return (a.full_name || "").localeCompare(b.full_name || "");
      }
      return scoreB - scoreA;
    });

    setResults(fetchedData);
    setLoading(false);
  }, [company, roleKeyword, branch, city, yearFrom, yearTo, empType, mentorshipOnly, supabase]);

  useEffect(() => {
    search();
  }, [search]);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-2 gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            Alumni Directory
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Search IIIT Nagpur graduates by company, role title, branch, and mentorship status.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Filter Sidebar */}
        <form
          onSubmit={handleSubmit}
          className="w-full lg:w-80 shrink-0 space-y-5 p-6 bg-white border border-slate-200 rounded-xl shadow-sm lg:sticky lg:top-20"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-slate-500" /> Filters
            </h2>
            <button 
              type="button" 
              onClick={clearFilters} 
              className="text-xs font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Clear
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Company</label>
            <Input
              placeholder="e.g. Google, Zomato"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Role / Title</label>
            <Input
              placeholder="e.g. SDE, Product Manager"
              value={roleKeyword}
              onChange={(e) => setRoleKeyword(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Branch</label>
            <Input
              placeholder="e.g. CSE, ECE"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">City</label>
            <Input
              placeholder="e.g. Bangalore, Pune"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">From Year</label>
              <Input
                type="number"
                placeholder="2020"
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">To Year</label>
              <Input
                type="number"
                placeholder="2026"
                value={yearTo}
                onChange={(e) => setYearTo(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Employment Type</label>
            <select
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none"
              value={empType}
              onChange={(e) => setEmpType(e.target.value as "" | "Intern" | "Full-time")}
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Intern">Intern</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 rounded-lg p-2.5 hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              checked={mentorshipOnly}
              onChange={(e) => setMentorshipOnly(e.target.checked)}
            />
            <span className="text-xs font-semibold text-slate-800">
              Mentors Only
            </span>
          </label>

          <Button type="submit" className="w-full gap-2">
            <Search className="w-4 h-4" /> Apply Filters
          </Button>
        </form>

        {/* Results */}
        <div className="flex-1 w-full">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-xl shadow-sm p-8 space-y-2">
              <p className="text-base font-bold text-slate-900 font-heading">
                No Alumni Profiles Found
              </p>
              <p className="text-xs text-slate-500">
                Try loosening your filter criteria or searching by company name.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500 pb-1">
                <span>Showing <strong className="text-slate-900 font-semibold">{results.length}</strong> alumni profile{results.length === 1 ? '' : 's'}</span>
              </div>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {results.map((alumni) => (
                  <AlumniCard key={alumni.id} {...alumni} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
