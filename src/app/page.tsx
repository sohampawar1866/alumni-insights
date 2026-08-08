/* Hallmark · macrostructure: Stat-Led & Marquee Hybrid · genre: editorial · nav: N5 floating-pill · footer: Ft1 institutional-masthead */

import Link from "next/link";
import Image from "next/image";
import {
  Award,
  Crown,
  Megaphone,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  Globe2,
} from "lucide-react";
import { MembershipBadge } from "@/components/membership-badge";
import { LandingHeader } from "@/components/landing-header";

export const revalidate = 3600;

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      {/* Decorative Subtle Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Floating Responsive Header */}
      <LandingHeader />

      {/* Hero Section — Stat-Led & Marquee Hybrid */}
      <section className="relative flex flex-1 flex-col items-center justify-center px-4 sm:px-6 pt-12 sm:pt-16 pb-12 text-center z-10 max-w-5xl mx-auto space-y-8">

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.15] font-heading">
          Connecting IIIT Nagpur Graduates Across <br className="hidden sm:inline" />
          <span className="text-slate-900 underline decoration-amber-400 decoration-4 underline-offset-8">
            The Global Tech Ecosystem
          </span>
        </h1>

        <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-700 font-semibold leading-relaxed">
          Welcome to the official IIIT Nagpur Alumni Association platform. Stay connected with fellow graduates, explore committee announcements, get official association memberships, and mentor current students.
        </p>

        {/* Hero Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 w-full max-w-md mx-auto sm:max-w-none">
          <Link
            href="/alumni/login"
            className="group inline-flex h-12 w-full sm:w-auto items-center justify-center bg-slate-900 border-2 border-slate-900 rounded-xl px-8 text-sm font-bold text-white shadow-[4px_4px_0px_#0f172a] hover:bg-slate-800 hover:shadow-[6px_6px_0px_#0f172a] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-all gap-2"
          >
            <Crown className="w-4 h-4 text-amber-400" />
            Alumni Sign In / Join Association
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="inline-flex h-12 w-full sm:w-auto items-center justify-center bg-white border-2 border-slate-900 rounded-xl px-7 text-sm font-bold text-slate-900 shadow-[3px_3px_0px_#0f172a] hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0f172a] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-all gap-2"
          >
            <GraduationCap className="w-4 h-4 text-slate-700" />
            Student Login (@iiitn.ac.in)
          </Link>
        </div>

        {/* Institutional Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-6 max-w-4xl mx-auto">
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_#0f172a] text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">1000+</span>
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Active Alumni</p>
          </div>
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_#0f172a] text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">150+</span>
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Top Tech Firms</p>
          </div>
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_#0f172a] text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">100%</span>
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Verified Profiles</p>
          </div>
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_#0f172a] text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">4</span>
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Membership Tiers</p>
          </div>
        </div>
      </section>

      {/* Membership Tiers Showcase Row */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 pb-12 w-full">
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_#0f172a] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-900 pb-4 gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-heading flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Alumni Association Membership Credentials
              </h2>
              <p className="text-xs font-medium text-slate-600 mt-0.5">
                Official membership tiers issued & verified by the IIIT Nagpur Alumni Committee.
              </p>
            </div>
            <span className="inline-flex items-center text-xs font-bold text-slate-900 bg-amber-400 border-2 border-slate-900 px-3 py-1 rounded-full w-fit shadow-[2px_2px_0px_#0f172a]">
              Committee Verified
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-purple-50 border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] space-y-2">
              <MembershipBadge type="core" size="sm" />
              <p className="text-xs text-slate-700 font-semibold">
                Committee Heads, Faculty Coordinators & Core Student Leads.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] space-y-2">
              <MembershipBadge type="lifetime" size="sm" />
              <p className="text-xs text-slate-700 font-semibold">
                Permanent Patron & Lifetime Member credential.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] space-y-2">
              <MembershipBadge type="5_year" size="sm" />
              <p className="text-xs text-slate-700 font-semibold">
                5-Year Active Alumni Association Member.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] space-y-2">
              <MembershipBadge type="2_year" size="sm" />
              <p className="text-xs text-slate-700 font-semibold">
                2-Year Active Alumni Association Member.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Asymmetric 2-Column Feature Showcase */}
      <section className="relative z-10 border-t-2 border-slate-900 bg-white py-14 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 font-heading">
              Platform Features & Services
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600">
              Built to foster lifelong connections, streamline committee announcements, and empower IIIT Nagpur graduates.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            {/* Left Main Feature (2 Columns Wide) */}
            <div className="lg:col-span-2 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border-2 border-slate-900 shadow-[6px_6px_0px_#0f172a] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 border-2 border-amber-400 text-slate-900 text-xs font-bold shadow-[2px_2px_0px_rgba(0,0,0,0.4)]">
                  <Globe2 className="w-4 h-4 text-slate-900" />
                  Alumni Network Directory
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-heading leading-snug text-white">
                  Discover Alumni Working Across Top Global Companies & Roles
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  Filter by branch, company, graduation batch, and membership tier. Alumni members can browse their peers, view career milestones, and stay connected with the institute.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Search & Filters</h4>
                    <p className="text-xs text-slate-400 font-normal">Search by company, title, batch, or membership.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Peer Networking</h4>
                    <p className="text-xs text-slate-400 font-normal">Connect with fellow graduates across batches.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side Cards (1 Column Wide) */}
            <div className="flex flex-col gap-6">
              <div className="flex-1 bg-amber-400 border-2 border-slate-900 rounded-2xl p-6 shadow-[6px_6px_0px_#0f172a] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold border-2 border-slate-900">
                  <Megaphone className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  Committee Announcements
                </h3>
                <p className="text-xs font-semibold text-slate-900/90 leading-relaxed">
                  Receive targeted announcements for college events, reunions, and official updates directly from moderators.
                </p>
              </div>

              <div className="flex-1 bg-slate-50 border-2 border-slate-900 rounded-2xl p-6 shadow-[6px_6px_0px_#0f172a] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center font-bold border-2 border-slate-900">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  Membership Verification
                </h3>
                <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                  Submit transaction proofs or request Google Form verification to get official Core, Lifetime, or 5-Year badges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ft1 Institutional Masthead Footer Archetype */}
      <footer className="relative z-10 border-t-2 border-slate-900 bg-slate-900 text-white py-12 px-4 sm:px-8 font-sans">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 shrink-0 bg-white rounded-full p-1 border border-slate-700">
                <Image
                  src="/images/iiitn.png"
                  alt="IIIT Nagpur Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-heading">
                  Indian Institute of Information Technology, Nagpur
                </h3>
                <p className="text-xs text-slate-400">
                  Official Alumni Association & Committee Portal
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-300">
              <Link href="/about" className="hover:text-amber-400 transition-colors">
                About Committee
              </Link>
              <Link href="/alumni/login" className="hover:text-amber-400 transition-colors">
                Alumni Portal
              </Link>
              <Link href="/login" className="hover:text-amber-400 transition-colors">
                Student Portal
              </Link>
              <Link href="/moderator/login" className="hover:text-amber-400 transition-colors">
                Moderator Login
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
            <p>© {new Date().getFullYear()} IIIT Nagpur Alumni Association. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
