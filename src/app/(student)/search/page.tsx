"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filters from URL params so Back navigation restores state
  const [results, setResults] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(searchParams.get("company") || "");
  const [roleKeyword, setRoleKeyword] = useState(searchParams.get("role") || "");
  const [branch, setBranch] = useState(searchParams.get("branch") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [yearFrom, setYearFrom] = useState(searchParams.get("from") || "");
  const [yearTo, setYearTo] = useState(searchParams.get("to") || "");
  const [empType, setEmpType] = useState<"" | "Intern" | "Full-time">((searchParams.get("type") || "") as "" | "Intern" | "Full-time");
  const [mentorshipOnly, setMentorshipOnly] = useState(searchParams.get("mentors") === "1");

  // Debounce timer ref
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pushFiltersToUrl = useCallback((params: Record<string, string>) => {
    const url = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) url.set(k, v); });
    router.replace(`/search?${url.toString()}`, { scroll: false });
  }, [router]);

  const search = useCallback(async (filters: {
    company: string; roleKeyword: string; branch: string; city: string;
    yearFrom: string; yearTo: string; empType: string; mentorshipOnly: boolean;
  }) => {
    setLoading(true);

    let query = supabase
      .from("profiles")
      .select("id, full_name, role_title, company, emp_type, graduation_year, branch, city, mentorship_available, bio, linkedin_url")
      .contains("roles", ["alumni"]);

    if (filters.company.trim()) query = query.ilike("company", `%${filters.company.trim()}%`);
    if (filters.roleKeyword.trim()) query = query.ilike("role_title", `%${filters.roleKeyword.trim()}%`);
    if (filters.branch.trim()) query = query.ilike("branch", `%${filters.branch.trim()}%`);
    if (filters.city.trim()) query = query.ilike("city", `%${filters.city.trim()}%`);
    if (filters.yearFrom) query = query.gte("graduation_year", parseInt(filters.yearFrom));
    if (filters.yearTo) query = query.lte("graduation_year", parseInt(filters.yearTo));
    if (filters.empType) query = query.eq("emp_type", filters.empType);
    if (filters.mentorshipOnly) query = query.eq("mentorship_available", true);

    const { data } = await query;
    let fetchedData = (data as Alumni[]) || [];

    fetchedData = fetchedData.sort((a, b) => {
      const getScore = (p: Alumni) => {
        let score = 0;
        if (p.role_title?.trim()) score += 20;
        if (p.company?.trim()) score += 20;
        if (p.emp_type) score += 10;
        if (p.city?.trim()) score += 15;
        if (p.bio?.trim()) score += 20;
        if (p.linkedin_url?.trim()) score += 15;
        return score;
      };
      const diff = getScore(b) - getScore(a);
      if (diff !== 0) return diff;
      return (a.full_name || "").localeCompare(b.full_name || "");
    });

    setResults(fetchedData);
    setLoading(false);
  }, [supabase]);

  // Debounced effect: wait 300ms after last filter change before querying
  useEffect(() => {
    const currentFilters = { company, roleKeyword, branch, city, yearFrom, yearTo, empType, mentorshipOnly };

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      // Push filter state to URL so Back navigation restores it
      pushFiltersToUrl({
        company, role: roleKeyword, branch, city,
        from: yearFrom, to: yearTo, type: empType,
        mentors: mentorshipOnly ? "1" : "",
      });
      search(currentFilters);
    }, 300);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [company, roleKeyword, branch, city, yearFrom, yearTo, empType, mentorshipOnly, search, pushFiltersToUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    search({ company, roleKeyword, branch, city, yearFrom, yearTo, empType, mentorshipOnly });
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
    router.replace("/search", { scroll: false });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-900">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mb-2 gap-1"
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
          className="w-full lg:w-80 shrink-0 space-y-5 p-6 bg-white border-2 border-slate-900 rounded-xl shadow-[5px_5px_0px_#0f172a] lg:sticky lg:top-20"
        >
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Filter className="w-4 h-4" /> Filters
            </h2>
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-bold text-slate-700 bg-slate-100 border-2 border-slate-900 px-2.5 py-1 rounded-full shadow-[2px_2px_0px_#0f172a] hover:bg-slate-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 flex items-center gap-1 transition-all"
            >
              <RotateCcw className="w-3 h-3" /> Clear
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Company</label>
            <Input placeholder="e.g. Google, Zomato" value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Role / Title</label>
            <Input placeholder="e.g. SDE, Product Manager" value={roleKeyword} onChange={(e) => setRoleKeyword(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Branch</label>
            <Input placeholder="e.g. CSE, ECE" value={branch} onChange={(e) => setBranch(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">City</label>
            <Input placeholder="e.g. Bangalore, Pune" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">From Year</label>
              <Input type="number" placeholder="2020" value={yearFrom} onChange={(e) => setYearFrom(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">To Year</label>
              <Input type="number" placeholder="2026" value={yearTo} onChange={(e) => setYearTo(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Employment Type</label>
            <select
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-all"
              value={empType}
              onChange={(e) => setEmpType(e.target.value as "" | "Intern" | "Full-time")}
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Intern">Intern</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border-2 border-slate-200 hover:border-slate-900 rounded-xl p-3 hover:shadow-[2px_2px_0px_#0f172a] transition-all">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              checked={mentorshipOnly}
              onChange={(e) => setMentorshipOnly(e.target.checked)}
            />
            <span className="text-xs font-bold text-slate-800">Mentors Only</span>
          </label>

          <Button type="submit" className="w-full gap-2 border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] hover:shadow-[5px_5px_0px_#0f172a] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-blue-600 transition-all">
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
            <div className="text-center py-16 bg-white border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_#0f172a] p-8 space-y-2">
              <p className="text-base font-bold text-slate-900 font-heading">No Alumni Profiles Found</p>
              <p className="text-xs text-slate-500">Try loosening your filter criteria or searching by company name.</p>
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
