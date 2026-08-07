import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Award,
  Crown,
  Megaphone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { MembershipBadge } from "@/components/membership-badge";

export const revalidate = 3600;

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      {/* Decorative Subtle Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Header Bar */}
      <header className="relative z-10 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group shrink-0 min-w-0">
            <div className="relative w-10 h-10 shrink-0">
              <Image
                src="/images/iiitn.png"
                alt="IIIT Nagpur Logo"
                width={40}
                height={40}
                priority
                className="w-10 h-10 object-contain rounded-full border border-slate-200 shadow-sm"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-heading text-base sm:text-xl font-bold tracking-tight text-slate-900 leading-none truncate">
                IIIT Nagpur Alumni Association
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-blue-600 uppercase mt-0.5 truncate">
                Official Alumni Network Portal
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/about"
              className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors hidden sm:inline-block"
            >
              About
            </Link>
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 bg-white px-3 py-2 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
            >
              Student Portal
            </Link>
            <Link
              href="/alumni/login"
              className="text-xs sm:text-sm font-bold bg-slate-900 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-md whitespace-nowrap flex items-center gap-1.5"
            >
              <Crown className="w-4 h-4 text-amber-400" />
              Alumni Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-1 flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-20 text-center z-10 max-w-5xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-200/90 rounded-full text-xs font-semibold text-blue-900 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          Official IIIT Nagpur Alumni & Committee Portal
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.15] font-heading">
          Connecting IIIT Nagpur Graduates Across <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent underline decoration-blue-200 decoration-wavy underline-offset-8">
            The Global Tech Ecosystem
          </span>
        </h1>

        <p className="max-w-3xl mx-auto text-sm sm:text-lg text-slate-600 font-normal leading-relaxed">
          Welcome to the official IIIT Nagpur Alumni Association platform. Stay connected with fellow graduates, explore committee announcements, get official association memberships, and give back to current students through mentorship.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 w-full max-w-md mx-auto sm:max-w-none">
          <Link
            href="/alumni/login"
            className="group inline-flex h-12 w-full sm:w-auto items-center justify-center bg-slate-900 rounded-xl px-8 text-sm font-bold text-white shadow-lg hover:bg-slate-800 transition-all gap-2"
          >
            <Crown className="w-4 h-4 text-amber-400" />
            Alumni Sign In / Join Association
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="inline-flex h-12 w-full sm:w-auto items-center justify-center bg-white border-2 border-slate-900 rounded-xl px-7 text-sm font-bold text-slate-900 shadow-[3px_3px_0px_#0f172a] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0f172a] transition-all gap-2"
          >
            <GraduationCap className="w-4 h-4 text-slate-700" />
            Student Login (@iiitn.ac.in)
          </Link>
        </div>

        {/* Institutional Verification Badge */}
        <div className="flex items-center justify-center pt-2 text-xs font-medium text-slate-500 gap-4">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Verified Alumni Database
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Official Committee Managed
          </span>
        </div>

        {/* Membership Tiers Highlight Row */}
        <div className="w-full pt-8 pb-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Alumni Association Membership Tiers
              </h3>
              <span className="text-xs text-slate-500 font-medium">Official Credentials</span>
            </div>
            <div className="grid sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200 space-y-1">
                <MembershipBadge type="core" size="sm" />
                <p className="text-[11px] text-slate-600 pt-1">
                  Management & Core Committee Leaders
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                <MembershipBadge type="lifetime" size="sm" />
                <p className="text-[11px] text-slate-600 pt-1">
                  Permanent Patron & Lifetime Member
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1">
                <MembershipBadge type="5_year" size="sm" />
                <p className="text-[11px] text-slate-600 pt-1">
                  5-Year Active Alumni Association Member
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1">
                <MembershipBadge type="2_year" size="sm" />
                <p className="text-[11px] text-slate-600 pt-1">
                  2-Year Active Alumni Association Member
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="relative z-10 border-t border-slate-200 bg-white py-14 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              Platform Features & Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Built to foster lifelong connections, streamline committee announcements, and empower IIIT Nagpur graduates.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Alumni Directory & Networking
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect with batchmates and fellow alumni working in software engineering, product, research, and leadership roles globally.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                <Megaphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Targeted Official Announcements
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive official college event updates, reunions, placement milestones, and committee news directly from campus moderators.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Association Membership Badges
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Get your official membership badge verified by the Alumni Committee. Choose from Lifetime, 5-Year, 2-Year, or Core Team tiers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-slate-900 text-white py-8 px-4 sm:px-8 text-center text-xs text-slate-400 font-sans">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} IIIT Nagpur Alumni Association. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link href="/alumni/login" className="hover:text-white transition-colors">
              Alumni Portal
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Student Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
