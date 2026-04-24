import Link from "next/link";
import { Search, Handshake, Rocket, Copyright } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden font-sans">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Hero Section */}
      <section className="relative flex flex-1 flex-col items-center justify-center px-6 py-24 text-center z-10">
        <div className="relative max-w-3xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#fdc800] border-4 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] text-xs font-black uppercase tracking-wider text-foreground origin-bottom -rotate-2 mb-4">
            <span className="inline-block w-3 h-3 bg-foreground animate-pulse" />
            IIIT Nagpur Alumni Network
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-foreground leading-[1.1]">
            Connect with alumni who <br />
            <span className="inline-block bg-primary text-background px-4 py-1 mt-2 border-4 border-foreground shadow-[6px_6px_0px_var(--color-foreground)] -rotate-1">
              get it
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-lg md:text-xl font-bold text-muted-foreground uppercase tracking-wide leading-relaxed border-2 border-dashed border-foreground p-4 bg-background">
            Find IIIT Nagpur graduates at your dream companies. Get mentorship, referrals, and career advice — completely free.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
            <Link
              href="/login"
              className="group inline-flex h-14 items-center justify-center bg-primary border-4 border-foreground px-8 text-sm font-black uppercase tracking-widest text-background shadow-[8px_8px_0px_var(--color-foreground)] transition-all hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_var(--color-foreground)]"
            >
              Student Login
            </Link>
            <Link
              href="/alumni/login"
              className="group inline-flex h-14 items-center justify-center bg-white border-4 border-foreground px-8 text-sm font-black uppercase tracking-widest text-foreground shadow-[8px_8px_0px_var(--color-foreground)] transition-all hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_var(--color-foreground)]"
            >
              Alumni Login
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-24 px-6 bg-secondary border-t-8 border-foreground z-10">
        <div className="max-w-5xl mx-auto relative">
          <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-center text-foreground mb-16 drop-shadow-[4px_4px_0px_var(--color-foreground)]">
            How it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="group text-center space-y-4 p-8 bg-background border-4 border-foreground shadow-[8px_8px_0px_var(--color-foreground)] transition-all hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[16px_16px_0px_var(--color-foreground)]">
              <div className="mx-auto flex h-20 w-20 items-center justify-center bg-[#fdc800] border-4 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] text-4xl group-hover:scale-110 transition-transform -rotate-3">
                <Search className="w-10 h-10 text-foreground" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-foreground bg-accent inline-block px-2">Search Alumni</h3>
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground leading-relaxed mt-2">
                Filter by company, role, branch, city — find exactly who you need to talk to.
              </p>
            </div>
            
            <div className="group text-center space-y-4 p-8 bg-background border-4 border-foreground shadow-[8px_8px_0px_var(--color-foreground)] transition-all hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[16px_16px_0px_var(--color-foreground)]">
              <div className="mx-auto flex h-20 w-20 items-center justify-center bg-primary border-4 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] text-4xl group-hover:scale-110 transition-transform rotate-3">
                <Handshake className="w-10 h-10 text-foreground" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-foreground bg-accent inline-block px-2">Connect</h3>
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground leading-relaxed mt-2">
                Send a structured request — no awkward cold emails. Alumni see exactly what you need.
              </p>
            </div>
            
            <div className="group text-center space-y-4 p-8 bg-background border-4 border-foreground shadow-[8px_8px_0px_var(--color-foreground)] transition-all hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[16px_16px_0px_var(--color-foreground)]">
              <div className="mx-auto flex h-20 w-20 items-center justify-center bg-[#00e559] border-4 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] text-4xl group-hover:scale-110 transition-transform -rotate-3">
                <Rocket className="w-10 h-10 text-foreground" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-foreground bg-accent inline-block px-2">Grow</h3>
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground leading-relaxed mt-2">
                Get mentorship, resume reviews, referrals, and company insights from people who were in your shoes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-background border-t-8 border-foreground z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-black uppercase tracking-widest text-foreground">
          <span className="bg-muted px-4 py-2 border-2 border-foreground flex items-center gap-1"><Copyright className="w-3.5 h-3.5" strokeWidth={3} /> {new Date().getFullYear()} Alumni Insights · IIIT Nagpur</span>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/moderator/login" className="bg-white px-4 py-2 border-2 border-foreground hover:bg-accent hover:text-foreground transition-colors shadow-[2px_2px_0px_var(--color-foreground)]">
              Moderator Login
            </Link>
            <Link href="/admin/login" className="bg-white px-4 py-2 border-2 border-foreground hover:bg-accent hover:text-foreground transition-colors shadow-[2px_2px_0px_var(--color-foreground)]">
              Admin Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
