import Link from "next/link";
import Image from "next/image";
import { Search, Handshake, Rocket, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Header Bar */}
      <header className="relative z-10 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center p-1.5 shadow-sm border border-slate-900 overflow-hidden">
              <Image
                src="/images/iiitn.png"
                alt="IIIT Nagpur Logo"
                width={32}
                height={32}
                className="object-contain rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg font-bold tracking-tight text-slate-900 leading-none">
                Alumni Insights
              </span>
              <span className="text-[11px] font-medium tracking-wider text-slate-500 uppercase mt-0.5">
                IIIT Nagpur
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/about"
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              About
            </Link>
            <Link
              href="/alumni/login"
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors hidden sm:inline-block"
            >
              Alumni Portal
            </Link>
            <Link
              href="/login"
              className="text-xs font-semibold bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
            >
              Student Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-1 flex-col items-center justify-center px-6 py-20 text-center z-10 max-w-4xl mx-auto">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-200/80 rounded-full text-xs font-semibold text-blue-900 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Official IIIT Nagpur Alumni & Mentorship Network
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.15] font-heading">
            Connect with IIIT Nagpur Graduates for <br className="hidden sm:inline" />
            <span className="text-blue-600 underline decoration-blue-200 decoration-wavy underline-offset-8">
              Mentorship & Guidance
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Discover alumni working across top tech companies and startups. Access free career advice, resume reviews, and volunteer mentorship from graduates who walked in your shoes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/login"
              className="group inline-flex h-12 items-center justify-center bg-slate-900 rounded-xl px-7 text-sm font-semibold text-white shadow-md hover:bg-slate-800 transition-all gap-2"
            >
              Student Login (@iiitn.ac.in)
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/alumni/login"
              className="inline-flex h-12 items-center justify-center bg-white border border-slate-200 rounded-xl px-7 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              Alumni Sign In
            </Link>
          </div>

          {/* Institutional Trust Badges */}
          <div className="flex items-center justify-center pt-8 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Verified Institutional OAuth (@iiitn.ac.in)
            </span>
          </div>
        </div>
      </section>

      {/* Value Props Grid */}
      <section className="py-20 px-6 bg-white border-t border-slate-200 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-heading">
              How Alumni Insights Works
            </h2>
            <p className="text-slate-600 text-sm">
              A structured, transparent ecosystem connecting students with experienced graduates.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-7 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-sm space-y-4 hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-200/60 flex items-center justify-center text-blue-700">
                <Search className="w-6 h-6" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">Discover Alumni</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Filter alumni by company, role title, branch, graduation year, and city to target the exact career path you aspire to.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-sm space-y-4 hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-200/60 flex items-center justify-center text-amber-700">
                <Handshake className="w-6 h-6" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">Structured Requests</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Send structured mentorship asks (resume review, career chat, job referral) with clear response time expectations.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-sm space-y-4 hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-200/60 flex items-center justify-center text-emerald-700">
                <Rocket className="w-6 h-6" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">Accelerate Growth</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Gain real-world industry insights, interview preparation tips, and direct referral opportunities from IIIT Nagpur seniors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Footer */}
      <footer className="py-8 px-6 bg-slate-900 text-slate-400 border-t border-slate-800 z-10 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2 shrink-0">
              <Image src="/images/iiitn.png" alt="IIITN Logo" width={22} height={22} className="object-contain rounded-full" />
              <Image src="/images/crispt.png" alt="CRISPR Logo" width={22} height={22} className="object-contain rounded-full" />
            </div>
            <span className="text-slate-300 font-semibold">
              A product by the CRISPR Club, IIITN in collaboration with IIITN Placement Cell
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
            <Link href="/about" className="text-slate-300 hover:text-white transition-colors">
              About
            </Link>
            <span className="text-slate-700">&bull;</span>
            <Link href="/moderator/login" className="hover:text-white transition-colors">
              Moderator Portal
            </Link>
            <span className="text-slate-700">&bull;</span>
            <Link href="/admin/login" className="hover:text-white transition-colors">
              Admin Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
