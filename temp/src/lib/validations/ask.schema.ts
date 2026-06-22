import { z } from "zod";

export const askSchema = z.object({
  question: z
    .string()
    .min(10, "Question must be at least 10 characters")
    .max(1000, "Question is too long"),
  billed_code: z
    .string()
    .regex(/^\d{5}$/, "CPT code must be 5 digits")
    .optional()
    .or(z.literal("")),
});

export type AskFormValues = z.infer<typeof askSchema>;