import { cn } from "@/lib/utils";
import type { DenialRisk } from "@/types/analysis";

interface DenialRiskMeterProps {
  risk: DenialRisk;
  className?: string;
}

const riskConfig = {
  LOW: {
    label: "Low Denial Risk",
    activeIndex: 0,
    color: "text-status-supported",
  },
  MODERATE: {
    label: "Moderate Denial Risk",
    activeIndex: 1,
    color: "text-status-warning",
  },
  HIGH: {
    label: "High Denial Risk",
    activeIndex: 2,
    color: "text-status-denied",
  },
};

const segmentColors = [
  { active: "bg-status-supported shadow-[0_0_8px_rgba(5,150,105,0.6)]", inactive: "bg-surface-elevated" },
  { active: "bg-status-warning shadow-[0_0_8px_rgba(217,119,6,0.6)]", inactive: "bg-surface-elevated" },
  { active: "bg-status-denied shadow-[0_0_8px_rgba(220,38,38,0.6)]", inactive: "bg-surface-elevated" },
];

export function DenialRiskMeter({ risk, className }: DenialRiskMeterProps) {
  const config = riskConfig[risk];

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-secondary uppercase tracking-widest font-medium">
          Denial Risk
        </span>
        <span className={cn("text-sm font-semibold", config.color)}>
          {risk}
        </span>
      </div>
      <div className="flex gap-1.5">
        {segmentColors.map((seg, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 h-2 rounded-full transition-all duration-300",
              i <= config.activeIndex ? seg.active : seg.inactive
            )}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-text-muted">
        <span>LOW</span>
        <span>MODERATE</span>
        <span>HIGH</span>
      </div>
    </div>
  );
}