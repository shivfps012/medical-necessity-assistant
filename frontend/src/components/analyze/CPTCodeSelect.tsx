"use client";

import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ALL_CPT_CODES } from "@/types/encounter";

interface CPTCodeSelectProps {
  value: string;
  onChange: (code: string) => void;
  error?: string;
}

const mdmColors: Record<string, string> = {
  straightforward: "text-text-secondary",
  low: "text-primary-400",
  moderate: "text-status-warning",
  high: "text-status-denied",
};

export function CPTCodeSelect({ value, onChange, error }: CPTCodeSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selected = ALL_CPT_CODES.find((c) => c.code === value);
  const filtered = ALL_CPT_CODES.filter(
    (c) =>
      c.code.includes(search) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-10 w-full min-w-0 items-center justify-between rounded-md border bg-surface-input px-3 text-sm transition-colors",
          error ? "border-status-denied" : "border-surface-border",
          open ? "ring-2 ring-primary-500 border-transparent" : "hover:border-primary-800"
        )}
      >
        <span
          className={cn(
            "min-w-0 truncate text-left font-mono",
            selected
              ? selected.mdm_level
                ? mdmColors[selected.mdm_level]
                : "text-text-primary"
              : "text-text-muted"
          )}
        >
          {selected ? `${selected.code} — ${selected.description}` : "Select CPT code"}
        </span>
        <ChevronDown className={cn("h-4 w-4 flex-shrink-0 text-text-muted transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full min-w-0 rounded-md border border-surface-border bg-surface-card shadow-xl">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-surface-border">
            <Search className="w-3.5 h-3.5 text-text-muted" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search codes..."
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
            />
          </div>

          {/* Options */}
          <div className="max-h-64 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <p className="text-sm text-text-muted px-3 py-2">No codes found</p>
            )}
            {filtered.map((code) => (
              <button
                key={code.code}
                type="button"
                onClick={() => {
                  onChange(code.code);
                  setOpen(false);
                  setSearch("");
                }}
                className={cn(
                  "flex w-full min-w-0 items-start gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-surface-elevated",
                  value === code.code && "bg-primary-900"
                )}
              >
                <span
                  className={cn(
                    "font-mono font-semibold w-14 flex-shrink-0",
                    code.mdm_level ? mdmColors[code.mdm_level] : "text-text-primary"
                  )}
                >
                  {code.code}
                </span>
                <span className="min-w-0 text-xs leading-tight text-text-secondary">
                  {code.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-xs text-status-denied mt-1">{error}</p>}
    </div>
  );
}
