import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-6 bg-slate-50 relative overflow-hidden font-sans">
      <div className="w-full max-w-md bg-white border-2 border-slate-900 rounded-2xl p-8 shadow-[8px_8px_0px_#0f172a] relative z-10 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-12 h-12 rounded-xl bg-amber-100 border-2 border-slate-900 text-slate-900 flex items-center justify-center shadow-[3px_3px_0px_#0f172a]">
          <Compass className="w-6 h-6" strokeWidth={2.5} />
        </div>
        <div className="space-y-2">
          <span className="text-4xl font-bold tracking-tight text-slate-900 font-heading">404</span>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 font-heading">
            Page Not Found
          </h1>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            The page you requested could not be found or may have been moved.
          </p>
        </div>
        <Link
          href="/"
          className="w-full inline-flex items-center justify-center h-11 bg-slate-900 text-white rounded-xl border-2 border-slate-900 font-bold text-xs shadow-[3px_3px_0px_#0f172a] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0f172a] transition-all gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Homepage
        </Link>
      </div>
    </div>
  );
}
