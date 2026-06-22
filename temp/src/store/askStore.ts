import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AskResponse, QuestionHistoryEntry } from "@/types/analysis";
import { generateId } from "@/lib/utils";

interface AskStore {
  // Current active answer
  currentAnswer: AskResponse | null;
  currentQuestion: string;
  setCurrentAnswer: (question: string, answer: AskResponse | null) => void;

  // Session history (persisted)
  history: QuestionHistoryEntry[];
  addToHistory: (entry: Omit<QuestionHistoryEntry, "id" | "timestamp">) => void;
  clearHistory: () => void;
}

export const useAskStore = create<AskStore>()(
  persist(
    (set) => ({
      currentAnswer: null,
      currentQuestion: "",
      setCurrentAnswer: (question, answer) =>
        set({ currentQuestion: question, currentAnswer: answer }),

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
          ].slice(0, 100),
        })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "ask-store",
      partialize: (state) => ({ history: state.history }),
    }
  )
);