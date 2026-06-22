"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, FileText } from "lucide-react";
import { useAnalyzeStore } from "@/store/analyzeStore";
import { AnalysisResult } from "@/components/analyze/AnalysisResult";
import { Button } from "@/components/ui/button";
import { formatTimestamp } from "@/lib/utils";
import type { AnalysisHistoryEntry } from "@/types/analysis";

interface PageProps {
  params: {
    id: string;
  };
}

export default function AnalysisDetailPage({ params }: PageProps) {
  const { history } = useAnalyzeStore();
  const [entry, setEntry] = useState<AnalysisHistoryEntry | null>(null);

  useEffect(() => {
    // Find the specific analysis from local history matching the ID in the URL
    const foundEntry = history.find((item) => item.id === params.id);
    if (foundEntry) {
      setEntry(foundEntry);
    }
  }, [params.id, history]);

  if (!entry) {
    return (
      <div className="p-6 md:p-8 max-w-3xl mx-auto text-center space-y-4 pt-20">
        <div className="w-12 h-12 rounded-full bg-surface-elevated flex items-center justify-center mx-auto text-text-muted">
          <FileText className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-text-primary">Analysis Not Found</h1>
        <p className="text-sm text-text-secondary max-w-sm mx-auto">
          This record might have been cleared or doesn't exist in your local browser history.
        </p>
        <Link href="/history" passHref>
          <Button variant="outline" size="sm" className="mt-2">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to History
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      {/* Header / Navigation back */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-5">
        <div className="space-y-1">
          <Link href="/history" className="text-xs text-text-accent hover:text-primary-400 flex items-center gap-1.5 mb-2 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to History
          </Link>
          <h1 className="text-2xl font-bold text-text-primary font-mono">
            Analysis Report: CPT {entry.billed_code}
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Clock className="w-3.5 h-3.5" />
            <span>Analyzed on {formatTimestamp(entry.timestamp)}</span>
          </div>
        </div>
      </div>

      {/* Main Analysis Display Panel */}
      <div className="bg-surface-card border border-surface-border rounded-xl p-6 shadow-xl">
        <AnalysisResult result={entry.result} />
      </div>

      {/* Original Submitted Details Context */}
      <div className="bg-surface-card/40 border border-surface-border/60 rounded-xl p-6 space-y-4">
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          Submitted Clinical Context
        </h3>
        
        <div>
          <span className="text-xs text-text-secondary uppercase tracking-widest block mb-1">Chief Complaint</span>
          <p className="text-sm text-text-primary font-medium">{entry.chief_complaint}</p>
        </div>
      </div>
    </div>
  );
}