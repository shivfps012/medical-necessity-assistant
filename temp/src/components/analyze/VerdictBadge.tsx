import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerdictBadgeProps {
  supported: boolean;
  billedCode: string;
  className?: string;
}

export function VerdictBadge({ supported, billedCode, className }: VerdictBadgeProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-5 py-4 rounded-lg border",
        supported
          ? "bg-status-supported/10 border-status-supported/30"
          : "bg-status-denied/10 border-status-denied/30",
        className
      )}
    >
      {supported ? (
        <CheckCircle2 className="w-7 h-7 text-status-supported flex-shrink-0" />
      ) : (
        <XCircle className="w-7 h-7 text-status-denied flex-shrink-0" />
      )}
      <div>
        <p
          className={cn(
            "text-xl font-bold tracking-wide",
            supported ? "text-status-supported" : "text-status-denied"
          )}
        >
          {supported ? "SUPPORTED" : "NOT SUPPORTED"}
        </p>
        <p className="text-sm text-text-secondary font-mono mt-0.5">
          CPT {billedCode}
        </p>
      </div>
    </div>
  );
}