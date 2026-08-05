import { GraduationCap } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50/95 backdrop-blur-md font-sans">
      <div className="flex flex-col items-center justify-center space-y-5 p-8 bg-white border-2 border-slate-900 rounded-3xl shadow-[8px_8px_0px_#0f172a] max-w-xs text-center relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-200/50 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-blue-200/50 rounded-full blur-2xl pointer-events-none" />

        {/* Orbit loader container */}
        <div className="relative flex items-center justify-center w-20 h-20">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
          
          {/* Spinning gradient arc */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-400 border-r-slate-900 animate-spin" />
          
          {/* Reverse counter-spinning inner arc */}
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-emerald-400 border-l-blue-600 animate-[spin_1.5s_linear_infinite_reverse]" />

          {/* Center icon */}
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md animate-pulse">
            <GraduationCap className="w-5 h-5 text-amber-400" strokeWidth={2.5} />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-1 z-10">
          <h3 className="text-base font-bold text-slate-900 font-heading tracking-tight">
            Alumni Insights
          </h3>
          <p className="text-xs font-semibold text-slate-500 flex items-center justify-center gap-1.5">
            <span>IIIT Nagpur</span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </p>
        </div>
      </div>
    </div>
  );
}