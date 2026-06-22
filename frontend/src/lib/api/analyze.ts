import apiClient from "./client";
import type { EncounterRequest } from "@/types/encounter";
import type { AnalyzeResponse } from "@/types/analysis";

export async function analyzeEncounter(
  payload: EncounterRequest
): Promise<AnalyzeResponse> {
  const { data } = await apiClient.post<AnalyzeResponse>(
    "/analyze-encounter",
    payload
  );
  return data;
}