"use client";

import { useMutation } from "@tanstack/react-query";
import { analyzeEncounter } from "@/lib/api/analyze";
import { useAnalyzeStore } from "@/store/analyzeStore";
import type { EncounterRequest } from "@/types/encounter";

export function useAnalyzeEncounter() {
  const { setCurrentResult, addToHistory } = useAnalyzeStore();

  return useMutation({
    mutationFn: (payload: EncounterRequest) => analyzeEncounter(payload),
    onSuccess: (result, variables) => {
      setCurrentResult(result);
      addToHistory({
        billed_code: variables.billed_code,
        chief_complaint: variables.chief_complaint,
        result,
      });
    },
  });
}