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
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_450px] xl:grid-cols-[1fr_500px] gap-8">
      {/* Input Column */}
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Analyze Encounter</h1>
          <p className="text-sm text-text-secondary mt-1">
            Enter clinical documentation to verify medical necessity against AMA and HAAD guidelines.
          </p>
        </div>
        <div className="bg-surface-card border border-surface-border rounded-xl p-6">
          <EncounterForm onSubmit={(data) => mutate(data)} isLoading={isPending} />
        </div>
      </div>

      {/* Output Column */}
      <div className="bg-surface-card border border-surface-border rounded-xl p-6 h-fit sticky top-6">
        <h2 className="text-lg font-semibold text-text-primary mb-5">Analysis Result</h2>
        
        {isPending ? (
          <ResultSkeleton />
        ) : currentResult ? (
          <AnalysisResult result={currentResult} />
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] text-center border-2 border-dashed border-surface-border rounded-lg">
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