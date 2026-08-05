import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-6 bg-slate-50 relative overflow-hidden font-sans">
      <div className="w-full max-w-md bg-white border-2 border-slate-900 rounded-2xl p-8 shadow-[8px_8px_0px_#0f172a] relative z-10 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-12 h-12 rounded-xl bg-red-100 border-2 border-slate-900 text-red-600 flex items-center justify-center shadow-[3px_3px_0px_#0f172a]">
          <AlertCircle className="w-6 h-6" strokeWidth={2.5} />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">
            Unauthorized Access
          </h1>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            You do not have permission to access this portal page. Please make sure you are signed in with the correct role.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center h-11 bg-slate-900 text-white rounded-xl border-2 border-slate-900 font-bold text-xs shadow-[3px_3px_0px_#0f172a] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0f172a] transition-all gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return Home
          </Link>
          <form action="/api/auth/signout" method="POST" className="flex-1">
            <button
              type="submit"
              className="w-full h-11 bg-white text-slate-900 rounded-xl border-2 border-slate-900 font-bold text-xs shadow-[3px_3px_0px_#0f172a] hover:bg-red-50 hover:text-red-700 hover:-translate-y-0.5 transition-all"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
