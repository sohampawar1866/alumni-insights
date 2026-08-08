import React from "react";
import { Crown, Sparkles, Award, Medal, ShieldAlert } from "lucide-react";

export type MembershipType = "core" | "lifetime" | "5_year" | "2_year" | "none" | string;

interface MembershipBadgeProps {
  type?: MembershipType | null;
  showDetails?: boolean;
  size?: "sm" | "md" | "lg";
}

export function MembershipBadge({ type = "none", showDetails = false, size = "md" }: MembershipBadgeProps) {
  const currentType = (type || "none").toLowerCase();

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2 font-bold",
  }[size];

  const iconSize = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  }[size];

  switch (currentType) {
    case "core":
      return (
        <span
          className={`inline-flex items-center font-bold tracking-wide rounded-full bg-purple-900 text-white border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] ${sizeClasses}`}
        >
          <Crown className={`${iconSize} text-amber-400 fill-amber-400`} />
          Core Team Member
        </span>
      );
    case "lifetime":
      return (
        <span
          className={`inline-flex items-center font-bold tracking-wide rounded-full bg-emerald-700 text-white border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] ${sizeClasses}`}
        >
          <Sparkles className={`${iconSize} text-emerald-200`} />
          Lifetime Member
        </span>
      );
    case "5_year":
      return (
        <span
          className={`inline-flex items-center font-bold tracking-wide rounded-full bg-blue-700 text-white border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] ${sizeClasses}`}
        >
          <Award className={`${iconSize} text-blue-200`} />
          5-Year Member
        </span>
      );
    case "2_year":
      return (
        <span
          className={`inline-flex items-center font-bold tracking-wide rounded-full bg-amber-400 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] ${sizeClasses}`}
        >
          <Medal className={`${iconSize} text-slate-900`} />
          2-Year Member
        </span>
      );
    case "none":
    default:
      if (!showDetails) return null;
      return (
        <span
          className={`inline-flex items-center font-bold rounded-full bg-slate-100 text-slate-700 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] ${sizeClasses}`}
        >
          <ShieldAlert className={`${iconSize} text-slate-500`} />
          Non-Member
        </span>
      );
  }
}
