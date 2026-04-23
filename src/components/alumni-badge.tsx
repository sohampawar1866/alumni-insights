"use client";

const tierConfig: Record<
  string,
  { label: string; color: string; bg: string; border: string; icon: string }
> = {
  Platinum: {
    label: "PLATINUM",
    color: "text-foreground",
    bg: "bg-[#00ffff]",
    border: "border-foreground",
    icon: "💎",
  },
  Gold: {
    label: "GOLD",
    color: "text-foreground",
    bg: "bg-[#fdc800]",
    border: "border-foreground",
    icon: "🥇",
  },
  Silver: {
    label: "SILVER",
    color: "text-foreground",
    bg: "bg-[#e5e5e5]",
    border: "border-foreground",
    icon: "🥈",
  },
  Bronze: {
    label: "BRONZE",
    color: "text-foreground",
    bg: "bg-[#ff9900]",
    border: "border-foreground",
    icon: "🥉",
  },
  New: {
    label: "NEWBIE",
    color: "text-foreground",
    bg: "bg-[#00ff66]",
    border: "border-foreground",
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
        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-black uppercase tracking-wider border-2 shadow-[2px_2px_0px_var(--color-foreground)] ${config.bg} ${config.color} ${config.border}`}
      >
        <span className="text-sm">{config.icon}</span> {config.label}
      </span>
    );
  }

  return (
    <div
      className={`border-4 border-foreground shadow-[8px_8px_0px_var(--color-foreground)] bg-background p-6 space-y-4`}
    >
      <div className={`flex items-center gap-4 p-3 border-4 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] ${config.bg}`}>
        <span className="text-4xl bg-background rounded-full p-2 border-4 border-foreground">{config.icon}</span>
        <div>
          <p className={`text-xl font-black uppercase tracking-tighter ${config.color}`}>
            {config.label} OPERATIVE
          </p>
          <p className="text-sm font-bold uppercase tracking-wider text-foreground/80 bg-background/50 px-2 py-0.5 inline-block border-2 border-foreground mt-1">
            {completedCount} MISSION{completedCount !== 1 ? "S" : ""} COMPLETED
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t-4 border-dashed border-foreground">
        <div className="text-center bg-secondary border-2 border-foreground shadow-[2px_2px_0px_var(--color-foreground)] p-2 hover:-translate-y-1 transition-transform">
          <p className="text-2xl font-black text-foreground">
            {avgRating > 0 ? avgRating.toFixed(1) : "—"}
          </p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">
            RATING
          </p>
        </div>
        <div className="text-center bg-secondary border-2 border-foreground shadow-[2px_2px_0px_var(--color-foreground)] p-2 hover:-translate-y-1 transition-transform">
          <p className="text-2xl font-black text-foreground">{feedbackCount}</p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">
            REVIEWS
          </p>
        </div>
        <div className="text-center bg-secondary border-2 border-foreground shadow-[2px_2px_0px_var(--color-foreground)] p-2 hover:-translate-y-1 transition-transform">
          <p className="text-2xl font-black text-foreground">
            {acceptanceRate > 0 ? `${acceptanceRate}%` : "—"}
          </p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">
            ACCEPT RATE
          </p>
        </div>
      </div>
    </div>
  );
}
