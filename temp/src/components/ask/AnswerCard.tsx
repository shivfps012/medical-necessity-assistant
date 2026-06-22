import { Info } from "lucide-react";

export function InsufficientState() {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-status-neutral/10 border border-status-neutral/20">
      <Info className="w-5 h-5 text-status-neutral flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-text-primary">
          Insufficient information in source documents.
        </p>
        <p className="text-xs text-text-secondary mt-1">
          The question cannot be answered from the five guideline documents
          (AMA 2021, 1997 CMS, JAWDA Part IX, Coding Process Review, HAAD
          Coding Manual). Try rephrasing or ask about specific coding, MDM, or
          UAE compliance topics.
        </p>
      </div>
    </div>
  );
}