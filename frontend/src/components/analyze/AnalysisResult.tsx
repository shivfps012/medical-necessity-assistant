"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { VerdictBadge } from "./VerdictBadge";
import { DenialRiskMeter } from "./DenialRiskMeter";
import { DocumentationGaps } from "./DocumentationGaps";
import { CitationBlock } from "./CitationBlock";
import { Separator } from "@/components/ui/separator";
import type { AnalyzeResponse } from "@/types/analysis";

interface AnalysisResultProps {
  result: AnalyzeResponse;
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {/* Verdict */}
      <VerdictBadge
        supported={result.supported}
        billedCode={result.billed_code}
      />

      {/* Recommended code */}
      {result.recommended_code && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-text-muted">Recommended:</span>
          <div className="flex items-center gap-1 font-mono text-text-accent">
            <span className="line-through text-text-muted">
              {result.billed_code}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
            <span className="font-semibold">{result.recommended_code}</span>
          </div>
        </div>
      )}

      <Separator />

      {/* Denial Risk */}
      <DenialRiskMeter risk={result.denial_risk} />

      <Separator />

      {/* Reasoning */}
      <div className="space-y-2">
        <p className="text-xs text-text-muted uppercase tracking-widest font-medium">
          Reasoning
        </p>
        <p className="text-sm text-text-primary leading-relaxed">
          {result.reasoning}
        </p>
      </div>

      <Separator />

      {/* Documentation Gaps */}
      <div className="space-y-2">
        <p className="text-xs text-text-muted uppercase tracking-widest font-medium">
          Documentation Gaps
        </p>
        <DocumentationGaps gaps={result.documentation_gaps} />
      </div>

      {/* Citation */}
      <CitationBlock citation={result.citation} />
    </motion.div>
  );
}