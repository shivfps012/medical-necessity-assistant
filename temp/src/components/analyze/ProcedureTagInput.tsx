"use client";

import { TagInput } from "./DiagnosisTagInput";

interface ProcedureTagInputProps {
  value: string[];
  onChange: (values: string[]) => void;
  error?: string;
}

export function ProcedureTagInput({ value, onChange, error }: ProcedureTagInputProps) {
  return (
    <TagInput
      value={value}
      onChange={onChange}
      placeholder="Type procedure and press Enter (optional)"
      error={error}
      className="procedure-tags"
    />
  );
}