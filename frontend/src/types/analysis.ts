// Mirrors backend app/models/response.py exactly

export type DenialRisk = "LOW" | "MODERATE" | "HIGH";

export interface Citation {
  document: string;
  section: string;
  page: string;
}

export interface AnalyzeResponse {
  billed_code: string;
  supported: boolean;
  reasoning: string;
  documentation_gaps: string[];
  denial_risk: DenialRisk;
  recommended_code: string | null;
  citation: Citation;
}

export interface AskResponse {
  answer: string;
  citation: Citation;
}

// Frontend-only: enriched history entry stored in Zustand
export interface AnalysisHistoryEntry {
  id: string;
  timestamp: string;
  billed_code: string;
  chief_complaint: string;
  result: AnalyzeResponse;
}

export interface QuestionHistoryEntry {
  id: string;
  timestamp: string;
  question: string;
  billed_code?: string | null;
  result: AskResponse;
}