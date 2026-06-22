"use client";

import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const breadcrumbMap: Record<string, string> = {
  dashboard: "Dashboard",
  analyze: "Analyze Encounter",
  ask: "Clinical Assistant",
  history: "History",
  settings: "Settings",
};

export function TopBar() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="h-14 border-b border-surface-border bg-surface-base/80 backdrop-blur-sm flex items-center px-6 sticky top-0 z-40">
      <nav className="flex items-center gap-1.5 text-sm">
        {segments.map((segment, i) => {
          const isLast = i === segments.length - 1;
          const label = breadcrumbMap[segment] || segment;
          return (
            <span key={segment} className="flex items-center gap-1.5">
              {i > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
              )}
              <span
                className={
                  isLast
                    ? "text-text-primary font-medium"
                    : "text-text-muted"
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