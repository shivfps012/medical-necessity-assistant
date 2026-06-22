// src/types/ask.ts

export interface AskRequest {
  question: string;
  billed_code?: string | null;
}

export interface Citation {
  document: string;
  section: string;
  page: string;
}

export interface AskResponse {
  answer: string;
  citation: Citation;
}