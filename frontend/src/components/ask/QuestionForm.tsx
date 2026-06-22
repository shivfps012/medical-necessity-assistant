"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { askSchema, type AskFormValues } from "@/lib/validations/ask.schema";

interface QuestionFormProps {
  onSubmit: (values: AskFormValues) => void;
  isLoading: boolean;
}

export function QuestionForm({ onSubmit, isLoading }: QuestionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<AskFormValues>({
    resolver: zodResolver(askSchema),
  });

  const question = useWatch({ control, name: "question" }) || "";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {/* Optional CPT context */}
      <div>
        <label className="block text-xs text-text-muted uppercase tracking-widest font-medium mb-1.5">
          CPT Code Context
          <span className="text-text-muted ml-1 normal-case">(optional)</span>
        </label>
        <Input
          placeholder="e.g. 99214"
          className="font-mono"
          {...register("billed_code")}
        />
        {errors.billed_code && (
          <p className="text-xs text-status-denied mt-1">
            {errors.billed_code.message}
          </p>
        )}
      </div>

      {/* Question */}
      <div>
        <label className="block text-xs text-text-muted uppercase tracking-widest font-medium mb-1.5">
          Question
          <span className="text-status-denied ml-1">*</span>
        </label>
        <Textarea
          rows={4}
          placeholder="e.g. What is the score deduction for a missing LAMA form?"
          {...register("question")}
          className={errors.question ? "border-status-denied" : ""}
        />
        <div className="flex items-center justify-between mt-1">
          {errors.question ? (
            <p className="text-xs text-status-denied">{errors.question.message}</p>
          ) : (
            <span />
          )}
          <span className="text-xs text-text-muted">{question.length}/1000</span>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Searching guidelines…
          </>
        ) : (
          <>
            <SendHorizontal className="w-4 h-4 mr-2" />
            Ask
          </>
        )}
      </Button>
    </form>
  );
}
