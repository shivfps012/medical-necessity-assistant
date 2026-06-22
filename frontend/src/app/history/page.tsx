"use client";

import { useAnalyzeStore } from "@/store/analyzeStore";
import { useAskStore } from "@/store/askStore";
import { formatTimestamp } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function HistoryPage() {
  const { history: analyses } = useAnalyzeStore();
  const { history: questions } = useAskStore();

  return (
    <div className="w-full max-w-5xl space-y-8 p-4 sm:p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">History</h1>
        <p className="text-sm text-text-secondary mt-1">Locally cached history of your analyses and questions.</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-semibold border-b border-surface-border pb-2">Recent Encounters</h2>
        {analyses.length === 0 ? (
          <p className="text-sm text-text-muted">No encounters analyzed yet.</p>
        ) : (
          <div className="space-y-3">
            {analyses.map(entry => (
              <div key={entry.id} className="flex flex-col gap-3 rounded-lg border border-surface-border bg-surface-card p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-mono text-text-primary mb-1">CPT {entry.billed_code}</p>
                  <p className="text-xs text-text-secondary max-w-xl truncate">{entry.chief_complaint}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap sm:gap-4">
                  <Badge variant={entry.result.supported ? "supported" : "denied"}>
                    {entry.result.supported ? "SUPPORTED" : "DENIED"}
                  </Badge>
                  <span className="text-xs text-text-muted">{formatTimestamp(entry.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-semibold border-b border-surface-border pb-2 mt-8">Recent Questions</h2>
        {questions.length === 0 ? (
          <p className="text-sm text-text-muted">No questions asked yet.</p>
        ) : (
          <div className="space-y-3">
            {questions.map(entry => (
              <div key={entry.id} className="bg-surface-card border border-surface-border p-4 rounded-lg">
                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <p className="max-w-2xl text-sm text-text-primary">{entry.question}</p>
                  <span className="flex-shrink-0 text-xs text-text-muted">{formatTimestamp(entry.timestamp)}</span>
                </div>
                {entry.billed_code && (
                  <span className="text-xs font-mono bg-surface-elevated px-2 py-1 rounded text-text-secondary">
                    Context: CPT {entry.billed_code}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
