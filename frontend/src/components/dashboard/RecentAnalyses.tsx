"use client";

import Link from "next/link";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { useAnalyzeStore } from "@/store/analyzeStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatTimestamp, truncate } from "@/lib/utils";
import type { DenialRisk } from "@/types/analysis";

const riskVariant: Record<DenialRisk, "low" | "moderate" | "high"> = {
  LOW: "low",
  MODERATE: "moderate",
  HIGH: "high",
};

export function RecentAnalyses() {
  const { history } = useAnalyzeStore();
  const recent = history.slice(0, 5);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base">Recent Analyses</CardTitle>
          <Link
            href="/history"
            className="text-xs text-text-accent hover:text-primary-400 flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-4">
            No analyses yet.{" "}
            <Link href="/analyze" className="text-text-accent hover:underline">
              Analyze an encounter
            </Link>
          </p>
        ) : (
          <div className="divide-y divide-surface-border">
            {recent.map((entry) => (
              <div key={entry.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-3">
                {entry.result.supported ? (
                  <CheckCircle2 className="w-4 h-4 text-status-supported flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-status-denied flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-text-primary font-mono">
                    CPT {entry.billed_code}
                  </p>
                  <p className="text-xs text-text-secondary truncate">
                    {truncate(entry.chief_complaint, 60)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:flex-shrink-0 sm:flex-nowrap">
                  <Badge variant={riskVariant[entry.result.denial_risk]}>
                    {entry.result.denial_risk}
                  </Badge>
                  <span className="text-xs text-text-muted">
                    {formatTimestamp(entry.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
