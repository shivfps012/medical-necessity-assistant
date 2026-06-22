import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        supported: "bg-status-supported/20 text-status-supported border border-status-supported/30",
        denied: "bg-status-denied/20 text-status-denied border border-status-denied/30",
        warning: "bg-status-warning/20 text-status-warning border border-status-warning/30",
        neutral: "bg-status-neutral/20 text-text-secondary border border-surface-border",
        low: "bg-status-supported/20 text-status-supported border border-status-supported/30",
        moderate: "bg-status-warning/20 text-status-warning border border-status-warning/30",
        high: "bg-status-denied/20 text-status-denied border border-status-denied/30",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };