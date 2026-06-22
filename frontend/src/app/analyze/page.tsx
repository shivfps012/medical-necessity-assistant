"use client";

import { EncounterForm } from "@/components/analyze/EncounterForm";
import { AnalysisResult } from "@/components/analyze/AnalysisResult";
import { ResultSkeleton } from "@/components/analyze/ResultSkeleton";
import { useAnalyzeEncounter } from "@/hooks/useAnalyzeEncounter";
import { useAnalyzeStore } from "@/store/analyzeStore";

export default function AnalyzePage() {
  const { mutate, isPending } = useAnalyzeEncounter();
  const { currentResult } = useAnalyzeStore();

  return (
    <div className="grid w-full grid-cols-1 gap-4 p-4 sm:p-6 md:p-8 xl:grid-cols-[minmax(0,1fr)_minmax(360px,500px)] xl:gap-8">
      {/* Input Column */}
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Analyze Encounter</h1>
          <p className="text-sm text-text-secondary mt-1">
            Enter clinical documentation to verify medical necessity against AMA and HAAD guidelines.
          </p>
        </div>
        <div className="rounded-xl border border-surface-border bg-surface-card p-4 sm:p-6">
          <EncounterForm onSubmit={(data) => mutate(data)} isLoading={isPending} />
        </div>
      </div>

      {/* Output Column */}
      <div className="h-fit rounded-xl border border-surface-border bg-surface-card p-4 sm:p-6 xl:sticky xl:top-20">
        <h2 className="text-lg font-semibold text-text-primary mb-5">Analysis Result</h2>
        
        {isPending ? (
          <ResultSkeleton />
        ) : currentResult ? (
          <AnalysisResult result={currentResult} />
        ) : (
          <div className="flex min-h-[280px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-surface-border text-center sm:min-h-[400px]">
            <p className="text-sm text-text-secondary">No analysis yet</p>
            <p className="text-xs text-text-muted mt-1 max-w-[250px]">
              Fill out the encounter form and click analyze to see compliance results here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
