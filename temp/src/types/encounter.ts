// Mirrors backend app/models/encounter.py exactly
// Any change to the FastAPI schema must be reflected here

export type VisitType = "outpatient" | "inpatient" | "ED";

export interface Documentation {
  HPI: string;
  exam: string;
  assessment: string;
}

export interface EncounterRequest {
  visit_type: VisitType;
  chief_complaint: string;
  diagnoses: string[];
  procedures: string[];
  documentation: Documentation;
  billed_code: string;
}

export interface AskRequest {
  question: string;
  billed_code?: string | null;
}

// CPT code display metadata (frontend-only, for the code selector)
export interface CPTCodeMeta {
  code: string;
  description: string;
  setting: "office" | "inpatient" | "ED" | "nursing" | "consultation";
  mdm_level?: "straightforward" | "low" | "moderate" | "high";
}

export const OFFICE_CPT_CODES: CPTCodeMeta[] = [
  { code: "99202", description: "New patient, straightforward MDM", setting: "office", mdm_level: "straightforward" },
  { code: "99203", description: "New patient, low MDM", setting: "office", mdm_level: "low" },
  { code: "99204", description: "New patient, moderate MDM", setting: "office", mdm_level: "moderate" },
  { code: "99205", description: "New patient, high MDM", setting: "office", mdm_level: "high" },
  { code: "99212", description: "Established patient, straightforward MDM", setting: "office", mdm_level: "straightforward" },
  { code: "99213", description: "Established patient, low MDM", setting: "office", mdm_level: "low" },
  { code: "99214", description: "Established patient, moderate MDM", setting: "office", mdm_level: "moderate" },
  { code: "99215", description: "Established patient, high MDM", setting: "office", mdm_level: "high" },
];

export const INPATIENT_CPT_CODES: CPTCodeMeta[] = [
  { code: "99221", description: "Initial hospital care, low severity", setting: "inpatient" },
  { code: "99222", description: "Initial hospital care, moderate severity", setting: "inpatient" },
  { code: "99223", description: "Initial hospital care, high severity", setting: "inpatient" },
  { code: "99231", description: "Subsequent hospital care, low complexity", setting: "inpatient" },
  { code: "99232", description: "Subsequent hospital care, moderate complexity", setting: "inpatient" },
  { code: "99233", description: "Subsequent hospital care, high complexity", setting: "inpatient" },
];

export const ED_CPT_CODES: CPTCodeMeta[] = [
  { code: "99281", description: "ED visit, minimal severity", setting: "ED" },
  { code: "99282", description: "ED visit, low complexity", setting: "ED" },
  { code: "99283", description: "ED visit, moderate complexity", setting: "ED" },
  { code: "99284", description: "ED visit, high complexity", setting: "ED" },
  { code: "99285", description: "ED visit, high complexity with threats to life", setting: "ED" },
];

export const ALL_CPT_CODES: CPTCodeMeta[] = [
  ...OFFICE_CPT_CODES,
  ...INPATIENT_CPT_CODES,
  ...ED_CPT_CODES,
];