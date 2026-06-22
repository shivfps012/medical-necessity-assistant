"use client";

import { useMutation } from "@tanstack/react-query";
import { askQuestion } from "@/lib/api/ask";
import { useAskStore } from "@/store/askStore";
import type { AskRequest } from "@/types/encounter";

export function useAskQuestion() {
  const { setCurrentAnswer, addToHistory } = useAskStore();

  return useMutation({
    mutationFn: (payload: AskRequest) => askQuestion(payload),
    onSuccess: (result, variables) => {
      setCurrentAnswer(variables.question, result);
      addToHistory({
        question: variables.question,
        billed_code: variables.billed_code,
        result,
      });
    },
  });
}