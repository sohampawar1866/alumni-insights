/* Hallmark · macrostructure: Stat-Led & Marquee Hybrid · genre: editorial · nav: N5 floating-pill · footer: Ft1 institutional-masthead */

import Link from "next/link";
import Image from "next/image";
import {
  Award,
  Crown,
  Megaphone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  Building2,
  Globe2,
} from "lucide-react";
import { MembershipBadge } from "@/components/membership-badge";

export const revalidate = 3600;

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      {/* Decorative Subtle Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* N5 Floating Pill Navigation Archetype */}
      <header className="sticky top-4 z-50 w-full max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white/95 border-2 border-slate-900 rounded-full px-4 sm:px-6 py-2.5 shadow-[4px_4px_0px_#0f172a] backdrop-blur-md flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group shrink-0 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-full">
            <div className="relative w-9 h-9 shrink-0">
              <Image
                src="/images/iiitn.png"
                alt="IIIT Nagpur Logo"
                width={36}
                height={36}
                priority
                className="w-9 h-9 object-contain rounded-full border border-slate-200 shadow-xs"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-heading text-sm sm:text-base font-bold tracking-tight text-slate-900 leading-none truncate">
                IIIT Nagpur Alumni Association
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-blue-600 uppercase mt-0.5 truncate">
                Official Network
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/about"
              className="text-xs font-bold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-full hover:bg-slate-100 transition-colors hidden sm:inline-block focus-visible:ring-2 focus-visible:ring-blue-600 outline-none"
            >
              About
            </Link>
            <Link
              href="/login"
              className="text-xs font-bold text-slate-900 border-2 border-slate-900 bg-white px-3.5 py-1.5 rounded-full hover:bg-amber-300 transition-all shadow-[2px_2px_0px_#0f172a] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-blue-600 outline-none"
            >
              Student Login
            </Link>
            <Link
              href="/alumni/login"
              className="text-xs sm:text-sm font-bold bg-slate-900 text-white border-2 border-slate-900 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full hover:bg-slate-800 transition-all shadow-[2px_2px_0px_#0f172a] active:scale-[0.98] whitespace-nowrap flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-blue-600 outline-none"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              Alumni Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section — Stat-Led & Marquee Hybrid */}
      <section className="relative flex flex-1 flex-col items-center justify-center px-4 sm:px-6 pt-12 sm:pt-16 pb-12 text-center z-10 max-w-5xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border-2 border-slate-900 rounded-full text-xs font-bold text-slate-900 shadow-[2px_2px_0px_#0f172a]">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          Official IIIT Nagpur Alumni & Committee Portal
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.15] font-heading">
          Connecting IIIT Nagpur Graduates Across <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent underline decoration-blue-300 decoration-wavy underline-offset-8">
            The Global Tech Ecosystem
          </span>
        </h1>

        <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
          Welcome to the official IIIT Nagpur Alumni Association platform. Stay connected with fellow graduates, explore committee announcements, get official association memberships, and mentor current students.
        </p>

        {/* Hero Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 w-full max-w-md mx-auto sm:max-w-none">
          <Link
            href="/alumni/login"
            className="group inline-flex h-12 w-full sm:w-auto items-center justify-center bg-slate-900 border-2 border-slate-900 rounded-xl px-8 text-sm font-bold text-white shadow-[4px_4px_0px_#0f172a] hover:shadow-[6px_6px_0px_#0f172a] hover:-translate-y-0.5 active:scale-[0.98] transition-all gap-2"
          >
            <Crown className="w-4 h-4 text-amber-400" />
            Alumni Sign In / Join Association
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="inline-flex h-12 w-full sm:w-auto items-center justify-center bg-white border-2 border-slate-900 rounded-xl px-7 text-sm font-bold text-slate-900 shadow-[3px_3px_0px_#0f172a] hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0f172a] active:scale-[0.98] transition-all gap-2"
          >
            <GraduationCap className="w-4 h-4 text-slate-700" />
            Student Login (@iiitn.ac.in)
          </Link>
        </div>

        {/* Institutional Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-6 max-w-4xl mx-auto">
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[3px_3px_0px_#0f172a] text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">1000+</span>
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Active Alumni</p>
          </div>
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[3px_3px_0px_#0f172a] text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 font-heading">150+</span>
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Top Tech Firms</p>
          </div>
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[3px_3px_0px_#0f172a] text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-heading">100%</span>
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Verified Profiles</p>
          </div>
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[3px_3px_0px_#0f172a] text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-500 font-heading">4</span>
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
              <p className="text-xs text-slate-600 mt-0.5">
                Official membership tiers issued & verified by the IIIT Nagpur Alumni Committee.
              </p>
            </div>
            <span className="inline-flex items-center text-xs font-bold text-slate-900 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full w-fit">
              Committee Verified
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-purple-50/80 border-2 border-purple-900 shadow-[3px_3px_0px_#581c87] space-y-2">
              <MembershipBadge type="core" size="sm" />
              <p className="text-xs text-slate-700 font-medium">
                Committee Heads, Faculty Coordinators & Core Student Leads.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/80 border-2 border-emerald-900 shadow-[3px_3px_0px_#064e3b] space-y-2">
              <MembershipBadge type="lifetime" size="sm" />
              <p className="text-xs text-slate-700 font-medium">
                Permanent Patron & Lifetime Member credential.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-blue-50/80 border-2 border-blue-900 shadow-[3px_3px_0px_#1e3a8a] space-y-2">
              <MembershipBadge type="5_year" size="sm" />
              <p className="text-xs text-slate-700 font-medium">
                5-Year Active Alumni Association Member.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50/80 border-2 border-amber-900 shadow-[3px_3px_0px_#78350f] space-y-2">
              <MembershipBadge type="2_year" size="sm" />
              <p className="text-xs text-slate-700 font-medium">
                2-Year Active Alumni Association Member.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Asymmetric 2-Column Feature Showcase (Replaces 3-Column Equal Grid) */}
      <section className="relative z-10 border-t-2 border-slate-900 bg-white py-14 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 font-heading">
              Platform Features & Services
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-600">
              Built to foster lifelong connections, streamline committee announcements, and empower IIIT Nagpur graduates.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            {/* Left Main Feature (2 Columns Wide) */}
            <div className="lg:col-span-2 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border-2 border-slate-900 shadow-[8px_8px_0px_#2563eb] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-bold">
                  <Globe2 className="w-4 h-4 text-blue-400" />
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
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Search & Filters</h4>
                    <p className="text-xs text-slate-400">Search by company, title, batch, or membership.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Peer Networking</h4>
                    <p className="text-xs text-slate-400">Connect with fellow graduates across batches.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side Cards (1 Column Wide) */}
            <div className="flex flex-col gap-6">
              <div className="flex-1 bg-amber-400 border-2 border-slate-900 rounded-2xl p-6 shadow-[6px_6px_0px_#0f172a] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
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
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center font-bold">
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
            <p className="flex items-center gap-1 text-slate-400">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              IIIT Nagpur Campus, Kaladongri, Maharashtra
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
