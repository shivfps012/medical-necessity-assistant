import { z } from "zod";

export const documentationSchema = z.object({
  HPI: z
    .string()
    .min(10, "HPI must be at least 10 characters")
    .max(2000, "HPI is too long"),
  exam: z
    .string()
    .min(10, "Exam findings must be at least 10 characters")
    .max(2000, "Exam is too long"),
  assessment: z
    .string()
    .min(10, "Assessment must be at least 10 characters")
    .max(2000, "Assessment is too long"),
});

export const encounterSchema = z.object({
  visit_type: z.enum(["outpatient", "inpatient", "ED"], {
    required_error: "Visit type is required",
  }),
  chief_complaint: z
    .string()
    .min(5, "Chief complaint is too short")
    .max(500, "Chief complaint is too long"),
  diagnoses: z
    .array(z.string().min(1))
    .min(1, "At least one diagnosis is required")
    .max(20, "Too many diagnoses"),
  procedures: z.array(z.string().min(1)).max(20, "Too many procedures"),
  documentation: documentationSchema,
  billed_code: z
    .string()
    .min(5, "CPT code required")
    .regex(/^\d{5}$/, "CPT code must be 5 digits"),
});

export type EncounterFormValues = z.infer<typeof encounterSchema>;