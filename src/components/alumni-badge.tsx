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
    bg: "bg-gradient-to-r from-slate-100 to-slate-200",
    border: "border-slate-300",
    Icon: Gem,
  },
  Gold: {
    label: "Gold Mentor",
    color: "text-amber-900",
    bg: "bg-amber-50",
    border: "border-amber-200",
    Icon: Trophy,
  },
  Silver: {
    label: "Silver Mentor",
    color: "text-slate-800",
    bg: "bg-slate-50",
    border: "border-slate-200",
    Icon: Award,
  },
  Bronze: {
    label: "Bronze Mentor",
    color: "text-amber-800",
    bg: "bg-amber-50/50",
    border: "border-amber-200/80",
    Icon: Medal,
  },
  New: {
    label: "New Mentor",
    color: "text-emerald-900",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
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
        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border shadow-sm ${config.bg} ${config.color} ${config.border}`}
      >
        <Icon className="w-3.5 h-3.5" strokeWidth={2} /> {config.label}
      </span>
    );
  }

  return (
    <div
      className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4"
    >
      <div className={`flex items-center gap-3.5 p-4 rounded-lg border ${config.bg} ${config.border}`}>
        <div className="bg-white rounded-lg p-2 border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6 text-slate-900" strokeWidth={2} />
        </div>
        <div>
          <p className={`text-base font-bold ${config.color}`}>
            {config.label}
          </p>
          <p className="text-xs font-medium text-slate-600 mt-0.5">
            {completedCount} session{completedCount !== 1 ? "s" : ""} completed
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-2">
        <div className="text-center bg-slate-50 border border-slate-200/80 rounded-lg p-3">
          <p className="text-xl font-bold text-slate-900">
            {avgRating > 0 ? avgRating.toFixed(1) : "—"}
          </p>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5">
            Rating
          </p>
        </div>
        <div className="text-center bg-slate-50 border border-slate-200/80 rounded-lg p-3">
          <p className="text-xl font-bold text-slate-900">{feedbackCount}</p>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5">
            Reviews
          </p>
        </div>
        <div className="text-center bg-slate-50 border border-slate-200/80 rounded-lg p-3">
          <p className="text-xl font-bold text-slate-900">
            {acceptanceRate > 0 ? `${acceptanceRate}%` : "—"}
          </p>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5">
            Accept Rate
          </p>
        </div>
      </div>
    </div>
  );
}
