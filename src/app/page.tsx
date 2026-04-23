import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-blue-950 px-6 py-24 text-center">
        {/* Decorative blurred circles */}
        <div className="absolute top-[-120px] left-[-80px] w-[400px] h-[400px] rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-80px] right-[-60px] w-[350px] h-[350px] rounded-full bg-indigo-400/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-blue-200 backdrop-blur-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            IIIT Nagpur Alumni Network
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Connect with alumni who{" "}
            <span className="text-blue-200">
              get it
            </span>
          </h1>

          <p className="max-w-lg mx-auto text-lg text-slate-300 leading-relaxed">
            Find IIIT Nagpur graduates at your dream companies. Get mentorship,
            referrals, and career advice — completely free.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-8 text-sm font-semibold text-slate-900 shadow-lg shadow-white/10 transition-all hover:bg-blue-50 hover:shadow-xl hover:shadow-white/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign In with Google
            </Link>
            <Link
              href="/alumni/login"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-8 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30"
            >
              Alumni Login
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-12">
            How it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="group text-center space-y-3 p-6 rounded-2xl transition-all hover:bg-blue-50/60">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl group-hover:scale-110 transition-transform">
                🔍
              </div>
              <h3 className="font-semibold text-slate-900">Search Alumni</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Filter by company, role, branch, city — find exactly who you
                need to talk to.
              </p>
            </div>
            <div className="group text-center space-y-3 p-6 rounded-2xl transition-all hover:bg-blue-50/60">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl group-hover:scale-110 transition-transform">
                🤝
              </div>
              <h3 className="font-semibold text-slate-900">Connect</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Send a structured request — no awkward cold emails. Alumni see
                exactly what you need.
              </p>
            </div>
            <div className="group text-center space-y-3 p-6 rounded-2xl transition-all hover:bg-blue-50/60">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-2xl group-hover:scale-110 transition-transform">
                🚀
              </div>
              <h3 className="font-semibold text-slate-900">Grow</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Get mentorship, resume reviews, referrals, and company insights
                from people who were in your shoes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-blue-100/70 bg-blue-50/60">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <span>© {new Date().getFullYear()} Alumni Insights · IIIT Nagpur</span>
          <div className="flex gap-6">
            <Link href="/moderator/login" className="hover:text-slate-700 transition-colors">
              Moderator Login
            </Link>
            <Link href="/admin/login" className="hover:text-slate-700 transition-colors">
              Admin Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
