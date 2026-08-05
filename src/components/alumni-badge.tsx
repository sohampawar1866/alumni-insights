"use client";

import { Gem, Award, Medal, Trophy, Sprout } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const tierConfig: Record<
  string,
  { label: string; color: string; bg: string; border: string; Icon: LucideIcon }
> = {
  Platinum: {
    label: "Platinum Mentor",
    color: "text-slate-900",
    bg: "bg-cyan-300",
    border: "border-slate-900",
    Icon: Gem,
  },
  Gold: {
    label: "Gold Mentor",
    color: "text-slate-900",
    bg: "bg-amber-400",
    border: "border-slate-900",
    Icon: Trophy,
  },
  Silver: {
    label: "Silver Mentor",
    color: "text-slate-900",
    bg: "bg-slate-200",
    border: "border-slate-900",
    Icon: Award,
  },
  Bronze: {
    label: "Bronze Mentor",
    color: "text-slate-900",
    bg: "bg-orange-300",
    border: "border-slate-900",
    Icon: Medal,
  },
  New: {
    label: "New Mentor",
    color: "text-slate-900",
    bg: "bg-emerald-300",
    border: "border-slate-900",
    Icon: Sprout,
  },
};

type Props = {
  tier: string;
  completedCount: number;
  avgRating: number;
  feedbackCount: number;
  acceptanceRate: number;
  compact?: boolean;
};

export function AlumniBadge({
  tier,
  completedCount,
  avgRating,
  feedbackCount,
  acceptanceRate,
  compact = false,
}: Props) {
  const config = tierConfig[tier] || tierConfig.New;
  const { Icon } = config;

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg border-2 shadow-[2px_2px_0px_#0f172a] ${config.bg} ${config.color} ${config.border}`}
      >
        <Icon className="w-3.5 h-3.5" strokeWidth={2.5} /> {config.label}
      </span>
    );
  }

  return (
    <div
      className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[5px_5px_0px_#0f172a] space-y-4"
    >
      <div className={`flex items-center gap-4 p-4 rounded-xl border-2 ${config.bg} ${config.border} shadow-[3px_3px_0px_#0f172a]`}>
        <div className="bg-white rounded-xl p-2.5 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6 text-slate-900" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-lg font-bold text-slate-900 font-heading">
            {config.label}
          </p>
          <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mt-0.5">
            {completedCount} session{completedCount !== 1 ? "s" : ""} completed
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-2">
        <div className="text-center bg-slate-100 border-2 border-slate-900 rounded-xl p-3 shadow-[2px_2px_0px_#0f172a]">
          <p className="text-2xl font-bold text-slate-900 font-heading">
            {avgRating > 0 ? avgRating.toFixed(1) : "-"}
          </p>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mt-0.5">
            Rating
          </p>
        </div>
        <div className="text-center bg-slate-100 border-2 border-slate-900 rounded-xl p-3 shadow-[2px_2px_0px_#0f172a]">
          <p className="text-2xl font-bold text-slate-900 font-heading">{feedbackCount}</p>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mt-0.5">
            Reviews
          </p>
        </div>
        <div className="text-center bg-slate-100 border-2 border-slate-900 rounded-xl p-3 shadow-[2px_2px_0px_#0f172a]">
          <p className="text-2xl font-bold text-slate-900 font-heading">
            {acceptanceRate > 0 ? `${acceptanceRate}%` : "-"}
          </p>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mt-0.5">
            Accept Rate
          </p>
        </div>
      </div>
    </div>
  );
}
