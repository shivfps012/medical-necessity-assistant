"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SendHorizontal } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function QuickAsk() {
  const [question, setQuestion] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    // Pass the question via URL search params to the ask page
    router.push(`/ask?q=${encodeURIComponent(question)}`);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Quick Question</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-text-secondary mb-4">
          Need a quick clarification on AMA or HAAD coding guidelines?
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. What is required for high MDM?"
            className="flex-1"
          />
          <Button type="submit" disabled={!question.trim()}>
            <SendHorizontal className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}