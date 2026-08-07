import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck, Sparkles, Users, GraduationCap, ArrowRight } from "lucide-react";

export const revalidate = 3600;

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 relative font-sans">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Header */}
      <header className="relative z-10 w-full border-b-2 border-slate-900 bg-white/95 backdrop-blur-md px-3 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0 min-w-0">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 shrink-0">
              <Image
                src="/images/iiitn.png"
                alt="IIIT Nagpur Logo"
                width={40}
                height={40}
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-full"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-heading text-sm sm:text-xl font-bold tracking-tight text-slate-900 leading-none truncate">
                Alumni Insights
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-500 uppercase mt-0.5 truncate">
                IIIT Nagpur
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <Link
              href="/"
              className="inline-flex items-center text-xs font-bold text-slate-700 hover:text-slate-900 gap-1 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Home</span>
            </Link>
            <Link
              href="/login"
              className="text-[11px] sm:text-xs font-bold bg-slate-900 text-white px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] sm:shadow-[3px_3px_0px_#0f172a] hover:-translate-y-0.5 transition-all whitespace-nowrap"
            >
              Student Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-3.5 sm:px-6 py-8 sm:py-16 text-center space-y-5 sm:space-y-8">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 bg-amber-400 border-2 border-slate-900 rounded-full text-[11px] sm:text-xs font-bold text-slate-900 shadow-[2px_2px_0px_#0f172a]">
          <Sparkles className="w-3.5 h-3.5" />
          Official Collaboration
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-heading leading-tight">
          Bridging IIIT Nagpur Students & Alumni Mentors
        </h1>

        <p className="text-xs sm:text-base text-slate-700 max-w-2xl mx-auto leading-relaxed">
          Alumni Insights is built to give every IIIT Nagpur student direct, structured access to seniors working at top tech firms, product startups, and research institutions worldwide.
        </p>

        {/* Co-Branding Banner */}
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 sm:p-8 shadow-[4px_4px_0px_#0f172a] sm:shadow-[6px_6px_0px_#0f172a] max-w-2xl mx-auto space-y-4 sm:space-y-6">
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
            A product by
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10">
            {/* Shani Digital Works Logo */}
            <div className="border-2 border-slate-900 rounded-2xl bg-white p-4 sm:p-5 shadow-[4px_4px_0px_#0f172a] flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-slate-900 overflow-hidden bg-slate-900 shrink-0 flex items-center justify-center shadow-[2px_2px_0px_#0f172a]">
                <Image
                  src="/images/crispt.png"
                  alt="Shani Digital Works Logo"
                  width={56}
                  height={56}
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Developed By</p>
                <p className="text-xs sm:text-sm font-bold text-slate-900 font-heading">Shani Digital Works</p>
                <p className="text-[11px] text-slate-600">Digital Product & Software Club</p>
              </div>
            </div>

            <div className="hidden sm:block text-slate-300 font-bold text-xl">&times;</div>

            {/* Alumni Committee, IIITN */}
            <div className="border-2 border-slate-900 rounded-2xl bg-white p-4 sm:p-5 shadow-[4px_4px_0px_#0f172a] flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-slate-900 overflow-hidden bg-slate-900 shrink-0 flex items-center justify-center shadow-[2px_2px_0px_#0f172a]">
                <Image
                  src="/images/iiitn.png"
                  alt="IIIT Nagpur Emblem"
                  width={56}
                  height={56}
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">In Collaboration With</p>
                <p className="text-xs sm:text-sm font-bold text-slate-900 font-heading">Alumni Committee, IIITN</p>
                <p className="text-[11px] text-slate-600">Official IIIT Nagpur Committee</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-400 border-2 border-slate-900 rounded-2xl p-4 sm:p-6 shadow-[5px_5px_0px_#0f172a] text-center font-bold text-slate-900 text-xs sm:text-sm">
            &ldquo;A product by Shani Digital Works in collaboration with Alumni Committee, IIITN&rdquo;
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="relative z-10 py-8 sm:py-12 px-3.5 sm:px-6 bg-white border-t-2 border-slate-900">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-10">
          <div className="text-center space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-heading">
              Platform Features & Architecture
            </h2>
            <p className="text-[11px] sm:text-xs font-semibold text-slate-500">
              Designed specifically for university mentorship workflows.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-4 sm:p-6 shadow-[3px_3px_0px_#0f172a] space-y-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-100 border-2 border-slate-900 flex items-center justify-center text-blue-700 shadow-[2px_2px_0px_#0f172a]">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 font-heading">Verified Institutional Access</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Students log in strictly via verified <span className="font-bold text-slate-900">@iiitn.ac.in</span> Google OAuth. Alumni profiles are added and approved directly by the Alumni Committee.
              </p>
            </div>

            <div className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-4 sm:p-6 shadow-[3px_3px_0px_#0f172a] space-y-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-100 border-2 border-slate-900 flex items-center justify-center text-amber-800 shadow-[2px_2px_0px_#0f172a]">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 font-heading">Anti-Spam Weekly Quotas</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Students are allocated 10 mentorship requests per week to ensure every outreach is thoughtful, high-quality, and respectful of alumni time.
              </p>
            </div>

            <div className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-4 sm:p-6 shadow-[3px_3px_0px_#0f172a] space-y-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 border-2 border-slate-900 flex items-center justify-center text-emerald-800 shadow-[2px_2px_0px_#0f172a]">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 font-heading">Alumni Impact Recognition Tiers</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Seniors earn Platinum, Gold, Silver, and Bronze Mentor badges based on completed sessions, ratings, and student feedback.
              </p>
            </div>

            <div className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-4 sm:p-6 shadow-[3px_3px_0px_#0f172a] space-y-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-100 border-2 border-slate-900 flex items-center justify-center text-purple-800 shadow-[2px_2px_0px_#0f172a]">
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 font-heading">1:1 Private Mentorship Threads</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Once a request is accepted, a secure private chat thread enables seamless resume sharing, mock interview setup, and referral guidance.
              </p>
            </div>
          </div>

          <div className="pt-4 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] hover:-translate-y-0.5 transition-all"
            >
              Get Started on Alumni Insights <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-3.5 sm:px-6 bg-slate-900 text-slate-400 border-t-2 border-slate-900 mt-auto relative z-10 font-sans">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-col sm:flex-row items-center gap-2.5 text-center sm:text-left">
            <div className="flex items-center gap-2 shrink-0">
              <Image src="/images/iiitn.png" alt="IIITN Logo" width={22} height={22} className="w-5 h-5 object-contain rounded-full" />
              <Image src="/images/crispt.png" alt="Shani Digital Works" width={22} height={22} className="w-5 h-5 object-contain rounded-full" />
            </div>
            <span className="text-slate-300 font-semibold text-[11px] sm:text-xs">
              A product by Shani Digital Works in collaboration with Alumni Committee, IIITN
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold shrink-0">
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
