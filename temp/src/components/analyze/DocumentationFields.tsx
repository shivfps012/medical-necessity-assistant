"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { EncounterFormValues } from "@/lib/validations/encounter.schema";

interface DocumentationFieldsProps {
  register: UseFormRegister<EncounterFormValues>;
  errors: FieldErrors<EncounterFormValues>;
}

export function DocumentationFields({ register, errors }: DocumentationFieldsProps) {
  return (
    <div className="space-y-3 border border-surface-border rounded-lg p-4 bg-surface-base/50">
      <p className="text-xs text-text-muted uppercase tracking-widest font-medium">
        Clinical Documentation
      </p>
      
      <div>
        <label className="block text-xs text-text-secondary uppercase tracking-widest font-medium mb-1.5">
          HPI — History of Present Illness <span className="text-status-denied ml-1">*</span>
        </label>
        <Textarea
          rows={3}
          placeholder="Describe the patient's presenting history..."
          {...register("documentation.HPI")}
          className={errors.documentation?.HPI ? "border-status-denied" : ""}
        />
        {errors.documentation?.HPI && (
          <p className="text-xs text-status-denied mt-1">{errors.documentation.HPI.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs text-text-secondary uppercase tracking-widest font-medium mb-1.5">
          Exam Findings <span className="text-status-denied ml-1">*</span>
        </label>
        <Textarea
          rows={3}
          placeholder="Physical examination findings..."
          {...register("documentation.exam")}
          className={errors.documentation?.exam ? "border-status-denied" : ""}
        />
        {errors.documentation?.exam && (
          <p className="text-xs text-status-denied mt-1">{errors.documentation.exam.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs text-text-secondary uppercase tracking-widest font-medium mb-1.5">
          Assessment & Plan <span className="text-status-denied ml-1">*</span>
        </label>
        <Textarea
          rows={3}
          placeholder="Clinical assessment and management plan..."
          {...register("documentation.assessment")}
          className={errors.documentation?.assessment ? "border-status-denied" : ""}
        />
        {errors.documentation?.assessment && (
          <p className="text-xs text-status-denied mt-1">{errors.documentation.assessment.message}</p>
        )}
      </div>
    </div>
  );
}