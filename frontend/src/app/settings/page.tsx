"use client";

import { useAnalyzeStore } from "@/store/analyzeStore";
import { useAskStore } from "@/store/askStore";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { clearHistory: clearAnalyses } = useAnalyzeStore();
  const { clearHistory: clearQuestions } = useAskStore();

  const handleClearAll = () => {
    if(confirm("Are you sure you want to clear all local history?")) {
      clearAnalyses();
      clearQuestions();
      alert("History cleared successfully.");
    }
  };

  return (
    <div className="w-full max-w-3xl space-y-6 p-4 sm:p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary mt-1">Manage application preferences and data.</p>
      </div>

      <div className="space-y-4 rounded-lg border border-surface-border bg-surface-card p-4 sm:p-6">
        <div>
          <h3 className="text-base font-semibold text-text-primary">Data Management</h3>
          <p className="text-sm text-text-muted mt-1">
            Your analysis and question history is stored locally in your browser. Clearing this data will not affect the backend server.
          </p>
        </div>
        <Button variant="destructive" onClick={handleClearAll}>
          Clear All Local History
        </Button>
      </div>
    </div>
  );
}
