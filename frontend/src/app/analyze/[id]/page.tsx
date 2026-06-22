"use client";

import Link from "next/link";
import { ArrowLeft, Clock, FileText } from "lucide-react";
import { useAnalyzeStore } from "@/store/analyzeStore";
import { AnalysisResult } from "@/components/analyze/AnalysisResult";
import { Button } from "@/components/ui/button";
import { formatTimestamp } from "@/lib/utils";

interface PageProps {
  params: {
    id: string;
  };
}

export default function AnalysisDetailPage({ params }: PageProps) {
  const { history } = useAnalyzeStore();
  const entry = history.find((item) => item.id === params.id);

  if (!entry) {
    return (
      <div className="w-full max-w-3xl space-y-4 p-4 pt-20 text-center sm:p-6 md:p-8">
        <div className="w-12 h-12 rounded-full bg-surface-elevated flex items-center justify-center mx-auto text-text-muted">
          <FileText className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-text-primary">Analysis Not Found</h1>
        <p className="text-sm text-text-secondary max-w-sm mx-auto">
          This record might have been cleared or doesn&apos;t exist in your local browser history.
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
    <div className="w-full max-w-3xl space-y-6 p-4 sm:p-6 md:p-8">
      {/* Header / Navigation back */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-5">
        <div className="space-y-1">
          <Link href="/history" className="text-xs text-text-accent hover:text-primary-400 flex items-center gap-1.5 mb-2 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to History
          </Link>
          <h1 className="break-words font-mono text-xl font-bold text-text-primary sm:text-2xl">
            Analysis Report: CPT {entry.billed_code}
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Clock className="w-3.5 h-3.5" />
            <span className="min-w-0">Analyzed on {formatTimestamp(entry.timestamp)}</span>
          </div>
        </div>
      </div>

      {/* Main Analysis Display Panel */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-4 shadow-xl sm:p-6">
        <AnalysisResult result={entry.result} />
      </div>

      {/* Original Submitted Details Context */}
      <div className="space-y-4 rounded-xl border border-surface-border/60 bg-surface-card/40 p-4 sm:p-6">
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
