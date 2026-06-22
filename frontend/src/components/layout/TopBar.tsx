"use client";

import { usePathname } from "next/navigation";
import { ChevronRight, Menu } from "lucide-react";

const breadcrumbMap: Record<string, string> = {
  dashboard: "Dashboard",
  analyze: "Analyze Encounter",
  ask: "Clinical Assistant",
  history: "History",
  settings: "Settings",
};

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-surface-border bg-surface-base/80 px-4 backdrop-blur-sm sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-surface-border text-text-secondary transition-colors hover:bg-surface-elevated hover:text-text-primary lg:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>
      <nav className="flex min-w-0 items-center gap-1.5 text-sm">
        {segments.map((segment, i) => {
          const isLast = i === segments.length - 1;
          const label = breadcrumbMap[segment] || segment;
          return (
            <span key={segment} className="flex min-w-0 items-center gap-1.5">
              {i > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
              )}
              <span
                className={
                  isLast
                    ? "truncate text-text-primary font-medium"
                    : "truncate text-text-muted"
                }
              >
                {label}
              </span>
            </span>
          );
        })}
      </nav>
    </header>
  );
}
