"use client";

import { QuestionForm } from "@/components/ask/QuestionForm";
import { QuestionHistory } from "@/components/ask/QuestionHistory";
import { InsufficientState } from "@/components/ask/InsufficientState";
import { CitationBlock } from "@/components/analyze/CitationBlock";
import { useAskQuestion } from "@/hooks/useAskQuestion";
import { useAskStore } from "@/store/askStore";

export default function AskPage() {
  const { mutate, isPending } = useAskQuestion();
  const { currentAnswer, currentQuestion } = useAskStore();

  const isInsufficient = currentAnswer?.answer?.toLowerCase().includes("insufficient information") || 
                         currentAnswer?.answer?.toLowerCase().includes("cannot be answered");

  return (
    <div className="flex h-full overflow-hidden">
      {/* History Sidebar */}
      <div className="w-80 border-r border-surface-border bg-surface-base/50 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-surface-border">
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Session History</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <QuestionHistory />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-surface-card">
        {/* Answer Output */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-3xl mx-auto space-y-6">
            {!currentAnswer && !isPending && (
              <div className="flex flex-col items-center justify-center h-full pt-20 text-center">
                <div className="w-12 h-12 rounded-full bg-surface-elevated flex items-center justify-center mb-4">
                  <span className="text-2xl">💡</span>
                </div>
                <h3 className="text-lg font-medium text-text-primary">Clinical Assistant</h3>
                <p className="text-sm text-text-muted mt-2 max-w-sm">
                  Ask questions about AMA 2021, 1997 CMS, JAWDA Part IX, or HAAD coding manuals.
                </p>
              </div>
            )}

            {currentQuestion && (
              <div className="bg-surface-elevated/50 border border-surface-border rounded-lg p-5">
                <p className="text-xs text-text-muted uppercase tracking-widest font-medium mb-2">Question</p>
                <p className="text-sm text-text-primary">{currentQuestion}</p>
              </div>
            )}

            {isPending && (
              <div className="flex items-center gap-3 text-sm text-text-muted p-4">
                <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                Searching guidelines and formulating answer...
              </div>
            )}

            {!isPending && currentAnswer && (
              <div className="space-y-4">
                {isInsufficient ? (
                  <InsufficientState />
                ) : (
                  <div className="bg-primary-900/10 border border-primary-800/30 rounded-lg p-5 space-y-4">
                    <p className="text-xs text-primary-400 uppercase tracking-widest font-medium">Answer</p>
                    <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
                      {currentAnswer.answer}
                    </p>
                    <CitationBlock citation={currentAnswer.citation} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Question Input */}
        <div className="p-6 border-t border-surface-border bg-surface-base">
          <div className="max-w-3xl mx-auto">
            <QuestionForm onSubmit={(data) => mutate(data)} isLoading={isPending} />
          </div>
        </div>
      </div>
    </div>
  );
}