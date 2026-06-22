"use client";

import { useAskStore } from "@/store/askStore";
import { formatTimestamp, truncate } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

export function QuestionHistory() {
  const { history, setCurrentAnswer } = useAskStore();

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted">
        <MessageSquare className="w-6 h-6 mx-auto mb-2 opacity-40" />
        <p className="text-xs">No questions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {history.map((entry) => (
        <button
          key={entry.id}
          onClick={() => setCurrentAnswer(entry.question, entry.result)}
          className="w-full text-left px-3 py-2.5 rounded-md hover:bg-surface-elevated transition-colors group"
        >
          <p className="text-xs text-text-secondary leading-snug group-hover:text-text-primary transition-colors">
            {truncate(entry.question, 72)}
          </p>
          <p className="text-xs text-text-muted mt-0.5">
            {formatTimestamp(entry.timestamp)}
          </p>
        </button>
      ))}
    </div>
  );
}