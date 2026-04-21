"use client";

const tierConfig: Record<
  string,
  { label: string; color: string; bg: string; border: string; icon: string }
> = {
  Platinum: {
    label: "Platinum",
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    icon: "💎",
  },
  Gold: {
    label: "Gold",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: "🥇",
  },
  Silver: {
    label: "Silver",
    color: "text-slate-600",
    bg: "bg-slate-50",
    border: "border-slate-300",
    icon: "🥈",
  },
  Bronze: {
    label: "Bronze",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
    icon: "🥉",
  },
  New: {
    label: "New Member",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "🌱",
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

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${config.bg} ${config.color} ${config.border} border`}
      >
        {config.icon} {config.label}
      </span>
    );
  }

  return (
    <div
      className={`rounded-xl border ${config.border} ${config.bg} p-4 space-y-3`}
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl">{config.icon}</span>
        <div>
          <p className={`text-sm font-bold ${config.color}`}>
            {config.label} Mentor
          </p>
          <p className="text-xs text-slate-500">
            {completedCount} session{completedCount !== 1 ? "s" : ""} completed
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-dashed border-slate-200">
        <div className="text-center">
          <p className="text-lg font-bold text-slate-900">
            {avgRating > 0 ? avgRating.toFixed(1) : "—"}
          </p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wide">
            Avg Rating
          </p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-slate-900">{feedbackCount}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wide">
            Reviews
          </p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-slate-900">
            {acceptanceRate > 0 ? `${acceptanceRate}%` : "—"}
          </p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wide">
            Accept Rate
          </p>
        </div>
      </div>
    </div>
  );
}
