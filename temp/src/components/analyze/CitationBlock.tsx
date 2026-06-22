import { BookOpen } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { Citation } from "@/types/analysis";

interface CitationBlockProps {
  citation: Citation;
}

export function CitationBlock({ citation }: CitationBlockProps) {
  const isNone = citation.document === "None";

  if (isNone) return null;

  return (
    <div className="space-y-3">
      <Separator />
      <div className="flex items-start gap-2.5">
        <BookOpen className="w-3.5 h-3.5 text-text-muted mt-0.5 flex-shrink-0" />
        <div className="space-y-0.5">
          <p className="text-xs text-text-muted uppercase tracking-widest font-medium">
            Source
          </p>
          <p className="text-sm font-mono text-text-accent font-medium">
            {citation.document}
          </p>
          {citation.section && citation.section !== "None" && (
            <p className="text-xs text-text-secondary italic">
              {citation.section}
            </p>
          )}
          {citation.page && citation.page !== "N/A" && (
            <p className="text-xs text-text-muted font-mono">
              Page {citation.page}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}