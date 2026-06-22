import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AnalyzeResponse, AnalysisHistoryEntry } from "@/types/analysis";
import { generateId } from "@/lib/utils";

interface AnalyzeStore {
  // Current result
  currentResult: AnalyzeResponse | null;
  setCurrentResult: (result: AnalyzeResponse | null) => void;

  // History (persisted to localStorage)
  history: AnalysisHistoryEntry[];
  addToHistory: (entry: Omit<AnalysisHistoryEntry, "id" | "timestamp">) => void;
  clearHistory: () => void;
}

export const useAnalyzeStore = create<AnalyzeStore>()(
  persist(
    (set) => ({
      currentResult: null,
      setCurrentResult: (result) => set({ currentResult: result }),

      history: [],
      addToHistory: (entry) =>
        set((state) => ({
          history: [
            {
              ...entry,
              id: generateId(),
              timestamp: new Date().toISOString(),
            },
            ...state.history,
          ].slice(0, 50), // Keep last 50
        })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "analyze-store",
      partialize: (state) => ({ history: state.history }),
    }
  )
);