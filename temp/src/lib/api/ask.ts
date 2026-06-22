import apiClient from "./client";
import type { AskRequest } from "@/types/encounter";
import type { AskResponse } from "@/types/analysis";

export async function askQuestion(payload: AskRequest): Promise<AskResponse> {
  const { data } = await apiClient.post<AskResponse>("/ask", payload);
  return data;
}