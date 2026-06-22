"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "./DiagnosisTagInput";
import { CPTCodeSelect } from "./CPTCodeSelect";
import { encounterSchema, type EncounterFormValues } from "@/lib/validations/encounter.schema";
import { cn } from "@/lib/utils";

interface EncounterFormProps {
  onSubmit: (values: EncounterFormValues) => void;
  isLoading: boolean;
}

type VisitType = "outpatient" | "inpatient" | "ED";

const visitTypes: { value: VisitType; label: string }[] = [
  { value: "outpatient", label: "Outpatient" },
  { value: "inpatient", label: "Inpatient" },
  { value: "ED", label: "Emergency Dept." },
];

function FormLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs text-text-secondary uppercase tracking-widest font-medium mb-1.5">
      {children}
      {required && <span className="text-status-denied ml-1">*</span>}
    </label>
  );
}

function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-status-denied mt-1">{message}</p>;
}

export function EncounterForm({ onSubmit, isLoading }: EncounterFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EncounterFormValues>({
    resolver: zodResolver(encounterSchema),
    defaultValues: {
      diagnoses: [],
      procedures: [],
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Visit Type */}
      <div>
        <FormLabel required>Visit Type</FormLabel>
        <Controller
          name="visit_type"
          control={control}
          render={({ field }) => (
            <div className="flex gap-2">
              {visitTypes.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.onChange(value)}
                  className={cn(
                    "flex-1 py-2 text-sm rounded-md border font-medium transition-colors",
                    field.value === value
                      ? "bg-primary-700 border-primary-500 text-white"
                      : "border-surface-border text-text-secondary hover:border-primary-800 hover:text-text-primary"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        />
        <FormError message={errors.visit_type?.message} />
      </div>

      {/* Chief Complaint */}
      <div>
        <FormLabel required>Chief Complaint</FormLabel>
        <Textarea
          rows={2}
          placeholder="e.g. poorly controlled diabetes and high blood pressure"
          {...register("chief_complaint")}
          className={errors.chief_complaint ? "border-status-denied" : ""}
        />
        <FormError message={errors.chief_complaint?.message} />
      </div>

      {/* Diagnoses */}
      <div>
        <FormLabel required>Diagnoses</FormLabel>
        <Controller
          name="diagnoses"
          control={control}
          render={({ field }) => (
            <TagInput
              value={field.value}
              onChange={field.onChange}
              placeholder="Type diagnosis and press Enter"
              error={errors.diagnoses?.message}
            />
          )}
        />
      </div>

      {/* Procedures */}
      <div>
        <FormLabel>Procedures</FormLabel>
        <Controller
          name="procedures"
          control={control}
          render={({ field }) => (
            <TagInput
              value={field.value}
              onChange={field.onChange}
              placeholder="Type procedure and press Enter (optional)"
              error={errors.procedures?.message}
            />
          )}
        />
      </div>

      {/* Documentation */}
      <div className="space-y-3 border border-surface-border rounded-lg p-4 bg-surface-base/50">
        <p className="text-xs text-text-muted uppercase tracking-widest font-medium">
          Documentation
        </p>
        <div>
          <FormLabel required>HPI — History of Present Illness</FormLabel>
          <Textarea
            rows={3}
            placeholder="Describe the patient's presenting history..."
            {...register("documentation.HPI")}
            className={errors.documentation?.HPI ? "border-status-denied" : ""}
          />
          <FormError message={errors.documentation?.HPI?.message} />
        </div>
        <div>
          <FormLabel required>Exam Findings</FormLabel>
          <Textarea
            rows={3}
            placeholder="Physical examination findings..."
            {...register("documentation.exam")}
            className={errors.documentation?.exam ? "border-status-denied" : ""}
          />
          <FormError message={errors.documentation?.exam?.message} />
        </div>
        <div>
          <FormLabel required>Assessment & Plan</FormLabel>
          <Textarea
            rows={3}
            placeholder="Clinical assessment and management plan..."
            {...register("documentation.assessment")}
            className={errors.documentation?.assessment ? "border-status-denied" : ""}
          />
          <FormError message={errors.documentation?.assessment?.message} />
        </div>
      </div>

      {/* CPT Code */}
      <div>
        <FormLabel required>Billed CPT Code</FormLabel>
        <Controller
          name="billed_code"
          control={control}
          render={({ field }) => (
            <CPTCodeSelect
              value={field.value}
              onChange={field.onChange}
              error={errors.billed_code?.message}
            />
          )}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Analyzing…
          </>
        ) : (
          "Analyze Encounter"
        )}
      </Button>
    </form>
  );
}