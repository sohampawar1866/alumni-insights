import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck, Sparkles, Users, GraduationCap, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 relative font-sans">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Header */}
      <header className="relative z-10 w-full border-b-2 border-slate-900 bg-white/95 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-slate-900 flex items-center justify-center p-1.5 overflow-hidden shadow-[2px_2px_0px_#0f172a]">
              <Image
                src="/images/iiitn.png"
                alt="IIIT Nagpur Logo"
                width={32}
                height={32}
                className="object-contain rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xl font-bold tracking-tight text-slate-900 leading-none">
                Alumni Insights
              </span>
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase mt-0.5">
                IIIT Nagpur
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center text-xs font-bold text-slate-700 hover:text-slate-900 gap-1 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Home
            </Link>
            <Link
              href="/login"
              className="text-xs font-bold bg-slate-900 text-white px-4 py-2.5 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] hover:-translate-y-0.5 transition-all"
            >
              Student Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-400 border-2 border-slate-900 rounded-full text-xs font-bold text-slate-900 shadow-[3px_3px_0px_#0f172a]">
          <Sparkles className="w-4 h-4" />
          Official Collaboration
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 font-heading leading-tight">
          Bridging IIIT Nagpur Students & Alumni Mentors
        </h1>

        <p className="text-base sm:text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed">
          Alumni Insights is built to give every IIIT Nagpur student direct, structured access to seniors working at top tech firms, product startups, and research institutions worldwide.
        </p>

        {/* Co-Branding Banner */}
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_#0f172a] max-w-2xl mx-auto space-y-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            A product by
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
            {/* CRISPR Club Logo */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-slate-900 border-2 border-slate-900 p-2 flex items-center justify-center overflow-hidden shadow-[3px_3px_0px_#0f172a]">
                <Image
                  src="/images/crispt.png"
                  alt="CRISPR Club Logo"
                  width={48}
                  height={48}
                  className="object-contain rounded-full"
                />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-900 font-heading">CRISPR Club</p>
                <p className="text-xs font-semibold text-slate-500">Official Tech & Coding Club</p>
              </div>
            </div>

            <div className="hidden sm:block text-slate-300 font-bold text-xl">&times;</div>

            {/* IIITN Placement Cell */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-slate-900 border-2 border-slate-900 p-2 flex items-center justify-center overflow-hidden shadow-[3px_3px_0px_#0f172a]">
                <Image
                  src="/images/iiitn.png"
                  alt="IIIT Nagpur Logo"
                  width={48}
                  height={48}
                  className="object-contain rounded-full"
                />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-900 font-heading">IIITN Placement Cell</p>
                <p className="text-xs font-semibold text-slate-500">Training & Placement Office</p>
              </div>
            </div>
          </div>

          <p className="text-xs font-bold text-slate-800 bg-amber-50/80 border-2 border-slate-900 rounded-xl p-3 shadow-[2px_2px_0px_#0f172a]">
            &ldquo;A product by the CRISPR Club, IIITN in collaboration with IIITN Placement Cell&rdquo;
          </p>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="relative z-10 py-12 px-6 bg-white border-t-2 border-slate-900">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">
              Platform Features & Architecture
            </h2>
            <p className="text-xs font-semibold text-slate-500">
              Designed specifically for university mentorship workflows.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_#0f172a] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 border-2 border-slate-900 flex items-center justify-center text-blue-700 shadow-[2px_2px_0px_#0f172a]">
                <ShieldCheck className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading">Verified Institutional Identity</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Students log in strictly via verified <span className="font-bold text-slate-900">@iiitn.ac.in</span> Google OAuth. Alumni profiles are added and approved directly by the Placement Cell.
              </p>
            </div>

            <div className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_#0f172a] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 border-2 border-slate-900 flex items-center justify-center text-amber-800 shadow-[2px_2px_0px_#0f172a]">
                <Users className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading">Anti-Spam Weekly Quotas</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Students are allocated 10 mentorship requests per week to ensure every outreach is thoughtful, high-quality, and respectful of alumni time.
              </p>
            </div>

            <div className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_#0f172a] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border-2 border-slate-900 flex items-center justify-center text-emerald-800 shadow-[2px_2px_0px_#0f172a]">
                <Sparkles className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading">Gamified Recognition Badges</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Seniors earn Platinum, Gold, Silver, and Bronze Mentor badges based on completed sessions, ratings, and student feedback.
              </p>
            </div>

            <div className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_#0f172a] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 border-2 border-slate-900 flex items-center justify-center text-purple-800 shadow-[2px_2px_0px_#0f172a]">
                <GraduationCap className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading">1:1 Private Mentorship Threads</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Once a request is accepted, a secure private chat thread enables seamless resume sharing, mock interview setup, and referral guidance.
              </p>
            </div>
          </div>

          <div className="pt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] hover:-translate-y-0.5 transition-all"
            >
              Get Started on Alumni Insights <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-slate-900 text-slate-400 border-t-2 border-slate-900 mt-auto relative z-10 font-sans">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2 shrink-0">
              <Image src="/images/iiitn.png" alt="IIITN" width={22} height={22} className="object-contain rounded-full" />
              <Image src="/images/crispt.png" alt="CRISPR" width={22} height={22} className="object-contain rounded-full" />
            </div>
            <span className="text-slate-300 font-semibold">
              A product by the CRISPR Club, IIITN in collaboration with IIITN Placement Cell
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-slate-700">&bull;</span>
            <Link href="/about" className="text-amber-400 hover:underline">
              About
            </Link>
            <span className="text-slate-700">&bull;</span>
            <Link href="/moderator/login" className="hover:text-white transition-colors">
              Moderator Portal
            </Link>
            <span className="text-slate-700">&bull;</span>
            <Link href="/admin/login" className="hover:text-white transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
