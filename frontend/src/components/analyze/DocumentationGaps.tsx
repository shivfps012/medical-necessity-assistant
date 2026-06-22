import { AlertTriangle } from "lucide-react";

interface DocumentationGapsProps {
  gaps: string[];
}

export function DocumentationGaps({ gaps }: DocumentationGapsProps) {
  if (!gaps || gaps.length === 0) {
    return (
      <div className="text-sm text-text-muted italic py-2">
        No documentation gaps identified.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {gaps.map((gap, i) => (
        <div
          key={i}
          className="flex items-start gap-2.5 p-3 rounded-md bg-status-warning/5 border border-status-warning/20"
        >
          <AlertTriangle className="w-4 h-4 text-status-warning flex-shrink-0 mt-0.5" />
          <p className="text-sm text-text-primary leading-relaxed">{gap}</p>
        </div>
      ))}
    </div>
  );
}